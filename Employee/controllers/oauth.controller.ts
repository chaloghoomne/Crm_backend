import { Request, Response, NextFunction } from "express";
import { google } from "googleapis";
import Company from "../../models/Company"; // Adjust if path is different
import { Types } from "mongoose";

/**
 * GET /google/url/:companyId
 * Generates the Google OAuth2 URL for user consent.
 */
export const getUrl = async (
  req: Request<{ companyId: string , provider: string   }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { companyId ,provider} = req.params;
    console.log("getUrl called with companyId:", companyId, "provider:", provider);
// e.g., 'gmail', 'outlook', 'zoho'

    // Validate inputs
    if (!companyId) {
      throw new Error("Company ID is required");
    }
    if (
      !provider ||
      !["gmail", "outlook", "zoho"].includes(provider.toLowerCase())
    ) {
      throw new Error(
        "Invalid or missing provider (must be gmail, outlook, or zoho)"
      );
    }

    // Base64-encode state for security (universal)
    const encodedState = Buffer.from(JSON.stringify({ companyId })).toString(
      "base64"
    );

    let authUrl: string;

    switch (provider.toLowerCase()) {
      case "gmail": {
        const { google } = await import("googleapis"); // Dynamic import if needed
        const oAuth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID!,
          process.env.GOOGLE_CLIENT_SECRET!,
          process.env.GOOGLE_REDIRECT_URI!
        );

        authUrl = oAuth2Client.generateAuthUrl({
          access_type: "offline",
          scope: [
            "https://mail.google.com/",
            "https://www.googleapis.com/auth/userinfo.email",
          ],
          prompt: "consent",
          state: encodedState,
        });
        break;
      }

      case "outlook": {
        // Using Graph scopes for consistency and reliability (change to SMTP if needed: 'https://outlook.office.com/SMTP.Send offline_access User.Read')
        const scopes =
          "https://graph.microsoft.com/Mail.Send offline_access https://graph.microsoft.com/User.Read";
        authUrl =
          `https://login.microsoftonline.com/${
            process.env.OUTLOOK_TENANT_ID || "common"
          }/oauth2/v2.0/authorize?` +
          new URLSearchParams({
            client_id: process.env.OUTLOOK_CLIENT_ID!,
            response_type: "code",
            redirect_uri: process.env.OUTLOOK_REDIRECT_URI!,
            scope: scopes,
            response_mode: "query",
            state: encodedState,
            prompt: "consent", // Forces fresh consent to avoid invalid_grant
          }).toString();
        break;
      }

      case "zoho": {
        authUrl =
          `https://accounts.zoho.com/oauth/v2/auth?` + // Use regional if needed (e.g., .in)
          new URLSearchParams({
            client_id: process.env.ZOHO_CLIENT_ID!,
            response_type: "code",
            redirect_uri: process.env.ZOHO_REDIRECT_URI!,
            scope: "ZohoMail.accounts.ALL,ZohoMail.messages.CREATE", // Adjust scopes as needed
            access_type: "offline",
            state: encodedState,
            prompt: "consent",
          }).toString();
        break;
      }

      default:
        throw new Error("Unsupported provider");
    }

    res.json({
      url: authUrl,
      message: `Redirect the user to this URL to authorize ${provider} email sending.`,
    });
  } catch (error) {
    next(error); // Pass error to Express error handler
  }
};

/**
 * GET /google/callback
 * Handles Google OAuth2 callback and stores token in company.
 */
export const handleGoogleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;

    // Validation: Ensure code and state are present
    if (!code || !state) {
      res.status(400).json({ message: "Missing authorization code or state" });
      return;
    }

    // Decode state (assuming it's base64-encoded JSON from getUrl)
    let decodedState: { companyId: string };
    try {
      const decoded = Buffer.from(state, "base64").toString("utf-8");
      decodedState = JSON.parse(decoded);
    } catch (decodeError) {
      // Fallback if not encoded (for backward compatibility)
      decodedState = { companyId: state };
    }

    const companyId = decodedState.companyId;

    // Validate companyId as ObjectId
    if (!Types.ObjectId.isValid(companyId)) {
      res.status(400).json({ message: "Invalid company ID" });
      return;
    }

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    );

    // Exchange code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    if (!tokens.refresh_token || !tokens.access_token) {
      throw new Error("Failed to obtain valid tokens from Google");
    }
    oAuth2Client.setCredentials(tokens);

    // Fetch user info to get email
    const oAuth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
    const userInfo = await oAuth2.userinfo.get();
    const email = userInfo.data.email;

    // Handle missing email
    if (!email) {
      res.status(400).json({ message: "Unable to retrieve email from Google" });
      return;
    }

    // Update or add email account atomically
    const updateResult = await Company.findOneAndUpdate(
      { _id: companyId, "emailAccounts.email": email }, // Find company and matching email account
      {
        $set: {
          "emailAccounts.$.name": userInfo.data.name || "Unknown",
          "emailAccounts.$.host": "smtp.gmail.com", // Correct SMTP host
          "emailAccounts.$.secure": true,
          "emailAccounts.$.provider": "gmail",
          "emailAccounts.$.oauth.accessToken": tokens.access_token,
          "emailAccounts.$.oauth.refreshToken": tokens.refresh_token,
          "emailAccounts.$.oauth.expiryDate": tokens.expiry_date
            ? new Date(tokens.expiry_date)
            : null,
        },
      },
      { new: true } // Return updated document
    );

    if (updateResult) {
      // Existing account was updated
      res.status(200).json({
        message: "OAuth2 account updated successfully",
        emailAccount: {
          email,
          accountId: updateResult.emailAccounts.find(
            (acc: any ) => acc.email === email
          )?._id,
        },
      });
      return;
    }

    // If no existing account, add a new one
    const newEmailAccount = {
      name: userInfo.data.name || "Unknown",
      email,
      host: "smtp.gmail.com",
      secure: true,
      provider: "gmail",
      oauth: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
    };

    await Company.findByIdAndUpdate(
      companyId,
      { $push: { emailAccounts: newEmailAccount } },
      { new: true }
    );

    res.redirect(`${process.env.FRONTEND_URL}/apps/settings/email`);
  } catch (error: any) {
    console.error("Google callback error:", error); // Log for debugging
    res
      .status(500)
      .json({
        message: "Failed to handle Google callback",
        error: error.message,
      });
    next(error);
  }
};

