import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['error'],
});

// Batch writing configuration for high-traffic scenarios
const BATCH_ENABLED = true; // Set to false to disable batching
const BATCH_SIZE = 10; // Write every 10 logs
const BATCH_TIMEOUT = 5000; // Or every 5 seconds (whichever comes first)

let auditBatch = [];
let batchTimer = null;

/**
 * Flush batch to database
 */
async function flushBatch() {
    if (auditBatch.length === 0) return;

    const logsToWrite = [...auditBatch];
    auditBatch = [];

    if (batchTimer) {
        clearTimeout(batchTimer);
        batchTimer = null;
    }

    try {
        await prisma.auditLog.createMany({
            data: logsToWrite,
            skipDuplicates: true,
        });
    } catch (error) {
        console.error('Failed to write audit log batch:', error);
    }
}

/**
 * Add log to batch
 */
function addToBatch(logData) {
    auditBatch.push(logData);

    // Flush if batch size reached
    if (auditBatch.length >= BATCH_SIZE) {
        flushBatch().catch(err => console.error('Batch flush error:', err));
        return;
    }

    // Set timer to flush if not already set
    if (!batchTimer) {
        batchTimer = setTimeout(() => {
            flushBatch().catch(err => console.error('Batch timer flush error:', err));
        }, BATCH_TIMEOUT);
    }
}

// Graceful shutdown - flush remaining logs
process.on('SIGTERM', async () => {
    await flushBatch();
});
process.on('SIGINT', async () => {
    await flushBatch();
});

/**
 * Audit Logger Service (OPTIMIZED)
 *
 * This service is responsible for creating audit log entries for all admin actions
 * throughout the Farmer Connect platform. It captures who performed what action,
 * when it was performed, and provides detailed context about the changes.
 *
 * Optimizations for free cloud hosting:
 * - Batch writing (10 logs or 5 seconds, whichever comes first)
 * - Non-blocking operations (fire-and-forget by default)
 * - Minimal metadata storage
 * - Efficient error handling without breaking main flow
 *
 * Usage Example:
 * ```javascript
 * import auditLogger from '../Services/auditLogger.js';
 *
 * // Log an inventory item creation (non-blocking)
 * auditLogger.log({
 *     adminId: req.user.id,
 *     action: 'INVENTORY_CREATE',
 *     targetType: 'InventoryItem',
 *     targetId: newItem.id,
 *     targetName: newItem.name,
 *     details: `Created new inventory item: ${newItem.name}`,
 *     metadata: { category: newItem.category },
 *     req: req
 * }).catch(err => console.error('Audit log failed:', err));
 * ```
 */

class AuditLogger {
    /**
     * Log an audit entry
     * @param {Object} params - Audit log parameters
     * @param {string} params.adminId - ID of the admin performing the action
     * @param {string} params.action - The action being performed (must match audit_action enum)
     * @param {string} [params.targetType] - Type of entity being affected
     * @param {string} [params.targetId] - ID of the affected entity
     * @param {string} [params.targetName] - Display name of the affected entity
     * @param {string} [params.details] - Human-readable description of the action
     * @param {Object} [params.metadata] - Structured data about the action
     * @param {Object} [params.req] - Express request object for IP/User Agent capture
     * @returns {Promise<Object>} The created audit log entry
     */
    async log({
        adminId,
        action,
        targetType = null,
        targetId = null,
        targetName = null,
        details = null,
        metadata = null,
        req = null,
    }) {
        try {
            // Extract IP address and User Agent from request if provided
            let ipAddress = null;
            let userAgent = null;

            if (req) {
                // Get IP address, considering potential proxy/load balancer
                ipAddress =
                    req.ip ||
                    req.connection?.remoteAddress ||
                    req.socket?.remoteAddress ||
                    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                    req.headers['x-real-ip'] ||
                    null;

                userAgent = req.get('User-Agent') || null;
            }

            const logData = {
                adminId,
                action,
                targetType,
                targetId,
                targetName,
                details,
                metadata: metadata ? JSON.stringify(metadata) : null,
                ipAddress,
                userAgent,
            };

            // Use batching if enabled
            if (BATCH_ENABLED) {
                addToBatch(logData);
                return { batched: true };
            }

            // Otherwise, write immediately
            const auditLog = await prisma.auditLog.create({
                data: logData,
                select: {
                    id: true,
                    action: true,
                    createdAt: true,
                },
            });

            return auditLog;
        } catch (error) {
            // Log error but don't throw - audit logging should not break main functionality
            console.error('Failed to create audit log:', error.message);

            // Return null to indicate logging failed
            return null;
        }
    }

    /**
     * Convenience method for login actions
     */
    async logLogin(adminId, success = true, req = null) {
        return this.log({
            adminId,
            action: success ? 'LOGIN' : 'LOGIN_FAILED',
            details: success
                ? 'Admin logged in successfully'
                : 'Failed login attempt',
            req,
        });
    }

