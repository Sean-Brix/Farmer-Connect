import express from 'express';

// Route: ('/api/eic')
const router = express.Router();

import all from './all.js';
router.use('/all', all);

import photo from './photo.js';
router.use('/photo', photo);

import item from './item.js';
router.use('/item', item);

// Direct edit route for frontend compatibility
import editItem from '../../../Controller/EIC/editItem.js';
import parseToken from '../../../Middlewares/JWT/parseToken.js';
import authorize from '../../../Middlewares/Auth/authorize.js';

router.put('/edit/:id', parseToken, authorize, editItem);

export default router;
