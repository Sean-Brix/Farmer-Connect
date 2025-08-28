const API_BASE_URL = '/api/survey-forms';

// Survey Forms API
export const surveyFormsAPI = {
  // Get all survey forms with filtering and pagination
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.searchField) queryParams.append('searchField', params.searchField);
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await fetch(`${API_BASE_URL}/forms?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch survey forms');
    return response.json();
  },

  // Get single survey form by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`);
    if (!response.ok) throw new Error('Failed to fetch survey form');
    return response.json();
  },

  // Create new survey form
  create: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error('Failed to create survey form');
    return response.json();
  },

  // Update survey form
  update: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error('Failed to update survey form');
    return response.json();
  },

  // Delete survey form
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete survey form');
    return response.json();
  },

  // Get survey responses
  getResponses: async (surveyFormId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await fetch(`${API_BASE_URL}/responses/${surveyFormId}?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch survey responses');
    return response.json();
  },

  // Submit survey response
  submitResponse: async (surveyFormId, responseData) => {
    const response = await fetch(`${API_BASE_URL}/responses/${surveyFormId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responseData),
    });
    if (!response.ok) throw new Error('Failed to submit survey response');
    return response.json();
  },

  // Get survey analytics
  getAnalytics: async (surveyFormId) => {
    const response = await fetch(`${API_BASE_URL}/analytics/${surveyFormId}`);
    if (!response.ok) throw new Error('Failed to fetch survey analytics');
    return response.json();
  },

  // Get survey statistics (custom charts)
  getStatistics: async (surveyFormId) => {
    const response = await fetch(`${API_BASE_URL}/statistics/${surveyFormId}`);
    if (!response.ok) throw new Error('Failed to fetch survey statistics');
    return response.json();
  },

  // Create survey statistic
  createStatistic: async (surveyFormId, statisticData) => {
    const response = await fetch(`${API_BASE_URL}/statistics/${surveyFormId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statisticData),
    });
    if (!response.ok) throw new Error('Failed to create survey statistic');
    return response.json();
  },

  // Update survey statistic
  updateStatistic: async (statisticId, statisticData) => {
    const response = await fetch(`${API_BASE_URL}/statistics/${statisticId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statisticData),
    });
    if (!response.ok) throw new Error('Failed to update survey statistic');
    return response.json();
  },

  // Delete survey statistic
  deleteStatistic: async (statisticId) => {
    const response = await fetch(`${API_BASE_URL}/statistics/${statisticId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete survey statistic');
    return response.json();
  }
};
