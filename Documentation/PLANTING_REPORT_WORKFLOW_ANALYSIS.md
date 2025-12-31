# Planting Report & Distribution Workflow - Complete Analysis

## Current Date: December 31, 2025

## Purpose
This document provides a comprehensive analysis of the Planting Report and Distribution Request features, comparing current implementation against requirements.

---

## TABLE OF CONTENTS
1. [Required Workflows](#required-workflows)
2. [Current Implementation Analysis](#current-implementation-analysis)
3. [File-by-File Analysis](#file-by-file-analysis)
4. [Critical Issues Found](#critical-issues-found)
5. [Recommended Fixes](#recommended-fixes)
6. [Testing Checklist](#testing-checklist)

---

# REQUIRED WORKFLOWS

### 1. Report Creation
**Expected Behavior:**
- Admin creates report with **Farmer Information** and **Seed Details** only
- Initial status: **"Planting"** (seeds not yet planted)
- No planting details required at creation

**Required Fields at Creation:**
- Farmer Name
- Farm Location
- RSBSA Number (optional)
- Type of Crop
- Variety ID
- Cropping Season ID
- Area Planted
- Seed Classification
- Crop Insurance

---

### 2. Planting Phase (Status: "Planting")
**Expected Behavior:**
- Admin can edit reports with "Planting" status
- Additional inputs appear: **Planting Details** (optional initially)
- **Conditional Validation Rule:** If ANY ONE planting field is filled, ALL planting fields become required
- When all planting details are complete and saved → status changes to **"Planted"**

**Planting Detail Fields:**
- Date of Planting
- Planting Method
- Rice Irrigation (if crop type is Rice)
- Date of Expected Harvest (auto-calculated)

**Validation Logic Needed:**
```javascript
if (dateOfPlanting || plantingMethod || riceIrrigation) {
  // ALL planting fields are now required
  require: dateOfPlanting, plantingMethod
  if (typeOfCrop === 'Rice') require: riceIrrigation
}
```

---

### 3. Planted Phase (Status: "Planted")
**Expected Behavior:**
- Admin can edit reports with "Planted" status
- Additional inputs appear: **Harvest Details** (optional initially)
- **Conditional Validation Rule:** If ANY ONE harvest field is filled, ALL harvest fields become required
- When all harvest details are complete and saved → status changes to **"Harvested"**

**Harvest Detail Fields:**
- Harvest Area
- Number of Bags
- Weight Per Bag
- Yield Mt/Ha (auto-calculated)

**Validation Logic Needed:**
```javascript
if (harvestArea || numberOfBags || weightPerBag) {
  // ALL harvest fields are now required
  require: harvestArea, numberOfBags, weightPerBag
}
```

---

### 4. Harvested Phase (Status: "Harvested")
**Expected Behavior:**
- Report is **completed** but still **ACTIVE**
- Admin can **archive** the report to make it **INACTIVE**
- **Important:** Users can only request 2 maximum ACTIVE seeds (impacts distribution quota)

**Status:**
- `isArchived: false` = ACTIVE (counts toward user's quota)
- `isArchived: true` = INACTIVE (archived, doesn't count toward quota)

---

### 5. Distribution Request Integration
**Expected Behavior:**
- When distribution request status = "Picked_Up", admin can create planting report
- Created report starts in **"Planting"** status (NOT "Distributed")
- Report is linked to distribution request (bidirectional navigation)
- Same workflow as manual reports (Planting → Planted → Harvested → Archived)

**Linkage:**
- PlantingReport has `distributionRequestId`
- ItemTransaction (Distribution) has `plantingReportId`
- Both pages show link to navigate between them

---

## Current Implementation Issues

### Issue 1: State System Mismatch
**Current States:**
- Distributed
- Planting
- Planted
- Harvested

**Expected States:**
- Planting (initial state for ALL reports)
- Planted
- Harvested

**Problem:** "Distributed" state exists but shouldn't according to requirements. All reports should start as "Planting" regardless of source (manual or distribution).

---

### Issue 2: Validation Field Exclusions
**Current Error:** `variety is not allowed`, `archivedBy is not allowed`

**Problem:** Update payload includes relation objects and system fields that shouldn't be sent

**Fields to ALWAYS Exclude from Update:**
- `id`
- `state` (managed by backend transitions)
- `isArchived`, `archivedAt`, `archivedBy`
- `isDeleted`, `deletedAt`
- `createdAt`, `updatedAt`
- `lastUpdatedBy`
- **Relation objects:** `user`, `seedVariety`, `croppingSeason`, `distributionRequest`
- **Relation IDs from distribution:** `distributionRequestId`, `distributionItemId`, `distributionQuantity`, `distributionUnit`, `distributedQuantity`, `distributionPickupDate`

**Fields to Include Based on State:**
- **Planting state:** Farmer Info + Seed Details (+ optional Planting Details)
- **Planted state:** All of above + Planting Details (required) (+ optional Harvest Details)
- **Harvested state:** All of above + Harvest Details (required)

---

### Issue 3: Missing Conditional Validation
**Current Implementation:** Fields are either required or optional based on state only

**Required Implementation:** 
- Fields should be optional initially
- BUT if user fills ANY ONE field in a section, ALL fields in that section become required
- This allows admins to correct mistakes without forcing state transition
- Forces complete data when admin intends to transition

**Example:**
```javascript
// Planting Details - Conditional Validation
if (formData.dateOfPlanting || formData.plantingMethod || formData.riceIrrigation) {
  // User has started filling planting details
  errors.dateOfPlanting = !formData.dateOfPlanting ? 'Required when planting details are provided' : null;
  errors.plantingMethod = !formData.plantingMethod ? 'Required when planting details are provided' : null;
  if (formData.typeOfCrop === 'Rice') {
    errors.riceIrrigation = !formData.riceIrrigation ? 'Required for rice crops' : null;
  }
}

// Harvest Details - Conditional Validation
if (formData.harvestArea || formData.numberOfBags || formData.weightPerBag) {
  // User has started filling harvest details
  errors.harvestArea = !formData.harvestArea ? 'Required when harvest details are provided' : null;
  errors.numberOfBags = !formData.numberOfBags ? 'Required when harvest details are provided' : null;
  errors.weightPerBag = !formData.weightPerBag ? 'Required when harvest details are provided' : null;
}
```

---

### Issue 4: State Transition Logic
**Current:** Backend handles state transitions

**Required Verification:**
- Does backend automatically transition from Planting → Planted when planting details are complete?
- Does backend automatically transition from Planted → Harvested when harvest details are complete?
- Or does frontend need to explicitly trigger transitions?

---

### Issue 5: Field Visibility and Read-Only Rules
**Current Constants:**
```javascript
HIDDEN_FIELDS = {
  [PLANTING_STATES.REQUEST]: [/* planting + harvest fields */],
  [PLANTING_STATES.PLANTED]: [/* harvest fields */],
  [PLANTING_STATES.COMPLETED]: []
}
```

**Issue:** Uses old state names (REQUEST, COMPLETED)

**Should Be:**
```javascript
HIDDEN_FIELDS = {
  'Planting': [/* hide harvest fields only - planting fields optional */],
  'Planted': [/* hide nothing - harvest fields optional */],
  'Harvested': [/* hide nothing - all fields visible */]
}
```

---

## Recommended Changes

### Change 1: Remove "Distributed" State
**Action:** All reports start as "Planting" status
- Update constants to remove DISTRIBUTED
- Update backend seed data
- Update validation schemas
- Update state helpers

### Change 2: Fix Update Payload Exclusions
**Action:** Exclude all relation objects and system fields

```javascript
const {
  id,
  state,
  isArchived,
  archivedAt,
  archivedBy,
  isDeleted,
  deletedAt,
  createdAt,
  updatedAt,
  lastUpdatedBy,
  // Relation objects
  user,
  seedVariety,
  variety, // alias for seedVariety
  croppingSeason,
  distributionRequest,
  // Distribution linkage (read-only)
  distributionRequestId,
  distributionItemId,
  distributionQuantity,
  distributionUnit,
  distributedQuantity,
  distributionPickupDate,
  requestNote,
  plantingReportDeadline,
  ...allowedFields
} = formData;
```

### Change 3: Implement Conditional Validation
**Action:** Create validation logic that checks if ANY field in a section is filled

**Files to Modify:**
- `validation/reportSchema.js` - Add conditional validation functions
- `hooks/useReportForm.js` - Implement conditional required logic

### Change 4: Update State-Based Field Filtering
**Action:** Filter fields based on state before sending to backend

**Current Issue:** Sending null values for harvest fields in Planting/Planted states
**Solution:** Delete those fields entirely from payload

```javascript
const removeFieldsByState = (data, state) => {
  const cleaned = { ...data };
  
  if (state === 'Planting') {
    // In Planting state, can have planting details but NO harvest details
    delete cleaned.harvestArea;
    delete cleaned.numberOfBags;
    delete cleaned.weightPerBag;
    delete cleaned.yieldMtPerHa;
  } else if (state === 'Planted') {
    // In Planted state, must have planting details but NO harvest details yet
    delete cleaned.harvestArea;
    delete cleaned.numberOfBags;
    delete cleaned.weightPerBag;
    delete cleaned.yieldMtPerHa;
  }
  // Harvested state includes all fields
  
  return cleaned;
};
```

### Change 5: Backend State Transition
**Action:** Verify backend automatically transitions states based on complete data

**Expected Backend Logic:**
```javascript
// In updateReport controller
if (state === 'Planting' && hasCompletePlantingDetails(data)) {
  data.state = 'Planted';
}

if (state === 'Planted' && hasCompleteHarvestDetails(data)) {
  data.state = 'Harvested';
}
```

---

## Files That Need Changes

### Frontend
1. **constants/plantingReportConstants.js**
   - Remove DISTRIBUTED state
   - Update HIDDEN_FIELDS to match Planting/Planted/Harvested
   - Update REQUIRED_FIELDS with conditional logic notes

2. **validation/reportSchema.js**
   - Remove DISTRIBUTED case
   - Add conditional validation for planting details
   - Add conditional validation for harvest details

3. **components/ReportModal/index.jsx**
   - Fix update payload exclusions (add variety, relation objects)
   - Improve state-based field filtering
   - Don't send null/undefined for fields that shouldn't exist in that state

4. **hooks/useReportForm.js**
   - Implement conditional validation in validateForm()

5. **utils/modalHelpers.js**
   - Update for Planting/Planted/Harvested states (remove Distributed)

### Backend
6. **Controller/plantingReportController.js**
   - Verify state transition logic on update
   - Ensure Planting → Planted when planting details complete
   - Ensure Planted → Harvested when harvest details complete

7. **validation/joi schemas**
   - Update to reject extra fields not allowed per state
   - Add better error messages

### Database
8. **Seed Data**
   - Change "Distributed" reports to "Planting"
   - Ensure all reports follow proper workflow

---

## Testing Checklist

### Manual Report Creation
- [ ] Create report with only Farmer Info + Seed Details
- [ ] Verify initial status is "Planting"
- [ ] Verify planting details are hidden/optional

### Planting Details
- [ ] Edit Planting report
- [ ] Fill ONE planting field (e.g., date)
- [ ] Verify all planting fields become required
- [ ] Complete all planting fields and save
- [ ] Verify status transitions to "Planted"

### Harvest Details
- [ ] Edit Planted report
- [ ] Fill ONE harvest field (e.g., harvest area)
- [ ] Verify all harvest fields become required
- [ ] Complete all harvest fields and save
- [ ] Verify status transitions to "Harvested"

### Archive Workflow
- [ ] Harvested report shows "Archive" option
- [ ] Archive the report
- [ ] Verify isArchived = true
- [ ] Verify report is INACTIVE (doesn't count toward quota)

### Distribution Integration
- [ ] Create distribution request
- [ ] Approve and mark as Picked_Up
- [ ] Create planting report from distribution
- [ ] Verify initial status is "Planting" (NOT "Distributed")
- [ ] Verify bidirectional link between report and request
- [ ] Follow same workflow: Planting → Planted → Harvested → Archived

---

## Current Validation Error Root Cause

**Error:** `variety is not allowed`, `archivedBy is not allowed`, `harvest area must be a number`

**Root Cause:**
1. Relation objects (`variety`, `seedVariety`, `croppingSeason`) are being sent in update payload
2. System fields (`archivedBy`, `lastUpdatedBy`) are being sent in update payload
3. Harvest fields with `null` values are being sent for non-Harvested states

**Solution:**
- Exclude ALL relation objects from update payload
- Exclude ALL system-managed fields
- DELETE (not set to null) fields that don't apply to current state
- Only send the primitive field values that can be updated

---

## Next Steps

1. **Immediate Fix:** Update exclusion list in `index.jsx` handleSave to include `variety` and other relation objects
2. **State System:** Decide if "Distributed" should be removed or kept
3. **Conditional Validation:** Implement "if one filled, all required" logic
4. **Backend Verification:** Check if state transitions are automatic or need frontend trigger
5. **Testing:** Complete testing checklist above
