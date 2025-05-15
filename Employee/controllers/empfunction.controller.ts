import email from "../../models/Email";
import nodemailer from "nodemailer";
import Employee from "../../models/Employee";
import Lead from "../../models/Lead";
import Agent from "../../models/Agent";

export const sendmail = async(req:any,res:any)=>{
    // console.log(req.body)
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
  // console.log(req.body)
  try{
    const emp = await Lead.create(req.body);
    // console.log(emp)
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

export const addNewAgent = async(req:any,res:any)=>{
  try{
    // console.log(req.body);
    const agent1 = await Agent.findOne({email:req.body.email,mobile:req.body.mobile})
    if(agent1) return res.status(200).json({message:"Agent is already Present"})
    const agent = await Agent.create(req.body);
    res.status(200).json({message:"Agent Added Successfully",agent})
  }
  catch(err){
    console.log(err);
    return res.status(500).json({message:"Error Creating an Agent",err});
  }
}
export const getAgent = async(req:any,res:any)=>{
  try{
    const agent = await Agent.find({companyId:req.params.id})
    // console.log(agent)
    return res.status(200).json({message:"Agents Found",agent})
  }
  catch(err){
    console.log(err)
    return res.status(500).json({message:"No Agents Found"})
  }
}

export const setStatus = async(req:any,res:any)=>{
  try{
    const lead = await Lead.findOne({_id:req.body.id})
    lead.status = req.body.status;
    lead.save()
    return res.status(200).json({message:'Status Changed'})
    console.log("lead",lead);
  }catch(err){
    console.log(err);
    return res.status(500).json({message:'Status Not Changed',err});
  }
}

export const getLeadsPaged = async (req: any, res: any) => {
  try {
    let { companyId, selectedTab, limit = 10, page = 1 } = req.body;
    console.log(req.body);    
    page = Math.max(Number(page), 1);
    limit = Math.max(Number(limit), 1);
    const skip = (page - 1) * limit;

    const query:any = { companyId };
    if(selectedTab === 'Forwarded') query.forward = true
    else if (selectedTab !== 'all') query.status = selectedTab;
    

    const leads = await Lead.find(query).skip(skip).limit(limit);
    const count = await Lead.countDocuments(query);

    return res.status(200).json({ data: leads, totalCount: count });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Error Fetching Leads', err });
  }
};

export const saveFollowUp = async(req:any,res:any)=>{
  try{
    console.log(req.body);
    const {remarks,nextDate,status,price,reminder} = req.body
    const lead = await Lead.findOne({_id:req.body.leadID})
    console.log(lead);
    lead.followUp = [...lead.followUp,{status,remarks,nextDate,price,reminder,date:new Date()}];
    lead.status = status;
    lead.price = price;
    lead.save()
    return res.status(200).json({message:'Follow Up Saved'})
    console.log("lead",lead);
  }catch(err){
    console.log(err);
    return res.status(500).json({message:'Error Saving Follow Up',err});
  }
}
export const forwardLead = async(req:any,res:any)=>{
  try{
    console.log(req.params.id);
    const lead = await Lead.findOne({_id:req.params.id})
    if(lead.forward) return res.status(200).json({message:'Lead Already Forwarded'})
    if(lead.status === 'Complete'){
    lead.forward = true;
    lead.save();
    return res.status(200).json({message:'Lead Forwarded'})
    }
    return res.status(500).json({message:'Lead Status not Complete'})
  }catch(err){
    console.log(err);
    return res.status(500).json({message:'Error Forwarding Lead',err});
  }
}


