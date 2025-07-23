import express from 'express';

// Route: ('/api/eic/item')
const router = express.Router();

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

import editItem from '../../../Controller/EIC/editItem.js';
router.put('/:id', editItem);

//? ================================================================================================ ?//

//? ====================================== SUPER ADMINS ============================================ ?//

import super_admin from '../../../Middlewares/Auth/super_admin.js';
router.use(super_admin);

// Add any super admin specific item operations here if needed

//? ================================================================================================ ?//

export default router;
