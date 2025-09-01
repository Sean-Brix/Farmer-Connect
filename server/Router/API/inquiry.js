import express from 'express';
import { getActiveInquiries } from '../../Controller/Inquiry/getActiveInquiries.js';
import getUserInquiries from '../../Controller/Inquiry/getUserInquiries.js';
import { resolveInquiry } from '../../Controller/Inquiry/resolveInquiry.js';
import { getActiveInquiryForUser } from '../../Controller/Inquiry/getActiveInquiryForUser.js';
import { getInquiriesByStatus } from '../../Controller/Inquiry/getInquiriesByStatus.js';
import { cookieAuth } from '../../Middlewares/Auth/cookieAuth.js';
import uploadInquiry from '../../Utils/multer_inquiry.js';
import { uploadInquiryAttachment as uploadAttachmentHandler } from '../../Controller/Inquiry/uploadAttachment.js';
import { getInquiryAttachment } from '../../Controller/Inquiry/getAttachment.js';

const router = express.Router();

// Get all active inquiries for admin chat interface
router.get('/active', cookieAuth, getActiveInquiries);

// Admin: get inquiries by status (tabs)
router.get('/by-status', cookieAuth, getInquiriesByStatus);

// Get user's own inquiries for client-side history
router.get('/my-inquiries', cookieAuth, getUserInquiries);

// Get user's current active inquiry
router.get('/active/me', cookieAuth, getActiveInquiryForUser);

// Mark inquiry as resolved
router.patch('/:inquiryId/resolve', cookieAuth, resolveInquiry);

// Upload an attachment for an inquiry (user-owned)
router.post('/:inquiryId/attachments', cookieAuth, uploadInquiry.single('file'), uploadAttachmentHandler);

// Stream an attachment (inline) by attachment ID
router.get('/attachments/:attachmentId', cookieAuth, getInquiryAttachment);

export default router;
