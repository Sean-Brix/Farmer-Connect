import { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import {
    useAuditLogs,
    useAuditLogStats,
    useAuditLogFilters,
    useRefreshAuditLogs,
} from './hooks/useAuditQueries.js';

export default function Audit({ admin_navigate }) {
    const { theme, isDark } = useTheme();
    const [activeView, setActiveView] = useState('logs');
    const [timeRange, setTimeRange] = useState('30d');

    // Modern soft neutral background
    return (
    <div className={`min-h-screen py-4 sm:py-6 px-2 md:px-6 mt-8 sm:mt-16 ${
        isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
            {/* View Toggle */}
            <div className="flex items-center justify-center mb-10">
                <div className={`flex items-center rounded-lg p-1 ${
                    isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                    <button
                        onClick={() => setActiveView('logs')}
                        className={`px-4 sm:px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                            activeView === 'logs'
                                ? isDark
                                    ? 'bg-gray-700 text-white shadow-sm'
                                    : 'bg-white text-gray-900 shadow-sm'
                                : isDark
                                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        Activity Logs
                    </button>
                    <button
                        onClick={() => setActiveView('analytics')}
                        className={`px-4 sm:px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                            activeView === 'analytics'
                                ? isDark
                                    ? 'bg-gray-700 text-white shadow-sm'
                                    : 'bg-white text-gray-900 shadow-sm'
                                : isDark
                                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        Analytics
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto">
                {activeView === 'logs' ? (
                    <AuditLogsTable admin_navigate={admin_navigate} />
                ) : (
                    <AuditAnalytics
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                        admin_navigate={admin_navigate}
                    />
                )}
            </div>
        </div>
    );
}

/* ================================================================================== */
/* AUDIT LOGS TABLE COMPONENT */
/* ================================================================================== */

function AuditLogsTable({ admin_navigate }) {
    const { theme, isDark } = useTheme();
    // Filter and pagination states
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    // Advanced filter states
    const [adminId, setAdminId] = useState('');
    const [action, setAction] = useState('');
    const [targetType, setTargetType] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // State for expandable details
    const [expandedDetails, setExpandedDetails] = useState(new Set());

    // Toggle expanded details for a specific log
    const toggleDetails = (logId) => {
        const newExpanded = new Set(expandedDetails);
        if (newExpanded.has(logId)) {
            newExpanded.delete(logId);
        } else {
            newExpanded.add(logId);
        }
        setExpandedDetails(newExpanded);
    };

    // Prepare filters object
    const filters = {
        page,
        limit: itemsPerPage,
        search,
        adminId,
        action,
        targetType,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder,
    };

    // Hooks
    const {
        data: auditData,
        isLoading,
        error,
        isFetching,
    } = useAuditLogs(filters);

    const { data: filterData, isLoading: isLoadingFilters } =
        useAuditLogFilters();

    const { refreshLogs } = useRefreshAuditLogs();

    // Handle sort change
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
        setPage(1); // Reset to first page when sorting changes
    };

    // Handle search change
    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1); // Reset to first page when search changes
    };

    // Handle filter changes
    const handleFilterChange = (filterType, value) => {
        switch (filterType) {
            case 'adminId':
                setAdminId(value);
                break;
            case 'action':
                setAction(value);
                break;
            case 'targetType':
                setTargetType(value);
                break;
            case 'dateFrom':
                setDateFrom(value);
                break;
            case 'dateTo':
                setDateTo(value);
                break;
        }
        setPage(1); // Reset to first page when filters change
    };

    // Clear all filters
    const clearFilters = () => {
        setSearch('');
        setAdminId('');
        setAction('');
        setTargetType('');
        setDateFrom('');
        setDateTo('');
        setPage(1);
    };

    // Get action display name
    const getActionDisplayName = (actionCode) => {
        return actionCode
            .split('_')
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ');
    };

    // Get action badge color
    const getActionBadgeColor = (actionCode) => {
        if (actionCode.includes('CREATE'))
            return isDark ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-green-100 text-green-800 border-green-200';
        if (actionCode.includes('UPDATE'))
            return isDark ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-green-100 text-green-800 border-green-200';
        if (actionCode.includes('DELETE'))
            return isDark ? 'bg-red-900/50 text-red-300 border-red-700' : 'bg-red-100 text-red-800 border-red-200';
        if (actionCode.includes('LOGIN') || actionCode.includes('LOGOUT'))
            return isDark ? 'bg-purple-900/50 text-purple-300 border-purple-700' : 'bg-purple-100 text-purple-800 border-purple-200';
        if (actionCode.includes('APPROVE'))
            return isDark ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700' : 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (actionCode.includes('REJECT'))
            return isDark ? 'bg-orange-900/50 text-orange-300 border-orange-700' : 'bg-orange-100 text-orange-800 border-orange-200';
        return isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    };

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800)
            return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year:
                date.getFullYear() !== now.getFullYear()
                    ? 'numeric'
                    : undefined,
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <div className={`text-lg ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Loading audit logs...
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="text-lg text-red-600 mb-4">
                        Error loading audit logs
                    </div>
                    <div className={`mb-4 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>{error.message}</div>
                    <button
                        onClick={refreshLogs}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { logs = [], pagination = {} } = auditData || {};

    return (
        <div className="max-w-6xl mx-auto">
            {/* Filters Section - Minimal Layout */}
            <div className="mb-8">
                {/* Search Input with all controls - responsive layout */}
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="relative flex-1 max-w-lg">
                        <input
                            type="search"
                            placeholder="Search admins, actions, targets, or details..."
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className={`appearance-none border rounded-lg pl-10 pr-10 py-2 sm:py-2.5 shadow-md focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-200 hover:border-green-400 outline-none cursor-pointer text-sm sm:text-base font-medium w-full ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-700 placeholder-gray-500'
                            }`}
                            style={{ minWidth: '0' }}
                        />
                        <span className={`pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 ${
                            isDark ? 'text-gray-400' : 'text-gray-400'
                        }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        </span>
                    </div>
                    
                    {/* Filter and Clear and Refresh buttons */}
                    <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3 flex-shrink-0">
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all duration-200 transform hover:scale-105 ${
                                showAdvancedFilters || adminId || action || targetType || dateFrom || dateTo
                                    ? 'bg-green-50 text-green-700 border-green-300 shadow-md'
                                    : isDark
                                    ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a2 2 0 0 1-.553 1.382l-5.894 6.183A2 2 0 0 0 14 15.118V19a1 1 0 0 1-1.447.894l-2-1A1 1 0 0 1 10 18v-2.882a2 2 0 0 0-.553-1.382L3.553 7.382A2 2 0 0 1 3 6V4Z" />
                            </svg>
                            Filters
                        </button>

                        <button
                            onClick={clearFilters}
                            className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all duration-200 transform hover:scale-105 ${
                                isDark
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600 hover:border-gray-500'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M6 18L18 6M6 6l12 12"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Clear
                        </button>

                        <button
                            onClick={refreshLogs}
                            disabled={isFetching}
                            className="flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-md border border-green-600"
                        >
                            <svg
                                className={`w-4 h-4 mr-2 ${
                                    isFetching ? 'animate-spin' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Advanced Filters - Enhanced Design */}
                {showAdvancedFilters && (
                    <div className={`rounded-xl border-2 p-4 sm:p-6 mt-4 shadow-inner ${
                        isDark
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-gradient-to-br from-gray-50 to-green-50 border-green-100'
                    }`}>
                        <h3 className={`text-base sm:text-lg font-semibold mb-4 flex items-center ${
                            isDark ? 'text-white' : 'text-gray-800'
                        }`}>
                            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                            Advanced Filters
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                            {/* Admin Filter */}
                            <div className="flex flex-col">
                                <label className={`text-xs sm:text-sm font-medium mb-2 sm:mb-3 order-1 ${
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Admin
                                </label>
                                <select
                                    value={adminId}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'adminId',
                                            e.target.value
                                        )
                                    }
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-2 rounded-xl focus:ring-3 focus:ring-green-100 focus:border-green-400 transition-all duration-200 hover:border-green-300 order-2 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-green-200'
                                    }`}
                                    disabled={isLoadingFilters}
                                >
                                    <option value="">All Admins</option>
                                    {filterData?.admins?.map((admin) => (
                                        <option key={admin.id} value={admin.id}>
                                            {admin.fullName} (@{admin.username})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Action Filter */}
                            <div className="flex flex-col">
                                <label className={`text-xs sm:text-sm font-medium mb-2 sm:mb-3 order-1 ${
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Action
                                </label>
                                <select
                                    value={action}
                                    onChange={(e) =>
                                        handleFilterChange('action', e.target.value)
                                    }
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-2 rounded-xl focus:ring-3 focus:ring-green-100 focus:border-green-400 transition-all duration-200 hover:border-green-300 order-2 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-green-200'
                                    }`}
                                    disabled={isLoadingFilters}
                                >
                                    <option value="">All Actions</option>
                                    {filterData?.actions?.map((actionOption) => (
                                        <option
                                            key={actionOption}
                                            value={actionOption}
                                        >
                                            {getActionDisplayName(actionOption)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Target Type Filter */}
                            <div className="flex flex-col">
                                <label className={`text-xs sm:text-sm font-medium mb-2 sm:mb-3 order-1 ${
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Target Type
                                </label>
                                <select
                                    value={targetType}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'targetType',
                                            e.target.value
                                        )
                                    }
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-2 rounded-xl focus:ring-3 focus:ring-green-100 focus:border-green-400 transition-all duration-200 hover:border-green-300 order-2 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-green-200'
                                    }`}
                                    disabled={isLoadingFilters}
                                >
                                    <option value="">All Types</option>
                                    {filterData?.targetTypes?.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date From */}
                            <div className="flex flex-col">
                                <label className={`text-xs sm:text-sm font-medium mb-2 sm:mb-3 order-1 ${
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'dateFrom',
                                            e.target.value
                                        )
                                    }
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-2 rounded-xl focus:ring-3 focus:ring-green-100 focus:border-green-400 transition-all duration-200 hover:border-green-300 order-2 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-green-200'
                                    }`}
                                />
                            </div>

                            {/* Date To */}
                            <div className="flex flex-col">
                                <label className={`text-xs sm:text-sm font-medium mb-2 sm:mb-3 order-1 ${
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) =>
                                        handleFilterChange('dateTo', e.target.value)
                                    }
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-2 rounded-xl focus:ring-3 focus:ring-green-100 focus:border-green-400 transition-all duration-200 hover:border-green-300 order-2 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-green-200'
                                    }`}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Summary - Enhanced */}
                <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-4 border-t gap-3 ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    <div className={`flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm gap-2 sm:gap-0 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        {isFetching && (
                            <div className="text-green-600 flex items-center sm:mr-6">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                                Updating...
                            </div>
                        )}
                        <div className="flex items-center">
                            <svg className={`w-4 h-4 mr-2 ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            }`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-medium">Showing {logs.length} of {pagination.totalCount || 0} entries</span>
                            {(search ||
                                adminId ||
                                action ||
                                targetType ||
                                dateFrom ||
                                dateTo) && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    Filtered
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className={`flex items-center text-xs sm:text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        <span className="mr-4">Page {pagination.currentPage || 1} of {pagination.totalPages || 1}</span>
                    </div>
                </div>
            </div>

            {/* Table */}
        <div className={`overflow-x-auto rounded-lg border shadow-sm mt-6 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
            <table className="w-full">
                <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                        <tr>
                            <th
                                className={`py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
                                    isDark
                                        ? 'text-gray-200 hover:bg-gray-700'
                                        : 'text-gray-900 hover:bg-gray-100'
                                }`}
                                onClick={() => handleSort('createdAt')}
                            >
                                <div className="flex items-center gap-2">
                                    Time
                                    {sortBy === 'createdAt' && (
                                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                                            {sortOrder === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th className={`py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-900'
                            }`}>Admin</th>
                            <th className={`py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-900'
                            }`}>Action</th>
                            <th className={`py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-900'
                            }`}>Target</th>
                            <th className={`py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-900'
                            }`}>
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${
                        isDark ? 'divide-gray-700' : 'divide-gray-100'
                    }`}>
                        {logs.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className={`text-center py-12 sm:py-16 text-base font-medium ${
                                        isDark ? 'text-gray-400' : 'text-gray-400'
                                    }`}
                                >
                                    {search ||
                                    adminId ||
                                    action ||
                                    targetType ||
                                    dateFrom ||
                                    dateTo
                                        ? 'No logs found matching your filters.'
                                        : 'No audit logs available.'}
                                </td>
                            </tr>
                        ) : (
                            logs.map((log, index) => (
                                <tr
                                    key={log.id}
                                    className={`${
                                        index % 2 === 0
                                            ? isDark ? 'bg-gray-800' : 'bg-white'
                                            : isDark ? 'bg-gray-750' : 'bg-neutral-50'
                                    } transition-colors group ${
                                        isDark ? 'hover:bg-gray-700' : 'hover:bg-green-50'
                                    }`}
                                >
                                    {/* Timestamp */}
                                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                                        <div className={`text-xs sm:text-sm font-medium ${
                                            isDark ? 'text-gray-200' : 'text-gray-900'
                                        }`}>
                                            {formatTimestamp(log.createdAt)}
                                        </div>
                                        <div className={`text-xs mt-1 ${
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            {new Date(
                                                log.createdAt
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </td>

                                    {/* Admin */}
                                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                                        <div className="flex items-center gap-3">
                                            {log.admin.hasPicture && (
                                                <img
                                                    src={`/api/account/picture/${log.admin.id}`}
                                                    alt={log.admin.fullName}
                                                    className={`w-8 h-8 rounded-full object-cover border ${
                                                        isDark ? 'border-gray-600' : 'border-gray-200'
                                                    }`}
                                                    style={{ minWidth: '2rem' }}
                                                />
                                            )}
                                            <div>
                                                <div className={`text-xs sm:text-sm font-medium ${
                                                    isDark ? 'text-gray-200' : 'text-gray-900'
                                                }`}>
                                                    {log.admin.fullName}
                                                </div>
                                                <div className={`text-xs ${
                                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    @{log.admin.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Action */}
                                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getActionBadgeColor(
                                                log.action
                                            )}`}
                                        >
                                            {getActionDisplayName(log.action)}
                                        </span>
                                    </td>

                                    {/* Target */}
                                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                                        <div className={`text-xs sm:text-sm font-medium ${
                                            isDark ? 'text-gray-200' : 'text-gray-900'
                                        }`}>
                                            {log.targetName || 'N/A'}
                                        </div>
                                        {log.targetType && (
                                            <div className={`text-xs mt-1 ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                {log.targetType}
                                            </div>
                                        )}
                                    </td>

                                    {/* Details */}
                                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                                        <div className={`text-xs sm:text-sm ${
                                            isDark ? 'text-gray-300' : 'text-neutral-700'
                                        }`}>
                                            {(() => {
                                                const details =
                                                    log.details ||
                                                    'No additional details';
                                                const isLong =
                                                    details.length > 100;
                                                const isExpanded =
                                                    expandedDetails.has(log.id);

                                                if (!isLong) {
                                                    return (
                                                        <span>{details}</span>
                                                    );
                                                }

                                                return (
                                                    <div className="max-w-xs">
                                                        <div
                                                            className={
                                                                isExpanded
                                                                    ? ''
                                                                    : 'truncate'
                                                            }
                                                        >
                                                            {isExpanded
                                                                ? details
                                                                : `${details.substring(
                                                                      0,
                                                                      100
                                                                  )}...`}
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                toggleDetails(
                                                                    log.id
                                                                )
                                                            }
                                                            className="text-green-600 hover:text-green-800 text-xs mt-1 font-medium focus:outline-none underline"
                                                        >
                                                            {isExpanded
                                                                ? 'Show Less'
                                                                : 'Show More'}
                                                        </button>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        {log.ipAddress && (
                                            <div className={`text-xs mt-1 ${
                                                isDark ? 'text-gray-500' : 'text-neutral-400'
                                            }`}>
                                                IP: {log.ipAddress}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination - Seminar style */}
            {pagination.totalPages > 1 && (
                <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 md:px-8 mt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                        <span className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            Showing {logs.length} of {pagination.totalCount || 0} entries
                        </span>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>Rows per page:</span>
                            <div className="relative">
                                <select
                                    className={`appearance-none border text-xs sm:text-sm rounded-lg focus:ring-1 focus:ring-green-600 focus:border-green-600 block py-2 pl-3 pr-10 min-w-[70px] transition ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                                    value={itemsPerPage}
                                    onChange={e => {
                                        setItemsPerPage(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    aria-label="Rows per page"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                    <option value={25}>25</option>
                                </select>
                                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#059669' }}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-2 sm:gap-4 py-6 sm:py-8 flex-wrap">
                        <button
                            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border font-medium shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm ${
                                isDark
                                    ? 'border-green-700 bg-gray-700 text-green-400 hover:bg-gray-600 hover:border-green-600'
                                    : 'border-green-300 bg-white text-green-700 hover:bg-green-50 hover:border-green-400'
                            }`}
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1 || isFetching}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </button>
                        <div className={`px-3 sm:px-4 py-2 font-semibold rounded-lg border text-xs sm:text-sm ${
                            isDark
                                ? 'bg-green-900/50 text-green-300 border-green-700'
                                : 'bg-green-100 text-green-800 border-green-200'
                        }`}>
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </div>
                        <button
                            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border font-medium shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm ${
                                isDark
                                    ? 'border-green-700 bg-gray-700 text-green-400 hover:bg-gray-600 hover:border-green-600'
                                    : 'border-green-300 bg-white text-green-700 hover:bg-green-50 hover:border-green-400'
                            }`}
                            onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                            disabled={page === pagination.totalPages || isFetching}
                        >
                            Next
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ================================================================================== */
/* AUDIT ANALYTICS COMPONENT */
/* ================================================================================== */

function AuditAnalytics({ timeRange, setTimeRange, admin_navigate }) {
    const { theme, isDark } = useTheme();
    const { data: statsData, isLoading, error } = useAuditLogStats(timeRange);

    const { refreshStats } = useRefreshAuditLogs();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <div className={`text-lg ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Loading analytics...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="text-lg text-red-600 mb-4">
                        Error loading analytics
                    </div>
                    <div className={`mb-4 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>{error.message}</div>
                    <button
                        onClick={refreshStats}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const {
        totalLogs = 0,
        actionDistribution = [],
        adminActivity = [],
        targetTypeDistribution = [],
        dailyActivity = [],
    } = statsData || {};

    return (
        <div className="space-y-8">
            {/* Time Range Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className={`text-lg sm:text-xl font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                }`}>
                    Analytics Overview
                </h3>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm font-medium ${
                        isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className={`rounded-lg p-4 sm:p-6 border ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <div className="flex items-center">
                        <div className={`p-2 rounded-md mr-3 sm:mr-4 ${
                            isDark ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                            <svg
                                className={`w-5 h-5 ${
                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className={`text-xl sm:text-2xl font-bold ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                                {totalLogs.toLocaleString()}
                            </div>
                            <div className={`text-xs sm:text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                Total Activities
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`rounded-lg p-4 sm:p-6 shadow-sm ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center">
                        <div className={`p-3 rounded-lg mr-3 sm:mr-4 ${
                            isDark ? 'bg-green-900/50' : 'bg-green-100'
                        }`}>
                            <svg
                                className={`w-6 h-6 ${
                                    isDark ? 'text-green-400' : 'text-green-600'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className={`text-xl sm:text-2xl font-bold ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                                {adminActivity.length}
                            </div>
                            <div className={`text-xs sm:text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                Active Admins
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`rounded-lg p-4 sm:p-6 shadow-sm ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center">
                        <div className={`p-3 rounded-lg mr-3 sm:mr-4 ${
                            isDark ? 'bg-purple-900/50' : 'bg-purple-100'
                        }`}>
                            <svg
                                className={`w-6 h-6 ${
                                    isDark ? 'text-purple-400' : 'text-purple-600'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className={`text-xl sm:text-2xl font-bold ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                                {actionDistribution.length}
                            </div>
                            <div className={`text-xs sm:text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                Action Types
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`rounded-lg p-4 sm:p-6 shadow-sm ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center">
                        <div className={`p-3 rounded-lg mr-3 sm:mr-4 ${
                            isDark ? 'bg-orange-900/50' : 'bg-orange-100'
                        }`}>
                            <svg
                                className={`w-6 h-6 ${
                                    isDark ? 'text-orange-400' : 'text-orange-600'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className={`text-xl sm:text-2xl font-bold ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                                {targetTypeDistribution.length}
                            </div>
                            <div className={`text-xs sm:text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                Target Types
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Top Actions */}
                <div className={`rounded-lg p-4 sm:p-6 shadow-sm ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <h4 className={`text-base sm:text-lg font-semibold mb-4 ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                        Top Actions
                    </h4>
                    <div className="space-y-3">
                        {actionDistribution.slice(0, 8).map((item, index) => (
                            <div
                                key={item.action}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                        isDark ? 'bg-green-900/50' : 'bg-green-100'
                                    }`}>
                                        <span className={`text-xs font-semibold ${
                                            isDark ? 'text-green-400' : 'text-green-600'
                                        }`}>
                                            {index + 1}
                                        </span>
                                    </div>
                                    <span className={`text-xs sm:text-sm font-medium ${
                                        isDark ? 'text-gray-200' : 'text-gray-900'
                                    }`}>
                                        {item.action
                                            .split('_')
                                            .map(
                                                (word) =>
                                                    word
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    word.slice(1).toLowerCase()
                                            )
                                            .join(' ')}
                                    </span>
                                </div>
                                <span className={`text-xs sm:text-sm ${
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Most Active Admins */}
                <div className={`rounded-lg p-4 sm:p-6 shadow-sm ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <h4 className={`text-base sm:text-lg font-semibold mb-4 ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                        Most Active Admins
                    </h4>
                    <div className="space-y-3">
                        {adminActivity.slice(0, 8).map((item, index) => (
                            <div
                                key={item.admin.id}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mr-3">
                                        <span className="text-xs font-semibold text-white">
                                            {item.admin.fullName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <div className={`text-xs sm:text-sm font-medium ${
                                            isDark ? 'text-gray-200' : 'text-gray-900'
                                        }`}>
                                            {item.admin.fullName}
                                        </div>
                                        <div className={`text-xs ${
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            @{item.admin.username}
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-xs sm:text-sm ${
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Daily Activity Chart */}
            <div className={`rounded-lg p-4 sm:p-6 shadow-sm ${
                isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
                <h4 className={`text-base sm:text-lg font-semibold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                }`}>
                    Daily Activity (Last 30 Days)
                </h4>
                <div className="h-64 flex items-end space-x-1">
                    {dailyActivity.map((day, index) => {
                        const maxCount = Math.max(
                            ...dailyActivity.map((d) => d.count)
                        );
                        const height =
                            maxCount > 0 ? (day.count / maxCount) * 100 : 0;

                        return (
                            <div
                                key={day.date}
                                className="flex-1 flex flex-col items-center"
                            >
                                <div
                                    className="w-full bg-green-500 rounded-t min-h-[4px] transition-all hover:bg-green-600"
                                    style={{
                                        height: `${Math.max(4, height)}%`,
                                    }}
                                    title={`${day.date}: ${day.count} activities`}
                                ></div>
                                {index % 5 === 0 && (
                                    <div className={`text-xs mt-1 transform -rotate-45 origin-top-left ${
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        {new Date(day.date).toLocaleDateString(
                                            'en-US',
                                            { month: 'short', day: 'numeric' }
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
