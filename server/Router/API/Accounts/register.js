import express from 'express';

// Route: ('/api/account/register')
const router = express.Router();

// Import middleware
import authorize from '../../../Middlewares/Auth/authorize.js';

// Import controller
import adminRegister from '../../../Controller/Account/adminRegister.js';

// Admin-only user registration route
router.post('/', authorize, adminRegister);

export default router;
