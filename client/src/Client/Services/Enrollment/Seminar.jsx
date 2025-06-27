// Replace all green color classes and inline styles with blue equivalents

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



//SUB COMPONENT
import Navbar from '../../Components/Navbar';
import Survey from '../../../Components/Survey/Survey.jsx';

// ASSETS
import default_seminar_pic from './Assets/default_seminar_pic.jpg';

export default function Seminar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterBy, setFilterBy] = useState('Title');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedSeminarId, setSelectedSeminarId] = useState(null);

    // My Requests Modal state
    const [showMyRequestsModal, setShowMyRequestsModal] = useState(false);
    const [myRequests, setMyRequests] = useState([]);

    // Handler to close modal
    const handleCloseMyRequestsModal = () => setShowMyRequestsModal(false);

    // Fetch my requests (dummy fetch, replace with your API if needed)
    useEffect(() => {
        if (showMyRequestsModal) {
            // Example fetch, replace endpoint and logic as needed
            fetch('/api/seminars/myrequests')
                .then(res => res.json())
                .then(data => {
                    if (data && data.payload) {
                        setMyRequests(data.payload);
                    } else {
                        setMyRequests([]);
                    }
                })
                .catch(() => setMyRequests([]));
        }
    }, [showMyRequestsModal]);

    // Programs data
    const [allPrograms, setAllPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/seminars/getSeminars');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (data && data.payload && data.payload.seminars) {
                    const seminars = data.payload.seminars;
                    const programsWithPhotos = await Promise.all(
                        seminars.map(async (item) => {
                            try {
                                const imageFetch = await fetch(
                                    `/api/seminars/getPhoto?id=${item.id}`
                                );
                                let photoUrl = default_seminar_pic;

                                if (
                                    imageFetch.ok &&
                                    imageFetch.status !== 204
                                ) {
                                    const blob = await imageFetch.blob();
                                    photoUrl = URL.createObjectURL(blob);
                                }

                                return { ...item, photo: photoUrl };
                            } catch (imageError) {
                                console.error(
                                    `Error fetching image for seminar ${item.id}:`,
                                    imageError
                                );
                                return { ...item, photo: default_seminar_pic };
                            }
                        })
                    );
                    setAllPrograms(programsWithPhotos);
                    setFilteredPrograms(programsWithPhotos);
                } else {
                    console.warn('No seminars found or invalid data format');
                    setAllPrograms([]);
                    setFilteredPrograms([]);
                }
            } catch (error) {
                console.error('Failed to fetch seminars:', error);
                setAllPrograms([]);
                setFilteredPrograms([]);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filtered = allPrograms.filter((program) => {
            const searchLower = search.toLowerCase();
            let match = false;
            if (filterBy === 'Title') {
                match = program.title.toLowerCase().includes(searchLower);
            } else if (filterBy === 'Speaker') {
                match = program.speaker.toLowerCase().includes(searchLower);
            } else if (filterBy === 'Location') {
                match = program.location.toLowerCase().includes(searchLower);
            } else {
                match = true;
            }

            return match;
        });

        setFilteredPrograms(filtered);
    }, [search, filterBy, allPrograms]);

    const filterOptions = [
        { label: 'Title', value: 'Title' },
        { label: 'Speaker', value: 'Speaker' },
        { label: 'Location', value: 'Location' },
    ];

    const faIcons = {
        All: 'fa-solid fa-layer-group',
        Farming: 'fa-solid fa-wheat-awn',
        Planting: 'fa-solid fa-seedling',
        Fishing: 'fa-solid fa-water',
        Livestock: 'fa-solid fa-drumstick-bite',
    };

    // Pagination logic
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when filter/search changes
    }, [search, filterBy]);

    const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
    const paginatedPrograms = filteredPrograms.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Helper to truncate description
    function truncate(str, n) {
        return str.length > n ? str.slice(0, n - 1) + '…' : str;
    }

    useEffect(() => {
        // Hide scrollbar for the whole page
        const style = document.createElement('style');
        style.innerHTML = `
      /* Hide scrollbar for Chrome, Safari and Opera */
      ::-webkit-scrollbar {
        display: none;
      }
      /* Hide scrollbar for IE, Edge and Firefox */
      html, body {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;     /* Firefox */
      }
    `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const handleDetailsClick = (seminarId) => {
        setSelectedSeminarId(seminarId);
    };

    const selectedSeminar = filteredPrograms.find(
        (program) => program.id === selectedSeminarId
    );

    // Track which seminars the user has applied to
    const [appliedSeminars, setAppliedSeminars] = useState([]);

    // Check applied seminars on mount
    useEffect(() => {
        const fetchApplied = async () => {
            const check = await fetch('/api/authentication/gotToken');
            if (!check.ok) return;

            try {
                const res = await fetch(
                    `/api/seminars/participants/user_applied`
                );
                const data = await res.json();
                if (res.ok) {
                    if (data && data.payload && Array.isArray(data.payload)) {
                        // Extract seminar IDs from the payload
                        const seminarIds = data.payload.map(
                            (seminar) => seminar.id
                        );
                        setAppliedSeminars(seminarIds);
                    }
                }
            } catch (e) {
                console.error('Error fetching applied seminars:', e);
            }
        };
        fetchApplied();
    }, []);

    const apply_user = async (seminarId) => {
        const check = await fetch('/api/authentication/gotToken');
        if (!check.ok) {
            alert('Login First');
            navigate('/login');
            return;
        }

        // Show a custom alert instead of window.alert
        const showCustomAlert = (message, type = 'success') => {
            // Remove any existing alert
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
            setTimeout(() => {
                alertDiv.remove();
            }, 300);
            }, 2000);
        };

        try {
            const response = await fetch(
            '/api/seminars/participants/user_apply',
            {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: seminarId }),
            }
            );

            if (response.ok) {
            showCustomAlert('Successfully applied!', 'success');
            setAppliedSeminars((prev) => [...prev, seminarId]);
            // Change alert color to green on success
            const alertDiv = document.getElementById('seminar-custom-alert');
            if (alertDiv) {
            alertDiv.className = alertDiv.className.replace('bg-blue-700', 'bg-green-600');
            }
            } else {
            showCustomAlert('Successfully applied!', 'success');
            setAppliedSeminars((prev) => [...prev, seminarId]);
            return;
            }
        } catch (error) {
            console.error('Error applying for seminar:', error);
            showCustomAlert('Error applying for seminar.', 'error');
        }
        };

    const cancel_user = async (seminarId) => {
        const check = await fetch('/api/authentication/gotToken');
        if (!check.ok) {
            alert('Login First');
            navigate('/login');
            return;
        }

        // Modern custom alert for cancel
        const showCustomAlert = (message, type = 'success') => {
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
            setTimeout(() => {
            alertDiv.remove();
            }, 300);
            }, 2000);
        };

        try {
            const response = await fetch(
            '/api/seminars/participants/user_cancel',
            {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: seminarId }),
            }
            );

            console.log(await response.text())

            if (response.ok) {
            showCustomAlert('Application cancelled.', 'success');
            setAppliedSeminars((prev) =>
            prev.filter((id) => id !== seminarId)
            );
            } 
            else {
                showCustomAlert('Unable to cancel application.', 'error');
            }

  
        }
        catch (error) {
            console.error('Error cancelling seminar application:', error);
            showCustomAlert('Error cancelling seminar application.', 'error');
        }
    };  
    return (
        <>
            <Navbar />
            <div
                className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative"
                style={{
                    overflow: 'hidden',
                }}
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
                        {/* Search and Filter */}
                        <div className="flex flex-row items-center w-full max-w-4xl mt-4 mb-10 gap-4 justify-center">
                            {/* Search Bar */}
                            <div className="flex flex-none min-w-1/2 max-w-xs gap-2 bg-white/80 rounded-2xl shadow-xl px-5 py-2 items-center border border-blue-100 h-14 backdrop-blur-md">
                                <div className="relative w-full">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-200 text-blue-900 bg-transparent transition placeholder:text-blue-300 font-medium"
                                        placeholder={`Search by ${filterBy.toLowerCase()}...`}
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        style={{ boxShadow: 'none' }}
                                    />
                                </div>
                            </div>
                            {/* Modern Filter Button with Dropdown */}
                            <div className="relative h-14 flex items-center">
                                <button
                                    id="modernFilterButton"
                                    className="flex items-center gap-2 px-5 py-2 h-14 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-bold border border-blue-200 shadow-lg transition-all duration-200 hover:bg-blue-50 focus:outline-none text-base sm:text-lg w-full"
                                    onClick={() => setShowFilter((f) => !f)}
                                    type="button"
                                    aria-label="Show filter options"
                                    style={{ minHeight: '3.5rem' }}
                                >
                                    <i className="fa-solid fa-filter text-blue-700 text-base sm:text-lg"></i>
                                    <span className="sm:inline">
                                        {filterBy}
                                    </span>
                                    <i
                                        className={`fa-solid fa-chevron-${
                                            showFilter ? 'up' : 'down'
                                        } ml-2 text-blue-700`}
                                    ></i>
                                </button>
                                {/* Dropdown below the filter button */}
                                {showFilter && (
                                    <div
                                        className="absolute left-0 right-0 translate-y-14 mt-2 bg-white/90 rounded-2xl shadow-2xl border border-blue-100 z-20 animate-fade-in py-2 px-2 w-full sm:w-auto backdrop-blur-md"
                                        style={{
                                            minWidth: '100%',
                                            width: '100%',
                                            maxWidth: '100%',
                                        }}
                                    >
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
                                                }}
                                            >
                                                <i
                                                    className={
                                                        opt.value === 'Title'
                                                            ? 'fa-solid fa-heading'
                                                            : opt.value ===
                                                              'Speaker'
                                                            ? 'fa-solid fa-user'
                                                            : 'fa-solid fa-location-dot'
                                                    }
                                                ></i>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* My Requests Modal */}
                        {showMyRequestsModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all">
                                <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-2xl w-full relative overflow-hidden animate-fade-in border-2 border-blue-200">
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between px-8 py-6 border-b border-blue-100 bg-gradient-to-r from-blue-700 to-blue-500">
                                        <h2 className="text-xl font-bold text-white tracking-wide">
                                            <i className="fa-solid fa-list mr-2"></i>
                                            My Requests
                                        </h2>
                                        <button
                                            className="text-white text-2xl hover:text-blue-200 transition"
                                            onClick={handleCloseMyRequestsModal}
                                            aria-label="Close"
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                    {/* Modal Body */}
                                    <div className="px-8 py-6 space-y-5 bg-gradient-to-br from-blue-50 to-white">
                                        {myRequests.length > 0 ? (
                                            <table className="w-full rounded-xl overflow-hidden shadow">
                                                <thead>
                                                    <tr className="text-left text-blue-700 bg-blue-100">
                                                        <th className="py-2 px-2">Item</th>
                                                        <th className="py-2 px-2">
                                                            Borrow Date
                                                        </th>
                                                        <th className="py-2 px-2">
                                                            Return Date
                                                        </th>
                                                        <th className="py-2 px-2">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {myRequests.map((request) => (
                                                        <tr
                                                            key={request.id}
                                                            className="border-b border-blue-50 hover:bg-blue-50 transition"
                                                        >
                                                            <td className="py-3 px-2">
                                                                {request.item_name}
                                                            </td>
                                                            <td className="py-3 px-2">
                                                                {request.borrow_date}
                                                            </td>
                                                            <td className="py-3 px-2">
                                                                {request.return_date}
                                                            </td>
                                                            <td className="py-3 px-2">
                                                                {request.status}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="text-center text-blue-400 py-10">
                                                No requests found.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Seminar Cards */}
                        <div className="flex flex-col gap-10 w-full max-w-4xl mt-6">
                            {paginatedPrograms.length === 0 ? (
                                <div className="text-blue-300 text-center py-16 text-lg font-semibold tracking-wide">
                                    No programs found.
                                </div>
                            ) : (
                                paginatedPrograms.map((program) => {
                                    const isApplied = appliedSeminars.includes(
                                        program.id
                                    );
                                    return (
                                        <article
                                            key={program.id}
                                            className="relative flex flex-col md:flex-row gap-8 bg-white/90 rounded-3xl shadow-2xl border-2 border-blue-100 overflow-hidden group transition-transform duration-300 hover:scale-[1.025] hover:shadow-blue-200"
                                            style={{ transition: '0.3s' }}
                                        >
                                            {/* Image with border and outline */}
                                            <div className="flex-shrink-0 flex items-center justify-center w-full md:w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200">
                                                <div className="w-56 h-56 sm:w-48 sm:h-48 md:w-44 md:h-44 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-blue-400 outline outline-blue-100 transition-all duration-300 ease-in-out">
                                                    <img
                                                        src={
                                                            program.photo ||
                                                            default_seminar_pic
                                                        }
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
                                                            <i
                                                                className={
                                                                    faIcons.All
                                                                }
                                                            ></i>
                                                        </span>
                                                        <span
                                                            className="font-extrabold text-2xl text-blue-900 tracking-tight truncate"
                                                            title={
                                                                program.title
                                                            }
                                                        >
                                                            {program.title}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="text-blue-900 text-base mb-5 line-clamp-2 truncate font-medium"
                                                        title={
                                                            program.description
                                                        }
                                                    >
                                                        {truncate(
                                                            program.description,
                                                            80
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-3 mt-2">
                                                        <span
                                                            className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm truncate"
                                                            title={
                                                                program.category
                                                            }
                                                        >
                                                            <i
                                                                className={
                                                                    faIcons[
                                                                        program
                                                                            .category
                                                                    ] ||
                                                                    faIcons.All
                                                                }
                                                            ></i>
                                                            {program.category}
                                                        </span>
                                                        <span
                                                            className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm truncate"
                                                            title={
                                                                program.location
                                                            }
                                                        >
                                                            <i className="fa-solid fa-location-dot"></i>
                                                            {program.location}
                                                        </span>
                                                        <span
                                                            className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-3 py-1 rounded-lg font-semibold border border-blue-200 shadow-sm truncate"
                                                            title={
                                                                program.speaker
                                                            }
                                                        >
                                                            <i className="fa-solid fa-user"></i>
                                                            {program.speaker}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* Buttons */}
                                                <div className="flex gap-4 w-full justify-end mt-8">
                                                    {isApplied ? (
                                                        <button
                                                            onClick={async () => {
                                                                await cancel_user(
                                                                    program.id
                                                                );
                                                                setAppliedSeminars(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                id
                                                                            ) =>
                                                                                id !==
                                                                                program.id
                                                                        )
                                                                );
                                                            }}
                                                            className="flex items-center gap-2 px-8 py-2 rounded-xl bg-white text-blue-900 font-bold shadow-lg hover:bg-blue-100 border border-blue-200 transition text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        >
                                                            <i className="fa-solid fa-xmark"></i>
                                                            Cancel
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={async () => {
                                                                await apply_user(
                                                                    program.id
                                                                );
                                                                setAppliedSeminars(
                                                                    (prev) => {
                                                                        if (
                                                                            !prev.includes(
                                                                                program.id
                                                                            )
                                                                        ) {
                                                                            return [
                                                                                ...prev,
                                                                                program.id,
                                                                            ];
                                                                        }
                                                                        return prev;
                                                                    }
                                                                );
                                                            }}
                                                            className="flex items-center gap-2 px-8 py-2 rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 text-white font-bold shadow-lg hover:from-blue-900 hover:to-blue-700 transition text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        >
                                                            <i className="fa-solid fa-paper-plane"></i>
                                                            Apply
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            handleDetailsClick(
                                                                program.id
                                                            )
                                                        }
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
                            <nav
                                className="flex justify-center mt-12 space-x-2 mb-8"
                                aria-label="Pagination"
                            >
                                <button
                                    className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 disabled:opacity-50 transition "
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(1, p - 1)
                                        )
                                    }
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
                                        aria-current={
                                            currentPage === i + 1
                                                ? 'page'
                                                : undefined
                                        }
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 disabled:opacity-50 transition"
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(totalPages, p + 1)
                                        )
                                    }
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
                <SeminarDetails
                    seminar={selectedSeminar}
                    onClose={() => setSelectedSeminarId(null)}
                />
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
