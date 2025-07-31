import express from "express";

const router = express.Router();

import {addLead, addNewAgent, deleteEmp, deletePlan, editEmp, editEmpRole, forwardLead, getAgent, getAllEmp, getAllLeads, getAllOperationByCompany, getLeads, getLeadsPaged, getPlan, getPlans, makeNewEmp, makePlan, saveFollowUp, sendmail, setStatus, updatePlan} from "../controllers/empfunction.controller";
import {getallmails} from "../controllers/empfunction.controller";
// import { getUrl } from "../controllers/oauth.controller";


router.post("/editEmpRole",editEmpRole);
router.put("/editEmp/:id",editEmp);
router.post("/sendmail",sendmail);
// router.get('/google/url', getUrl);
router.post("/makePlan/:id",makePlan);
router.get("/getPlans/:id",getPlans);
router.get("/getPlan/:id",getPlan);
router.get("/deletePlan/:id", deletePlan);
router.post("/updatePlan", updatePlan);
router.post("/add-new-lead",addLead);
router.get("/getallmails",getallmails);
router.post("/makeNewEmp",makeNewEmp);
router.get("/getAllEmp/:id",getAllEmp);
router.get("/deleteEmp/:id",deleteEmp);
router.get("/getAllLeads/:id",getAllLeads);
router.get("/getAllOperationByCompany/:id",getAllOperationByCompany);
router.get("/getLeads",getLeads);
router.post("/addnewagent",addNewAgent);
router.get("/getAgents/:id",getAgent);
router.post("/setStatus",setStatus);
router.post("/getLeadsPaged",getLeadsPaged);
router.post("/saveFollowUp",saveFollowUp);
router.get("/forwardLead/:id",forwardLead);

export default router