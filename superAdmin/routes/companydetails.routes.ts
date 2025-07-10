import { addNewCompany, editCompanyDetails, editEmail, editImage, getAllCompanies, getcompanydetails } from "../controllers/companydetails.controller";

const router = require('express').Router();
// const nodemailer = require('nodemailer');


router.post("/addnewcompany",addNewCompany);
router.get("/getcompanydetails/:id",getcompanydetails);
router.post("/editEmail/:id",editEmail);
router.post("/editImage",editImage)
router.put("/editcompanydetails/:id",editCompanyDetails);
router.get("/getAllCompanies",getAllCompanies);
export default router;