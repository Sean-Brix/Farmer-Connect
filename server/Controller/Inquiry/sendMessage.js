// PrismaClient import removed - using centralized db
import prisma from '../../config/database.js';
import auditLogger from '../../Services/auditLogger.js';

// Using centralized prisma instance

/**
 * Send a message in an inquiry (replaces socket.emit('chat_message'))
 * POST /api/inquiry/:inquiryId/messages
 */
export async function sendInquiryMessage(req, res) {
    try {
        const { inquiryId } = req.params;
        const { message, messageType = 'text' } = req.body;
        const userId = req.user.id;
        const userRole = req.user.access;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message content is required'
            });
        }

        // Verify inquiry exists and user has access
        const inquiry = await prisma.inquiry.findUnique({
            where: { id: inquiryId },
            include: {
                user: { select: { id: true, firstName: true, surname: true } },
                assignedTo: { select: { id: true, firstName: true, surname: true } }
            }
        });

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        // Check access: user must be the inquiry creator or an admin/assigned admin
        const isOwner = inquiry.userId === userId;
        const isAssigned = inquiry.assignedToId === userId;
        const isAdmin = ['Admin', 'Super_Admin'].includes(userRole);

        if (!isOwner && !isAdmin && !isAssigned) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to send messages in this inquiry'
            });
        }

        // Determine sender type
        const senderType = isOwner ? 'user' : 'admin';

        // Create the message
        const newMessage = await prisma.inquiryReply.create({
            data: {
                inquiryId,
                senderId: userId,
                senderType: senderType.toUpperCase(),
                message: message.trim(),
                senderName: isOwner 
                    ? `${inquiry.user.firstName} ${inquiry.user.surname}`
                    : `${req.user.firstName} ${req.user.surname}`,
                readByUser: isOwner,
                readByAdmin: !isOwner
            },
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
            }
        });

        // Update inquiry's updatedAt timestamp
        await prisma.inquiry.update({
            where: { id: inquiryId },
            data: { updatedAt: new Date() }
        });

        // Log the action
        await auditLogger.log(
            userId,
            senderType === 'user' ? 'Inquiry_Message_Sent' : 'Inquiry_Admin_Reply',
            `inquiry:${inquiryId}`,
            { inquiryId, messageId: newMessage.id, messageType }
        );

        // Format response
        const formattedMessage = {
            id: newMessage.id,
            inquiryId: newMessage.inquiryId,
            senderId: newMessage.senderId,
            senderType: newMessage.senderType,
            senderName: newMessage.senderName || `${newMessage.sender?.firstName || ''} ${newMessage.sender?.surname || ''}`.trim(),
            senderUsername: newMessage.sender?.username,
            senderPicture: newMessage.sender?.picturePath,
            message: newMessage.message,
            isRead: senderType === 'user' ? newMessage.readByAdmin : newMessage.readByUser,
            createdAt: newMessage.createdAt,
            timestamp: newMessage.createdAt
        };

        return res.status(201).json({
            success: true,
            data: formattedMessage,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('[sendInquiryMessage] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
}
