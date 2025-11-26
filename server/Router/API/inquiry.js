import express from 'express';
import { cookieAuth } from '../../Middlewares/Auth/cookieAuth.js';
import uploadInquiry from '../../Utils/multer_inquiry.js';
import { uploadInquiryAttachment as uploadAttachmentHandler } from '../../Controller/Inquiry/uploadAttachment.js';
import { getInquiryAttachment } from '../../Controller/Inquiry/getAttachment.js';

// New unified controller (HTTP Polling - no Socket.io)
import {
    createInquiry,
    sendMessage,
    getMessages,
    getInquiriesByStatus,
    getUserInquiries,
    getActiveInquiry,
    resolveInquiry,
    getUnreadCount
} from '../../Controller/Inquiry/inquiry.controller.js';

const router = express.Router();

/**
 * HTTP Polling Inquiry System Routes
 * All Socket.io functionality replaced with REST API
 */

// Create a new inquiry
router.post('/', cookieAuth, createInquiry);

// Send a message (user/admin) - now supports file attachments
router.post('/:inquiryId/messages', cookieAuth, uploadInquiry.array('files', 5), sendMessage);

// Get messages with polling support (?since=timestamp)
router.get('/:inquiryId/messages', cookieAuth, getMessages);

// Get unread message count (for badges)
router.get('/messages/unread-count', cookieAuth, getUnreadCount);

// Admin: Get inquiries by status (tabs)
router.get('/by-status', cookieAuth, getInquiriesByStatus);

// User: Get own inquiries
router.get('/my-inquiries', cookieAuth, getUserInquiries);

// User: Get active inquiry
router.get('/active/me', cookieAuth, getActiveInquiry);

// User: Resolve inquiry
router.patch('/:inquiryId/resolve', cookieAuth, resolveInquiry);

// Upload attachment
router.post('/:inquiryId/attachments', cookieAuth, uploadInquiry.single('file'), uploadAttachmentHandler);

// Get attachment
router.get('/attachments/:attachmentId', cookieAuth, getInquiryAttachment);

export default router;
