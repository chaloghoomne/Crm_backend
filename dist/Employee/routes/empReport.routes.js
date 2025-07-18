"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const empReport_controller_1 = require("../controllers/empReport.controller");
const router = express_1.default.Router();
router.get("/countLeads/:id", empReport_controller_1.countLeads);
router.get("/assignedLeadsCount/:id", empReport_controller_1.assignedLeadsCount);
router.get("/assignedOperationsCount/:id", empReport_controller_1.assignedOperationsCount);
router.get("/leadStatusCount/:id", empReport_controller_1.leadStatusCount);
router.get("/OperationStatusCount/:id", empReport_controller_1.OperationStatusCount);
router.get("/agentLeadsCount/:id", empReport_controller_1.agentLeadsCount);
router.get("/agentReportStatus/:id", empReport_controller_1.agentReportStatus);
router.get("/companyLeadsCount/:id", empReport_controller_1.companyLeadsCount);
router.get("/companyReportStatus/:id", empReport_controller_1.companyLeadsStatus);
exports.default = router;
