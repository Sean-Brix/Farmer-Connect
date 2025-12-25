# File 06: Statistics and Filters

**Purpose:** Create statistics cards, filter panel, and global search components  
**Prerequisites:** Files 01-05 completed  
**Estimated Time:** 4-5 hours  
**Target Directory:** `/client/src/Admin/PlantingReports/components/Statistics/` & `/components/Filters/`

---

## 📋 STEPS OVERVIEW

Total Steps: **10**

1. [Create StatisticsCards Component](#step-1-create-statisticscards-component)
2. [Add Responsive Grid Layout](#step-2-add-responsive-grid-layout)
3. [Integrate Real-Time Statistics](#step-3-integrate-real-time-statistics)
4. [Create FilterPanel Component](#step-4-create-filterpanel-component)
5. [Implement Crop Type Filter](#step-5-implement-crop-type-filter)
6. [Implement Variety & Season Filters](#step-6-implement-variety--season-filters)
7. [Implement Date Range Filter](#step-7-implement-date-range-filter)
8. [Add Filter Reset Functionality](#step-8-add-filter-reset-functionality)
9. [Add Mobile Filter Drawer](#step-9-add-mobile-filter-drawer)
10. [Verification](#step-10-verification)

---

## STEP 1: Create StatisticsCards Component

Replace placeholder with full implementation.

**File:** `/client/src/Admin/PlantingReports/components/Statistics/StatisticsCards.jsx`

```javascript
/**
 * StatisticsCards Component
 * Displays summary statistics of planting reports
 */

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  Description as TotalIcon,
  HourglassEmpty as RequestIcon,
  Eco as PlantedIcon,
  CheckCircle as CompletedIcon,
  Archive as ArchivedIcon,
  Delete as DeletedIcon
} from '@mui/icons-material';
import { useReportSummary } from '../../hooks/usePlantingReportQueries';
import { useResponsive } from '../../hooks/useResponsive';

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, loading }) {
  const theme = useTheme();
  
  if (loading) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={48} />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card 
      elevation={2}
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              mr: 2
            }}
          >
            <Icon />
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="h4" 
          fontWeight={700}
          color={color === 'default' ? 'text.primary' : `${color}.main`}
        >
          {value.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
}

export function StatisticsCards() {
  const { data, isLoading, error } = useReportSummary();
  const { isMobile } = useResponsive();
  
  // Default values
  const stats = {
    total: data?.total || 0,
    request: data?.byState?.request || 0,
    planted: data?.byState?.planted || 0,
    completed: data?.byState?.completed || 0,
    archived: data?.archived || 0,
    deleted: data?.deleted || 0,
    totalArea: data?.totalArea || 0
  };
  
  return (
    <Grid 
      container 
      spacing={isMobile ? 2 : 3} 
      sx={{ mb: 3 }}
    >
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <StatCard
          title="Total Reports"
          value={stats.total}
          icon={TotalIcon}
          color="primary"
          loading={isLoading}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <StatCard
          title="Request Report"
          value={stats.request}
          icon={RequestIcon}
          color="info"
          loading={isLoading}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <StatCard
          title="Planted"
          value={stats.planted}
          icon={PlantedIcon}
          color="warning"
          loading={isLoading}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CompletedIcon}
          color="success"
          loading={isLoading}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <StatCard
          title="Archived"
          value={stats.archived}
          icon={ArchivedIcon}
          color="default"
          loading={isLoading}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <StatCard
          title="Deleted"
          value={stats.deleted}
          icon={DeletedIcon}
          color="error"
          loading={isLoading}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Total Area Planted
              </Typography>
            </Box>
            {isLoading ? (
              <Skeleton variant="text" width="60%" height={48} />
            ) : (
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {stats.totalArea.toLocaleString()} <Typography component="span" variant="h6">ha</Typography>
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default StatisticsCards;
```

### Progress

- [ ] StatCard component created
- [ ] StatisticsCards component created
- [ ] useReportSummary hook integrated
- [ ] Loading skeletons implemented
- [ ] Icons added for each stat
- [ ] Hover effects implemented
- [ ] No syntax errors

---

## STEP 2: Add Responsive Grid Layout

Responsive grid breakpoints already implemented in Step 1:

**Breakpoints:**
- `xs={12}` - Mobile: 1 column (full width)
- `sm={6}` - Tablet: 2 columns
- `md={4}` - Medium desktop: 3 columns
- `lg={3}` - Large desktop: 4 columns

**Spacing:**
- Mobile: 2 (16px gap)
- Desktop: 3 (24px gap)

### Test Responsive Grid

```powershell
# Open browser DevTools (F12)
# Device Toolbar (Ctrl+Shift+M)
# Test breakpoints:
# - 320px: 1 column
# - 600px: 2 columns
# - 900px: 3 columns
# - 1200px: 4 columns
```

### Progress

- [ ] 1 column on mobile (xs)
- [ ] 2 columns on tablet (sm)
- [ ] 3 columns on medium (md)
- [ ] 4 columns on large (lg)
- [ ] Spacing responsive
- [ ] Cards equal height

---

## STEP 3: Integrate Real-Time Statistics

Statistics auto-update when reports change (via Tanstack Query cache invalidation).

**Hook Implementation:**

**File:** `/client/src/Admin/PlantingReports/hooks/usePlantingReportQueries.js`

Add `useReportSummary` hook:

```javascript
/**
 * Get report summary statistics
 */
export function useReportSummary() {
  return useQuery({
    queryKey: ['planting-reports', 'summary'],
    queryFn: async () => {
      const response = await api.getReportSummary();
      return response.data;
    },
    staleTime: 120000, // 2 minutes
    gcTime: 300000 // 5 minutes
  });
}
```

**API Endpoint:**

**File:** `/client/src/Admin/PlantingReports/utils/api.js`

Add `getReportSummary`:

```javascript
/**
 * Get report summary statistics
 */
export const getReportSummary = async () => {
  return axios.get('/api/planting-reports/summary');
};
```

### Progress

- [ ] useReportSummary hook created
- [ ] API endpoint implemented
- [ ] Statistics auto-update on mutations
- [ ] Stale time configured (2 minutes)
- [ ] Cache invalidation working

---

## STEP 4: Create FilterPanel Component

Replace placeholder with full implementation.

**File:** `/client/src/Admin/PlantingReports/components/Filters/FilterPanel.jsx`

```javascript
/**
 * FilterPanel Component
 * Contains all filters for planting reports
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Button,
  Collapse,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useResponsive } from '../../hooks/useResponsive';

// Filter Components
import GlobalSearch from './GlobalSearch';
import CropTypeFilter from './CropTypeFilter';
import VarietySeasonFilter from './VarietySeasonFilter';
import DateRangeFilter from './DateRangeFilter';

export function FilterPanel({ search, filters, onSearchChange, onFiltersChange }) {
  const { isMobile } = useResponsive();
  const theme = useTheme();
  
  // Collapse state for mobile
  const [expanded, setExpanded] = useState(!isMobile);
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };
  
  // Reset all filters
  const handleReset = () => {
    onFiltersChange({
      typeOfCrop: '',
      varietyId: '',
      croppingSeasonId: '',
      dateRange: { start: null, end: null }
    });
    onSearchChange('');
  };
  
  // Check if any filters are active
  const hasActiveFilters = 
    search !== '' ||
    filters.typeOfCrop !== '' ||
    filters.varietyId !== '' ||
    filters.croppingSeasonId !== '' ||
    filters.dateRange.start !== null ||
    filters.dateRange.end !== null;
  
  return (
    <Paper elevation={1}>
      {/* Mobile Header */}
      {isMobile && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: expanded ? 1 : 0,
            borderColor: 'divider'
          }}
        >
          <FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="subtitle1" sx={{ flex: 1 }}>
            Filters {hasActiveFilters && `(${countActiveFilters(search, filters)})`}
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => setExpanded(!expanded)}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      )}
      
      {/* Filter Content */}
      <Collapse in={expanded} timeout="auto">
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {/* Global Search */}
            <Grid item xs={12}>
              <GlobalSearch
                value={search}
                onChange={onSearchChange}
              />
            </Grid>
            
            {/* Crop Type Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <CropTypeFilter
                value={filters.typeOfCrop}
                onChange={(value) => handleFilterChange('typeOfCrop', value)}
              />
            </Grid>
            
            {/* Variety & Season Filters */}
            <Grid item xs={12} sm={6} md={3}>
              <VarietySeasonFilter
                varietyValue={filters.varietyId}
                seasonValue={filters.croppingSeasonId}
                onVarietyChange={(value) => handleFilterChange('varietyId', value)}
                onSeasonChange={(value) => handleFilterChange('croppingSeasonId', value)}
              />
            </Grid>
            
            {/* Date Range Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <DateRangeFilter
                value={filters.dateRange}
                onChange={(value) => handleFilterChange('dateRange', value)}
              />
            </Grid>
            
            {/* Reset Button */}
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleReset}
                disabled={!hasActiveFilters}
                sx={{ height: 56 }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
}

// Helper function
function countActiveFilters(search, filters) {
  let count = 0;
  if (search) count++;
  if (filters.typeOfCrop) count++;
  if (filters.varietyId) count++;
  if (filters.croppingSeasonId) count++;
  if (filters.dateRange.start || filters.dateRange.end) count++;
  return count;
}

export default FilterPanel;
```

### Progress

- [ ] FilterPanel component created
- [ ] Mobile collapse implemented
- [ ] Filter change handlers
- [ ] Reset functionality
- [ ] Active filter counter
- [ ] Responsive grid layout
- [ ] No syntax errors

---

## STEP 5: Implement Crop Type Filter

**File:** `/client/src/Admin/PlantingReports/components/Filters/CropTypeFilter.jsx`

```javascript
/**
 * CropTypeFilter Component
 * Filter by crop type (Rice, Corn, High-Value)
 */

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CROP_TYPES } from '../../constants/plantingReportConstants';

export function CropTypeFilter({ value, onChange }) {
  return (
    <FormControl fullWidth>
      <InputLabel id="crop-type-filter-label">Crop Type</InputLabel>
      <Select
        labelId="crop-type-filter-label"
        value={value}
        label="Crop Type"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">All Crops</MenuItem>
        {CROP_TYPES.map(type => (
          <MenuItem key={type.value} value={type.value}>
            {type.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CropTypeFilter;
```

**Add to constants:**

**File:** `/client/src/Admin/PlantingReports/constants/plantingReportConstants.js`

```javascript
export const CROP_TYPES = [
  { value: 'Rice', label: 'Rice' },
  { value: 'Corn', label: 'Corn' },
  { value: 'High-Value Crops', label: 'High-Value Crops' }
];
```

### Progress

- [ ] CropTypeFilter component created
- [ ] CROP_TYPES constant added
- [ ] Dropdown functional
- [ ] "All Crops" option included
- [ ] Value controlled by parent

---

## STEP 6: Implement Variety & Season Filters

**File:** `/client/src/Admin/PlantingReports/components/Filters/VarietySeasonFilter.jsx`

```javascript
/**
 * VarietySeasonFilter Component
 * Combined variety and season filters
 */

import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useVarieties, useSeasons } from '../../hooks/useReferenceQueries';

export function VarietySeasonFilter({ varietyValue, seasonValue, onVarietyChange, onSeasonChange }) {
  const { data: varieties, isLoading: loadingVarieties } = useVarieties();
  const { data: seasons, isLoading: loadingSeasons } = useSeasons();
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Variety Filter */}
      <FormControl fullWidth>
        <InputLabel id="variety-filter-label">Variety</InputLabel>
        <Select
          labelId="variety-filter-label"
          value={varietyValue}
          label="Variety"
          onChange={(e) => onVarietyChange(e.target.value)}
          disabled={loadingVarieties}
        >
          <MenuItem value="">All Varieties</MenuItem>
          {varieties?.map(variety => (
            <MenuItem key={variety.id} value={variety.id}>
              {variety.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {/* Season Filter */}
      <FormControl fullWidth>
        <InputLabel id="season-filter-label">Season</InputLabel>
        <Select
          labelId="season-filter-label"
          value={seasonValue}
          label="Season"
          onChange={(e) => onSeasonChange(e.target.value)}
          disabled={loadingSeasons}
        >
          <MenuItem value="">All Seasons</MenuItem>
          {seasons?.map(season => (
            <MenuItem key={season.id} value={season.id}>
              {season.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default VarietySeasonFilter;
```

### Progress

- [ ] VarietySeasonFilter component created
- [ ] useVarieties hook integrated
- [ ] useSeasons hook integrated
- [ ] Loading states handled
- [ ] "All" options included
- [ ] Vertical stack layout

---

## STEP 7: Implement Date Range Filter

**File:** `/client/src/Admin/PlantingReports/components/Filters/DateRangeFilter.jsx`

```javascript
/**
 * DateRangeFilter Component
 * Filter by date range (start/end)
 */

import React from 'react';
import { Box, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export function DateRangeFilter({ value, onChange }) {
  const handleStartChange = (date) => {
    onChange({ ...value, start: date });
  };
  
  const handleEndChange = (date) => {
    onChange({ ...value, end: date });
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DatePicker
          label="Start Date"
          value={value.start}
          onChange={handleStartChange}
          slotProps={{
            textField: {
              fullWidth: true,
              size: 'small'
            }
          }}
        />
        <DatePicker
          label="End Date"
          value={value.end}
          onChange={handleEndChange}
          minDate={value.start || undefined}
          slotProps={{
            textField: {
              fullWidth: true,
              size: 'small'
            }
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default DateRangeFilter;
```

**Install date picker:**

```powershell
cd client
npm install @mui/x-date-pickers date-fns
```

### Progress

- [ ] DateRangeFilter component created
- [ ] Date picker library installed
- [ ] Start/End date inputs
- [ ] End date validation (min = start date)
- [ ] LocalizationProvider configured

---

## STEP 8: Add Filter Reset Functionality

Reset functionality already implemented in Step 4 (`handleReset`).

**Reset Logic:**
- Clears all filter values to defaults
- Clears search input
- Disabled when no filters active
- Count badge shows active filter count

### Test Reset

```javascript
// In browser:
// 1. Apply multiple filters (crop type, variety, date range, search)
// 2. Verify reset button enabled
// 3. Click reset button
// 4. Verify all filters cleared
// 5. Verify reset button disabled
// 6. Verify active filter count badge disappears
```

### Progress

- [ ] Reset button clears all filters
- [ ] Reset button disabled when no filters
- [ ] Active filter count accurate
- [ ] Search cleared on reset

---

## STEP 9: Add Mobile Filter Drawer

Mobile collapse already implemented in Step 4.

**Mobile Features:**
- Collapsible filter panel
- Expand/collapse icon button
- Active filter count badge in header
- Smooth animation
- Filters stacked vertically

### Test Mobile Drawer

```powershell
# Open browser DevTools (F12)
# Device Toolbar (Ctrl+Shift+M)
# Select mobile device (375px)
# Test:
# 1. Verify filters collapsed by default
# 2. Click expand button
# 3. Verify filters expand with animation
# 4. Apply filters
# 5. Verify count badge in header
# 6. Collapse filters
# 7. Verify filters hidden but count visible
```

### Progress

- [ ] Filters collapsed by default on mobile
- [ ] Expand/collapse button working
- [ ] Smooth animation
- [ ] Active filter count in header
- [ ] Touch-friendly targets (44px minimum)

---

## STEP 10: Verification

### Checklist

```powershell
# 1. Start dev server
cd client
npm run dev

# 2. Navigate to PlantingReports

# 3. Test Statistics Cards
# - Verify all 7 cards display
# - Verify loading skeletons
# - Verify responsive grid (1→2→3→4 columns)
# - Verify hover effects
# - Verify icons and colors

# 4. Test Filter Panel
# - Desktop: Verify filters always visible
# - Mobile: Verify collapse/expand working

# 5. Test Global Search
# - Type in search box
# - Verify debounce (500ms)
# - Verify table updates

# 6. Test Crop Type Filter
# - Select "Rice"
# - Verify table filters
# - Select "All Crops"
# - Verify table shows all

# 7. Test Variety/Season Filters
# - Select variety
# - Verify table filters
# - Select season
# - Verify table filters

# 8. Test Date Range Filter
# - Select start date
# - Select end date
# - Verify end date >= start date
# - Verify table filters

# 9. Test Reset
# - Apply multiple filters
# - Click reset
# - Verify all filters cleared

# 10. Test Mobile
# - Resize to 375px
# - Verify collapse/expand
# - Verify all filters work
# - Verify touch targets

# 11. Check console
# No errors
```

### Expected Results

✅ Statistics cards display correctly  
✅ Responsive grid (1→2→3→4 columns)  
✅ Loading skeletons show while loading  
✅ Filter panel renders  
✅ Global search works with debounce  
✅ Crop type filter works  
✅ Variety/Season filters work  
✅ Date range filter works  
✅ Reset button clears all filters  
✅ Mobile collapse/expand working  
✅ Active filter count accurate  
✅ No console errors  

### Exit Criteria

Before moving to File 07:

- [x] All 10 steps completed
- [x] All checkboxes marked
- [x] Statistics displaying correctly
- [x] All filters functional
- [x] Reset working
- [x] Mobile responsive
- [x] No console errors

---

## 🎯 COMPLETION

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

**Completion Date:** _______________

**Notes:**
- 
- 

**Next File:** [07_Pagination.md](./07_Pagination.md)

---

**Estimated Time:** 4-5 hours  
**Actual Time:** _______________
