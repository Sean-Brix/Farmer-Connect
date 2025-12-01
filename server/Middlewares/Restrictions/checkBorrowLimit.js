import prisma from '../../config/database.js';
import { getSetting } from '../../Services/systemSettingsService.js';

/**
 * Middleware to check if user has reached borrowing limits
 * Validates:
 * - Max simultaneous active borrows
 * - Max quantity per request
 * - Cooldown period after last return
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
    const cooldownDays = await getSetting('eic_cooldown_days', 7);
    
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
    
    // 3. Check cooldown period (if enabled)
    if (cooldownDays > 0) {
      const cooldownDate = new Date();
      cooldownDate.setDate(cooldownDate.getDate() - cooldownDays);
      
      // Find most recent returned transaction
      const recentReturn = await prisma.itemTransaction.findFirst({
        where: {
          accountId: userId,
          status: { in: ['Returned', 'late_return'] },
          updatedAt: { gte: cooldownDate }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        include: {
          itemStack: {
            include: {
              item: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });
      
      if (recentReturn) {
        const daysSinceReturn = Math.floor(
          (new Date() - new Date(recentReturn.updatedAt)) / (1000 * 60 * 60 * 24)
        );
        const daysRemaining = cooldownDays - daysSinceReturn;
        
        return res.status(400).json({
          error: 'Cooldown period active',
          message: `Please wait ${daysRemaining} more day(s) before making a new request`,
          details: {
            itemReturned: recentReturn.itemStack.item.name,
            returnedAt: recentReturn.updatedAt,
            daysSinceReturn,
            cooldownDays,
            daysRemaining,
            type: 'cooldown_period'
          }
        });
      }
    }
    
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
          item: {
            category: 'Distribution' // Assuming distribution items have this category
          }
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
