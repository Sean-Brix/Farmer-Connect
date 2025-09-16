import { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../../contexts/ThemeContext';

import default_seminar_pic from '../../../Assets/default_seminar_pic.jpg';

import Edit_Seminar from './Edit_Seminar';
import Participants from './Participants';
import Add_Program from './Add_Program';

// Professional Delete Confirmation Modal
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, seminarTitle, isDark }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className={`rounded-xl shadow-2xl max-w-md w-full border overflow-hidden ${
                isDark 
                    ? 'bg-gray-800 border-gray-600' 
                    : 'bg-white border-gray-200'
            }`}>
                {/* Header */}
                <div className={`border-b px-6 py-4 ${
                    isDark 
                        ? 'bg-red-900/30 border-red-700/50' 
                        : 'bg-red-50 border-red-200'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-600 rounded-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className={`text-lg font-bold ${
                            isDark ? 'text-red-300' : 'text-red-800'
                        }`}>Delete Seminar</h3>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className={`mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        Are you sure you want to delete this seminar?
                    </p>
                    <div className={`rounded-lg p-3 border ${
                        isDark 
                            ? 'bg-gray-700/50 border-gray-600' 
                            : 'bg-gray-50 border-gray-200'
                    }`}>
                        <p className={`font-medium text-sm ${
                            isDark ? 'text-gray-200' : 'text-gray-900'
                        }`}>"{seminarTitle}"</p>
                    </div>
                    <p className={`text-sm mt-3 font-medium ${
                        isDark ? 'text-red-400' : 'text-red-600'
                    }`}>
                        ⚠️ This action cannot be undone. All participant data will be permanently deleted.
                    </p>
                </div>

                {/* Footer */}
                <div className={`border-t px-6 py-4 flex justify-end gap-3 ${
                    isDark 
                        ? 'bg-gray-700/30 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                }`}>
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 font-medium rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${
                            isDark 
                                ? 'bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500 focus:ring-gray-400' 
                                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 focus:ring-gray-300'
                        }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
                    >
                        Delete Seminar
                    </button>
                </div>
            </div>
        </div>
    );
}

