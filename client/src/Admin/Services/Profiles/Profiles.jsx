
import User from './User/User.jsx';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Profiles({ details }) {
    const queryClient = useQueryClient();
    const [refreshToken, setRefreshToken] = useState(Date.now());
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
        <div className="min-h-screen bg-white pt-20 px-8 sm:px-16 md:px-32 lg:px-0" style={{ fontFamily: 'Inter, Segoe UI, Arial, sans-serif', fontWeight: 400, fontSize: '1.5rem' }}>
            <div className="w-full max-w-7xl mx-auto">
                {/* HEADER - Inventory/EIC style */}
                <div className="relative mb-16 sm:mt-40 mt-16 p-14 flex flex-col items-center justify-center max-w-7xl mx-auto gap-8 text-center">
                    <span className="inline-flex items-center justify-center gap-6 w-full">
                        <span className="rounded-full bg-blue-100 p-8">
                            <svg className="w-24 h-24 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="#fff"/>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 20v-1a7 7 0 0 1 14 0v1" stroke="currentColor" strokeWidth="2" fill="none"/>
                            </svg>
                        </span>
                        <span className="text-7xl md:text-8xl font-extrabold text-gray-900 tracking-tight drop-shadow-2xl">
                            Account Management
                        </span>
                    </span>
                    <span className="block text-3xl md:text-4xl text-gray-500 font-bold mt-4">
                        Manage and oversee all user accounts and profiles.
                    </span>
                </div>
                <hr className="border-t-4 border-gray-300 mb-14 md:mb-20 mt-2 md:mt-8 w-full max-w-7xl mx-auto" />
                {/* FILTERS - professional search bar and filters */}
                <div className="flex flex-wrap gap-8 sm:gap-12 md:gap-20 items-center w-full mb-16 md:mb-24 px-4 sm:px-8">
                    {/* Responsive: stack filters vertically on xs, wrap on small, horizontal on md+ */}
                    <div className="relative flex-grow min-w-[320px] sm:min-w-[400px] md:w-[600px] flex-shrink-0">
                        <input
                            type="text"
                            placeholder="Search profiles..."
                            className="block w-full p-8 pl-28 text-2xl border-4 border-blue-400 rounded-3xl bg-gray-50 focus:ring-8 focus:ring-blue-200 focus:border-blue-600 outline-none transition shadow-2xl"
                            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                        />
                        <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <select
                        className="bg-white border-4 border-blue-400 text-gray-700 text-2xl rounded-3xl focus:ring-8 focus:ring-blue-200 focus:border-blue-600 p-6 shadow-2xl min-w-[220px] sm:min-w-[260px] flex-1"
                        onChange={(e) => setFilter({ ...filter, roles: e.target.value })}
                    >
                        <option value="none">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="User">User</option>
                    </select>
                    <select
                        className="bg-white border-4 border-blue-400 text-gray-700 text-2xl rounded-3xl focus:ring-8 focus:ring-blue-200 focus:border-blue-600 p-6 shadow-2xl min-w-[300px] sm:min-w-[340px] flex-1"
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
                    <select
                        className="bg-white border-4 border-blue-400 text-gray-700 text-2xl rounded-3xl focus:ring-8 focus:ring-blue-200 focus:border-blue-600 p-6 shadow-2xl min-w-[220px] sm:min-w-[260px] flex-1"
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

                {/* LIST - tabular layout */}
                <div className="overflow-x-auto" style={{ fontFamily: 'Inter, Segoe UI, Arial, sans-serif', fontSize: '2rem' }}>
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
                            <table className="min-w-full bg-white rounded-4xl shadow-2xl border-4 border-blue-400 overflow-hidden text-3xl">
                                <thead className="bg-gradient-to-r from-blue-200 to-blue-300 border-b-4 border-blue-400">
                                    <tr>
                                        <th className="px-16 py-10 text-left font-extrabold text-blue-900 uppercase tracking-wider whitespace-nowrap text-4xl">Username</th>
                                        <th className="px-16 py-10 text-left font-extrabold text-blue-900 uppercase tracking-wider whitespace-nowrap text-4xl">Name</th>
                                        <th className="px-16 py-10 text-left font-extrabold text-blue-900 uppercase tracking-wider whitespace-nowrap text-4xl">Role</th>
                                        <th className="px-16 py-10 text-left font-extrabold text-blue-900 uppercase tracking-wider whitespace-nowrap text-4xl">Client Profile</th>
                                        <th className="px-16 py-10 text-left font-extrabold text-blue-900 uppercase tracking-wider whitespace-nowrap text-4xl">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedList.map((user, idx) => (
                                        <tr
                                            key={user.id}
                                            className={`transition ${(idx % 2 === 0 ? 'bg-white' : 'bg-blue-50')} hover:bg-blue-100`} 
                                            style={{ lineHeight: '2', fontSize: '2.2em', height: '7rem' }}
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
                            <div className="flex justify-center items-center gap-16 mt-16">
                                <button
                                    className="px-16 py-6 rounded-3xl border-4 border-blue-400 bg-white text-blue-800 font-extrabold shadow-2xl hover:bg-blue-100 text-3xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </button>
                                <span className="text-blue-900 font-extrabold text-4xl mx-10">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="px-16 py-6 rounded-3xl border-4 border-blue-400 bg-white text-blue-800 font-extrabold shadow-2xl hover:bg-blue-100 text-3xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
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
            <style>{`
                @media (max-width: 1920px) {
                    .max-w-7xl { max-width: 99vw !important; }
                }
                @media (max-width: 1440px) {
                    .max-w-7xl { max-width: 100vw !important; }
                }
                @media (max-width: 1024px) {
                    .max-w-7xl { max-width: 100vw !important; }
                }
                @media (max-width: 600px) {
                    .max-w-7xl {
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}
