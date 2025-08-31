
import { PrismaClient } from '../../../prisma/generated/client.js';
import { ADMIN_EVENTS, ADMIN_LISTENERS, CLIENT_EVENTS, ROOMS, ERROR_MESSAGES } from '../../utils/socket-events.js';
import { 
    getInquiryStats, 
    formatInquiryForClient, 
    formatReplyForClient 
} from '../../utils/inquiry-helpers.js';

const prisma = new PrismaClient();

function admin_inquiry(io, socket) {
    console.log(`Admin connected: ${socket.user?.username || socket.user?.id} (ID: ${socket.id})`);
    
    // Join admin to admin room
    socket.join(ROOMS.ADMIN_ROOM);
    socket.join(`${ROOMS.ADMIN_PREFIX}${socket.user.id}`);
    
    // Emit connection confirmation
    socket.emit(ADMIN_EVENTS.CONNECTED, { 
        message: 'Connected to admin inquiry system',
        adminId: socket.user.id 
    });

    // Get inquiries with filters
    socket.on(ADMIN_LISTENERS.GET_INQUIRIES, async (data) => {
        try {
            const { status, assignedToMe, page = 1, limit = 50 } = data || {};
            
            const where = {};
            if (status) where.status = status.toUpperCase();
            if (assignedToMe) where.assignedToId = socket.user.id;

            const inquiries = await prisma.inquiry.findMany({
                where,
                include: {
                    user: {
                        select: { firstName: true, surname: true, username: true, email: true }
                    },
                    assignedTo: {
                        select: { firstName: true, surname: true, username: true }
                    },
                    replies: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        include: {
                            sender: {
                                select: { firstName: true, surname: true, username: true }
                            }
                        }
                    },
                    _count: {
                        select: { replies: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            });

            socket.emit(ADMIN_EVENTS.INQUIRIES_LIST, inquiries);
        } catch (error) {
            console.error('Error getting inquiries for admin:', error);
            socket.emit(ADMIN_EVENTS.ERROR, { message: ERROR_MESSAGES.DATABASE_ERROR });
        }
    });

    // Send reply to inquiry
    socket.on(ADMIN_LISTENERS.SEND_REPLY, async (data) => {
        try {
            const { inquiryId, message } = data;
            
            const inquiry = await prisma.inquiry.findUnique({
                where: { id: inquiryId },
                include: { user: true }
            });

            if (!inquiry) {
                socket.emit(ADMIN_EVENTS.ERROR, { message: ERROR_MESSAGES.INQUIRY_NOT_FOUND });
                return;
            }

            // Create reply
            const reply = await prisma.inquiryReply.create({
                data: {
                    message: message,
                    senderType: 'ADMIN',
                    senderId: socket.user.id,
                    senderName: `${socket.user.firstName} ${socket.user.surname}`,
                    inquiryId: inquiryId,
                    readByUser: false,
                    readByAdmin: true
                },
                include: {
                    sender: {
                        select: { firstName: true, surname: true, username: true }
                    }
                }
            });

            // Update inquiry status: on first admin reply move from PENDING -> IN_PROGRESS
            if (inquiry.status === 'PENDING') {
                await prisma.inquiry.update({
                    where: { id: inquiryId },
                    data: { 
                        status: 'IN_PROGRESS',
                        assignedToId: socket.user.id
                    }
                });
            }

            // Notify client
            io.to(`${ROOMS.USER_PREFIX}${inquiry.userId}`).emit(CLIENT_EVENTS.NEW_REPLY, {
                inquiryId: inquiryId,
                reply: reply
            });

            // Notify other admins
            socket.to(ROOMS.ADMIN_ROOM).emit(ADMIN_EVENTS.MESSAGE_UPDATE, {
                inquiryId: inquiryId,
                reply: reply
            });

            console.log(`Admin ${socket.user.username} replied to inquiry ${inquiryId}`);
            
        } catch (error) {
            console.error('Error sending admin reply:', error);
            socket.emit(ADMIN_EVENTS.ERROR, { message: ERROR_MESSAGES.DATABASE_ERROR });
        }
    });

    // Get inquiry statistics
    socket.on(ADMIN_LISTENERS.GET_STATS, async () => {
        try {
            const stats = await getInquiryStats();
            socket.emit(ADMIN_EVENTS.STATS_UPDATE, stats);
        } catch (error) {
            console.error('Error getting inquiry stats:', error);
            socket.emit(ADMIN_EVENTS.ERROR, { message: ERROR_MESSAGES.DATABASE_ERROR });
        }
    });

    // Handle disconnect
    socket.on(ADMIN_LISTENERS.DISCONNECT, () => {
        console.log(`Admin disconnected: ${socket.user?.username || socket.user?.id} (ID: ${socket.id})`);
    });
}

export { admin_inquiry };
