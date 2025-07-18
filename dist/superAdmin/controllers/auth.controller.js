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
exports.login = void 0;
const SuperAdmin_1 = __importDefault(require("../../models/SuperAdmin"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const token = req.headers.authorization.split(" ")[1];
        // console.log(email,password)
        const admin = yield SuperAdmin_1.default.findOne({ email });
        // console.log(admin)
        if (token) {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
            });
        }
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (admin.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        else {
            if (admin.email === email && admin.password === password) {
                const token = jsonwebtoken_1.default.sign({ id: admin._id, role: 'superadmin' }, process.env.JWT_SECRET);
                return res.status(200).json({ message: "Login successful", token });
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching company details", error });
    }
});
exports.login = login;
