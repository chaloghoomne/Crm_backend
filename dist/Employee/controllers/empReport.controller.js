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
exports.companyLeadsStatus = exports.companyLeadsCount = exports.agentReportStatus = exports.agentLeadsCount = exports.OperationStatusCount = exports.assignedOperationsCount = exports.leadStatusCount = exports.assignedLeadsCount = exports.countLeads = void 0;
const Lead_1 = __importDefault(require("../../models/Lead"));
const mongoose_1 = __importDefault(require("mongoose"));
const Operations_1 = __importDefault(require("../../models/Operations"));
const countLeads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    // console.log(id)
    try {
        const count = yield Lead_1.default.aggregate([
            {
                $match: {
                    leadBy: new mongoose_1.default.Types.ObjectId(id),
                },
            },
            {
                $count: "string",
            },
        ]);
        // console.log(count);
        return res.status(200).json({ count: ((_a = count[0]) === null || _a === void 0 ? void 0 : _a.string) || 0 });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error counting leads", error });
    }
});
exports.countLeads = countLeads;
const assignedLeadsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    try {
        const count = yield Lead_1.default.aggregate([
            {
                $match: {
                    assignedEmpId: new mongoose_1.default.Types.ObjectId(id),
                },
            },
            {
                $count: "string",
            },
        ]);
        return res.status(200).json({ count: ((_a = count[0]) === null || _a === void 0 ? void 0 : _a.string) || 0 });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error Fetching Leads", err });
    }
});
exports.assignedLeadsCount = assignedLeadsCount;
const leadStatusCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const count = yield Lead_1.default.aggregate([
            {
                $match: {
                    leadBy: new mongoose_1.default.Types.ObjectId(id),
                },
            },
            {
                $group: {
                    _id: "$status",
                    totalAmount: { $sum: "$price" },
                    count: { $sum: 1 },
                },
            },
        ]);
        return res.status(200).json({ count });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error Fetching Leads", err });
    }
});
exports.leadStatusCount = leadStatusCount;
const assignedOperationsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    try {
        const count = yield Operations_1.default.aggregate([
            {
                $match: {
                    assignedEmpId: new mongoose_1.default.Types.ObjectId(id),
                },
            },
            {
                $count: "string",
            },
        ]);
        return res.status(200).json({ count: ((_a = count[0]) === null || _a === void 0 ? void 0 : _a.string) || 0 });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error Fetching Leads", err });
    }
});
exports.assignedOperationsCount = assignedOperationsCount;
const OperationStatusCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const count = yield Operations_1.default.aggregate([
            {
                $match: {
                    assignedEmpId: new mongoose_1.default.Types.ObjectId(id),
                },
            },
            {
                $group: {
                    _id: "$operationStatus",
                    totalAmount: { $sum: "$price" },
                    count: { $sum: 1 },
                },
            },
        ]);
        return res.status(200).json({ count });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error Fetching Leads", err });
    }
});
exports.OperationStatusCount = OperationStatusCount;
const agentLeadsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const count = yield Lead_1.default.aggregate([
            {
                $match: {
                    agent: new mongoose_1.default.Types.ObjectId(id),
                },
            },
            {
                $count: "string",
            },
        ]);
        return res.status(200).json({ count: ((_a = count[0]) === null || _a === void 0 ? void 0 : _a.string) || 0 });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching agent Leads", err });
    }
});
exports.agentLeadsCount = agentLeadsCount;
const agentReportStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const status = yield Lead_1.default.aggregate([
            {
                $match: {
                    agent: new mongoose_1.default.Types.ObjectId(id)
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$price" }
                }
            }
        ]);
        // console.log(status);
        return res.status(200).json({ status });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching agent report status", err });
    }
});
exports.agentReportStatus = agentReportStatus;
const companyLeadsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const count = yield Lead_1.default.aggregate([
            {
                $match: {
                    companyId: new mongoose_1.default.Types.ObjectId(id),
                },
            },
            {
                $count: "string",
            },
        ]);
        return res.status(200).json({ count: ((_a = count[0]) === null || _a === void 0 ? void 0 : _a.string) || 0 });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching agent Leads", err });
    }
});
exports.companyLeadsCount = companyLeadsCount;
const companyLeadsStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const status = yield Lead_1.default.aggregate([
            {
                $match: {
                    companyId: new mongoose_1.default.Types.ObjectId(id)
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$price" }
                }
            }
        ]);
        // console.log(status);
        return res.status(200).json({ status });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching agent report status", err });
    }
});
exports.companyLeadsStatus = companyLeadsStatus;
