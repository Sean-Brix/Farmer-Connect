
import User from './User/User.jsx';
import RegisterUserModal from './RegisterUserModal.jsx';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Profiles({ details }) {
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
        <div className="min-h-screen bg-white pt-6 px-2 sm:px-4 md:px-6 lg:px-0" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif', fontWeight: 400 }}>
            <div className="w-full max-w-4xl mx-auto">
                {/* HEADER - Inventory/EIC style */}
                <div className="relative mb-6 sm:mt-20 mt-5 p-5 flex flex-col items-center justify-center max-w-4xl mx-auto gap-2 text-center">
                    <span className="inline-flex items-center justify-center gap-3 w-full">
                        <span className="rounded-full bg-green-100 p-2">
                            <svg className="w-9 h-9 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="#fff"/>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 20v-1a7 7 0 0 1 14 0v1" stroke="currentColor" strokeWidth="2" fill="none"/>
                            </svg>
                        </span>
                        <span className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
                            Account Management
                        </span>
                    </span>
                    <span className="block text-base md:text-lg text-gray-500 font-medium mt-1">
                        Manage and oversee all user accounts and profiles.
                    </span>
                </div>
                <hr className="border-t border-gray-300 mb-4 md:mb-8 mt-0.5 md:mt-2 w-full max-w-4xl mx-auto" />
                {/* FILTERS - professional search bar and filters */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 md:gap-6 items-stretch w-full mb-6 md:mb-8 px-1 sm:px-2">
                    {/* Responsive: stack filters vertically on xs, wrap on small, horizontal on md+ */}
                    <div className="flex flex-col xs:flex-row sm:flex-row flex-1 gap-2 sm:gap-3 md:gap-3 items-stretch w-full sm:w-auto">
                <div className="relative flex-grow min-w-[100px] sm:min-w-[120px] md:w-54 flex-shrink-0 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search profiles..."
                        className="modern-search-input text-black"
                        style={{ maxWidth: '260px' }}
                        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    />
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-black opacity-80 -translate-y-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                        <select
                            className="custom-select w-full sm:w-auto"
                            onChange={(e) => setFilter({ ...filter, roles: e.target.value })}
                        >
                            <option value="none">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Super Admin">Super Admin</option>
                            <option value="User">User</option>
                        </select>
                        <select
                            className="custom-select w-full sm:w-auto"
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
                    <div className="flex-none ml-auto min-w-[110px] w-full  sm:w-auto mt-2 sm:mt-0">
                        <select
                            className="sortby-select w-full sm:w-auto "
                            onChange={(e) => setFilter({ ...filter, order: e.target.value })}
                        >
                            <option value="none" >Sort by</option>
                            <option value="username">Username</option>
                            <option value="firstname">Firstname</option>
                            <option value="lastname">Lastname</option>
                            <option value="created_at">Date Created</option>
                            <option value="updated_at">Recently Updated</option>
                        </select>
                    </div>
                </div>

                {/* Register New User Button */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setShowRegisterModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Register New User
                    </button>
                </div>

                {/* LIST - tabular layout */}
                <div className="overflow-x-auto" style={{ fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
                    {isLoading ? (
                        <div className="text-center text-gray-400 py-8 font-medium text-base">
                            Loading profiles...
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-400 py-8 font-medium text-base">
                            {error.message}
                        </div>
                    ) : !Array.isArray(userList) || userList.length === 0 ? (
                        <div className="text-center text-gray-400 py-8 font-medium text-base">
                            No profiles found.
                        </div>
                    ) : (
                        <>
                            <table className="min-w-full bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden text-sm">
                                <thead className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-extrabold text-green-800 uppercase tracking-wider whitespace-nowrap">Username</th>
                                        <th className="px-4 py-3 text-left font-extrabold text-green-800 uppercase tracking-wider whitespace-nowrap">Name</th>
                                        <th className="px-4 py-3 text-left font-extrabold text-green-800 uppercase tracking-wider whitespace-nowrap">Role</th>
                                        <th className="px-4 py-3 text-left font-extrabold text-green-800 uppercase tracking-wider whitespace-nowrap">Client Profile</th>
                                        <th className="px-4 py-3 text-left font-extrabold text-green-800 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedList.map((user, idx) => (
                                        <tr
                                            key={user.id}
                                            className={`transition ${(idx % 2 === 0 ? 'bg-white' : 'bg-green-50')} hover:bg-green-100`} 
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
                            {/* Pagination Controls */}
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    className="px-3 py-1 rounded-lg border border-green-200 bg-white text-green-700 font-semibold shadow-sm hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </button>
                                <span className="text-green-800 font-semibold text-base mx-2">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="px-3 py-1 rounded-lg border border-green-200 bg-white text-green-700 font-semibold shadow-sm hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages || totalPages === 0}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* Import Poppins font from Google Fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <style>{`
                html, body, .min-h-screen {
                    
                }
                @media (max-width: 640px) {
                    .flex-col, .flex-col > * {
                        width: 100% !important;
                        min-width: 0 !important;
                    }
                    .custom-select, .sortby-select, .modern-search-input {
                        width: 100% !important;
                        min-width: 0 !important;
                        margin-bottom: 0.4rem;
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
                    .custom-select, .sortby-select, .modern-search-input {
                        width: 100% !important;
                        min-width: 0 !important;
                        margin-bottom: 0.4rem;
                    }
                    .ml-auto {
                        margin-left: 0 !important;
                    }
                }
                .modern-search-input {
                    background: rgba(255, 255, 255, 0.55);
                    border: 1.5px solid #e0e7ef;
                    color: green;
                    font-size: 0.93rem;
                    border-radius: 0.85rem;
                    padding: 0.55rem 0.9rem 0.55rem 2.1rem;
                    width: 100%;
                    box-shadow: 0 2px 12px 0 rgba(30,41,59,0.08), 0 1px 4px 0 rgba(59,130,246,0.05);
                    outline: none;
                    transition: border 0.18s, box-shadow 0.18s, transform 0.13s;
                    appearance: none;
                    margin-bottom: 0.5rem;
                    box-sizing: border-box;
                    backdrop-filter: blur(7px) saturate(1.1);
                    -webkit-backdrop-filter: blur(7px) saturate(1.1);
                }
                .modern-search-input:focus {
                    border-color: green;
                    box-shadow: 0 0 0 2px green;
                    transform: scale(1.025);
                }
                .modern-search-input:hover {
                    border-color: green;
                    background: rgba(255,255,255,0.75);
                    box-shadow: 0 4px 16px 0 rgba(59,130,246,0.10);
                    transform: scale(1.015);
                }
                .modern-search-input::placeholder {
                    color: green;
                    opacity: 0.85;
                }

                .sortby-select {
                    background: #fff;
                    border: 1px solid #e0e7ef;
                    color: green;
                    font-size: 0.91rem;
                    border-radius: .38rem;
                    padding: 0.48rem 2.1rem 0.48rem 0.8rem;
                    min-width: 100px;
                    box-shadow: 0 2px 12px 0 rgba(30,41,59,0.08), 0 1px 4px 0 rgba(59,130,246,0.05);
                    outline: none;
                    transition: border 0.18s, box-shadow 0.18s, transform 0.13s;
                    appearance: none;
                    /* Green arrow */
                    background-image: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%2300a651" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6"/></svg>');
                    background-repeat: no-repeat;
                    background-position: right 0.7rem center;
                    background-size: 1.1em;
                    margin-right: 0;
                    margin-bottom: 0.5rem;
                    box-sizing: border-box;
                }
                .sortby-select:focus {
                    border-color: green;
                    box-shadow: 0 0 0 1.5px green;
                    transform: scale(1.015);
                }
                .sortby-select:hover {
                    border-color: green;
                    background: #fff;
                    box-shadow: 0 4px 16px 0 rgba(56,189,248,0.13), 0 1px 6px 0 rgba(59,130,246,0.08);
                    transform: scale(1.01);
                }
                .sortby-select option {
                    background: #fff;
                    color: green;
                }
                .sortby-select::-ms-expand {
                    display: none;
                }

                .custom-select {
                    background: rgba(255, 255, 255, 0.55);
                    border: 1.5px solid green;
                    color: green;
                    font-size: 0.93rem;
                    border-radius: 0.85rem;
                    padding: 0.55rem 2.1rem 0.55rem 0.9rem;
                    min-width: 120px;
                    box-shadow: 0 2px 12px 0 rgba(30,41,59,0.08), 0 1px 4px 0 rgba(59,130,246,0.05);
                    outline: none;
                    transition: border 0.18s, box-shadow 0.18s, transform 0.13s;
                    appearance: none;
                    /* Green arrow */
                    background-image: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%2300a651" stroke-width="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6"/></svg>');
                    background-repeat: no-repeat;
                    background-position: right 0.9rem center;
                    background-size: 1.2em;
                    margin-right: 0;
                    margin-bottom: 0.5rem;
                    box-sizing: border-box;
                    backdrop-filter: blur(7px) saturate(1.1);
                    -webkit-backdrop-filter: blur(7px) saturate(1.1);
                }
                .custom-select:focus {
                    border-color: green;
                    box-shadow: 0 0 0 2px green;
                    transform: scale(1.025);
                }
                .custom-select:hover {
                    border-color: green;
                    background: rgba(255,255,255,0.75);
                    box-shadow: 0 4px 16px 0 rgba(59,130,246,0.10);
                    transform: scale(1.015);
                }
                .custom-select option {
                    background: #fff;
                    color: green;
                }
                .custom-select::-ms-expand {
                    display: none;
                }
                @media (max-width: 600px) {
                    .custom-select {
                        min-width: 80px;
                        font-size: 0.89rem;
                        padding: 0.4rem 1.2rem 0.4rem 0.7rem;
                        background-position: right 0.5rem center;
                        background-size: 1em;
                    }
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
            />
        </div>
    );
}
