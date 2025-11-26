import prisma from '../../config/database.js';

export const getInquiriesByStatus = async (req, res) => {
  try {
    const { status = 'PENDING', page = 1, limit = 50 } = req.query;
    const normalized = String(status).toUpperCase();
    const allowed = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];
    if (!allowed.includes(normalized)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const take = Math.min(Number(limit) || 50, 100);
    const skip = (Number(page) - 1) * take;

    const [items, total] = await Promise.all([
      prisma.inquiry.findMany({
        where: { status: normalized },
        include: {
          user: { select: { id: true, firstName: true, surname: true, email: true } },
          assignedTo: { select: { firstName: true, surname: true } },
          replies: {
            orderBy: { createdAt: 'asc' },
            select: { id: true, message: true, senderType: true, createdAt: true }
          },
          attachments: {
            orderBy: { createdAt: 'asc' },
            select: { id: true, filename: true, mimetype: true, filesize: true, uploadedById: true, createdAt: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take
      }),
      prisma.inquiry.count({ where: { status: normalized } })
    ]);

    const formatted = items.map(inquiry => ({
      id: inquiry.id,
      subject: inquiry.subject,
      message: inquiry.message,
      status: inquiry.status,
      userId: inquiry.userId,
      user: inquiry.user,
      assignedTo: inquiry.assignedTo,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
      replies: inquiry.replies,
      attachments: (inquiry.attachments || []).map(a => ({
        ...a,
        streamUrl: `/api/inquiries/attachments/${a.id}`
      })),
      lastMessage: inquiry.replies.length > 0 ? inquiry.replies[inquiry.replies.length - 1].message : inquiry.message,
      lastMessageTime: inquiry.replies.length > 0 ? inquiry.replies[inquiry.replies.length - 1].createdAt : inquiry.createdAt
    }));

    res.status(200).json({ items: formatted, total, page: Number(page), limit: take });
  } catch (error) {
    console.error('Error fetching inquiries by status:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
};
