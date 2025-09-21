
import { PrismaClient } from '@prisma/client';
import { CLIENT_EVENTS, CLIENT_LISTENERS, ADMIN_EVENTS, ROOMS, ERROR_MESSAGES } from '../../utils/socket-events.js';
import { 
    getUnreadCount, 
    formatInquiryForClient, 
    formatReplyForClient,
    autoAssignInquiry 
} from '../../utils/inquiry-helpers.js';

const prisma = new PrismaClient();

function client_inquiry(io, socket) {
    console.log(`Client connected: ${socket.user?.username || socket.user?.id} (ID: ${socket.id})`);
    
    // Join user to their personal room for direct communication
    socket.join(`${ROOMS.USER_PREFIX}${socket.user.id}`);
    
    // Emit connection confirmation
    socket.emit(CLIENT_EVENTS.CONNECTED, { 
        message: 'Connected to inquiry system',
        userId: socket.user.id 
    });
    
    // Get user's inquiries
    socket.on(CLIENT_LISTENERS.GET_INQUIRIES, async () => {
        try {
            const inquiries = await prisma.inquiry.findMany({
                where: { userId: socket.user.id },
                include: {
                    replies: {
                        orderBy: { createdAt: 'asc' },
                        include: {
                            sender: {
                                select: { firstName: true, surname: true, username: true }
                            }
                        }
                    },
                    assignedTo: {
                        select: { firstName: true, surname: true, username: true }
                    },
                    _count: {
                        select: { replies: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            socket.emit(CLIENT_EVENTS.INQUIRIES_LIST, inquiries);
        } catch (error) {
            console.error('Error getting inquiries:', error);
            socket.emit(CLIENT_EVENTS.ERROR, { message: ERROR_MESSAGES.DATABASE_ERROR });
        }
    });

    // Create new inquiry (automatically for first message)
    socket.on(CLIENT_LISTENERS.NEW_INQUIRY, async (data) => {
        try {
            const { message, subject } = data;
            
            // Auto-generate subject from message if not provided
            const inquirySubject = subject || (message.length > 50 ? message.substring(0, 50) + '...' : message);
            
            const newInquiry = await prisma.inquiry.create({
                data: {
                    subject: inquirySubject,
                    message: message,
                    status: 'PENDING',
                    userId: socket.user.id
                },
                include: {
                    user: {
                        select: { firstName: true, surname: true, username: true, email: true }
                    },
                    replies: true,
                    _count: {
                        select: { replies: true }
                    }
                }
            });

            // Create initial reply with user's message
            const initialReply = await prisma.inquiryReply.create({
                data: {
                    message: message,
                    senderType: 'USER',
                    senderId: socket.user.id,
                    senderName: `${socket.user.firstName} ${socket.user.surname}`,
                    inquiryId: newInquiry.id,
                    readByUser: true,
                    readByAdmin: false
                }
            });

            // Emit to client
            socket.emit(CLIENT_EVENTS.INQUIRY_CREATED, {
                inquiry: newInquiry,
                reply: initialReply
            });

            // Notify admins about new inquiry
            io.to(ROOMS.ADMIN_ROOM).emit(ADMIN_EVENTS.NEW_INQUIRY, {
                inquiry: newInquiry,
                reply: initialReply
            });

            console.log(`New inquiry created by ${socket.user.username}: ${inquirySubject}`);
            
        } catch (error) {
            console.error('Error creating inquiry:', error);
            socket.emit(CLIENT_EVENTS.ERROR, { message: ERROR_MESSAGES.DATABASE_ERROR });
        }
    });

    // Send message to existing inquiry
    socket.on(CLIENT_LISTENERS.SEND_MESSAGE, async (data) => {
        try {
            const { inquiryId, message } = data;
            
            // Verify inquiry belongs to user
            const inquiry = await prisma.inquiry.findFirst({
                where: { 
                    id: inquiryId, 
                    userId: socket.user.id 
                },
                include: {
                    assignedTo: true
                }
            });

            if (!inquiry) {
                socket.emit(CLIENT_EVENTS.ERROR, { message: ERROR_MESSAGES.INQUIRY_NOT_FOUND });
                return;
            }

            // Create reply
            const reply = await prisma.inquiryReply.create({
                data: {
                    message: message,
                    senderType: 'USER',
                    senderId: socket.user.id,
                    senderName: `${socket.user.firstName} ${socket.user.surname}`,
                    inquiryId: inquiryId,
                    readByUser: true,
                    readByAdmin: false
                },
                include: {
                    sender: {
                        select: { firstName: true, surname: true, username: true }
                    }
                }
            });

            // Update inquiry status if it was resolved
            if (inquiry.status === 'RESOLVED') {
                await prisma.inquiry.update({
                    where: { id: inquiryId },
                    data: { status: 'IN_PROGRESS' }
                });
            }

            // Emit to client
            socket.emit(CLIENT_EVENTS.MESSAGE_SENT, {
                inquiryId: inquiryId,
                reply: reply
            });

            // Notify assigned admin if any
            if (inquiry.assignedTo) {
                io.to(`${ROOMS.ADMIN_PREFIX}${inquiry.assignedTo.id}`).emit(ADMIN_EVENTS.NEW_MESSAGE, {
                    inquiryId: inquiryId,
                    reply: reply
                });
            }

            // Notify all admins
            io.to(ROOMS.ADMIN_ROOM).emit(ADMIN_EVENTS.MESSAGE_UPDATE, {
                inquiryId: inquiryId,
                lastMessage: message,
                timestamp: reply.createdAt
            });

            console.log(`Message sent to inquiry ${inquiryId} by ${socket.user.username}`);
            
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit(CLIENT_EVENTS.ERROR, { message: ERROR_MESSAGES.DATABASE_ERROR });
        }
    });

    // Get conversation for specific inquiry
    socket.on(CLIENT_LISTENERS.GET_CONVERSATION, async (data) => {
        try {
            const { inquiryId } = data;
            
            // Verify inquiry belongs to user
            const inquiry = await prisma.inquiry.findFirst({
                where: { 
                    id: inquiryId, 
                    userId: socket.user.id 
                },
                include: {
                    replies: {
                        orderBy: { createdAt: 'asc' },
                        include: {
                            sender: {
                                select: { firstName: true, surname: true, username: true }
                            }
                        }
                    },
                    assignedTo: {
                        select: { firstName: true, surname: true, username: true }
                    }
                }
            });

            if (!inquiry) {
                socket.emit(CLIENT_EVENTS.ERROR, { message: ERROR_MESSAGES.INQUIRY_NOT_FOUND });
                return;
            }

            // Mark replies as read by user
            await prisma.inquiryReply.updateMany({
                where: { 
                    inquiryId: inquiryId,
                    senderType: { not: 'USER' }
                },
                data: { readByUser: true }
            });

            socket.emit(CLIENT_EVENTS.CONVERSATION, {
                inquiry: inquiry,
                replies: inquiry.replies
            });
            
        } catch (error) {
            console.error('Error getting conversation:', error);
            socket.emit(CLIENT_EVENTS.ERROR, { message: ERROR_MESSAGES.DATABASE_ERROR });
        }
    });

    // Close/cancel inquiry
    socket.on(CLIENT_LISTENERS.CLOSE_INQUIRY, async (data) => {
        try {
            const { inquiryId } = data;
            
            // Verify inquiry belongs to user
            const inquiry = await prisma.inquiry.findFirst({
                where: { 
                    id: inquiryId, 
                    userId: socket.user.id 
                }
            });

            if (!inquiry) {
                socket.emit(CLIENT_EVENTS.ERROR, { message: ERROR_MESSAGES.INQUIRY_NOT_FOUND });
                return;
            }

            // Update inquiry status
            await prisma.inquiry.update({
                where: { id: inquiryId },
                data: { status: 'CANCELLED' }
            });

            socket.emit(CLIENT_EVENTS.CLOSED, { inquiryId });

            // Notify admins
            io.to(ROOMS.ADMIN_ROOM).emit(ADMIN_EVENTS.INQUIRY_CLOSED, {
                inquiryId: inquiryId,
                closedBy: 'user'
            });

            console.log(`Inquiry ${inquiryId} closed by ${socket.user.username}`);
            
        } catch (error) {
            console.error('Error closing inquiry:', error);
            socket.emit(CLIENT_EVENTS.ERROR, { message: ERROR_MESSAGES.DATABASE_ERROR });
        }
    });

    // Mark inquiry as read
    socket.on(CLIENT_LISTENERS.MARK_READ, async (data) => {
        try {
            const { inquiryId } = data;
            
            await prisma.inquiryReply.updateMany({
                where: { 
                    inquiryId: inquiryId,
                    senderType: { not: 'USER' }
                },
                data: { readByUser: true }
            });

            socket.emit(CLIENT_EVENTS.MARKED_READ, { inquiryId });
            
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    });

    // Handle user attachment upload notification
    socket.on('inquiry_attachment_uploaded', async (data) => {
        try {
            const { inquiryId, filename, streamUrl, filesize, mimetype } = data;
            
            console.log(`User ${socket.user.username} uploaded attachment to inquiry ${inquiryId}`);
            
            // Notify all admins about the new attachment
            io.to(ROOMS.ADMIN_ROOM).emit('admin_inquiry:attachment', {
                inquiryId: inquiryId,
                filename: filename,
                streamUrl: streamUrl,
                filepath: streamUrl, // For backward compatibility
                filesize: filesize,
                mimetype: mimetype,
                timestamp: new Date().toISOString(),
                userName: `${socket.user.firstName} ${socket.user.surname}`
            });
            
        } catch (error) {
            console.error('Error handling user attachment:', error);
        }
    });

    // Handle disconnect
    socket.on(CLIENT_LISTENERS.DISCONNECT, () => {
        console.log(`Client disconnected: ${socket.user?.username || socket.user?.id} (ID: ${socket.id})`);
    });
}

export { client_inquiry };
