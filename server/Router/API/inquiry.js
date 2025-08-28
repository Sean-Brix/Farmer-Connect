import express from 'express';
import { getActiveInquiries } from '../../Controller/Inquiry/getActiveInquiries.js';
import getUserInquiries from '../../Controller/Inquiry/getUserInquiries.js';
import { resolveInquiry } from '../../Controller/Inquiry/resolveInquiry.js';
import { cookieAuth } from '../../Middlewares/Auth/cookieAuth.js';

const router = express.Router();

// Get all active inquiries for admin chat interface
router.get('/active', cookieAuth, getActiveInquiries);

// Get user's own inquiries for client-side history
router.get('/my-inquiries', cookieAuth, getUserInquiries);

// Mark inquiry as resolved
router.patch('/:inquiryId/resolve', cookieAuth, resolveInquiry);

export default router;
