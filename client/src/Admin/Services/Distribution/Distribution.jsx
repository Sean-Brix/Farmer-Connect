import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { PlantingReportProvider } from '../../../contexts/PlantingReportContext';

// ASSETS
import default_image from '../../../Assets/eic_default.png';

// COMPONENTS
import DistributionLoadingState from './components/DistributionLoadingState';
import DistributionErrorState from './components/DistributionErrorState';
import RequestSection from './components/RequestSection';
import DistributionItemCard from './components/DistributionItemCard';
import RequestCalendar from '../../../Components/Calendar/RequestCalendar.jsx';

// TANSTACK QUERY HOOKS
import {
    useDistributionStacks,
    useDistributionRequests,
    useAllItems,
    useAddDistributionItem,
    useEditDistributionItem,
    useUpdateRequestStatus,
} from './hooks/useDistributionQueries';

export default function Distribution() {
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
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Items pagination states
    const [itemsCurrentPage, setItemsCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [imageUpdateTimestamp, setImageUpdateTimestamp] = useState(
        Date.now()
    );

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

    // TANSTACK QUERY HOOKS
    const {
        data: distributionStacks = [],
        isLoading: isLoadingStacks,
        error: stacksError,
        refetch: refetchStacks,
    } = useDistributionStacks();

    const {
        data: requests = [],
        isLoading: isLoadingRequests,
        error: requestsError,
        refetch: refetchRequests,
    } = useDistributionRequests();

    const {
        data: allItems = [],
        isLoading: isLoadingAllItems,
        error: allItemsError,
    } = useAllItems();

    // MUTATIONS
    const addDistributionItemMutation = useAddDistributionItem();
    const editDistributionItemMutation = useEditDistributionItem();
    const updateRequestStatusMutation = useUpdateRequestStatus();

    // Determine loading and error states
    const isLoading =
        activeSection === 'items' ? isLoadingStacks : isLoadingRequests;
    const error =
        activeSection === 'items'
            ? stacksError?.message
            : requestsError?.message;

    // Filter and sort stacks based on search and sort options  
    const filteredStacks = distributionStacks
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
            // Define low stock threshold
            const LOW_STOCK_THRESHOLD = 10;
            const aIsLow = a.quantity <= LOW_STOCK_THRESHOLD;
            const bIsLow = b.quantity <= LOW_STOCK_THRESHOLD;
            
            // Always show low stock items first
            if (aIsLow && !bIsLow) return -1;
            if (!aIsLow && bIsLow) return 1;
            
            // Then apply selected sorting
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
                    return a.quantity - b.quantity; // Ascending for low stock visibility
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

    const handleAddDistributionItem = async (formData) => {
        try {
            await addDistributionItemMutation.mutateAsync(formData);
            setShowAddModal(false);
            setImageUpdateTimestamp(Date.now()); // Force image refresh
            showAlert('Distribution item added successfully', 'success');
        } catch (error) {
            console.error('Failed to create distribution item:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
            });

            let errorMessage = 'Failed to add distribution item';
            if (
                error.message.includes(
                    'Expected JSON response but received HTML'
                )
            ) {
                errorMessage =
                    'Server error: API endpoint not found. Please check if the server is running correctly.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            showAlert(errorMessage, 'error');
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

    // Handle preview image
    const handlePreviewImage = (stack) => {
        setPreviewImage(`/api/distribution/picture/${stack.id}?t=${imageUpdateTimestamp}`);
        setShowImagePreview(true);
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
            await editDistributionItemMutation.mutateAsync({
                stackId: editingStack.id,
                formData,
                hasNameOrDescriptionChange,
            });

            setShowEditModal(false);
            setEditingStack(null);
            setImageUpdateTimestamp(Date.now()); // Force image refresh
            showAlert('Distribution item updated successfully', 'success');
        } catch (error) {
            console.error('Failed to update distribution item:', error);
            showAlert(
                error.message || 'Failed to update distribution item',
                'error'
            );
        }
    };

    // Handle view requests - redirect to requests section with search filter
    const handleViewRequests = (itemName) => {
        setActiveSection('requests');
    };

    // Handle requests button click - go to requests section
    const handleRequestsButtonClick = () => {
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
            // Validate required parameters
            if (!itemName || !requestorName) {
                console.error(' Error updating request status: Missing required data', {
                    itemName,
                    requestorName,
                    requestId,
                });
                showAlert('Cannot update request: Missing item or requestor information', 'error');
                return;
            }

            // Create custom alert with item details
            const alertDiv = document.createElement('div');
            alertDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: fadeIn 0.3s ease-out;
            `;

            alertDiv.innerHTML = `
                <div style="
                    background: white;
                    border-radius: 1rem;
                    padding: 2rem;
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    animation: slideUp 0.3s ease-out;
                ">
                    <div style="text-align: center; margin-bottom: 1.5rem;">
                        <h2 style="
                            font-size: 1.5rem;
                            font-weight: 700;
                            color: #1e293b;
                            margin-bottom: 0.5rem;
                        ">Confirm Status Change</h2>
                        <p style="color: #64748b; font-size: 0.875rem;">
                            Please review the request details before proceeding
                        </p>
                    </div>
                    
                    <div style="
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 0.75rem;
                        padding: 1.5rem;
                        margin-bottom: 1.5rem;
                    ">
                        <div style="
                            display: flex;
                            align-items: center;
                            gap: 1rem;
                            margin-bottom: 1rem;
                        ">
                            <div style="
                                width: 3rem;
                                height: 3rem;
                                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                                border-radius: 0.75rem;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-weight: 700;
                                font-size: 1.125rem;
                                flex-shrink: 0;
                            ">${(itemName || 'U').charAt(0).toUpperCase()}</div>
                            <div style="flex: 1;">
                                <div style="
                                    font-weight: 600;
                                    color: #1e293b;
                                    font-size: 1.125rem;
                                    margin-bottom: 0.25rem;
                                ">${itemName}</div>
                                <div style="
                                    color: #64748b;
                                    font-size: 0.875rem;
                                ">Requested by ${requestorName}</div>
                            </div>
                        </div>
                        
                        <div style="
                            display: flex;
                            background: white;
                            border: 1px solid #e2e8f0;
                            border-radius: 0.75rem;
                            overflow: hidden;
                        ">
                            <div style="
                                flex: 1;
                                text-align: center;
                                padding: 1rem;
                            ">
                                <div style="color: #64748b; font-weight: 500; font-size: 0.875rem;">Requested</div>
                                <div style="color: #1e293b; font-weight: 700; font-size: 1.25rem;">${requestQuantity}</div>
                            </div>
                            <div style="
                                width: 1px;
                                background: #cbd5e1;
                            "></div>
                            <div style="
                                flex: 1;
                                text-align: center;
                                padding: 1rem;
                            ">
                                <div style="color: #64748b; font-weight: 500; font-size: 0.875rem;">Available</div>
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
                                        : newStatus === 'No_Pickup'
                                        ? '#fef3c7'
                                        : '#f3f4f6'
                                };
                                color: ${
                                    newStatus === 'Approved'
                                        ? '#166534'
                                        : newStatus === 'Rejected'
                                        ? '#dc2626'
                                        : newStatus === 'No_Pickup'
                                        ? '#92400e'
                                        : '#374151'
                                };
                                border-radius: 0.5rem;
                                font-weight: 600;
                                font-size: 1.125rem;
                            ">${newStatus.replace('_', ' ')}</span>
                        </div>
                    </div>
                    
                    <div style="
                        display: flex;
                        gap: 0.75rem;
                        justify-content: center;
                        margin-top: 1.5rem;
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

            const result = await updateRequestStatusMutation.mutateAsync({
                requestId,
                status: newStatus,
                itemName,
                requestorName,
                requestQuantity,
                currentStock,
            });

            showAlert(
                result?.transaction?.plantingReportCreated
                    ? `Status changed to ${newStatus}. Draft planting report auto-created.`
                    : `Request status successfully changed to ${newStatus}`,
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

    if (isLoading) {
        return <DistributionLoadingState />;
    }
    
    if (error) {
        const refetchFunction = activeSection === 'items' ? refetchStacks : refetchRequests;
        return <DistributionErrorState error={{ message: error }} retry={refetchFunction} />;
    }

    return (
        <div className={`min-h-screen py-8 sm:mt-20 px-2 md:px-6 relative ${
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
            
            {activeSection === 'schedule' ? (
                <RequestCalendar source="distribution" />
            ) : activeSection === 'requests' ? (
                <PlantingReportProvider>
                    <div className="max-w-7xl mx-auto">
                        <RequestSection
                            requests={requests}
                            onStatusChange={handleStatusChange}
                            onRefresh={refetchRequests}
                            onBack={() => setActiveSection('items')}
                            isLoading={isLoadingRequests}
                        />
                    </div>
                </PlantingReportProvider>
            ) : (
                <>
                    {/* Divider line removed for minimal UI */}
                    {/* Search Bar and Refresh Button - Same Row */}
                                        <div className="w-full max-w-[1400px] mx-auto px-2 md:px-8 mb-6 space-y-3">
                                            {/* Mobile: Schedule and Requests buttons on top */}
                                            <div className="flex md:hidden justify-end gap-2">
                                                <button
                                                    onClick={() => setActiveSection('schedule')}
                                                    className="flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                                                >
                                                    <svg
                                                        className="w-4 h-4 mr-2"
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
                                                    Schedule
                                                </button>
                                                <button
                                                    onClick={handleRequestsButtonClick}
                                                    className="flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-700 hover:bg-slate-800 text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 shadow-sm"
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
                                            </div>

                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            {/* Search bar */}
                                            <div className="relative flex-1 min-w-0 w-full md:w-1/2 max-w-md">
                                                <input
                                                    type="search"
                                                    placeholder="Search items, categories, descriptions..."
                                                    className={`block w-full pl-10 pr-3 py-2 text-base border rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all ${
                                                            isDark 
                                                                    ? 'text-white bg-gray-800 border-gray-600 placeholder-gray-400' 
                                                                    : 'text-gray-900 bg-gray-50 border-gray-200 placeholder-gray-400'
                                                    }`}
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    aria-label="Search distribution items"
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
                                            {/* Filters and Controls */}
                                            <div className="flex flex-row gap-2 w-full md:w-auto items-center">
                                                <select
                                                    className={`border-2 text-sm rounded-xl focus:ring-green-400 focus:border-green-400 py-2 px-3 transition-all min-w-[120px] w-full md:w-auto ${
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
                                                    className={`border-2 text-sm rounded-xl focus:ring-green-400 focus:border-green-400 py-2 px-3 transition-all min-w-[120px] w-full md:w-auto ${
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
                                                
                                                <button
                                                    onClick={handleRequestsButtonClick}
                                                    className="hidden md:flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-700 hover:bg-slate-800 text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 shadow-sm"
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
                                                    className="flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-green-700 hover:bg-green-600 text-white transition-all focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
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

                    {/* TABLE LAYOUT - Clean and professional distribution management */}
                    <div className="w-full max-w-[1400px] mx-auto px-2 md:px-8">
                        <div className={`rounded-t-xl shadow-lg border overflow-hidden ${
                            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                            {paginatedStacks && paginatedStacks.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                    <thead className={`${
                                        isDark ? 'bg-gray-800' : 'bg-gray-100'
                                    }`}>
                                        <tr>
                                            <th className="pl-6 pr-2 py-4 text-left text-base font-semibold text-green-600 uppercase tracking-wider whitespace-nowrap w-2/12 rounded-tl-lg">Item</th>
                                            <th className="pl-4 pr-4 py-4 text-left text-base font-semibold text-green-600 uppercase tracking-wider whitespace-nowrap w-2/12">Category</th>
                                            <th className="pl-4 pr-4 py-4 text-center text-base font-semibold text-green-600 uppercase tracking-wider whitespace-nowrap w-2/12">Quantity</th>
                                            <th className="pl-4 pr-4 py-4 text-center text-base font-semibold text-green-600 uppercase tracking-wider whitespace-nowrap w-2/12">Status</th>
                                            <th className="px-4 py-4 text-center text-base font-semibold text-green-600 uppercase tracking-wider whitespace-nowrap w-4/12 rounded-tr-lg">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${
                                        isDark ? 'divide-gray-700' : 'divide-gray-200'
                                    }`}>
                                        {paginatedStacks.map((stack, idx) => {
                                            const globalIdx = (itemsCurrentPage - 1) * itemsPerPage + idx;
                                            return (
                                                <tr
                                                    key={globalIdx}
                                                    className={`transition-colors duration-150 ${
                                                        isDark 
                                                            ? 'hover:bg-gray-750' 
                                                            : 'hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <td className="pl-6 pr-2 py-4 w-2/12">
                                                        <div className="min-w-0">
                                                            <div className={`text-sm font-semibold truncate ${
                                                                isDark ? 'text-white' : 'text-gray-900'
                                                            }`} title={stack.item?.name}>
                                                                {stack.item?.name || 'N/A'}
                                                            </div>
                                                            <div className={`text-xs truncate mt-0.5 ${
                                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                                            }`} title={stack.item?.description}>
                                                                {stack.item?.description && stack.item.description.length > 30 
                                                                    ? stack.item.description.slice(0, 30) + '...' 
                                                                    : stack.item?.description || 'No description'
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="pl-4 pr-4 py-4 w-2/12">
                                                        <span className="text-sm font-semibold text-green-700">
                                                            {stack.item?.category?.replace('_', ' ') || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="pl-4 pr-4 py-4 text-center w-2/12">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <span className={`text-lg font-bold ${
                                                                isDark ? 'text-green-400' : 'text-green-600'
                                                            }`}>
                                                                {stack.quantity || 0}
                                                            </span>
                                                            <span className={`text-xs ${
                                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                                            }`}>
                                                                units
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="pl-4 pr-4 py-4 text-center w-2/12">
                                                        <span className={`text-sm font-semibold ${
                                                            stack.quantity > 0
                                                                ? 'text-green-700'
                                                                : 'text-red-700'
                                                        }`}>
                                                            {stack.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-center w-4/12">
                                                        <div className="flex justify-center space-x-2">
                                                            <button
                                                                onClick={() => handleViewDetails(stack)}
                                                                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                                                    isDark 
                                                                        ? 'bg-green-600 hover:bg-green-500 text-green-100' 
                                                                        : 'bg-green-200 hover:bg-green-300 text-green-800'
                                                                }`}
                                                                title="View details"
                                                            >
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                Details
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditStack(stack)}
                                                                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                                                    isDark 
                                                                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                                                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                                }`}
                                                                title="Edit item"
                                                            >
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                </div>
                            ) : (
                                <div className={`text-center py-12 ${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 12l3-3 3 3" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium">No distribution items found</h3>
                                    <p className="mt-1 text-sm text-gray-400">Get started by adding a new distribution item.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Showing items info and rows per page selector */}
                    {paginatedStacks && paginatedStacks.length > 0 && (
                        <div className="w-full max-w-[1400px] mx-auto px-2 md:px-8 mt-4">
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
                                            className={`appearance-none border text-sm rounded-lg focus:ring-1 focus:ring-green-600 focus:border-green-600 block py-2 pl-3 pr-10 min-w-[70px] transition ${
                                                isDark 
                                                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                                    : 'bg-white border-gray-300 text-gray-700'
                                            }`}
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setItemsCurrentPage(1);
                                            }}
                                            aria-label="Rows per page"
                                        >
                                            <option value={6}>6</option>
                                            <option value={10}>10</option>
                                            <option value={12}>12</option>
                                            <option value={15}>15</option>
                                            <option value={20}>20</option>
                                            <option value={25}>25</option>
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

            {/* Add Distribution Item Modal */}
            <AddDistributionItemModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddDistributionItem}
                existingItems={allItems}
                distributionItems={distributionStacks}
                isDark={isDark}
                maxWidth="1200px"
                modalStyle={{
                    maxWidth: '99vw',
                    width: '1200px',
                    minWidth: '320px',
                    borderRadius: '1.2rem',
                    padding: '2rem 1.5rem',
                }}
            />

            {/* Detail Modal */}
            {showDetailModal && selectedStack && (
                <DistributionDetailModal
                    stack={selectedStack}
                    onClose={handleCloseDetailModal}
                    imageUpdateTimestamp={imageUpdateTimestamp}
                    onViewRequests={handleViewRequests}
                    isDark={isDark}
                    maxWidth="1200px"
                    modalStyle={{
                        maxWidth: '99vw',
                        width: '1200px',
                        minWidth: '320px',
                        borderRadius: '1.2rem',
                        padding: '2rem 1.5rem',
                    }}
                />
            )}

            {/* Edit Modal */}
            {showEditModal && editingStack && (
                <DistributionEditModal
                    stack={editingStack}
                    onClose={handleCloseEditModal}
                    onSubmit={handleEditSubmit}
                    imageUpdateTimestamp={imageUpdateTimestamp}
                    isDark={isDark}
                    maxWidth="1600px"
                    modalStyle={{
                        maxWidth: '99vw',
                        width: '1600px',
                        minWidth: '320px',
                        borderRadius: '1.2rem',
                        padding: '2rem 1.5rem',
                        marginTop: '3.5rem',
                    }}
                />
            )}
        </div>
    );
}

/* ================================================================================== */
/* INTERNAL REQUESTS TABLE COMPONENT (TO BE REMOVED) */
/* ================================================================================== */

function InternalRequestsTable({
    requests,
    search,
    statusFilter,
    sortBy,
    onStatusChange,
}) {
    const [expandedNotes, setExpandedNotes] = React.useState(new Set());
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    const statusOrder = {
        Pending: 1,
        Approved: 2,
        Rejected: 3,
        No_Pickup: 4,
        Cancelled: 5,
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
            <div className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1 max-w-xs relative note-tooltip-container">
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
                                    <div className="text-gray-300 leading-relaxed max-h-32 overflow-y-auto">
                                        {request.requestNote}
                                    </div>
                                    
                                    {/* Footer */}
                                    <div className="mt-2 pt-2 border-t border-gray-700 text-right">
                                        <span className="text-gray-400 text-xs">Click "Show less" to close</span>
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
            Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Approved: 'bg-green-100 text-green-800 border-green-200',
            Picked_Up: 'bg-blue-100 text-blue-800 border-blue-200',
            late_pickup: 'bg-orange-100 text-orange-800 border-orange-200',
            Planted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            Rejected: 'bg-red-100 text-red-800 border-red-200',
            No_Pickup: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            Cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
            Archived: 'bg-slate-100 text-slate-600 border-slate-200',
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    statusStyles[status] ||
                    'bg-gray-100 text-gray-800 border-gray-200'
                }`}
            >
                {status === 'Picked_Up' ? 'Picked Up' : 
                 status === 'late_pickup' ? 'Late Pickup' :
                 status.replace('_', ' ')}
            </span>
        );
    };

    const getStatusOptions = (currentStatus) => {
        switch (currentStatus) {
            case 'Pending':
                return ['Approved', 'Rejected'];
            case 'Approved':
                return ['Picked_Up', 'No_Pickup'];
            case 'Picked_Up':
            case 'late_pickup':
                return []; // Auto-transitions to Planted when report submitted
            case 'Planted':
                return []; // Auto-transitions to Archived when report archived
            case 'Rejected':
                return ['Approved', 'Rejected'];
            case 'Cancelled':
            case 'Archived':
                return []; // Terminal states
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
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
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
                                    <h4 className="font-semibold text-gray-900 text-sm">
                                        {request.itemName}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {request.itemCategory}
                                    </p>
                                </div>
                                {getStatusBadge(request.status)}
                            </div>
                            
                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className="font-medium text-gray-700">Requestor:</span>
                                    <p className="text-gray-600">{request.requestorName}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Quantity:</span>
                                    <p className="text-gray-600">{request.quantity}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Pickup:</span>
                                    <p className="text-gray-600">
                                        {new Date(request.pickupDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Stock:</span>
                                    <p className="text-gray-600">{request.currentStock || 'N/A'}</p>
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
                                    <div className="flex flex-wrap gap-2">
                                        {getStatusOptions(request.status).map((status) => (
                                            <button
                                                key={status}
                                                onClick={() =>
                                                    onStatusChange(
                                                        request.id,
                                                        status,
                                                        request.itemName || 'Unknown Item',
                                                        request.requestorName || 'Unknown User',
                                                        request.requestQuantity || request.quantity || 0,
                                                        request.currentStock || 0
                                                    )
                                                }
                                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                                    status === 'Approved'
                                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                                        : status === 'Rejected'
                                                        ? 'bg-gray-500 hover:bg-gray-600 text-white'
                                                        : status === 'No_Pickup'
                                                        ? 'bg-gray-400 hover:bg-gray-500 text-white'
                                                        : 'bg-gray-500 hover:bg-gray-600 text-white'
                                                }`}
                                            >
                                                {status.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Desktop table layout */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className={`${
                        isDark ? 'bg-gradient-to-r from-green-700 to-green-800' : 'bg-gradient-to-r from-green-600 to-green-700'
                    }`}>
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Item Details
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Requestor
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                Pickup Date
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedRequests.map((request, index) => (
                            <tr
                                key={request.id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1">
                                        <div className="font-medium text-gray-900 text-sm">
                                            {request.itemName}
                                        </div>
                                        <div className="text-sm text-blue-600 flex items-center">
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
                                        <div className="font-medium text-gray-900 text-sm">
                                            {request.requestorName}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {request.requestorEmail}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            @{request.requestorUsername}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                        {request.quantity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="space-y-1">
                                        <div
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                                request.currentStock === 0
                                                    ? 'bg-red-100 text-red-800'
                                                    : request.currentStock < 5
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'bg-emerald-100 text-emerald-800'
                                            }`}
                                        >
                                            {request.currentStock || 0}
                                        </div>
                                        {request.quantity > request.currentStock && (
                                            <div className="text-sm text-red-600 font-semibold">
                                                ⚠️ Insufficient
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="space-y-1 text-xs">
                                        <div className="text-green-600 font-medium">
                                            {new Date(request.pickupDate).toLocaleDateString()}
                                        </div>
                                        <div className="text-gray-500">
                                            Requested: {new Date(request.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {getStatusBadge(request.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex flex-col gap-1">
                                        {getStatusOptions(request.status).map((status) => (
                                            <button
                                                key={status}
                                                onClick={() =>
                                                    onStatusChange(
                                                        request.id,
                                                        status,
                                                        request.itemName || 'Unknown Item',
                                                        request.requestorName || 'Unknown User',
                                                        request.requestQuantity || request.quantity || 0,
                                                        request.currentStock || 0
                                                    )
                                                }
                                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                                    status === 'Approved'
                                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                                        : status === 'Rejected'
                                                        ? 'bg-gray-500 hover:bg-gray-600 text-white'
                                                        : status === 'No_Pickup'
                                                        ? 'bg-gray-400 hover:bg-gray-500 text-white'
                                                        : 'bg-gray-500 hover:bg-gray-600 text-white'
                                                }`}
                                            >
                                                {status.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Controls */}
            {filteredRequests.length > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Show:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-sm text-gray-600">per page</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
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
                                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    Previous
                                </button>
                                
                                {/* Page Numbers */}
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                                    if (pageNumber > totalPages) return null;
                                    
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`px-3 py-1 text-sm border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                                currentPage === pageNumber
                                                    ? 'bg-green-600 text-white border-green-600'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                })}
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    Last
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Summary Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 font-medium text-right">
                    Showing <span className="font-bold text-green-700">{paginatedRequests.length}</span> of <span className="font-bold text-green-700">{filteredRequests.length}</span> filtered requests
                    {filteredRequests.length !== requests.length && (
                        <span className="text-gray-500"> (from {requests.length} total)</span>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ================================================================================== */
/* INTERNAL DISTRIBUTION ITEM CARD COMPONENT (TO BE REMOVED) */
/* ================================================================================== */

function InternalDistributionItemCard({
    stack,
    onViewDetails,
    onEdit,
    imageUpdateTimestamp,
}) {
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
                            ? `/api/dist/photo/${stack.item.id}?t=${imageUpdateTimestamp}`
                            : default_image
                    }
                    alt={stack.item?.name || 'Distribution Item'}
                    className="w-full h-40 sm:h-48 object-cover transition-all duration-300 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = default_image;
                    }}
                />
                <span className="absolute top-3 right-3 px-3 py-0.5 rounded-full text-sm font-medium shadow-sm bg-blue-50 text-blue-700 border border-blue-100">
                    Distribution
                </span>
            </div>
            <div className="flex-1 flex flex-col p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                    {stack.item?.name || 'Unknown Item'}
                </h3>
                <p className="text-gray-600 text-sm mb-2 flex-1 cursor-default line-clamp-3">
                    {truncatedDescription || 'No description available'}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-600 mb-3">
                    <span>
                        <span className="font-semibold text-slate-700">
                            Quantity:
                        </span>{' '}
                        {stack.quantity === 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                                OUT OF STOCK
                            </span>
                        ) : (
                            stack.quantity
                        )}
                    </span>
                    <span>
                        <span className="font-semibold text-slate-700">
                            Category:
                        </span>{' '}
                        {stack.item?.category?.replace('_', ' ') || 'N/A'}
                    </span>
                    <span>
                        <span className="font-semibold text-slate-700">
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
                        className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ================================================================================== */
/* DISTRIBUTION DETAIL MODAL COMPONENT */
/* ================================================================================== */

function DistributionDetailModal({
    stack,
    onClose,
    imageUpdateTimestamp,
    onViewRequests,
    isDark,
}) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleViewRequests = () => {
        if (onViewRequests && stack.item?.name) {
            onViewRequests(stack.item.name);
            onClose(); // Close the modal
        }
    };

    return (
            <div className={`fixed inset-0 flex items-center justify-center z-50 px-4 ${isDark ? 'bg-black/80' : 'bg-black/60'}`}>
                <div className={`rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[95vh] overflow-y-auto border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                {/* Header */}
                <div className={`px-6 py-4 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}> 
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Distribution Item Details</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>View item information and statistics</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* IMAGE */}
                <div className={`w-full h-64 flex items-center justify-center overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}> 
                    {stack.item?.id ? (
                        <img
                            className="object-cover w-full h-full"
                            src={`/api/dist/photo/${stack.item.id}?t=${imageUpdateTimestamp}`}
                            alt={stack.item?.name || 'Distribution Item'}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display =
                                    'flex';
                            }}
                        />
                    ) : null}
                    <div
                        className={`text-3xl flex flex-col items-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
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
                <div className={`px-6 py-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}> 
                    <div className="mb-4">
                        <span className={`text-xs uppercase tracking-widest font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}> 
                            Item Name
                        </span>
                        <h1 className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}> 
                            {stack.item?.name || 'Unknown Item'}
                        </h1>
                    </div>

                    <div className="mb-6">
                        <span className={`text-xs uppercase tracking-widest font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}> 
                            Description
                        </span>
                        <p className={`mt-1 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}> 
                            {stack.item?.description ||
                                'No description available'}
                        </p>
                    </div>

                    {/* PROPERTIES */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {/* CATEGORY */}
                        <span
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium cursor-default ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}
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
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium cursor-default ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-slate-100 text-slate-800'}`}
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
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium cursor-default ${isDark ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}
                            title="Distribution Status"
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
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                />
                            </svg>
                            Available for Distribution
                        </span>
                    </div>

                    {/* VIEW REQUESTS BUTTON */}
                    <div className="mt-4">
                        <button
                            onClick={handleViewRequests}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isDark ? 'bg-green-700 hover:bg-green-600 text-green-100' : 'bg-green-500 hover:bg-green-600 text-white'}`}
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
                <div className={`px-6 py-4 border-t ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className={`flex flex-wrap gap-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}> 
                        <span>
                            <span className="font-medium">Added:</span>{' '}
                            {formatDate(stack.createdAt)}
                        </span>
                        {stack.updatedAt &&
                            stack.updatedAt !== stack.createdAt && (
                                <span>
                                    <span className="font-medium">
                                        Updated:
                                    </span>{' '}
                                    {formatDate(stack.updatedAt)}
                                </span>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================================================================================== */
/* DISTRIBUTION EDIT MODAL COMPONENT */
/* ================================================================================== */

function DistributionEditModal({
    stack,
    onClose,
    onSubmit,
    imageUpdateTimestamp,
    isDark,
}) {
    const normalizeCropType = (value) => {
        if (!value) return 'Rice';
        const base = value.toString().toLowerCase();
        if (base.includes('corn')) return 'Corn';
        if (base.includes('high_value') || base.includes('high value'))
            return 'High_Value_Crops';
        return 'Rice';
    };

    const computeInitialForm = () => ({
        quantity: stack?.quantity?.toString() || '1',
        max_quantity_per_request: stack?.max_quantity_per_request
            ? stack.max_quantity_per_request.toString()
            : '',
        description: stack?.item?.description || '',
        cropType: normalizeCropType(
            stack?.item?.seedVariety?.cropType ||
                stack?.item?.cropType ||
                stack?.item?.seedType ||
                stack?.item?.type ||
                'Rice'
        ),
        seedVarietyId:
            stack?.item?.seedVarietyId || stack?.item?.seedVariety?.id || '',
        varietyName: '',
        directSeededDAS: '',
        transplantedDAS: '',
        plantingWindow:
            stack?.item?.seedVariety?.plantingWindow?.toString() || '30',
        varietyDescription: '',
    });

    const [form, setForm] = useState(computeInitialForm);
    const [createNewVariety, setCreateNewVariety] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [errors, setErrors] = useState({});

    const { varieties, loading: loadingVarieties } = useSeedVarieties(
        form.cropType
    );

    // Load current image when modal opens
    useEffect(() => {
        if (stack?.item?.id) {
            setCurrentImageUrl(
                `/api/dist/photo/${stack.item.id}?t=${imageUpdateTimestamp}`
            );
        }
    }, [stack?.item?.id, imageUpdateTimestamp]);

    // Reset form when the stack changes
    useEffect(() => {
        setForm(computeInitialForm());
        setCreateNewVariety(false);
        setSelectedImage(null);
        setImagePreview(null);
        setErrors({});
    }, [stack]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cropType') {
            setForm((prev) => ({ ...prev, cropType: value, seedVarietyId: '' }));
            setCreateNewVariety(false);
            if (errors.seedVarietyId) {
                setErrors((prev) => ({ ...prev, seedVarietyId: undefined }));
            }
            return;
        }

        if (name === 'quantity' || name === 'max_quantity_per_request') {
            const numValue = parseInt(value);
            if (numValue < 1 && value !== '') return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSeedVarietyChange = (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, seedVarietyId: value }));
        setCreateNewVariety(value === 'new');

        if (errors.seedVarietyId) {
            setErrors((prev) => ({ ...prev, seedVarietyId: undefined }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
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

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('File size must be less than 5MB');
                return;
            }

            setSelectedImage(file);

            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
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

        const newErrors = {};

        if (!form.quantity || parseInt(form.quantity) <= 0) {
            newErrors.quantity = 'Please enter a valid quantity greater than 0';
        }

        if (!createNewVariety && !form.seedVarietyId) {
            newErrors.seedVarietyId =
                'Please select an existing seed variety or create a new one';
        }

        if (createNewVariety && (!form.varietyName || !form.varietyName.trim())) {
            newErrors.varietyName = 'Variety name is required';
        }

        if (createNewVariety) {
            if (!form.directSeededDAS || parseInt(form.directSeededDAS) <= 0) {
                newErrors.directSeededDAS = 'Direct seeded DAS is required';
            }
            if (!form.transplantedDAS || parseInt(form.transplantedDAS) <= 0) {
                newErrors.transplantedDAS = 'Transplanted DAS is required';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const selectedVariety = varieties.find(
            (v) => v.id === form.seedVarietyId
        );
        const seedName = createNewVariety
            ? form.varietyName.trim()
            : selectedVariety?.name || stack.item?.name || '';

        const hasNameOrDescriptionChange =
            seedName !== (stack.item?.name || '') ||
            (form.description || '') !== (stack.item?.description || '');

        const submitData = new FormData();
        submitData.append('name', seedName);
        submitData.append('quantity', parseInt(form.quantity));
        // The distribution edit API only accepts fixed equipment categories; use a safe fallback
        submitData.append('category', 'Other');
        submitData.append('unit', 'kg');

        if (form.max_quantity_per_request) {
            submitData.append(
                'max_quantity_per_request',
                parseInt(form.max_quantity_per_request)
            );
        }

        submitData.append('description', form.description || '');
        submitData.append('status', stack.status || 'Distributed');

        if (createNewVariety) {
            submitData.append('cropType', form.cropType);
            submitData.append('name', seedName);
            submitData.append(
                'directSeededDAS',
                parseInt(form.directSeededDAS)
            );
            submitData.append(
                'transplantedDAS',
                parseInt(form.transplantedDAS)
            );
            submitData.append(
                'plantingWindow',
                form.plantingWindow ? parseInt(form.plantingWindow) : 30
            );
            submitData.append('varietyDescription', form.varietyDescription || '');
        } else {
            submitData.append('seedVarietyId', form.seedVarietyId);
        }

        if (selectedImage) {
            submitData.append('image', selectedImage);
        }

        onSubmit(submitData, hasNameOrDescriptionChange);
    };

    const handleClose = () => {
        setForm(computeInitialForm());
        setCreateNewVariety(false);
        setSelectedImage(null);
        setErrors({});
        setImagePreview(null);
        onClose();
    };

    if (!stack) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${isDark ? 'bg-black/80' : 'bg-black/60'}`}>
            <div className={`rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                {/* Header */}
                <div className={`px-6 py-4 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Edit Distribution Seed</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Update crop type, variety, and inventory details</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none ${isDark ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-900 focus:ring-2 focus:ring-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300'}`}
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Crop Type Selection */}
                        <div className={`rounded-lg p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Crop Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="cropType"
                                value={form.cropType}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                required
                            >
                                {cropTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity (kg) */}
                        <div className={`rounded-lg p-4 border ${errors.quantity ? 'border-red-500' : isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Quantity (kg) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                placeholder="100"
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${errors.quantity ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-green-500 focus:border-green-500'} ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                min="1"
                                step="0.01"
                                required
                            />
                            {errors.quantity ? (
                                <p className="text-xs mt-2 text-red-500 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.quantity}
                                </p>
                            ) : (
                                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Enter the total weight in kg
                                </p>
                            )}
                        </div>

                        {/* Maximum Quantity Per Request */}
                        <div className={`rounded-lg p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Maximum Quantity Per Request
                                <span className={`text-xs font-normal ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>(Optional)</span>
                            </label>
                            <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <i className="fa-solid fa-info-circle mr-1 text-blue-500"></i>
                                Leave empty for no limit. Users cannot request more than this amount in a single transaction.
                            </p>
                            <input
                                type="number"
                                name="max_quantity_per_request"
                                value={form.max_quantity_per_request}
                                onChange={handleChange}
                                placeholder="e.g., 10"
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                min="1"
                            />
                        </div>

                        {/* Seed Variety Selection */}
                        <div className={`rounded-lg p-4 border ${errors.seedVarietyId ? 'border-red-500' : isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Seed Variety <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.seedVarietyId}
                                onChange={handleSeedVarietyChange}
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${errors.seedVarietyId ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-green-500 focus:border-green-500'} ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                required={!createNewVariety}
                            >
                                <option value="">-- Select Existing Variety --</option>
                                {loadingVarieties ? (
                                    <option disabled>Loading varieties...</option>
                                ) : (
                                    varieties.map((variety) => (
                                        <option key={variety.id} value={variety.id}>
                                            {variety.name} ({variety.cropType.replace(/_/g, ' ')})
                                        </option>
                                    ))
                                )}
                                <option value="new">+ Create New Variety</option>
                            </select>
                            {errors.seedVarietyId ? (
                                <p className="text-xs mt-2 text-red-500 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.seedVarietyId}
                                </p>
                            ) : (
                                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Select an existing seed variety or create a new one
                                </p>
                            )}
                        </div>

                        {/* Create New Variety Fields */}
                        {createNewVariety && (
                            <>
                                <div className={`rounded-lg p-4 border-2 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <h4 className={`font-semibold ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                                            Create New Seed Variety
                                        </h4>
                                    </div>

                                    <div className="mb-4">
                                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Variety Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="varietyName"
                                            value={form.varietyName}
                                            onChange={handleChange}
                                            placeholder="e.g., NSIC Rc222"
                                            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${errors.varietyName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'} ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                            required={createNewVariety}
                                        />
                                        {errors.varietyName && (
                                            <p className="text-xs mt-1 text-red-500 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.varietyName}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Direct Seeded DAS <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="directSeededDAS"
                                                value={form.directSeededDAS}
                                                onChange={handleChange}
                                                placeholder="e.g., 120"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${errors.directSeededDAS ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'} ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                                min="1"
                                                required={createNewVariety}
                                            />
                                            {errors.directSeededDAS && (
                                                <p className="text-xs mt-1 text-red-500 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.directSeededDAS}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Transplanted DAS <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="transplantedDAS"
                                                value={form.transplantedDAS}
                                                onChange={handleChange}
                                                placeholder="e.g., 115"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${errors.transplantedDAS ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'} ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                                min="1"
                                                required={createNewVariety}
                                            />
                                            {errors.transplantedDAS && (
                                                <p className="text-xs mt-1 text-red-500 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.transplantedDAS}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Planting Window (days after pickup)
                                        </label>
                                        <input
                                            type="number"
                                            name="plantingWindow"
                                            value={form.plantingWindow}
                                            onChange={handleChange}
                                            placeholder="30"
                                            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                            min="1"
                                        />
                                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Default: 30 days. Seeds must be planted within this period after pickup.
                                        </p>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Variety Description
                                        </label>
                                        <textarea
                                            name="varietyDescription"
                                            value={form.varietyDescription}
                                            onChange={handleChange}
                                            placeholder="e.g., High-yielding variety resistant to drought and pests"
                                            rows="3"
                                            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Description */}
                        <div className={`rounded-lg p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                General Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Additional notes about this seed distribution batch"
                                rows="2"
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className={`rounded-lg p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Seed Image (Optional)
                            </label>

                            {currentImageUrl && !imagePreview && (
                                <div className="mb-4">
                                    <p className={`text-sm mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Current Image:
                                    </p>
                                    <img
                                        src={currentImageUrl}
                                        alt="Current item"
                                        className={`w-24 h-24 object-cover rounded-lg border-2 shadow-sm ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}

                            {imagePreview && (
                                <div className="mb-3">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className={`w-24 h-24 object-cover rounded-lg border-2 shadow-sm ${isDark ? 'border-green-700' : 'border-green-300'}`}
                                    />
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="edit-image-upload"
                                />
                                <label
                                    htmlFor="edit-image-upload"
                                    className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 text-sm font-medium shadow-sm ${isDark ? 'bg-green-700 text-green-100 hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
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
                                        className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm ${isDark ? 'bg-blue-700 text-blue-100 hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
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
                                        className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 font-medium border ${isDark ? 'bg-red-900 text-red-200 hover:bg-red-800 border-red-700' : 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200'}`}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Supported formats: JPEG, PNG, GIF. Max size: 5MB.
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className={`px-6 py-4 -mx-6 -mb-6 rounded-b-xl border-t ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className={`px-6 py-3 rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 ${isDark ? 'text-gray-200 bg-gray-900 border-gray-700 hover:bg-gray-800 focus:ring-gray-700' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-gray-300'}`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${isDark ? 'bg-green-700 text-green-100 hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Image Preview Modal */}
            {showImagePreview && (
                <div className={`fixed inset-0 z-[60] flex items-center justify-center px-4 ${isDark ? 'bg-black/90' : 'bg-black/80'}`}>
                    <div className={`relative max-w-4xl max-h-[90vh] rounded-lg overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                        <button
                            onClick={() => setShowImagePreview(false)}
                            className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors duration-200 ${isDark ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-black/50 text-white hover:bg-black/70'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={imagePreview || currentImageUrl}
                            alt="Item preview"
                            className="max-w-full max-h-[90vh] object-contain"
                            onError={(e) => {
                                e.target.src = '/api/default_picture.png';
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

/* ================================================================================== */
/* ADD DISTRIBUTION SEED MODAL COMPONENT (SEED-SPECIFIC) */
/* ================================================================================== */

// Constants for seed-specific distribution
const cropTypes = ['Rice', 'Corn', 'High_Value_Crops'];

// Fetch seed varieties hook
const useSeedVarieties = (cropType = null) => {
    const [varieties, setVarieties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVarieties = async () => {
            try {
                const url = cropType 
                    ? `/api/seed-varieties?cropType=${cropType}&isActive=true`
                    : '/api/seed-varieties?isActive=true';
                
                const response = await fetch(url, {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setVarieties(data.varieties || []);
                }
            } catch (error) {
                console.error('Error fetching seed varieties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVarieties();
    }, [cropType]);

    return { varieties, loading };
};

function AddDistributionItemModal({
    isOpen,
    onClose,
    onSubmit,
    existingItems,
    distributionItems,
    isDark,
}) {
    // Seed-specific form state
    const [form, setForm] = useState({
        quantity: '1',
        max_quantity_per_request: '',
        description: '',
        cropType: 'Rice',
        seedVarietyId: '',
        varietyName: '',
        // New variety fields (if creating inline)
        directSeededDAS: '',
        transplantedDAS: '',
        plantingWindow: '30',
        varietyDescription: '',
    });

    const [createNewVariety, setCreateNewVariety] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    
    // Fetch seed varieties based on crop type
    const { varieties, loading: loadingVarieties } = useSeedVarieties(form.cropType);

    // When crop type changes, reset variety selection
    useEffect(() => {
        setForm(prev => ({ ...prev, seedVarietyId: '' }));
    }, [form.cropType]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'quantity' || name === 'max_quantity_per_request') {
            // Ensure quantity is at least 1
            const numValue = parseInt(value);
            if (numValue < 1 && value !== '') return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSeedVarietyChange = (e) => {
        const value = e.target.value;
        setForm(prev => ({ ...prev, seedVarietyId: value }));
        setCreateNewVariety(value === 'new');
        
        // Clear error when user selects a variety
        if (errors.seedVarietyId) {
            setErrors(prev => ({ ...prev, seedVarietyId: undefined }));
        }
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
        
        // Validation with field-level errors
        const newErrors = {};
        
        if (!form.quantity || parseInt(form.quantity) <= 0) {
            newErrors.quantity = 'Please enter a valid quantity greater than 0';
        }

        if (!createNewVariety && !form.seedVarietyId) {
            newErrors.seedVarietyId = 'Please select an existing seed variety or create a new one';
        }

        if (createNewVariety && (!form.varietyName || !form.varietyName.trim())) {
            newErrors.varietyName = 'Variety name is required';
        }

        if (createNewVariety) {
            if (!form.directSeededDAS || parseInt(form.directSeededDAS) <= 0) {
                newErrors.directSeededDAS = 'Direct seeded DAS is required';
            }
            if (!form.transplantedDAS || parseInt(form.transplantedDAS) <= 0) {
                newErrors.transplantedDAS = 'Transplanted DAS is required';
            }
        }
        
        // If there are errors, set them and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        // Clear errors if validation passed
        setErrors({});

        // Derive seed name from selected or new variety
        const selectedVariety = varieties.find(
            (v) => v.id === form.seedVarietyId
        );
        const seedName = createNewVariety
            ? form.varietyName.trim()
            : selectedVariety?.name || '';

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('name', seedName);
        formData.append('quantity', parseInt(form.quantity));
        formData.append('category', 'Seeds'); // Force Seeds category
        formData.append('unit', 'kg'); // Fixed unit
        
        if (form.max_quantity_per_request) {
            formData.append('max_quantity_per_request', parseInt(form.max_quantity_per_request));
        }
        
        formData.append('description', form.description || '');
        formData.append('status', 'Distributed');

        // Add seed variety info
        if (createNewVariety) {
            // Creating new variety inline
            formData.append('cropType', form.cropType);
            formData.append('name', seedName);
            formData.append('directSeededDAS', parseInt(form.directSeededDAS));
            formData.append('transplantedDAS', parseInt(form.transplantedDAS));
            formData.append('plantingWindow', form.plantingWindow ? parseInt(form.plantingWindow) : 30);
            formData.append('varietyDescription', form.varietyDescription || '');
        } else {
            // Using existing variety
            formData.append('seedVarietyId', form.seedVarietyId);
        }

        // Add image if selected
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        onSubmit(formData);

        // Reset form
        setForm({
            quantity: '1',
            max_quantity_per_request: '',
            description: '',
            cropType: 'Rice',
            seedVarietyId: '',
            varietyName: '',
            directSeededDAS: '',
            transplantedDAS: '',
            plantingWindow: '30',
            varietyDescription: '',
        });
        setCreateNewVariety(false);
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleClose = () => {
        // Reset form when closing
        setForm({
            quantity: '1',
            max_quantity_per_request: '',
            description: '',
            cropType: 'Rice',
            seedVarietyId: '',
            varietyName: '',
            directSeededDAS: '',
            transplantedDAS: '',
            plantingWindow: '30',
            varietyDescription: '',
        });
        setCreateNewVariety(false);
        setSelectedImage(null);
        setErrors({});
        setImagePreview(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 px-4 ${isDark ? 'bg-black/80' : 'bg-black/60'}`}> 
            <div className={`rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}> 
                {/* Header */}
                <div className={`border-b px-6 py-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}> 
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Add Distribution Seed</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Add new seed to distribution inventory</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 ${isDark ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-900 focus:ring-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-300'}`}
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* FORM */}
                <form className="p-6" onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Crop Type Selection */}
                        <div className={`rounded-lg p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Crop Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="cropType"
                                value={form.cropType}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                required
                            >
                                {cropTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity (kg) */}
                        <div className={`rounded-lg p-4 border ${errors.quantity ? 'border-red-500' : isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}> 
                            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}> 
                                Quantity (kg) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                placeholder="100"
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${errors.quantity ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-green-500 focus:border-green-500'} ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                min="1"
                                step="0.01"
                                required
                            />
                            {errors.quantity ? (
                                <p className="text-xs mt-2 text-red-500 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.quantity}
                                </p>
                            ) : (
                                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Enter the total weight in kg
                                </p>
                            )}
                        </div>

                        {/* Maximum Quantity Per Request */}
                        <div className={`rounded-lg p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Maximum Quantity Per Request
                                <span className={`text-xs font-normal ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>(Optional)</span>
                            </label>
                            <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <i className="fa-solid fa-info-circle mr-1 text-blue-500"></i>
                                Leave empty for no limit. Users cannot request more than this amount in a single transaction.
                            </p>
                            <input
                                type="number"
                                name="max_quantity_per_request"
                                value={form.max_quantity_per_request}
                                onChange={handleChange}
                                placeholder="e.g., 10"
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                min="1"
                            />
                        </div>

                        {/* Seed Variety Selection */}
                        <div className={`rounded-lg p-4 border ${errors.seedVarietyId ? 'border-red-500' : isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Seed Variety <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.seedVarietyId}
                                onChange={handleSeedVarietyChange}
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${errors.seedVarietyId ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-green-500 focus:border-green-500'} ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                required={!createNewVariety}
                            >
                                <option value="">-- Select Existing Variety --</option>
                                {loadingVarieties ? (
                                    <option disabled>Loading varieties...</option>
                                ) : (
                                    varieties.map((variety) => (
                                        <option key={variety.id} value={variety.id}>
                                            {variety.name} ({variety.cropType.replace(/_/g, ' ')})
                                        </option>
                                    ))
                                )}
                                <option value="new">+ Create New Variety</option>
                            </select>
                            {errors.seedVarietyId ? (
                                <p className="text-xs mt-2 text-red-500 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.seedVarietyId}
                                </p>
                            ) : (
                                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Select an existing seed variety or create a new one
                                </p>
                            )}
                        </div>

                        {/* Create New Variety Fields */}
                        {createNewVariety && (
                            <>
                                <div className={`rounded-lg p-4 border-2 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <h4 className={`font-semibold ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                                            Create New Seed Variety
                                        </h4>
                                    </div>

                                    {/* Variety Name & DAS Values Row */}
                                    <div className="mb-4">
                                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Variety Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="varietyName"
                                            value={form.varietyName}
                                            onChange={handleChange}
                                            placeholder="e.g., NSIC Rc222"
                                            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${errors.varietyName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'} ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                            required={createNewVariety}
                                        />
                                        {errors.varietyName && (
                                            <p className="text-xs mt-1 text-red-500 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.varietyName}
                                            </p>
                                        )}
                                    </div>
                                    {/* DAS Values Row */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Direct Seeded DAS <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="directSeededDAS"
                                                value={form.directSeededDAS}
                                                onChange={handleChange}
                                                placeholder="e.g., 120"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${errors.directSeededDAS ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'} ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                                min="1"
                                                required={createNewVariety}
                                            />
                                            {errors.directSeededDAS && (
                                                <p className="text-xs mt-1 text-red-500 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.directSeededDAS}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Transplanted DAS <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="transplantedDAS"
                                                value={form.transplantedDAS}
                                                onChange={handleChange}
                                                placeholder="e.g., 115"
                                                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${errors.transplantedDAS ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'} ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                                min="1"
                                                required={createNewVariety}
                                            />
                                            {errors.transplantedDAS && (
                                                <p className="text-xs mt-1 text-red-500 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.transplantedDAS}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Planting Window */}
                                    <div className="mb-4">
                                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Planting Window (days after pickup)
                                        </label>
                                        <input
                                            type="number"
                                            name="plantingWindow"
                                            value={form.plantingWindow}
                                            onChange={handleChange}
                                            placeholder="30"
                                            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                            min="1"
                                        />
                                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Default: 30 days. Seeds must be planted within this period after pickup.
                                        </p>
                                    </div>

                                    {/* Variety Description */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Variety Description
                                        </label>
                                        <textarea
                                            name="varietyDescription"
                                            value={form.varietyDescription}
                                            onChange={handleChange}
                                            placeholder="e.g., High-yielding variety resistant to drought and pests"
                                            rows="3"
                                            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Description */}
                        <div className={`rounded-lg p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                General Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Additional notes about this seed distribution batch"
                                rows="2"
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className={`rounded-lg p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}> 
                            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}> 
                                Seed Image (Optional)
                            </label>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 text-sm font-medium shadow-sm ${isDark ? 'bg-green-700 text-green-100 hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
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
                                    Choose Image
                                </label>
                                {selectedImage && (
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 font-medium border ${isDark ? 'bg-red-900 text-red-200 hover:bg-red-800 border-red-700' : 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200'}`}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {imagePreview && (
                                <div className="mb-3">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className={`w-24 h-24 object-cover rounded-lg border-2 shadow-sm ${isDark ? 'border-green-700' : 'border-green-300'}`}
                                    />
                                </div>
                            )}
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}> 
                                Supported formats: JPEG, PNG, GIF. Max size: 5MB.
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className={`px-6 py-4 -mx-6 -mb-6 rounded-b-xl border-t ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}> 
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className={`px-6 py-3 rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 ${isDark ? 'text-gray-200 bg-gray-900 border-gray-700 hover:bg-gray-800 focus:ring-gray-700' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-gray-300'}`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${isDark ? 'bg-green-700 text-green-100 hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
                            >
                                Add Distribution Seed
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
