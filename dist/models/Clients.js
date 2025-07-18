"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const clientSchema = new mongoose_1.Schema({
    companyId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    phone: { type: String },
    gstNumber: { type: String },
    clientType: { type: String },
});
const Client = mongoose_1.models.Client || (0, mongoose_1.model)("Client", clientSchema);
exports.default = Client;
