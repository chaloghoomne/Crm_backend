import express from "express";

const router = express.Router();

import {addLead, addNewAgent, deleteEmp, editEmp, editEmpRole, forwardLead, getAgent, getAllEmp, getAllLeads, getLeads, getLeadsPaged, makeNewEmp, saveFollowUp, sendmail, setStatus} from "../controllers/empfunction.controller";
import {getallmails} from "../controllers/empfunction.controller";

router.post("/editEmpRole",editEmpRole);
router.put("/editEmp/:id",editEmp);
router.post("/sendmail",sendmail);
router.post("/add-new-lead",addLead);
router.get("/getallmails",getallmails);
router.post("/makeNewEmp",makeNewEmp);
router.get("/getAllEmp/:id",getAllEmp);
router.get("/deleteEmp/:id",deleteEmp);
router.get("/getAllLeads/:id",getAllLeads);
router.get("/getLeads",getLeads);
router.post("/addnewagent",addNewAgent);
router.get("/getAgents/:id",getAgent);
router.post("/setStatus",setStatus);
router.post("/getLeadsPaged",getLeadsPaged);
router.post("/saveFollowUp",saveFollowUp);
router.get("/forwardLead/:id",forwardLead);

export default router