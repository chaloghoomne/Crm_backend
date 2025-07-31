import express from 'express';
import { completeTask, createTask, getAllTasks } from '../controllers/empTask.controller';

const router = express.Router();

router.post("/createTask", createTask);
router.get("/getAllTasks/:id", getAllTasks)
router.get("/completeTask/:id", completeTask);

export default router;