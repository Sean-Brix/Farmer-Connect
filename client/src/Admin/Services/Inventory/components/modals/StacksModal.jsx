import React from 'react';

const StacksModal = ({
    isOpen,
    onClose,
    selectedItemStacks,
    handleDeleteStack,
}) => {
    if (!isOpen || !selectedItemStacks || !selectedItemStacks.currentStacks) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow p-6 w-full max-w-lg relative border border-blue-100 mx-2">
                <button
                    className="absolute top-2 right-2 text-blue-400 hover:text-blue-700 text-xl transition"
                    onClick={onClose}
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
                    {selectedItemStacks.currentStacks.map((stack, index) => (
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
                                        Qty: {stack.quantity}
                                    </span>
                                </div>
                                <button
                                    onClick={() =>
                                        handleDeleteStack(stack.id, {
                                            index,
                                            quantity: stack.quantity,
                                        })
                                    }
                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Stack"
                                    aria-label={`Delete Stack #${index + 1}`}
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StacksModal;
