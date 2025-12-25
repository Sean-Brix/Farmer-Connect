# File 01: Setup and Dependencies

**Purpose:** Install required packages, setup folder structure, configure tooling  
**Prerequisites:** Backend implementation complete  
**Estimated Time:** 2-3 hours  
**Target Directory:** `/client/src/`

---

## 📋 STEPS OVERVIEW

Total Steps: **12**

1. [Install Required Dependencies](#step-1-install-required-dependencies)
2. [Create Folder Structure](#step-2-create-folder-structure)
3. [Setup Tanstack Query](#step-3-setup-tanstack-query)
4. [Configure ESLint Rules](#step-4-configure-eslint-rules)
5. [Create Constants File](#step-5-create-constants-file)
6. [Create API Service](#step-6-create-api-service)
7. [Create Theme Configuration](#step-7-create-theme-configuration)
8. [Setup i18n for PlantingReports](#step-8-setup-i18n-for-plantingreports)
9. [Create TypeScript Interfaces](#step-9-create-typescript-interfaces)
10. [Setup React Query DevTools](#step-10-setup-react-query-devtools)
11. [Configure Responsive Breakpoints](#step-11-configure-responsive-breakpoints)
12. [Verification](#step-12-verification)

---

## STEP 1: Install Required Dependencies

### Required Packages

```powershell
cd client
npm install @tanstack/react-query@^5.0.0
npm install @tanstack/react-query-devtools@^5.0.0
npm install joi@^17.11.0
npm install date-fns@^3.0.0
npm install react-toastify@^10.0.0
```

### Verify Installation

```powershell
npm list @tanstack/react-query
npm list joi date-fns react-toastify
```

Expected output:
```
client@0.0.0
├── @tanstack/react-query@5.x.x
├── @tanstack/react-query-devtools@5.x.x
├── joi@17.x.x
├── date-fns@3.x.x
└── react-toastify@10.x.x
```

### Progress

- [ ] Dependencies installed
- [ ] Versions verified
- [ ] No installation errors
- [ ] package.json updated

---

## STEP 2: Create Folder Structure

### Directory Tree

Create the following structure under `/client/src/Admin/PlantingReports/`:

```
client/src/Admin/PlantingReports/
├── components/
│   ├── Tables/
│   │   ├── RegularReportsTable.jsx
│   │   ├── DistributionReportsTable.jsx
│   │   ├── DeletedReportsTable.jsx
│   │   └── MobileReportCard.jsx
│   ├── ReportModal/
│   │   ├── index.jsx
│   │   ├── StateWorkflowIndicator.jsx
│   │   ├── FarmerInfoSection.jsx
│   │   ├── SeedingDetailsSection.jsx
│   │   ├── PlantingDetailsSection.jsx
│   │   ├── HarvestingSection.jsx
│   │   └── DistributionMetadataSection.jsx
│   ├── ReferenceManagementPanel/
│   │   ├── index.jsx
│   │   ├── VarietiesTab.jsx
│   │   ├── SeasonsTab.jsx
│   │   ├── VarietyModal.jsx
│   │   ├── SeasonModal.jsx
│   │   └── ViewReportsModal.jsx
│   ├── Filters/
│   │   ├── FilterPanel.jsx
│   │   └── GlobalSearch.jsx
│   ├── Statistics/
│   │   └── StatisticsCards.jsx
│   └── Pagination/
│       └── PaginationControls.jsx
├── hooks/
│   ├── usePlantingReportQueries.js
│   ├── useReportForm.js
│   ├── useStateTransitions.js
│   ├── useAutoCalculations.js
│   ├── usePagination.js
│   └── useReferenceData.js
├── validation/
│   ├── reportSchema.js
│   ├── stateTransitionRules.js
│   └── bulkOperationSchema.js
├── utils/
│   ├── stateHelpers.js
│   ├── dateHelpers.js
│   ├── calculationHelpers.js
│   └── exportHelpers.js
├── constants/
│   └── plantingReportConstants.js
└── PlantingReports.jsx (main orchestrator)
```

### PowerShell Command

```powershell
cd client/src/Admin/PlantingReports

# Create component folders
New-Item -ItemType Directory -Path "components/Tables" -Force
New-Item -ItemType Directory -Path "components/ReportModal" -Force
New-Item -ItemType Directory -Path "components/ReferenceManagementPanel" -Force
New-Item -ItemType Directory -Path "components/Filters" -Force
New-Item -ItemType Directory -Path "components/Statistics" -Force
New-Item -ItemType Directory -Path "components/Pagination" -Force

# Create utility folders
New-Item -ItemType Directory -Path "hooks" -Force
New-Item -ItemType Directory -Path "validation" -Force
New-Item -ItemType Directory -Path "utils" -Force
New-Item -ItemType Directory -Path "constants" -Force

# Create placeholder files (will be implemented in later steps)
@(
  "components/Tables/RegularReportsTable.jsx",
  "components/Tables/DistributionReportsTable.jsx",
  "components/Tables/DeletedReportsTable.jsx",
  "components/Tables/MobileReportCard.jsx",
  "components/ReportModal/index.jsx",
  "components/ReportModal/StateWorkflowIndicator.jsx",
  "components/ReportModal/FarmerInfoSection.jsx",
  "components/ReportModal/SeedingDetailsSection.jsx",
  "components/ReportModal/PlantingDetailsSection.jsx",
  "components/ReportModal/HarvestingSection.jsx",
  "components/ReportModal/DistributionMetadataSection.jsx",
  "components/ReferenceManagementPanel/index.jsx",
  "components/ReferenceManagementPanel/VarietiesTab.jsx",
  "components/ReferenceManagementPanel/SeasonsTab.jsx",
  "components/ReferenceManagementPanel/VarietyModal.jsx",
  "components/ReferenceManagementPanel/SeasonModal.jsx",
  "components/ReferenceManagementPanel/ViewReportsModal.jsx",
  "components/Filters/FilterPanel.jsx",
  "components/Filters/GlobalSearch.jsx",
  "components/Statistics/StatisticsCards.jsx",
  "components/Pagination/PaginationControls.jsx",
  "hooks/usePlantingReportQueries.js",
  "hooks/useReportForm.js",
  "hooks/useStateTransitions.js",
  "hooks/useAutoCalculations.js",
  "hooks/usePagination.js",
  "hooks/useReferenceData.js",
  "validation/reportSchema.js",
  "validation/stateTransitionRules.js",
  "validation/bulkOperationSchema.js",
  "utils/stateHelpers.js",
  "utils/dateHelpers.js",
  "utils/calculationHelpers.js",
  "utils/exportHelpers.js",
  "constants/plantingReportConstants.js"
) | ForEach-Object { New-Item -ItemType File -Path $_ -Force }
```

### Verify Structure

```powershell
tree /F components
tree /F hooks
tree /F validation
tree /F utils
tree /F constants
```

### Progress

- [ ] All folders created
- [ ] All placeholder files created
- [ ] Directory structure verified
- [ ] No file system errors

---

## STEP 3: Setup Tanstack Query

### Update `main.jsx`

Add QueryClientProvider to wrap the app.

**File:** `/client/src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import './i18n';

// Configure QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes (NOT 10 minutes!)
      gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    },
    mutations: {
      retry: 0
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### Progress

- [ ] QueryClientProvider added to main.jsx
- [ ] ReactQueryDevtools configured
- [ ] ToastContainer added
- [ ] StaleTime set to 2 minutes (NOT 10)
- [ ] No import errors

---

## STEP 4: Configure ESLint Rules

### Update `eslint.config.js`

Add rule to prevent monolithic components.

**File:** `/client/eslint.config.js`

Add this rule:

```javascript
export default {
  // ... existing config
  rules: {
    // ... existing rules
    'max-lines': ['warn', {
      max: 250,
      skipBlankLines: true,
      skipComments: true
    }],
    'react/jsx-max-depth': ['warn', { max: 5 }],
    'complexity': ['warn', { max: 15 }]
  }
};
```

### Verify ESLint

```powershell
npm run lint
```

### Progress

- [ ] ESLint rules added
- [ ] max-lines set to 250
- [ ] Linting passes
- [ ] No ESLint errors

---

## STEP 5: Create Constants File

### File: `constants/plantingReportConstants.js`

```javascript
/**
 * PlantingReport Feature Constants
 * Centralized constants for states, colors, pagination, etc.
 */

// ======================
// STATES
// ======================

export const PLANTING_STATES = {
  REQUEST: 'Request_Report',
  PLANTED: 'Planted',
  COMPLETED: 'Completed'
};

export const STATE_LABELS = {
  [PLANTING_STATES.REQUEST]: 'Request',
  [PLANTING_STATES.PLANTED]: 'Planted',
  [PLANTING_STATES.COMPLETED]: 'Completed'
};

export const STATE_COLORS = {
  [PLANTING_STATES.REQUEST]: 'info',      // Blue
  [PLANTING_STATES.PLANTED]: 'warning',   // Orange
  [PLANTING_STATES.COMPLETED]: 'success', // Green
  ARCHIVED: 'default',                    // Gray
  DELETED: 'error'                        // Red
};

export const STATE_TRANSITIONS = {
  [PLANTING_STATES.REQUEST]: [PLANTING_STATES.PLANTED],
  [PLANTING_STATES.PLANTED]: [PLANTING_STATES.COMPLETED],
  [PLANTING_STATES.COMPLETED]: [] // No transitions from Completed
};

// ======================
// TABS
// ======================

export const MAIN_TABS = {
  ALL: 'all',
  DISTRIBUTION: 'distribution',
  DELETED: 'deleted'
};

export const STATE_SUB_TABS = {
  ALL: 'all',
  REQUEST: 'request',
  PLANTED: 'planted',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

// ======================
// PAGINATION
// ======================

export const PAGINATION = {
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 100,
  LIMIT_OPTIONS: [10, 25, 50, 100]
};

// ======================
// FIELD REQUIREMENTS BY STATE
// ======================

export const REQUIRED_FIELDS = {
  [PLANTING_STATES.REQUEST]: [
    'farmerName',
    'farmLocation',
    'areaPlanted',
    'typeOfCrop',
    'varietyId',
    'seedClassification'
  ],
  [PLANTING_STATES.PLANTED]: [
    'farmerName',
    'farmLocation',
    'areaPlanted',
    'typeOfCrop',
    'varietyId',
    'seedClassification',
    'dateOfPlanting',
    'plantingMethod'
    // riceIrrigation conditional on typeOfCrop === 'Rice'
  ],
  [PLANTING_STATES.COMPLETED]: [
    'farmerName',
    'farmLocation',
    'areaPlanted',
    'typeOfCrop',
    'varietyId',
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
  [PLANTING_STATES.REQUEST]: [],
  [PLANTING_STATES.PLANTED]: [
    'farmerName',
    'farmLocation',
    'areaPlanted',
    'typeOfCrop',
    'varietyId',
    'seedClassification'
  ],
  [PLANTING_STATES.COMPLETED]: [
    'farmerName',
    'farmLocation',
    'areaPlanted',
    'typeOfCrop',
    'varietyId',
    'seedClassification',
    'dateOfPlanting',
    'plantingMethod',
    'riceIrrigation'
  ]
};

export const HIDDEN_FIELDS = {
  [PLANTING_STATES.REQUEST]: [
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
  [PLANTING_STATES.COMPLETED]: []
};

// ======================
// CROP TYPES
// ======================

export const CROP_TYPES = ['Rice', 'Corn', 'High-Value'];

export const PLANTING_METHODS = ['Direct Seeding', 'Transplanting'];

export const RICE_IRRIGATION_TYPES = ['Irrigated', 'Rainfed', 'Upland'];

export const SEED_CLASSIFICATIONS = [
  'Certified',
  'Good',
  'Registered',
  'Foundation',
  'Breeder'
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
    { id: 'areaPlanted', label: 'Area (ha)', sortable: true },
    { id: 'state', label: 'State', sortable: true },
    { id: 'isArchived', label: 'Status', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false }
  ],
  DISTRIBUTION: [
    { id: 'farmerName', label: 'Farmer Name', sortable: true },
    { id: 'farmLocation', label: 'Farm Location', sortable: true },
    { id: 'typeOfCrop', label: 'Crop Type', sortable: true },
    { id: 'variety', label: 'Variety', sortable: true },
    { id: 'areaPlanted', label: 'Area (ha)', sortable: true },
    { id: 'distributionRequest', label: 'Distribution #', sortable: true },
    { id: 'state', label: 'State', sortable: true },
    { id: 'isArchived', label: 'Status', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false }
  ],
  DELETED: [
    { id: 'farmerName', label: 'Farmer Name', sortable: true },
    { id: 'farmLocation', label: 'Farm Location', sortable: true },
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
  PAGINATION,
  REQUIRED_FIELDS,
  LOCKED_FIELDS,
  HIDDEN_FIELDS,
  CROP_TYPES,
  PLANTING_METHODS,
  RICE_IRRIGATION_TYPES,
  SEED_CLASSIFICATIONS,
  VALIDATION_MESSAGES,
  SOFT_DELETE,
  BREAKPOINTS,
  TABLE_COLUMNS
};
```

### Verify Constants

```powershell
# Check syntax
node -c constants/plantingReportConstants.js
```

### Progress

- [ ] Constants file created
- [ ] All constants defined
- [ ] No syntax errors
- [ ] File imports successfully

---

## STEP 6: Create API Service

### File: `/client/src/Services/plantingReportService.js`

```javascript
/**
 * PlantingReport API Service
 * All API calls for planting reports
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  async getAllReports({ page = 1, limit = 25, state, isArchived, distributionLinked, search }) {
    const params = {
      page,
      limit,
      ...(state && { state }),
      ...(isArchived !== undefined && { isArchived }),
      ...(distributionLinked !== undefined && { distributionLinked }),
      ...(search && { search })
    };
    const response = await api.get('/planting-reports/reports', { params });
    return response.data;
  },

  // Get deleted reports
  async getDeletedReports({ page = 1, limit = 25 }) {
    const params = { page, limit };
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
    const response = await api.post(`/planting-reports/reports/${id}/restore`);
    return response.data;
  },

  // ===========================
  // STATE TRANSITIONS
  // ===========================

  // Transition to Planted
  async transitionToPlanted(id, data) {
    const response = await api.post(`/planting-reports/reports/${id}/transition/planted`, data);
    return response.data;
  },

  // Transition to Completed
  async transitionToCompleted(id, data) {
    const response = await api.post(`/planting-reports/reports/${id}/transition/completed`, data);
    return response.data;
  },

  // ===========================
  // ARCHIVE
  // ===========================

  // Archive report (only Completed state)
  async archiveReport(id) {
    const response = await api.post(`/planting-reports/reports/${id}/archive`);
    return response.data;
  },

  // Unarchive report
  async unarchiveReport(id) {
    const response = await api.post(`/planting-reports/reports/${id}/unarchive`);
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

  // ===========================
  // VARIETIES & SEASONS
  // ===========================

  // Get all varieties
  async getAllVarieties() {
    const response = await api.get('/varieties');
    return response.data;
  },

  // Get active varieties
  async getActiveVarieties() {
    const response = await api.get('/varieties/active');
    return response.data;
  },

  // Get variety by ID
  async getVarietyById(id) {
    const response = await api.get(`/varieties/${id}`);
    return response.data;
  },

  // Create variety
  async createVariety(data) {
    const response = await api.post('/varieties', data);
    return response.data;
  },

  // Update variety
  async updateVariety(id, data) {
    const response = await api.put(`/varieties/${id}`, data);
    return response.data;
  },

  // Delete variety
  async deleteVariety(id) {
    const response = await api.delete(`/varieties/${id}`);
    return response.data;
  },

  // Get reports using variety
  async getReportsByVariety(varietyId) {
    const response = await api.get(`/varieties/${varietyId}/reports`);
    return response.data;
  },

  // Get all seasons
  async getAllSeasons() {
    const response = await api.get('/seasons');
    return response.data;
  },

  // Get active seasons
  async getActiveSeasons() {
    const response = await api.get('/seasons/active');
    return response.data;
  },

  // Get season by ID
  async getSeasonById(id) {
    const response = await api.get(`/seasons/${id}`);
    return response.data;
  },

  // Create season
  async createSeason(data) {
    const response = await api.post('/seasons', data);
    return response.data;
  },

  // Update season
  async updateSeason(id, data) {
    const response = await api.put(`/seasons/${id}`, data);
    return response.data;
  },

  // Delete season
  async deleteSeason(id) {
    const response = await api.delete(`/seasons/${id}`);
    return response.data;
  },

  // Get reports using season
  async getReportsBySeason(seasonId) {
    const response = await api.get(`/seasons/${seasonId}/reports`);
    return response.data;
  }
};

export default plantingReportService;
```

### Verify API Service

```powershell
node -c src/Services/plantingReportService.js
```

### Progress

- [ ] API service file created
- [ ] All endpoints defined
- [ ] Axios configured with credentials
- [ ] No syntax errors
- [ ] Imports work

---

## STEP 7: Create Theme Configuration

### File: `/client/src/Admin/PlantingReports/theme/plantingReportTheme.js`

```javascript
/**
 * PlantingReport Theme Configuration
 * Custom Material-UI theme for responsive design
 */

import { createTheme } from '@mui/material/styles';

export const plantingReportTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue for Request state
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#ed6c02', // Orange for Planted state
      light: '#ff9800',
      dark: '#e65100'
    },
    success: {
      main: '#2e7d32', // Green for Completed state
      light: '#4caf50',
      dark: '#1b5e20'
    },
    error: {
      main: '#d32f2f', // Red for Deleted state
      light: '#ef5350',
      dark: '#c62828'
    },
    warning: {
      main: '#ed6c02'
    },
    info: {
      main: '#1976d2'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontSize: '2rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '2.375rem'
      }
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '1.75rem'
      }
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '1.5rem'
      }
    },
    body1: {
      fontSize: '1rem'
    },
    body2: {
      fontSize: '0.875rem'
    },
    caption: {
      fontSize: '0.75rem'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,  // Tablet
      lg: 1024, // Desktop
      xl: 1280
    }
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          minHeight: 44, // Touch-friendly
          '@media (max-width:767px)': {
            fontSize: '0.875rem'
          }
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true
      },
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            minHeight: 44 // Touch-friendly
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          '@media (max-width:767px)': {
            padding: '8px 12px',
            fontSize: '0.875rem'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          minHeight: 32
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          '@media (max-width:767px)': {
            margin: 16,
            width: 'calc(100% - 32px)',
            maxHeight: 'calc(100% - 32px)'
          }
        }
      }
    }
  }
});

export default plantingReportTheme;
```

### Create Theme Folder

```powershell
cd client/src/Admin/PlantingReports
New-Item -ItemType Directory -Path "theme" -Force
New-Item -ItemType File -Path "theme/plantingReportTheme.js" -Force
```

### Verify Theme

```powershell
node -c theme/plantingReportTheme.js
```

### Progress

- [ ] Theme folder created
- [ ] Theme file created
- [ ] Breakpoints configured (md: 768px, lg: 1024px)
- [ ] Touch-friendly sizes (44px min height)
- [ ] No syntax errors

---

## STEP 8: Setup i18n for PlantingReports

### File: `/client/src/locales/en/plantingReports.json`

```json
{
  "plantingReports": {
    "title": "Planting Reports",
    "subtitle": "Manage farmer planting reports and state transitions",
    
    "tabs": {
      "all": "All Reports",
      "distribution": "Distribution Reports",
      "deleted": "Deleted Reports"
    },
    
    "stateTabs": {
      "all": "All",
      "request": "Request",
      "planted": "Planted",
      "completed": "Completed",
      "archived": "Archived"
    },
    
    "states": {
      "Request_Report": "Request",
      "Planted": "Planted",
      "Completed": "Completed"
    },
    
    "actions": {
      "create": "Create Report",
      "edit": "Edit Report",
      "view": "View Details",
      "delete": "Delete",
      "restore": "Restore",
      "archive": "Archive",
      "unarchive": "Unarchive",
      "bulkArchive": "Archive Selected",
      "bulkDelete": "Delete Selected",
      "export": "Export",
      "transitionToPlanted": "Mark as Planted",
      "transitionToCompleted": "Mark as Completed"
    },
    
    "fields": {
      "farmerName": "Farmer Name",
      "farmLocation": "Farm Location",
      "rsbsaNumber": "RSBSA Number",
      "typeOfCrop": "Type of Crop",
      "variety": "Variety",
      "season": "Cropping Season",
      "areaPlanted": "Area Planted (ha)",
      "seedClassification": "Seed Classification",
      "cropInsurance": "Crop Insurance",
      "dateOfPlanting": "Date of Planting",
      "plantingMethod": "Planting Method",
      "riceIrrigation": "Rice Irrigation Type",
      "dateOfExpectedHarvest": "Expected Harvest Date",
      "harvestArea": "Harvest Area (ha)",
      "numberOfBags": "Number of Bags",
      "weightPerBag": "Weight per Bag (kg)",
      "yieldMtPerHa": "Yield (MT/ha)"
    },
    
    "messages": {
      "createSuccess": "Report created successfully",
      "updateSuccess": "Report updated successfully",
      "deleteSuccess": "Report deleted successfully",
      "restoreSuccess": "Report restored successfully",
      "archiveSuccess": "Report archived successfully",
      "unarchiveSuccess": "Report unarchived successfully",
      "transitionSuccess": "State transition successful",
      "bulkArchiveSuccess": "{{count}} reports archived",
      "bulkDeleteSuccess": "{{count}} reports deleted",
      "error": "An error occurred. Please try again.",
      "noData": "No reports found",
      "deleteConfirm": "Are you sure you want to delete this report? It will be permanently deleted after 30 days.",
      "restoreConfirm": "Restore this report?",
      "archiveConfirm": "Archive this report? It will be moved to the Archived tab.",
      "permanentDeleteWarning": "This report will be permanently deleted in {{days}} days."
    }
  }
}
```

### Update `/client/src/i18n.js`

Add planting reports namespace:

```javascript
import plantingReportsEn from './locales/en/plantingReports.json';
import plantingReportsFil from './locales/fil/plantingReports.json';

// ... existing i18n config

resources: {
  en: {
    translation: translationEn,
    plantingReports: plantingReportsEn.plantingReports
  },
  fil: {
    translation: translationFil,
    plantingReports: plantingReportsFil.plantingReports
  }
}
```

### Create Filipino Translation

**File:** `/client/src/locales/fil/plantingReports.json`

```json
{
  "plantingReports": {
    "title": "Mga Ulat sa Pagtatanim",
    "subtitle": "Pamahalaan ang mga ulat ng magsasaka at mga pagbabago ng estado",
    
    "tabs": {
      "all": "Lahat ng Ulat",
      "distribution": "Mga Ulat ng Distribusyon",
      "deleted": "Mga Binurang Ulat"
    },
    
    "stateTabs": {
      "all": "Lahat",
      "request": "Kahilingan",
      "planted": "Nagtanim Na",
      "completed": "Kumpleto",
      "archived": "Naka-archive"
    },
    
    "states": {
      "Request_Report": "Kahilingan",
      "Planted": "Nagtanim Na",
      "Completed": "Kumpleto"
    }
  }
}
```

### Verify i18n

```powershell
# Check JSON syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('src/locales/en/plantingReports.json')))"
```

### Progress

- [ ] English translations created
- [ ] Filipino translations created
- [ ] i18n.js updated
- [ ] JSON syntax valid
- [ ] Namespace added

---

## STEP 9: Create TypeScript Interfaces

Even though we're using JavaScript, we'll create JSDoc type definitions for better IDE support.

### File: `/client/src/Admin/PlantingReports/types/plantingReport.types.js`

```javascript
/**
 * @typedef {'Request_Report' | 'Planted' | 'Completed'} PlantingReportState
 */

/**
 * @typedef {'Rice' | 'Corn' | 'High-Value'} CropType
 */

/**
 * @typedef {'Direct Seeding' | 'Transplanting'} PlantingMethod
 */

/**
 * @typedef {'Irrigated' | 'Rainfed' | 'Upland'} RiceIrrigationType
 */

/**
 * @typedef {'Certified' | 'Good' | 'Registered' | 'Foundation' | 'Breeder'} SeedClassification
 */

/**
 * @typedef {Object} PlantingReport
 * @property {number} id
 * @property {string} farmerName
 * @property {string} farmLocation
 * @property {string|null} rsbsaNumber
 * @property {CropType} typeOfCrop
 * @property {number} varietyId
 * @property {Object} variety
 * @property {string} variety.name
 * @property {number|null} croppingSeasonId
 * @property {Object|null} croppingSeason
 * @property {string|null} croppingSeason.season
 * @property {number} croppingSeason.year
 * @property {number} areaPlanted
 * @property {SeedClassification} seedClassification
 * @property {string|null} cropInsurance
 * @property {PlantingReportState} state
 * @property {string|null} dateOfPlanting
 * @property {PlantingMethod|null} plantingMethod
 * @property {RiceIrrigationType|null} riceIrrigation
 * @property {string|null} dateOfExpectedHarvest
 * @property {number|null} harvestArea
 * @property {number|null} numberOfBags
 * @property {number|null} weightPerBag
 * @property {number|null} yieldMtPerHa
 * @property {boolean} isArchived
 * @property {boolean} isDeleted
 * @property {string|null} deletedAt
 * @property {number|null} distributionRequestId
 * @property {Object|null} distributionRequest
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} page
 * @property {number} limit
 * @property {PlantingReportState|null} state
 * @property {boolean|null} isArchived
 * @property {boolean|null} distributionLinked
 * @property {string|null} search
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {PlantingReport[]} data
 * @property {Object} pagination
 * @property {number} pagination.currentPage
 * @property {number} pagination.totalPages
 * @property {number} pagination.totalRecords
 * @property {number} pagination.limit
 * @property {boolean} pagination.hasNextPage
 * @property {boolean} pagination.hasPreviousPage
 */

/**
 * @typedef {Object} Statistics
 * @property {number} total
 * @property {number} request
 * @property {number} planted
 * @property {number} completed
 * @property {number} archived
 * @property {number} deleted
 * @property {number} distributionLinked
 * @property {number} totalAreaPlanted
 * @property {number} totalYield
 */

export {};
```

### Create Types Folder

```powershell
cd client/src/Admin/PlantingReports
New-Item -ItemType Directory -Path "types" -Force
New-Item -ItemType File -Path "types/plantingReport.types.js" -Force
```

### Verify Types

```powershell
node -c types/plantingReport.types.js
```

### Progress

- [ ] Types folder created
- [ ] Type definitions created
- [ ] JSDoc syntax valid
- [ ] No syntax errors

---

## STEP 10: Setup React Query DevTools

Already configured in main.jsx (Step 3), but verify it's working.

### Test DevTools

1. Start the dev server:
   ```powershell
   cd client
   npm run dev
   ```

2. Open browser to `http://localhost:5173`

3. Look for React Query DevTools button (bottom-right corner)

4. Click to open DevTools panel

5. Should see empty query cache (no queries yet)

### Progress

- [ ] DevTools button visible
- [ ] DevTools panel opens
- [ ] No console errors
- [ ] Query cache empty (expected)

---

## STEP 11: Configure Responsive Breakpoints

### Create Responsive Hook

**File:** `/client/src/Admin/PlantingReports/hooks/useResponsive.js`

```javascript
/**
 * useResponsive Hook
 * Helper hook for responsive design
 */

import { useMediaQuery, useTheme } from '@mui/material';

export function useResponsive() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));      // 0-767px
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 768-1023px
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));       // 1024px+

  const isSmallScreen = useMediaQuery('(max-width:600px)');          // Extra small
  const isMediumScreen = useMediaQuery('(min-width:600px) and (max-width:1023px)');
  const isLargeScreen = useMediaQuery('(min-width:1024px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
}

export default useResponsive;
```

### Verify Hook

```powershell
node -c hooks/useResponsive.js
```

### Progress

- [ ] useResponsive hook created
- [ ] Breakpoint logic correct (md: 768px, lg: 1024px)
- [ ] No syntax errors
- [ ] Hook exports

---

## STEP 12: Verification

### Checklist

Run these commands to verify everything is set up correctly:

```powershell
# 1. Verify dependencies
npm list @tanstack/react-query joi date-fns react-toastify

# 2. Verify folder structure
cd src/Admin/PlantingReports
tree /F components
tree /F hooks
tree /F validation
tree /F utils
tree /F constants
tree /F types
tree /F theme

# 3. Check syntax of all created files
node -c constants/plantingReportConstants.js
node -c hooks/useResponsive.js
node -c types/plantingReport.types.js
node -c theme/plantingReportTheme.js
node -c ../../Services/plantingReportService.js

# 4. Verify i18n files
node -e "console.log(JSON.parse(require('fs').readFileSync('../../locales/en/plantingReports.json')))"

# 5. Start dev server
npm run dev
```

### Browser Verification

1. Open `http://localhost:5173`
2. Open browser DevTools (F12)
3. Check Console - no errors
4. Check React Query DevTools button (bottom-right)
5. Verify responsive breakpoints:
   - Resize to 320px (mobile)
   - Resize to 768px (tablet)
   - Resize to 1024px (desktop)

### Expected Results

✅ All dependencies installed  
✅ Folder structure created  
✅ All placeholder files exist  
✅ Constants file valid  
✅ API service file valid  
✅ Theme file valid  
✅ i18n files valid (English + Filipino)  
✅ Type definitions valid  
✅ useResponsive hook valid  
✅ React Query DevTools working  
✅ No console errors  
✅ ESLint passing  

### Exit Criteria

Before moving to File 02:

- [x] All 12 steps completed
- [x] All checkboxes marked
- [x] Dev server running without errors
- [x] React Query DevTools visible
- [x] No console warnings
- [x] Folder structure verified
- [x] ESLint passing

---

## 🎯 COMPLETION

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

**Completion Date:** _______________

**Notes:**
- 
- 
- 

**Next File:** [02_Hooks_and_Utilities.md](./02_Hooks_and_Utilities.md)

---

**Estimated Time:** 2-3 hours  
**Actual Time:** _______________
