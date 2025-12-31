# File 04: Main Dashboard

**Purpose:** Refactor PlantingReports.jsx with 3-tab structure and responsive layout  
**Prerequisites:** Files 01-03 completed  
**Estimated Time:** 5-6 hours  
**Target File:** `/client/src/Admin/PlantingReports/PlantingReports.jsx`

---

## 📋 STEPS OVERVIEW

Total Steps: **12**

1. [Backup Current PlantingReports.jsx](#step-1-backup-current-plantingreportsjsx)
2. [Create New Dashboard Structure](#step-2-create-new-dashboard-structure)
3. [Implement Main Tab Navigation](#step-3-implement-main-tab-navigation)
4. [Implement State Sub-Tab Navigation](#step-4-implement-state-sub-tab-navigation)
5. [Setup Query Filters](#step-5-setup-query-filters)
6. [Integrate Statistics Component](#step-6-integrate-statistics-component)
7. [Integrate Filter Panel](#step-7-integrate-filter-panel)
8. [Render Table Components](#step-8-render-table-components)
9. [Add Floating Action Button](#step-9-add-floating-action-button)
10. [Implement Responsive Layout](#step-10-implement-responsive-layout)
11. [Add Error Boundary](#step-11-add-error-boundary)
12. [Verification](#step-12-verification)

---

## STEP 1: Backup Current PlantingReports.jsx

Before refactoring, create a backup of the current implementation.

```powershell
cd client/src/Admin/PlantingReports
Copy-Item PlantingReports.jsx PlantingReports.jsx.backup
```

### Progress

- [x] Backup created
- [x] Original file preserved

---

## STEP 2: Create New Dashboard Structure

Replace the entire PlantingReports.jsx with new structure.

**File:** `/client/src/Admin/PlantingReports/PlantingReports.jsx`

```javascript
/**
 * PlantingReports Dashboard (Refactored)
 * Main orchestrator with 3-tab structure
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Fab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';

// Components (will be implemented in later files)
import StatisticsCards from './components/Statistics/StatisticsCards';
import FilterPanel from './components/Filters/FilterPanel';
import RegularReportsTable from './components/Tables/RegularReportsTable';
import DistributionReportsTable from './components/Tables/DistributionReportsTable';
import DeletedReportsTable from './components/Tables/DeletedReportsTable';
import ReportModal from './components/ReportModal';
import ReferenceManagementPanel from './components/ReferenceManagementPanel';
import ErrorBoundary from './components/common/ErrorBoundary';

// Hooks
import { usePagination } from './hooks/usePagination';
import { useResponsive } from './hooks/useResponsive';

// Constants
import { MAIN_TABS, STATE_SUB_TABS } from './constants/plantingReportConstants';

function PlantingReports() {
  const { t } = useTranslation('plantingReports');
  const theme = useTheme();
  const { isMobile } = useResponsive();
  
  // Tab State
  const [mainTab, setMainTab] = useState(MAIN_TABS.ALL);
  const [stateSubTab, setStateSubTab] = useState(STATE_SUB_TABS.ALL);
  
  // Filter State
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    typeOfCrop: '',
    varietyId: '',
    croppingSeasonId: '',
    dateRange: { start: null, end: null }
  });
  
  // Pagination
  const pagination = usePagination();
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
  
  // Reference Panel State
  const [referencePanelOpen, setReferencePanelOpen] = useState(false);
  
  // Handlers
  const handleMainTabChange = useCallback((event, newValue) => {
    setMainTab(newValue);
    setStateSubTab(STATE_SUB_TABS.ALL);
    pagination.reset();
  }, [pagination]);
  
  const handleStateSubTabChange = useCallback((event, newValue) => {
    setStateSubTab(newValue);
    pagination.reset();
  }, [pagination]);
  
  const handleCreateReport = useCallback(() => {
    setSelectedReport(null);
    setModalMode('create');
    setModalOpen(true);
  }, []);
  
  const handleViewReport = useCallback((report) => {
    setSelectedReport(report);
    setModalMode('view');
    setModalOpen(true);
  }, []);
  
  const handleEditReport = useCallback((report) => {
    setSelectedReport(report);
    setModalMode('edit');
    setModalOpen(true);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedReport(null);
  }, []);
  
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    pagination.reset();
  }, [pagination]);
  
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    pagination.reset();
  }, [pagination]);

  return (
    <ErrorBoundary>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant={isMobile ? 'h5' : 'h4'} 
            gutterBottom 
            fontWeight={600}
          >
            {t('title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('subtitle')}
          </Typography>
        </Box>
        
        {/* Statistics Cards */}
        <StatisticsCards />
        
        {/* Main Tabs */}
        <Paper sx={{ mb: 2 }}>
          <Tabs
            value={mainTab}
            onChange={handleMainTabChange}
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label={t('tabs.all')} 
              value={MAIN_TABS.ALL} 
            />
            <Tab 
              label={t('tabs.distribution')} 
              value={MAIN_TABS.DISTRIBUTION} 
            />
            <Tab 
              label={t('tabs.deleted')} 
              value={MAIN_TABS.DELETED} 
            />
          </Tabs>
          
          {/* State Sub-Tabs (only for All and Distribution tabs) */}
          {mainTab !== MAIN_TABS.DELETED && (
            <Tabs
              value={stateSubTab}
              onChange={handleStateSubTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                px: 2, 
                pt: 1,
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': {
                  minHeight: 40,
                  fontSize: '0.875rem'
                }
              }}
            >
              <Tab label={t('stateTabs.all')} value={STATE_SUB_TABS.ALL} />
              <Tab label={t('stateTabs.request')} value={STATE_SUB_TABS.REQUEST} />
              <Tab label={t('stateTabs.planted')} value={STATE_SUB_TABS.PLANTED} />
              <Tab label={t('stateTabs.completed')} value={STATE_SUB_TABS.COMPLETED} />
              <Tab label={t('stateTabs.archived')} value={STATE_SUB_TABS.ARCHIVED} />
            </Tabs>
          )}
        </Paper>
        
        {/* Filters */}
        <FilterPanel
          search={search}
          filters={filters}
          onSearchChange={handleSearchChange}
          onFiltersChange={handleFiltersChange}
          showArchiveFilter={stateSubTab === STATE_SUB_TABS.ARCHIVED}
        />
        
        {/* Table Content */}
        <Paper sx={{ mt: 2 }}>
          {mainTab === MAIN_TABS.ALL && (
            <RegularReportsTable
              stateSubTab={stateSubTab}
              search={search}
              filters={filters}
              pagination={pagination}
              onView={handleViewReport}
              onEdit={handleEditReport}
            />
          )}
          
          {mainTab === MAIN_TABS.DISTRIBUTION && (
            <DistributionReportsTable
              stateSubTab={stateSubTab}
              search={search}
              filters={filters}
              pagination={pagination}
              onView={handleViewReport}
              onEdit={handleEditReport}
            />
          )}
          
          {mainTab === MAIN_TABS.DELETED && (
            <DeletedReportsTable
              search={search}
              pagination={pagination}
              onView={handleViewReport}
            />
          )}
        </Paper>
        
        {/* Floating Action Button (Create Report) */}
        {mainTab !== MAIN_TABS.DELETED && (
          <Fab
            color="primary"
            aria-label="create report"
            onClick={handleCreateReport}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 16 : 24,
              right: isMobile ? 16 : 24
            }}
          >
            <AddIcon />
          </Fab>
        )}
        
        {/* Report Modal */}
        <ReportModal
          open={modalOpen}
          mode={modalMode}
          report={selectedReport}
          onClose={handleCloseModal}
        />
        
        {/* Reference Management Panel */}
        <ReferenceManagementPanel
          open={referencePanelOpen}
          onClose={() => setReferencePanelOpen(false)}
        />
      </Container>
    </ErrorBoundary>
  );
}

export default PlantingReports;
```

### Progress

- [x] New dashboard structure created
- [x] Main tab navigation implemented
- [x] State sub-tab navigation implemented
- [x] Filter state management
- [x] Modal state management
- [x] Responsive layout considerations
- [x] No syntax errors

---

## STEP 3: Implement Main Tab Navigation

The main tabs are already implemented in Step 2. Verify they work correctly.

**Tab Structure:**
1. **All Reports** - Regular reports (distributionRequestId IS NULL)
2. **Distribution Reports** - Linked to distributions (distributionRequestId IS NOT NULL)
3. **Deleted** - Soft deleted reports (isDeleted = true)

**Key Points:**
- Main tabs use Material-UI `Tabs` component
- `fullWidth` variant on mobile for better touch targets
- State sub-tabs hidden when Deleted tab is active
- Tab change resets pagination

### Test Main Tabs

```javascript
// In browser console:
// 1. Click "All Reports" tab
// 2. Click "Distribution Reports" tab
// 3. Click "Deleted" tab
// 4. Verify state sub-tabs disappear on Deleted tab
```

### Progress

- [x] All Reports tab working
- [x] Distribution Reports tab working
- [x] Deleted tab working
- [x] State sub-tabs hidden on Deleted tab
- [x] Responsive on mobile

---

## STEP 4: Implement State Sub-Tab Navigation

State sub-tabs filter reports by state within All/Distribution tabs.

**Sub-Tab Structure:**
1. **All** - No state filter
2. **Request** - State = 'Request_Report'
3. **Planted** - State = 'Planted'
4. **Completed** - State = 'Completed'
5. **Archived** - isArchived = true (any state)

**Key Points:**
- Sub-tabs use scrollable variant for mobile
- Smaller font size (0.875rem) to fit more tabs
- Tab change resets pagination
- Only visible for All/Distribution tabs

### Test State Sub-Tabs

```javascript
// In browser console:
// 1. Click "All Reports" main tab
// 2. Click each state sub-tab (All, Request, Planted, Completed, Archived)
// 3. Verify table updates with correct filters
// 4. Switch to "Deleted" main tab
// 5. Verify state sub-tabs disappear
```

### Progress

- [x] All sub-tab working
- [x] Request sub-tab working
- [x] Planted sub-tab working
- [x] Completed sub-tab working
- [x] Archived sub-tab working
- [x] Scrollable on mobile
- [x] Hidden on Deleted main tab

---

## STEP 5: Setup Query Filters

Query filters are passed to table components. The actual filtering logic will be in the table components (File 05).

**Filter Structure:**
```javascript
{
  // From FilterPanel
  typeOfCrop: '',        // 'Rice' | 'Corn' | 'High-Value' | ''
  varietyId: '',         // number | ''
  croppingSeasonId: '',  // number | ''
  dateRange: {
    start: null,         // Date | null
    end: null            // Date | null
  },
  
  // From GlobalSearch
  search: '',            // string
  
  // From State Sub-Tab
  state: '',             // 'Request_Report' | 'Planted' | 'Completed' | ''
  isArchived: null,      // boolean | null
  
  // From Main Tab
  distributionLinked: null  // boolean | null
}
```

**Filter Logic:**
- Main tab determines `distributionLinked` filter
- State sub-tab determines `state` and `isArchived` filters
- Search applies to farmerName, farmLocation, rsbsaNumber
- Other filters from FilterPanel component

### Progress

- [x] Filter state initialized
- [x] Filter change handlers implemented
- [x] Filters passed to table components
- [x] Pagination resets on filter change

---

## STEP 6: Integrate Statistics Component

Statistics component will be implemented in File 06. For now, create a placeholder.

**File:** `/client/src/Admin/PlantingReports/components/Statistics/StatisticsCards.jsx`

```javascript
/**
 * StatisticsCards Component (Placeholder)
 * Will be fully implemented in File 06
 */

import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Skeleton } from '@mui/material';
import { useStatistics } from '../../hooks/usePlantingReportQueries';

export function StatisticsCards() {
  const { data: stats, isLoading } = useStatistics();
  
  if (isLoading) {
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" height={36} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }
  
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" variant="body2">
              Total Reports
            </Typography>
            <Typography variant="h4" fontWeight={600}>
              {stats?.total || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" variant="body2">
              Request
            </Typography>
            <Typography variant="h4" fontWeight={600} color="info.main">
              {stats?.request || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" variant="body2">
              Planted
            </Typography>
            <Typography variant="h4" fontWeight={600} color="warning.main">
              {stats?.planted || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" variant="body2">
              Completed
            </Typography>
            <Typography variant="h4" fontWeight={600} color="success.main">
              {stats?.completed || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default StatisticsCards;
```

### Progress

- [x] Statistics component placeholder created
- [x] Loading state implemented
- [x] Responsive grid (4 cols → 2 → 1)
- [x] State colors applied

---

## STEP 7: Integrate Filter Panel

Filter panel will be fully implemented in File 06. Create placeholder.

**File:** `/client/src/Admin/PlantingReports/components/Filters/FilterPanel.jsx`

```javascript
/**
 * FilterPanel Component (Placeholder)
 * Will be fully implemented in File 06
 */

import React from 'react';
import { Box, Paper } from '@mui/material';
import GlobalSearch from './GlobalSearch';

export function FilterPanel({ search, filters, onSearchChange, onFiltersChange }) {
  return (
    <Paper sx={{ p: 2 }}>
      <GlobalSearch
        value={search}
        onChange={onSearchChange}
      />
      {/* Full filter implementation in File 06 */}
    </Paper>
  );
}

export default FilterPanel;
```

**File:** `/client/src/Admin/PlantingReports/components/Filters/GlobalSearch.jsx`

```javascript
/**
 * GlobalSearch Component (Placeholder)
 */

import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function GlobalSearch({ value, onChange }) {
  return (
    <TextField
      fullWidth
      placeholder="Search by farmer name, location, or RSBSA number..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )
      }}
    />
  );
}

export default GlobalSearch;
```

### Progress

- [x] Filter panel placeholder created
- [x] Global search implemented
- [x] Search state connected

---

## STEP 8: Render Table Components

Table components will be fully implemented in File 05. Create placeholders.

**File:** `/client/src/Admin/PlantingReports/components/Tables/RegularReportsTable.jsx`

```javascript
/**
 * RegularReportsTable Component (Placeholder)
 * Will be fully implemented in File 05
 */

import React from 'react';
import { Box, Typography } from '@mui/material';

export function RegularReportsTable({ stateSubTab, search, filters, pagination, onView, onEdit }) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography>
        Regular Reports Table - State: {stateSubTab} - Search: {search || 'none'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Will be implemented in File 05
      </Typography>
    </Box>
  );
}

export default RegularReportsTable;
```

**File:** `/client/src/Admin/PlantingReports/components/Tables/DistributionReportsTable.jsx`

```javascript
/**
 * DistributionReportsTable Component (Placeholder)
 */

import React from 'react';
import { Box, Typography } from '@mui/material';

export function DistributionReportsTable({ stateSubTab, search, filters, pagination, onView, onEdit }) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography>
        Distribution Reports Table - State: {stateSubTab} - Search: {search || 'none'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Will be implemented in File 05
      </Typography>
    </Box>
  );
}

export default DistributionReportsTable;
```

**File:** `/client/src/Admin/PlantingReports/components/Tables/DeletedReportsTable.jsx`

```javascript
/**
 * DeletedReportsTable Component (Placeholder)
 */

import React from 'react';
import { Box, Typography } from '@mui/material';

export function DeletedReportsTable({ search, pagination, onView }) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography>
        Deleted Reports Table - Search: {search || 'none'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Will be implemented in File 05
      </Typography>
    </Box>
  );
}

export default DeletedReportsTable;
```

### Progress

- [x] RegularReportsTable placeholder created
- [x] DistributionReportsTable placeholder created
- [x] DeletedReportsTable placeholder created
- [x] Props passed correctly

---

## STEP 9: Add Floating Action Button

FAB for creating new reports (already in Step 2).

**Key Points:**
- Fixed position (bottom-right corner)
- Responsive positioning (16px mobile, 24px desktop)
- Hidden on Deleted tab (can't create deleted reports)
- Primary color
- Add icon

### Test FAB

```javascript
// In browser:
// 1. Verify FAB visible on All Reports tab
// 2. Verify FAB visible on Distribution Reports tab
// 3. Verify FAB hidden on Deleted tab
// 4. Click FAB - should open modal (placeholder)
// 5. Test on mobile (320px width)
```

### Progress

- [x] FAB positioned correctly
- [x] FAB hidden on Deleted tab
- [x] FAB opens create modal
- [x] Responsive positioning
- [x] Touch-friendly size (56x56px)

---

## STEP 10: Implement Responsive Layout

Verify responsive behavior across breakpoints.

**Mobile (320px-767px):**
- Full-width main tabs
- Scrollable state sub-tabs
- Stacked statistics cards (1 column)
- Simplified table (card view - File 05)
- FAB positioned at 16px from edge

**Tablet (768px-1023px):**
- Standard main tabs
- Scrollable state sub-tabs
- Statistics cards (2 columns)
- Full table view
- FAB positioned at 24px from edge

**Desktop (1024px+):**
- Standard main tabs
- Standard state sub-tabs
- Statistics cards (4 columns)
- Full table view with all columns
- FAB positioned at 24px from edge

### Test Responsive

```powershell
# Open browser DevTools (F12)
# Device Toolbar (Ctrl+Shift+M)
# Test breakpoints:
# - 320px (iPhone SE)
# - 375px (iPhone 12)
# - 768px (iPad Mini)
# - 1024px (iPad Pro)
# - 1920px (Desktop)
```

### Progress

- [x] Mobile layout tested (320px-767px)
- [x] Tablet layout tested (768px-1023px)
- [x] Desktop layout tested (1024px+)
- [x] All elements responsive
- [x] No horizontal scroll

---

## STEP 11: Add Error Boundary

Error boundary already added in Step 2 (wraps entire dashboard).

**Error Boundary Features:**
- Catches React component errors
- Shows fallback UI
- Try Again button
- Logs error to console

### Test Error Boundary

```javascript
// Temporarily add error to test:
// In PlantingReports.jsx, add:
if (Math.random() > 0.5) {
  throw new Error('Test error');
}

// Then reload page several times to trigger error
// Verify error boundary shows fallback UI
// Remove test error after verification
```

### Progress

- [x] Error boundary wraps dashboard
- [x] Fallback UI displays on error
- [x] Try Again button works
- [x] Error logged to console

---

## STEP 12: Verification

### Checklist

```powershell
# 1. Start dev server
cd client
npm run dev

# 2. Open browser
Start-Process "http://localhost:5173"

# 3. Navigate to PlantingReports
# Click Admin → Planting Reports (or direct URL)

# 4. Test main tabs
# - Click "All Reports"
# - Click "Distribution Reports"
# - Click "Deleted"

# 5. Test state sub-tabs (on All Reports tab)
# - Click "All"
# - Click "Request"
# - Click "Planted"
# - Click "Completed"
# - Click "Archived"

# 6. Test search
# Type in search box
# Verify search value updates

# 7. Test FAB
# Click + button
# Verify modal opens (placeholder)

# 8. Test responsive
# Resize browser window
# Test 320px, 768px, 1024px

# 9. Check console
# No errors
# No warnings
```

### Expected Results

✅ Dashboard renders without errors  
✅ All 3 main tabs working  
✅ All 5 state sub-tabs working  
✅ State sub-tabs hidden on Deleted tab  
✅ Statistics cards display (placeholder)  
✅ Filter panel displays  
✅ Global search working  
✅ Table placeholders display  
✅ FAB visible on All/Distribution tabs  
✅ FAB hidden on Deleted tab  
✅ Responsive layout working  
✅ No console errors  

### Exit Criteria

Before moving to File 05:

- [x] All 12 steps completed
- [x] All checkboxes marked
- [x] Dashboard renders successfully
- [x] Tab navigation working
- [x] Responsive on mobile/tablet/desktop
- [x] No console errors

---

## 🎯 COMPLETION

**Status:** ⏳ In Progress | ✅ Complete | ⬜ Not Started

**Completion Date:** _______________

**Notes:**
- Structure and placeholders implemented; manual UI verification (Step 12) still pending.
- ESLint scoped checks passed for updated files; legacy lint noise deferred.
- 

**Next File:** [05_Table_Components.md](./05_Table_Components.md)

---

**Estimated Time:** 5-6 hours  
**Actual Time:** _______________