// Endpoint to handle Outlook OAuth2 callback
// Example route: GET /auth/outlook/callback
export const handleOutlookCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;
    const error = req.query.error as string; // Handle denial of consent

    // Validation: Ensure code and state are present, handle errors
    if (error) {
      throw new Error(
        `Authorization denied: ${error} - ${
          req.query.error_description || "Unknown reason"
        }`
      );
    }
    if (!code || !state) {
      res.status(400).json({ message: "Missing authorization code or state" });
      return;
    }

    // Decode state (strict Base64 decoding; no fallback for security)
    let decodedState: { companyId: string };
    try {
      const decoded = Buffer.from(state, "base64").toString("utf-8");
      decodedState = JSON.parse(decoded);
    } catch (decodeError) {
      throw new Error("Invalid state parameter");
    }

    const companyId = decodedState.companyId;

    // Validate companyId as ObjectId
    if (!Types.ObjectId.isValid(companyId)) {
      res.status(400).json({ message: "Invalid company ID" });
      return;
    }

    // Exchange code for tokens (include scopes for consistency)
    const tokenUrl = `https://login.microsoftonline.com/${
      process.env.OUTLOOK_TENANT_ID || "common"
    }/oauth2/v2.0/token`;
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.OUTLOOK_CLIENT_ID!,
        client_secret: process.env.OUTLOOK_CLIENT_SECRET!,
        code,
        redirect_uri: process.env.OUTLOOK_REDIRECT_URI!,
        grant_type: "authorization_code",
        scope:
          "https://graph.microsoft.com/Mail.Send offline_access https://graph.microsoft.com/User.Read", // Match getUrl scopes (adjust for SMTP if needed)
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Failed to exchange code for tokens: ${errorText}`);
    }

    const tokens = await tokenResponse.json();
    console.log("Received tokens:", tokens); // Debug log (remove in production)

    // Fetch user info (including email) using Microsoft Graph API
    const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!graphResponse.ok) {
      const graphError = await graphResponse.text();
      throw new Error(
        `Failed to fetch user info from Graph API: ${graphError}`
      );
    }

    const userInfo = await graphResponse.json();
    const email = userInfo.mail || userInfo.userPrincipalName;

    // Handle missing email
    if (!email) {
      res
        .status(400)
        .json({ message: "Unable to retrieve email from Microsoft Graph" });
      return;
    }

    // Update or add email account atomically
    const updateResult = await Company.findOneAndUpdate(
      { _id: companyId, "emailAccounts.email": email },
      {
        $set: {
          "emailAccounts.$.name": userInfo.displayName || "Outlook Account",
          "emailAccounts.$.host": "smtp.office365.com", // Or use Graph exclusively
          "emailAccounts.$.secure": false,
          "emailAccounts.$.provider": "outlook",
          "emailAccounts.$.oauth.accessToken": tokens.access_token,
          "emailAccounts.$.oauth.refreshToken": tokens.refresh_token,
          "emailAccounts.$.oauth.expiryDate": tokens.expires_in
            ? new Date(Date.now() + tokens.expires_in * 1000)
            : null,
        },
      },
      { new: true }
    );

    if (updateResult) {
      // Existing account updated
      const updatedAccount = updateResult.emailAccounts.find(
        (acc: any) => acc.email === email
      );
      res.status(200).json({
        message: "Outlook OAuth2 account updated successfully",
        emailAccount: {
          email,
          accountId: updatedAccount?._id,
        },
        tokenResponse: tokens, // Include token response for frontend (optional; remove if sensitive)
      });
      return;
    }

    // If no existing account, add a new one
    const newEmailAccount = {
      name: userInfo.displayName || "Outlook Account",
      email,
      host: "smtp.office365.com",
      secure: false,
      provider: "outlook",
      oauth: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expires_in
          ? new Date(Date.now() + tokens.expires_in * 1000)
          : null,
      },
    };

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $push: { emailAccounts: newEmailAccount } },
      { new: true }
    );

    const newAccount =
      updatedCompany?.emailAccounts[updatedCompany.emailAccounts.length - 1];

    res.status(200).json({
      message: "Outlook OAuth2 account added successfully",
      emailAccount: { email, accountId: newAccount?._id },
      tokenResponse: tokens, // Optional
    });
  } catch (error: any) {
    console.error("Outlook callback error:", error);
    res.status(500).json({
      message: "Failed to handle Outlook callback",
      error: error.message,
    });
    next(error);
  }
};