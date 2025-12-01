import express from 'express';
import { getScheduleCalendar, getAvailableSlots } from '../../Controller/Schedule/scheduleController.js';
import parseToken from '../../Middlewares/JWT/parseToken.js';
import authorize from '../../Middlewares/Auth/authorize.js';

const router = express.Router();

// Get unified calendar data (admin only)
router.get('/calendar', parseToken, authorize, getScheduleCalendar);

// Get available slots for a specific date (public for users to check)
router.get('/available-slots', parseToken, getAvailableSlots);

export default router;
