import express from "express"
import { addHotel, addSupplier, assignLead, createItinerary, getAllItineraries, getAssignedLeads, getHotel, getItenaryData, getItenaryLead, getSupplier, getSuppliers, saveSupplierInfo, updateSupplier } from "../controllers/empOperation.controller";

const router = express.Router();

router.post("/assignLead",assignLead)
router.get("/getAssignedLeads",getAssignedLeads)
router.get("/getItenaryLead/:id",getItenaryLead)
router.post("/addSupplier",addSupplier)
router.get("/getSuppliers/:id",getSuppliers)
router.get("/getSupplier/:id",getSupplier)
router.post("/updateSupplier/:id",updateSupplier)
router.post("/addHotel",addHotel)
router.get("/getHotel/:id",getHotel)
router.post("/saveSupplierInfo",saveSupplierInfo)
router.post("/saveItineray", createItinerary    );
router.get("/getPredefinedItenaryLead/:id",getAllItineraries)
router.get("/getItenaryData/:id",getItenaryData)
            
export default router;