import express from 'express'

// Route: ('/api/account/commodity')
const router = express.Router();

//? ======================================= GET ROUTES ============================================= ?//



//? ================================================================================================ ?//


//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);



//? ================================================================================================ ?//

export default router;