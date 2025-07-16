import express from 'express';

// Route: ('/api/inventory/all')
const router = express.Router();

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

// All Items
import getItems from '../../../Controller/Inventory/getItems.js';
router.get('/items', getItems);

import addItem from '../../../Controller/Inventory/addItem.js';
router.post('/add', addItem);

//? ================================================================================================ ?//

//? ====================================== SUPER ADMINS ============================================ ?//

import super_admin from '../../../Middlewares/Auth/super_admin.js';
router.use(super_admin)



//? ================================================================================================ ?//


export default router;