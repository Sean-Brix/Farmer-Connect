import { checkOverdueItems, runManualCheck } from '../../Services/cronJobs/checkOverdueItems.mjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Global state to track cron job status
let cronJobEnabled = false;

/**
 * Get the current status of the auto-update cron job and auto-archive settings
 */
export const getCronStatus = async (req, res) => {
  try {    // Get all automation settings from database
    const [
      autoArchiveEnabled, autoArchiveDays,
      autoRejectEnabled, autoRejectGraceDays,
      autoNoPickupEnabled, autoNoPickupDays
    ] = await Promise.all([
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_archive_enabled' } }),
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_archive_days' } }),
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_reject_enabled' } }),
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_reject_grace_days' } }),
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_no_pickup_enabled' } }),
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_no_pickup_days' } })
    ]);

    return res.status(200).json({
      enabled: cronJobEnabled,
      schedule: '0 1 * * *', // Daily at 1:00 AM
      timezone: 'Asia/Manila',
      autoArchive: {
        enabled: autoArchiveEnabled?.value === 'true' || false,
        days: parseInt(autoArchiveDays?.value || '30', 10)
      },
      autoReject: {
        enabled: autoRejectEnabled?.value === 'true' || false,
        graceDays: parseInt(autoRejectGraceDays?.value || '0', 10)
      },
      autoNoPickup: {
        enabled: autoNoPickupEnabled?.value === 'true' || false,
        days: parseInt(autoNoPickupDays?.value || '3', 10)
      }
    });
  } catch (error) {
    console.error('Error getting cron status:', error);
    return res.status(500).json({ 
      error: 'Failed to get cron status',
      message: error.message 
    });
  }
};

/**
 * Enable or disable the auto-update cron job
 */
