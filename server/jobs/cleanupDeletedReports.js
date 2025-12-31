/**
 * CLEANUP JOB - Permanent deletion of old soft-deleted planting reports
 * Runs daily at 2:00 AM server time (configurable) and removes reports
 * that have been soft-deleted for longer than the cutoff window.
 */
import cron from 'node-cron';
import prisma from '../config/database.js';
import { logCleanup, logCleanupResult } from './logger.js';

const DEFAULT_TIMEZONE = process.env.CLEANUP_TIMEZONE || 'Asia/Manila';
const DEFAULT_CUTOFF_DAYS = Number(process.env.CLEANUP_CUTOFF_DAYS || 30);
const DEFAULT_CRON = process.env.CLEANUP_CRON || '0 0 2 * * *'; // 2:00 AM daily

function getCutoffDate() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DEFAULT_CUTOFF_DAYS);
  return cutoff;
}

export async function cleanupOldDeletedReports() {
  try {
    const cutoffDate = getCutoffDate();

    logCleanup(`🧹 Cleanup starting (cutoff ${cutoffDate.toISOString()})`);

    const reportsToDelete = await prisma.plantingReport.findMany({
      where: {
        isDeleted: true,
        deletedAt: { lte: cutoffDate }
      },
      select: {
        id: true,
        farmerName: true,
        farmLocation: true,
        deletedAt: true,
        deletedBy: true,
        state: true
      }
    });

    if (reportsToDelete.length === 0) {
      const result = { success: true, deleted: 0, reports: [] };
      logCleanupResult(result);
      return result;
    }

    reportsToDelete.forEach((report) => {
      const daysSinceDeletion = Math.floor(
        (Date.now() - new Date(report.deletedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      logCleanup(
        `Pending delete: ${report.id} | ${report.farmerName} | ${report.farmLocation} | ${daysSinceDeletion} days deleted`
      );
    });

    const deleteResult = await prisma.plantingReport.deleteMany({
      where: { id: { in: reportsToDelete.map((r) => r.id) } }
    });

    const result = {
      success: true,
      deleted: deleteResult.count,
      reports: reportsToDelete.map((r) => ({
        id: r.id,
        farmerName: r.farmerName,
        deletedAt: r.deletedAt
      }))
    };

    logCleanupResult(result);
    return result;
  } catch (error) {
    const result = { success: false, error: error.message };
    logCleanupResult(result);
    return result;
  }
}

export function scheduleCleanupJob() {
  const task = cron.schedule(
    DEFAULT_CRON,
    async () => {
      logCleanup(`[Cleanup Job] Triggered at ${new Date().toISOString()}`);
      await cleanupOldDeletedReports();
    },
    {
      scheduled: true,
      timezone: DEFAULT_TIMEZONE
    }
  );

  logCleanup(
    `✅ Cleanup job scheduled (${DEFAULT_CRON}) timezone=${DEFAULT_TIMEZONE}, cutoffDays=${DEFAULT_CUTOFF_DAYS}`
  );

  return task;
}

export async function runCleanupNow() {
  logCleanup(`[Cleanup Job] Manual trigger at ${new Date().toISOString()}`);
  return cleanupOldDeletedReports();
}

export default {
  scheduleCleanupJob,
  cleanupOldDeletedReports,
  runCleanupNow
};
