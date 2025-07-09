import express from 'express';
import upload from '../../../Utils/multer_upload.js';

// Route: ('/api/seminar/all')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//

import getAllSeminar from '../../../Controller/Seminar/getAllSeminar.js'
router.get('/', getAllSeminar);


//? ================================================================================================ ?//

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

// New Seminar
import addSeminar from '../../../Controller/Seminar/addSeminar.js';
router.post('/add', upload.single('photo'), addSeminar);

//? ================================================================================================ ?//

//? ====================================== SUPER ADMINS ============================================ ?//

import super_admin from '../../../Middlewares/Auth/super_admin.js';
router.use(super_admin)



//? ================================================================================================ ?//


export default router;