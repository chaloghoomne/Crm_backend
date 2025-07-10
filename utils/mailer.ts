import nodemailer from "nodemailer";
import Company from "../models/Company";

const emails = Company.find({}).select("email").lean().exec();


export const sendMail = async ({
	from,
	pass,
	host,
    secure = true,
	provider,
	to,
	subject,
	html,
}: {
    from: string;
    pass: string;
    host: string;
    secure?: boolean;
    provider: string;
	to: string;
	subject: string;
	html: string;
}) => {
	try {
        console.log("📧 Sending email...",from,pass,host,secure,provider,to,subject,html);

        const transporter = nodemailer.createTransport({
			host: host,
			port: secure ? 465 : 587,
			auth: {
				user: from,
				pass,
			},
		});

		const info = await transporter.sendMail({
			from: `"Task Manager" <${from}>`,
			to,
			subject,
			html,
		});
		console.log("📨 Email sent:", info.messageId);
	} catch (error) {
		console.error("❌ Error sending email:", error);
	}
};
