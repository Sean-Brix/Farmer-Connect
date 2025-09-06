import express from 'express';

// Route: ('/api/analytics/seminars')
const router = express.Router();

import parseToken from '../../../Middlewares/JWT/parseToken.js';
import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(parseToken);
router.use(authorize);

import { getSeminarsAnalytics, exportSeminarsCSV } from '../../../Controller/Analytics/seminarsController.js';

router.get('/', getSeminarsAnalytics);
router.get('/export.csv', exportSeminarsCSV);

export default router;
