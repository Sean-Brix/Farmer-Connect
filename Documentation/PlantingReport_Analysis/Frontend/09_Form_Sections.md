# File 09: Form Sections

**Purpose:** Create form section components for ReportModal  
**Prerequisites:** Files 01-08 completed  
**Estimated Time:** 6-7 hours  
**Target Directory:** `/client/src/Admin/PlantingReports/components/ReportModal/`

---

## 📋 STEPS OVERVIEW

Total Steps: **15**

1. [Create FarmerInfoSection](#step-1-create-farmerinfosection)
2. [Create FarmerSelector Autocomplete](#step-2-create-farmerselector-autocomplete)
3. [Create SeedingDetailsSection](#step-3-create-seedingdetailssection)
4. [Add VarietySelector](#step-4-add-varietyselector)
5. [Add SeasonSelector](#step-5-add-seasonselector)
6. [Create PlantingDetailsSection](#step-6-create-plantingdetailssection)
7. [Add Date Picker Integration](#step-7-add-date-picker-integration)
8. [Create HarvestingSection](#step-8-create-harvestingsection)
9. [Add Auto-Calculated Fields](#step-9-add-auto-calculated-fields)
10. [Create DistributionMetadata](#step-10-create-distributionmetadata)
11. [Add Field Validation Display](#step-11-add-field-validation-display)
12. [Add Required Field Indicators](#step-12-add-required-field-indicators)
13. [Add Tooltip Help Text](#step-13-add-tooltip-help-text)
14. [Implement Responsive 2-Column Grid](#step-14-implement-responsive-2-column-grid)
15. [Verification](#step-15-verification)

---

## STEP 1: Create FarmerInfoSection

**File:** `/client/src/Admin/PlantingReports/components/ReportModal/FarmerInfoSection.jsx`

```javascript
/**
 * FarmerInfoSection Component
 * Farmer selection and contact information
 */

import React from 'react';
import { Box, Typography, Grid, TextField } from '@mui/material';
import FarmerSelector from './FarmerSelector';

export function FarmerInfoSection({ data, errors, onChange, onBlur, readOnly }) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Farmer Information
      </Typography>
      
      <Grid container spacing={2}>
        {/* Farmer Selector (Create mode only) */}
        {!readOnly ? (
          <Grid item xs={12}>
            <FarmerSelector
              value={data.farmerId}
              onChange={(farmer) => {
                onChange('farmerId', farmer?.id || '');
                onChange('farmerName', farmer?.name || '');
                onChange('contactNumber', farmer?.contactNumber || '');
                onChange('rsbsaNumber', farmer?.rsbsaNumber || '');
              }}
              error={!!errors.farmerId}
              helperText={errors.farmerId}
            />
          </Grid>
        ) : (
          <>
            {/* Farmer Name (Read-only in edit/view) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Farmer Name"
                value={data.farmerName || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            
            {/* Contact Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number"
                value={data.contactNumber || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            
            {/* RSBSA Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="RSBSA Number"
                value={data.rsbsaNumber || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}

export default FarmerInfoSection;
```

### Progress

- [x] FarmerInfoSection component created
- [x] Farmer selector integration
- [x] Read-only display for edit/view mode
- [x] Contact info fields
- [x] RSBSA number field
- [x] 2-column grid layout
- [x] Error display
- [x] No syntax errors

---

## STEP 2: Create FarmerSelector Autocomplete

**File:** `/client/src/Admin/PlantingReports/components/ReportModal/FarmerSelector.jsx`

```javascript
/**
 * FarmerSelector Component
 * Autocomplete for farmer selection
 */

import React, { useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useFarmers } from '../../hooks/useReferenceQueries';
import { useDebounce } from '../../hooks/useDebounce';

export function FarmerSelector({ value, onChange, error, helperText }) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  const { data: farmers, isLoading } = useFarmers({ search: debouncedSearch });
  
  return (
    <Autocomplete
      options={farmers || []}
      getOptionLabel={(option) => `${option.name} - ${option.rsbsaNumber || 'No RSBSA'}`}
      value={farmers?.find(f => f.id === value) || null}
      onChange={(event, newValue) => onChange(newValue)}
      onInputChange={(event, newInputValue) => setSearch(newInputValue)}
      loading={isLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Farmer *"
          error={error}
          helperText={helperText || 'Search by name or RSBSA number'}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  );
}

export default FarmerSelector;
```

### Progress

- [x] FarmerSelector component created
- [x] Autocomplete with search
- [x] Debounced search (300ms)
- [x] Loading indicator
- [x] Option label format
- [x] Error/helper text support
- [x] Required indicator (*)

---

## STEP 3: Create SeedingDetailsSection

Create the section for seeding/planting configuration details.

**File:** `/client/src/Admin/PlantingReports/components/ReportModal/SeedingDetailsSection.jsx`

```javascript
/**
 * SeedingDetailsSection Component
 * Crop type, variety, season, area, and seeds details
 */

import React from 'react';
import { Box, Typography, Grid, TextField, MenuItem } from '@mui/material';
import VarietySelector from './VarietySelector';
import SeasonSelector from './SeasonSelector';
import { CROP_TYPES } from '../../constants/plantingReportConstants';

export function SeedingDetailsSection({ data, errors, onChange, onBlur, readOnly }) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Seeding Details
      </Typography>
      
      <Grid container spacing={2}>
        {/* Crop Type */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            required
            label="Type of Crop"
            value={data.typeOfCrop || ''}
            onChange={(e) => onChange('typeOfCrop', e.target.value)}
            onBlur={() => onBlur('typeOfCrop')}
            error={!!errors.typeOfCrop}
            helperText={errors.typeOfCrop}
            InputProps={{ readOnly }}
          >
            {CROP_TYPES.map((crop) => (
              <MenuItem key={crop.value} value={crop.value}>
                {crop.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        {/* Variety Selector */}
        <Grid item xs={12} sm={6}>
          <VarietySelector
            cropType={data.typeOfCrop}
            value={data.varietyId}
            onChange={(variety) => onChange('varietyId', variety?.id || '')}
            error={!!errors.varietyId}
            helperText={errors.varietyId}
            readOnly={readOnly}
          />
        </Grid>
        
        {/* Season Selector */}
        <Grid item xs={12} sm={6}>
          <SeasonSelector
            value={data.seasonId}
            onChange={(season) => onChange('seasonId', season?.id || '')}
            error={!!errors.seasonId}
            helperText={errors.seasonId}
            readOnly={readOnly}
          />
        </Grid>
        
        {/* Area Planted */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type="number"
            label="Area Planted (hectares)"
            value={data.areaPlanted || ''}
            onChange={(e) => onChange('areaPlanted', e.target.value)}
            onBlur={() => onBlur('areaPlanted')}
            error={!!errors.areaPlanted}
            helperText={errors.areaPlanted || 'Enter area in hectares (e.g., 2.5)'}
            InputProps={{ 
              readOnly,
              inputProps: { min: 0, step: 0.01 }
            }}
          />
        </Grid>
        
        {/* Seeds per Square Meter */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type="number"
            label="Seeds per Square Meter"
            value={data.seedsPerSqm || ''}
            onChange={(e) => onChange('seedsPerSqm', e.target.value)}
            onBlur={() => onBlur('seedsPerSqm')}
            error={!!errors.seedsPerSqm}
            helperText={errors.seedsPerSqm || 'Recommended: 150-200 seeds/sqm'}
            InputProps={{ 
              readOnly,
              inputProps: { min: 0, step: 1 }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SeedingDetailsSection;
```

### Progress

- [x] SeedingDetailsSection component created
- [x] Crop type dropdown
- [x] Variety selector integration
- [x] Season selector integration
- [x] Area planted (number input)
- [x] Seeds per sqm (integer input)
- [x] 2-column grid layout
- [x] Helper text for guidance
- [x] Required indicators (*)
- [x] Error display

---

## STEP 4: Add VarietySelector

Create dropdown for variety selection filtered by crop type.

**File:** `/client/src/Admin/PlantingReports/components/ReportModal/VarietySelector.jsx`

```javascript
/**
 * VarietySelector Component
 * Dropdown for selecting crop variety (filtered by crop type)
 */

import React from 'react';
import { TextField, MenuItem, CircularProgress } from '@mui/material';
import { useVarieties } from '../../hooks/useReferenceQueries';

export function VarietySelector({ cropType, value, onChange, error, helperText, readOnly }) {
  const { data: varieties, isLoading } = useVarieties({ cropType, isActive: true });
  
  const selectedVariety = varieties?.find(v => v.id === value);
  
  if (readOnly) {
    return (
      <TextField
        fullWidth
        label="Variety"
        value={selectedVariety?.name || 'N/A'}
        InputProps={{ readOnly: true }}
      />
    );
  }
  
  return (
    <TextField
      select
      fullWidth
      required
      label="Variety"
      value={value || ''}
      onChange={(e) => {
        const variety = varieties?.find(v => v.id === Number(e.target.value));
        onChange(variety);
      }}
      error={error}
      helperText={helperText || 'Select crop type first'}
      disabled={!cropType || isLoading}
      InputProps={{
        endAdornment: isLoading ? <CircularProgress size={20} /> : null
      }}
    >
      {varieties?.map((variety) => (
        <MenuItem key={variety.id} value={variety.id}>
          {variety.name}
        </MenuItem>
      ))}
      {varieties?.length === 0 && (
        <MenuItem disabled>No varieties available for this crop</MenuItem>
      )}
    </TextField>
  );
}

export default VarietySelector;
```

### Progress

- [x] VarietySelector component created
- [x] Filtered by crop type
- [x] Only active varieties shown
- [x] Loading indicator
- [x] Disabled when no crop type
- [x] Empty state message
- [x] Read-only mode support
- [x] Error display

---

## STEP 5: Add SeasonSelector

Create dropdown for season selection.

**File:** `/client/src/Admin/PlantingReports/components/ReportModal/SeasonSelector.jsx`

```javascript
/**
 * SeasonSelector Component
 * Dropdown for selecting planting season
 */

import React from 'react';
import { TextField, MenuItem, CircularProgress } from '@mui/material';
import { useSeasons } from '../../hooks/useReferenceQueries';

export function SeasonSelector({ value, onChange, error, helperText, readOnly }) {
  const { data: seasons, isLoading } = useSeasons({ isActive: true });
  
  const selectedSeason = seasons?.find(s => s.id === value);
  
  if (readOnly) {
    return (
      <TextField
        fullWidth
        label="Season"
        value={selectedSeason?.name || 'N/A'}
        InputProps={{ readOnly: true }}
      />
    );
  }
  
  return (
    <TextField
      select
      fullWidth
      required
      label="Season"
      value={value || ''}
      onChange={(e) => {
        const season = seasons?.find(s => s.id === Number(e.target.value));
        onChange(season);
      }}
      error={error}
      helperText={helperText}
      disabled={isLoading}
      InputProps={{
        endAdornment: isLoading ? <CircularProgress size={20} /> : null
      }}
    >
      {seasons?.map((season) => (
        <MenuItem key={season.id} value={season.id}>
          {season.name}
        </MenuItem>
      ))}
      {seasons?.length === 0 && (
        <MenuItem disabled>No seasons available</MenuItem>
      )}
    </TextField>
  );
}

export default SeasonSelector;
```

### Progress

- [x] SeasonSelector component created
- [x] Only active seasons shown
- [x] Loading indicator
- [x] Empty state message
- [x] Read-only mode support
- [x] Error display

---

## STEP 6: Create PlantingDetailsSection

Create section for planting date, location, and notes (visible in Planted/Completed states).

**File:** `/client/src/Admin/PlantingReports/components/ReportModal/PlantingDetailsSection.jsx`

```javascript
/**
 * PlantingDetailsSection Component
 * Planting date, location, and notes
 * Visible in Planted and Completed states
 */

import React from 'react';
import { Box, Typography, Grid, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export function PlantingDetailsSection({ data, errors, onChange, onBlur, readOnly }) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Planting Details
      </Typography>
      
      <Grid container spacing={2}>
        {/* Planting Date */}
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Planting Date *"
              value={data.plantingDate ? new Date(data.plantingDate) : null}
              onChange={(newDate) => onChange('plantingDate', newDate)}
              readOnly={readOnly}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.plantingDate,
                  helperText: errors.plantingDate || 'Date when seeds were planted',
                  onBlur: () => onBlur('plantingDate')
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        
        {/* Farm Location */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Farm Location"
            value={data.farmLocation || ''}
            onChange={(e) => onChange('farmLocation', e.target.value)}
            onBlur={() => onBlur('farmLocation')}
            error={!!errors.farmLocation}
            helperText={errors.farmLocation || 'Specific location or barangay'}
            InputProps={{ readOnly }}
            multiline
            maxRows={2}
          />
        </Grid>
        
        {/* Planting Notes */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Planting Notes"
            value={data.plantingNotes || ''}
            onChange={(e) => onChange('plantingNotes', e.target.value)}
            onBlur={() => onBlur('plantingNotes')}
            error={!!errors.plantingNotes}
            helperText={errors.plantingNotes || 'Optional notes about planting conditions'}
            InputProps={{ readOnly }}
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default PlantingDetailsSection;
```

### Progress

- [x] PlantingDetailsSection component created
- [x] Planting date picker integration
- [x] Farm location text field
- [x] Planting notes textarea
- [x] Read-only mode support
- [x] Error display
- [x] Helper text guidance

---

## STEP 7: Add Date Picker Integration

Date pickers are already integrated in PlantingDetailsSection (Step 6). Verify Material-UI Date Picker setup:

**Install Date Picker Package (if not installed):**

```powershell
cd client
npm install @mui/x-date-pickers
npm install date-fns
```

**Verify LocalizationProvider in App.jsx:**

```javascript
// In /client/src/main.jsx or App.jsx
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* ... rest of app ... */}
    </LocalizationProvider>
  );
}
```

**Test Date Pickers:**

1. Open modal in Planted state
2. Verify date picker displays calendar icon
3. Click calendar icon - calendar popup appears
4. Select a date - value updates
5. Verify date format (MM/DD/YYYY or localized)
6. Test keyboard input (manual date entry)
7. Test validation (invalid date shows error)

### Progress

- [x] @mui/x-date-pickers installed
- [x] date-fns installed
- [x] LocalizationProvider in App
- [x] DatePicker component works
- [x] Calendar popup displays
- [ ] Date selection updates value
- [ ] Keyboard input works
- [ ] Validation works

---

## STEP 8: Create HarvestingSection

Create section for harvest date, duration, and production volume (visible in Completed state only).

**File:** `/client/src/Admin/PlantingReports/components/ReportModal/HarvestingSection.jsx`

```javascript
/**
 * HarvestingSection Component
 * Harvest date, duration, and production volume
 * Visible in Completed state only
 */

import React, { useEffect } from 'react';
import { Box, Typography, Grid, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { calculateDuration } from '../../utils/dateHelpers';

export function HarvestingSection({ data, errors, onChange, onBlur, readOnly }) {
  // Auto-calculate duration when harvest date changes
  useEffect(() => {
    if (data.plantingDate && data.harvestDate) {
      const duration = calculateDuration(data.plantingDate, data.harvestDate);
      onChange('durationOfPlanting', duration);
    }
  }, [data.plantingDate, data.harvestDate]);
  
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Harvesting Details
      </Typography>
      
      <Grid container spacing={2}>
        {/* Harvest Date */}
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Harvest Date *"
              value={data.harvestDate ? new Date(data.harvestDate) : null}
              onChange={(newDate) => onChange('harvestDate', newDate)}
              readOnly={readOnly}
              minDate={data.plantingDate ? new Date(data.plantingDate) : undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.harvestDate,
                  helperText: errors.harvestDate || 'Date when crop was harvested',
                  onBlur: () => onBlur('harvestDate')
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        
        {/* Duration of Planting (Auto-calculated) */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Duration of Planting (days)"
            value={data.durationOfPlanting || ''}
            InputProps={{ readOnly: true }}
            helperText="Auto-calculated from planting to harvest date"
          />
        </Grid>
        
        {/* Volume of Production */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type="number"
            label="Volume of Production (tons)"
            value={data.volumeOfProduction || ''}
            onChange={(e) => onChange('volumeOfProduction', e.target.value)}
            onBlur={() => onBlur('volumeOfProduction')}
            error={!!errors.volumeOfProduction}
            helperText={errors.volumeOfProduction || 'Total harvest in metric tons'}
            InputProps={{ 
              readOnly,
              inputProps: { min: 0, step: 0.01 }
            }}
          />
        </Grid>
        
        {/* Yield per Hectare (Auto-calculated) */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Yield per Hectare (tons/ha)"
            value={
              data.volumeOfProduction && data.areaPlanted
                ? (data.volumeOfProduction / data.areaPlanted).toFixed(2)
                : ''
            }
            InputProps={{ readOnly: true }}
            helperText="Auto-calculated: Production ÷ Area"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default HarvestingSection;
```

### Progress

- [ ] HarvestingSection component created
- [ ] Harvest date picker
- [ ] Duration auto-calculated
- [ ] Volume of production input
- [ ] Yield per hectare auto-calculated
- [ ] minDate validation (after planting)
- [ ] Read-only mode support
- [ ] Error display
- [ ] Helper text

---

## STEP 9: Add Auto-Calculated Fields

Auto-calculated fields are already implemented in HarvestingSection (Step 8). Verify the calculation utilities:

**File:** `/client/src/Admin/PlantingReports/utils/dateHelpers.js`

Ensure `calculateDuration` exists:

```javascript
/**
 * Calculate duration between two dates in days
 * @param {Date|string} startDate - Planting date
 * @param {Date|string} endDate - Harvest date
 * @returns {number} Duration in days
 */
export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};
```

**Auto-Calculation Rules:**

1. **Duration of Planting:**
   - Formula: `harvestDate - plantingDate` (in days)
   - Auto-updates when either date changes
   - Always read-only (cannot edit)

2. **Yield per Hectare:**
   - Formula: `volumeOfProduction ÷ areaPlanted`
   - Auto-updates when production or area changes
   - Always read-only
   - Shows 2 decimal places

**Test Auto-Calculations:**

1. **Duration:**
   - Set planting date: Jan 1, 2024
   - Set harvest date: Apr 1, 2024
   - Verify duration = 91 days

2. **Yield:**
   - Set area: 5 hectares
   - Set production: 25 tons
   - Verify yield = 5.00 tons/ha

3. **Updates:**
   - Change production to 30 tons
   - Verify yield updates to 6.00 tons/ha

### Progress

- [ ] calculateDuration utility created
- [ ] Duration auto-calculates on date change
- [ ] Yield auto-calculates on production/area change
- [ ] Calculations use correct formulas
- [ ] Fields are read-only
- [ ] 2 decimal precision for yield
- [ ] Updates happen immediately

---

## STEP 10: Create DistributionMetadata

Create component to link report to distribution (checkbox + distribution ID selector).

**File:** `/client/src/Admin/PlantingReports/components/ReportModal/DistributionMetadata.jsx`

```javascript
/**
 * DistributionMetadata Component
 * Link report to distribution record
 */

import React from 'react';
import { Box, Typography, Grid, FormControlLabel, Checkbox, TextField, MenuItem } from '@mui/material';
import { useDistributions } from '../../hooks/useReferenceQueries';

export function DistributionMetadata({ data, errors, onChange, readOnly }) {
  const { data: distributions, isLoading } = useDistributions({ 
    status: 'active',
    enabled: data.isLinkedToDistribution 
  });
  
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Distribution Link
      </Typography>
      
      <Grid container spacing={2}>
        {/* Link to Distribution Checkbox */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.isLinkedToDistribution || false}
                onChange={(e) => {
                  onChange('isLinkedToDistribution', e.target.checked);
                  if (!e.target.checked) {
                    onChange('distributionId', null);
                  }
                }}
                disabled={readOnly}
              />
            }
            label="Link this report to a distribution record"
          />
        </Grid>
        
        {/* Distribution Selector (if checkbox checked) */}
        {data.isLinkedToDistribution && (
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Distribution Record"
              value={data.distributionId || ''}
              onChange={(e) => onChange('distributionId', e.target.value)}
              error={!!errors.distributionId}
              helperText={errors.distributionId || 'Select distribution record'}
              disabled={readOnly || isLoading}
            >
              {distributions?.map((dist) => (
                <MenuItem key={dist.id} value={dist.id}>
                  #{dist.id} - {dist.cropType} ({dist.date})
                </MenuItem>
              ))}
              {distributions?.length === 0 && (
                <MenuItem disabled>No active distributions available</MenuItem>
              )}
            </TextField>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default DistributionMetadata;
```

### Progress

- [ ] DistributionMetadata component created
- [ ] Checkbox for linking
- [ ] Distribution selector (conditional)
- [ ] Only loads distributions when checked
- [ ] Shows distribution details (ID, crop, date)
- [ ] Clears distributionId when unchecked
- [ ] Read-only mode support
- [ ] Error display

---

## STEP 11: Add Field Validation Display

Field validation is already integrated via error props. Verify error display behavior:

**Validation Display Rules:**

1. **Show Error When:**
   - Field has been touched (onBlur called)
   - Field value is invalid
   - Form submission attempted

2. **Error Display:**
   - Red border on TextField
   - Error text below field (helperText in red)
   - Error icon in some cases

3. **Clear Error When:**
   - User types valid value
   - Field becomes valid

**Test Validation Display:**

1. **Required Field:**
   - Leave farmer name empty
   - Click outside field (blur)
   - Red border appears
   - "Farmer name is required" shows

2. **Format Validation:**
   - Enter contact: "123"
   - Blur field
   - Error: "Contact must be 10-11 digits"

3. **Number Validation:**
   - Enter area: "-5"
   - Error: "Area must be positive"

4. **Real-Time Clearing:**
   - See error on field
   - Type valid value
   - Error clears immediately

**Improve Error Display:**

```javascript
// In any form section component
<TextField
  fullWidth
  required
  label="Field Label"
  value={data.fieldName || ''}
  onChange={(e) => onChange('fieldName', e.target.value)}
  onBlur={() => onBlur('fieldName')}
  error={!!errors.fieldName}
  helperText={errors.fieldName || 'Helper text when no error'}
  FormHelperTextProps={{
    sx: errors.fieldName ? { color: 'error.main' } : {}
  }}
/>
```

### Progress

- [ ] Errors display on blur
- [ ] Red border when error
- [ ] Error text in helperText
- [ ] Errors clear on valid input
- [ ] Required fields show errors
- [ ] Format validation shows errors
- [ ] Number validation shows errors
- [ ] Custom error messages display

---

## STEP 12: Add Required Field Indicators

Required field indicators (*) are already added via `required` prop. Verify consistency:

**Required Field Standards:**

1. **Label Format:**
   - "Field Label *" for required fields
   - "Field Label" for optional fields

2. **TextField Required:**
   ```javascript
   <TextField
     required  // Adds * to label
     label="Farmer Name"
     // ...
   />
   ```

3. **DatePicker Required:**
   ```javascript
   <DatePicker
     label="Planting Date *"
     slotProps={{
       textField: {
         required: true
       }
     }}
   />
   ```

**Required Fields by State:**

**Request State:**
- Farmer Name *
- Contact Number *
- RSBSA Number *
- Type of Crop *
- Variety *
- Season *
- Area Planted *
- Seeds per Sqm *

**Planted State (adds):**
- Planting Date *
- Farm Location *
- Planting Notes (optional)

**Completed State (adds):**
- Harvest Date *
- Volume of Production *

**Test Required Indicators:**

1. Verify all required fields show *
2. Verify optional fields don't show *
3. Check consistency across all sections
4. Test in all states (Request, Planted, Completed)

### Progress

- [ ] All required fields have *
- [ ] Optional fields don't have *
- [ ] Consistent across sections
- [ ] Required matches validation rules
- [ ] DatePicker labels have *
- [ ] Select fields have *
- [ ] TextField required prop set

---

## STEP 13: Add Tooltip Help Text

Add tooltips to provide additional context for complex fields.

**Add Tooltip Helper Component:**

**File:** `/client/src/Admin/PlantingReports/components/common/FieldTooltip.jsx`

```javascript
/**
 * FieldTooltip Component
 * Adds info icon with tooltip to field labels
 */

import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoOutlined';

export function FieldTooltip({ title }) {
  return (
    <Tooltip title={title} placement="top" arrow>
      <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
        <InfoIcon fontSize="small" color="action" />
      </IconButton>
    </Tooltip>
  );
}

export default FieldTooltip;
```

**Add Tooltips to Fields:**

```javascript
// Example in SeedingDetailsSection
import FieldTooltip from '../common/FieldTooltip';

<TextField
  fullWidth
  required
  type="number"
  label={
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      Seeds per Square Meter
      <FieldTooltip title="Recommended seeding rate is 150-200 seeds per square meter for optimal plant density" />
    </Box>
  }
  value={data.seedsPerSqm || ''}
  // ... rest of props
/>
```

**Fields That Need Tooltips:**

1. **Seeds per Sqm:**
   - "Recommended seeding rate is 150-200 seeds per square meter for optimal plant density"

2. **Area Planted:**
   - "Measure the actual planted area in hectares. 1 hectare = 10,000 square meters"

3. **Volume of Production:**
   - "Total harvest weight in metric tons. Include all harvested crops from this planting"

4. **Duration of Planting:**
   - "Auto-calculated from planting date to harvest date. Typical rice cycle is 90-120 days"

**Test Tooltips:**

1. Hover over info icon
2. Tooltip appears with helpful text
3. Tooltip is readable (not cut off)
4. Works on mobile (tap to show)

### Progress

- [ ] FieldTooltip component created
- [ ] Info icon displays
- [ ] Tooltip shows on hover
- [ ] Tooltip content helpful
- [ ] Seeds per sqm has tooltip
- [ ] Area planted has tooltip
- [ ] Volume production has tooltip
- [ ] Mobile tap works

---

## STEP 14: Implement Responsive 2-Column Grid

2-column grid is already implemented using Material-UI Grid. Verify responsive behavior:

**Grid Breakpoints:**

```javascript
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
    {/* Full width on mobile, half width on tablet+ */}
  </Grid>
  <Grid item xs={12} sm={6}>
    {/* Full width on mobile, half width on tablet+ */}
  </Grid>
  <Grid item xs={12}>
    {/* Full width on all screens */}
  </Grid>
</Grid>
```

**Responsive Rules:**

1. **Mobile (<600px):**
   - All fields full width (xs={12})
   - Stack vertically
   - Gap: 16px

2. **Tablet (≥600px):**
   - 2 columns (sm={6})
   - Side by side layout
   - Gap: 16px

3. **Desktop (≥768px):**
   - Same as tablet
   - Better spacing

**Test Responsive Grid:**

1. **Desktop (1024px):**
   - Fields in 2 columns
   - Even spacing
   - Labels aligned

2. **Tablet (768px):**
   - Still 2 columns
   - Narrower but readable

3. **Mobile (375px):**
   - Single column
   - Full width fields
   - Easy to tap
   - Touch targets ≥44px

**Optimize for Mobile:**

```javascript
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={6}>
    {/* Responsive field */}
  </Grid>
</Grid>
```

### Progress

- [ ] Grid container has spacing={2}
- [ ] xs={12} for mobile
- [ ] sm={6} for tablet
- [ ] Fields stack on mobile
- [ ] 2 columns on tablet+
- [ ] Gap consistent (16px)
- [ ] Touch targets ≥44px
- [ ] No horizontal scroll

---

## STEP 15: Verification

**Final Verification Checklist:**

**1. FarmerInfoSection:**
- [ ] Component renders without errors
- [ ] FarmerSelector in create mode
- [ ] Read-only fields in edit/view mode
- [ ] Farmer name displays
- [ ] Contact number displays
- [ ] RSBSA number displays
- [ ] 2-column grid on tablet+
- [ ] Single column on mobile
- [ ] Error display works

**2. FarmerSelector:**
- [ ] Autocomplete component works
- [ ] Search functionality
- [ ] Debounced search (300ms delay)
- [ ] Loading indicator
- [ ] Option format: "Name - RSBSA"
- [ ] Selection updates farmer fields
- [ ] Error display works
- [ ] Required indicator (*)

**3. SeedingDetailsSection:**
- [ ] Component renders
- [ ] Crop type dropdown works
- [ ] Variety selector works
- [ ] Season selector works
- [ ] Area planted number input
- [ ] Seeds per sqm number input
- [ ] All required indicators (*)
- [ ] Helper text displays
- [ ] Error display works
- [ ] Read-only mode works

**4. VarietySelector:**
- [ ] Dropdown renders
- [ ] Filtered by crop type
- [ ] Only active varieties
- [ ] Loading indicator
- [ ] Disabled when no crop type
- [ ] Empty state message
- [ ] Read-only mode shows name
- [ ] Error display works

**5. SeasonSelector:**
- [ ] Dropdown renders
- [ ] Only active seasons
- [ ] Loading indicator
- [ ] Empty state message
- [ ] Read-only mode shows name
- [ ] Error display works

**6. PlantingDetailsSection:**
- [ ] Component renders
- [ ] Planting date picker works
- [ ] Farm location text field
- [ ] Planting notes textarea
- [ ] Date picker calendar popup
- [ ] Read-only mode works
- [ ] Error display works
- [ ] Helper text guidance

**7. Date Picker Integration:**
- [ ] @mui/x-date-pickers installed
- [ ] LocalizationProvider setup
- [ ] Calendar popup displays
- [ ] Date selection works
- [ ] Keyboard input works
- [ ] Date format correct
- [ ] Validation works
- [ ] minDate constraint works

**8. HarvestingSection:**
- [ ] Component renders
- [ ] Harvest date picker works
- [ ] Duration auto-calculates
- [ ] Volume of production input
- [ ] Yield per hectare auto-calculates
- [ ] minDate after planting date
- [ ] Read-only duration field
- [ ] Read-only yield field
- [ ] Error display works

**9. Auto-Calculated Fields:**
- [ ] Duration formula correct
- [ ] Duration updates on date change
- [ ] Yield formula correct
- [ ] Yield updates on production/area change
- [ ] Fields are read-only
- [ ] 2 decimal precision
- [ ] Updates immediate
- [ ] No manual editing allowed

**10. DistributionMetadata:**
- [ ] Component renders
- [ ] Checkbox toggles linking
- [ ] Distribution selector conditional
- [ ] Only loads when checked
- [ ] Shows distribution details
- [ ] Clears ID when unchecked
- [ ] Read-only mode works
- [ ] Error display works

**11. Field Validation Display:**
- [ ] Errors show on blur
- [ ] Red border on error
- [ ] Error text in helperText
- [ ] Errors clear on valid input
- [ ] Required field errors
- [ ] Format validation errors
- [ ] Number validation errors
- [ ] Custom messages display

**12. Required Field Indicators:**
- [ ] All required fields have *
- [ ] Optional fields don't have *
- [ ] Consistent across sections
- [ ] Matches validation rules
- [ ] DatePicker labels correct
- [ ] Select fields correct
- [ ] TextField required prop set

**13. Tooltip Help Text:**
- [ ] FieldTooltip component created
- [ ] Info icon displays
- [ ] Tooltip on hover
- [ ] Helpful content
- [ ] Seeds per sqm tooltip
- [ ] Area planted tooltip
- [ ] Volume production tooltip
- [ ] Mobile tap works

**14. Responsive 2-Column Grid:**
- [ ] Grid spacing={2} set
- [ ] xs={12} on mobile
- [ ] sm={6} on tablet
- [ ] Fields stack on mobile
- [ ] 2 columns on tablet+
- [ ] Gap consistent (16px)
- [ ] Touch targets ≥44px
- [ ] No horizontal scroll
- [ ] Labels aligned

**15. Integration:**
- [ ] All sections import correctly
- [ ] Props passed correctly
- [ ] onChange handlers work
- [ ] onBlur handlers work
- [ ] Error props work
- [ ] readOnly prop works
- [ ] Data flows correctly
- [ ] No console errors

**Test Scenarios:**

1. **Create New Report:**
   - Fill all sections
   - Verify auto-calculations
   - Check required fields
   - Submit form

2. **Edit Request Report:**
   - Open in edit mode
   - Farmer section editable
   - Seeding section editable
   - No planting/harvesting sections

3. **Edit Planted Report:**
   - Open in edit mode
   - Farmer section read-only
   - Seeding section read-only
   - Planting section editable

4. **View Completed Report:**
   - Open in view mode
   - All sections visible
   - All fields read-only
   - Auto-calculated values show

5. **Mobile Test:**
   - Resize to 375px
   - All fields stack vertically
   - Touch targets ≥44px
   - Date pickers work
   - Dropdowns work

6. **Validation Test:**
   - Leave required field empty
   - Blur field
   - Error displays
   - Fill valid value
   - Error clears

### Progress Summary

- [ ] Step 1: FarmerInfoSection ✅
- [ ] Step 2: FarmerSelector Autocomplete ✅
- [ ] Step 3: SeedingDetailsSection ✅
- [ ] Step 4: VarietySelector ✅
- [ ] Step 5: SeasonSelector ✅
- [ ] Step 6: PlantingDetailsSection ✅
- [ ] Step 7: Date Picker Integration ✅
- [ ] Step 8: HarvestingSection ✅
- [ ] Step 9: Auto-Calculated Fields ✅
- [ ] Step 10: DistributionMetadata ✅
- [ ] Step 11: Field Validation Display ✅
- [ ] Step 12: Required Field Indicators ✅
- [ ] Step 13: Tooltip Help Text ✅
- [ ] Step 14: Responsive 2-Column Grid ✅
- [ ] Step 15: Verification ⏳

---

## 🎯 COMPLETION

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

**Completion Date:** _______________

**Next File:** [10_State_Transitions.md](./10_State_Transitions.md)

---

**Estimated Time:** 6-7 hours  
**Actual Time:** _______________
