import dotenv from 'dotenv';
import { client_inquiry } from '../Sockets/handlers/client/client_inquiry.js';
import { admin_inquiry } from '../Sockets/handlers/admin/admin_inquiry.js';
import { socketAuth, validateUser } from '../Sockets/middleware/auth.js';
import { ROOMS } from '../Sockets/utils/socket-events.js';
import socketSessionManager from '../Sockets/utils/session-manager.js';
import socketLogoutService from '../Services/socketLogoutService.js';

// Database is now ready - re-enabling database functionality
import { PrismaClient } from '../prisma/generated/index.js';
const prisma = new PrismaClient();

// Database helper functions - Re-enabled
async function saveUserMessage(messageData) {
    try {
        // Check if there's an existing inquiry for this user
        let inquiry = await prisma.inquiry.findFirst({
            where: {
                userId: messageData.userId,
                status: {
                    in: ['PENDING', 'IN_PROGRESS', 'WAITING_USER']
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // If no active inquiry exists, create a new one
        if (!inquiry) {
            inquiry = await prisma.inquiry.create({
                data: {
                    subject: `Chat Inquiry - ${new Date().toLocaleDateString()}`,
                    message: messageData.message,
                    userId: messageData.userId,
                    status: 'PENDING'
                }
            });
        }

        // Add the message as a reply to the inquiry
        const reply = await prisma.inquiryReply.create({
            data: {
                message: messageData.message,
                senderId: messageData.userId,
                senderType: 'USER',
                senderName: messageData.userName,
                inquiryId: inquiry.id
            }
        });

        return inquiry;
    } catch (error) {
        console.error('Error saving user message:', error);
        throw error;
    }
}

async function saveAdminSupportRequest(requestData) {
    try {
        // Create or find existing inquiry
        let inquiry = await prisma.inquiry.findFirst({
            where: {
                userId: requestData.userId,
                status: {
                    in: ['PENDING', 'IN_PROGRESS', 'WAITING_USER']
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!inquiry) {
            inquiry = await prisma.inquiry.create({
                data: {
                    subject: `Admin Support Request - ${new Date().toLocaleDateString()}`,
                    message: requestData.message,
                    userId: requestData.userId,
                    status: 'PENDING'
                }
            });
        } else {
            // Update status to show admin was requested
            inquiry = await prisma.inquiry.update({
                where: { id: inquiry.id },
                data: { status: 'IN_PROGRESS' }
            });
        }

        return inquiry;
    } catch (error) {
        console.error('Error saving admin support request:', error);
        throw error;
    }
}

async function saveAdminReply(replyData, adminId) {
    try {
        let inquiry;
        
        // First try to find by inquiry ID if provided
        if (replyData.inquiryId) {
            inquiry = await prisma.inquiry.findUnique({
                where: { id: replyData.inquiryId }
            });
        }
        
        // If not found by inquiry ID, find the active inquiry for this user
        if (!inquiry) {
            inquiry = await prisma.inquiry.findFirst({
                where: {
                    userId: replyData.userId,
                    status: {
                        in: ['PENDING', 'IN_PROGRESS', 'WAITING_USER']
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }

        if (!inquiry) {
            throw new Error('No active inquiry found for user');
        }

        // Save admin reply
        const reply = await prisma.inquiryReply.create({
            data: {
                message: replyData.message,
                senderId: adminId,
                senderType: 'ADMIN',
                inquiryId: inquiry.id
            }
        });

        // Update inquiry status
        await prisma.inquiry.update({
            where: { id: inquiry.id },
            data: { 
                status: 'WAITING_USER',
                assignedToId: adminId,
                updatedAt: new Date()
            }
        });

        return reply;
    } catch (error) {
        console.error('Error saving admin reply:', error);
        throw error;
    }
}

function setup_socket(io){
    dotenv.config();
    
    // Initialize socket logout service
    socketLogoutService.init(io);
    
    // Apply authentication middleware
    io.use(socketAuth);
    io.use(validateUser);

    // Connection event
    io.on('connection', (socket) => {
        
        // Register socket connection for session management
        socketSessionManager.addSocket(socket.user.id, socket.id);
        
        // Join user-specific room for targeted messaging
        socket.join(`user_${socket.user.id}`);
        
        // Handle real-time chat messages
        socket.on('chat_message', async (data) => {
            console.log('Chat message received:', data);
            
            try {
                // Store user info for the message
                const messageData = {
                    ...data,
                    userId: socket.user.id,
                    userName: socket.user.firstName + ' ' + socket.user.surname,
                    userEmail: socket.user.email,
                    socketId: socket.id
                };
                
                if (data.mode === 'user') {
                    // User message - save to database and forward to ALL admins
                    try {
                        await saveUserMessage(messageData);
                        // Broadcast to all admins (user messages should go to all admins)
                        io.to('admin_room').emit('chat_message_received', messageData);
                    } catch (error) {
                        console.error('Database save failed, but still forwarding message:', error);
                        // Broadcast to all admins (user messages should go to all admins)
                        io.to('admin_room').emit('chat_message_received', messageData);
                    }
                }
                // Bot mode messages are handled locally on the client side
            } catch (error) {
                console.error('Error handling chat message:', error);
                socket.emit('error', { message: 'Failed to process message' });
            }
        });

        // Handle admin support requests
        socket.on('request_admin_support', async (data) => {
            console.log('Admin support requested by:', socket.user.firstName + ' ' + socket.user.surname);
            
            try {
                const supportRequest = {
                    ...data,
                    userId: socket.user.id,
                    userName: socket.user.firstName + ' ' + socket.user.surname,
                    userEmail: socket.user.email,
                    socketId: socket.id
                };
                
                // Save support request to database and notify admins
                try {
                    await saveAdminSupportRequest(supportRequest);
                    io.to('admin_room').emit('admin_support_requested', supportRequest);
                } catch (error) {
                    console.error('Database save failed, but still notifying admins:', error);
                    io.to('admin_room').emit('admin_support_requested', supportRequest);
                }
            } catch (error) {
                console.error('Error handling admin support request:', error);
                socket.emit('error', { message: 'Failed to request admin support' });
            }
        });

        // Handle admin replies
        socket.on('admin_reply', async (data) => {
            console.log('Admin reply:', data);
            
            try {
                // Save admin reply to database and forward to user
                try {
                    await saveAdminReply(data, socket.user.id);
                } catch (error) {
                    console.error('Database save failed, but still forwarding reply:', error);
                }
                
                // Forward reply to specific user
                io.to(`user_${data.userId}`).emit('admin_reply_received', {
                    message: data.message,
                    timestamp: data.timestamp,
                    adminName: socket.user.firstName + ' ' + socket.user.surname
                });
            } catch (error) {
                console.error('Error handling admin reply:', error);
                socket.emit('error', { message: 'Failed to send reply' });
            }
        });
        
        switch (socket.user.role) {
            case 'Admin':
            case 'Super_Admin':
                socket.join('admin_room'); // Join admin room for chat
                admin_inquiry(io, socket);
                break;

            case 'User': 
                client_inquiry(io, socket); 
                break;

            default:
                console.log(`Unknown role: ${socket.user.role}, disconnecting socket`);
                socket.emit('error', { message: 'Invalid user role' });
                socket.disconnect();
                return;
        }

        // Handle disconnection
        socket.on('disconnect', (reason) => {
            socketSessionManager.removeSocket(socket.id);
        });

        // Global error handler
        socket.on('error', (error) => {
            console.error(`Socket error for ${socket.user?.username}:`, error);
        });

    });}

export { 
    setup_socket
};
