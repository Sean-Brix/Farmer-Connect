import express from 'express';

// Route: ('/api/account/all')
const router = express.Router();

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

//? ================================================================================================ ?//

// LIST
import getAllAccounts from '../../../Controller/Account/getAllAccounts.js';
router.get('/', getAllAccounts);

// PHOTOS
import getUserPhoto from '../../../Controller/Account/getUserPhoto.js';
router.get('/picture/:id', getUserPhoto)

// DETAILS
import getUserDetails from '../../../Controller/Account/getUserDetails.js';
router.get('/details/:id', getUserDetails);


//? ================================================================================================ ?//

//? ====================================== SUPER ADMINS ============================================ ?//

import super_admin from '../../../Middlewares/Auth/super_admin.js';
router.use(super_admin)

// DETAILS
import setUserDetails from '../../../Controller/Account/setUserDetails.js'
router.post('/details/:id', setUserDetails);

//? ================================================================================================ ?//


export default router;