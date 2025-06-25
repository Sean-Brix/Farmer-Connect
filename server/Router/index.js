import express from 'express'

// Route: ('/')
const router = express.Router();

import authRouter from './Auth/auth.js';
import apiRouter from './API/api.js';

router.use('/auth', authRouter);
router.use('/api', apiRouter);

export default router;