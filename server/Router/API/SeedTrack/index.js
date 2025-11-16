import express from 'express';
import cropsRouter from './registeredCrops.js';
import reportsRouter from './reports.js';
import guidelinesRouter from './cropGuidelines.js';
import messagesRouter from './cropMessages.js';

// Route: ('/api/seed-track')
const router = express.Router();

router.use('/crops', cropsRouter);
router.use('/reports', reportsRouter);
router.use('/guidelines', guidelinesRouter);
router.use('/', messagesRouter); // Mount message routes at base level

export default router;
