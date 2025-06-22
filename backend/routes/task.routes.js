import express from 'express';
import {
  createTask,
  getTasksByProject,
  updateTask,
} from '../controllers/task.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyJWT, createTask); // Create a task
router.get('/:projectId', verifyJWT, getTasksByProject); // All tasks by project
router.patch('/:taskId/status', verifyJWT, updateTask); // Update task information

export default router;