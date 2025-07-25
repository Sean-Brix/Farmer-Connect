import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Distribution_Request() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [distributionItems, setDistributionItems] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('/api/dist/request/all');
                const data = await response.json();
                setRequests(data?.requests || []);
            } catch (error) {
                console.error('Error fetching distribution requests:', error);
                alert('Unauthorized, Only Admin Account');
                navigate('/login');
            }
        };

        const fetchDistributionItems = async () => {
            try {
                const response = await fetch('/api/dist/all');
                const data = await response.json();
                setDistributionItems(data || []);
            } catch (error) {
                console.error('Error fetching distribution items:', error);
                alert('Unauthorized, Only Admin Account');
                navigate('/login');
            }
        };

        const fetchAccounts = async () => {
            try {
                const response = await fetch('/api/accounts/allAccounts');
                const data = await response.json();
                setAccounts(data?.payload || []);
            } catch (error) {
                console.error('Error fetching accounts:', error);
                alert('Unauthorized, Only Admin Account');
                navigate('/login');
            }
        };

        fetchRequests();
        fetchDistributionItems();
        fetchAccounts();
    }, [navigate]);

    const filteredRequests =
        requests?.filter((request) => {
            const account = accounts?.find(
                (account) => account.id === request.accountId
            );
            const searchMatch =
                request.requestNote
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                request.requestorName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                request.itemName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const statusMatch =
                statusFilter === '' || request.status === statusFilter;
            return searchMatch && statusMatch;
        }) || [];

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // Remove updateItemStock function as it's handled automatically by the backend
    // Remove handleClaimed function as it's not needed for distribution items

    const handleApprove = async (requestId) => {
        try {
            const response = await fetch('/api/dist/request/respond', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionId: requestId,
                    status: 'Approved',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || `HTTP error! Status: ${response.status}`
                );
            }

            // Update the requests list
            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === requestId
                        ? { ...request, status: 'Approved' }
                        : request
                )
            );

            alert('Request approved successfully');
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Failed to approve request: ' + error.message);
        }
    };

    const handleReject = async (requestId) => {
        try {
            const response = await fetch('/api/dist/request/respond', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionId: requestId,
                    status: 'Rejected',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || `HTTP error! Status: ${response.status}`
                );
            }

            // Update the requests list
            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === requestId
                        ? { ...request, status: 'Rejected' }
                        : request
                )
            );

            alert('Request rejected successfully');
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Failed to reject request: ' + error.message);
        }
    };

    const handleNoPickup = async (requestId) => {
        try {
            const response = await fetch('/api/dist/request/respond', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionId: requestId,
                    status: 'No_Pickup',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || `HTTP error! Status: ${response.status}`
                );
            }

            // Update the requests list
            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === requestId
                        ? { ...request, status: 'No_Pickup' }
                        : request
                )
            );

            alert('Request marked as No Pickup successfully');
        } catch (error) {
            console.error('Error updating request:', error);
            alert('Failed to update request: ' + error.message);
        }
    };

    const RequestCard = ({ request }) => {
        return (
            <div className="w-full p-6 rounded-3xl shadow-xl bg-white flex flex-col justify-between h-[400px] border border-gray-100 transition-all hover:shadow-2xl group relative overflow-hidden">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 truncate">
                            {request.itemName}
                        </h3>
                        <span
                            className={`font-medium px-3 py-1 rounded-full text-xs border transition ${
                                request.status === 'Approved'
                                    ? 'bg-green-50 text-green-600 border-green-100'
                                    : request.status === 'Rejected'
                                    ? 'bg-red-50 text-red-500 border-red-100'
                                    : request.status === 'No_Pickup'
                                    ? 'bg-orange-50 text-orange-600 border-orange-100'
                                    : request.status === 'Cancelled'
                                    ? 'bg-gray-50 text-gray-600 border-gray-100'
                                    : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}
                        >
                            {request.status}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-6">
                        Requested by{' '}
                        <span className="font-semibold text-gray-700">
                            {request.requestorName}
                        </span>
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="font-medium">Item Category</span>
                            <span>{request.itemCategory}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="font-medium">Quantity</span>
                            <span>{request.quantity}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="font-medium">Pickup Date</span>
                            <span>
                                {new Date(
                                    request.pickupDate
                                ).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="font-medium">Current Stock</span>
                            <span>{request.currentStock}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="font-medium">Note</span>
                            <button
                                className="text-gray-400 hover:text-blue-600 focus:outline-none transition"
                                title="View note"
                                onClick={() =>
                                    alert(
                                        request.requestNote ||
                                            'No note provided'
                                    )
                                }
                                type="button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="inline w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <select
                        className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm transition-all duration-200 cursor-pointer"
                        defaultValue={request.status}
                        onChange={(e) => {
                            if (e.target.value === 'Approved') {
                                handleApprove(request.id);
                            } else if (e.target.value === 'Rejected') {
                                handleReject(request.id);
                            } else if (e.target.value === 'No_Pickup') {
                                handleNoPickup(request.id);
                            }
                        }}
                    >
                        <option
                            value="Pending"
                            disabled={request.status !== 'Pending'}
                        >
                            Pending
                        </option>
                        <option
                            value="Approved"
                            disabled={request.status === 'Approved'}
                        >
                            Approve
                        </option>
                        <option
                            value="Rejected"
                            disabled={request.status === 'Rejected'}
                        >
                            Reject
                        </option>
                        <option
                            value="No_Pickup"
                            disabled={request.status === 'No_Pickup'}
                        >
                            No Pickup
                        </option>
                    </select>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 max-w-7xl mx-auto gap-4 p-6">
                <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
                    <div className="relative w-full max-w-lg">
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 text-black bg-white shadow-sm transition-all duration-200 placeholder-gray-400"
                        />
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </span>
                    </div>
                    <div className="relative w-full md:w-48">
                        <select
                            onChange={handleStatusChange}
                            className="appearance-none w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm transition-all duration-200 cursor-pointer"
                            value={statusFilter}
                        >
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="No_Pickup">No Pickup</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full h-auto p-4 rounded-2xl">
                {filteredRequests.length === 0 ? (
                    <div className="text-center w-full text-gray-400 py-10 bg-white rounded-2xl shadow">
                        <svg
                            className="mx-auto mb-2 w-10 h-10 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 15h8M9 9h.01M15 9h.01" />
                        </svg>
                        No requests found
                    </div>
                ) : (
                    filteredRequests.map((request) => {
                        let indicatorColor = '';
                        switch (request.status) {
                            case 'Approved':
                                indicatorColor = 'bg-green-500';
                                break;
                            case 'Rejected':
                                indicatorColor = 'bg-red-500';
                                break;
                            case 'No_Pickup':
                                indicatorColor = 'bg-orange-500';
                                break;
                            case 'Cancelled':
                                indicatorColor = 'bg-gray-500';
                                break;
                            case 'Pending':
                            default:
                                indicatorColor = 'bg-blue-400';
                                break;
                        }
                        return (
                            <div className="relative" key={request.id}>
                                <span
                                    className={`absolute top-4 right-4 w-3 h-3 rounded-full shadow ${indicatorColor} border-2 border-white z-10`}
                                    title={request.status}
                                ></span>
                                <RequestCard request={request} />
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}
