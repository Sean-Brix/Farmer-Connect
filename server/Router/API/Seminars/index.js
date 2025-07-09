import express from 'express'

// Route: ('/api/seminar')
const router = express.Router();

import details from './details.js';
router.use('/details', details);

import picture from './picture.js';
router.use('/picture', picture);

import participants from './participants.js';
router.use('/participants', participants);

import all from './all.js';
router.use('/all', all);

import one from './one.js';
router.use('/', one);

export default router;