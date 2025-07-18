import React from 'react';
import { statuses } from '../../constants';

const StackEditModal = ({
    isOpen,
    onClose,
    stackEditData,
    stackEditForm,
    handleStackEditFormChange,
    handleStackEditSubmit,
}) => {
    if (!isOpen || !stackEditData) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow p-6 w-full max-w-md relative border border-blue-100 mx-2">
                <button
                    className="absolute top-2 right-2 text-blue-400 hover:text-blue-700 text-xl transition"
                    onClick={onClose}
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
                            <strong>Item:</strong> {stackEditData.itemName}
                        </p>
                        <p>
                            <strong>Status:</strong> {stackEditData.status}
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
                                <option value="reduce">Reduce Quantity</option>
                                <option value="transfer">
                                    Transfer to Another Status
                                </option>
                                <option value="add">Add New Items</option>
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
                                    value={stackEditForm.targetStatus}
                                    onChange={handleStackEditFormChange}
                                    className="w-full border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50"
                                >
                                    {statuses
                                        .filter(
                                            (status) =>
                                                status !== stackEditData.status
                                        )
                                        .map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                type="button"
                                onClick={onClose}
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
                                    : stackEditForm.action === 'transfer'
                                    ? 'Transfer'
                                    : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StackEditModal;
