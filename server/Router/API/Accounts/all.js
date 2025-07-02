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

import getAllAccounts from '../../../Controller/Account/getAllAccounts.js';
router.get('/', getAllAccounts);


export default router;