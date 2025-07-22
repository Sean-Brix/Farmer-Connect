import express from 'express';
import upload from '../../../Utils/multer_upload.js';

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

// Set seminar photo
import setPhoto from '../../../Controller/EIC/setPhoto.js';
router.post('/:id', upload.single('photo'), setPhoto);

//? ================================================================================================ ?//

export default router;
