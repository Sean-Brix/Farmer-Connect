# Planting Report State Migration Test Checklist

Use this checklist to verify the 3-state workflow migration (Planting → Planted → Harvested) is working correctly after removing the old 4-state system (REQUEST/DISTRIBUTED → PLANTED → COMPLETED).

## Pre-Test Setup
- Backend running on port 8080
- Frontend running with latest changes
- Logged in as admin (username: `admin`, password: `123456`)
- Database contains test planting reports in various states
- At least one distribution request with linked reports exists

## Critical Bug Fix: Distribution-Linked Reports

### ✅ Planting Details Input Visibility
**Issue Fixed:** Distribution-linked reports were not showing planting details inputs in edit mode

- [ ] Navigate to Planting Reports → Distribution Reports tab
- [ ] Click "Edit" on any distribution-linked report
- [ ] **VERIFY:** Planting details section (farmer name, farm location, etc.) is now visible
- [ ] **VERIFY:** All planting fields are editable
- [ ] **VERIFY:** No console errors about undefined PLANTING_STATES.REQUEST

### ✅ Correct State Initialization
- [ ] Open edit modal for distribution-linked report
- [ ] Open browser console
- [ ] **VERIFY:** State defaults to "Planting" (not undefined)
- [ ] **VERIFY:** No errors about missing state constants

## 3-State Workflow Testing

### State 1: Planting (Initial State)

**Create New Report:**
- [ ] Click "Add Planting Report"
- [ ] **VERIFY:** State indicator shows "Planting" as active step
- [ ] **VERIFY:** Required fields marked: farmerName, farmLocation, areaPlanted, typeOfCrop, varietyId, croppingSeasonId, seedClassification, dateOfPlanting, plantingMethod
- [ ] **VERIFY:** Harvest fields (harvestArea, numberOfBags, weightPerBag, dateOfHarvest) are EXCLUDED
- [ ] Fill in all required planting fields
- [ ] Save report
- [ ] **VERIFY:** Report saved with state = "Planting"

**Edit Planting Report:**
- [ ] Open any report in "Planting" state
- [ ] **VERIFY:** All planting fields are editable
- [ ] **VERIFY:** No fields are locked
- [ ] **VERIFY:** Harvest section is not visible
- [ ] **VERIFY:** Can modify farmer name, crop type, area planted
- [ ] Save changes
- [ ] **VERIFY:** Changes persist, state remains "Planting"

### State 2: Planted (Intermediate State)

**Transition to Planted:**
- [ ] Open report in "Planting" state
- [ ] Click "Mark as Planted" button
- [ ] **VERIFY:** Confirmation dialog appears
- [ ] Confirm transition
- [ ] **VERIFY:** State changes to "Planted"
- [ ] **VERIFY:** State indicator shows "Planted" as active step

**Locked Fields in Planted State:**
- [ ] Open report in "Planted" state in edit mode
- [ ] **VERIFY:** These fields are locked (disabled):
  - farmerName
  - farmLocation
  - areaPlanted
  - typeOfCrop
  - varietyId
  - croppingSeasonId
  - seedClassification
- [ ] **VERIFY:** These fields remain editable:
  - dateOfPlanting
  - plantingMethod
  - riceIrrigation (if Rice crop)
- [ ] **VERIFY:** Harvest fields are still EXCLUDED
- [ ] Try to edit locked field
- [ ] **VERIFY:** Field is disabled, cannot be changed

### State 3: Harvested (Final State)

**Transition to Harvested:**
- [ ] Open report in "Planted" state
- [ ] Fill in required harvest fields:
  - harvestArea (must be ≤ areaPlanted)
  - numberOfBags
  - weightPerBag
  - dateOfHarvest (must be after dateOfPlanting)
- [ ] Click "Mark as Harvested" button
- [ ] **VERIFY:** Confirmation dialog appears
- [ ] Confirm transition
- [ ] **VERIFY:** State changes to "Harvested"
- [ ] **VERIFY:** State indicator shows "Harvested" as active step

**Locked Fields in Harvested State:**
- [ ] Open report in "Harvested" state in edit mode
- [ ] **VERIFY:** All planting fields are locked:
  - farmerName
  - farmLocation
  - areaPlanted
  - typeOfCrop
  - varietyId
  - croppingSeasonId
  - seedClassification
  - dateOfPlanting
  - plantingMethod
  - riceIrrigation
- [ ] **VERIFY:** Harvest fields are visible and editable:
  - harvestArea
  - numberOfBags
  - weightPerBag
  - dateOfHarvest
