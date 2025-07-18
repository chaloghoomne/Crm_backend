"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const supplierSchema = new mongoose_1.Schema({
    company: { type: String },
    ownerName: { type: String },
    email: { type: String, },
    phoneNumber: { type: String },
    gstNumber: { type: String },
    serviceType: { type: [String] },
    city: { type: String },
    address: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    upi: { type: String },
    description: { type: String },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true },
    createdAt: { type: Date, default: Date.now },
    Images: { type: [String], default: [] },
});
const Supplier = mongoose_1.models.Supplier || (0, mongoose_1.model)("Supplier", supplierSchema);
exports.default = Supplier;
