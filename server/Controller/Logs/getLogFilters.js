import { PrismaClient } from '../../prisma/generated/client.js';

const prisma = new PrismaClient();

/**
 * Get Audit Log Filters Data
 *
 * This controller provides the available filter options for the audit logs
 * including unique admins, actions, and target types for dropdown filters.
 */
async function getLogFilters(req, res) {
    try {
        // Get unique admins who have audit logs
        const uniqueAdmins = await prisma.auditLog.findMany({
            select: {
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
            distinct: ['adminId'],
            orderBy: {
                admin: {
                    username: 'asc',
                },
            },
        });

        // Get unique actions
        const uniqueActions = await prisma.auditLog.findMany({
            select: {
                action: true,
            },
            distinct: ['action'],
            orderBy: {
                action: 'asc',
            },
        });

        // Get unique target types
        const uniqueTargetTypes = await prisma.auditLog.findMany({
            select: {
                targetType: true,
            },
            distinct: ['targetType'],
            where: {
                targetType: { not: null },
            },
            orderBy: {
                targetType: 'asc',
            },
        });

        // Format the response
        const filters = {
            admins: uniqueAdmins.map((log) => ({
                id: log.admin.id,
                username: log.admin.username,
                fullName: `${log.admin.firstName} ${log.admin.lastName}`,
                access: log.admin.access,
            })),
            actions: uniqueActions.map((log) => log.action),
            targetTypes: uniqueTargetTypes
                .map((log) => log.targetType)
                .filter(Boolean),
        };

        return res.status(200).json({
            success: true,
            data: filters,
        });
    } catch (error) {
        console.error('Error fetching audit log filters:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching audit log filters',
            error: error.message,
        });
    }
}

export default getLogFilters;