- [ ] Modify harvest data
- [ ] Save changes
- [ ] **VERIFY:** Changes persist, state remains "Harvested"

**Archive Functionality:**
- [ ] View report in "Harvested" state
- [ ] **VERIFY:** "Archive" button is visible
- [ ] Click "Archive"
- [ ] **VERIFY:** Report moves to archived/deleted state
- [ ] Navigate to "Deleted" tab
- [ ] **VERIFY:** Archived report appears in list

## Field Exclusion Testing

### Harvest Fields Excluded Until Harvested
- [ ] Create new report (Planting state)
- [ ] **VERIFY:** These fields do NOT appear in form:
  - harvestArea
  - numberOfBags
  - weightPerBag
  - dateOfHarvest
- [ ] Transition to "Planted"
- [ ] **VERIFY:** Harvest fields still excluded
- [ ] Transition to "Harvested"
- [ ] **VERIFY:** Harvest fields now appear and are required

### Distribution Fields Always Excluded
- [ ] Create/edit any report
- [ ] **VERIFY:** These fields never appear:
  - distributionRequestId
  - distributionDate
  - distributionStatus

## Validation Testing

### Required Field Validation (Planting State)
- [ ] Create new report
- [ ] Leave farmerName blank
- [ ] Try to save
- [ ] **VERIFY:** Validation error: "Farmer name is required"
- [ ] Leave typeOfCrop blank
- [ ] Try to save
- [ ] **VERIFY:** Validation error appears

### Conditional Validation (Rice Irrigation)
- [ ] Create report with typeOfCrop = "Rice"
- [ ] **VERIFY:** riceIrrigation field becomes required
- [ ] Leave riceIrrigation blank
- [ ] Try to save
- [ ] **VERIFY:** Error: "Rice irrigation is required for rice crops"
- [ ] Change typeOfCrop to "Corn"
- [ ] **VERIFY:** riceIrrigation no longer required
- [ ] Can save without riceIrrigation

### Harvest Validation (Harvested State)
- [ ] Transition report to "Planted"
- [ ] Try to mark as "Harvested" without harvest data
- [ ] **VERIFY:** Validation blocks transition
- [ ] **VERIFY:** Error messages for missing harvest fields
- [ ] Fill harvestArea > areaPlanted
- [ ] Try to save
- [ ] **VERIFY:** Error: "Harvest area cannot exceed area planted"
- [ ] Set dateOfHarvest before dateOfPlanting
- [ ] Try to save
- [ ] **VERIFY:** Error: "Harvest date must be after planting date"

## State Transition Rules

### Valid Transitions
- [ ] Planting → Planted: **VERIFY:** Works
- [ ] Planted → Harvested (with harvest data): **VERIFY:** Works
- [ ] Planted → Planting: **VERIFY:** Cannot revert (no back button)

### Invalid Transitions
- [ ] Try to jump from Planting → Harvested
- [ ] **VERIFY:** Button not available or blocked
- [ ] Try to edit state directly via API
- [ ] **VERIFY:** Backend validation prevents invalid transitions

## Table/Filter Testing

### All Reports Tab
- [ ] Navigate to "All Reports" tab
- [ ] **VERIFY:** Shows reports in all states: Planting, Planted, Harvested
- [ ] **VERIFY:** No "Distributed" or "Request" or "Completed" labels appear

### Distribution Reports Tab
- [ ] Navigate to "Distribution Reports" tab
- [ ] **VERIFY:** Only shows reports with distributionRequestId
- [ ] Click edit on any distribution report
- [ ] **VERIFY:** Planting details section is visible (critical bug fix)
- [ ] **VERIFY:** State shows as "Planting" or "Planted" or "Harvested"

### State Filters
- [ ] Use state filter dropdown
- [ ] **VERIFY:** Only 3 options appear:
  - Planting
  - Planted
  - Harvested
- [ ] Select "Planting"
- [ ] **VERIFY:** Only shows reports in Planting state
- [ ] Select "Harvested"
- [ ] **VERIFY:** Only shows reports in Harvested state

### Statistics Cards
- [ ] View dashboard/statistics
- [ ] **VERIFY:** Counts for:
  - Total Reports
  - Planting (not "Request")
  - Planted
  - Harvested (not "Completed")
- [ ] **VERIFY:** No "Distributed" count card

## UI/UX Verification

