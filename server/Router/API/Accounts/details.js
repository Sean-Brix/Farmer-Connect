import express from 'express'
import parseToken from '../../../Middlewares/JWT/parseToken.js';

// Route: ('/api/account/details')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//




//? ================================================================================================ ?//


//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
router.use(parseToken);

import getMyDetails from '../../../Controller/Account/getMyDetails.js';
router.get('/me', getMyDetails);

import setMyDetails from '../../../Controller/Account/setMyDetails.js';
router.post('/me', setMyDetails);

//? ================================================================================================ ?//

export default router;