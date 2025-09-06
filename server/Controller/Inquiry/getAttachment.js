import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getInquiryAttachment(req, res) {
  try {
    const { attachmentId } = req.params;
    // Try selecting fileData; if the client isn't generated with fileData, fall back to without it
    let att;
    try {
      att = await prisma.inquiryAttachment.findUnique({
        where: { id: attachmentId },
        select: { fileData: true, mimetype: true, filename: true, filepath: true }
      });
    } catch (e) {
      // Unknown field fileData in select
      att = await prisma.inquiryAttachment.findUnique({
        where: { id: attachmentId },
        select: { mimetype: true, filename: true, filepath: true }
      });
      att.fileData = null;
    }
    if (!att) {
      return res.status(404).json({ success: false, message: 'Attachment not found' });
    }

    res.setHeader('Content-Type', att.mimetype || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${att.filename}"`);

  if (att.fileData) {
      return res.send(Buffer.from(att.fileData));
    }
    // Fallback to disk if fileData column not present
    const publicRoot = path.join(__dirname, '../../public');
  const fullPath = att.filepath ? path.join(publicRoot, att.filepath.replace(/^\//, '')) : null;
  if (fullPath && fs.existsSync(fullPath)) {
      fs.createReadStream(fullPath).pipe(res);
      return;
    }
    return res.status(404).json({ success: false, message: 'Attachment content missing' });
  } catch (e) {
    console.error('getInquiryAttachment error:', e);
    return res.status(500).json({ success: false, message: 'Failed to load attachment' });
  }
}
