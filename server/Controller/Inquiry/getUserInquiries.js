import prisma from '../../config/database.js';

const getUserInquiries = async (req, res) => {
  try {
    const userId = req.user.id; // From cookie authentication

    const inquiries = await prisma.inquiry.findMany({
      where: {
        userId: userId
      },
      include: {
        user: {
          select: {
            firstName: true,
            surname: true,
            email: true
          }
        },
        replies: {
          orderBy: {
            createdAt: 'asc'
          },
          select: {
            id: true,
            message: true,
            senderType: true,
            createdAt: true
          }
        },
    attachments: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            filename: true,
            mimetype: true,
            filesize: true,
      uploadedById: true,
            createdAt: true,
          }
        },
        assignedTo: {
          select: {
            firstName: true,
            surname: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Add computed fields for easier frontend consumption
    const formattedInquiries = inquiries.map(inquiry => ({
      ...inquiry,
      userName: `${inquiry.user.firstName} ${inquiry.user.surname}`,
      lastMessage: inquiry.replies.length > 0 
        ? inquiry.replies[inquiry.replies.length - 1].message 
        : inquiry.message,
      lastMessageTime: inquiry.replies.length > 0 
        ? inquiry.replies[inquiry.replies.length - 1].createdAt 
        : inquiry.createdAt,
      messageCount: inquiry.replies.length + 1, // +1 for initial inquiry
      isRead: inquiry.status !== 'PENDING', // Consider non-pending as read
      attachments: (inquiry.attachments || []).map(a => ({
        ...a,
        streamUrl: `/api/inquiries/attachments/${a.id}`
      }))
    }));

    res.status(200).json({
      success: true,
      data: formattedInquiries,
      count: formattedInquiries.length
    });

  } catch (error) {
    console.error('Error fetching user inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiries',
      error: error.message
    });
  }
};

export default getUserInquiries;
