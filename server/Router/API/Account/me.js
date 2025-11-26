import prisma from '../../../config/database.js';
import express from 'express';
// PrismaClient import removed - using centralized db
import { cookieAuth } from '../../../Middlewares/Auth/cookieAuth.js';

const router = express.Router();
// Using centralized prisma instance

router.get('/details/me', cookieAuth, async (req, res) => {
  try {
    const user = await prisma.account.findUnique({
      where: { id: req.user.id },
      select: { username: true, email: true }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (e) {
    console.error('account me error:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
