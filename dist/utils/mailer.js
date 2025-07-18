"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const Company_1 = __importDefault(require("../models/Company"));
const emails = Company_1.default.find({}).select("email").lean().exec();
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ from, pass, host, secure = true, provider, to, subject, html, }) {
    try {
        console.log("📧 Sending email...", from, pass, host, secure, provider, to, subject, html);
        const transporter = nodemailer_1.default.createTransport({
            host: host,
            port: secure ? 465 : 587,
            auth: {
                user: from,
                pass,
            },
        });
        const info = yield transporter.sendMail({
            from: `"Task Manager" <${from}>`,
            to,
            subject,
            html,
        });
        console.log("📨 Email sent:", info.messageId);
    }
    catch (error) {
        console.error("❌ Error sending email:", error);
    }
});
exports.sendMail = sendMail;
