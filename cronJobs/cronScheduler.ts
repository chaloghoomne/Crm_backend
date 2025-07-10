import { scheduleTaskReminder } from "./job1";
import { scheduleTaskReminder2 } from "./job2";

export const startAllCronJobs = ()=>{
    console.log("🕰️ Starting all cron jobs...");
    scheduleTaskReminder();
    scheduleTaskReminder2();
}