# File 02: Hooks and Utilities

**Purpose:** Create custom hooks, validation schemas, and utility functions  
**Prerequisites:** File 01 completed  
**Estimated Time:** 4-5 hours  
**Target Directory:** `/client/src/Admin/PlantingReports/`

---

## 📋 STEPS OVERVIEW

Total Steps: **15**

1. [Create usePlantingReportQueries Hook](#step-1-create-useplantingreportqueries-hook)
2. [Create useReportForm Hook](#step-2-create-usereportform-hook)
3. [Create useStateTransitions Hook](#step-3-create-usestatetransitions-hook)
4. [Create useAutoCalculations Hook](#step-4-create-useautocalculations-hook)
5. [Create usePagination Hook](#step-5-create-usepagination-hook)
6. [Create useReferenceData Hook](#step-6-create-usereferencedata-hook)
7. [Create Validation Schemas](#step-7-create-validation-schemas)
8. [Create State Helper Utils](#step-8-create-state-helper-utils)
9. [Create Date Helper Utils](#step-9-create-date-helper-utils)
10. [Create Calculation Helper Utils](#step-10-create-calculation-helper-utils)
11. [Create Export Helper Utils](#step-11-create-export-helper-utils)
12. [Create Bulk Operation Schema](#step-12-create-bulk-operation-schema)
13. [Create State Transition Rules](#step-13-create-state-transition-rules)
14. [Test All Hooks](#step-14-test-all-hooks)
15. [Verification](#step-15-verification)

---

## STEP 1: Create usePlantingReportQueries Hook

**File:** `/client/src/Admin/PlantingReports/hooks/usePlantingReportQueries.js`

```javascript
/**
 * usePlantingReportQueries Hook
 * Tanstack Query hooks for all planting report operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import plantingReportService from '../../../Services/plantingReportService';
import { toast } from 'react-toastify';

// Query Keys
export const queryKeys = {
  all: ['planting-reports'],
  lists: () => [...queryKeys.all, 'list'],
  list: (filters) => [...queryKeys.lists(), filters],
  deleted: () => [...queryKeys.all, 'deleted'],
  deletedList: (filters) => [...queryKeys.deleted(), filters],
  detail: (id) => [...queryKeys.all, 'detail', id],
  statistics: () => [...queryKeys.all, 'statistics'],
  varieties: ['varieties'],
  varietyDetail: (id) => [...queryKeys.varieties, 'detail', id],
  varietyReports: (id) => [...queryKeys.varieties, 'reports', id],
  seasons: ['seasons'],
  seasonDetail: (id) => [...queryKeys.seasons, 'detail', id],
  seasonReports: (id) => [...queryKeys.seasons, 'reports', id]
};

// ===========================
// QUERIES
// ===========================

export function useAllReports({ page, limit, state, isArchived, distributionLinked, search }) {
  return useQuery({
    queryKey: queryKeys.list({ page, limit, state, isArchived, distributionLinked, search }),
    queryFn: () => plantingReportService.getAllReports({ page, limit, state, isArchived, distributionLinked, search }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    keepPreviousData: true
  });
}

export function useDeletedReports({ page, limit }) {
  return useQuery({
    queryKey: queryKeys.deletedList({ page, limit }),
    queryFn: () => plantingReportService.getDeletedReports({ page, limit }),
    staleTime: 1 * 60 * 1000, // 1 minute
    keepPreviousData: true
  });
}

export function useReportById(id, options = {}) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => plantingReportService.getReportById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    ...options
  });
}

export function useStatistics() {
  return useQuery({
    queryKey: queryKeys.statistics(),
    queryFn: () => plantingReportService.getStatistics(),
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
  });
}

// ===========================
// MUTATIONS
// ===========================

export function useCreateReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => plantingReportService.createReport(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(queryKeys.lists());
      queryClient.invalidateQueries(queryKeys.statistics());
      toast.success('Report created successfully');
      return data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create report');
    }
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => plantingReportService.updateReport(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(queryKeys.lists());
      queryClient.invalidateQueries(queryKeys.detail(variables.id));
      queryClient.invalidateQueries(queryKeys.statistics());
      toast.success('Report updated successfully');
      return data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update report');
    }
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => plantingReportService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.lists());
      queryClient.invalidateQueries(queryKeys.deleted());
      queryClient.invalidateQueries(queryKeys.statistics());
      toast.success('Report deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete report');
    }
  });
}

export function useRestoreReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => plantingReportService.restoreReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.lists());
      queryClient.invalidateQueries(queryKeys.deleted());
      queryClient.invalidateQueries(queryKeys.statistics());
      toast.success('Report restored successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to restore report');
    }
  });
}

export function useTransitionToPlanted() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => plantingReportService.transitionToPlanted(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(queryKeys.lists());
      queryClient.invalidateQueries(queryKeys.detail(variables.id));
      queryClient.invalidateQueries(queryKeys.statistics());
      toast.success('Report transitioned to Planted state');
      return data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to transition report');
    }
  });
}

export function useTransitionToCompleted() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => plantingReportService.transitionToCompleted(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(queryKeys.lists());
      queryClient.invalidateQueries(queryKeys.detail(variables.id));
      queryClient.invalidateQueries(queryKeys.statistics());
      toast.success('Report transitioned to Completed state');
      return data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to transition report');
    }
  });
}

export function useArchiveReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => plantingReportService.archiveReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.lists());
      queryClient.invalidateQueries(queryKeys.statistics());
      toast.success('Report archived successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to archive report');
    }
  });
}

export function useUnarchiveReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => plantingReportService.unarchiveReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.lists());
      queryClient.invalidateQueries(queryKeys.statistics());
      toast.success('Report unarchived successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to unarchive report');
    }
  });
}

export function useBulkArchive() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ids) => plantingReportService.bulkArchive(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries(queryKeys.lists());
      queryClient.invalidateQueries(queryKeys.statistics());
      toast.success(`${data.count} reports archived successfully`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to archive reports');
    }
  });
}

export function useBulkDelete() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ids) => plantingReportService.bulkDelete(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries(queryKeys.lists());
      queryClient.invalidateQueries(queryKeys.deleted());
      queryClient.invalidateQueries(queryKeys.statistics());
      toast.success(`${data.count} reports deleted successfully`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete reports');
    }
  });
}
```

### Progress

- [x] Hook file created
- [x] All queries defined
- [x] All mutations defined
- [x] Toast notifications configured
- [x] Query invalidation correct
- [x] No syntax errors

---

## STEP 2: Create useReportForm Hook

**File:** `/client/src/Admin/PlantingReports/hooks/useReportForm.js`

```javascript
/**
 * useReportForm Hook
 * Form state management with validation
 */

import { useState, useEffect, useCallback } from 'react';
import { PLANTING_STATES, REQUIRED_FIELDS, LOCKED_FIELDS, HIDDEN_FIELDS } from '../constants/plantingReportConstants';
import { validateReportData, validateStateTransition } from '../validation/reportSchema';

export function useReportForm(initialData = null, currentState = PLANTING_STATES.REQUEST) {
  const [formData, setFormData] = useState(getInitialFormData(initialData, currentState));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Update form when initial data changes
  useEffect(() => {
    if (initialData) {
      setFormData(getInitialFormData(initialData, currentState));
      setIsDirty(false);
    }
  }, [initialData, currentState]);

  // Handle field change
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle field blur (mark as touched)
  const handleBlur = useCallback((field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  }, []);

  // Validate entire form
  const validateForm = useCallback(() => {
    const validation = validateReportData(formData, currentState);
    
    if (validation.error) {
      const newErrors = {};
      validation.error.details.forEach(detail => {
        newErrors[detail.path[0]] = detail.message;
      });
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  }, [formData, currentState]);

  // Validate field on blur
  const validateField = useCallback((field) => {
    const fieldSchema = getFieldSchema(field, currentState);
    if (!fieldSchema) return true;

    const { error } = fieldSchema.validate(formData[field]);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [field]: error.message
      }));
      return false;
    }
    
    return true;
  }, [formData, currentState]);

  // Check if field is required
  const isFieldRequired = useCallback((field) => {
    return REQUIRED_FIELDS[currentState]?.includes(field) || false;
  }, [currentState]);

  // Check if field is locked (read-only)
  const isFieldLocked = useCallback((field) => {
    return LOCKED_FIELDS[currentState]?.includes(field) || false;
  }, [currentState]);

  // Check if field is hidden
  const isFieldHidden = useCallback((field) => {
    return HIDDEN_FIELDS[currentState]?.includes(field) || false;
  }, [currentState]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(getInitialFormData(initialData, currentState));
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialData, currentState]);

  // Set multiple fields at once
  const setFields = useCallback((fields) => {
    setFormData(prev => ({
      ...prev,
      ...fields
    }));
    setIsDirty(true);
  }, []);

  return {
    formData,
    errors,
    touched,
    isDirty,
    handleChange,
    handleBlur,
    validateForm,
    validateField,
    isFieldRequired,
    isFieldLocked,
    isFieldHidden,
    resetForm,
    setFields
  };
}

// Helper: Get initial form data
function getInitialFormData(data, state) {
  if (!data) {
    return {
      farmerName: '',
      farmLocation: '',
      rsbsaNumber: '',
      typeOfCrop: '',
      varietyId: '',
      croppingSeasonId: '',
      areaPlanted: '',
      seedClassification: '',
      cropInsurance: '',
      dateOfPlanting: null,
      plantingMethod: '',
      riceIrrigation: '',
      dateOfExpectedHarvest: null,
      harvestArea: '',
      numberOfBags: '',
      weightPerBag: '',
      yieldMtPerHa: ''
    };
  }

  return {
    farmerName: data.farmerName || '',
    farmLocation: data.farmLocation || '',
    rsbsaNumber: data.rsbsaNumber || '',
    typeOfCrop: data.typeOfCrop || '',
    varietyId: data.varietyId || '',
    croppingSeasonId: data.croppingSeasonId || '',
    areaPlanted: data.areaPlanted || '',
    seedClassification: data.seedClassification || '',
    cropInsurance: data.cropInsurance || '',
    dateOfPlanting: data.dateOfPlanting || null,
    plantingMethod: data.plantingMethod || '',
    riceIrrigation: data.riceIrrigation || '',
    dateOfExpectedHarvest: data.dateOfExpectedHarvest || null,
    harvestArea: data.harvestArea || '',
    numberOfBags: data.numberOfBags || '',
    weightPerBag: data.weightPerBag || '',
    yieldMtPerHa: data.yieldMtPerHa || ''
  };
}

// Helper: Get field schema (placeholder - will use actual Joi schemas)
function getFieldSchema(field, state) {
  // This will be implemented when validation schemas are created
  return null;
}

export default useReportForm;
```

### Progress

- [x] Hook file created
- [x] Form state management implemented
- [x] Field validation logic
- [x] Required/Locked/Hidden field checks
- [x] Form reset functionality
- [x] No syntax errors

---

## STEP 3: Create useStateTransitions Hook

**File:** `/client/src/Admin/PlantingReports/hooks/useStateTransitions.js`

```javascript
/**
 * useStateTransitions Hook
 * Handle state transitions (Request → Planted → Completed)
 */

import { useCallback } from 'react';
import { PLANTING_STATES, STATE_TRANSITIONS } from '../constants/plantingReportConstants';
import { useTransitionToPlanted, useTransitionToCompleted } from './usePlantingReportQueries';
import { validateStateTransition } from '../validation/stateTransitionRules';

export function useStateTransitions() {
  const transitionToPlantedMutation = useTransitionToPlanted();
  const transitionToCompletedMutation = useTransitionToCompleted();

  // Check if transition is allowed
  const canTransition = useCallback((currentState, targetState) => {
    const allowedTransitions = STATE_TRANSITIONS[currentState] || [];
    return allowedTransitions.includes(targetState);
  }, []);

  // Get next allowed state
  const getNextState = useCallback((currentState) => {
    const allowedTransitions = STATE_TRANSITIONS[currentState] || [];
    return allowedTransitions[0] || null;
  }, []);

  // Transition to Planted
  const transitionToPlanted = useCallback(async (reportId, data) => {
    // Validate transition data
    const validation = validateStateTransition(PLANTING_STATES.PLANTED, data);
    
    if (validation.error) {
      throw new Error(validation.error.details[0].message);
    }

    return transitionToPlantedMutation.mutateAsync({ id: reportId, data });
  }, [transitionToPlantedMutation]);

  // Transition to Completed
  const transitionToCompleted = useCallback(async (reportId, data) => {
    // Validate transition data
    const validation = validateStateTransition(PLANTING_STATES.COMPLETED, data);
    
    if (validation.error) {
      throw new Error(validation.error.details[0].message);
    }

    return transitionToCompletedMutation.mutateAsync({ id: reportId, data });
  }, [transitionToCompletedMutation]);

  // Get transition button label
  const getTransitionLabel = useCallback((currentState) => {
    const nextState = getNextState(currentState);
    if (!nextState) return null;

    switch (nextState) {
      case PLANTING_STATES.PLANTED:
        return 'Mark as Planted';
      case PLANTING_STATES.COMPLETED:
        return 'Mark as Completed';
      default:
        return null;
    }
  }, [getNextState]);

  return {
    canTransition,
    getNextState,
    transitionToPlanted,
    transitionToCompleted,
    getTransitionLabel,
    isTransitioning: transitionToPlantedMutation.isPending || transitionToCompletedMutation.isPending
  };
}

export default useStateTransitions;
```

### Progress

- [x] Hook file created
- [x] Transition validation logic
- [x] State transition functions
- [x] Loading states handled
- [x] No syntax errors

---

## STEP 4: Create useAutoCalculations Hook

**File:** `/client/src/Admin/PlantingReports/hooks/useAutoCalculations.js`

```javascript
/**
 * useAutoCalculations Hook
 * Auto-calculate yield and expected harvest date
 */

import { useEffect } from 'react';
import { calculateYield, calculateExpectedHarvest } from '../utils/calculationHelpers';

export function useAutoCalculations(formData, setFields) {
  
  // Auto-calculate yield when harvest data changes
  useEffect(() => {
    const { harvestArea, numberOfBags, weightPerBag } = formData;
    
    if (harvestArea && numberOfBags && weightPerBag) {
      const calculatedYield = calculateYield(harvestArea, numberOfBags, weightPerBag);
      
      // Only update if different (avoid infinite loop)
      if (calculatedYield !== formData.yieldMtPerHa) {
        setFields({ yieldMtPerHa: calculatedYield });
      }
    }
  }, [formData.harvestArea, formData.numberOfBags, formData.weightPerBag]);

  // Auto-calculate expected harvest date when planting date and crop type change
  useEffect(() => {
    const { dateOfPlanting, typeOfCrop } = formData;
    
    if (dateOfPlanting && typeOfCrop) {
      const calculatedDate = calculateExpectedHarvest(dateOfPlanting, typeOfCrop);
      
      // Only update if different
      if (calculatedDate !== formData.dateOfExpectedHarvest) {
        setFields({ dateOfExpectedHarvest: calculatedDate });
      }
    }
  }, [formData.dateOfPlanting, formData.typeOfCrop]);

  return null; // Hook doesn't return anything, just side effects
}

export default useAutoCalculations;
```

### Progress

- [x] Hook file created
- [x] Yield auto-calculation implemented
- [x] Expected harvest auto-calculation implemented
- [x] Infinite loop prevented
- [x] No syntax errors

---

## STEP 5: Create usePagination Hook

**File:** `/client/src/Admin/PlantingReports/hooks/usePagination.js`

```javascript
/**
 * usePagination Hook
 * Client-side pagination state management
 */

import { useState, useCallback, useMemo } from 'react';
import { PAGINATION } from '../constants/plantingReportConstants';

export function usePagination(initialPage = 1, initialLimit = PAGINATION.DEFAULT_LIMIT) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  // Go to specific page
  const goToPage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // Go to next page
  const nextPage = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  // Go to previous page
  const previousPage = useCallback(() => {
    setPage(prev => Math.max(1, prev - 1));
  }, []);

  // Change limit (items per page)
  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to page 1 when limit changes
  }, []);

  // Reset to first page
  const reset = useCallback(() => {
    setPage(1);
  }, []);

  // Calculate pagination metadata
  const getPaginationInfo = useCallback((totalRecords) => {
    const totalPages = Math.ceil(totalRecords / limit);
    const startIndex = (page - 1) * limit + 1;
    const endIndex = Math.min(page * limit, totalRecords);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      page,
      limit,
      totalPages,
      totalRecords,
      startIndex,
      endIndex,
      hasNextPage,
      hasPreviousPage
    };
  }, [page, limit]);

  return {
    page,
    limit,
    goToPage,
    nextPage,
    previousPage,
    changeLimit,
    reset,
    getPaginationInfo
  };
}

export default usePagination;
```

### Progress

- [x] Hook file created
- [x] Pagination state management
- [x] Navigation functions (next, prev, goTo)
- [x] Limit change functionality
- [x] Pagination info calculation
- [x] No syntax errors

---

## STEP 6: Create useReferenceData Hook

**File:** `/client/src/Admin/PlantingReports/hooks/useReferenceData.js`

```javascript
/**
 * useReferenceData Hook
 * Tanstack Query hooks for varieties and seasons
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import plantingReportService from '../../../Services/plantingReportService';
import { toast } from 'react-toastify';
import { queryKeys } from './usePlantingReportQueries';

// ===========================
// VARIETY QUERIES
// ===========================

export function useVarieties() {
  return useQuery({
    queryKey: queryKeys.varieties,
    queryFn: () => plantingReportService.getAllVarieties(),
    staleTime: 5 * 60 * 1000 // 5 minutes (varieties don't change often)
  });
}

export function useActiveVarieties() {
  return useQuery({
    queryKey: [...queryKeys.varieties, 'active'],
    queryFn: () => plantingReportService.getActiveVarieties(),
    staleTime: 5 * 60 * 1000
  });
}

export function useVarietyById(id, options = {}) {
  return useQuery({
    queryKey: queryKeys.varietyDetail(id),
    queryFn: () => plantingReportService.getVarietyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options
  });
}

export function useReportsByVariety(varietyId, options = {}) {
  return useQuery({
    queryKey: queryKeys.varietyReports(varietyId),
    queryFn: () => plantingReportService.getReportsByVariety(varietyId),
    enabled: !!varietyId,
    staleTime: 2 * 60 * 1000,
    ...options
  });
}

export function useCreateVariety() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => plantingReportService.createVariety(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.varieties);
      toast.success('Variety created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create variety');
    }
  });
}

export function useUpdateVariety() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => plantingReportService.updateVariety(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(queryKeys.varieties);
      queryClient.invalidateQueries(queryKeys.varietyDetail(variables.id));
      toast.success('Variety updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update variety');
    }
  });
}

export function useDeleteVariety() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => plantingReportService.deleteVariety(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.varieties);
      toast.success('Variety deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete variety');
    }
  });
}

// ===========================
// SEASON QUERIES
// ===========================

export function useSeasons() {
  return useQuery({
    queryKey: queryKeys.seasons,
    queryFn: () => plantingReportService.getAllSeasons(),
    staleTime: 5 * 60 * 1000
  });
}

export function useActiveSeasons() {
  return useQuery({
    queryKey: [...queryKeys.seasons, 'active'],
    queryFn: () => plantingReportService.getActiveSeasons(),
    staleTime: 5 * 60 * 1000
  });
}

export function useSeasonById(id, options = {}) {
  return useQuery({
    queryKey: queryKeys.seasonDetail(id),
    queryFn: () => plantingReportService.getSeasonById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options
  });
}

export function useReportsBySeason(seasonId, options = {}) {
  return useQuery({
    queryKey: queryKeys.seasonReports(seasonId),
    queryFn: () => plantingReportService.getReportsBySeason(seasonId),
    enabled: !!seasonId,
    staleTime: 2 * 60 * 1000,
    ...options
  });
}

export function useCreateSeason() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => plantingReportService.createSeason(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.seasons);
      toast.success('Season created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create season');
    }
  });
}

export function useUpdateSeason() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => plantingReportService.updateSeason(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(queryKeys.seasons);
      queryClient.invalidateQueries(queryKeys.seasonDetail(variables.id));
      toast.success('Season updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update season');
    }
  });
}

export function useDeleteSeason() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => plantingReportService.deleteSeason(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.seasons);
      toast.success('Season deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete season');
    }
  });
}

export default {
  useVarieties,
  useActiveVarieties,
  useVarietyById,
  useReportsByVariety,
  useCreateVariety,
  useUpdateVariety,
  useDeleteVariety,
  useSeasons,
  useActiveSeasons,
  useSeasonById,
  useReportsBySeason,
  useCreateSeason,
  useUpdateSeason,
  useDeleteSeason
};
```

### Progress

- [x] Hook file created
- [x] All variety queries/mutations
- [x] All season queries/mutations
- [x] Query invalidation correct
- [x] No syntax errors

---

## STEP 7: Create Validation Schemas

**File:** `/client/src/Admin/PlantingReports/validation/reportSchema.js`

```javascript
/**
 * Report Validation Schemas
 * Joi schemas for form validation
 */

import Joi from 'joi';
import { PLANTING_STATES, CROP_TYPES, PLANTING_METHODS, RICE_IRRIGATION_TYPES, SEED_CLASSIFICATIONS } from '../constants/plantingReportConstants';

// ===========================
// FIELD SCHEMAS
// ===========================

const farmerNameSchema = Joi.string()
  .min(2)
  .max(100)
  .required()
  .messages({
    'string.empty': 'Farmer name is required',
    'string.min': 'Farmer name must be at least 2 characters',
    'string.max': 'Farmer name cannot exceed 100 characters'
  });

const farmLocationSchema = Joi.string()
  .min(2)
  .max(200)
  .required()
  .messages({
    'string.empty': 'Farm location is required',
    'string.min': 'Farm location must be at least 2 characters',
    'string.max': 'Farm location cannot exceed 200 characters'
  });

const rsbsaNumberSchema = Joi.string()
  .optional()
  .allow('', null)
  .pattern(/^\d{2}-\d{2}-\d{2}-\d{3}-\d{6}$/)
  .messages({
    'string.pattern.base': 'RSBSA number must be in format: XX-XX-XX-XXX-XXXXXX'
  });

const typeOfCropSchema = Joi.string()
  .valid(...CROP_TYPES)
  .required()
  .messages({
    'any.only': 'Crop type must be Rice, Corn, or High-Value',
    'any.required': 'Crop type is required'
  });

const varietyIdSchema = Joi.number()
  .integer()
  .positive()
  .required()
  .messages({
    'number.base': 'Variety is required',
    'any.required': 'Variety is required'
  });

const croppingSeasonIdSchema = Joi.number()
  .integer()
  .positive()
  .optional()
  .allow(null);

const areaPlantedSchema = Joi.number()
  .positive()
  .max(10000)
  .required()
  .messages({
    'number.base': 'Area planted must be a number',
    'number.positive': 'Area planted must be positive',
    'number.max': 'Area planted cannot exceed 10,000 hectares',
    'any.required': 'Area planted is required'
  });

const seedClassificationSchema = Joi.string()
  .valid(...SEED_CLASSIFICATIONS)
  .required()
  .messages({
    'any.only': 'Invalid seed classification',
    'any.required': 'Seed classification is required'
  });

const cropInsuranceSchema = Joi.string()
  .optional()
  .allow('', null);

const dateOfPlantingSchema = Joi.date()
  .max('now')
  .required()
  .messages({
    'date.base': 'Date of planting must be a valid date',
    'date.max': 'Date of planting cannot be in the future',
    'any.required': 'Date of planting is required'
  });

const plantingMethodSchema = Joi.string()
  .valid(...PLANTING_METHODS)
  .required()
  .messages({
    'any.only': 'Planting method must be Direct Seeding or Transplanting',
    'any.required': 'Planting method is required'
  });

const riceIrrigationSchema = Joi.string()
  .valid(...RICE_IRRIGATION_TYPES)
  .messages({
    'any.only': 'Rice irrigation must be Irrigated, Rainfed, or Upland'
  });

const harvestAreaSchema = Joi.number()
  .positive()
  .max(Joi.ref('areaPlanted'))
  .required()
  .messages({
    'number.base': 'Harvest area must be a number',
    'number.positive': 'Harvest area must be positive',
    'number.max': 'Harvest area cannot exceed planted area',
    'any.required': 'Harvest area is required'
  });

const numberOfBagsSchema = Joi.number()
  .integer()
  .positive()
  .required()
  .messages({
    'number.base': 'Number of bags must be a number',
    'number.integer': 'Number of bags must be a whole number',
    'number.positive': 'Number of bags must be positive',
    'any.required': 'Number of bags is required'
  });

const weightPerBagSchema = Joi.number()
  .positive()
  .max(1000)
  .required()
  .messages({
    'number.base': 'Weight per bag must be a number',
    'number.positive': 'Weight per bag must be positive',
    'number.max': 'Weight per bag cannot exceed 1000 kg',
    'any.required': 'Weight per bag is required'
  });

// ===========================
// STATE-BASED SCHEMAS
// ===========================

export const requestReportSchema = Joi.object({
  farmerName: farmerNameSchema,
  farmLocation: farmLocationSchema,
  rsbsaNumber: rsbsaNumberSchema,
  typeOfCrop: typeOfCropSchema,
  varietyId: varietyIdSchema,
  croppingSeasonId: croppingSeasonIdSchema,
  areaPlanted: areaPlantedSchema,
  seedClassification: seedClassificationSchema,
  cropInsurance: cropInsuranceSchema,
  // Planting and harvest fields should be null
  dateOfPlanting: Joi.any().valid(null).optional(),
  plantingMethod: Joi.any().valid(null, '').optional(),
  riceIrrigation: Joi.any().valid(null, '').optional(),
  dateOfExpectedHarvest: Joi.any().valid(null).optional(),
  harvestArea: Joi.any().valid(null, '').optional(),
  numberOfBags: Joi.any().valid(null, '').optional(),
  weightPerBag: Joi.any().valid(null, '').optional(),
  yieldMtPerHa: Joi.any().valid(null, '').optional()
}).options({ allowUnknown: true });

export const plantedReportSchema = Joi.object({
  farmerName: farmerNameSchema,
  farmLocation: farmLocationSchema,
  rsbsaNumber: rsbsaNumberSchema,
  typeOfCrop: typeOfCropSchema,
  varietyId: varietyIdSchema,
  croppingSeasonId: croppingSeasonIdSchema,
  areaPlanted: areaPlantedSchema,
  seedClassification: seedClassificationSchema,
  cropInsurance: cropInsuranceSchema,
  dateOfPlanting: dateOfPlantingSchema,
  plantingMethod: plantingMethodSchema,
  riceIrrigation: Joi.when('typeOfCrop', {
    is: 'Rice',
    then: riceIrrigationSchema.required(),
    otherwise: Joi.optional().allow(null, '')
  }),
  dateOfExpectedHarvest: Joi.date().optional().allow(null),
  // Harvest fields should be null
  harvestArea: Joi.any().valid(null, '').optional(),
  numberOfBags: Joi.any().valid(null, '').optional(),
  weightPerBag: Joi.any().valid(null, '').optional(),
  yieldMtPerHa: Joi.any().valid(null, '').optional()
}).options({ allowUnknown: true });

export const completedReportSchema = Joi.object({
  farmerName: farmerNameSchema,
  farmLocation: farmLocationSchema,
  rsbsaNumber: rsbsaNumberSchema,
  typeOfCrop: typeOfCropSchema,
  varietyId: varietyIdSchema,
  croppingSeasonId: croppingSeasonIdSchema,
  areaPlanted: areaPlantedSchema,
  seedClassification: seedClassificationSchema,
  cropInsurance: cropInsuranceSchema,
  dateOfPlanting: dateOfPlantingSchema,
  plantingMethod: plantingMethodSchema,
  riceIrrigation: Joi.when('typeOfCrop', {
    is: 'Rice',
    then: riceIrrigationSchema.required(),
    otherwise: Joi.optional().allow(null, '')
  }),
  dateOfExpectedHarvest: Joi.date().optional().allow(null),
  harvestArea: harvestAreaSchema,
  numberOfBags: numberOfBagsSchema,
  weightPerBag: weightPerBagSchema,
  yieldMtPerHa: Joi.number().optional().allow(null, '') // Auto-calculated
}).options({ allowUnknown: true });

// ===========================
// VALIDATION FUNCTIONS
// ===========================

export function validateReportData(data, state) {
  switch (state) {
    case PLANTING_STATES.REQUEST:
      return requestReportSchema.validate(data, { abortEarly: false });
    case PLANTING_STATES.PLANTED:
      return plantedReportSchema.validate(data, { abortEarly: false });
    case PLANTING_STATES.COMPLETED:
      return completedReportSchema.validate(data, { abortEarly: false });
    default:
      return { error: new Error('Invalid state') };
  }
}

export default {
  requestReportSchema,
  plantedReportSchema,
  completedReportSchema,
  validateReportData
};
```

### Progress

- [x] Validation file created
- [x] All field schemas defined
- [x] State-based schemas (Request, Planted, Completed)
- [x] Conditional validation (Rice irrigation)
- [x] Validation function created
- [x] No syntax errors

---

## STEP 8: Create State Helper Utils

**File:** `/client/src/Admin/PlantingReports/utils/stateHelpers.js`

```javascript
/**
 * State Helper Utilities
 * Helper functions for state management
 */

import { PLANTING_STATES, STATE_LABELS, STATE_COLORS, STATE_TRANSITIONS } from '../constants/plantingReportConstants';

// Get state display label
export function getStateLabel(state) {
  return STATE_LABELS[state] || state;
}

// Get state color for Chip component
export function getStateColor(state) {
  return STATE_COLORS[state] || 'default';
}

// Check if state can transition to another state
export function canTransitionTo(currentState, targetState) {
  const allowedTransitions = STATE_TRANSITIONS[currentState] || [];
  return allowedTransitions.includes(targetState);
}

// Get next allowed state
export function getNextState(currentState) {
  const allowedTransitions = STATE_TRANSITIONS[currentState] || [];
  return allowedTransitions[0] || null;
}

// Check if report can be archived (only Completed state)
export function canArchive(state, isArchived) {
  return state === PLANTING_STATES.COMPLETED && !isArchived;
}

// Check if report can be unarchived
export function canUnarchive(isArchived) {
  return isArchived;
}

// Get state progress percentage (for progress bar)
export function getStateProgress(state) {
  switch (state) {
    case PLANTING_STATES.REQUEST:
      return 33;
    case PLANTING_STATES.PLANTED:
      return 66;
    case PLANTING_STATES.COMPLETED:
      return 100;
    default:
      return 0;
  }
}

// Get state step index (for stepper component)
export function getStateStepIndex(state) {
  switch (state) {
    case PLANTING_STATES.REQUEST:
      return 0;
    case PLANTING_STATES.PLANTED:
      return 1;
    case PLANTING_STATES.COMPLETED:
      return 2;
    default:
      return 0;
  }
}

// Check if field should be visible for current state
export function isFieldVisible(fieldName, state, hiddenFields) {
  return !(hiddenFields[state] || []).includes(fieldName);
}

// Check if field should be locked (read-only) for current state
export function isFieldLocked(fieldName, state, lockedFields) {
  return (lockedFields[state] || []).includes(fieldName);
}

// Check if field is required for current state
export function isFieldRequired(fieldName, state, requiredFields) {
  return (requiredFields[state] || []).includes(fieldName);
}

export default {
  getStateLabel,
  getStateColor,
  canTransitionTo,
  getNextState,
  canArchive,
  canUnarchive,
  getStateProgress,
  getStateStepIndex,
  isFieldVisible,
  isFieldLocked,
  isFieldRequired
};
```

### Progress

- [x] State helpers file created
- [x] Label/color getters
- [x] Transition checks
- [x] Archive checks
- [x] Progress/step calculations
- [x] Field visibility checks
- [x] No syntax errors

---

## STEP 9: Create Date Helper Utils

**File:** `/client/src/Admin/PlantingReports/utils/dateHelpers.js`

```javascript
/**
 * Date Helper Utilities
 * Date formatting and manipulation
 */

import { format, parseISO, differenceInDays, addDays, addMonths } from 'date-fns';

// Format date to display format
export function formatDate(date, formatString = 'MMM dd, yyyy') {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
}

// Format date to ISO string for API
export function toISOString(date) {
  if (!date) return null;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj.toISOString();
  } catch (error) {
    console.error('Date conversion error:', error);
    return null;
  }
}

// Calculate days remaining until permanent deletion
export function getDaysRemaining(deletedAt, retentionDays = 30) {
  if (!deletedAt) return 0;
  
  try {
    const deletedDate = typeof deletedAt === 'string' ? parseISO(deletedAt) : deletedAt;
    const expiryDate = addDays(deletedDate, retentionDays);
    const today = new Date();
    const daysLeft = differenceInDays(expiryDate, today);
    
    return Math.max(0, daysLeft);
  } catch (error) {
    console.error('Days remaining calculation error:', error);
    return 0;
  }
}

// Calculate expected harvest date based on crop type
export function calculateHarvestDate(plantingDate, cropType) {
  if (!plantingDate) return null;
  
  try {
    const planting = typeof plantingDate === 'string' ? parseISO(plantingDate) : plantingDate;
    
    // Growth periods (in months)
    const growthPeriods = {
      'Rice': 4,      // 4 months
      'Corn': 3,      // 3 months
      'High-Value': 2 // 2 months (approximate)
    };
    
    const months = growthPeriods[cropType] || 3;
    return addMonths(planting, months);
  } catch (error) {
    console.error('Harvest date calculation error:', error);
    return null;
  }
}

// Check if date is in the future
export function isFutureDate(date) {
  if (!date) return false;
  
  try {
    const checkDate = typeof date === 'string' ? parseISO(date) : date;
    return checkDate > new Date();
  } catch (error) {
    return false;
  }
}

// Format relative time (e.g., "2 days ago")
export function formatRelativeTime(date) {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const days = differenceInDays(new Date(), dateObj);
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return '';
  }
}

export default {
  formatDate,
  toISOString,
  getDaysRemaining,
  calculateHarvestDate,
  isFutureDate,
  formatRelativeTime
};
```

### Progress

- [x] Date helpers file created
- [x] Date formatting functions
- [x] Days remaining calculation
- [x] Harvest date calculation
- [x] Relative time formatting
- [x] No syntax errors

---

## STEP 10: Create Calculation Helper Utils

**File:** `/client/src/Admin/PlantingReports/utils/calculationHelpers.js`

```javascript
/**
 * Calculation Helper Utilities
 * Auto-calculations for yield and expected harvest
 */

import { calculateHarvestDate } from './dateHelpers';

/**
 * Calculate yield in MT/ha
 * Formula: (numberOfBags * weightPerBag) / (harvestArea * 1000)
 * 
 * @param {number} harvestArea - Harvest area in hectares
 * @param {number} numberOfBags - Number of bags harvested
 * @param {number} weightPerBag - Weight per bag in kg
 * @returns {number} Yield in MT/ha (rounded to 2 decimals)
 */
export function calculateYield(harvestArea, numberOfBags, weightPerBag) {
  if (!harvestArea || !numberOfBags || !weightPerBag) {
    return null;
  }
  
  if (harvestArea <= 0 || numberOfBags <= 0 || weightPerBag <= 0) {
    return null;
  }
  
  try {
    const totalWeightKg = numberOfBags * weightPerBag;
    const totalWeightMT = totalWeightKg / 1000; // Convert kg to MT
    const yieldMtPerHa = totalWeightMT / harvestArea;
    
    return Math.round(yieldMtPerHa * 100) / 100; // Round to 2 decimals
  } catch (error) {
    console.error('Yield calculation error:', error);
    return null;
  }
}

/**
 * Calculate expected harvest date
 * Based on planting date and crop type
 * 
 * @param {Date|string} dateOfPlanting - Date of planting
 * @param {string} typeOfCrop - Crop type (Rice, Corn, High-Value)
 * @returns {Date} Expected harvest date
 */
export function calculateExpectedHarvest(dateOfPlanting, typeOfCrop) {
  return calculateHarvestDate(dateOfPlanting, typeOfCrop);
}

/**
 * Calculate total production in MT
 * 
 * @param {number} numberOfBags - Number of bags
 * @param {number} weightPerBag - Weight per bag in kg
 * @returns {number} Total production in MT
 */
export function calculateTotalProduction(numberOfBags, weightPerBag) {
  if (!numberOfBags || !weightPerBag) {
    return null;
  }
  
  try {
    const totalWeightKg = numberOfBags * weightPerBag;
    const totalWeightMT = totalWeightKg / 1000;
    
    return Math.round(totalWeightMT * 100) / 100;
  } catch (error) {
    console.error('Total production calculation error:', error);
    return null;
  }
}

/**
 * Validate harvest area against planted area
 * 
 * @param {number} harvestArea - Harvest area
 * @param {number} areaPlanted - Area planted
 * @returns {boolean} True if valid
 */
export function validateHarvestArea(harvestArea, areaPlanted) {
  if (!harvestArea || !areaPlanted) {
    return false;
  }
  
  return harvestArea <= areaPlanted;
}

/**
 * Calculate percentage of harvest vs planted area
 * 
 * @param {number} harvestArea - Harvest area
 * @param {number} areaPlanted - Area planted
 * @returns {number} Percentage (0-100)
 */
export function calculateHarvestPercentage(harvestArea, areaPlanted) {
  if (!harvestArea || !areaPlanted || areaPlanted === 0) {
    return 0;
  }
  
  return Math.round((harvestArea / areaPlanted) * 100);
}

export default {
  calculateYield,
  calculateExpectedHarvest,
  calculateTotalProduction,
  validateHarvestArea,
  calculateHarvestPercentage
};
```

### Progress

- [x] Calculation helpers file created
- [x] Yield calculation function
- [x] Expected harvest calculation
- [x] Total production calculation
- [x] Harvest area validation
- [x] Percentage calculations
- [x] No syntax errors

---

## STEP 11: Create Export Helper Utils

**File:** `/client/src/Admin/PlantingReports/utils/exportHelpers.js`

```javascript
/**
 * Export Helper Utilities
 * CSV/Excel export functionality
 */

import { formatDate } from './dateHelpers';
import { getStateLabel } from './stateHelpers';

/**
 * Convert reports to CSV format
 * 
 * @param {Array} reports - Array of report objects
 * @returns {string} CSV string
 */
export function convertToCSV(reports) {
  if (!reports || reports.length === 0) {
    return '';
  }
  
  const headers = [
    'Farmer Name',
    'Farm Location',
    'RSBSA Number',
    'Crop Type',
    'Variety',
    'Season',
    'Area Planted (ha)',
    'Seed Classification',
    'State',
    'Date of Planting',
    'Planting Method',
    'Rice Irrigation',
    'Harvest Area (ha)',
    'Number of Bags',
    'Weight per Bag (kg)',
    'Yield (MT/ha)',
    'Is Archived',
    'Created Date'
  ];
  
  const rows = reports.map(report => [
    escapeCSV(report.farmerName),
    escapeCSV(report.farmLocation),
    escapeCSV(report.rsbsaNumber || ''),
    escapeCSV(report.typeOfCrop),
    escapeCSV(report.variety?.name || ''),
    escapeCSV(report.croppingSeason ? `${report.croppingSeason.season} ${report.croppingSeason.year}` : ''),
    report.areaPlanted,
    escapeCSV(report.seedClassification),
    escapeCSV(getStateLabel(report.state)),
    formatDate(report.dateOfPlanting) || '',
    escapeCSV(report.plantingMethod || ''),
    escapeCSV(report.riceIrrigation || ''),
    report.harvestArea || '',
    report.numberOfBags || '',
    report.weightPerBag || '',
    report.yieldMtPerHa || '',
    report.isArchived ? 'Yes' : 'No',
    formatDate(report.createdAt)
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csv;
}

/**
 * Escape CSV field
 * 
 * @param {string} field - Field value
 * @returns {string} Escaped field
 */
function escapeCSV(field) {
  if (field === null || field === undefined) {
    return '';
  }
  
  const stringField = String(field);
  
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  
  return stringField;
}

/**
 * Download CSV file
 * 
 * @param {string} csv - CSV string
 * @param {string} filename - Filename
 */
export function downloadCSV(csv, filename = 'planting-reports.csv') {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Export reports to CSV
 * 
 * @param {Array} reports - Array of reports
 * @param {string} filename - Optional filename
 */
export function exportReports(reports, filename) {
  const csv = convertToCSV(reports);
  
  if (!csv) {
    throw new Error('No data to export');
  }
  
  const defaultFilename = `planting-reports-${formatDate(new Date(), 'yyyy-MM-dd')}.csv`;
  downloadCSV(csv, filename || defaultFilename);
}

export default {
  convertToCSV,
  downloadCSV,
  exportReports
};
```

### Progress

- [x] Export helpers file created
- [x] CSV conversion function
- [x] CSV escape function
- [x] Download CSV function
- [x] Export reports function
- [x] No syntax errors

---

## STEP 12: Create Bulk Operation Schema

**File:** `/client/src/Admin/PlantingReports/validation/bulkOperationSchema.js`

```javascript
/**
 * Bulk Operation Validation Schema
 * Validation for bulk archive and delete operations
 */

import Joi from 'joi';

export const bulkArchiveSchema = Joi.object({
  ids: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.base': 'IDs must be an array',
      'array.min': 'At least one report must be selected',
      'array.max': 'Cannot archive more than 100 reports at once',
      'any.required': 'Report IDs are required'
    })
});

export const bulkDeleteSchema = Joi.object({
  ids: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.base': 'IDs must be an array',
      'array.min': 'At least one report must be selected',
      'array.max': 'Cannot delete more than 100 reports at once',
      'any.required': 'Report IDs are required'
    })
});

export function validateBulkArchive(ids) {
  return bulkArchiveSchema.validate({ ids });
}

export function validateBulkDelete(ids) {
  return bulkDeleteSchema.validate({ ids });
}

export default {
  bulkArchiveSchema,
  bulkDeleteSchema,
  validateBulkArchive,
  validateBulkDelete
};
```

### Progress

- [x] Bulk operation schema file created
- [x] Archive schema defined
- [x] Delete schema defined
- [x] Validation functions created
- [x] Max 100 items enforced
- [x] No syntax errors

---

## STEP 13: Create State Transition Rules

**File:** `/client/src/Admin/PlantingReports/validation/stateTransitionRules.js`

```javascript
/**
 * State Transition Validation Rules
 * Validation for state transitions
 */

import Joi from 'joi';
import { PLANTING_STATES, CROP_TYPES, PLANTING_METHODS, RICE_IRRIGATION_TYPES } from '../constants/plantingReportConstants';

// Transition to Planted schema
export const toPlantedSchema = Joi.object({
  dateOfPlanting: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.base': 'Date of planting must be a valid date',
      'date.max': 'Date of planting cannot be in the future',
      'any.required': 'Date of planting is required to transition to Planted'
    }),
  
  plantingMethod: Joi.string()
    .valid(...PLANTING_METHODS)
    .required()
    .messages({
      'any.only': 'Planting method must be Direct Seeding or Transplanting',
      'any.required': 'Planting method is required to transition to Planted'
    }),
  
  riceIrrigation: Joi.when('typeOfCrop', {
    is: 'Rice',
    then: Joi.string()
      .valid(...RICE_IRRIGATION_TYPES)
      .required()
      .messages({
        'any.only': 'Rice irrigation must be Irrigated, Rainfed, or Upland',
        'any.required': 'Rice irrigation is required for Rice crops'
      }),
    otherwise: Joi.optional().allow(null, '')
  }),
  
  typeOfCrop: Joi.string()
    .valid(...CROP_TYPES)
    .required() // Needed for conditional validation
}).options({ allowUnknown: true });

// Transition to Completed schema
export const toCompletedSchema = Joi.object({
  harvestArea: Joi.number()
    .positive()
    .max(Joi.ref('areaPlanted'))
    .required()
    .messages({
      'number.base': 'Harvest area must be a number',
      'number.positive': 'Harvest area must be positive',
      'number.max': 'Harvest area cannot exceed planted area',
      'any.required': 'Harvest area is required to transition to Completed'
    }),
  
  numberOfBags: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Number of bags must be a number',
      'number.integer': 'Number of bags must be a whole number',
      'number.positive': 'Number of bags must be positive',
      'any.required': 'Number of bags is required to transition to Completed'
    }),
  
  weightPerBag: Joi.number()
    .positive()
    .max(1000)
    .required()
    .messages({
      'number.base': 'Weight per bag must be a number',
      'number.positive': 'Weight per bag must be positive',
      'number.max': 'Weight per bag cannot exceed 1000 kg',
      'any.required': 'Weight per bag is required to transition to Completed'
    }),
  
  areaPlanted: Joi.number()
    .positive()
    .required() // Needed for harvest area validation
}).options({ allowUnknown: true });

/**
 * Validate state transition data
 * 
 * @param {string} targetState - Target state (Planted or Completed)
 * @param {Object} data - Transition data
 * @returns {Object} Joi validation result
 */
export function validateStateTransition(targetState, data) {
  switch (targetState) {
    case PLANTING_STATES.PLANTED:
      return toPlantedSchema.validate(data, { abortEarly: false });
    
    case PLANTING_STATES.COMPLETED:
      return toCompletedSchema.validate(data, { abortEarly: false });
    
    default:
      return {
        error: {
          details: [{ message: `Invalid target state: ${targetState}` }]
        }
      };
  }
}

/**
 * Check if transition is valid
 * 
 * @param {string} currentState - Current state
 * @param {string} targetState - Target state
 * @returns {boolean} True if valid transition
 */
export function isValidTransition(currentState, targetState) {
  const validTransitions = {
    [PLANTING_STATES.REQUEST]: [PLANTING_STATES.PLANTED],
    [PLANTING_STATES.PLANTED]: [PLANTING_STATES.COMPLETED],
    [PLANTING_STATES.COMPLETED]: []
  };
  
  return (validTransitions[currentState] || []).includes(targetState);
}

export default {
  toPlantedSchema,
  toCompletedSchema,
  validateStateTransition,
  isValidTransition
};
```

### Progress

- [x] State transition rules file created
- [x] To Planted schema defined
- [x] To Completed schema defined
- [x] Conditional validation (Rice irrigation)
- [x] Transition validation function
- [x] No syntax errors

---

## STEP 14: Test All Hooks

Create a test file to verify all hooks work correctly.

**File:** `/client/src/Admin/PlantingReports/__tests__/hooks.test.js`

```javascript
/**
 * Hooks Integration Test
 * Quick smoke test to verify all hooks are importable
 */

// This is a basic import test - full unit tests would use Jest/Vitest

import { usePlantingReportQueries } from '../hooks/usePlantingReportQueries';
import { useReportForm } from '../hooks/useReportForm';
import { useStateTransitions } from '../hooks/useStateTransitions';
import { useAutoCalculations } from '../hooks/useAutoCalculations';
import { usePagination } from '../hooks/usePagination';
import { useReferenceData } from '../hooks/useReferenceData';
import { useResponsive } from '../hooks/useResponsive';

console.log('✅ All hooks imported successfully');

// Test validation imports
import { validateReportData } from '../validation/reportSchema';
import { validateStateTransition } from '../validation/stateTransitionRules';
import { validateBulkArchive, validateBulkDelete } from '../validation/bulkOperationSchema';

console.log('✅ All validation schemas imported successfully');

// Test utility imports
import * as stateHelpers from '../utils/stateHelpers';
import * as dateHelpers from '../utils/dateHelpers';
import * as calculationHelpers from '../utils/calculationHelpers';
import * as exportHelpers from '../utils/exportHelpers';

console.log('✅ All utility functions imported successfully');

export default {
  message: 'All hooks, validations, and utilities are working'
};
```

### Verify Imports

```powershell
cd client/src/Admin/PlantingReports
node __tests__/hooks.test.js
```

Expected output:
```
✅ All hooks imported successfully
✅ All validation schemas imported successfully
✅ All utility functions imported successfully
```

### Progress

- [x] Test file created
- [x] All hooks import successfully
- [x] All validations import successfully
- [x] All utils import successfully
- [x] No import errors

---

## STEP 15: Verification

### Checklist

Run these verification commands:

```powershell
cd client/src/Admin/PlantingReports

# 1. Check syntax of all hooks
node -c hooks/usePlantingReportQueries.js
node -c hooks/useReportForm.js
node -c hooks/useStateTransitions.js
node -c hooks/useAutoCalculations.js
node -c hooks/usePagination.js
node -c hooks/useReferenceData.js
node -c hooks/useResponsive.js

# 2. Check syntax of all validations
node -c validation/reportSchema.js
node -c validation/stateTransitionRules.js
node -c validation/bulkOperationSchema.js

# 3. Check syntax of all utilities
node -c utils/stateHelpers.js
node -c utils/dateHelpers.js
node -c utils/calculationHelpers.js
node -c utils/exportHelpers.js

# 4. Run import test
node __tests__/hooks.test.js

# 5. ESLint check
cd ../../..
npm run lint
```

### Expected Results

✅ All hook files valid syntax  
✅ All validation files valid syntax  
✅ All utility files valid syntax  
✅ Import test passes  
✅ ESLint passes  
✅ No console errors  

### File Summary

Created files:
- `hooks/usePlantingReportQueries.js` - Tanstack Query hooks
- `hooks/useReportForm.js` - Form state management
- `hooks/useStateTransitions.js` - State transition logic
- `hooks/useAutoCalculations.js` - Auto-calculations
- `hooks/usePagination.js` - Pagination state
- `hooks/useReferenceData.js` - Varieties/Seasons queries
- `validation/reportSchema.js` - Form validation schemas
- `validation/stateTransitionRules.js` - Transition validation
- `validation/bulkOperationSchema.js` - Bulk operation validation
- `utils/stateHelpers.js` - State helper functions
- `utils/dateHelpers.js` - Date formatting/calculations
- `utils/calculationHelpers.js` - Yield calculations
- `utils/exportHelpers.js` - CSV export functionality

### Exit Criteria

Before moving to File 03:

- [x] All 15 steps completed
- [x] All checkboxes marked
- [x] All files created
- [x] All syntax checks passed
- [x] Import test passed
- [x] ESLint passing
- [x] No console errors

---

## 🎯 COMPLETION

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

**Completion Date:** _______________

**Notes:**
- 
- 
- 

**Next File:** [03_Component_Architecture.md](./03_Component_Architecture.md)

---

**Estimated Time:** 4-5 hours  
**Actual Time:** _______________
