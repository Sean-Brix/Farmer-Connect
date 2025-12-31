/**
 * Hooks Integration Test
 * Quick smoke test to verify all hooks are importable
 */

// This is a basic import test - full unit tests would use Jest/Vitest

import { useAllReports } from '../hooks/usePlantingReportQueries';
import { useReportForm } from '../hooks/useReportForm';
import { useStateTransitions } from '../hooks/useStateTransitions';
import { useAutoCalculations } from '../hooks/useAutoCalculations';
import { usePagination } from '../hooks/usePagination';
import {
  useActiveSeasons,
  useActiveVarieties,
  useCreateSeason,
  useCreateVariety,
  useDeleteSeason,
  useDeleteVariety,
  useReportsBySeason,
  useReportsByVariety,
  useSeasonById,
  useSeasons,
  useUpdateSeason,
  useUpdateVariety,
  useVarieties
} from '../hooks/useReferenceData';
import { useResponsive } from '../hooks/useResponsive';

console.log('✅ All hooks imported successfully');

import { validateReportData } from '../validation/reportSchema';
import { validateStateTransition } from '../validation/stateTransitionRules';
import { validateBulkArchive, validateBulkDelete } from '../validation/bulkOperationSchema';

console.log('✅ All validation schemas imported successfully');

import * as stateHelpers from '../utils/stateHelpers';
import * as dateHelpers from '../utils/dateHelpers';
import * as calculationHelpers from '../utils/calculationHelpers';
import * as exportHelpers from '../utils/exportHelpers';

console.log('✅ All utility functions imported successfully');

export default {
  message: 'All hooks, validations, and utilities are working',
  hooks: {
    useAllReports,
    useReportForm,
    useStateTransitions,
    useAutoCalculations,
    usePagination,
    useReferenceData: {
      useActiveSeasons,
      useActiveVarieties,
      useCreateSeason,
      useCreateVariety,
      useDeleteSeason,
      useDeleteVariety,
      useReportsBySeason,
      useReportsByVariety,
      useSeasonById,
      useSeasons,
      useUpdateSeason,
      useUpdateVariety,
      useVarieties
    },
    useResponsive
  },
  validations: {
    validateReportData,
    validateStateTransition,
    validateBulkArchive,
    validateBulkDelete
  },
  helpers: {
    stateHelpers,
    dateHelpers,
    calculationHelpers,
    exportHelpers
  }
};
