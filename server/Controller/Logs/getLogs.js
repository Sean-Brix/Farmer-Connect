import { PrismaClient } from '../../prisma/generated/client.js';

const prisma = new PrismaClient();

/**
 * Get Audit Logs with Pagination and Filtering
 *
 * This controller handles fetching audit logs with comprehensive filtering,
 * sorting, and pagination capabilities. It supports:
 * - Pagination (25 items per page by default)
 * - Search across multiple fields
 * - Filtering by admin, action, target type, and date range
 * - Sorting by multiple fields
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 25, max: 100)
 * - search: Search term for admin name, action, target name, or details
 * - adminId: Filter by specific admin ID
 * - action: Filter by specific action type
 * - targetType: Filter by target entity type
 * - dateFrom: Filter logs from this date (ISO string)
 * - dateTo: Filter logs until this date (ISO string)
 * - sortBy: Field to sort by (default: createdAt)
 * - sortOrder: Sort direction (asc/desc, default: desc)
 */
async function getLogs(req, res) {
    try {
        // Extract query parameters with defaults
        const {
            page = 1,
            limit = 25,
            search = '',
            adminId = '',
            action = '',
            targetType = '',
            dateFrom = '',
            dateTo = '',
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        // Validate and sanitize inputs
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 25));
        const skip = (pageNum - 1) * limitNum;

        // Build where clause for filtering
        const where = {};
        const searchConditions = [];

        // Search functionality - search across multiple fields
        if (search && search.trim()) {
            const searchTerm = search.trim();
            searchConditions.push(
                {
                    admin: {
                        OR: [
                            {
                                username: {
                                    contains: searchTerm,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                firstName: {
                                    contains: searchTerm,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                lastName: {
                                    contains: searchTerm,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                },
                { action: { contains: searchTerm, mode: 'insensitive' } },
                { targetName: { contains: searchTerm, mode: 'insensitive' } },
                { details: { contains: searchTerm, mode: 'insensitive' } }
            );
        }

        // Apply search conditions
        if (searchConditions.length > 0) {
            where.OR = searchConditions;
        }

        // Filter by specific admin
        if (adminId && adminId.trim()) {
            where.adminId = adminId.trim();
        }

        // Filter by specific action
        if (action && action.trim()) {
            where.action = action.trim();
        }

        // Filter by target type
        if (targetType && targetType.trim()) {
            where.targetType = targetType.trim();
        }

        // Date range filtering
        if (dateFrom || dateTo) {
            where.createdAt = {};

            if (dateFrom) {
                const fromDate = new Date(dateFrom);
                if (!isNaN(fromDate.getTime())) {
                    where.createdAt.gte = fromDate;
                }
            }

            if (dateTo) {
                const toDate = new Date(dateTo);
                if (!isNaN(toDate.getTime())) {
                    // Set to end of day
                    toDate.setHours(23, 59, 59, 999);
                    where.createdAt.lte = toDate;
                }
            }
        }

        // Build orderBy clause
        const validSortFields = [
            'createdAt',
            'action',
            'targetType',
            'targetName',
        ];
        const sortField = validSortFields.includes(sortBy)
            ? sortBy
            : 'createdAt';
        const sortDirection =
            sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

        const orderBy = {};

        // Handle nested sorting for admin fields
        if (sortBy === 'admin' || sortBy === 'adminName') {
            orderBy.admin = { username: sortDirection };
        } else {
            orderBy[sortField] = sortDirection;
        }

        // Execute query with pagination
        const [logs, totalCount] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                include: {
                    admin: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            access: true,
                            picture: true,
                            mimeType: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: limitNum,
            }),
            prisma.auditLog.count({ where }),
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;

        // Format the response data
        const formattedLogs = logs.map((log) => ({
            id: log.id,
            admin: {
                id: log.admin.id,
                username: log.admin.username,
                fullName: `${log.admin.firstName} ${log.admin.lastName}`,
                access: log.admin.access,
                hasPicture: !!(
                    log.admin.picture && log.admin.picture.length > 0
                ), // Boolean flag instead of binary data
                mimeType: log.admin.mimeType,
            },
            action: log.action,
            targetType: log.targetType,
            targetId: log.targetId,
            targetName: log.targetName,
            details: log.details,
            metadata: log.metadata ? JSON.parse(log.metadata) : null,
            ipAddress: log.ipAddress,
            userAgent: log.userAgent,
            createdAt: log.createdAt,
        }));

        // Return paginated response
        return res.status(200).json({
            success: true,
            data: {
                logs: formattedLogs,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalCount,
                    limit: limitNum,
                    hasNextPage,
                    hasPrevPage,
                },
                filters: {
                    search,
                    adminId,
                    action,
                    targetType,
                    dateFrom,
                    dateTo,
                    sortBy: sortField,
                    sortOrder: sortDirection,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching audit logs',
            error: error.message,
        });
    }
}

export default getLogs;
