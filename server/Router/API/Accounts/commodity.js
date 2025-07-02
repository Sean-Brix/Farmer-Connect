import express from 'express'
import parseToken from '../../../Middlewares/JWT/parseToken.js';

// Route: ('/api/account/commodity')
const router = express.Router();

//? ======================================= GET ROUTES ============================================= ?//



//? ================================================================================================ ?//


//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
router.use(parseToken);



//? ================================================================================================ ?//

export default router;