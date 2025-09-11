import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { categories, eicStatuses } from './constants';
import { convertToSnakeCase } from './utils/helpers';

const AddEICItemModal = ({
    isOpen,
    onClose,
    onSubmit,
    existingItems,
    eicItems,
}) => {
    const { isDark } = useTheme();
    const [form, setForm] = useState({
        name: '',
        quantity: '1',
        description: '',
        category: 'Other',
        status: 'EIC', // Fixed to EIC only
    });

    const [nameInput, setNameInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isNewItem, setIsNewItem] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Combine existing items and EIC items for the dropdown
    const allAvailableItems = [
        ...existingItems,
        ...(eicItems || []).map((stack) => stack.item).filter((item) => item), // Extract items from EIC stacks
    ];

    // Remove duplicates based on item name
    const uniqueItems = React.useMemo(() => {
        return allAvailableItems.filter(
            (item, index, self) =>
                index ===
                self.findIndex(
                    (i) => i.name.toLowerCase() === item.name.toLowerCase()
                )
        );
    }, [existingItems, eicItems]);

    // Filter items based on name input
    useEffect(() => {
        if (nameInput.trim() === '') {
            setFilteredItems(uniqueItems);
            setIsNewItem(false);
        } else {
            const filtered = uniqueItems.filter((item) =>
                item.name.toLowerCase().includes(nameInput.toLowerCase())
            );
            setFilteredItems(filtered);

            // Check if the input exactly matches an existing item
            const exactMatch = uniqueItems.some(
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
    }, [nameInput, uniqueItems, isNewItem]);

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
        const selectedItem = uniqueItems.find(
            (item) => item.name === selectedName
        );
        if (selectedItem) {
            setForm((prev) => ({
                ...prev,
                name: selectedName,
                category:
                    selectedItem.category?.name ||
                    selectedItem.category ||
                    'Other',
            }));
            setIsNewItem(false);
        }
    };

    const handleQuantitySelect = (quantity) => {
        setForm((prev) => ({ ...prev, quantity: quantity.toString() }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
            ];
            if (!allowedTypes.includes(file.type)) {
                alert('Please select a valid image file (JPEG, PNG, or GIF)');
                return;
            }

            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('File size must be less than 5MB');
                return;
            }

            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.quantity) return;

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('quantity', parseInt(form.quantity));
        formData.append('description', form.description);
        formData.append('category', convertToSnakeCase(form.category));
        formData.append('status', 'EIC');

        // Add image if selected
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        onSubmit(formData);

        // Reset form
        setForm({
            name: '',
            quantity: '1',
            description: '',
            category: 'Other',
            status: 'EIC',
        });
        setNameInput('');
        setIsNewItem(false);
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleClose = () => {
        // Reset form when closing
        setForm({
            name: '',
            quantity: '1',
            description: '',
            category: 'Other',
            status: 'EIC',
        });
        setNameInput('');
        setIsNewItem(false);
        setShowDropdown(false);
        setSelectedImage(null);
        setImagePreview(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className={`rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                {/* Header */}
                <div className={`border-b px-6 py-4 ${
                    isDark 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold ${
                                    isDark ? 'text-white' : 'text-gray-800'
                                }`}>Add EIC Item</h3>
                                <p className={`text-sm ${
                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>Add new item to EIC inventory</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 ${
                                isDark 
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600 focus:ring-gray-500' 
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-300'
                            }`}
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* FORM */}
                <form className="p-6" onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Name Input with Dropdown */}
                        <div className={`border rounded-lg p-4 relative ${
                            isDark 
                                ? 'bg-gray-700 border-gray-600' 
                                : 'bg-gray-50 border-gray-200'
                        }`}>
                            <label className={`block text-sm font-semibold mb-3 ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                Item Name
                            </label>
                            <input
                                type="text"
                                value={nameInput}
                                onChange={handleNameInputChange}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                                placeholder="Enter or select item name"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${
                                    isDark 
                                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-300' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                                required
                            />
                            {showDropdown && filteredItems.length > 0 && (
                                <div className={`absolute top-full left-4 right-4 border rounded-lg max-h-44 overflow-y-auto z-20 shadow-xl mt-1 ${
                                    isDark 
                                        ? 'bg-gray-600 border-gray-500' 
                                        : 'bg-white border-gray-300'
                                }`}>
                                    {filteredItems.map((item, index) => (
                                        <div
                                            key={item.id || index}
                                            className={`px-4 py-3 cursor-pointer text-sm border-b last:border-b-0 transition-colors duration-200 ${
                                                isDark 
                                                    ? 'hover:bg-gray-500 border-gray-500 text-white' 
                                                    : 'hover:bg-green-50 border-gray-100 text-gray-900'
                                            }`}
                                            onClick={() => handleNameSelect(item.name)}
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {isNewItem && nameInput.trim() !== '' && (
                                <div className={`mt-3 p-3 border rounded-lg ${
                                    isDark 
                                        ? 'bg-green-900/20 border-green-700' 
                                        : 'bg-green-50 border-green-200'
                                }`}>
                                    <p className={`text-sm font-medium flex items-center gap-2 ${
                                        isDark ? 'text-green-400' : 'text-green-700'
                                    }`}>
                                        <svg className='w-4 h-4 text-green-600' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                                            <path d='M5 13l4 4L19 7' strokeLinecap='round' strokeLinejoin='round'/>
                                        </svg>
                                        Creating a new item
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Quantity Input */}
                        <div className={`border rounded-lg p-4 ${
                            isDark 
                                ? 'bg-gray-700 border-gray-600' 
                                : 'bg-gray-50 border-gray-200'
                        }`}>
                            <label className={`block text-sm font-semibold mb-3 ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                Quantity
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                placeholder="Enter quantity"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${
                                    isDark 
                                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-300' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                                min="1"
                                required
                            />
                        </div>

                        {/* Conditional Fields - Only show if it's a new item */}
                        {isNewItem && (
                            <>
                                {/* Description Input */}
                                <div className={`border rounded-lg p-4 ${
                                    isDark 
                                        ? 'bg-gray-700 border-gray-600' 
                                        : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <label className={`block text-sm font-semibold mb-3 ${
                                        isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Enter item description"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${
                                            isDark 
                                                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-300' 
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                    />
                                </div>

                                {/* Category Dropdown */}
                                <div className={`border rounded-lg p-4 ${
                                    isDark 
                                        ? 'bg-gray-700 border-gray-600' 
                                        : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <label className={`block text-sm font-semibold mb-3 ${
                                        isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${
                                            isDark 
                                                ? 'bg-gray-600 border-gray-500 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Image Upload */}
                                <div className={`border rounded-lg p-4 ${
                                    isDark 
                                        ? 'bg-gray-700 border-gray-600' 
                                        : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <label className={`block text-sm font-semibold mb-3 ${
                                        isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        Item Image (Optional)
                                    </label>
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors duration-200 text-sm font-medium shadow-sm"
                                        >
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                />
                                            </svg>
                                            Choose Image
                                        </label>
                                        {selectedImage && (
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors duration-200 font-medium border border-red-200"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    {imagePreview && (
                                        <div className="mb-3">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-24 h-24 object-cover rounded-lg border-2 border-green-300 shadow-sm"
                                            />
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Supported formats: JPEG, PNG, GIF. Max size: 5MB.
                                    </p>
                                </div>
                            </>
                        )}

                    </div>

                    {/* Buttons */}
                    <div className={`border-t px-6 py-4 -mx-6 -mb-6 rounded-b-xl ${
                        isDark 
                            ? 'border-gray-600 bg-gray-700' 
                            : 'border-gray-200 bg-gray-50'
                    }`}>
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className={`px-6 py-3 border rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 ${
                                    isDark 
                                        ? 'text-gray-300 bg-gray-600 border-gray-500 hover:bg-gray-500 focus:ring-gray-400' 
                                        : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-gray-300'
                                }`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Add EIC Item
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEICItemModal;
