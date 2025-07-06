import express from 'express'

// Route: ('/api')
const router = express.Router();

import account from './Accounts/index.js';
router.use('/account', account);

import seminar from './Seminars/index.js';
router.use('/seminar', seminar);

export default router;