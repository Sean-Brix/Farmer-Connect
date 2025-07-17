import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// SUB COMPONENT
import Navbar from '../../Components/Navbar';
import default_seminar_pic from './Assets/default_seminar_pic.jpg';

// API functions
const fetchSeminars = async ({ queryKey }) => {
    const [_key, { search, filterBy }] = queryKey;
    const params = new URLSearchParams();

    if (search) params.append('find', search);
    if (filterBy) params.append('filter', filterBy);

    params.append('status', 'Upcoming,Ongoing');

    const res = await fetch(`/api/seminar/all?${params}`);

    if (!res.ok) throw new Error('Failed to fetch seminars');

    const data = await res.json();
    return (data.list || []).map((item) => ({
        ...item,
        photo: `/api/seminar/picture/${item.id}`,
    }));
};

const fetchAppliedSeminars = async () => {
    let user = {};
    try {
        const userRes = await fetch('/auth/is-authenticated');
        user = await userRes.json();
    } catch (err) {
        user = { check: false };
    }

    if (!user.check) {
        // User not authenticated, skip second API call
        return [];
    }

    const res = await fetch(`/api/seminar/participants/user`);
    const data = await res.json();

    // Only include seminars where participant status is NOT 'Cancelled'
    return Array.isArray(data)
        ? data
              .filter((participant) => participant.status !== 'Cancelled')
              .map((participant) => participant.seminar?.id)
              .filter(Boolean)
        : [];
};

// NEW: Fetch user's registered seminars (full info)
const fetchUserRegisteredSeminars = async () => {
    const userRes = await fetch('/auth/is-authenticated');
    const user = await userRes.json();
    if (!user.check) return [];

    const res = await fetch('/api/seminar/participants/user');
    const data = await res.json();

    // Map to flatten seminar info and add participant status
    return Array.isArray(data)
        ? data
              .map((item) =>
                  item.seminar
                      ? {
                            ...item.seminar,
                            participantStatus: item.status,
                        }
                      : null
              )
              .filter(Boolean)
        : [];
};

