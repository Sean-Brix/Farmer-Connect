import express from 'express';

// Route: ('/api/inventory/item/:id')
const router = express.Router();

//? ======================================= AUTHORIZED ============================================= ?//

// Authentication middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);


// Individual Item
router.get('/picture', (req, res)=>{});

//? ================================================================================================ ?//

//? ====================================== SUPER ADMINS ============================================ ?//

import super_admin from '../../../Middlewares/Auth/super_admin.js';
router.use(super_admin)



//? ================================================================================================ ?//


export default router;