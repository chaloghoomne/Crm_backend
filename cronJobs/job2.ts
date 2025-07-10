import cron from 'node-cron';
import Lead from '../models/Lead';
import Employee from '../models/Employee';
import Company from '../models/Company';
import { sendMail } from '../utils/mailer';

export const scheduleTaskReminder2 = () => {
  cron.schedule('* 12 * * *', async () => {
    console.log('📆 Running daily task reminder at 8 AM');

    try {
      // 1. Get all pending tasks due tomorrow
      const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setUTCHours(0, 0, 0, 0);

const dayAfter = new Date(tomorrow);
dayAfter.setDate(dayAfter.getDate() + 1);

const tasks = await Lead.find({
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
      const company = await Company.findOne({_id:tasks[0].companyId})
    //   console.log(company)
      const emailAccount = company?.emailAccounts[0];

      if (!emailAccount) {
        console.warn('⚠️ No email accounts found for the company');
        return;
      }

      // 3. Loop through tasks and send reminders
      for (const task of tasks) {
        const emp = await Employee.findById(task.assignedEmpId);
        if (!emp) {
          console.warn(`⚠️ Employee not found for ID: ${task.assignedEmpId}`);
          continue;
        }

        await sendMail({
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
    } catch (error) {
      console.error('❌ Error sending task reminders:', error);
    }
  });
};
