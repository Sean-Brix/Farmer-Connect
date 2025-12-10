import prisma from '../../../config/database.js';
import { getSetting } from '../../../Services/systemSettingsService.js';
import { startOfDay, endOfDay } from 'date-fns';

/**
 * Get available pickup slots for a specific date
 * GET /api/eic/pickup-slots/:date
 */
export default async function getPickupSlots(req, res) {
  try {
    const { date } = req.params;
    
    // Validate date parameter
    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date parameter is required'
      });
    }

    const selectedDate = new Date(date);
    
    // Check if date is valid
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format'
      });
    }

    // Get daily pickup limit from system settings
    const dailyLimit = await getSetting('eic_max_pickups_per_day', 10);

    // Count existing pickups for this date
    const existingCount = await prisma.itemTransaction.count({
      where: {
        pickupDate: {
          gte: startOfDay(selectedDate),
          lte: endOfDay(selectedDate),
        },
        status: {
          in: ['Pending', 'Approved']
        }
      }
    });

    const available = Math.max(0, dailyLimit - existingCount);

    res.json({
      success: true,
      data: {
        available,
        total: dailyLimit,
        date: date,
        isFull: available === 0,
        isLow: available <= 2 && available > 0
      },
      message: `${available} of ${dailyLimit} slots available for ${date}`
    });
  } catch (error) {
    console.error('❌ Error fetching pickup slots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pickup slots',
      message: error.message
    });
  }
}