### State Workflow Indicator
- [ ] Open any report
- [ ] **VERIFY:** Indicator shows 3 steps (not 4):
  1. Planting
  2. Planted
  3. Harvested
- [ ] **VERIFY:** Current state is highlighted
- [ ] **VERIFY:** Completed steps show checkmark
- [ ] **VERIFY:** No "Request" or "Distributed" or "Completed" labels

### Transition Buttons
- [ ] In Planting state: **VERIFY:** Button says "Mark as Planted"
- [ ] In Planted state: **VERIFY:** Button says "Mark as Harvested"
- [ ] In Harvested state: **VERIFY:** No transition button, only "Archive"

### No Old State References
- [ ] Browse entire Planting Reports section
- [ ] **VERIFY:** No mentions of:
  - "Request" state
  - "Distributed" state (as a report state)
  - "Completed" state
- [ ] Check all tabs, filters, cards, labels
- [ ] Open browser console
- [ ] **VERIFY:** No errors about undefined PLANTING_STATES constants

## API/Network Testing

### API Response Validation
- [ ] Open Network tab in DevTools
- [ ] Create/edit/transition a report
- [ ] Check POST/PUT request payload
- [ ] **VERIFY:** State values are: "Planting", "Planted", or "Harvested"
- [ ] **VERIFY:** No "Request", "Distributed", or "Completed" in payloads
- [ ] Check GET responses
- [ ] **VERIFY:** Reports return with valid 3-state values

### Backend Validation
- [ ] Try to send invalid state via API directly
- [ ] POST with `state: "Request"`
- [ ] **VERIFY:** Backend rejects with validation error
- [ ] Try `state: "Distributed"`
- [ ] **VERIFY:** Backend rejects
- [ ] Try `state: "Completed"`
- [ ] **VERIFY:** Backend rejects

## Edge Cases & Error Handling

### Distribution Auto-Creation (Seeding/Initialization)
- [ ] Create new distribution request
- [ ] Assign farmers and seeds
- [ ] **VERIFY:** Linked planting reports auto-created with state = "Planting"
- [ ] **VERIFY:** Not created with old "Distributed" or "Request" state

### Migration of Existing Data
- [ ] If old reports exist with "Request", "Distributed", or "Completed":
- [ ] **VERIFY:** Migration script updated them to new states
- [ ] **VERIFY:** No reports stuck with invalid states
- [ ] **VERIFY:** UI displays correctly for migrated reports

### Form Reset/Cancel
- [ ] Open edit modal
- [ ] Make changes
- [ ] Click cancel
- [ ] **VERIFY:** Changes discarded
- [ ] **VERIFY:** State unchanged
- [ ] Re-open modal
- [ ] **VERIFY:** Original data intact

## Performance & Console Checks

### Console Errors
- [ ] Open browser console
- [ ] Perform all above tests
- [ ] **VERIFY:** No errors about:
  - Undefined PLANTING_STATES
  - Missing state constants
  - Invalid state transitions
- [ ] **VERIFY:** No warnings about deprecated state names

### Query/Mutation Success
- [ ] Check React Query DevTools (if enabled)
- [ ] **VERIFY:** All mutations succeed
- [ ] **VERIFY:** Query cache updates correctly
- [ ] **VERIFY:** No stale state values

## Final Validation

### Complete Workflow
- [ ] Create report → "Planting" state
- [ ] Add all planting details
- [ ] Transition to "Planted"
- [ ] Verify fields locked correctly
- [ ] Add harvest data
- [ ] Transition to "Harvested"
- [ ] Verify all planting fields locked
- [ ] Modify harvest data
- [ ] Archive report
- [ ] **VERIFY:** Complete workflow works end-to-end

### Distribution Report Workflow
- [ ] Create distribution request
- [ ] Verify auto-created reports in "Planting" state
- [ ] Edit one distribution-linked report
- [ ] **VERIFY:** Planting details visible (bug fix verification)
- [ ] Add planting data and save
- [ ] Mark as planted
- [ ] Add harvest data
- [ ] Mark as harvested
- [ ] **VERIFY:** Distribution report workflow complete

## Sign-Off

- [ ] All critical tests passed
- [ ] No old state names visible in UI
- [ ] Distribution report bug fixed (planting details show)
- [ ] 3-state workflow functioning correctly
- [ ] Validation working for all states
- [ ] No console errors
- [ ] Ready for production deployment

---

**Tested By:** _______________  
**Date:** _______________  
**Build/Commit:** _______________  
**Issues Found:** _______________
