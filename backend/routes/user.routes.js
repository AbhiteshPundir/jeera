import express from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile, getAllUsers } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', verifyJWT, getUserProfile);
router.get('/all', verifyJWT, getAllUsers);

export default router;