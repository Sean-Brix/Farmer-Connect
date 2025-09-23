import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new inquiry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createInquiry = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const userId = req.user.id; // From cookieAuth middleware

        // Validate required fields
        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                message: 'Subject and message are required'
            });
        }

        // Create the inquiry
        const inquiry = await prisma.inquiry.create({
            data: {
                subject,
                message,
                userId,
                status: 'PENDING'
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
                attachments: {
                    orderBy: { createdAt: 'asc' },
                    select: { id: true, filename: true, mimetype: true, filesize: true, uploadedById: true, createdAt: true }
                }
            }
        });

        // Format the response similar to getActiveInquiries
        const formattedInquiry = {
            id: inquiry.id,
            subject: inquiry.subject,
            message: inquiry.message,
            status: inquiry.status,
            userId: inquiry.userId,
            user: inquiry.user,
            guestName: inquiry.guestName,
            guestEmail: inquiry.guestEmail,
            createdAt: inquiry.createdAt,
            updatedAt: inquiry.updatedAt,
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
        };

        res.status(201).json({
            success: true,
            data: formattedInquiry,
            message: 'Inquiry created successfully'
        });

    } catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to create inquiry'
        });
    }
};
