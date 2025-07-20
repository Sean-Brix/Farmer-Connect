import express from 'express';

// Route: ('/api/eic/all')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//

// LIST
import getAllEIC from '../../../Controller/EIC/getAll.js';
router.get('/', getAllEIC);

//? ================================================================================================ ?//

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);
import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);



//? ================================================================================================ ?//

//? ====================================== SUPER ADMINS ============================================ ?//

import super_admin from '../../../Middlewares/Auth/super_admin.js';
router.use(super_admin)

//? ================================================================================================ ?//


export default router;