"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const operationsSchema = new mongoose_1.Schema({
    leadId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Lead' },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    assignedEmpId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Employee' },
    assignedEmpName: { type: String },
    supplierName: { type: String },
    supplierId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Supplier' },
    supplierPrice: { type: String },
    operationStatus: { type: String, default: "Pending" },
});
const Operation = mongoose_1.models.Operation || (0, mongoose_1.model)("Operation", operationsSchema);
exports.default = Operation;
