import express from 'express'

// Route: ('/api/account')
const router = express.Router();

import details from './details.js';
router.use('/details', details);

export default router;