import { Express,Router } from "express";
import { deleteInvoice, getInvoices, makeInvoice } from "../controllers/empInvoice.controller";

const router = Router();

router.post("/createInvoice",makeInvoice);
router.get("/getInvoices/:id",getInvoices);
router.get("/deleteInvoice/:id",deleteInvoice);
export default router