# File 08: Modal Architecture

**Purpose:** Refactor ReportModal.jsx with state-based form rendering  
**Prerequisites:** Files 01-07 completed  
**Estimated Time:** 5-6 hours  
**Target File:** `/client/src/Admin/PlantingReports/components/ReportModal.jsx`

---

## 📋 STEPS OVERVIEW

Total Steps: **12**

1. [Create Modal Orchestrator Structure](#step-1-create-modal-orchestrator-structure)
2. [Implement State Workflow Indicator](#step-2-implement-state-workflow-indicator)
3. [Setup Form State Management](#step-3-setup-form-state-management)
4. [Implement State-Based Form Rendering](#step-4-implement-state-based-form-rendering)
5. [Add Modal Header](#step-5-add-modal-header)
6. [Add Modal Body with Form Sections](#step-6-add-modal-body-with-form-sections)
7. [Add Modal Footer with Actions](#step-7-add-modal-footer-with-actions)
8. [Implement Save Functionality](#step-8-implement-save-functionality)
9. [Implement State Transition Buttons](#step-9-implement-state-transition-buttons)
10. [Add Validation](#step-10-add-validation)
11. [Implement Mobile Fullscreen](#step-11-implement-mobile-fullscreen)
12. [Verification](#step-12-verification)

---

## STEP 1: Create Modal Orchestrator Structure

**File:** `/client/src/Admin/PlantingReports/components/ReportModal.jsx`

```javascript
/**
 * ReportModal Component (Orchestrator)
 * Max 200 lines - delegates to form sections
 */

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Divider,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Hooks
import { useReportForm } from '../hooks/useReportForm';
import { useResponsive } from '../hooks/useResponsive';
import { useCreateReport, useUpdateReport } from '../hooks/usePlantingReportQueries';

// Components
import StateWorkflowIndicator from './ReportModal/StateWorkflowIndicator';
import FarmerInfoSection from './ReportModal/FarmerInfoSection';
import SeedingDetailsSection from './ReportModal/SeedingDetailsSection';
import PlantingDetailsSection from './ReportModal/PlantingDetailsSection';
import HarvestingSection from './ReportModal/HarvestingSection';
import DistributionMetadata from './ReportModal/DistributionMetadata';
import StateTransitionButtons from './ReportModal/StateTransitionButtons';
import ErrorDisplay from './common/ErrorDisplay';

// Utils
import { getModalTitle } from '../utils/modalHelpers';

export function ReportModal({ open, mode, report, onClose }) {
  const { isMobile } = useResponsive();
  
  // Form management
  const {
    formData,
    errors,
    isValid,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFormData
  } = useReportForm(report?.state || 'Request_Report');
  
  // Mutations
  const createMutation = useCreateReport();
  const updateMutation = useUpdateReport();
  
  // Initialize form data when modal opens
  useEffect(() => {
    if (open && report && mode !== 'create') {
      setFormData(report);
    } else if (open && mode === 'create') {
      resetForm();
    }
  }, [open, report, mode]);
  
  // Handle close
  const handleClose = () => {
    if (!createMutation.isPending && !updateMutation.isPending) {
      resetForm();
      onClose();
    }
  };
  
  // Handle save
  const handleSave = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      return;
    }
    
    if (mode === 'create') {
      createMutation.mutate(formData, {
        onSuccess: () => {
          handleClose();
        }
      });
    } else if (mode === 'edit') {
      updateMutation.mutate({ id: report.id, data: formData }, {
        onSuccess: () => {
          handleClose();
        }
      });
    }
  };
  
  // Determine if read-only
  const readOnly = mode === 'view';
  const loading = createMutation.isPending || updateMutation.isPending;
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      {/* Header */}
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {getModalTitle(mode, report?.state)}
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* State Workflow Indicator */}
        {report && (
          <StateWorkflowIndicator currentState={report.state} />
        )}
      </DialogTitle>
      
      <Divider />
      
      {/* Body */}
      <DialogContent sx={{ pt: 2 }}>
        {(createMutation.isError || updateMutation.isError) && (
          <ErrorDisplay
            message={createMutation.error?.message || updateMutation.error?.message}
            onRetry={createMutation.isError ? createMutation.reset : updateMutation.reset}
          />
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Farmer Info Section */}
          <FarmerInfoSection
            data={formData}
            errors={errors}
            onChange={handleChange}
            onBlur={handleBlur}
            readOnly={readOnly || mode === 'edit'}
          />
          
          {/* Seeding Details Section */}
          <SeedingDetailsSection
            data={formData}
            errors={errors}
            onChange={handleChange}
            onBlur={handleBlur}
            readOnly={readOnly}
          />
          
          {/* Planting Details Section (Planted/Completed states only) */}
          {(formData.state === 'Planted' || formData.state === 'Completed') && (
            <PlantingDetailsSection
              data={formData}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              readOnly={readOnly}
            />
          )}
          
          {/* Harvesting Section (Completed state only) */}
          {formData.state === 'Completed' && (
            <HarvestingSection
              data={formData}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              readOnly={readOnly}
            />
          )}
          
          {/* Distribution Metadata */}
          <DistributionMetadata
            data={formData}
            errors={errors}
            onChange={handleChange}
            readOnly={readOnly}
          />
        </Box>
      </DialogContent>
      
      <Divider />
      
      {/* Footer */}
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        {/* State Transition Buttons (left side) */}
        {!readOnly && report && (
          <StateTransitionButtons
            report={report}
            formData={formData}
            onTransition={handleClose}
          />
        )}
        
        {/* Save/Cancel Buttons (right side) */}
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button onClick={handleClose} disabled={loading}>
            {readOnly ? 'Close' : 'Cancel'}
          </Button>
          {!readOnly && (
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading || !isValid}
            >
              {loading ? <CircularProgress size={24} /> : mode === 'create' ? 'Create' : 'Save'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default ReportModal;
```

### Progress

- [ ] Modal orchestrator structure created
- [ ] Dialog component configured
- [ ] Form state management integrated
- [ ] Mutations setup
- [ ] Header/Body/Footer structure
- [ ] State-based section rendering
- [ ] Read-only mode support
- [ ] Loading states
- [ ] Error handling
- [ ] Component under 200 lines

---

## STEP 2: Implement State Workflow Indicator

**File:** `/client/src/Admin/PlantingReports/components/ReportModal/StateWorkflowIndicator.jsx`

```javascript
/**
 * StateWorkflowIndicator Component
 * Visual timeline showing report state progression
 */

import React from 'react';
import { Box, Step, Stepper, StepLabel } from '@mui/material';
import { PLANTING_STATES } from '../../constants/plantingReportConstants';

const WORKFLOW_STEPS = [
  { value: PLANTING_STATES.REQUEST, label: 'Request Report' },
  { value: PLANTING_STATES.PLANTED, label: 'Planted' },
  { value: PLANTING_STATES.COMPLETED, label: 'Completed' }
];

export function StateWorkflowIndicator({ currentState }) {
  // Find current step index
  const activeStep = WORKFLOW_STEPS.findIndex(step => step.value === currentState);
  
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {WORKFLOW_STEPS.map((step, index) => (
          <Step key={step.value} completed={index < activeStep}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default StateWorkflowIndicator;
```

### Progress

- [ ] StateWorkflowIndicator component created
- [ ] Material-UI Stepper used
- [ ] 3 steps (Request → Planted → Completed)
- [ ] Active step highlighted
- [ ] Completed steps marked
- [ ] Alternative label (below line)
- [ ] Responsive layout

---

## STEP 3: Setup Form State Management

Form state management is already integrated via `useReportForm` hook. Verify the hook implementation:

**File:** `/client/src/Admin/PlantingReports/hooks/useReportForm.js`

Ensure the hook has these features:

```javascript
/**
 * useReportForm Hook
 * Manages form state, validation, and auto-calculations
 */

import { useState, useEffect, useCallback } from 'react';
import { validateReportForm } from '../utils/validationSchemas';

export const useReportForm = (initialState = 'Request_Report') => {
  const [formData, setFormData] = useState({
    // Farmer Info
    farmerId: null,
    farmerName: '',
    farmerContact: '',
    rsbsaNumber: '',
    
    // Seeding Details
    typeOfCrop: '',
    varietyId: null,
    seasonId: null,
    areaPlanted: '',
    seedsPerSqm: '',
    
    // Planting Details
    plantingDate: null,
    farmLocation: '',
    plantingNotes: '',
    
    // Harvesting Details
    harvestDate: null,
    durationOfPlanting: null, // auto-calculated
    volumeOfProduction: '',
    
    // Distribution
    isLinkedToDistribution: false,
    distributionId: null,
    
    // State
    state: initialState,
    isArchived: false
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Handle field change
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);
  
  // Handle field blur
  const handleBlur = useCallback((field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  }, []);
  
  // Validate entire form
  const validateForm = useCallback(() => {
    const validation = validateReportForm(formData);
    setErrors(validation.errors || {});
    return { isValid: validation.isValid, errors: validation.errors };
  }, [formData]);
  
  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;
  
  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      farmerId: null,
      farmerName: '',
      farmerContact: '',
      rsbsaNumber: '',
      typeOfCrop: '',
      varietyId: null,
      seasonId: null,
      areaPlanted: '',
      seedsPerSqm: '',
      plantingDate: null,
      farmLocation: '',
      plantingNotes: '',
      harvestDate: null,
      durationOfPlanting: null,
      volumeOfProduction: '',
      isLinkedToDistribution: false,
      distributionId: null,
      state: initialState,
      isArchived: false
    });
    setErrors({});
    setTouched({});
  }, [initialState]);
  
  return {
    formData,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFormData
  };
};
```

**Test Form State Management:**

1. Open modal in create mode
2. Fill in farmer name
3. Verify `formData.farmerName` updates
4. Clear the field
5. Verify error appears after blur
6. Fill valid data
7. Verify error clears

### Progress

- [ ] useReportForm hook verified
- [ ] Initial state setup
- [ ] handleChange updates formData
- [ ] handleBlur marks field touched
- [ ] validateForm checks all rules
- [ ] Errors clear on valid input
- [ ] resetForm clears all data
- [ ] isValid computed correctly

---

## STEP 4: Implement State-Based Form Rendering

State-based rendering is already implemented in Step 1. Verify the conditional rendering logic:

**Conditional Rendering Rules:**

1. **Request_Report State:**
   - ✅ FarmerInfoSection (all fields editable)
   - ✅ SeedingDetailsSection (all fields editable)
   - ❌ PlantingDetailsSection (not visible)
   - ❌ HarvestingSection (not visible)
   - ✅ DistributionMetadata

2. **Planted State:**
   - ✅ FarmerInfoSection (read-only)
   - ✅ SeedingDetailsSection (read-only)
   - ✅ PlantingDetailsSection (all fields editable)
   - ❌ HarvestingSection (not visible)
   - ✅ DistributionMetadata

3. **Completed State:**
   - ✅ FarmerInfoSection (read-only)
   - ✅ SeedingDetailsSection (read-only)
   - ✅ PlantingDetailsSection (read-only)
   - ✅ HarvestingSection (all fields editable)
   - ✅ DistributionMetadata

**Create Helper Function:**

**File:** `/client/src/Admin/PlantingReports/utils/modalHelpers.js`

```javascript
/**
 * Modal Helper Utilities
 */

import { PLANTING_STATES } from '../constants/plantingReportConstants';

/**
 * Get modal title based on mode and state
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

/**
 * Get state display label
 */
const getStateLabel = (state) => {
  const labels = {
    [PLANTING_STATES.REQUEST]: 'Request',
    [PLANTING_STATES.PLANTED]: 'Planted',
    [PLANTING_STATES.COMPLETED]: 'Completed'
  };
  return labels[state] || state;
};

/**
 * Determine which sections should be visible
 */
export const getVisibleSections = (state) => {
  return {
    farmerInfo: true,
    seedingDetails: true,
    plantingDetails: state === PLANTING_STATES.PLANTED || state === PLANTING_STATES.COMPLETED,
    harvesting: state === PLANTING_STATES.COMPLETED,
    distributionMetadata: true
  };
};

/**
 * Determine which sections should be read-only
 */
export const getReadOnlySections = (state, mode) => {
  if (mode === 'view') {
    return {
      farmerInfo: true,
      seedingDetails: true,
      plantingDetails: true,
      harvesting: true,
      distributionMetadata: true
    };
  }
  
  return {
    farmerInfo: state !== PLANTING_STATES.REQUEST,
    seedingDetails: state !== PLANTING_STATES.REQUEST,
    plantingDetails: state === PLANTING_STATES.COMPLETED,
    harvesting: false,
    distributionMetadata: false
  };
};
```

**Test State-Based Rendering:**

1. **Request State:**
   - Only Farmer + Seeding sections visible
   - All fields editable

2. **Planted State:**
   - Farmer + Seeding + Planting sections visible
   - Farmer + Seeding read-only
   - Planting editable

3. **Completed State:**
   - All sections visible
   - Only Harvesting section editable

### Progress

- [ ] modalHelpers.js created
- [ ] getModalTitle function works
- [ ] getVisibleSections returns correct flags
- [ ] getReadOnlySections returns correct flags
- [ ] Request state shows 2 sections
- [ ] Planted state shows 3 sections
- [ ] Completed state shows 4 sections
- [ ] Read-only logic correct

---

## STEP 5: Add Modal Header

Modal header is already implemented in Step 1. Verify the components:

**Header Structure:**
- Title with mode + state
- Close button (top-right)
- StateWorkflowIndicator (below title)

**Test Header:**

1. **Create Mode:**
   - Title: "Create New Planting Report"
   - No workflow indicator

2. **View Mode (Planted):**
   - Title: "View Planting Report - Planted"
   - Workflow shows step 2 active

3. **Edit Mode (Request):**
   - Title: "Edit Planting Report - Request"
   - Workflow shows step 1 active

4. **Close Button:**
   - Click X icon
   - Modal closes
   - Form resets

5. **Mobile:**
   - Title text wraps if needed
   - Close button always accessible
   - Workflow indicator stacks nicely

**Add Loading State to Header:**

```javascript
<DialogTitle>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Typography variant="h6">
      {getModalTitle(mode, report?.state)}
    </Typography>
    <IconButton 
      onClick={handleClose} 
      disabled={loading}
      aria-label="close modal"
    >
      <CloseIcon />
    </IconButton>
  </Box>
  
  {/* State Workflow Indicator */}
  {report && (
    <StateWorkflowIndicator currentState={report.state} />
  )}
</DialogTitle>
```

### Progress

- [ ] Title displays correctly for all modes
- [ ] Close button works
- [ ] Close button disabled during save
- [ ] StateWorkflowIndicator displays for edit/view
- [ ] No indicator in create mode
- [ ] Workflow shows correct active step
- [ ] Mobile layout wraps properly
- [ ] aria-label added

---

## STEP 6: Add Modal Body with Form Sections

Modal body is already implemented in Step 1. Verify the layout and spacing:

**Body Structure:**
- DialogContent with padding
- Error display (if mutation error)
- Vertical flex layout with gap: 3
- Conditional section rendering

**Test Modal Body:**

1. **Error Display:**
   - Simulate API error
   - Error message displays at top
   - Retry button clears error

2. **Section Spacing:**
   - Each section has 24px gap (gap: 3)
   - Sections have internal padding
   - No extra margins needed

3. **Scroll Behavior:**
   - Long forms scroll vertically
   - Header/Footer stay fixed
   - Smooth scrolling

4. **Mobile:**
   - Full screen modal
   - Sections stack properly
   - Touch scrolling smooth

**Add Error Boundary:**

**File:** `/client/src/Admin/PlantingReports/components/common/ErrorDisplay.jsx`

```javascript
/**
 * ErrorDisplay Component
 * Shows error messages with retry option
 */

import React from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export function ErrorDisplay({ message, onRetry }) {
  return (
    <Alert 
      severity="error" 
      icon={<ErrorOutlineIcon />}
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        )
      }
      sx={{ mb: 2 }}
    >
      <AlertTitle>Error</AlertTitle>
      {message || 'An unexpected error occurred. Please try again.'}
    </Alert>
  );
}

export default ErrorDisplay;
```

### Progress

- [ ] DialogContent padding correct
- [ ] ErrorDisplay component created
- [ ] Error shows at top of body
- [ ] Retry button works
- [ ] Vertical flex layout
- [ ] Gap between sections (24px)
- [ ] Scroll behavior smooth
- [ ] Mobile fullscreen works

---

## STEP 7: Add Modal Footer with Actions

Modal footer is already implemented in Step 1. Verify the button layout:

**Footer Structure:**
- DialogActions with padding: 2
- Left side: StateTransitionButtons (if not read-only)
- Right side: Cancel + Save buttons
- Responsive layout (stacks on mobile)

**Test Footer:**

1. **Create Mode:**
   - No transition buttons (left empty)
   - Cancel + Create buttons on right
   - Create button enabled when valid

2. **Edit Mode (Request):**
   - "Mark as Planted" button on left
   - Cancel + Save buttons on right
   - All buttons functional

3. **View Mode:**
   - Transition buttons on left (if applicable)
   - "Close" button on right
   - No Save button

4. **Loading State:**
   - All buttons disabled during save
   - Save button shows CircularProgress
   - Cannot close modal

5. **Mobile:**
   - Buttons stack vertically
   - Full width buttons
   - Touch targets ≥44px

**Improve Mobile Footer:**

```javascript
<DialogActions 
  sx={{ 
    p: 2, 
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    gap: 1
  }}
>
  {/* State Transition Buttons (left side) */}
  {!readOnly && report && (
    <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
      <StateTransitionButtons
        report={report}
        formData={formData}
        onTransition={handleClose}
      />
    </Box>
  )}
  
  {/* Save/Cancel Buttons (right side) */}
  <Box sx={{ 
    display: 'flex', 
    gap: 1, 
    ml: { xs: 0, sm: 'auto' },
    width: { xs: '100%', sm: 'auto' }
  }}>
    <Button 
      onClick={handleClose} 
      disabled={loading}
      fullWidth={isMobile}
    >
      {readOnly ? 'Close' : 'Cancel'}
    </Button>
    {!readOnly && (
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={loading || !isValid}
        fullWidth={isMobile}
      >
        {loading ? <CircularProgress size={24} /> : mode === 'create' ? 'Create' : 'Save'}
      </Button>
    )}
  </Box>
</DialogActions>
```

### Progress

- [ ] Footer layout correct (space-between)
- [ ] Transition buttons on left
- [ ] Save/Cancel on right
- [ ] Loading disables all buttons
- [ ] CircularProgress in Save button
- [ ] Mobile stacks vertically
- [ ] Full width buttons on mobile
- [ ] Touch targets ≥44px

---

## STEP 8: Implement Save Functionality

Save functionality is already implemented in Step 1. Verify the mutation flow:

**Save Flow:**

1. **Validate Form:**
   - Call `validateForm()`
   - If invalid, stop and show errors
   - If valid, proceed to mutation

2. **Create Mode:**
   - Call `createMutation.mutate(formData)`
   - On success: close modal, show toast
   - On error: show error in modal

3. **Edit Mode:**
   - Call `updateMutation.mutate({ id, data })`
   - On success: close modal, show toast
   - On error: show error in modal

4. **Loading State:**
   - Disable all buttons
   - Show CircularProgress in Save button
   - Prevent modal close

**Test Save Functionality:**

1. **Create New Report:**
   - Fill all required fields
   - Click "Create"
   - Verify toast: "Report created successfully"
   - Modal closes
   - New report appears in table

2. **Edit Existing Report:**
   - Open report in edit mode
   - Change area planted to 5.5
   - Click "Save"
   - Verify toast: "Report updated successfully"
   - Modal closes
   - Table shows updated value

3. **Validation Errors:**
   - Leave required field empty
   - Click "Save"
   - Error messages display
   - Save button remains disabled
   - Modal stays open

4. **API Error:**
   - Simulate network error
   - Click "Save"
   - Error alert displays at top
   - Modal stays open
   - Can retry or cancel

**Add Optimistic Updates:**

In `usePlantingReportQueries.js`:

```javascript
export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => plantingReportService.updateReport(id, data),
    
    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['plantingReports'] });
      
      // Snapshot previous value
      const previousReports = queryClient.getQueryData(['plantingReports']);
      
      // Optimistically update
      queryClient.setQueryData(['plantingReports'], old => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map(report => 
            report.id === id ? { ...report, ...data } : report
          )
        };
      });
      
      return { previousReports };
    },
    
    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousReports) {
        queryClient.setQueryData(['plantingReports'], context.previousReports);
      }
      toast.error(err.message || 'Failed to update report');
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantingReports'] });
      toast.success('Report updated successfully');
    }
  });
};
```

### Progress

- [ ] validateForm called before save
- [ ] Create mutation works
- [ ] Update mutation works
- [ ] Success closes modal
- [ ] Success shows toast
- [ ] Validation errors prevent save
- [ ] API errors display in modal
- [ ] Optimistic updates implemented
- [ ] Rollback on error works

---

## STEP 9: Implement State Transition Buttons

State transition buttons are delegated to `StateTransitionButtons` component. This is implemented in File 10. Verify integration:

**In ReportModal.jsx:**

```javascript
{!readOnly && report && (
  <StateTransitionButtons
    report={report}
    formData={formData}
    onTransition={handleClose}
  />
)}
```

**StateTransitionButtons Responsibilities:**
- Show "Mark as Planted" button (Request → Planted)
- Show "Mark as Completed" button (Planted → Completed)
- Validate required fields before transition
- Show confirmation dialog
- Call transition API
- Handle errors
- Close modal on success

**Test Integration:**

1. **Request State:**
   - "Mark as Planted" button shows
   - Click button
   - Confirmation dialog appears
   - After confirm, report moves to Planted
   - Modal closes

2. **Planted State:**
   - "Mark as Completed" button shows
   - Click button
   - If harvest date missing, validation error
   - If valid, confirmation dialog
   - After confirm, report moves to Completed

3. **Completed State:**
   - No transition buttons (final state)

4. **View Mode:**
   - Transition buttons still show
   - Can transition from view mode

### Progress

- [ ] StateTransitionButtons imported
- [ ] Buttons render in footer
- [ ] Request → Planted button works
- [ ] Planted → Completed button works
- [ ] No buttons in Completed state
- [ ] Validation before transition
- [ ] Confirmation dialogs show
- [ ] Modal closes on success

---

## STEP 10: Add Validation

Validation is integrated via `useReportForm` hook and `validateReportForm` utility. Verify comprehensive validation:

**File:** `/client/src/Admin/PlantingReports/utils/validationSchemas.js`

Ensure these validations exist:

```javascript
import Joi from 'joi';
import { PLANTING_STATES } from '../constants/plantingReportConstants';

/**
 * Base schema for all states
 */
const baseSchema = Joi.object({
  // Farmer Info (Required in Request state)
  farmerId: Joi.number().required().messages({
    'number.base': 'Please select a farmer',
    'any.required': 'Farmer is required'
  }),
  farmerName: Joi.string().required().messages({
    'string.empty': 'Farmer name is required'
  }),
  farmerContact: Joi.string().pattern(/^[0-9]{10,11}$/).required().messages({
    'string.pattern.base': 'Contact must be 10-11 digits',
    'any.required': 'Contact is required'
  }),
  rsbsaNumber: Joi.string().required().messages({
    'string.empty': 'RSBSA number is required'
  }),
  
  // Seeding Details (Required in Request state)
  typeOfCrop: Joi.string().required().messages({
    'string.empty': 'Crop type is required'
  }),
  varietyId: Joi.number().required().messages({
    'number.base': 'Please select a variety',
    'any.required': 'Variety is required'
  }),
  seasonId: Joi.number().required().messages({
    'number.base': 'Please select a season',
    'any.required': 'Season is required'
  }),
  areaPlanted: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Area must be a number',
    'number.positive': 'Area must be positive',
    'any.required': 'Area planted is required'
  }),
  seedsPerSqm: Joi.number().positive().integer().required().messages({
    'number.base': 'Seeds per sqm must be a number',
    'number.positive': 'Seeds per sqm must be positive',
    'number.integer': 'Seeds per sqm must be a whole number',
    'any.required': 'Seeds per sqm is required'
  })
});

/**
 * Planted state schema (adds planting fields)
 */
const plantedSchema = baseSchema.keys({
  plantingDate: Joi.date().required().messages({
    'date.base': 'Invalid planting date',
    'any.required': 'Planting date is required'
  }),
  farmLocation: Joi.string().required().messages({
    'string.empty': 'Farm location is required'
  }),
  plantingNotes: Joi.string().allow('').optional()
});

/**
 * Completed state schema (adds harvesting fields)
 */
const completedSchema = plantedSchema.keys({
  harvestDate: Joi.date().required().messages({
    'date.base': 'Invalid harvest date',
    'any.required': 'Harvest date is required for completed reports'
  }),
  volumeOfProduction: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Production volume must be a number',
    'number.positive': 'Production volume must be positive',
    'any.required': 'Production volume is required'
  })
});

/**
 * Validate report form based on current state
 */
export const validateReportForm = (formData) => {
  let schema;
  
  switch (formData.state) {
    case PLANTING_STATES.REQUEST:
      schema = baseSchema;
      break;
    case PLANTING_STATES.PLANTED:
      schema = plantedSchema;
      break;
    case PLANTING_STATES.COMPLETED:
      schema = completedSchema;
      break;
    default:
      schema = baseSchema;
  }
  
  const { error } = schema.validate(formData, { abortEarly: false });
  
  if (error) {
    const errors = {};
    error.details.forEach(detail => {
      errors[detail.path[0]] = detail.message;
    });
    return { isValid: false, errors };
  }
  
  return { isValid: true, errors: {} };
};
```

**Test Validation:**

1. **Required Fields:**
   - Leave farmer name empty
   - Blur field
   - Error: "Farmer name is required"

2. **Format Validation:**
   - Enter contact: "123"
   - Blur field
   - Error: "Contact must be 10-11 digits"

3. **Number Validation:**
   - Enter area: "-5"
   - Error: "Area must be positive"

4. **State-Based Validation:**
   - Request state: planting date not required
   - Planted state: planting date required
   - Completed state: harvest date required

5. **Real-Time Validation:**
   - Errors clear as you type valid data
   - Save button enables when all valid

### Progress

- [ ] Joi validation schemas created
- [ ] baseSchema for Request state
- [ ] plantedSchema for Planted state
- [ ] completedSchema for Completed state
- [ ] Required field validation
- [ ] Format validation (contact, RSBSA)
- [ ] Number validation (positive, precision)
- [ ] State-based validation works
- [ ] Error messages clear and helpful

---

## STEP 11: Implement Mobile Fullscreen

Mobile fullscreen is already implemented via `fullScreen={isMobile}` prop. Test the behavior:

**Test Mobile Fullscreen:**

1. **Desktop (≥768px):**
   - Modal appears as dialog
   - Max width: md (960px)
   - Centered on screen
   - Backdrop visible

2. **Mobile (<768px):**
   - Modal fills entire screen
   - No margins/padding around edges
   - Header at top
   - Footer at bottom
   - Body scrolls between them

3. **Transitions:**
   - Smooth slide-up animation on open
   - Smooth slide-down on close

4. **Close Behavior:**
   - Swipe down gesture (if supported)
   - Back button on Android
   - X button always accessible

**Add Safe Area Insets (for iOS notch):**

```javascript
<Dialog
  open={open}
  onClose={handleClose}
  maxWidth="md"
  fullWidth
  fullScreen={isMobile}
  PaperProps={{
    sx: isMobile ? {
      // Safe area for iOS notch/home indicator
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)'
    } : {}
  }}
>
```

**Improve Mobile Header:**

```javascript
<DialogTitle sx={{
  position: 'sticky',
  top: 0,
  bgcolor: 'background.paper',
  zIndex: 1,
  borderBottom: '1px solid',
  borderColor: 'divider'
}}>
  {/* ... header content ... */}
</DialogTitle>
```

**Improve Mobile Footer:**

```javascript
<DialogActions sx={{ 
  position: 'sticky',
  bottom: 0,
  bgcolor: 'background.paper',
  borderTop: '1px solid',
  borderColor: 'divider',
  p: 2, 
  flexDirection: { xs: 'column', sm: 'row' },
  justifyContent: 'space-between',
  gap: 1
}}>
  {/* ... footer content ... */}
</DialogActions>
```

### Progress

- [ ] fullScreen prop set to isMobile
- [ ] Desktop shows centered dialog
- [ ] Mobile fills entire screen
- [ ] Safe area insets for iOS
- [ ] Sticky header on mobile
- [ ] Sticky footer on mobile
- [ ] Smooth open/close animations
- [ ] Back button closes modal
- [ ] Swipe gestures work

---

## STEP 12: Verification

**Final Verification Checklist:**

**1. Modal Structure:**
- [ ] Dialog component renders
- [ ] maxWidth="md" on desktop
- [ ] fullWidth prop set
- [ ] fullScreen on mobile (<768px)
- [ ] Proper z-index layering
- [ ] Backdrop visible (desktop)
- [ ] Safe area insets (mobile)

**2. Modal Header:**
- [ ] Title displays correct mode
- [ ] "Create New Planting Report" in create mode
- [ ] "View/Edit Planting Report - [State]" in view/edit modes
- [ ] Close button (X icon) works
- [ ] Close disabled during save
- [ ] StateWorkflowIndicator shows for edit/view
- [ ] No indicator in create mode
- [ ] Workflow shows correct active step
- [ ] Mobile header sticky

**3. Modal Body:**
- [ ] DialogContent has proper padding
- [ ] Error alert displays on mutation error
- [ ] Retry button clears error
- [ ] Vertical flex layout (gap: 3)
- [ ] Sections render conditionally by state
- [ ] FarmerInfoSection always visible
- [ ] SeedingDetailsSection always visible
- [ ] PlantingDetailsSection visible in Planted/Completed
- [ ] HarvestingSection visible in Completed only
- [ ] DistributionMetadata always visible
- [ ] Scroll behavior smooth
- [ ] Mobile body scrolls properly

**4. Modal Footer:**
- [ ] DialogActions has padding
- [ ] Space-between layout
- [ ] StateTransitionButtons on left (if applicable)
- [ ] Cancel + Save buttons on right
- [ ] Buttons stack vertically on mobile
- [ ] Full width buttons on mobile
- [ ] Touch targets ≥44px
- [ ] Mobile footer sticky

**5. Form State Management:**
- [ ] useReportForm hook integrated
- [ ] formData initializes correctly
- [ ] handleChange updates fields
- [ ] handleBlur marks fields touched
- [ ] Errors tracked per field
- [ ] Validation runs on save
- [ ] resetForm clears all data
- [ ] setFormData works for edit mode

**6. Save Functionality:**
- [ ] Create mode calls createMutation
- [ ] Edit mode calls updateMutation
- [ ] Validation runs before save
- [ ] Invalid form prevents save
- [ ] Save button disabled when invalid
- [ ] Loading state disables all buttons
- [ ] CircularProgress in Save button
- [ ] Success closes modal
- [ ] Success shows toast notification
- [ ] Error displays in modal
- [ ] Optimistic updates work
- [ ] Rollback on error works

**7. State-Based Rendering:**
- [ ] Request state shows 2 sections
- [ ] Planted state shows 3 sections
- [ ] Completed state shows 4 sections
- [ ] Read-only logic correct per state
- [ ] Farmer/Seeding read-only after Request
- [ ] Planting read-only in Completed
- [ ] Harvesting editable in Completed

**8. State Transitions:**
- [ ] StateTransitionButtons integrated
- [ ] "Mark as Planted" shows in Request
- [ ] "Mark as Completed" shows in Planted
- [ ] No buttons in Completed state
- [ ] Buttons work from view mode
- [ ] Validation before transition
- [ ] Confirmation dialogs display
- [ ] Transitions close modal

**9. Validation:**
- [ ] Required field validation
- [ ] Format validation (contact, RSBSA)
- [ ] Number validation (positive, precision)
- [ ] Date validation
- [ ] State-based required fields
- [ ] Error messages clear
- [ ] Errors display on blur
- [ ] Errors clear on valid input
- [ ] Save disabled when errors exist

**10. Mobile Experience:**
- [ ] Fullscreen on mobile (<768px)
- [ ] Centered dialog on desktop (≥768px)
- [ ] Header sticky on mobile
- [ ] Footer sticky on mobile
- [ ] Body scrolls smoothly
- [ ] Buttons stack vertically
- [ ] Full width buttons
- [ ] Touch targets ≥44px
- [ ] Safe area insets for iOS
- [ ] Smooth animations
- [ ] Back button closes modal

**11. Accessibility:**
- [ ] Close button has aria-label
- [ ] All inputs have labels
- [ ] Error messages associated with fields
- [ ] Focus trap in modal
- [ ] Escape key closes modal
- [ ] Focus returns after close
- [ ] Keyboard navigation works
- [ ] Screen reader announces errors

**12. Error Handling:**
- [ ] Network errors display in modal
- [ ] Validation errors display inline
- [ ] Retry button works
- [ ] Error alert dismissible
- [ ] Multiple errors display
- [ ] Errors don't prevent modal close (cancel)

**Test Scenarios:**

1. **Create New Report:**
   - Click "Create Report" FAB
   - Modal opens in create mode
   - Fill all required fields
   - Click "Create"
   - Success toast displays
   - Modal closes
   - New report in table

2. **Edit Request Report:**
   - Click edit icon on Request state report
   - Modal opens with data populated
   - Farmer fields read-only (should be editable in Request!)
   - Change area planted
   - Click "Save"
   - Success toast
   - Modal closes
   - Table updates

3. **View Planted Report:**
   - Click view icon on Planted report
   - Modal opens in view mode
   - All fields read-only
   - StateWorkflowIndicator shows step 2 active
   - Click "Close"
   - Modal closes

4. **State Transition:**
   - Open Request report
   - Click "Mark as Planted"
   - Confirmation dialog appears
   - Confirm transition
   - Report moves to Planted state
   - Modal closes

5. **Validation Errors:**
   - Open modal
   - Leave farmer name empty
   - Click "Save"
   - Error displays: "Farmer name is required"
   - Fill farmer name
   - Error clears
   - Save button enables

6. **Mobile Test:**
   - Resize to 375px width
   - Open modal
   - Fullscreen modal appears
   - Header sticky at top
   - Footer sticky at bottom
   - Scroll body content
   - All buttons full width
   - Touch targets ≥44px

### Progress Summary

- [ ] Step 1: Modal Orchestrator Structure ✅
- [ ] Step 2: State Workflow Indicator ✅
- [ ] Step 3: Form State Management ✅
- [ ] Step 4: State-Based Form Rendering ✅
- [ ] Step 5: Modal Header ✅
- [ ] Step 6: Modal Body with Form Sections ✅
- [ ] Step 7: Modal Footer with Actions ✅
- [ ] Step 8: Save Functionality ✅
- [ ] Step 9: State Transition Buttons ✅
- [ ] Step 10: Validation ✅
- [ ] Step 11: Mobile Fullscreen ✅
- [ ] Step 12: Verification ⏳

---

## 🎯 COMPLETION

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

**Completion Date:** _______________

**Next File:** [09_Form_Sections.md](./09_Form_Sections.md)

---

**Estimated Time:** 5-6 hours  
**Actual Time:** _______________
