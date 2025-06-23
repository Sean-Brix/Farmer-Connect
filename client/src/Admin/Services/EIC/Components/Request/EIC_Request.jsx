import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EIC_Request() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [eics, setEics] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [refresh, setRefresh] = useState(false);

    // Simple ViewDetailsButton component for showing more details in an alert/modal (replace with your own modal if needed)
    function ViewDetailsButton({ request, account, eic }) {
        const handleView = () => {
            alert(
                `Request Note: ${request.request_note || 'N/A'}\n` +
                `Item Description: ${eic?.description || 'N/A'}\n` +
                `Requested By: ${account?.firstname || ''} ${account?.lastname || ''}\n` +
                `Username: ${account?.username || ''}\n` +
                `Contact: ${account?.contact || ''}\n` +
                `Status: ${request.status}\n`
            );
        };
        return (
            <button
                className="w-full md:w-auto px-2 py-1 border border-blue-200 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs transition"
                onClick={handleView}
                type="button"
            >
                View
            </button>
        );
    }

    const fetchRequests = useCallback(async () => {
        try {
            const response = await fetch('/api/eic/getAll_Request');
            const data = await response.json();
            setRequests(data?.payload || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
            alert('Unauthorize, Only Admin Account');
            navigate('/login');
        }
    }, [navigate]);
    const fetchAccounts = useCallback(async () => {
        try {
            const response = await fetch('/api/accounts/allAccounts');
            const data = await response.json();
            setAccounts(data?.payload || []);
        } catch (error) {
            console.error('Error fetching accounts:', error);
            alert('Unauthorize, Only Admin Account');
            navigate('/login');
        }
    }, [navigate]);
    const fetchEics = useCallback(async () => {
        try {
            const response = await fetch('/api/eic/getAll');
            const data = await response.json();
            setEics(data?.payload || []);
        } catch (error) {
            console.error('Error fetching eics:', error);
            alert('Unauthorize, Only Admin Account');
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        fetchRequests();
        fetchAccounts();
        fetchEics();
    }, [fetchRequests, fetchAccounts, fetchEics, refresh]);
    const filteredRequests =
        requests?.filter((request) => {
            const account = accounts?.find(
                (account) => account.id === request.user_id
            );
            const eic = eics?.find((eic) => eic.id === request.eic_id);

            const searchMatch =
                request.request_note
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                account?.username
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                request?.item_name
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

    const updateRequestStatus = async (id, status) => {
        try {
            const response = await fetch(`/api/eic/approve_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request_id: id,
                    status: status,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.id === id ? { ...req, status: status } : req
                )
            );
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error('Error updating request:', error);
            alert('Unauthorize, Only Admin Account');
            navigate('/login');
        }
    };
    const updateEicStatus = async (id, status) => {
        try {
            const response = await fetch(`/api/eic/updateItem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    status: status,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setEics((prevEics) =>
                prevEics.map((eic) =>
                    eic.id === id ? { ...eic, status: status } : eic
                )
            );
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error('Error updating EIC status:', error);
            alert('Unauthorize, Only Admin Account');
            navigate('/login');
        }
    };

    const handleApprove = async (id) => {
        try {
            const request = requests.find((req) => req.id === id);
            const eic = eics.find((eic) => eic.id === request.eic_id);

            if (!eic) {
                alert('EIC item not found.');
                return;
            }

            if (eic.quantity < request.quantity) {
                alert('Insufficient stock.');
                return;
            }
            await updateRequestStatus(id, 'Approved');

            let newQuantity = eic.quantity - request.quantity;

            setEics((prevEics) =>
                prevEics.map((item) =>
                    item.id === eic.id
                        ? {
                              ...item,
                              quantity: newQuantity,
                          }
                        : item
                )
            );

            if (newQuantity === 0) {
                await updateEicStatus(eic.id, 'Borrowed');
            }
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Unauthorize, Only Admin Account');
            navigate('/login');
        }
    };

    const handleProcessing = async (id) => {
        await updateRequestStatus(id, 'Processing');
    };

    const handleReject = async (id) => {
        try {
            const request = requests.find((req) => req.id === id);
            const eic = eics.find((eic) => eic.id === request.eic_id);

            await updateRequestStatus(id, 'Rejected');

            if (request.previousStatus === 'Approved' && eic) {
                let newQuantity = eic.quantity + request.quantity;

                setEics((prevEics) =>
                    prevEics.map((item) =>
                        item.id === eic.id
                            ? {
                                  ...item,
                                  quantity: newQuantity,
                              }
                            : item
                    )
                );

                if (eic.status === 'Borrowed') {
                    await updateEicStatus(eic.id, 'Available');
                }
            }
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Unauthorize, Only Admin Account');
            navigate('/login');
        }
    };

    const handleReturned = async (id) => {
        try {
            const request = requests.find((req) => req.id === id);
            const eic = eics.find((eic) => eic.id === request.eic_id);

            await updateRequestStatus(id, 'Returned');

            if (eic) {
                let newQuantity = eic.quantity + request.quantity;

                setEics((prevEics) =>
                    prevEics.map((item) =>
                        item.id === eic.id
                            ? {
                                  ...item,
                                  quantity: newQuantity,
                              }
                            : item
                    )
                );
                if (newQuantity > 0) {
                    await updateEicStatus(eic.id, 'Available');
                }
            }
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error('Error handling returned request:', error);
            alert('Unauthorize, Only Admin Account');
            navigate('/login');
        }
    };

    // Modal component for showing details
    function DetailsModal({ open, onClose, request, account, eic }) {
        if (!open) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-0 relative animate-fadeIn">
                    <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <h2 className="text-lg font-semibold mb-0 px-6 pt-6 pb-2 text-blue-700 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 15h8M9 9h.01M15 9h.01" />
                        </svg>
                        Request Details
                    </h2>
                    <div className="max-h-[60vh] overflow-y-auto px-6 pb-6 pt-2 space-y-0 text-sm">
                        <div className="py-3 border-b">
                            <span className="font-medium text-gray-700">Request Note:</span>
                            <span className="ml-2 text-gray-900 break-words">{request?.request_note || 'N/A'}</span>
                        </div>
                        <div className="py-3 border-b">
                            <span className="font-medium text-gray-700">Item Description:</span>
                            <span className="ml-2 text-gray-900 break-words">{eic?.description || 'N/A'}</span>
                        </div>
                        <div className="py-3 border-b">
                            <span className="font-medium text-gray-700">Requested By:</span>
                            <span className="ml-2 text-gray-900">{account?.firstname || ''} {account?.lastname || ''}</span>
                        </div>
                        <div className="py-3 border-b">
                            <span className="font-medium text-gray-700">Username:</span>
                            <span className="ml-2 text-gray-900">{account?.username || ''}</span>
                        </div>
                        <div className="py-3 border-b">
                            <span className="font-medium text-gray-700">Contact:</span>
                            <span className="ml-2 text-gray-900">{account?.contact || ''}</span>
                        </div>
                        <div className="py-3 border-b">
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className="ml-2 text-gray-900">{request?.status}</span>
                        </div>
                        <div className="py-3 border-b">
                            <span className="font-medium text-gray-700">Borrow Date:</span>
                            <span className="ml-2 text-gray-900">{request?.borrow_date || 'N/A'}</span>
                        </div>
                        <div className="py-3">
                            <span className="font-medium text-gray-700">Return Date:</span>
                            <span className="ml-2 text-gray-900">{request?.return_date || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function ViewDetailsButton({ onClick }) {
        return (
            <button
                className="w-full md:w-auto px-2 py-1 border border-blue-200 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs transition"
                onClick={onClick}
                type="button"
            >
                View
            </button>
        );
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ request: null, account: null, eic: null });

    const handleOpenModal = (request, account, eic) => {
        setModalData({ request, account, eic });
        setModalOpen(true);
    };
    const handleCloseModal = () => setModalOpen(false);

    return (
        <>
            <DetailsModal
                open={modalOpen}
                onClose={handleCloseModal}
                request={modalData.request}
                account={modalData.account}
                eic={modalData.eic}
            />
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
                            <option value="Returned">Returned</option>
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

            <div className="overflow-x-auto w-full p-4">
                <table className="min-w-full bg-white rounded-2xl shadow">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Item Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Requested By</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Quantity</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Borrow Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Return Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-400 py-10">
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
                                </td>
                            </tr>
                        ) : (
                            filteredRequests.map((request) => {
                                const account = accounts?.find((a) => a.id === request.user_id);
                                const eic = eics?.find((e) => e.id === request.eic_id);
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
                                    case 'Returned':
                                        indicatorColor = 'bg-blue-500';
                                        break;
                                    case 'Waiting':
                                    default:
                                        indicatorColor = 'bg-gray-400';
                                        break;
                                }
                                const isStatusChanged = request.previousStatus !== null;
                                return (
                                    <tr key={request.id} className="border-b last:border-b-0">
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block w-3 h-3 rounded-full align-middle mr-2 ${indicatorColor}`}
                                                title={request.status}
                                            ></span>
                                            <span
                                                className={`font-medium px-2 py-1 rounded-full text-xs border transition
                                                    ${
                                                        request.status === 'Approved'
                                                            ? 'bg-green-50 text-green-600 border-green-100'
                                                            : request.status === 'Rejected'
                                                            ? 'bg-red-50 text-red-500 border-red-100'
                                                            : request.status === 'Processing'
                                                            ? 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                            : request.status === 'Returned'
                                                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                            : 'bg-gray-50 text-gray-600 border-gray-100'
                                                    }
                                                `}
                                            >
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{request.item_name}</td>
                                        <td className="px-4 py-3">
                                            {account?.firstname} {account?.lastname}
                                        </td>
                                        <td className="px-4 py-3">{request.quantity}</td>
                                        <td className="px-4 py-3">{request.borrow_date}</td>
                                        <td className="px-4 py-3">{request.return_date}</td>
                                        <td className="px-4 py-3 flex flex-col gap-2 min-w-[120px]">
                                            <select
                                                className="w-full md:w-auto px-2 py-1 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 shadow-sm transition-all duration-200 cursor-pointer text-xs"
                                                value={request.status}
                                                onChange={async (e) => {
                                                    const newStatus = e.target.value;
                                                    if (newStatus !== request.status) {
                                                        if (newStatus === 'Approved') {
                                                            await handleApprove(request.id);
                                                        } else if (newStatus === 'Rejected') {
                                                            await handleReject(request.id);
                                                        } else if (newStatus === 'Processing') {
                                                            await handleProcessing(request.id);
                                                        } else if (newStatus === 'Returned') {
                                                            await handleReturned(request.id);
                                                        } else {
                                                            await updateRequestStatus(request.id, newStatus);
                                                        }
                                                        setRefresh((prev) => !prev);
                                                    }
                                                }}
                                            >
                                                <option value="Waiting" disabled={isStatusChanged}>
                                                    Waiting
                                                </option>
                                                <option value="Approved" disabled={request.status === 'Returned'}>
                                                    Approve
                                                </option>
                                                <option value="Rejected" disabled={request.status === 'Returned'}>
                                                    Reject
                                                </option>
                                                <option value="Processing" disabled={request.status === 'Returned'}>
                                                    Processing
                                                </option>
                                                <option value="Returned" disabled={request.status !== 'Approved'}>
                                                    Returned
                                                </option>
                                            </select>
                                            <ViewDetailsButton
                                                onClick={() => handleOpenModal(request, account, eic)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

