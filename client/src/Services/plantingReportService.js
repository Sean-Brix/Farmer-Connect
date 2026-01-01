/**
 * PlantingReport API Service
 * All API calls for planting reports
 */

import axios from 'axios';

// Default to server on port 8080 unless overridden via VITE_API_URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// ===========================
// PLANTING REPORTS CRUD
// ===========================

export const plantingReportService = {
  // Get all reports (with pagination, filters)
  async getAllReports({ page = 1, limit = 25, state, isArchived, distributionLinked, search, sortBy, sortOrder, ...filters }) {
    const params = {
      page,
      limit,
      ...(state && { state }),
      ...(isArchived !== undefined && { isArchived }),
      ...(distributionLinked !== undefined && { distributionLinked }),
      ...(search && { search }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...filters
    };
    const response = await api.get('/planting-reports/reports', { params });
    return response.data;
  },

  // Legacy alias
  async getAll(params = {}) {
    return this.getAllReports(params);
  },

  // Get deleted reports
  async getDeletedReports({ page = 1, limit = 25, search, sortBy, sortOrder, ...filters }) {
    const params = {
      page,
      limit,
      ...(search && { search }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...filters
    };
    const response = await api.get('/planting-reports/reports/deleted', { params });
    return response.data;
  },

  // Get report by ID
  async getReportById(id) {
    const response = await api.get(`/planting-reports/reports/${id}`);
    return response.data;
  },

  // Create report
  async createReport(data) {
    const response = await api.post('/planting-reports/reports', data);
    return response.data;
  },

  // Update report
  async updateReport(id, data) {
    const response = await api.put(`/planting-reports/reports/${id}`, data);
    return response.data;
  },

  // Soft delete report
  async deleteReport(id) {
    const response = await api.delete(`/planting-reports/reports/${id}`);
    return response.data;
  },

  // Restore deleted report
  async restoreReport(id) {
    const response = await api.patch(`/planting-reports/reports/${id}/restore`);
    return response.data;
  },

  // Permanently delete report (hard delete)
  async permanentDeleteReport(id) {
    const response = await api.delete(`/planting-reports/reports/${id}/permanent`);
    return response.data;
  },

  // ===========================
  // STATE TRANSITIONS
  // ===========================

  // Transition to Planted
  async transitionToPlanted(id, data) {
    const response = await api.patch(`/planting-reports/reports/${id}/transition/planted`, data);
    return response.data;
  },

  // Transition to Completed
  async transitionToCompleted(id, data) {
    const response = await api.patch(`/planting-reports/reports/${id}/transition/harvested`, data);
    return response.data;
  },

  // ===========================
  // ARCHIVE
  // ===========================

  // Archive report (only Completed state)
  async archiveReport(id) {
    const response = await api.patch(`/planting-reports/reports/${id}/archive`);
    return response.data;
  },

  // Unarchive report
  async unarchiveReport(id) {
    const response = await api.patch(`/planting-reports/reports/${id}/unarchive`);
    return response.data;
  },

  // ===========================
  // BULK OPERATIONS
  // ===========================

  // Bulk archive
  async bulkArchive(ids) {
    const response = await api.post('/planting-reports/reports/bulk/archive', { ids });
    return response.data;
  },

  // Bulk delete
  async bulkDelete(ids) {
    const response = await api.post('/planting-reports/reports/bulk/delete', { ids });
    return response.data;
  },

  // ===========================
  // STATISTICS
  // ===========================

  // Get statistics
  async getStatistics() {
    const response = await api.get('/planting-reports/reports/statistics');
    return response.data;
  },

  // Get summary statistics
  async getReportSummary() {
    const response = await api.get('/planting-reports/reports/summary');
    return response.data;
  },

  // ===========================
  // VARIETIES & SEASONS
  // ===========================

  // Get all varieties
  async getAllVarieties(params = {}) {
    const response = await api.get('/planting-reports/varieties', { params });
    return response.data;
  },

  // Get active varieties
  async getActiveVarieties() {
    const response = await api.get('/planting-reports/varieties/active');
    return response.data;
  },

  // Get variety by ID
  async getVarietyById(id) {
    const response = await api.get(`/planting-reports/varieties/${id}`);
    return response.data;
  },

  // Create variety
  async createVariety(data) {
    const response = await api.post('/planting-reports/varieties', data);
    return response.data;
  },

  // Update variety
  async updateVariety(id, data) {
    const response = await api.put(`/planting-reports/varieties/${id}`, data);
    return response.data;
  },

  // Delete variety
  async deleteVariety(id, { cascade } = {}) {
    const response = await api.delete(`/planting-reports/varieties/${id}`, {
      params: cascade ? { cascade: true } : undefined
    });
    return response.data;
  },

  // Get reports using variety
  async getReportsByVariety(varietyId) {
    const response = await api.get(`/planting-reports/varieties/${varietyId}/reports`);
    return response.data;
  },

  // Get all seasons
  async getAllSeasons(params = {}) {
    const response = await api.get('/planting-reports/seasons', { params });
    return response.data;
  },

  // Get active seasons
  async getActiveSeasons() {
    const response = await api.get('/planting-reports/seasons/active');
    return response.data;
  },

  // Get season by ID
  async getSeasonById(id) {
    const response = await api.get(`/planting-reports/seasons/${id}`);
    return response.data;
  },

  // Create season
  async createSeason(data) {
    const response = await api.post('/planting-reports/seasons', data);
    return response.data;
  },

  // Update season
  async updateSeason(id, data) {
    const response = await api.put(`/planting-reports/seasons/${id}`, data);
    return response.data;
  },

  // Delete season
  async deleteSeason(id, { cascade } = {}) {
    const response = await api.delete(`/planting-reports/seasons/${id}`, {
      params: cascade ? { cascade: true } : undefined
    });
    return response.data;
  },

  // Get reports using season
  async getReportsBySeason(seasonId) {
    const response = await api.get(`/planting-reports/seasons/${seasonId}/reports`);
    return response.data;
  }
};

// Legacy-compatible service groupings used by admin screens
export const varietyService = {
  getAll: (params) => plantingReportService.getAllVarieties(params),
  getActive: () => plantingReportService.getActiveVarieties(),
  getById: (id) => plantingReportService.getVarietyById(id),
  create: (data) => plantingReportService.createVariety(data),
  update: (id, data) => plantingReportService.updateVariety(id, data),
  delete: (id, cascade) => plantingReportService.deleteVariety(id, { cascade }),
  toggleActive: (id, isActive) => plantingReportService.updateVariety(id, { isActive }),
  getReportsByVariety: (id) => plantingReportService.getReportsByVariety(id)
};

export const seasonService = {
  getAll: (params) => plantingReportService.getAllSeasons(params),
  getActive: () => plantingReportService.getActiveSeasons(),
  getById: (id) => plantingReportService.getSeasonById(id),
  create: (data) => plantingReportService.createSeason(data),
  update: (id, data) => plantingReportService.updateSeason(id, data),
  delete: (id, cascade) => plantingReportService.deleteSeason(id, { cascade }),
  toggleActive: (id, isActive) => plantingReportService.updateSeason(id, { isActive }),
  getReportsBySeason: (id) => plantingReportService.getReportsBySeason(id)
};

export default plantingReportService;
