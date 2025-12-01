import prisma from '../../config/database.js';
import { notifyWaitlist, cleanExpiredWaitlist } from '../../Services/distributionQuotaService.js';

/**
 * Get all distribution quotas
 */
export const getAllQuotas = async (req, res) => {
  try {
    const { active } = req.query;
    
    const whereClause = {};
    if (active !== undefined) {
      whereClause.active = active === 'true';
    }

    const quotas = await prisma.distributionQuota.findMany({
      where: whereClause,
      include: {
        itemStack: {
          include: {
            item: {
              select: {
                name: true,
                description: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      quotas
    });
  } catch (error) {
    console.error('Error getting quotas:', error);
    return res.status(500).json({
      error: 'Failed to get quotas',
      message: error.message
    });
  }
};

/**
 * Get quota for specific item
 */
export const getQuotaByItem = async (req, res) => {
  try {
    const { itemStackId } = req.params;

    const quota = await prisma.distributionQuota.findUnique({
      where: { itemStackId },
      include: {
        itemStack: {
          include: {
            item: true
          }
        }
      }
    });

    if (!quota) {
      return res.status(404).json({
        error: 'Quota not found',
        message: 'No quota configuration found for this item'
      });
    }

    return res.status(200).json({
      success: true,
      quota
    });
  } catch (error) {
    console.error('Error getting quota:', error);
    return res.status(500).json({
      error: 'Failed to get quota',
      message: error.message
    });
  }
};

/**
 * Create or update distribution quota
 */
export const upsertQuota = async (req, res) => {
  try {
    const {
      itemStackId,
      maxPerUser,
      maxRequestsPerMonth,
      cooldownDays,
      eligibilityCriteria,
      active
    } = req.body;

    if (!itemStackId) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Item stack ID is required'
      });
    }

    // Validate quota values
    if (maxPerUser !== undefined && (maxPerUser < 1 || maxPerUser > 100)) {
      return res.status(400).json({
        error: 'Invalid value',
        message: 'Max per user must be between 1 and 100'
      });
    }

    if (maxRequestsPerMonth !== undefined && (maxRequestsPerMonth < 1 || maxRequestsPerMonth > 30)) {
      return res.status(400).json({
        error: 'Invalid value',
        message: 'Max requests per month must be between 1 and 30'
      });
    }

    if (cooldownDays !== undefined && (cooldownDays < 0 || cooldownDays > 365)) {
      return res.status(400).json({
        error: 'Invalid value',
        message: 'Cooldown days must be between 0 and 365'
      });
    }

    const quotaData = {
      maxPerUser: maxPerUser !== undefined ? parseInt(maxPerUser) : 1,
      maxRequestsPerMonth: maxRequestsPerMonth !== undefined ? parseInt(maxRequestsPerMonth) : 1,
      cooldownDays: cooldownDays !== undefined ? parseInt(cooldownDays) : 30,
      eligibilityCriteria: eligibilityCriteria || null,
      active: active !== undefined ? active : true
    };

    const quota = await prisma.distributionQuota.upsert({
      where: { itemStackId },
      update: quotaData,
      create: {
        itemStackId,
        ...quotaData
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

    return res.status(200).json({
      success: true,
      message: 'Quota configuration saved successfully',
      quota
    });
  } catch (error) {
    console.error('Error upserting quota:', error);
    return res.status(500).json({
      error: 'Failed to save quota',
      message: error.message
    });
  }
};

/**
 * Delete distribution quota
 */
export const deleteQuota = async (req, res) => {
  try {
    const { itemStackId } = req.params;

    const deleted = await prisma.distributionQuota.delete({
      where: { itemStackId }
    });

    return res.status(200).json({
      success: true,
      message: 'Quota configuration deleted successfully',
      deleted
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Quota not found',
        message: 'No quota configuration found for this item'
      });
    }

    console.error('Error deleting quota:', error);
    return res.status(500).json({
      error: 'Failed to delete quota',
      message: error.message
    });
  }
};

/**
 * Get waitlist for specific item
 */
export const getWaitlist = async (req, res) => {
  try {
    const { itemStackId } = req.params;

    const waitlist = await prisma.distributionWaitlist.findMany({
      where: {
        itemStackId,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        account: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true,
            contactNumber: true
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
      },
      orderBy: {
        position: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      count: waitlist.length,
      waitlist
    });
  } catch (error) {
    console.error('Error getting waitlist:', error);
    return res.status(500).json({
      error: 'Failed to get waitlist',
      message: error.message
    });
  }
};

/**
 * Get all waitlists
 */
export const getAllWaitlists = async (req, res) => {
  try {
    const waitlists = await prisma.distributionWaitlist.findMany({
      where: {
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        account: {
          select: {
            id: true,
            firstName: true,
            surname: true,
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
      },
      orderBy: [
        { itemStackId: 'asc' },
        { position: 'asc' }
      ]
    });

    // Group by item
    const grouped = waitlists.reduce((acc, entry) => {
      const itemId = entry.itemStackId;
      if (!acc[itemId]) {
        acc[itemId] = {
          itemStackId: itemId,
          itemName: entry.itemStack.item.name,
          entries: []
        };
      }
      acc[itemId].entries.push(entry);
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      totalEntries: waitlists.length,
      waitlists: Object.values(grouped)
    });
  } catch (error) {
    console.error('Error getting all waitlists:', error);
    return res.status(500).json({
      error: 'Failed to get waitlists',
      message: error.message
    });
  }
};

/**
 * Manually trigger waitlist notifications
 */
export const triggerWaitlistNotifications = async (req, res) => {
  try {
    const { itemStackId, quantityAdded } = req.body;

    if (!itemStackId || !quantityAdded) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Item stack ID and quantity are required'
      });
    }

    const result = await notifyWaitlist(itemStackId, parseInt(quantityAdded));

    return res.status(200).json({
      success: true,
      message: `Notified ${result.notified} user(s) on the waitlist`,
      notified: result.notified
    });
  } catch (error) {
    console.error('Error triggering waitlist notifications:', error);
    return res.status(500).json({
      error: 'Failed to notify waitlist',
      message: error.message
    });
  }
};

/**
 * Clean expired waitlist entries
 */
export const cleanWaitlist = async (req, res) => {
  try {
    const result = await cleanExpiredWaitlist();

    return res.status(200).json({
      success: true,
      message: `Cleaned ${result.count} expired waitlist entries`,
      deleted: result.count
    });
  } catch (error) {
    console.error('Error cleaning waitlist:', error);
    return res.status(500).json({
      error: 'Failed to clean waitlist',
      message: error.message
    });
  }
};

/**
 * Get distribution history
 */
export const getDistributionHistory = async (req, res) => {
  try {
    const { limit = 100, accountId, itemStackId } = req.query;

    const whereClause = {};
    if (accountId) whereClause.accountId = accountId;
    if (itemStackId) whereClause.itemStackId = itemStackId;

    const history = await prisma.distributionHistory.findMany({
      where: whereClause,
      include: {
        account: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true
          }
        },
        itemStack: {
          include: {
            item: {
              select: {
                name: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        receivedAt: 'desc'
      },
      take: parseInt(limit)
    });

    return res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error('Error getting distribution history:', error);
    return res.status(500).json({
      error: 'Failed to get distribution history',
      message: error.message
    });
  }
};
