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
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 py-8 sm:mt-20 px-2 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Survey Management</h1>
              <p className="text-gray-600">Create and manage survey forms for various purposes</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => { resetForm(); setActiveTab('list'); }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📋 Survey List
              </button>
              <button
                onClick={() => { resetForm(); setActiveTab('create'); }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'create' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ✨ Create Survey
              </button>
            </div>
          </div>
        </div>

        {/* Survey List */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">All Surveys</h2>
              <div className="text-sm text-gray-500">
                Total: {surveys.length} surveys
              </div>
            </div>

            {surveys.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No surveys yet</h3>
                <p className="text-gray-600 mb-4">Create your first survey to get started</p>
                <button
                  onClick={() => { resetForm(); setActiveTab('create'); }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Survey
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {surveys.map((survey) => (
                  <div key={survey.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{survey.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(survey.status)}`}>
                            {survey.status}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {survey.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{survey.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>📝 {survey.fields.length} fields</span>
                          <span>� Created: {survey.createdAt}</span>
                          <span>� Updated: {survey.updatedAt}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            setPreviewSurvey(survey);
                            setShowPreviewModal(true);
                          }}
                          className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                        >
                          👁️ Preview
                        </button>
                        <button
                          onClick={() => editSurvey(survey)}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => {
                            setSurveyToDelete(survey);
                            setShowDeleteModal(true);
                          }}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                          🗑️ Delete
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
          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedSurvey ? 'Edit Survey' : 'Create New Survey'}
                </h2>
                <button
                  onClick={() => setActiveTab('list')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  ← Back to List
                </button>
              </div>

              {/* Basic Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Survey Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter survey title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="feedback">Feedback</option>
                      <option value="equipment">Equipment</option>
                      <option value="seminar">Seminar</option>
                      <option value="agriculture">Agriculture</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter survey description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Form Fields</h3>
                  <div className="text-sm text-gray-600">{formData.fields.length} fields</div>
                </div>

                {/* Fields List */}
                {formData.fields.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No fields added yet. Use the sidebar to add fields.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.fields.map((field, index) => (
                      <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                              {fieldTypes.find(t => t.value === field.type)?.label}
                            </span>
                          </div>
                          <button
                            onClick={() => removeField(field.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            🗑️ Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Field Label *</label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter field label"
                            />
                          </div>
                          {(field.type === 'text' || field.type === 'textarea' || field.type === 'email' || field.type === 'number') && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                              <input
                                type="text"
                                value={field.placeholder || ''}
                                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter placeholder text"
                              />
                            </div>
                          )}
                        </div>

                        <div className="mt-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Required field</span>
                          </label>
                        </div>

                        {/* Options for select, radio, checkbox */}
                        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-medium text-gray-700">Options</label>
                              <button
                                onClick={() => addOption(field.id)}
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                              >
                                + Add Option
                              </button>
                            </div>
                            <div className="space-y-2">
                              {field.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                                    className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                  {field.options.length > 1 && (
                                    <button
                                      onClick={() => removeOption(field.id, optionIndex)}
                                      className="text-red-600 hover:text-red-800 text-sm"
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
              <div className="flex gap-4">
                <button
                  onClick={saveSurvey}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {selectedSurvey ? '💾 Update Survey' : '✨ Create Survey'}
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab('list');
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Sidebar for Field Types */}
            <div className="w-80 bg-white rounded-lg shadow-lg p-6 h-fit sticky top-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Add Field Types</h3>
              <p className="text-sm text-gray-600 mb-4">Click on a field type to add it to your survey</p>
              
              <div className="space-y-2">
                {fieldTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => addField(type.value)}
                    className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                  >
                    <span className="text-lg">{type.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800">{type.label}</div>
                      <div className="text-xs text-gray-500">
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
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">💡 Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Add fields in logical order</li>
                  <li>• Use required fields sparingly</li>
                  <li>• Group related questions together</li>
                  <li>• Test your form before publishing</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "<strong>{surveyToDelete?.title}</strong>"? 
                This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => deleteSurvey(surveyToDelete?.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSurveyToDelete(null);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Survey Preview Modal */}
        {showPreviewModal && previewSurvey && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Survey Preview</h3>
                  <p className="text-sm text-gray-600">How this survey will appear to users</p>
                </div>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setPreviewSurvey(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Survey Preview Content */}
              <div className="p-6">
                {/* Survey Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">{previewSurvey.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(previewSurvey.status)}`}>
                      {previewSurvey.status}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {previewSurvey.category}
                    </span>
                  </div>
                  {previewSurvey.description && (
                    <p className="text-gray-600 text-lg">{previewSurvey.description}</p>
                  )}
                  <div className="mt-4 text-sm text-gray-500">
                    Fields: {previewSurvey.fields.length} • Created: {previewSurvey.createdAt}
                  </div>
                </div>

                {/* Survey Form Preview */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <form className="space-y-6">
                    {previewSurvey.fields.map((field, index) => (
                      <div key={field.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        
                        {/* Render different field types */}
                        {field.type === 'text' && (
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled
                          />
                        )}

                        {field.type === 'textarea' && (
                          <textarea
                            placeholder={field.placeholder}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled
                          />
                        )}

                        {field.type === 'email' && (
                          <input
                            type="email"
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled
                          />
                        )}

                        {field.type === 'number' && (
                          <input
                            type="number"
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled
                          />
                        )}

                        {field.type === 'date' && (
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled
                          />
                        )}

                        {field.type === 'select' && (
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled>
                            <option value="">Choose an option...</option>
                            {field.options.map((option, idx) => (
                              <option key={idx} value={option}>{option}</option>
                            ))}
                          </select>
                        )}

                        {field.type === 'radio' && (
                          <div className="space-y-2">
                            {field.options.map((option, idx) => (
                              <label key={idx} className="flex items-center">
                                <input
                                  type="radio"
                                  name={`field_${field.id}`}
                                  value={option}
                                  className="mr-2"
                                  disabled
                                />
                                <span className="text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {field.type === 'checkbox' && (
                          <div className="space-y-2">
                            {field.options.map((option, idx) => (
                              <label key={idx} className="flex items-center">
                                <input
                                  type="checkbox"
                                  value={option}
                                  className="mr-2"
                                  disabled
                                />
                                <span className="text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {field.type === 'file' && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <div className="text-gray-500">
                              <span className="text-2xl">📎</span>
                              <p className="mt-2">Click to upload or drag and drop</p>
                              <p className="text-sm">File upload field</p>
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
                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          disabled
                        >
                          Submit Survey
                        </button>
                        <button
                          type="button"
                          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                          disabled
                        >
                          Save Draft
                        </button>
                      </div>
                    )}
                  </form>
                </div>

                {/* Preview Actions */}
                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      setPreviewSurvey(null);
                      editSurvey(previewSurvey);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ✏️ Edit Survey
                  </button>
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      setPreviewSurvey(null);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
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
