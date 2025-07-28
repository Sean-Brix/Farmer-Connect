import { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import default_seminar_pic from '../../../Assets/default_seminar_pic.jpg';

import Edit_Seminar from './Edit_Seminar';
import Participants from './Participants';
import Add_Program from './Add_Program';

export default function Seminar() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchFilter, setSearchFilter] = useState('Title');
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const editData = useRef(null);
    const participantsData = useRef(null);

    const queryClient = useQueryClient();

    const {
        isLoading,
        error,
        data: programList,
    } = useQuery({
        queryKey: ['seminars', search, searchFilter, statusFilter],
        queryFn: async () => {
            const response = await fetch(
                `/api/seminar/all?find=${search}&filter=${searchFilter}&status=${statusFilter}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.list.map((item) => ({
                ...item,
                photo: `/api/seminar/picture/${item.id}`,
            }));
        },
    });

    const mutation = useMutation({
        mutationFn: async (id) => {
            const response = await fetch(`/api/seminar/delete/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['seminars', search, searchFilter, statusFilter],
            });
        },
    });

    const handleToggleSelectMode = () => {
        setSelectMode(!selectMode);
        setSelectedItems([]);
    };

    const handleSelectItem = (idx) => {
        setSelectedItems((selected) =>
            selected.includes(idx)
                ? selected.filter((i) => i !== idx)
                : [...selected, idx]
        );
    };

    const handleDeleteSelected = async () => {
        if (!confirm('Are You Sure?')) return;

        selectedItems.forEach((idx) => {
            mutation.mutate(programList[idx].id);
        });

        setSelectedItems([]);
        setSelectMode(false);
    };

    const edit_seminar = async (e, seminar) => {
        e.preventDefault();
        editData.current = seminar;
        setShowEdit(true);
    };

    const edit_participants = async (e, seminar) => {
        e.preventDefault();
        participantsData.current = seminar;
        setShowParticipants(true);
    };

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [programList, currentPage]);

    const totalPages = programList? Math.ceil(programList.length / itemsPerPage): 0;
    const paginatedPrograms = programList? programList.slice((currentPage - 1) * itemsPerPage,currentPage * itemsPerPage): [];

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="min-h-screen bg-white pt-20 pb-8 px-2 sm:px-4 md:px-6 lg:px-0">
            <div className="w-full max-w-4xl mx-auto">
                <header className="flex flex-col gap-6 mb-8 w-full">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 3L2 9l10 6 10-6-10-6zm0 13v5m-7-7v2a2 2 0 002 2h10a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Seminars & Programs
                        </span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center w-full">
                        <div className="relative w-full md:w-64 flex-shrink-0">
                            <input
                                type="search"
                                placeholder="Search..."
                                className="block w-full p-2 pl-9 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <select
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-400 p-2"
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                        >
                            <option value="title">Title</option>
                            <option value="speaker">Speaker</option>
                            <option value="location">Location</option>
                        </select>
                        <select
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-400 p-2"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="flex gap-2 w-full md:w-auto justify-end mt-2 md:mt-0">
                            {selectMode && (
                                <button
                                    className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition"
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
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition
                                    ${selectMode ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'}
                                    ${selectMode && selectedItems.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}
                                `}
                                onClick={selectMode ? handleDeleteSelected : handleToggleSelectMode}
                                disabled={selectMode && selectedItems.length === 0}
                            >
                                {selectMode ? (selectedItems.length > 0 ? `Delete (${selectedItems.length})` : 'Delete') : 'Delete'}
                            </button>
                            <button
                                className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white transition"
                                onClick={() => setShowAdd(true)}
                            >
                                <span className="mr-1 text-lg font-bold">+</span> Add
                            </button>
                            {selectMode && (
                                <button
                                    className="px-3 py-1 rounded-lg text-xs font-medium bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
                                    onClick={handleToggleSelectMode}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {showAdd && (
                    <Add_Program
                        programList={programList}
                        setShowAdd={setShowAdd}
                        search={search}
                        searchFilter={searchFilter}
                        statusFilter={statusFilter}
                    />
                )}
                {showEdit && (
                    <Edit_Seminar
                        data={editData.current}
                        toggleOff={() => {
                            setShowEdit(false);
                            editData.current = null;
                        }}
                        search={search}
                        searchFilter={searchFilter}
                        statusFilter={statusFilter}
                    />
                )}
                {showParticipants && (
                    <Participants
                        data={participantsData.current}
                        toggleOff={() => {
                            setShowParticipants(false);
                            participantsData.current = null;
                        }}
                    />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                    {paginatedPrograms && paginatedPrograms.map((item, idx) => {
                        const globalIdx = (currentPage - 1) * itemsPerPage + idx;
                        const isSelected = selectedItems.includes(globalIdx);
                        const truncatedDescription = item.description && item.description.length > 100 ? item.description.slice(0, 100) + '...' : item.description;
                        return (
                            <div
                                key={globalIdx}
                                className={`relative flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group ${selectMode ? 'cursor-pointer' : ''} ${selectMode && isSelected ? 'ring-2 ring-red-300' : ''}`}
                                onClick={selectMode ? () => handleSelectItem(globalIdx) : undefined}
                            >
                                {selectMode && (
                                    <div className="absolute top-3 left-3 z-10">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleSelectItem(globalIdx)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-4 h-4 accent-red-400"
                                        />
                                    </div>
                                )}
                                <div className="relative">
                                    <img
                                        src={item.photo}
                                        alt={item.title}
                                        className="w-full h-36 object-cover transition group-hover:scale-105 duration-200"
                                    />
                                    <span
                                        className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm border ${
                                            item.status === 'Ongoing'
                                                ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                : item.status === 'Completed'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : item.status === 'Cancelled'
                                                ? 'bg-red-50 text-red-600 border-red-100'
                                                : 'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col p-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{item.title}</h3>
                                    <p className="text-gray-500 text-xs mb-2 flex-1 cursor-default line-clamp-3">{truncatedDescription}</p>
                                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400 mb-2">
                                        <span><span className="font-medium text-gray-700">Speaker:</span> {item.speaker}</span>
                                        <span><span className="font-medium text-gray-700">Location:</span> {item.location}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-auto md:flex-row">
                                        <button
                                            onClick={(e) => { edit_seminar(e, item); }}
                                            className="w-full md:w-auto bg-gray-900 hover:bg-gray-700 text-white cursor-pointer px-5 py-2 mt-2 rounded-lg text-base font-semibold transition shadow-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => { edit_participants(e, item); }}
                                            className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-5 py-2 mt-2 rounded-lg text-base font-semibold transition shadow-sm"
                                        >
                                            Participants
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {programList && programList.length === 0 && (
                        <div className="col-span-full text-center text-gray-300 py-16 text-base font-medium">
                            No programs found.
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 mb-2">
                        <nav className="flex items-center gap-1 bg-white rounded-lg shadow px-2 py-1.5" aria-label="Pagination">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`w-7 h-7 flex items-center justify-center rounded-full transition text-gray-400 hover:bg-gray-100 hover:text-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                aria-label="Previous"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            {totalPages > 6 ? (
                                <>
                                    <button
                                        onClick={() => setCurrentPage(1)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-full transition font-semibold ${currentPage === 1 ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >1</button>
                                    {currentPage > 3 && <span className="px-1 text-gray-300">...</span>}
                                    {Array.from({ length: 3 }, (_, i) => {
                                        const page = Math.max(2, Math.min(currentPage - 1 + i, totalPages - 2));
                                        if (page <= 1 || page >= totalPages) return null;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-7 h-7 flex items-center justify-center rounded-full transition font-semibold ${currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                            >{page}</button>
                                        );
                                    })}
                                    {currentPage < totalPages - 2 && <span className="px-1 text-gray-300">...</span>}
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-full transition font-semibold ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >{totalPages}</button>
                                </>
                            ) : (
                                Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-full transition font-semibold ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >{i + 1}</button>
                                ))
                            )}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`w-7 h-7 flex items-center justify-center rounded-full transition text-gray-400 hover:bg-gray-100 hover:text-gray-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                aria-label="Next"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                )}
            </div>
            <style>{`
                @media (max-width: 1024px) {
                    .max-w-4xl { max-width: 98vw !important; }
                }
                @media (max-width: 900px) {
                    .grid-cols-3, .grid-cols-2 {
                        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                    }
                }
                @media (max-width: 600px) {
                    .max-w-4xl {
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
            `}</style>
        </div>
    );
}
