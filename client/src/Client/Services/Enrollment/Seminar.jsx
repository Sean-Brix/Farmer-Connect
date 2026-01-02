import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../../contexts/ThemeContext';
import { ProgramListSkeleton, FilterBarSkeleton } from '../../../Components/Skeletons/ServiceSkeletons';
import { createSeminarTutorial } from './seminarTour';
import './seminarTour.css';

// SUB COMPONENT
import Navbar from '../../Components/Navbar';
import default_seminar_pic from './Assets/default_seminar_pic.webp';

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

// Cache auth status to avoid repeated checks
let cachedAuthStatus = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

const fetchAppliedSeminars = async () => {
    const now = Date.now();
    
    // Use cached auth status if available and fresh
    if (cachedAuthStatus !== null && (now - cacheTimestamp) < CACHE_DURATION) {
        if (!cachedAuthStatus) return [];
    } else {
        // Fetch and cache auth status
        try {
            const userRes = await fetch('/auth/is-authenticated');
            const user = await userRes.json();
            cachedAuthStatus = user.check || false;
            cacheTimestamp = now;
        } catch (err) {
            cachedAuthStatus = false;
            cacheTimestamp = now;
        }
        
        if (!cachedAuthStatus) return [];
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
    const now = Date.now();
    
    // Use cached auth status
    if (cachedAuthStatus === null || (now - cacheTimestamp) >= CACHE_DURATION) {
        try {
            const userRes = await fetch('/auth/is-authenticated');
            const user = await userRes.json();
            cachedAuthStatus = user.check || false;
            cacheTimestamp = now;
        } catch (err) {
            cachedAuthStatus = false;
            cacheTimestamp = now;
        }
    }
    
    if (!cachedAuthStatus) return [];

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
    const now = Date.now();
    
    // Use cached auth status
    if (cachedAuthStatus === null || (now - cacheTimestamp) >= CACHE_DURATION) {
        try {
            const userRes = await fetch('/auth/is-authenticated');
            const user = await userRes.json();
            cachedAuthStatus = user.check || false;
            cacheTimestamp = now;
        } catch (err) {
            cachedAuthStatus = false;
            cacheTimestamp = now;
        }
    }
    
    if (!cachedAuthStatus) throw new Error('Login First');

    const res = await fetch(`/api/seminar/participants/apply/${seminarId}`, {
        method: 'POST',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to apply, Try again later');

    return seminarId;
};

const cancelSeminar = async (seminarId) => {
    const now = Date.now();
    
    // Use cached auth status
    if (cachedAuthStatus === null || (now - cacheTimestamp) >= CACHE_DURATION) {
        try {
            const userRes = await fetch('/auth/is-authenticated');
            const user = await userRes.json();
            cachedAuthStatus = user.check || false;
            cacheTimestamp = now;
        } catch (err) {
            cachedAuthStatus = false;
            cacheTimestamp = now;
        }
    }
    
    if (!cachedAuthStatus) throw new Error('Login First');

    const res = await fetch(`/api/seminar/participants/cancel/${seminarId}`, {
        method: 'POST',
    });

    if (!res.ok) throw new Error('Unable to Cancel application, Try again later');
    return seminarId;
};

export default function Seminar() {
    const { theme, isDark } = useTheme();
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

    // Shepherd tutorial
    const [tutorial, setTutorial] = useState(null);
    const [isTutorialActive, setIsTutorialActive] = useState(false);

    useEffect(() => {        const tutorialInstance = createSeminarTutorial();
        setTutorial(tutorialInstance);
        
        return () => {
            if (tutorialInstance) {
                tutorialInstance.complete();
            }
        };
    }, []);

    const startTutorial = () => {
        if (tutorial) {
            setIsTutorialActive(true);
            tutorial.start();
            
            // Clean up when tutorial ends
            tutorial.on('complete', () => {
                setIsTutorialActive(false);
                setShowUserSeminarsModal(false);
            });
            
            tutorial.on('cancel', () => {
                setIsTutorialActive(false);
                setShowUserSeminarsModal(false);
            });
        }
    };

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

    // Create temporary demo data for tutorial if user has no registered seminars
    const demoSeminar = {
        id: 'demo-001',
        title: 'Introduction to Modern Farming Techniques',
        description: 'Learn about the latest agricultural practices and technologies.',
        speaker: 'Dr. Maria Santos',
        location: 'Agricultural Training Center',
        schedule: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        duration: '3 hours',
        status: 'Upcoming',
        totalParticipants: 45,
        capacity: 50,
        participantStatus: 'Approved',
        photo: default_seminar_pic
    };

    // Use demo data during tutorial if no real registrations exist
    const displaySeminars = isTutorialActive && userRegisteredSeminars.length === 0 
        ? [demoSeminar] 
        : userRegisteredSeminars;

    
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
                className={`flex min-h-screen relative ${isDark ? 'bg-gray-900' : 'bg-white'}`}
                style={{ overflow: 'hidden' }}
            >
                <main className="flex-1 w-full relative z-10 mt-30 ">
                    <section className="w-full px-2 sm:px-4 flex flex-col items-center pt-[8vh] ">
                        {/* Header */}
                        <header className="flex flex-col items-center mb-12 w-full relative">
                            <span className={`uppercase tracking-widest text-xs font-semibold mb-1 letter-spacing-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Welcome to
                            </span>
                            <h1
                                className={`text-4xl xs:text-2xl sm:text-4xl md:text-5xl font-extrabold text-center eic-title ${isDark ? 'text-white' : 'text-gray-800'}`}
                                
                            >
                                Seminar Enrollment
                            </h1>
                            <div className={`mt-4 w-24 h-2 rounded-full shadow-lg ${isDark ? 'bg-green-400' : 'bg-green-500'}`}></div>
                        </header>
                        {/* Modernized: My Registered Seminars Button & Search/Filter Bar */}
                        <div className="w-full max-w-5xl mb-8 mx-auto">
                            {/* My Registered Seminars Button - Top Right on Desktop, Top on Mobile */}
                            <div className="w-full flex justify-end mb-3">
                                <button
                                    data-tutorial="my-seminars-btn"
                                    className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                                    onClick={() => setShowUserSeminarsModal(true)}
                                >
                                    <i className="fa-solid fa-list-check text-base sm:text-lg"></i>
                                    <span className="hidden sm:inline">My Registered Seminars</span>
                                    <span className="sm:hidden">My Seminars</span>
                                </button>
                            </div>
                            
                            {/* Search and Filter Section */}
                            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:justify-between">
                                {/* Search Bar with Help Icon */}
                                <div className="relative flex-1 sm:max-w-md flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            data-tutorial="search-input"
                                            type="text"
                                            className={`w-full px-10 py-2.5 rounded-lg border-2 focus:ring-2 shadow-sm transition font-medium text-sm sm:text-base ${isDark ? 'border-gray-600 bg-gray-800 text-gray-100 focus:border-green-400 focus:ring-green-600 placeholder:text-gray-400' : 'border-gray-300 bg-white text-gray-800 focus:border-green-500 focus:ring-green-200 placeholder:text-gray-500'}`}
                                            placeholder={`Search by ${filterBy.toLowerCase()}...`}
                                            value={search}
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                        </span>
                                    </div>
                                    {/* Help Button - Beside Search */}
                                    <button
                                        onClick={startTutorial}
                                        className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                                            isDark 
                                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-300 border-gray-600' 
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 border-gray-300'
                                        }`}
                                        title="Need Help?"
                                        aria-label="Start tutorial"
                                    >
                                        <i className="fa-solid fa-circle-question text-base"></i>
                                    </button>
                                </div>
                                
                                {/* Filter Dropdown */}
                                <div className="relative flex-shrink-0 w-auto sm:w-auto sm:ml-auto">
                                    <button
                                        data-tutorial="filter-btn"
                                        className={`w-auto sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-4 py-2.5 rounded-lg font-semibold border-2 shadow-sm hover:shadow-md transition focus:outline-none text-sm sm:text-base ${
                                            isDark 
                                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600' 
                                                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                                        }`}
                                        onClick={() => setShowFilter((f) => !f)}
                                        type="button"
                                        aria-label="Show filter options"
                                    >
                                        <div className="flex items-center gap-2">
                                            <i className="fa-solid fa-filter"></i>
                                            <span>Search by: {filterBy}</span>
                                        </div>
                                        <i className={`fa-solid fa-chevron-${showFilter ? 'up' : 'down'} ml-1`}></i>
                                    </button>
                                    {showFilter && (
                                        <div className={`absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 sm:w-56 rounded-lg shadow-xl border-2 z-20 animate-fade-in py-2 ${
                                            isDark 
                                                ? 'bg-gray-800 border-gray-600' 
                                                : 'bg-white border-gray-200'
                                        }`}>
                                            {filterOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg font-medium transition text-sm sm:text-base ${
                                                        filterBy === opt.value
                                                            ? 'bg-green-600 text-white shadow'
                                                            : isDark 
                                                                ? 'text-gray-200 hover:bg-gray-700' 
                                                                : 'text-gray-800 hover:bg-gray-100'
                                                    }`}
                                                    onClick={() => {
                                                        setFilterBy(opt.value);
                                                        setShowFilter(false);
                                                        setCurrentPage(1);
                                                    }}
                                                >
                                                    <i className={`fa-solid ${opt.icon}`}></i>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Seminar Cards */}
                        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
                            {isLoading ? (
                                <div className="col-span-full">
                                    <ProgramListSkeleton count={6} />
                                </div>
                            ) : paginatedPrograms.length === 0 ? (
                                <div className={`col-span-full text-center py-16 text-lg font-semibold tracking-wide ${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
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
                                            data-tutorial={paginatedPrograms.indexOf(program) === 0 ? "seminar-card" : undefined}
                                            className={`relative flex flex-col border-2 hover:border-green-300 rounded-lg shadow-lg hover:shadow-xl transition-all overflow-hidden group w-full max-w-md mx-auto ${
                                                isDark 
                                                    ? 'bg-gray-800 border-gray-700' 
                                                    : 'bg-white border-gray-200'
                                            }`}
                                            style={{ minWidth: 0 }}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={program.photo || default_seminar_pic}
                                                    alt={program.title}
                                                    className="w-full h-40 sm:h-48 object-cover transition-all duration-300 group-hover:scale-105"
                                                    style={{ minWidth: 0 }}
                                                />
                                                <span
                                                    className={`absolute top-3 right-3 px-3 py-0.5 rounded-full text-xs font-semibold shadow-sm ${
                                                        program.status === 'Ongoing'
                                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                                            : program.status === 'Completed'
                                                            ? 'bg-gray-100 text-gray-800 border border-gray-200'
                                                            : program.status === 'Cancelled'
                                                            ? 'bg-red-50 text-red-600 border border-red-100'
                                                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                    }`}
                                                >
                                                    {program.status}
                                                </span>
                                            </div>
                                                <div className="flex-1 flex flex-col p-5">
                                                <h3 className={`text-lg font-semibold mb-1 truncate ${
                                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                                }`}>
                                                    {program.title}
                                                </h3>
                                                <p className={`text-sm mb-2 flex-1 cursor-default line-clamp-3 ${
                                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                    {truncatedDescription}
                                                </p>
                                                <div className={`flex flex-wrap gap-x-3 gap-y-1 text-xs mb-3 ${
                                                    isDark ? 'text-gray-500' : 'text-gray-500'
                                                }`}>
                                                    <span>
                                                        <span className={`font-medium ${
                                                            isDark ? 'text-gray-400' : 'text-gray-700'
                                                        }`}>
                                                            Speaker:
                                                        </span>{' '}
                                                        {program.speaker}
                                                    </span>
                                                    <span>
                                                        <span className={`font-medium ${
                                                            isDark ? 'text-gray-400' : 'text-gray-700'
                                                        }`}>
                                                            Location:
                                                        </span>{' '}
                                                        {program.location}
                                                    </span>
                                                    <span>
                                                        <span className={`font-medium ${
                                                            isDark ? 'text-gray-400' : 'text-gray-700'
                                                        }`}>
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
                                                            data-tutorial={paginatedPrograms.indexOf(program) === 0 ? "enroll-btn" : undefined}
                                                            onClick={() =>
                                                                applyMutation.mutate(
                                                                    program.id
                                                                )
                                                            }
                                                            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md border border-green-600 hover:border-green-700"
                                                            disabled={
                                                                applyMutation.isLoading
                                                            }
                                                        >
                                                            Apply Now
                                                        </button>
                                                    )}
                                                    <button
                                                        data-tutorial={paginatedPrograms.indexOf(program) === 0 ? "view-details-btn" : undefined}
                                                        onClick={() =>
                                                            setSelectedSeminarId(
                                                                program.id
                                                            )
                                                        }
                                                        className="w-full md:w-auto bg-gray-600 hover:bg-gray-700 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md border border-gray-600 hover:border-gray-700"
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
                            <div className="flex justify-center mt-6 mb-2" data-tutorial="pagination">
                                <nav
                                    className={`flex items-center gap-1 rounded-lg shadow-md border-2 px-3 py-1.5 ${
                                        isDark 
                                            ? 'bg-gray-800 border-gray-600' 
                                            : 'bg-white border-gray-200'
                                    }`}
                                    aria-label="Pagination"
                                >
                                    <button
                                        onClick={() =>
                                            setCurrentPage((p) => Math.max(1, p - 1))
                                        }
                                        disabled={currentPage === 1}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                                            currentPage === 1
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                        } ${
                                            isDark 
                                                ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' 
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
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
                                                        ? 'bg-green-600 text-white shadow-md'
                                                        : isDark 
                                                            ? 'text-gray-300 hover:bg-gray-700' 
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                1
                                            </button>
                                            {currentPage > 3 && (
                                                <span className={isDark ? 'px-1 text-gray-500' : 'px-1 text-gray-400'}>
                                                    ...
                                                </span>
                                            )}
                                            {(() => {
                                                const start = Math.max(2, currentPage - 1);
                                                const end = Math.min(totalPages - 1, currentPage + 1);
                                                const pages = [];
                                                for (let i = start; i <= end; i++) {
                                                    if (i > 1 && i < totalPages) {
                                                        pages.push(i);
                                                    }
                                                }
                                                return pages.map(page => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                                            currentPage === page
                                                                ? 'bg-green-600 text-white shadow-md'
                                                                : isDark 
                                                                    ? 'text-gray-300 hover:bg-gray-700' 
                                                                    : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ));
                                            })()}
                                            {currentPage < totalPages - 2 && (
                                                <span className={isDark ? 'px-1 text-gray-500' : 'px-1 text-gray-400'}>
                                                    ...
                                                </span>
                                            )}
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                                    currentPage === totalPages
                                                        ? 'bg-green-600 text-white shadow-md'
                                                        : isDark 
                                                            ? 'text-gray-300 hover:bg-gray-700' 
                                                            : 'text-gray-700 hover:bg-gray-100'
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
                                                        ? 'bg-green-600 text-white shadow-md'
                                                        : isDark 
                                                            ? 'text-gray-300 hover:bg-gray-700' 
                                                            : 'text-gray-700 hover:bg-gray-100'
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
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                                            currentPage === totalPages
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                        } ${
                                            isDark 
                                                ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' 
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
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
                    seminars={displaySeminars}
                    isLoading={isUserSeminarsLoading}
                    onClose={() => setShowUserSeminarsModal(false)}
                    isTutorialActive={isTutorialActive}
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
                  html, body, #root {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
                    display: none;
                }
              
                `}
            </style>
        </>
    );
}

function SeminarDetails({ seminar, onClose }) {
    const { isDark } = useTheme();
    
    if (!seminar) {
        return (
            <div className="fixed top-16 left-0 right-0 bottom-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
                <div className={`p-8 rounded-2xl shadow-xl border max-w-md w-full ${
                    isDark 
                        ? 'bg-gray-800 border-gray-600' 
                        : 'bg-white border-gray-200'
                }`}>
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                    <p className={`font-semibold text-center mb-6 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Loading seminar details...</p>
                    <button
                        onClick={onClose}
                        className={`w-full px-6 py-3 rounded-xl font-semibold transition-colors duration-200 ${
                            isDark 
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed top-16 left-0 right-0 bottom-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
            <div className={`relative rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden animate-fade-in border ${
                isDark 
                    ? 'bg-gray-800 border-gray-600' 
                    : 'bg-white border-gray-200'
            }`}>
                {/* Header with Close Button */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-graduation-cap text-white text-lg"></i>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Seminar Details</h2>
                            <p className="text-sm text-white/90">Complete information & enrollment</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white hover:text-white transition-all duration-200 group"
                        aria-label="Close"
                    >
                        <i className="fa-solid fa-xmark text-lg group-hover:rotate-90 transition-transform duration-200"></i>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
                    {/* Main Content Layout */}
                    <div className="p-6 sm:p-8">
                        {/* Title Section */}
                        <div className="text-center mb-8">
                            <h3 className={`text-2xl sm:text-3xl font-bold mb-3 leading-tight ${
                                isDark ? 'text-gray-200' : 'text-gray-900'
                            }`}>
                                {seminar.title}
                            </h3>
                            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full"></div>
                        </div>

                        {/* Image and Description Side by Side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Image Section */}
                            <div className="relative">
                                <div className="relative overflow-hidden rounded-xl border shadow-lg">
                                    <img
                                        src={seminar.photo}
                                        alt={seminar.title}
                                        className="w-full h-64 sm:h-72 lg:h-80 object-cover"
                                        style={{ background: 'linear-gradient(45deg, #f3f4f6, #e5e7eb)' }}
                                    />
                                    {/* Status Badge on Image */}
                                    <div className="absolute top-4 right-4">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg ${
                                            seminar.status === 'Ongoing'
                                                ? 'bg-green-500 text-white'
                                                : seminar.status === 'Completed'
                                                ? 'bg-gray-500 text-white'
                                                : seminar.status === 'Cancelled'
                                                ? 'bg-red-500 text-white'
                                                : 'bg-blue-500 text-white'
                                        }`}>
                                            <i className={`fa-solid ${
                                                seminar.status === 'Ongoing' ? 'fa-circle-play' :
                                                seminar.status === 'Completed' ? 'fa-circle-check' :
                                                seminar.status === 'Cancelled' ? 'fa-circle-xmark' : 'fa-clock'
                                            }`}></i>
                                            {seminar.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="space-y-6">
                                <div className={`rounded-xl p-6 border ${
                                    isDark 
                                        ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' 
                                        : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
                                }`}>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                                            <i className="fa-solid fa-file-text text-white text-sm"></i>
                                        </div>
                                        <h4 className={`text-lg font-bold ${
                                            isDark ? 'text-gray-200' : 'text-gray-900'
                                        }`}>About This Seminar</h4>
                                    </div>
                                    <div className={`leading-relaxed whitespace-pre-line text-sm sm:text-base ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        {seminar.description}
                                    </div>
                                </div>

                                {/* Quick Info Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className={`rounded-lg p-4 border ${
                                        isDark 
                                            ? 'bg-gray-700 border-gray-600' 
                                            : 'bg-blue-50 border-blue-200'
                                    }`}>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                                <i className="fa-solid fa-user-tie text-white"></i>
                                            </div>
                                            <div>
                                                <p className={`text-xs font-semibold uppercase tracking-wider ${
                                                    isDark ? 'text-blue-400' : 'text-blue-700'
                                                }`}>Speaker</p>
                                                <p className={`text-sm font-bold ${
                                                    isDark ? 'text-gray-300' : 'text-gray-900'
                                                }`}>{seminar.speaker}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`rounded-lg p-4 border ${
                                        isDark 
                                            ? 'bg-gray-700 border-gray-600' 
                                            : 'bg-purple-50 border-purple-200'
                                    }`}>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                                <i className="fa-solid fa-location-dot text-white"></i>
                                            </div>
                                            <div>
                                                <p className={`text-xs font-semibold uppercase tracking-wider ${
                                                    isDark ? 'text-purple-400' : 'text-purple-700'
                                                }`}>Location</p>
                                                <p className={`text-sm font-bold ${
                                                    isDark ? 'text-gray-300' : 'text-gray-900'
                                                }`}>{seminar.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className={`rounded-lg p-4 border ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600' 
                                    : 'bg-green-50 border-green-200'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <i className="fa-solid fa-layer-group text-white"></i>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold uppercase tracking-wider ${
                                            isDark ? 'text-green-400' : 'text-green-700'
                                        }`}>Category</p>
                                        <p className={`text-sm font-bold ${
                                            isDark ? 'text-gray-300' : 'text-gray-900'
                                        }`}>{seminar.category}</p>
                                    </div>
                                </div>
                            </div>

                            <div className={`rounded-lg p-4 border ${
                                seminar.totalParticipants >= seminar.capacity
                                    ? isDark 
                                        ? 'bg-red-900/50 border-red-700'
                                        : 'bg-red-50 border-red-200'
                                    : seminar.totalParticipants >= seminar.capacity * 0.8
                                    ? isDark 
                                        ? 'bg-yellow-900/50 border-yellow-700'
                                        : 'bg-yellow-50 border-yellow-200'
                                    : isDark 
                                        ? 'bg-emerald-900/50 border-emerald-700'
                                        : 'bg-emerald-50 border-emerald-200'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        seminar.totalParticipants >= seminar.capacity
                                            ? 'bg-red-500'
                                            : seminar.totalParticipants >= seminar.capacity * 0.8
                                            ? 'bg-yellow-500'
                                            : 'bg-emerald-500'
                                    }`}>
                                        <i className="fa-solid fa-users text-white"></i>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold uppercase tracking-wider ${
                                            seminar.totalParticipants >= seminar.capacity
                                                ? isDark ? 'text-red-400' : 'text-red-700'
                                                : seminar.totalParticipants >= seminar.capacity * 0.8
                                                ? isDark ? 'text-yellow-400' : 'text-yellow-700'
                                                : isDark ? 'text-emerald-400' : 'text-emerald-700'
                                        }`}>Capacity</p>
                                        <p className={`text-sm font-bold ${
                                            isDark ? 'text-gray-300' : 'text-gray-900'
                                        }`}>
                                            {seminar.totalParticipants} / {seminar.capacity}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={`flex flex-col sm:flex-row gap-4 pt-6 border-t ${
                            isDark ? 'border-gray-600' : 'border-gray-200'
                        }`}>
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                <span>Back to Seminars</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// NEW: Modal to show user's registered seminars
function UserSeminarsModal({ seminars, isLoading, onClose, isTutorialActive = false }) {
    const { isDark } = useTheme();
    const [currentModalPage, setCurrentModalPage] = useState(1);
    const MODAL_ITEMS_PER_PAGE = 3;

    const totalModalPages = Math.ceil(seminars.length / MODAL_ITEMS_PER_PAGE);
    const paginatedModalSeminars = seminars.slice(
        (currentModalPage - 1) * MODAL_ITEMS_PER_PAGE,
        currentModalPage * MODAL_ITEMS_PER_PAGE
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 pt-24 sm:pt-20 md:pt-16 lg:pt-20 px-2 sm:px-4 md:px-6">
            <div className={`relative rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col overflow-hidden max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-6rem)] md:max-h-[calc(100vh-5rem)] lg:max-h-[85vh] border-2 mt-8 sm:mt-6 md:mt-4 ${
                isDark 
                    ? 'bg-gray-800 border-gray-600' 
                    : 'bg-white border-gray-300'
            }`}>
                {/* Header */}
                <div className={`flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b-2 bg-green-600 ${
                    isDark ? 'border-gray-600' : 'border-gray-200'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <i className="fa-solid fa-calendar-check text-white"></i>
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-white">My Registered Seminars</h2>
                            <p className="text-sm text-white/90">
                                {seminars.length} {seminars.length === 1 ? 'seminar' : 'seminars'} enrolled
                            </p>
                        </div>
                    </div>
                    <button
                        data-tutorial="close-modal"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white hover:text-white/80 transition-colors"
                        aria-label="Close"
                    >
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                            <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading your seminars...</p>
                        </div>
                    ) : seminars.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                                isDark ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                                <i className="fa-solid fa-calendar-xmark text-2xl text-gray-400"></i>
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${
                                isDark ? 'text-gray-200' : 'text-gray-900'
                            }`}>No seminars registered</h3>
                            <p className={`text-center max-w-md ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                You haven't registered for any seminars yet. Browse available seminars and start learning!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {paginatedModalSeminars.map((seminar, index) => (
                                <div
                                    key={seminar.id}
                                    className={`border rounded-xl p-6 hover:shadow-md transition-shadow duration-200 ${
                                        isDark 
                                            ? 'bg-gray-700 border-gray-600' 
                                            : 'bg-white border-gray-200'
                                    }`}
                                >
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Seminar Image */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={`/api/seminar/picture/${seminar.id}`}
                                                alt={seminar.title}
                                                className={`w-full lg:w-32 h-32 lg:h-24 object-cover rounded-lg border ${
                                                    isDark ? 'border-gray-600' : 'border-gray-200'
                                                }`}
                                                onError={(e) => {
                                                    e.target.src = default_seminar_pic;
                                                }}
                                            />
                                        </div>

                                        {/* Seminar Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`text-lg font-bold mb-2 truncate ${
                                                        isDark ? 'text-gray-200' : 'text-gray-900'
                                                    }`}>
                                                        {seminar.title}
                                                    </h3>
                                                    <p className={`text-sm leading-relaxed line-clamp-2 ${
                                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                                    }`}>
                                                        {seminar.description}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                                            seminar.status === 'Completed'
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : seminar.status === 'Ongoing'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : seminar.status === 'Cancelled'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-amber-100 text-amber-800'
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
                                            </div>

                                            {/* Meta Information Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <i className="fa-solid fa-user-tie text-gray-400 w-4"></i>
                                                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Speaker:</span>
                                                    <span className={`font-medium truncate ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{seminar.speaker}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <i className="fa-solid fa-location-dot text-gray-400 w-4"></i>
                                                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Location:</span>
                                                    <span className={`font-medium truncate ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{seminar.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <i className="fa-solid fa-users text-gray-400 w-4"></i>
                                                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Capacity:</span>
                                                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{seminar.capacity}</span>
                                                </div>
                                                <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-3">
                                                    <i className="fa-solid fa-calendar-days text-gray-400 w-4"></i>
                                                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Schedule:</span>
                                                    <span className={`font-medium truncate ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                                                        {new Date(seminar.start_date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}{' '}
                                                        at{' '}
                                                        {new Date(`2000-01-01T${seminar.start_time}`).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true,
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-3">
                                                    <i className="fa-solid fa-clock text-gray-400 w-4"></i>
                                                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Registration Deadline:</span>
                                                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                                                        {new Date(seminar.registration_deadline).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true,
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer with Pagination */}
                {!isLoading && seminars.length > 0 && (
                    <div className={`border-t px-6 py-4 ${
                        isDark 
                            ? 'border-gray-600 bg-gray-700' 
                            : 'border-gray-200 bg-gray-50'
                    }`}>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                Showing {((currentModalPage - 1) * MODAL_ITEMS_PER_PAGE) + 1} to{' '}
                                {Math.min(currentModalPage * MODAL_ITEMS_PER_PAGE, seminars.length)} of{' '}
                                {seminars.length} seminars
                            </div>
                            
                            {totalModalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentModalPage(p => Math.max(1, p - 1))}
                                        disabled={currentModalPage === 1}
                                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                            isDark 
                                                ? 'border-gray-600 text-gray-300 hover:bg-gray-600' 
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <i className="fa-solid fa-chevron-left"></i>
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalModalPages }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentModalPage(i + 1)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                    currentModalPage === i + 1
                                                        ? 'bg-green-600 text-white'
                                                        : isDark 
                                                            ? 'text-gray-300 hover:bg-gray-600' 
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentModalPage(p => Math.min(totalModalPages, p + 1))}
                                        disabled={currentModalPage === totalModalPages}
                                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                            isDark 
                                                ? 'border-gray-600 text-gray-300 hover:bg-gray-600' 
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
