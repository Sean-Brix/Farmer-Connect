import React, { useState, useEffect } from 'react';

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

const statuses = [
    'Available',
    'Unavailable',
    'Damaged',
    'EIC',
    'Distributed',
];

function Content() {
    const [items, setItems] = useState([]);
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/inventory/all/items', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setItems(data || []);
            setError(null);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
            setError('Failed to load inventory items');
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleExpand = (itemId) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        } else {
            newExpanded.add(itemId);
        }
        setExpandedItems(newExpanded);
    };

    const groupStacksByStatus = (stacks) => {
        const grouped = {};
        stacks.forEach(stack => {
            if (!grouped[stack.status]) {
                grouped[stack.status] = [];
            }
            grouped[stack.status].push(stack);
        });
        return grouped;
    };

    const getStatusColor = (status) => {
        const colors = {
            Available: 'bg-green-100 text-green-800',
            Unavailable: 'bg-red-100 text-red-800',
            Damaged: 'bg-orange-100 text-orange-800',
            EIC: 'bg-blue-100 text-blue-800',
            Distributed: 'bg-purple-100 text-purple-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const filteredItems = items.filter((item) => {
        const matchesSearch =
            (item.name || '').toLowerCase().includes((search || '').toLowerCase()) ||
            (item.description || '').toLowerCase().includes((search || '').toLowerCase());
        const matchesCategoryFilter =
            categoryFilter === 'All' || item.category === categoryFilter;

        return matchesSearch && matchesCategoryFilter;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getTotalQuantityByStatus = (stacks) => {
        const totals = {};
        stacks.forEach(stack => {
            totals[stack.status] = (totals[stack.status] || 0) + stack.quantity;
        });
        return totals;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-red-700">{error}</span>
                </div>
                <button
                    onClick={fetchItems}
                    className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-full">
            <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="border-b border-gray-200 p-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage your inventory items and track their stock levels
                    </p>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Items
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or description..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="sm:w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Filter
                            </label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="All">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Item
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Quantity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Updated
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-900">No items found</p>
                                            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <img
                                                        className="h-10 w-10 rounded-lg object-cover mr-4"
                                                        src={item.picture || '/api/inventory/default-item.png'}
                                                        alt={item.name}
                                                        onError={(e) => {
                                                            e.target.src = '/api/inventory/default-item.png';
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.name}
                                                        </div>
                                                        {item.description && (
                                                            <div className="text-sm text-gray-500 max-w-xs truncate">
                                                                {item.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {item.category?.replace('_', ' ') || 'Other'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.totalQuantity || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(item.updatedAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleToggleExpand(item.id)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                >
                                                    {expandedItems.has(item.id) ? (
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedItems.has(item.id) && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 bg-gray-50">
                                                    <div className="space-y-4">
                                                        <h4 className="text-sm font-medium text-gray-900">
                                                            Stock Details for {item.name}
                                                        </h4>
                                                        {item.stacks && item.stacks.length > 0 ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                {Object.entries(groupStacksByStatus(item.stacks)).map(([status, stacks]) => (
                                                                    <div key={status} className="bg-white rounded-lg border border-gray-200 p-4">
                                                                        <div className="flex items-center justify-between mb-3">
                                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                                                                {status}
                                                                            </span>
                                                                            <span className="text-sm font-medium text-gray-900">
                                                                                Total: {stacks.reduce((sum, stack) => sum + stack.quantity, 0)}
                                                                            </span>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            {stacks.map((stack) => (
                                                                                <div key={stack.id} className="flex justify-between items-center text-sm">
                                                                                    <span className="text-gray-600">
                                                                                        Stack #{stack.id.slice(-8)}
                                                                                    </span>
                                                                                    <span className="font-medium text-gray-900">
                                                                                        Qty: {stack.quantity}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                                                            <div className="text-xs text-gray-500">
                                                                                Last updated: {formatDate(stacks[0]?.updatedAt)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-6 text-gray-500">
                                                                <svg className="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                </svg>
                                                                <p className="text-sm">No stock available for this item</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {filteredItems.length} of {items.length} items
                        </div>
                        <button
                            onClick={fetchItems}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Content;
