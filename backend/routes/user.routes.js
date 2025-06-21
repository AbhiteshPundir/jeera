import express from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', verifyJWT, getUserProfile);

export default router;