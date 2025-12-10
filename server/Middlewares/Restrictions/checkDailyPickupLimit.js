import prisma from '../../config/database.js';
import { getSetting } from '../../Services/systemSettingsService.js';

/**
 * Middleware to check if daily pickup limit has been reached
 * Works for both EIC and Distribution requests
 */
async function checkDailyPickupLimit(req, res, next) {
  try {
    const { pickupDate } = req.body;
    const requestType = req.baseUrl.includes('/eic') ? 'eic' : 'distribution';
    
    if (!pickupDate) {
      return next(); // If no pickup date, let other validation handle it
    }
    
    const selectedDate = new Date(pickupDate);
    selectedDate.setHours(0, 0, 0, 0);
    
    // Check if weekend pickups are allowed
    const allowWeekends = await getSetting('allow_weekend_pickups');
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    
    if (isWeekend && allowWeekends === 'false') {
      return res.status(400).json({
        error: 'Weekend pickups not allowed',
        message: 'Pickups are not allowed on weekends. Please select a weekday.',
        details: {
          selectedDate: pickupDate,
          isWeekend: true
        }
      });
    }
    
    // Check advance booking limit
    const maxAdvanceDays = parseInt(await getSetting('max_advance_booking_days') || '30');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const daysDifference = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysDifference > maxAdvanceDays) {
      return res.status(400).json({
        error: 'Advance booking limit exceeded',
        message: `You can only book pickups up to ${maxAdvanceDays} days in advance.`,
        details: {
          selectedDate: pickupDate,
          daysInAdvance: daysDifference,
          maxAllowed: maxAdvanceDays
        }
      });
    }
    
    // Get daily pickup limit for this request type
    const limitKey = requestType === 'eic' 
      ? 'eic_max_pickups_per_day' 
      : 'distribution_max_pickups_per_day';
    
    const dailyLimit = parseInt(await getSetting(limitKey) || '10');
    
    // Calculate end of selected day
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Count existing approved requests for this date
    let existingCount = 0;
    
    if (requestType === 'eic') {
      existingCount = await prisma.itemTransaction.count({
        where: {
          pickupDate: {
            gte: selectedDate,
            lte: endOfDay
          },
          status: {
            in: ['Pending', 'Approved']
          },
          itemStack: {
            status: 'EIC' // Only count EIC items
          }
        }
      });
    } else {
      // Distribution also uses ItemTransaction but with 'Distributed' status
      existingCount = await prisma.itemTransaction.count({
        where: {
          pickupDate: {
            gte: selectedDate,
            lte: endOfDay
          },
          status: {
            in: ['Pending', 'Approved']
          },
          itemStack: {
            status: 'Distributed' // Only count Distribution items
          }
        }
      });
    }
    
    // Check if limit reached
    if (existingCount >= dailyLimit) {
      return res.status(400).json({
        error: 'Daily pickup limit reached',
        message: `The maximum number of ${requestType.toUpperCase()} pickups (${dailyLimit}) for this date has been reached.`,
        details: {
          selectedDate: pickupDate,
          currentCount: existingCount,
          limit: dailyLimit,
          requestType: requestType.toUpperCase(),
          suggestion: 'Please select a different date or contact the admin.'
        }
      });
    }
    
    // Add available slots info to request for frontend display
    req.pickupSlotInfo = {
      availableSlots: dailyLimit - existingCount,
      totalSlots: dailyLimit,
      currentCount: existingCount,
      requestType: requestType.toUpperCase()
    };
    
    next();
  } catch (error) {
    console.error('Error in checkDailyPickupLimit middleware:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Failed to validate pickup schedule. Please try again.'
    });
  }
}

export default checkDailyPickupLimit;
