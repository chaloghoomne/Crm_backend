import express from "express";
import { agentLeadsCount, agentReportStatus, assignedLeadsCount, assignedOperationsCount, companyLeadsCount, companyLeadsStatus, countLeads, empLeads, empLeadsByCompany, empOperationsByCompany, leadStatusCount, OperationStatusCount } from "../controllers/empReport.controller";

const router = express.Router();  

router.get("/countLeads/:id",countLeads);
router.get("/assignedLeadsCount/:id", assignedLeadsCount);
router.get("/assignedOperationsCount/:id", assignedOperationsCount);
router.get("/leadStatusCount/:id", leadStatusCount); 
router.get("/empLeads/:id",empLeads);
router.get("/allLeadsByCompany/:id", empLeadsByCompany);
router.get("/allOperationsByCompany/:id", empOperationsByCompany);
router.get("/OperationStatusCount/:id", OperationStatusCount);
router.get("/agentLeadsCount/:id", agentLeadsCount); 
router.get("/agentReportStatus/:id",agentReportStatus);
router.get("/companyLeadsCount/:id", companyLeadsCount); 
router.get("/companyReportStatus/:id",companyLeadsStatus);

export default router;  