const applySeminar = async (seminarId) => {
    const userRes = await fetch('/auth/is-authenticated');
    const user = await userRes.json();

    if (!user.check) throw new Error('Login First');

    const res = await fetch(`/api/seminar/participants/apply/${seminarId}`, {
        method: 'POST',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to apply, Try again later');

    return seminarId;
};

const cancelSeminar = async (seminarId) => {
    const userRes = await fetch('/auth/is-authenticated');
    const user = await userRes.json();

    if (!user.check) throw new Error('Login First');

    const res = await fetch(`/api/seminar/participants/cancel/${seminarId}`, {
        method: 'POST',
    });

    if (!res.ok) throw new Error('Unable to Cancel application, Try again later');
    return seminarId;
};

export default function Seminar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterBy, setFilterBy] = useState('Title');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedSeminarId, setSelectedSeminarId] = useState(null);

    // NEW: Modal state for user's registered seminars
    const [showUserSeminarsModal, setShowUserSeminarsModal] = useState(false);

    // Pagination
    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);

    // React Query
    const queryClient = useQueryClient();

    const { data: seminars = [], isLoading } = useQuery({
        queryKey: ['seminars', { search, filterBy }],
        queryFn: fetchSeminars,
        keepPreviousData: true,
    });

    const { data: appliedSeminars = [] } = useQuery({
        queryKey: ['appliedSeminars'],
        queryFn: fetchAppliedSeminars,
    });

    // NEW: Query for user's registered seminars (full info)
    const {
        data: userRegisteredSeminars = [],
        isLoading: isUserSeminarsLoading,
    } = useQuery({
        queryKey: ['userRegisteredSeminars'],
        queryFn: fetchUserRegisteredSeminars,
        enabled: showUserSeminarsModal, // Only fetch when modal is open
    });

    
    const applyMutation = useMutation({
        
        mutationFn: applySeminar,
        onSuccess: (seminarId) => {
            queryClient.setQueryData(['seminars', { search, filterBy }], (prev = []) =>
                prev.map(s =>
                    s.id === seminarId
                        ? { ...s, totalParticipants: s.totalParticipants + 1 }
                        : s
                )
            );
            queryClient.setQueryData(['appliedSeminars'], (prev = []) => [
                ...prev,
                seminarId,
            ]);
            showCustomAlert('Successfully applied!', 'success');
        },
        onError: (err) => {
            if (err.message === 'Login First') {
                alert('Login First');
                navigate('/login');
            } else {
                showCustomAlert(err.message, 'error');
            }
        },
    });

    const cancelMutation = useMutation({
        mutationFn: cancelSeminar,
        onSuccess: (seminarId) => {
            // In cancelMutation.onSuccess
            queryClient.setQueryData(['seminars', { search, filterBy }], (prev = []) =>
                prev.map(s =>
                    s.id === seminarId
                        ? { ...s, totalParticipants: Math.max(0, s.totalParticipants - 1) }
                        : s
                )
            );
            queryClient.setQueryData(['appliedSeminars'], (prev = []) =>
                prev.filter((id) => id !== seminarId)
            );
            showCustomAlert('Application cancelled.', 'success');
        },
        onError: (err) => {
            if (err.message === 'Login First') {
                alert('Login First');
                navigate('/login');
            } else {
                showCustomAlert(err.message, 'error');
            }
        },
    });

    function truncate(str, n) {
        return str?.length > n ? str.slice(0, n - 1) + '…' : str;
    }

    function showCustomAlert(message, type = 'success') {
        const existing = document.getElementById('seminar-custom-alert');
        if (existing) existing.remove();
        const alertDiv = document.createElement('div');
        alertDiv.id = 'seminar-custom-alert';
        alertDiv.className = `fixed top-8 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 text-base font-semibold transition-all duration-300 ${
            type === 'success'
                ? 'bg-blue-700 text-white'
                : 'bg-red-600 text-white'
        }`;
        alertDiv.innerHTML = `
            <i class="fa-solid ${
                type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'
            }"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            alertDiv.style.transform += ' translateY(-20px)';
            setTimeout(() => alertDiv.remove(), 300);
        }, 2000);
    }

    const totalPages = Math.ceil(seminars.length / ITEMS_PER_PAGE);
    const paginatedPrograms = seminars.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const filterOptions = [
        { label: 'Title', value: 'Title', icon: 'fa-heading' },
        { label: 'Speaker', value: 'Speaker', icon: 'fa-user' },
        { label: 'Location', value: 'Location', icon: 'fa-location-dot' },
    ];

    const faIcons = {
        All: 'fa-solid fa-layer-group',
        Farming: 'fa-solid fa-wheat-awn',
        Planting: 'fa-solid fa-seedling',
        Fishing: 'fa-solid fa-water',
        Livestock: 'fa-solid fa-drumstick-bite',
    };

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const selectedSeminar = seminars.find(
        (program) => program.id === selectedSeminarId
    );

    
    return (
        <>
            <Navbar />
            <div
                className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative"
                style={{ overflow: 'hidden' }}
            >
                <main className="flex-1 w-full relative z-10 mt-30">
                    <section className="w-full px-2 sm:px-4 flex flex-col items-center pt-20">
                        {/* Header */}
                        <header className="flex flex-col items-center mb-12">
                            <span className="uppercase tracking-widest text-blue-400 text-xs font-semibold mb-1 letter-spacing-wide">
                                Welcome to
                            </span>
                            <h1
                                className="text-4xl xs:text-2xl sm:text-4xl md:text-5xl font-extrabold text-center eic-title"
                                style={{ color: '#1e3a8a' }}
                            >
                                Seminar Enrollment
                            </h1>
                            <div className="mt-4 w-24 h-2 rounded-full bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 opacity-90 shadow-lg"></div>
                        </header>
                        {/* NEW: Button to open user's registered seminars modal */}
                        <div className="w-full flex justify-end max-w-4xl mb-4">
                            <button
                                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold shadow hover:from-blue-800 hover:to-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onClick={() => setShowUserSeminarsModal(true)}
                            >
                                <i className="fa-solid fa-list-check"></i>
                                My Registered Seminars
                            </button>
                        </div>
                        {/* Search and Filter */}
                        <div className="flex flex-col w-full max-w-4xl mt-4 mb-10 gap-4">
                            <div className="flex flex-wrap gap-4 justify-center">
                                {/* Search Bar */}
                                <div className="flex-1 min-w-[300px] bg-white/80 rounded-2xl shadow-xl px-5 py-2 border border-blue-100 h-14 backdrop-blur-md">
                                    <div className="relative w-full h-full">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="w-full h-full pl-10 pr-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-200 text-blue-900 bg-transparent transition placeholder:text-blue-300 font-medium"
                                            placeholder={`Search by ${filterBy.toLowerCase()}...`}
                                            value={search}
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            style={{ boxShadow: 'none' }}
                                        />
                                    </div>
                                </div>
                                {/* Search Filter */}
                                <div className="relative h-14">
                                    <button
                                        className="flex items-center gap-2 px-5 py-2 h-14 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-bold border border-blue-200 shadow-lg transition-all duration-200 hover:bg-blue-50 focus:outline-none text-base"
                                        onClick={() => setShowFilter((f) => !f)}
                                        type="button"
                                        aria-label="Show filter options"
                                    >
                                        <i className="fa-solid fa-filter text-blue-700"></i>
                                        <span>Search by: {filterBy}</span>
                                        <i
                                            className={`fa-solid fa-chevron-${
                                                showFilter ? 'up' : 'down'
                                            } ml-2 text-blue-700`}
                                        ></i>
                                    </button>
                                    {showFilter && (
                                        <div className="absolute left-0 right-0 translate-y-2 mt-2 bg-white/90 rounded-2xl shadow-2xl border border-blue-100 z-20 animate-fade-in py-2 px-2 backdrop-blur-md">
                                            {filterOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-xl font-semibold transition text-base ${
                                                        filterBy === opt.value
                                                            ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow'
                                                            : 'text-blue-900 hover:bg-blue-50'
                                                    }`}
                                                    onClick={() => {
                                                        setFilterBy(opt.value);
                                                        setShowFilter(false);
                                                        setCurrentPage(1);
                                                    }}
                                                >
                                                    <i
                                                        className={`fa-solid ${opt.icon}`}
                                                    ></i>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Seminar Cards */}
                        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {isLoading ? (
                                <div className="col-span-full text-center text-blue-300 py-16 text-lg font-semibold tracking-wide">
                                    Loading...
                                </div>
                            ) : paginatedPrograms.length === 0 ? (
                                <div className="col-span-full text-center text-blue-300 py-16 text-lg font-semibold tracking-wide">
                                    No programs found.
                                </div>
                            ) : (
                                paginatedPrograms.map((program) => {
                                    const isApplied = appliedSeminars.includes(
                                        program.id
                                    );

                                    const truncatedDescription =
                                        program.description && program.description.length > 100
                                            ? program.description.slice(0, 100) + '...'
                                            : program.description;

                                    return (
                                        <div
                                            key={program.id}
                                            className="relative flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden group"
                                        >
                                            <div className="relative">
                                                <img
                                                    src={program.photo || default_seminar_pic}
                                                    alt={program.title}
                                                    className="w-full h-40 sm:h-48 object-cover transition-all duration-300 group-hover:scale-105"
                                                />
                                                <span
                                                    className={`absolute top-3 right-3 px-3 py-0.5 rounded-full text-xs font-semibold shadow-sm ${
                                                        program.status === 'Ongoing'
                                                            ? 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                                            : program.status === 'Completed'
                                                            ? 'bg-green-50 text-green-700 border border-green-100'
                                                            : program.status === 'Cancelled'
                                                            ? 'bg-red-50 text-red-600 border border-red-100'
                                                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                    }`}
                                                >
                                                    {program.status}
                                                </span>
                                            </div>
                                            <div className="flex-1 flex flex-col p-5">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                                                    {program.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-2 flex-1 cursor-default line-clamp-3">
                                                    {truncatedDescription}
                                                </p>
                                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
                                                    <span>
                                                        <span className="font-medium text-gray-700">
                                                            Speaker:
                                                        </span>{' '}
                                                        {program.speaker}
                                                    </span>
                                                    <span>
                                                        <span className="font-medium text-gray-700">
                                                            Location:
                                                        </span>{' '}
                                                        {program.location}
                                                    </span>
                                                    <span>
                                                        <span className="font-medium text-gray-700">
                                                            Participants:
                                                        </span>{' '}
                                                        {program.totalParticipants} / {program.capacity}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-2 mt-auto md:flex-row">
                                                    {isApplied ? (
                                                        <button
                                                            onClick={() =>
                                                                cancelMutation.mutate(
                                                                    program.id
                                                                )
                                                            }
                                                            className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                                                            disabled={
                                                                cancelMutation.isLoading
                                                            }
                                                        >
                                                            Cancel Application
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                applyMutation.mutate(
                                                                    program.id
                                                                )
                                                            }
                                                            className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                                                            disabled={
                                                                applyMutation.isLoading
                                                            }
                                                        >
                                                            Apply Now
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            setSelectedSeminarId(
                                                                program.id
                                                            )
                                                        }
                                                        className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 mb-2">
                                <nav
                                    className="flex items-center gap-1 bg-white rounded-lg shadow px-3 py-1.5"
                                    aria-label="Pagination"
                                >
                                    <button
                                        onClick={() =>
                                            setCurrentPage((p) => Math.max(1, p - 1))
                                        }
                                        disabled={currentPage === 1}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-gray-500 hover:bg-gray-200 hover:text-gray-700 ${
                                            currentPage === 1
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                        }`}
                                        aria-label="Previous"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M15 19l-7-7 7-7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                    {totalPages > 6 ? (
                                        <>
                                            <button
                                                onClick={() => setCurrentPage(1)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                                    currentPage === 1
                                                        ? 'bg-blue-500 text-white'
                                                        : 'text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                1
                                            </button>
                                            {currentPage > 3 && (
                                                <span className="px-1 text-gray-400">
                                                    ...
                                                </span>
                                            )}
                                            {Array.from({ length: 3 }, (_, i) => {
                                                const page = Math.max(
                                                    2,
                                                    Math.min(
                                                        currentPage - 1 + i,
                                                        totalPages - 2
                                                    )
                                                );
                                                if (page <= 1 || page >= totalPages)
                                                    return null;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                                            currentPage === page
                                                                ? 'bg-blue-500 text-white'
                                                                : 'text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                            {currentPage < totalPages - 2 && (
                                                <span className="px-1 text-gray-400">
                                                    ...
                                                </span>
                                            )}
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                                    currentPage === totalPages
                                                        ? 'bg-blue-500 text-white'
                                                        : 'text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    ) : (
                                        Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                                    currentPage === i + 1
                                                        ? 'bg-blue-500 text-white'
                                                        : 'text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))
                                    )}
                                    <button
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.min(totalPages, p + 1)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-gray-500 hover:bg-gray-200 hover:text-gray-700 ${
                                            currentPage === totalPages
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                        }`}
                                        aria-label="Next"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M9 5l7 7-7 7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        )}
                    </section>
                </main>
            </div>
            {selectedSeminar && (
                <SeminarDetails
                    seminar={selectedSeminar}
                    onClose={() => setSelectedSeminarId(null)}
                />
            )}
            {/* NEW: Modal for user's registered seminars */}
            {showUserSeminarsModal && (
                <UserSeminarsModal
                    seminars={userRegisteredSeminars}
                    isLoading={isUserSeminarsLoading}
                    onClose={() => setShowUserSeminarsModal(false)}
                />
            )}

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
                }
                `}
            </style>
        </>
    );
}

function SeminarDetails({ seminar, onClose }) {
    if (!seminar) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-100">
                    <p className="text-blue-700 font-semibold">Loading...</p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-6 py-2 bg-blue-100 text-blue-800 rounded-xl font-bold shadow hover:bg-blue-200 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden animate-fade-in max-h-[90vh] border-2 border-blue-200">
                {/* Seminar Image on Top, Large and Responsive */}
                <div className="w-full flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <img
                        src={seminar.photo}
                        alt={seminar.title}
                        className="object-contain w-full max-h-[350px] sm:max-h-[400px] md:max-h-[450px] rounded-t-3xl shadow-lg"
                        style={{ background: '#eff6ff' }}
                    />
                </div>
                {/* Seminar Details, Scrollable if needed */}
                <div
                    className="flex-1 p-10 flex flex-col relative overflow-y-auto"
                    style={{ maxHeight: 'calc(90vh - 350px)' }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 text-2xl focus:outline-none"
                        aria-label="Close"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <h2 className="text-3xl font-extrabold text-blue-900 mb-3 mt-2 tracking-tight">
                        {seminar.title}
                    </h2>
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm">
                            <i className="fa-solid fa-user"></i>
                            {seminar.speaker}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm">
                            <i className="fa-solid fa-location-dot"></i>
                            {seminar.location}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm">
                            <i className="fa-solid fa-layer-group"></i>
                            {seminar.category}
                        </span>
                        <span
                            className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg font-semibold border shadow-sm
                                ${
                                    seminar.totalParticipants >=
                                    seminar.capacity
                                        ? 'bg-red-100 text-red-900 border-red-200'
                                        : seminar.totalParticipants >=
                                          seminar.capacity * 0.8
                                        ? 'bg-yellow-100 text-yellow-900 border-yellow-200'
                                        : 'bg-green-100 text-green-900 border-green-200'
                                }`}
                            title="Current participants / Total capacity"
                        >
                            <i className="fa-solid fa-users"></i>
                            {seminar.totalParticipants} / {seminar.capacity}{' '}
                            Participants
                        </span>
                        <span
                            className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg font-semibold border shadow-sm
                                ${
                                    seminar.status === 'Completed'
                                        ? 'bg-gray-100 text-gray-900 border-gray-200'
                                        : seminar.status === 'Ongoing'
                                        ? 'bg-blue-100 text-blue-900 border-blue-200'
                                        : seminar.status === 'Cancelled'
                                        ? 'bg-red-100 text-red-900 border-red-200'
                                        : 'bg-green-100 text-green-900 border-green-200'
                                }`}
                        >
                            <i
                                className={`fa-solid ${
                                    seminar.status === 'Completed'
                                        ? 'fa-circle-check'
                                        : seminar.status === 'Ongoing'
                                        ? 'fa-circle-play'
                                        : seminar.status === 'Cancelled'
                                        ? 'fa-circle-xmark'
                                        : 'fa-clock'
                                }`}
                            ></i>
                            {seminar.status}
                        </span>
                    </div>
                    <div className="text-blue-800 text-base mb-8 whitespace-pre-line leading-relaxed font-medium">
                        {seminar.description}
                    </div>
                    <div className="flex justify-end mt-auto">
                        <button
                            onClick={onClose}
                            className="px-8 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold shadow hover:from-blue-800 hover:to-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// NEW: Modal to show user's registered seminars
function UserSeminarsModal({ seminars, isLoading, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden animate-fade-in max-h-[90vh] border-2 border-blue-200">
                <div className="flex items-center justify-between px-8 py-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
                    <h2 className="text-2xl font-extrabold text-blue-900">
                        Registered Seminars
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-blue-400 hover:text-blue-700 text-2xl focus:outline-none"
                        aria-label="Close"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {isLoading ? (
                        <div className="text-blue-400 text-center py-8 font-semibold">
                            Loading...
                        </div>
                    ) : seminars.length === 0 ? (
                        <div className="text-blue-400 text-center py-8 font-semibold">
                            No registered seminars found.
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-6">
                            {seminars.map((seminar) => (
                                <li
                                    key={seminar.id}
                                    className="bg-blue-50 rounded-xl p-5 shadow border border-blue-100"
                                >
                                    <div className="flex flex-col gap-2">
                                        <span className="font-bold text-blue-900 text-lg">
                                            {seminar.title}
                                        </span>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            <span className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm">
                                                <i className="fa-solid fa-user"></i>
                                                {seminar.speaker}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm">
                                                <i className="fa-solid fa-location-dot"></i>
                                                {seminar.location}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm">
                                                <i className="fa-solid fa-clock"></i>
                                                {new Date(
                                                    seminar.start_date
                                                ).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}{' '}
                                                {new Date(
                                                    `2000-01-01T${seminar.start_time}`
                                                ).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true,
                                                })}{' '}
                                                -{' '}
                                                {new Date(
                                                    seminar.end_date
                                                ).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}{' '}
                                                {new Date(
                                                    `2000-01-01T${seminar.end_time}`
                                                ).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true,
                                                })}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm">
                                                <i className="fa-solid fa-users"></i>
                                                Capacity: {seminar.capacity}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm">
                                                <i className="fa-solid fa-calendar-day"></i>
                                                Registration Deadline:{' '}
                                                {new Date(
                                                    seminar.registration_deadline
                                                ).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true,
                                                })}
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg font-semibold border shadow-sm
                                                ${
                                                    seminar.status ===
                                                    'Completed'
                                                        ? 'bg-gray-100 text-gray-900 border-gray-200'
                                                        : seminar.status ===
                                                          'Ongoing'
                                                        ? 'bg-blue-100 text-blue-900 border-blue-200'
                                                        : seminar.status ===
                                                          'Cancelled'
                                                        ? 'bg-red-100 text-red-900 border-red-200'
                                                        : 'bg-green-100 text-green-900 border-green-200'
                                                }`}
                                            >
                                                <i
                                                    className={`fa-solid ${
                                                        seminar.status ===
                                                        'Completed'
                                                            ? 'fa-circle-check'
                                                            : seminar.status ===
                                                              'Ongoing'
                                                            ? 'fa-circle-play'
                                                            : seminar.status ===
                                                              'Cancelled'
                                                            ? 'fa-circle-xmark'
                                                            : 'fa-clock'
                                                    }`}
                                                ></i>
                                                {seminar.status}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="flex justify-end px-8 py-4 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
                    <button
                        onClick={onClose}
                        className="px-8 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold shadow hover:from-blue-800 hover:to-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
