"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const superAdminSchema = new mongoose_1.Schema({
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['superadmin'], default: 'superadmin' },
});
const SuperAdmin = mongoose_1.models.SuperAdmin || (0, mongoose_1.model)("SuperAdmin", superAdminSchema);
exports.default = SuperAdmin;
