import { PrismaClient } from '../../prisma/generated/client.js';

const prisma = new PrismaClient();

/**
 * Get Audit Log Statistics
 *
 * This controller provides statistical information about audit logs
 * including action counts, admin activity, and timeline data.
 * This is useful for analytics and dashboard summaries.
 */
async function getLogStats(req, res) {
    try {
        const {
            dateFrom = '',
            dateTo = '',
            timeRange = '30d', // 7d, 30d, 90d, 1y
        } = req.query;

        // Calculate date range
        let startDate = new Date();
        let endDate = new Date();

        if (dateFrom && dateTo) {
            startDate = new Date(dateFrom);
            endDate = new Date(dateTo);
            endDate.setHours(23, 59, 59, 999);
        } else {
            // Use timeRange parameter
            switch (timeRange) {
                case '7d':
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case '90d':
                    startDate.setDate(startDate.getDate() - 90);
                    break;
                case '1y':
                    startDate.setFullYear(startDate.getFullYear() - 1);
                    break;
                case '30d':
                default:
                    startDate.setDate(startDate.getDate() - 30);
                    break;
            }
        }

        const where = {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };

        // Get total log count
        const totalLogs = await prisma.auditLog.count({ where });

        // Get action distribution
        const actionStats = await prisma.auditLog.groupBy({
            by: ['action'],
            where,
            _count: {
                action: true,
            },
            orderBy: {
                _count: {
                    action: 'desc',
                },
            },
        });

        // Get most active admins
        const adminStats = await prisma.auditLog.groupBy({
            by: ['adminId'],
            where,
            _count: {
                adminId: true,
            },
            orderBy: {
                _count: {
                    adminId: 'desc',
                },
            },
            take: 10,
        });

        // Get admin details for the stats
        const adminIds = adminStats.map((stat) => stat.adminId);
        const admins = await prisma.account.findMany({
            where: {
                id: { in: adminIds },
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                access: true,
            },
        });

        // Combine admin stats with admin details
        const adminActivity = adminStats.map((stat) => {
            const admin = admins.find((a) => a.id === stat.adminId);
            return {
                admin: {
                    id: admin.id,
                    username: admin.username,
                    fullName: `${admin.firstName} ${admin.lastName}`,
                    access: admin.access,
                },
                count: stat._count.adminId,
            };
        });

        // Get target type distribution
        const targetTypeStats = await prisma.auditLog.groupBy({
            by: ['targetType'],
            where: {
                ...where,
                targetType: { not: null },
            },
            _count: {
                targetType: true,
            },
            orderBy: {
                _count: {
                    targetType: 'desc',
                },
            },
        });

        // Get daily activity (last 30 days)
        const dailyActivity = [];
        const dailyStart = new Date();
        dailyStart.setDate(dailyStart.getDate() - 29);

        for (let i = 0; i < 30; i++) {
            const dayStart = new Date(dailyStart);
            dayStart.setDate(dailyStart.getDate() + i);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            const count = await prisma.auditLog.count({
                where: {
                    createdAt: {
                        gte: dayStart,
                        lte: dayEnd,
                    },
                },
            });

            dailyActivity.push({
                date: dayStart.toISOString().split('T')[0],
                count,
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                totalLogs,
                timeRange: {
                    from: startDate,
                    to: endDate,
                    preset: timeRange,
                },
                actionDistribution: actionStats.map((stat) => ({
                    action: stat.action,
                    count: stat._count.action,
                })),
                adminActivity,
                targetTypeDistribution: targetTypeStats.map((stat) => ({
                    targetType: stat.targetType,
                    count: stat._count.targetType,
                })),
                dailyActivity,
            },
        });
    } catch (error) {
        console.error('Error fetching audit log statistics:', error);
        return res.status(500).json({
            success: false,
            message:
                'Internal server error while fetching audit log statistics',
            error: error.message,
        });
    }
}

export default getLogStats;
