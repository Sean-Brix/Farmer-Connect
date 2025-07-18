import React from 'react';
import { categories, statuses } from '../../constants';

const EditItemModal = ({
    isOpen,
    onClose,
    form,
    handleChange,
    handleUpdate,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow p-6 w-full max-w-sm relative border border-blue-100 mx-2">
                <button
                    className="absolute top-2 right-2 text-blue-400 hover:text-blue-700 text-xl transition"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-base font-bold mb-4 text-blue-800 text-center">
                    Edit Item
                </h2>
                <form className="flex flex-col gap-3" onSubmit={handleUpdate}>
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
    );
};

export default EditItemModal;
