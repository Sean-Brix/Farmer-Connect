/**
 * PlantingReport Feature Constants
 * Centralized constants for states, colors, pagination, and field visibility.
 */

// ======================
// STATES
// ======================

export const PLANTING_STATES = {
  PLANTING: 'Planting',
  PLANTED: 'Planted',
  HARVESTED: 'Harvested'
};

export const STATE_LABELS = {
  [PLANTING_STATES.PLANTING]: 'Planting',
  [PLANTING_STATES.PLANTED]: 'Planted',
  [PLANTING_STATES.HARVESTED]: 'Harvested'
};

export const STATE_COLORS = {
  [PLANTING_STATES.PLANTING]: 'warning', // Orange for planting
  [PLANTING_STATES.PLANTED]: 'success', // Green for planted
  [PLANTING_STATES.HARVESTED]: 'primary', // Purple for harvested
  'Distributed': 'warning', // Orange for distributed (same as planting)
  ARCHIVED: 'default', // Gray
  DELETED: 'error' // Red
};

export const STATE_TRANSITIONS = {
  [PLANTING_STATES.PLANTING]: [PLANTING_STATES.PLANTED],
  'Distributed': [PLANTING_STATES.PLANTED], // Distributed → Planted (same as Planting)
  [PLANTING_STATES.PLANTED]: [PLANTING_STATES.HARVESTED],
  [PLANTING_STATES.HARVESTED]: [] // No transitions from Harvested
};

// ======================
// TABS
// ======================

export const MAIN_TABS = {
  ALL: 'all',
  DISTRIBUTION: 'distribution',
  HARVESTED: 'harvested',
  DELETED: 'deleted'
};

export const STATE_SUB_TABS = {
  ALL: 'all',
  PLANTING: 'planting',
  PLANTED: 'planted',
  HARVESTED: 'harvested',
  ARCHIVED: 'archived'
};

// ======================
// PAGINATION
// ======================

export const PAGINATION_CONFIG = {
  defaultPageSize: 25,
  pageSizeOptions: [10, 25, 50, 100],
  maxPageSize: 100
};

// ======================
// FIELD REQUIREMENTS BY STATE
// ======================

export const REQUIRED_FIELDS = {
  [PLANTING_STATES.PLANTING]: [
    'farmerName',
    'farmLocation',
    'areaPlanted',
    'typeOfCrop',
    'varietyId',
    'croppingSeasonId',
    'seedClassification'
  ],
  [PLANTING_STATES.PLANTED]: [
    'farmerName',
    'farmLocation',
    'areaPlanted',
    'typeOfCrop',
    'varietyId',
    'croppingSeasonId',
    'seedClassification',
    'dateOfPlanting',
    'plantingMethod'
    // riceIrrigation conditional on typeOfCrop === 'Rice'
  ],
  [PLANTING_STATES.HARVESTED]: [
    'farmerName',
    'farmLocation',
    'areaPlanted',
    'typeOfCrop',
    'varietyId',
    'croppingSeasonId',
    'seedClassification',
    'dateOfPlanting',
    'plantingMethod',
    'harvestArea',
    'numberOfBags',
    'weightPerBag'
    // riceIrrigation conditional on typeOfCrop === 'Rice'
  ]
};

export const LOCKED_FIELDS = {
  [PLANTING_STATES.PLANTING]: [],
  [PLANTING_STATES.PLANTED]: [
    'farmerName',
    'farmLocation',
    'areaPlanted',
    'typeOfCrop',
    'varietyId',
    'croppingSeasonId',
    'seedClassification'
  ],
  [PLANTING_STATES.HARVESTED]: [
    'farmerName',
    'farmLocation',
    'areaPlanted',
    'typeOfCrop',
    'varietyId',
    'croppingSeasonId',
    'seedClassification',
    'dateOfPlanting',
    'plantingMethod',
    'riceIrrigation'
  ]
};

export const HIDDEN_FIELDS = {
  [PLANTING_STATES.PLANTING]: [
    'dateOfPlanting',
    'plantingMethod',
    'riceIrrigation',
    'dateOfExpectedHarvest',
    'harvestArea',
    'numberOfBags',
    'weightPerBag',
    'yieldMtPerHa'
  ],
  [PLANTING_STATES.PLANTED]: [
    'harvestArea',
    'numberOfBags',
    'weightPerBag',
    'yieldMtPerHa'
  ],
  [PLANTING_STATES.HARVESTED]: []
};

// ======================
// CROP TYPES
// ======================

export const CROP_TYPES = [
  { value: 'Rice', label: 'Rice' },
  { value: 'Corn', label: 'Corn' },
  { value: 'High_Value_Crops', label: 'High-Value Crops' }
];

