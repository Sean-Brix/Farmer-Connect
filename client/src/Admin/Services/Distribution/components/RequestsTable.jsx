import React from 'react';

export default function RequestsTable({
    requests,
    search,
    statusFilter,
    sortBy,
    onStatusChange,
}) {
    const [expandedNotes, setExpandedNotes] = React.useState(new Set());
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    const statusOrder = {
        Pending: 1,
        Approved: 2,
        Rejected: 3,
        No_Pickup: 4,
        Cancelled: 5,
    };

    // Filter and sort requests
    const filteredRequests = requests
        .filter((request) => {
            const searchLower = search.toLowerCase();
            const matchesSearch =
                request.itemName?.toLowerCase().includes(searchLower) ||
                request.requestorName?.toLowerCase().includes(searchLower) ||
                request.requestNote?.toLowerCase().includes(searchLower) ||
                request.requestorEmail?.toLowerCase().includes(searchLower);

            const matchesStatus =
                statusFilter === 'all' || request.status === statusFilter;

            return matchesSearch && matchesStatus;
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
                    return a.itemName?.localeCompare(b.itemName) || 0;

                case 'client':
                    return a.requestorName?.localeCompare(b.requestorName) || 0;

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
            <div className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1 max-w-xs relative note-tooltip-container">
                <div className={isExpanded ? '' : 'truncate'}>
                    {isLong && !isExpanded ? request.requestNote.substring(0, 50) + '...' : request.requestNote}
                </div>
                {isLong && (
                    <div className="relative inline-block">
                        <button
                            onClick={() => toggleNoteExpansion(request.id)}
                            className="text-green-600 hover:text-green-800 font-medium mt-1 text-xs underline"
                        >
                            {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                        
                        {/* Tooltip popup for full note */}
                        {isExpanded && (
                            <div className="absolute z-50 bottom-full left-0 mb-2 w-80 max-w-sm">
                                <div className="bg-gray-900 text-white text-xs rounded-lg px-4 py-3 shadow-2xl border border-gray-700 backdrop-blur-sm">
                                    {/* Arrow pointing down */}
                                    <div className="absolute top-full left-4 w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent border-t-[6px] border-t-gray-900"></div>
                                    
                                    {/* Header */}
                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-700 mb-2">
                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span className="font-semibold text-gray-200">Request Note</span>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="text-gray-300 leading-relaxed max-h-32 overflow-y-auto">
                                        {request.requestNote}
                                    </div>
                                    
                                    {/* Footer */}
                                    <div className="mt-2 pt-2 border-t border-gray-700 text-right">
                                        <span className="text-gray-400 text-xs">Click "Show less" to close</span>
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
        const statusStyles = {
            Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Approved: 'bg-green-100 text-green-800 border-green-200',
            Rejected: 'bg-red-100 text-red-800 border-red-200',
            No_Pickup: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            Cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    statusStyles[status] ||
                    'bg-gray-100 text-gray-800 border-gray-200'
                }`}
            >
                {status.replace('_', ' ')}
            </span>
        );
    };

    const getStatusOptions = (currentStatus) => {
        switch (currentStatus) {
            case 'Pending':
                return ['Approved', 'Rejected'];
            case 'Approved':
                return ['No_Pickup'];
            case 'Rejected':
                return ['Approved', 'Rejected'];
            case 'Cancelled':
                return []; // No actions available for cancelled requests
            default:
                return [];
        }
    };

    if (filteredRequests.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="mb-4">
                    <svg
                        className="w-16 h-16 text-gray-300 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Requests Found
                </h3>
                <p className="text-gray-500">
                    Try adjusting your search criteria or filters.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Summary Stats */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">
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
                                <span key={status} className="text-gray-600">
                                    {status.replace('_', ' ')}: {count}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">
                        Page {currentPage} of {totalPages}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-3 px-6 font-semibold text-gray-700">
                                Request Details
                            </th>
                            <th className="text-left py-3 px-6 font-semibold text-gray-700">
                                Client Info
                            </th>
                            <th className="text-left py-3 px-6 font-semibold text-gray-700">
                                Status
                            </th>
                            <th className="text-left py-3 px-6 font-semibold text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedRequests.map((request) => (
                            <tr
                                key={request.id}
                                className="hover:bg-gray-50 transition-colors duration-150"
                            >
                                {/* Request Details */}
                                <td className="py-4 px-6">
                                    <div className="space-y-1">
                                        <div className="font-medium text-gray-900">
                                            {request.itemName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Quantity: {request.requestQuantity}
                                        </div>
                                        <div className="text-xs text-gray-500">
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
                                        <div className="font-medium text-gray-900">
                                            {request.requestorName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {request.requestorEmail}
                                        </div>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="py-4 px-6">
                                    {getStatusBadge(request.status)}
                                </td>

                                {/* Actions */}
                                <td className="py-4 px-6">
                                    {getStatusOptions(request.status).length > 0 ? (
                                        <div className="flex gap-2">
                                            {getStatusOptions(request.status).map(
                                                (status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() =>
                                                            onStatusChange(
                                                                request.id,
                                                                status
                                                            )
                                                        }
                                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                                            status === 'Approved'
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                                                                : status === 'Rejected'
                                                                ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                                                                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-300'
                                                        }`}
                                                    >
                                                        Mark as{' '}
                                                        {status.replace('_', ' ')}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">
                                            No actions available
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
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
                                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                    : 'bg-white border border-gray-300 hover:bg-gray-50'
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
                                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
