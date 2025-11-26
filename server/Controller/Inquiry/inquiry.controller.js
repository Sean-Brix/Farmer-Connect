/**
 * Inquiry Controller - Complete HTTP Polling Implementation
 * Replaces Socket.io with REST API endpoints
 * 
 * Features:
 * - Create inquiry
 * - Send messages (user/admin)
 * - Get messages with polling support
 * - Status management (PENDING -> IN_PROGRESS -> RESOLVED)
 * - Attachment handling
 * - Read receipts
 */

// PrismaClient import removed - using centralized db
import prisma from '../../config/database.js';
import auditLogger from '../../Services/auditLogger.js';

// Using centralized prisma instance

/**
 * Create a new inquiry
 * POST /api/inquiries
 */
export const createInquiry = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const userId = req.user.id;

        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Subject and message are required'
            });
        }

        // Create inquiry with initial message as InquiryReply
        const inquiry = await prisma.inquiry.create({
            data: {
                subject: subject.trim(),
                message: message.trim(),
                userId,
                status: 'PENDING',
                replies: {
                    create: {
                        message: message.trim(),
                        senderId: userId,
                        senderType: 'USER',
                        senderName: `${req.user.firstName} ${req.user.surname}`.trim(),
                        readByUser: true,
                        readByAdmin: false
                    }
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        surname: true,
                        username: true,
                        email: true
                    }
                },
                replies: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        // Non-blocking audit log (fire-and-forget)
        auditLogger.log(
            'Inquiry_Created',
            `inquiry:${inquiry.id}`,
            { inquiryId: inquiry.id, subject },
            userId
        ).catch(err => console.error('Audit log failed:', err));

        return res.status(201).json({
            success: true,
            message: 'Inquiry created successfully',
            data: inquiry
        });

    } catch (error) {
        console.error('[createInquiry] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create inquiry',
            error: error.message
        });
    }
};

/**
 * Send a message in an inquiry
 * POST /api/inquiries/:inquiryId/messages
 * Supports file attachments via multer (req.files)
 */
