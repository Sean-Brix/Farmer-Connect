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
        <div className="fixed inset-0 bg-black/70  flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg mx-4 transform transition-all">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-600 rounded-xl p-2.5">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Add Inventory Item</h2>
                        </div>
                        <button
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
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
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Name Input with Dropdown */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Item Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={nameInput}
                                    onChange={handleNameInputChange}
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                                    placeholder="Enter item name"
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    required
                                />
                            </div>
                            {showDropdown && filteredItems.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 rounded-xl mt-1 max-h-48 overflow-y-auto z-10 shadow-xl">
                                    {filteredItems.map((item, index) => (
                                        <div
                                            key={item.id || index}
                                            className="px-4 py-3 hover:bg-green-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                                            onClick={() => handleNameSelect(item.name)}
                                        >
                                            <div className="font-semibold text-gray-900">{item.name}</div>
                                            {item.category?.name && (
                                                <div className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">{item.category.name}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {isNewItem && nameInput.trim() !== '' && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                    <div className="bg-green-600 rounded-full p-1">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Creating a new item</span>
                                </div>
                            )}
                        </div>

                        {/* Quantity Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Quantity</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                </div>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    placeholder="Enter quantity"
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        {/* Status Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Status</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Conditional Fields - Only show if it's a new item */}
                        {isNewItem && (
                            <>
                                {/* Description Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                            </svg>
                                        </div>
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Enter item description"
                                            rows="3"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Category Dropdown */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Category</label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={form.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
