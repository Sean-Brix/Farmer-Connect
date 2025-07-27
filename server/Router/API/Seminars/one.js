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

// Update/Edit
import editSeminar from '../../../Controller/Seminar/editSeminar.js';
router.put('/update/:id', upload.single('photo'), editSeminar);
router.patch('/update/:id', upload.single('photo'), editSeminar);
router.put('/updateSeminar/:id', upload.single('photo'), editSeminar); // Frontend compatibility
router.patch('/updateSeminar/:id', upload.single('photo'), editSeminar); // Frontend compatibility

// Delete
import deleteSeminar from '../../../Controller/Seminar/deleteSeminar.js';
router.delete('/delete/:id', deleteSeminar);

//? ================================================================================================ ?//

export default router;
