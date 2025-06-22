import express from 'express';
import { createProject, getMyProjects, getProjectById } from '../controllers/project.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

//POST /api/projects
router.post('/', verifyJWT, createProject);

//GET /api/projects
router.get('/', verifyJWT, getMyProjects);

router.get('/:id', verifyJWT, getProjectById);

export default router;