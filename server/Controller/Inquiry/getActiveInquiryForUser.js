import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Return the latest active inquiry (PENDING or IN_PROGRESS) for the logged-in user
export const getActiveInquiryForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const inquiry = await prisma.inquiry.findFirst({
      where: {
        userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] }
      },
      include: {
        user: {
          select: { firstName: true, surname: true, email: true }
        },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { select: { firstName: true, surname: true } }
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
        assignedTo: { select: { firstName: true, surname: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });

    if (!inquiry) return res.status(200).json(null);

    const formatted = {
      id: inquiry.id,
      subject: inquiry.subject,
      message: inquiry.message,
      status: inquiry.status,
      userId: inquiry.userId,
      user: inquiry.user,
      assignedTo: inquiry.assignedTo,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
      replies: inquiry.replies.map(r => ({
        id: r.id,
        message: r.message,
        senderType: r.senderType,
        senderName: r.senderName || (r.sender ? `${r.sender.firstName} ${r.sender.surname}` : 'Unknown'),
        createdAt: r.createdAt
      })),
      attachments: inquiry.attachments?.map(a => ({
        id: a.id,
        filename: a.filename,
        mimetype: a.mimetype,
        filesize: a.filesize,
        uploadedById: a.uploadedById,
        createdAt: a.createdAt,
        streamUrl: `/api/inquiries/attachments/${a.id}`
      })) || []
    };

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching active inquiry for user:', error);
    res.status(500).json({ error: 'Failed to fetch active inquiry' });
  }
};
