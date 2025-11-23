import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Archive, AlertTriangle } from 'lucide-react';
import Select from 'react-select';
import { seasonService, varietyService } from '../../../Services/plantingReportService';

const ReportModal = ({ 
    isOpen, 
    onClose, 
    report = null, 
    onSave,
    onArchive,
    isArchived = false,
    seasons = [],
    varieties = []
}) => {
    const isEditMode = !!report;
    const STORAGE_KEY = 'plantingReportFormDraft';

    // Form state
    const [formData, setFormData] = useState({
        // Farmer Information
        farmerName: '',
        farmLocation: '',
        rsbsaNumber: '',
        // Seeding Information
        croppingSeasonId: '',
        areaPlanted: '',
        seedClassification: '',
        typeOfCrop: '',
        riceIrrigation: '',
        varietyId: '',
        dateOfPlanting: '',
        plantingMethod: '',
        cropInsurance: false,
        // Harvesting Information
        harvestArea: '',
        numberOfBags: '',
        weightPerBag: '',
        dateOfExpectedHarvest: ''
    });

    const [filteredVarieties, setFilteredVarieties] = useState([]);
    const [selectedVariety, setSelectedVariety] = useState(null);
    const [calculatedYield, setCalculatedYield] = useState(null);
    const [calculatedExpectedHarvest, setCalculatedExpectedHarvest] = useState(null);
    
    // Fresh data state (bypass cache)
    const [freshSeasons, setFreshSeasons] = useState([]);
    const [freshVarieties, setFreshVarieties] = useState([]);
    
    // Archive confirmation modal state
    const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

    // Fetch fresh seasons and varieties when modal opens (bypass cache)
    useEffect(() => {
        if (isOpen) {
            const fetchFreshData = async () => {
                try {
                    const [seasonsData, varietiesData] = await Promise.all([
                        seasonService.getAll(),
                        varietyService.getAll()
                    ]);
                    // Extract data from API response
                    setFreshSeasons(seasonsData.seasons || seasonsData || []);
                    setFreshVarieties(varietiesData.varieties || varietiesData || []);
                } catch (error) {
                    console.error('Error fetching fresh data:', error);
                    // Fallback to props if API fails
                    setFreshSeasons(seasons);
                    setFreshVarieties(varieties);
                }
            };
            fetchFreshData();
        }
    }, [isOpen]);

    // Initialize form data when modal opens or report changes
    useEffect(() => {
        if (isOpen) {
            if (report) {
                // Edit mode - populate with existing data
                setFormData({
                    farmerName: report.farmerName || '',
                    farmLocation: report.farmLocation || '',
                    rsbsaNumber: report.rsbsaNumber || '',
                    croppingSeasonId: report.croppingSeasonId || '',
                    areaPlanted: report.areaPlanted || '',
                    seedClassification: report.seedClassification || '',
                    typeOfCrop: report.typeOfCrop || '',
                    riceIrrigation: report.riceIrrigation || '',
                    varietyId: report.varietyId || '',
                    dateOfPlanting: report.dateOfPlanting ? report.dateOfPlanting.split('T')[0] : '',
                    plantingMethod: report.plantingMethod || '',
                    cropInsurance: report.cropInsurance || false,
                    harvestArea: report.harvestArea || '',
                    numberOfBags: report.numberOfBags || '',
                    weightPerBag: report.weightPerBag || '',
                    dateOfExpectedHarvest: report.dateOfExpectedHarvest ? report.dateOfExpectedHarvest.split('T')[0] : ''
                });
                setCalculatedYield(report.yieldMtPerHa);
                
                // Set filtered varieties based on crop type
                if (report.typeOfCrop && Array.isArray(freshVarieties)) {
                    setFilteredVarieties(freshVarieties.filter(v => v.cropType === report.typeOfCrop && v.isActive));
                }
                
                // Set selected variety
                if (report.varietyId) {
                    const variety = freshVarieties.find(v => v.id === report.varietyId);
                    setSelectedVariety(variety);
                }
            } else {
                // Create mode - load from localStorage or reset
                const savedData = localStorage.getItem(STORAGE_KEY);
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        setFormData(parsed);
                        
                        // Restore filtered varieties and selected variety
                        if (parsed.typeOfCrop) {
                            const filtered = freshVarieties.filter(v => v.cropType === parsed.typeOfCrop && v.isActive);
                            setFilteredVarieties(filtered);
                        }
                        if (parsed.varietyId) {
                            const variety = freshVarieties.find(v => v.id === parsed.varietyId);
                            setSelectedVariety(variety);
                        }
                    } catch (error) {
                        console.error('Error parsing saved form data:', error);
                        resetForm();
                    }
                } else {
                    resetForm();
                }
            }
        }
    }, [isOpen, report, freshVarieties]);

    // Save form data to localStorage (only in create mode)
    useEffect(() => {
        if (!report) {
            // Save even when modal is closed to persist across page navigation
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }
    }, [formData, report]);

    // Calculate expected harvest when variety or planting date changes
    useEffect(() => {
        if (formData.typeOfCrop === 'Rice' && formData.varietyId && formData.dateOfPlanting && formData.plantingMethod && selectedVariety) {
            const plantingDate = new Date(formData.dateOfPlanting);
            const expectedDate = new Date(plantingDate);
            
            // Use correct DAS based on planting method
            const das = formData.plantingMethod === 'Direct_Seeded' 
                ? selectedVariety.directSeededDAS 
                : selectedVariety.transplantedDAS;
            
            expectedDate.setDate(plantingDate.getDate() + das);
            setCalculatedExpectedHarvest(expectedDate.toISOString().split('T')[0]);
            
            setFormData(prev => ({
                ...prev,
                dateOfExpectedHarvest: expectedDate.toISOString().split('T')[0]
            }));
        } else if (formData.typeOfCrop !== 'Rice') {
            setCalculatedExpectedHarvest(null);
        }
    }, [formData.varietyId, formData.dateOfPlanting, formData.typeOfCrop, formData.plantingMethod, selectedVariety]);

    // Calculate yield when harvest data changes
    useEffect(() => {
        if (formData.harvestArea && formData.numberOfBags && formData.weightPerBag) {
            const yield_mt_per_ha = (
                parseFloat(formData.harvestArea) * 
                parseInt(formData.numberOfBags) * 
                parseFloat(formData.weightPerBag)
            ) / 1000;
            setCalculatedYield(yield_mt_per_ha.toFixed(2));
        } else {
            setCalculatedYield(null);
        }
    }, [formData.harvestArea, formData.numberOfBags, formData.weightPerBag]);

    const resetForm = () => {
        setFormData({
            farmerName: '',
            farmLocation: '',
            rsbsaNumber: '',
            croppingSeasonId: '',
            areaPlanted: '',
            seedClassification: '',
            typeOfCrop: '',
            riceIrrigation: '',
            varietyId: '',
            dateOfPlanting: '',
            plantingMethod: '',
            cropInsurance: false,
            harvestArea: '',
            numberOfBags: '',
            weightPerBag: '',
            dateOfExpectedHarvest: ''
        });
        setFilteredVarieties([]);
        setSelectedVariety(null);
        setCalculatedYield(null);
        setCalculatedExpectedHarvest(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCropTypeChange = (e) => {
        const cropType = e.target.value;
        setFormData(prev => ({
            ...prev,
            typeOfCrop: cropType,
            riceIrrigation: cropType === 'Rice' ? prev.riceIrrigation : '',
            varietyId: '' // Reset variety when crop type changes
        }));
        
        // Filter varieties based on selected crop type (use fresh data)
        const filtered = freshVarieties.filter(v => v.cropType === cropType && v.isActive);
        setFilteredVarieties(filtered);
        setSelectedVariety(null);
    };

    const handleVarietyChange = (selectedOption) => {
        const varietyId = selectedOption ? selectedOption.value : '';
        const variety = freshVarieties.find(v => v.id === varietyId);
        setSelectedVariety(variety || null);
        setFormData(prev => ({
            ...prev,
            varietyId
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Prevent submission if archived
        if (isArchived) return;
        
        // Prepare data for submission
        const submitData = {
            ...formData,
            yieldMtPerHa: calculatedYield ? parseFloat(calculatedYield) : null,
            areaPlanted: parseFloat(formData.areaPlanted),
            harvestArea: formData.harvestArea ? parseFloat(formData.harvestArea) : null,
            numberOfBags: formData.numberOfBags ? parseInt(formData.numberOfBags) : null,
            weightPerBag: formData.weightPerBag ? parseFloat(formData.weightPerBag) : null,
            dateOfPlanting: new Date(formData.dateOfPlanting).toISOString(),
            dateOfExpectedHarvest: formData.dateOfExpectedHarvest ? new Date(formData.dateOfExpectedHarvest).toISOString() : null
        };

        onSave(submitData);
        
        // Clear localStorage after successful submission
        localStorage.removeItem(STORAGE_KEY);
        
        handleClose();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleArchiveClick = () => {
        setShowArchiveConfirm(true);
    };

    const handleConfirmArchive = () => {
        if (report && onArchive) {
            onArchive(report.id);
        }
        setShowArchiveConfirm(false);
    };

    const handleCancelArchive = () => {
        setShowArchiveConfirm(false);
    };

    if (!isOpen) return null;

    const activeSeasons = seasons.filter(s => s.isActive);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop - Semi-transparent with blur */}
            <div 
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" 
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl z-50 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {isArchived ? 'View Archived Report' : isEditMode ? 'Edit Planting Report' : 'Create New Planting Report'}
                        </h2>
                        {isArchived && (
                            <p className="text-sm text-gray-500 mt-1">This report is archived and cannot be modified</p>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-8">
                            {/* Farmer Information Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
                                    Farmer Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Farmer Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="farmerName"
                                            value={formData.farmerName}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isArchived}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="Enter farmer name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            RSBSA Number <span className="text-gray-400 text-xs">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="rsbsaNumber"
                                            value={formData.rsbsaNumber}
                                            onChange={handleInputChange}
                                            disabled={isArchived}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="e.g., RSBSA-01-001-001234"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Leave empty for non-farmer clients</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Farm Location <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="farmLocation"
                                            value={formData.farmLocation}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isArchived}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="e.g., Barangay San Isidro, Nueva Ecija"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Seeding Information Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                                    Seeding Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cropping Season <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="croppingSeasonId"
                                            value={formData.croppingSeasonId}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isArchived}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Season</option>
                                            {activeSeasons.map(season => (
                                                <option key={season.id} value={season.id}>
                                                    {season.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Area Planted (hectares) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="areaPlanted"
                                            value={formData.areaPlanted}
                                            onChange={handleInputChange}
                                            required
                                            step="0.01"
                                            min="0"
                                            disabled={isArchived}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="e.g., 2.5"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Seed Classification <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="seedClassification"
                                            value={formData.seedClassification}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isArchived}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Classification</option>
                                            <option value="Inbred_Certified">Inbred (Certified Seeds)</option>
                                            <option value="Hybrid_F1">Hybrid (F1)</option>
                                            <option value="Inbred_Good">Inbred (Good Seeds)</option>
                                            <option value="Inbred_Farmers">Inbred (Farmer's Seed)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Type of Crop <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="typeOfCrop"
                                            value={formData.typeOfCrop}
                                            onChange={handleCropTypeChange}
                                            required
                                            disabled={isArchived}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Crop Type</option>
                                            <option value="Rice">Rice</option>
                                            <option value="Corn">Corn</option>
                                            <option value="High_Value_Crops">High Value Crops</option>
                                        </select>
                                    </div>

                                    {/* Rice Irrigation - Only show when Rice is selected */}
                                    {formData.typeOfCrop === 'Rice' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Rice Irrigation Type <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="riceIrrigation"
                                                value={formData.riceIrrigation}
                                                onChange={handleInputChange}
                                                required
                                                disabled={isArchived}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                <option value="">Select Irrigation Type</option>
                                                <option value="Irrigated">Irrigated</option>
                                                <option value="RainfedLowland">Rainfed Lowland</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className={formData.typeOfCrop === 'Rice' ? '' : 'md:col-span-2'}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Variety <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            name="varietyId"
                                            value={
                                                formData.varietyId 
                                                    ? { value: formData.varietyId, label: filteredVarieties.find(v => v.id === formData.varietyId)?.name || '' }
                                                    : null
                                            }
                                            onChange={handleVarietyChange}
                                            options={filteredVarieties.map(variety => ({
                                                value: variety.id,
                                                label: variety.name
                                            }))}
                                            placeholder={formData.typeOfCrop ? 'Search or select variety...' : 'Select crop type first'}
                                            isDisabled={!formData.typeOfCrop || isArchived}
                                            isClearable
                                            isSearchable
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    borderColor: state.isFocused ? '#10b981' : '#d1d5db',
                                                    boxShadow: state.isFocused ? '0 0 0 2px rgba(16, 185, 129, 0.5)' : 'none',
                                                    '&:hover': {
                                                        borderColor: '#10b981'
                                                    }
                                                })
                                            }}
                                        />
                                        {selectedVariety && (
                                            <p className="mt-1 text-xs text-gray-500">{selectedVariety.description}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date of Planting <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="dateOfPlanting"
                                            value={formData.dateOfPlanting}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isArchived}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Planting Method <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="plantingMethod"
                                            value={formData.plantingMethod}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isArchived}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Method</option>
                                            <option value="Direct_Seeded">Direct Seeded</option>
                                            <option value="Transplanting">Transplanting</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="cropInsurance"
                                                checked={formData.cropInsurance}
                                                onChange={handleInputChange}
                                                disabled={isArchived}
                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 disabled:cursor-not-allowed"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                Crop Insurance Applied
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Harvesting Information Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-orange-500">
                                    Harvesting Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Expected Harvest Date */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Expected Harvest Date
                                        </label>
                                        {formData.typeOfCrop === 'Rice' ? (
                                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                                                {calculatedExpectedHarvest 
                                                    ? new Date(calculatedExpectedHarvest).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })
                                                    : 'Auto-calculated based on DAS + Date of Planting'}
                                            </div>
                                        ) : (
                                            <input
                                                type="date"
                                                name="dateOfExpectedHarvest"
                                                value={formData.dateOfExpectedHarvest}
                                                onChange={handleInputChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                disabled={isArchived}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            />
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            {formData.typeOfCrop === 'Rice' 
                                                ? 'Automatically calculated: Date of Planting + DAS (Days After Sowing)'
                                                : 'Select expected harvest date (future dates only)'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Harvest Area (hectares)
                                        </label>
                                        <input
                                            type="number"
                                            name="harvestArea"
                                            value={formData.harvestArea}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            disabled={isArchived}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="e.g., 2.5"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Number of Bags
                                        </label>
                                        <input
                                            type="number"
                                            name="numberOfBags"
                                            value={formData.numberOfBags}
                                            onChange={handleInputChange}
                                            min="0"
                                            disabled={isArchived}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="e.g., 125"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Weight Per Bag (kg)
                                        </label>
                                        <input
                                            type="number"
                                            name="weightPerBag"
                                            value={formData.weightPerBag}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            disabled={isArchived}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="e.g., 50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Production Data Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-purple-500">
                                    Production Data
                                </h3>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Yield (mt/ha)
                                            </label>
                                            <p className="text-xs text-gray-500">
                                                Calculated: (Harvest Area × No. of Bags × Weight per Bag) ÷ 1000
                                            </p>
                                        </div>
                                        <div className="text-3xl font-bold text-purple-600">
                                            {calculatedYield !== null ? `${calculatedYield} mt/ha` : 'N/A'}
                                        </div>
                                    </div>
                                    {calculatedYield === null && (
                                        <p className="mt-2 text-xs text-orange-600">
                                            Fill in harvest area, number of bags, and weight per bag to calculate yield
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-between items-center mt-6 pt-6 border-t">
                            {/* Archive Button - Left side, only for existing reports that aren't archived */}
                            <div>
                                {isEditMode && !isArchived && onArchive && (
                                    <button
                                        type="button"
                                        onClick={handleArchiveClick}
                                        className="flex items-center space-x-2 px-4 py-2 border border-red-300 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Archive size={18} />
                                        <span>Archive Report</span>
                                    </button>
                                )}
                            </div>
                            
                            {/* Cancel and Save/Update Buttons - Right side */}
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    {isArchived ? 'Close' : 'Cancel'}
                                </button>
                                {!isArchived && (
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        {isEditMode ? 'Update Report' : 'Create Report'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

            {/* Archive Confirmation Modal */}
            {showArchiveConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
                        onClick={handleCancelArchive}
                    ></div>
                    <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-6 z-[70]">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Archive Report
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Are you sure you want to archive this planting report?
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1 mb-6">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Archived reports cannot be edited</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>This action cannot be undone</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>The report will be moved to the Archived section</span>
                                    </li>
                                </ul>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleCancelArchive}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmArchive}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                                    >
                                        Archive
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>,
        document.body
    );
};

export default ReportModal;
