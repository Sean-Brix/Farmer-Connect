const API_BASE_URL = '/api/survey-forms';

async function handleResponse(response, fallbackMessage) {
  // Read body once as text, then try to parse
  const raw = await response.text().catch(() => null);
  if (response.ok) {
    try {
      return raw ? JSON.parse(raw) : {};
    } catch {
      return raw ? { message: raw } : {};
    }
  }
  // Error path: prefer server message
  if (raw) {
    try {
      const data = JSON.parse(raw);
      const msg = data?.message || data?.error || fallbackMessage;
      throw new Error(msg);
    } catch {
      throw new Error(raw || fallbackMessage);
    }
  }
  throw new Error(fallbackMessage);
}

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

    const response = await fetch(`${API_BASE_URL}/forms?${queryParams}`, { credentials: 'include' });
    return handleResponse(response, 'Failed to fetch survey forms');
  },

  // Get single survey form by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`, { credentials: 'include' });
    return handleResponse(response, 'Failed to fetch survey form');
  },

  // Create new survey form
  create: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
    return handleResponse(response, 'Failed to create survey form');
  },

  // Update survey form
  update: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
    return handleResponse(response, 'Failed to update survey form');
  },

  // Delete survey form
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(response, 'Failed to delete survey form');
  },

  // Get survey responses
  getResponses: async (surveyFormId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await fetch(`${API_BASE_URL}/responses/${surveyFormId}?${queryParams}`, { credentials: 'include' });
    return handleResponse(response, 'Failed to fetch survey responses');
  },

  // Submit survey response
  submitResponse: async (surveyFormId, responseData) => {
    const response = await fetch(`${API_BASE_URL}/responses/${surveyFormId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(responseData),
    });
    return handleResponse(response, 'Failed to submit survey response');
  },

  // Get survey analytics
  getAnalytics: async (surveyFormId) => {
    const response = await fetch(`${API_BASE_URL}/analytics/${surveyFormId}`, { credentials: 'include' });
    return handleResponse(response, 'Failed to fetch survey analytics');
  },

  // Get survey statistics (custom charts)
  getStatistics: async (surveyFormId) => {
    const response = await fetch(`${API_BASE_URL}/statistics/${surveyFormId}`, { credentials: 'include' });
    return handleResponse(response, 'Failed to fetch survey statistics');
  },

  // Create survey statistic
  createStatistic: async (surveyFormId, statisticData) => {
    const response = await fetch(`${API_BASE_URL}/statistics/${surveyFormId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(statisticData),
    });
    return handleResponse(response, 'Failed to create survey statistic');
  },

  // Update survey statistic
  updateStatistic: async (statisticId, statisticData) => {
    const response = await fetch(`${API_BASE_URL}/statistics/${statisticId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(statisticData),
    });
    return handleResponse(response, 'Failed to update survey statistic');
  },

  // Delete survey statistic
  deleteStatistic: async (statisticId) => {
    const response = await fetch(`${API_BASE_URL}/statistics/${statisticId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(response, 'Failed to delete survey statistic');
  }
};
