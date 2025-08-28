import express from 'express';

// Route: ('/api/preferences')
const router = express.Router();

import language from './language.js';
router.use('/language', language);

import notifications from './notifications.js';
router.use('/notifications', notifications);

import theme from './theme.js';
router.use('/theme', theme);

export default router;
