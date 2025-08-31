import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

export default async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and new password are required' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.account.findFirst({
      where: {
        resetTokenHash: tokenHash,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const hashed = await bcrypt.hash(password, 10);

    await prisma.account.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetTokenHash: null,
        resetTokenExpiry: null,
      },
    });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
