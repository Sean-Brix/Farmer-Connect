import express from 'express';

// Route: ('/api/seminar/picture')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//

import getPhoto from '../../../Controller/Seminar/getPhoto.js';
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