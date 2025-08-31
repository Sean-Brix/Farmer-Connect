import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { sendMail } from '../../Services/emailService.js';

dotenv.config();
const prisma = new PrismaClient();

export default async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await prisma.account.findUnique({ where: { email } });
    // Always respond OK to prevent email enumeration
    if (!user) return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    await prisma.account.update({
      where: { id: user.id },
      data: {
        resetTokenHash: tokenHash,
        resetTokenExpiry: expiresAt,
      },
    });

    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const serverUrl = process.env.SERVER_PUBLIC_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    const html = `
      <p>Hello ${user.firstName || user.username},</p>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>If you did not request this, you can ignore this email.</p>
      <p>This link will expire in 30 minutes.</p>
    `;

    await sendMail({
      to: email,
      subject: 'Reset your Farmer Connect password',
      html,
      text: `Reset your password: ${resetUrl}`,
    });

    return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
