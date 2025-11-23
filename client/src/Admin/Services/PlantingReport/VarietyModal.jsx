import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const VarietyModal = ({ isOpen, onClose, onSave, variety = null }) => {
    const isEditMode = !!variety;
    
    const [formData, setFormData] = useState({
        name: '',
        cropType: '',
        directSeededDAS: '',
        transplantedDAS: '',
        description: ''
    });

    // Populate form when editing
    useEffect(() => {
        if (isOpen && variety) {
            setFormData({
                name: variety.name || '',
                cropType: variety.cropType || '',
                directSeededDAS: variety.directSeededDAS?.toString() || '',
                transplantedDAS: variety.transplantedDAS?.toString() || '',
                description: variety.description || ''
            });
        } else if (isOpen && !variety) {
            resetForm();
        }
    }, [isOpen, variety]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const varietyData = {
            id: variety?.id || `variety_${Date.now()}`,
            name: formData.name,
            cropType: formData.cropType,
            directSeededDAS: parseInt(formData.directSeededDAS),
            transplantedDAS: parseInt(formData.transplantedDAS),
            description: formData.description || null,
            isActive: variety?.isActive ?? true,
            createdAt: variety?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        onSave(varietyData);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            cropType: '',
            directSeededDAS: '',
            transplantedDAS: '',
            description: ''
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={handleClose}></div>

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl z-50 max-h-[90vh] overflow-y-auto">
                <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Seed Variety' : 'Add New Seed Variety'}</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Variety Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g., NSIC Rc222"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Crop Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="cropType"
                                    value={formData.cropType}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select Crop Type</option>
                                    <option value="Rice">Rice</option>
                                    <option value="Corn">Corn</option>
                                    <option value="High_Value_Crops">High Value Crops</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Direct Seeded DAS <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="directSeededDAS"
                                        value={formData.directSeededDAS}
                                        onChange={handleInputChange}
                                        required
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="e.g., 104"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Days for Direct Seeded method
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Transplanted DAS <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="transplantedDAS"
                                        value={formData.transplantedDAS}
                                        onChange={handleInputChange}
                                        required
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="e.g., 120"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Days for Transplanting method
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-gray-400 text-xs">(Optional)</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter variety description..."
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                                {isEditMode ? 'Update Variety' : 'Add Variety'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default VarietyModal;
