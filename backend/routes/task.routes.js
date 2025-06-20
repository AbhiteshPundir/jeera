import express from 'express';
import {
  createTask,
  getTasksByProject,
  updateTaskStatus,
} from '../controllers/task.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createTask); // Create a task
router.get('/:projectId', protect, getTasksByProject); // All tasks by project
router.patch('/:taskId/status', protect, updateTaskStatus); // Update kanban status

export default router;