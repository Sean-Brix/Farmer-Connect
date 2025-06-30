import express from 'express'
import upload from '../../../Utils/multer_upload.js';

// Route: ('/api/account/picture')
const router = express.Router();

import setMyPhoto from '../../../Controller/Account/setMyPhoto.js';
router.get('/', upload.single('photo'), setMyPhoto);

export default router;