import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { surveyFormsAPI } from './surveyFormsAPI';
import StatisticsModal from './StatisticsModal';
import ResponsesModal from './ResponsesModal';
import { faqService } from '../Customer_Service/services/faqService';
import { Plus, Edit, Trash2 } from 'lucide-react';

function Survey() {
  const { theme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'create', 'edit', 'faq'
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

  // FAQ state
  const [faqs, setFaqs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqFormData, setFaqFormData] = useState({
    question: '',
    answer: '',
    categoryId: '',
    isActive: true
  });

  // FAQ pagination and filtering states
  const [faqCurrentPage, setFaqCurrentPage] = useState(1);
  const [faqItemsPerPage] = useState(10);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('');
  const [faqStatusFilter, setFaqStatusFilter] = useState('');
  const [categoryPanelCollapsed, setCategoryPanelCollapsed] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  // Category state
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    isActive: true
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
        options: Array.isArray(field.options)
          ? field.options
          : (typeof field.options === 'string'
              ? (() => { try { const p = JSON.parse(field.options); return Array.isArray(p) ? p : null; } catch { return null; } })()
              : null)
      }))
    });
    setActiveTab('create');
  };

  // Delete survey
  const deleteSurvey = async () => {
    if (!surveyToDelete) return;
    // Client-side guard: prevent delete if there are existing responses
    if (typeof surveyToDelete.responsesCount === 'number' && surveyToDelete.responsesCount > 0) {
      setError('Cannot delete a survey form that has existing responses. Please archive it instead.');
      setShowDeleteModal(false);
      setSurveyToDelete(null);
      return;
    }
    
    try {
      await surveyFormsAPI.delete(surveyToDelete.id);
      setShowDeleteModal(false);
      setSurveyToDelete(null);
      fetchSurveys(); // Refresh the list
    } catch (err) {
      // Surface server-provided error message if available
      setError(err?.message || 'Failed to delete survey form');
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
      case 'active': 
        return isDark 
          ? 'bg-green-900/50 text-green-300 border border-green-700' 
          : 'bg-green-100 text-green-800 border border-green-200';
      case 'draft': 
        return isDark 
          ? 'bg-gray-700 text-gray-300 border border-gray-600' 
          : 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'inactive': 
        return isDark 
          ? 'bg-gray-600 text-gray-300 border border-gray-500' 
          : 'bg-gray-200 text-gray-800 border border-gray-300';
      case 'archived': 
        return isDark 
          ? 'bg-red-900/50 text-red-300 border border-red-700' 
          : 'bg-red-100 text-red-800 border border-red-200';
      default: 
        return isDark 
          ? 'bg-gray-700 text-gray-300 border border-gray-600' 
          : 'bg-gray-100 text-gray-800 border border-gray-200';
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

  // FAQ Functions
  const loadFAQs = async () => {
    try {
      setFaqLoading(true);
      const response = await faqService.getAllFAQs();
      
      if (response.success) {
        setFaqs(response.data || []);
        if (response.warning) {
          console.info(response.warning);
        }
      } else {
        setError(response.error || 'Failed to load FAQs');
        setFaqs([]);
      }
    } catch (error) {
      console.error('Error loading FAQs:', error);
      setError('Failed to load FAQs');
      setFaqs([]);
    } finally {
      setFaqLoading(false);
    }
  };

  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let response;
      
      if (editingFaq) {
        response = await faqService.updateFAQ(editingFaq.id, faqFormData);
      } else {
        response = await faqService.createFAQ(faqFormData);
      }
      
      if (response.success) {
        await loadFAQs();
        resetFaqForm();
      } else {
        setError(response.error || 'Failed to save FAQ');
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      setError('Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
    setFaqFormData({
      question: faq.question,
      answer: faq.answer,
      categoryId: faq.categoryId || '',
      isActive: faq.isActive !== false
    });
    setShowFaqForm(true);
  };

  const handleDeleteFaq = async (faqId) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      setSaving(true);
      const response = await faqService.deleteFAQ(faqId);
      
      if (response.success) {
        await loadFAQs();
      } else {
        setError(response.error || 'Failed to delete FAQ');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      setError('Failed to delete FAQ');
    } finally {
      setSaving(false);
    }
  };

  const resetFaqForm = () => {
    setFaqFormData({
      question: '',
      answer: '',
      categoryId: '',
      isActive: true
    });
    setEditingFaq(null);
    setShowFaqForm(false);
  };

  // Category Management Functions
  const loadCategories = async () => {
    try {
      setCategoryLoading(true);
      const response = await faqService.getAllCategories();
      
      if (response.success) {
        setCategories(response.data);
      } else {
        setError(response.error || 'Failed to load categories');
        setCategories([]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories');
      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let response;
      
      if (editingCategory) {
        response = await faqService.updateCategory(editingCategory.id, categoryFormData);
      } else {
        response = await faqService.createCategory(categoryFormData);
      }
      
      if (response.success) {
        await loadCategories();
        resetCategoryForm();
      } else {
        setError(response.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive !== false
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      const response = await faqService.deleteCategory(categoryId);
      
      if (response.success) {
        await loadCategories();
        setError(null);
      } else {
        setError(response.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    } finally {
      setSaving(false);
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      description: '',
      isActive: true
    });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  // Load FAQs and Categories when FAQ tab is active
  useEffect(() => {
    if (activeTab === 'faq') {
      loadFAQs();
      loadCategories();
    }
  }, [activeTab]);

  // Filter and paginate FAQs
  const getFilteredFAQs = () => {
    let filtered = faqs;

    // Apply search filter
    if (faqSearchQuery.trim()) {
      const query = faqSearchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (faqCategoryFilter) {
      filtered = filtered.filter(faq => faq.categoryId === faqCategoryFilter);
    }

    // Apply status filter
    if (faqStatusFilter) {
      const isActive = faqStatusFilter === 'active';
      filtered = filtered.filter(faq => faq.isActive === isActive);
    }

    return filtered;
  };

  const getPaginatedFAQs = () => {
    const filtered = getFilteredFAQs();
    const startIndex = (faqCurrentPage - 1) * faqItemsPerPage;
    const endIndex = startIndex + faqItemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getFAQTotalPages = () => {
    const filtered = getFilteredFAQs();
    return Math.ceil(filtered.length / faqItemsPerPage);
  };

  // Reset FAQ pagination when filters change
  useEffect(() => {
    setFaqCurrentPage(1);
  }, [faqSearchQuery, faqCategoryFilter, faqStatusFilter]);



  return (
      <div className={`min-h-screen p-4 mt-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header removed as requested */}

          {/* Navigation Tabs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
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
            <button
              onClick={() => { resetFaqForm(); setActiveTab('faq'); }}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'faq' 
                  ? 'bg-green-600 text-white shadow-md transform scale-105' 
                  : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} hover:shadow-md`
              }`}
            >
              <span className="text-lg">❓</span>
              <span>FAQ & Categories</span>
            </button>
          </div>


        {/* Survey List */}
        {activeTab === 'list' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Summary Cards */}
            <div className="flex flex-row flex-wrap justify-center items-stretch gap-3 mb-2">
              {/* Total Forms */}
              <div className={`flex items-center gap-3 rounded-xl border px-5 py-3 min-w-[170px] shadow-sm transition-all duration-200 hover:shadow-lg ${isDark ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg text-xl ${isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'}`}>
                  📋
                </div>
                <div className="flex flex-col justify-center">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Forms</span>
                  <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{totalItems}</span>
                </div>
              </div>
              {/* Active Forms */}
              <div className={`flex items-center gap-3 rounded-xl border px-5 py-3 min-w-[170px] shadow-sm transition-all duration-200 hover:shadow-lg ${isDark ? 'bg-gray-800 border-green-700 hover:bg-gray-700' : 'bg-white border-green-200 hover:bg-green-50'}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg text-xl ${isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-50 text-green-700'}`}>
                  ✅
                </div>
                <div className="flex flex-col justify-center">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-green-400' : 'text-green-600'}`}>Active Forms</span>
                  <span className={`text-lg font-bold ${isDark ? 'text-green-300' : 'text-green-700'}`}>{surveys.filter(s => s.status.toLowerCase() === 'active').length}</span>
                </div>
              </div>
              {/* Total Responses */}
              <div className={`flex items-center gap-3 rounded-xl border px-5 py-3 min-w-[170px] shadow-sm transition-all duration-200 hover:shadow-lg ${isDark ? 'bg-gray-800 border-blue-700 hover:bg-gray-700' : 'bg-white border-blue-200 hover:bg-blue-50'}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg text-xl ${isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
                  📊
                </div>
                <div className="flex flex-col justify-center">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Total Responses</span>
                  <span className={`text-lg font-bold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{surveys.reduce((sum, s) => sum + (s.responsesCount || 0), 0)}</span>
                </div>
              </div>
              {/* Draft Forms */}
              <div className={`flex items-center gap-3 rounded-xl border px-5 py-3 min-w-[170px] shadow-sm transition-all duration-200 hover:shadow-lg ${isDark ? 'bg-gray-800 border-purple-700 hover:bg-gray-700' : 'bg-white border-purple-200 hover:bg-purple-50'}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg text-xl ${isDark ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-50 text-purple-700'}`}>
                  📝
                </div>
                <div className="flex flex-col justify-center">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Draft Forms</span>
                  <span className={`text-lg font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>{surveys.filter(s => s.status.toLowerCase() === 'draft').length}</span>
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
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 sm:px-4 py-2 border rounded-lg text-xs sm:text-sm transition-colors ${
                      isDark
                        ? 'border-gray-600 hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
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
                          className={`px-3 py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-green-600 text-white'
                              : isDark
                              ? 'border border-gray-600 hover:bg-gray-700 text-gray-300'
                              : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
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
                    className={`px-3 sm:px-4 py-2 border rounded-lg text-xs sm:text-sm transition-colors ${
                      isDark
                        ? 'border-gray-600 hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}

            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex flex-col gap-4">
                <div className="w-full">
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
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 min-w-0">
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
                  <div className="flex-1 min-w-0">
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
                                    onClick={() => { setResponsesSurvey(survey); setShowResponsesModal(true); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                      isDark 
                                        ? 'text-gray-300 hover:bg-emerald-900/50 hover:text-emerald-300' 
                                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                                    }`}
                                  >
                                    <span>📥</span>
                                    Export Excel
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
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 sm:px-4 py-2 border rounded-lg text-xs sm:text-sm transition-colors ${
                        isDark
                          ? 'border-gray-600 hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                          : 'border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
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
                            className={`px-3 py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                              currentPage === pageNum
                                ? 'bg-green-600 text-white'
                                : isDark
                                ? 'border border-gray-600 hover:bg-gray-700 text-gray-300'
                                : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
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
                      className={`px-3 sm:px-4 py-2 border rounded-lg text-xs sm:text-sm transition-colors ${
                        isDark
                          ? 'border-gray-600 hover:bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                          : 'border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
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
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-2xl text-white group-hover:scale-110 transition-transform duration-200">+</span>
            </button>
          </div>
        )}

        {/* Create/Edit Survey */}
        {activeTab === 'create' && (
          <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className={`flex-1 rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <h2 className={`text-lg sm:text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {selectedSurvey ? 'Edit Survey Form' : 'Create New Survey Form'}
                </h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    <span>{saving ? '💾' : '✅'}</span>
                    {saving ? 'Saving...' : (selectedSurvey ? 'Update Survey' : 'Create Survey')}
                  </button>
                  <button
                    onClick={() => setActiveTab('list')}
                    className="bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
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
                  <div className={`text-sm px-3 py-1 rounded-full border ${
                    isDark ? 'text-gray-300 bg-gray-700 border-gray-600' : 'text-gray-500 bg-gray-50 border-gray-300'
                  }`}>
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

        {/* FAQ Management Section */}
        {activeTab === 'faq' && (
          <div className={`rounded-xl shadow-lg max-w-7xl mx-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  FAQ Management
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCategoriesModal(true)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      isDark 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    title="Manage Categories"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="hidden sm:inline">Categories</span>
                  </button>
                  <button
                    onClick={() => setShowFaqForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base"
                  >
                    <Plus size={16} />
                    Add FAQ
                  </button>
                </div>
              </div>

            {/* FAQ Search and Filter Controls */}
            <div className={`rounded-lg p-4 mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Search FAQs
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search questions or answers..."
                      value={faqSearchQuery}
                      onChange={(e) => setFaqSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg ${isDark ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="md:w-48">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Filter by Category
                  </label>
                  <select
                    value={faqCategoryFilter}
                    onChange={(e) => setFaqCategoryFilter(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="md:w-36">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </label>
                  <select
                    value={faqStatusFilter}
                    onChange={(e) => setFaqStatusFilter(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {(faqSearchQuery || faqCategoryFilter || faqStatusFilter) && (
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFaqSearchQuery('');
                        setFaqCategoryFilter('');
                        setFaqStatusFilter('');
                      }}
                      className={`px-4 py-2 text-sm rounded-lg ${isDark ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* FAQ List Table */}
            {faqLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading FAQs...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className={`w-full border-collapse ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                  <thead>
                    <tr className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Question</th>
                      <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Category</th>
                      <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Answer</th>
                      <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Status</th>
                      <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPaginatedFAQs().length === 0 ? (
                      <tr>
                        <td colSpan="5" className={`text-center p-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {getFilteredFAQs().length === 0 && faqs.length > 0 
                            ? "No FAQs match your search criteria." 
                            : "No FAQs found. Click \"Add FAQ\" to create one."
                          }
                        </td>
                      </tr>
                    ) : (
                      getPaginatedFAQs().map((faq) => {
                        const category = categories.find(cat => cat.id === faq.categoryId);
                        return (
                          <tr key={faq.id} className={`border-t ${isDark ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              <div className="max-w-xs truncate" title={faq.question}>
                                {faq.question}
                              </div>
                            </td>
                            <td className="p-4">
                              {category ? (
                                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {category.name}
                                </span>
                              ) : (
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  No category
                                </span>
                              )}
                            </td>
                            <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              <div className="max-w-sm truncate" title={faq.answer}>
                                {faq.answer}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                faq.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {faq.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditFaq(faq)}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                  title="Edit FAQ"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteFaq(faq.id)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                  title="Delete FAQ"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {/* FAQ Pagination */}
                {getFilteredFAQs().length > faqItemsPerPage && (
                  <div className={`flex items-center justify-between px-4 py-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Showing {Math.min((faqCurrentPage - 1) * faqItemsPerPage + 1, getFilteredFAQs().length)} to{' '}
                      {Math.min(faqCurrentPage * faqItemsPerPage, getFilteredFAQs().length)} of{' '}
                      {getFilteredFAQs().length} FAQs
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFaqCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={faqCurrentPage === 1}
                        className={`px-3 py-1 rounded border text-sm ${
                          faqCurrentPage === 1
                            ? isDark ? 'bg-gray-700 text-gray-500 border-gray-600' : 'bg-gray-100 text-gray-400 border-gray-300'
                            : isDark ? 'bg-gray-600 text-gray-200 border-gray-500 hover:bg-gray-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      <span className={`px-3 py-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Page {faqCurrentPage} of {getFAQTotalPages()}
                      </span>
                      <button
                        onClick={() => setFaqCurrentPage(prev => Math.min(prev + 1, getFAQTotalPages()))}
                        disabled={faqCurrentPage === getFAQTotalPages()}
                        className={`px-3 py-1 rounded border text-sm ${
                          faqCurrentPage === getFAQTotalPages()
                            ? isDark ? 'bg-gray-700 text-gray-500 border-gray-600' : 'bg-gray-100 text-gray-400 border-gray-300'
                            : isDark ? 'bg-gray-600 text-gray-200 border-gray-500 hover:bg-gray-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        )}

        {/* Categories Modal */}
        {showCategoriesModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className={`w-full max-w-6xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl`}>
              <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} sticky top-0 ${isDark ? 'bg-gray-800' : 'bg-white'} z-10`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Category Management</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCategoryForm(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Plus size={16} />
                      Add Category
                    </button>
                    <button
                      onClick={() => setShowCategoriesModal(false)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {categoryLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading categories...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className={`w-full border-collapse ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                      <thead>
                        <tr className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Name</th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Description</th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Status</th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Created</th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>FAQ Count</th>
                          <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.length === 0 ? (
                          <tr>
                            <td colSpan="6" className={`text-center p-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              No categories found. Click "Add Category" to create one.
                            </td>
                          </tr>
                        ) : (
                          categories.map((category) => (
                            <tr key={category.id} className={`border-t ${isDark ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}>
                              <td className={`p-4 font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                {category.name}
                              </td>
                              <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {category.description || 'No description'}
                              </td>
                              <td className="p-4">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  category.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {category.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className={`p-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className={`p-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {faqs.filter(faq => faq.categoryId === category.id).length} FAQs
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEditCategory(category)}
                                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                    title="Edit Category"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                    title="Delete Category"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FAQ Form Modal */}
        {showFaqForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-4 sm:p-8 flex flex-col gap-4`}>
                  <h3 className={`text-xl font-bold mb-2 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                  <form onSubmit={handleFaqSubmit} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Question *</label>
                      <input
                        type="text"
                        value={faqFormData.question}
                        onChange={(e) => setFaqFormData({...faqFormData, question: e.target.value})}
                        className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        required
                        placeholder="Enter the frequently asked question"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                      <select
                        value={faqFormData.categoryId || ''}
                        onChange={(e) => setFaqFormData({...faqFormData, categoryId: e.target.value || null})}
                        className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      >
                        <option value="">Select Category (Optional)</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Answer *</label>
                      <textarea
                        value={faqFormData.answer}
                        onChange={(e) => setFaqFormData({...faqFormData, answer: e.target.value})}
                        className={`w-full p-3 border rounded-lg h-32 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        required
                        placeholder="Provide a detailed answer to the question"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-700'}`}> 
                        <input
                          type="checkbox"
                          checked={faqFormData.isActive}
                          onChange={(e) => setFaqFormData({...faqFormData, isActive: e.target.checked})}
                          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        Active (visible to users)
                      </label>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                      <button
                        type="button"
                        onClick={resetFaqForm}
                        className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >Cancel</button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                      >{saving ? 'Saving...' : (editingFaq ? 'Update FAQ' : 'Create FAQ')}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

        {/* Category Management Section */}
        {activeTab === 'categories' && (
          <div className={`rounded-xl shadow-lg p-6 max-w-5xl mx-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Category Management
              </h2>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                Add Category
              </button>
            </div>

            {/* Category List Table */}
            {categoryLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading categories...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className={`w-full border-collapse ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                  <thead>
                    <tr className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Name</th>
                      <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Description</th>
                      <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Status</th>
                      <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Created</th>
                      <th className={`text-left p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan="5" className={`text-center p-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          No categories found. Click "Add Category" to create one.
                        </td>
                      </tr>
                    ) : (
                      categories.map((category) => (
                        <tr key={category.id} className={`border-t ${isDark ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <td className={`p-4 font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                            {category.name}
                          </td>
                          <td className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {category.description || 'No description'}
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              category.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className={`p-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                title="Edit Category"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                title="Delete Category"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}


          </div>
        )}

        {/* Category Form Modal */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-4 sm:p-8 flex flex-col gap-4`}>
              <h3 className={`text-xl font-bold mb-2 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name *</label>
                  <input
                    type="text"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                    className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    required
                    placeholder="Enter category name (e.g., Medical & Health)"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                  <textarea
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                    className={`w-full p-3 border rounded-lg h-24 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="Describe what this category covers"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-700'}`}> 
                    <input
                      type="checkbox"
                      checked={categoryFormData.isActive}
                      onChange={(e) => setCategoryFormData({...categoryFormData, isActive: e.target.checked})}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    Active (visible to users)
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >Cancel</button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                  >{saving ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}</button>
                </div>
              </form>
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
