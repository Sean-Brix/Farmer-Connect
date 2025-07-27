import { PrismaClient } from '../prisma/generated/client.js';

const prisma = new PrismaClient();

/**
 * Audit Logger Service
 *
 * This service is responsible for creating audit log entries for all admin actions
 * throughout the Farmer Connect platform. It captures who performed what action,
 * when it was performed, and provides detailed context about the changes.
 *
 * Usage Example:
 * ```javascript
 * import auditLogger from '../Services/auditLogger.js';
 *
 * // Log an inventory item creation
 * await auditLogger.log({
 *     adminId: req.user.id,
 *     action: 'INVENTORY_CREATE',
 *     targetType: 'InventoryItem',
 *     targetId: newItem.id,
 *     targetName: newItem.name,
 *     details: `Created new inventory item: ${newItem.name} in category ${newItem.category}`,
 *     metadata: {
 *         itemData: newItem,
 *         category: newItem.category
 *     },
 *     req: req // Optional - for IP and User Agent capture
 * });
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
                    'unknown';

                userAgent = req.get('User-Agent') || 'unknown';
            }

            // Create the audit log entry
            const auditLog = await prisma.auditLog.create({
                data: {
                    adminId,
                    action,
                    targetType,
                    targetId,
                    targetName,
                    details,
                    metadata: metadata ? JSON.stringify(metadata) : null,
                    ipAddress,
                    userAgent,
                },
                include: {
                    admin: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            access: true,
                        },
                    },
                },
            });

            return auditLog;
        } catch (error) {
            // Log error but don't throw - audit logging should not break main functionality
            console.error('Failed to create audit log:', error);
            console.error('Audit log data:', {
                adminId,
                action,
                targetType,
                targetId,
                targetName,
                details,
            });

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
            targetName: `${targetAccount.firstName} ${targetAccount.lastName} (@${targetAccount.username})`,
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
}

// Export singleton instance
const auditLogger = new AuditLogger();
export default auditLogger;
