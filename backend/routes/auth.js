import express from 'express';
import { signup, login } from '../controllers/authController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Get current user info
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

export default router; 