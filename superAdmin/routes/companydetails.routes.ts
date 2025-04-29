const router = require('express').Router();
// const nodemailer = require('nodemailer');
const mail = require('../controllers/companydetails.controller')

router.post("/addnewcompany",mail.addNewCompany);
router.get("/getcompanydetails/:id",mail.getcompanydetails);
export default router;