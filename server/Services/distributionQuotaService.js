import prisma from '../config/database.js';

/**
 * Distribution Quota Service
 * Handles eligibility checking, quota validation, and waitlist management
 */

/**
 * Check if user is eligible for a distribution item
 * @param {string} userId - User ID
 * @param {string} itemStackId - Item Stack ID
 * @returns {Promise<{eligible: boolean, reason?: string, quota?: Object}>}
 */
export async function checkEligibility(userId, itemStackId) {
  try {
    // Get quota configuration for this item
    const quota = await prisma.distributionQuota.findFirst({
      where: {
        itemStackId,
        active: true
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

    // If no quota configured, user is eligible
    if (!quota) {
      return { eligible: true };
    }

    // Get user profile data
    const user = await prisma.account.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        surname: true,
        client_profile: true,
        // Add other fields as needed for eligibility criteria
      }
    });

    if (!user) {
      return {
        eligible: false,
        reason: 'User not found'
      };
    }

    // Check eligibility criteria (if configured)
    if (quota.eligibilityCriteria) {
      const criteria = quota.eligibilityCriteria;

      // Check client_profile (livelihood type)
      if (criteria.client_profile && Array.isArray(criteria.client_profile)) {
        if (!criteria.client_profile.includes(user.client_profile)) {
          return {
            eligible: false,
            reason: `This item is only available for: ${criteria.client_profile.join(', ')}`,
            quota
          };
        }
      }

      // Additional criteria can be added here
      // Examples: barangay, municipality, age, etc.
    }

    // Check if user has already received maximum allowed
    const totalReceived = await prisma.distributionHistory.count({
      where: {
        accountId: userId,
        itemStackId
      }
    });

    if (totalReceived >= quota.maxPerUser) {
      return {
        eligible: false,
        reason: `You have already received the maximum allowed (${quota.maxPerUser}) of this item`,
        quota
      };
    }

    // Check monthly request limit
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const requestsThisMonth = await prisma.distributionHistory.count({
      where: {
        accountId: userId,
        itemStackId,
        receivedAt: {
          gte: startOfMonth
        }
      }
    });

    if (requestsThisMonth >= quota.maxRequestsPerMonth) {
      return {
        eligible: false,
        reason: `Monthly limit reached (${quota.maxRequestsPerMonth} request(s) per month)`,
        quota
      };
    }

    // Cooldown period check removed - Admin has full control over request approval

    // All checks passed
    return {
      eligible: true,
      quota
    };
  } catch (error) {
    console.error('Error checking eligibility:', error);
    throw error;
  }
}

/**
 * Record a distribution to history
 * @param {string} userId - User ID
 * @param {string} itemStackId - Item Stack ID
 * @param {number} quantity - Quantity received
 * @param {string} transactionId - Related transaction ID
 */
export async function recordDistribution(userId, itemStackId, quantity, transactionId = null) {
  try {
    const history = await prisma.distributionHistory.create({
      data: {
        accountId: userId,
        itemStackId,
        quantity,
        transactionId
      }
    });

    return history;
  } catch (error) {
    console.error('Error recording distribution:', error);
    throw error;
  }
}

/**
 * Add user to waitlist
 * @param {string} userId - User ID
 * @param {string} itemStackId - Item Stack ID
 * @param {number} quantity - Requested quantity
 * @param {number} expiryDays - Days until waitlist entry expires (default 7)
 * @returns {Promise<{waitlistEntry: Object, position: number}>}
 */
