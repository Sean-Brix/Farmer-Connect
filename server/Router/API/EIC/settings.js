import express from 'express';
import getSettings from '../../../Controller/EIC/settings/getSettings.js';
import parseToken from '../../../Middlewares/JWT/parseToken.js';

const router = express.Router();

// GET /api/eic/settings
router.get('/', parseToken, getSettings);

export default router;
