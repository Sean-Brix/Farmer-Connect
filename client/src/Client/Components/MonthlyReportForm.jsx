import React, { useState, useEffect } from 'react';
import CropService from '../Services/CropService';

const MonthlyReportForm = ({ isOpen, onClose, crop, onReportSubmitted }) => {
  const [formData, setFormData] = useState({
    growthStage: '',
    plantHeight: '',
    healthStatus: 'Healthy',
    estimatedYield: '',
    pestsAndDiseases: '',
    weatherImpact: '',
    fertilizersUsed: '',
    pesticideUsed: '',
    laborHours: '',
    expenses: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [progressInfo, setProgressInfo] = useState(null);
  const [validationMessages, setValidationMessages] = useState([]);

  // Calculate progress information when crop changes
  useEffect(() => {
    if (crop) {
      const progress = CropService.calculateProgress(crop.plantingDate, crop.expectedHarvest);
      const expectedMonths = CropService.getExpectedReportMonths(crop.plantingDate, crop.expectedHarvest);
      const currentMonth = new Date().toISOString().slice(0, 7);
      const reportNumber = expectedMonths.findIndex(month => month === currentMonth) + 1;
      
      setProgressInfo({
        progress,
        reportNumber,
        totalReports: expectedMonths.length,
        daysFromPlanting: Math.floor((new Date() - new Date(crop.plantingDate)) / (1000 * 60 * 60 * 24)),
        daysToHarvest: Math.floor((new Date(crop.expectedHarvest) - new Date()) / (1000 * 60 * 60 * 24))
      });

      // Pre-fill estimated yield with previous report or expected yield
      if (crop.reports && crop.reports.length > 0) {
        const lastReport = crop.reports[crop.reports.length - 1];
        setFormData(prev => ({
          ...prev,
          estimatedYield: lastReport.estimatedYield.toString()
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          estimatedYield: crop.expectedYield.toString()
        }));
      }
    }
  }, [crop]);

  // Validate form data
  useEffect(() => {
    const messages = [];
    
    if (formData.plantHeight && progressInfo) {
      const expectedHeight = getExpectedHeight();
      const height = parseFloat(formData.plantHeight);
      
      if (height < expectedHeight * 0.7) {
        messages.push({
          type: 'warning',
          message: `Plant height (${height}cm) seems low for this stage. Expected: ${expectedHeight}cm`
        });
      } else if (height > expectedHeight * 1.3) {
        messages.push({
          type: 'info',
          message: `Plant height (${height}cm) is above average. Great growth!`
        });
      }
    }

    if (formData.estimatedYield && crop) {
      const currentYield = parseFloat(formData.estimatedYield);
      const expectedYield = crop.expectedYield;
      
      if (currentYield < expectedYield * 0.8) {
        messages.push({
          type: 'warning',
          message: `Estimated yield is below expected. Consider reviewing farming practices.`
        });
      } else if (currentYield > expectedYield * 1.2) {
        messages.push({
          type: 'success',
          message: `Estimated yield exceeds expectations! Excellent farming.`
        });
      }
    }

    setValidationMessages(messages);
  }, [formData.plantHeight, formData.estimatedYield, progressInfo, crop]);

  const getExpectedHeight = () => {
    if (!crop || !progressInfo) return 0;
    
    // Simple height estimation based on crop type and progress
    const heightRanges = {
      'Rice': { max: 120, stages: ['Germination', 'Seedling', 'Tillering', 'Stem elongation', 'Booting', 'Heading'] },
      'Corn': { max: 200, stages: ['Germination', 'Seedling', 'Leaf development', 'Stem elongation', 'Tasseling'] },
      'Tomato': { max: 150, stages: ['Germination', 'Seedling', 'Vegetative', 'Flowering'] },
      'Eggplant': { max: 100, stages: ['Germination', 'Seedling', 'Vegetative', 'Flowering'] },
      'Pechay': { max: 25, stages: ['Germination', 'Seedling', 'Leaf development'] },
      'Cabbage': { max: 30, stages: ['Germination', 'Seedling', 'Vegetative', 'Head formation'] },
      'Lettuce': { max: 20, stages: ['Germination', 'Seedling', 'Leaf development'] }
    };

    const range = heightRanges[crop.cropType];
    if (!range) return 50; // Default

    const progressRatio = progressInfo.progress / 100;
    return Math.round(range.max * progressRatio);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field errors
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.growthStage) newErrors.growthStage = 'Please select growth stage';
    if (!formData.plantHeight) newErrors.plantHeight = 'Please enter plant height';
    else if (parseFloat(formData.plantHeight) <= 0) newErrors.plantHeight = 'Height must be greater than 0';
    
    if (formData.estimatedYield && parseFloat(formData.estimatedYield) < 0) {
      newErrors.estimatedYield = 'Yield cannot be negative';
    }

    if (formData.laborHours && parseFloat(formData.laborHours) < 0) {
      newErrors.laborHours = 'Labor hours cannot be negative';
    }

    if (formData.expenses && parseFloat(formData.expenses) < 0) {
      newErrors.expenses = 'Expenses cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const reportData = {
        ...formData,
        reportDate: new Date().toISOString().split('T')[0],
        plantHeight: parseFloat(formData.plantHeight),
        estimatedYield: parseFloat(formData.estimatedYield) || 0,
        laborHours: parseFloat(formData.laborHours) || 0,
        expenses: parseFloat(formData.expenses) || 0,
        cropId: crop.id,
        farmerId: crop.farmerId || 1, // Get from auth context
        month: new Date().toISOString().slice(0, 7)
      };

      // In a real application, this would call the API
      // await CropService.submitMonthlyReport(crop.id, reportData);
      
      // For now, call the parent callback
      onReportSubmitted(reportData);
      
      // Reset form
      setFormData({
        growthStage: '',
        plantHeight: '',
        healthStatus: 'Healthy',
        estimatedYield: '',
        pestsAndDiseases: '',
        weatherImpact: '',
        fertilizersUsed: '',
        pesticideUsed: '',
        laborHours: '',
        expenses: '',
        notes: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !crop) return null;

  const availableStages = CropService.getGrowthStages(crop.cropType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Monthly Crop Report</h2>
              <p className="text-green-100">{crop.cropType} - {crop.variety}</p>
              <p className="text-green-100 text-sm">
                Planted: {crop.plantingDate} • Area: {crop.area} ha
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
              disabled={loading}
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Progress Information */}
          {progressInfo && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">📊 Crop Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{progressInfo.progress}%</div>
                  <div className="text-blue-700">Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{progressInfo.reportNumber}</div>
                  <div className="text-green-700">Report #{progressInfo.reportNumber}/{progressInfo.totalReports}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{progressInfo.daysFromPlanting}</div>
                  <div className="text-purple-700">Days from planting</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{progressInfo.daysToHarvest}</div>
                  <div className="text-orange-700">Days to harvest</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressInfo.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Validation Messages */}
          {validationMessages.length > 0 && (
            <div className="mb-6 space-y-2">
              {validationMessages.map((msg, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg text-sm ${
                    msg.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                    msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
              
              {/* Growth Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Growth Stage <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.growthStage}
                  onChange={(e) => handleInputChange('growthStage', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.growthStage ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Current Growth Stage</option>
                  {availableStages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
                {errors.growthStage && <p className="text-red-500 text-xs mt-1">{errors.growthStage}</p>}
              </div>

              {/* Plant Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Height (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={formData.plantHeight}
                  onChange={(e) => handleInputChange('plantHeight', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.plantHeight ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={`Expected: ~${getExpectedHeight()}cm`}
                  disabled={loading}
                />
                {errors.plantHeight && <p className="text-red-500 text-xs mt-1">{errors.plantHeight}</p>}
              </div>

              {/* Health Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.healthStatus}
                  onChange={(e) => handleInputChange('healthStatus', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                >
                  <option value="Healthy">🟢 Healthy - No visible problems</option>
                  <option value="Warning">🟡 Warning - Minor issues detected</option>
                  <option value="Critical">🔴 Critical - Serious problems requiring attention</option>
                </select>
              </div>

              {/* Estimated Yield */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Updated Estimated Yield (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.estimatedYield}
                  onChange={(e) => handleInputChange('estimatedYield', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.estimatedYield ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={`Original: ${crop.expectedYield.toLocaleString()} kg`}
                  disabled={loading}
                />
                {errors.estimatedYield && <p className="text-red-500 text-xs mt-1">{errors.estimatedYield}</p>}
              </div>
            </div>

            {/* Detailed Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Detailed Information</h3>
              
              {/* Pests and Diseases */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pests and Diseases
                </label>
                <input
                  type="text"
                  value={formData.pestsAndDiseases}
                  onChange={(e) => handleInputChange('pestsAndDiseases', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Minor leaf spot, Brown planthopper, None"
                  disabled={loading}
                />
              </div>

              {/* Weather Impact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weather Impact
                </label>
                <select
                  value={formData.weatherImpact}
                  onChange={(e) => handleInputChange('weatherImpact', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                >
                  <option value="">Select Weather Impact</option>
                  <option value="Favorable">☀️ Favorable - Ideal weather conditions</option>
                  <option value="Good">🌤️ Good - Generally good weather</option>
                  <option value="Adequate">⛅ Adequate - Acceptable conditions</option>
                  <option value="Poor">🌧️ Poor - Challenging weather</option>
                  <option value="Drought stress">🌵 Drought stress - Insufficient water</option>
                  <option value="Flood damage">🌊 Flood damage - Excessive water</option>
                  <option value="Wind damage">💨 Wind damage - Strong winds</option>
                  <option value="Hail damage">🧊 Hail damage - Hail impact</option>
                </select>
              </div>

              {/* Fertilizers Used */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fertilizers Applied
                </label>
                <input
                  type="text"
                  value={formData.fertilizersUsed}
                  onChange={(e) => handleInputChange('fertilizersUsed', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 14-14-14 NPK, Urea, Organic compost"
                  disabled={loading}
                />
              </div>

              {/* Pesticides Used */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesticides Applied
                </label>
                <input
                  type="text"
                  value={formData.pesticideUsed}
                  onChange={(e) => handleInputChange('pesticideUsed', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Organic neem oil, Malathion, None"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Farm Management Data */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Farm Management</h3>
              
              {/* Labor Hours */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Labor Hours This Month
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.laborHours}
                  onChange={(e) => handleInputChange('laborHours', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.laborHours ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 40"
                  disabled={loading}
                />
                {errors.laborHours && <p className="text-red-500 text-xs mt-1">{errors.laborHours}</p>}
              </div>

              {/* Expenses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expenses This Month (PHP)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expenses}
                  onChange={(e) => handleInputChange('expenses', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.expenses ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 5000"
                  disabled={loading}
                />
                {errors.expenses && <p className="text-red-500 text-xs mt-1">{errors.expenses}</p>}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Notes</h3>
              
              {/* Notes */}
              <div>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="6"
                  placeholder="Additional observations, activities, or concerns:
- Irrigation schedule changes
- Soil condition observations
- Animal pest issues
- Special farming techniques applied
- Market preparation activities
- Equipment maintenance"
                  disabled={loading}
                />
              </div>
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
              disabled={loading || !formData.growthStage || !formData.plantHeight}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReportForm;
