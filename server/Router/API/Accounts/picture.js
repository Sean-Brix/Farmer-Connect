import express from 'express'
import upload from '../../../Utils/multer_upload.js';
import parseToken from '../../../Middlewares/JWT/parseToken.js';

// Route: ('/api/account/picture')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//

import getMyPhoto from '../../../Controller/Account/getMyPhoto.js';
router.get('/me', getMyPhoto);



//? ================================================================================================ ?//


//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
router.use(parseToken);

import deleteMyPhoto from '../../../Controller/Account/deleteMyPhoto.js';
router.delete('/me', deleteMyPhoto);

import setMyPhoto from '../../../Controller/Account/setMyPhoto.js';
router.post('/me', upload.single('photo'), setMyPhoto);

//? ================================================================================================ ?//


export default router;