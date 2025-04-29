import express from "express";

const router = express.Router();

import {addLead, deleteEmp, getAllEmp, getAllLeads, getLeads, makeNewEmp, sendmail} from "../controllers/empfunction.controller";
import {getallmails} from "../controllers/empfunction.controller";

router.post("/sendmail",sendmail);
router.post("/add-new-lead",addLead);
router.get("/getallmails",getallmails);
router.post("/makeNewEmp",makeNewEmp);
router.get("/getAllEmp/:id",getAllEmp);
router.get("/deleteEmp/:id",deleteEmp);
router.get("/getAllLeads/:id",getAllLeads);
router.get("/getLeads",getLeads);


export default router