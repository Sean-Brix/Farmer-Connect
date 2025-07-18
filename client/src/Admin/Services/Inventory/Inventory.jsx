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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteStackModal, setShowDeleteStackModal] = useState(false);
    const [stackToDelete, setStackToDelete] = useState(null);
    const [editItemId, setEditItemId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [uiSize, setUiSize] = useState('md'); // 'sm', 'md', 'lg'

    // Stack Edit Modal states
    const [showStackEditModal, setShowStackEditModal] = useState(false);
    const [stackEditData, setStackEditData] = useState(null);
    const [stackEditForm, setStackEditForm] = useState({
        action: 'reduce', // 'reduce', 'transfer', 'add'
        quantity: '',
        targetStatus: 'Available',
    });

    // Modern Alert State
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
            2000
        );
    };

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

    // Commented out - needs to be updated for new data structure with stacks
    // useEffect(() => {
    //     if (items.length > 0) {
    //         items.forEach(async (item) => {
    //             if (item.quantity === 0 && item.status !== 'Out of Stock') {
    //                 try {
    //                     const response = await fetch(
    //                         '/api/inventory/editItem',
    //                         {
    //                             method: 'POST',
    //                             headers: {
    //                                 'Content-Type': 'application/json',
    //                             },
    //                             body: JSON.stringify({
    //                                 ...item,
    //                                 status: 'Out of Stock',
    //                             }),
    //                         }
    //                     );
    //                     if (!response.ok) {
    //                         throw new Error(
    //                             `HTTP error! status: ${response.status}`
    //                         );
    //                     }
    //                     fetchItems();
    //                 } catch (error) {
    //                     console.error(
    //                         `Failed to update status for item ${item.id}:`,
    //                         error
    //                     );
    //                 }
    //             } else if (
    //                 item.status === 'Out of Stock' &&
    //                 item.quantity > 0
    //             ) {
    //                 try {
    //                     const response = await fetch(
    //                         '/api/inventory/editItem',
    //                         {
    //                             method: 'POST',
    //                             headers: {
    //                                 'Content-Type': 'application/json',
    //                             },
    //                             body: JSON.stringify({
    //                                 ...item,
    //                                 status: 'Available',
    //                             }),
    //                         }
    //                     );
    //                     if (!response.ok) {
    //                         throw new Error(
    //                             `HTTP error! status: ${response.status}`
    //                         );
    //                     }
    //                     fetchItems();
    //                 } catch (error) {
    //                     console.error(
    //                         `Failed to update status for item ${item.id}:`,
    //                         error
    //                     );
    //                 }
    //             }
    //         });
    //     }
    // }, [items]);

    // Separate useEffect to update selectedItemStacks when items change
    useEffect(() => {
        if (selectedItemStacks && items.length > 0) {
            const updatedItem = items.find(
                (item) => item.id === selectedItemStacks.id
            );
            if (
                updatedItem &&
                JSON.stringify(updatedItem.stacks) !==
                    JSON.stringify(selectedItemStacks.stacks)
            ) {
                setSelectedItemStacks(updatedItem);
            }
        }
    }, [items, selectedItemStacks]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (formData) => {
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

            setShowModal(false);
            await fetchItems(); // Wait for items to be fetched
            showAlert('Item added successfully', 'success');
        } catch (error) {
            console.error('Failed to create item:', error);
            showAlert('Failed to add item', 'error');
            return;
        }
    };

    const handleEdit = (item) => {
        setEditItemId(item.id);
        setForm({
            id: item.id,
            name: item.name,
            quantity: item.totalQuantity || 0,
            description: item.description,
            category: item.category,
            status: 'Available', // Default status for new items
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
            showAlert('Item updated successfully', 'success');
        } catch (error) {
            console.error('Failed to update item:', error);
            showAlert('Failed to update item', 'error');
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
            statusFilter === 'All' ||
            (item.stacks &&
                item.stacks.some((stack) => stack.status === statusFilter));
        return matchesSearch && matchesCategoryFilter && matchesStatusFilter;
    });

    const truncate = (str, n = 24) =>
        str && str.length > n ? str.slice(0, n) + '...' : str;

    const handleRemoveSelected = async () => {
        if (selectedItems.length === 0) {
            showAlert('No items selected for deletion', 'error');
            return;
        }

        // Show confirmation modal
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const deletePromises = selectedItems.map(async (id) => {
                const token = localStorage.getItem('authToken');
                const response = await fetch(
                    `/api/inventory/item/delete/${id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error ||
                            `HTTP error! status: ${response.status}`
                    );
                }

                return await response.json();
            });

            await Promise.all(deletePromises);

            // Reset selection and refresh items
            setSelectedItems([]);
            setSelectAll(false);
            setShowDelete(false);
            setShowDeleteModal(false);
            fetchItems();

            showAlert(
                `Deleted ${selectedItems.length} item${
                    selectedItems.length > 1 ? 's' : ''
                }`,
                'delete'
            );
        } catch (error) {
            console.error('Failed to delete items:', error);
            showAlert(
                `Failed to delete selected items: ${error.message}`,
                'error'
            );
            setShowDeleteModal(false);
        }
    };

    const handleDeleteStack = async (stackId, stackInfo) => {
        // Store stack info and show confirmation modal
        setStackToDelete({ stackId, stackInfo });
        setShowDeleteStackModal(true);
    };

    const handleConfirmDeleteStack = async () => {
        if (!stackToDelete) return;

        const { stackId, stackInfo } = stackToDelete;

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(
                `/api/inventory/stack/delete/${stackId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || `HTTP error! status: ${response.status}`
                );
            }

            const result = await response.json();

            // Refresh items and show success message
            fetchItems();
            showAlert(
                `Successfully deleted stack (Qty: ${stackInfo.quantity})`,
                'success'
            );

            // Close modals and reset state
            setShowDeleteStackModal(false);
            setStackToDelete(null);
            setShowStacksModal(false);
            setSelectedItemStacks(null);
        } catch (error) {
            console.error('Failed to delete stack:', error);
            showAlert(`Failed to delete stack: ${error.message}`, 'error');
            setShowDeleteStackModal(false);
            setStackToDelete(null);
        }
    };

    const handleEditStack = (status, stacks, totalQuantity) => {
        setStackEditData({
            status,
            stacks,
            totalQuantity,
            itemId: selectedItemStacks.id,
            itemName: selectedItemStacks.name,
        });
        setStackEditForm({
            action: 'reduce',
            quantity: '',
            targetStatus:
                statuses.filter((s) => s !== status)[0] || 'Available',
        });
        setShowStackEditModal(true);
    };

    const handleStackEditFormChange = (e) => {
        setStackEditForm({
            ...stackEditForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleStackEditSubmit = async (e) => {
        e.preventDefault();

        if (
            !stackEditData ||
            !stackEditForm.quantity ||
            stackEditForm.quantity <= 0
        ) {
            showAlert('Please enter a valid quantity', 'error');
            return;
        }

        const quantity = parseInt(stackEditForm.quantity);

        if (
            stackEditForm.action === 'reduce' &&
            quantity > stackEditData.totalQuantity
        ) {
            showAlert(
                `Cannot reduce more than available quantity (${stackEditData.totalQuantity})`,
                'error'
            );
            return;
        }

        if (
            stackEditForm.action === 'transfer' &&
            quantity > stackEditData.totalQuantity
        ) {
            showAlert(
                `Cannot transfer more than available quantity (${stackEditData.totalQuantity})`,
                'error'
            );
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            let endpoint = '';
            let method = 'POST';
            let body = {};

            switch (stackEditForm.action) {
                case 'reduce':
                    endpoint = `/api/inventory/stack/reduce`;
                    body = {
                        itemId: stackEditData.itemId,
                        status: stackEditData.status,
                        quantity: quantity,
                    };
                    break;

                case 'transfer':
                    endpoint = `/api/inventory/stack/transfer`;
                    body = {
                        itemId: stackEditData.itemId,
                        fromStatus: stackEditData.status,
                        toStatus: stackEditForm.targetStatus,
                        quantity: quantity,
                    };
                    break;

                case 'add':
                    endpoint = `/api/inventory/stack/add`;
                    body = {
                        itemId: stackEditData.itemId,
                        status: stackEditData.status,
                        quantity: quantity,
                    };
                    break;
            }

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || `HTTP error! status: ${response.status}`
                );
            }

            const result = await response.json();

            // Refresh items and show success message
            fetchItems();

            let successMessage = '';
            switch (stackEditForm.action) {
                case 'reduce':
                    successMessage = `Successfully reduced ${quantity} items from ${stackEditData.status} status`;
                    break;
                case 'transfer':
                    successMessage = `Successfully transferred ${quantity} items from ${stackEditData.status} to ${stackEditForm.targetStatus}`;
                    break;
                case 'add':
                    successMessage = `Successfully added ${quantity} items to ${stackEditData.status} status`;
                    break;
            }

            showAlert(successMessage, 'success');

            // Close modal and reset state
            setShowStackEditModal(false);
            setStackEditData(null);
            setStackEditForm({
                action: 'reduce',
                quantity: '',
                targetStatus: 'Available',
            });
        } catch (error) {
            console.error('Failed to edit stack:', error);
            showAlert(`Failed to edit stack: ${error.message}`, 'error');
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
        <>
            {/* Modern Centered Alert */}
            {alert.show && (
                <div
                    className={`fixed top-6 left-1/2 z-50 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3
                    ${
                        alert.type === 'success'
                            ? 'bg-green-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                    }`}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        {alert.type === 'success' ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        )}
                    </svg>
                    <span className="font-medium">{alert.message}</span>
                </div>
            )}

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
                        uiSize === 'lg'
                            ? 'p-6'
                            : uiSize === 'md'
                            ? 'p-4'
                            : 'p-2'
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
                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow p-6 w-full max-w-md relative border border-red-100 mx-2">
                            <button
                                className="absolute top-2 right-2 text-red-400 hover:text-red-700 text-xl transition"
                                onClick={() => setShowDeleteModal(false)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <div className="text-center">
                                <h2 className="text-lg font-bold mb-4 text-red-800">
                                    Confirm Deletion
                                </h2>
                                <div className="mb-6">
                                    <p className="text-gray-700 mb-2">
                                        Are you sure you want to delete{' '}
                                        <span className="font-semibold text-red-600">
                                            {selectedItems.length}
                                        </span>{' '}
                                        selected item
                                        {selectedItems.length > 1 ? 's' : ''}?
                                    </p>
                                    <p className="text-sm text-red-600 font-medium">
                                        This action cannot be undone.
                                    </p>
                                </div>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() =>
                                            setShowDeleteModal(false)
                                        }
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Delete Stack Confirmation Modal */}
                {showDeleteStackModal && stackToDelete && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow p-6 w-full max-w-md relative border border-red-100 mx-2">
                            <button
                                className="absolute top-2 right-2 text-red-400 hover:text-red-700 text-xl transition"
                                onClick={() => {
                                    setShowDeleteStackModal(false);
                                    setStackToDelete(null);
                                }}
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <div className="text-center">
                                <h2 className="text-lg font-bold mb-4 text-red-800">
                                    Confirm Stack Deletion
                                </h2>
                                <div className="mb-6">
                                    <p className="text-gray-700 mb-2">
                                        Are you sure you want to delete{' '}
                                        <span className="font-semibold text-red-600">
                                            Stack #
                                            {stackToDelete.stackInfo.index + 1}
                                        </span>{' '}
                                        with quantity{' '}
                                        <span className="font-semibold text-red-600">
                                            {stackToDelete.stackInfo.quantity}
                                        </span>
                                        ?
                                    </p>
                                    <p className="text-sm text-red-600 font-medium">
                                        This action cannot be undone.
                                    </p>
                                </div>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => {
                                            setShowDeleteStackModal(false);
                                            setStackToDelete(null);
                                        }}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDeleteStack}
                                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                                    >
                                        Delete Stack
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Stack Edit Modal */}
                {showStackEditModal && stackEditData && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow p-6 w-full max-w-md relative border border-blue-100 mx-2">
                            <button
                                className="absolute top-2 right-2 text-blue-400 hover:text-blue-700 text-xl transition"
                                onClick={() => {
                                    setShowStackEditModal(false);
                                    setStackEditData(null);
                                    setStackEditForm({
                                        action: 'reduce',
                                        quantity: '',
                                        targetStatus: 'Available',
                                    });
                                }}
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <div className="text-center">
                                <h2 className="text-lg font-bold mb-4 text-blue-800">
                                    Edit Stack
                                </h2>
                                <div className="mb-4 text-sm text-gray-600">
                                    <p>
                                        <strong>Item:</strong>{' '}
                                        {stackEditData.itemName}
                                    </p>
                                    <p>
                                        <strong>Status:</strong>{' '}
                                        {stackEditData.status}
                                    </p>
                                    <p>
                                        <strong>Current Quantity:</strong>{' '}
                                        {stackEditData.totalQuantity}
                                    </p>
                                </div>
                                <form onSubmit={handleStackEditSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Action
                                        </label>
                                        <select
                                            name="action"
                                            value={stackEditForm.action}
                                            onChange={handleStackEditFormChange}
                                            className="w-full border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50"
                                        >
                                            <option value="reduce">
                                                Reduce Quantity
                                            </option>
                                            <option value="transfer">
                                                Transfer to Another Status
                                            </option>
                                            <option value="add">
                                                Add New Items
                                            </option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={stackEditForm.quantity}
                                            onChange={handleStackEditFormChange}
                                            min="1"
                                            max={
                                                stackEditForm.action === 'add'
                                                    ? undefined
                                                    : stackEditData.totalQuantity
                                            }
                                            className="w-full border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50"
                                            placeholder="Enter quantity"
                                            required
                                        />
                                    </div>

                                    {stackEditForm.action === 'transfer' && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Target Status
                                            </label>
                                            <select
                                                name="targetStatus"
                                                value={
                                                    stackEditForm.targetStatus
                                                }
                                                onChange={
                                                    handleStackEditFormChange
                                                }
                                                className="w-full border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50"
                                            >
                                                {statuses
                                                    .filter(
                                                        (status) =>
                                                            status !==
                                                            stackEditData.status
                                                    )
                                                    .map((status) => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {status}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="flex gap-3 justify-center">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowStackEditModal(false);
                                                setStackEditData(null);
                                                setStackEditForm({
                                                    action: 'reduce',
                                                    quantity: '',
                                                    targetStatus: 'Available',
                                                });
                                            }}
                                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                                        >
                                            {stackEditForm.action === 'reduce'
                                                ? 'Reduce'
                                                : stackEditForm.action ===
                                                  'transfer'
                                                ? 'Transfer'
                                                : 'Add'}
                                        </button>
                                    </div>
                                </form>
                            </div>
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
                                        {selectedItemStacks.currentStatus}{' '}
                                        Stacks
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
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-blue-900 font-medium">
                                                            Stack #{index + 1}
                                                        </span>
                                                        <span className="text-blue-700">
                                                            Qty:{' '}
                                                            {stack.quantity}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteStack(
                                                                stack.id,
                                                                {
                                                                    index,
                                                                    quantity:
                                                                        stack.quantity,
                                                                }
                                                            )
                                                        }
                                                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete Stack"
                                                        aria-label={`Delete Stack #${
                                                            index + 1
                                                        }`}
                                                    >
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
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
                                                                background:
                                                                    'none',
                                                                border: 'none',
                                                            }}
                                                        >
                                                            {expandedStacks.has(
                                                                item.id
                                                            ) ? (
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
                                                            ) : (
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
                                                            )}
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="py-2 px-2 border-b font-semibold text-blue-900 max-w-[120px] truncate">
                                                    {item.name}
                                                </td>
                                                <td className="py-2 px-2 border-b text-blue-700">
                                                    <span>
                                                        {item.totalQuantity}
                                                    </span>
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
                                                    {item.category}
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
                                                                            <th className="py-2 px-3 bg-blue-100 text-left font-semibold text-blue-800 w-[50px]">
                                                                                Edit
                                                                            </th>
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
                                                                            selectedItemStacks.stacks.reduce(
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
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                handleEditStack(
                                                                                                    status,
                                                                                                    stacks,
                                                                                                    totalQuantity
                                                                                                )
                                                                                            }
                                                                                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                                                            title="Edit Stack"
                                                                                            aria-label={`Edit ${status} stack`}
                                                                                        >
                                                                                            <svg
                                                                                                className="w-4 h-4"
                                                                                                fill="none"
                                                                                                stroke="currentColor"
                                                                                                strokeWidth="2"
                                                                                                viewBox="0 0 24 24"
                                                                                            >
                                                                                                <path
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                                                />
                                                                                            </svg>
                                                                                        </button>
                                                                                    </td>
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
                    <label className="font-semibold text-blue-700">
                        UI Size:
                    </label>
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
        </>
    );
}

export default Content;
