import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function client_chat(io, socket) {
    console.log(`💬 Chat client connected: ${socket.user?.username || socket.user?.id} (ID: ${socket.id})`);
    
    // Join user to their chat rooms
    joinUserChatRooms(socket);
    
    // Get user's chat rooms
    socket.on('chat:get_rooms', async () => {
        try {
            console.log('📋 [GET_CHAT_ROOMS] Client requesting chat rooms:', {
                userId: socket.user.id,
                username: socket.user.username,
                timestamp: new Date().toISOString()
            });

            const chatRooms = await prisma.chatParticipant.findMany({
                where: { userId: socket.user.id },
                include: {
                    chatRoom: {
                        include: {
                            participants: {
                                include: {
                                    user: {
                                        select: { 
                                            id: true, 
                                            username: true, 
                                            firstName: true, 
                                            surname: true,
                                            profilePicture: true 
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
                        }
                    }
                },
                orderBy: { joinedAt: 'desc' }
            });

            const formattedRooms = chatRooms.map(participant => {
                const room = participant.chatRoom;
                const lastMessage = room.messages[0] || null;
                
                // Get other participants (exclude current user)
                const otherParticipants = room.participants.filter(p => p.userId !== socket.user.id);
                
                return {
                    id: room.id,
                    name: room.name,
                    type: room.type,
                    participants: otherParticipants.map(p => ({
                        id: p.user.id,
                        username: p.user.username,
                        name: `${p.user.firstName} ${p.user.surname}`,
                        profilePicture: p.user.profilePicture
                    })),
                    lastMessage: lastMessage ? {
                        id: lastMessage.id,
                        content: lastMessage.content,
                        senderName: `${lastMessage.sender.firstName} ${lastMessage.sender.surname}`,
                        createdAt: lastMessage.createdAt
                    } : null,
                    messageCount: room._count.messages,
                    joinedAt: participant.joinedAt,
                    createdAt: room.createdAt
                };
            });

            socket.emit('chat:rooms_list', {
                success: true,
                rooms: formattedRooms,
                count: formattedRooms.length
            });

            console.log(`📤 [GET_CHAT_ROOMS] Sent ${formattedRooms.length} rooms to user ${socket.user.username}`);

        } catch (error) {
            console.error('❌ [GET_CHAT_ROOMS] Error:', error);
            socket.emit('chat:error', { 
                message: 'Failed to fetch chat rooms',
                error: error.message 
            });
        }
    });

    // Get messages for a specific chat room
    socket.on('chat:get_messages', async (data) => {
        try {
            const { roomId, page = 1, limit = 50 } = data;
            
            console.log('📨 [GET_MESSAGES] Client requesting messages:', {
                userId: socket.user.id,
                roomId,
                page,
                limit,
                timestamp: new Date().toISOString()
            });

            // Verify user is participant in the room
            const participant = await prisma.chatParticipant.findFirst({
                where: {
                    userId: socket.user.id,
                    chatRoomId: roomId
                }
            });

            if (!participant) {
                socket.emit('chat:error', { 
                    message: 'You are not a participant in this chat room' 
                });
                return;
            }

            const messages = await prisma.chatMessage.findMany({
                where: { chatRoomId: roomId },
                include: {
                    sender: {
                        select: { 
                            id: true, 
                            username: true, 
                            firstName: true, 
                            surname: true,
                            profilePicture: true 
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
                    profilePicture: message.sender.profilePicture
                },
                attachments: message.attachments,
                createdAt: message.createdAt,
                isOwn: message.senderId === socket.user.id
            }));

            socket.emit('chat:messages_list', {
                success: true,
                roomId,
                messages: formattedMessages,
                page,
                hasMore: messages.length === limit
            });

            console.log(`📤 [GET_MESSAGES] Sent ${formattedMessages.length} messages for room ${roomId}`);

        } catch (error) {
            console.error('❌ [GET_MESSAGES] Error:', error);
            socket.emit('chat:error', { 
                message: 'Failed to fetch messages',
                error: error.message 
            });
        }
    });

    // Send a new message
    socket.on('chat:send_message', async (data) => {
        try {
            const { roomId, content, attachments = [] } = data;
            
            console.log('✉️ [SEND_MESSAGE] Client sending message:', {
                userId: socket.user.id,
                username: socket.user.username,
                roomId,
                content: content?.substring(0, 100) + (content?.length > 100 ? '...' : ''),
                attachmentCount: attachments.length,
                timestamp: new Date().toISOString()
            });

            // Verify user is participant in the room
            const participant = await prisma.chatParticipant.findFirst({
                where: {
                    userId: socket.user.id,
                    chatRoomId: roomId
                }
            });

            if (!participant) {
                socket.emit('chat:error', { 
                    message: 'You are not a participant in this chat room' 
                });
                return;
            }

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
                            profilePicture: true 
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
                    profilePicture: newMessage.sender.profilePicture
                },
                attachments: newMessage.attachments,
                createdAt: newMessage.createdAt,
                isOwn: true
            };

            // Emit to sender
            socket.emit('chat:message_sent', {
                success: true,
                message: formattedMessage
            });

            // Broadcast to other participants in the room
            socket.to(`chat_room_${roomId}`).emit('chat:new_message', {
                roomId,
                message: {
                    ...formattedMessage,
                    isOwn: false
                }
            });

            console.log(`📤 [SEND_MESSAGE] Message sent and broadcasted for room ${roomId}`);

        } catch (error) {
            console.error('❌ [SEND_MESSAGE] Error:', error);
            socket.emit('chat:error', { 
                message: 'Failed to send message',
                error: error.message 
            });
        }
    });

    // Join a specific chat room
    socket.on('chat:join_room', async (data) => {
        try {
            const { roomId } = data;
            
            // Verify user is participant
            const participant = await prisma.chatParticipant.findFirst({
                where: {
                    userId: socket.user.id,
                    chatRoomId: roomId
                }
            });

            if (participant) {
                socket.join(`chat_room_${roomId}`);
                socket.emit('chat:room_joined', { roomId });
                console.log(`🚪 User ${socket.user.username} joined chat room ${roomId}`);
            } else {
                socket.emit('chat:error', { 
                    message: 'You are not a participant in this chat room' 
                });
            }

        } catch (error) {
            console.error('❌ [JOIN_ROOM] Error:', error);
            socket.emit('chat:error', { 
                message: 'Failed to join room',
                error: error.message 
            });
        }
    });

    // Leave a specific chat room
    socket.on('chat:leave_room', (data) => {
        const { roomId } = data;
        socket.leave(`chat_room_${roomId}`);
        console.log(`🚪 User ${socket.user.username} left chat room ${roomId}`);
    });

    // Create a new chat room (for direct messages)
    socket.on('chat:create_direct_chat', async (data) => {
        try {
            const { otherUserId } = data;
            
            console.log('🆕 [CREATE_DIRECT_CHAT] Creating direct chat:', {
                userId: socket.user.id,
                otherUserId,
                timestamp: new Date().toISOString()
            });

            // Check if direct chat already exists
            const existingRoom = await prisma.chatRoom.findFirst({
                where: {
                    type: 'DIRECT',
                    participants: {
                        every: {
                            userId: {
                                in: [socket.user.id, otherUserId]
                            }
                        }
                    }
                },
                include: {
                    participants: true
                }
            });

            if (existingRoom && existingRoom.participants.length === 2) {
                socket.emit('chat:direct_chat_created', {
                    success: true,
                    roomId: existingRoom.id,
                    isExisting: true
                });
                return;
            }

            // Create new direct chat
            const newRoom = await prisma.chatRoom.create({
                data: {
                    name: null, // Direct chats don't need names
                    type: 'DIRECT',
                    participants: {
                        create: [
                            { userId: socket.user.id },
                            { userId: otherUserId }
                        ]
                    }
                }
            });

            socket.emit('chat:direct_chat_created', {
                success: true,
                roomId: newRoom.id,
                isExisting: false
            });

            console.log(`✅ [CREATE_DIRECT_CHAT] Created room ${newRoom.id} between ${socket.user.id} and ${otherUserId}`);

        } catch (error) {
            console.error('❌ [CREATE_DIRECT_CHAT] Error:', error);
            socket.emit('chat:error', { 
                message: 'Failed to create direct chat',
                error: error.message 
            });
        }
    });

    // Mark messages as read
    socket.on('chat:mark_read', async (data) => {
        try {
            const { roomId, messageIds } = data;
            
            // Verify user is participant
            const participant = await prisma.chatParticipant.findFirst({
                where: {
                    userId: socket.user.id,
                    chatRoomId: roomId
                }
            });

            if (!participant) {
                socket.emit('chat:error', { 
                    message: 'You are not a participant in this chat room' 
                });
                return;
            }

            // Create read receipts for the messages
            await prisma.chatReadReceipt.createMany({
                data: messageIds.map(messageId => ({
                    messageId,
                    userId: socket.user.id
                })),
                skipDuplicates: true
            });

            // Notify other participants that messages were read
            socket.to(`chat_room_${roomId}`).emit('chat:messages_read', {
                roomId,
                messageIds,
                readBy: {
                    id: socket.user.id,
                    username: socket.user.username,
                    name: `${socket.user.firstName} ${socket.user.surname}`
                }
            });

        } catch (error) {
            console.error('❌ [MARK_READ] Error:', error);
        }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
        console.log(`💬 Chat client disconnected: ${socket.user?.username || socket.user?.id} (ID: ${socket.id})`);
    });
}

// Helper function to join user to their chat rooms
async function joinUserChatRooms(socket) {
    try {
        const userRooms = await prisma.chatParticipant.findMany({
            where: { userId: socket.user.id },
            select: { chatRoomId: true }
        });

        for (const room of userRooms) {
            socket.join(`chat_room_${room.chatRoomId}`);
        }

        console.log(`🏠 User ${socket.user.username} joined ${userRooms.length} chat rooms`);
        
    } catch (error) {
        console.error('❌ Error joining user to chat rooms:', error);
    }
}

export { client_chat };
