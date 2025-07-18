"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transaactionSchema = new mongoose_1.Schema({
    leadId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Lead', required: true },
    payment: {
        type: String,
        default: true,
    },
    amount: { type: String, required: true },
    currency: { type: String, required: true },
    receipt: { type: String, required: true },
});
const Transaction = mongoose_1.models.Transaction || (0, mongoose_1.model)("Transaction", transaactionSchema);
exports.default = Transaction;
