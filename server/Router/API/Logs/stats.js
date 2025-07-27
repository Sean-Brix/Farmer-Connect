import express from 'express';
import getLogStats from '../../../Controller/Logs/getLogStats.js';

// Route: ('/api/logs/stats')
const router = express.Router();

// GET /api/logs/stats - Get audit log statistics and analytics
router.get('/', getLogStats);

export default router;
