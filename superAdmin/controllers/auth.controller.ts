import SuperAdmin from "../../models/SuperAdmin";
import jwt from "jsonwebtoken";

export const login = async(req:any,res:any)=>{
    try{
        const {email,password} = req.body;
        const token = req.headers.authorization.split(" ")[1];
        // console.log(email,password)
        const admin = await SuperAdmin.findOne({email});
        // console.log(admin)
        if(token){
            jwt.verify(token,process.env.JWT_SECRET!,(err:any,decoded:any)=>{
                if(err){
                    return res.status(401).json({ message: "Unauthorized" });
                }
            })
        }
        if(!admin){
            return res.status(404).json({ message: "Admin not found" });
        }
        if(admin.password !== password){
            return res.status(401).json({ message: "Invalid credentials" });
        }else{
            if(admin.email === email && admin.password === password){
                const token = jwt.sign({id:admin._id,role:'superadmin'},process.env.JWT_SECRET!);
            return res.status(200).json({ message: "Login successful", token });
        }
        }
    }catch(error:any){
        console.log(error)
        return res.status(500).json({ message: "Error fetching company details", error });
    }
}