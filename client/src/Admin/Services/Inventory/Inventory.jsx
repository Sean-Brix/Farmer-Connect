import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
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
    const { isDark } = useTheme();
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

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
            category: item.category?.name || item.category || '',
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
                categoryFilter === 'All' || 
                (item.category?.name || item.category) === categoryFilter;
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

    // Pagination logic
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, categoryFilter, statusFilter]);

    // Reset to first page when items per page changes or exceeds total items
    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [itemsPerPage, totalPages, currentPage]);

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
            setSelectedItems(paginatedItems.map((item) => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleViewStacks = (item) => {
        if (expandedStacks.has(item.id)) {
            // Collapse the current item
            setExpandedStacks(new Set());
            setSelectedItemStacks(null);
        } else {
            // Expand the new item and collapse any previously expanded items
            setExpandedStacks(new Set([item.id]));
            setSelectedItemStacks(item);
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
        sm: {
            container: 'max-w-full p-2',
            text: 'text-xs',
            table: 'text-xs',
            padding: 'px-2 py-1'
        },
        md: {
            container: 'max-w-full p-4',
            text: 'text-sm',
            table: 'text-sm',
            padding: 'px-4 py-2'
        },
        lg: {
            container: 'max-w-full p-6',
            text: 'text-base',
            table: 'text-base',
            padding: 'px-6 py-3'
        }
    };

    return (
        <div className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-white'}`}>
            {/* Modern Alert */}
            {alert.show && (
                <div
                    className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 transition-all duration-300 ${
                        alert.type === 'success'
                            ? 'bg-green-600 text-white border-l-4 border-green-400'
                            : alert.type === 'error'
                            ? 'bg-gray-800 text-white border-l-4 border-red-500'
                            : 'bg-gray-700 text-white border-l-4 border-gray-400'
                    }`}
                >
                    {alert.type === 'success' && (
                        <div className="bg-green-500 rounded-full p-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                    {alert.type === 'error' && (
                        <div className="bg-red-500 rounded-full p-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                    <span className="font-semibold">{alert.message}</span>
                </div>
            )}

            {/* Professional Controls Section */}
            <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-6 sm:pb-8 ${sizeClasses[uiSize].container}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end mb-6 sm:mb-8">
                        {/* Search Input */}
                        <div className="xl:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Search Items</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name, description..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                            <div className="relative z-10">
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none relative z-20"
                                >
                                    <option value="All">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none z-30">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                            <div className="relative z-10">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none relative z-20"
                                >
                                    <option value="All">All Statuses</option>
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none z-30">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium px-3 py-2 text-sm rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                + Add
                            </button>
                            {!showDelete ? (
                                <button
                                    onClick={() => setShowDelete(true)}
                                    className="px-3 py-2 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                >
                                    Manage
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowDelete(false)}
                                    className="px-3 py-2 text-sm bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Delete Mode Actions */}
                    {showDelete && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    {selectedItems.length > 0 ? (
                                        <span className="font-semibold text-gray-900 bg-green-100 px-3 py-1 rounded-full">
                                            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                                        </span>
                                    ) : (
                                        <span className="text-gray-600">Select items to delete or manage</span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectAll(true);
                                            setSelectedItems(filteredItems.map((item) => item.id));
                                        }}
                                        className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        Select All
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectAll(false);
                                            setSelectedItems([]);
                                        }}
                                        className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={handleRemoveSelected}
                                        disabled={selectedItems.length === 0}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none ${
                                            selectedItems.length > 0
                                                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        Delete Selected
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Helper Text */}
                    {!showDelete && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Click the expand buttons to view and manage item stacks in detail
                            </p>
                        </div>
                    )}

                {/* Professional Table Container */}
                <div className={`rounded-2xl shadow-xl border overflow-hidden backdrop-blur-sm mt-6 sm:mt-8 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}> 
                    <div className={`px-4 sm:px-6 py-4 border-b bg-gradient-to-r ${isDark ? 'from-gray-800 to-gray-900 border-gray-700' : 'from-gray-50 to-white border-gray-200'}`}> 
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`rounded-lg p-2 ${isDark ? 'bg-green-800' : 'bg-green-600'}`}> 
                                    <svg className={`w-5 h-5 ${isDark ? 'text-green-200' : 'text-white'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Inventory Items</h3>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} item{totalItems !== 1 ? 's' : ''}
                                </span>
                                <button
                                    onClick={handleSortToggle}
                                    className={`flex items-center gap-2 px-4 py-2 text-sm border-2 rounded-xl transition-all duration-200 font-medium ${isDark ? 'border-gray-700 hover:bg-gray-800 hover:border-gray-500 text-gray-200' : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-800'}`}
                                >
                                    <span>Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
                                    <svg className={`w-4 h-4 transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={`rounded-lg shadow-sm border overflow-hidden ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}> 
                        <div className="overflow-x-auto">
                            <table className={`w-full table-auto ${sizeClasses[uiSize].table}`} style={{tableLayout: 'auto', wordWrap: 'break-word'}}>
                            <thead>
                                <tr className={`bg-gradient-to-r border-b-2 ${isDark ? 'from-gray-800 to-gray-900 border-gray-700' : 'from-gray-50 to-gray-100 border-gray-200'}`}> 
                                    {showDelete && (
                                        <th className={`${sizeClasses[uiSize].padding} text-left`}>
                                            <input
                                                type="checkbox"
                                                checked={paginatedItems.length > 0 && paginatedItems.every(item => selectedItems.includes(item.id))}
                                                onChange={handleSelectAll}
                                                className="w-5 h-5 text-green-600 bg-white border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                                aria-label="Select all on this page"
                                            />
                                        </th>
                                    )}
                                    <th className={`${sizeClasses[uiSize].padding} text-left ${sizeClasses[uiSize].text} font-bold uppercase tracking-wider ${isDark ? 'text-gray-200' : 'text-gray-800'}`}> 
                                        Item Details
                                    </th>
                                    <th className={`${sizeClasses[uiSize].padding} text-left ${sizeClasses[uiSize].text} font-bold uppercase tracking-wider hidden sm:table-cell ${isDark ? 'text-gray-200' : 'text-gray-800'}`}> 
                                        Category
                                    </th>
                                    <th className={`${sizeClasses[uiSize].padding} text-left ${sizeClasses[uiSize].text} font-bold uppercase tracking-wider ${isDark ? 'text-gray-200' : 'text-gray-800'}`}> 
                                        Stock
                                    </th>
                                    <th className={`${sizeClasses[uiSize].padding} text-right ${sizeClasses[uiSize].text} font-bold uppercase tracking-wider ${isDark ? 'text-gray-200' : 'text-gray-800'}`}> 
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}> 
                                {paginatedItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={showDelete ? "5" : "4"} className={`px-6 py-16 text-center ${isDark ? 'bg-gray-900' : ''}`}> 
                                            <div className={`flex flex-col items-center justify-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}> 
                                                <div className={`rounded-full p-4 mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}> 
                                                    <svg className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <p className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No items found</p>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search criteria or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedItems.map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            {editItemId === item.id ? (
                                                // Edit Form Row
                                                <tr className={`bg-gradient-to-r border-l-4 shadow-sm ${isDark ? 'from-green-900 to-gray-900 border-green-700' : 'from-green-50 to-white border-green-400'}`}> 
                                                    {showDelete && <td className={sizeClasses[uiSize].padding}></td>}
                                                    <td className={sizeClasses[uiSize].padding} colSpan={showDelete ? "4" : "3"}>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className={`rounded p-1 ${isDark ? 'bg-green-800' : 'bg-green-600'}`}> 
                                                                    <svg className={`w-3 h-3 ${isDark ? 'text-green-200' : 'text-white'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                </div>
                                                                <h4 className={`font-semibold ${sizeClasses[uiSize].text} ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Quick Edit</h4>
                                                            </div>
                                                            <div className="flex items-end gap-4">
                                                                {/* Form Fields */}
                                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                                                                    <div>
                                                                        <label className={`block font-medium mb-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                                                                        <input
                                                                            type="text"
                                                                            name="name"
                                                                            value={editForm.name || ''}
                                                                            onChange={handleEditFormChange}
                                                                            onKeyDown={handleKeyPress}
                                                                            className={`w-full rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400 ${isDark ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                                                                            autoFocus
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className={`block font-medium mb-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                                                                        <select
                                                                            name="category"
                                                                            value={editForm.category || ''}
                                                                            onChange={handleEditFormChange}
                                                                            className={`w-full rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400 ${isDark ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                                                                        >
                                                                            <option value="">Select Category</option>
                                                                            {categories.map((category) => (
                                                                                <option key={category} value={category}>
                                                                                    {category}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label className={`block font-medium mb-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                                                                        <input
                                                                            type="text"
                                                                            name="description"
                                                                            value={editForm.description || ''}
                                                                            onChange={handleEditFormChange}
                                                                            onKeyDown={handleKeyPress}
                                                                            className={`w-full rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400 ${isDark ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Action Buttons - Right Side */}
                                                                <div className="hidden sm:flex gap-2 ml-auto">
                                                                    <button
                                                                        onClick={handleCancelEdit}
                                                                        className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-1 focus:ring-red-400 transition-all duration-200 text-sm whitespace-nowrap"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={handleSaveEdit}
                                                                        className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-1 focus:ring-green-400 transition-all duration-200 text-sm whitespace-nowrap"
                                                                    >
                                                                        Save
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Mobile Buttons */}
                                                            <div className="flex justify-end gap-2 pt-1 sm:hidden">
                                                                <button
                                                                    onClick={handleCancelEdit}
                                                                    className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-1 focus:ring-red-400 transition-all duration-200 text-sm"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={handleSaveEdit}
                                                                    className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-1 focus:ring-green-400 transition-all duration-200 text-sm"
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                // Normal Item Row
                                                <tr className={`transition-all duration-200 ${isDark ? (index % 2 === 0 ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-800 hover:bg-gray-700') : (index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-25 hover:bg-gray-50')}`}>
                                                    {showDelete && (
                                                        <td className={sizeClasses[uiSize].padding}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedItems.includes(item.id)}
                                                                onChange={() => handleSelectItem(item.id)}
                                                                className="w-5 h-5 text-green-600 bg-white border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                                            />
                                                        </td>
                                                    )}
                                                    <td className={sizeClasses[uiSize].padding}>
                                                        <div className="flex flex-col">
                                                            <div className={`font-bold ${sizeClasses[uiSize].text} ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{item.name}</div>
                                                            <div className={`sm:hidden ${sizeClasses[uiSize].text} ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.category?.name || 'Uncategorized'}</div>
                                                            {item.description && (
                                                                <div className={`mt-1 ${sizeClasses[uiSize].text === 'text-xs' ? 'text-xs' : sizeClasses[uiSize].text === 'text-sm' ? 'text-xs' : 'text-sm'} ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{truncate(item.description, 40)}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className={`${sizeClasses[uiSize].padding} hidden sm:table-cell`}>
                                                        <span className={`font-semibold ${sizeClasses[uiSize].text} ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                                                            {item.category?.name || 'Uncategorized'}
                                                        </span>
                                                    </td>
                                                    <td className={sizeClasses[uiSize].padding}>
                                                        <span className={`font-bold ${sizeClasses[uiSize].text} ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
                                                            {item.totalQuantity || 0}
                                                        </span>
                                                    </td>
                                                    <td className={`${sizeClasses[uiSize].padding} text-right`}>
                                                        <div className="flex items-center justify-end">
                                                            <button
                                                                onClick={() => handleViewStacks(item)}
                                                                className={`inline-flex items-center px-2 py-1.5 border shadow-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 text-sm ${isDark ? 'border-green-700 text-green-200 bg-green-800 hover:bg-green-700 hover:border-green-600 focus:ring-green-700' : 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-300 focus:ring-green-300'}`}
                                                            >
                                                                {expandedStacks.has(item.id) ? (
                                                                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                        <path d="M19 15l-7-7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                        <path d="M5 9l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                )}
                                                                Details
                                                            </button>
                                                        </div>
                                                    </td>
                                            </tr>
                                            )}
                                            {/* Expanded Stack Details Row */}
                                            {expandedStacks.has(item.id) && selectedItemStacks && selectedItemStacks.id === item.id && (
                                                <tr>
                                                    <td colSpan={showDelete ? "5" : "4"} className={`px-3 sm:px-4 py-3 border-l-4 border-green-400 ${isDark ? 'bg-gradient-to-r from-green-950 to-gray-900' : 'bg-gradient-to-r from-green-50 to-gray-50'}`}> 
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="bg-green-600 rounded p-1.5">
                                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    </div>
                                                                    <h4 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Inventory Stacks for {item.name}</h4>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleEdit(item)}
                                                                    className={`inline-flex items-center px-3 py-1.5 font-medium rounded-lg transition-all duration-200 text-sm border focus:outline-none focus:ring-1 ${isDark ? 'border-gray-700 text-gray-200 bg-gray-900 hover:bg-gray-800 focus:ring-gray-700' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-400'}`}
                                                                >
                                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                    Edit Item
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                                                                {(() => {
                                                                    // Group existing stacks by status
                                                                    const groupedStacks = selectedItemStacks.stacks.reduce((acc, stack) => {
                                                                        if (!acc[stack.status]) {
                                                                            acc[stack.status] = {
                                                                                stacks: [],
                                                                                totalQuantity: 0,
                                                                            };
                                                                        }
                                                                        acc[stack.status].stacks.push(stack);
                                                                        acc[stack.status].totalQuantity += stack.quantity;
                                                                        return acc;
                                                                    }, {});

                                                                    // Create entries for all statuses, including those without stacks
                                                                    return statuses.map((status) => {
                                                                        const statusData = groupedStacks[status] || {
                                                                            stacks: [],
                                                                            totalQuantity: 0,
                                                                        };

                                                                        const getStatusStyles = (status) => {
                                                                            switch (status) {
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

                                                                        const styles = getStatusStyles(status);
                                                                        const statusKey = `${selectedItemStacks.id}-${status}`;
                                                                        const isEditing = editingStatusRows.has(statusKey);

                                                                        return (
                                                                            <div
                                                                                key={status}
                                                                                className={`${styles.bg} ${styles.border} border rounded-md p-3 shadow-sm hover:shadow-md transition-all duration-200`}
                                                                            >
                                                                                <div className="flex items-center justify-between mb-2">
                                                                                    <span className={`${styles.badge} px-2 py-0.5 rounded-full text-xs font-semibold`}>
                                                                                        {status}
                                                                                    </span>
                                                                                    <div className={`${styles.icon} p-0.5`}>
                                                                                        {status === 'Available' && (
                                                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                                            </svg>
                                                                                        )}
                                                                                        {status === 'Unavailable' && (
                                                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                                            </svg>
                                                                                        )}
                                                                                        {status === 'Damaged' && (
                                                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                                            </svg>
                                                                                        )}
                                                                                        {status === 'EIC' && (
                                                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                            </svg>
                                                                                        )}
                                                                                        {status === 'Distributed' && (
                                                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                                                                            </svg>
                                                                                        )}
                                                                                    </div>
                                                                                </div>

                                                                                <div className="text-center mb-2">
                                                                                    <div className="text-lg font-bold text-gray-800 mb-0.5">
                                                                                        {statusData.totalQuantity}
                                                                                    </div>
                                                                                    <div className="text-xs text-gray-600 font-medium">
                                                                                        {statusData.totalQuantity === 1 ? 'unit' : 'units'}
                                                                                    </div>
                                                                                </div>

                                                                                <div className="flex justify-center">
                                                                                    {isEditing ? (
                                                                                        <div className="flex flex-col gap-2 w-full">
                                                                                            <div className="bg-white rounded-lg p-2 shadow-sm">
                                                                                                <input
                                                                                                    type="number"
                                                                                                    value={statusEditValues[statusKey] || statusData.totalQuantity}
                                                                                                    onChange={(e) => handleStatusRowValueChange(status, e.target.value)}
                                                                                                    className="w-full px-2 py-1 border border-gray-200 rounded text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-300"
                                                                                                    min="0"
                                                                                                    placeholder="Enter quantity"
                                                                                                />
                                                                                            </div>
                                                                                            <div className="flex gap-1">
                                                                                                <button
                                                                                                    onClick={() => handleSaveStatusRowEdit(status, statusData.stacks, statusData.totalQuantity)}
                                                                                                    className="flex-1 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                                                                                                    title="Save changes"
                                                                                                >
                                                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                                                    </svg>
                                                                                                    <span className="text-xs font-medium">Save</span>
                                                                                                </button>
                                                                                                <button
                                                                                                    onClick={() => handleCancelStatusRowEdit(status)}
                                                                                                    className="flex-1 p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center gap-1"
                                                                                                    title="Cancel edit"
                                                                                                >
                                                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                                                    </svg>
                                                                                                    <span className="text-xs font-medium">Cancel</span>
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <button
                                                                                            onClick={() => handleToggleStatusRowEdit(status, statusData.totalQuantity)}
                                                                                            className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-lg hover:shadow-md transition-all duration-200 flex items-center gap-2 font-medium text-sm border border-gray-200"
                                                                                            title="Edit Stack"
                                                                                            aria-label={`Edit ${status} stack`}
                                                                                        >
                                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                            </svg>
                                                                                            Edit
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    });
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

                    {/* Pagination Controls */}
                    {totalItems > 0 && (
                        <div className={`border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white ${sizeClasses[uiSize].padding}`}>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    {totalPages > 1 && (
                                        <span className={`font-semibold text-gray-800 bg-green-100 px-3 py-1 rounded-full ${sizeClasses[uiSize].text}`}>
                                            Page {currentPage} of {totalPages}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium text-gray-700 ${sizeClasses[uiSize].text}`}>Items per page:</span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className={`border-2 border-gray-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium ${sizeClasses[uiSize].text}`}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>
                                    </div>
                                </div>
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(1)}
                                            disabled={currentPage === 1}
                                            className={`px-4 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-all duration-200 ${sizeClasses[uiSize].text}`}
                                        >
                                            First
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-4 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-all duration-200 ${sizeClasses[uiSize].text}`}
                                        >
                                            Previous
                                        </button>
                                        
                                        {/* Page numbers */}
                                        <div className="flex items-center gap-1">
                                            {(() => {
                                                const pages = [];
                                                const showPages = 5; // Show 5 page numbers at most
                                                let start = Math.max(1, currentPage - Math.floor(showPages / 2));
                                                let end = Math.min(totalPages, start + showPages - 1);
                                                
                                                // Adjust start if we're near the end
                                                if (end - start + 1 < showPages) {
                                                    start = Math.max(1, end - showPages + 1);
                                                }

                                                for (let i = start; i <= end; i++) {
                                                    pages.push(
                                                        <button
                                                            key={i}
                                                            onClick={() => setCurrentPage(i)}
                                                            className={`px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold transition-all duration-200 ${sizeClasses[uiSize].text} ${
                                                                i === currentPage
                                                                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white border-green-600 shadow-lg'
                                                                    : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700'
                                                            }`}
                                                        >
                                                            {i}
                                                        </button>
                                                    );
                                                }
                                                return pages;
                                            })()}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`px-4 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-all duration-200 ${sizeClasses[uiSize].text}`}
                                        >
                                            Next
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(totalPages)}
                                            disabled={currentPage === totalPages}
                                            className={`px-4 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-all duration-200 ${sizeClasses[uiSize].text}`}
                                        >
                                            Last
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddItemModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                existingItems={items}
            />
                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-gray-200 mx-4">
                            <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl transition-colors"
                                onClick={() => setShowDeleteModal(false)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <div className="text-center">
                                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-600 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                                    Confirm Deletion
                                </h2>
                                <div className="mb-8">
                                    <p className="text-gray-600 mb-3 text-lg">
                                        Are you sure you want to delete{' '}
                                        <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                            {selectedItems.length}
                                        </span>{' '}
                                        selected item
                                        {selectedItems.length > 1 ? 's' : ''}?
                                    </p>
                                    <p className="text-sm text-gray-500 font-medium bg-gray-50 p-3 rounded-lg">
                                        This action cannot be undone.
                                    </p>
                                </div>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() =>
                                            setShowDeleteModal(false)
                                        }
                                        className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-gray-200 mx-4">
                            <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl transition-colors"
                                onClick={() => {
                                    setShowDeleteStackModal(false);
                                    setStackToDelete(null);
                                }}
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <div className="text-center">
                                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-600 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                                    Confirm Stack Deletion
                                </h2>
                                <div className="mb-8">
                                    <p className="text-gray-600 mb-3 text-lg">
                                        Are you sure you want to delete{' '}
                                        <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                            Stack #{stackToDelete.stackInfo.index + 1}
                                        </span>{' '}
                                        with quantity{' '}
                                        <span className="font-bold text-gray-900 bg-green-100 px-2 py-1 rounded">
                                            {stackToDelete.stackInfo.quantity}
                                        </span>
                                        ?
                                    </p>
                                    <p className="text-sm text-gray-500 font-medium bg-gray-50 p-3 rounded-lg">
                                        This action cannot be undone.
                                    </p>
                                </div>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => {
                                            setShowDeleteStackModal(false);
                                            setStackToDelete(null);
                                        }}
                                        className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDeleteStack}
                                        className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                            <div className="bg-white rounded-xl shadow p-6 w-full max-w-lg relative border border-green-100 mx-2">
                                <button
                                    className="absolute top-2 right-2 text-green-400 hover:text-green-700 text-xl transition"
                                    onClick={() => {
                                        setShowStacksModal(false);
                                    }}
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                                <div className="mb-4">
                                    <h2 className="text-base font-bold text-green-800 text-center">
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
                                                        <span className="text-green-900 font-medium">
                                                            Stack #{index + 1}
                                                        </span>
                                                        {editingStacks.has(
                                                            stack.id
                                                        ) ? (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-green-700">
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
                                                                        className="w-16 px-1 py-0.5 border border-green-200 rounded text-center text-xs"
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
                                                            <span className="text-green-700">
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
                                                                className="p-1 text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
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
                                                    <div className="mt-1 text-xs text-green-600 flex gap-2 flex-wrap">
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

            {/* UI Size Control */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-end items-center mt-8 mb-6 gap-3">
                <label className="font-bold text-gray-800 text-lg">
                    UI Size:
                </label>
                <select
                    value={uiSize}
                    onChange={(e) => setUiSize(e.target.value)}
                    className="border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-900 font-semibold w-full sm:w-auto focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md"
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
