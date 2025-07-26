import { useQuery, useQueryClient } from '@tanstack/react-query';

// =================================================================
// AUDIT LOGS QUERY
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
        sortOrder = 'desc'
    } = filters;

    return useQuery({
        queryKey: ['auditLogs', { 
            page, 
            limit, 
            search, 
            adminId, 
            action, 
            targetType, 
            dateFrom, 
            dateTo, 
            sortBy, 
            sortOrder 
        }],
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
        staleTime: 30 * 1000, // 30 seconds - audit logs should be relatively fresh
        cacheTime: 5 * 60 * 1000, // 5 minutes
        keepPreviousData: true, // Keep previous data while fetching new page
    });
};

// =================================================================
// AUDIT LOG STATISTICS QUERY
// =================================================================

export const useAuditLogStats = (timeRange = '30d') => {
    return useQuery({
        queryKey: ['auditLogStats', timeRange],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('timeRange', timeRange);

            const response = await fetch(`/api/logs/stats?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch audit log statistics: ${response.status}`
                );
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch audit log statistics');
            }

            return result.data;
        },
        staleTime: 60 * 1000, // 1 minute
        cacheTime: 5 * 60 * 1000, // 5 minutes
    });
};

// =================================================================
// AUDIT LOG FILTERS QUERY
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
                throw new Error(result.message || 'Failed to fetch audit log filters');
            }

            return result.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - filters don't change often
        cacheTime: 15 * 60 * 1000, // 15 minutes
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
        }
    };
};
