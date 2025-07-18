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
exports.editCompanyDetails = exports.editImage = exports.editEmail = exports.getcompanydetails = exports.getAllCompanies = exports.addNewCompany = void 0;
const Company_1 = __importDefault(require("../../models/Company"));
const Employee_1 = __importDefault(require("../../models/Employee"));
// import Employee from "../../models/Employee";
const addNewCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body)
        if (yield Company_1.default.findOne({ adminEmail: req.body.adminEmail }))
            return res.status(200).json({ message: "Company is already Present" });
        const company = yield Company_1.default.create(req.body);
        // console.log(company.password)
        const employee = yield Employee_1.default.create({ email: company.adminEmail, password: company.password, name: company.companyName, role: 'admin', companyId: company._id });
        // console.log(company)
        return res.status(200).json({ message: "Company added successfully", company });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching company details", err });
    }
});
exports.addNewCompany = addNewCompany;
const getAllCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // connectDB()
        // console.log("hello")
        const companies = yield Company_1.default.find();
        // console.log(companies)  
        res.status(200).json(companies);
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching company details", error });
    }
});
exports.getAllCompanies = getAllCompanies;
const getcompanydetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // connectDB()
        // console.log("hello")
        const companyId = req.params.id;
        // console.log(companyId)
        const admin = yield Company_1.default.findOne({ _id: companyId });
        // console.log(admin)  
        res.status(200).json(admin);
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching company details", error });
    }
});
exports.getcompanydetails = getcompanydetails;
const editEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailAccounts } = req.body;
        const company = yield Company_1.default.findOneAndUpdate({ _id: req.params.id }, { emailAccounts }, { new: true });
        return res.status(200).json({ message: "Company details updated successfully", company });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching company details", error });
    }
});
exports.editEmail = editEmail;
const editImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { img, name, companyId } = req.body;
        console.log(req.body);
        const company = yield Company_1.default.findOne({ _id: companyId });
        console.log(company);
        if (!company)
            return res.status(500).json({ message: "Error fetching company details" });
        if (name === "logo") {
            company.imgurl = img;
        }
        else {
            company.signature = img;
        }
        yield company.save();
        return res.status(200).json({ message: "Company details updated successfully", company });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching company details", error });
    }
});
exports.editImage = editImage;
const editCompanyDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.params.id);
        // console.log(req.body);
        const company = yield Company_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        return res.status(200).json({ message: "Company details updated successfully", company });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching company details", error });
    }
});
exports.editCompanyDetails = editCompanyDetails;
