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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow p-6 w-full max-w-md relative border border-orange-100 mx-2">
                <button
                    className="absolute top-2 right-2 text-orange-400 hover:text-orange-700 text-xl transition"
                    onClick={handleClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-base font-bold mb-4 text-orange-800 text-center">
                    Add EIC Item
                </h2>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    {/* Name Input with Dropdown */}
                    <div className="relative">
                        <input
                            type="text"
                            value={nameInput}
                            onChange={handleNameInputChange}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() =>
                                setTimeout(() => setShowDropdown(false), 150)
                            }
                            placeholder="Item Name"
                            className="border border-orange-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-300 bg-orange-50 w-full"
                            required
                        />
                        {showDropdown && filteredItems.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-orange-200 rounded-b-md max-h-40 overflow-y-auto z-10 shadow-lg">
                                {filteredItems.map((item, index) => (
                                    <div
                                        key={item.id || index}
                                        className="px-3 py-2 hover:bg-orange-50 cursor-pointer text-sm"
                                        onClick={() =>
                                            handleNameSelect(item.name)
                                        }
                                    >
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        )}
                        {isNewItem && nameInput.trim() !== '' && (
                            <div className="mt-1 text-xs text-green-600 font-medium">
                                ✓ Creating a new item
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
                        className="border border-orange-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-300 bg-orange-50 w-full"
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
                                className="border border-orange-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-300 bg-orange-50 w-full"
                            />

                            {/* Category Dropdown */}
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="border border-orange-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-300 bg-orange-50 w-full"
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
                                        className="flex items-center px-3 py-2 bg-orange-100 text-orange-700 rounded cursor-pointer hover:bg-orange-200 transition text-sm"
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
                                            className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition"
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
                                            className="w-20 h-20 object-cover rounded border-2 border-orange-200"
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600 transition mt-2 w-full"
                    >
                        Add EIC Item
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEICItemModal;
