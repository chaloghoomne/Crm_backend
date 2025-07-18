"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const empPayment_controller_1 = require("../controllers/empPayment.controller");
const router = express_1.default.Router();
router.post('/leadPayment', empPayment_controller_1.leadPayment);
exports.default = router;
