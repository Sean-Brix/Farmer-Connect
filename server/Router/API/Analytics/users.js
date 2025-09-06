import express from 'express';

// Route: ('/api/analytics/users')
const router = express.Router();

// Authorization
import parseToken from '../../../Middlewares/JWT/parseToken.js';
import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(parseToken);
router.use(authorize);

// Controller
import { getUsersAnalytics, exportUsersCSV } from '../../../Controller/Analytics/usersController.js';

router.get('/', getUsersAnalytics);
router.get('/export.csv', exportUsersCSV);

export default router;
