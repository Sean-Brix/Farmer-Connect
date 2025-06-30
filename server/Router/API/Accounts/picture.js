import express from 'express'
import upload from '../../../Utils/multer_upload.js';

// Route: ('/api/account/picture')
const router = express.Router();

import setMyPhoto from '../../../Controller/Account/setMyPhoto.js';
router.post('/me', upload.single('photo'), setMyPhoto);

import getMyPhoto from '../../../Controller/Account/getMyPhoto.js';
router.get('/me', getMyPhoto);

import deleteMyPhoto from '../../../Controller/Account/deleteMyPhoto.js';
router.delete('/me', deleteMyPhoto);

export default router;