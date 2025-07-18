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
exports.saveProduct = exports.getProducts = exports.deleteClients = exports.getClients = exports.saveClient = exports.deleteInvoice = exports.updateInvoiceStatus = exports.convertToInvoice = exports.getInvoiceNumber = exports.getNumber = exports.getAllReceipts = exports.makeReceipt = exports.getSingleInvoice = exports.getInvoice = exports.getQuotation = exports.makeInvoice = void 0;
const Clients_1 = __importDefault(require("../../models/Clients"));
const Invoice_1 = __importDefault(require("../../models/Invoice"));
const Products_1 = __importDefault(require("../../models/Products"));
const Receipt_1 = __importDefault(require("../../models/Receipt"));
const makeInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const invoice = yield Invoice_1.default.create(req.body);
        console.log(invoice);
        return res.status(200).json({ message: "Invoice added successfully" });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Error fetching all company Emails", error });
    }
});
exports.makeInvoice = makeInvoice;
const getQuotation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body);
        const invoice = yield Invoice_1.default.find({ companyId: req.params.id, isInvoice: false });
        // console.log(invoice);
        return res.status(200).json(invoice);
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Error Fetching Invoices", err });
    }
});
exports.getQuotation = getQuotation;
const getInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.params.invoiceType);
        const invoice = yield Invoice_1.default.find({ companyId: req.params.id, isInvoice: true, invoiceType: req.params.invoiceType });
        // console.log(invoice);
        return res.status(200).json(invoice);
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Error Fetching Invoices", err });
    }
});
exports.getInvoice = getInvoice;
const getSingleInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body);
        const invoice = yield Invoice_1.default.find({ _id: req.params.id, isInvoice: true });
        // console.log(invoice);
        return res.status(200).json(...invoice);
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Error Fetching Invoices", err });
    }
});
exports.getSingleInvoice = getSingleInvoice;
const makeReceipt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Request body:", req.body);
        const { invoiceId, amountPaid, receiptNumber } = req.body;
        if (!invoiceId || !amountPaid || !receiptNumber) {
            //   console.log("Missing required fields");
            return res.status(400).json({ message: "Missing required fields" });
        }
        const receipt = yield Receipt_1.default.create(req.body);
        // console.log("Receipt created:", receipt);
        const invoice = yield Invoice_1.default.findById(invoiceId);
        if (!invoice) {
            //   console.log("Invoice not found");
            return res.status(404).json({ message: "Invoice not found" });
        }
        // console.log("Found invoice:", invoice);
        const prevPaid = invoice.amountPaid || 0;
        const paidNow = typeof amountPaid === "string" ? parseFloat(amountPaid) : amountPaid;
        const newTotalPaid = prevPaid + paidNow;
        // console.log(`Previous paid: ${prevPaid}, Paid now: ${paidNow}, New total paid: ${newTotalPaid}`);
        invoice.amountPaid = newTotalPaid;
        if (newTotalPaid >= invoice.totalAmount) {
            invoice.status = "paid";
        }
        else if (newTotalPaid > 0) {
            invoice.status = "partially paid";
        }
        else {
            invoice.status = "unpaid";
        }
        // console.log("Updated invoice status to:", invoice.status);
        invoice.receipts = Array.isArray(invoice.receipts) ? invoice.receipts : [];
        if (!invoice.receipts.includes(receiptNumber)) {
            invoice.receipts.push(receiptNumber);
            //   console.log("Updated receipts list:", invoice.receipts);
        }
        yield invoice.save();
        // console.log("Invoice updated and saved");
        return res.status(200).json({
            message: "Receipt created and invoice updated",
            receipt,
        });
    }
    catch (err) {
        console.error("Error in makeReceipt:", err.message || err);
        return res.status(500).json({ message: "Error receipt" });
    }
});
exports.makeReceipt = makeReceipt;
const getAllReceipts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.params);
        const invoice = yield Receipt_1.default.find({ companyId: req.params.id, receiptType: req.params.receiptType }).populate("invoiceId");
        // console.log(invoice);
        if (!invoice)
            return res.status(500).json({ message: "No Receipts Found" });
        return res.status(200).json(invoice);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error Finding Receipts" });
    }
});
exports.getAllReceipts = getAllReceipts;
const getNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id);
        const invoice = yield Invoice_1.default.findOne({ _id: req.params.id });
        console.log(invoice);
        const phone = invoice === null || invoice === void 0 ? void 0 : invoice.phone;
        return res.json({ phone });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getNumber = getNumber;
const getInvoiceNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestInvoice = yield Invoice_1.default.findOne({ companyId: req.params.id })
            .sort({ invoiceNumber: -1 });
        let nextNumber = 1;
        if (latestInvoice === null || latestInvoice === void 0 ? void 0 : latestInvoice.invoiceNumber) {
            const match = latestInvoice.invoiceNumber.match(/\d+/);
            if (match)
                nextNumber = parseInt(match[0]) + 1;
        }
        const invoiceNumber = `#${nextNumber.toString().padStart(4, "0")}`;
        return res.json({ invoiceNumber });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getInvoiceNumber = getInvoiceNumber;
const convertToInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const invoice = yield Invoice_1.default.findOne({ _id: req.params.id });
        if (!invoice) {
            return res
                .status(500)
                .json({ message: "Invoice not found" });
        }
        invoice.isInvoice = true;
        yield invoice.save();
        return res.status(200).json({ message: "Invoice added successfully" });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Error fetching all company Emails", error });
    }
});
exports.convertToInvoice = convertToInvoice;
const updateInvoiceStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoice = yield Invoice_1.default.findById(req.params.id);
        invoice.status = req.body.status;
        yield invoice.save();
        return res.status(200).json({ message: "Invoice Updated Successfully" });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Error Fetching Invoices", err });
    }
});
exports.updateInvoiceStatus = updateInvoiceStatus;
const deleteInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.params.id);
        const invoice = yield Invoice_1.default.findByIdAndDelete(req.params.id);
        // console.log(invoice);
        return res
            .status(200)
            .json({ message: "Invoice deleted successfully" });
    }
    catch (err) {
        // console.log(err);
        return res
            .status(500)
            .json({ message: "Error Fetching Invoices", err });
    }
});
exports.deleteInvoice = deleteInvoice;
const saveClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const email = req.body.email;
        console.log(email);
        const client = yield Clients_1.default.findOne({ email: req.body.email });
        if (client) {
            client.name = req.body.name;
            client.email = req.body.email;
            client.address = req.body.address;
            client.phone = req.body.phone;
            yield client.save();
            return res.status(200).json({ message: "Client Added Successfully" });
        }
        // return res.status(500).json({ message: "Client Already Exists" });
        const invoice = yield Clients_1.default.create(req.body);
        // console.log(invoice);
        return res.status(200).json({ message: "Client Added Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: " Error Adding Client" });
    }
});
exports.saveClient = saveClient;
const getClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body);
        const client = yield Clients_1.default.find({ companyId: req.params.id });
        // console.log(client)
        return res.status(200).json(client);
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Clients Could  not be Fetched" });
    }
});
exports.getClients = getClients;
const deleteClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id);
        yield Clients_1.default.findByIdAndDelete({ _id: req.params.id });
        return res.status(200).json({ message: "Client Deleted" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error Deleting Client" });
    }
});
exports.deleteClients = deleteClients;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Products ki body", req.params.id);
        const client = yield Products_1.default.find({ companyId: req.params.id });
        // console.log(client);
        return res.status(200).json(client);
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Clients Could  not be Fetched" });
    }
});
exports.getProducts = getProducts;
const saveProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const product = yield Products_1.default.create(Object.assign(Object.assign({}, req.body), { companyId: req.params.id }));
        // console.log(product);
        return res.status(200).json({ message: "Product Added Successfully" });
    }
    catch (err) {
        console.log(err);
        return req.status(500).json({ message: "Error Adding Product" });
    }
});
exports.saveProduct = saveProduct;
