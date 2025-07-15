import express from 'express';

// Route: ('/api/inventory/stack')
const router = express.Router();

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

// Delete Stack
import deleteStack from '../../../Controller/Inventory/deleteStack.js';
router.delete('/delete/:id', deleteStack);

// Reduce Item
import reduceItem from '../../../Controller/Inventory/reduceItem.js';
router.post('/reduce', reduceItem);

//? ================================================================================================ ?//

//? ====================================== SUPER ADMINS ============================================ ?//

import super_admin from '../../../Middlewares/Auth/super_admin.js';
router.use(super_admin)



//? ================================================================================================ ?//


export default router;