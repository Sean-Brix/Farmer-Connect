// UTILS
import { useEffect, useState, useRef } from 'react';

// ASSETS
import default_seminar_pic from '../../../Assets/default_seminar_pic.jpg';

// SUB-COMPONENT
import Edit_Seminar from './Edit_Seminar';
import Participants from './Participants';
import Add_Program from './Add_Program';

export default function Seminar({ admin_navigate }) {
    const [programList, setProgramList] = useState([]);

    // Initial Render
    useEffect(() => {
        (async () => {
            // Data
            const response = await fetch(`/api/Seminars/getSeminars`);
            const data = await response.json();

            // Fetch and set image URLs for each seminar
            const updatedProgramList = await fetchAndSetImageUrls(
                data.payload.seminars
            );
            setProgramList(updatedProgramList);
        })();
    }, []);

    // Helper function to fetch and set image URLs
    const fetchAndSetImageUrls = async (seminars) => {
        return Promise.all(
            seminars.map(async (item) => {
                try {
                    const imageFetch = await fetch(
                        `/api/seminars/getPhoto?id=${item.id}`
                    );

                    if (imageFetch.status == 204) {
                        // Don't log errors for missing images
                        return { ...item, photo: default_seminar_pic };
                    } else {
                        const blob = await imageFetch.blob();
                        const picture = URL.createObjectURL(blob);
                        return { ...item, photo: picture };
                    }
                } catch (error) {
                    console.error(
                        `Error fetching image for seminar ${item.id}:`,
                        error
                    );
                    return { ...item, photo: default_seminar_pic }; // Fallback in case of error
                }
            })
        );
    };

    // Adding New Seminar
    const [showAdd, setShowAdd] = useState(false);
    
    // Edit Function
    const [showEdit, setShowEdit] = useState(false);
    const editData = useRef([]);
    const edit_seminar = async (e, seminar) => {
        e.preventDefault();
        editData.current = seminar;

        setShowEdit(true);
    };

    // Search Function
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchFilter, setSearchFilter] = useState('all');

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await fetch(
                    `/api/Seminars/searchSeminar?find=${search}&filter=${searchFilter}&status=${statusFilter}`
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const updatedProgramList = await fetchAndSetImageUrls(data);
                setProgramList(updatedProgramList);
            } catch (error) {
                console.error('Could not fetch seminars:', error);
            }
        }, 500); // Delay of 500 milliseconds

        return () => clearTimeout(delayDebounceFn);
    }, [search, searchFilter, statusFilter]);

    // State for selection mode and selected items
    const [selectMode, setSelectMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    // Toggle selection mode
    const handleToggleSelectMode = () => {
        setSelectMode(!selectMode);
        setSelectedItems([]);
    };

    // Handle selecting/deselecting an item
    const handleSelectItem = (idx) => {
        setSelectedItems((selected) =>
            selected.includes(idx)
                ? selected.filter((i) => i !== idx)
                : [...selected, idx]
        );
    };

    // Delete selected items
    const handleDeleteSelected = async () => {
        if (!confirm('Are You Sure?')) return;

        selectedItems.map(async (idx) => {
            const response = await fetch(
                `/api/Seminars/deleteSeminar?delete=${programList[idx].id}`
            );
            const data = await response.json();
        });

        const updatedProgramList = programList.filter(
            (_, index) => !selectedItems.includes(index)
        );

        const updatedProgramPicture = await fetchAndSetImageUrls(
            updatedProgramList
        );
        setProgramList(updatedProgramPicture);

        setSelectedItems([]);
        setSelectMode(false);
    };

    // Edit Participants
    const [showParticipants, setShowParticipants] = useState(false);
    const participantsData = useRef([]);
    const edit_participants = async (e, seminar) => {
        e.preventDefault();
        participantsData.current = seminar;

        setShowParticipants(true);
    }

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Calculate paginated data
    const totalPages = Math.ceil(programList.length / itemsPerPage);
    const paginatedPrograms = programList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to first page if filters/search change and currentPage is out of range
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [programList, totalPages]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 py-8 px-2 md:px-6">
            {/* Header */}
            <div className="relative mt-16 mb-8 flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-4">
                <span className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                    <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 3L2 9l10 6 10-6-10-6zm0 13v5m-7-7v2a2 2 0 002 2h10a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Seminars & Programs
                </span>
                {/* Button group */}
                <div className="flex gap-2 flex-wrap w-full md:w-auto justify-center md:justify-end">
                    {selectMode && (
                        <button
                            className="flex items-center justify-center px-4 py-1.5 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all"
                            onClick={() => {
                                if (selectedItems.length === programList.length) {
                                    setSelectedItems([]);
                                } else {
                                    setSelectedItems(programList.map((_, idx) => idx));
                                }
                            }}
                        >
                            {selectedItems.length === programList.length ? 'Unselect All' : 'Select All'}
                        </button>
                    )}
                    <button
                        className={`flex items-center justify-center px-4 py-1.5 rounded-md text-sm font-medium transition-all
                            ${selectMode
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }
                            ${selectMode && selectedItems.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}
                        `}
                        onClick={
                            selectMode
                                ? handleDeleteSelected
                                : handleToggleSelectMode
                        }
                        disabled={selectMode && selectedItems.length === 0}
                    >
                        {selectMode
                            ? selectedItems.length > 0
                                ? `Delete (${selectedItems.length})`
                                : 'Delete'
                            : 'Delete'}
                    </button>
                    <button
                        className="flex items-center justify-center px-4 py-1.5 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all"
                        onClick={() => setShowAdd(true)}
                    >
                        <span className="mr-1 text-lg font-bold">+</span> Add Program
                    </button>
                    {selectMode && (
                        <button
                            className="flex items-center justify-center px-4 py-1.5 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                            onClick={handleToggleSelectMode}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* Add Program Modal */}
            {showAdd && (
                <Add_Program 
                    programList = {programList} 
                    setProgramList = {setProgramList} 
                    fetchAndSetImageUrls = {fetchAndSetImageUrls}
                    setShowAdd = {setShowAdd}
                />
            )}

            {/* Edit Modal */}
            {showEdit && (
                <Edit_Seminar
                    data={editData.current}
                    setProgramList={setProgramList}
                    toggleOff={() => {
                        setShowEdit(false);
                        editData.current = null;
                    }}
                />
            )}

            {/* Participants Modal */}
            {showParticipants && (
                <Participants
                    data={participantsData.current}
                    toggleOff={() => {
                        setShowParticipants(false);
                        participantsData.current = null
                    }}
                />
            )}

            {/* Responsive Grid for Programs */}
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {paginatedPrograms.map((item, idx) => {
                    const globalIdx = (currentPage - 1) * itemsPerPage + idx;
                    const isSelected = selectedItems.includes(globalIdx);

                    const truncatedDescription =
                        item.description && item.description.length > 100
                            ? item.description.slice(0, 100) + '...'
                            : item.description;

                    return (
                        <div
                            key={globalIdx}
                            className={`relative flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden group ${
                                selectMode && 'cursor-pointer'
                            } ${
                                selectMode && isSelected
                                    ? 'ring-2 ring-red-300'
                                    : ''
                            }`}
                            onClick={
                                selectMode
                                    ? () => handleSelectItem(globalIdx)
                                    : undefined
                            }
                        >
                            {selectMode && (
                                <div className="absolute top-3 left-3 z-10">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleSelectItem(globalIdx)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-5 h-5 accent-red-400"
                                    />
                                </div>
                            )}
                            <div className="relative">
                                <img
                                    src={item.photo}
                                    alt={item.title}
                                    className="w-full h-40 sm:h-48 object-cover transition-all duration-300 group-hover:scale-105"
                                />
                                <span className={`absolute top-3 right-3 px-3 py-0.5 rounded-full text-xs font-semibold shadow-sm ${
                                    item.status === 'Ongoing'
                                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                        : item.status === 'Completed'
                                        ? 'bg-green-50 text-green-700 border border-green-100'
                                        : item.status === 'Cancelled'
                                        ? 'bg-red-50 text-red-600 border border-red-100'
                                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="flex-1 flex flex-col p-5">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2 flex-1 cursor-default line-clamp-3">
                                    {truncatedDescription}
                                </p>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
                                    <span>
                                        <span className="font-medium text-gray-700">Speaker:</span> {item.speaker}
                                    </span>
                                    <span>
                                        <span className="font-medium text-gray-700">Location:</span> {item.location}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 mt-auto md:flex-row">
                                    <button
                                        onClick={(e) => {
                                            edit_seminar(e, item);
                                        }}
                                        className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                                    >
                                        Edit Program
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            edit_participants(e, item);
                                        }}
                                        className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                                    >
                                        Participants
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {programList.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-16 text-base font-medium">
                        No programs found.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 mb-2">
                    <nav className="flex items-center gap-1 bg-white rounded-lg shadow px-3 py-1.5" aria-label="Pagination">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-gray-500 hover:bg-gray-200 hover:text-gray-700 ${
                                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label="Previous"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        {totalPages > 6 ? (
                            <>
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                        currentPage === 1 ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >1</button>
                                {currentPage > 3 && <span className="px-1 text-gray-400">...</span>}
                                {Array.from({ length: 3 }, (_, i) => {
                                    const page = Math.max(2, Math.min(currentPage - 1 + i, totalPages - 2));
                                    if (page <= 1 || page >= totalPages) return null;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                                currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >{page}</button>
                                    );
                                })}
                                {currentPage < totalPages - 2 && <span className="px-1 text-gray-400">...</span>}
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                        currentPage === totalPages ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >{totalPages}</button>
                            </>
                        ) : (
                            Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                        currentPage === i + 1 ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >{i + 1}</button>
                            ))
                        )}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-gray-500 hover:bg-gray-200 hover:text-gray-700 ${
                                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label="Next"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </nav>
                </div>
            )}

            {/* Custom responsive styles */}
            <style>
                {`
                @media (max-width: 1200px) {
                    .max-w-5xl {
                        max-width: 98vw !important;
                    }
                    .grid-cols-3 {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                }
                @media (max-width: 900px) {
                    .grid-cols-3, .grid-cols-2 {
                        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                    }
                }
                @media (max-width: 600px) {
                    .max-w-5xl {
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                    }
                    .flex-wrap {
                        flex-direction: column !important;
                        gap: 8px !important;
                    }
                    .flex-wrap > button, .flex-wrap > .bg-gray-100 {
                        width: 100% !important;
                        min-width: 0 !important;
                        margin-bottom: 0 !important;
                    }
                }
                `}
            </style>
        </div>
    );
}
