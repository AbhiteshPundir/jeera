import express from 'express';
import { createProject, getMyProjects } from '../controllers/project.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

//POST /api/projects
router.post('/', protect, createProject);

//GET /api/projects
router.get('/', protect, getMyProjects);

export default router;