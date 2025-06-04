// import express from "express";
import Employee from "../../models/Employee";
import  jwt  from "jsonwebtoken";
// const router = express.Router();

export const Login = async(req:any,res:any)=>{
    try{
        // console.log(req.body)
        const {email,password} = req.body;
        const Emp = await Employee.findOne({email,password});
    //    console.log(Emp.companyId,Emp.role) 
        if(Emp){
        const token = jwt.sign({id:Emp._id,role: Emp.role,company_id:Emp.companyId},process.env.VITE_JWT_SECRET!);
        if(email && password){
            return res.status(200).json({
                message: "Login successful",
                data: {
                    token: token,
                }
              });
              
        }}else{
            return res.status(401).json({ message: "Unauthorized" });
        }}
    catch(error:any){
        console.log(error)
        return res.status(500).json({ message: "Error fetching company details", error });
    }
    
}