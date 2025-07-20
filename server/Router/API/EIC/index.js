import express from 'express'

// Route: ('/api/eic')
const router = express.Router();

import all from './all.js';
router.use('/all', all);

import photo from './photo.js';
router.use('/photo', photo);

export default router;