import express from 'express';

// Route: ('/api/analytics/inventory')
const router = express.Router();

import parseToken from '../../../Middlewares/JWT/parseToken.js';
import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(parseToken);
router.use(authorize);

import { getInventoryAnalytics, exportInventoryCSV } from '../../../Controller/Analytics/inventoryController.js';

router.get('/', getInventoryAnalytics);
router.get('/export.csv', exportInventoryCSV);

export default router;
