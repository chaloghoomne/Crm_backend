"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const employeeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    role: { type: String, enum: ['admin', 'sales', 'operations'], default: 'sales' },
    phone: { type: String },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true },
    createdAt: { type: Date, default: Date.now },
});
const Employee = mongoose_1.models.Employee || (0, mongoose_1.model)("Employee", employeeSchema);
exports.default = Employee;
