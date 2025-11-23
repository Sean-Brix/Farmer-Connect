import axios from 'axios';

const API_BASE_URL = '/api/planting-reports';

// ==================== PLANTING REPORTS ====================

export const plantingReportService = {
    // Get all reports with filters and pagination
    getAll: async (params = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reports`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching planting reports:', error);
            throw error.response?.data || error;
        }
    },

    // Get single report by ID
    getById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reports/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching report ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Create new report
    create: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/reports`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating planting report:', error);
            throw error.response?.data || error;
        }
    },

    // Update existing report
    update: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/reports/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating report ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Delete report
    delete: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/reports/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting report ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Archive/Unarchive report
    archive: async (id) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/reports/${id}/archive`);
            return response.data;
        } catch (error) {
            console.error(`Error archiving report ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Get reports by RSBSA number
    getByRSBSA: async (rsbsaNumber, params = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reports/rsbsa/${rsbsaNumber}`, { params });
            return response.data;
        } catch (error) {
            console.error(`Error fetching reports for RSBSA ${rsbsaNumber}:`, error);
            throw error.response?.data || error;
        }
    },

    // Recalculate yield
    recalculateYield: async (id) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/reports/${id}/calculate-yield`);
            return response.data;
        } catch (error) {
            console.error(`Error recalculating yield for report ${id}:`, error);
            throw error.response?.data || error;
        }
    }
};

// ==================== PLANTING SEASONS ====================

export const seasonService = {
    // Get all seasons
    getAll: async (params = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/seasons`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching planting seasons:', error);
            throw error.response?.data || error;
        }
    },

    // Get active seasons only
    getActive: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/seasons/active`);
            return response.data;
        } catch (error) {
            console.error('Error fetching active seasons:', error);
            throw error.response?.data || error;
        }
    },

    // Get single season by ID
    getById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/seasons/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching season ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Create new season
    create: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/seasons`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating planting season:', error);
            throw error.response?.data || error;
        }
    },

    // Update existing season
    update: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/seasons/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating season ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Get reports by season
    getReportsBySeason: async (seasonId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reports`, { 
                params: { croppingSeasonId: seasonId } 
            });
            // Return reports array from response
            return response.data.reports || response.data || [];
        } catch (error) {
            console.error(`Error fetching reports for season ${seasonId}:`, error);
            throw error.response?.data || error;
        }
    },

    // Delete season (with cascade option)
    delete: async (id, cascade = false) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/seasons/${id}`, {
                params: { cascade }
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting season ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Toggle active status
    toggleActive: async (id, isActive) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/seasons/${id}`, { isActive });
            return response.data;
        } catch (error) {
            console.error(`Error toggling season ${id} active status:`, error);
            throw error.response?.data || error;
        }
    },

    // Deactivate season
    deactivate: async (id) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/seasons/${id}/deactivate`);
            return response.data;
        } catch (error) {
            console.error(`Error deactivating season ${id}:`, error);
            throw error.response?.data || error;
        }
    }
};

// ==================== SEED VARIETIES ====================

export const varietyService = {
    // Get all varieties
    getAll: async (params = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/varieties`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching seed varieties:', error);
            throw error.response?.data || error;
        }
    },

    // Get varieties by crop type
    getByCropType: async (cropType) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/varieties/crop-type/${cropType}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${cropType} varieties:`, error);
            throw error.response?.data || error;
        }
    },

    // Get single variety by ID
    getById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/varieties/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching variety ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Create new variety
    create: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/varieties`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating seed variety:', error);
            throw error.response?.data || error;
        }
    },

    // Update existing variety
    update: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/varieties/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating variety ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Get reports by variety
    getReportsByVariety: async (varietyId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reports`, { 
                params: { varietyId: varietyId } 
            });
            // Return reports array from response
            return response.data.reports || response.data || [];
        } catch (error) {
            console.error(`Error fetching reports for variety ${varietyId}:`, error);
            throw error.response?.data || error;
        }
    },

    // Delete variety (with cascade option)
    delete: async (id, cascade = false) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/varieties/${id}`, {
                params: { cascade }
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting variety ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Toggle active status
    toggleActive: async (id, isActive) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/varieties/${id}`, { isActive });
            return response.data;
        } catch (error) {
            console.error(`Error toggling variety ${id} active status:`, error);
            throw error.response?.data || error;
        }
    },

    // Deactivate variety
    deactivate: async (id) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/varieties/${id}/deactivate`);
            return response.data;
        } catch (error) {
            console.error(`Error deactivating variety ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Get crop type statistics
    getStats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/varieties/stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching crop type statistics:', error);
            throw error.response?.data || error;
        }
    }
};
