import express from 'express'

// Route: ('/api')
const router = express.Router();

// Middleware for API
import parseToken from '../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import account from './Accounts/index.js';
router.use('/account', account);

export default router;