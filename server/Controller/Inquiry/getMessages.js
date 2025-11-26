import prisma from '../../config/database.js';

/**
 * Get messages for an inquiry (replaces socket polling)
 * GET /api/inquiry/:inquiryId/messages
 */
export async function getInquiryMessages(req, res) {
    try {
        const { inquiryId } = req.params;
        const { since } = req.query; // Optional: get messages after this timestamp
        const userId = req.user.id;
        const userRole = req.user.access;

        // Verify inquiry exists and user has access
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

        // Check access
        const isOwner = inquiry.userId === userId;
        const isAssigned = inquiry.assignedToId === userId;
        const isAdmin = ['Admin', 'Super_Admin'].includes(userRole);

        if (!isOwner && !isAdmin && !isAssigned) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view these messages'
            });
        }

        // Build where clause
        const whereClause = {
            inquiryId,
            ...(since && {
                createdAt: {
                    gt: new Date(since)
                }
            })
        };

        // Get messages
        const messages = await prisma.inquiryReply.findMany({
            where: whereClause,
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        surname: true,
                        picturePath: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Mark messages as read if user is viewing them
        if (messages.length > 0) {
            const unreadMessageIds = messages
                .filter(msg => {
                    if (isOwner) {
                        return !msg.readByUser && msg.senderId !== userId;
                    } else {
                        return !msg.readByAdmin && msg.senderId !== userId;
                    }
                })
                .map(msg => msg.id);

            if (unreadMessageIds.length > 0) {
                await prisma.inquiryReply.updateMany({
                    where: {
                        id: { in: unreadMessageIds }
                    },
                    data: isOwner 
                        ? { readByUser: true, readAt: new Date() }
                        : { readByAdmin: true, readAt: new Date() }
                });
            }
        }

        // Format messages
        const formattedMessages = messages.map(msg => ({
            id: msg.id,
            inquiryId: msg.inquiryId,
            senderId: msg.senderId,
            senderType: msg.senderType,
            senderName: msg.senderName || (msg.sender ? `${msg.sender.firstName} ${msg.sender.surname}` : 'Unknown'),
            senderUsername: msg.sender?.username,
            senderPicture: msg.sender?.picturePath,
            message: msg.message,
            isRead: isOwner ? msg.readByUser : msg.readByAdmin,
            createdAt: msg.createdAt,
            timestamp: msg.createdAt
        }));

        return res.json({
            success: true,
            data: formattedMessages,
            count: formattedMessages.length,
            inquiryId
        });

    } catch (error) {
        console.error('[getInquiryMessages] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
}

/**
 * Get unread message count for user's inquiries
 * GET /api/inquiry/messages/unread-count
 */
export async function getUnreadMessageCount(req, res) {
    try {
        const userId = req.user.id;
        const userRole = req.user.access;
        const isAdmin = ['Admin', 'Super_Admin'].includes(userRole);

        let unreadCount = 0;

        if (isAdmin) {
            // For admins: count unread messages in assigned or all inquiries
            unreadCount = await prisma.inquiryReply.count({
                where: {
                    readByAdmin: false,
                    senderType: 'USER', // Only count user messages
                    inquiry: {
                        OR: [
                            { assignedToId: userId },
                            { assignedToId: null }
                        ]
                    }
                }
            });
        } else {
            // For users: count unread admin messages in their inquiries
            unreadCount = await prisma.inquiryReply.count({
                where: {
                    readByUser: false,
                    senderType: 'ADMIN', // Only count admin messages
                    inquiry: {
                        userId: userId
                    }
                }
            });
        }

        return res.json({
            success: true,
            data: { unreadCount },
            message: 'Unread count fetched successfully'
        });

    } catch (error) {
        console.error('[getUnreadMessageCount] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch unread count',
            error: error.message
        });
    }
}
