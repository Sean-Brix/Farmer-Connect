import { Router } from 'express';
import { getCronStatus, toggleCronJob, manualTrigger, updateAutoArchiveSettings, updateAutoRejectSettings, updateAutoNoPickupSettings } from '../../Controller/Admin/cronController.js';
import parseToken from '../../Middlewares/JWT/parseToken.js';
import authorize from '../../Middlewares/Auth/authorize.js';

const router = Router();

// All routes require authentication and admin authorization
router.use(parseToken);
router.use(authorize);

// Get cron job status
router.get('/status', getCronStatus);

// Enable/disable cron job
router.post('/toggle', toggleCronJob);

// Manual trigger for immediate execution
router.post('/trigger', manualTrigger);

// Update auto-archive settings
router.post('/auto-archive', updateAutoArchiveSettings);

// Update auto-reject settings
router.post('/auto-reject', updateAutoRejectSettings);

// Update auto-no_pickup settings
router.post('/auto-no-pickup', updateAutoNoPickupSettings);

export default router;