export async function addToWaitlist(userId, itemStackId, quantity = 1, expiryDays = 7) {
  try {
    // Check if user is already on waitlist for this item
    const existing = await prisma.distributionWaitlist.findUnique({
      where: {
        accountId_itemStackId: {
          accountId: userId,
          itemStackId
        }
      }
    });

    if (existing) {
      return {
        waitlistEntry: existing,
        position: existing.position,
        message: 'You are already on the waitlist for this item'
      };
    }

    // Get current waitlist count to determine position
    const waitlistCount = await prisma.distributionWaitlist.count({
      where: { itemStackId }
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    const waitlistEntry = await prisma.distributionWaitlist.create({
      data: {
        accountId: userId,
        itemStackId,
        quantity,
        position: waitlistCount + 1,
        expiresAt
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

    return {
      waitlistEntry,
      position: waitlistEntry.position,
      message: `Added to waitlist (Position: ${waitlistEntry.position})`
    };
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    throw error;
  }
}

/**
 * Notify waitlist users when stock becomes available
 * @param {string} itemStackId - Item Stack ID
 * @param {number} quantityAdded - Quantity added to stock
 * @returns {Promise<{notified: number}>}
 */
export async function notifyWaitlist(itemStackId, quantityAdded) {
  try {
    // Get waitlist entries that haven't been notified yet
    const waitlistEntries = await prisma.distributionWaitlist.findMany({
      where: {
        itemStackId,
        notified: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        position: 'asc'
      },
      take: Math.ceil(quantityAdded / 1), // Notify as many as stock allows
      include: {
        account: {
          select: {
            id: true,
            firstName: true,
            email: true
          }
        },
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

    let notifiedCount = 0;

    for (const entry of waitlistEntries) {
      // Create notification
      await prisma.notification.create({
        data: {
          accountId: entry.accountId,
          type: 'SYSTEM_ALERT',
          title: 'Waitlist Update: Item Available',
          message: `${entry.itemStack.item.name} is now available! You are #${entry.position} on the waitlist.`,
          relatedId: entry.itemStackId
        }
      });

      // Mark as notified
      await prisma.distributionWaitlist.update({
        where: { id: entry.id },
        data: { notified: true }
      });

      notifiedCount++;
    }

    return { notified: notifiedCount };
  } catch (error) {
    console.error('Error notifying waitlist:', error);
    throw error;
  }
}

/**
 * Remove user from waitlist
 * @param {string} userId - User ID
 * @param {string} itemStackId - Item Stack ID
 */
export async function removeFromWaitlist(userId, itemStackId) {
  try {
    const deleted = await prisma.distributionWaitlist.delete({
      where: {
        accountId_itemStackId: {
          accountId: userId,
          itemStackId
        }
      }
    });

    // Reorder positions
    await reorderWaitlist(itemStackId);

    return deleted;
  } catch (error) {
    console.error('Error removing from waitlist:', error);
    throw error;
  }
}

/**
 * Reorder waitlist positions after removal
 * @param {string} itemStackId - Item Stack ID
 */
async function reorderWaitlist(itemStackId) {
  const entries = await prisma.distributionWaitlist.findMany({
    where: { itemStackId },
    orderBy: { position: 'asc' }
  });

  for (let i = 0; i < entries.length; i++) {
    await prisma.distributionWaitlist.update({
      where: { id: entries[i].id },
      data: { position: i + 1 }
    });
  }
}

/**
 * Clean expired waitlist entries
 */
export async function cleanExpiredWaitlist() {
  try {
    const deleted = await prisma.distributionWaitlist.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    console.log(`🧹 Cleaned ${deleted.count} expired waitlist entries`);
    return deleted;
  } catch (error) {
    console.error('Error cleaning expired waitlist:', error);
    throw error;
  }
}

/**
 * Get user's waitlist entries
 * @param {string} userId - User ID
 */
export async function getUserWaitlist(userId) {
  try {
    const entries = await prisma.distributionWaitlist.findMany({
      where: {
        accountId: userId,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        itemStack: {
          include: {
            item: {
              select: {
                name: true,
                description: true,
                picture: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return entries;
  } catch (error) {
    console.error('Error getting user waitlist:', error);
    throw error;
  }
}

/**
 * Get distribution history for user
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of records to return
 */
export async function getUserDistributionHistory(userId, limit = 50) {
  try {
    const history = await prisma.distributionHistory.findMany({
      where: { accountId: userId },
      include: {
        itemStack: {
          include: {
            item: {
              select: {
                name: true,
                description: true
              }
            }
          }
        }
      },
      orderBy: {
        receivedAt: 'desc'
      },
      take: limit
    });

    return history;
  } catch (error) {
    console.error('Error getting distribution history:', error);
    throw error;
  }
}

export default {
  checkEligibility,
  recordDistribution,
  addToWaitlist,
  notifyWaitlist,
  removeFromWaitlist,
  cleanExpiredWaitlist,
  getUserWaitlist,
  getUserDistributionHistory
};
