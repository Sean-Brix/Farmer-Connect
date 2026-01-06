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
 * Validates active request quotas (not monthly)
 */
async function checkDistributionLimit(req, res, next) {
  try {
    const userId = req.user?.id;
    const { quantity, item_id } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User authentication required'
      });
    }
    
    // Get system settings
    const maxActiveRequests = await getSetting('distribution_max_active_requests', 2);
    
    // 1. Check active request limit (not monthly)
    // Active statuses: Pending, Approved, Picked_Up
    const activeRequests = await prisma.itemTransaction.count({
      where: {
        accountId: userId,
        itemStack: {
          status: 'Distributed' // Distribution items have status 'Distributed'
        },
        status: {
          in: ['Pending', 'Approved', 'Picked_Up']
        }
      }
    });
    
    if (activeRequests >= maxActiveRequests) {
      return res.status(400).json({
        error: 'Active request limit reached',
        message: `You can only have ${maxActiveRequests} active distribution request(s) at a time`,
        details: {
          current: activeRequests,
          limit: maxActiveRequests,
          type: 'active_request_limit'
        }
      });
    }
    
    // 2. Check quantity limit against the specific ItemStack's limit
    if (quantity && item_id) {
      const itemStack = await prisma.itemStack.findFirst({
        where: {
          itemId: item_id,
          status: 'Distributed'
        }
      });
      
      if (itemStack && itemStack.max_quantity_per_request) {
        if (parseInt(quantity) > itemStack.max_quantity_per_request) {
          return res.status(400).json({
            error: 'Quantity limit exceeded',
            message: `Maximum ${itemStack.max_quantity_per_request} unit(s) can be requested per distribution request`,
            details: {
              requested: parseInt(quantity),
              limit: itemStack.max_quantity_per_request,
              type: 'quantity_limit'
            }
          });
        }
      }
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
