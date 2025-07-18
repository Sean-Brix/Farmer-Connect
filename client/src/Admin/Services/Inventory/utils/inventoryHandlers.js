import { statuses } from '../constants';

export const createInventoryHandlers = ({
    setForm,
    setEditItemId,
    setShowEditModal,
    setSelectedItems,
    setSelectAll,
    setShowDelete,
    setShowDeleteModal,
    setStackToDelete,
    setShowDeleteStackModal,
    setShowStacksModal,
    setSelectedItemStacks,
    expandedStacks,
    setExpandedStacks,
    setStackEditData,
    setStackEditForm,
    setShowStackEditModal,
    form,
    selectedItems,
    filteredItems,
    fetchItems,
    showAlert,
    selectedItemStacks,
    stackEditData,
    stackEditForm,
}) => {
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

            await fetchItems();
            showAlert('Item added successfully', 'success');
        } catch (error) {
            console.error('Failed to create item:', error);
            showAlert('Failed to add item', 'error');
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
            status: 'Available',
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

    const handleRemoveSelected = async () => {
        if (selectedItems.length === 0) {
            showAlert('No items selected for deletion', 'error');
            return;
        }
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
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return await response.json();
            });

            await Promise.all(deletePromises);

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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchItems();
            showAlert(
                `Successfully deleted stack (Qty: ${stackInfo.quantity})`,
                'success'
            );

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
            const response = await fetch('/api/inventory/stack/edit', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId: stackEditData.itemId,
                    currentStatus: stackEditData.status,
                    action: stackEditForm.action,
                    quantity: quantity,
                    targetStatus: stackEditForm.targetStatus,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

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

    return {
        handleChange,
        handleSubmit,
        handleEdit,
        handleUpdate,
        handleRemoveSelected,
        handleConfirmDelete,
        handleDeleteStack,
        handleConfirmDeleteStack,
        handleEditStack,
        handleStackEditFormChange,
        handleStackEditSubmit,
        handleSelectAll,
        handleViewStacks,
        handleSelectItem,
    };
};
