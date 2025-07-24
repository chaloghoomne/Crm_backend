import email from "../../models/Email";
import Employee from "../../models/Employee";
import Lead from "../../models/Lead";
import Agent from "../../models/Agent";
import { sendMail } from "../../utils/mailer";
import Company from "../../models/Company";
import { google } from "googleapis";
import nodemailer, { TransportOptions } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import axios from "axios";
import { SMTPClient } from "smtp-client";
// assuming this is your email log model

export const sendmail = async (req: any, res: any) => {
  try {
    const { fromEmail, to, cc, companyId, sentBy, subject, body, displayText } =
      req.body;

    // console.log("Request body:", req.body);

    const company = (await Company.findById(companyId)
      .select("emailAccounts")
      .lean()) as any;
    if (!company) throw new Error("Company not found");

    // console.log("Company Email Accounts:", company.emailAccounts);

    const emailAccount = company?.emailAccounts.find(
      (account: any) => account._id.toString() === fromEmail
    );
    if (!emailAccount) throw new Error("Email account not found");

    const { email: from, host, secure, provider, oauth } = emailAccount;
    console.log("Email Account:", emailAccount);

    // Save email log before sending
    const emailInstance = new email({
      from,
      to,
      cc,
      companyId,
      sentBy,
      subject,
      body,
      displayText,
    });
    await emailInstance.save();

    let result;
    let updatedOauth = { ...oauth }; // For token updates if refreshed

    if (provider === "gmail" && oauth?.refreshToken) {
      console.log("Setting up Gmail API...");

      const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID!,
        process.env.GOOGLE_CLIENT_SECRET!,
        process.env.GOOGLE_REDIRECT_URI!
      );

      oAuth2Client.setCredentials({
        refresh_token: oauth.refreshToken,
      });
      console.log("OAuth2 client set up with refresh token",oAuth2Client);

      try {
        const accessToken = await oAuth2Client.getAccessToken();

        const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
        const rawMessage = Buffer.from(
          `From: ${from}\r\nTo: ${
            Array.isArray(to) ? to.join(", ") : to
          }\r\nCC: ${
            cc ? (Array.isArray(cc) ? cc.join(", ") : cc) : ""
          }\r\nSubject: ${subject}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${body}`
        )
          .toString("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_");

        result = await gmail.users.messages.send({
          userId: "me",
          requestBody: { raw: rawMessage },
        });
        console.log("Gmail API send successful:", result.data);

        // Mock result for consistency
        result = { messageId: result.data.id || "Gmail API success" };
      } catch (tokenError) {
        console.error("Error with Gmail API:", tokenError);
        throw new Error("Gmail API authentication failed");
      }
    } else if (provider === "outlook" && oauth?.refreshToken) {
      console.log("Setting up Outlook Graph API...");

      if (!oauth?.refreshToken)
        throw new Error("Refresh token required for Outlook");

      // Refresh if expired
      if (new Date() >= new Date(oauth.expiryDate)) {
        console.log("Refreshing Outlook token...");
        const refreshUrl = `https://login.microsoftonline.com/${
          process.env.OUTLOOK_TENANT_ID || "common"
        }/oauth2/v2.0/token`;
        const refreshData = {
          client_id: process.env.OUTLOOK_CLIENT_ID ?? "",
          client_secret: process.env.OUTLOOK_CLIENT_SECRET ?? "",
          refresh_token: oauth.refreshToken,
          grant_type: "refresh_token",
          scope:
            "https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read offline_access",
        };
        console.log("Refresh Data:", refreshData);

        if (!refreshData.client_id || !refreshData.client_secret) {
          throw new Error(
            "Missing required environment variables: OUTLOOK_CLIENT_ID or OUTLOOK_CLIENT_SECRET"
          );
        }

        const refreshResponse = await axios.post(
          refreshUrl,
          new URLSearchParams(refreshData).toString(),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );

        const newTokens = refreshResponse.data;
        updatedOauth.accessToken = newTokens.access_token;
        updatedOauth.refreshToken =
          newTokens.refresh_token || oauth.refreshToken;
        updatedOauth.expiryDate = new Date(
          Date.now() + newTokens.expires_in * 1000
        );
        console.log("Tokens refreshed successfully");
      }

      // Send via Graph
      const sendUrl = "https://graph.microsoft.com/v1.0/me/sendMail";
      const emailData = {
        message: {
          subject,
          body: { contentType: "HTML", content: body },
          toRecipients: Array.isArray(to)
            ? to.map((email) => ({ emailAddress: { address: email } }))
            : [{ emailAddress: { address: to } }],
          ccRecipients: cc
            ? Array.isArray(cc)
              ? cc.map((email) => ({ emailAddress: { address: email } }))
              : [{ emailAddress: { address: cc } }]
            : [],
        },
        saveToSentItems: true,
      };
      console.log("Email Data for Outlook:", emailData);

      const sendResponse = await axios.post(sendUrl, emailData, {
        headers: {
          Authorization: `Bearer ${updatedOauth.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Outlook Graph API response:", sendResponse.data);

      result = { messageId: "Graph API success" }; // Mock; Graph doesn't return messageId directly
      console.log("Outlook Graph API send successful");

      // Update tokens in DB if refreshed
      await updateTokensInDB(companyId, fromEmail, updatedOauth);
    } else if (provider === "smtp" || !oauth?.refreshToken) {
      console.log("Using SMTP authentication...");

      // Pure SMTP fallback using smtp-client (install smtp-client if needed)
      const client = new SMTPClient({
        host: host || "smtp.gmail.com",
        port: secure ? 465 : 587,
        // secure: secure || false,
      });
      await client.connect();
      await client.greet({ hostname: host });
      await client.authPlain({
        username: from,
        password: emailAccount.password || process.env.EMAIL_PASSWORD || "",
      });
      await client.mail({ from });
      await client.rcpt({ to: Array.isArray(to) ? to.join(", ") : to });
      if (cc) await client.rcpt({ to: Array.isArray(cc) ? cc.join(", ") : cc });
      const message = `Subject: ${subject}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${body}`;
      await client.data(message);
      await client.quit();

      result = { messageId: "SMTP success" }; // Mock messageId
      console.log("SMTP send successful");
    } else {
      throw new Error(`Unsupported email provider: ${provider}`);
    }

    console.log("Sending email with options:", {
      from,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
    });

    // Update email log with success status
    await email.findByIdAndUpdate(emailInstance._id, {
      status: "sent",
      messageId: result?.messageId || "N/A",
      sentAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully!",
      messageId: result?.messageId,
    });
  } catch (error: any) {
    console.error("Send mail error:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending email",
      error: error.message,
    });
  }
};

// Placeholder for updateTokensInDB (implement as needed)
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
  console.log("Tokens updated in DB for account:", accountId);
}






export const editEmp = async(req:any,res:any)=>{
  try{
    const {data} = req.body;
    const emp = await Employee.findOneAndUpdate({ _id: data.id }, data);
    return res.status(200).json({ message: "Employee details updated successfully", emp });
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const editEmpRole = async(req:any,res:any)=>{
  try{
    const {data} = req.body;
    const emp = await Employee.findOne({ _id: data.id });
    if(data.type == "role"){
      emp.role = data.role
    }
    else if(data.type == "password"){
      emp.password = data.password
    }      
      
    else{
      emp.name = data.name;
      emp.email = data.email;
      emp.password = data.password
    }
    await emp.save();
    return res.status(200).json({ message: "Employee details updated successfully", emp });
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const getallmails = async(req:any,res:any)=>{
  // console.log(req.body)
  try{
      const emails = await email.find();
      return res.status(200).json(emails);
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const makeNewEmp = async(req:any,res:any)=>{
	// console.log(req.body)
	try {
		const { companyId } = req.body;
		if (!companyId)
			return res.status(400).json({ message: "Company ID is required" });
		const existingEmp = await Employee.findOne({
			email: req.body.email,
			companyId,
		});
		if (existingEmp)
			return res.status(400).json({
				message:
					"Employee with this email already exists in this company",
			});
		const company = await Company.findById(companyId);
		const companyEmails = company.emailAccounts[0];
		// console.log(companyEmails);
		const emp = await Employee.create(req.body);
		sendMail({
			from: companyEmails.email,
			pass: companyEmails.password,
			host: companyEmails.host,
      secure: companyEmails.secure,
			provider: companyEmails.provider,
			to: req.body.email,
			subject: "Welcome to Chalo CRM",
			html: `<h1>Welcome ${req.body.name}</h1><p>Your account has been created successfully.</p>`,
		});
		return res
			.status(200)
			.json({ message: "Employee added successfully", emp });
	} catch (error: any) {
		console.log(error);
		return res
			.status(500)
			.json({ message: "Error fetching all company Emails", error });
	}
}

export const getAllEmp = async(req:any,res:any)=>{
  // console.log(req.params.id)
  try{
    const emp = await Employee.find({companyId:req.params.id});
    return res.status(200).json(emp);
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const deleteEmp = async(req:any,res:any)=>{
  console.log(req.body)
  try{
    const emp = await Employee.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Employee deleted successfully", emp });
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const addLead = async(req:any,res:any)=>{
  // console.log(req.body)
  try{
    const emp = await Lead.create(req.body);
    // console.log(emp)
    return res.status(200).json({ message: "Lead added successfully", emp });
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const getAllLeads = async(req:any,res:any)=>{
  // console.log(req.params.id)
  try{
    const emp = await Lead.find({_id:req.params.id});
    return res.status(200).json(emp);
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const getLeads = async(req:any,res:any)=>{
  // console.log(req.params.id)
  try{
    const emp = await Lead.find();
    return res.status(200).json(emp);
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const addNewAgent = async(req:any,res:any)=>{
  try{
    // console.log(req.body);
    const agent1 = await Agent.findOne({email:req.body.email,mobile:req.body.mobile})
    if(agent1) return res.status(200).json({message:"Agent is already Present"})
    const agent = await Agent.create(req.body);
    res.status(200).json({message:"Agent Added Successfully",agent})
  }
  catch(err){
    console.log(err);
    return res.status(500).json({message:"Error Creating an Agent",err});
  }
}
export const getAgent = async(req:any,res:any)=>{
  try{
    const agent = await Agent.find({companyId:req.params.id})
    // console.log(agent)
    return res.status(200).json({message:"Agents Found",agent})
  }
  catch(err){
    console.log(err)
    return res.status(500).json({message:"No Agents Found"})
  }
}

export const setStatus = async(req:any,res:any)=>{
  try{
    const lead = await Lead.findOne({_id:req.body.id})
    lead.status = req.body.status;
    lead.save()
    return res.status(200).json({message:'Status Changed'})
    console.log("lead",lead);
  }catch(err){
    console.log(err);
    return res.status(500).json({message:'Status Not Changed',err});
  }
}

export const getLeadsPaged = async (req: any, res: any) => {
  try {
    let { companyId, selectedTab, limit = 10, page = 1 } = req.body;
    console.log(req.body);    
    page = Math.max(Number(page), 1);
    limit = Math.max(Number(limit), 1);
    const skip = (page - 1) * limit;

    const query:any = { companyId };
    if(selectedTab === 'Forwarded') query.forward = true
    else if (selectedTab !== 'all') query.status = selectedTab;
    

    const leads = await Lead.find(query).skip(skip).limit(limit);
    const count = await Lead.countDocuments(query);

    return res.status(200).json({ data: leads, totalCount: count });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Error Fetching Leads', err });
  }
};

export const saveFollowUp = async(req:any,res:any)=>{
  try{
    console.log(req.body);
    const {remarks,nextDate,status,price,reminder} = req.body
    const lead = await Lead.findOne({_id:req.body.leadID})
    console.log(lead);
    lead.followUp = [...lead.followUp,{status,remarks,nextDate,price,reminder,date:new Date()}];
    lead.status = status;
    lead.price = price;
    lead.save()
    return res.status(200).json({message:'Follow Up Saved'})
    console.log("lead",lead);
  }catch(err){
    console.log(err);
    return res.status(500).json({message:'Error Saving Follow Up',err});
  }
}
export const forwardLead = async(req:any,res:any)=>{
  try{
    console.log(req.params.id);
    const lead = await Lead.findOne({_id:req.params.id})
    if(lead.forward) return res.status(200).json({message:'Lead Already Forwarded'})
    if(lead.status === 'Complete'){
    lead.forward = true;
    lead.save();
    return res.status(200).json({message:'Lead Forwarded'})
    }
    return res.status(500).json({message:'Lead Status not Complete'})
  }catch(err){
    console.log(err);
    return res.status(500).json({message:'Error Forwarding Lead',err});
  }
}


