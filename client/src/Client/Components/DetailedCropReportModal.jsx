import React, { useState, useEffect } from 'react';
import CropService from '../Services/CropService';

const DetailedCropReportModal = ({ isOpen, onClose, crop, onReportSubmitted }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Information
    reportDate: new Date().toISOString().slice(0, 10),
    growthStage: '',
    plantHeight: '',
    
    // Plant Health Assessment
    healthStatus: 'Healthy',
    plantColor: 'green',
    leafCondition: 'healthy',
    stemCondition: 'strong',
    rootCondition: 'healthy',
    
    // Pests and Diseases
    pestsObserved: [],
    diseasesObserved: [],
    pestSeverity: 'none',
    diseaseSeverity: 'none',
    treatmentApplied: '',
    
    // Weather and Environmental
    weatherConditions: '',
    rainfallAmount: '',
    temperatureRange: '',
    droughtStress: 'none',
    floodingIssues: 'none',
    
    // Crop Management
    fertilizersUsed: '',
    fertilizerAmount: '',
    pesticidesUsed: '',
    pesticideAmount: '',
    irrigationFrequency: '',
    weedingStatus: '',
    
    // Yield and Quality
    estimatedYield: '',
    expectedQuality: 'good',
    harvestReadiness: '0',
    marketablePercentage: '100',
    
    // Farm Operations
    laborHours: '',
    machineryUsed: [],
    totalExpenses: '',
    expenseBreakdown: {
      seeds: '',
      fertilizer: '',
      pesticides: '',
      labor: '',
      fuel: '',
      other: ''
    },
    
    // Observations and Notes
    unusualObservations: '',
    improvementNeeds: '',
    nextMonthPlans: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [progressInfo, setProgressInfo] = useState(null);

  const sections = [
    {
      title: 'Basic Plant Information',
      icon: '🌱',
      description: 'General plant status and growth measurements'
    },
    {
      title: 'Plant Health Assessment',
      icon: '🏥',
      description: 'Detailed health evaluation of your crops'
    },
    {
      title: 'Pests & Diseases',
      icon: '🐛',
      description: 'Pest and disease monitoring and treatment'
    },
    {
      title: 'Weather & Environment',
      icon: '🌤️',
      description: 'Environmental conditions affecting your crops'
    },
    {
      title: 'Crop Management',
      icon: '⚙️',
      description: 'Fertilizers, pesticides, and farming operations'
    },
    {
      title: 'Yield & Quality',
      icon: '🌾',
      description: 'Expected harvest and quality assessment'
    },
    {
      title: 'Farm Operations',
      icon: '🚜',
      description: 'Labor, machinery, and financial tracking'
    },
    {
      title: 'Observations & Notes',
      icon: '📝',
      description: 'Additional observations and future plans'
    }
  ];

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

      // Pre-fill some data
      setFormData(prev => ({
        ...prev,
        estimatedYield: crop.expectedYield?.toString() || '',
        growthStage: crop.currentStage || ''
      }));
    }
  }, [crop]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const validateSection = (sectionIndex) => {
    const newErrors = {};
    
    switch (sectionIndex) {
      case 0: // Basic Information
        if (!formData.growthStage) newErrors.growthStage = 'Growth stage is required';
        if (!formData.plantHeight) newErrors.plantHeight = 'Plant height is required';
        break;
      case 1: // Plant Health
        if (!formData.healthStatus) newErrors.healthStatus = 'Health status is required';
        break;
      case 5: // Yield & Quality
        if (!formData.estimatedYield) newErrors.estimatedYield = 'Estimated yield is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextSection = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
    }
  };

  const prevSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateSection(currentSection)) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reportData = {
        ...formData,
        reportDate: formData.reportDate,
        cropId: crop.id,
        reportType: 'detailed_survey',
        submittedAt: new Date().toISOString()
      };
      
      onReportSubmitted(reportData);
      onClose();
      
      // Reset form
      setCurrentSection(0);
      setFormData({
        reportDate: new Date().toISOString().slice(0, 10),
        growthStage: '',
        plantHeight: '',
        healthStatus: 'Healthy',
        plantColor: 'green',
        leafCondition: 'healthy',
        stemCondition: 'strong',
        rootCondition: 'healthy',
        pestsObserved: [],
        diseasesObserved: [],
        pestSeverity: 'none',
        diseaseSeverity: 'none',
        treatmentApplied: '',
        weatherConditions: '',
        rainfallAmount: '',
        temperatureRange: '',
        droughtStress: 'none',
        floodingIssues: 'none',
        fertilizersUsed: '',
        fertilizerAmount: '',
        pesticidesUsed: '',
        pesticideAmount: '',
        irrigationFrequency: '',
        weedingStatus: '',
        estimatedYield: '',
        expectedQuality: 'good',
        harvestReadiness: '0',
        marketablePercentage: '100',
        laborHours: '',
        machineryUsed: [],
        totalExpenses: '',
        expenseBreakdown: {
          seeds: '',
          fertilizer: '',
          pesticides: '',
          labor: '',
          fuel: '',
          other: ''
        },
        unusualObservations: '',
        improvementNeeds: '',
        nextMonthPlans: '',
        notes: ''
      });
      
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderSectionContent = () => {
    switch (currentSection) {
      case 0: // Basic Plant Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Date *
                </label>
                <input
                  type="date"
                  value={formData.reportDate}
                  onChange={(e) => handleInputChange('reportDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Growth Stage *
                </label>
                <select
                  value={formData.growthStage}
                  onChange={(e) => handleInputChange('growthStage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select growth stage</option>
                  <option value="Germination">Germination</option>
                  <option value="Seedling">Seedling</option>
                  <option value="Vegetative">Vegetative</option>
                  <option value="Tillering">Tillering</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Fruit Development">Fruit Development</option>
                  <option value="Maturation">Maturation</option>
                  <option value="Harvest Ready">Harvest Ready</option>
                </select>
                {errors.growthStage && <p className="text-red-500 text-xs mt-1">{errors.growthStage}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Plant Height (cm) *
                </label>
                <input
                  type="number"
                  value={formData.plantHeight}
                  onChange={(e) => handleInputChange('plantHeight', e.target.value)}
                  placeholder="e.g., 25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.plantHeight && <p className="text-red-500 text-xs mt-1">{errors.plantHeight}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days from Planting
                </label>
                <input
                  type="text"
                  value={progressInfo?.daysFromPlanting || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>

            {progressInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Crop Progress Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Progress:</span>
                    <span className="ml-2 font-medium">{progressInfo.progress}%</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Report #:</span>
                    <span className="ml-2 font-medium">{progressInfo.reportNumber}/{progressInfo.totalReports}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Days to Harvest:</span>
                    <span className="ml-2 font-medium">{progressInfo.daysToHarvest}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 1: // Plant Health Assessment
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overall Health Status *
                </label>
                <select
                  value={formData.healthStatus}
                  onChange={(e) => handleInputChange('healthStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plant Color
                </label>
                <select
                  value={formData.plantColor}
                  onChange={(e) => handleInputChange('plantColor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="dark-green">Dark Green (Healthy)</option>
                  <option value="green">Normal Green</option>
                  <option value="light-green">Light Green</option>
                  <option value="yellow">Yellowing</option>
                  <option value="brown">Brown/Wilted</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leaf Condition
                </label>
                <select
                  value={formData.leafCondition}
                  onChange={(e) => handleInputChange('leafCondition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="healthy">Healthy</option>
                  <option value="yellowing">Yellowing</option>
                  <option value="spots">Spots/Lesions</option>
                  <option value="wilting">Wilting</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stem Condition
                </label>
                <select
                  value={formData.stemCondition}
                  onChange={(e) => handleInputChange('stemCondition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="strong">Strong</option>
                  <option value="normal">Normal</option>
                  <option value="weak">Weak</option>
                  <option value="damaged">Damaged</option>
                  <option value="diseased">Diseased</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Root Condition (if visible)
                </label>
                <select
                  value={formData.rootCondition}
                  onChange={(e) => handleInputChange('rootCondition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="healthy">Healthy</option>
                  <option value="normal">Normal</option>
                  <option value="poor">Poor</option>
                  <option value="rotting">Rotting</option>
                  <option value="unknown">Unknown/Not Visible</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2: // Pests & Diseases
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pests Observed (Check all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['None', 'Aphids', 'Caterpillars', 'Beetles', 'Mites', 'Thrips', 'Whiteflies', 'Grasshoppers', 'Other'].map(pest => (
                  <label key={pest} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.pestsObserved.includes(pest)}
                      onChange={(e) => handleArrayChange('pestsObserved', pest, e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm">{pest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diseases Observed (Check all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['None', 'Leaf Spot', 'Blight', 'Rust', 'Mildew', 'Wilt', 'Root Rot', 'Virus', 'Other'].map(disease => (
                  <label key={disease} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.diseasesObserved.includes(disease)}
                      onChange={(e) => handleArrayChange('diseasesObserved', disease, e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm">{disease}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pest Severity
                </label>
                <select
                  value={formData.pestSeverity}
                  onChange={(e) => handleInputChange('pestSeverity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="none">None</option>
                  <option value="low">Low (1-10% damage)</option>
                  <option value="moderate">Moderate (11-25% damage)</option>
                  <option value="high">High (26-50% damage)</option>
                  <option value="severe">Severe (&gt;50% damage)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disease Severity
                </label>
                <select
                  value={formData.diseaseSeverity}
                  onChange={(e) => handleInputChange('diseaseSeverity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="none">None</option>
                  <option value="low">Low (1-10% affected)</option>
                  <option value="moderate">Moderate (11-25% affected)</option>
                  <option value="high">High (26-50% affected)</option>
                  <option value="severe">Severe (&gt;50% affected)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Treatment Applied
              </label>
              <textarea
                value={formData.treatmentApplied}
                onChange={(e) => handleInputChange('treatmentApplied', e.target.value)}
                placeholder="Describe any treatments, pesticides, or interventions applied..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        );

      case 3: // Weather & Environment
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weather Conditions This Month
              </label>
              <select
                value={formData.weatherConditions}
                onChange={(e) => handleInputChange('weatherConditions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select weather conditions</option>
                <option value="excellent">Excellent (Perfect for crop)</option>
                <option value="good">Good (Favorable conditions)</option>
                <option value="fair">Fair (Some challenges)</option>
                <option value="poor">Poor (Difficult conditions)</option>
                <option value="extreme">Extreme (Severe weather events)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Rainfall (mm)
                </label>
                <input
                  type="number"
                  value={formData.rainfallAmount}
                  onChange={(e) => handleInputChange('rainfallAmount', e.target.value)}
                  placeholder="e.g., 150"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature Range (°C)
                </label>
                <input
                  type="text"
                  value={formData.temperatureRange}
                  onChange={(e) => handleInputChange('temperatureRange', e.target.value)}
                  placeholder="e.g., 25-32"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drought Stress
                </label>
                <select
                  value={formData.droughtStress}
                  onChange={(e) => handleInputChange('droughtStress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="none">None</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Flooding Issues
                </label>
                <select
                  value={formData.floodingIssues}
                  onChange={(e) => handleInputChange('floodingIssues', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="none">None</option>
                  <option value="minor">Minor (Brief waterlogging)</option>
                  <option value="moderate">Moderate (Some field flooding)</option>
                  <option value="severe">Severe (Significant flooding)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4: // Crop Management
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fertilizers Used
                </label>
                <input
                  type="text"
                  value={formData.fertilizersUsed}
                  onChange={(e) => handleInputChange('fertilizersUsed', e.target.value)}
                  placeholder="e.g., Urea, NPK 14-14-14"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fertilizer Amount (kg/ha)
                </label>
                <input
                  type="number"
                  value={formData.fertilizerAmount}
                  onChange={(e) => handleInputChange('fertilizerAmount', e.target.value)}
                  placeholder="e.g., 50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pesticides Used
                </label>
                <input
                  type="text"
                  value={formData.pesticidesUsed}
                  onChange={(e) => handleInputChange('pesticidesUsed', e.target.value)}
                  placeholder="e.g., Chlorpyrifos, BT spray"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pesticide Amount (L/ha)
                </label>
                <input
                  type="number"
                  value={formData.pesticideAmount}
                  onChange={(e) => handleInputChange('pesticideAmount', e.target.value)}
                  placeholder="e.g., 2.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Irrigation Frequency
                </label>
                <select
                  value={formData.irrigationFrequency}
                  onChange={(e) => handleInputChange('irrigationFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="every-2-days">Every 2 days</option>
                  <option value="twice-weekly">Twice weekly</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="rainfed">Rainfed only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weeding Status
                </label>
                <select
                  value={formData.weedingStatus}
                  onChange={(e) => handleInputChange('weedingStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select status</option>
                  <option value="clean">Clean (No weeds)</option>
                  <option value="low">Low weed pressure</option>
                  <option value="moderate">Moderate weeds</option>
                  <option value="high">High weed pressure</option>
                  <option value="recent-weeding">Recently weeded</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 5: // Yield & Quality
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Yield (kg) *
                </label>
                <input
                  type="number"
                  value={formData.estimatedYield}
                  onChange={(e) => handleInputChange('estimatedYield', e.target.value)}
                  placeholder="e.g., 4500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.estimatedYield && <p className="text-red-500 text-xs mt-1">{errors.estimatedYield}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Quality
                </label>
                <select
                  value={formData.expectedQuality}
                  onChange={(e) => handleInputChange('expectedQuality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="below-average">Below Average</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harvest Readiness (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.harvestReadiness}
                  onChange={(e) => handleInputChange('harvestReadiness', e.target.value)}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{formData.harvestReadiness}% ready</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marketable Percentage (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.marketablePercentage}
                  onChange={(e) => handleInputChange('marketablePercentage', e.target.value)}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{formData.marketablePercentage}% marketable</div>
              </div>
            </div>
          </div>
        );

      case 6: // Farm Operations
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Labor Hours This Month
                </label>
                <input
                  type="number"
                  value={formData.laborHours}
                  onChange={(e) => handleInputChange('laborHours', e.target.value)}
                  placeholder="e.g., 40"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Expenses (₱)
                </label>
                <input
                  type="number"
                  value={formData.totalExpenses}
                  onChange={(e) => handleInputChange('totalExpenses', e.target.value)}
                  placeholder="e.g., 5000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Machinery Used (Check all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Hand tools', 'Water pump', 'Tractor', 'Harvester', 'Sprayer', 'Cultivator', 'Thresher', 'Other'].map(machine => (
                  <label key={machine} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.machineryUsed.includes(machine)}
                      onChange={(e) => handleArrayChange('machineryUsed', machine, e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm">{machine}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-3">Expense Breakdown (₱)</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Seeds</label>
                  <input
                    type="number"
                    value={formData.expenseBreakdown.seeds}
                    onChange={(e) => handleInputChange('expenseBreakdown.seeds', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Fertilizer</label>
                  <input
                    type="number"
                    value={formData.expenseBreakdown.fertilizer}
                    onChange={(e) => handleInputChange('expenseBreakdown.fertilizer', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Pesticides</label>
                  <input
                    type="number"
                    value={formData.expenseBreakdown.pesticides}
                    onChange={(e) => handleInputChange('expenseBreakdown.pesticides', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Labor</label>
                  <input
                    type="number"
                    value={formData.expenseBreakdown.labor}
                    onChange={(e) => handleInputChange('expenseBreakdown.labor', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Fuel</label>
                  <input
                    type="number"
                    value={formData.expenseBreakdown.fuel}
                    onChange={(e) => handleInputChange('expenseBreakdown.fuel', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Other</label>
                  <input
                    type="number"
                    value={formData.expenseBreakdown.other}
                    onChange={(e) => handleInputChange('expenseBreakdown.other', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 7: // Observations & Notes
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unusual Observations
              </label>
              <textarea
                value={formData.unusualObservations}
                onChange={(e) => handleInputChange('unusualObservations', e.target.value)}
                placeholder="Any unusual observations, unexpected events, or notable changes..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Areas Needing Improvement
              </label>
              <textarea
                value={formData.improvementNeeds}
                onChange={(e) => handleInputChange('improvementNeeds', e.target.value)}
                placeholder="What areas of your farming practice need improvement or support..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plans for Next Month
              </label>
              <textarea
                value={formData.nextMonthPlans}
                onChange={(e) => handleInputChange('nextMonthPlans', e.target.value)}
                placeholder="Your farming plans and activities for the next month..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional information, questions, or comments..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Detailed Crop Report</h2>
              {crop && (
                <p className="text-green-100 mt-1">
                  {crop.cropType} - {crop.variety} | Area: {crop.area} ha
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-green-100 mb-2">
              <span>Section {currentSection + 1} of {sections.length}</span>
              <span>{Math.round(((currentSection + 1) / sections.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-green-700 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  index === currentSection
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : index < currentSection
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="text-sm font-medium">{section.title}</span>
                {index < currentSection && (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="text-2xl mr-3">{sections[currentSection].icon}</span>
              {sections[currentSection].title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{sections[currentSection].description}</p>
          </div>

          {renderSectionContent()}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={prevSection}
            disabled={currentSection === 0}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              currentSection === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="text-sm text-gray-600">
            {currentSection + 1} / {sections.length}
          </div>

          {currentSection < sections.length - 1 ? (
            <button
              onClick={nextSection}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Next
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Report
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedCropReportModal;
