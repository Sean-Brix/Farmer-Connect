import express from 'express';

// Route: ('/api/analytics/distribution')
const router = express.Router();

import parseToken from '../../../Middlewares/JWT/parseToken.js';
import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(parseToken);
router.use(authorize);

import { getDistributionAnalytics, exportDistributionCSV } from '../../../Controller/Analytics/distributionController.js';

router.get('/', getDistributionAnalytics);
router.get('/export.csv', exportDistributionCSV);

export default router;
