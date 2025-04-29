
import Company from "../../models/Company";
import Employee from "../../models/Employee";
// import Employee from "../../models/Employee";

export const addNewCompany = async (req: any, res: any) => {
    try{
        console.log(req.body)
        const  company = await Company.create(req.body);
        console.log(company.password)
        const  employee = await Employee.create({email:company.adminEmail,password:company.password,name:company.companyName,role:'admin',companyId:company._id});
        // console.log(company)
        return res.status(200).json({ message: "Company added successfully", company });
    }catch(err){
        console.log(err)
    return res.status(500).json({ message: "Error fetching company details", err });
    }
}

   export const getcompanydetails= async (req:any, res:any) =>{
        try {
            // connectDB()
            console.log("hello")
            const companyId = req.params.id;
            console.log(companyId)
            const admin = await Company.findOne({ _id: companyId });
            console.log(admin)  
            res.status(200).json(admin);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching company details", error });
        }
    }



