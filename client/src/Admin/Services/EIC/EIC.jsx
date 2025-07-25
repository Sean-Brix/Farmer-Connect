import React, { useState, useEffect } from 'react';

// ASSETS
import default_image from '../../../Assets/eic_default.png';
// SUB COMPONENTS
import EIC_Request from './Components/Request/EIC_Request.jsx';
import AddEICItemModal from './addEICItem.jsx';

export default function EIC() {
    const [activeSection, setActiveSection] = useState('items');
    const [eicStacks, setEicStacks] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('quantity');
    const [searchFilter, setSearchFilter] = useState('name');
    const [showAddModal, setShowAddModal] = useState(false);
    const [allItems, setAllItems] = useState([]); // For existing items in the modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedStack, setSelectedStack] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStack, setEditingStack] = useState(null);
    const [imageUpdateTimestamp, setImageUpdateTimestamp] = useState(
        Date.now()
    );

    // Request section states
    const [requestSearch, setRequestSearch] = useState('');
    const [requestStatusFilter, setRequestStatusFilter] = useState('all');
    const [requestSortBy, setRequestSortBy] = useState('status');

    // Alert state for success/error messages
    const [alert, setAlert] = useState({
        show: false,
        message: '',
        type: '',
    });

    // Helper to show alert
    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(
            () => setAlert({ show: false, message: '', type: '' }),
            3000
        );
    };

    // Fetch EIC items when component mounts or section changes
    useEffect(() => {
        if (activeSection === 'items') {
            fetchEICStacks();
            fetchAllItems(); // Fetch all items for the dropdown
        } else if (activeSection === 'requests') {
            fetchRequests();
        }
    }, [activeSection]);

    const fetchRequests = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/eic/request/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch requests: ${response.status}`);
            }

            const result = await response.json();
            setRequests(result.requests || []);
        } catch (err) {
            console.error('Error fetching requests:', err);
            setError(
                'Unable to load request data. Please check your connection and try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllItems = async () => {
        try {
            const response = await fetch('/api/inventory/all/items', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch all items: ${response.status}`
                );
            }

            const result = await response.json();
            setAllItems(result || []);
        } catch (err) {
            console.error('Error fetching all items:', err);
        }
    };

    const fetchEICStacks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/eic/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch EIC stacks: ${response.status}`
                );
            }

            const result = await response.json();

            // The API now returns a direct array instead of wrapped object
            setEicStacks(result || []);
        } catch (err) {
            console.error('Error fetching EIC stacks:', err);
            setError(
                'Unable to load EIC data. Please check your connection and try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Filter and sort stacks based on search and sort options
    const filteredStacks = eicStacks
        .filter((stack) => {
            const searchValue = search.toLowerCase();
            const matchesSearch =
                searchFilter === 'name'
                    ? stack.item?.name?.toLowerCase().includes(searchValue) ||
                      false
                    : searchFilter === 'category'
                    ? stack.item?.category
                          ?.toLowerCase()
                          .includes(searchValue) || false
                    : stack.item?.description
                          ?.toLowerCase()
                          .includes(searchValue) || false;

            return matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return (a.item?.name || '').localeCompare(
                        b.item?.name || ''
                    );
                case 'category':
                    return (a.item?.category || '').localeCompare(
                        b.item?.category || ''
                    );
                case 'quantity':
                    return b.quantity - a.quantity; // Descending order
                case 'date':
                    return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
                case 'default':
                default:
                    return 0; // Keep original server order
            }
        });

    const handleAddEICItem = async (formData) => {
        try {
            const response = await fetch('/api/inventory/item/add', {
                method: 'POST',
                body: formData, // Send FormData directly for file upload
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setShowAddModal(false);
            setImageUpdateTimestamp(Date.now()); // Force image refresh
            await fetchEICStacks(); // Refresh EIC items
            await fetchAllItems(); // Refresh all items for dropdown
            showAlert('EIC item added successfully', 'success');
        } catch (error) {
            console.error('Failed to create EIC item:', error);
            showAlert('Failed to add EIC item', 'error');
        }
    };

    // Handle opening detail modal
    const handleViewDetails = (stack) => {
        setSelectedStack(stack);
        setShowDetailModal(true);
    };

    // Handle closing detail modal
    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedStack(null);
    };

    // Handle opening edit modal
    const handleEditStack = (stack) => {
        setEditingStack(stack);
        setShowEditModal(true);
    };

    // Handle closing edit modal
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingStack(null);
    };

    // Handle edit form submission
    const handleEditSubmit = async (formData, hasNameOrDescriptionChange) => {
        // Show confirmation if name or description changed
        if (hasNameOrDescriptionChange) {
            const confirmed = window.confirm(
                'You have changed the name, description, or category. This will update the item in the entire inventory system. Do you want to continue?'
            );
            if (!confirmed) {
                return;
            }
        }

        try {
            const response = await fetch(`/api/eic/item/${editingStack.id}`, {
                method: 'PUT',
                body: formData, // Send FormData directly for file upload
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.error ||
                        `HTTP error! status: ${response.status}`
                );
            }

            // Check for success response
            if (responseData.success) {
                setShowEditModal(false);
                setEditingStack(null);
                setImageUpdateTimestamp(Date.now()); // Force image refresh
                await fetchEICStacks(); // Refresh EIC items
                showAlert(
                    responseData.message || 'EIC item updated successfully',
                    'success'
                );
            } else {
                throw new Error(
                    responseData.error || 'Failed to update EIC item'
                );
            }
        } catch (error) {
            console.error('Failed to update EIC item:', error);
            showAlert(error.message || 'Failed to update EIC item', 'error');
        }
    };

    // Handle view requests - redirect to requests section with search filter
    const handleViewRequests = (itemName) => {
        setActiveSection('requests');
        setRequestSearch(itemName);
        // Ensure we fetch the latest requests data
        setTimeout(() => {
            fetchRequests();
        }, 100);
    };

    // Handle requests button click - reset all filters and go to requests section
    const handleRequestsButtonClick = () => {
        // Reset all request filters
        setRequestSearch('');
        setRequestStatusFilter('all');
        setRequestSortBy('status');
        // Switch to requests section
        setActiveSection('requests');
    };

    // Handle request status change
    const handleStatusChange = async (
        requestId,
        newStatus,
        itemName,
        requestorName,
        requestQuantity,
        currentStock
    ) => {
        try {
            // Show custom confirmation dialog
            const alertDiv = document.createElement('div');
            alertDiv.innerHTML = `
                <div id="custom-admin-confirm-alert" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease-out;
                ">
                    <div style="
                        background: white;
                        border-radius: 1.5rem;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                        padding: 0;
                        max-width: 480px;
                        width: 90vw;
                        overflow: hidden;
                        animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    ">
                        <!-- Header -->
                        <div style="
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                            padding: 2rem 2.5rem 1.5rem 2.5rem;
                            text-align: center;
                        ">
                            <div style="
                                background: rgba(255, 255, 255, 0.2);
                                border-radius: 50%;
                                width: 4rem;
                                height: 4rem;
                                margin: 0 auto 1rem auto;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <i class="fas fa-clipboard-check" style="
                                    font-size: 2rem;
                                    color: white;
                                    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
                                "></i>
                            </div>
                            <h3 style="
                                margin: 0;
                                color: white;
                                font-size: 1.5rem;
                                font-weight: 700;
                                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            ">Admin Response Required</h3>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 2rem 2.5rem;">
                            <div style="
                                background: #f8fafc;
                                border: 1px solid #e2e8f0;
                                border-radius: 0.75rem;
                                padding: 1.5rem;
                                margin-bottom: 1.5rem;
                            ">
                                <div style="margin-bottom: 1rem;">
                                    <div style="
                                        font-size: 0.875rem;
                                        color: #64748b;
                                        font-weight: 500;
                                        margin-bottom: 0.25rem;
                                    ">EQUIPMENT REQUEST</div>
                                    <div style="
                                        font-size: 1.125rem;
                                        color: #1e293b;
                                        font-weight: 600;
                                        margin-bottom: 0.5rem;
                                    ">"${itemName}"</div>
                                    <div style="
                                        font-size: 0.875rem;
                                        color: #64748b;
                                        margin-bottom: 0.5rem;
                                    ">Requested by: <strong style="color: #1e293b;">${requestorName}</strong></div>
                                    
                                    <!-- Request and Stock Information -->
                                    <div style="
                                        display: flex;
                                        gap: 1rem;
                                        margin-top: 1rem;
                                        padding: 0.75rem;
                                        background: #f1f5f9;
                                        border-radius: 0.5rem;
                                        font-size: 0.875rem;
                                    ">
                                        <div style="
                                            flex: 1;
                                            text-align: center;
                                        ">
                                            <div style="color: #64748b; font-weight: 500;">Requested</div>
                                            <div style="color: #1e293b; font-weight: 700; font-size: 1.25rem;">${requestQuantity}</div>
                                        </div>
                                        <div style="
                                            width: 1px;
                                            background: #cbd5e1;
                                        "></div>
                                        <div style="
                                            flex: 1;
                                            text-align: center;
                                        ">
                                            <div style="color: #64748b; font-weight: 500;">Available</div>
                                            <div style="
                                                color: ${
                                                    currentStock === 0
                                                        ? '#dc2626'
                                                        : currentStock < 5
                                                        ? '#d97706'
                                                        : '#16a34a'
                                                };
                                                font-weight: 700;
                                                font-size: 1.25rem;
                                            ">${currentStock}</div>
                                        </div>
                                    </div>
                                    
                                    ${
                                        requestQuantity > currentStock
                                            ? `
                                    <div style="
                                        margin-top: 0.75rem;
                                        padding: 0.75rem;
                                        background: #fef2f2;
                                        border: 1px solid #fecaca;
                                        border-radius: 0.5rem;
                                        color: #dc2626;
                                        font-size: 0.875rem;
                                        font-weight: 500;
                                        text-align: center;
                                    ">
                                        ⚠️ Warning: Insufficient stock for this request
                                    </div>
                                    `
                                            : ''
                                    }
                                </div>
                                
                                <div style="
                                    border-top: 1px solid #e2e8f0;
                                    padding-top: 1rem;
                                    text-align: center;
                                ">
                                    <div style="
                                        font-size: 1rem;
                                        color: #374151;
                                        line-height: 1.5;
                                    ">
                                        You are about to change the request status to:
                                        <br>
                                        <span style="
                                            display: inline-block;
                                            margin-top: 0.5rem;
                                            padding: 0.5rem 1rem;
                                            background: ${
                                                newStatus === 'Approved'
                                                    ? '#dcfce7'
                                                    : newStatus === 'Rejected'
                                                    ? '#fee2e2'
                                                    : newStatus === 'Returned'
                                                    ? '#f3f4f6'
                                                    : '#fef3c7'
                                            };
                                            color: ${
                                                newStatus === 'Approved'
                                                    ? '#166534'
                                                    : newStatus === 'Rejected'
                                                    ? '#dc2626'
                                                    : newStatus === 'Returned'
                                                    ? '#374151'
                                                    : '#92400e'
                                            };
                                            border-radius: 0.5rem;
                                            font-weight: 600;
                                            font-size: 1.125rem;
                                        ">${newStatus.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div style="
                                display: flex;
                                gap: 0.75rem;
                                justify-content: center;
                            ">
                                <button id="admin-cancel-btn" style="
                                    flex: 1;
                                    background: #f1f5f9;
                                    border: 2px solid #e2e8f0;
                                    color: #64748b;
                                    padding: 0.875rem 1.5rem;
                                    border-radius: 0.75rem;
                                    font-weight: 600;
                                    font-size: 1rem;
                                    cursor: pointer;
                                    transition: all 0.2s;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 0.5rem;
                                ">
                                    <i class="fas fa-times"></i>
                                    Cancel
                                </button>
                                <button id="admin-confirm-btn" style="
                                    flex: 1;
                                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                                    border: none;
                                    color: white;
                                    padding: 0.875rem 1.5rem;
                                    border-radius: 0.75rem;
                                    font-weight: 600;
                                    font-size: 1rem;
                                    cursor: pointer;
                                    transition: all 0.2s;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 0.5rem;
                                    box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3);
                                ">
                                    <i class="fas fa-check"></i>
                                    Confirm Response
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { 
                            opacity: 0; 
                            transform: translateY(40px) scale(0.95); 
                        }
                        to { 
                            opacity: 1; 
                            transform: translateY(0) scale(1); 
                        }
                    }
                    #admin-cancel-btn:hover {
                        background: #e2e8f0;
                        border-color: #cbd5e1;
                        color: #475569;
                        transform: translateY(-1px);
                    }
                    #admin-confirm-btn:hover {
                        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                        transform: translateY(-1px);
                        box-shadow: 0 8px 25px 0 rgba(59, 130, 246, 0.4);
                    }
                </style>
            `;
            document.body.appendChild(alertDiv);

            // Create a promise to handle the user's choice
            const userChoice = await new Promise((resolve) => {
                document.getElementById('admin-confirm-btn').onclick = () => {
                    document.body.removeChild(alertDiv);
                    resolve(true);
                };

                document.getElementById('admin-cancel-btn').onclick = () => {
                    document.body.removeChild(alertDiv);
                    resolve(false);
                };

                // Close on backdrop click
                alertDiv.onclick = (e) => {
                    if (e.target === alertDiv) {
                        document.body.removeChild(alertDiv);
                        resolve(false);
                    }
                };
            });

            if (!userChoice) {
                return; // User cancelled
            }

            const response = await fetch('/api/eic/request/respond', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionId: requestId,
                    status: newStatus,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                showAlert(
                    `Request status successfully changed to ${newStatus}`,
                    'success'
                );
                // Refresh the requests list
                fetchRequests();
            } else {
                throw new Error(result.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating request status:', error);
            showAlert(
                error.message || 'Failed to update request status',
                'error'
            );
        }
    };

    if (isLoading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-red-600">Error: {error}</div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 py-8 px-2 md:px-6">
            {/* Alert Component */}
            {alert.show && (
                <div
                    className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 transition-all ${
                        alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                >
                    {alert.message}
                </div>
            )}

            {/* Header */}
            <div className="relative mt-16 mb-8 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-4">
                <span className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                    <svg
                        className="w-7 h-7 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    {activeSection === 'items'
                        ? 'Equipment in Circulation'
                        : 'EIC Requests Management'}
                </span>
            </div>

            {activeSection === 'requests' ? (
                <div className="max-w-7xl mx-auto">
                    {/* Request Search and Filters */}
                    <div className="flex flex-col lg:flex-row items-center gap-4 w-full mb-6">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <input
                                type="search"
                                placeholder="Search by item name, requestor, or note..."
                                className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                value={requestSearch}
                                onChange={(e) =>
                                    setRequestSearch(e.target.value)
                                }
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                                value={requestStatusFilter}
                                onChange={(e) =>
                                    setRequestStatusFilter(e.target.value)
                                }
                            >
                                <option value="all">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Returned">Returned</option>
                                <option value="No_Return">No Return</option>
                                <option value="late_return">Late Return</option>
                                <option value="No_Pickup">No Pickup</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                                value={requestSortBy}
                                onChange={(e) =>
                                    setRequestSortBy(e.target.value)
                                }
                            >
                                <option value="status">Sort by Status</option>
                                <option value="date">Sort by Date</option>
                                <option value="item">Sort by Item</option>
                                <option value="client">Sort by Client</option>
                            </select>

                            <button
                                onClick={fetchRequests}
                                className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Refresh
                            </button>

                            <button
                                onClick={() => setActiveSection('items')}
                                className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white transition-all"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Back to Items
                            </button>
                        </div>
                    </div>

                    {/* Requests Table */}
                    <RequestsTable
                        requests={requests}
                        search={requestSearch}
                        statusFilter={requestStatusFilter}
                        sortBy={requestSortBy}
                        onStatusChange={handleStatusChange}
                    />
                </div>
            ) : (
                <>
                    {/* Search and Filters */}
                    <div className="flex flex-col lg:flex-row items-center gap-4 w-full max-w-7xl mx-auto mb-6">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <input
                                type="search"
                                placeholder="Search..."
                                className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                                value={searchFilter}
                                onChange={(e) =>
                                    setSearchFilter(e.target.value)
                                }
                            >
                                <option value="name">Item Name</option>
                                <option value="category">Category</option>
                                <option value="description">Description</option>
                            </select>

                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="default">Default Order</option>
                                <option value="name">Sort by Name</option>
                                <option value="category">
                                    Sort by Category
                                </option>
                                <option value="quantity">
                                    Sort by Quantity
                                </option>
                                <option value="date">Sort by Date</option>
                            </select>

                            <button
                                onClick={fetchEICStacks}
                                className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Refresh
                            </button>

                            <button
                                onClick={handleRequestsButtonClick}
                                className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium bg-green-500 hover:bg-green-600 text-white transition-all"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Requests
                            </button>

                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white transition-all"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M12 4v16m8-8H4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Add EIC Item
                            </button>
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredStacks.map((stack) => (
                            <EICItemCard
                                key={stack.id}
                                stack={stack}
                                onViewDetails={handleViewDetails}
                                onEdit={handleEditStack}
                                imageUpdateTimestamp={imageUpdateTimestamp}
                            />
                        ))}

                        {filteredStacks.length === 0 && (
                            <div className="col-span-full text-center text-gray-400 py-16 text-base font-medium">
                                No EIC items found.
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Add EIC Item Modal */}
            <AddEICItemModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddEICItem}
                existingItems={allItems}
                eicItems={eicStacks}
            />

            {/* Detail Modal */}
            {showDetailModal && selectedStack && (
                <EICDetailModal
                    stack={selectedStack}
                    onClose={handleCloseDetailModal}
                    imageUpdateTimestamp={imageUpdateTimestamp}
                    onViewRequests={handleViewRequests}
                />
            )}

            {/* Edit Modal */}
            {showEditModal && editingStack && (
                <EICEditModal
                    stack={editingStack}
                    onClose={handleCloseEditModal}
                    onSubmit={handleEditSubmit}
                    imageUpdateTimestamp={imageUpdateTimestamp}
                />
            )}
        </div>
    );
}

/* ================================================================================== */
/* REQUESTS TABLE COMPONENT */
/* ================================================================================== */

function RequestsTable({
    requests,
    search,
    statusFilter,
    sortBy,
    onStatusChange,
}) {
    const statusOrder = {
        Pending: 1,
        Approved: 2,
        Rejected: 3,
        Returned: 4,
        No_Return: 5,
        late_return: 6,
        No_Pickup: 7,
        Cancelled: 8,
    };

    // Filter and sort requests
    const filteredRequests = requests
        .filter((request) => {
            const searchLower = search.toLowerCase();
            const matchesSearch =
                request.itemName?.toLowerCase().includes(searchLower) ||
                request.requestorName?.toLowerCase().includes(searchLower) ||
                request.requestNote?.toLowerCase().includes(searchLower) ||
                request.requestorEmail?.toLowerCase().includes(searchLower);

            const matchesStatus =
                statusFilter === 'all' || request.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'status':
                    const statusA = statusOrder[a.status] || 999;
                    const statusB = statusOrder[b.status] || 999;
                    if (statusA !== statusB) return statusA - statusB;
                    return new Date(b.createdAt) - new Date(a.createdAt);

                case 'date':
                    return new Date(b.createdAt) - new Date(a.createdAt);

                case 'item':
                    return a.itemName?.localeCompare(b.itemName) || 0;

                case 'client':
                    return a.requestorName?.localeCompare(b.requestorName) || 0;

                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

    const getStatusBadge = (status) => {
        const statusStyles = {
            Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Approved: 'bg-green-100 text-green-800 border-green-200',
            Rejected: 'bg-red-100 text-red-800 border-red-200',
            Returned: 'bg-gray-100 text-gray-800 border-gray-200',
            No_Return: 'bg-purple-100 text-purple-800 border-purple-200',
            late_return: 'bg-orange-100 text-orange-800 border-orange-200',
            No_Pickup: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            Cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    statusStyles[status] ||
                    'bg-gray-100 text-gray-800 border-gray-200'
                }`}
            >
                {status.replace('_', ' ')}
            </span>
        );
    };

    const getStatusOptions = (currentStatus) => {
        switch (currentStatus) {
            case 'Pending':
                return ['Approved', 'Rejected'];
            case 'Approved':
                return ['Returned', 'No_Return', 'late_return', 'No_Pickup'];
            case 'Rejected':
                return ['Approved', 'Rejected'];
            case 'Cancelled':
                return []; // No actions available for cancelled requests
            default:
                return [];
        }
    };

    if (filteredRequests.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="mb-4">
                    <svg
                        className="w-16 h-16 text-gray-300 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Requests Found
                </h3>
                <p className="text-gray-500">
                    No requests match your current filters.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                            <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/4">
                                Item Details
                            </th>
                            <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Requestor
                            </th>
                            <th className="py-4 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="py-4 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="py-4 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Dates
                            </th>
                            <th className="py-4 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="py-4 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredRequests.map((request, index) => (
                            <tr
                                key={request.id}
                                className={`${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                                } hover:bg-blue-50 transition-colors`}
                            >
                                <td className="py-5 px-4">
                                    <div className="space-y-2">
                                        <div className="font-semibold text-gray-900 text-base truncate">
                                            {request.itemName}
                                        </div>
                                        <div className="text-sm text-gray-600 flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            {request.itemCategory}
                                        </div>
                                        {request.itemDateLimit && (
                                            <div className="text-xs text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded-full">
                                                <svg
                                                    className="w-3 h-3 inline mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                Max: {request.itemDateLimit}{' '}
                                                days
                                            </div>
                                        )}
                                        {request.requestNote && (
                                            <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded-lg border-l-2 border-blue-300">
                                                <svg
                                                    className="w-3 h-3 inline mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <span className="font-medium">
                                                    Note:
                                                </span>{' '}
                                                {request.requestNote}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="py-5 px-4">
                                    <div className="space-y-1">
                                        <div className="font-medium text-gray-900">
                                            {request.requestorName}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {request.requestorEmail}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            @{request.requestorUsername}
                                        </div>
                                        <div
                                            className={`text-xs px-2 py-1 rounded-full inline-block ${
                                                request.requestorAccess ===
                                                'User'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : request.requestorAccess ===
                                                      'Admin'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {request.requestorAccess}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 px-4 text-center">
                                    <span className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-bold">
                                        {request.quantity}
                                    </span>
                                </td>
                                <td className="py-5 px-4 text-center">
                                    <div className="space-y-1">
                                        <div
                                            className={`px-3 py-2 rounded-full text-sm font-bold ${
                                                request.currentStock === 0
                                                    ? 'bg-red-100 text-red-800'
                                                    : request.currentStock < 5
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                            {request.currentStock || 0}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            available
                                        </div>
                                        {request.quantity >
                                            request.currentStock && (
                                            <div className="text-xs text-red-600 font-medium">
                                                ⚠️ Insufficient
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="py-5 px-4">
                                    <div className="space-y-2">
                                        <div className="text-sm">
                                            <div className="flex items-center text-green-600">
                                                <svg
                                                    className="w-4 h-4 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                Pickup:{' '}
                                                {new Date(
                                                    request.pickupDate
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {request.returnDate && (
                                            <div className="text-sm">
                                                <div className="flex items-center text-red-600">
                                                    <svg
                                                        className="w-4 h-4 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    Return:{' '}
                                                    {new Date(
                                                        request.returnDate
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500">
                                            <svg
                                                className="w-3 h-3 inline mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            Requested:{' '}
                                            {new Date(
                                                request.createdAt
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 px-4 text-center">
                                    <div className="space-y-2">
                                        <div className="relative inline-block group">
                                            {getStatusBadge(request.status)}
                                            {request.adminName &&
                                                request.status !==
                                                    'Pending' && (
                                                    <>
                                                        {/* Hover indicator */}
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center opacity-75 group-hover:opacity-100 transition-opacity">
                                                            <svg
                                                                className="w-2 h-2 text-white"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="3"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </div>

                                                        {/* Modern Tooltip - Smart positioning */}
                                                        <div
                                                            className={`absolute left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 ease-out group-hover:translate-y-0 z-50 ${
                                                                index < 2
                                                                    ? 'top-full mt-2 translate-y-2' // Show below for first 2 rows
                                                                    : 'bottom-full mb-2 translate-y-2' // Show above for other rows
                                                            }`}
                                                        >
                                                            <div className="bg-gray-900 text-white text-xs rounded-xl px-4 py-3 shadow-2xl border border-gray-700 backdrop-blur-sm min-w-[200px]">
                                                                {/* Arrow - Dynamic positioning */}
                                                                <div
                                                                    className={`absolute left-1/2 transform -translate-x-1/2 ${
                                                                        index <
                                                                        2
                                                                            ? 'bottom-full translate-y-1' // Arrow on top when tooltip is below
                                                                            : 'top-full -translate-y-1' // Arrow on bottom when tooltip is above
                                                                    }`}
                                                                >
                                                                    <div
                                                                        className={`w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent ${
                                                                            index <
                                                                            2
                                                                                ? 'border-b-[6px] border-b-gray-900' // Point up when tooltip is below
                                                                                : 'border-t-[6px] border-t-gray-900' // Point down when tooltip is above
                                                                        }`}
                                                                    ></div>
                                                                </div>

                                                                {/* Content */}
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                                                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                                            <svg
                                                                                className="w-3 h-3 text-white"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                strokeWidth="2"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                        </div>
                                                                        <span className="font-semibold text-gray-200">
                                                                            Admin
                                                                            Response
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-gray-300 text-xs mb-1">
                                                                            Responded
                                                                            by:
                                                                        </div>
                                                                        <div className="font-bold text-white">
                                                                            {
                                                                                request.adminName
                                                                            }
                                                                        </div>
                                                                        <div className="text-gray-400 text-xs mt-1">
                                                                            {
                                                                                request.adminEmail
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className="pt-2 border-t border-gray-700">
                                                                        <div className="text-gray-400 text-xs">
                                                                            Status:{' '}
                                                                            <span className="text-white font-medium">
                                                                                {request.status.replace(
                                                                                    '_',
                                                                                    ' '
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 px-4 text-center">
                                    {getStatusOptions(request.status).length >
                                    0 ? (
                                        <select
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 font-medium cursor-pointer"
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    onStatusChange(
                                                        request.id,
                                                        e.target.value,
                                                        request.itemName,
                                                        request.requestorName,
                                                        request.quantity,
                                                        request.currentStock
                                                    );
                                                    e.target.value = '';
                                                }
                                            }}
                                        >
                                            <option value="">Respond</option>
                                            {getStatusOptions(
                                                request.status
                                            ).map((status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status.replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="text-gray-400 text-sm italic">
                                            No actions available
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                    Showing {filteredRequests.length} of {requests.length} total
                    requests
                </div>
            </div>
        </div>
    );
}

/* ================================================================================== */
/* EIC ITEM CARD COMPONENT - Matching Seminar Design Style */
/* ================================================================================== */

function EICItemCard({ stack, onViewDetails, onEdit, imageUpdateTimestamp }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const truncatedDescription =
        stack.item?.description && stack.item.description.length > 100
            ? stack.item.description.slice(0, 100) + '...'
            : stack.item?.description;

    return (
        <div className="relative flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="relative">
                <img
                    src={
                        stack.item?.id
                            ? `/api/eic/photo/${stack.item.id}?t=${imageUpdateTimestamp}`
                            : default_image
                    }
                    alt={stack.item?.name || 'EIC Item'}
                    className="w-full h-40 sm:h-48 object-cover transition-all duration-300 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = default_image;
                    }}
                />
                <span className="absolute top-3 right-3 px-3 py-0.5 rounded-full text-xs font-semibold shadow-sm bg-orange-50 text-orange-700 border border-orange-100">
                    EIC
                </span>
            </div>
            <div className="flex-1 flex flex-col p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                    {stack.item?.name || 'Unknown Item'}
                </h3>
                <p className="text-gray-600 text-sm mb-2 flex-1 cursor-default line-clamp-3">
                    {truncatedDescription || 'No description available'}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
                    <span>
                        <span className="font-medium text-gray-700">
                            Quantity:
                        </span>{' '}
                        {stack.quantity}
                    </span>
                    <span>
                        <span className="font-medium text-gray-700">
                            Category:
                        </span>{' '}
                        {stack.item?.category?.replace('_', ' ') || 'N/A'}
                    </span>
                    <span>
                        <span className="font-medium text-gray-700">
                            Date Added:
                        </span>{' '}
                        {formatDate(stack.createdAt)}
                    </span>
                </div>
                <div className="flex flex-col gap-2 mt-auto md:flex-row">
                    <button
                        onClick={() => onViewDetails(stack)}
                        className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => onEdit(stack)}
                        className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ================================================================================== */
/* EIC DETAIL MODAL COMPONENT */
/* ================================================================================== */

function EICDetailModal({
    stack,
    onClose,
    imageUpdateTimestamp,
    onViewRequests,
}) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleViewRequests = () => {
        if (onViewRequests && stack.item?.name) {
            onViewRequests(stack.item.name);
            onClose(); // Close the modal
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/60">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col mx-4">
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-orange-50 to-orange-100">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-orange-600 font-medium">
                            EIC Item Details
                        </span>
                    </div>
                    <button
                        className="text-2xl text-gray-400 hover:text-gray-700 transition-colors"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* IMAGE */}
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {stack.item?.id ? (
                        <img
                            className="object-cover w-full h-full"
                            src={`/api/eic/photo/${stack.item.id}?t=${imageUpdateTimestamp}`}
                            alt={stack.item?.name || 'EIC Item'}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display =
                                    'flex';
                            }}
                        />
                    ) : null}
                    <div
                        className="text-gray-400 text-3xl flex flex-col items-center"
                        style={{ display: stack.item?.id ? 'none' : 'flex' }}
                    >
                        <svg
                            className="w-16 h-16 mb-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        No Image Available
                    </div>
                </div>

                {/* DETAILS */}
                <div className="px-6 py-6 bg-white">
                    <div className="mb-4">
                        <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                            Item Name
                        </span>
                        <h1 className="text-2xl font-bold text-gray-900 mt-1">
                            {stack.item?.name || 'Unknown Item'}
                        </h1>
                    </div>

                    <div className="mb-6">
                        <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                            Description
                        </span>
                        <p className="text-gray-600 mt-1 leading-relaxed">
                            {stack.item?.description ||
                                'No description available'}
                        </p>
                    </div>

                    {/* PROPERTIES */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {/* CATEGORY */}
                        <span
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold cursor-default
                                ${
                                    stack.item?.category === 'Farming Equipment'
                                        ? 'bg-blue-100 text-blue-800'
                                        : stack.item?.category ===
                                          'Harvesting Tools'
                                        ? 'bg-pink-100 text-pink-800'
                                        : stack.item?.category ===
                                          'Irrigation Systems'
                                        ? 'bg-purple-100 text-purple-800'
                                        : stack.item?.category ===
                                          'Storage Equipment'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : stack.item?.category ===
                                          'Processing Equipment'
                                        ? 'bg-green-100 text-green-800'
                                        : stack.item?.category === 'Safety Gear'
                                        ? 'bg-red-100 text-red-800'
                                        : stack.item?.category ===
                                          'Pest Control'
                                        ? 'bg-indigo-100 text-indigo-800'
                                        : stack.item?.category ===
                                          'Livestock Equipment'
                                        ? 'bg-orange-100 text-orange-800'
                                        : stack.item?.category ===
                                          'Measuring Tools'
                                        ? 'bg-teal-100 text-teal-800'
                                        : stack.item?.category === 'Fisheries'
                                        ? 'bg-lime-100 text-lime-800'
                                        : stack.item?.category === 'Machinery'
                                        ? 'bg-cyan-100 text-cyan-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            title="Category"
                        >
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                            </svg>
                            {stack.item?.category?.replace('_', ' ') || 'N/A'}
                        </span>

                        {/* QUANTITY */}
                        <span
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold cursor-default"
                            title="Available Quantity"
                        >
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    x="4"
                                    y="4"
                                    width="16"
                                    height="16"
                                    rx="2"
                                    ry="2"
                                />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            {stack.quantity} Available
                        </span>

                        {/* STATUS */}
                        <span
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-semibold cursor-default"
                            title="EIC Status"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Equipment in Circulation
                        </span>
                    </div>

                    {/* VIEW REQUESTS BUTTON */}
                    <div className="mt-4">
                        <button
                            onClick={handleViewRequests}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            View Requests
                        </button>
                    </div>
                </div>

                {/* DATES */}
                <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
                    {/* CREATED AT */}
                    <div>
                        <span className="block text-xs text-gray-400 font-medium">
                            Added to EIC
                        </span>
                        <span className="block text-sm text-gray-700">
                            {formatDateTime(stack.createdAt)}
                        </span>
                    </div>
                    {/* UPDATED AT */}
                    <div className="text-right">
                        <span className="block text-xs text-gray-400 font-medium">
                            Last Updated
                        </span>
                        <span className="block text-sm text-gray-700">
                            {stack.updatedAt
                                ? formatDateTime(stack.updatedAt)
                                : formatDateTime(stack.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================================================================================== */
/* EIC EDIT MODAL COMPONENT */
/* ================================================================================== */

function EICEditModal({ stack, onClose, onSubmit, imageUpdateTimestamp }) {
    const [formData, setFormData] = useState({
        name: stack.item?.name || '',
        description: stack.item?.description || '',
        category: stack.item?.category || 'Other',
        quantity: stack.quantity || 1,
    });

    const [originalData] = useState({
        name: stack.item?.name || '',
        description: stack.item?.description || '',
        category: stack.item?.category || 'Other',
        quantity: stack.quantity || 1,
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);

    const categories = [
        'Farming Equipment',
        'Harvesting Tools',
        'Irrigation Systems',
        'Storage Equipment',
        'Processing Equipment',
        'Safety Gear',
        'Pest Control',
        'Livestock Equipment',
        'Measuring Tools',
        'Fisheries',
        'Machinery',
        'Other',
    ];

    // Load current image when modal opens
    React.useEffect(() => {
        if (stack?.item?.id) {
            setCurrentImageUrl(
                `/api/eic/photo/${stack.item.id}?t=${imageUpdateTimestamp}`
            );
        }
    }, [stack?.item?.id, imageUpdateTimestamp]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'quantity' ? parseInt(value) || 0 : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
            ];
            if (!allowedTypes.includes(file.type)) {
                alert('Please select a valid image file (JPEG, PNG, or GIF)');
                return;
            }

            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('File size must be less than 5MB');
                return;
            }

            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if name or description changed
        const hasNameOrDescriptionChange =
            formData.name !== originalData.name ||
            formData.description !== originalData.description ||
            formData.category !== originalData.category;

        // Create FormData for file upload
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('category', formData.category);
        submitData.append('quantity', formData.quantity);

        // Add image if selected
        if (selectedImage) {
            submitData.append('image', selectedImage);
        }

        onSubmit(submitData, hasNameOrDescriptionChange);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/60">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col mx-4">
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-600 font-medium">
                            Edit EIC Item
                        </span>
                    </div>
                    <button
                        className="text-2xl text-gray-400 hover:text-gray-700 transition-colors"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
                    {/* Item Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Item Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        {formData.name !== originalData.name && (
                            <p className="text-xs text-amber-600 mt-1">
                                ⚠️ Changing the name will update the item in
                                inventory
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                        {formData.description !== originalData.description && (
                            <p className="text-xs text-amber-600 mt-1">
                                ⚠️ Changing the description will update the item
                                in inventory
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {formData.category !== originalData.category && (
                            <p className="text-xs text-amber-600 mt-1">
                                ⚠️ Changing the category will update the item in
                                inventory
                            </p>
                        )}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label
                            htmlFor="quantity"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Available Quantity
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Item Image
                        </label>

                        {/* Current Image Display */}
                        {currentImageUrl && !imagePreview && (
                            <div className="mb-3">
                                <p className="text-xs text-gray-600 mb-2">
                                    Current Image:
                                </p>
                                <img
                                    src={currentImageUrl}
                                    alt="Current item"
                                    className="w-20 h-20 object-cover rounded border-2 border-gray-200"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="mb-3">
                                <p className="text-xs text-gray-600 mb-2">
                                    New Image Preview:
                                </p>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded border-2 border-blue-200"
                                />
                            </div>
                        )}

                        {/* Upload Controls */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="edit-image-upload"
                            />
                            <label
                                htmlFor="edit-image-upload"
                                className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded cursor-pointer hover:bg-blue-200 transition text-sm"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                                {currentImageUrl || imagePreview
                                    ? 'Change Image'
                                    : 'Add Image'}
                            </label>
                            {selectedImage && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                            Optional. Supported formats: JPEG, PNG, GIF. Max
                            size: 5MB.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ================================================================================== */
