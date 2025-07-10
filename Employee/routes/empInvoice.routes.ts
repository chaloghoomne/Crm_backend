import { Express,Router } from "express";
import { deleteClients, deleteInvoice, getClients, getInvoiceNumber, getQuotation,getInvoice, getSingleInvoice, getProducts, makeInvoice, saveClient, saveProduct, updateInvoiceStatus, convertToInvoice, makeReceipt, getAllReceipts, getNumber } from "../controllers/empInvoice.controller";

const router = Router();

router.post("/createInvoice",makeInvoice);
router.get("/getInvoiceNumber/:id",getInvoiceNumber);
router.get("/getQuotation/:id",getQuotation);
router.get("/getInvoice/:id/:invoiceType",getInvoice);
router.get("/getSingleInvoice/:id",getSingleInvoice);
router.get("/convertToInvoice/:id",convertToInvoice)
router.put("/updateInvoiceStatus/:id",updateInvoiceStatus)
router.get("/deleteInvoice/:id",deleteInvoice);
router.post("/saveClient/:id",saveClient);
router.get("/getClients/:id",getClients);
router.delete("/deleteClients/:id",deleteClients);
router.get("/getProducts/:id",getProducts)
router.post("/saveProduct/:id",saveProduct)
router.post("/makeReceipt",makeReceipt);
router.get("/getAllReceipts/:id/:receiptType",getAllReceipts);
router.get("/getPhone/:id",getNumber)
export default router