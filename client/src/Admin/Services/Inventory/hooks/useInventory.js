import { useState, useEffect } from 'react';

export const useInventory = () => {
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
    const [uiSize, setUiSize] = useState('md');

    // Stack Edit Modal states
    const [showStackEditModal, setShowStackEditModal] = useState(false);
    const [stackEditData, setStackEditData] = useState(null);
    const [stackEditForm, setStackEditForm] = useState({
        action: 'reduce',
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

    // Filter items based on search and filters
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

    return {
        // State
        items,
        setItems,
        showStacksModal,
        setShowStacksModal,
        selectedItemStacks,
        setSelectedItemStacks,
        expandedStacks,
        setExpandedStacks,
        form,
        setForm,
        showModal,
        setShowModal,
        search,
        setSearch,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        selectedItems,
        setSelectedItems,
        selectAll,
        setSelectAll,
        showDelete,
        setShowDelete,
        showDeleteModal,
        setShowDeleteModal,
        showDeleteStackModal,
        setShowDeleteStackModal,
        stackToDelete,
        setStackToDelete,
        editItemId,
        setEditItemId,
        showEditModal,
        setShowEditModal,
        uiSize,
        setUiSize,
        showStackEditModal,
        setShowStackEditModal,
        stackEditData,
        setStackEditData,
        stackEditForm,
        setStackEditForm,
        alert,
        setAlert,

        // Computed
        filteredItems,

        // Functions
        showAlert,
        fetchItems,
    };
};
