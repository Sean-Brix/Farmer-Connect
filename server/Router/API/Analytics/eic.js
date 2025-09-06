import express from 'express';

// Route: ('/api/analytics/eic')
const router = express.Router();

import parseToken from '../../../Middlewares/JWT/parseToken.js';
import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(parseToken);
router.use(authorize);

import { getEICAnalytics, exportEICCSV } from '../../../Controller/Analytics/eicController.js';

router.get('/', getEICAnalytics);
router.get('/export.csv', exportEICCSV);

export default router;
