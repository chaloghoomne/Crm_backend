"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAllCronJobs = void 0;
const job1_1 = require("./job1");
const job2_1 = require("./job2");
const startAllCronJobs = () => {
    console.log("🕰️ Starting all cron jobs...");
    (0, job1_1.scheduleTaskReminder)();
    (0, job2_1.scheduleTaskReminder2)();
};
exports.startAllCronJobs = startAllCronJobs;
