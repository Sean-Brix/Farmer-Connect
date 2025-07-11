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

const statuses = ['Available', 'Borrowed', 'Damaged', 'Out of Stock'];

function Content() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        id: '',
        name: '',
        quantity: '',
        description: '',
        category: 'Other',
        status: 'Available',
    });
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch('/api/inventory/getAll');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setItems(data.payload?.list || []);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
            setItems([]);
        }
    };

    useEffect(() => {
        if (items.length > 0) {
            items.forEach(async (item) => {
                if (item.quantity === 0 && item.status !== 'Out of Stock') {
                    try {
                        const response = await fetch(
                            '/api/inventory/editItem',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    ...item,
                                    status: 'Out of Stock',
                                }),
                            }
                        );
                        if (!response.ok) {
                            throw new Error(
                                `HTTP error! status: ${response.status}`
                            );
                        }
                        fetchItems();
                    } catch (error) {
                        console.error(
                            `Failed to update status for item ${item.id}:`,
                            error
                        );
                    }
                } else if (
                    item.status === 'Out of Stock' &&
                    item.quantity > 0
                ) {
                    try {
                        const response = await fetch(
                            '/api/inventory/editItem',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    ...item,
                                    status: 'Available',
                                }),
                            }
                        );
                        if (!response.ok) {
                            throw new Error(
                                `HTTP error! status: ${response.status}`
                            );
                        }
                        fetchItems();
                    } catch (error) {
                        console.error(
                            `Failed to update status for item ${item.id}:`,
                            error
                        );
                    }
                }
            });
        }
    }, [items]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.quantity) return;

        try {
            const response = await fetch('/api/inventory/addItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setForm({
                id: '',
                name: '',
                quantity: '',
                description: '',
                category: 'Other',
                status: 'Available',
            });
            setShowModal(false);
            fetchItems();
        } catch (error) {
            console.error('Failed to create item:', error);
            alert('Failed to add item');
            return;
        }
    };

    const handleEdit = (item) => {
        setEditItemId(item.id);
        setForm({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            description: item.description,
            category: item.category,
            status: item.status,
        });
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!form.name || !form.quantity) return;

        try {
            const response = await fetch(`/api/inventory/editItem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setForm({
                id: '',
                name: '',
                quantity: '',
                description: '',
                category: 'Other',
                status: 'Available',
            });
            setShowEditModal(false);
            setEditItemId(null);
            fetchItems();
        } catch (error) {
            console.error('Failed to update item:', error);
            alert('Failed to update item');
        }
    };

    const filteredItems = items.filter((item) => {
        const matchesSearch =
            (item.name || '')
                .toLowerCase()
                .includes((search || '').toLowerCase()) ||
            (item.description || '')
                .toLowerCase()
                .includes((search || '').toLowerCase());
        const matchesCategoryFilter =
            categoryFilter === 'All' || item.category === categoryFilter;
        const matchesStatusFilter =
            statusFilter === 'All' || item.status === statusFilter;
        return matchesSearch && matchesCategoryFilter && matchesStatusFilter;
    });

    const truncate = (str, n = 40) =>
        str && str.length > n ? str.slice(0, n) + '...' : str;

    const handleRemoveSelected = async () => {
        try {
            await Promise.all(
                selectedItems.map(async (id) => {
                    const response = await fetch(
                        `/api/inventory/deleteItem?id=${id}`,
                        {
                            method: 'GET',
                        }
                    );
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        );
                    }
                })
            );

            setSelectedItems([]);
            setSelectAll(false);
            setShowDelete(false);
            fetchItems();
        } catch (error) {
            console.error('Failed to delete items:', error);
            alert('Failed to delete selected items');
        }
    };

    const handleSelectAll = (e) => {
        setSelectAll(e.target.checked);
        if (e.target.checked) {
            setSelectedItems(filteredItems.map((item) => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const [showStats, setShowStats] = useState(false);

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
            setSelectAll(false);
        } else {
            const newSelected = [...selectedItems, id];
            setSelectedItems(newSelected);
            if (newSelected.length === filteredItems.length) setSelectAll(true);
        }
    };

    const calculateStats = () => {
        const categoryCounts = {};
        const statusCounts = {};

        items.forEach((item) => {
            categoryCounts[item.category] =
                (categoryCounts[item.category] || 0) + 1;
            statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
        });

        const totalItems = items.length;
        const uniqueCategories = Object.keys(categoryCounts).length;
        return {
            totalItems,
            uniqueCategories,
            categoryCounts,
            statusCounts,
        };
    };

    const stats = calculateStats();

    return (
        <div className="flex flex-col items-center justify-center min-h-[91vh] w-full bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 p-2 sm:p-4 md:p-8 rounded-2xl shadow-2xl mt-[5%] transition-all">
            <div className="w-full max-w-6xl z-20 sticky top-0 md:top-14 bg-white/80 backdrop-blur-md p-4 sm:p-6 md:p-10 rounded-2xl shadow-lg border-b border-blue-200">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-800 mb-4 text-center tracking-tight drop-shadow">
                    Inventory Management
                </h1>
                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 w-full max-w-3xl mx-auto justify-center md:justify-between">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 min-w-[160px] border border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 shadow transition text-blue-900 placeholder:text-blue-400 text-sm sm:text-base"
                    />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="min-w-[120px] border border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 shadow transition text-blue-900 text-sm sm:text-base"
                    >
                        <option key="All">All</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="min-w-[120px] border border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 shadow transition text-blue-900 text-sm sm:text-base"
                    >
                        <option key="All">All</option>
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold px-4 sm:px-6 py-2 rounded-xl hover:from-blue-600 hover:to-blue-800 transition shadow-lg flex items-center gap-2 text-sm sm:text-base"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add Item
                    </button>
                    {!showDelete ? (
                        <button
                            onClick={() => setShowDelete(true)}
                            className="bg-gradient-to-r from-red-400 to-red-600 text-white font-bold px-4 sm:px-6 py-2 rounded-xl hover:from-red-500 hover:to-red-700 transition shadow-lg flex items-center gap-2 text-sm sm:text-base"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            Delete
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowDelete(false)}
                            className="bg-gradient-to-r from-gray-300 to-gray-400 text-blue-900 font-bold px-4 sm:px-6 py-2 rounded-xl hover:from-gray-400 hover:to-gray-500 transition shadow-lg flex items-center gap-2 text-sm sm:text-base"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={() => setShowStats(!showStats)}
                        className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold px-4 sm:px-6 py-2 rounded-xl hover:from-green-500 hover:to-green-700 transition shadow-lg flex items-center gap-2 text-sm sm:text-base"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h7"
                            />
                        </svg>
                        Statistics
                    </button>
                </div>
                {showDelete && (
                    <div className="flex flex-col items-end mt-2 gap-2 w-full">
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <button
                                onClick={handleRemoveSelected}
                                disabled={selectedItems.length === 0}
                                className={`px-4 py-2 rounded-xl font-semibold transition shadow-lg bg-red-500 text-white hover:bg-red-600 disabled:bg-red-200 disabled:cursor-not-allowed text-sm sm:text-base`}
                            >
                                Remove Selected
                            </button>
                            <button
                                onClick={() => {
                                    setSelectAll(true);
                                    setSelectedItems(
                                        filteredItems.map((item) => item.id)
                                    );
                                }}
                                className="px-4 py-2 rounded-xl font-semibold transition shadow-lg bg-blue-500 text-white hover:bg-blue-600 text-sm sm:text-base"
                            >
                                Select All
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-[98vw] max-w-lg relative border border-blue-200 animate-fadeIn">
                        <button
                            className="absolute top-3 right-3 text-blue-400 hover:text-blue-700 text-2xl sm:text-3xl transition"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        >
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <h2 className="text-xl sm:text-2xl font-extrabold mb-6 text-blue-800 text-center tracking-tight">
                            Add New Item
                        </h2>
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={handleSubmit}
                        >
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Item Name"
                                className="border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 shadow text-sm sm:text-base"
                                required
                            />
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                placeholder="Quantity"
                                className="border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 shadow text-sm sm:text-base"
                                min="1"
                                required
                            />
                            <input
                                type="text"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 shadow text-sm sm:text-base"
                            />
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="border border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 shadow transition text-blue-900 text-sm sm:text-base"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="border border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 shadow transition text-blue-900 text-sm sm:text-base"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 rounded-xl hover:from-blue-600 hover:to-blue-800 transition shadow-lg mt-2 text-sm sm:text-base"
                            >
                                Add Item
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-[98vw] max-w-lg relative border border-blue-200 animate-fadeIn">
                        <button
                            className="absolute top-3 right-3 text-blue-400 hover:text-blue-700 text-2xl sm:text-3xl transition"
                            onClick={() => setShowEditModal(false)}
                            aria-label="Close"
                        >
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <h2 className="text-xl sm:text-2xl font-extrabold mb-6 text-blue-800 text-center tracking-tight">
                            Edit Item
                        </h2>
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={handleUpdate}
                        >
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Item Name"
                                className="border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 shadow text-sm sm:text-base"
                                required
                            />
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                placeholder="Quantity"
                                className="border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 shadow text-sm sm:text-base"
                                min="0"
                                required
                            />
                            <input
                                type="text"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 shadow text-sm sm:text-base"
                            />
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="border border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 shadow transition text-blue-900 text-sm sm:text-base"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="border border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 shadow transition text-blue-900 text-sm sm:text-base"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 rounded-xl hover:from-blue-600 hover:to-blue-800 transition shadow-lg mt-2 text-sm sm:text-base"
                            >
                                Update Item
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {showStats && (
                <div className="w-full max-w-6xl mt-4">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800 mb-4 text-center tracking-tight">
                        Inventory Statistics
                    </h2>
                    <div className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-md border border-blue-100 p-4 flex flex-col gap-4">
                        {/* Category Counts */}
                        <div>
                            <h3 className="text-md font-semibold text-blue-800 text-center">
                                Category Distribution
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                                {Object.entries(stats.categoryCounts).length >
                                0 ? (
                                    Object.entries(stats.categoryCounts).map(
                                        ([category, count]) => (
                                            <div
                                                key={category}
                                                className="flex flex-col items-center p-2 rounded-md bg-blue-50 shadow-inner"
                                            >
                                                <span className="text-blue-700 font-semibold text-sm">
                                                    {category}
                                                </span>
                                                <span className="text-blue-500 text-xs">
                                                    ({count})
                                                </span>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <p className="text-blue-700 text-center">
                                        No category data available.
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* Status Counts */}
                        <div>
                            <h3 className="text-md font-semibold text-blue-800 text-center">
                                Status Distribution
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                                {statuses.map((status) => {
                                    const count =
                                        stats.statusCounts[status] || 0;
                                    let textColor = 'text-blue-700';
                                    if (status === 'Out of Stock') {
                                        textColor = 'text-red-700';
                                    }
                                    return (
                                        <div
                                            key={status}
                                            className="flex flex-col items-center p-2 rounded-md bg-blue-50 shadow-inner"
                                        >
                                            <span
                                                className={`${textColor} font-semibold text-sm`}
                                            >
                                                {status}
                                            </span>
                                            <span className="text-blue-500 text-xs">
                                                ({count})
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-6xl mt-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800 mb-4 text-center tracking-tight">
                    Current Inventory
                </h2>
                <div className="overflow-x-auto rounded-2xl shadow-lg bg-white/80 backdrop-blur-md border border-blue-100">
                    <table className="min-w-full bg-transparent rounded-2xl text-xs sm:text-sm md:text-base">
                        <thead>
                            <tr>
                                <th className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b text-left text-xs md:text-sm text-blue-700 font-semibold">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectAll &&
                                            filteredItems.length > 0
                                        }
                                        onChange={handleSelectAll}
                                        aria-label="Select all"
                                    />
                                </th>
                                <th className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b text-left text-xs md:text-sm text-blue-700 font-semibold">
                                    Name
                                </th>
                                <th className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b text-left text-xs md:text-sm text-blue-700 font-semibold">
                                    Quantity
                                </th>
                                <th className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b text-left text-xs md:text-sm text-blue-700 font-semibold">
                                    Description
                                </th>
                                <th className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b text-left text-xs md:text-sm text-blue-700 font-semibold">
                                    Category
                                </th>
                                <th className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b text-left text-xs md:text-sm text-blue-700 font-semibold">
                                    Status
                                </th>
                                <th className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b text-left text-xs md:text-sm text-blue-700 font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-6 text-center text-blue-400 font-semibold"
                                        key="no-items"
                                    >
                                        No items found.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item, index) => (
                                    <tr
                                        key={item.id + index}
                                        className="hover:bg-blue-50/70 transition"
                                    >
                                        <td className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(
                                                    item.id
                                                )}
                                                onChange={() =>
                                                    handleSelectItem(item.id)
                                                }
                                                aria-label={`Select ${item.name}`}
                                            />
                                        </td>
                                        <td className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b font-semibold text-blue-900">
                                            {item.name}
                                        </td>
                                        <td className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b text-blue-700">
                                            {item.quantity}
                                        </td>
                                        <td className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b text-blue-700">
                                            <span
                                                title={item.description}
                                                className="block max-w-[120px] sm:max-w-[180px] truncate"
                                            >
                                                {truncate(item.description, 40)}
                                            </span>
                                        </td>
                                        <td className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b text-blue-700">
                                            {item.category}
                                        </td>
                                        <td className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b text-blue-700">
                                            {item.status}
                                        </td>
                                        <td className="py-2 sm:py-3 px-1 sm:px-2 md:px-4 border-b text-blue-700">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold px-2 py-1 rounded-xl hover:from-green-500 hover:to-green-700 transition shadow-lg text-xs sm:text-sm"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Content;
