import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { surveyFormsAPI } from './surveyFormsAPI';
import StatisticsModal from './StatisticsModal';
import ResponsesModal from './ResponsesModal';

function Survey() {
  const { theme, isDark } = useTheme();
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
       <div className={`min-h-screen p-4 mt-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header - Professional Seed Track Style */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`flex items-center justify-center w-16 h-16 rounded-2xl border-2 shadow-lg ${
              isDark ? 'bg-green-900 border-green-700' : 'bg-green-100 border-green-200'
            }`}>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              Survey Forms Management
            </h1>
          </div>
          <p className={`text-base md:text-lg font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Create and manage survey forms for data collection and feedback
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className={`rounded-xl shadow-lg p-4 mb-6 max-w-5xl mx-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { resetForm(); setActiveTab('list'); }}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'list' 
                  ? 'bg-green-600 text-white shadow-md transform scale-105' 
                  : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} hover:shadow-md`
              }`}
            >
              <span className="text-lg">📋</span>
              <span>Survey Forms List</span>
            </button>
            <button
              onClick={() => { resetForm(); setActiveTab('create'); }}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'create' 
                  ? 'bg-green-600 text-white shadow-md transform scale-105' 
                  : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} hover:shadow-md`
              }`}
            >
              <span className="text-lg">✨</span>
              <span>Create Survey Form</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`border rounded-lg p-4 mb-6 max-w-5xl mx-auto ${
            isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-red-600">⚠️</span>
              <span className={`font-medium ${isDark ? 'text-red-400' : 'text-red-800'}`}>Error</span>
            </div>
            <p className={`mt-1 ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
          </div>
        )}

        {/* Survey List */}
        {activeTab === 'list' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`rounded-xl p-4 shadow-lg border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Forms</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{totalItems}</p>
                  </div>
                  <div className="text-2xl">📋</div>
                </div>
              </div>
              <div className={`rounded-xl p-4 shadow-lg border border-green-200 ${
                isDark ? 'bg-gray-800 border-green-700' : 'bg-white border-green-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Active Forms</p>
                    <p className="text-2xl font-bold text-green-700">
                      {surveys.filter(s => s.status.toLowerCase() === 'active').length}
                    </p>
                  </div>
                  <div className="text-2xl">✅</div>
                </div>
              </div>
              <div className={`rounded-xl p-4 shadow-lg border ${
                isDark ? 'bg-gray-800 border-blue-700' : 'bg-white border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Responses</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {surveys.reduce((sum, s) => sum + (s.responsesCount || 0), 0)}
                    </p>
                  </div>
                  <div className="text-2xl">📊</div>
                </div>
              </div>
              <div className={`rounded-xl p-4 shadow-lg border ${
                isDark ? 'bg-gray-800 border-purple-700' : 'bg-white border-purple-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Draft Forms</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {surveys.filter(s => s.status.toLowerCase() === 'draft').length}
                    </p>
                  </div>
                  <div className="text-2xl">📝</div>
                </div>
              </div>
            </div>

            <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>All Survey Forms</h2>
                <div className={`text-sm px-3 py-1 rounded-full border self-start lg:self-center ${
                  isDark ? 'text-gray-400 bg-gray-700 border-gray-600' : 'text-gray-500 bg-gray-50 border-gray-200'
                }`}>
                  Showing {surveys.length} of {totalItems} forms
                </div>
              </div>
              {/* Pagination below All Survey Forms header */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mb-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
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
                          className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-green-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
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
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Search by title, description, or category..."
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="min-w-[150px]">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">All Status</option>
                    {uniqueStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-[150px]">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
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
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className={`ml-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading surveys...</span>
              </div>
            )}

            {/* Survey List Content */}
            {!loading && (
              <div>
                {surveys.length === 0 ? (
                  <div className={`text-center py-12 border-2 border-dashed rounded-lg ${
                    isDark ? 'border-gray-600 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="text-gray-300 text-4xl mb-3">📝</div>
                    <p className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No survey forms found</p>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                        ? 'Try adjusting your search criteria' 
                        : 'Create your first survey form to get started'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {surveys.map((survey) => (
                      <div key={survey.id} className={`border rounded-xl p-6 hover:shadow-lg transition-all duration-200 ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 hover:border-green-500' 
                          : 'bg-white border-gray-200 hover:border-green-200'
                      }`}>
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{survey.title}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(survey.status)}`}>
                                {survey.status.toUpperCase()}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                isDark 
                                  ? 'bg-green-900 text-green-300 border-green-700' 
                                  : 'bg-green-50 text-green-700 border-green-200'
                              }`}>
                                {survey.category}
                              </span>
                            </div>
                            <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{survey.description}</p>
                            <div className={`flex flex-wrap gap-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span className="flex items-center gap-1">
                                <span className="text-green-600">📝</span>
                                {survey.fieldsCount || 0} fields
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-blue-600">📊</span>
                                {survey.responsesCount || 0} responses
                              </span>
                              <span className="flex items-center gap-1">
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>📅</span>
                                Created: {new Date(survey.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          {/* Action Menu */}
                          <div className="flex items-start">
                            <div className="relative group">
                              <button className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 ${
                                isDark 
                                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}>
                                <span>⚙️</span>
                                Actions
                                <span className="text-xs">▼</span>
                              </button>
                              
                              {/* Dropdown Menu */}
                              <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 transform scale-95 group-hover:scale-100 ${
                                isDark 
                                  ? 'bg-gray-800 border-gray-600' 
                                  : 'bg-white border-gray-200'
                              }`}>
                                <div className="p-2">
                                  <button
                                    onClick={() => {
                                      setPreviewSurvey(survey);
                                      setShowPreviewModal(true);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                      isDark 
                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    <span>👁️</span>
                                    Preview Form
                                  </button>
                                  <button
                                    onClick={() => openStatistics(survey)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                      isDark 
                                        ? 'text-gray-300 hover:bg-blue-900/50 hover:text-blue-300' 
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                    }`}
                                  >
                                    <span>📊</span>
                                    View Statistics
                                  </button>
                                  <button
                                    onClick={() => { setResponsesSurvey(survey); setShowResponsesModal(true); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                      isDark 
                                        ? 'text-gray-300 hover:bg-indigo-900/50 hover:text-indigo-300' 
                                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                                    }`}
                                  >
                                    <span>🧾</span>
                                    Responses
                                  </button>
                                  <button
                                    onClick={() => editSurvey(survey)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                      isDark 
                                        ? 'text-gray-300 hover:bg-green-900/50 hover:text-green-300' 
                                        : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                                    }`}
                                  >
                                    <span>✏️</span>
                                    Edit Form
                                  </button>
                                  <button
                                    onClick={() => downloadSurveyForm(survey)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                      isDark 
                                        ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                    }`}
                                  >
                                    <span>📥</span>
                                    Download JSON
                                  </button>
                                  <div className={`border-t my-1 ${isDark ? 'border-gray-600' : 'border-gray-100'}`}></div>
                                  <button
                                    onClick={() => {
                                      setSurveyToDelete(survey);
                                      setShowDeleteModal(true);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                      isDark 
                                        ? 'text-red-400 hover:bg-red-900/50 hover:text-red-300' 
                                        : 'text-red-600 hover:bg-red-50'
                                    }`}
                                  >
                                    <span>🗑️</span>
                                    Delete Form
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
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
                            className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              currentPage === pageNum
                                ? 'bg-green-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
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
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
            </div>

            {/* Floating Action Button for Creating New Survey */}
            <button
              onClick={() => { resetForm(); setActiveTab('create'); }}
              className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 group"
              title="Create New Survey"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">➕</span>
            </button>
          </div>
        )}

        {/* Create/Edit Survey */}
        {activeTab === 'create' && (
          <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className={`flex-1 rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {selectedSurvey ? 'Edit Survey Form' : 'Create New Survey Form'}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium flex items-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{saving ? '💾' : '✅'}</span>
                    {saving ? 'Saving...' : (selectedSurvey ? 'Update Survey' : 'Create Survey')}
                  </button>
                  <button
                    onClick={() => setActiveTab('list')}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium flex items-center gap-2"
                  >
                    <span>↩️</span>
                    Back to List
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="mb-8">
                <h3 className={`text-lg font-medium mb-4 border-b pb-2 ${
                  isDark ? 'text-white border-gray-600' : 'text-gray-900 border-gray-200'
                }`}>Basic Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Survey Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter survey form title"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="general">General</option>
                      <option value="feedback">Feedback</option>
                      <option value="equipment">Equipment</option>
                      <option value="seminar">Seminar</option>
                      <option value="agriculture">Agriculture</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                  <div className="lg:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter survey form description"
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-medium border-b pb-2 ${
                    isDark ? 'text-white border-gray-600' : 'text-gray-900 border-gray-200'
                  }`}>Form Fields</h3>
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
                  <div className="space-y-4">
                    {formData.fields.map((field, index) => (
                      <div key={field.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              #{index + 1}
                            </span>
                            <span className="text-lg">
                              {fieldTypes.find(type => type.value === field.type)?.icon || '📝'}
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {fieldTypes.find(type => type.value === field.type)?.label || field.type}
                            </span>
                            {field.required && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Required</span>
                            )}
                          </div>
                          <button
                            onClick={() => removeField(field.id)}
                            className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Remove field"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Label *</label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                              placeholder="Enter field label"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Placeholder</label>
                            <input
                              type="text"
                              value={field.placeholder}
                              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                              placeholder="Enter placeholder text"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Required field</span>
                          </label>
                        </div>

                        {/* Options for select, radio, checkbox fields */}
                        {(field.type === 'SELECT' || field.type === 'RADIO' || field.type === 'CHECKBOX') && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-xs font-medium text-gray-600">Options</label>
                              <button
                                onClick={() => addOption(field.id)}
                                className="text-green-600 hover:text-green-700 text-xs font-medium px-2 py-1 hover:bg-green-50 rounded transition-all duration-200"
                              >
                                + Add Option
                              </button>
                            </div>
                            <div className="space-y-2">
                              {field.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                  {field.options.length > 1 && (
                                    <button
                                      onClick={() => removeOption(field.id, optionIndex)}
                                      className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-all duration-200"
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
              <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Add Field Types</h3>
                <div className="grid grid-cols-2 xl:grid-cols-1 gap-2">
                  {fieldTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => addField(type.value)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                          {type.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 text-sm truncate">{type.label}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {type.value === 'TEXT' && 'Single line text'}
                            {type.value === 'TEXTAREA' && 'Multi-line text'}
                            {type.value === 'EMAIL' && 'Email address'}
                            {type.value === 'NUMBER' && 'Number input'}
                            {type.value === 'DATE' && 'Date picker'}
                            {type.value === 'SELECT' && 'Dropdown menu'}
                            {type.value === 'RADIO' && 'Single choice'}
                            {type.value === 'CHECKBOX' && 'Multiple choice'}
                            {type.value === 'FILE' && 'File upload'}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center gap-1 text-sm">
                    <span>💡</span>
                    Quick Tips
                  </h4>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Drag to reorder fields</li>
                    <li>• Use required fields sparingly</li>
                    <li>• Group related questions</li>
                    <li>• Test before publishing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>⚠️</span>
                Delete Survey Form
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "<strong>{surveyToDelete?.title}</strong>"? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSurveyToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteSurvey}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreviewModal && previewSurvey && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4" onClick={() => { setShowPreviewModal(false); setPreviewSurvey(null); }}>
            <div className="bg-white rounded-xl max-w-6xl w-full h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between rounded-3xl p-3 sm:p-6 border-b border-gray-200 bg-green-50 flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                      Survey Preview
                    </h3>
                    <p className="text-sm text-gray-600 truncate" title={previewSurvey.title}>
                      {previewSurvey.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setPreviewSurvey(null);
                  }}
                  className="flex-shrink-0 ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-lg transition-colors"
                  title="Close preview"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Survey Form Preview Content */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 min-h-0 bg-gray-50">
                {/* Survey Header */}
                <div className="mb-6 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{previewSurvey.title}</h1>
                      </div>
                      {previewSurvey.description && (
                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">{previewSurvey.description}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(previewSurvey.status)}`}>
                        {previewSurvey.status.toUpperCase()}
                      </span>
                      <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium border border-green-200">
                        {previewSurvey.category}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {previewSurvey.fields?.length || 0} fields
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8h0m-8 0h16a2 2 0 002-2V9a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Created: {new Date(previewSurvey.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Survey Form Fields */}
                <div className="space-y-4 sm:space-y-6">
                  {previewSurvey.fields?.map((field, index) => (
                    <div key={field.id} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                              {fieldTypes.find(ft => ft.value === field.type)?.label || field.type}
                            </span>
                            {field.placeholder && (
                              <span className="text-gray-400">• Placeholder: "{field.placeholder}"</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Field Inputs */}
                      {field.type === 'TEXT' && (
                        <input
                          type="text"
                          placeholder={field.placeholder || "Enter text..."}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      )}

                      {field.type === 'TEXTAREA' && (
                        <textarea
                          placeholder={field.placeholder || "Enter your response..."}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none bg-gray-50"
                          disabled
                        />
                      )}

                      {field.type === 'EMAIL' && (
                        <input
                          type="email"
                          placeholder={field.placeholder || "Enter email address..."}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      )}

                      {field.type === 'NUMBER' && (
                        <input
                          type="number"
                          placeholder={field.placeholder || "Enter number..."}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      )}

                      {field.type === 'DATE' && (
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      )}

                      {field.type === 'SELECT' && (
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        >
                          <option value="">{field.placeholder || "Choose an option..."}</option>
                          {field.options?.map((option, optionIndex) => (
                            <option key={optionIndex} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.type === 'RADIO' && (
                        <div className="space-y-3">
                          {field.options?.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <input
                                type="radio"
                                name={`field-${field.id}`}
                                value={option}
                                className="h-4 w-4 text-green-600 border-gray-300"
                                disabled
                              />
                              <span className="text-gray-700 font-medium">{option}</span>
                            </label>
                          ))}
                          {(!field.options || field.options.length === 0) && (
                            <div className="text-gray-400 italic text-sm p-3 bg-gray-50 rounded-lg border border-gray-200">
                              No options configured
                            </div>
                          )}
                        </div>
                      )}

                      {field.type === 'CHECKBOX' && (
                        <div className="space-y-3">
                          {field.options?.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <input
                                type="checkbox"
                                value={option}
                                className="h-4 w-4 text-green-600 border-gray-300 rounded"
                                disabled
                              />
                              <span className="text-gray-700 font-medium">{option}</span>
                            </label>
                          ))}
                          {(!field.options || field.options.length === 0) && (
                            <div className="text-gray-400 italic text-sm p-3 bg-gray-50 rounded-lg border border-gray-200">
                              No options configured
                            </div>
                          )}
                        </div>
                      )}

                      {field.type === 'FILE' && (
                        <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-green-50">
                          <div className="text-green-500 mb-3">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400 mt-1">Files will be uploaded here</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {previewSurvey.fields?.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No fields in this survey</h3>
                      <p className="text-gray-500">Add some fields to see the preview</p>
                    </div>
                  )}

                  {/* Demo Submit Button */}
                  {previewSurvey.fields?.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <button
                        type="button"
                        disabled
                        className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      >
                        Submit Survey (Preview Mode)
                      </button>
                      <p className="text-xs text-gray-500 text-center mt-2">This is a preview - submissions are disabled</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Actions */}
              <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setPreviewSurvey(null);
                    editSurvey(previewSurvey);
                  }}
                  className="flex-1 sm:flex-initial bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Survey
                </button>
                <button
                  onClick={() => downloadSurveyForm(previewSurvey)}
                  className="flex-1 sm:flex-initial bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setPreviewSurvey(null);
                  }}
                  className="flex-1 sm:flex-initial bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 border border-gray-300 transition-all duration-200 font-semibold"
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
          onClose={() => {
            setShowResponsesModal(false);
            setResponsesSurvey(null);
          }}
        />
      </div>
    </div>
  );
}

export default Survey;
