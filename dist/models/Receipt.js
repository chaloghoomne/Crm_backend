"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const receiptSchema = new mongoose_1.Schema({
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Company", required: true },
    invoiceId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Invoice", required: true },
    receiptNumber: { type: String, required: true },
    amountPaid: { type: Number, default: 0 },
    paymentMode: { type: String },
    total: { type: Number },
    currency: { type: String },
    buyerName: { type: String },
    date: { type: Date },
    receiptType: { type: String, enum: ["sales", "purchase", "credit", "debit"], default: "sales" },
    account: { type: String },
    note: { type: String },
    balance: { type: Number, default: 0 },
});
const Receipt = mongoose_1.models.Receipt || (0, mongoose_1.model)("Receipt", receiptSchema);
exports.default = Receipt;
