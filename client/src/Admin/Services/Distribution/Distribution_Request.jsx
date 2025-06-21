import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Distribution_Request() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [eicItems, setEicItems] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch(
                    '/api/distribution/getAll_Request'
                );
                const data = await response.json();
                setRequests(data?.payload || []);
            } catch (error) {
                console.error('Error fetching requests:', error);
                alert('Unauthorized, Only Admin Account');
                navigate('/login');
            }
        };

        const fetchEicItems = async () => {
            try {
                const response = await fetch('/api/distribution/getAll');
                const data = await response.json();
                setEicItems(data?.payload || []);
            } catch (error) {
                console.error('Error fetching items:', error);
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
        fetchEicItems();
        fetchAccounts();
    }, [navigate]);

    const filteredRequests =
        requests?.filter((request) => {
            const account = accounts?.find(
                (account) => account.id === request.account_id
            );
            const eicItem = eicItems?.find(
                (item) => item.id === request.distribution_item_id
            );
            const searchMatch =
                request.request_note
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                account?.username
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                eicItem?.name
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

    const updateItemStock = async (itemId, quantityChange) => {
        try {
            const response = await fetch('/api/distribution/updateItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: itemId,
                    quantity: quantityChange,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setEicItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === itemId
                        ? { ...item, quantity: item.quantity + quantityChange }
                        : item
                )
            );
        } catch (error) {
            console.error('Error updating item stock:', error);
            alert('Failed to update item stock.');
        }
    };

    const handleApprove = async (id, distribution_item_id, quantity) => {
        try {
            const response = await fetch(`/api/distribution/approve_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request_id: id,
                    status: 'Approved',
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            await updateItemStock(distribution_item_id, -quantity);

            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === id
                        ? { ...request, status: 'Approved' }
                        : request
                )
            );
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Unauthorized, Only Admin Account');
            navigate('/login');
        }
    };

    const handleReject = async (id, distribution_item_id, quantity) => {
        try {
            const response = await fetch(`/api/distribution/approve_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request_id: id,
                    status: 'Rejected',
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            await updateItemStock(distribution_item_id, +quantity);


            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === id
                        ? { ...request, status: 'Rejected' }
                        : request
                )
            );
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Unauthorized, Only Admin Account');
            navigate('/login');
        }
    };

    const handleProcessing = async (id) => {
        try {
            const response = await fetch(`/api/distribution/approve_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request_id: id,
                    status: 'Processing',
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === id
                        ? { ...request, status: 'Processing' }
                        : request
                )
            );
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Unauthorized, Only Admin Account');
            navigate('/login');
        }
    };

    const handleClaimed = async (id, quantity, distribution_item_id) => {
        try {
            const response = await fetch(`/api/distribution/approve_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request_id: id,
                    status: 'Claimed',
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            await updateItemStock(distribution_item_id, +quantity);


            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === id
                        ? { ...request, status: 'Claimed' }
                        : request
                )
            );
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Unauthorized, Only Admin Account');
            navigate('/login');
        }
    };

    const RequestCard = ({ request }) => {
        const account = accounts?.find(
            (account) => account.id === request.account_id
        );
        const eicItem = eicItems?.find(
            (item) => item.id === request.distribution_item_id
        );

        return (
            <div className="w-full p-6 rounded-3xl shadow-xl bg-white flex flex-col justify-between h-[400px] border border-gray-100 transition-all hover:shadow-2xl group relative overflow-hidden">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 truncate">
                            {eicItem?.name}
                        </h3>
                        <span
                            className={`font-medium px-3 py-1 rounded-full text-xs border transition ${
                                request.status === 'Approved'
                                    ? 'bg-green-50 text-green-600 border-green-100'
                                    : request.status === 'Rejected'
                                    ? 'bg-red-50 text-red-500 border-red-100'
                                    : request.status === 'Processing'
                                    ? 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                    : request.status === 'Claimed'
                                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                                    : 'bg-gray-50 text-gray-600 border-gray-100'
                            }`}
                        >
                            {request.status}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-6">
                        Requested by{' '}
                        <span className="font-semibold text-gray-700">
                            {account?.firstname} {account?.lastname}
                        </span>
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="font-medium">Item ID</span>
                            <span>{eicItem?.id}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="font-medium">Quantity</span>
                            <span>{request.quantity}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="font-medium">Schedule</span>
                            <span>{request.schedule_date}</span>
                        </div>
                        {eicItem && (
                            <>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span className="font-medium">Stock</span>
                                    <span>{eicItem?.quantity}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span className="font-medium">
                                        Category
                                    </span>
                                    <span>{eicItem?.category}</span>
                                </div>
                            </>
                        )}
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="font-medium">Note</span>
                            <button
                                className="text-gray-400 hover:text-green-600 focus:outline-none transition"
                                title="View note"
                                onClick={() => alert(request.request_note)}
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
                        className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 shadow-sm transition-all duration-200 cursor-pointer"
                        defaultValue={request.status}
                        onChange={(e) => {
                            if (e.target.value === 'Approved') {
                                handleApprove(
                                    request.id,
                                    request.distribution_item_id,
                                    request.quantity
                                );
                            } else if (e.target.value === 'Rejected') {
                                handleReject(
                                    request.id,
                                    request.distribution_item_id,
                                    request.quantity
                                );
                            } else if (e.target.value === 'Processing') {
                                handleProcessing(request.id);
                            } else if (e.target.value === 'Claimed') {
                                handleClaimed(request.id, request.quantity, request.distribution_item_id,);
                            }
                        }}
                    >
                        <option
                            value="Waiting"
                            disabled={request.status !== 'Waiting'}
                        >
                            Waiting
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
                            value="Processing"
                            disabled={request.status === 'Processing'}
                        >
                            Processing
                        </option>
                        <option
                            value="Claimed"
                            disabled={request.status === 'Claimed'}
                        >
                            Claimed
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
                            className="appearance-none w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 shadow-sm transition-all duration-200 cursor-pointer"
                            value={statusFilter}
                        >
                            <option value="">All Statuses</option>
                            <option value="Waiting">Waiting</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Processing">Processing</option>
                            <option value="Claimed">Claimed</option>
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
                            case 'Processing':
                                indicatorColor = 'bg-yellow-400';
                                break;
                            case 'Claimed':
                                indicatorColor = 'bg-blue-400';
                                break;
                            case 'Waiting':
                            default:
                                indicatorColor = 'bg-gray-400';
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
