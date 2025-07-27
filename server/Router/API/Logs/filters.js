import express from 'express';
import getLogFilters from '../../../Controller/Logs/getLogFilters.js';

// Route: ('/api/logs/filters')
const router = express.Router();

// GET /api/logs/filters - Get available filter options for audit logs
router.get('/', getLogFilters);

export default router;
