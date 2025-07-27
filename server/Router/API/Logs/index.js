import express from 'express';

// Route: ('/api/logs')
const router = express.Router();

import all from './all.js';
router.use('/all', all);

import stats from './stats.js';
router.use('/stats', stats);

import filters from './filters.js';
router.use('/filters', filters);

export default router;
