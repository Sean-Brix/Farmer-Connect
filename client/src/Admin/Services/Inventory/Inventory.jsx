import React, { useState, useEffect } from 'react';
import AddItemModal from './addItem';

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
    'Lost',
    'Damaged',
    'EIC',
    'Distributed',
];

function Content() {
    const [items, setItems] = useState([]);
    const [showStacksModal, setShowStacksModal] = useState(false);
    const [selectedItemStacks, setSelectedItemStacks] = useState(null);
    const [expandedStacks, setExpandedStacks] = useState(new Set());
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
    const [uiSize, setUiSize] = useState('md'); // 'sm', 'md', 'lg'

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch('/api/inventory/all/items');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setItems(data || []);
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

    const handleSubmit = async (formData) => {
        try {
            const response = await fetch('/api/inventory/addItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

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

    const truncate = (str, n = 24) =>
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

    const handleViewStacks = (item) => {
        if (expandedStacks.has(item.id)) {
            setExpandedStacks(
                new Set([...expandedStacks].filter((id) => id !== item.id))
            );
            if (selectedItemStacks?.id === item.id) {
                setSelectedItemStacks(null);
            }
        } else {
            setSelectedItemStacks(item);
            setExpandedStacks(new Set([...expandedStacks, item.id]));
        }
    };

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

    // UI size classes
    const sizeClasses = {
        sm: 'max-w-full p-2 text-xs',
        md: 'max-w-full p-4 text-sm',
        lg: 'max-w-full p-6 text-base',
    };

    return (
        <div
            className={`flex flex-col items-center justify-center min-h-[91vh] w-full bg-white rounded-xl shadow mt-15 transition-all
                ${sizeClasses[uiSize]}
            `}
            style={{
                boxSizing: 'border-box',
                width: '100%',
            }}
        >
            <div
                className={`w-full sticky top-[-5px] bg-white rounded-xl shadow border-b border-blue-100 mb-4 ${
                    uiSize === 'lg' ? 'p-6' : uiSize === 'md' ? 'p-4' : 'p-2'
                }`}
            >
                <h1 className="text-lg sm:text-xl font-bold text-blue-800 mb-4 text-center tracking-tight">
                    Inventory Management
                </h1>
                <div className="flex flex-wrap gap-2 w-full mx-auto justify-center mb-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 min-w-[120px] border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 text-blue-900 placeholder:text-blue-400 w-full sm:w-auto"
                    />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="min-w-[100px] border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 text-blue-900 w-full sm:w-auto"
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
                        className="min-w-[100px] border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 text-blue-900 w-full sm:w-auto"
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
                        className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600 transition w-full sm:w-auto"
                    >
                        + Add
                    </button>
                    {!showDelete ? (
                        <button
                            onClick={() => setShowDelete(true)}
                            className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 transition w-full sm:w-auto"
                        >
                            Delete
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowDelete(false)}
                            className="bg-gray-300 text-blue-900 font-bold px-4 py-2 rounded hover:bg-gray-400 transition w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                    )}
                </div>
                {showDelete && (
                    <div className="flex flex-col items-end mt-2 gap-2 w-full">
                        <div className="flex gap-2 flex-wrap w-full">
                            <button
                                onClick={handleRemoveSelected}
                                disabled={selectedItems.length === 0}
                                className={`px-4 py-2 rounded font-semibold bg-red-500 text-white hover:bg-red-600 disabled:bg-red-200 disabled:cursor-not-allowed w-full sm:w-auto`}
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
                                className="px-4 py-2 rounded font-semibold bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
                            >
                                Select All
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <AddItemModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                existingItems={items}
            />

            {showEditModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow p-6 w-full max-w-sm relative border border-blue-100 mx-2">
                        <button
                            className="absolute top-2 right-2 text-blue-400 hover:text-blue-700 text-xl transition"
                            onClick={() => setShowEditModal(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <h2 className="text-base font-bold mb-4 text-blue-800 text-center">
                            Edit Item
                        </h2>
                        <form
                            className="flex flex-col gap-3"
                            onSubmit={handleUpdate}
                        >
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Name"
                                className="border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 w-full"
                                required
                            />
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                placeholder="Qty"
                                className="border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 w-full"
                                min="0"
                                required
                            />
                            <input
                                type="text"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 w-full"
                            />
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 w-full"
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
                                className="border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 w-full"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition mt-2 w-full"
                            >
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {showStacksModal &&
                selectedItemStacks &&
                selectedItemStacks.currentStacks && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow p-6 w-full max-w-lg relative border border-blue-100 mx-2">
                            <button
                                className="absolute top-2 right-2 text-blue-400 hover:text-blue-700 text-xl transition"
                                onClick={() => {
                                    setShowStacksModal(false);
                                }}
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <div className="mb-4">
                                <h2 className="text-base font-bold text-blue-800 text-center">
                                    {selectedItemStacks.name} -{' '}
                                    {selectedItemStacks.currentStatus} Stacks
                                </h2>
                            </div>
                            <div>
                                {selectedItemStacks.currentStacks.map(
                                    (stack, index) => (
                                        <div
                                            key={stack.id}
                                            className="px-2 py-2 border-b last:border-b-0"
                                        >
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-blue-900 font-medium">
                                                    Stack #{index + 1}
                                                </span>
                                                <span className="text-blue-700">
                                                    Qty: {stack.quantity}
                                                </span>
                                            </div>
                                            <div className="mt-1 text-xs text-blue-600 flex gap-2 flex-wrap">
                                                <span>
                                                    Created:{' '}
                                                    {new Date(
                                                        stack.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                                <span>
                                                    Updated:{' '}
                                                    {new Date(
                                                        stack.updatedAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}

            <div className="w-full mt-2">
                <div className="overflow-x-auto rounded-xl shadow bg-white border border-blue-50 p-2 sm:p-4 w-full">
                    <table className="min-w-full bg-transparent rounded-xl">
                        <thead>
                            <tr>
                                <th className="py-2 px-2 border-b text-left text-blue-700 font-semibold w-[40px]">
                                    {/* Show select all checkbox only if delete mode is active, else empty for expand icon */}
                                    {showDelete ? (
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectAll &&
                                                filteredItems.length > 0
                                            }
                                            onChange={handleSelectAll}
                                            aria-label="Select all"
                                        />
                                    ) : null}
                                </th>
                                <th className="py-2 px-2 border-b text-left text-blue-700 font-semibold">
                                    Name
                                </th>
                                <th className="py-2 px-2 border-b text-left text-blue-700 font-semibold">
                                    Quantity
                                </th>
                                <th className="py-2 px-2 border-b text-left text-blue-700 font-semibold">
                                    Description
                                </th>
                                <th className="py-2 px-2 border-b text-left text-blue-700 font-semibold">
                                    Category
                                </th>
                                <th className="py-2 px-2 border-b text-left text-blue-700 font-semibold">
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
                                    <React.Fragment key={item.id + index}>
                                        <tr className="hover:bg-blue-50 transition">
                                            <td className="py-2 px-2 border-b w-[40px]">
                                                {/* Show checkbox if delete mode, else expand button */}
                                                {showDelete ? (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(
                                                            item.id
                                                        )}
                                                        onChange={() =>
                                                            handleSelectItem(
                                                                item.id
                                                            )
                                                        }
                                                        aria-label={`Select ${item.name}`}
                                                    />
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleViewStacks(
                                                                item
                                                            )
                                                        }
                                                        className="p-1 rounded transition hover:bg-blue-100 focus:outline-none"
                                                        aria-label={
                                                            expandedStacks.has(
                                                                item.id
                                                            )
                                                                ? 'Collapse Stacks'
                                                                : 'Expand Stacks'
                                                        }
                                                        style={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            background: 'none',
                                                            border: 'none',
                                                        }}
                                                    >
                                                        {expandedStacks.has(
                                                            item.id
                                                        ) ? (
                                                            // Minimal modern collapse icon (chevron up)
                                                            <svg
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 20 20"
                                                                fill="none"
                                                            >
                                                                <path
                                                                    d="M6 12l4-4 4 4"
                                                                    stroke="#2563eb"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            // Minimal modern expand icon (chevron down)
                                                            <svg
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 20 20"
                                                                fill="none"
                                                            >
                                                                <path
                                                                    d="M6 8l4 4 4-4"
                                                                    stroke="#2563eb"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                            <td className="py-2 px-2 border-b font-semibold text-blue-900 max-w-[120px] truncate">
                                                {item.name}
                                            </td>
                                            <td className="py-2 px-2 border-b text-blue-700">
                                                <span>{item.total}</span>
                                            </td>
                                            <td className="py-2 px-2 border-b text-blue-700 max-w-[120px] truncate">
                                                <span
                                                    title={item.description}
                                                    className="block truncate"
                                                >
                                                    {truncate(
                                                        item.description,
                                                        24
                                                    )}
                                                </span>
                                            </td>
                                            <td className="py-2 px-2 border-b text-blue-700 max-w-[120px] truncate">
                                                {item.category.name}
                                            </td>
                                            <td className="py-2 px-2 border-b text-blue-700">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                    className="bg-green-500 text-white font-bold px-3 py-1 rounded hover:bg-green-600 transition w-full sm:w-auto"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedStacks.has(item.id) &&
                                            selectedItemStacks &&
                                            selectedItemStacks.id ===
                                                item.id && (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="bg-blue-50"
                                                    >
                                                        <div className="px-2 py-2 w-full overflow-x-auto">
                                                            <table className="min-w-full bg-white rounded shadow">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="py-2 px-3 bg-blue-100 text-left font-semibold text-blue-800">
                                                                            Status
                                                                        </th>
                                                                        <th className="py-2 px-3 bg-blue-100 text-left font-semibold text-blue-800">
                                                                            Qty
                                                                        </th>
                                                                        <th className="py-2 px-3 bg-blue-100 text-left font-semibold text-blue-800">
                                                                            Actions
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {Object.entries(
                                                                        selectedItemStacks.item_stacks.reduce(
                                                                            (
                                                                                acc,
                                                                                stack
                                                                            ) => {
                                                                                if (
                                                                                    !acc[
                                                                                        stack
                                                                                            .status
                                                                                    ]
                                                                                ) {
                                                                                    acc[
                                                                                        stack.status
                                                                                    ] =
                                                                                        {
                                                                                            stacks: [],
                                                                                            totalQuantity: 0,
                                                                                        };
                                                                                }
                                                                                acc[
                                                                                    stack
                                                                                        .status
                                                                                ].stacks.push(
                                                                                    stack
                                                                                );
                                                                                acc[
                                                                                    stack.status
                                                                                ].totalQuantity +=
                                                                                    stack.quantity;
                                                                                return acc;
                                                                            },
                                                                            {}
                                                                        )
                                                                    ).map(
                                                                        (
                                                                            [
                                                                                status,
                                                                                {
                                                                                    stacks,
                                                                                    totalQuantity,
                                                                                },
                                                                            ],
                                                                            index,
                                                                            array
                                                                        ) => (
                                                                            <tr
                                                                                key={
                                                                                    status
                                                                                }
                                                                                className={
                                                                                    index ===
                                                                                    array.length -
                                                                                        1
                                                                                        ? ''
                                                                                        : 'border-b border-blue-100'
                                                                                }
                                                                            >
                                                                                <td className="py-2 px-3">
                                                                                    <span
                                                                                        className={`px-2 py-1 rounded font-semibold
                                                                                ${
                                                                                    status ===
                                                                                    'Available'
                                                                                        ? 'bg-green-100 text-green-800'
                                                                                        : ''
                                                                                }
                                                                                ${
                                                                                    status ===
                                                                                    'Unavailable'
                                                                                        ? 'bg-red-100 text-red-800'
                                                                                        : ''
                                                                                }
                                                                                ${
                                                                                    status ===
                                                                                    'Damaged'
                                                                                        ? 'bg-red-100 text-red-800'
                                                                                        : ''
                                                                                }
                                                                                ${
                                                                                    status ===
                                                                                    'Lost'
                                                                                        ? 'bg-gray-100 text-gray-800'
                                                                                        : ''
                                                                                }
                                                                                ${
                                                                                    status ===
                                                                                    'EIC'
                                                                                        ? 'bg-purple-100 text-purple-800'
                                                                                        : ''
                                                                                }
                                                                                ${
                                                                                    status ===
                                                                                    'Distributed'
                                                                                        ? 'bg-blue-100 text-blue-800'
                                                                                        : ''
                                                                                }`}
                                                                                    >
                                                                                        {
                                                                                            status
                                                                                        }
                                                                                    </span>
                                                                                </td>
                                                                                <td className="py-2 px-3 text-blue-700">
                                                                                    {
                                                                                        totalQuantity
                                                                                    }
                                                                                </td>
                                                                                <td className="py-2 px-3">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setSelectedItemStacks(
                                                                                                {
                                                                                                    ...selectedItemStacks,
                                                                                                    currentStatus:
                                                                                                        status,
                                                                                                    currentStacks:
                                                                                                        stacks,
                                                                                                }
                                                                                            );
                                                                                            setShowStacksModal(
                                                                                                true
                                                                                            );
                                                                                        }}
                                                                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition w-full sm:w-auto"
                                                                                    >
                                                                                        Logs
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    )}
                                                                </tbody>
                                                            </table>
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
            </div>
            {/* UI Size Control */}
            <div className="w-full flex flex-col sm:flex-row justify-end items-center mt-8 mr-8 mb-2 gap-2">
                <label className="font-semibold text-blue-700">UI Size:</label>
                <select
                    value={uiSize}
                    onChange={(e) => setUiSize(e.target.value)}
                    className="border border-blue-200 rounded px-3 py-2 bg-blue-50 text-blue-900 w-full sm:w-auto"
                >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                </select>
            </div>
        </div>
    );
}

export default Content;
