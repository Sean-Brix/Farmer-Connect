import express from 'express'

// Route: ('/api/inventory')
const router = express.Router();

import all from './all.js'
router.use('/all', all);

import item from './item.js'
router.use('/item/:id', item);

export default router;