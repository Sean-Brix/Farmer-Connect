import React, { useState, useEffect } from 'react';
import { categories, statuses } from './constants';
import { convertToSnakeCase } from './utils/helpers';

const AddItemModal = ({ isOpen, onClose, onSubmit, existingItems }) => {
    const [form, setForm] = useState({
        name: '',
        quantity: '1',
        description: '',
        category: 'Other',
        status: 'Available',
    });

    const [nameInput, setNameInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isNewItem, setIsNewItem] = useState(false);

    // Filter existing items based on name input
    useEffect(() => {
        if (nameInput.trim() === '') {
            setFilteredItems(existingItems);
            setIsNewItem(false);
        } else {
            const filtered = existingItems.filter((item) =>
                item.name.toLowerCase().includes(nameInput.toLowerCase())
            );
            setFilteredItems(filtered);

            // Check if the input exactly matches an existing item
            const exactMatch = existingItems.some(
                (item) => item.name.toLowerCase() === nameInput.toLowerCase()
            );
            const wasExistingItem = !isNewItem;
            const willBeNewItem = !exactMatch;

            setIsNewItem(willBeNewItem);

            // Reset category to "Other" when switching from existing item to new item
            if (wasExistingItem && willBeNewItem) {
                setForm((prev) => ({ ...prev, category: 'Other' }));
            }
        }
    }, [nameInput, existingItems, isNewItem]);

    // Update form when name input changes
    useEffect(() => {
        setForm((prev) => ({ ...prev, name: nameInput }));
    }, [nameInput]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'quantity') {
            // Ensure quantity is at least 1
            const numValue = parseInt(value);
            if (numValue < 1 && value !== '') return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleNameInputChange = (e) => {
        setNameInput(e.target.value);
        setShowDropdown(true);
    };

    const handleNameSelect = (selectedName) => {
        setNameInput(selectedName);
        setShowDropdown(false);

        // Find the selected item and populate category if it's not new
        const selectedItem = existingItems.find(
            (item) => item.name === selectedName
        );
        if (selectedItem) {
            setForm((prev) => ({
                ...prev,
                name: selectedName,
                category: selectedItem.category?.name || 'Other',
            }));
            setIsNewItem(false);
        }
    };

    const handleQuantitySelect = (quantity) => {
        setForm((prev) => ({ ...prev, quantity: quantity.toString() }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.quantity) return;

        // Convert category to snake case for submission
        const submissionData = {
            ...form,
            category: convertToSnakeCase(form.category),
            quantity: parseInt(form.quantity),
        };

        onSubmit(submissionData);

        // Reset form
        setForm({
            name: '',
            quantity: '1',
            description: '',
            category: 'Other',
            status: 'Available',
        });
        setNameInput('');
        setIsNewItem(false);
    };

    const handleClose = () => {
        // Reset form when closing
        setForm({
            name: '',
            quantity: '1',
            description: '',
            category: 'Other',
            status: 'Available',
        });
        setNameInput('');
        setIsNewItem(false);
        setShowDropdown(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md mx-4 transform transition-all">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Add Inventory Item</h2>
                        <button
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Name Input with Dropdown */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                            <input
                                type="text"
                                value={nameInput}
                                onChange={handleNameInputChange}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                                placeholder="Enter item name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                required
                            />
                            {showDropdown && filteredItems.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg max-h-40 overflow-y-auto z-10 shadow-lg">
                                    {filteredItems.map((item, index) => (
                                        <div
                                            key={item.id || index}
                                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                                            onClick={() => handleNameSelect(item.name)}
                                        >
                                            <div className="font-medium text-gray-900">{item.name}</div>
                                            {item.category?.name && (
                                                <div className="text-xs text-gray-500">{item.category.name}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {isNewItem && nameInput.trim() !== '' && (
                                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Creating a new item
                                </div>
                            )}
                        </div>

                        {/* Quantity Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                placeholder="Enter quantity"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                min="1"
                                required
                            />
                        </div>

                        {/* Status Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Conditional Fields - Only show if it's a new item */}
                        {isNewItem && (
                            <>
                                {/* Description Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Enter item description"
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                                    />
                                </div>

                                {/* Category Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Add Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddItemModal;
