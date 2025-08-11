import React, { useState, useEffect } from 'react';

function Survey() {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'create', 'edit'
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSurvey, setPreviewSurvey] = useState(null);

  // Form state for creating/editing surveys
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft', // draft, active, inactive
    category: 'general',
    fields: []
  });

  // Sample data
  useEffect(() => {
    setSurveys([
      {
        id: 1,
        title: 'Farmer Satisfaction Survey',
        description: 'Annual survey to measure farmer satisfaction with our services',
        status: 'active',
        category: 'feedback',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        fields: [
          { id: 1, type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
          { id: 2, type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
          { id: 3, type: 'select', label: 'Farm Type', required: true, options: ['Rice', 'Corn', 'Vegetables', 'Livestock'] },
          { id: 4, type: 'radio', label: 'Overall Satisfaction', required: true, options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] },
          { id: 5, type: 'textarea', label: 'Additional Comments', required: false, placeholder: 'Any additional feedback...' }
        ]
      },
      {
        id: 2,
        title: 'Equipment Usage Assessment',
        description: 'Survey to understand equipment usage patterns and needs',
        status: 'draft',
        category: 'equipment',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-12',
        fields: [
          { id: 1, type: 'text', label: 'Farmer Name', required: true, placeholder: 'Enter your name' },
          { id: 2, type: 'checkbox', label: 'Equipment Used', required: true, options: ['Tractor', 'Harvester', 'Planter', 'Irrigation System'] },
          { id: 3, type: 'number', label: 'Years of Experience', required: true, placeholder: 'Enter years' },
          { id: 4, type: 'date', label: 'Last Equipment Usage', required: false }
        ]
      }
    ]);
  }, []);

  // Field type options
  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: '📝' },
    { value: 'textarea', label: 'Text Area', icon: '📄' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'select', label: 'Dropdown', icon: '📋' },
    { value: 'radio', label: 'Radio Buttons', icon: '🔘' },
    { value: 'checkbox', label: 'Checkboxes', icon: '☑️' },
    { value: 'file', label: 'File Upload', icon: '📎' }
  ];

  // Add new field to form
  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type: type,
      label: '',
      required: false,
      placeholder: '',
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1'] : []
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  // Update field
  const updateField = (fieldId, updates) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  // Remove field
  const removeField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  // Add option to select/radio/checkbox field
  const addOption = (fieldId) => {
    const field = formData.fields.find(f => f.id === fieldId);
    const newOption = `Option ${field.options.length + 1}`;
    updateField(fieldId, { options: [...field.options, newOption] });
  };

  // Update option
  const updateOption = (fieldId, optionIndex, value) => {
    const field = formData.fields.find(f => f.id === fieldId);
    const newOptions = [...field.options];
    newOptions[optionIndex] = value;
    updateField(fieldId, { options: newOptions });
  };

  // Remove option
  const removeOption = (fieldId, optionIndex) => {
    const field = formData.fields.find(f => f.id === fieldId);
    const newOptions = field.options.filter((_, index) => index !== optionIndex);
    updateField(fieldId, { options: newOptions });
  };

  // Save survey
  const saveSurvey = () => {
    if (!formData.title.trim()) {
      alert('Please enter a survey title');
      return;
    }
    if (formData.fields.length === 0) {
      alert('Please add at least one field to the survey');
      return;
    }

    const survey = {
      id: selectedSurvey ? selectedSurvey.id : Date.now(),
      ...formData,
      createdAt: selectedSurvey ? selectedSurvey.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (selectedSurvey) {
      setSurveys(prev => prev.map(s => s.id === selectedSurvey.id ? survey : s));
    } else {
      setSurveys(prev => [survey, ...prev]);
    }

    resetForm();
    setActiveTab('list');
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'draft',
      category: 'general',
      fields: []
    });
    setSelectedSurvey(null);
  };

  // Edit survey
  const editSurvey = (survey) => {
    setSelectedSurvey(survey);
    setFormData({
      title: survey.title,
      description: survey.description,
      status: survey.status,
      category: survey.category,
      fields: survey.fields
    });
    setActiveTab('create');
  };

  // Delete survey
  const deleteSurvey = (id) => {
    setSurveys(prev => prev.filter(s => s.id !== id));
    setShowDeleteModal(false);
    setSurveyToDelete(null);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'inactive': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-2 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* EIC-style Title Section matching Inventory layout */}
        <div className="relative mb-6 mt-5 sm:mt-20 p-6 flex flex-col items-center justify-center max-w-5xl mx-auto gap-2 text-center">
          <span className="inline-flex items-center justify-center gap-3 w-full">
            <span className="rounded-full bg-green-100 p-2">
              <svg className="w-9 h-9 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
              Survey Management
            </span>
          </span>
          <span className="block text-base md:text-lg text-gray-500 font-medium mt-1">
            Create and manage survey forms for various purposes and data collection.
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { resetForm(); setActiveTab('list'); }}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'list' 
                  ? 'bg-green-600 text-white shadow-md transform scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              <span className="text-lg">📋</span>
              <span>Survey List</span>
            </button>
            <button
              onClick={() => { resetForm(); setActiveTab('create'); }}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'create' 
                  ? 'bg-green-600 text-white shadow-md transform scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              <span className="text-lg">✨</span>
              <span>Create Survey</span>
            </button>
          </div>
        </div>

        {/* Survey List */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">All Surveys</h2>
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                Total: {surveys.length} surveys
              </div>
            </div>

            {surveys.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-300 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys yet</h3>
                <p className="text-gray-500 mb-6">Create your first survey to get started collecting valuable data</p>
                <button
                  onClick={() => { resetForm(); setActiveTab('create'); }}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                >
                  <span className="inline-flex items-center gap-2">
                    <span>✨</span>
                    Create Your First Survey
                  </span>
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {surveys.map((survey) => (
                  <div key={survey.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-green-200">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{survey.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(survey.status)}`}>
                            {survey.status.toUpperCase()}
                          </span>
                          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                            {survey.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">{survey.description}</p>
                        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="text-green-500">📝</span>
                            {survey.fields.length} fields
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-blue-500">📅</span>
                            Created: {survey.createdAt}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-purple-500">🔄</span>
                            Updated: {survey.updatedAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 lg:flex-col lg:min-w-fit">
                        <button
                          onClick={() => {
                            setPreviewSurvey(survey);
                            setShowPreviewModal(true);
                          }}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-all duration-200 font-medium flex items-center gap-2 hover:shadow-md"
                        >
                          <span>👁️</span>
                          Preview
                        </button>
                        <button
                          onClick={() => editSurvey(survey)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-all duration-200 font-medium flex items-center gap-2 hover:shadow-md"
                        >
                          <span>✏️</span>
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSurveyToDelete(survey);
                            setShowDeleteModal(true);
                          }}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-all duration-200 font-medium flex items-center gap-2 hover:shadow-md"
                        >
                          <span>🗑️</span>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Survey */}
        {activeTab === 'create' && (
          <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedSurvey ? 'Edit Survey' : 'Create New Survey'}
                </h2>
                <button
                  onClick={() => setActiveTab('list')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium flex items-center gap-2 self-start"
                >
                  <span>←</span>
                  Back to List
                </button>
              </div>

              {/* Basic Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Survey Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter survey title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    >
                      <option value="general">General</option>
                      <option value="feedback">Feedback</option>
                      <option value="equipment">Equipment</option>
                      <option value="seminar">Seminar</option>
                      <option value="agriculture">Agriculture</option>
                    </select>
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                      placeholder="Enter survey description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Form Fields</h3>
                  <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border">
                    {formData.fields.length} fields
                  </div>
                </div>

                {/* Fields List */}
                {formData.fields.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                    <div className="text-gray-300 text-4xl mb-3">📝</div>
                    <p className="text-gray-500 mb-2">No fields added yet</p>
                    <p className="text-sm text-gray-400">Use the sidebar to add fields to your survey</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formData.fields.map((field, index) => (
                      <div key={field.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              #{index + 1}
                            </span>
                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                              {fieldTypes.find(t => t.value === field.type)?.icon} {fieldTypes.find(t => t.value === field.type)?.label}
                            </span>
                          </div>
                          <button
                            onClick={() => removeField(field.id)}
                            className="text-gray-600 hover:text-red-600 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg"
                            title="Remove field"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Field Label *</label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                              placeholder="Enter field label"
                            />
                          </div>
                          {(field.type === 'text' || field.type === 'textarea' || field.type === 'email' || field.type === 'number') && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
                              <input
                                type="text"
                                value={field.placeholder || ''}
                                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                placeholder="Enter placeholder text"
                              />
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <span className="text-sm text-gray-700 font-medium">Required field</span>
                          </label>
                        </div>

                        {/* Options for select, radio, checkbox */}
                        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                          <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                              <label className="text-sm font-medium text-gray-700">Options</label>
                              <button
                                onClick={() => addOption(field.id)}
                                className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-all duration-200 font-medium flex items-center gap-1"
                              >
                                <span>+</span>
                                Add Option
                              </button>
                            </div>
                            <div className="space-y-3">
                              {field.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-3">
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                  {field.options.length > 1 && (
                                    <button
                                      onClick={() => removeOption(field.id, optionIndex)}
                                      className="text-gray-600 hover:text-red-600 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg"
                                      title="Remove option"
                                    >
                                      ❌
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={saveSurvey}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>{selectedSurvey ? '💾' : '✨'}</span>
                  {selectedSurvey ? 'Update Survey' : 'Create Survey'}
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab('list');
                  }}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <span>❌</span>
                  Cancel
                </button>
              </div>
            </div>

            {/* Sidebar for Field Types */}
            <div className="w-80 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">Add Field Types</h3>
              <p className="text-sm text-gray-600 mb-6">Click on a field type to add it to your survey</p>
              
              <div className="space-y-3">
                {fieldTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => addField(type.value)}
                    className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200 text-left group hover:shadow-md"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">{type.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 group-hover:text-green-700 transition-colors duration-200">{type.label}</div>
                      <div className="text-xs text-gray-500 group-hover:text-green-600 transition-colors duration-200">
                        {type.value === 'text' && 'Single line text input'}
                        {type.value === 'textarea' && 'Multi-line text area'}
                        {type.value === 'email' && 'Email validation field'}
                        {type.value === 'number' && 'Numeric input only'}
                        {type.value === 'date' && 'Date picker field'}
                        {type.value === 'select' && 'Dropdown selection'}
                        {type.value === 'radio' && 'Single choice option'}
                        {type.value === 'checkbox' && 'Multiple choice option'}
                        {type.value === 'file' && 'File upload field'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                  <span>💡</span>
                  Pro Tips
                </h4>
                <ul className="text-sm text-green-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>Add fields in logical order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>Use required fields sparingly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>Group related questions together</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>Test your form before publishing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to delete "<strong className="text-gray-900">{surveyToDelete?.title}</strong>"? 
                This action cannot be undone and all survey data will be permanently lost.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => deleteSurvey(surveyToDelete?.id)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:shadow-lg"
                >
                  <span>🗑️</span>
                  Delete Survey
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSurveyToDelete(null);
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <span>❌</span>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Survey Preview Modal */}
        {showPreviewModal && previewSurvey && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span>👁️</span>
                    Survey Preview
                  </h3>
                  <p className="text-sm text-gray-600">How this survey will appear to users</p>
                </div>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setPreviewSurvey(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Close preview"
                >
                  ×
                </button>
              </div>

              {/* Survey Preview Content */}
              <div className="p-6">
                {/* Survey Header */}
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{previewSurvey.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(previewSurvey.status)}`}>
                      {previewSurvey.status.toUpperCase()}
                    </span>
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                      {previewSurvey.category}
                    </span>
                  </div>
                  {previewSurvey.description && (
                    <p className="text-gray-600 text-lg leading-relaxed">{previewSurvey.description}</p>
                  )}
                  <div className="mt-4 text-sm text-gray-500 bg-gray-50 inline-block px-3 py-1 rounded-full">
                    {previewSurvey.fields.length} fields • Created: {previewSurvey.createdAt}
                  </div>
                </div>

                {/* Survey Form Preview */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <form className="space-y-6">
                    {previewSurvey.fields.map((field, index) => (
                      <div key={field.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          <span className="flex items-center gap-2">
                            <span className="text-green-600 font-semibold">#{index + 1}</span>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </span>
                        </label>
                        
                        {/* Render different field types */}
                        {field.type === 'text' && (
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            disabled
                          />
                        )}

                        {field.type === 'textarea' && (
                          <textarea
                            placeholder={field.placeholder}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                            disabled
                          />
                        )}

                        {field.type === 'email' && (
                          <input
                            type="email"
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            disabled
                          />
                        )}

                        {field.type === 'number' && (
                          <input
                            type="number"
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            disabled
                          />
                        )}

                        {field.type === 'date' && (
                          <input
                            type="date"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            disabled
                          />
                        )}

                        {field.type === 'select' && (
                          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200" disabled>
                            <option value="">Choose an option...</option>
                            {field.options.map((option, idx) => (
                              <option key={idx} value={option}>{option}</option>
                            ))}
                          </select>
                        )}

                        {field.type === 'radio' && (
                          <div className="space-y-3">
                            {field.options.map((option, idx) => (
                              <label key={idx} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                <input
                                  type="radio"
                                  name={`field_${field.id}`}
                                  value={option}
                                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                  disabled
                                />
                                <span className="text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {field.type === 'checkbox' && (
                          <div className="space-y-3">
                            {field.options.map((option, idx) => (
                              <label key={idx} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                <input
                                  type="checkbox"
                                  value={option}
                                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                  disabled
                                />
                                <span className="text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {field.type === 'file' && (
                          <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center bg-green-50 hover:bg-green-100 transition-colors duration-200">
                            <div className="text-green-600">
                              <span className="text-3xl">📎</span>
                              <p className="mt-2 font-medium">Click to upload or drag and drop</p>
                              <p className="text-sm text-green-500">File upload field</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {previewSurvey.fields.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No fields have been added to this survey yet.</p>
                      </div>
                    )}

                    {previewSurvey.fields.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          type="button"
                          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md flex items-center justify-center gap-2"
                          disabled
                        >
                          <span>📤</span>
                          Submit Survey
                        </button>
                        <button
                          type="button"
                          className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                          disabled
                        >
                          <span>💾</span>
                          Save Draft
                        </button>
                      </div>
                    )}
                  </form>
                </div>

                {/* Preview Actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      setPreviewSurvey(null);
                      editSurvey(previewSurvey);
                    }}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:shadow-lg"
                  >
                    <span>✏️</span>
                    Edit Survey
                  </button>
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      setPreviewSurvey(null);
                    }}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                  >
                    <span>❌</span>
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Survey;
