import React, { useState, useEffect } from 'react';
import { surveyFormsAPI } from './surveyFormsAPI';
import StatisticsModal from './StatisticsModal';
import ResponsesModal from './ResponsesModal.jsx';

function Survey() {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'create', 'edit'
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSurvey, setPreviewSurvey] = useState(null);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [statisticsSurvey, setStatisticsSurvey] = useState(null);
  const [showResponsesModal, setShowResponsesModal] = useState(false);
  const [responsesSurvey, setResponsesSurvey] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Form state for creating/editing surveys
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'DRAFT',
    category: 'general',
    fields: []
  });

  // Field type options
  const fieldTypes = [
    { value: 'TEXT', label: 'Text Input', icon: '📝' },
    { value: 'TEXTAREA', label: 'Text Area', icon: '📄' },
    { value: 'EMAIL', label: 'Email', icon: '📧' },
    { value: 'NUMBER', label: 'Number', icon: '🔢' },
    { value: 'DATE', label: 'Date', icon: '📅' },
    { value: 'SELECT', label: 'Dropdown', icon: '📋' },
    { value: 'RADIO', label: 'Radio Buttons', icon: '🔘' },
    { value: 'CHECKBOX', label: 'Checkboxes', icon: '☑️' },
    { value: 'FILE', label: 'File Upload', icon: '📎' }
  ];

  // Fetch surveys from backend
  const fetchSurveys = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: searchTerm,
        searchField: 'all',
        status: statusFilter,
        category: categoryFilter,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const response = await surveyFormsAPI.getAll(params);
      setSurveys(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching surveys:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchSurveys();
  }, [currentPage, searchTerm, statusFilter, categoryFilter]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter]);

  // Add new field to form
  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type: type,
      label: '',
      placeholder: '',
      required: false,
      options: type === 'SELECT' || type === 'RADIO' || type === 'CHECKBOX' ? [''] : null
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  // Remove field from form
  const removeField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  // Update field in form
  const updateField = (fieldId, updates) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  // Add option to field
  const addOption = (fieldId) => {
    updateField(fieldId, {
      options: [...(formData.fields.find(f => f.id === fieldId)?.options || []), '']
    });
  };

  // Remove option from field
  const removeOption = (fieldId, optionIndex) => {
    const field = formData.fields.find(f => f.id === fieldId);
    if (field && field.options) {
      const newOptions = field.options.filter((_, index) => index !== optionIndex);
      updateField(fieldId, { options: newOptions });
    }
  };

  // Update option value
  const updateOption = (fieldId, optionIndex, value) => {
    const field = formData.fields.find(f => f.id === fieldId);
    if (field && field.options) {
      const newOptions = field.options.map((option, index) =>
        index === optionIndex ? value : option
      );
      updateField(fieldId, { options: newOptions });
    }
  };

  // Submit form (create or update)
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Survey title is required');
      return;
    }

    if (formData.fields.length === 0) {
      setError('At least one field is required');
      return;
    }

    // Validate fields
    for (let field of formData.fields) {
      if (!field.label.trim()) {
        setError('All fields must have a label');
        return;
      }
      if ((field.type === 'SELECT' || field.type === 'RADIO' || field.type === 'CHECKBOX') && 
          (!field.options || field.options.filter(opt => opt.trim()).length === 0)) {
        setError(`Field "${field.label}" must have at least one option`);
        return;
      }
    }

    setSaving(true);
    setError(null);
    try {
      if (selectedSurvey) {
        // Update existing survey
        await surveyFormsAPI.update(selectedSurvey.id, formData);
      } else {
        // Create new survey
        await surveyFormsAPI.create(formData);
      }
      
      resetForm();
      setActiveTab('list');
      fetchSurveys(); // Refresh the list
    } catch (err) {
      setError(err.message);
      console.error('Error saving survey:', err);
    } finally {
      setSaving(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'DRAFT',
      category: 'general',
      fields: []
    });
    setSelectedSurvey(null);
    setError(null);
  };

  // Edit survey
  const editSurvey = (survey) => {
    setSelectedSurvey(survey);
    setFormData({
      title: survey.title,
      description: survey.description || '',
      status: survey.status,
      category: survey.category,
      fields: survey.fields.map(field => ({
        id: field.id,
        type: field.type,
        label: field.label,
        placeholder: field.placeholder || '',
        required: field.required,
        options: field.options || null
      }))
    });
    setActiveTab('create');
  };

  // Delete survey
  const deleteSurvey = async () => {
    if (!surveyToDelete) return;
    
    try {
      await surveyFormsAPI.delete(surveyToDelete.id);
      setShowDeleteModal(false);
      setSurveyToDelete(null);
      fetchSurveys(); // Refresh the list
    } catch (err) {
      setError(err.message);
      console.error('Error deleting survey:', err);
    }
  };

  // Download survey form
  const downloadSurveyForm = (survey) => {
    const dataStr = JSON.stringify(survey, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey-${survey.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'inactive': return 'bg-gray-200 text-gray-800 border border-gray-300';
      case 'archived': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Filter surveys based on search term and filters
  const uniqueStatuses = [...new Set(surveys.map(survey => survey.status.toLowerCase()))];
  const uniqueCategories = [...new Set(surveys.map(survey => survey.category))];

  // Open statistics modal
  const openStatistics = (survey) => {
    setStatisticsSurvey(survey);
    setShowStatisticsModal(true);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - Professional Seed Track Style */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl border-2 border-green-200 shadow-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700">
              Survey Forms Management
            </h1>
          </div>
          <p className="text-gray-500 text-base md:text-lg font-medium">
            Create and manage survey forms for data collection and feedback
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { resetForm(); setActiveTab('list'); }}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                activeTab === 'list' 
                  ? 'bg-green-600 text-white shadow-lg transform scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              <span className="text-xl">📋</span>
              <span>Survey Forms List</span>
            </button>
            <button
              onClick={() => { resetForm(); setActiveTab('create'); }}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                activeTab === 'create' 
                  ? 'bg-green-600 text-white shadow-lg transform scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              <span className="text-xl">✨</span>
              <span>Create Survey Form</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Survey List */}
        {activeTab === 'list' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">All Survey Forms</h2>
                <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full border">
                  {totalItems} survey forms
                </div>
              </div>

              {/* Search and Filters */}
              <div className="mb-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Search</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="Search by title, description..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    >
                      <option value="all">All Status</option>
                      {uniqueStatuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    >
                      <option value="all">All Categories</option>
                      {uniqueCategories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                  <span className="ml-4 text-gray-600 font-medium">Loading surveys...</span>
                </div>
              )}

              {/* Survey List Content */}
              {!loading && (
                <div>
                  {surveys.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                      <div className="text-gray-300 text-6xl mb-4">📝</div>
                      <h3 className="text-xl font-medium text-gray-500 mb-2">No survey forms found</h3>
                      <p className="text-gray-400">
                        {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                          ? 'Try adjusting your search criteria' 
                          : 'Create your first survey form to get started'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {surveys.map((survey) => (
                        <div key={survey.id} className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:border-green-200">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-4 mb-4">
                                <h3 className="text-2xl font-bold text-gray-900">{survey.title}</h3>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(survey.status)}`}>
                                  {survey.status.toUpperCase()}
                                </span>
                                <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
                                  {survey.category}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-6 leading-relaxed text-lg">{survey.description}</p>
                              <div className="flex flex-wrap gap-8 text-sm text-gray-500">
                                <span className="flex items-center gap-2">
                                  <span className="text-green-600 text-lg">📝</span>
                                  <span className="font-medium">{survey.fieldsCount || 0} fields</span>
                                </span>
                                <span className="flex items-center gap-2">
                                  <span className="text-blue-600 text-lg">📊</span>
                                  <span className="font-medium">{survey.responsesCount || 0} responses</span>
                                </span>
                                <span className="flex items-center gap-2">
                                  <span className="text-gray-600 text-lg">📅</span>
                                  <span className="font-medium">Created: {new Date(survey.createdAt).toLocaleDateString()}</span>
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 lg:flex-col lg:min-w-fit">
                              <button
                                onClick={() => {
                                  setPreviewSurvey(survey);
                                  setShowPreviewModal(true);
                                }}
                                className="bg-gray-100 text-gray-700 px-4 py-3 rounded-xl text-sm hover:bg-gray-200 transition-all duration-200 font-semibold flex items-center gap-2 hover:shadow-md"
                              >
                                <span>👁️</span>
                                Preview
                              </button>
                              <button
                                onClick={() => openStatistics(survey)}
                                className="bg-blue-600 text-white px-4 py-3 rounded-xl text-sm hover:bg-blue-700 transition-all duration-200 font-semibold flex items-center gap-2 hover:shadow-md"
                              >
                                <span>📊</span>
                                Statistics
                              </button>
                              <button
                                onClick={() => { setResponsesSurvey(survey); setShowResponsesModal(true); }}
                                className="bg-indigo-600 text-white px-4 py-3 rounded-xl text-sm hover:bg-indigo-700 transition-all duration-200 font-semibold flex items-center gap-2 hover:shadow-md"
                              >
                                <span>🧾</span>
                                Responses
                              </button>
                              <button
                                onClick={() => downloadSurveyForm(survey)}
                                className="bg-purple-600 text-white px-4 py-3 rounded-xl text-sm hover:bg-purple-700 transition-all duration-200 font-semibold flex items-center gap-2 hover:shadow-md"
                              >
                                <span>📥</span>
                                Download
                              </button>
                              <button
                                onClick={() => editSurvey(survey)}
                                className="bg-green-600 text-white px-4 py-3 rounded-xl text-sm hover:bg-green-700 transition-all duration-200 font-semibold flex items-center gap-2 hover:shadow-md"
                              >
                                <span>✏️</span>
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setSurveyToDelete(survey);
                                  setShowDeleteModal(true);
                                }}
                                className="bg-red-600 text-white px-4 py-3 rounded-xl text-sm hover:bg-red-700 transition-all duration-200 font-semibold flex items-center gap-2 hover:shadow-md"
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      >
                        Previous
                      </button>
                      
                      <div className="flex gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-4 py-3 text-sm rounded-xl transition-all duration-200 font-semibold ${
                                currentPage === pageNum
                                  ? 'bg-green-600 text-white shadow-lg'
                                  : 'border-2 border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create/Edit Survey */}
        {activeTab === 'create' && (
          <div className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedSurvey ? 'Edit Survey Form' : 'Create New Survey Form'}
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold flex items-center gap-3 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{saving ? '💾' : '✅'}</span>
                    {saving ? 'Saving...' : (selectedSurvey ? 'Update Survey' : 'Create Survey')}
                  </button>
                  <button
                    onClick={() => setActiveTab('list')}
                    className="bg-gray-600 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold flex items-center gap-3"
                  >
                    <span>↩️</span>
                    Back to List
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b-2 border-gray-200 pb-3">Basic Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Survey Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter survey form title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    >
                      <option value="general">General</option>
                      <option value="feedback">Feedback</option>
                      <option value="equipment">Equipment</option>
                      <option value="seminar">Seminar</option>
                      <option value="agriculture">Agriculture</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                      placeholder="Enter survey form description"
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-3">Form Fields</h3>
                  <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full border-2 border-gray-200">
                    {formData.fields.length} fields
                  </div>
                </div>

                {/* Fields List */}
                {formData.fields.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <div className="text-gray-300 text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-medium text-gray-500 mb-2">No fields added yet</h3>
                    <p className="text-gray-400">Use the sidebar to add fields to your survey</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {formData.fields.map((field, index) => (
                      <div key={field.id} className="border-2 border-gray-200 rounded-xl p-8 bg-white shadow-sm hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              #{index + 1}
                            </span>
                            <span className="text-2xl">
                              {fieldTypes.find(type => type.value === field.type)?.icon || '📝'}
                            </span>
                            <span className="text-lg font-semibold text-gray-700">
                              {fieldTypes.find(type => type.value === field.type)?.label || field.type}
                            </span>
                          </div>
                          <button
                            onClick={() => removeField(field.id)}
                            className="text-red-600 hover:text-red-700 p-3 hover:bg-red-50 rounded-xl transition-all duration-200"
                            title="Remove field"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Label *</label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                              placeholder="Enter field label"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Placeholder</label>
                            <input
                              type="text"
                              value={field.placeholder}
                              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                              placeholder="Enter placeholder text"
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-5 h-5"
                            />
                            <span className="text-sm font-semibold text-gray-700">Required field</span>
                          </label>
                        </div>

                        {/* Options for select, radio, checkbox fields */}
                        {(field.type === 'SELECT' || field.type === 'RADIO' || field.type === 'CHECKBOX') && (
                          <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                              <label className="block text-sm font-semibold text-gray-700">Options</label>
                              <button
                                onClick={() => addOption(field.id)}
                                className="text-green-600 hover:text-green-700 text-sm font-semibold hover:bg-green-50 px-3 py-1 rounded-lg transition-all duration-200"
                              >
                                + Add Option
                              </button>
                            </div>
                            <div className="space-y-3">
                              {field.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-3">
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                  {field.options.length > 1 && (
                                    <button
                                      onClick={() => removeOption(field.id, optionIndex)}
                                      className="text-red-600 hover:text-red-700 p-3 hover:bg-red-50 rounded-xl transition-all duration-200"
                                    >
                                      ×
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
            </div>

            {/* Sidebar */}
            <div className="w-full xl:w-80">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-4">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Field Types</h3>
                <div className="space-y-4">
                  {fieldTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => addField(type.value)}
                      className="w-full text-left p-6 border-2 border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                          {type.icon}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-500">
                            {type.value === 'TEXT' && 'Single line text input'}
                            {type.value === 'TEXTAREA' && 'Multi-line text input'}
                            {type.value === 'EMAIL' && 'Email address input'}
                            {type.value === 'NUMBER' && 'Number input field'}
                            {type.value === 'DATE' && 'Date picker field'}
                            {type.value === 'SELECT' && 'Dropdown selection'}
                            {type.value === 'RADIO' && 'Single choice option'}
                            {type.value === 'CHECKBOX' && 'Multiple choice option'}
                            {type.value === 'FILE' && 'File upload field'}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-green-50 rounded-xl border-2 border-green-200">
                  <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <span>💡</span>
                    Pro Tips
                  </h4>
                  <ul className="text-sm text-green-700 space-y-3">
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
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span>⚠️</span>
                Delete Survey Form
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Are you sure you want to delete "<strong>{surveyToDelete?.title}</strong>"? 
                This action cannot be undone.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSurveyToDelete(null);
                  }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteSurvey}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreviewModal && previewSurvey && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b-2 border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span>👁️</span>
                    Preview - {previewSurvey.title}
                  </h3>
                  <p className="text-gray-600">How this survey will appear to users</p>
                </div>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setPreviewSurvey(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-3xl p-3 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  title="Close preview"
                >
                  ×
                </button>
              </div>

              {/* Survey Form Preview Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Survey Header */}
                <div className="mb-10">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{previewSurvey.title}</h1>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(previewSurvey.status)}`}>
                      {previewSurvey.status.toUpperCase()}
                    </span>
                    <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border-2 border-green-200">
                      {previewSurvey.category}
                    </span>
                  </div>
                  {previewSurvey.description && (
                    <p className="text-gray-600 text-xl leading-relaxed">{previewSurvey.description}</p>
                  )}
                  <div className="mt-6 text-sm text-gray-500 bg-gray-50 inline-block px-4 py-2 rounded-full">
                    {previewSurvey.fields?.length || 0} fields • Created: {new Date(previewSurvey.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Survey Form Preview */}
                <div className="bg-gray-50 rounded-2xl p-8">
                  <form className="space-y-8">
                    {previewSurvey.fields?.map((field, index) => (
                      <div key={field.id} className="bg-white rounded-xl p-8 border-2 border-gray-200 shadow-sm">
                        <label className="block text-lg font-semibold text-gray-700 mb-4">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {field.type === 'TEXT' && (
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            disabled
                          />
                        )}

                        {field.type === 'TEXTAREA' && (
                          <textarea
                            placeholder={field.placeholder}
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                            disabled
                          />
                        )}

                        {field.type === 'EMAIL' && (
                          <input
                            type="email"
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            disabled
                          />
                        )}

                        {field.type === 'NUMBER' && (
                          <input
                            type="number"
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            disabled
                          />
                        )}

                        {field.type === 'DATE' && (
                          <input
                            type="date"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            disabled
                          />
                        )}

                        {field.type === 'SELECT' && (
                          <select
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            disabled
                          >
                            <option value="">Choose an option...</option>
                            {field.options?.map((option, optionIndex) => (
                              <option key={optionIndex} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}

                        {field.type === 'RADIO' && (
                          <div className="space-y-4">
                            {field.options?.map((option, optionIndex) => (
                              <label key={optionIndex} className="flex items-center gap-4 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`field-${field.id}`}
                                  value={option}
                                  className="h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
                                  disabled
                                />
                                <span className="text-gray-700 text-lg">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {field.type === 'CHECKBOX' && (
                          <div className="space-y-4">
                            {field.options?.map((option, optionIndex) => (
                              <label key={optionIndex} className="flex items-center gap-4 cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={option}
                                  className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                  disabled
                                />
                                <span className="text-gray-700 text-lg">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {field.type === 'FILE' && (
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                            <div className="text-gray-400 mb-3 text-2xl">📎</div>
                            <p className="text-gray-500">Click to upload or drag and drop</p>
                          </div>
                        )}
                      </div>
                    ))}

                    {previewSurvey.fields?.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-medium">No fields in this survey</h3>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Preview Actions */}
              <div className="flex gap-4 p-8 border-t-2 border-gray-200">
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setPreviewSurvey(null);
                    editSurvey(previewSurvey);
                  }}
                  className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold flex items-center gap-3"
                >
                  <span>✏️</span>
                  Edit Survey
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setPreviewSurvey(null);
                  }}
                  className="bg-gray-600 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Modal */}
        <StatisticsModal
          survey={statisticsSurvey}
          isOpen={showStatisticsModal}
          onClose={() => {
            setShowStatisticsModal(false);
            setStatisticsSurvey(null);
          }}
        />
        <ResponsesModal
          survey={responsesSurvey}
          isOpen={showResponsesModal}
          onClose={() => { setShowResponsesModal(false); setResponsesSurvey(null); }}
        />
      </div>
    </div>
  );
}

export default Survey;