import express from 'express'

// Route: ('/api')
const router = express.Router();

import account from './Accounts/index.js';
router.use('/account', account);

import seminar from './Seminars/index.js';
router.use('/seminar', seminar);

import inventory from './Inventory/index.js'
router.use('/inventory', inventory);

import eic from './EIC/index.js';
router.use('/eic', eic);

export default router;