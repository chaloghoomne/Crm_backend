import { Request, Response, NextFunction } from "express";
import { google } from "googleapis";
import Company from "../../models/Company"; // Adjust if path is different
import { Types } from "mongoose";

/**
 * GET /google/url/:companyId
 * Generates the Google OAuth2 URL for user consent.
 */
export const getUrl = async (
  req: Request<{ companyId: string; provider: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { companyId, provider } = req.params;

    console.log("=== getUrl STARTED ===");
    console.log("Received request with companyId:", companyId);
    console.log("Received provider:", provider);

    if (!companyId) {
      console.error("Missing companyId in request");
      throw new Error("Company ID is required");
    }

    if (
      !provider ||
      !["gmail", "outlook", "zoho"].includes(provider.toLowerCase())
    ) {
      console.error("Invalid provider received:", provider);
      throw new Error(
        "Invalid or missing provider (must be gmail, outlook, or zoho)"
      );
    }

    const encodedState = Buffer.from(JSON.stringify({ companyId })).toString(
      "base64"
    );
    console.log("Encoded state generated:", encodedState);

    let authUrl: string;

    switch (provider.toLowerCase()) {
      case "gmail": {
        console.log("Generating Google OAuth URL...");
        const { google } = await import("googleapis");
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
        console.log("Generated Google OAuth URL:", authUrl);
        break;
      }

      case "outlook": {
        console.log("Generating Outlook OAuth URL...");
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
            prompt: "consent",
          }).toString();
        console.log("Generated Outlook OAuth URL:", authUrl);
        break;
      }

      case "zoho": {
        console.log("Generating Zoho OAuth URL...");
        authUrl =
          `https://accounts.zoho.com/oauth/v2/auth?` +
          new URLSearchParams({
            client_id: process.env.ZOHO_CLIENT_ID!,
            response_type: "code",
            redirect_uri: process.env.ZOHO_REDIRECT_URI!,
            scope: "ZohoMail.accounts.ALL,ZohoMail.messages.CREATE",
            access_type: "offline",
            state: encodedState,
            prompt: "consent",
          }).toString();
        console.log("Generated Zoho OAuth URL:", authUrl);
        break;
      }

      default:
        console.error("Unsupported provider:", provider);
        throw new Error("Unsupported provider");
    }

    console.log(`OAuth URL generation complete for ${provider}.`);

    res.json({
      url: authUrl,
      message: `Redirect the user to this URL to authorize ${provider} email sending.`,
    });

    console.log("=== getUrl COMPLETED SUCCESSFULLY ===");
  } catch (error) {
    console.error("Error in getUrl:", error);
    next(error);
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
  console.log("=== handleGoogleCallback CALLED ===");

  try {
    const code = req.query.code as string;
    const state = req.query.state as string;

    console.log("Received query params -> code:", code, " | state:", state);

    if (!code || !state) {
      console.warn("Missing code or state");
      res.status(400).json({ message: "Missing authorization code or state" });
      return;
    }

    let decodedState: { companyId: string };
    try {
      const decoded = Buffer.from(state, "base64").toString("utf-8");
      decodedState = JSON.parse(decoded);
      console.log("Decoded state:", decodedState);
    } catch (decodeError) {
      console.warn(
        "Failed to decode base64 state, falling back to raw:",
        state
      );
      decodedState = { companyId: state };
    }

    const companyId = decodedState.companyId;

    if (!Types.ObjectId.isValid(companyId)) {
      console.error("Invalid company ID:", companyId);
      res.status(400).json({ message: "Invalid company ID" });
      return;
    }

    console.log("Initializing Google OAuth client...");
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    );

    console.log("Exchanging code for tokens...");
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("Received tokens:", tokens);

    if (!tokens.refresh_token || !tokens.access_token) {
      console.error("Tokens missing:", tokens);
      throw new Error("Failed to obtain valid tokens from Google");
    }

    oAuth2Client.setCredentials(tokens);
    console.log("OAuth client credentials set.");

    console.log("Fetching user info...");
    const oAuth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
    const userInfo = await oAuth2.userinfo.get();
    const email = userInfo.data.email;
    const userName = userInfo.data.name || "Unknown";

    console.log("Fetched user info -> email:", email, " | name:", userName);

    if (!email) {
      console.warn("No email found in user info");
      res.status(400).json({ message: "Unable to retrieve email from Google" });
      return;
    }

    console.log("Checking if email account already exists...");
    const updateResult = await Company.findOneAndUpdate(
      { _id: companyId, "emailAccounts.email": email },
      {
        $set: {
          "emailAccounts.$.name": userName,
          "emailAccounts.$.host": "smtp.gmail.com",
          "emailAccounts.$.secure": true,
          "emailAccounts.$.provider": "gmail",
          "emailAccounts.$.oauth.accessToken": tokens.access_token,
          "emailAccounts.$.oauth.refreshToken": tokens.refresh_token,
          "emailAccounts.$.oauth.expiryDate": tokens.expiry_date
            ? new Date(tokens.expiry_date)
            : null,
        },
      },
      { new: true }
    );

    if (updateResult) {
      console.log("Updated existing email account:", email);

      res.status(200).json({
        message: "OAuth2 account updated successfully",
        emailAccount: {
          email,
          accountId: updateResult.emailAccounts.find(
            (acc: any) => acc.email === email
          )?._id,
        },
      });
      return;
    }

    console.log("Adding new email account...");
    const newEmailAccount = {
      name: userName,
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

    console.log("New email account added successfully:", newEmailAccount);

    const redirectUrl = `${process.env.FRONTEND_URL}/apps/settings`;
    console.log("Redirecting user to:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (error: any) {
    console.error("Google callback error:", error);
    console.log("Error message:", error.message);

    res.status(500).json({
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