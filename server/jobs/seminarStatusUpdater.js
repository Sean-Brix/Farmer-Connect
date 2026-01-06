/**
 * SCHEDULED JOB - Automatic seminar status updates
 * Runs every 15 minutes to check and update seminar statuses based on
 * current date/time:
 * - Upcoming → Ongoing (when start date/time is reached)
 * - Ongoing → Completed (when end date/time has passed)
 */
import cron from 'node-cron';
import { updateSeminarStatuses } from '../Utils/seminarStatusUpdater.js';

const DEFAULT_TIMEZONE = process.env.SEMINAR_UPDATE_TIMEZONE || 'Asia/Manila';
const DEFAULT_CRON = process.env.SEMINAR_UPDATE_CRON || '*/15 * * * *'; // Every 15 minutes

let scheduledTask = null;

function logUpdate(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [SeminarStatusJob] ${message}`);
}

/**
 * Manual trigger for status updates
 */
export async function runSeminarStatusUpdate() {
    try {
        logUpdate('🔄 Manual status update triggered');
        const updates = await updateSeminarStatuses();
        
        if (updates && updates.length > 0) {
            logUpdate(`✅ Updated ${updates.length} seminar(s):`);
            updates.forEach(u => {
                logUpdate(`   - "${u.title}": ${u.oldStatus} → ${u.newStatus}`);
            });
        } else {
            logUpdate('✓ No status updates needed');
        }
        
        return { success: true, updated: updates.length, details: updates };
    } catch (error) {
        logUpdate(`❌ Status update failed: ${error.message}`);
        console.error(error);
        return { success: false, error: error.message };
    }
}

/**
 * Start the scheduled cron job
 */
export function startSeminarStatusUpdater() {
    if (scheduledTask) {
        logUpdate('⚠️ Status updater already running');
        return;
    }

    logUpdate(`📅 Starting scheduled status updater`);
    logUpdate(`   Schedule: ${DEFAULT_CRON}`);
    logUpdate(`   Timezone: ${DEFAULT_TIMEZONE}`);

    scheduledTask = cron.schedule(
        DEFAULT_CRON,
        async () => {
            await runSeminarStatusUpdate();
        },
        {
            scheduled: true,
            timezone: DEFAULT_TIMEZONE
        }
    );

    logUpdate('✅ Seminar status updater started successfully');
}

/**
 * Stop the scheduled cron job
 */
export function stopSeminarStatusUpdater() {
    if (scheduledTask) {
        scheduledTask.stop();
        scheduledTask = null;
        logUpdate('🛑 Seminar status updater stopped');
    } else {
        logUpdate('⚠️ No active status updater to stop');
    }
}

export default {
    start: startSeminarStatusUpdater,
    stop: stopSeminarStatusUpdater,
    runNow: runSeminarStatusUpdate
};
