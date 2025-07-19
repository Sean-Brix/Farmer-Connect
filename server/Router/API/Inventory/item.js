import express from 'express';

// Route: ('/api/inventory/item')
const router = express.Router();

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

// Add Item
import addItem from '../../../Controller/Inventory/addItem.js';
router.post('/add', addItem);

// Edit Item
import editItem from '../../../Controller/Inventory/editItem.js';
router.post('/edit', editItem);

// Delete Item
import deleteItem from '../../../Controller/Inventory/deleteItem.js';
router.delete('/delete/:id', deleteItem);


//? ================================================================================================ ?//

//? ====================================== SUPER ADMINS ============================================ ?//

import super_admin from '../../../Middlewares/Auth/super_admin.js';
router.use(super_admin);

// Add any super admin specific item operations here if needed

//? ================================================================================================ ?//

export default router;
