import express from "express";
import { leadPayment } from "../controllers/empPayment.controller";

const router = express.Router();

router.post('/leadPayment',leadPayment);

export default router;