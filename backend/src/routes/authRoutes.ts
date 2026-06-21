import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Bind the methods to preserve 'this' context
router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.get('/profile', authenticate, (req, res, next) => authController.getProfile(req, res, next));

export default router;
