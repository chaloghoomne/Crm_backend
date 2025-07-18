"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const empTask_controller_1 = require("../controllers/empTask.controller");
const router = express_1.default.Router();
router.post("/createTask", empTask_controller_1.createTask);
router.get("/getAllTasks/:id", empTask_controller_1.getAllTasks);
exports.default = router;
