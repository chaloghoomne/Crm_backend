import nodemailer from "nodemailer";
import Company from "../models/Company";
import { google } from "googleapis";
import Email from "../models/Email";
import axios from "axios";
import { Request, Response } from "express";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  companyId: string;
}

export const sendMail = async (options: MailOptions): Promise<void> => {
  const {  to, subject, html, companyId } = options;

  try {
	console.log("options",options)

    const company = await Company.findById({_id:companyId})
      .select("emailAccounts")
      .lean() as any;
		console.log(company)
    if (!company || !company.emailAccounts?.[0]) {
      throw new Error("No email account configured for this company");
    }

    const emailAccount = company.emailAccounts[0];
    const {email, provider, oauth } = emailAccount;

    if (provider === "gmail" && oauth?.refreshToken) {
      await sendViaGmail(email, to, subject, html, oauth);
    } else if (provider === "outlook" && oauth?.refreshToken) {
      await sendViaOutlook(
        to,
        subject,
        html,
        companyId,
        emailAccount._id,
        oauth
      );
    } else {
      throw new Error(`Unsupported or misconfigured provider: ${provider}`);
    }
  } catch (error: any) {
    console.error("SendMail error:", error.message);
  }
};

// --- Gmail sending logic ---
async function sendViaGmail(
  email: string,
  to: string | string[],
  subject: string,
  html: string,
  oauth: any
) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  oAuth2Client.setCredentials({ refresh_token: oauth.refreshToken });

  const accessToken = await oAuth2Client.getAccessToken();
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const rawMessage = Buffer.from(
    `From: ${email}\r\nTo: ${
      Array.isArray(to) ? to.join(", ") : to
    }\r\nSubject: ${subject}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${html}`
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: rawMessage },
  });
}

// --- Outlook sending logic ---
async function sendViaOutlook(
  to: string | string[],
  subject: string,
  html: string,
  companyId: string,
  emailAccountId: string,
  oauth: any
) {
  let accessToken = oauth.accessToken;

  if (new Date() >= new Date(oauth.expiryDate)) {
    const refreshUrl = `https://login.microsoftonline.com/${
      process.env.OUTLOOK_TENANT_ID || "common"
    }/oauth2/v2.0/token`;

    const refreshData = {
      client_id: process.env.OUTLOOK_CLIENT_ID!,
      client_secret: process.env.OUTLOOK_CLIENT_SECRET!,
      refresh_token: oauth.refreshToken,
      grant_type: "refresh_token",
      scope:
        "https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read offline_access",
    };

    const response = await axios.post(
      refreshUrl,
      new URLSearchParams(refreshData).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const tokens = response.data;
    accessToken = tokens.access_token;

    await updateTokensInDB(companyId, emailAccountId, {
      accessToken,
      refreshToken: tokens.refresh_token || oauth.refreshToken,
      expiryDate: new Date(Date.now() + tokens.expires_in * 1000),
    });
  }

  const emailData = {
    message: {
      subject,
      body: {
        contentType: "HTML",
        content: html,
      },
      toRecipients: (Array.isArray(to) ? to : [to]).map((address) => ({
        emailAddress: { address },
      })),
    },
    saveToSentItems: true,
  };

  await axios.post("https://graph.microsoft.com/v1.0/me/sendMail", emailData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
}

async function updateTokensInDB(
  companyId: string,
  accountId: string,
  updatedOauth: any
) {
  await Company.updateOne(
    { _id: companyId, "emailAccounts._id": accountId },
    {
      $set: {
        "emailAccounts.$.oauth.accessToken": updatedOauth.accessToken,
        "emailAccounts.$.oauth.refreshToken": updatedOauth.refreshToken,
        "emailAccounts.$.oauth.expiryDate": updatedOauth.expiryDate,
      },
    }
  );
  console.log("Updated tokens for:", accountId);
}

