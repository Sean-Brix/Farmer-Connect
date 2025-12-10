import express from 'express';
import getPickupSlots from '../../../Controller/EIC/slots/getPickupSlots.js';
import parseToken from '../../../Middlewares/JWT/parseToken.js';

const router = express.Router();

// GET /api/eic/pickup-slots/:date
router.get('/:date', parseToken, getPickupSlots);

export default router;
