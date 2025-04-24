import express from 'express';
import { register, login, googleAuth, appleAuth, getMe } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/apple', appleAuth);

// Protected routes
router.get('/me', authMiddleware, getMe);

export default router; 