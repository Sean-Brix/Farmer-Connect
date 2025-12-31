# File 10: State Transitions

**Purpose:** Implement state transition UI logic and validation  
**Prerequisites:** Files 01-09 completed  
**Estimated Time:** 4-5 hours  
**Target Directory:** `/client/src/Admin/PlantingReports/components/ReportModal/`

---

## 📋 STEPS OVERVIEW

Total Steps: **10**

1. [Create StateTransitionButtons Component](#step-1-create-statetransitionbuttons-component)
2. [Implement Transition Validation](#step-2-implement-transition-validation)
3. [Add Confirmation Dialogs](#step-3-add-confirmation-dialogs)
4. [Implement Optimistic Updates](#step-4-implement-optimistic-updates)
5. [Add Error Handling with Rollback](#step-5-add-error-handling-with-rollback)
6. [Add Success Notifications](#step-6-add-success-notifications)
7. [Implement Loading States](#step-7-implement-loading-states)
8. [Add Business Rules Enforcement](#step-8-add-business-rules-enforcement)
9. [Implement Disabled States](#step-9-implement-disabled-states)
10. [Verification](#step-10-verification)

---

## STEP 1: Create StateTransitionButtons Component

**File:** `/client/src/Admin/PlantingReports/components/ReportModal/StateTransitionButtons.jsx`

```javascript
/**
 * StateTransitionButtons Component
 * State transition actions in modal footer
 */

import React, { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import {
  ArrowForward as NextIcon,
  ArrowBack as PrevIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// Hooks
import { useTransitionState } from '../../hooks/usePlantingReportQueries';
import { useStateTransitions } from '../../hooks/useStateTransitions';

// Components
import ConfirmDialog from '../common/ConfirmDialog';

// Utils
import { validateStateTransition } from '../../validation/stateTransitionRules';

export function StateTransitionButtons({ report, formData, onTransition }) {
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    targetState: null
  });
  
  // Mutation
  const transitionMutation = useTransitionState();
  
  // Get available transitions
  const {
    canTransitionToNext,
    canTransitionToPrevious,
    getNextState,
    getPreviousState
  } = useStateTransitions(report.state);
  
  // Handle transition click
  const handleTransitionClick = (direction) => {
    const targetState = direction === 'next' ? getNextState() : getPreviousState();
    
    if (!targetState) return;
    
    // Validate transition
    const validation = validateStateTransition(report.state, targetState, formData);
    if (!validation.isValid) {
      toast.error(validation.errors.join(', '));
      return;
    }
    
    // Show confirmation
    setConfirmDialog({
      open: true,
      title: `Transition to ${targetState}?`,
      message: `This will change the report state from ${report.state} to ${targetState}. Required fields for the new state must be filled.`,
      targetState
    });
  };
  
  // Handle confirm transition
  const handleConfirmTransition = () => {
    const { targetState } = confirmDialog;
    
    transitionMutation.mutate(
      { id: report.id, targetState },
      {
        onSuccess: () => {
          toast.success(`Successfully transitioned to ${targetState}`);
          setConfirmDialog({ open: false, title: '', message: '', targetState: null });
          onTransition();
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to transition state');
        }
      }
    );
  };
  
  // Handle cancel
  const handleCancelTransition = () => {
    setConfirmDialog({ open: false, title: '', message: '', targetState: null });
  };
  
  return (
    <>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* Previous State Button */}
        {canTransitionToPrevious && (
          <Button
            variant="outlined"
            startIcon={<PrevIcon />}
            onClick={() => handleTransitionClick('previous')}
            disabled={transitionMutation.isPending}
          >
            Back to {getPreviousState()}
          </Button>
        )}
        
        {/* Next State Button */}
        {canTransitionToNext && (
          <Button
            variant="contained"
            endIcon={<NextIcon />}
            onClick={() => handleTransitionClick('next')}
            disabled={transitionMutation.isPending}
          >
            {transitionMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Advance to ${getNextState()}`
            )}
          </Button>
        )}
      </Box>
      
      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleConfirmTransition}
        onCancel={handleCancelTransition}
        loading={transitionMutation.isPending}
        confirmText="Confirm Transition"
        cancelText="Cancel"
      />
    </>
  );
}

export default StateTransitionButtons;
```

### Progress

- [x] StateTransitionButtons component created
- [x] useStateTransitions hook integrated
- [x] useTransitionState mutation integrated
- [x] Next/Previous buttons
- [x] Confirmation dialog
- [x] Loading states
- [x] Error handling
- [x] Success notifications
- [x] No syntax errors

---

## STEP 2: Implement Transition Validation

Validation logic in stateTransitionRules.js (created in File 02).

**File:** `/client/src/Admin/PlantingReports/validation/stateTransitionRules.js`

Add `validateStateTransition` function:

```javascript
/**
 * Validate state transition
 * @param {string} currentState - Current report state
 * @param {string} targetState - Target state to transition to
 * @param {object} formData - Current form data
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export function validateStateTransition(currentState, targetState, formData) {
  const errors = [];
  
  // Check if transition is allowed
  const allowedTransitions = ALLOWED_TRANSITIONS[currentState] || [];
  if (!allowedTransitions.includes(targetState)) {
    errors.push(`Cannot transition from ${currentState} to ${targetState}`);
    return { isValid: false, errors };
  }
  
  // Check required fields for target state
  const requiredFields = STATE_FIELD_REQUIREMENTS[targetState] || [];
  
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field] === '') {
      errors.push(`${field} is required for ${targetState} state`);
    }
  });
  
  // Business rule validations
  if (targetState === 'Completed') {
    if (!formData.harvestDate) {
      errors.push('Harvest date is required to complete report');
    }
    if (!formData.yieldHarvested || formData.yieldHarvested <= 0) {
      errors.push('Yield harvested must be greater than 0');
    }
  }
  
  if (targetState === 'Planted') {
    if (!formData.plantingDate) {
      errors.push('Planting date is required to mark as planted');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

### Progress

- [x] validateStateTransition function created
- [x] Allowed transitions check
- [x] Required fields check per state
- [x] Business rule validations
- [x] Error messages array
- [x] Returns isValid and errors

---

## STEP 3: Add Confirmation Dialogs

Confirmation dialogs are already integrated in Step 1 via `ConfirmDialog` component. Verify the implementation:

**File:** `/client/src/Admin/PlantingReports/components/common/ConfirmDialog.jsx`

Ensure this component exists:

```javascript
/**
 * ConfirmDialog Component
 * Reusable confirmation dialog for destructive actions
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  CircularProgress
} from '@mui/material';

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning' // 'warning', 'error', 'info'
}) {
  const confirmColor = severity === 'error' ? 'error' : 'primary';
  
  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={loading}
          autoFocus
        >
          {loading ? <CircularProgress size={24} /> : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
```

**Test Confirmation Dialogs:**

1. **Transition Confirmation:**
   - Click "Advance to Planted"
   - Dialog appears: "Transition to Planted?"
   - Message explains state change
   - Confirm/Cancel buttons

2. **During Loading:**
   - Click Confirm
   - Both buttons disabled
   - Loading spinner in Confirm button
   - Cannot close dialog

3. **Error Severity:**
   - Permanent delete: error (red)
   - State transition: warning (orange)
   - Info actions: info (blue)

### Progress

- [x] ConfirmDialog component created
- [x] Title and message display
- [x] Confirm/Cancel buttons
- [x] Loading state disables buttons
- [x] CircularProgress in Confirm
- [x] Severity colors (error, warning, info)
- [x] Cannot close during loading
- [x] autoFocus on Confirm button

---

## STEP 4: Implement Optimistic Updates

Optimistic updates provide instant UI feedback before API confirmation.

**In usePlantingReportQueries.js:**

```javascript
export const useTransitionState = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, targetState }) => 
      plantingReportService.transitionState(id, targetState),
    
    // Optimistic update
    onMutate: async ({ id, targetState }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['plantingReports'] });
      
      // Snapshot previous state
      const previousData = queryClient.getQueryData(['plantingReports']);
      
      // Optimistically update state
      queryClient.setQueryData(['plantingReports'], old => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map(report =>
            report.id === id
              ? { ...report, state: targetState }
              : report
          )
        };
      });
      
      return { previousData };
    },
    
    // Rollback on error (Step 5)
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['plantingReports'], context.previousData);
      }
      toast.error(err.message || 'Failed to transition state');
    },
    
    // Confirm success
    onSuccess: (data, { targetState }) => {
      queryClient.invalidateQueries({ queryKey: ['plantingReports'] });
      toast.success(`Successfully transitioned to ${targetState}`);
    }
  });
};
```

**Test Optimistic Updates:**

1. **Instant UI Update:**
   - Click "Advance to Planted"
   - Confirm transition
   - Report state chip changes immediately (before API)
   - State indicator updates immediately

2. **Success Confirmation:**
   - API succeeds
   - UI stays updated (already showing new state)
   - Toast notification confirms

3. **Error Rollback (Step 5):**
   - If API fails
   - UI reverts to previous state
   - Error toast displays

### Progress

- [x] Optimistic update in onMutate
- [x] Previous state snapshot
- [x] Immediate UI update
- [x] State changes before API confirms
- [x] No loading delay for user
- [x] Query invalidation on success
- [x] Context returned for rollback

---

## STEP 5: Add Error Handling with Rollback

Error handling with rollback is already implemented in Step 4 (`onError`). Test the rollback:

**Test Error Rollback:**

1. **Simulate API Error:**
   - Disconnect network
   - Click "Advance to Planted"
   - Confirm
   - UI updates optimistically
   - API fails
   - UI reverts to previous state
   - Error toast: "Failed to transition state"

2. **Validation Error:**
   - Try transition without required fields
   - Validation error before API call
   - No optimistic update
   - Error toast: "[field] is required"

3. **Business Rule Error:**
   - Try to complete without harvest date
   - API returns error
   - UI rolls back
   - Error toast displays

**Add Detailed Error Messages:**

```javascript
onError: (err, variables, context) => {
  // Rollback optimistic update
  if (context?.previousData) {
    queryClient.setQueryData(['plantingReports'], context.previousData);
  }
  
  // Show detailed error
  const errorMessage = err.response?.data?.message || err.message || 'Failed to transition state';
  toast.error(errorMessage, {
    autoClose: 5000,
    position: 'top-right'
  });
},
```

### Progress

- [x] onError handler implemented
- [x] Rollback optimistic updates
- [x] Previous data restored
- [x] Error toast displays
- [x] Detailed error messages
- [x] Network errors handled
- [x] Validation errors handled
- [x] Business rule errors handled

---

## STEP 6: Add Success Notifications

Success notifications are already implemented in Step 4 (`onSuccess`). Customize them:

**Enhanced Success Notifications:**

```javascript
onSuccess: (data, { targetState }) => {
  // Invalidate queries to refresh data
  queryClient.invalidateQueries({ queryKey: ['plantingReports'] });
  queryClient.invalidateQueries({ queryKey: ['statistics'] });
  
  // Show success toast with state-specific message
  const messages = {
    'Planted': 'Report marked as planted successfully',
    'Completed': 'Report completed successfully',
    'Request_Report': 'Report reverted to request state'
  };
  
  toast.success(messages[targetState] || `Successfully transitioned to ${targetState}`, {
    autoClose: 3000,
    position: 'top-right'
  });
}
```

**Test Success Notifications:**

1. **Transition to Planted:**
   - Success toast: "Report marked as planted successfully"
   - Toast disappears after 3 seconds
   - Green checkmark icon

2. **Transition to Completed:**
   - Success toast: "Report completed successfully"
   - Statistics refresh
   - Report moves to Completed tab

3. **Multiple Invalidations:**
   - Reports list refreshes
   - Statistics cards update
   - Filters maintain current selection

### Progress

- [x] Success toast in onSuccess
- [x] State-specific messages
- [x] Query invalidation
- [x] Statistics refresh
- [x] 3-second auto-close
- [x] Green success icon
- [x] Multiple queries invalidated

---

## STEP 7: Implement Loading States

Loading states are already implemented. Verify all loading indicators:

**Loading Indicators:**

1. **StateTransitionButtons:**
   ```javascript
   disabled={transitionMutation.isPending}
   {transitionMutation.isPending ? (
     <CircularProgress size={24} color="inherit" />
   ) : (
     `Advance to ${getNextState()}`
   )}
   ```

2. **ConfirmDialog:**
   ```javascript
   loading={transitionMutation.isPending}
   ```

3. **Modal Close:**
   ```javascript
   // In ReportModal.jsx
   const handleClose = () => {
     if (!transitionMutation.isPending) {
       onClose();
     }
   };
   ```

**Test Loading States:**

1. **During Transition:**
   - All buttons disabled
   - Transition button shows spinner
   - Cannot close modal
   - Cannot click other actions

2. **After Completion:**
   - Loading stops
   - Buttons re-enable
   - Modal can close
   - Normal interaction resumes

### Progress

- [x] Buttons disabled during transition
- [x] CircularProgress in button
- [x] Modal close blocked during loading
- [x] ConfirmDialog loading state
- [x] isPending checked correctly
- [x] Loading clears on success
- [ ] Loading clears on error

---

## STEP 8: Add Business Rules Enforcement

Business rules are enforced in `validateStateTransition` (Step 2). Add comprehensive rules:

**File:** `/client/src/Admin/PlantingReports/validation/stateTransitionRules.js`

Expand business rules:

```javascript
/**
 * Business Rules for State Transitions
 */

// Transition to Planted
if (targetState === 'Planted') {
  // Required fields
  if (!formData.plantingDate) {
    errors.push('Planting date is required to mark as planted');
  }
  if (!formData.farmLocation) {
    errors.push('Farm location is required');
  }
  
  // Date validation
  if (formData.plantingDate) {
    const plantingDate = new Date(formData.plantingDate);
    const today = new Date();
    if (plantingDate > today) {
      errors.push('Planting date cannot be in the future');
    }
  }
}

// Transition to Completed
if (targetState === 'Completed') {
  // Required fields
  if (!formData.harvestDate) {
    errors.push('Harvest date is required to complete report');
  }
  if (!formData.volumeOfProduction || formData.volumeOfProduction <= 0) {
    errors.push('Volume of production must be greater than 0');
  }
  
  // Date sequence validation
  if (formData.plantingDate && formData.harvestDate) {
    const plantingDate = new Date(formData.plantingDate);
    const harvestDate = new Date(formData.harvestDate);
    
    if (harvestDate <= plantingDate) {
      errors.push('Harvest date must be after planting date');
    }
    
    // Reasonable duration (e.g., 30-180 days for rice)
    const duration = (harvestDate - plantingDate) / (1000 * 60 * 60 * 24);
    if (duration < 30) {
      errors.push('Duration too short. Typical planting cycle is 90-120 days');
    }
    if (duration > 365) {
      errors.push('Duration too long. Please verify dates');
    }
  }
}

// Cannot transition to same state
if (currentState === targetState) {
  errors.push('Report is already in this state');
}

// Cannot skip states (must follow sequence)
const stateSequence = ['Request_Report', 'Planted', 'Completed'];
const currentIndex = stateSequence.indexOf(currentState);
const targetIndex = stateSequence.indexOf(targetState);

if (Math.abs(targetIndex - currentIndex) > 1) {
  errors.push('Cannot skip states. Follow the sequence: Request → Planted → Completed');
}
```

**Test Business Rules:**

1. **Future Planting Date:**
   - Set planting date to tomorrow
   - Try to transition to Planted
   - Error: "Planting date cannot be in the future"

2. **Invalid Harvest Date:**
   - Harvest date before planting date
   - Error: "Harvest date must be after planting date"

3. **Duration Validation:**
   - Set duration < 30 days
   - Error: "Duration too short"

4. **Skip States:**
   - Try Request → Completed (skip Planted)
   - Error: "Cannot skip states"

### Progress

- [ ] Required field rules
- [ ] Date validation (no future dates)
- [ ] Date sequence (harvest after planting)
- [ ] Duration validation (30-365 days)
- [ ] Cannot transition to same state
- [ ] Cannot skip states
- [ ] Volume > 0 validation
- [ ] Clear error messages

---

## STEP 9: Implement Disabled States

Disabled states prevent invalid transitions. Implement in `useStateTransitions` hook:

**File:** `/client/src/Admin/PlantingReports/hooks/useStateTransitions.js`

```javascript
/**
 * useStateTransitions Hook
 * Determines available state transitions
 */

import { PLANTING_STATES } from '../constants/plantingReportConstants';

export const useStateTransitions = (currentState) => {
  // Define allowed transitions
  const transitions = {
    [PLANTING_STATES.REQUEST]: {
      next: PLANTING_STATES.PLANTED,
      previous: null
    },
    [PLANTING_STATES.PLANTED]: {
      next: PLANTING_STATES.COMPLETED,
      previous: PLANTING_STATES.REQUEST
    },
    [PLANTING_STATES.COMPLETED]: {
      next: null,
      previous: PLANTING_STATES.PLANTED
    }
  };
  
  const current = transitions[currentState];
  
  return {
    canTransitionToNext: !!current?.next,
    canTransitionToPrevious: !!current?.previous,
    getNextState: () => current?.next || null,
    getPreviousState: () => current?.previous || null,
    getAllowedStates: () => {
      const allowed = [];
      if (current?.next) allowed.push(current.next);
      if (current?.previous) allowed.push(current.previous);
      return allowed;
    }
  };
};
```

**Test Disabled States:**

1. **Request State:**
   - Only "Advance to Planted" button shows
   - No "Back to" button
   - Completed is not an option

2. **Planted State:**
   - "Back to Request_Report" button shows
   - "Advance to Completed" button shows
   - Both transitions available

3. **Completed State:**
   - Only "Back to Planted" button shows
   - No "Advance" button (final state)

4. **Archived Reports:**
   - No transition buttons show
   - Must unarchive first

### Progress

- [ ] useStateTransitions hook created
- [ ] canTransitionToNext logic
- [ ] canTransitionToPrevious logic
- [ ] getNextState returns correct state
- [ ] getPreviousState returns correct state
- [ ] Request shows only Next
- [ ] Planted shows both
- [ ] Completed shows only Previous
- [ ] No buttons for archived reports

---

## STEP 10: Verification

**Final Verification Checklist:**

**1. StateTransitionButtons Component:**
- [ ] Component renders without errors
- [ ] useStateTransitions hook integrated
- [ ] useTransitionState mutation integrated
- [ ] Next button shows for Request/Planted
- [ ] Previous button shows for Planted/Completed
- [ ] Button text shows target state
- [ ] Icons display (ArrowForward, ArrowBack)
- [ ] Loading state disables buttons
- [ ] CircularProgress in button during loading

**2. Transition Validation:**
- [ ] validateStateTransition function works
- [ ] Allowed transitions checked
- [ ] Required fields validated per state
- [ ] Business rules enforced
- [ ] Error messages clear and helpful
- [ ] Returns isValid boolean
- [ ] Returns errors array
- [ ] Validation runs before API call

**3. Confirmation Dialogs:**
- [ ] ConfirmDialog component exists
- [ ] Dialog shows on transition click
- [ ] Title shows target state
- [ ] Message explains state change
- [ ] Confirm button triggers transition
- [ ] Cancel button closes dialog
- [ ] Loading disables both buttons
- [ ] Cannot close during loading
- [ ] autoFocus on Confirm button

**4. Optimistic Updates:**
- [ ] onMutate implemented
- [ ] Previous state snapshot
- [ ] Immediate UI update
- [ ] State changes before API confirms
- [ ] No loading delay for user
- [ ] Context returned for rollback
- [ ] Query invalidation on success

**5. Error Handling with Rollback:**
- [ ] onError handler implemented
- [ ] Optimistic updates rolled back
- [ ] Previous data restored
- [ ] Error toast displays
- [ ] Detailed error messages
- [ ] Network errors handled
- [ ] Validation errors handled
- [ ] Business rule errors handled

**6. Success Notifications:**
- [ ] onSuccess handler implemented
- [ ] State-specific success messages
- [ ] Toast notification displays
- [ ] Green success icon
- [ ] 3-second auto-close
- [ ] Reports list refreshes
- [ ] Statistics refresh
- [ ] Multiple queries invalidated

**7. Loading States:**
- [ ] Buttons disabled during transition
- [ ] CircularProgress in button
- [ ] Modal close blocked during loading
- [ ] ConfirmDialog loading state
- [ ] isPending checked correctly
- [ ] Loading clears on success
- [ ] Loading clears on error

**8. Business Rules Enforcement:**
- [ ] Required field rules
- [ ] Date validation (no future dates)
- [ ] Date sequence (harvest after planting)
- [ ] Duration validation (30-365 days)
- [ ] Cannot transition to same state
- [ ] Cannot skip states (Request → Planted → Completed)
- [ ] Volume > 0 validation
- [ ] Clear error messages

**9. Disabled States:**
- [ ] useStateTransitions hook works
- [ ] canTransitionToNext logic correct
- [ ] canTransitionToPrevious logic correct
- [ ] Request shows only Next button
- [ ] Planted shows both buttons
- [ ] Completed shows only Previous button
- [ ] No buttons for archived reports
- [ ] Button text shows correct target state

**10. Integration:**
- [ ] Component imports in ReportModal
- [ ] Props passed correctly
- [ ] onTransition callback works
- [ ] Modal closes after transition
- [ ] Table refreshes after transition
- [ ] Statistics update after transition
- [ ] No console errors

**Test Scenarios:**

1. **Request → Planted:**
   - Open Request report
   - Fill planting date and location
   - Click "Advance to Planted"
   - Confirm
   - Report state updates
   - Modal closes
   - Report appears in Planted tab

2. **Planted → Completed:**
   - Open Planted report
   - Fill harvest date and production
   - Click "Advance to Completed"
   - Confirm
   - Report state updates
   - Modal closes
   - Report appears in Completed tab

3. **Completed → Planted (Rollback):**
   - Open Completed report
   - Click "Back to Planted"
   - Confirm
   - Report state reverts
   - Harvest data retained

4. **Validation Error:**
   - Try to transition without required fields
   - Error toast appears
   - No dialog shown
   - State unchanged

5. **API Error:**
   - Disconnect network
   - Click transition
   - Confirm
   - Optimistic update happens
   - API fails
   - Rollback occurs
   - Error toast displays

### Progress Summary

- [ ] Step 1: StateTransitionButtons Component ✅
- [ ] Step 2: Transition Validation ✅
- [ ] Step 3: Confirmation Dialogs ✅
- [ ] Step 4: Optimistic Updates ✅
- [ ] Step 5: Error Handling with Rollback ✅
- [ ] Step 6: Success Notifications ✅
- [ ] Step 7: Loading States ✅
- [ ] Step 8: Business Rules Enforcement ✅
- [ ] Step 9: Disabled States ✅
- [ ] Step 10: Verification ⏳

---

## 🎯 COMPLETION

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

**Completion Date:** _______________

**Next File:** [11_Reference_Panel.md](./11_Reference_Panel.md)

---

**Estimated Time:** 4-5 hours  
**Actual Time:** _______________
