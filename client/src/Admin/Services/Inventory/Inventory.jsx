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

const statuses = ['Available', 'Unavailable', 'Damaged', 'EIC', 'Distributed'];

function Content() {
    const [items, setItems] = useState([]);
    const [expandedStacks, setExpandedStacks] = useState(new Set());
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
    const [editForm, setEditForm] = useState({});
    const [uiSize, setUiSize] = useState('md'); // 'sm', 'md', 'lg'

    // Stack Edit Modal states - REMOVED - using inline editing instead
    // const [showStackEditModal, setShowStackEditModal] = useState(false);
    // const [stackEditData, setStackEditData] = useState(null);
    // const [stackEditForm, setStackEditForm] = useState({
    //     action: 'reduce', // 'reduce', 'transfer', 'add'
    //     quantity: '',
    //     targetStatus: 'Available',
    // });

    // Modern Alert State
    const [alert, setAlert] = useState({
        show: false,
        message: '',
        type: '',
    });

    // Individual Stack Edit States
    const [editingStacks, setEditingStacks] = useState(new Set());
    const [stackEditValues, setStackEditValues] = useState({});

    // Status row editing (for the main expandable table)
    const [editingStatusRows, setEditingStatusRows] = useState(new Set());
    const [statusEditValues, setStatusEditValues] = useState({});

    // Selected item stacks for expanded view
    const [selectedItemStacks, setSelectedItemStacks] = useState(null);

    // Sorting state
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

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
        setEditForm({
            name: item.name,
            description: item.description,
            category: item.category,
        });
    };

    const handleEditFormChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    const handleSaveEdit = async () => {
        if (!editForm.name.trim()) {
            showAlert('Item name is required', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/inventory/item/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editItemId,
                    ...editForm,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setEditItemId(null);
            setEditForm({});
            fetchItems();
            showAlert('Item updated successfully', 'success');
        } catch (error) {
            console.error('Failed to update item:', error);
            showAlert('Failed to update item', 'error');
        }
    };

    const handleCancelEdit = () => {
        setEditItemId(null);
        setEditForm({});
    };

    const filteredItems = items
        .filter((item) => {
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
        })
        .sort((a, b) => {
            // Sort by name (case-insensitive)
            if (sortOrder === 'asc') {
                return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
            } else {
                return (b.name || '').localeCompare(a.name || '', undefined, { sensitivity: 'base' });
            }
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
            // setShowStacksModal(false); // Removed - logs modal no longer exists
            setSelectedItemStacks(null);
        } catch (error) {
            console.error('Failed to delete stack:', error);
            showAlert(`Failed to delete stack: ${error.message}`, 'error');
            setShowDeleteStackModal(false);
            setStackToDelete(null);
        }
    };

    const handleToggleStatusRowEdit = (status, totalQuantity) => {
        const statusKey = `${selectedItemStacks.id}-${status}`;
        const newEditingStatusRows = new Set(editingStatusRows);
        const newStatusEditValues = { ...statusEditValues };

        if (editingStatusRows.has(statusKey)) {
            // Stop editing
            newEditingStatusRows.delete(statusKey);
            delete newStatusEditValues[statusKey];
        } else {
            // Start editing
            newEditingStatusRows.add(statusKey);
            newStatusEditValues[statusKey] = totalQuantity;
        }

        setEditingStatusRows(newEditingStatusRows);
        setStatusEditValues(newStatusEditValues);
    };

    const handleStatusRowValueChange = (status, value) => {
        const statusKey = `${selectedItemStacks.id}-${status}`;
        setStatusEditValues({
            ...statusEditValues,
            [statusKey]: parseInt(value) || 0,
        });
    };

    const handleIncreaseStatusRowQuantity = async (status, stacks) => {
        if (stacks.length === 0) {
            // Create new stack with status
            await handleIncreaseQuantity(status, stacks);
        } else {
            // Use the first stack for the operation
            const firstStackId = stacks[0]?.id;
            if (firstStackId) {
                await handleIncreaseStackQuantity(
                    firstStackId,
                    stacks[0].quantity
                );
            }
        }
    };

    const handleDecreaseStatusRowQuantity = async (
        status,
        stacks,
        totalQuantity
    ) => {
        if (totalQuantity <= 1) {
            showAlert(
                'Cannot decrease quantity below 1. Use delete instead.',
                'error'
            );
            return;
        }

        if (stacks.length === 0) {
            showAlert('No stacks available to decrease', 'error');
            return;
        }

        // Use the first stack for the operation
        const firstStackId = stacks[0]?.id;
        if (firstStackId) {
            await handleDecreaseStackQuantity(firstStackId, stacks[0].quantity);
        }
    };

    const handleSaveStatusRowEdit = async (status, stacks, currentQuantity) => {
        const statusKey = `${selectedItemStacks.id}-${status}`;
        const newQuantity = statusEditValues[statusKey];

        if (newQuantity !== currentQuantity) {
            try {
                const token = localStorage.getItem('authToken');

                // Determine if we're updating an existing stack or creating a new one
                const requestBody = {
                    quantity: newQuantity,
                };

                if (stacks.length > 0) {
                    // Update existing stack using stackId
                    requestBody.stackId = stacks[0].id;
                } else {
                    // Create new stack using itemId and status
                    requestBody.itemId = selectedItemStacks.id;
                    requestBody.status = status;
                }

                const response = await fetch('/api/inventory/stack/edit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                showAlert('Stack quantity updated successfully', 'success');
                fetchItems(); // Refresh the data
            } catch (error) {
                console.error('Failed to update status quantity:', error);
                showAlert('Failed to update status quantity', 'error');
                return; // Don't clear editing state if there was an error
            }
        }

        // Stop editing mode
        const newEditingStatusRows = new Set(editingStatusRows);
        const newStatusEditValues = { ...statusEditValues };
        newEditingStatusRows.delete(statusKey);
        delete newStatusEditValues[statusKey];
        setEditingStatusRows(newEditingStatusRows);
        setStatusEditValues(newStatusEditValues);
    };

    const handleCancelStatusRowEdit = (status) => {
        const statusKey = `${selectedItemStacks.id}-${status}`;
        const newEditingStatusRows = new Set(editingStatusRows);
        const newStatusEditValues = { ...statusEditValues };
        newEditingStatusRows.delete(statusKey);
        delete newStatusEditValues[statusKey];
        setEditingStatusRows(newEditingStatusRows);
        setStatusEditValues(newStatusEditValues);
    };

    // handleStackEditSubmit function removed - using simpler inline editing instead

    // Placeholder functions for quantity adjustment
    const handleIncreaseQuantity = async (status, stacks) => {
        try {
            const token = localStorage.getItem('authToken');

            if (stacks.length > 0) {
                // Increase existing stack
                const firstStackId = stacks[0]?.id;
                const response = await fetch('/api/inventory/stack/edit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        stackId: firstStackId,
                        action: 'add',
                        quantity: 1,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } else {
                // Create new stack
                const response = await fetch('/api/inventory/stack/edit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        itemId: selectedItemStacks.id,
                        status: status,
                        action: 'add',
                        quantity: 1,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            showAlert(`Increased quantity for ${status}`, 'success');
            fetchItems(); // Refresh the data
        } catch (error) {
            console.error('Failed to increase quantity:', error);
            showAlert(`Failed to increase quantity for ${status}`, 'error');
        }
    };

    const handleDecreaseQuantity = async (status, stacks, currentQuantity) => {
        if (currentQuantity <= 0) {
            showAlert('Cannot decrease quantity below 0', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');

            if (stacks.length > 0) {
                const firstStackId = stacks[0]?.id;
                const response = await fetch('/api/inventory/stack/edit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        stackId: firstStackId,
                        action: 'reduce',
                        quantity: 1,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                showAlert(`Decreased quantity for ${status}`, 'success');
                fetchItems(); // Refresh the data
            } else {
                showAlert('No stack available to decrease', 'error');
            }
        } catch (error) {
            console.error('Failed to decrease quantity:', error);
            showAlert(`Failed to decrease quantity for ${status}`, 'error');
        }
    };

    // Individual stack quantity adjustment functions
    const handleIncreaseStackQuantity = async (stackId, stackQuantity) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/inventory/stack/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    stackId: stackId,
                    action: 'add',
                    quantity: 1,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            showAlert('Stack quantity increased successfully', 'success');
            fetchItems(); // Refresh the data
        } catch (error) {
            console.error('Failed to increase stack quantity:', error);
            showAlert('Failed to increase stack quantity', 'error');
        }
    };

    const handleDecreaseStackQuantity = async (stackId, stackQuantity) => {
        if (stackQuantity <= 1) {
            showAlert(
                'Cannot decrease quantity below 1. Use delete instead.',
                'error'
            );
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/inventory/stack/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    stackId: stackId,
                    action: 'reduce',
                    quantity: 1,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            showAlert('Stack quantity decreased successfully', 'success');
            fetchItems(); // Refresh the data
        } catch (error) {
            console.error('Failed to decrease stack quantity:', error);
            showAlert('Failed to decrease stack quantity', 'error');
        }
    };

    const handleBulkStackQuantityChange = async (
        stackId,
        newQuantity,
        currentQuantity
    ) => {
        if (newQuantity < 0) {
            showAlert('Quantity cannot be negative', 'error');
            return;
        }

        if (newQuantity === 0) {
            showAlert('Use delete button to remove stack completely', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/inventory/stack/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    stackId: stackId,
                    action: 'set',
                    quantity: newQuantity,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            showAlert('Stack quantity updated successfully', 'success');
            fetchItems(); // Refresh the data
        } catch (error) {
            console.error('Failed to change stack quantity:', error);
            showAlert('Failed to change stack quantity', 'error');
        }
    };

    const handleToggleStackEdit = (stackId, currentQuantity) => {
        const newEditingStacks = new Set(editingStacks);
        const newStackEditValues = { ...stackEditValues };

        if (editingStacks.has(stackId)) {
            // Stop editing
            newEditingStacks.delete(stackId);
            delete newStackEditValues[stackId];
        } else {
            // Start editing
            newEditingStacks.add(stackId);
            newStackEditValues[stackId] = currentQuantity;
        }

        setEditingStacks(newEditingStacks);
        setStackEditValues(newStackEditValues);
    };

    const handleStackEditValueChange = (stackId, value) => {
        setStackEditValues({
            ...stackEditValues,
            [stackId]: parseInt(value) || 0,
        });
    };

    const handleSaveStackEdit = async (stackId, currentQuantity) => {
        const newQuantity = stackEditValues[stackId];

        if (newQuantity !== currentQuantity) {
            await handleBulkStackQuantityChange(
                stackId,
                newQuantity,
                currentQuantity
            );
        }

        // Stop editing mode
        const newEditingStacks = new Set(editingStacks);
        const newStackEditValues = { ...stackEditValues };
        newEditingStacks.delete(stackId);
        delete newStackEditValues[stackId];
        setEditingStacks(newEditingStacks);
        setStackEditValues(newStackEditValues);
    };

    const handleCancelStackEdit = (stackId) => {
        const newEditingStacks = new Set(editingStacks);
        const newStackEditValues = { ...stackEditValues };
        newEditingStacks.delete(stackId);
        delete newStackEditValues[stackId];
        setEditingStacks(newEditingStacks);
        setStackEditValues(newStackEditValues);
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

    // Sorting handler
    const handleSortToggle = () => {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };


    const handleDragLeave = (e) => {
        // Only clear dragOverIndex if we're leaving the entire row
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDragOverIndex(null);
        }
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        setDragOverIndex(null);

        if (!draggedItem || draggedItem.index === dropIndex) {
            return;
        }

        const newItems = [...filteredItems];
        const draggedItemData = newItems[draggedItem.index];

        // Remove the dragged item from its original position
        newItems.splice(draggedItem.index, 1);

        // Insert the dragged item at the new position
        newItems.splice(dropIndex, 0, draggedItemData);

        // Update the items state with the new order
        // Note: This reorders only the filtered view. If you want to persist
        // the order permanently, you'd need to update the backend as well
        setItems(newItems);

        showAlert('Item order updated successfully!', 'success');
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

            {/* EIC-style Title Section with reduced top margin */}
            <div className="relative mb-6 mt-5 sm:mt-20 p-6 flex flex-col items-center justify-center max-w-5xl mx-auto gap-2 text-center">
                <span className="inline-flex items-center justify-center gap-3 w-full">
                    <span className="rounded-full bg-blue-100 p-2">
                        <svg className="w-9 h-9 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <span className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
                        Inventory Management
                    </span>
                </span>
                <span className="block text-base md:text-lg text-gray-500 font-medium mt-1">
                    Manage and monitor all inventory items and their stacks.
                </span>
            </div>

            <div
                className={`flex flex-col items-center justify-center min-h-[91vh] w-full bg-white rounded-xl shadow mt-2 transition-all
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
                    {/* Sorting Button above the table */}
                    {/* Sorting Button above the table, not in the search/filter controls */}

                    {!showDelete && (
                        <div className="text-center mb-3">
                            <p className="text-sm text-blue-600 font-medium flex items-center justify-center gap-2">
                                Click arrows to view stacks
                            </p>
                        </div>
                    )}
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
                {/* Stack Edit Modal removed - using inline editing instead */}

                {/* Removed logs modal - stack editing is now inline
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
                                                        {editingStacks.has(
                                                            stack.id
                                                        ) ? (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-blue-700">
                                                                    Qty:
                                                                </span>
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleDecreaseStackQuantity(
                                                                                stack.id,
                                                                                stackEditValues[
                                                                                    stack
                                                                                        .id
                                                                                ] ||
                                                                                    stack.quantity
                                                                            )
                                                                        }
                                                                        className="w-6 h-6 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center justify-center text-sm font-bold"
                                                                        disabled={
                                                                            stackEditValues[
                                                                                stack
                                                                                    .id
                                                                            ] <=
                                                                            1
                                                                        }
                                                                        title="Decrease quantity"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        value={
                                                                            stackEditValues[
                                                                                stack
                                                                                    .id
                                                                            ] ||
                                                                            stack.quantity
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleStackEditValueChange(
                                                                                stack.id,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="w-16 px-1 py-0.5 border border-blue-200 rounded text-center text-xs"
                                                                        min="1"
                                                                    />
                                                                    <button
                                                                        onClick={() =>
                                                                            handleIncreaseStackQuantity(
                                                                                stack.id,
                                                                                stackEditValues[
                                                                                    stack
                                                                                        .id
                                                                                ] ||
                                                                                    stack.quantity
                                                                            )
                                                                        }
                                                                        className="w-6 h-6 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center justify-center text-sm font-bold"
                                                                        title="Increase quantity"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-blue-700">
                                                                Qty:{' '}
                                                                {stack.quantity}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {editingStacks.has(
                                                            stack.id
                                                        ) ? (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        handleSaveStackEdit(
                                                                            stack.id,
                                                                            stack.quantity
                                                                        )
                                                                    }
                                                                    className="p-1 text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                                                                    title="Save changes"
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
                                                                            d="M5 13l4 4L19 7"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleCancelStackEdit(
                                                                            stack.id
                                                                        )
                                                                    }
                                                                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                                                                    title="Cancel edit"
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
                                                                            d="M6 18L18 6M6 6l12 12"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    handleToggleStackEdit(
                                                                        stack.id,
                                                                        stack.quantity
                                                                    )
                                                                }
                                                                className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                                title="Edit Stack"
                                                                aria-label={`Edit Stack #${
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
                                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        )}
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
                                                </div>
                                                {!editingStacks.has(
                                                    stack.id
                                                ) && (
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
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )} */}

                <div className="w-full mt-2">
                    {/* Sorting Button above the table */}
                    <div className="flex justify-end mb-2">
                        <button
                            onClick={handleSortToggle}
                            className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 hover:bg-blue-200 transition"
                        >
                            Sort: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                        </button>
                    </div>
                    <div className="overflow-x-auto rounded-xl shadow bg-white border border-blue-50 p-2 sm:p-4 w-full">
                        <table className="min-w-full bg-transparent rounded-xl">
                            <thead>
                                <tr>
                                    <th className="py-2 px-2 border-b text-left text-blue-700 font-semibold w-[60px]">
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
                                        ) : (
                                            <span className="text-xs text-blue-500 font-medium">
                                                Actions
                                            </span>
                                        )}
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
                                                <td className="py-2 px-2 border-b w-[60px]">
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
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                background: 'none',
                                                                border: 'none',
                                                            }}
                                                        >
                                                            {expandedStacks.has(
                                                                item.id
                                                            ) ? (
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
                                                <td className="py-2 px-2 border-b font-semibold text-blue-900 max-w-[120px]">
                                                    {editItemId === item.id ? (
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={
                                                                editForm.name ||
                                                                ''
                                                            }
                                                            onChange={
                                                                handleEditFormChange
                                                            }
                                                            onKeyDown={
                                                                handleKeyPress
                                                            }
                                                            className="w-full border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white text-sm"
                                                            required
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <span className="block truncate">
                                                            {item.name}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-2 px-2 border-b text-blue-700">
                                                    <span>
                                                        {item.totalQuantity}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-2 border-b text-blue-700 max-w-[120px]">
                                                    {editItemId === item.id ? (
                                                        <input
                                                            type="text"
                                                            name="description"
                                                            value={
                                                                editForm.description ||
                                                                ''
                                                            }
                                                            onChange={
                                                                handleEditFormChange
                                                            }
                                                            onKeyDown={
                                                                handleKeyPress
                                                            }
                                                            className="w-full border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white text-sm"
                                                            placeholder="Description"
                                                        />
                                                    ) : (
                                                        <span
                                                            title={
                                                                item.description
                                                            }
                                                            className="block truncate"
                                                        >
                                                            {truncate(
                                                                item.description,
                                                                24
                                                            )}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-2 px-2 border-b text-blue-700 max-w-[120px]">
                                                    {editItemId === item.id ? (
                                                        <select
                                                            name="category"
                                                            value={
                                                                editForm.category ||
                                                                item.category
                                                            }
                                                            onChange={
                                                                handleEditFormChange
                                                            }
                                                            onKeyDown={
                                                                handleKeyPress
                                                            }
                                                            className="w-full border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white text-sm"
                                                        >
                                                            {categories.map(
                                                                (cat) => (
                                                                    <option
                                                                        key={
                                                                            cat
                                                                        }
                                                                        value={
                                                                            cat
                                                                        }
                                                                    >
                                                                        {cat}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    ) : (
                                                        <span className="block truncate">
                                                            {item.category}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-2 px-2 border-b text-blue-700">
                                                    {editItemId === item.id ? (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={
                                                                    handleSaveEdit
                                                                }
                                                                className="bg-green-500 text-white font-bold px-2 py-1 rounded hover:bg-green-600 transition text-xs"
                                                                title="Save changes"
                                                            >
                                                                ✓
                                                            </button>
                                                            <button
                                                                onClick={
                                                                    handleCancelEdit
                                                                }
                                                                className="bg-red-500 text-white font-bold px-2 py-1 rounded hover:bg-red-600 transition text-xs"
                                                                title="Cancel editing"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(item)
                                                            }
                                                            className="bg-green-500 text-white font-bold px-3 py-1 rounded hover:bg-green-600 transition w-full sm:w-auto"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                            {expandedStacks.has(item.id) &&
                                                selectedItemStacks &&
                                                selectedItemStacks.id ===
                                                    item.id && (
                                                    <tr>
                                                        <td
                                                            colSpan={6}
                                                            className="p-0 bg-gradient-to-r from-blue-50 to-indigo-50"
                                                        >
                                                            <div className="p-4">
                                                                <div className="mb-3">
                                                                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                                        <svg
                                                                            className="w-4 h-4 text-blue-500"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                                                            />
                                                                        </svg>
                                                                        Inventory
                                                                        Stacks
                                                                        for{' '}
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </h4>
                                                                </div>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                                                                    {(() => {
                                                                        // Group existing stacks by status
                                                                        const groupedStacks =
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
                                                                            );

                                                                        // Create entries for all statuses, including those without stacks
                                                                        return statuses.map(
                                                                            (
                                                                                status
                                                                            ) => {
                                                                                const statusData =
                                                                                    groupedStacks[
                                                                                        status
                                                                                    ] || {
                                                                                        stacks: [],
                                                                                        totalQuantity: 0,
                                                                                    };

                                                                                const getStatusStyles =
                                                                                    (
                                                                                        status
                                                                                    ) => {
                                                                                        switch (
                                                                                            status
                                                                                        ) {
                                                                                            case 'Available':
                                                                                                return {
                                                                                                    bg: 'bg-gradient-to-br from-green-50 to-emerald-100',
                                                                                                    border: 'border-green-200',
                                                                                                    badge: 'bg-green-500 text-white',
                                                                                                    icon: 'text-green-600',
                                                                                                };
                                                                                            case 'Unavailable':
                                                                                                return {
                                                                                                    bg: 'bg-gradient-to-br from-red-50 to-rose-100',
                                                                                                    border: 'border-red-200',
                                                                                                    badge: 'bg-red-500 text-white',
                                                                                                    icon: 'text-red-600',
                                                                                                };
                                                                                            case 'Damaged':
                                                                                                return {
                                                                                                    bg: 'bg-gradient-to-br from-orange-50 to-red-100',
                                                                                                    border: 'border-orange-200',
                                                                                                    badge: 'bg-orange-500 text-white',
                                                                                                    icon: 'text-orange-600',
                                                                                                };
                                                                                            case 'EIC':
                                                                                                return {
                                                                                                    bg: 'bg-gradient-to-br from-purple-50 to-violet-100',
                                                                                                    border: 'border-purple-200',
                                                                                                    badge: 'bg-purple-500 text-white',
                                                                                                    icon: 'text-purple-600',
                                                                                                };
                                                                                            case 'Distributed':
                                                                                                return {
                                                                                                    bg: 'bg-gradient-to-br from-blue-50 to-cyan-100',
                                                                                                    border: 'border-blue-200',
                                                                                                    badge: 'bg-blue-500 text-white',
                                                                                                    icon: 'text-blue-600',
                                                                                                };
                                                                                            default:
                                                                                                return {
                                                                                                    bg: 'bg-gradient-to-br from-gray-50 to-slate-100',
                                                                                                    border: 'border-gray-200',
                                                                                                    badge: 'bg-gray-500 text-white',
                                                                                                    icon: 'text-gray-600',
                                                                                                };
                                                                                        }
                                                                                    };

                                                                                const styles =
                                                                                    getStatusStyles(
                                                                                        status
                                                                                    );
                                                                                const statusKey = `${selectedItemStacks.id}-${status}`;
                                                                                const isEditing =
                                                                                    editingStatusRows.has(
                                                                                        statusKey
                                                                                    );

                                                                                return (
                                                                                    <div
                                                                                        key={
                                                                                            status
                                                                                        }
                                                                                        className={`${styles.bg} ${styles.border} border-2 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1`}
                                                                                    >
                                                                                        <div className="flex items-center justify-between mb-3">
                                                                                            <span
                                                                                                className={`${styles.badge} px-2 py-1 rounded-full text-xs font-semibold tracking-wide`}
                                                                                            >
                                                                                                {
                                                                                                    status
                                                                                                }
                                                                                            </span>
                                                                                            <div
                                                                                                className={`${styles.icon} p-1`}
                                                                                            >
                                                                                                {status ===
                                                                                                    'Available' && (
                                                                                                    <svg
                                                                                                        className="w-5 h-5"
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                    >
                                                                                                        <path
                                                                                                            fillRule="evenodd"
                                                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                                            clipRule="evenodd"
                                                                                                        />
                                                                                                    </svg>
                                                                                                )}
                                                                                                {status ===
                                                                                                    'Unavailable' && (
                                                                                                    <svg
                                                                                                        className="w-5 h-5"
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                    >
                                                                                                        <path
                                                                                                            fillRule="evenodd"
                                                                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                                                            clipRule="evenodd"
                                                                                                        />
                                                                                                    </svg>
                                                                                                )}
                                                                                                {status ===
                                                                                                    'Damaged' && (
                                                                                                    <svg
                                                                                                        className="w-5 h-5"
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                    >
                                                                                                        <path
                                                                                                            fillRule="evenodd"
                                                                                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                                                                            clipRule="evenodd"
                                                                                                        />
                                                                                                    </svg>
                                                                                                )}
                                                                                                {status ===
                                                                                                    'EIC' && (
                                                                                                    <svg
                                                                                                        className="w-5 h-5"
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                    >
                                                                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                                    </svg>
                                                                                                )}
                                                                                                {status ===
                                                                                                    'Distributed' && (
                                                                                                    <svg
                                                                                                        className="w-5 h-5"
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                    >
                                                                                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                                                                                    </svg>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="text-center mb-3">
                                                                                            <div className="text-2xl font-bold text-gray-800 mb-1">
                                                                                                {
                                                                                                    statusData.totalQuantity
                                                                                                }
                                                                                            </div>
                                                                                            <div className="text-xs text-gray-600 font-medium">
                                                                                                {statusData.totalQuantity ===
                                                                                                1
                                                                                                    ? 'unit'
                                                                                                    : 'units'}
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="flex justify-center">
                                                                                            {isEditing ? (
                                                                                                <div className="flex flex-col gap-2 w-full">
                                                                                                    <div className="bg-white rounded-lg p-2 shadow-sm">
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={
                                                                                                                statusEditValues[
                                                                                                                    statusKey
                                                                                                                ] ||
                                                                                                                statusData.totalQuantity
                                                                                                            }
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) =>
                                                                                                                handleStatusRowValueChange(
                                                                                                                    status,
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .value
                                                                                                                )
                                                                                                            }
                                                                                                            className="w-full px-2 py-1 border border-gray-200 rounded text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                                                                            min="0"
                                                                                                            placeholder="Enter quantity"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="flex gap-1">
                                                                                                        <button
                                                                                                            onClick={() =>
                                                                                                                handleSaveStatusRowEdit(
                                                                                                                    status,
                                                                                                                    statusData.stacks,
                                                                                                                    statusData.totalQuantity
                                                                                                                )
                                                                                                            }
                                                                                                            className="flex-1 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                                                                                                            title="Save changes"
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
                                                                                                                    d="M5 13l4 4L19 7"
                                                                                                                />
                                                                                                            </svg>
                                                                                                            <span className="text-xs font-medium">
                                                                                                                Save
                                                                                                            </span>
                                                                                                        </button>
                                                                                                        <button
                                                                                                            onClick={() =>
                                                                                                                handleCancelStatusRowEdit(
                                                                                                                    status
                                                                                                                )
                                                                                                            }
                                                                                                            className="flex-1 p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center gap-1"
                                                                                                            title="Cancel edit"
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
                                                                                                                    d="M6 18L18 6M6 6l12 12"
                                                                                                                />
                                                                                                            </svg>
                                                                                                            <span className="text-xs font-medium">
                                                                                                                Cancel
                                                                                                            </span>
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <button
                                                                                                    onClick={() =>
                                                                                                        handleToggleStatusRowEdit(
                                                                                                            status,
                                                                                                            statusData.totalQuantity
                                                                                                        )
                                                                                                    }
                                                                                                    className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-lg hover:shadow-md transition-all duration-200 flex items-center gap-2 font-medium text-sm border border-gray-200"
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
                                                                                                    Edit
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        );
                                                                    })()}
                                                                </div>
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
