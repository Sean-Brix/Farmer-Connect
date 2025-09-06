import { PrismaClient } from '../../prisma/generated/index.js';
import auditLogger from '../../Services/auditLogger.js';

const prisma = new PrismaClient();

export async function uploadInquiryAttachment(req, res) {
  try {
    const userId = req.user.id;
    const { inquiryId } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Validate inquiry belongs to user and is active (or allow any status?)
    const inquiry = await prisma.inquiry.findFirst({
      where: {
        id: inquiryId,
        userId,
      },
    });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

  // Generate a safe filename for record keeping
    const timestamp = Date.now();
    const original = req.file.originalname || 'attachment';
    const sanitized = original.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filename = `${timestamp}_${sanitized}`;
    // We store binary directly in DB; no disk write

    let record;
    try {
      record = await prisma.inquiryAttachment.create({
        data: {
          inquiryId: inquiry.id,
          filename: original,
          filepath: null,
          filesize: req.file.size,
          mimetype: req.file.mimetype,
          uploadedById: userId,
          fileData: req.file.buffer,
        },
      });
    } catch (err) {
      // Prisma schema may not yet have fileData column; retry without it
      const msg = String(err?.message || '');
      if (msg.includes('Unknown argument `fileData`')) {
        record = await prisma.inquiryAttachment.create({
          data: {
            inquiryId: inquiry.id,
            filename: original,
            filepath: null,
            filesize: req.file.size,
            mimetype: req.file.mimetype,
            uploadedById: userId,
          },
        });
      } else {
        throw err;
      }
    }

  // Provide a streaming URL for inline rendering
  const streamUrl = `/api/inquiries/attachments/${record.id}`;
  // Log audit trail (attachment upload)
  try {
    await auditLogger.log({
      adminId: req.user?.access === 'Admin' || req.user?.access === 'Super_Admin' ? req.user.id : userId,
      action: 'INQUIRY_ATTACHMENT_UPLOAD',
      targetType: 'Inquiry',
      targetId: inquiry.id,
      targetName: inquiry.subject,
      details: `Attachment uploaded: ${original} (${req.file.mimetype}, ${req.file.size} bytes)`,
      metadata: { attachmentId: record.id, filename: original, mimetype: req.file.mimetype, size: req.file.size },
      req
    });
  } catch {}
  return res.status(201).json({ success: true, data: { ...record, streamUrl } });
  } catch (err) {
    console.error('uploadInquiryAttachment error:', err);
    // Friendly error when DB rejects due to packet size limits
    if (String(err?.message || '').includes('Server has closed the connection') || err?.code === 'P1017') {
      return res.status(413).json({ success: false, message: 'Attachment too large for server. Please upload a smaller file (<= 3MB).' });
    }
    const status = err?.code === 'LIMIT_FILE_SIZE' ? 413 : 500;
    return res.status(status).json({ success: false, message: err?.message || 'Upload failed' });
  }
}
