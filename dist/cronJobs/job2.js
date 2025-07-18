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
exports.scheduleTaskReminder2 = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Lead_1 = __importDefault(require("../models/Lead"));
const Employee_1 = __importDefault(require("../models/Employee"));
const Company_1 = __importDefault(require("../models/Company"));
const mailer_1 = require("../utils/mailer");
const scheduleTaskReminder2 = () => {
    node_cron_1.default.schedule('* 12 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('📆 Running daily task reminder at 8 AM');
        try {
            // 1. Get all pending tasks due tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setUTCHours(0, 0, 0, 0);
            const dayAfter = new Date(tomorrow);
            dayAfter.setDate(dayAfter.getDate() + 1);
            const tasks = yield Lead_1.default.find({
                status: 'Pending',
                followUp: {
                    $elemMatch: {
                        nextDate: {
                            $gte: tomorrow,
                            $lt: dayAfter,
                        },
                        reminder: 'on',
                    },
                },
            }).sort({ _id: -1 });
            // console.log("tasks",tasks[0].companyId)
            if (!tasks.length) {
                console.log('✅ No tasks due tomorrow');
                return;
            }
            // 2. Get email credentials
            const company = yield Company_1.default.findOne({ _id: tasks[0].companyId });
            //   console.log(company)
            const emailAccount = company === null || company === void 0 ? void 0 : company.emailAccounts[0];
            if (!emailAccount) {
                console.warn('⚠️ No email accounts found for the company');
                return;
            }
            // 3. Loop through tasks and send reminders
            for (const task of tasks) {
                const emp = yield Employee_1.default.findById(task.assignedEmpId);
                if (!emp) {
                    console.warn(`⚠️ Employee not found for ID: ${task.assignedEmpId}`);
                    continue;
                }
                yield (0, mailer_1.sendMail)({
                    from: emailAccount.email,
                    pass: emailAccount.password,
                    host: emailAccount.host,
                    secure: emailAccount.secure,
                    provider: emailAccount.provider,
                    to: emp.email,
                    subject: `⏰ Task Reminder: ${task.destination + "-" + task.name}`,
                    html: `
            <p>Hi ${emp.name},</p>
            <p>This is a reminder that the task for <strong>${task.name + "-" + task.destination}</strong> is due tomorrow.</p>
            <p>Please make sure to complete it on time.</p>
            <br />
            <p>Thanks,<br/>CRM System</p>
          `,
                });
                console.log(`📨 Reminder sent to ${emp.email}`);
            }
        }
        catch (error) {
            console.error('❌ Error sending task reminders:', error);
        }
    }));
};
exports.scheduleTaskReminder2 = scheduleTaskReminder2;
