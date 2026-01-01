import React, { useState, useEffect } from 'react';
import { categories, statuses } from './constants';
import { convertToSnakeCase } from './utils/helpers';

// Constants for seed-specific distribution
const cropTypes = ['Rice', 'Corn', 'High_Value_Crops'];

// Fetch seed varieties hook
const useSeedVarieties = (cropType = null) => {
    const [varieties, setVarieties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVarieties = async () => {
            try {
                const url = cropType 
                    ? `/api/seed-varieties?cropType=${cropType}&isActive=true`
                    : '/api/seed-varieties?isActive=true';
                
                const response = await fetch(url, {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setVarieties(data.varieties || []);
                }
            } catch (error) {
                console.error('Error fetching seed varieties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVarieties();
    }, [cropType]);

    return { varieties, loading };
};

const AddItemModal = ({ isOpen, onClose, onSubmit, existingItems }) => {
    const [form, setForm] = useState({
        name: '',
        quantity: '1',
        description: '',
        category: 'Other',
        status: 'Available',
        // Distribution-specific fields
        cropType: 'Rice',
        seedVarietyId: '',
        varietyName: '',
        directSeededDAS: '',
        transplantedDAS: '',
        plantingWindow: '30',
        varietyDescription: '',
        max_quantity_per_request: '',
    });

    // Debug log for form state
    useEffect(() => {
        console.log('📝 Form state updated:', { status: form.status, category: form.category, cropType: form.cropType });
        console.log('🔍 Should show Distribution fields?', form.status === 'Distributed');
    }, [form.status, form.category, form.cropType]);

    const [nameInput, setNameInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isNewItem, setIsNewItem] = useState(false);
    const [createNewVariety, setCreateNewVariety] = useState(false);
    const [errors, setErrors] = useState({});

    // Use the seed varieties hook
    const { varieties, loading: loadingVarieties } = useSeedVarieties(
        form.status === 'Distributed' ? form.cropType : null
    );

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

        // If category is changed to/from Distribution, reset seed variety fields
        if (name === 'category') {
            if (value === 'Distribution') {
                setForm((prev) => ({ 
                    ...prev, 
                    category: value,
                    cropType: 'Rice',
                    seedVarietyId: '',
                    status: 'Distributed',  // Auto-set status for Distribution
                }));
                setCreateNewVariety(false);
            } else {
                setForm((prev) => ({ 
                    ...prev, 
                    category: value,
                    status: 'Available',  // Reset status when not Distribution
                }));
            }
            return;
        }

        // If status is changed to/from Distributed, reset seed variety fields
        if (name === 'status') {
            console.log('🔄 Status changing to:', value);
            if (value === 'Distributed') {
                console.log('✅ Setting status to Distributed with cropType Rice');
                setForm((prev) => ({ 
                    ...prev, 
                    status: value,
                    cropType: 'Rice',
                    seedVarietyId: '',
                }));
                setCreateNewVariety(false);
            } else {
                setForm((prev) => ({ 
                    ...prev, 
                    status: value,
                }));
            }
            return;
        }

        // Handle crop type change for Distribution category
        if (name === 'cropType') {
            setForm((prev) => ({ ...prev, cropType: value, seedVarietyId: '' }));
            setCreateNewVariety(false);
            if (errors.seedVarietyId) {
                setErrors((prev) => ({ ...prev, seedVarietyId: undefined }));
            }
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));

        // Clear error when user changes a field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSeedVarietyChange = (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, seedVarietyId: value }));
        setCreateNewVariety(value === 'new');

        if (errors.seedVarietyId) {
            setErrors((prev) => ({ ...prev, seedVarietyId: undefined }));
        }
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
        
        // Skip name validation for Distributed status items
        if (form.status !== 'Distributed' && !form.name) {
            return;
        }
        
        if (!form.quantity) return;

        // Validation for Distributed status items
        const newErrors = {};
        
        if (form.status === 'Distributed') {
            if (!createNewVariety && !form.seedVarietyId) {
                newErrors.seedVarietyId = 'Please select an existing seed variety or create a new one';
            }

            if (createNewVariety && (!form.varietyName || !form.varietyName.trim())) {
                newErrors.varietyName = 'Variety name is required';
            }

            if (createNewVariety) {
                if (!form.directSeededDAS || parseInt(form.directSeededDAS) <= 0) {
                    newErrors.directSeededDAS = 'Direct seeded DAS is required';
                }
                if (!form.transplantedDAS || parseInt(form.transplantedDAS) <= 0) {
                    newErrors.transplantedDAS = 'Transplanted DAS is required';
                }
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // Prepare submission data based on status
        let submissionData;
        
        if (form.status === 'Distributed') {
            // For Distribution items, prepare FormData for file upload support
            submissionData = new FormData();
            
            // Derive seed name from selected or new variety
            const selectedVariety = varieties.find(v => v.id === form.seedVarietyId);
            const seedName = createNewVariety 
                ? form.varietyName.trim()
                : selectedVariety?.name || 'Unknown Seed';
            
            submissionData.append('name', seedName);
            submissionData.append('quantity', parseInt(form.quantity));
            submissionData.append('category', form.category || 'Distribution');
            submissionData.append('unit', 'kg');
            submissionData.append('description', form.description || '');
            submissionData.append('status', 'Distributed');
            
            if (form.max_quantity_per_request) {
                submissionData.append('max_quantity_per_request', parseInt(form.max_quantity_per_request));
            }

            if (createNewVariety) {
                // Creating new variety inline
                submissionData.append('cropType', form.cropType);
                submissionData.append('directSeededDAS', parseInt(form.directSeededDAS));
                submissionData.append('transplantedDAS', parseInt(form.transplantedDAS));
                submissionData.append('plantingWindow', form.plantingWindow ? parseInt(form.plantingWindow) : 30);
                submissionData.append('varietyDescription', form.varietyDescription || '');
            } else {
                // Using existing variety
                submissionData.append('seedVarietyId', form.seedVarietyId);
            }
        } else {
            // For regular inventory items, use the standard format
            submissionData = {
                ...form,
                category: convertToSnakeCase(form.category),
                quantity: parseInt(form.quantity),
            };
        }

        onSubmit(submissionData);

        // Reset form
        setForm({
            name: '',
            quantity: '1',
            description: '',
            category: 'Other',
            status: 'Available',
            cropType: 'Rice',
            seedVarietyId: '',
            varietyName: '',
            directSeededDAS: '',
            transplantedDAS: '',
            plantingWindow: '30',
            varietyDescription: '',
            max_quantity_per_request: '',
        });
        setNameInput('');
        setIsNewItem(false);
        setCreateNewVariety(false);
        setErrors({});
    };

    const handleClose = () => {
        // Reset form when closing
        setForm({
            name: '',
            quantity: '1',
            description: '',
            category: 'Other',
            status: 'Available',
            cropType: 'Rice',
            seedVarietyId: '',
            varietyName: '',
            directSeededDAS: '',
            transplantedDAS: '',
            plantingWindow: '30',
            varietyDescription: '',
            max_quantity_per_request: '',
        });
        setNameInput('');
        setIsNewItem(false);
        setShowDropdown(false);
        setCreateNewVariety(false);
        setErrors({});
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
                        {/* Name Input with Dropdown - Hidden for Distribution */}
                        {form.status !== 'Distributed' && (
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
                        )}

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

                        {/* Conditional Fields - Only show if it's a new item AND not Distribution */}
                        {isNewItem && form.status !== 'Distributed' && (
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

                        {/* Distribution-specific fields */}
                        {form.status === 'Distributed' && (
                                    <>
                                        {/* Crop Type Selection */}
                                        <div className="rounded-lg p-4 border-2 border-blue-200 bg-blue-50">
                                            <div className="flex items-center gap-2 mb-3">
                                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                <label className="block text-sm font-semibold text-gray-800">
                                                    Crop Type <span className="text-red-500">*</span>
                                                </label>
                                            </div>
                                            <select
                                                name="cropType"
                                                value={form.cropType}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white appearance-none"
                                                required
                                            >
                                                {cropTypes.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type.replace(/_/g, ' ')}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Seed Variety Selection */}
                                        <div className={`rounded-lg p-4 border-2 ${errors.seedVarietyId ? 'border-red-500 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
                                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                                                Seed Variety <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={form.seedVarietyId}
                                                onChange={handleSeedVarietyChange}
                                                className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:ring-2 transition-all duration-200 appearance-none ${errors.seedVarietyId ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} bg-white`}
                                                required
                                            >
                                                <option value="">-- Select Existing Variety --</option>
                                                {loadingVarieties ? (
                                                    <option disabled>Loading varieties...</option>
                                                ) : (
                                                    varieties.map((variety) => (
                                                        <option key={variety.id} value={variety.id}>
                                                            {variety.name} ({variety.cropType.replace(/_/g, ' ')})
                                                        </option>
                                                    ))
                                                )}
                                                <option value="new">+ Create New Variety</option>
                                            </select>
                                            {errors.seedVarietyId && (
                                                <p className="text-xs mt-2 text-red-500 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.seedVarietyId}
                                                </p>
                                            )}
                                        </div>

                                        {/* Create New Variety Fields */}
                                        {createNewVariety && (
                                            <div className="rounded-lg p-4 border-2 border-green-300 bg-green-50">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    <h4 className="font-semibold text-green-800">Create New Seed Variety</h4>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Variety Name <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="varietyName"
                                                            value={form.varietyName}
                                                            onChange={handleChange}
                                                            placeholder="e.g., NSIC Rc222"
                                                            className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 transition-all ${errors.varietyName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} bg-white`}
                                                            required
                                                        />
                                                        {errors.varietyName && (
                                                            <p className="text-xs mt-1 text-red-500 flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                                {errors.varietyName}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Direct Seeded DAS <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="directSeededDAS"
                                                                value={form.directSeededDAS}
                                                                onChange={handleChange}
                                                                placeholder="120"
                                                                className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 transition-all ${errors.directSeededDAS ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} bg-white`}
                                                                min="1"
                                                                required
                                                            />
                                                            {errors.directSeededDAS && (
                                                                <p className="text-xs mt-1 text-red-500">{errors.directSeededDAS}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Transplanted DAS <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="transplantedDAS"
                                                                value={form.transplantedDAS}
                                                                onChange={handleChange}
                                                                placeholder="115"
                                                                className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 transition-all ${errors.transplantedDAS ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} bg-white`}
                                                                min="1"
                                                                required
                                                            />
                                                            {errors.transplantedDAS && (
                                                                <p className="text-xs mt-1 text-red-500">{errors.transplantedDAS}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Planting Window (days)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="plantingWindow"
                                                            value={form.plantingWindow}
                                                            onChange={handleChange}
                                                            placeholder="30"
                                                            className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-green-500 transition-all bg-white"
                                                            min="1"
                                                        />
                                                        <p className="text-xs mt-1 text-gray-600">Default: 30 days after pickup</p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Variety Description
                                                        </label>
                                                        <textarea
                                                            name="varietyDescription"
                                                            value={form.varietyDescription}
                                                            onChange={handleChange}
                                                            placeholder="e.g., High-yielding variety resistant to drought"
                                                            rows="2"
                                                            className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-green-500 transition-all bg-white resize-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Max Quantity Per Request */}
                                        <div className="rounded-lg p-4 border-2 border-blue-200 bg-blue-50">
                                            <label className="block text-sm font-semibold text-gray-800 mb-1">
                                                Maximum Quantity Per Request
                                                <span className="text-xs font-normal ml-2 text-gray-600">(Optional)</span>
                                            </label>
                                            <p className="text-xs mb-3 text-gray-600">
                                                Leave empty for no limit. Users cannot request more than this amount in a single transaction.
                                            </p>
                                            <input
                                                type="number"
                                                name="max_quantity_per_request"
                                                value={form.max_quantity_per_request}
                                                onChange={handleChange}
                                                placeholder="e.g., 10"
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                                min="1"
                                            />
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
