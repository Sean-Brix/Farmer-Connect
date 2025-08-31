import express from 'express';
import login from '../../Controller/Authentication/login.js';
import register from '../../Controller/Authentication/register.js';
import checkEmail from '../../Controller/Authentication/checkEmail.js';
import isLoggedIn from '../../Controller/Authentication/isLoggedIn.js';
import logout from '../../Controller/Authentication/logout.js';
import forgotPassword from '../../Controller/Authentication/forgotPassword.js';
import resetPassword from '../../Controller/Authentication/resetPassword.js';
import changePassword from '../../Controller/Authentication/changePassword.js';
import { cookieAuth } from '../../Middlewares/Auth/cookieAuth.js';

// Route: ('/auth')
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/check-email', checkEmail);
router.get('/is-authenticated', isLoggedIn)
router.delete('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', cookieAuth, changePassword);

export default router;
