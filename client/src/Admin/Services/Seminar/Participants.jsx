import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Participants({ data, toggleOff }) {
    const [section, setSection] = useState('participants');
    const [statsVisible, setStatsVisible] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [showSelect, setShowSelect] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [bulkStatus, setBulkStatus] = useState('Registered');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [participantsPerPage] = useState(10);

    const queryClient = useQueryClient();
    const [initLoad, setInitLoad] = useState(true);

    const {
        error,
        data: participantsData,
        refetch,
    } = useQuery({
        queryKey: ['participants', data.id],
        queryFn: async () => {
            const response = await fetch(
                `/api/seminar/participants/${data.id}`
            );
            if (!response.ok) {
                console.error(
                    'Failed to fetch participants:',
                    response.status,
                    response.statusText
                );
                throw new Error('Failed to fetch participants');
            }
            setInitLoad(false);
            return response.json();
        },
        initialData: { list: [] },
        staleTime: 60 * 1000,
        retry: 1,
    });

    useEffect(() => {
        refetch();
    }, [data.id, refetch]);

    const { total, attended, cancelled, noShow, registered } =
        participantsData?.list?.reduce(
            (acc, participant) => {
                acc.total++;
                if (participant.status === 'Attended') acc.attended++;
                if (participant.status === 'Cancelled') acc.cancelled++;
                if (participant.status === 'Not Attended') acc.noShow++;
                if (participant.status === 'Registered') acc.registered++;
                return acc;
            },
            {
                total: 0,
                attended: 0,
                cancelled: 0,
                noShow: 0,
                registered: 0,
            }
        ) || { total: 0, attended: 0, cancelled: 0, noShow: 0, registered: 0 };

    const updateStatusMutation = useMutation({
        mutationFn: async ({ participantId, new_status }) => {
            const response = await fetch(
                `/api/seminar/participants/update/${participantId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        new_status,
                    }),
                }
            );
            if (!response.ok) {
                console.error(
                    'Failed to update status:',
                    response.status,
                    response.statusText
                );
                throw new Error('Failed to update status');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['participants', data.id],
            });
        },
        onError: (error) => {
            console.error('Error updating status:', error);
            alert('Error updating status. Please try again.');
        },
        retry: 1,
    });

    const handleStatusUpdate = async (e, userId) => {
        e.preventDefault();
        const newStatus = e.target.value;
        const participant = participantsData.list.find(
            (participant) => participant.id === userId
        );

        if (participant) {
            updateStatusMutation.mutate({
                participantId: participant.id,
                new_status: newStatus,
            });
        }
    };

    const handleToggleSelectParticipant = (userId) => {
        setSelectedParticipants((prevSelected) => {
            if (prevSelected.includes(userId)) {
                return prevSelected.filter((id) => id !== userId);
            } else {
                return [...prevSelected, userId];
            }
        });
    };

    const handleSearchChange = async (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredParticipants =
        participantsData?.list?.filter((participant) => {
            const searchTermLower = searchTerm.toLowerCase();
            return (
                participant.info.fullName
                    .toLowerCase()
                    .includes(searchTermLower) ||
                participant.info.email.toLowerCase().includes(searchTermLower)
            );
        }) || [];

    // Pagination calculations
    const totalParticipants = filteredParticipants.length;
    const totalPages = Math.ceil(totalParticipants / participantsPerPage);
    const startIndex = (currentPage - 1) * participantsPerPage;
    const endIndex = startIndex + participantsPerPage;
    const currentParticipants = filteredParticipants.slice(startIndex, endIndex);

    // Reset to first page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBulkStatusChange = (e) => {
        setBulkStatus(e.target.value);
    };

    const handleUpdateBulkStatus = async () => {
        for (const userId of selectedParticipants) {
            const participant = participantsData.list.find(
                (participant) => participant.id === userId
            );
            if (participant) {
                await updateStatusMutation.mutateAsync({
                    participantId: participant.id,
                    new_status: bulkStatus,
                });
            }
        }
        setSelectedParticipants([]);
        setShowSelect(false);
    };

    const handleSelectAll = () => {
        // Get IDs of current page participants
        const currentPageIds = currentParticipants.map((p) => p.id);
        const allCurrentPageSelected = currentPageIds.every(id => 
            selectedParticipants.includes(id)
        );
        
        if (allCurrentPageSelected && currentPageIds.length > 0) {
            // Deselect all participants on current page
            setSelectedParticipants(prev => 
                prev.filter(id => !currentPageIds.includes(id))
            );
        } else {
            // Select all participants on current page
            setSelectedParticipants(prev => {
                const newIds = currentPageIds.filter(id => !prev.includes(id));
                return [...prev, ...newIds];
            });
        }
    };

    const isAllCurrentPageSelected =
        currentParticipants.length > 0 &&
        currentParticipants.every(participant => 
            selectedParticipants.includes(participant.id)
        );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col h-[95vh] sm:max-h-[95vh] overflow-hidden">
                {/* HEADER */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-600 rounded-lg">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 truncate">
                                    Participants - {data.title}
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <div className="space-y-1">
                                        <div><span className="font-medium text-gray-700">Speaker:</span> <span className="text-gray-900">{data.speaker}</span></div>
                                        <div><span className="font-medium text-gray-700">Location:</span> <span className="text-gray-900">{data.location}</span></div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <div className="space-y-1">
                                        <div><span className="font-medium text-gray-700">Status:</span> <span className="text-gray-900">{data.status}</span></div>
                                        <div><span className="font-medium text-gray-700">Duration:</span> <span className="text-gray-900">
                                            {new Date(data.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            {' '}–{' '}
                                            {new Date(data.end_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={toggleOff}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* CONTROLS */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Left: Search and Stats */}
                        <div className="flex flex-col sm:flex-row gap-3 flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search participants..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-sm w-64"
                                    onChange={handleSearchChange}
                                    value={searchTerm}
                                    autoComplete="off"
                                />
                            </div>
                            <button
                                onClick={() => setStatsVisible(!statsVisible)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 text-sm border border-gray-300"
                            >
                                {statsVisible ? 'Hide Statistics' : 'Show Statistics'}
                            </button>
                        </div>

                        {/* Right: Selection Controls */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <button
                                onClick={() => setShowSelect(!showSelect)}
                                className={`px-4 py-2 font-medium rounded-lg transition-colors duration-200 text-sm ${
                                    showSelect 
                                        ? 'bg-red-600 hover:bg-red-700 text-white border border-red-600' 
                                        : 'bg-green-600 hover:bg-green-700 text-white border border-green-600'
                                }`}
                            >
                                {showSelect ? 'Cancel Selection' : 'Select Multiple'}
                            </button>

                            {showSelect && (
                                <>
                                    <button
                                        onClick={handleSelectAll}
                                        className={`px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 text-sm border border-gray-300 ${
                                            currentParticipants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        disabled={currentParticipants.length === 0}
                                    >
                                        {isAllCurrentPageSelected ? 'Deselect Page' : 'Select Page'}
                                    </button>
                                    <select
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-sm bg-white"
                                        value={bulkStatus}
                                        onChange={handleBulkStatusChange}
                                    >
                                        <option value="Registered">Registered</option>
                                        <option value="Attended">Attended</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Not Attended">Not Attended</option>
                                    </select>
                                    <button
                                        onClick={handleUpdateBulkStatus}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm border border-green-600"
                                        disabled={selectedParticipants.length === 0}
                                    >
                                        Update Selected ({selectedParticipants.length})
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* STATISTICS */}
                {statsVisible && (
                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                                <div className="text-2xl font-bold text-gray-900">{total}</div>
                                <div className="text-sm text-gray-600 font-medium">Total</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                                <div className="text-2xl font-bold text-green-600">{attended}</div>
                                <div className="text-sm text-gray-600 font-medium">Attended</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                                <div className="text-2xl font-bold text-blue-600">{registered}</div>
                                <div className="text-sm text-gray-600 font-medium">Registered</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                                <div className="text-2xl font-bold text-red-600">{cancelled}</div>
                                <div className="text-sm text-gray-600 font-medium">Cancelled</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                                <div className="text-2xl font-bold text-yellow-600">{noShow}</div>
                                <div className="text-sm text-gray-600 font-medium">Not Attended</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PARTICIPANTS TABLE */}
                {section === 'participants' && (
                    <div className="flex-1 overflow-hidden border border-gray-200 rounded-lg flex flex-col">
                        <div className="overflow-x-auto overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '150px' }}>
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider text-xs sm:text-sm">
                                            Full Name
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider text-xs sm:text-sm">
                                            Email
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider text-xs sm:text-sm">
                                            Status
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider text-xs sm:text-sm hidden sm:table-cell">
                                            Registration Date
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider text-xs sm:text-sm">
                                            Actions
                                        </th>
                                        {showSelect && (
                                            <th className="px-3 sm:px-6 py-3 text-center font-medium text-gray-700 uppercase tracking-wider text-xs sm:text-sm">
                                                Select
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {initLoad ? (
                                        <tr>
                                            <td colSpan={showSelect ? 6 : 5} className="px-3 sm:px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent mb-3"></div>
                                                    <p className="text-gray-600 font-medium text-sm">Loading participants...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={showSelect ? 6 : 5} className="px-3 sm:px-6 py-16 text-center">
                                                <div className="text-red-600 font-medium text-sm">Error: {error.message}</div>
                                            </td>
                                        </tr>
                                    ) : totalParticipants === 0 ? (
                                        <tr>
                                            <td colSpan={showSelect ? 6 : 5} className="px-3 sm:px-6 py-16 text-center">
                                                <div className="text-gray-500 font-medium text-sm">No participants found.</div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentParticipants.map((user, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                    <div className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[200px] text-sm">
                                                        {user.info.fullName}
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                    <div className="text-gray-700 truncate max-w-[140px] sm:max-w-[250px] text-sm">
                                                        {user.info.email}
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                    <span className={`inline-flex px-1 sm:px-2 py-1 text-xs font-medium rounded-full ${
                                                        user.status === 'Registered' ? 'bg-blue-100 text-blue-800' :
                                                        user.status === 'Attended' ? 'bg-green-100 text-green-800' :
                                                        user.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                        user.status === 'Not Attended' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {user.status || 'Loading'}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 text-sm hidden sm:table-cell">
                                                    {user.createdAt}
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                    <select
                                                        className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white w-full sm:w-auto"
                                                        value={user.status || 'loading'}
                                                        onChange={(e) => handleStatusUpdate(e, user.id)}
                                                        autoComplete="off"
                                                    >
                                                        <option value="Registered">Registered</option>
                                                        <option value="Attended">Attended</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                        <option value="Not Attended">Not Attended</option>
                                                    </select>
                                                </td>
                                                {showSelect && (
                                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedParticipants.includes(user.id)}
                                                            onChange={() => handleToggleSelectParticipant(user.id)}
                                                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                        />
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="border-t-2 border-gray-200 bg-white flex-shrink-0 sticky bottom-0">
                                {/* Mobile Pagination */}
                                <div className="flex items-center justify-between px-4 py-4 sm:hidden bg-gray-50">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                            currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
                                        }`}
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Prev
                                    </button>
                                    
                                    <div className="flex items-center gap-2 min-w-0 bg-white px-4 py-2 rounded-lg border border-gray-200">
                                        <div className="text-center">
                                            <div className="text-sm text-gray-700 font-bold whitespace-nowrap">
                                                {currentPage} / {totalPages}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {totalParticipants} total
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
                                        }`}
                                    >
                                        Next
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Desktop Pagination */}
                                <div className="hidden sm:flex sm:items-center sm:justify-between px-6 py-4">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span>
                                            Showing {startIndex + 1} to {Math.min(endIndex, totalParticipants)} of {totalParticipants} participants
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                currentPage === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Previous
                                        </button>
                                        
                                        <div className="flex items-center gap-1 mx-2">
                                            {[...Array(totalPages)].map((_, index) => {
                                                const page = index + 1;
                                                
                                                // Show fewer pages on medium screens
                                                const showOnMd = (
                                                    page === 1 ||
                                                    page === totalPages ||
                                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                                );
                                                
                                                // Show more pages on large screens  
                                                const showOnLg = (
                                                    page === 1 ||
                                                    page === totalPages ||
                                                    (page >= currentPage - 2 && page <= currentPage + 2)
                                                );
                                                
                                                if (showOnMd) {
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`hidden md:inline-flex px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                                currentPage === page
                                                                    ? 'bg-green-600 text-white'
                                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                } else if (showOnLg) {
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`hidden lg:inline-flex px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                                currentPage === page
                                                                    ? 'bg-green-600 text-white'
                                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                } else if (
                                                    (page === currentPage - 2 || page === currentPage + 2) ||
                                                    (page === currentPage - 3 || page === currentPage + 3)
                                                ) {
                                                    return (
                                                        <span key={page} className="hidden lg:inline-flex px-1 text-gray-400">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                        
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                currentPage === totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
