import React, { useState, useEffect } from 'react';
import { categories, statuses } from '../../constants';

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

const EditItemModal = ({
    isOpen,
    onClose,
    form,
    handleChange,
    handleUpdate,
}) => {
    const [createNewVariety, setCreateNewVariety] = useState(false);
    const [errors, setErrors] = useState({});
    
    // Use the seed varieties hook
    const { varieties, loading: loadingVarieties } = useSeedVarieties(
        form.status === 'Distributed' ? (form.cropType || 'Rice') : null
    );

    const handleSeedVarietyChange = (e) => {
        const value = e.target.value;
        handleChange({ target: { name: 'seedVarietyId', value } });
        setCreateNewVariety(value === 'new');

        if (errors.seedVarietyId) {
            setErrors((prev) => ({ ...prev, seedVarietyId: undefined }));
        }
    };

    const handleLocalChange = (e) => {
        const { name } = e.target;
        handleChange(e);
        
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow p-6 w-full max-w-2xl relative border border-blue-100 mx-2 my-4 max-h-[95vh] overflow-y-auto">
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
                    {/* Name Input - Hidden for Distributed status */}
                    {form.status !== 'Distributed' && (
                        <input
                            type="text"
                            name="name"
                            value={form.name || ''}
                            onChange={handleLocalChange}
                            placeholder="Name"
                            className="border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 w-full"
                            required
                        />
                    )}
                    <input
                        type="number"
                        name="quantity"
                        value={form.quantity || ''}
                        onChange={handleLocalChange}
                        placeholder="Qty"
                        className="border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 w-full"
                        min="0"
                        required
                    />
                    {/* Description Input - Hidden for Distributed status (shown in Distribution section instead) */}
                    {form.status !== 'Distributed' && (
                        <input
                            type="text"
                            name="description"
                            value={form.description || ''}
                            onChange={handleLocalChange}
                            placeholder="Description"
                            className="border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 w-full"
                        />
                    )}
                    <select
                        name="category"
                        value={form.category || 'Other'}
                        onChange={handleLocalChange}
                        className="border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 w-full"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    
                    {/* Distribution-specific fields - Show when status is Distributed */}
                    {form.status === 'Distributed' && (
                        <>
                            {/* Crop Type Selection */}
                            <div className="rounded-lg p-3 border-2 border-blue-200 bg-blue-50">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Crop Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="cropType"
                                    value={form.cropType || 'Rice'}
                                    onChange={handleLocalChange}
                                    className="w-full px-3 py-2 border border-blue-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-300 bg-white"
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
                            <div className={`rounded-lg p-3 border-2 ${errors.seedVarietyId ? 'border-red-500 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Seed Variety <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.seedVarietyId || ''}
                                    onChange={handleSeedVarietyChange}
                                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${errors.seedVarietyId ? 'border-red-500 focus:ring-red-500' : 'border-blue-100 focus:ring-blue-300'} bg-white`}
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
                                    <p className="text-xs mt-1 text-red-500">{errors.seedVarietyId}</p>
                                )}
                            </div>

                            {/* Create New Variety Fields */}
                            {createNewVariety && (
                                <div className="rounded-lg p-3 border-2 border-green-300 bg-green-50 space-y-3">
                                    <h4 className="font-semibold text-green-800 text-sm">Create New Seed Variety</h4>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Variety Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="varietyName"
                                            value={form.varietyName || ''}
                                            onChange={handleLocalChange}
                                            placeholder="e.g., NSIC Rc222"
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Direct Seeded DAS <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="directSeededDAS"
                                                value={form.directSeededDAS || ''}
                                                onChange={handleLocalChange}
                                                placeholder="120"
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-sm"
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Transplanted DAS <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="transplantedDAS"
                                                value={form.transplantedDAS || ''}
                                                onChange={handleLocalChange}
                                                placeholder="115"
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-sm"
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Planting Window (days)
                                        </label>
                                        <input
                                            type="number"
                                            name="plantingWindow"
                                            value={form.plantingWindow || '30'}
                                            onChange={handleLocalChange}
                                            placeholder="30"
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-sm"
                                            min="1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Variety Description
                                        </label>
                                        <textarea
                                            name="varietyDescription"
                                            value={form.varietyDescription || ''}
                                            onChange={handleLocalChange}
                                            placeholder="High-yielding variety..."
                                            rows="2"
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 bg-white resize-none text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Max Quantity Per Request */}
                            <div className="rounded-lg p-3 border-2 border-blue-200 bg-blue-50">
                                <label className="block text-xs font-semibold text-gray-800 mb-1">
                                    Max Quantity Per Request (Optional)
                                </label>
                                <input
                                    type="number"
                                    name="max_quantity_per_request"
                                    value={form.max_quantity_per_request || ''}
                                    onChange={handleLocalChange}
                                    placeholder="e.g., 10"
                                    className="w-full px-3 py-2 border border-blue-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-300 bg-white text-sm"

                            {/* Description for Distribution */}
                            <div className="rounded-lg p-3 border-2 border-blue-200 bg-blue-50">
                                <label className="block text-xs font-semibold text-gray-800 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description || ''}
                                    onChange={handleLocalChange}
                                    placeholder="Additional notes about this distribution..."
                                    rows="2"
                                    className="w-full px-3 py-2 border border-blue-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-300 bg-white resize-none text-sm"
                                />
                            </div>
                                    min="1"
                                />
                            </div>
                        </>
                    )}
                    
                    <select
                        name="status"
                        value={form.status || 'Available'}
                        onChange={handleLocalChange}
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
