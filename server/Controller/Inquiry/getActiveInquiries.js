import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all active inquiries for admin chat interface
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getActiveInquiries = async (req, res) => {
    try {
        // Optimize with parallel queries and selective fields
        const [inquiries, unreadCounts] = await Promise.all([
            // Fetch active inquiries with selective fields
            prisma.inquiry.findMany({
                where: {
                    status: {
                        in: ['PENDING', 'IN_PROGRESS', 'WAITING_USER']
                    }
                },
                select: {
                    id: true,
                    subject: true,
                    message: true,
                    status: true,
                    userId: true,
                    guestName: true,
                    guestEmail: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            surname: true,
                            email: true
                        }
                    },
                    replies: {
                        select: {
                            id: true,
                            message: true,
                            senderType: true,
                            senderName: true,
                            senderId: true,
                            createdAt: true,
                            sender: {
                                select: {
                                    firstName: true,
                                    surname: true
                                }
                            }
                        },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    },
                    attachments: {
                        select: { 
                            id: true, 
                            filename: true, 
                            mimetype: true, 
                            filesize: true, 
                            uploadedById: true, 
                            createdAt: true 
                        },
                        orderBy: { createdAt: 'asc' }
                    },
                    assignedTo: {
                        select: {
                            firstName: true,
                            surname: true
                        }
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            }),
            // Get unread counts in parallel
            prisma.inquiryReply.groupBy({
                by: ['inquiryId'],
                where: {
                    readByAdmin: false,
                    senderType: 'USER'
                },
                _count: true
            })
        ]);

        ]);

        // Create unread count map for faster lookup
        const unreadMap = new Map(
            unreadCounts.map(item => [item.inquiryId, item._count])
        );

        // Format inquiries for frontend consumption with unread counts
        const formattedInquiries = inquiries.map(inquiry => ({
            id: inquiry.id,
            subject: inquiry.subject,
            message: inquiry.message,
            status: inquiry.status,
            userId: inquiry.userId,
            user: inquiry.user,
            guestName: inquiry.guestName,
            guestEmail: inquiry.guestEmail,
            assignedTo: inquiry.assignedTo,
            createdAt: inquiry.createdAt,
            updatedAt: inquiry.updatedAt,
            unreadCount: unreadMap.get(inquiry.id) || 0,
            replies: inquiry.replies.map(reply => ({
                id: reply.id,
                message: reply.message,
                senderType: reply.senderType,
                senderName: reply.senderName || (reply.sender ? `${reply.sender.firstName} ${reply.sender.surname}` : 'Unknown'),
                createdAt: reply.createdAt
            })),
            attachments: (inquiry.attachments || []).map(a => ({
                ...a,
                streamUrl: `/api/inquiries/attachments/${a.id}`
            })),
        }));

        res.status(200).json(formattedInquiries);

    } catch (error) {
        console.error('Error fetching active inquiries:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch active inquiries'
        });
    }
};
