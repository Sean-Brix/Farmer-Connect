
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
        <div className="min-h-screen bg-white pt-10 sm:pt-20 px-2 sm:px-4 md:px-6 lg:px-0" style={{ fontFamily: 'Inter, Segoe UI, Arial, sans-serif', fontWeight: 400 }}>
            <div className="w-full max-w-4xl mx-auto">
                {/* HEADER - EIC style */}
                <div className="relative pb-0 md:mt-6 mb-2 md:mb-6 flex flex-col items-center justify-center max-w-4xl mx-auto gap-1 md:gap-4">
                    <span
                        className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-wide flex items-center gap-3 w-full justify-center text-center drop-shadow-sm"
                        style={{
                            fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif',
                            letterSpacing: '0.04em',
                            textShadow: '0 2px 8px rgba(30,64,175,0.08)',
                        }}
                    >
                        <span className="inline-flex items-center justify-center rounded-full bg-blue-100 p-2 shadow-sm border border-blue-200">
                            <svg
                                className="w-8 h-8 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                viewBox="0 0 24 24"
                            >
                                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2.2" fill="#fff"/>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 20v-1a7 7 0 0 1 14 0v1" stroke="currentColor" strokeWidth="2.2" fill="none"/>
                            </svg>
                        </span>
                        <span className="ml-1" style={{
                            fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            color: '#1e293b',
                        }}>
                            Account Management
                        </span>
                    </span>
                </div>
                <hr className="border-t border-gray-300 mb-4 md:mb-8 mt-0.5 md:mt-2 w-full max-w-4xl mx-auto" />
                {/* FILTERS - professional search bar and filters */}
                <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 items-center w-full mb-6 md:mb-8 px-1 sm:px-2">
                    {/* Responsive: stack filters vertically on xs, wrap on small, horizontal on md+ */}
                    <div className="relative flex-grow min-w-[180px] sm:min-w-[200px] md:w-80 flex-shrink-0">
                        <input
                            type="text"
                            placeholder="Search profiles..."
                            className="block w-full p-3 pl-12 text-base border border-blue-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition shadow-sm"
                            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                        />
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <select
                        className="bg-white border border-blue-200 text-gray-700 text-base rounded-xl focus:ring-blue-200 focus:border-blue-400 p-3 shadow-sm min-w-[120px] sm:min-w-[150px] flex-1"
                        onChange={(e) => setFilter({ ...filter, roles: e.target.value })}
                    >
                        <option value="none">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="User">User</option>
                    </select>
                    <select
                        className="bg-white border border-blue-200 text-gray-700 text-base rounded-xl focus:ring-blue-200 focus:border-blue-400 p-3 shadow-sm min-w-[150px] sm:min-w-[180px] flex-1"
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
                        className="bg-white border border-blue-200 text-gray-700 text-base rounded-xl focus:ring-blue-200 focus:border-blue-400 p-3 shadow-sm min-w-[120px] sm:min-w-[150px] flex-1"
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
                            <table className="min-w-full bg-white rounded-2xl shadow-xl border border-blue-200 overflow-hidden text-sm">
                                <thead className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-extrabold text-blue-800 uppercase tracking-wider whitespace-nowrap">Username</th>
                                        <th className="px-4 py-3 text-left font-extrabold text-blue-800 uppercase tracking-wider whitespace-nowrap">Name</th>
                                        <th className="px-4 py-3 text-left font-extrabold text-blue-800 uppercase tracking-wider whitespace-nowrap">Role</th>
                                        <th className="px-4 py-3 text-left font-extrabold text-blue-800 uppercase tracking-wider whitespace-nowrap">Client Profile</th>
                                        <th className="px-4 py-3 text-left font-extrabold text-blue-800 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedList.map((user, idx) => (
                                        <tr
                                            key={user.id}
                                            className={`transition ${(idx % 2 === 0 ? 'bg-white' : 'bg-blue-50')} hover:bg-blue-100`} 
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
                                    className="px-3 py-1 rounded-lg border border-blue-200 bg-white text-blue-700 font-semibold shadow-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </button>
                                <span className="text-blue-800 font-semibold text-base mx-2">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="px-3 py-1 rounded-lg border border-blue-200 bg-white text-blue-700 font-semibold shadow-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                @media (max-width: 1024px) {
                    .max-w-4xl { max-width: 98vw !important; }
                }
                @media (max-width: 600px) {
                    .max-w-4xl {
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}
