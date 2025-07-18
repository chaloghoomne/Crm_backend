"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db/db")); // Ensure this path is correct
const companydetails_routes_1 = __importDefault(require("./superAdmin/routes/companydetails.routes"));
const empfunction_routes_1 = __importDefault(require("./Employee/routes/empfunction.routes"));
const auth_routes_1 = __importDefault(require("./superAdmin/routes/auth.routes"));
const empauth_routes_1 = __importDefault(require("./Employee/routes/empauth.routes"));
const empPayment_routes_1 = __importDefault(require("./Employee/routes/empPayment.routes"));
const empOperations_routes_1 = __importDefault(require("./Employee/routes/empOperations.routes"));
const empInvoice_routes_1 = __importDefault(require("./Employee/routes/empInvoice.routes"));
const empReport_routes_1 = __importDefault(require("./Employee/routes/empReport.routes"));
const empTask_routes_1 = __importDefault(require("./Employee/routes/empTask.routes"));
const cronScheduler_1 = require("./cronJobs/cronScheduler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*", // For testing; restrict in production
}));
// Error handling middleware
app.use((err, req, res, next) => {
    if (err.status === 503) {
        res.status(503).json({ success: false, message: '503 Service Unavailable' });
    }
    else {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
// Test route
app.get('/', (req, res) => {
    res.send('Hello from backend!');
});
app.use('/api', companydetails_routes_1.default);
app.use('/api', empfunction_routes_1.default);
app.use('/api', empauth_routes_1.default);
app.use('/api', auth_routes_1.default);
app.use('/api', empPayment_routes_1.default);
app.use('/api', empOperations_routes_1.default);
app.use('/api', empInvoice_routes_1.default);
app.use('/api', empReport_routes_1.default);
app.use("/api", empTask_routes_1.default);
// Connect DB and start server
(0, db_1.default)()
    .then(() => {
    app.listen(PORT, () => {
        (0, cronScheduler_1.startAllCronJobs)();
        console.log(`⚙️ Server is running at port: ${PORT}`);
    });
})
    .catch((error) => {
    console.error(`❌ Error in database connection: ${error.message}`);
});
