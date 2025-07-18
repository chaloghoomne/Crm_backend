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
exports.leadPayment = void 0;
const Transaction_1 = __importDefault(require("../../models/Transaction"));
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let instance = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET, // Correct env variable
});
// console.log(process.env.RAZORPAY_KEY_ID,process.env.RAZORPAY_SECRET)
const leadPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { leadId, amount } = req.body;
        // console.log(req.body);
        if (!leadId || !amount) {
            return res.status(400).json({ message: "leadId and amount are required" });
        }
        const receiptId = 'receipt_order_' + Math.random().toString(36).substring(2, 15);
        const options = {
            amount: Number(amount) * 100, // in paise
            currency: 'INR',
            receipt: receiptId,
        };
        // console.log("Creating Razorpay Order with options:", options);
        const order = yield instance.orders.create(options);
        // console.log('Razorpay Order:', order);
        // Save in DB after successful order creation
        const data = yield Transaction_1.default.create({
            leadId: leadId,
            amount: amount,
            currency: 'INR',
            receipt: receiptId, // Use same receipt
            razorpayOrderId: order.id, // Save Razorpay Order ID too (best practice)
        });
        // console.log('Transaction Saved:', data);
        return res.status(200).json(order);
    }
    catch (err) {
        console.error("Payment Error:", err);
        return res.status(500).json({ message: "Error fetching Payment Details", error: err.message });
    }
});
exports.leadPayment = leadPayment;
