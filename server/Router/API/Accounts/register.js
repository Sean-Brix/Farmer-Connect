import express from 'express';

// Route: ('/api/account/register')
const router = express.Router();

// Import middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
import authorize from '../../../Middlewares/Auth/authorize.js';

// Import controller
import adminRegister from '../../../Controller/Account/adminRegister.js';

// Admin-only user registration route
// parseToken must run first to set req.user, then authorize checks the role
router.post('/', parseToken, authorize, adminRegister);

export default router;
