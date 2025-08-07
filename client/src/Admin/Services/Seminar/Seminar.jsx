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
        <div className="min-h-screen bg-white pt-30 pb-8 px-2 md:px-6">
            <div className="w-full max-w-5xl mx-auto">
                {/* Header - Centered and Professional */}
                <div className="relative mb-8 flex flex-col items-center justify-center max-w-5xl mx-auto gap-2 text-center">
                  <span className="inline-flex items-center justify-center gap-3 w-full">
                    <span className="rounded-full bg-green-100 p-2">
                      <svg className="w-9 h-9" style={{ color: '#059669' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 3L2 9l10 6 10-6-10-6zm0 13v5m-7-7v2a2 2 0 002 2h10a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">Seminars & Programs</span>
                  </span>
                  <span className="block text-base md:text-lg text-gray-500 font-medium mt-1">Empowering communities through knowledge and engagement</span>
                </div>

                {/* Divider between title and search/filters */}
                <hr className="border-t border-gray-300 my-6 w-full max-w-5xl mx-auto" />

                {/* Modern Search, Filters, and Actions - Responsive, no box */}
                <div className="relative mt-0 mb-8 w-full max-w-5xl mx-auto px-2 md:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 flex-wrap items-stretch w-full">
                    {/* Search bar */}
                    <div className="relative flex-1 min-w-0 w-full sm:w-1/2">
                      <input
                        type="search"
                        placeholder="Search seminars, speakers, locations..."
                        className="block w-full py-2.5 pl-10 pr-3 text-sm text-gray-900 border border-gray-300 rounded-xl bg-white focus:ring-1 focus:ring-green-400 focus:border-green-400 transition placeholder-gray-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search seminars"
                      />
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5" style={{ color: '#059669' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                    {/* Filters */}
                    <div className="flex flex-row gap-2 w-full sm:w-1/2">
                      <div className="relative flex-1 min-w-0">
                        <select
                          className="appearance-none bg-white border border-gray-300 text-gray-700 text-base rounded-xl focus:ring-1 focus:ring-green-600 focus:border-green-600 block py-2 pl-4 pr-10 w-full transition"
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          aria-label="Filter by"
                        >
                          <option value="title">Title</option>
                          <option value="speaker">Speaker</option>
                          <option value="location">Location</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#059669' }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                      <div className="relative flex-1 min-w-0">
                        <select
                          className="appearance-none bg-white border border-gray-300 text-gray-700 text-base rounded-xl focus:ring-1 focus:ring-green-600 focus:border-green-600 block py-2 pl-4 pr-10 w-full transition"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          aria-label="Status filter"
                        >
                          <option value="all">All Statuses</option>
                          <option value="Upcoming">Upcoming</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#059669' }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* Action buttons: Only Add remains */}
                    <div className="flex flex-row gap-2 w-full sm:w-auto items-center">
                      <button
                        className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 text-white transition shadow-sm w-full sm:w-auto"
                        onClick={() => setShowAdd(true)}
                        aria-label="Add seminar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Add
                      </button>
                    </div>
                  </div>
                </div>

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

                <div className="w-full max-w-5xl mx-auto px-2 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {paginatedPrograms && paginatedPrograms.map((item, idx) => {
                        const globalIdx = (currentPage - 1) * itemsPerPage + idx;
                        const truncatedDescription = item.description && item.description.length > 100 ? item.description.slice(0, 100) + '...' : item.description;
                        return (
                            <div
                                key={globalIdx}
                                className="relative flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group"
                            >
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
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate w-full" title={item.title}>{item.title}</h3>
                                    <p className="text-gray-500 text-xs mb-2 flex-1 cursor-default line-clamp-3 w-full truncate" title={item.description}>{truncatedDescription}</p>
                                    <div className="flex flex-col gap-1 text-xs text-gray-400 mb-2 w-full">
                                        <div className="flex flex-row items-center w-full">
                                            <span className="font-medium text-gray-700 mr-1 shrink-0">Speaker:</span>
                                            <span className="truncate text-gray-500" style={{ maxWidth: 'calc(100% - 60px)' }} title={item.speaker}>{item.speaker}</span>
                                        </div>
                                        <div className="flex flex-row items-center w-full">
                                            <span className="font-medium text-gray-700 mr-1 shrink-0">Location:</span>
                                            <span className="truncate text-gray-500" style={{ maxWidth: 'calc(100% - 70px)' }} title={item.location}>{item.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-auto w-full">
                                        <button
                                            onClick={(e) => { edit_seminar(e, item); }}
                                            className="flex-1 min-w-[120px] bg-gray-900 hover:bg-gray-700 text-white cursor-pointer px-5 py-2 rounded-lg text-base font-semibold transition shadow-sm"
                                            style={{ marginTop: '0.5rem' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this seminar?')) {
                                                    mutation.mutate(item.id);
                                                }
                                            }}
                                            className="flex-1 min-w-[120px] bg-red-500 hover:bg-red-600 text-white cursor-pointer px-4 py-2 rounded-lg text-base font-semibold transition shadow-sm flex items-center justify-center"
                                            aria-label="Delete seminar"
                                            title="Delete seminar"
                                            style={{ marginTop: '0.5rem' }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M3 6h18M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => { edit_participants(e, item); }}
                        className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white cursor-pointer px-5 py-2 rounded-lg text-base font-semibold transition shadow-sm flex items-center justify-center"
                                            style={{ marginTop: '0.5rem' }}
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
                                        className={`w-7 h-7 flex items-center justify-center rounded-full transition font-semibold ${currentPage === 1 ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >1</button>
                                    {currentPage > 3 && <span className="px-1 text-gray-300">...</span>}
                                    {Array.from({ length: 3 }, (_, i) => {
                                        const page = Math.max(2, Math.min(currentPage - 1 + i, totalPages - 2));
                                        if (page <= 1 || page >= totalPages) return null;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-7 h-7 flex items-center justify-center rounded-full transition font-semibold ${currentPage === page ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                            >{page}</button>
                                        );
                                    })}
                                    {currentPage < totalPages - 2 && <span className="px-1 text-gray-300">...</span>}
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-full transition font-semibold ${currentPage === totalPages ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >{totalPages}</button>
                                </>
                            ) : (
                                Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                    className={`w-7 h-7 flex items-center justify-center rounded-full transition font-semibold ${currentPage === i + 1 ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
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
