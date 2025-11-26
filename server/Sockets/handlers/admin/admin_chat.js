import prisma from '../../../config/database.js';

function admin_chat(io, socket) {
    console.log(`👑 Admin chat connected: ${socket.user?.username || socket.user?.id} (ID: ${socket.id})`);
    
    // Join admin to their chat rooms
    joinAdminChatRooms(socket);
    
    // Get all chat rooms (admin can see all)
    socket.on('admin_chat:get_all_rooms', async () => {
        try {
            console.log('📋 [ADMIN_GET_ALL_ROOMS] Admin requesting all chat rooms:', {
                adminId: socket.user.id,
                username: socket.user.username,
                timestamp: new Date().toISOString()
            });

            const chatRooms = await prisma.chatRoom.findMany({
                include: {
                    participants: {
                        include: {
                            user: {
                                select: { 
                                    id: true, 
                                    username: true, 
                                    firstName: true, 
                                    surname: true,
                                    profilePicture: true,
                                    role: true
                                }
                            }
                        }
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        include: {
                            sender: {
                                select: { 
                                    id: true, 
                                    username: true, 
                                    firstName: true, 
                                    surname: true 
                                }
                            }
                        }
                    },
                    _count: {
                        select: { messages: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            const formattedRooms = chatRooms.map(room => {
                const lastMessage = room.messages[0] || null;
                
                return {
                    id: room.id,
                    name: room.name,
                    type: room.type,
                    participants: room.participants.map(p => ({
                        id: p.user.id,
                        username: p.user.username,
                        name: `${p.user.firstName} ${p.user.surname}`,
                        profilePicture: p.user.profilePicture,
                        role: p.user.role,
                        joinedAt: p.joinedAt
                    })),
                    lastMessage: lastMessage ? {
                        id: lastMessage.id,
                        content: lastMessage.content,
                        senderName: `${lastMessage.sender.firstName} ${lastMessage.sender.surname}`,
                        createdAt: lastMessage.createdAt
                    } : null,
                    messageCount: room._count.messages,
                    createdAt: room.createdAt
                };
            });

            socket.emit('admin_chat:all_rooms_list', {
                success: true,
                rooms: formattedRooms,
                count: formattedRooms.length
            });

            console.log(`📤 [ADMIN_GET_ALL_ROOMS] Sent ${formattedRooms.length} rooms to admin ${socket.user.username}`);

        } catch (error) {
            console.error('❌ [ADMIN_GET_ALL_ROOMS] Error:', error);
            socket.emit('admin_chat:error', { 
                message: 'Failed to fetch chat rooms',
                error: error.message 
            });
        }
    });

    // Get messages for any chat room (admin can view all)
    socket.on('admin_chat:get_messages', async (data) => {
        try {
            const { roomId, page = 1, limit = 50 } = data;
            
            console.log('📨 [ADMIN_GET_MESSAGES] Admin requesting messages:', {
                adminId: socket.user.id,
                roomId,
                page,
                limit,
                timestamp: new Date().toISOString()
            });

            const messages = await prisma.chatMessage.findMany({
                where: { chatRoomId: roomId },
                include: {
                    sender: {
                        select: { 
                            id: true, 
                            username: true, 
                            firstName: true, 
                            surname: true,
                            profilePicture: true,
                            role: true
                        }
                    },
                    attachments: true
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            });

            const formattedMessages = messages.reverse().map(message => ({
                id: message.id,
                content: message.content,
                sender: {
                    id: message.sender.id,
                    username: message.sender.username,
                    name: `${message.sender.firstName} ${message.sender.surname}`,
                    profilePicture: message.sender.profilePicture,
                    role: message.sender.role
                },
                attachments: message.attachments,
                createdAt: message.createdAt,
                isOwn: message.senderId === socket.user.id
            }));

            socket.emit('admin_chat:messages_list', {
                success: true,
                roomId,
                messages: formattedMessages,
                page,
                hasMore: messages.length === limit
            });

            console.log(`📤 [ADMIN_GET_MESSAGES] Sent ${formattedMessages.length} messages for room ${roomId}`);

        } catch (error) {
            console.error('❌ [ADMIN_GET_MESSAGES] Error:', error);
            socket.emit('admin_chat:error', { 
                message: 'Failed to fetch messages',
                error: error.message 
            });
        }
    });

    // Admin send message (can send to any room)
    socket.on('admin_chat:send_message', async (data) => {
        try {
            const { roomId, content, attachments = [] } = data;
            
            console.log('✉️ [ADMIN_SEND_MESSAGE] Admin sending message:', {
                adminId: socket.user.id,
                username: socket.user.username,
                roomId,
                content: content?.substring(0, 100) + (content?.length > 100 ? '...' : ''),
                attachmentCount: attachments.length,
                timestamp: new Date().toISOString()
            });

            // Create the message
            const newMessage = await prisma.chatMessage.create({
                data: {
                    content,
                    senderId: socket.user.id,
                    chatRoomId: roomId,
                    attachments: {
                        create: attachments.map(attachment => ({
                            fileName: attachment.fileName,
                            filePath: attachment.filePath,
                            fileType: attachment.fileType,
                            fileSize: attachment.fileSize
                        }))
                    }
                },
                include: {
                    sender: {
                        select: { 
                            id: true, 
                            username: true, 
                            firstName: true, 
                            surname: true,
                            profilePicture: true,
                            role: true
                        }
                    },
                    attachments: true
                }
            });

            const formattedMessage = {
                id: newMessage.id,
                content: newMessage.content,
                sender: {
                    id: newMessage.sender.id,
                    username: newMessage.sender.username,
                    name: `${newMessage.sender.firstName} ${newMessage.sender.surname}`,
                    profilePicture: newMessage.sender.profilePicture,
                    role: newMessage.sender.role
                },
                attachments: newMessage.attachments,
                createdAt: newMessage.createdAt,
                isOwn: true
            };

            // Emit to admin
            socket.emit('admin_chat:message_sent', {
                success: true,
                message: formattedMessage
            });

            // Broadcast to all participants in the room
            socket.to(`chat_room_${roomId}`).emit('chat:new_message', {
                roomId,
                message: {
                    ...formattedMessage,
                    isOwn: false
                }
            });

            console.log(`📤 [ADMIN_SEND_MESSAGE] Admin message sent and broadcasted for room ${roomId}`);

        } catch (error) {
            console.error('❌ [ADMIN_SEND_MESSAGE] Error:', error);
            socket.emit('admin_chat:error', { 
                message: 'Failed to send message',
                error: error.message 
            });
        }
    });

    // Admin join any chat room
    socket.on('admin_chat:join_room', (data) => {
        const { roomId } = data;
        socket.join(`chat_room_${roomId}`);
        socket.emit('admin_chat:room_joined', { roomId });
        console.log(`🚪 Admin ${socket.user.username} joined chat room ${roomId}`);
    });

    // Admin leave chat room
    socket.on('admin_chat:leave_room', (data) => {
        const { roomId } = data;
        socket.leave(`chat_room_${roomId}`);
        console.log(`🚪 Admin ${socket.user.username} left chat room ${roomId}`);
    });

    // Create support chat room for a user
    socket.on('admin_chat:create_support_room', async (data) => {
        try {
            const { userId, userName } = data;
            
            console.log('🆕 [CREATE_SUPPORT_ROOM] Admin creating support room:', {
                adminId: socket.user.id,
                userId,
                userName,
                timestamp: new Date().toISOString()
            });

            // Check if support chat already exists between this admin and user
            const existingRoom = await prisma.chatRoom.findFirst({
                where: {
                    type: 'SUPPORT',
                    participants: {
                        every: {
                            userId: {
                                in: [socket.user.id, userId]
                            }
                        }
                    }
                },
                include: {
                    participants: true
                }
            });

            if (existingRoom && existingRoom.participants.length === 2) {
                socket.emit('admin_chat:support_room_created', {
                    success: true,
                    roomId: existingRoom.id,
                    isExisting: true
                });
                return;
            }

            // Create new support chat
            const newRoom = await prisma.chatRoom.create({
                data: {
                    name: `Support: ${userName}`,
                    type: 'SUPPORT',
                    participants: {
                        create: [
                            { userId: socket.user.id },
                            { userId: userId }
                        ]
                    }
                }
            });

            socket.emit('admin_chat:support_room_created', {
                success: true,
                roomId: newRoom.id,
                isExisting: false
            });

            console.log(`✅ [CREATE_SUPPORT_ROOM] Created support room ${newRoom.id} for user ${userName}`);

        } catch (error) {
            console.error('❌ [CREATE_SUPPORT_ROOM] Error:', error);
            socket.emit('admin_chat:error', { 
                message: 'Failed to create support room',
                error: error.message 
            });
        }
    });

    // Get chat statistics for admin dashboard
    socket.on('admin_chat:get_stats', async () => {
        try {
            const totalRooms = await prisma.chatRoom.count();
            const totalMessages = await prisma.chatMessage.count();
            const totalParticipants = await prisma.chatParticipant.count();
            
            const roomsByType = await prisma.chatRoom.groupBy({
                by: ['type'],
                _count: {
                    id: true
                }
            });

            const recentActivity = await prisma.chatMessage.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    sender: {
                        select: { username: true, firstName: true, surname: true }
                    },
                    chatRoom: {
                        select: { name: true, type: true }
                    }
                }
            });

            socket.emit('admin_chat:stats', {
                totalRooms,
                totalMessages,
                totalParticipants,
                roomsByType: roomsByType.reduce((acc, item) => {
                    acc[item.type] = item._count.id;
                    return acc;
                }, {}),
                recentActivity: recentActivity.map(msg => ({
                    id: msg.id,
                    content: msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : ''),
                    sender: `${msg.sender.firstName} ${msg.sender.surname}`,
                    room: msg.chatRoom.name || `${msg.chatRoom.type} Chat`,
                    createdAt: msg.createdAt
                }))
            });

        } catch (error) {
            console.error('❌ [GET_STATS] Error:', error);
            socket.emit('admin_chat:error', { 
                message: 'Failed to fetch stats',
                error: error.message 
            });
        }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
        console.log(`👑 Admin chat disconnected: ${socket.user?.username || socket.user?.id} (ID: ${socket.id})`);
    });
}

// Helper function to join admin to available chat rooms
async function joinAdminChatRooms(socket) {
    try {
        // Admins can participate in support chats
        const adminRooms = await prisma.chatParticipant.findMany({
            where: { userId: socket.user.id },
            select: { chatRoomId: true }
        });

        for (const room of adminRooms) {
            socket.join(`chat_room_${room.chatRoomId}`);
        }

        console.log(`🏠 Admin ${socket.user.username} joined ${adminRooms.length} chat rooms`);
        
    } catch (error) {
        console.error('❌ Error joining admin to chat rooms:', error);
    }
}

export { admin_chat };
