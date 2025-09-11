
import User from './User/User.jsx';
import RegisterUserModal from './RegisterUserModal.jsx';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../../contexts/ThemeContext';

export default function Profiles({ details }) {
    const { theme, isDark } = useTheme();
    const queryClient = useQueryClient();
    const [refreshToken, setRefreshToken] = useState(Date.now());
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [filter, setFilter] = useState({
        roles: 'none',
        client_profile: 'none',
        order: 'none',
        search: 'none',
    });

    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ['accounts', filter, refreshToken],
        queryFn: async () => {
            const queryString = Object.entries(filter)
                .filter(([key, value]) => value !== 'none' && value !== '')
                .map(([key, value]) => `${key}=${value}`)
                .join('&');

            const url = `/api/account/all?${queryString}`;

            if (Object.values(filter).every((value) => value === 'none')) {
                const response = await fetch('/api/account/all');
                if (!response.ok) {
                    throw new Error('Something went wrong');
                }
                return response.json();
            } else {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Something went wrong');
                }
                return response.json();
            }
        },
    });

    useEffect(() => {
        refetch();
    }, [filter, refetch]);


    // Pagination state
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const userList = data?.list || [];
    const totalPages = Math.ceil(userList.length / itemsPerPage);
    const paginatedList = userList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    // Reset to first page if filter changes or userList changes
    useEffect(() => {
        setPage(1);
    }, [filter, userList.length]);

    return (
        <div className={`min-h-screen pt-6 px-2 sm:px-4 md:px-6 lg:px-0 ${
            isDark ? 'bg-gray-900' : 'bg-white'
        }`} style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', fontWeight: 400 }}>
            <div className="w-full max-w-4xl mx-auto">
                {/* HEADER - Clean and simple */}
                <div className="relative mb-8 sm:mt-20 mt-5 flex flex-col items-center justify-center max-w-4xl mx-auto gap-3 text-center">
                    <span className="inline-flex items-center justify-center gap-4 w-full">
                        <span className={`rounded-full p-3 shadow-lg ${
                            isDark ? 'bg-gradient-to-br from-green-800 to-green-700' : 'bg-gradient-to-br from-green-200 to-green-300'
                        }`}>
                            <svg className={`w-10 h-10 ${
                                isDark ? 'text-green-400' : 'text-green-700'
                            }`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 20v-1a7 7 0 0 1 14 0v1" stroke="currentColor" strokeWidth="2" fill="none"/>
                            </svg>
                        </span>
                        <span className={`text-3xl md:text-4xl font-bold tracking-tight ${
                            isDark ? 'text-white' : 'text-gray-800'
                        }`}>
                            Account Management
                        </span>
                    </span>
                    <span className={`block text-base md:text-lg font-medium mt-1 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Manage and oversee all user accounts and profiles
                    </span>
                </div>
                {/* FILTERS - Clean layout with consistent design */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch w-full mb-8">
                    {/* Search and filter controls */}
                    <div className="flex flex-col xs:flex-row sm:flex-row flex-1 gap-4 items-stretch w-full sm:w-auto">
                        <div className="relative flex-grow min-w-[100px] sm:min-w-[120px] md:w-54 flex-shrink-0 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search profiles..."
                                className={`modern-search-input ${
                                    isDark ? 'text-gray-200 bg-gray-800 border-gray-600' : 'text-gray-700 bg-white border-gray-300'
                                }`}
                                style={{ maxWidth: '280px' }}
                                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                            />
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-green-500 opacity-70" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <select
                            className={`custom-select w-full sm:w-auto ${
                                isDark ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'
                            }`}
                            onChange={(e) => setFilter({ ...filter, roles: e.target.value })}
                        >
                            <option value="none">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Super Admin">Super Admin</option>
                            <option value="User">User</option>
                        </select>
                        <select
                            className={`custom-select w-full sm:w-auto ${
                                isDark ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'
                            }`}
                            onChange={(e) => setFilter({ ...filter, client_profile: e.target.value })}
                        >
                            <option value="" disabled>Client Profile</option>
                            <option value="none">All Profile</option>
                            <option value="Fishfolk">Fishfolk</option>
                            <option value="Rural Based Org">Rural Based Org</option>
                            <option value="Student">Student</option>
                            <option value="Agricultural/Fisheries Technician">Agricultural/Fisheries Tech.</option>
                            <option value="Youth">Youth</option>
                            <option value="Women">Women</option>
                            <option value="Gov't Employee">Gov't Employee</option>
                            <option value="PWD">PWD</option>
                            <option value="Indigenous People">Indigenous People</option>
                        </select>
                    </div>
                    <div className="flex-none ml-auto min-w-[110px] w-full sm:w-auto mt-2 sm:mt-0">
                        <select
                            className={`custom-select w-full sm:w-auto ${
                                isDark ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'
                            }`}
                            onChange={(e) => setFilter({ ...filter, order: e.target.value })}
                        >
                            <option value="none">Sort by</option>
                            <option value="username">Username</option>
                            <option value="firstname">Firstname</option>
                            <option value="lastname">Lastname</option>
                            <option value="created_at">Date Created</option>
                            <option value="updated_at">Recently Updated</option>
                        </select>
                    </div>
                </div>

                {/* Register New User Button - Enhanced with green theme */}
                <div className="flex justify-end mb-8">
                    <button
                        onClick={() => setShowRegisterModal(true)}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:from-green-700 hover:to-green-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-500"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Register New User
                    </button>
                </div>

                {/* LIST - Clean table design */}
                <div className={`rounded-xl shadow-lg border overflow-hidden ${
                    isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-green-100'
                }`} style={{ fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
                    {isLoading ? (
                        <div className={`text-center py-12 font-medium text-base ${
                            isDark ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-green-50'
                        }`}>
                            <div className="inline-flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                Loading profiles...
                            </div>
                        </div>
                    ) : error ? (
                        <div className={`text-center py-12 font-medium text-base ${
                            isDark ? 'text-red-400 bg-gray-800' : 'text-red-500 bg-red-50'
                        }`}>
                            <div className="inline-flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                {error.message}
                            </div>
                        </div>
                    ) : !Array.isArray(userList) || userList.length === 0 ? (
                        <div className={`text-center py-12 font-medium text-base ${
                            isDark ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-50'
                        }`}>
                            <div className="inline-flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                No profiles found
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className={`text-white ${
                                        isDark ? 'bg-gradient-to-r from-green-700 to-green-800' : 'bg-gradient-to-r from-green-600 to-green-700'
                                    }`}>
                                        <tr>
                                            <th className="px-6 py-4 text-left font-bold text-white uppercase tracking-wider whitespace-nowrap">Username</th>
                                            <th className="px-6 py-4 text-left font-bold text-white uppercase tracking-wider whitespace-nowrap">Name</th>
                                            <th className="px-6 py-4 text-left font-bold text-white uppercase tracking-wider whitespace-nowrap">Role</th>
                                            <th className="px-6 py-4 text-left font-bold text-white uppercase tracking-wider whitespace-nowrap">Client Profile</th>
                                            <th className="px-6 py-4 text-left font-bold text-white uppercase tracking-wider whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${
                                        isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-green-100'
                                    }`}>
                                        {paginatedList.map((user, idx) => (
                                            <tr
                                                key={user.id}
                                                className={`transition-colors duration-200 ${
                                                    isDark 
                                                        ? (idx % 2 === 0 ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-750 hover:bg-gray-700')
                                                        : (idx % 2 === 0 ? 'bg-white hover:bg-green-50' : 'bg-green-25 hover:bg-green-75')
                                                } hover:shadow-sm`} 
                                                style={{ lineHeight: '1.25' }}
                                            >
                                                <User
                                                    user={user}
                                                    details={details}
                                                    refetchRow={() => setRefreshToken(Date.now())}
                                                    tabular={true}
                                                />
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
                
                {/* Pagination Controls - Fixed professional layout */}
                {!isLoading && !error && Array.isArray(userList) && userList.length > 0 && (
                    <div className="flex justify-center items-center gap-4 py-8">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isDark 
                                    ? 'border-green-600 bg-gray-800 text-green-400 hover:bg-gray-700 hover:border-green-500' 
                                    : 'border-green-300 bg-white text-green-700 hover:bg-green-50 hover:border-green-400'
                            }`}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
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
                            Page {page} of {totalPages}
                        </div>
                        
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isDark 
                                    ? 'border-green-600 bg-gray-800 text-green-400 hover:bg-gray-700 hover:border-green-500' 
                                    : 'border-green-300 bg-white text-green-700 hover:bg-green-50 hover:border-green-400'
                            }`}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || totalPages === 0}
                        >
                            Next
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
            {/* Import Poppins font from Google Fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <style>{`
                /* Dynamic background based on theme */
                html, body, .min-h-screen {
                    background: ${isDark ? '#111827' : '#ffffff'};
                }
                @media (max-width: 640px) {
                    .flex-col, .flex-col > * {
                        width: 100% !important;
                        min-width: 0 !important;
                    }
                    .custom-select, .modern-search-input {
                        width: 100% !important;
                        min-width: 0 !important;
                        margin-bottom: 0.5rem;
                    }
                    .ml-auto {
                        margin-left: 0 !important;
                    }
                }
                @media (max-width: 1024px) {
                    .max-w-4xl { max-width: 98vw !important; }
                }
                @media (max-width: 600px) {
                    .max-w-4xl {
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                    }
                    .flex-col, .flex-col > * {
                        width: 100% !important;
                        min-width: 0 !important;
                    }
                    .custom-select, .modern-search-input {
                        width: 100% !important;
                        min-width: 0 !important;
                        margin-bottom: 0.5rem;
                    }
                    .ml-auto {
                        margin-left: 0 !important;
                    }
                }

                /* Consistent form element design */
                .modern-search-input, .custom-select {
                    background: ${isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
                    border: 2px solid #16a34a;
                    color: ${isDark ? '#e5e7eb' : '#374151'};
                    font-size: 0.95rem;
                    border-radius: 0.875rem;
                    padding: 0.75rem 1rem;
                    width: 100%;
                    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.1), 0 2px 6px rgba(34, 197, 94, 0.05);
                    outline: none;
                    transition: all 0.3s ease;
                    appearance: none;
                    margin-bottom: 0.5rem;
                    box-sizing: border-box;
                    font-weight: 500;
                }

                /* Search input specific styling */
                .modern-search-input {
                    padding-left: 2.5rem;
                }

                /* Select specific styling */
                .custom-select {
                    padding-right: 2.5rem;
                    min-width: 140px;
                    background-image: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%2316a34a" stroke-width="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6"/></svg>');
                    background-repeat: no-repeat;
                    background-position: right 1rem center;
                    background-size: 1.3em;
                    transition: all 0.3s ease;
                }

                /* Arrow flip effect on focus/active */
                .custom-select:focus {
                    background-image: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%2315803d" stroke-width="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M18 15l-6-6-6 6"/></svg>');
                }

                .custom-select:active {
                    background-image: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%2315803d" stroke-width="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M18 15l-6-6-6 6"/></svg>');
                }

                /* Hover and focus states */
                .modern-search-input:focus, .custom-select:focus {
                    border-color: #15803d;
                    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15), 0 4px 20px rgba(34, 197, 94, 0.15);
                    transform: translateY(-1px);
                    background: ${isDark ? 'rgba(31, 41, 55, 1)' : 'rgba(255, 255, 255, 1)'};
                }

                .modern-search-input:hover, .custom-select:hover {
                    border-color: #15803d;
                    background: ${isDark ? 'rgba(31, 41, 55, 1)' : 'rgba(255, 255, 255, 1)'};
                    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.12);
                    transform: translateY(-0.5px);
                }

                .modern-search-input::placeholder {
                    color: ${isDark ? '#9ca3af' : '#6b7280'};
                    opacity: 0.8;
                    font-weight: 400;
                }

                .custom-select option {
                    background: ${isDark ? '#1f2937' : '#ffffff'};
                    color: ${isDark ? '#e5e7eb' : '#374151'};
                    font-weight: 400;
                }

                .custom-select::-ms-expand {
                    display: none;
                }
                
                /* Responsive adjustments */
                @media (max-width: 600px) {
                    .custom-select, .modern-search-input {
                        min-width: 80px;
                        font-size: 0.9rem;
                        padding: 0.6rem 0.8rem;
                        background-position: right 0.6rem center;
                        background-size: 1.1em;
                    }
                    .modern-search-input {
                        padding-left: 2.2rem;
                    }
                    .custom-select {
                        padding-right: 2rem;
                    }
                }

                /* Custom green shade utilities */
                .bg-green-25 {
                    background-color: #f7fdf9;
                }
                .bg-green-75 {
                    background-color: #ecfdf5;
                }
                .hover\\:bg-green-75:hover {
                    background-color: #ecfdf5;
                }
            `}</style>
            
            {/* Register User Modal */}
            <RegisterUserModal
                open={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSuccess={() => {
                    setRefreshToken(Date.now());
                    queryClient.invalidateQueries(['accounts']);
                }}
                isDark={isDark}
            />
        </div>
    );
}
