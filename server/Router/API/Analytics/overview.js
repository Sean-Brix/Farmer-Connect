import express from 'express';

// Route: ('/api/analytics/overview')
const router = express.Router();

// Authorization middleware chain (cookie JWT + role)
import parseToken from '../../../Middlewares/JWT/parseToken.js';
import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(parseToken);
router.use(authorize);

// Controllers
import { getOverviewAnalytics, exportOverviewCSV } from '../../../Controller/Analytics/overviewController.js';

// GET aggregated overview metrics
router.get('/', getOverviewAnalytics);

// Export overview metrics as CSV
router.get('/export.csv', exportOverviewCSV);

export default router;
