import express from 'express'

// Route: ('/api/account')
const router = express.Router();

import details from './details.js';
router.use('/details', details);

import picture from './picture.js';
router.use('/picture', picture);

export default router;