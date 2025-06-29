import express from 'express'

// Route: ('/api/account/details')
const router = express.Router();

import getMyDetails from '../../../Controller/Account/getMyDetails.js';
router.get('/', getMyDetails);

export default router;