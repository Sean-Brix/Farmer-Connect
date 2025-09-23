import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import default_image from '../../../Assets/eic_default.png';
import AddEICItemModal from './addEICItem.jsx';
import {
    useEICStacks,
    useEICRequests,
    useAllItems,
    useAddEICItem,
    useEditEICItem,
    useUpdateRequestStatus,
} from './hooks/useEICQueries.js';

export default function EIC() {
    const { isDark } = useTheme();
    const [activeSection, setActiveSection] = useState('items');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('quantity');
    const [searchFilter, setSearchFilter] = useState('name');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedStack, setSelectedStack] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStack, setEditingStack] = useState(null);
    const [imageUpdateTimestamp, setImageUpdateTimestamp] = useState(
        Date.now()
    );

    // Items pagination states
    const [itemsCurrentPage, setItemsCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);

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

    // TanStack Query hooks
    const {
        data: eicStacks = [],
        isLoading: stacksLoading,
        error: stacksError,
        refetch: refetchStacks,
    } = useEICStacks();

    const {
        data: requests = [],
        isLoading: requestsLoading,
        error: requestsError,
        refetch: refetchRequests,
    } = useEICRequests();

    const {
        data: allItems = [],
        isLoading: allItemsLoading,
        error: allItemsError,
    } = useAllItems();

    const addEICItemMutation = useAddEICItem();
    const editEICItemMutation = useEditEICItem();
    const updateRequestStatusMutation = useUpdateRequestStatus();

    // Derived loading and error states
    const isLoading = stacksLoading || requestsLoading;
    const error = stacksError || requestsError || allItemsError;

    // Helper to show alert
    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(
            () => setAlert({ show: false, message: '', type: '' }),
            3000
        );
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

    // Pagination calculations for items
    const totalItemsPages = Math.ceil(filteredStacks.length / itemsPerPage);
    const itemsStartIndex = (itemsCurrentPage - 1) * itemsPerPage;
    const itemsEndIndex = itemsStartIndex + itemsPerPage;
    const paginatedStacks = filteredStacks.slice(itemsStartIndex, itemsEndIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setItemsCurrentPage(1);
    }, [search, sortBy, searchFilter]);

    const handleAddEICItem = async (formData) => {
        try {
            await addEICItemMutation.mutateAsync(formData);
            setShowAddModal(false);
            setImageUpdateTimestamp(Date.now()); // Force image refresh
            showAlert('EIC item added successfully', 'success');
        } catch (error) {
            console.error('Failed to create EIC item:', error);
            showAlert(error.message || 'Failed to add EIC item', 'error');
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
            await editEICItemMutation.mutateAsync({
                stackId: editingStack.id,
                formData,
                hasNameOrDescriptionChange,
            });

            setShowEditModal(false);
            setEditingStack(null);
            setImageUpdateTimestamp(Date.now()); // Force image refresh
            showAlert('EIC item updated successfully', 'success');
        } catch (error) {
            console.error('Failed to update EIC item:', error);
            showAlert(error.message || 'Failed to update EIC item', 'error');
        }
    };

    // Handle view requests - redirect to requests section with search filter
    const handleViewRequests = (itemName) => {
        setActiveSection('requests');
        setRequestSearch(itemName);
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

            await updateRequestStatusMutation.mutateAsync({
                requestId,
                status: newStatus,
                itemName,
                requestorName,
                requestQuantity,
                currentStock,
            });

            showAlert(
                `Request status successfully changed to ${newStatus}`,
                'success'
            );
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
                <div className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading...</div>
            </div>
        );
    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className={`text-lg ${
                    isDark ? 'text-red-400' : 'text-red-600'
                }`}>Error: {error?.message || String(error)}</div>
            </div>
        );

    return (

        <div className={`min-h-screen py-8 sm:mt-20 px-2 md:px-6 ${
            isDark 
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
                : 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
        }`}>
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

            {/* Header - Centered and Professional (Seminar style) */}
            <div className="relative mb-8 flex flex-col items-center justify-center max-w-5xl mx-auto gap-2 text-center">
              <span className="inline-flex items-center justify-center gap-3 w-full">
                <span className={`rounded-full p-2 ${
                    isDark ? 'bg-green-900' : 'bg-green-100'
                }`}>
                  <svg className="w-9 h-9 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className={`text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm ${
                    isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {activeSection === 'items'
                    ? 'Equipment in Circulation'
                    : 'EIC Requests Management'}
                </span>
              </span>
              <span className={`block text-base md:text-lg font-medium mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {activeSection === 'items'
                  ? 'Manage and monitor all equipment in circulation.'
                  : 'Oversee and process all EIC requests efficiently.'}
              </span>
            </div>
          
            {/* Divider between title and search/filters */}
            {activeSection !== 'requests' && (
                <hr className={`border-t my-6 w-full max-w-5xl mx-auto ${
                    isDark ? 'border-gray-600' : 'border-gray-300'
                }`} />
            )}

            {activeSection === 'requests' ? (

                <div className="max-w-5xl mx-auto">
                    {/* Distribution-style Search/Filters/Buttons Layout for Requests */}
                    <div className="relative w-full max-w-5xl mx-auto px-2 md:px-6 mb-4">
                        <div className="flex flex-col sm:flex-row items-stretch w-full gap-2 sm:gap-4">
                            <div className="relative w-full sm:flex-1">
                                <input
                                    type="search"
                                    placeholder="Search by item name, requestor, or note..."
                                    className={`block w-full pl-10 pr-3 py-2 text-base border rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all ${
                                        isDark 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                    }`}
                                    value={requestSearch}
                                    onChange={(e) => setRequestSearch(e.target.value)}
                                    aria-label="Search requests"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-green-400"
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
                            </div>
                            <div className="flex-shrink-0 flex justify-end items-center w-full sm:w-auto">
                                <button
                                    onClick={refetchRequests}
                                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-all focus:outline-none focus:ring-2 focus:ring-green-300 shadow-sm"
                                    style={{ minWidth: '120px' }}
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
                                <span className="hidden sm:inline-block w-2"></span>
                                <button
                                    onClick={() => setActiveSection('items')}
                                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
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
                    </div>

                    <div className="relative w-full max-w-5xl mx-auto px-2 md:px-6 mb-8">
                        <div className="flex flex-row gap-2 flex-1">
                            <select
                                className={`text-sm rounded-xl focus:ring-green-400 focus:border-green-400 py-2 px-3 transition-all min-w-[120px] w-full sm:w-auto ${
                                    isDark 
                                        ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                        : 'bg-gray-50 border-gray-200 text-gray-700'
                                }`}
                                value={requestStatusFilter}
                                onChange={(e) => setRequestStatusFilter(e.target.value)}
                                aria-label="Filter by status"
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
                                className={`text-sm rounded-xl focus:ring-green-400 focus:border-green-400 py-2 px-3 transition-all min-w-[120px] w-full sm:w-auto ${
                                    isDark 
                                        ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                        : 'bg-gray-50 border-gray-200 text-gray-700'
                                }`}
                                value={requestSortBy}
                                onChange={(e) => setRequestSortBy(e.target.value)}
                                aria-label="Sort by"
                            >
                                <option value="status">Sort by Status</option>
                                <option value="date">Sort by Date</option>
                                <option value="item">Sort by Item</option>
                                <option value="client">Sort by Client</option>
                            </select>
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
                    {/* Distribution-style Search/Filters/Buttons Layout */}
                    <div className="relative w-full max-w-5xl mx-auto px-2 md:px-6 mb-4">
                        <div className="flex flex-col sm:flex-row items-stretch w-full gap-2 sm:gap-4">
                            <div className="relative w-full sm:flex-1">
                                <input
                                    type="search"
                                    placeholder="Search items, categories, descriptions..."
                                    className={`block w-full pl-10 pr-3 py-2 text-base border rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder-gray-400 ${
                                        isDark 
                                            ? 'bg-gray-700 border-gray-600 text-white' 
                                            : 'bg-gray-50 border-gray-200 text-gray-900'
                                    }`}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    aria-label="Search EIC items"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-green-400"
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
                            </div>
                            <div className="flex-shrink-0 flex justify-end items-center w-full sm:w-auto">
                                <button
                                    onClick={refetchStacks}
                                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-all focus:outline-none focus:ring-2 focus:ring-green-300 shadow-sm"
                                    style={{ minWidth: '120px' }}
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
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full max-w-5xl mx-auto px-2 md:px-6 mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full">
                            <div className="flex flex-row gap-2 flex-1">
                                <select
                                    className={`text-sm rounded-xl focus:ring-green-400 focus:border-green-400 py-2 px-3 transition-all min-w-[120px] w-full sm:w-auto border-2 ${
                                        isDark 
                                            ? 'bg-gray-700 border-gray-500 text-gray-200 hover:border-gray-400' 
                                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400'
                                    }`}
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                    aria-label="Filter by"
                                >
                                    <option value="name">Item Name</option>
                                    <option value="category">Category</option>
                                    <option value="description">Description</option>
                                </select>
                                <select
                                    className={`text-sm rounded-xl focus:ring-green-400 focus:border-green-400 py-2 px-3 transition-all min-w-[120px] w-full sm:w-auto border-2 ${
                                        isDark 
                                            ? 'bg-gray-700 border-gray-500 text-gray-200 hover:border-gray-400' 
                                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400'
                                    }`}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    aria-label="Sort by"
                                >
                                    <option value="default">Default Order</option>
                                    <option value="name">Sort by Name</option>
                                    <option value="category">Sort by Category</option>
                                    <option value="quantity">Sort by Quantity</option>
                                    <option value="date">Sort by Date</option>
                                </select>
                            </div>
                            <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-end flex-shrink-0 w-full sm:w-auto">
                                <button
                                    onClick={handleRequestsButtonClick}
                                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-700 hover:bg-slate-800 text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 shadow-sm"
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
                                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-all focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
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
                                    Add Item
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="w-full max-w-7xl mx-auto px-2 md:px-8">
                        <div className={`rounded-t-xl shadow-lg border overflow-hidden ${
                            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                            {/* Table Header */}
                            <div className={`px-6 py-4 border-b ${
                                isDark ? 'bg-green-800 border-green-700' : 'bg-green-600 border-green-700'
                            }`}>
                                <div className="grid grid-cols-12 gap-4 items-center font-semibold text-sm uppercase">
                                    <div className={`col-span-3 ${isDark ? 'text-green-100' : 'text-white'}`}>Item Name</div>
                                    <div className={`col-span-2 ${isDark ? 'text-green-100' : 'text-white'}`}>Category</div>
                                    <div className={`col-span-2 ${isDark ? 'text-green-100' : 'text-white'}`}>Quantity</div>
                                    <div className={`col-span-2 ${isDark ? 'text-green-100' : 'text-white'}`}>Date Added</div>
                                    <div className={`col-span-3 text-right ${isDark ? 'text-green-100' : 'text-white'}`}>Actions</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {paginatedStacks.map((stack) => (
                                    <EICItemRow
                                        key={stack.id}
                                        stack={stack}
                                        onViewDetails={handleViewDetails}
                                        onEdit={handleEditStack}
                                        imageUpdateTimestamp={imageUpdateTimestamp}
                                        isDark={isDark}
                                    />
                                ))}

                                {filteredStacks.length === 0 && (
                                    <div className={`col-span-full text-center py-16 text-base font-medium ${
                                        isDark ? 'text-gray-400' : 'text-gray-400'
                                    }`}>
                                        No EIC items found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Showing items info and rows per page selector */}
                    {paginatedStacks && paginatedStacks.length > 0 && (
                        <div className="w-full max-w-7xl mx-auto px-2 md:px-8 mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-xs ${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    Showing {paginatedStacks.length} of {filteredStacks?.length || 0} items
                                </span>
                                
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs ${
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        Rows per page:
                                    </span>
                                    <div className="relative">
                                        <select
                                            className={`appearance-none border-2 text-sm rounded-lg focus:ring-1 focus:ring-green-600 focus:border-green-600 block py-2 pl-3 pr-10 min-w-[70px] transition ${
                                                isDark 
                                                    ? 'bg-gray-700 border-gray-500 text-gray-200 hover:border-gray-400' 
                                                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setItemsCurrentPage(1); // Reset to first page when changing items per page
                                            }}
                                            aria-label="Rows per page"
                                        >
                                            <option value={6}>6</option>
                                            <option value={12}>12</option>
                                            <option value={24}>24</option>
                                            <option value={48}>48</option>
                                        </select>
                                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#059669' }}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pagination Controls - Professional layout matching Seminar */}
                    {totalItemsPages > 1 && (
                        <div className="flex justify-center items-center gap-4 py-8">
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isDark 
                                        ? 'border-green-600 bg-gray-800 text-green-400 hover:bg-gray-700 hover:border-green-500' 
                                        : 'border-green-300 bg-white text-green-700 hover:bg-green-50 hover:border-green-400'
                                }`}
                                onClick={() => setItemsCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={itemsCurrentPage === 1}
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
                                Page {itemsCurrentPage} of {totalItemsPages}
                            </div>
                            
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isDark 
                                        ? 'border-green-600 bg-gray-800 text-green-400 hover:bg-gray-700 hover:border-green-500' 
                                        : 'border-green-300 bg-white text-green-700 hover:bg-green-50 hover:border-green-400'
                                }`}
                                onClick={() => setItemsCurrentPage(prev => Math.min(totalItemsPages, prev + 1))}
                                disabled={itemsCurrentPage === totalItemsPages}
                            >
                                Next
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
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

// =================================================================
// REQUESTS TABLE COMPONENT
// =================================================================

function RequestsTable({
    requests,
    search,
    statusFilter,
    sortBy,
    onStatusChange,
}) {
    const { isDark } = useTheme();
    const [expandedNotes, setExpandedNotes] = React.useState(new Set());
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

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

    // Pagination calculations
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter, sortBy]);

    // Close expanded notes when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.note-tooltip-container')) {
                setExpandedNotes(new Set());
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleNoteExpansion = (requestId) => {
        setExpandedNotes(prev => {
            const newSet = new Set();
            if (!prev.has(requestId)) {
                newSet.add(requestId);
            }
            return newSet;
        });
    };

    const renderNote = (request) => {
        if (!request.requestNote) return null;
        
        const isExpanded = expandedNotes.has(request.id);
        const isLong = request.requestNote.length > 50;
        
        return (
            <div className={`text-xs rounded px-2 py-1 max-w-xs relative note-tooltip-container ${
                isDark 
                    ? 'text-gray-400 bg-gray-700' 
                    : 'text-gray-500 bg-gray-50'
            }`}>
                <div className={isExpanded ? '' : 'truncate'}>
                    {isLong && !isExpanded ? request.requestNote.substring(0, 50) + '...' : request.requestNote}
                </div>
                {isLong && (
                    <div className="relative inline-block">
                        <button
                            onClick={() => toggleNoteExpansion(request.id)}
                            className="text-green-600 hover:text-green-800 font-medium mt-1 text-xs underline"
                        >
                            {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                        
                        {/* Tooltip popup for full note */}
                        {isExpanded && (
                            <div className="absolute z-50 bottom-full left-0 mb-2 w-80 max-w-sm">
                                <div className="bg-gray-900 text-white text-xs rounded-lg px-4 py-3 shadow-2xl border border-gray-700 backdrop-blur-sm">
                                    {/* Arrow pointing down */}
                                    <div className="absolute top-full left-4 w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent border-t-[6px] border-t-gray-900"></div>
                                    
                                    {/* Header */}
                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-700 mb-2">
                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span className="font-semibold text-gray-200">Request Note</span>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className={`leading-relaxed max-h-32 overflow-y-auto ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        {request.requestNote}
                                    </div>
                                    
                                    {/* Footer */}
                                    <div className={`mt-2 pt-2 border-t text-right ${
                                        isDark ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                        <span className={`text-xs ${
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`}>Click "Show less" to close</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            Pending: isDark ? 'bg-yellow-800 text-yellow-200 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Approved: isDark ? 'bg-green-800 text-green-200 border-green-700' : 'bg-green-100 text-green-800 border-green-200',
            Rejected: isDark ? 'bg-red-800 text-red-200 border-red-700' : 'bg-red-100 text-red-800 border-red-200',
            Returned: isDark ? 'bg-gray-600 text-gray-200 border-gray-500' : 'bg-gray-100 text-gray-800 border-gray-200',
            No_Return: isDark ? 'bg-purple-800 text-purple-200 border-purple-700' : 'bg-purple-100 text-purple-800 border-purple-200',
            late_return: isDark ? 'bg-orange-800 text-orange-200 border-orange-700' : 'bg-orange-100 text-orange-800 border-orange-200',
            No_Pickup: isDark ? 'bg-indigo-800 text-indigo-200 border-indigo-700' : 'bg-indigo-100 text-indigo-800 border-indigo-200',
            Cancelled: isDark ? 'bg-gray-600 text-gray-300 border-gray-500' : 'bg-gray-100 text-gray-600 border-gray-200',
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    statusStyles[status] ||
                    (isDark ? 'bg-gray-600 text-gray-200 border-gray-500' : 'bg-gray-100 text-gray-800 border-gray-200')
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
                <h3 className={`text-lg font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                } mb-2`}>
                    No Requests Found
                </h3>
                <p className={`${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                    No requests match your current filters.
                </p>
            </div>
        );
    }

    return (
        <div className={`shadow-lg rounded-xl overflow-hidden border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
            {/* Mobile-friendly card layout for small screens */}
            <div className="block lg:hidden">
                <div className="p-6 space-y-4">
                    {paginatedRequests.map((request, index) => (
                        <div
                            key={request.id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className={`font-semibold text-sm ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {request.itemName}
                                    </h4>
                                    <p className={`text-xs mt-1 ${
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {request.itemCategory}
                                    </p>
                                </div>
                                {getStatusBadge(request.status)}
                            </div>
                            
                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className={`font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Requestor:</span>
                                    <p className={`${
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>{request.requestorName}</p>
                                </div>
                                <div>
                                    <span className={`font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Quantity:</span>
                                    <p className={`${
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>{request.requestQuantity}</p>
                                </div>
                                <div>
                                    <span className={`font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Requested:</span>
                                    <p className={`${
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <span className={`font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Stock:</span>
                                    <p className={`${
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>{request.currentStock || 'N/A'}</p>
                                </div>
                            </div>
                            
                            {/* Notes */}
                            {request.requestNote && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    {renderNote(request)}
                                </div>
                            )}
                            
                            {/* Actions */}
                            {getStatusOptions(request.status).length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <select
                                        value=""
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                onStatusChange(
                                                    request.id,
                                                    e.target.value,
                                                    request.itemName,
                                                    request.requestorName,
                                                    request.requestQuantity,
                                                    request.currentStock
                                                );
                                                e.target.value = '';
                                            }
                                        }}
                                        className={`w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            isDark 
                                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    >
                                        <option value="">Change Status</option>
                                        {getStatusOptions(request.status).map((status) => (
                                            <option key={status} value={status}>
                                                {status.replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Desktop table layout */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className={`border-b ${
                        isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                        <tr>
                            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Item Details
                            </th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Requestor
                            </th>
                            <th className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Qty
                            </th>
                            <th className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Stock
                            </th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Dates
                            </th>
                            <th className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Status
                            </th>
                            <th className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${
                        isDark 
                            ? 'bg-gray-800 divide-gray-700' 
                            : 'bg-white divide-gray-200'
                    }`}>
                        {paginatedRequests.map((request, index) => (
                            <tr
                                key={request.id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1">
                                        <div className={`font-medium text-sm ${
                                            isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {request.itemName}
                                        </div>
                                        <div className={`text-xs flex items-center ${
                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            {request.itemCategory}
                                        </div>
                                        {renderNote(request)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1">
                                        <div className={`font-medium text-sm ${
                                            isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {request.requestorName}
                                        </div>
                                        <div className={`text-xs ${
                                            isDark ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            {request.requestorEmail}
                                        </div>
                                        <div className={`text-xs ${
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            @{request.requestorUsername}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        isDark ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
                                    }`}>
                                        {request.requestQuantity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`text-sm ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {request.currentStock || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1 text-xs">
                                        <div className={`${
                                            isDark ? 'text-gray-300' : 'text-gray-900'
                                        }`}>
                                            <span className="font-medium">Requested:</span>
                                            <br />
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </div>
                                        {request.pickupDate && (
                                            <div className="text-green-600">
                                                <span className="font-medium">Pickup:</span>
                                                <br />
                                                {new Date(request.pickupDate).toLocaleDateString()}
                                            </div>
                                        )}
                                        {request.returnDate && (
                                            <div className="text-gray-600">
                                                <span className="font-medium">Return:</span>
                                                <br />
                                                {new Date(request.returnDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {getStatusBadge(request.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {getStatusOptions(request.status).length > 0 ? (
                                        <select
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    onStatusChange(
                                                        request.id,
                                                        e.target.value,
                                                        request.itemName,
                                                        request.requestorName,
                                                        request.requestQuantity,
                                                        request.currentStock
                                                    );
                                                    e.target.value = '';
                                                }
                                            }}
                                            className={`text-xs px-2 py-1 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                                isDark 
                                                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                                    : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        >
                                            <option value="">Change Status</option>
                                            {getStatusOptions(request.status).map((status) => (
                                                <option key={status} value={status}>
                                                    {status.replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="text-xs text-gray-400">No actions</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Controls */}
            {filteredRequests.length > 0 && (
                <div className={`px-6 py-4 border-t ${
                    isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>Show:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className={`text-sm border rounded-md px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                    isDark 
                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                        : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span className={`text-sm ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>per page</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(endIndex, filteredRequests.length)}</span> of{' '}
                                <span className="font-medium">{filteredRequests.length}</span> results
                            </span>
                        </div>
                        
                        {totalPages > 1 && (
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                        isDark 
                                            ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                        isDark 
                                            ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    Previous
                                </button>
                                
                                {/* Page Numbers */}
                                {(() => {
                                    const maxPagesToShow = Math.min(5, totalPages);
                                    let startPage, endPage;
                                    
                                    if (totalPages <= 5) {
                                        startPage = 1;
                                        endPage = totalPages;
                                    } else {
                                        if (currentPage <= 3) {
                                            startPage = 1;
                                            endPage = 5;
                                        } else if (currentPage + 2 >= totalPages) {
                                            startPage = totalPages - 4;
                                            endPage = totalPages;
                                        } else {
                                            startPage = currentPage - 2;
                                            endPage = currentPage + 2;
                                        }
                                    }
                                    
                                    const pageButtons = [];
                                    for (let i = startPage; i <= endPage; i++) {
                                        pageButtons.push(
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i)}
                                                className={`px-3 py-1 text-sm border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                                    currentPage === i
                                                        ? 'bg-green-600 text-white border-green-600'
                                                        : isDark 
                                                            ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {i}
                                            </button>
                                        );
                                    }
                                    return pageButtons;
                                })()}
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                        isDark 
                                            ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                        isDark 
                                            ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    Last
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Summary Footer */}
            <div className={`px-6 py-4 border-t ${
                isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
                <div className={`text-sm font-medium text-right ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Showing <span className={`font-bold ${
                        isDark ? 'text-green-400' : 'text-green-700'
                    }`}>{paginatedRequests.length}</span> of <span className={`font-bold ${
                        isDark ? 'text-green-400' : 'text-green-700'
                    }`}>{filteredRequests.length}</span> filtered requests
                    {filteredRequests.length !== requests.length && (
                        <span className={`${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}> (from {requests.length} total)</span>
                    )}
                </div>
            </div>
        </div>
    );
}

// =================================================================
// EIC ITEM CARD COMPONENT
// =================================================================

function EICItemRow({ stack, onViewDetails, onEdit, imageUpdateTimestamp, isDark }) {
    const [showDescription, setShowDescription] = useState(false);
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const truncatedDescription =
        stack.item?.description && stack.item.description.length > 50
            ? stack.item.description.slice(0, 50) + '...'
            : stack.item?.description;

    return (
        <>
            <div className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}>
                <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Item Name - Col 3 */}
                    <div className="col-span-3">
                        <div className="min-w-0">
                            <h3 className={`font-semibold text-sm truncate ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                                {stack.item?.name || 'Unknown Item'}
                            </h3>
                            <p className={`text-xs truncate ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                                {truncatedDescription || 'No description'}
                            </p>
                        </div>
                    </div>

                    {/* Category - Col 2 */}
                    <div className="col-span-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isDark 
                                ? 'bg-green-900/30 text-green-300' 
                                : 'bg-green-100 text-green-800'
                        }`}>
                            {stack.item?.category?.replace('_', ' ') || 'N/A'}
                        </span>
                    </div>

                    {/* Quantity - Col 2 */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-1">
                            <span className={`font-medium ${
                                isDark ? 'text-gray-200' : 'text-gray-900'
                            }`}>
                                {stack.quantity}
                            </span>
                            <span className={`text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                                units
                            </span>
                        </div>
                    </div>

                    {/* Date Added - Col 2 */}
                    <div className="col-span-2">
                        <span className={`text-sm ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            {formatDate(stack.createdAt)}
                        </span>
                    </div>

                    {/* Actions - Col 3 */}
                    <div className="col-span-3 flex justify-end space-x-2">
                        <button
                            onClick={() => onViewDetails(stack)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                isDark 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            View
                        </button>
                        <button
                            onClick={() => onEdit(stack)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                isDark 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </div>

            {/* Expandable Description Row */}
            {showDescription && (
                <div className={`px-6 py-4 border-t ${
                    isDark 
                        ? 'bg-gray-800 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                }`}>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <h4 className={`font-medium text-sm mb-2 ${
                                isDark ? 'text-gray-200' : 'text-gray-800'
                            }`}>
                                Description:
                            </h4>
                            <p className={`text-sm ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                {stack.item?.description || 'No description available'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// =================================================================
// EIC DETAIL MODAL COMPONENT
// =================================================================

function EICDetailModal({
    stack,
    onClose,
    imageUpdateTimestamp,
    onViewRequests,
}) {
    const { isDark } = useTheme();
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className={`rounded-xl shadow-2xl max-w-2xl w-full border overflow-hidden max-h-[95vh] overflow-y-auto ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                {/* Header */}
                <div className={`border-b px-6 py-4 ${
                    isDark 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold ${
                                    isDark ? 'text-white' : 'text-gray-800'
                                }`}>EIC Item Details</h3>
                                <p className={`text-sm ${
                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>View item information and statistics</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 ${
                                isDark 
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700 focus:ring-gray-600' 
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-300'
                            }`}
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* IMAGE */}
                <div className={`w-full h-64 flex items-center justify-center overflow-hidden ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
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
                        className={`text-3xl flex flex-col items-center ${
                            isDark ? 'text-gray-500' : 'text-gray-400'
                        }`}
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
                <div className={`px-6 py-6 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="mb-4">
                        <span className={`text-xs uppercase tracking-widest font-semibold ${
                            isDark ? 'text-gray-400' : 'text-gray-400'
                        }`}>
                            Item Name
                        </span>
                        <h1 className={`text-2xl font-bold mt-1 ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            {stack.item?.name || 'Unknown Item'}
                        </h1>
                    </div>

                    <div className="mb-6">
                        <span className={`text-xs uppercase tracking-widest font-semibold ${
                            isDark ? 'text-gray-400' : 'text-gray-400'
                        }`}>
                            Description
                        </span>
                        <p className={`${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        } mt-1 leading-relaxed`}>
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
                                        ? isDark ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
                                        : stack.item?.category === 'Harvesting Tools'
                                        ? isDark ? 'bg-pink-800 text-pink-200' : 'bg-pink-100 text-pink-800'
                                        : stack.item?.category === 'Irrigation Systems'
                                        ? isDark ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800'
                                        : stack.item?.category === 'Storage Equipment'
                                        ? isDark ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                                        : stack.item?.category === 'Processing Equipment'
                                        ? isDark ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
                                        : stack.item?.category === 'Safety Gear'
                                        ? isDark ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800'
                                        : stack.item?.category === 'Pest Control'
                                        ? isDark ? 'bg-indigo-800 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
                                        : stack.item?.category === 'Livestock Equipment'
                                        ? isDark ? 'bg-orange-800 text-orange-200' : 'bg-orange-100 text-orange-800'
                                        : stack.item?.category === 'Measuring Tools'
                                        ? isDark ? 'bg-teal-800 text-teal-200' : 'bg-teal-100 text-teal-800'
                                        : stack.item?.category === 'Fisheries'
                                        ? isDark ? 'bg-lime-800 text-lime-200' : 'bg-lime-100 text-lime-800'
                                        : stack.item?.category === 'Machinery'
                                        ? isDark ? 'bg-cyan-800 text-cyan-200' : 'bg-cyan-100 text-cyan-800'
                                        : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
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
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold cursor-default ${
                                isDark ? 'bg-orange-800 text-orange-200' : 'bg-orange-100 text-orange-800'
                            }`}
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
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold cursor-default ${
                                isDark ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
                            }`}
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
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
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

                {/* Footer */}
                <div className={`border-t px-6 py-4 flex justify-between items-center ${
                    isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                    {/* CREATED AT */}
                    <div>
                        <span className={`block text-xs font-medium ${
                            isDark ? 'text-gray-400' : 'text-gray-400'
                        }`}>
                            Added to EIC
                        </span>
                        <span className={`block text-sm ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            {formatDateTime(stack.createdAt)}
                        </span>
                    </div>
                    {/* UPDATED AT */}
                    <div className="text-right">
                        <span className={`block text-xs font-medium ${
                            isDark ? 'text-gray-400' : 'text-gray-400'
                        }`}>
                            Last Updated
                        </span>
                        <span className={`block text-sm ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
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

// =================================================================
// EIC EDIT MODAL COMPONENT
// =================================================================

function EICEditModal({ stack, onClose, onSubmit, imageUpdateTimestamp }) {
    const { isDark } = useTheme();
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
    const [showImagePreview, setShowImagePreview] = useState(false);

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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className={`rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border max-h-[95vh] overflow-y-auto ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                {/* Header */}
                <div className={`border-b px-6 py-4 ${
                    isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold ${
                                    isDark ? 'text-white' : 'text-gray-800'
                                }`}>Edit EIC Item</h3>
                                <p className={`text-sm ${
                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>Modify item details and inventory</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 ${
                                isDark 
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700 focus:ring-gray-600' 
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-300'
                            }`}
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="px-4 md:px-8 py-6 space-y-4">
                    {/* Item Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className={`block text-sm font-medium mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}
                        >
                            Item Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                            required
                        />
                        {formData.name !== originalData.name && (
                            <p className={`text-xs mt-1 ${
                                isDark ? 'text-amber-400' : 'text-amber-600'
                            }`}>
                                ⚠️ Changing the name will update the item in
                                inventory
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className={`block text-sm font-medium mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                        />
                        {formData.description !== originalData.description && (
                            <p className={`text-xs mt-1 ${
                                isDark ? 'text-amber-400' : 'text-amber-600'
                            }`}>
                                ⚠️ Changing the description will update the item
                                in inventory
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label
                            htmlFor="category"
                            className={`block text-sm font-medium mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}
                        >
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {formData.category !== originalData.category && (
                            <p className={`text-xs mt-1 ${
                                isDark ? 'text-amber-400' : 'text-amber-600'
                            }`}>
                                ⚠️ Changing the category will update the item in
                                inventory
                            </p>
                        )}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label
                            htmlFor="quantity"
                            className={`block text-sm font-medium mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}
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
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Item Image
                        </label>

                        {/* Current Image Display */}
                        {currentImageUrl && !imagePreview && (
                            <div className="mb-3">
                                <p className={`text-xs mb-2 ${
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
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
                                <p className={`text-xs mb-2 ${
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    New Image Preview:
                                </p>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded border-2 border-green-200"
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
                                className={`flex items-center px-3 py-2 rounded cursor-pointer transition text-sm ${
                                    isDark 
                                        ? 'bg-green-800 text-green-200 hover:bg-green-700' 
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
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
                            {(currentImageUrl || imagePreview) && (
                                <button
                                    type="button"
                                    onClick={() => setShowImagePreview(true)}
                                    className={`flex items-center px-3 py-2 rounded transition text-sm ${
                                        isDark 
                                            ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' 
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
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
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                    Preview
                                </button>
                            )}
                            {selectedImage && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className={`px-2 py-1 rounded text-sm transition ${
                                        isDark 
                                            ? 'bg-red-800 text-red-200 hover:bg-red-700' 
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                    }`}
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <p className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        } mt-1`}>
                            Optional. Supported formats: JPEG, PNG, GIF. Max
                            size: 5MB.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className={`border-t px-6 py-4 flex justify-end gap-3 -mx-6 -mb-6 rounded-b-xl ${
                        isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 font-medium rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${
                                isDark 
                                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600 focus:ring-gray-500' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 focus:ring-gray-300'
                            }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Image Preview Modal */}
            {showImagePreview && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
                    <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                        <button
                            onClick={() => setShowImagePreview(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                            aria-label="Close preview"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={imagePreview || currentImageUrl}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onClick={() => setShowImagePreview(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// =================================================================
