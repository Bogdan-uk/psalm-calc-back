import express from 'express';
import * as authController from '../controllers/authController.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import { authMiddleware } from '../midlleware/authMidlleware.js';

const router = express.Router();

router.post('/register', registerSchema, authController.register);
router.post('/login', loginSchema, authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getMe);

export default router;
