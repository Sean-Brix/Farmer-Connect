import express from 'express';

// Route: ('/api/eic/photo')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//

import getPhoto from '../../../Controller/EIC/getPhoto.js';
router.get('/:id', getPhoto);

//? ================================================================================================ ?//

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);
import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

//? ================================================================================================ ?//

export default router;
