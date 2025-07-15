import express from 'express';

// Route: ('/api/inventory/item/:id')
const router = express.Router();

// Authentication middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

//? ========================================= ROUTES =============================================== ?//

// Individual Item
router.get('/picture', (req, res)=>{});


//? ======================================= AUTHORIZED ============================================= ?//

import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);


//? ================================================================================================ ?//

//? ====================================== SUPER ADMINS ============================================ ?//

import super_admin from '../../../Middlewares/Auth/super_admin.js';
router.use(super_admin)



//? ================================================================================================ ?//


export default router;