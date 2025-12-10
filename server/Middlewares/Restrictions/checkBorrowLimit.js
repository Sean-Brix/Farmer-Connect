import prisma from '../../config/database.js';
import { getSetting } from '../../Services/systemSettingsService.js';

/**
 * Middleware to check if user has reached borrowing limits
 * Validates:
 * - Max simultaneous active borrows
 * - Max quantity per request
 */
async function checkBorrowLimit(req, res, next) {
  try {
    const userId = req.user?.id;
    const { quantity, itemStackId } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User authentication required'
      });
    }
    
    // Get system settings
    const maxSimultaneous = await getSetting('eic_max_simultaneous_borrows', 3);
    const maxQuantity = await getSetting('eic_max_quantity_per_request', 5);
    
    // 1. Check maximum simultaneous active borrows
    const activeBorrows = await prisma.itemTransaction.count({
      where: {
        accountId: userId,
        status: { in: ['Pending', 'Approved'] }
      }
    });
    
    if (activeBorrows >= maxSimultaneous) {
      return res.status(400).json({
        error: 'Borrow limit reached',
        message: `You can only have ${maxSimultaneous} active request(s) at a time`,
        details: {
          current: activeBorrows,
          limit: maxSimultaneous,
          type: 'simultaneous_limit'
        }
      });
    }
    
    // 2. Check quantity limit
    if (quantity && parseInt(quantity) > maxQuantity) {
      return res.status(400).json({
        error: 'Quantity limit exceeded',
        message: `Maximum ${maxQuantity} unit(s) can be requested per request`,
        details: {
          requested: parseInt(quantity),
          limit: maxQuantity,
          type: 'quantity_limit'
        }
      });
    }
    
    // Cooldown period check removed - Admin has full control over request approval
    
    // All checks passed
    next();
    
  } catch (error) {
    console.error('Error in checkBorrowLimit middleware:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Failed to validate borrowing limits'
    });
  }
}

/**
 * Check distribution request limits
 * Validates monthly request quotas
 */
async function checkDistributionLimit(req, res, next) {
  try {
    const userId = req.user?.id;
    const { quantity } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User authentication required'
      });
    }
    
    // Get system settings
    const maxPerMonth = await getSetting('distribution_max_requests_per_month', 2);
    const maxQuantity = await getSetting('distribution_max_quantity_per_request', 10);
    
    // 1. Check monthly request limit
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const requestsThisMonth = await prisma.itemTransaction.count({
      where: {
        accountId: userId,
        itemStack: {
          status: 'Distributed' // Distribution items have status 'Distributed'
        },
        createdAt: {
          gte: startOfMonth
        }
      }
    });
    
    if (requestsThisMonth >= maxPerMonth) {
      return res.status(400).json({
        error: 'Monthly limit reached',
        message: `You can only make ${maxPerMonth} distribution request(s) per month`,
        details: {
          current: requestsThisMonth,
          limit: maxPerMonth,
          type: 'monthly_limit'
        }
      });
    }
    
    // 2. Check quantity limit
    if (quantity && parseInt(quantity) > maxQuantity) {
      return res.status(400).json({
        error: 'Quantity limit exceeded',
        message: `Maximum ${maxQuantity} unit(s) can be requested per distribution request`,
        details: {
          requested: parseInt(quantity),
          limit: maxQuantity,
          type: 'quantity_limit'
        }
      });
    }
    
    // All checks passed
    next();
    
  } catch (error) {
    console.error('Error in checkDistributionLimit middleware:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Failed to validate distribution limits'
    });
  }
}

export { checkBorrowLimit, checkDistributionLimit };
