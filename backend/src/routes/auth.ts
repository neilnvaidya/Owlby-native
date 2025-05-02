import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  appleAuth,
  getMe,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerificationEmail
} from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/apple', appleAuth);
router.post('/refresh', refreshToken);
router.post('/reset-password/request', requestPasswordReset);
router.post('/reset-password/confirm', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Protected routes
router.get('/me', authMiddleware, getMe);

export default router; 