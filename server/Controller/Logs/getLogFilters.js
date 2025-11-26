import prisma from '../../config/database.js';

// Simple in-memory cache for filter data (rarely changes)
let filterCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get Audit Log Filters Data (OPTIMIZED)
 *
 * Optimizations for free cloud hosting:
 * - 5-minute in-memory cache (filters don't change often)
 * - Parallel query execution (all filters at once)
 * - Minimal field selection
 * - Efficient distinct queries
 *
 * This provides the available filter options for the audit logs
 * including unique admins, actions, and target types for dropdown filters.
 */
async function getLogFilters(req, res) {
    try {
        // Check cache first
        const now = Date.now();
        if (filterCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
            return res.status(200).json({
                success: true,
                data: filterCache,
                cached: true,
            });
        }

        // PARALLEL EXECUTION - Fetch all filter data at once
        const [uniqueAdmins, uniqueActions, uniqueTargetTypes] = await Promise.all([
            // Get unique admins
            prisma.auditLog.findMany({
                select: {
                    admin: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            surname: true,
                        },
                    },
                },
                distinct: ['adminId'],
                orderBy: { admin: { username: 'asc' } },
            }),

            // Get unique actions
            prisma.auditLog.findMany({
                select: { action: true },
                distinct: ['action'],
                orderBy: { action: 'asc' },
            }),

            // Get unique target types
            prisma.auditLog.findMany({
                select: { targetType: true },
                distinct: ['targetType'],
                where: { targetType: { not: null } },
                orderBy: { targetType: 'asc' },
            }),
        ]);

        // Format the response
        const filters = {
            admins: uniqueAdmins.map((log) => ({
                id: log.admin.id,
                username: log.admin.username,
                fullName: `${log.admin.firstName} ${log.admin.surname}`,
            })),
            actions: uniqueActions.map((log) => log.action),
            targetTypes: uniqueTargetTypes
                .map((log) => log.targetType)
                .filter(Boolean),
        };

        // Update cache
        filterCache = filters;
        cacheTimestamp = now;

        return res.status(200).json({
            success: true,
            data: filters,
            cached: false,
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
