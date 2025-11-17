import React, { useState, useEffect } from 'react';
import StagesEditor from './StagesEditor';

const CATEGORY_OPTIONS = [
  { value: 'Cereals', label: 'Cereals', icon: '🌾' },
  { value: 'Vegetables', label: 'Vegetables', icon: '🥬' },
  { value: 'Fruits', label: 'Fruits', icon: '🍎' },
  { value: 'Legumes', label: 'Legumes', icon: '🫘' },
  { value: 'Root_Crops', label: 'Root Crops', icon: '🥔' },
  { value: 'Herbs_Spices', label: 'Herbs & Spices', icon: '🌿' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'Easy', label: 'Easy', color: 'text-green-600' },
  { value: 'Moderate', label: 'Moderate', color: 'text-blue-600' },
  { value: 'Moderate_High', label: 'Moderate-High', color: 'text-orange-600' },
  { value: 'High', label: 'High', color: 'text-red-600' },
];

const PROFITABILITY_OPTIONS = [
  { value: 'Low', label: 'Low', color: 'text-gray-600' },
  { value: 'Moderate', label: 'Moderate', color: 'text-blue-600' },
  { value: 'High', label: 'High', color: 'text-green-600' },
  { value: 'Very_High', label: 'Very High', color: 'text-emerald-600' },
];

