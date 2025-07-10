import express from 'express';
import { createTask, getAllTasks } from '../controllers/empTask.controller';

const router = express.Router();

router.post("/createTask", createTask);
router.get("/getAllTasks/:id", getAllTasks)

export default router;