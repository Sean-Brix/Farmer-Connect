import express from 'express';
import { PrismaClient } from '@prisma/client';
import { cookieAuth } from '../../../Middlewares/Auth/cookieAuth.js';

const router = express.Router();
const prisma = new PrismaClient();

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
