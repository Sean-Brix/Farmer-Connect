import express from 'express';
import {
  getAllQuotas,
  getQuotaByItem,
  upsertQuota,
  deleteQuota,
  getWaitlist,
  getAllWaitlists,
  triggerWaitlistNotifications,
  cleanWaitlist,
  getDistributionHistory
} from '../../Controller/Admin/distributionQuotaController.js';
import parseToken from '../../Middlewares/JWT/parseToken.js';
import authorize from '../../Middlewares/Auth/authorize.js';

const router = express.Router();

// All routes require authentication and admin access
router.use(parseToken);
router.use(authorize);

// Quota management routes
router.get('/quotas', getAllQuotas);
router.get('/quotas/:itemStackId', getQuotaByItem);
router.post('/quotas', upsertQuota);
router.put('/quotas/:itemStackId', upsertQuota);
router.delete('/quotas/:itemStackId', deleteQuota);

// Waitlist routes
router.get('/waitlist', getAllWaitlists);
router.get('/waitlist/:itemStackId', getWaitlist);
router.post('/waitlist/notify', triggerWaitlistNotifications);
router.post('/waitlist/clean', cleanWaitlist);

// Distribution history routes
router.get('/history', getDistributionHistory);

export default router;
