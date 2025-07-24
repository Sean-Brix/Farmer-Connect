import express from 'express';

// Route: ('/api/eic')
const router = express.Router();

import all from './all.js';
router.use('/all', all);

import photo from './photo.js';
router.use('/photo', photo);

import item from './item.js';
router.use('/item', item);

import request from './request.js';
router.use('/request', request);

export default router;
