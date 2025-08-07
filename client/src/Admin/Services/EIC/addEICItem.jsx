import React, { useState, useEffect } from 'react';
import { categories, eicStatuses } from './constants';
import { convertToSnakeCase } from './utils/helpers';

const AddEICItemModal = ({
    isOpen,
    onClose,
    onSubmit,
    existingItems,
    eicItems,
}) => {
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative border border-green-100 transition-all">
                <button
                    className="absolute top-3 right-3 text-green-400 hover:text-green-700 text-2xl font-bold transition focus:outline-none focus:ring-2 focus:ring-green-200"
                    onClick={handleClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-6 text-green-800 text-center tracking-tight">
                    Add EIC Item
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Name Input with Dropdown */}
                    <div className="relative">
                        <input
                            type="text"
                            value={nameInput}
                            onChange={handleNameInputChange}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                            placeholder="Item Name"
                            className="border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50 w-full text-base transition placeholder-gray-400"
                            required
                        />
                        {showDropdown && filteredItems.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-green-200 rounded-b-lg max-h-44 overflow-y-auto z-20 shadow-xl">
                                {filteredItems.map((item, index) => (
                                    <div
                                        key={item.id || index}
                                        className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm transition"
                                        onClick={() => handleNameSelect(item.name)}
                                    >
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        )}
                        {isNewItem && nameInput.trim() !== '' && (
                            <div className="mt-1 text-xs text-teal-600 font-medium flex items-center gap-1">
                                <svg className='w-4 h-4 inline' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M5 13l4 4L19 7' strokeLinecap='round' strokeLinejoin='round'/></svg>
                                Creating a new item
                            </div>
                        )}
                    </div>

                    {/* Quantity Input */}
                    <input
                        type="number"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        className="border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50 w-full text-base transition placeholder-gray-400"
                        min="1"
                        required
                    />

                    {/* Conditional Fields - Only show if it's a new item */}
                    {isNewItem && (
                        <>
                            {/* Description Input */}
                            <input
                                type="text"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50 w-full text-base transition placeholder-gray-400"
                            />

                            {/* Category Dropdown */}
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50 w-full text-base transition"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Item Image (Optional)
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg cursor-pointer hover:bg-green-200 transition text-sm font-medium"
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
                                            className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition font-medium"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-20 h-20 object-cover rounded-lg border-2 border-green-200"
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700 transition mt-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 text-base"
                    >
                        Add EIC Item
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEICItemModal;
