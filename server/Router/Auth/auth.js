import express from 'express';
import login from '../../Controller/Authentication/login.js';
import register from '../../Controller/Authentication/register.js';
import checkEmail from '../../Controller/Authentication/checkEmail.js';

// Route: ('/auth')
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/check-email', checkEmail);

export default router;