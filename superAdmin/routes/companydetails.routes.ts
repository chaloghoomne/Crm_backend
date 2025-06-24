import { addNewCompany, editCompanyDetails, getcompanydetails } from "../controllers/companydetails.controller";

const router = require('express').Router();
// const nodemailer = require('nodemailer');


router.post("/addnewcompany",addNewCompany);
router.get("/getcompanydetails/:id",getcompanydetails);

router.put("/editcompanydetails/:id",editCompanyDetails);
export default router;