export const sendMessage = async (req, res) => {
    try {
        const { inquiryId } = req.params;
        const { message } = req.body;
        const userId = req.user.id;
        const userRole = req.user.access;
        const files = req.files || []; // Files from multer

        // Allow either message or files (or both)
        if ((!message || !message.trim()) && files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Message or attachment is required'
            });
        }

        // Get inquiry with user info
        const inquiry = await prisma.inquiry.findUnique({
            where: { id: inquiryId },
            include: { user: true }
        });

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        // Permission check
        const isOwner = inquiry.userId === userId;
        const isAdmin = ['Admin', 'Super_Admin'].includes(userRole);

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to reply to this inquiry'
            });
        }

        // Determine sender type
        const senderType = isAdmin ? 'ADMIN' : 'USER';
        
        // Create message with attachments
        const messageText = message?.trim() || '';
        
        const newMessage = await prisma.inquiryReply.create({
            data: {
                inquiryId,
                senderId: userId,
                senderType,
                senderName: `${req.user.firstName} ${req.user.surname}`.trim(),
                message: messageText || '(Attachment)',
                readByUser: isOwner,
                readByAdmin: isAdmin
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        surname: true,
                        username: true,
                        picturePath: true
                    }
                }
            }
        });

        // Create attachment records for each file
        const attachmentRecords = [];
        for (const file of files) {
            try {
                const attachment = await prisma.inquiryAttachment.create({
                    data: {
                        inquiryId,
                        filename: file.originalname || 'attachment',
                        filepath: null,
                        filesize: file.size,
                        mimetype: file.mimetype,
                        uploadedById: userId,
                        fileData: file.buffer // Store file in DB
                    }
                });
                
                attachmentRecords.push({
                    ...attachment,
                    streamUrl: `/api/inquiries/attachments/${attachment.id}`
                });
            } catch (err) {
                // If fileData column doesn't exist yet, create without it
                if (String(err?.message || '').includes('Unknown argument `fileData`')) {
                    const attachment = await prisma.inquiryAttachment.create({
                        data: {
                            inquiryId,
                            filename: file.originalname || 'attachment',
                            filepath: null,
                            filesize: file.size,
                            mimetype: file.mimetype,
                            uploadedById: userId
                        }
                    });
                    
                    attachmentRecords.push({
                        ...attachment,
                        streamUrl: `/api/inquiries/attachments/${attachment.id}`
                    });
                } else {
                    throw err;
                }
            }
        }

        // Update inquiry status
        let newStatus = inquiry.status;
        if (isAdmin && inquiry.status === 'PENDING') {
            newStatus = 'IN_PROGRESS';
        }

        await prisma.inquiry.update({
            where: { id: inquiryId },
            data: {
                status: newStatus,
                updatedAt: new Date(),
                ...(isAdmin && inquiry.status === 'PENDING' && { assignedToId: userId })
            }
        });

        // Non-blocking audit log (fire-and-forget)
        auditLogger.log(
            senderType === 'ADMIN' ? 'Inquiry_Admin_Reply' : 'Inquiry_Message_Sent',
            `inquiry:${inquiryId}`,
            { inquiryId, messageId: newMessage.id, attachments: attachmentRecords.length },
            userId
        ).catch(err => console.error('Audit log failed:', err));

        return res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: {
                id: newMessage.id,
                inquiryId: newMessage.inquiryId,
                senderId: newMessage.senderId,
                senderType: newMessage.senderType,
                senderName: newMessage.senderName,
                message: newMessage.message,
                createdAt: newMessage.createdAt,
                sender: newMessage.sender,
                inquiryStatus: newStatus,
                attachments: attachmentRecords // Include attachment info
            }
        });

    } catch (error) {
        console.error('[sendMessage] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

/**
 * Get messages for an inquiry (with polling support)
 * GET /api/inquiries/:inquiryId/messages?since=timestamp
 */
export const getMessages = async (req, res) => {
    try {
        const { inquiryId } = req.params;
        const { since } = req.query;
        const userId = req.user.id;
        const userRole = req.user.access;

        // Get inquiry
        const inquiry = await prisma.inquiry.findUnique({
            where: { id: inquiryId },
            select: {
                id: true,
                userId: true,
                assignedToId: true,
                status: true
            }
        });

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        // Permission check
        const isOwner = inquiry.userId === userId;
        const isAdmin = ['Admin', 'Super_Admin'].includes(userRole);
        const isAssigned = inquiry.assignedToId === userId;

        if (!isOwner && !isAdmin && !isAssigned) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this inquiry'
            });
        }

        // Build query
        const whereClause = {
            inquiryId,
            ...(since && { createdAt: { gt: new Date(since) } })
        };

        // Fetch messages
        const messages = await prisma.inquiryReply.findMany({
            where: whereClause,
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        surname: true,
                        username: true,
                        picturePath: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Get attachments for this inquiry
        const attachments = await prisma.inquiryAttachment.findMany({
            where: { inquiryId },
            select: {
                id: true,
                filename: true,
                filesize: true,
                mimetype: true,
                createdAt: true,
                uploadedById: true
            },
            orderBy: { createdAt: 'asc' }
        });

        // Add streamUrl to attachments
        const attachmentsWithUrl = attachments.map(att => ({
            ...att,
            streamUrl: `/api/inquiries/attachments/${att.id}`
        }));

        // Merge attachments into messages (group by timestamp proximity)
        const messagesWithAttachments = messages.map(msg => ({
            ...msg,
            attachments: attachmentsWithUrl.filter(att => 
                Math.abs(new Date(att.createdAt) - new Date(msg.createdAt)) < 5000 // 5 second window
            )
        }));

        // Mark messages as read
        if (messagesWithAttachments.length > 0) {
            const unreadIds = messagesWithAttachments
                .filter(msg => isOwner ? !msg.readByUser : !msg.readByAdmin)
                .map(msg => msg.id);

            if (unreadIds.length > 0) {
                await prisma.inquiryReply.updateMany({
                    where: { id: { in: unreadIds } },
                    data: isOwner
                        ? { readByUser: true, readAt: new Date() }
                        : { readByAdmin: true, readAt: new Date() }
                });
            }
        }

        return res.status(200).json({
            success: true,
            data: messagesWithAttachments,
            meta: {
                count: messagesWithAttachments.length,
                since: since || null,
                inquiryStatus: inquiry.status
            }
        });

    } catch (error) {
        console.error('[getMessages] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
};

/**
 * Get inquiry list for admin
 * GET /api/inquiries/by-status?status=PENDING
 */
export const getInquiriesByStatus = async (req, res) => {
    try {
        const { status } = req.query;
        const userRole = req.user.access;

        if (!['Admin', 'Super_Admin'].includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const validStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const inquiries = await prisma.inquiry.findMany({
            where: status ? { status } : {},
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        surname: true,
                        email: true
                    }
                },
                replies: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        message: true,
                        createdAt: true,
                        senderType: true
                    }
                },
                _count: {
                    select: {
                        replies: {
                            where: { readByAdmin: false, senderType: 'USER' }
                        }
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Format response
        const formatted = inquiries.map(inquiry => ({
            id: inquiry.id,
            inquiryId: inquiry.id,
            userId: inquiry.userId,
            subject: inquiry.subject,
            message: inquiry.message,
            status: inquiry.status,
            createdAt: inquiry.createdAt,
            updatedAt: inquiry.updatedAt,
            user: inquiry.user,
            userName: inquiry.user ? `${inquiry.user.firstName} ${inquiry.user.surname}` : null,
            lastMessage: inquiry.replies[0]?.message || inquiry.message,
            lastMessageTime: inquiry.replies[0]?.createdAt || inquiry.createdAt,
            unreadCount: inquiry._count.replies
        }));

        return res.status(200).json({
            success: true,
            items: formatted
        });

    } catch (error) {
        console.error('[getInquiriesByStatus] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch inquiries',
            error: error.message
        });
    }
};

/**
 * Get user's own inquiries
 * GET /api/inquiries/my-inquiries
 */
export const getUserInquiries = async (req, res) => {
    try {
        const userId = req.user.id;

        const inquiries = await prisma.inquiry.findMany({
            where: { userId },
            include: {
                replies: {
                    orderBy: { createdAt: 'asc' }
                },
                _count: {
                    select: {
                        replies: {
                            where: { readByUser: false, senderType: 'ADMIN' }
                        }
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        const formatted = inquiries.map(inquiry => ({
            ...inquiry,
            unreadCount: inquiry._count.replies
        }));

        return res.status(200).json({
            success: true,
            data: formatted
        });

    } catch (error) {
        console.error('[getUserInquiries] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch inquiries',
            error: error.message
        });
    }
};

/**
 * Get active inquiry for user
 * GET /api/inquiries/active/me
 */
export const getActiveInquiry = async (req, res) => {
    try {
        const userId = req.user.id;

        const inquiry = await prisma.inquiry.findFirst({
            where: {
                userId,
                status: { in: ['PENDING', 'IN_PROGRESS'] }
            },
            include: {
                replies: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                firstName: true,
                                surname: true,
                                username: true
                            }
                        }
                    }
                },
                attachments: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return res.status(200).json({
            success: true,
            data: inquiry
        });

    } catch (error) {
        console.error('[getActiveInquiry] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch active inquiry',
            error: error.message
        });
    }
};

/**
 * Resolve inquiry (user only)
 * PATCH /api/inquiries/:inquiryId/resolve
 */
export const resolveInquiry = async (req, res) => {
    try {
        const { inquiryId } = req.params;
        const userId = req.user.id;

        const inquiry = await prisma.inquiry.findUnique({
            where: { id: inquiryId },
            select: { userId: true, status: true }
        });

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        if (inquiry.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Only the inquiry owner can resolve it'
            });
        }

        if (inquiry.status === 'RESOLVED') {
            return res.status(400).json({
                success: false,
                message: 'Inquiry is already resolved'
            });
        }

        const updated = await prisma.inquiry.update({
            where: { id: inquiryId },
            data: {
                status: 'RESOLVED',
                resolvedById: userId,
                resolvedAt: new Date()
            }
        });

        // Non-blocking audit log (fire-and-forget)
        auditLogger.log(
            'Inquiry_Resolved',
            `inquiry:${inquiryId}`,
            { inquiryId },
            userId
        ).catch(err => console.error('Audit log failed:', err));

        return res.status(200).json({
            success: true,
            message: 'Inquiry resolved successfully',
            data: updated
        });

    } catch (error) {
        console.error('[resolveInquiry] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to resolve inquiry',
            error: error.message
        });
    }
};

/**
 * Get unread message count
 * GET /api/inquiries/messages/unread-count
 */
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const count = await prisma.inquiryReply.count({
            where: {
                inquiry: { userId },
                senderType: 'ADMIN',
                readByUser: false
            }
        });

        return res.status(200).json({
            success: true,
            data: { unreadCount: count }
        });

    } catch (error) {
        console.error('[getUnreadCount] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get unread count',
            error: error.message
        });
    }
};