// Description Details Modal
function DescriptionModal({ isOpen, onClose, title, description, seminar, isDark, onViewParticipants }) {
    if (!isOpen) return null;

    const handleParticipants = () => {
        onClose();
        if (onViewParticipants && seminar) {
            onViewParticipants(seminar);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className={`rounded-xl shadow-2xl max-w-2xl w-full border overflow-hidden ${
                isDark 
                    ? 'bg-gray-800 border-gray-600' 
                    : 'bg-white border-gray-200'
            }`}>
                {/* Header */}
                <div className={`border-b px-6 py-4 ${
                    isDark 
                        ? 'bg-green-900/30 border-green-700/50' 
                        : 'bg-green-50 border-green-200'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className={`text-lg font-bold ${
                                isDark ? 'text-green-300' : 'text-green-800'
                            }`}>Seminar Details</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg transition-colors ${
                                isDark 
                                    ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h4 className={`text-lg font-semibold mb-4 ${
                        isDark ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                        {title}
                    </h4>
                    <div className={`text-sm leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        {description || 'No description available.'}
                    </div>
                </div>

                {/* Footer */}
                <div className={`border-t px-6 py-4 flex justify-between items-center ${
                    isDark 
                        ? 'bg-gray-750 border-gray-700' 
                        : 'bg-gray-50 border-gray-200'
                }`}>
                    <button
                        onClick={handleParticipants}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        title="View participants"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                        View Participants
                    </button>
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isDark 
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Seminar() {
    const { isDark } = useTheme();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchFilter, setSearchFilter] = useState('Title');
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState({ title: '', description: '', seminar: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [seminarToDelete, setSeminarToDelete] = useState(null);
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
        if (selectedItems.length === 0) return;

        // For bulk delete, we'll use the original simple confirm for now
        if (!confirm(`Are you sure you want to delete ${selectedItems.length} seminar(s)?`)) return;

        selectedItems.forEach((idx) => {
            mutation.mutate(programList[idx].id);
        });

        setSelectedItems([]);
        setSelectMode(false);
    };

    const handleDeleteSingle = (seminar) => {
        setSeminarToDelete(seminar);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (seminarToDelete) {
            mutation.mutate(seminarToDelete.id);
            setShowDeleteModal(false);
            setSeminarToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSeminarToDelete(null);
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
        <div className={`min-h-screen pt-30 pb-8 px-2 md:px-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="w-full max-w-5xl mx-auto">
                {/* Header - Centered and Professional */}
                <div className="relative mb-8 flex flex-col items-center justify-center max-w-5xl mx-auto gap-2 text-center">
                  <span className="inline-flex items-center justify-center gap-3 w-full">
                    <span className={`rounded-full p-2 ${isDark ? 'bg-green-900' : 'bg-green-100'}`}>
                      <svg className="w-9 h-9" style={{ color: '#059669' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 3L2 9l10 6 10-6-10-6zm0 13v5m-7-7v2a2 2 0 002 2h10a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className={`text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Seminars & Programs</span>
                  </span>
                  <span className={`block text-base md:text-lg font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Empowering communities through knowledge and engagement</span>
                </div>

                {/* Divider between title and search/filters */}
                <hr className={`border-t my-6 w-full max-w-5xl mx-auto ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />

                {/* Modern Search, Filters, and Actions - Responsive, no box */}
                <div className="relative mt-0 mb-8 w-full max-w-5xl mx-auto px-2 md:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 flex-wrap items-stretch w-full">
                    {/* Search bar */}
                    <div className="relative flex-1 min-w-0 w-full sm:w-1/2">
                      <input
                        type="search"
                        placeholder="Search seminars, speakers, locations..."
                        className={`block w-full py-2.5 pl-10 pr-3 text-sm border rounded-xl focus:ring-1 focus:ring-green-400 focus:border-green-400 transition ${
                            isDark 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        }`}
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
                    {/* Filters and Controls */}
                    <div className="flex flex-row gap-2 w-full sm:w-1/2">
                      <div className="relative flex-1 min-w-0">
                        <select
                          className={`appearance-none border text-base rounded-xl focus:ring-1 focus:ring-green-600 focus:border-green-600 block py-2 pl-4 pr-10 w-full transition ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-gray-200' 
                              : 'bg-white border-gray-300 text-gray-700'
                          }`}
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
                          className={`appearance-none border text-base rounded-xl focus:ring-1 focus:ring-green-600 focus:border-green-600 block py-2 pl-4 pr-10 w-full transition ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-gray-200' 
                              : 'bg-white border-gray-300 text-gray-700'
                          }`}
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
                        className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 text-white transition shadow-sm w-full sm:w-auto"
                        onClick={() => setShowAdd(true)}
                        aria-label="Add seminar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Add
                      </button>
                    </div>
                  </div>
                </div>

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

                {/* TABLE LAYOUT - Clean and professional seminar management */}
                <div className={`w-full max-w-7xl mx-auto rounded-lg border ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    {paginatedPrograms && paginatedPrograms.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={`${
                                    isDark ? 'bg-gradient-to-r from-green-700 to-green-800' : 'bg-gradient-to-r from-green-600 to-green-700'
                                }`}>
                                    <tr>
                                        <th className="px-4 py-4 text-left font-bold text-white uppercase tracking-wider whitespace-nowrap min-w-[150px] rounded-tl-lg">Title</th>
                                        <th className="px-4 py-4 text-left font-bold text-white uppercase tracking-wider whitespace-nowrap min-w-[120px]">Speaker</th>
                                        <th className="px-4 py-4 text-left font-bold text-white uppercase tracking-wider whitespace-nowrap min-w-[120px]">Location</th>
                                        <th className="px-4 py-4 text-left font-bold text-white uppercase tracking-wider whitespace-nowrap min-w-[100px]">Status</th>
                                        <th className="px-4 py-4 text-left font-bold text-white uppercase tracking-wider whitespace-nowrap min-w-[200px]">Description</th>
                                        <th className="px-4 py-4 text-center font-bold text-white uppercase tracking-wider whitespace-nowrap min-w-[140px] rounded-tr-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${
                                    isDark ? 'divide-gray-700' : 'divide-gray-200'
                                }`}>
                                    {paginatedPrograms.map((item, idx) => {
                                        const globalIdx = (currentPage - 1) * itemsPerPage + idx;
                                        return (
                                            <tr
                                                key={globalIdx}
                                                className={`transition-colors duration-150 ${
                                                    isDark 
                                                        ? 'hover:bg-gray-750' 
                                                        : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <td className="px-4 py-4">
                                                    <div className={`text-sm font-semibold truncate max-w-[140px] ${
                                                        isDark ? 'text-white' : 'text-gray-900'
                                                    }`} title={item.title}>
                                                        {item.title}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className={`text-sm truncate max-w-[110px] ${
                                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                                    }`} title={item.speaker}>
                                                        {item.speaker}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className={`text-sm truncate max-w-[110px] ${
                                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                                    }`} title={item.location}>
                                                        {item.location}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                                                            item.status === 'Ongoing'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : item.status === 'Completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : item.status === 'Cancelled'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm truncate flex-1 ${
                                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                                        }`} title={item.description}>
                                                            {item.description && item.description.length > 40 
                                                                ? item.description.slice(0, 40) + '...' 
                                                                : item.description || 'No description'
                                                            }
                                                        </span>
                                                        {item.description && item.description.length > 40 && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedDescription({ title: item.title, description: item.description, seminar: item });
                                                                    setShowDescriptionModal(true);
                                                                }}
                                                                className={`text-xs px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                                                                    isDark 
                                                                        ? 'bg-green-800 hover:bg-green-700 text-green-200' 
                                                                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                                                                }`}
                                                                title="View full description"
                                                            >
                                                                View Details
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            onClick={(e) => { edit_seminar(e, item); }}
                                                            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                                                isDark 
                                                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                            }`}
                                                            title="Edit seminar"
                                                        >
                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteSingle(item)}
                                                            className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                                                            title="Delete seminar"
                                                        >
                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className={`text-center py-12 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium">No seminars found</h3>
                            <p className="mt-1 text-sm text-gray-400">Get started by creating a new seminar.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Controls - Professional layout matching Profiles */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 py-8">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isDark 
                                    ? 'border-green-600 bg-gray-800 text-green-400 hover:bg-gray-700 hover:border-green-500' 
                                    : 'border-green-300 bg-white text-green-700 hover:bg-green-50 hover:border-green-400'
                            }`}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </button>
                        
                        <div className={`px-4 py-2 font-semibold rounded-lg border ${
                            isDark 
                                ? 'bg-gray-700 text-green-400 border-gray-600' 
                                : 'bg-green-100 text-green-800 border-green-200'
                        }`}>
                            Page {currentPage} of {totalPages}
                        </div>
                        
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isDark 
                                    ? 'border-green-600 bg-gray-800 text-green-400 hover:bg-gray-700 hover:border-green-500' 
                                    : 'border-green-300 bg-white text-green-700 hover:bg-green-50 hover:border-green-400'
                            }`}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Showing items info and rows per page selector */}
                {paginatedPrograms && paginatedPrograms.length > 0 && (
                    <div className="flex justify-between items-center mt-4 mb-2">
                        <span className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            Showing {paginatedPrograms.length} of {programList?.length || 0} seminars
                        </span>
                        
                        <div className="flex items-center gap-2">
                            <span className={`text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                                Rows per page:
                            </span>
                            <div className="relative">
                                <select
                                    className={`appearance-none border text-sm rounded-lg focus:ring-1 focus:ring-green-600 focus:border-green-600 block py-2 pl-3 pr-10 min-w-[70px] transition ${
                                        isDark 
                                            ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                            : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1); // Reset to first page when changing items per page
                                    }}
                                    aria-label="Rows per page"
                                >
                                    <option value={5}>5</option>
                                    <option value={6}>6</option>
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

            {/* Modals */}
            {showAdd && (
                <Add_Program
                    setShowAdd={setShowAdd}
                    search={search}
                    searchFilter={searchFilter}
                    statusFilter={statusFilter}
                />
            )}

            {showEdit && editData.current && (
                <Edit_Seminar
                    data={editData.current}
                    toggleOff={() => {
                        setShowEdit(false);
                        editData.current = null;
                    }}
                    setProgramList={() => {
                        queryClient.invalidateQueries({
                            queryKey: ['seminars', search, searchFilter, statusFilter],
                        });
                    }}
                />
            )}

            {showParticipants && participantsData.current && (
                <Participants
                    data={participantsData.current}
                    toggleOff={() => {
                        setShowParticipants(false);
                        participantsData.current = null;
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                seminarTitle={seminarToDelete?.title || ''}
                isDark={isDark}
            />

            {/* Description Details Modal */}
            <DescriptionModal
                isOpen={showDescriptionModal}
                onClose={() => setShowDescriptionModal(false)}
                title={selectedDescription.title}
                description={selectedDescription.description}
                seminar={selectedDescription.seminar}
                onViewParticipants={(seminar) => {
                    participantsData.current = seminar;
                    setShowParticipants(true);
                }}
                isDark={isDark}
            />
        </div>
    );
}
