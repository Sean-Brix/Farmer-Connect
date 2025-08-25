import { PrismaClient } from '../../prisma/generated/index.js';

const prisma = new PrismaClient();

/**
 * Get all active inquiries for admin chat interface
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getActiveInquiries = async (req, res) => {
    try {
        // Fetch all active inquiries with user details and replies
        const inquiries = await prisma.inquiry.findMany({
            where: {
                status: {
                    in: ['PENDING', 'IN_PROGRESS', 'WAITING_USER']
                }
            },
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
                    orderBy: {
                        createdAt: 'asc'
                    },
                    include: {
                        sender: {
                            select: {
                                firstName: true,
                                surname: true
                            }
                        }
                    }
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
        });

        // Format inquiries for frontend consumption
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
            replies: inquiry.replies.map(reply => ({
                id: reply.id,
                message: reply.message,
                senderType: reply.senderType,
                senderName: reply.senderName || (reply.sender ? `${reply.sender.firstName} ${reply.sender.surname}` : 'Unknown'),
                createdAt: reply.createdAt
            }))
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
