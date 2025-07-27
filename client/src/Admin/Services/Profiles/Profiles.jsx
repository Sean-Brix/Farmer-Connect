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

    const userList = data?.list || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-3 px-1 sm:py-6 md:py-10 lg:py-14 xl:py-20 sm:mt-10 transition-all">
            {/* HEADER */}
            <div className="flex items-center justify-center md:justify-start max-w-4xl mx-auto mb-6">
                <div className="flex items-center w-full">
                    <hr className="flex-grow border-t border-gray-200" />
                    <h1 className="mx-3 text-2xl sm:text-3xl font-bold text-gray-800 bg-white/80 px-6 py-1 rounded-full shadow whitespace-nowrap tracking-tight">
                        Account Management
                    </h1>
                    <hr className="flex-grow border-t border-gray-200" />
                </div>
            </div>
            <div className="max-w-4xl mx-auto bg-white/95 rounded-xl shadow-lg p-3 sm:p-6 border border-gray-100">
                {/* FILTERS */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
                    <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row md:items-center md:gap-4 flex-wrap">
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search profiles..."
                            className="w-full md:w-64 px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition bg-gray-50/60 placeholder:text-gray-400"
                            onChange={(e) =>
                                setFilter({ ...filter, search: e.target.value })
                            }
                        />
                        {/* Filters */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 w-full md:w-auto flex-wrap">
                            {/* ACCESS FILTER */}
                            <select
                                className="w-full sm:w-36 px-2 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition bg-gray-50/60 text-gray-700"
                                onChange={(e) =>
                                    setFilter({
                                        ...filter,
                                        roles: e.target.value,
                                    })
                                }
                            >
                                <option value="none">All Roles</option>
                                <option value="Admin">Admin</option>
                                <option value="Super Admin">Super Admin</option>
                                <option value="User">User</option>
                            </select>

                            {/* CLIENT FILTER */}
                            <select
                                className="w-full sm:w-44 px-2 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition bg-gray-50/60 text-gray-700"
                                onChange={(e) =>
                                    setFilter({
                                        ...filter,
                                        client_profile: e.target.value,
                                    })
                                }
                            >
                                <option value="" disabled>
                                    Client Profile
                                </option>
                                <option value="none">All Profile</option>
                                <option value="Fishfolk">Fishfolk</option>
                                <option value="Rural Based Org">
                                    Rural Based Org
                                </option>
                                <option value="Student">Student</option>
                                <option value="Agricultural/Fisheries Technician">
                                    Agricultural/Fisheries Tech.
                                </option>
                                <option value="Youth">Youth</option>
                                <option value="Women">Women</option>
                                <option value="Gov't Employee">
                                    Gov't Employee
                                </option>
                                <option value="PWD">PWD</option>
                                <option value="Indigenous People">
                                    Indigenous People
                                </option>
                            </select>

                            {/* SORT BY FILTER */}
                            <select
                                className="w-full sm:w-36 px-2 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition bg-gray-50/60 text-gray-700"
                                onChange={(e) =>
                                    setFilter({
                                        ...filter,
                                        order: e.target.value,
                                    })
                                }
                            >
                                <option value="none">Sort by</option>
                                <option value="username">Username</option>
                                <option value="firstname">Firstname</option>
                                <option value="lastname">Lastname</option>
                                <option value="created_at">Date Created</option>
                                <option value="updated_at">
                                    Recently Updated
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <hr className="mb-5 border-gray-100" />

                {/* LIST */}
                <div className="flex flex-col gap-3">
                    {isLoading ? (
                        <div className="text-center text-gray-400 py-10 font-medium">
                            Loading profiles...
                        </div>
                    ) : error ? (
                        <div className="text-center text-gray-400 py-10 font-medium">
                            {error.message}
                        </div>
                    ) : !Array.isArray(userList) || userList.length === 0 ? (
                        <div className="text-center text-gray-400 py-10 font-medium">
                            No profiles found.
                        </div>
                    ) : (
                        userList.map((user) => (
                            <div
                                key={user.id}
                                className="bg-gradient-to-r from-gray-50 via-white to-gray-100 rounded-lg shadow hover:shadow-md transition p-3 border border-gray-100"
                            >
                                <User
                                    user={user}
                                    details={details}
                                    refetchRow={() =>
                                        setRefreshToken(Date.now())
                                    }
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Responsive tweaks */}
            <style>
                {`
                @media (max-width: 640px) {
                    .filters-responsive {
                        flex-direction: column !important;
                        gap: 0.5rem !important;
                    }
                }
                `}
            </style>
        </div>
    );
}
