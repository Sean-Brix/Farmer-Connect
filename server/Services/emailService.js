import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter;

export async function getEmailTransporter() {
  if (transporter) return transporter;

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    // Fallback to Ethereal if SMTP not configured (dev only)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

export async function sendMail({ to, subject, html, text }) {
  const tx = await getEmailTransporter();
  const from = process.env.MAIL_FROM || 'no-reply@farmer-connect.local';
  const info = await tx.sendMail({ from, to, subject, html, text });
  // Log preview URL in dev for Ethereal
  if (nodemailer.getTestMessageUrl && process.env.SMTP_HOST == null) {
    const url = nodemailer.getTestMessageUrl(info);
    if (url) console.log('Email preview URL:', url);
  }
  return info;
}
