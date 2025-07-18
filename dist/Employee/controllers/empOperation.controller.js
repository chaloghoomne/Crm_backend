"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItenaryData = exports.createItinerary = exports.getAllItineraries = exports.saveSupplierInfo = exports.getHotel = exports.addHotel = exports.updateSupplier = exports.getSupplier = exports.getSuppliers = exports.addSupplier = exports.getItenaryLead = exports.getAssignedLeads = exports.assignLead = void 0;
const Itenaries_1 = __importDefault(require("../../models/Itenaries"));
const Operations_1 = __importDefault(require("../../models/Operations"));
const Supplier_1 = __importDefault(require("../../models/Supplier"));
const Hotel_1 = __importDefault(require("../../models/Hotel"));
const assignLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body);
        const { assignedEmpId, leadId, assignedEmpName, companyId } = req.body;
        const operation1 = yield Operations_1.default.findOne({ leadId: leadId });
        if (operation1) {
            if (operation1) {
                return res.status(500).json({ message: `Lead already assigned to ${operation1.assignedEmpName}` });
            }
        }
        const operation = yield Operations_1.default.create({ leadId, assignedEmpId, assignedEmpName, companyId });
        return res.status(200).json({ message: "Lead assigned successfully", operation });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error Assigning Leads", error });
    }
});
exports.assignLead = assignLead;
const getAssignedLeads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.query);  
        const { companyId, empId } = req.query;
        // console.log(companyId,empId)
        const leads = yield Operations_1.default.find({ assignedEmpId: empId, companyId: companyId }).populate('leadId');
        // console.log(leads);
        return res.status(200).json(leads);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error Assigning Leads", error });
    }
});
exports.getAssignedLeads = getAssignedLeads;
const getItenaryLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.params.id);  
        const leads = yield Operations_1.default.find({ _id: req.params.id }).populate('leadId');
        // console.log(leads);
        return res.status(200).json(leads);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error Assigning Leads", error });
    }
});
exports.getItenaryLead = getItenaryLead;
const addSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body.finalValues);
        const supplier = yield Supplier_1.default.create(req.body.finalValues);
        console.log(supplier);
        return res.status(200).json({ message: "Supplier added successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error Assigning Leads", error });
    }
});
exports.addSupplier = addSupplier;
const getSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id);
        const supplier = yield Supplier_1.default.find({ companyId: req.params.id });
        return res.status(200).json(supplier);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching all company Emails", error });
    }
});
exports.getSuppliers = getSuppliers;
const getSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id);
        const supplier = yield Supplier_1.default.find({ _id: req.params.id });
        return res.status(200).json(supplier);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching all company Emails", error });
    }
});
exports.getSupplier = getSupplier;
const updateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.params.id);  
        // console.log(req.body);
        const { finalValues } = req.body;
        const supplier = yield Supplier_1.default.findOneAndUpdate({ _id: req.params.id }, finalValues);
        // console.log(supplier);
        return res.status(200).json({ message: "Supplier updated successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error Assigning Leads", error });
    }
});
exports.updateSupplier = updateSupplier;
const addHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body);
        const hotel = yield Hotel_1.default.create(req.body);
        return res.status(200).json({ message: "Hotel added successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error Adding Hotel", error });
    }
});
exports.addHotel = addHotel;
const getHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.params.id);
        const hotel = yield Hotel_1.default.find({ companyId: req.params.id });
        return res.status(200).json(hotel);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching all company Emails", error });
    }
});
exports.getHotel = getHotel;
const saveSupplierInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body);  
        const data = req.body.finalValues;
        const Ops = yield Operations_1.default.findOne({ _id: data.leadId });
        // console.log(Ops);
        Ops.supplierId = data.supplierId;
        Ops.supplierPrice = data.supplierPrice;
        Ops.supplierName = data.supplierName;
        Ops.operationStatus = data.operationStatus;
        Ops.save();
        // const supplier = await Supplier.create(req.body.finalValues);
        // console.log(supplier);
        return res.status(200).json({ message: "Supplier Information added successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error Assigning Leads", error });
    }
});
exports.saveSupplierInfo = saveSupplierInfo;
// Get all itineraries
const getAllItineraries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id);
        const itineraries = yield Itenaries_1.default.find({ companyId: req.params.id });
        res.status(200).json(itineraries);
    }
    catch (error) {
        console.error('Error getting itineraries:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.getAllItineraries = getAllItineraries;
const createItinerary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body);
        const { operationId, companyId, title, createdBy, description, days, travelers, hotels, flights, visas } = req.body;
        // console.log(operationId,companyId, title, description,  days, travelers, hotels, flights, visas );
        // Check if lead exists
        const lead = yield Operations_1.default.findById({ _id: operationId });
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        // Generate shareable link
        // const shareableLink = generateShareableLink();
        const newItinerary = new Itenaries_1.default({
            title,
            description,
            operationId,
            companyId,
            createdBy: createdBy, // Assuming user ID is available from auth middleware
            days: days || [],
            travelers: travelers || [],
            hotels: hotels || [],
            flights: flights || [],
            visas: visas || [],
            //   shareableLink
        });
        const savedItinerary = yield newItinerary.save();
        res.status(201).json(savedItinerary);
    }
    catch (error) {
        console.error('Error creating itinerary:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.createItinerary = createItinerary;
const getItenaryData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.params.id);  
        const leads = yield Itenaries_1.default.find({ operationId: req.params.id });
        // console.log(leads);
        return res.status(200).json(leads);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error Assigning Leads", error });
    }
});
exports.getItenaryData = getItenaryData;
