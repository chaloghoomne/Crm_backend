import Company from "../../models/Company";

export const getAllCompanies  = async(req:any,res:any)=>{
      try{
         const companies = await Company.find();
         return res.status(200).json(companies);
      }catch(error:any){
         console.log(error);
         return res.status(500).json({ message: "Error fetching companies", error });
      }
}