import express from 'express';
import login from '../../Controller/Account/login.js';

// Route: ('/auth')
const router = express.Router();

router.post('/login', login);

export default router;