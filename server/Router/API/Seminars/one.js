import express from 'express';
import upload from '../../../Utils/multer_upload.js';

// Route: ('/api/seminar/')
const router = express.Router();

//? ========================================= ROUTES =============================================== ?//


//? ================================================================================================ ?//

//? ======================================= AUTHORIZED ============================================= ?//

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);


// Add
import addSeminar from '../../../Controller/Seminar/addSeminar.js';
router.post('/add', upload.single('photo'), addSeminar);

// Delete
import deleteSeminar from '../../../Controller/Seminar/deleteSeminar.js';
router.delete('/delete/:id', deleteSeminar)


//? ================================================================================================ ?//


export default router;