// import express from "express";
import Employee from "../../models/Employee";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// const router = express.Router();

export const Login = async (req: any, res: any) => {
  try {
    // console.log(req.body)
    const { email, password } = req.body;
    console.log(email, password);
    const Emp = await Employee.findOne({ email });
    //    console.log(Emp.companyId,Emp.role)
    if (Emp) {
        console.log(password, Emp.password);
      const hashedPassword = await bcrypt.compare(password, Emp.password);
      console.log(hashedPassword);
      if (!hashedPassword) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const token = jwt.sign(
        { id: Emp._id, role: Emp.role, company_id: Emp.companyId },
        process.env.VITE_JWT_SECRET!,
        {
          expiresIn: "7d",
        }
      );

      return res.status(200).json({
        message: "Login successful",
        data: {
          token: token,
        },
      });
    } else {
      return res.status(401).json({ message: "Employee not found" });
    }
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error fetching company details", error });
  }
};
