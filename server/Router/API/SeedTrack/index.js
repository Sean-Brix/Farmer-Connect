import express from 'express';
import cropsRouter from './registeredCrops.js';
import reportsRouter from './reports.js';
import guidelinesRouter from './cropGuidelines.js';

// Route: ('/api/seed-track')
const router = express.Router();

router.use('/crops', cropsRouter);
router.use('/reports', reportsRouter);
router.use('/guidelines', guidelinesRouter);

export default router;
