import React from 'react';

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    selectedItems,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow p-6 w-full max-w-md relative border border-red-100 mx-2">
                <button
                    className="absolute top-2 right-2 text-red-400 hover:text-red-700 text-xl transition"
                    onClick={onClose}
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
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
