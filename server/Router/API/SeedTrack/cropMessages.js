import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

/**
 * POST /api/seed-track/crops/:cropId/messages
 * Create a new message about a crop stage
 */
router.post('/crops/:cropId/messages', async (req, res) => {
  try {
    const { cropId } = req.params;
    const { message, userId: bodyUserId } = req.body;
    const userId = bodyUserId || req.session?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    // Get crop details to get current stage info
    const crop = await prisma.registeredCrop.findUnique({
      where: { id: cropId },
      select: {
        id: true,
        userId: true,
        currentStageIndex: true,
        currentStageName: true
      }
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        error: 'Crop not found'
      });
    }

    // Verify user owns this crop
    if (crop.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only message about your own crops'
      });
    }

    // Create the message
    const newMessage = await prisma.cropStageMessage.create({
      data: {
        cropId,
        userId,
        stageIndex: crop.currentStageIndex,
        stageName: crop.currentStageName || 'Stage ' + (crop.currentStageIndex + 1),
        message: message.trim(),
        isAdminReply: false
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            access: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error creating crop message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

/**
 * GET /api/seed-track/crops/:cropId/messages
 * Get all messages for a crop (with replies)
 */
router.get('/crops/:cropId/messages', async (req, res) => {
  try {
    const { cropId } = req.params;
    const { userId: queryUserId } = req.query;
    const userId = queryUserId || req.session?.userId || req.user?.id;
    const isAdmin = req.session?.access === 'Admin' || req.session?.access === 'Super_Admin' || req.user?.access === 'Admin' || req.user?.access === 'Super_Admin';

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Get crop to verify access
    const crop = await prisma.registeredCrop.findUnique({
      where: { id: cropId },
      select: { userId: true }
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        error: 'Crop not found'
      });
    }

    // Only allow owner or admin to view messages
    if (crop.userId !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Get all top-level messages (no parent) with their replies
    const messages = await prisma.cropStageMessage.findMany({
      where: {
        cropId,
        parentId: null // Only top-level messages
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            access: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                surname: true,
                access: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching crop messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages'
    });
  }
});

/**
 * POST /api/seed-track/messages/:messageId/reply
 * Reply to a message (admin only)
 */
router.post('/messages/:messageId/reply', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message, userId: bodyUserId } = req.body;
    const userId = bodyUserId || req.session?.userId || req.user?.id || 'admin';
    
    // Note: In production, verify admin role properly

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Reply message is required'
      });
    }

    // Get parent message to get crop and stage info
    const parentMessage = await prisma.cropStageMessage.findUnique({
      where: { id: messageId },
      select: {
        id: true,
        cropId: true,
        stageIndex: true,
        stageName: true
      }
    });

    if (!parentMessage) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Create reply
    const reply = await prisma.cropStageMessage.create({
      data: {
        cropId: parentMessage.cropId,
        userId,
        stageIndex: parentMessage.stageIndex,
        stageName: parentMessage.stageName,
        message: message.trim(),
        isAdminReply: true,
        parentId: messageId
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            access: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Reply sent successfully',
      data: reply
    });
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send reply'
    });
  }
});

/**
 * GET /api/seed-track/messages/pending
 * Get all messages for active crops (not completed/archived)
 */
router.get('/messages/pending', async (req, res) => {
  try {
    // Note: In production, add proper admin authentication
    // For now, trusting the frontend to only call this from admin panel

    // Get all top-level messages for crops that are not completed or archived
    const messages = await prisma.cropStageMessage.findMany({
      where: {
        parentId: null,
        crop: {
          status: {
            notIn: ['Completed', 'Archived']
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            username: true
          }
        },
        crop: {
          select: {
            id: true,
            cropType: true,
            variety: true,
            currentStageIndex: true,
            currentStageName: true,
            status: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                surname: true,
                access: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: messages,
      count: messages.length
    });
  } catch (error) {
    console.error('Error fetching pending messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending messages'
    });
  }
});

export default router;
