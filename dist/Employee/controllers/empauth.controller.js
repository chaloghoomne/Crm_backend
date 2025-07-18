"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
// import express from "express";
const Employee_1 = __importDefault(require("../../models/Employee"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const router = express.Router();
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body)
        const { email, password } = req.body;
        const Emp = yield Employee_1.default.findOne({ email, password });
        //    console.log(Emp.companyId,Emp.role) 
        if (Emp) {
            const token = jsonwebtoken_1.default.sign({ id: Emp._id, role: Emp.role, company_id: Emp.companyId }, process.env.VITE_JWT_SECRET);
            if (email && password) {
                return res.status(200).json({
                    message: "Login successful",
                    data: {
                        token: token,
                    }
                });
            }
        }
        else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching company details", error });
    }
});
exports.Login = Login;
