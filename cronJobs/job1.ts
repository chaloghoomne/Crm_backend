import cron from 'node-cron';
import Task from '../models/Task';
import Employee from '../models/Employee';
import Company from '../models/Company';
import { sendMail } from '../utils/mailer';

export const scheduleTaskReminder = () => {
  cron.schedule('* 9 * * *', async () => {
    console.log('📆 Running daily task reminder at 9 AM');

    try {
      // 1. Get all pending tasks due tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);

      const tasks = await Task.find({
        status: 'pending',
        dueDate: { $gte: tomorrow, $lt: dayAfter },
      });

      if (!tasks.length) {
        console.log('✅ No tasks due tomorrow');
        return;
      }

      // 2. Get email credentials
      const company = await Company.findOne({companyId:tasks[0].companyId})
      const emailAccount = company?.emailAccounts[0];

      if (!emailAccount) {
        console.warn('⚠️ No email accounts found for the company');
        return;
      }

      // 3. Loop through tasks and send reminders
      for (const task of tasks) {
        const emp = await Employee.findById(task.assignedTo);
        if (!emp) {
          console.warn(`⚠️ Employee not found for ID: ${task.assignedTo}`);
          continue;
        }

        await sendMail({
          from: emailAccount.email,
          pass: emailAccount.password,
          host: emailAccount.host,
          secure: emailAccount.secure,
          provider: emailAccount.provider,
          to: emp.email,
          subject: `⏰ Task Reminder: ${task.taskName}`,
          html: `
            <p>Hi ${emp.name},</p>
            <p>This is a reminder that the task <strong>${task.taskName}</strong> is due tomorrow.</p>
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
