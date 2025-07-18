"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const empauth_controller_1 = require("../controllers/empauth.controller"); // Update path if needed
router.post('/employee-login', empauth_controller_1.Login);
exports.default = router;
