import express from 'express';
import login from '../../Controller/Authentication/login.js';
import register from '../../Controller/Authentication/register.js';
import checkEmail from '../../Controller/Authentication/checkEmail.js';
import isLoggedIn from '../../Controller/Authentication/isLoggedIn.js';
import logout from '../../Controller/Authentication/logout.js';

// Route: ('/auth')
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/check-email', checkEmail);
router.get('/is-authenticated', isLoggedIn)
router.delete('/logout', logout);

export default router;