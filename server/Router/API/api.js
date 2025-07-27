import express from 'express';

// Route: ('/api')
const router = express.Router();

import account from './Accounts/index.js';
router.use('/account', account);

import seminar from './Seminars/index.js';
router.use('/seminar', seminar);
router.use('/seminars', seminar); // Add plural alias for frontend compatibility

import inventory from './Inventory/index.js';
router.use('/inventory', inventory);

import eic from './EIC/index.js';
router.use('/eic', eic);

import distribution from './Distribution/index.js';
router.use('/dist', distribution);

import analytics from './Analytics/index.js';
router.use('/analytics', analytics);

import logs from './Logs/index.js';
router.use('/logs', logs);

export default router;
