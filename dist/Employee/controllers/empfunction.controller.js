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
exports.forwardLead = exports.saveFollowUp = exports.getLeadsPaged = exports.setStatus = exports.getAgent = exports.addNewAgent = exports.getLeads = exports.getAllLeads = exports.addLead = exports.deleteEmp = exports.getAllEmp = exports.makeNewEmp = exports.getallmails = exports.editEmpRole = exports.editEmp = exports.sendmail = void 0;
const Email_1 = __importDefault(require("../../models/Email"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const Employee_1 = __importDefault(require("../../models/Employee"));
const Lead_1 = __importDefault(require("../../models/Lead"));
const Agent_1 = __importDefault(require("../../models/Agent"));
const mailer_1 = require("../../utils/mailer");
const Company_1 = __importDefault(require("../../models/Company"));
const sendmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const { fromEmail, pass, host, secure, provider, to, cc, companyId, sentBy, subject, body, displayText } = req.body;
        // console.log(fromEmail,pass,host,to,cc,subject,body,displayText); 
        const emailInstance = new Email_1.default({ from: fromEmail, pass, host, provider, to, cc, companyId, sentBy, subject, body, displayText });
        yield emailInstance.save();
        const transporter = nodemailer_1.default.createTransport({
            host: host,
            port: secure ? 465 : 587,
            auth: {
                user: fromEmail,
                pass,
            },
        });
        yield transporter.sendMail({
            from: fromEmail,
            to,
            subject,
            text: displayText,
        });
        return res.status(200).json({
            success: true,
            message: "Email sent successfully!",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching company details", error });
    }
});
exports.sendmail = sendmail;
const editEmp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const emp = yield Employee_1.default.findOneAndUpdate({ _id: data.id }, data);
        return res.status(200).json({ message: "Employee details updated successfully", emp });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching all company Emails", error });
    }
});
exports.editEmp = editEmp;
const editEmpRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const emp = yield Employee_1.default.findOne({ _id: data.id });
        if (data.type == "role") {
            emp.role = data.role;
        }
        else if (data.type == "password") {
            emp.password = data.password;
        }
        else {
            emp.name = data.name;
            emp.email = data.email;
            emp.password = data.password;
        }
        yield emp.save();
        return res.status(200).json({ message: "Employee details updated successfully", emp });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching all company Emails", error });
    }
});
exports.editEmpRole = editEmpRole;
const getallmails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body)
    try {
        const emails = yield Email_1.default.find();
        return res.status(200).json(emails);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching all company Emails", error });
    }
});
exports.getallmails = getallmails;
const makeNewEmp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body)
    try {
        const { companyId } = req.body;
        if (!companyId)
            return res.status(400).json({ message: "Company ID is required" });
        const existingEmp = yield Employee_1.default.findOne({
            email: req.body.email,
            companyId,
        });
        if (existingEmp)
            return res.status(400).json({
                message: "Employee with this email already exists in this company",
            });
        const company = yield Company_1.default.findById(companyId);
        const companyEmails = company.emailAccounts[0];
        // console.log(companyEmails);
        const emp = yield Employee_1.default.create(req.body);
        (0, mailer_1.sendMail)({
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
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Error fetching all company Emails", error });
    }
});
exports.makeNewEmp = makeNewEmp;
const getAllEmp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.params.id)
    try {
        const emp = yield Employee_1.default.find({ companyId: req.params.id });
        return res.status(200).json(emp);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching all company Emails", error });
    }
});
exports.getAllEmp = getAllEmp;
const deleteEmp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const emp = yield Employee_1.default.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Employee deleted successfully", emp });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching all company Emails", error });
    }
});
exports.deleteEmp = deleteEmp;
const addLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body)
    try {
        const emp = yield Lead_1.default.create(req.body);
        // console.log(emp)
        return res.status(200).json({ message: "Lead added successfully", emp });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching all company Emails", error });
    }
});
exports.addLead = addLead;
const getAllLeads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.params.id)
    try {
        const emp = yield Lead_1.default.find({ _id: req.params.id });
        return res.status(200).json(emp);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching all company Emails", error });
    }
});
exports.getAllLeads = getAllLeads;
const getLeads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.params.id)
    try {
        const emp = yield Lead_1.default.find();
        return res.status(200).json(emp);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching all company Emails", error });
    }
});
exports.getLeads = getLeads;
const addNewAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body);
        const agent1 = yield Agent_1.default.findOne({ email: req.body.email, mobile: req.body.mobile });
        if (agent1)
            return res.status(200).json({ message: "Agent is already Present" });
        const agent = yield Agent_1.default.create(req.body);
        res.status(200).json({ message: "Agent Added Successfully", agent });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error Creating an Agent", err });
    }
});
exports.addNewAgent = addNewAgent;
const getAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agent = yield Agent_1.default.find({ companyId: req.params.id });
        // console.log(agent)
        return res.status(200).json({ message: "Agents Found", agent });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "No Agents Found" });
    }
});
exports.getAgent = getAgent;
const setStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lead = yield Lead_1.default.findOne({ _id: req.body.id });
        lead.status = req.body.status;
        lead.save();
        return res.status(200).json({ message: 'Status Changed' });
        console.log("lead", lead);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Status Not Changed', err });
    }
});
exports.setStatus = setStatus;
const getLeadsPaged = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { companyId, selectedTab, limit = 10, page = 1 } = req.body;
        console.log(req.body);
        page = Math.max(Number(page), 1);
        limit = Math.max(Number(limit), 1);
        const skip = (page - 1) * limit;
        const query = { companyId };
        if (selectedTab === 'Forwarded')
            query.forward = true;
        else if (selectedTab !== 'all')
            query.status = selectedTab;
        const leads = yield Lead_1.default.find(query).skip(skip).limit(limit);
        const count = yield Lead_1.default.countDocuments(query);
        return res.status(200).json({ data: leads, totalCount: count });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error Fetching Leads', err });
    }
});
exports.getLeadsPaged = getLeadsPaged;
const saveFollowUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { remarks, nextDate, status, price, reminder } = req.body;
        const lead = yield Lead_1.default.findOne({ _id: req.body.leadID });
        console.log(lead);
        lead.followUp = [...lead.followUp, { status, remarks, nextDate, price, reminder, date: new Date() }];
        lead.status = status;
        lead.price = price;
        lead.save();
        return res.status(200).json({ message: 'Follow Up Saved' });
        console.log("lead", lead);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error Saving Follow Up', err });
    }
});
exports.saveFollowUp = saveFollowUp;
const forwardLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id);
        const lead = yield Lead_1.default.findOne({ _id: req.params.id });
        if (lead.forward)
            return res.status(200).json({ message: 'Lead Already Forwarded' });
        if (lead.status === 'Complete') {
            lead.forward = true;
            lead.save();
            return res.status(200).json({ message: 'Lead Forwarded' });
        }
        return res.status(500).json({ message: 'Lead Status not Complete' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error Forwarding Lead', err });
    }
});
exports.forwardLead = forwardLead;
