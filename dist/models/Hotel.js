"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hotelSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    hotelType: { type: String, required: true },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true },
    createdAt: { type: Date, default: Date.now },
});
const Hotel = mongoose_1.models.Hotel || (0, mongoose_1.model)("Hotel", hotelSchema);
exports.default = Hotel;
