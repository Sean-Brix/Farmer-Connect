import multer from 'multer';

// Allowed mime types for attachments (images and PDFs)
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
]);

// Conservative limit: 3 MB to stay under MySQL default max_allowed_packet (4MB)
const MAX_SIZE_BYTES = 3 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Unsupported file type'));
  }
  cb(null, true);
};

const uploadInquiryAttachment = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter,
});

export default uploadInquiryAttachment;
