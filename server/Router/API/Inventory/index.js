import express from 'express'

// Route: ('/api/inventory')
const router = express.Router();

import all from './all.js'
router.use('/all', all);

export default router;