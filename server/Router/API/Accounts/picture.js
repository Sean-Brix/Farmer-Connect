import express from 'express'

// Route: ('/api/account/picture')
const router = express.Router();

import setPhoto from '../../../Controller/Account/setPhoto.js';
router.get('/', setPhoto);

export default router;