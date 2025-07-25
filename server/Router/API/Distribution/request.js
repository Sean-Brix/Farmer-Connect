import express from 'express';
import upload from '../../../Utils/multer_upload.js';

// Route: ('/api/dist/request')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//

// Should be Logged in to access this route
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import addRequest from '../../../Controller/Distribution/request/addRequest.js';
router.post('/', addRequest);

import getMyRequest from '../../../Controller/Distribution/request/getMyRequest.js';
router.get('/me', getMyRequest);

import setStatus from '../../../Controller/Distribution/request/setStatus.js';
router.post('/cancel', setStatus);

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

import getAllRequest from '../../../Controller/Distribution/request/getAllRequest.js';
router.get('/all', getAllRequest);

import adminSetStatus from '../../../Controller/Distribution/request/setStatus.js';
router.post('/respond', adminSetStatus);

import getStackRequests from '../../../Controller/Distribution/request/getStackRequest.js';
router.get('/stack/:itemID', getStackRequests);

//? ================================================================================================ ?//

//? ====================================== SUPER ADMINS ============================================ ?//

import super_admin from '../../../Middlewares/Auth/super_admin.js';
router.use(super_admin);

// Add any super admin specific item operations here if needed

//? ================================================================================================ ?//

export default router;
