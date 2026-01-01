import { PLANTING_STATES } from '../constants/plantingReportConstants';

/**
 * Get modal title based on mode and state.
 */
export const getModalTitle = (mode, state) => {
  if (mode === 'create') {
    return 'Create New Planting Report';
  }

  if (mode === 'view') {
    return `View Planting Report - ${getStateLabel(state)}`;
  }

  if (mode === 'edit') {
    return `Edit Planting Report - ${getStateLabel(state)}`;
  }

  return 'Planting Report';
};

function getStateLabel(state) {
  const labels = {
    [PLANTING_STATES.PLANTING]: 'Planting',
    [PLANTING_STATES.PLANTED]: 'Planted',
    [PLANTING_STATES.HARVESTED]: 'Harvested'
  };

  return labels[state] || state || 'Unknown';
}

/**
 * Determine which sections should be visible for the given state.
 * - Planting/Distributed: Farmer Info + Seeding Details + Planting Details (in edit/create mode)
 * - Planted: Farmer Info + Seeding Details + Planting Details
 * - Planted (edit mode): + Harvesting (to allow transition to Harvested)
 * - Harvested: All sections
 */
export const getVisibleSections = (state, mode = 'view') => {
  // "Distributed" state is equivalent to "Planting" state (for distribution-linked reports)
  const isPlantingState = state === PLANTING_STATES.PLANTING || state === 'Distributed';
  
  const visibility = {
    farmerInfo: true,
    seedingDetails: true,
    // Show planting details when Planted/Harvested, OR when editing/creating Planting/Distributed (to fill for transition)
    plantingDetails: 
      state === PLANTING_STATES.PLANTED || 
      state === PLANTING_STATES.HARVESTED || 
      (isPlantingState && (mode === 'edit' || mode === 'create')),
    // Show harvesting when Harvested, OR when editing Planted (to fill for transition)
    harvesting: 
      state === PLANTING_STATES.HARVESTED || 
      (state === PLANTING_STATES.PLANTED && mode === 'edit'),
    distributionMetadata: true
  };
  
  console.log('🔍 [Modal Visibility]', { state, mode, isPlantingState, visibility });
  
  return visibility;
};

/**
 * Determine which sections should be read-only for the given state and mode.
 * All sections are editable in edit mode regardless of state.
 * Only view mode or archived/deleted reports are read-only.
 */
export const getReadOnlySections = (state, mode, isArchived = false, isDeleted = false) => {
  // Only make read-only if in view mode OR if archived/deleted
  if (mode === 'view' || isArchived || isDeleted) {
    return {
      farmerInfo: true,
      seedingDetails: true,
      plantingDetails: true,
      harvesting: true,
      distributionMetadata: true
    };
  }

  // In edit mode, allow editing all sections regardless of state
  return {
    farmerInfo: false,
    seedingDetails: false,
    plantingDetails: false,
    harvesting: false,
    distributionMetadata: false
  };
};
