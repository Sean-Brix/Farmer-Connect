import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const SeasonModal = ({ isOpen, onClose, onSave, season = null }) => {
    const isEditMode = !!season;
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: ''
    });

    // Populate form when editing
    useEffect(() => {
        if (isOpen && season) {
            setFormData({
                name: season.name || '',
                description: season.description || '',
                startDate: season.startDate ? new Date(season.startDate).toISOString().split('T')[0] : '',
                endDate: season.endDate ? new Date(season.endDate).toISOString().split('T')[0] : ''
            });
        } else if (isOpen && !season) {
            resetForm();
        }
    }, [isOpen, season]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const seasonData = {
            id: season?.id || `season_${Date.now()}`,
            name: formData.name,
            description: formData.description || null,
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
            isActive: season?.isActive ?? true,
            createdAt: season?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        onSave(seasonData);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            startDate: '',
            endDate: ''
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
                        <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Cropping Season' : 'Add New Cropping Season'}</h2>
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
                                    Season Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g., Wet Season 2025"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-gray-400 text-xs">(Optional)</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter season description..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                        min={formData.startDate}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
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
                                {isEditMode ? 'Update Season' : 'Add Season'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SeasonModal;
