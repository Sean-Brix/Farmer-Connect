import prisma from '../../config/database.js';

/**
 * Helper functions for inquiry socket operations
 */

/**
 * Get inquiry statistics for admin dashboard
 */
export async function getInquiryStats() {
    try {
        const stats = await prisma.inquiry.groupBy({
            by: ['status'],
            _count: {
                id: true
            }
        });

        const formattedStats = {
            total: 0,
            pending: 0,
            inProgress: 0,
            waitingUser: 0,
            resolved: 0,
            cancelled: 0
        };

        stats.forEach(stat => {
            formattedStats.total += stat._count.id;
            switch (stat.status) {
                case 'PENDING':
                    formattedStats.pending = stat._count.id;
                    break;
                case 'IN_PROGRESS':
                    formattedStats.inProgress = stat._count.id;
                    break;
                case 'WAITING_USER':
                    formattedStats.waitingUser = stat._count.id;
                    break;
                case 'RESOLVED':
                    formattedStats.resolved = stat._count.id;
                    break;
                case 'CANCELLED':
                    formattedStats.cancelled = stat._count.id;
                    break;
            }
        });

        return formattedStats;
    } catch (error) {
        console.error('Error getting inquiry stats:', error);
        return null;
    }
}

/**
 * Validate if user owns the inquiry
 */
export async function validateInquiryOwnership(inquiryId, userId) {
    try {
        const inquiry = await prisma.inquiry.findFirst({
            where: { 
                id: inquiryId, 
                userId: userId 
            }
        });
        return !!inquiry;
    } catch (error) {
        console.error('Error validating inquiry ownership:', error);
        return false;
    }
}

/**
 * Get unread message count for user
 */
export async function getUnreadCount(userId) {
    try {
        const count = await prisma.inquiryReply.count({
            where: {
                inquiry: {
                    userId: userId
                },
                senderType: { not: 'USER' },
                readByUser: false
            }
        });
        return count;
    } catch (error) {
        console.error('Error getting unread count:', error);
        return 0;
    }
}

/**
 * Format inquiry for client response
 */
export function formatInquiryForClient(inquiry) {
    return {
        id: inquiry.id,
        subject: inquiry.subject,
        message: inquiry.message,
        status: inquiry.status.toLowerCase(),
        createdAt: inquiry.createdAt,
        updatedAt: inquiry.updatedAt,
        assignedTo: inquiry.assignedTo ? {
            name: `${inquiry.assignedTo.firstName} ${inquiry.assignedTo.surname}`,
            username: inquiry.assignedTo.username
        } : null,
        replyCount: inquiry._count?.replies || 0,
        hasUnread: inquiry.replies?.some(reply => reply.senderType !== 'USER' && !reply.readByUser) || false
    };
}

/**
 * Format reply for client response
 */
export function formatReplyForClient(reply) {
    return {
        id: reply.id,
        message: reply.message,
        senderType: reply.senderType.toLowerCase(),
        senderName: reply.senderName || (reply.sender ? `${reply.sender.firstName} ${reply.sender.surname}` : 'Unknown'),
        createdAt: reply.createdAt,
        isRead: reply.readByUser
    };
}

/**
 * Auto-assign inquiry to available admin
 */
export async function autoAssignInquiry(inquiryId) {
    try {
        // Get admin with least active inquiries
        const adminStats = await prisma.account.findMany({
            where: {
                access: { in: ['Admin', 'Super_Admin'] }
            },
            include: {
                assignedInquiries: {
                    where: {
                        status: { in: ['PENDING', 'IN_PROGRESS', 'WAITING_USER'] }
                    }
                }
            }
        });

        if (adminStats.length === 0) return null;

        // Sort by workload (least inquiries first)
        adminStats.sort((a, b) => a.assignedInquiries.length - b.assignedInquiries.length);
        const selectedAdmin = adminStats[0];

        // Assign inquiry
        await prisma.inquiry.update({
            where: { id: inquiryId },
            data: { 
                assignedToId: selectedAdmin.id,
                status: 'IN_PROGRESS'
            }
        });

        return selectedAdmin;
    } catch (error) {
        console.error('Error auto-assigning inquiry:', error);
        return null;
    }
}
