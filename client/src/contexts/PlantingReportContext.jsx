import { createContext, useContext, useState, useCallback } from 'react';
import { plantingReportService, seasonService, varietyService } from '../Services/plantingReportService';

const PlantingReportContext = createContext();

export const usePlantingReport = () => {
    const context = useContext(PlantingReportContext);
    if (!context) {
        throw new Error('usePlantingReport must be used within PlantingReportProvider');
    }
    return context;
};

export const PlantingReportProvider = ({ children }) => {
    // Cache state
    const [seasonsCache, setSeasonsCache] = useState({ data: null, timestamp: null });
    const [varietiesCache, setVarietiesCache] = useState({ data: null, timestamp: null });
    const [reportsCache, setReportsCache] = useState({ data: null, timestamp: null });

    // Loading states
    const [loadingSeasons, setLoadingSeasons] = useState(false);
    const [loadingVarieties, setLoadingVarieties] = useState(false);
    const [loadingReports, setLoadingReports] = useState(false);

    // Cache TTL (Time To Live) - 5 minutes
    const CACHE_TTL = 5 * 60 * 1000;

    // Check if cache is valid
    const isCacheValid = (timestamp) => {
        if (!timestamp) return false;
        return Date.now() - timestamp < CACHE_TTL;
    };

    // ==================== SEASONS ====================

    const fetchSeasons = useCallback(async (forceRefresh = false) => {
        if (!forceRefresh && isCacheValid(seasonsCache.timestamp)) {
            return seasonsCache.data;
        }

        setLoadingSeasons(true);
        try {
            const response = await seasonService.getAll();
            const seasons = response.seasons || [];
            setSeasonsCache({ data: seasons, timestamp: Date.now() });
            return seasons;
        } catch (error) {
            console.error('Error fetching seasons:', error);
            throw error;
        } finally {
            setLoadingSeasons(false);
        }
    }, [seasonsCache]);

    const createSeason = useCallback(async (data) => {
        try {
            const response = await seasonService.create(data);
            // Invalidate cache
            setSeasonsCache({ data: null, timestamp: null });
            return response.season;
        } catch (error) {
            console.error('Error creating season:', error);
            throw error;
        }
    }, []);

    const updateSeason = useCallback(async (id, data) => {
        try {
            const response = await seasonService.update(id, data);
            // Invalidate cache
            setSeasonsCache({ data: null, timestamp: null });
            return response.season;
        } catch (error) {
            console.error('Error updating season:', error);
            throw error;
        }
    }, []);

    const deleteSeason = useCallback(async (id, cascade = false) => {
        try {
            await seasonService.delete(id, cascade);
            // Invalidate cache
            setSeasonsCache({ data: null, timestamp: null });
            setReportsCache({ data: null, timestamp: null }); // Also invalidate reports if cascade
        } catch (error) {
            console.error('Error deleting season:', error);
            throw error;
        }
    }, []);

    const toggleSeasonActive = useCallback(async (id, isActive) => {
        try {
            const response = await seasonService.toggleActive(id, isActive);
            // Invalidate cache
            setSeasonsCache({ data: null, timestamp: null });
            return response.season;
        } catch (error) {
            console.error('Error toggling season active status:', error);
            throw error;
        }
    }, []);

    // ==================== VARIETIES ====================

    const fetchVarieties = useCallback(async (forceRefresh = false, params = {}) => {
        if (!forceRefresh && isCacheValid(varietiesCache.timestamp) && !params.cropType) {
            return varietiesCache.data;
        }

        setLoadingVarieties(true);
        try {
            const response = await varietyService.getAll(params);
            const varieties = response.varieties || [];
            
            // Only cache if no specific params (full list)
            if (!params.cropType && !params.isActive) {
                setVarietiesCache({ data: varieties, timestamp: Date.now() });
            }
            
            return varieties;
        } catch (error) {
            console.error('Error fetching varieties:', error);
            throw error;
        } finally {
            setLoadingVarieties(false);
        }
    }, [varietiesCache]);

    const createVariety = useCallback(async (data) => {
        try {
            const response = await varietyService.create(data);
            // Invalidate cache
            setVarietiesCache({ data: null, timestamp: null });
            return response.variety;
        } catch (error) {
            console.error('Error creating variety:', error);
            throw error;
        }
    }, []);

    const updateVariety = useCallback(async (id, data) => {
        try {
            const response = await varietyService.update(id, data);
            // Invalidate cache
            setVarietiesCache({ data: null, timestamp: null });
            return response.variety;
        } catch (error) {
            console.error('Error updating variety:', error);
            throw error;
        }
    }, []);

    const deleteVariety = useCallback(async (id, cascade = false) => {
        try {
            await varietyService.delete(id, cascade);
            // Invalidate cache
            setVarietiesCache({ data: null, timestamp: null });
            setReportsCache({ data: null, timestamp: null }); // Also invalidate reports if cascade
        } catch (error) {
            console.error('Error deleting variety:', error);
            throw error;
        }
    }, []);

    const toggleVarietyActive = useCallback(async (id, isActive) => {
        try {
            const response = await varietyService.toggleActive(id, isActive);
            // Invalidate cache
            setVarietiesCache({ data: null, timestamp: null });
            return response.variety;
        } catch (error) {
            console.error('Error toggling variety active status:', error);
            throw error;
        }
    }, []);

    // ==================== REPORTS ====================

    const fetchReports = useCallback(async (params = {}, forceRefresh = false) => {
        // Don't cache if there are specific params (filtering)
        const hasParams = Object.keys(params).length > 0;
        
        if (!forceRefresh && !hasParams && isCacheValid(reportsCache.timestamp)) {
            return reportsCache.data;
        }

        setLoadingReports(true);
        try {
            const response = await plantingReportService.getAll(params);
            const reports = response.reports || [];
            
            // Only cache full list without params
            if (!hasParams) {
                setReportsCache({ data: reports, timestamp: Date.now() });
            }
            
            return reports;
        } catch (error) {
            console.error('Error fetching reports:', error);
            throw error;
        } finally {
            setLoadingReports(false);
        }
    }, [reportsCache]);

    const createReport = useCallback(async (data) => {
        try {
            const response = await plantingReportService.create(data);
            // Invalidate cache
            setReportsCache({ data: null, timestamp: null });
            return response.report;
        } catch (error) {
            console.error('Error creating report:', error);
            throw error;
        }
    }, []);

    const updateReport = useCallback(async (id, data) => {
        try {
            const response = await plantingReportService.update(id, data);
            // Invalidate cache
            setReportsCache({ data: null, timestamp: null });
            return response.report;
        } catch (error) {
            console.error('Error updating report:', error);
            throw error;
        }
    }, []);

    const deleteReport = useCallback(async (id) => {
        try {
            await plantingReportService.delete(id);
            // Invalidate cache
            setReportsCache({ data: null, timestamp: null });
        } catch (error) {
            console.error('Error deleting report:', error);
            throw error;
        }
    }, []);

    const archiveReport = useCallback(async (id) => {
        try {
            const response = await plantingReportService.archive(id);
            // Invalidate cache
            setReportsCache({ data: null, timestamp: null });
            return response.report;
        } catch (error) {
            console.error('Error archiving report:', error);
            throw error;
        }
    }, []);

    const value = {
        // Seasons
        seasons: seasonsCache.data,
        loadingSeasons,
        fetchSeasons,
        createSeason,
        updateSeason,
        deleteSeason,
        toggleSeasonActive,

        // Varieties
        varieties: varietiesCache.data,
        loadingVarieties,
        fetchVarieties,
        createVariety,
        updateVariety,
        deleteVariety,
        toggleVarietyActive,

        // Reports
        reports: reportsCache.data,
        loadingReports,
        fetchReports,
        createReport,
        updateReport,
        deleteReport,
        archiveReport
    };

    return (
        <PlantingReportContext.Provider value={value}>
            {children}
        </PlantingReportContext.Provider>
    );
};
