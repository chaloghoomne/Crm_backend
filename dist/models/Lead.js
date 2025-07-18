"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LeadSchema = new mongoose_1.Schema({
    leadBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Employee', required: true },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true },
    agent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Agent' },
    agentName: { type: String },
    assignedEmpName: { type: String },
    assignedEmpId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Employee' },
    serviceType: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    leadType: { type: String },
    requirements: { type: String },
    fromDate: { type: Date },
    toDate: { type: Date },
    followUp: [
        {
            status: { type: String },
            date: { type: Date },
            nextDate: { type: Date },
            remarks: { type: String },
            price: { type: Number },
            reminder: { type: String },
        }
    ],
    time: { type: String },
    forward: { type: Boolean },
    price: { type: Number },
    destination: { type: String },
    country: { type: String },
    tourType: { type: String },
    visaCategory: { type: mongoose_1.Schema.Types.ObjectId, ref: 'visaCategory' },
    visaName: { type: String },
    validity: { type: String, },
    // departureDest:{type:String},
    // arrivalDest:{type:String},
    adult: { type: Number },
    child: { type: Number, default: 0 },
    infant: { type: Number, default: 0 },
    // insuranceAmount:{type:String},
    hotelCategory: { type: String },
    flightType: { type: String },
    leadSource: { type: String },
    priority: { type: String },
    passport: { type: String },
    status: { type: String },
    document: {
        type: Map,
        of: String,
    },
    createdAt: { type: Date, default: Date.now },
});
const Lead = mongoose_1.models.Lead || (0, mongoose_1.model)("Lead", LeadSchema);
exports.default = Lead;
