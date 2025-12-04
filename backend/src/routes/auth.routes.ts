import { Router } from 'express';
import { signup, login, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', signup);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getProfile);

export default router;
