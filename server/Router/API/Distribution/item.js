import express from 'express';
import upload from '../../../Utils/multer_upload.js';

// Route: ('/api/dist/item')
const router = express.Router();

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

import editItem from '../../../Controller/Distribution/editItem.js';
router.put('/:id', upload.single('image'), editItem);

import addItem from '../../../Controller/Distribution/addItem.js';
router.post('/', upload.single('image'), addItem);

//? ================================================================================================ ?//

//? ====================================== SUPER ADMINS ============================================ ?//

import super_admin from '../../../Middlewares/Auth/super_admin.js';
router.use(super_admin);

// Add any super admin specific item operations here if needed

//? ================================================================================================ ?//

export default router;
