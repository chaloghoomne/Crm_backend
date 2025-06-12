import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/db'; // Ensure this path is correct
import companyRoutes from './superAdmin/routes/companydetails.routes';
import empfunctionRoutes from './Employee/routes/empfunction.routes';
import superAdminauthRoutes from './superAdmin/routes/auth.routes';
import employeeLoginRoutes from './Employee/routes/empauth.routes';
import paymentRoutes from './Employee/routes/empPayment.routes';
import empOperationRoutes from './Employee/routes/empOperations.routes';
import empInvoiceRoutes from './Employee/routes/empInvoice.routes';
dotenv.config();

const app = express();
const PORT = 5174;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*", // For testing; restrict in production
}));


// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status === 503) {
    res.status(503).json({ success: false, message: '503 Service Unavailable' });
  } else {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from backend!');
});

app.use('/api', companyRoutes);
app.use('/api', empfunctionRoutes);
app.use('/api', employeeLoginRoutes)
app.use('/api',superAdminauthRoutes)
app.use('/api', paymentRoutes)
app.use('/api',empOperationRoutes)
app.use('/api',empInvoiceRoutes)
// Connect DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port: ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error(`❌ Error in database connection: ${error.message}`);
  });
