import express from 'express'

// Route: ('/api/account/details')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//




//? ================================================================================================ ?//


//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import getMyDetails from '../../../Controller/Account/getMyDetails.js';
router.get('/', getMyDetails);


//? ================================================================================================ ?//

export default router;