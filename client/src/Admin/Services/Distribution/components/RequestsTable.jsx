import React from 'react';

export default function RequestsTable({
    requests,
    search,
    statusFilter,
    sortBy,
    onStatusChange,
    isDark,
}) {
    const [expandedNotes, setExpandedNotes] = React.useState(new Set());
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);
    const [activeTab, setActiveTab] = React.useState('pending');
    const isSeedingComplete = React.useCallback((req) => {
        const r = req.plantingReport;
        if (!r) return false;
        const required = [
            r.dateOfPlanting,
            r.areaPlanted,
            r.seedClassification,
            r.typeOfCrop,
            r.plantingMethod,
            r.varietyId,
        ];
        return required.every(Boolean);
    }, []);

    const statusOrder = {
        Pending: 1,
        Approved: 2,
        Picked_Up: 3,
        late_pickup: 4,
        Planted: 5,
        Rejected: 6,
        No_Pickup: 7,
        Cancelled: 8,
        Archived: 9,
    };

    // Categorize requests by tab
    const categorizedRequests = React.useMemo(() => {
        const plantingInProgress = requests.filter(req => ['Picked_Up', 'late_pickup'].includes(req.status) && !isSeedingComplete(req));
        const planted = requests.filter(req => req.status === 'Planted' || (['Picked_Up', 'late_pickup'].includes(req.status) && isSeedingComplete(req)));
        return {
            pending: requests.filter(req => req.status === 'Pending'),
            approved: requests.filter(req => req.status === 'Approved'),
            pickedUp: plantingInProgress,
            planted,
            archive: requests.filter(req => ['Rejected', 'No_Pickup', 'Cancelled', 'Archived'].includes(req.status))
        };
    }, [requests, isSeedingComplete]);

    // Get current tab's requests
    const tabRequests = categorizedRequests[activeTab] || [];

    // Filter and sort requests
    const filteredRequests = tabRequests
        .filter((request) => {
            const searchLower = search.toLowerCase();
            const itemName = request.itemName || request.item?.name || '';
            const requestorName = request.requestorName || `${request.user?.firstName || ''} ${request.user?.surname || ''}`.trim() || '';
            const matchesSearch =
                itemName.toLowerCase().includes(searchLower) ||
                requestorName.toLowerCase().includes(searchLower) ||
                request.requestNote?.toLowerCase().includes(searchLower) ||
                request.requestorEmail?.toLowerCase().includes(searchLower);

            return matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'status':
                    const statusA = statusOrder[a.status] || 999;
                    const statusB = statusOrder[b.status] || 999;
                    if (statusA !== statusB) return statusA - statusB;
                    return new Date(b.createdAt) - new Date(a.createdAt);

                case 'date':
                    return new Date(b.createdAt) - new Date(a.createdAt);

                case 'item':
                    const itemA = a.itemName || a.item?.name || '';
                    const itemB = b.itemName || b.item?.name || '';
                    return itemA.localeCompare(itemB);

                case 'client':
                    const requestorA = a.requestorName || `${a.user?.firstName || ''} ${a.user?.surname || ''}`.trim() || '';
                    const requestorB = b.requestorName || `${b.user?.firstName || ''} ${b.user?.surname || ''}`.trim() || '';
                    return requestorA.localeCompare(requestorB);

                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

    // Pagination calculations
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter, sortBy]);

    // Close expanded notes when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.note-tooltip-container')) {
                setExpandedNotes(new Set());
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleNoteExpansion = (requestId) => {
        setExpandedNotes(prev => {
            const newSet = new Set();
            if (!prev.has(requestId)) {
                newSet.add(requestId);
            }
            return newSet;
        });
    };

    const renderNote = (request) => {
        if (!request.requestNote) return null;
        
        const isExpanded = expandedNotes.has(request.id);
        const isLong = request.requestNote.length > 50;
        
        return (
            <div className={`text-xs rounded px-2 py-1 max-w-xs relative note-tooltip-container ${
                isDark 
                    ? 'text-gray-400 bg-gray-700' 
                    : 'text-gray-500 bg-gray-50'
            }`}>
                <div className={isExpanded ? '' : 'truncate'}>
                    {isLong && !isExpanded ? request.requestNote.substring(0, 50) + '...' : request.requestNote}
                </div>
                {isLong && (
                    <div className="relative inline-block">
                        <button
                            onClick={() => toggleNoteExpansion(request.id)}
                            className={`font-medium mt-1 text-xs underline ${
                                isDark 
                                    ? 'text-green-400 hover:text-green-300' 
                                    : 'text-green-600 hover:text-green-800'
                            }`}
                        >
                            {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                        
                        {/* Tooltip popup for full note */}
                        {isExpanded && (
                            <div className="absolute z-50 bottom-full left-0 mb-2 w-80 max-w-sm">
                                <div className={`text-xs rounded-lg px-4 py-3 shadow-2xl border backdrop-blur-sm ${
                                    isDark 
                                        ? 'bg-gray-900 text-white border-gray-700' 
                                        : 'bg-white text-gray-900 border-gray-300'
                                }`}>
                                    {/* Arrow pointing down */}
                                    <div className={`absolute top-full left-4 w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent border-t-[6px] ${
                                        isDark ? 'border-t-gray-900' : 'border-t-white'
                                    }`}></div>
                                    
                                    {/* Header */}
                                    <div className={`flex items-center gap-2 pb-2 mb-2 border-b ${
                                        isDark ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span className={`font-semibold ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>Request Note</span>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className={`leading-relaxed max-h-32 overflow-y-auto ${
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {request.requestNote}
                                    </div>
                                    
                                    {/* Footer */}
                                    <div className={`mt-2 pt-2 text-right border-t ${
                                        isDark ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                        <span className={`text-xs ${
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`}>Click "Show less" to close</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const getStatusBadge = (status) => {
        const statusStyles = isDark ? {
            Pending: 'bg-yellow-900 text-yellow-200 border-yellow-700',
            Approved: 'bg-green-900 text-green-200 border-green-700',
            Picked_Up: 'bg-blue-900 text-blue-200 border-blue-700',
            late_pickup: 'bg-orange-900 text-orange-200 border-orange-700',
            Planted: 'bg-emerald-900 text-emerald-200 border-emerald-700',
            Rejected: 'bg-red-900 text-red-200 border-red-700',
            No_Pickup: 'bg-indigo-900 text-indigo-200 border-indigo-700',
            Cancelled: 'bg-gray-700 text-gray-300 border-gray-600',
            Archived: 'bg-slate-700 text-slate-300 border-slate-600',
        } : {
            Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Approved: 'bg-green-100 text-green-800 border-green-200',
            Picked_Up: 'bg-blue-100 text-blue-800 border-blue-200',
            late_pickup: 'bg-orange-100 text-orange-800 border-orange-200',
            Planted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            Rejected: 'bg-red-100 text-red-800 border-red-200',
            No_Pickup: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            Cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
            Archived: 'bg-slate-100 text-slate-600 border-slate-200',
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    statusStyles[status] ||
                    (isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200')
                }`}
            >
                {status === 'Picked_Up' ? 'Picked Up' : 
                 status === 'late_pickup' ? 'Late Pickup' :
                 status.replace('_', ' ')}
            </span>
        );
    };

    const getStatusOptions = (currentStatus) => {
        switch (currentStatus) {
            case 'Pending':
                return ['Approved', 'Rejected'];
            case 'Approved':
                return ['Picked_Up', 'No_Pickup'];
            case 'Picked_Up':
            case 'late_pickup':
                return []; // Auto-transitions to Planted when report submitted
            case 'Planted':
                return []; // Auto-transitions to Archived when report archived
            case 'Rejected':
                return ['Approved', 'Rejected'];
            case 'Cancelled':
            case 'Archived':
                return []; // Terminal states
            default:
                return [];
        }
    };

    const tabs = [
        { id: 'pending', label: 'Pending', count: categorizedRequests.pending.length },
        { id: 'approved', label: 'Approved', count: categorizedRequests.approved.length },
        { id: 'pickedUp', label: 'Picked Up', count: categorizedRequests.pickedUp.length },
        { id: 'planted', label: 'Planted', count: categorizedRequests.planted.length },
        { id: 'archive', label: 'Archive', count: categorizedRequests.archive.length }
    ];

    return (
        <div className={`rounded-xl shadow-sm border overflow-hidden ${
            isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
        }`}>
            {/* Summary Stats */}
            <div className={`px-6 py-4 border-b ${
                isDark 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-gray-600' 
                    : 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
            }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className={`text-sm font-medium ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                {filteredRequests.length} Total Requests
                            </span>
                        </div>
                        <div className="flex gap-4 text-xs">
                            {Object.entries(
                                filteredRequests.reduce((acc, req) => {
                                    acc[req.status] = (acc[req.status] || 0) + 1;
                                    return acc;
                                }, {})
                            ).map(([status, count]) => (
                                <span key={status} className={`${
                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {status.replace('_', ' ')}: {count}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        Page {currentPage} of {totalPages}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex space-x-1 p-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                activeTab === tab.id
                                    ? isDark
                                        ? 'bg-green-600 text-white'
                                        : 'bg-green-500 text-white'
                                    : isDark
                                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            {tab.label}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                activeTab === tab.id
                                    ? 'bg-white/20'
                                    : isDark
                                        ? 'bg-gray-700'
                                        : 'bg-gray-200'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className={`border-b ${
                        isDark 
                            ? 'bg-gray-700 border-gray-600' 
                            : 'bg-gray-50 border-gray-200'
                    }`}>
                        <tr>
                            <th className={`text-left py-3 px-6 font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                Request Details
                            </th>
                            <th className={`text-left py-3 px-6 font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                Client Info
                            </th>
                            <th className={`text-left py-3 px-6 font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                Status
                            </th>
                            {activeTab === 'planted' && (
                                <th className={`text-left py-3 px-6 font-semibold ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    Planting Date
                                </th>
                            )}
                            {activeTab === 'planted' && (
                                <th className={`text-left py-3 px-6 font-semibold ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    Harvest Date
                                </th>
                            )}
                            <th className={`text-left py-3 px-6 font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${
                        isDark ? 'divide-gray-700' : 'divide-gray-100'
                    }`}>
                        {paginatedRequests.length === 0 ? (
                            <tr>
                                <td colSpan={activeTab === 'planted' ? 6 : 4} className="px-4 py-12 text-center">
                                    <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                                        {search 
                                            ? 'No requests match your search' 
                                            : `No ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()} requests`}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedRequests.map((request) => (
                            <tr
                                key={request.id}
                                className={`transition-colors duration-150 ${
                                    isDark 
                                        ? 'hover:bg-gray-700' 
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                {/* Request Details */}
                                <td className="py-4 px-6">
                                    <div className="space-y-1">
                                        <div className={`font-medium ${
                                            isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {request.itemName || request.item?.name || 'Unknown Item'}
                                        </div>
                                        {activeTab !== 'planted' && (
                                            <div className={`text-xs ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                Quantity: {request.requestQuantity || request.quantity || 0}
                                            </div>
                                        )}
                                        <div className={`text-xs ${
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            {new Date(
                                                request.createdAt
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                        {renderNote(request)}
                                    </div>
                                </td>

                                {/* Client Info */}
                                <td className="py-4 px-6">
                                    <div className="space-y-1">
                                        <div className={`font-medium ${
                                            isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {request.requestorName || `${request.user?.firstName || ''} ${request.user?.surname || ''}`.trim() || 'Unknown User'}
                                        </div>
                                        <div className={`text-xs ${
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            {request.requestorEmail || request.user?.email || 'N/A'}
                                        </div>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="py-4 px-6">
                                    {getStatusBadge(request.status)}
                                </td>
                                {activeTab === 'planted' && (
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className={`text-xs ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                            {request.plantingReport?.dateOfPlanting
                                                ? new Date(request.plantingReport.dateOfPlanting).toLocaleDateString()
                                                : '—'}
                                        </div>
                                    </td>
                                )}
                                {activeTab === 'planted' && (
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className={`text-xs ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                            {request.plantingReport?.dateOfExpectedHarvest
                                                ? new Date(request.plantingReport.dateOfExpectedHarvest).toLocaleDateString()
                                                : '—'}
                                        </div>
                                    </td>
                                )}

                                {/* Actions */}
                                <td className="py-4 px-6">
                                    {getStatusOptions(request.status).length > 0 ? (
                                        <div className="flex items-center gap-2">
                                            {/* Pending status actions */}
                                            {request.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onStatusChange(
                                                                request.id,
                                                                'Approved',
                                                                request.itemName || request.item?.name || 'Unknown Item',
                                                                request.requestorName || `${request.user?.firstName || ''} ${request.user?.surname || ''}`.trim() || 'Unknown User',
                                                                request.requestQuantity || request.quantity || 0,
                                                                request.currentStock || request.stack?.quantity || 0
                                                            );
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors"
                                                        title="Approve"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onStatusChange(
                                                                request.id,
                                                                'Rejected',
                                                                request.itemName || request.item?.name || 'Unknown Item',
                                                                request.requestorName || `${request.user?.firstName || ''} ${request.user?.surname || ''}`.trim() || 'Unknown User',
                                                                request.requestQuantity || request.quantity || 0,
                                                                request.currentStock || request.stack?.quantity || 0
                                                            );
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors"
                                                        title="Reject"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                            {/* Approved status actions */}
                                            {request.status === 'Approved' && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onStatusChange(
                                                                request.id,
                                                                'Picked_Up',
                                                                request.itemName || request.item?.name || 'Unknown Item',
                                                                request.requestorName || `${request.user?.firstName || ''} ${request.user?.surname || ''}`.trim() || 'Unknown User',
                                                                request.requestQuantity || request.quantity || 0,
                                                                request.currentStock || request.stack?.quantity || 0
                                                            );
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
                                                    >
                                                        Mark Picked Up
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onStatusChange(
                                                                request.id,
                                                                'No_Pickup',
                                                                request.itemName || request.item?.name || 'Unknown Item',
                                                                request.requestorName || `${request.user?.firstName || ''} ${request.user?.surname || ''}`.trim() || 'Unknown User',
                                                                request.requestQuantity || request.quantity || 0,
                                                                request.currentStock || request.stack?.quantity || 0
                                                            );
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium transition-colors"
                                                        title="Mark as No Pickup"
                                                    >
                                                        No Pickup
                                                    </button>
                                                </>
                                            )}

                                            {/* Rejected status actions */}
                                            {request.status === 'Rejected' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onStatusChange(
                                                            request.id,
                                                            'Approved',
                                                            request.itemName || request.item?.name || 'Unknown Item',
                                                            request.requestorName || `${request.user?.firstName || ''} ${request.user?.surname || ''}`.trim() || 'Unknown User',
                                                            request.requestQuantity || request.quantity || 0,
                                                            request.currentStock || request.stack?.quantity || 0
                                                        );
                                                    }}
                                                    className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors"
                                                    title="Re-approve"
                                                >
                                                    Re-approve
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">
                                            {request.status === 'Picked_Up' || request.status === 'late_pickup'
                                                ? 'Awaiting planting report'
                                                : request.status === 'Planted'
                                                ? 'View report in Planted tab'
                                                : 'No actions available'}
                                        </span>
                                    )}
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={`px-6 py-3 border-t ${
                    isDark 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            Showing {startIndex + 1} to{' '}
                            {Math.min(endIndex, filteredRequests.length)} of{' '}
                            {filteredRequests.length} results
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    setCurrentPage(Math.max(1, currentPage - 1))
                                }
                                disabled={currentPage === 1}
                                className={`px-3 py-1 text-xs border rounded-md hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isDark 
                                        ? 'bg-gray-800 border-gray-600 text-gray-200' 
                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                Previous
                            </button>
                            
                            <div className="flex gap-1">
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 text-xs rounded-md ${
                                                currentPage === pageNum
                                                    ? 'bg-green-600 text-white'
                                                    : isDark 
                                                        ? 'bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700' 
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() =>
                                    setCurrentPage(
                                        Math.min(totalPages, currentPage + 1)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 text-xs border rounded-md hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isDark 
                                        ? 'bg-gray-800 border-gray-600 text-gray-200' 
                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
