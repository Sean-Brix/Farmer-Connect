import { useQuery, useQueryClient } from '@tanstack/react-query';

// =================================================================
// AUDIT LOGS QUERY (OPTIMIZED)
// =================================================================

export const useAuditLogs = (filters = {}) => {
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
    } = filters;

    return useQuery({
        queryKey: [
            'auditLogs',
            {
                page,
                limit,
                search,
                adminId,
                action,
                targetType,
                dateFrom,
                dateTo,
                sortBy,
                sortOrder,
            },
        ],
        queryFn: async () => {
            const params = new URLSearchParams();

            if (page) params.append('page', page.toString());
            if (limit) params.append('limit', limit.toString());
            if (search) params.append('search', search);
            if (adminId) params.append('adminId', adminId);
            if (action) params.append('action', action);
            if (targetType) params.append('targetType', targetType);
            if (dateFrom) params.append('dateFrom', dateFrom);
            if (dateTo) params.append('dateTo', dateTo);
            if (sortBy) params.append('sortBy', sortBy);
            if (sortOrder) params.append('sortOrder', sortOrder);

            const response = await fetch(`/api/logs/all?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch audit logs: ${response.status}`
                );
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch audit logs');
            }

            return result.data;
        },
        staleTime: 2 * 60 * 1000, // 2 minutes - optimized for batched writes
        gcTime: 10 * 60 * 1000, // 10 minutes cache
        placeholderData: (previousData) => previousData, // Keep previous data while loading
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnMount: false, // Don't refetch if data is fresh
        retry: 1, // Reduce retry attempts
    });
};

// =================================================================
// AUDIT LOG STATISTICS QUERY (OPTIMIZED)
// =================================================================

export const useAuditLogStats = (timeRange = '30d') => {
    return useQuery({
        queryKey: ['auditLogStats', timeRange],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('timeRange', timeRange);

            const response = await fetch(
                `/api/logs/stats?${params.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch audit log statistics: ${response.status}`
                );
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.message || 'Failed to fetch audit log statistics'
                );
            }

            return result.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - stats don't change often
        gcTime: 15 * 60 * 1000, // 15 minutes cache
        refetchOnWindowFocus: false, // Reduce unnecessary refetches
    });
};

// =================================================================
// AUDIT LOG FILTERS QUERY (OPTIMIZED WITH CACHE HINT)
// =================================================================

export const useAuditLogFilters = () => {
    return useQuery({
        queryKey: ['auditLogFilters'],
        queryFn: async () => {
            const response = await fetch('/api/logs/filters', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch audit log filters: ${response.status}`
                );
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.message || 'Failed to fetch audit log filters'
                );
            }

            return result.data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes - filters cached server-side
        gcTime: 30 * 60 * 1000, // 30 minutes cache
        refetchOnWindowFocus: false, // Filters rarely change
        refetchOnMount: false, // Use cached data if available
    });
};

// =================================================================
// REFRESH UTILITY
// =================================================================

export const useRefreshAuditLogs = () => {
    const queryClient = useQueryClient();

    return {
        refreshLogs: () => {
            queryClient.invalidateQueries(['auditLogs']);
        },
        refreshStats: () => {
            queryClient.invalidateQueries(['auditLogStats']);
        },
        refreshFilters: () => {
            queryClient.invalidateQueries(['auditLogFilters']);
        },
        refreshAll: () => {
            queryClient.invalidateQueries(['auditLogs']);
            queryClient.invalidateQueries(['auditLogStats']);
            queryClient.invalidateQueries(['auditLogFilters']);
        },
    };
};
