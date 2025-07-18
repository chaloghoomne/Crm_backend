"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const EmailAccountSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    host: { type: String, required: true },
    secure: { type: Boolean, required: true },
    provider: { type: String, required: true },
});
const companySchema = new mongoose_1.Schema({
    companyName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    address: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    upi: { type: String },
    bankName: { type: String },
    subscription: {
        plan: { type: String, required: true },
        status: { type: String, required: true },
        expiresAt: { type: Date, default: Date.now() + (30 * 24 * 60 * 60 * 1000) },
    },
    imgurl: { type: String },
    signature: { type: String },
    emailAccounts: [EmailAccountSchema],
    createdAt: { type: Date, default: Date.now },
});
const Company = mongoose_1.default.models.Company || mongoose_1.default.model("Company", companySchema);
exports.default = Company;
