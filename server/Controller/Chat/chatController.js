import prisma from '../../config/database.js';

// Get all users for chat (to start conversations)
export const getUsers = async (req, res) => {
    try {
        const { search } = req.query;
        const currentUserId = req.user.id;
        
        const whereClause = {
            id: { not: currentUserId }, // Exclude current user
            ...(search && {
                OR: [
                    { username: { contains: search, mode: 'insensitive' } },
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { surname: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            })
        };

        const users = await prisma.account.findMany({
            where: whereClause,
            select: {
                id: true,
                username: true,
                firstName: true,
                surname: true,
                email: true,
                profilePicture: true,
                role: true,
                isActive: true
            },
            orderBy: [
                { isActive: 'desc' },
                { firstName: 'asc' }
            ],
            take: 50 // Limit results
        });

        const formattedUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            name: `${user.firstName} ${user.surname}`,
            email: user.email,
            profilePicture: user.profilePicture,
            role: user.role,
            isActive: user.isActive
        }));

        res.json({
            success: true,
            data: formattedUsers,
            count: formattedUsers.length
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

// Get user's chat rooms
export const getUserChatRooms = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const chatRooms = await prisma.chatParticipant.findMany({
            where: { userId },
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
            const otherParticipants = room.participants.filter(p => p.userId !== userId);
            
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

        res.json({
            success: true,
            data: formattedRooms,
            count: formattedRooms.length
        });

    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chat rooms',
            error: error.message
        });
    }
};

// Create a direct chat room
export const createDirectChat = async (req, res) => {
    try {
        const { otherUserId } = req.body;
        const currentUserId = req.user.id;
        
        if (!otherUserId) {
            return res.status(400).json({
                success: false,
                message: 'Other user ID is required'
            });
        }

        if (otherUserId === currentUserId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot create chat with yourself'
            });
        }

        // Check if direct chat already exists
        const existingRoom = await prisma.chatRoom.findFirst({
            where: {
                type: 'DIRECT',
                participants: {
                    every: {
                        userId: {
                            in: [currentUserId, otherUserId]
                        }
                    }
                }
            },
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
                }
            }
        });

        if (existingRoom && existingRoom.participants.length === 2) {
            return res.json({
                success: true,
                data: {
                    id: existingRoom.id,
                    name: existingRoom.name,
                    type: existingRoom.type,
                    participants: existingRoom.participants
                        .filter(p => p.userId !== currentUserId)
                        .map(p => ({
                            id: p.user.id,
                            username: p.user.username,
                            name: `${p.user.firstName} ${p.user.surname}`,
                            profilePicture: p.user.profilePicture
                        })),
                    createdAt: existingRoom.createdAt
                },
                isExisting: true,
                message: 'Direct chat already exists'
            });
        }

        // Create new direct chat
        const newRoom = await prisma.chatRoom.create({
            data: {
                name: null, // Direct chats don't need names
                type: 'DIRECT',
                participants: {
                    create: [
                        { userId: currentUserId },
                        { userId: otherUserId }
                    ]
                }
            },
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
                }
            }
        });

        const responseData = {
            id: newRoom.id,
            name: newRoom.name,
            type: newRoom.type,
            participants: newRoom.participants
                .filter(p => p.userId !== currentUserId)
                .map(p => ({
                    id: p.user.id,
                    username: p.user.username,
                    name: `${p.user.firstName} ${p.user.surname}`,
                    profilePicture: p.user.profilePicture
                })),
            createdAt: newRoom.createdAt
        };

        res.status(201).json({
            success: true,
            data: responseData,
            isExisting: false,
            message: 'Direct chat created successfully'
        });

    } catch (error) {
        console.error('Error creating direct chat:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create direct chat',
            error: error.message
        });
    }
};

// Get messages for a chat room
export const getChatMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const userId = req.user.id;
        
        // Verify user is participant in the room
        const participant = await prisma.chatParticipant.findFirst({
            where: {
                userId,
                chatRoomId: roomId
            }
        });

        if (!participant) {
            return res.status(403).json({
                success: false,
                message: 'You are not a participant in this chat room'
            });
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
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit)
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
            isOwn: message.senderId === userId
        }));

        res.json({
            success: true,
            data: formattedMessages,
            page: parseInt(page),
            hasMore: messages.length === parseInt(limit)
        });

    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chat messages',
            error: error.message
        });
    }
};

// Admin: Get all chat rooms
export const getAllChatRoomsAdmin = async (req, res) => {
    try {
        const { type, search } = req.query;
        
        const whereClause = {
            ...(type && { type }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { participants: {
                        some: {
                            user: {
                                OR: [
                                    { username: { contains: search, mode: 'insensitive' } },
                                    { firstName: { contains: search, mode: 'insensitive' } },
                                    { surname: { contains: search, mode: 'insensitive' } }
                                ]
                            }
                        }
                    }}
                ]
            })
        };

        const chatRooms = await prisma.chatRoom.findMany({
            where: whereClause,
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

        res.json({
            success: true,
            data: formattedRooms,
            count: formattedRooms.length
        });

    } catch (error) {
        console.error('Error fetching all chat rooms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chat rooms',
            error: error.message
        });
    }
};

// Admin: Create support chat room
export const createSupportChatAdmin = async (req, res) => {
    try {
        const { userId, userName } = req.body;
        const adminId = req.user.id;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Check if support chat already exists between this admin and user
        const existingRoom = await prisma.chatRoom.findFirst({
            where: {
                type: 'SUPPORT',
                participants: {
                    every: {
                        userId: {
                            in: [adminId, userId]
                        }
                    }
                }
            },
            include: {
                participants: true
            }
        });

        if (existingRoom && existingRoom.participants.length === 2) {
            return res.json({
                success: true,
                data: { roomId: existingRoom.id },
                isExisting: true,
                message: 'Support chat already exists'
            });
        }

        // Create new support chat
        const newRoom = await prisma.chatRoom.create({
            data: {
                name: `Support: ${userName || 'User'}`,
                type: 'SUPPORT',
                participants: {
                    create: [
                        { userId: adminId },
                        { userId }
                    ]
                }
            }
        });

        res.status(201).json({
            success: true,
            data: { roomId: newRoom.id },
            isExisting: false,
            message: 'Support chat created successfully'
        });

    } catch (error) {
        console.error('Error creating support chat:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create support chat',
            error: error.message
        });
    }
};
