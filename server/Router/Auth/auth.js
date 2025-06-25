import express from 'express';
import login from '../../Controller/Account/login.js';

// Route: ('/auth')
const router = express.Router();

router.use('/login', login);

export default router;