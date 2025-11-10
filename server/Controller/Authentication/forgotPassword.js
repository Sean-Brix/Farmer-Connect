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
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    const orgName = 'Department of Agriculture - FITS Tanza';
    const primary = '#166534'; // green-800
    const accent = '#047857'; // emerald-700
    const grayText = '#4b5563';
    const html = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Password Reset</title>
        </head>
        <body style="margin:0; padding:0; background:#f3f4f6; font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif; color:${grayText}">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f4f6; padding:24px 0;">
            <tr>
              <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="max-width:640px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,0.08)">
                  <tr>
                    <td style="padding:24px 24px; background:linear-gradient(135deg, ${primary}, ${accent}); color:#ffffff;">
                      <table width="100%">
                        <tr>
                          <td style="font-size:20px; font-weight:700; letter-spacing:.2px;">${orgName}</td>
                          <td align="right" style="font-size:12px; opacity:.9">Security Notification</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:32px 28px 8px 28px;">
                      <h1 style="margin:0 0 12px 0; font-size:22px; color:#111827;">Reset your password</h1>
                      <p style="margin:0 0 16px 0; line-height:1.6;">Hello ${user.firstName || user.username},</p>
                      <p style="margin:0 0 16px 0; line-height:1.6;">We received a request to reset the password for your Farmer Connect account. Click the button below to create a new password.</p>
                      <div style="margin:24px 0;">
                        <a href="${resetUrl}" style="background:${primary}; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:10px; font-weight:600; display:inline-block">Reset Password</a>
                      </div>
                      <p style="margin:0 0 12px 0; font-size:14px; line-height:1.6;">This link will expire in <strong>30 minutes</strong> for your security. If the button does not work, copy and paste the URL below into your browser:</p>
                      <p style="margin:0 0 16px 0; font-size:12px; color:#6b7280; word-break:break-all;">${resetUrl}</p>
                      <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />
                      <p style="margin:0 0 8px 0; font-size:12px; color:#6b7280;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 28px 28px 28px; background:#f9fafb; font-size:12px; color:#6b7280;">
                      <div style="margin-bottom:6px; font-weight:600; color:#111827">FITS Tanza Support</div>
                      <div>Email: fits.agri@gmail.com</div>
                      <div>Office Hours: Mon–Fri, 8:00 AM – 5:00 PM</div>
                      <div style="margin-top:12px;">© ${new Date().getFullYear()} ${orgName}. All rights reserved.</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    await sendMail({
      to: email,
  subject: 'FITS Tanza • Reset your Farmer Connect password',
      html,
      text: `Reset your password: ${resetUrl}`,
    });

    return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
