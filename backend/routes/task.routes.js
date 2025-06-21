import express from 'express';
import {
  createTask,
  getTasksByProject,
  updateTaskStatus,
} from '../controllers/task.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyJWT, createTask); // Create a task
router.get('/:projectId', verifyJWT, getTasksByProject); // All tasks by project
router.patch('/:taskId/status', verifyJWT, updateTaskStatus); // Update kanban status

export default router;