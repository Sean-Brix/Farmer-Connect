import React, { useState, useEffect } from 'react';
import CropService from '../Services/CropService';

const CropRegistration = ({ isOpen, onClose, onCropRegistered }) => {
  const [formData, setFormData] = useState({
    cropType: '',
    variety: '',
    plantingDate: '',
    area: '',
    notes: ''
  });
  const [expectedInfo, setExpectedInfo] = useState(null);
  const [seasonValidation, setSeasonValidation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Get recommendations for current location and season
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Get crop recommendations
      const recs = CropService.getCropRecommendations('Cavite, Philippines');
      setRecommendations(recs);
    }
  }, [isOpen]);

  // Update expected information when form changes
  useEffect(() => {
    if (formData.cropType && formData.variety && formData.plantingDate && formData.area) {
      const expectedHarvest = CropService.calculateExpectedHarvest(
        formData.plantingDate,
        formData.cropType,
        formData.variety
      );
      
      const expectedYield = CropService.calculateExpectedYield(
        formData.area,
        formData.cropType,
        formData.variety
      );

      setExpectedInfo({
        expectedHarvest,
        expectedYield,
        growthPeriod: CropService.getCropInfo(formData.cropType)?.varieties.find(v => v.name === formData.variety)?.growthPeriod
      });
    } else {
      setExpectedInfo(null);
    }
  }, [formData.cropType, formData.variety, formData.plantingDate, formData.area]);

  // Validate planting season
  useEffect(() => {
    if (formData.cropType && formData.plantingDate) {
      const validation = CropService.validatePlantingSeason(formData.cropType, formData.plantingDate);
      setSeasonValidation(validation);
    } else {
      setSeasonValidation(null);
    }
  }, [formData.cropType, formData.plantingDate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear specific field errors
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cropType) newErrors.cropType = 'Please select a crop type';
    if (!formData.variety) newErrors.variety = 'Please select a variety';
    if (!formData.plantingDate) newErrors.plantingDate = 'Please enter planting date';
    if (!formData.area) newErrors.area = 'Please enter area';
    else if (parseFloat(formData.area) <= 0) newErrors.area = 'Area must be greater than 0';

    // Check if planting date is not too far in the future
    const plantingDate = new Date(formData.plantingDate);
    const maxFutureDate = new Date();
    maxFutureDate.setMonth(maxFutureDate.getMonth() + 3); // 3 months in future
    
    if (plantingDate > maxFutureDate) {
      newErrors.plantingDate = 'Planting date cannot be more than 3 months in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const cropData = {
        ...formData,
        area: parseFloat(formData.area),
        expectedHarvest: expectedInfo.expectedHarvest,
        expectedYield: expectedInfo.expectedYield,
        status: 'Active',
        currentStage: 'Preparation'
      };

      // In a real application, this would call the API
      // await CropService.registerCrop(cropData);
      
      // For now, we'll just call the parent callback
      onCropRegistered(cropData);
      
      // Reset form
      setFormData({
        cropType: '',
        variety: '',
        plantingDate: '',
        area: '',
        notes: ''
      });
      setExpectedInfo(null);
      setSeasonValidation(null);
      setErrors({});
      
      onClose();
    } catch (error) {
      console.error('Error registering crop:', error);
      alert('Failed to register crop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableCrops = CropService.getAllCrops();
  const availableVarieties = formData.cropType ? CropService.getVarietiesForCrop(formData.cropType) : [];
  const cropInfo = formData.cropType ? CropService.getCropInfo(formData.cropType) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Register New Crop</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
              disabled={loading}
            >
              ×
            </button>
          </div>
          <p className="text-green-100 mt-2">Add a new crop to your farm management system</p>
        </div>

        <div className="p-6">
          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">🌟 Recommended Crops for This Season</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      formData.cropType === rec.cropType 
                        ? 'bg-blue-200 border-blue-400 border-2' 
                        : 'bg-white border border-blue-200 hover:bg-blue-50'
                    }`}
                    onClick={() => handleInputChange('cropType', rec.cropType)}
                  >
                    <div className="font-medium text-blue-800">{rec.cropType}</div>
                    <div className="text-xs text-blue-600">{rec.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Crop Information</h3>
              
              {/* Crop Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.cropType}
                  onChange={(e) => handleInputChange('cropType', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.cropType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Crop Type</option>
                  {availableCrops.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
                {errors.cropType && <p className="text-red-500 text-xs mt-1">{errors.cropType}</p>}
              </div>

              {/* Variety */}
              {formData.cropType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variety <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.variety}
                    onChange={(e) => handleInputChange('variety', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.variety ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <option value="">Select Variety</option>
                    {availableVarieties.map(variety => (
                      <option key={variety.name} value={variety.name}>
                        {variety.name} - {variety.growthPeriod} days, {CropService.formatYield(variety.yieldPerHectare)}/ha
                      </option>
                    ))}
                  </select>
                  {errors.variety && <p className="text-red-500 text-xs mt-1">{errors.variety}</p>}
                  
                  {formData.variety && (
                    <div className="mt-2 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">
                        {availableVarieties.find(v => v.name === formData.variety)?.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Planting Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planting Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) => handleInputChange('plantingDate', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.plantingDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.plantingDate && <p className="text-red-500 text-xs mt-1">{errors.plantingDate}</p>}
                
                {/* Season Validation */}
                {seasonValidation && (
                  <div className={`mt-2 p-2 rounded text-xs ${
                    seasonValidation.valid 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  }`}>
                    {seasonValidation.message}
                  </div>
                )}
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (hectares) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.area ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 1.5"
                  disabled={loading}
                />
                {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="Additional notes about this crop (soil preparation, special conditions, etc.)"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Information Panel */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Crop Details</h3>
              
              {/* Expected Information */}
              {expectedInfo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">📊 Expected Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Growth Period:</span>
                      <span className="font-medium text-green-800">{expectedInfo.growthPeriod} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Expected Harvest:</span>
                      <span className="font-medium text-green-800">{expectedInfo.expectedHarvest}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Expected Yield:</span>
                      <span className="font-medium text-green-800">{CropService.formatYield(expectedInfo.expectedYield)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Yield per Hectare:</span>
                      <span className="font-medium text-green-800">
                        {CropService.formatYield(Math.round(expectedInfo.expectedYield / parseFloat(formData.area || 1)))}/ha
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Crop Information */}
              {cropInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">🌱 Growing Information</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-blue-800">Seasonality:</span>
                      <p className="text-blue-700">{cropInfo.seasonality}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Ideal Climate:</span>
                      <p className="text-blue-700">{cropInfo.idealClimate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Soil Requirement:</span>
                      <p className="text-blue-700">{cropInfo.soilRequirement}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Water Requirement:</span>
                      <p className="text-blue-700">{cropInfo.waterRequirement}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Growth Stages */}
              {formData.cropType && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-3">📈 Growth Stages</h4>
                  <div className="flex flex-wrap gap-1">
                    {CropService.getGrowthStages(formData.cropType).map((stage, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        {index + 1}. {stage}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={loading || !formData.cropType || !formData.variety || !formData.plantingDate || !formData.area}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registering...
                </>
              ) : (
                'Register Crop'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropRegistration;
