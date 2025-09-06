import express from 'express';

// Route: ('/api/analytics')
const router = express.Router();

// Mount feature routers
import overview from './overview.js';
import users from './users.js';
import seminars from './seminars.js';
import eic from './eic.js';
import distribution from './distribution.js';
import inventory from './inventory.js';

router.use('/overview', overview);
router.use('/users', users);
router.use('/seminars', seminars);
router.use('/eic', eic);
router.use('/distribution', distribution);
router.use('/inventory', inventory);

export default router;
