import express from 'express';
import login from '../../Controller/Authentication/login.js';
import register from '../../Controller/Authentication/register.js';

// Route: ('/auth')
const router = express.Router();

router.post('/login', login);
router.post('/register', register);

export default router;