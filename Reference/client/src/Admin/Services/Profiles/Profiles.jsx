import { Link } from 'react-router-dom';
import User from './User/User.jsx';
import { useEffect, useState } from 'react';

export default function Profiles({ details }) {
    const [userList, setUserList] = useState([]);
    const [filter, setFilter] = useState({
        roles: 'none',
        client_profile: 'none',
        order: 'none',
        search: 'none'
    });

    // Initial Render
    useEffect(() => {
        (async () => {
            // Get the list of accounts
            const response = await fetch('/api/Accounts/allAccounts');
            const data = await response.json();

            if (data.payload.error || !response.ok) {
                console.log(data.payload.error);
                alert(data.message);
                return;
            }

            setUserList(data.payload);
        })();
    }, []);

    useEffect(() => {
        let timeoutId;

        (async () => {
            // Debounce the search input
            if (filter.search !== '') {

                timeoutId = setTimeout(async () => {
                // Get the list of accounts
                const response = await fetch(
                    `/api/Accounts/allAccounts?access=${filter.roles}&client=${filter.client_profile}&order=${filter.order}&search=${filter.search}`
                );

                if (!response.ok) {
                    console.log(await response.text());
                    alert('Something went wrong');
                    return;
                }
                const data = await response.json();

                setUserList(data.payload);
            }, 300); // Adjust the debounce delay as needed (e.g., 300ms)

            } 
            else {
                const response = await fetch(
                    `/api/Accounts/allAccounts?access=${filter.roles}&client=${filter.client_profile}&order=${filter.order}&search=${filter.search}`
                );

                if (!response.ok) {
                    console.log(await response.text());
                    alert('Something went wrong');
                    return;
                }
                const data = await response.json();

                setUserList(data.payload);
            }
        })();

        return () => clearTimeout(timeoutId); // Clear the timeout on unmount or filter change
    }, [filter]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-6 px-2 sm:py-10 sm:px-4 mt-10">
            {/* MODERN HEADER WITH LINE */}
            <div className="flex items-center justify-center md:justify-start max-w-5xl mx-auto mb-8">
                <div className="flex items-center w-full">
                    <hr className="flex-grow border-t-2 border-blue-400" />
                    <h1 className="mx-4 text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-blue-900 px-8 py-2 rounded-full shadow-lg whitespace-nowrap tracking-tight">
                        Account Management
                    </h1>
                    <hr className="flex-grow border-t-2 border-blue-400" />
                </div>
            </div>
            <div className="max-w-5xl mx-auto bg-white/90 rounded-2xl shadow-2xl p-4 sm:p-8 border border-blue-200">
                {/* FILTERS */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                    <div className="flex flex-col gap-3 w-full md:w-auto md:flex-row md:items-center md:gap-6 flex-wrap">
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search profiles..."
                            className="w-full md:w-72 px-4 py-2 border border-blue-300 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-blue-50/70 placeholder:text-blue-400"
                            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                        />
                        {/* Filters */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 w-full md:w-auto flex-wrap">
                            {/* ACCESS FILTER */}
                            <select
                                className="w-full sm:w-40 px-3 py-2 border border-blue-300 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-blue-50/70 text-blue-700"
                                onChange={(e) =>
                                    setFilter({ ...filter, roles: e.target.value })
                                }
                            >
                                <option value="none">All Roles</option>
                                <option value="Admin">Admin</option>
                                <option value="Super Admin">Super Admin</option>
                                <option value="User">User</option>
                            </select>

                            {/* CLIENT FILTER */}
                            <select
                                className="w-full sm:w-55 px-3 py-2 border border-blue-300 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-blue-50/70 text-blue-700"
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
                                className="w-full sm:w-40 px-3 py-2 border border-blue-300 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-blue-50/70 text-blue-700"
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
                                <option value="updated_at">Recently Updated</option>
                            </select>
                        </div>
                    </div>
                </div>

                <hr className="mb-6 border-blue-200" />

                {/* LIST */}
                <div className="flex flex-col gap-4">
                    {!Array.isArray(userList) || userList.length === 0 ? (
                        <div className="text-center text-blue-400 py-12 font-semibold">
                            No profiles found.
                        </div>
                    ) : (
                        userList.map((user) => (
                            <div
                                key={user.id}
                                className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 rounded-xl shadow-md hover:shadow-lg transition p-4 border border-blue-200"
                            >
                                <User user={user} details={details} />
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Extra responsive styles for filter overlap */}
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
