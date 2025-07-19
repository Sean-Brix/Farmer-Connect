import express from 'express';

// Route: ('/api/inventory')
const router = express.Router();

import all from './all.js';
router.use('/all', all);

// Import item operations (without ID parameter first)
import itemOperations from './item.js';
router.use('/item', itemOperations);

import item from './item.js';
router.use('/item/:id', item);

import stack from './stack.js';
router.use('/stack', stack);

export default router;
