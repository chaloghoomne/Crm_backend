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
exports.getAllTasks = exports.createTask = void 0;
const Company_1 = __importDefault(require("../../models/Company"));
const Employee_1 = __importDefault(require("../../models/Employee"));
const Task_1 = __importDefault(require("../../models/Task"));
const mailer_1 = require("../../utils/mailer");
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyId } = req.body;
        if (!companyId)
            return res.status(400).json({ message: "Company ID is required" });
        console.log(req.body);
        const task = yield Task_1.default.create(req.body);
        const company = yield Company_1.default.findById(companyId);
        const companyEmails = company.emailAccounts[0];
        const emp = yield Employee_1.default.findById(req.body.assignedTo);
        // console.log(companyEmails);
        (0, mailer_1.sendMail)({
            from: companyEmails.email,
            pass: companyEmails.password,
            host: companyEmails.host,
            secure: companyEmails.secure,
            provider: companyEmails.provider,
            to: emp.email,
            subject: "Welcome to Chalo CRM",
            html: `<h1>Hi ${emp.name}</h1><p>You have been assigned a New Task </p>
            <p>please check your task list for details.</p>
            <p>Task Name: ${req.body.taskName}</p>`,
        });
        return res.status(200).json({ message: "Task added successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error Adding Task", error });
    }
});
exports.createTask = createTask;
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.default.find({ companyId: req.params.id });
        console.log(tasks);
        return res.status(200).json({ tasks });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error Fetching Tasks", error });
    }
});
exports.getAllTasks = getAllTasks;
