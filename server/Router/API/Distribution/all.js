import express from 'express';

// Route: ('/api/dist/all')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//

// LIST - Public endpoint for viewing distributed items
import getAllDistribution from '../../../Controller/Distribution/getAll.js';
router.get('/', getAllDistribution);

//? ================================================================================================ ?//

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware for protected routes
import parseToken from '../../../Middlewares/JWT/parseToken.js';
import authorize from '../../../Middlewares/Auth/authorize.js';
import super_admin from '../../../Middlewares/Auth/super_admin.js';

// Apply middleware to protected routes only
// If you need protected routes, add them here after middleware

//? ================================================================================================ ?//

export default router;