export const CROP_TYPE_VALUES = CROP_TYPES.map((type) => type.value);

export const PLANTING_METHODS = ['Direct_Seeded', 'Transplanting'];

export const PLANTING_METHOD_LABELS = {
  Direct_Seeded: 'Direct Seeding',
  Transplanting: 'Transplanting'
};

export const RICE_IRRIGATION_TYPES = ['Irrigated', 'RainfedLowland'];

export const RICE_IRRIGATION_LABELS = {
  Irrigated: 'Irrigated',
  RainfedLowland: 'Rainfed Lowland'
};

export const SEED_CLASSIFICATIONS = [
  { value: 'Inbred_Certified', label: 'Inbred (Certified Seeds)' },
  { value: 'Hybrid_F1', label: 'Hybrid (F1)' },
  { value: 'Inbred_Good', label: 'Inbred (Good Seeds)' },
  { value: 'Inbred_Farmers', label: 'Inbred (Farmers Saved)' }
];

// ======================
// VALIDATION RULES
// ======================

export const VALIDATION_MESSAGES = {
  REQUIRED: (field) => `${field} is required`,
  MIN_LENGTH: (field, min) => `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field, max) => `${field} cannot exceed ${max} characters`,
  POSITIVE: (field) => `${field} must be a positive number`,
  MAX_VALUE: (field, max) => `${field} cannot exceed ${max}`,
  INVALID_DATE: (field) => `${field} must be a valid date`,
  FUTURE_DATE: (field) => `${field} cannot be in the future`,
  INVALID_TRANSITION: (from, to) => `Cannot transition from ${STATE_LABELS[from]} to ${STATE_LABELS[to]}`,
  HARVEST_EXCEEDS_PLANTED: 'Harvest area cannot exceed planted area',
  ARCHIVE_ONLY_COMPLETED: 'Only completed reports can be archived',
  UNARCHIVE_ONLY_ARCHIVED: 'Only archived reports can be unarchived'
};

// ======================
// SOFT DELETE
// ======================

export const SOFT_DELETE = {
  RETENTION_DAYS: 30,
  WARNING_DAYS: 7
};

// ======================
// BREAKPOINTS
// ======================

export const BREAKPOINTS = {
  MOBILE: 767,
  TABLET: 1023,
  DESKTOP: 1024
};

// ======================
// TABLE COLUMNS (visible/hidden based on state)
// ======================

export const TABLE_COLUMNS = {
  REGULAR: [
    { id: 'farmerName', label: 'Farmer Name', sortable: true },
    { id: 'farmLocation', label: 'Farm Location', sortable: true },
    { id: 'typeOfCrop', label: 'Crop Type', sortable: true },
    { id: 'variety', label: 'Variety', sortable: true },
    { id: 'state', label: 'State', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false }
  ],
  DISTRIBUTION: [
    { id: 'farmerName', label: 'Farmer Name', sortable: true },
    { id: 'farmLocation', label: 'Farm Location', sortable: true },
    { id: 'typeOfCrop', label: 'Crop Type', sortable: true },
    { id: 'variety', label: 'Variety', sortable: true },
    { id: 'isArchived', label: 'Status', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false }
  ],
  HARVESTED: [
    { id: 'farmerName', label: 'Farmer Name', sortable: true },
    { id: 'farmLocation', label: 'Farm Location', sortable: true },
    { id: 'typeOfCrop', label: 'Crop Type', sortable: true },
    { id: 'variety', label: 'Variety', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false }
  ],
  DELETED: [
    { id: 'farmerName', label: 'Farmer Name', sortable: true },
    { id: 'farmLocation', label: 'Farm Location', sortable: true },
    { id: 'typeOfCrop', label: 'Crop Type', sortable: true },
    { id: 'state', label: 'State', sortable: true },
    { id: 'deletedAt', label: 'Deleted Date', sortable: true },
    { id: 'daysRemaining', label: 'Days Remaining', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false }
  ]
};

export default {
  PLANTING_STATES,
  STATE_LABELS,
  STATE_COLORS,
  STATE_TRANSITIONS,
  MAIN_TABS,
  STATE_SUB_TABS,
  PAGINATION_CONFIG,
  REQUIRED_FIELDS,
  LOCKED_FIELDS,
  HIDDEN_FIELDS,
  CROP_TYPES,
  CROP_TYPE_VALUES,
  PLANTING_METHODS,
  PLANTING_METHOD_LABELS,
  RICE_IRRIGATION_TYPES,
  RICE_IRRIGATION_LABELS,
  SEED_CLASSIFICATIONS,
  VALIDATION_MESSAGES,
  SOFT_DELETE,
  BREAKPOINTS,
  TABLE_COLUMNS
};
