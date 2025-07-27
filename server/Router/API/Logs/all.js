import express from 'express';
import getLogs from '../../../Controller/Logs/getLogs.js';

// Route: ('/api/logs/all')
const router = express.Router();

// GET /api/logs/all - Get paginated audit logs with filtering and sorting
router.get('/', getLogs);

export default router;
