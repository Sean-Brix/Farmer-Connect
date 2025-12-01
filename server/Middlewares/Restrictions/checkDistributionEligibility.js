import prisma from '../../config/database.js';
import { checkEligibility, addToWaitlist } from '../../Services/distributionQuotaService.js';

/**
 * Middleware to check distribution eligibility and quotas
 * Validates:
 * - Eligibility criteria (livelihood type, location, etc.)
 * - User quotas (max per user, monthly limits)
 * - Cooldown periods
 * - Stock availability
 * 
 * If item is out of stock and waitlist is enabled, adds user to waitlist
 */
async function checkDistributionEligibility(req, res, next) {
  try {
    const userId = req.user?.id;
    const { itemStackId, quantity } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User authentication required'
      });
    }

    if (!itemStackId) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Item stack ID is required'
      });
    }

    // Get item stack with quota configuration
    const itemStack = await prisma.itemStack.findUnique({
      where: { id: itemStackId },
      include: {
        item: {
          select: {
            name: true,
            category: true
          }
        },
        distributionQuota: true
      }
    });

    if (!itemStack) {
      return res.status(404).json({
        error: 'Item not found',
        message: 'The requested item does not exist'
      });
    }

    // Check stock availability
    const requestedQty = parseInt(quantity) || 1;
    
    if (itemStack.quantity < requestedQty) {
      // Check if waitlist is enabled
      const waitlistEnabled = await prisma.systemSettings.findUnique({
        where: { key: 'distribution_waitlist_enabled' }
      });

      if (waitlistEnabled && waitlistEnabled.value === 'true') {
        // Add to waitlist
        const waitlistResult = await addToWaitlist(userId, itemStackId, requestedQty);
        
        return res.status(200).json({
          success: true,
          addedToWaitlist: true,
          position: waitlistResult.position,
          message: `Item is currently out of stock. ${waitlistResult.message}`,
          waitlistEntry: waitlistResult.waitlistEntry
        });
      } else {
        return res.status(400).json({
          error: 'Out of stock',
          message: `Only ${itemStack.quantity} unit(s) available. You requested ${requestedQty}.`,
          details: {
            available: itemStack.quantity,
            requested: requestedQty,
            type: 'stock_unavailable'
          }
        });
      }
    }

    // Check eligibility (quotas, criteria, etc.)
    const eligibilityResult = await checkEligibility(userId, itemStackId);

    if (!eligibilityResult.eligible) {
      return res.status(403).json({
        error: 'Not eligible',
        message: eligibilityResult.reason,
        details: {
          type: 'eligibility_failed',
          quota: eligibilityResult.quota
        }
      });
    }

    // Store eligibility info in request for later use
    req.eligibilityInfo = {
      quota: eligibilityResult.quota,
      itemStack
    };

    // All checks passed
    next();
    
  } catch (error) {
    console.error('Error in checkDistributionEligibility middleware:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Failed to validate distribution eligibility'
    });
  }
}

export { checkDistributionEligibility };
export default checkDistributionEligibility;
