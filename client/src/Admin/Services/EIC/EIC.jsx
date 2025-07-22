import { useState, useEffect } from 'react';

// ASSETS
import default_image from '../../../Assets/eic_default.png';
// SUB COMPONENTS
import EIC_Request from './Components/Request/EIC_Request.jsx';
import AddEICItemModal from './addEICItem.jsx';

export default function EIC() {
    const [activeSection, setActiveSection] = useState('items');
    const [eicStacks, setEicStacks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchFilter, setSearchFilter] = useState('name');
    const [showAddModal, setShowAddModal] = useState(false);
    const [allItems, setAllItems] = useState([]); // For existing items in the modal

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
        }
    }, [activeSection]);

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

    // Filter stacks based on search and filters
    const filteredStacks = eicStacks.filter((stack) => {
        const searchValue = search.toLowerCase();
        const matchesSearch =
            searchFilter === 'name'
                ? stack.item?.name?.toLowerCase().includes(searchValue) || false
                : searchFilter === 'category'
                ? stack.item?.category?.toLowerCase().includes(searchValue) ||
                  false
                : stack.item?.description
                      ?.toLowerCase()
                      .includes(searchValue) || false;

        const matchesStatus =
            statusFilter === 'all' || stack.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleAddEICItem = async (formData) => {
        try {
            const response = await fetch('/api/inventory/item/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setShowAddModal(false);
            await fetchEICStacks(); // Refresh EIC items
            await fetchAllItems(); // Refresh all items for dropdown
            showAlert('EIC item added successfully', 'success');
        } catch (error) {
            console.error('Failed to create EIC item:', error);
            showAlert('Failed to add EIC item', 'error');
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
            <div className="relative mt-16 mb-8 flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-4">
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
                    Equipment in Circulation
                </span>

                {/* Navigation Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveSection('items')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeSection === 'items'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        EIC Items
                    </button>
                    <button
                        onClick={() => setActiveSection('requests')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeSection === 'requests'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Requests
                    </button>
                </div>
            </div>

            {activeSection === 'requests' ? (
                <div className="max-w-5xl mx-auto">
                    <EIC_Request />
                </div>
            ) : (
                <>
                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row items-center gap-2 w-full max-w-5xl mx-auto mb-6">
                        <div className="relative w-full md:w-auto">
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
                                className="block w-full md:w-64 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full md:w-auto p-2"
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                        >
                            <option value="name">Item Name</option>
                            <option value="category">Category</option>
                            <option value="description">Description</option>
                        </select>
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full md:w-auto p-2"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="EIC">EIC</option>
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                            <option value="Damaged">Damaged</option>
                            <option value="Distributed">Distributed</option>
                        </select>
                        <button
                            onClick={fetchEICStacks}
                            className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all"
                        >
                            <svg
                                className="w-4 h-4 mr-1"
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
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white transition-all"
                        >
                            <svg
                                className="w-4 h-4 mr-1"
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

                    {/* Items Grid */}
                    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredStacks.map((stack) => (
                            <EICItemCard key={stack.id} stack={stack} />
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
        </div>
    );
}

/* ================================================================================== */
/* EIC ITEM CARD COMPONENT - Matching Seminar Design Style */
/* ================================================================================== */

function EICItemCard({ stack }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            EIC: 'bg-orange-50 text-orange-700 border border-orange-100',
            Available: 'bg-green-50 text-green-700 border border-green-100',
            Unavailable: 'bg-red-50 text-red-600 border border-red-100',
            Damaged: 'bg-red-50 text-red-600 border border-red-100',
            Distributed: 'bg-blue-50 text-blue-700 border border-blue-100',
        };
        return (
            colors[status] || 'bg-gray-100 text-gray-600 border border-gray-200'
        );
    };

    const truncatedDescription =
        stack.item?.description && stack.item.description.length > 100
            ? stack.item.description.slice(0, 100) + '...'
            : stack.item?.description;

    return (
        <div className="relative flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="relative">
                <img
                    src={stack.item?.picture || default_image}
                    alt={stack.item?.name || 'EIC Item'}
                    className="w-full h-40 sm:h-48 object-cover transition-all duration-300 group-hover:scale-105"
                />
                <span
                    className={`absolute top-3 right-3 px-3 py-0.5 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(
                        stack.status
                    )}`}
                >
                    {stack.status}
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
                            Count:
                        </span>{' '}
                        {stack.count}
                    </span>
                    <span>
                        <span className="font-medium text-gray-700">
                            Category:
                        </span>{' '}
                        {stack.item?.category?.replace('_', ' ') || 'N/A'}
                    </span>
                    <span>
                        <span className="font-medium text-gray-700">
                            Distributed:
                        </span>{' '}
                        {formatDate(stack.createdAt)}
                    </span>
                </div>
                <div className="flex flex-col gap-2 mt-auto md:flex-row">
                    <button className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm">
                        View Details
                    </button>
                    <button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm">
                        Update Status
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ================================================================================== */