    /**
     * Convenience method for logout actions
     */
    async logLogout(adminId, req = null) {
        return this.log({
            adminId,
            action: 'LOGOUT',
            details: 'Admin logged out',
            req,
        });
    }

    /**
     * Convenience method for account management actions
     */
    async logAccountAction(
        adminId,
        action,
        targetAccount,
        details = null,
        req = null
    ) {
        return this.log({
            adminId,
            action,
            targetType: 'Account',
            targetId: targetAccount.id,
            targetName: `${targetAccount.firstName} ${targetAccount.surname} (@${targetAccount.username})`,
            details,
            metadata: {
                targetUsername: targetAccount.username,
                targetEmail: targetAccount.email,
                targetAccess: targetAccount.access,
            },
            req,
        });
    }

    /**
     * Convenience method for inventory actions
     */
    async logInventoryAction(
        adminId,
        action,
        item,
        details = null,
        additionalData = {},
        req = null
    ) {
        return this.log({
            adminId,
            action,
            targetType: 'InventoryItem',
            targetId: item.id,
            targetName: item.name,
            details,
            metadata: {
                itemName: item.name,
                category: item.category,
                ...additionalData,
            },
            req,
        });
    }

    /**
     * Convenience method for distribution actions
     */
    async logDistributionAction(
        adminId,
        action,
        item,
        details = null,
        additionalData = {},
        req = null
    ) {
        return this.log({
            adminId,
            action,
            targetType: 'Distribution',
            targetId: item.id,
            targetName: item.name || item.itemName,
            details,
            metadata: {
                ...additionalData,
            },
            req,
        });
    }

    /**
     * Convenience method for seminar actions
     */
    async logSeminarAction(
        adminId,
        action,
        seminar,
        details = null,
        additionalData = {},
        req = null
    ) {
        return this.log({
            adminId,
            action,
            targetType: 'Seminar',
            targetId: seminar.id,
            targetName: seminar.title,
            details,
            metadata: {
                seminarTitle: seminar.title,
                speaker: seminar.speaker,
                startDate: seminar.start_date,
                ...additionalData,
            },
            req,
        });
    }

    /**
     * Convenience method for EIC actions
     */
    async logEICAction(
        adminId,
        action,
        item,
        details = null,
        additionalData = {},
        req = null
    ) {
        return this.log({
            adminId,
            action,
            targetType: 'EIC',
            targetId: item.id,
            targetName: item.name || item.itemName,
            details,
            metadata: {
                ...additionalData,
            },
            req,
        });
    }

    /**
     * Convenience method for inquiry actions
     */
    async logInquiryAction(
        adminId,
        action,
        inquiry,
        details = null,
        additionalData = {},
        req = null
    ) {
        return this.log({
            adminId,
            action,
            targetType: 'Inquiry',
            targetId: inquiry?.id,
            targetName: inquiry?.subject,
            details,
            metadata: {
                status: inquiry?.status,
                userId: inquiry?.userId,
                ...additionalData,
            },
            req,
        });
    }

    /**
     * Convenience methods for survey actions
     */
    async logSurveyFormAction(adminId, action, surveyForm, details = null, additionalData = {}, req = null) {
        return this.log({
            adminId,
            action,
            targetType: 'SurveyForm',
            targetId: surveyForm?.id,
            targetName: surveyForm?.title,
            details,
            metadata: {
                category: surveyForm?.category,
                status: surveyForm?.status,
                ...additionalData,
            },
            req,
        });
    }

    async logSurveyStatisticAction(adminId, action, statistic, details = null, additionalData = {}, req = null) {
        return this.log({
            adminId,
            action,
            targetType: 'SurveyStatistic',
            targetId: statistic?.id,
            targetName: statistic?.title,
            details,
            metadata: {
                chartType: statistic?.chartType,
                surveyFormId: statistic?.surveyFormId,
                ...additionalData,
            },
            req,
        });
    }

    /**
     * Convenience methods for seed tracking actions
     */
    async logRegisteredCropAction(adminId, action, crop, details = null, additionalData = {}, req = null) {
        return this.log({
            adminId,
            action,
            targetType: 'RegisteredCrop',
            targetId: crop?.id,
            targetName: `${crop?.cropType || 'Crop'} ${crop?.variety || ''}`.trim(),
            details,
            metadata: {
                cropType: crop?.cropType,
                variety: crop?.variety,
                status: crop?.status,
                currentStage: crop?.currentStage,
                ...additionalData,
            },
            req,
        });
    }

    async logCropReportAction(adminId, action, report, details = null, additionalData = {}, req = null) {
        return this.log({
            adminId,
            action,
            targetType: 'CropMonthlyReport',
            targetId: report?.id,
            targetName: `Report ${report?.reportDate ? new Date(report.reportDate).toISOString().slice(0,10) : ''}`.trim(),
            details,
            metadata: {
                cropId: report?.cropId,
                growthStage: report?.growthStage,
                ...additionalData,
            },
            req,
        });
    }
}

// Export singleton instance
const auditLogger = new AuditLogger();
export default auditLogger;
