import Company from "../../models/Company";
import Employee from "../../models/Employee";
import Task from "../../models/Task";
import { sendMail } from "../../utils/mailer";

export const createTask = async(req:any,res:any) =>{
    try{
        const { companyId } = req.body;
		if (!companyId)
			return res.status(400).json({ message: "Company ID is required" });
        console.log(req.body);
        const task = await Task.create(req.body);const company = await Company.findById(companyId);
		const companyEmails = company.emailAccounts[0];
        const emp = await Employee.findById(req.body.assignedTo);
		// console.log(companyEmails);
		sendMail({
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
        return res.status(200).json({ message: "Task added successfully"});
    }catch(error:any){
        console.log(error)
        return res.status(500).json({ message: "Error Adding Task", error });
    }
}

export const getAllTasks = async(req:any,res:any)=>{
    try{
        const tasks = await Task.find({companyId: req.params.id});
        console.log(tasks);
        return res.status(200).json({ tasks });
    }catch(error:any){
        console.log(error);
        return res.status(500).json({ message: "Error Fetching Tasks", error });
    }
}