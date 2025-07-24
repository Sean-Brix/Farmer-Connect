import express from 'express';
import upload from '../../../Utils/multer_upload.js';

// Route: ('/api/eic/request')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//

// Should be Logged in to access this route
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import addRequest from '../../../Controller/EIC/request/addRequest.js'
router.post('/', addRequest);

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

//? ================================================================================================ ?//

//? ====================================== SUPER ADMINS ============================================ ?//

import super_admin from '../../../Middlewares/Auth/super_admin.js';
router.use(super_admin);

// Add any super admin specific item operations here if needed

//? ================================================================================================ ?//

export default router;
