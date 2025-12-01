import express from 'express';
import upload from '../../../Utils/multer_upload.js';

// Route: ('/api/eic/request')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//

// Should be Logged in to access this route
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import { checkBorrowLimit } from '../../../Middlewares/Restrictions/checkBorrowLimit.js';
import checkDailyPickupLimit from '../../../Middlewares/Restrictions/checkDailyPickupLimit.js';

import addRequest from '../../../Controller/EIC/request/addRequest.js';
router.post('/', checkBorrowLimit, checkDailyPickupLimit, addRequest);

import getMyRequest from '../../../Controller/EIC/request/getMyRequest.js';
router.get('/me', getMyRequest);

import setStatus from '../../../Controller/EIC/request/setStatus.js';
router.post('/cancel', setStatus);

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

import getAllRequest from '../../../Controller/EIC/request/getAllRequest.js';
router.get('/all', getAllRequest);

import getDueTracking from '../../../Controller/EIC/request/getDueTracking.js';
router.get('/due-tracking', getDueTracking);

import adminSetStatus from '../../../Controller/EIC/request/setStatus.js';
router.post('/respond', adminSetStatus);

import getStackRequests from '../../../Controller/EIC/request/getStackRequest.js';
router.get('/stack/:itemID', getStackRequests);

import getStatistics from '../../../Controller/EIC/request/getStatistics.js';
router.get('/statistics', getStatistics);

import exportArchive from '../../../Controller/EIC/request/exportArchive.js';
router.get('/export', exportArchive);

import bulkAction from '../../../Controller/EIC/request/bulkAction.js';
router.post('/bulk-action', bulkAction);

//? ================================================================================================ ?//

//? ====================================== SUPER ADMINS ============================================ ?//

import super_admin from '../../../Middlewares/Auth/super_admin.js';
router.use(super_admin);

//? ================================================================================================ ?//

export default router;
