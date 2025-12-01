import express from 'express';
import {
  getSettings,
  getSingleSetting,
  updateSettingValue,
  createNewSetting,
  deleteSettingByKey,
  refreshSettingsCache
} from '../../Controller/Admin/systemSettingsController.js';
import parseToken from '../../Middlewares/JWT/parseToken.js';
import authorize from '../../Middlewares/Auth/authorize.js';

const router = express.Router();

// All routes require authentication and admin access
router.use(parseToken);
router.use(authorize);

// Get all settings or by category
router.get('/', getSettings);

// Get single setting by key
router.get('/:key', getSingleSetting);

// Update setting value
router.put('/:key', updateSettingValue);

// Create new setting
router.post('/', createNewSetting);

// Delete setting
router.delete('/:key', deleteSettingByKey);

// Refresh cache
router.post('/cache/refresh', refreshSettingsCache);

export default router;
