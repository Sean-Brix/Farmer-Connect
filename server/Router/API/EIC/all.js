import express from 'express';

// Route: ('/api/eic/all')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//

// LIST - Public endpoint for viewing EIC items
import getAllEIC from '../../../Controller/EIC/getAll.js';
router.get('/', getAllEIC);

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
