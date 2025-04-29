import express from "express";
const router = express.Router();
import { Login } from "../controllers/empauth.controller"; // Update path if needed


router.post('/employee-login', Login);

export default router;
