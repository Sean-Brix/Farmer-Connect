import React, { useEffect } from 'react';
import AddItemModal from './addItem';
import Alert from './components/ui/Alert';
import Header from './components/ui/Header';
import InventoryTable from './components/ui/InventoryTable';
import EditItemModal from './components/modals/EditItemModal';
import DeleteConfirmationModal from './components/modals/DeleteConfirmationModal';
import DeleteStackModal from './components/modals/DeleteStackModal';
import StackEditModal from './components/modals/StackEditModal';
import StacksModal from './components/modals/StacksModal';
import { useInventory } from './hooks/useInventory';
import { createInventoryHandlers } from './utils/inventoryHandlers';
import { sizeClasses } from './constants';

function Content() {
    const inventoryState = useInventory();

    const {
        // State
        items,
        showStacksModal,
        setShowStacksModal,
        selectedItemStacks,
        setSelectedItemStacks,
        expandedStacks,
        form,
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
        showEditModal,
        setShowEditModal,
        uiSize,
        setUiSize,
        showStackEditModal,
        setShowStackEditModal,
        stackEditData,
        stackEditForm,
        alert,

        // Computed
        filteredItems,

        // Functions
        fetchItems,
    } = inventoryState;

    const handlers = createInventoryHandlers(inventoryState);

    const {
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
    } = handlers;

    useEffect(() => {
        fetchItems();
    }, []);

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
    }, [items, selectedItemStacks, setSelectedItemStacks]);

    return (
        <>
            <Alert alert={alert} />

            <div
                className={`flex flex-col items-center justify-center min-h-[91vh] w-full bg-white rounded-xl shadow mt-15 transition-all
                    ${sizeClasses[uiSize]}
                `}
                style={{
                    boxSizing: 'border-box',
                    width: '100%',
                }}
            >
                <Header
                    search={search}
                    setSearch={setSearch}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    showDelete={showDelete}
                    setShowDelete={setShowDelete}
                    selectedItems={selectedItems}
                    filteredItems={filteredItems}
                    handleRemoveSelected={handleRemoveSelected}
                    handleSelectAll={handleSelectAll}
                    setSelectAll={setSelectAll}
                    setSelectedItems={setSelectedItems}
                    uiSize={uiSize}
                />

                <AddItemModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                    existingItems={items}
                />

                <EditItemModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    form={form}
                    handleChange={handleChange}
                    handleUpdate={handleUpdate}
                />

                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    selectedItems={selectedItems}
                    onConfirm={handleConfirmDelete}
                />

                <DeleteStackModal
                    isOpen={showDeleteStackModal}
                    onClose={() => {
                        setShowDeleteStackModal(false);
                        setStackToDelete(null);
                    }}
                    stackToDelete={stackToDelete}
                    onConfirm={handleConfirmDeleteStack}
                />

                <StackEditModal
                    isOpen={showStackEditModal}
                    onClose={() => {
                        setShowStackEditModal(false);
                        inventoryState.setStackEditData(null);
                        inventoryState.setStackEditForm({
                            action: 'reduce',
                            quantity: '',
                            targetStatus: 'Available',
                        });
                    }}
                    stackEditData={stackEditData}
                    stackEditForm={stackEditForm}
                    handleStackEditFormChange={handleStackEditFormChange}
                    handleStackEditSubmit={handleStackEditSubmit}
                />

                <StacksModal
                    isOpen={showStacksModal}
                    onClose={() => {
                        setShowStacksModal(false);
                    }}
                    selectedItemStacks={selectedItemStacks}
                    handleDeleteStack={handleDeleteStack}
                />

                <InventoryTable
                    filteredItems={filteredItems}
                    showDelete={showDelete}
                    selectAll={selectAll}
                    handleSelectAll={handleSelectAll}
                    selectedItems={selectedItems}
                    handleSelectItem={handleSelectItem}
                    expandedStacks={expandedStacks}
                    handleViewStacks={handleViewStacks}
                    selectedItemStacks={selectedItemStacks}
                    handleEdit={handleEdit}
                    handleEditStack={handleEditStack}
                    setSelectedItemStacks={setSelectedItemStacks}
                    setShowStacksModal={setShowStacksModal}
                />

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
