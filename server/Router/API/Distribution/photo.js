import express from 'express';
import upload from '../../../Utils/multer_upload.js';

// Route: ('/api/dist/photo')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//

import getPhoto from '../../../Controller/Distribution/getPhoto.js';
router.get('/:id', getPhoto);

//? ================================================================================================ ?//

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);
import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

// Set distribution photo
import setPhoto from '../../../Controller/Distribution/setPhoto.js';
router.post('/:id', upload.single('photo'), setPhoto);

//? ================================================================================================ ?//

export default router;
