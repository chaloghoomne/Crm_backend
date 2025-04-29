import express from "express";
const router = express.Router();
import {login} from "../controllers/auth.controller"

router.post("/super-admin-login",login);

export default router