import email from "../../models/Email";
import nodemailer from "nodemailer";
import Employee from "../../models/Employee";
import Lead from "../../models/Lead";

export const sendmail = async(req:any,res:any)=>{
    console.log(req.body)
    try{
        const {fromEmail,pass,host,provider,to,cc,companyId,sentBy,subject,body,displayText} = req.body;
        // console.log(fromEmail,pass,host,to,cc,subject,body,displayText); 
        const emailInstance = new email({from:fromEmail,pass,host,provider,to,cc,companyId,sentBy,subject,body,displayText});
        await emailInstance.save();
        const transporter = nodemailer.createTransport({
            service: provider, // Or use other services dynamically if needed
            auth: {
              user: fromEmail,
              pass,
            },
          });
        
          await transporter.sendMail({
            from:fromEmail,
            to,
            subject,
            text: displayText,
          });
        
          return res.status(200).json({
            success: true,
            message: "Email sent successfully!",
          });
        
    }catch(error:any){
        console.log(error)
        return res.status(500).json({ message: "Error fetching company details", error });
    }
}

export const getallmails = async(req:any,res:any)=>{
  // console.log(req.body)
  try{
      const emails = await email.find();
      return res.status(200).json(emails);
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const makeNewEmp = async(req:any,res:any)=>{
  // console.log(req.body)
  try{
    const emp = await Employee.create(req.body);
    return res.status(200).json({ message: "Employee added successfully", emp });
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const getAllEmp = async(req:any,res:any)=>{
  // console.log(req.params.id)
  try{
    const emp = await Employee.find({companyId:req.params.id});
    return res.status(200).json(emp);
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const deleteEmp = async(req:any,res:any)=>{
  console.log(req.body)
  try{
    const emp = await Employee.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Employee deleted successfully", emp });
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const addLead = async(req:any,res:any)=>{
  console.log(req.body)
  try{
    const emp = await Lead.create(req.body);
    console.log(emp)
    return res.status(200).json({ message: "Lead added successfully", emp });
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const getAllLeads = async(req:any,res:any)=>{
  // console.log(req.params.id)
  try{
    const emp = await Lead.find({_id:req.params.id});
    return res.status(200).json(emp);
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const getLeads = async(req:any,res:any)=>{
  // console.log(req.params.id)
  try{
    const emp = await Lead.find();
    return res.status(200).json(emp);
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}