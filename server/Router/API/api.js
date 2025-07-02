import express from 'express'

// Route: ('/api')
const router = express.Router();

import account from './Accounts/index.js';
router.use('/account', account);


export default router;