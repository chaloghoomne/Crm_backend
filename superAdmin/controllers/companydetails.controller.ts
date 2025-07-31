
import Company from "../../models/Company";
import Employee from "../../models/Employee";
import bcrypt from "bcrypt";
// import Employee from "../../models/Employee";

export const addNewCompany = async (req: any, res: any) => {
    try{
        console.log(req.body)
        if (await Company.findOne({ adminEmail: req.body.adminEmail })) {
          return res
            .status(200)
            .json({ message: "Company is already Present" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const company = await Company.create({
          ...req.body,
          password: hashedPassword,
        });

        const employee = await Employee.create({
          email: req.body.adminEmail,
          password: hashedPassword,
          name: company.companyName,
          role: "admin",
          companyId: company._id,
        });
        return res.status(200).json({ message: "Company added successfully", company });
    }catch(err){
        console.log(err)
    return res.status(500).json({ message: "Error fetching company details", err });
    }
}

export const getAllCompanies = async (req: any, res: any) => {
    try {
        // connectDB()
        // console.log("hello")
        const companies = await Company.find().populate("plan");
        // console.log(companies)  
        res.status(200).json(companies);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching company details", error });
    }
    }

   export const getcompanydetails= async (req:any, res:any) =>{
        try {
            // connectDB()
            console.log("hello")
            const companyId = req.params.id;
            console.log(companyId)
            const admin = await Company.findOne({ _id: companyId }).populate(
              "plan"
            );
            console.log(admin)  
            res.status(200).json(admin);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching company details", error });
        }
    }

    export const editEmail = async(req:any,res:any)=>{
        try{
            const {emailAccounts}=req.body;
            const company = await Company.findOneAndUpdate({ _id: req.params.id }, {emailAccounts}, { new: true });
            return res.status(200).json({ message: "Company details updated successfully", company });
        }catch(error){
            return res.status(500).json({ message: "Error fetching company details", error });
        }
    }

    export const editImage = async(req:any,res:any)=>{
        try{
            const {img,name,companyId} = req.body;
            console.log(req.body)
            const company = await Company.findOne({_id:companyId});
            console.log(company)
            if(!company) return res.status(500).json({ message: "Error fetching company details"});
            if(name === "logo"){
                company.imgurl = img;
            }else{
                company.signature = img;
                
            }
            await company.save();
                return res.status(200).json({ message: "Company details updated successfully", company });
        }
        catch(error){
            return res.status(500).json({ message: "Error fetching company details", error });
        }
    }

    export const editCompanyDetails = async (req: any, res: any) => {
        try {
            // console.log(req.params.id);
            // console.log(req.body);
            const company = await Company.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
            return res.status(200).json({ message: "Company details updated successfully", company });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching company details", error });
        }
    }