export default function GuidelineModal({ isOpen, onClose, guideline, onSave, isLoading }) {
  const isEditMode = !!guideline;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    varieties: [''],
    plantingSeasons: [''],
    growingPeriod: { min: '', max: '', unit: 'days' },
    waterRequirements: '',
    expectedYield: { min: '', max: '', unit: 'tons/ha' },
    soilType: '',
    climate: '',
    spacing: { width: '', height: '', unit: 'cm' },
    fertilizer: '',
    keyTips: [''],
    commonPests: [{ name: '', control: '' }],
    diseases: [{ name: '', symptoms: '' }],
    marketPrice: { min: '', max: '', currency: '₱', unit: 'kg' },
    profitability: 'Moderate',
    difficulty: 'Moderate',
    stages: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (guideline) {
      // Parse existing data for edit mode
      const parseGrowingPeriod = (str) => {
        if (!str) return { min: '', max: '', unit: 'days' };
        const match = str.match(/(\d+)(?:-(\d+))?\s*(days?|weeks?|months?)/i);
        if (match) {
          return { min: match[1], max: match[2] || match[1], unit: match[3].toLowerCase().replace(/s$/, '') + 's' };
        }
        return { min: '', max: '', unit: 'days' };
      };

      const parseYield = (str) => {
        if (!str) return { min: '', max: '', unit: 'tons/ha' };
        const match = str.match(/(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?\s*(tons?\/ha|kg\/ha|kg|tons?)/i);
        if (match) {
          return { min: match[1], max: match[2] || match[1], unit: match[3] || 'tons/ha' };
        }
        return { min: '', max: '', unit: 'tons/ha' };
      };

      const parseSpacing = (str) => {
        if (!str) return { width: '', height: '', unit: 'cm' };
        const match = str.match(/(\d+)\s*x\s*(\d+)\s*(cm|m)/i);
        if (match) {
          return { width: match[1], height: match[2], unit: match[3] };
        }
        return { width: '', height: '', unit: 'cm' };
      };

      const parseMarketPrice = (str) => {
        if (!str) return { min: '', max: '', currency: '₱', unit: 'kg' };
        const match = str.match(/([₱$])?\s*(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?\s*\/?\s*(kg|lb|piece)/i);
        if (match) {
          return { 
            min: match[2], 
            max: match[3] || match[2], 
            currency: match[1] || '₱', 
            unit: match[4] || 'kg' 
          };
        }
        return { min: '', max: '', currency: '₱', unit: 'kg' };
      };

      const parseStageDuration = (durationStr) => {
        if (!durationStr) return { durationValue: '', durationUnit: 'days', duration: '' };
        const match = durationStr.match(/(\d+)\s*(days?|weeks?|months?)/i);
        if (match) {
          const unit = match[2].toLowerCase().replace(/s$/, '') + 's';
          return { 
            durationValue: match[1], 
            durationUnit: unit,
            duration: durationStr 
          };
        }
        return { durationValue: '', durationUnit: 'days', duration: durationStr };
      };

      setFormData({
        name: guideline.name || '',
        category: guideline.category || 'Vegetables',
        varieties: guideline.varieties?.length > 0 ? guideline.varieties : [''],
        plantingSeasons: guideline.plantingSeasons?.length > 0 ? guideline.plantingSeasons : [''],
        growingPeriod: parseGrowingPeriod(guideline.growingPeriod),
        waterRequirements: guideline.waterRequirements || '',
        expectedYield: parseYield(guideline.expectedYield),
        soilType: guideline.soilType || '',
        climate: guideline.climate || '',
        spacing: parseSpacing(guideline.spacing),
        fertilizer: guideline.fertilizer || '',
        keyTips: guideline.keyTips?.length > 0 ? guideline.keyTips : [''],
        commonPests: guideline.commonPests?.length > 0 ? guideline.commonPests : [{ name: '', control: '' }],
        diseases: guideline.diseases?.length > 0 ? guideline.diseases : [{ name: '', symptoms: '' }],
        marketPrice: parseMarketPrice(guideline.marketPrice),
        profitability: guideline.profitability || 'Moderate',
        difficulty: guideline.difficulty || 'Moderate',
        stages: guideline.stages?.map(s => ({
          stageName: s.stageName || '',
          ...parseStageDuration(s.duration),
          description: s.description || '',
          activities: s.activities?.length > 0 ? s.activities : ['']
        })) || []
      });
    } else {
      // Reset for create mode
      setFormData({
        name: '',
        category: 'Vegetables',
        varieties: [''],
        plantingSeasons: [''],
        growingPeriod: { min: '', max: '', unit: 'days' },
        waterRequirements: '',
        expectedYield: { min: '', max: '', unit: 'tons/ha' },
        soilType: '',
        climate: '',
        spacing: { width: '', height: '', unit: 'cm' },
        fertilizer: '',
        keyTips: [''],
        commonPests: [{ name: '', control: '' }],
        diseases: [{ name: '', symptoms: '' }],
        marketPrice: { min: '', max: '', currency: '₱', unit: 'kg' },
        profitability: 'Moderate',
        difficulty: 'Moderate',
        stages: []
      });
    }
    setErrors({});
  }, [guideline, isOpen]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Array field helpers
  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, idx) => idx !== index)
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, idx) => idx === index ? value : item)
    }));
  };

  const updateObjectArrayItem = (field, index, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, idx) => 
        idx === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const updateNestedField = (field, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [key]: value }
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Crop name is required';
    if (!formData.growingPeriod.min || !formData.growingPeriod.max) {
      newErrors.growingPeriod = 'Growing period range is required';
    }
    if (formData.varieties.filter(v => v.trim()).length === 0) newErrors.varieties = 'At least one variety is required';
    if (formData.stages.length === 0) newErrors.stages = 'At least one stage is required';
    
    // Calculate total stage duration
    let totalDays = 0;
    formData.stages.forEach((stage, index) => {
      if (!stage.stageName.trim()) newErrors[`stage_${index}_name`] = `Stage ${index + 1} name is required`;
      if (stage.durationValue === '' || stage.durationValue === null || stage.durationValue === undefined) newErrors[`stage_${index}_duration`] = `Stage ${index + 1} duration is required`;
      if (!stage.description.trim()) newErrors[`stage_${index}_description`] = `Stage ${index + 1} description is required`;
      
      // Calculate days (allow 0 duration)
      if ((stage.durationValue !== '' && stage.durationValue !== null && stage.durationValue !== undefined) && stage.durationUnit) {
        const value = parseInt(stage.durationValue);
        switch(stage.durationUnit) {
          case 'days': totalDays += value; break;
          case 'weeks': totalDays += value * 7; break;
          case 'months': totalDays += value * 30; break;
          default: break;
        }
      }
    });

    // Validate stages match growing period
    if (formData.growingPeriod.min && formData.growingPeriod.max && formData.stages.length > 0) {
      const min = parseInt(formData.growingPeriod.min);
      const max = parseInt(formData.growingPeriod.max);
      let multiplier = 1;
      switch(formData.growingPeriod.unit) {
        case 'weeks': multiplier = 7; break;
        case 'months': multiplier = 30; break;
        default: multiplier = 1; break;
      }
      const expectedMin = min * multiplier;
      const expectedMax = max * multiplier;
      
      if (totalDays < expectedMin || totalDays > expectedMax) {
        newErrors.stages = `Stages must total ${expectedMin}-${expectedMax} days to match growing period. Current total: ${totalDays} days`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Format structured data back to string format for database
    const formatGrowingPeriod = (data) => {
      if (data.min === data.max) return `${data.min} ${data.unit}`;
      return `${data.min}-${data.max} ${data.unit}`;
    };

    const formatYield = (data) => {
      if (!data.min && !data.max) return '';
      if (data.min === data.max) return `${data.min} ${data.unit}`;
      return `${data.min}-${data.max} ${data.unit}`;
    };

    const formatSpacing = (data) => {
      if (!data.width || !data.height) return '';
      return `${data.width}x${data.height} ${data.unit}`;
    };

    const formatMarketPrice = (data) => {
      if (!data.min && !data.max) return '';
      const range = data.min === data.max ? data.min : `${data.min}-${data.max}`;
      return `${data.currency}${range}/${data.unit}`;
    };

    // Clean up data before submitting
    const cleanedData = {
      ...formData,
      growingPeriod: formatGrowingPeriod(formData.growingPeriod),
      expectedYield: formatYield(formData.expectedYield),
      spacing: formatSpacing(formData.spacing),
      marketPrice: formatMarketPrice(formData.marketPrice),
      varieties: formData.varieties.filter(v => v.trim()),
      plantingSeasons: formData.plantingSeasons.filter(s => s.trim()),
      keyTips: formData.keyTips.filter(t => t.trim()),
      commonPests: formData.commonPests.filter(p => p.name && p.name.trim()),
      diseases: formData.diseases.filter(d => d.name && d.name.trim()),
      stages: formData.stages.map((stage, index) => ({
        ...stage,
        // Ensure computed duration field is included
        duration: stage.duration || (stage.durationValue && stage.durationUnit ? `${stage.durationValue} ${stage.durationUnit}` : ''),
        activities: stage.activities.filter(a => a.trim()),
        sequenceOrder: index + 1
      }))
    };

    onSave(cleanedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl bg-white shadow-xl rounded-lg z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-green-600 text-white rounded-t-lg flex-shrink-0">
            <h3 className="text-xl font-bold">
              {isEditMode ? 'Edit Crop Guideline' : 'Create New Crop Guideline'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex-1 px-6 py-4 overflow-y-auto">
            {/* Basic Information */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Rice, Tomato, Corn"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {CATEGORY_OPTIONS.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Growing Period <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={formData.growingPeriod.min}
                      onChange={(e) => updateNestedField('growingPeriod', 'min', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Min"
                      min="0"
                    />
                    <input
                      type="number"
                      value={formData.growingPeriod.max}
                      onChange={(e) => updateNestedField('growingPeriod', 'max', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Max"
                      min="0"
                    />
                    <select
                      value={formData.growingPeriod.unit}
                      onChange={(e) => updateNestedField('growingPeriod', 'unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                  {errors.growingPeriod && <p className="text-red-500 text-xs mt-1">{errors.growingPeriod}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Yield
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.expectedYield.min}
                      onChange={(e) => updateNestedField('expectedYield', 'min', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Min"
                      min="0"
                    />
                    <input
                      type="number"
                      step="0.1"
                      value={formData.expectedYield.max}
                      onChange={(e) => updateNestedField('expectedYield', 'max', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Max"
                      min="0"
                    />
                    <select
                      value={formData.expectedYield.unit}
                      onChange={(e) => updateNestedField('expectedYield', 'unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="tons/ha">tons/ha</option>
                      <option value="kg/ha">kg/ha</option>
                      <option value="kg">kg</option>
                      <option value="tons">tons</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => updateField('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {DIFFICULTY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profitability <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.profitability}
                    onChange={(e) => updateField('profitability', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {PROFITABILITY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Market Price (₱)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.marketPrice.min}
                      onChange={(e) => updateNestedField('marketPrice', 'min', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Min"
                      min="0"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.marketPrice.max}
                      onChange={(e) => updateNestedField('marketPrice', 'max', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Max"
                      min="0"
                    />
                    <select
                      value={formData.marketPrice.unit}
                      onChange={(e) => updateNestedField('marketPrice', 'unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="kg">per kg</option>
                      <option value="lb">per lb</option>
                      <option value="piece">per piece</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Varieties */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Varieties <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('varieties')}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  + Add Variety
                </button>
              </div>
              <div className="space-y-2">
                {formData.varieties.map((variety, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={variety}
                      onChange={(e) => updateArrayItem('varieties', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Variety name"
                    />
                    {formData.varieties.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('varieties', index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.varieties && <p className="text-red-500 text-xs mt-1">{errors.varieties}</p>}
            </div>

            {/* Planting Seasons */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Planting Seasons
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('plantingSeasons')}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  + Add Season
                </button>
              </div>
              <div className="space-y-2">
                {formData.plantingSeasons.map((season, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={season}
                      onChange={(e) => updateArrayItem('plantingSeasons', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Wet Season, Dry Season"
                    />
                    {formData.plantingSeasons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('plantingSeasons', index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Growing Conditions */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Growing Conditions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Water Requirements
                  </label>
                  <input
                    type="text"
                    value={formData.waterRequirements}
                    onChange={(e) => updateField('waterRequirements', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Regular irrigation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soil Type
                  </label>
                  <input
                    type="text"
                    value={formData.soilType}
                    onChange={(e) => updateField('soilType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Well-drained loamy soil"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Climate
                  </label>
                  <input
                    type="text"
                    value={formData.climate}
                    onChange={(e) => updateField('climate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Tropical, 25-30°C"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spacing
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={formData.spacing.width}
                      onChange={(e) => updateNestedField('spacing', 'width', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Width"
                      min="0"
                    />
                    <input
                      type="number"
                      value={formData.spacing.height}
                      onChange={(e) => updateNestedField('spacing', 'height', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Height"
                      min="0"
                    />
                    <select
                      value={formData.spacing.unit}
                      onChange={(e) => updateNestedField('spacing', 'unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                      <option value="in">inches</option>
                      <option value="ft">feet</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fertilizer Requirements
                  </label>
                  <textarea
                    value={formData.fertilizer}
                    onChange={(e) => updateField('fertilizer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={2}
                    placeholder="Fertilizer application details..."
                  />
                </div>
              </div>
            </div>

            {/* Key Tips */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Key Tips
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('keyTips')}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  + Add Tip
                </button>
              </div>
              <div className="space-y-2">
                {formData.keyTips.map((tip, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-green-600">💡</span>
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => updateArrayItem('keyTips', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Farming tip..."
                    />
                    {formData.keyTips.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('keyTips', index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Common Pests */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Common Pests
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('commonPests', { name: '', control: '' })}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  + Add Pest
                </button>
              </div>
              <div className="space-y-3">
                {formData.commonPests.map((pest, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={pest.name || ''}
                        onChange={(e) => updateObjectArrayItem('commonPests', index, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Pest name"
                      />
                      <input
                        type="text"
                        value={pest.control || ''}
                        onChange={(e) => updateObjectArrayItem('commonPests', index, 'control', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Control method"
                      />
                    </div>
                    {formData.commonPests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('commonPests', index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Diseases */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Common Diseases
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('diseases', { name: '', symptoms: '' })}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  + Add Disease
                </button>
              </div>
              <div className="space-y-3">
                {formData.diseases.map((disease, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={disease.name || ''}
                        onChange={(e) => updateObjectArrayItem('diseases', index, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Disease name"
                      />
                      <input
                        type="text"
                        value={disease.symptoms || ''}
                        onChange={(e) => updateObjectArrayItem('diseases', index, 'symptoms', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Symptoms"
                      />
                    </div>
                    {formData.diseases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('diseases', index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stages Editor */}
            <div className="mb-6 p-4 border-2 border-green-200 rounded-lg bg-green-50">
              <StagesEditor 
                stages={formData.stages}
                onChange={(stages) => updateField('stages', stages)}
                growingPeriod={formData.growingPeriod}
              />
              {errors.stages && <p className="text-red-500 text-sm mt-2">{errors.stages}</p>}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t -mx-6 -mb-4 rounded-b-lg flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {isEditMode ? 'Update Guideline' : 'Create Guideline'}
                  </>
                )}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}
