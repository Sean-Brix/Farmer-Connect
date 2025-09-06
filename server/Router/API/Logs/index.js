import express from 'express';
import parseToken from '../../../Middlewares/JWT/parseToken.js';
import authorize from '../../../Middlewares/Auth/authorize.js';

// Route: ('/api/logs')
const router = express.Router();

// Secure all logs endpoints (JWT + role-based)
router.use(parseToken);
router.use(authorize);

import all from './all.js';
router.use('/all', all);

import stats from './stats.js';
router.use('/stats', stats);

import filters from './filters.js';
router.use('/filters', filters);

export default router;