export const toggleCronJob = async (req, res) => {
  try {
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Field "enabled" must be a boolean value' 
      });
    }

    if (enabled && !cronJobEnabled) {
      // Start the cron job
      checkOverdueItems.start();
      cronJobEnabled = true;
      console.error(`[CRON] Auto status update enabled at ${new Date().toISOString()}`);
    } else if (!enabled && cronJobEnabled) {
      // Stop the cron job
      checkOverdueItems.stop();
      cronJobEnabled = false;
      console.error(`[CRON] Auto status update disabled at ${new Date().toISOString()}`);
    }

    return res.status(200).json({
      success: true,
      enabled: cronJobEnabled,
      message: `Auto status update ${cronJobEnabled ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('Error toggling cron job:', error);
    return res.status(500).json({ 
      error: 'Failed to toggle cron job',
      message: error.message 
    });
  }
};

/**
 * Manually trigger the overdue check (for testing or immediate execution)
 */
export const manualTrigger = async (req, res) => {
  try {
    const result = await runManualCheck();
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in manual trigger:', error);
    return res.status(500).json({ 
      error: 'Failed to run manual check',
      message: error.message 
    });
  }
};

/**
 * Update auto-archive settings for borrowed items
 */
export const updateAutoArchiveSettings = async (req, res) => {
  try {
    const { enabled, days } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Field "enabled" must be a boolean value' 
      });
    }

    if (days !== undefined && (typeof days !== 'number' || days < 1 || days > 365)) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Field "days" must be a number between 1 and 365' 
      });
    }

    const userId = req.account?.id;

    // Update or create settings
    await Promise.all([
      prisma.systemSettings.upsert({
        where: { key: 'eic_auto_archive_enabled' },
        update: { 
          value: enabled.toString(), 
          updatedBy: userId,
          updatedAt: new Date()
        },
        create: {
          key: 'eic_auto_archive_enabled',
          value: enabled.toString(),
          description: 'Enable/disable auto-archive for overdue borrowed items',
          category: 'eic',
          dataType: 'boolean',
          updatedBy: userId
        }
      }),
      days !== undefined && prisma.systemSettings.upsert({
        where: { key: 'eic_auto_archive_days' },
        update: { 
          value: days.toString(), 
          updatedBy: userId,
          updatedAt: new Date()
        },
        create: {
          key: 'eic_auto_archive_days',
          value: days.toString(),
          description: 'Number of days before auto-archiving overdue borrowed items',
          category: 'eic',
          dataType: 'number',
          updatedBy: userId
        }
      })
    ]);

    console.error(`[SETTINGS] Auto-archive settings updated: enabled=${enabled}, days=${days || 'unchanged'}`);

    return res.status(200).json({
      success: true,
      message: 'Auto-archive settings updated successfully',
      settings: {
        enabled,
        days: days || parseInt((await prisma.systemSettings.findUnique({ where: { key: 'eic_auto_archive_days' } }))?.value || '30', 10)
      }
    });
  } catch (error) {
    console.error('Error updating auto-archive settings:', error);
    return res.status(500).json({ 
      error: 'Failed to update auto-archive settings',
      message: error.message 
    });
  }
};

/**
 * Update auto-reject settings for expired pending requests
 */
export const updateAutoRejectSettings = async (req, res) => {
  try {
    const { enabled, graceDays } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Field "enabled" must be a boolean value' 
      });
    }

    if (graceDays !== undefined && (typeof graceDays !== 'number' || graceDays < 0 || graceDays > 30)) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Field "graceDays" must be a number between 0 and 30' 
      });
    }

    const userId = req.account?.id;

    await Promise.all([
      prisma.systemSettings.upsert({
        where: { key: 'eic_auto_reject_enabled' },
        update: { 
          value: enabled.toString(), 
          updatedBy: userId,
          updatedAt: new Date()
        },
        create: {
          key: 'eic_auto_reject_enabled',
          value: enabled.toString(),
          description: 'Enable/disable auto-reject for expired pending requests',
          category: 'eic',
          dataType: 'boolean',
          updatedBy: userId
        }
      }),
      graceDays !== undefined && prisma.systemSettings.upsert({
        where: { key: 'eic_auto_reject_grace_days' },
        update: { 
          value: graceDays.toString(), 
          updatedBy: userId,
          updatedAt: new Date()
        },
        create: {
          key: 'eic_auto_reject_grace_days',
          value: graceDays.toString(),
          description: 'Grace period (days) after pickup date before auto-rejecting',
          category: 'eic',
          dataType: 'number',
          updatedBy: userId
        }
      })
    ]);

    console.error(`[SETTINGS] Auto-reject settings updated: enabled=${enabled}, graceDays=${graceDays || 'unchanged'}`);

    return res.status(200).json({
      success: true,
      message: 'Auto-reject settings updated successfully',
      settings: {
        enabled,
        graceDays: graceDays ?? parseInt((await prisma.systemSettings.findUnique({ where: { key: 'eic_auto_reject_grace_days' } }))?.value || '0', 10)
      }
    });
  } catch (error) {
    console.error('Error updating auto-reject settings:', error);
    return res.status(500).json({ 
      error: 'Failed to update auto-reject settings',
      message: error.message 
    });
  }
};

/**
 * Update auto-no_pickup settings for overdue reservations
 */
export const updateAutoNoPickupSettings = async (req, res) => {
  try {
    const { enabled, days } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Field "enabled" must be a boolean value' 
      });
    }

    if (days !== undefined && (typeof days !== 'number' || days < 1 || days > 30)) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Field "days" must be a number between 1 and 30' 
      });
    }

    const userId = req.account?.id;

    await Promise.all([
      prisma.systemSettings.upsert({
        where: { key: 'eic_auto_no_pickup_enabled' },
        update: { 
          value: enabled.toString(), 
          updatedBy: userId,
          updatedAt: new Date()
        },
        create: {
          key: 'eic_auto_no_pickup_enabled',
          value: enabled.toString(),
          description: 'Enable/disable auto-no_pickup for overdue reservations',
          category: 'eic',
          dataType: 'boolean',
          updatedBy: userId
        }
      }),
      days !== undefined && prisma.systemSettings.upsert({
        where: { key: 'eic_auto_no_pickup_days' },
        update: { 
          value: days.toString(), 
          updatedBy: userId,
          updatedAt: new Date()
        },
        create: {
          key: 'eic_auto_no_pickup_days',
          value: days.toString(),
          description: 'Days after pickup date before auto-marking as No_Pickup',
          category: 'eic',
          dataType: 'number',
          updatedBy: userId
        }
      })
    ]);

    console.error(`[SETTINGS] Auto-no_pickup settings updated: enabled=${enabled}, days=${days || 'unchanged'}`);

    return res.status(200).json({
      success: true,
      message: 'Auto-no_pickup settings updated successfully',
      settings: {
        enabled,
        days: days ?? parseInt((await prisma.systemSettings.findUnique({ where: { key: 'eic_auto_no_pickup_days' } }))?.value || '3', 10)
      }
    });
  } catch (error) {
    console.error('Error updating auto-no_pickup settings:', error);
    return res.status(500).json({ 
      error: 'Failed to update auto-no_pickup settings',
      message: error.message 
    });
  }
};
