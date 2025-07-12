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
    const userRes = await fetch('/auth/is-authenticated');
    const user = await userRes.json();
    if (!user.check) return [];
    const res = await fetch(`/api/seminars/participants/user_applied`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.payload) ? data.payload.map((s) => s.id) : [];
};

const applySeminar = async (seminarId) => {
    console.log("hello");
    const userRes = await fetch('/auth/is-authenticated');
    const user = await userRes.json();

    console.log(user)

    if (!user.check) throw new Error('Login First');
    if (user.payload.access !== 'User') throw new Error('Unauthorized');

    const res = await fetch(`/api/seminar/participants/apply/${seminarId}`, {
        method: 'POST'
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to apply');

    return seminarId;
};

const cancelSeminar = async (seminarId) => {
    const check = await fetch('/api/authentication/gotToken');
    if (!check.ok) throw new Error('Login First');
    const res = await fetch('/api/seminars/participants/user_cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: seminarId }),
    });
    if (!res.ok) throw new Error('Unable to cancel application');
    return seminarId;
};

export default function Seminar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterBy, setFilterBy] = useState('Title');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedSeminarId, setSelectedSeminarId] = useState(null);

    // Pagination
    const ITEMS_PER_PAGE = 5;
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

    const applyMutation = useMutation({
        mutationFn: applySeminar,
        onSuccess: (seminarId) => {
            queryClient.setQueryData(['appliedSeminars'], (prev = []) => [...prev, seminarId]);
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
            queryClient.setQueryData(['appliedSeminars'], (prev = []) => prev.filter((id) => id !== seminarId));
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

    // Helper to truncate description
    function truncate(str, n) {
        return str?.length > n ? str.slice(0, n - 1) + '…' : str;
    }

    // Custom alert
    function showCustomAlert(message, type = 'success') {
        const existing = document.getElementById('seminar-custom-alert');
        if (existing) existing.remove();
        const alertDiv = document.createElement('div');
        alertDiv.id = 'seminar-custom-alert';
        alertDiv.className = `fixed top-8 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 text-base font-semibold transition-all duration-300 ${
            type === 'success' ? 'bg-blue-700 text-white' : 'bg-red-600 text-white'
        }`;
        alertDiv.innerHTML = `
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            alertDiv.style.transform += ' translateY(-20px)';
            setTimeout(() => alertDiv.remove(), 300);
        }, 2000);
    }

    // Pagination logic
    const totalPages = Math.ceil(seminars.length / ITEMS_PER_PAGE);
    const paginatedPrograms = seminars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Filter options
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

    // Scroll to top when page changes
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const selectedSeminar = seminars.find((program) => program.id === selectedSeminarId);

    return (
        <>
            <Navbar />
            <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative" style={{ overflow: 'hidden' }}>
                <main className="flex-1 w-full relative z-10 mt-30">
                    <section className="w-full px-2 sm:px-4 flex flex-col items-center pt-20">
                        {/* Header */}
                        <header className="flex flex-col items-center mb-12">
                            <span className="uppercase tracking-widest text-blue-400 text-xs font-semibold mb-1 letter-spacing-wide">
                                Welcome to
                            </span>
                            <h1 className="text-4xl xs:text-2xl sm:text-4xl md:text-5xl font-extrabold text-center eic-title" style={{ color: '#1e3a8a' }}>
                                Seminar Enrollment
                            </h1>
                            <div className="mt-4 w-24 h-2 rounded-full bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 opacity-90 shadow-lg"></div>
                        </header>
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
                                        <i className={`fa-solid fa-chevron-${showFilter ? 'up' : 'down'} ml-2 text-blue-700`}></i>
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
                        <div className="flex flex-col gap-10 w-full max-w-4xl mt-6">
                            {isLoading ? (
                                <div className="text-blue-300 text-center py-16 text-lg font-semibold tracking-wide">
                                    Loading...
                                </div>
                            ) : paginatedPrograms.length === 0 ? (
                                <div className="text-blue-300 text-center py-16 text-lg font-semibold tracking-wide">
                                    No programs found.
                                </div>
                            ) : (
                                paginatedPrograms.map((program) => {
                                    const isApplied = appliedSeminars.includes(program.id);
                                    return (
                                        <article
                                            key={program.id}
                                            className="relative flex flex-col md:flex-row gap-8 bg-white/90 rounded-3xl shadow-2xl border-2 border-blue-100 overflow-hidden group transition-transform duration-300 hover:scale-[1.025] hover:shadow-blue-200"
                                            style={{ transition: '0.3s' }}
                                        >
                                            {/* Image */}
                                            <div className="flex-shrink-0 flex items-center justify-center w-full md:w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200">
                                                <div className="w-56 h-56 sm:w-48 sm:h-48 md:w-44 md:h-44 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-blue-400 outline outline-blue-100 transition-all duration-300 ease-in-out">
                                                    <img
                                                        src={program.photo || default_seminar_pic}
                                                        alt="Sample"
                                                        className="w-full h-full object-contain rounded-xl"
                                                    />
                                                </div>
                                            </div>
                                            {/* Content */}
                                            <div className="flex flex-col justify-between flex-1 px-8 py-8">
                                                <div>
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 text-blue-900 text-xl shadow-lg border-2 border-blue-300">
                                                            <i className={faIcons.All}></i>
                                                        </span>
                                                        <span
                                                            className="font-extrabold text-2xl text-blue-900 tracking-tight truncate"
                                                            title={program.title}
                                                        >
                                                            {program.title}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="text-blue-900 text-base mb-5 line-clamp-2 truncate font-medium"
                                                        title={program.description}
                                                    >
                                                        {truncate(program.description, 80)}
                                                    </div>
                                                    <div className="flex flex-wrap gap-3 mt-2">
                                                        <span
                                                            className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm truncate"
                                                            title={program.category}
                                                        >
                                                            <i className={faIcons[program.category] || faIcons.All}></i>
                                                            {program.category}
                                                        </span>
                                                        <span
                                                            className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm truncate"
                                                            title={program.location}
                                                        >
                                                            <i className="fa-solid fa-location-dot"></i>
                                                            {program.location}
                                                        </span>
                                                        <span
                                                            className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm truncate"
                                                            title={program.speaker}
                                                        >
                                                            <i className="fa-solid fa-user"></i>
                                                            {program.speaker}
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg font-semibold border shadow-sm truncate
                                                                ${
                                                                    program.totalParticipants >= program.capacity
                                                                        ? 'bg-red-100 text-red-900 border-red-200'
                                                                        : program.totalParticipants >= program.capacity * 0.8
                                                                        ? 'bg-yellow-100 text-yellow-900 border-yellow-200'
                                                                        : 'bg-green-100 text-green-900 border-green-200'
                                                                }`}
                                                            title="Current participants / Total capacity"
                                                        >
                                                            <i className="fa-solid fa-users"></i>
                                                            {program.totalParticipants} / {program.capacity}
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg font-semibold border shadow-sm truncate
                                                                ${
                                                                    program.status === 'Completed'
                                                                        ? 'bg-gray-100 text-gray-900 border-gray-200'
                                                                        : program.status === 'Ongoing'
                                                                        ? 'bg-blue-100 text-blue-900 border-blue-200'
                                                                        : program.status === 'Cancelled'
                                                                        ? 'bg-red-100 text-red-900 border-red-200'
                                                                        : 'bg-green-100 text-green-900 border-green-200'
                                                                }`}
                                                        >
                                                            <i
                                                                className={`fa-solid ${
                                                                    program.status === 'Completed'
                                                                        ? 'fa-circle-check'
                                                                        : program.status === 'Ongoing'
                                                                        ? 'fa-circle-play'
                                                                        : program.status === 'Cancelled'
                                                                        ? 'fa-circle-xmark'
                                                                        : 'fa-clock'
                                                                }`}
                                                            ></i>
                                                            {program.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* Buttons */}
                                                <div className="flex gap-4 w-full justify-end mt-8">
                                                    {isApplied ? (
                                                        <button
                                                            onClick={() => cancelMutation.mutate(program.id)}
                                                            className="flex items-center gap-2 px-8 py-2 rounded-xl bg-white text-blue-900 font-bold shadow-lg hover:bg-blue-100 border border-blue-200 transition text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                            disabled={cancelMutation.isLoading}
                                                        >
                                                            <i className="fa-solid fa-xmark"></i>
                                                            Cancel
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => applyMutation.mutate(program.id)}
                                                            className="flex items-center gap-2 px-8 py-2 rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 text-white font-bold shadow-lg hover:from-blue-900 hover:to-blue-700 transition text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                            disabled={applyMutation.isLoading}
                                                        >
                                                            <i className="fa-solid fa-paper-plane"></i>
                                                            Apply
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setSelectedSeminarId(program.id)}
                                                        className="flex items-center gap-2 px-8 py-2 rounded-xl border-2 border-blue-900 text-blue-900 bg-white font-bold shadow-lg hover:bg-blue-100 transition text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    >
                                                        <i className="fa-solid fa-circle-info"></i>
                                                        Details
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })
                            )}
                        </div>
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav className="flex justify-center mt-12 space-x-2 mb-8" aria-label="Pagination">
                                <button
                                    className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 disabled:opacity-50 transition "
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    aria-label="Previous page"
                                >
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`px-4 py-2 rounded-xl font-semibold transition ${
                                            currentPage === i + 1
                                                ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow'
                                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }`}
                                        onClick={() => setCurrentPage(i + 1)}
                                        aria-current={currentPage === i + 1 ? 'page' : undefined}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 disabled:opacity-50 transition"
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    aria-label="Next page"
                                >
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </nav>
                        )}
                    </section>
                </main>
            </div>
            {selectedSeminar && (
                <SeminarDetails seminar={selectedSeminar} onClose={() => setSelectedSeminarId(null)} />
            )}
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
                                    seminar.totalParticipants >= seminar.capacity
                                        ? 'bg-red-100 text-red-900 border-red-200'
                                        : seminar.totalParticipants >= seminar.capacity * 0.8
                                        ? 'bg-yellow-100 text-yellow-900 border-yellow-200'
                                        : 'bg-green-100 text-green-900 border-green-200'
                                }`}
                            title="Current participants / Total capacity"
                        >
                            <i className="fa-solid fa-users"></i>
                            {seminar.totalParticipants} / {seminar.capacity} Participants
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
