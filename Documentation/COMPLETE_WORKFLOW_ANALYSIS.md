# COMPLETE WORKFLOW ANALYSIS: Planting Reports & Distribution
**Date:** December 31, 2025  
**Author:** System Analysis

---

## TABLE OF CONTENTS
1. [Required Workflows](#1-required-workflows)
2. [Current Backend Implementation](#2-current-backend-implementation)
3. [Current Frontend Implementation](#3-current-frontend-implementation)
4. [File-by-File CRUD Analysis](#4-file-by-file-crud-analysis)
5. [Critical Gaps & Issues](#5-critical-gaps--issues)
6. [Immediate Fixes Required](#6-immediate-fixes-required)

---

# 1. REQUIRED WORKFLOWS

## 1.1 Manual Planting Report Creation

### Step 1: Create Report (Initial State: "Planting")
**User Action:** Admin creates new planting report  
**Fields Required:**
- Farmer Name ✓
- Farm Location ✓
- RSBSA Number (optional)
- Type of Crop ✓
- Variety ID ✓
- Cropping Season ID ✓
- Area Planted ✓
- Seed Classification ✓
- Crop Insurance ✓

**Fields NOT Allowed:**
- Date of Planting (must be null)
- Planting Method (must be null)
- Rice Irrigation (must be null)
- Harvest fields (all must be null)

**Result:** Report created with `state: "Planting"`, `isArchived: false`

---

### Step 2: Add Planting Details (Transition: Planting → Planted)
**User Action:** Admin edits "Planting" report  
**New Fields Appear:** Planting Details section (optional)

**Conditional Validation Rule:**
```
IF (dateOfPlanting !=  null OR plantingMethod != null OR riceIrrigation != null) THEN
  REQUIRE: dateOfPlanting
  REQUIRE: plantingMethod
  IF (typeOfCrop === 'Rice') THEN
    REQUIRE: riceIrrigation
  END IF
END IF
```

**When ALL planting details are complete:**
- Backend auto-transitions: `state: "Planting"` → `state: "Planted"`
- Frontend should NOT manually set state
- Audit log entry created

---

### Step 3: Add Harvest Details (Transition: Planted → Harvested)
**User Action:** Admin edits "Planted" report  
**New Fields Appear:** Harvest Details section (optional)

**Conditional Validation Rule:**
```
IF (harvestArea != null OR numberOfBags != null OR weightPerBag != null) THEN
  REQUIRE: harvestArea
  REQUIRE: numberOfBags
  REQUIRE: weightPerBag
  // yieldMtPerHa auto-calculated
END IF
```

**When ALL harvest details are complete:**
- Backend auto-transitions: `state: "Planted"` → `state: "Harvested"`
- Report is COMPLETE but still ACTIVE (`isArchived: false`)

---

### Step 4: Archive Report (ACTIVE → INACTIVE)
**User Action:** Admin archives "Harvested" report  
**Result:**
- `isArchived: true`
- `archivedAt: timestamp`
- `archivedBy: adminId`
- Report becomes INACTIVE (doesn't count toward user's 2-active-report quota)

---

## 1.2 Distribution-Linked Planting Report Creation

### Distribution Request Lifecycle
```
1. Pending → User submits request
2. Approved → Admin approves
3. Picked_Up → User picks up seeds (TRIGGER POINT)
4. Planted → Planting report transitions to Planted
5. Harvested → Planting report transitions to Harvested  
6. Archived → Planting report archived
```

### Step 1: Distribution Request Picked Up
**User Action:** Admin marks distribution request as "Picked_Up"  
**Backend Auto-Action:**
```javascript
// In setStatus.js when status changes to Picked_Up
if (plantingReportRequired === true && plantingReportId === null) {
  // Auto-create planting report
  const report = await prisma.plantingReport.create({
    data: {
      farmerName: `${user.firstName} ${user.surname}`,
      farmLocation: request.farmLocation,
      areaPlanted: request.areaPlanted,
      // ... other fields from distribution
      distributionRequestId: request.id,
      state: 'Planting', // ❌ CURRENT: 'Distributed'
    }
  });
  
  // Link back to distribution
  await prisma.itemTransaction.update({
    where: { id: request.id },
    data: { plantingReportId: report.id }
  });
}
```

**Expected Result:**
- Planting report created with `state: "Planting"` (NOT "Distributed")
- `distributionRequestId` links to transaction
- `plantingReportId` stored in transaction

---

### Step 2: Same as Manual Workflow
**From this point:** Distribution-linked reports follow EXACT same workflow as manual reports
- Planting → Planted → Harvested → Archived

**Bidirectional Linking:**
- Planting Report page shows "View Distribution Request" link
- Distribution Request page shows "View Planting Report" link

**Auto-Sync State Updates:**
```javascript
// When planting report transitions to Planted
if (report.distributionRequestId) {
  await prisma.itemTransaction.update({
    where: { id: report.distributionRequestId },
    data: { status: 'Planted' }
  });
}

// When planting report transitions to Harvested
if (report.distributionRequestId) {
  await prisma.itemTransaction.update({
    where: { id: report.distributionRequestId },
    data: { status: 'Harvested' } // ❌ CURRENT: Not in enum
  });
}
```

---

# 2. CURRENT BACKEND IMPLEMENTATION

## 2.1 PlantingReport Create (plantingReportController.js:50-120)

### Current Logic:
```javascript
state: distributionRequestId ? 'Distributed' : 'Planting'
```

**❌ ISSUE:** Creates "Distributed" state for distribution reports  
**✅ SHOULD BE:** Always create with `state: 'Planting'`

### Fields at Creation:
```javascript
{
  // Farmer info
  farmerName, farmLocation, rsbsaNumber,
  
  // Seed details
  typeOfCrop, varietyId, croppingSeasonId, areaPlanted, seedClassification, cropInsurance,
  
  // Planting details (ALL NULL)
  dateOfPlanting: null,
  plantingMethod: null,
  riceIrrigation: null,
  dateOfExpectedHarvest: null,
  
  // Harvest details (ALL NULL)
  harvestArea: null,
  numberOfBags: null,
  weightPerBag: null,
  yieldMtPerHa: null,
  
  // Distribution metadata (if from distribution)
  distributionRequestId,
  distributionItemId,
  distributionQuantity,
  distributionUnit,
  distributionPickupDate,
  
  // State
  state: 'Distributed' OR 'Planting', // ❌ Should always be 'Planting'
  isArchived: false,
  lastUpdatedBy: userId
}
```

---

## 2.2 PlantingReport Update (plantingReportController.js:400-600)

### Current Update Logic:
**File:** `server/Controller/PlantingReport/plantingReportController.js`

```javascript
// Line ~400: updateReport function
export const updateReport = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  // ❌ NO VALIDATION of which fields are allowed per state
  // ❌ NO conditional validation for planting/harvest details
  // ❌ Accepts relation objects (variety, seedVariety, croppingSeason)
  
  const updatedReport = await prisma.plantingReport.update({
    where: { id },
    data: updateData // ❌ Directly using request body
  });
};
```

**❌ CRITICAL ISSUES:**
1. No field filtering by state
2. No validation that harvest fields are null for Planting/Planted states
3. Accepts extra fields from frontend (variety, seedVariety, etc.)
4. No conditional validation implementation

---

## 2.3 State Transition Functions

### transitionToPlanted (Line ~800-860)
```javascript
export const transitionToPlanted = async (req, res) => {
  const { id } = req.params;
  const { dateOfPlanting, plantingMethod, riceIrrigation } = req.body;
  
  // ✅ Validates required fields
  // ✅ Updates distribution request status to 'Planted'
  // ✅ Creates audit log
  
  const updatedReport = await prisma.plantingReport.update({
    where: { id },
    data: {
      dateOfPlanting,
      plantingMethod,
      riceIrrigation,
      state: 'Planted'
    }
  });
  
  // Auto-update distribution request
  if (updatedReport.distributionRequestId) {
    await prisma.itemTransaction.update({
      where: { id: updatedReport.distributionRequestId },
      data: { status: 'Planted' }
    });
  }
};
```

**✅ GOOD:** Explicit state transition  
**❓ QUESTION:** Is this being used or is frontend calling regular update?

### transitionToHarvested (Line ~940-1000)
```javascript
export const transitionToHarvested = async (req, res) => {
  const { harvestArea, numberOfBags, weightPerBag } = req.body;
  
  // ✅ Validates required fields
  // ✅ Auto-calculates yieldMtPerHa
  // ❌ Tries to update distribution status to 'Harvested' (not in enum)
  
  const updatedReport = await prisma.plantingReport.update({
    where: { id },
    data: {
      harvestArea,
      numberOfBags,
      weightPerBag,
      yieldMtPerHa: calculated,
      state: 'Harvested'
    }
  });
};
```

**❌ ISSUE:** Distribution enum doesn't have 'Harvested' status

---

## 2.4 Distribution Auto-Create (setStatus.js:420-470)

```javascript
// When distribution status changes to Picked_Up
if (plantingReportRequired && !plantingReportId) {
  const report = await prisma.plantingReport.create({
    data: {
      farmerName: `${user.firstName} ${user.surname}`,
      farmLocation: transaction.farmLocation,
      areaPlanted: transaction.areaPlanted,
      // ... other fields
      distributionRequestId: transaction.id,
      state: 'Distributed', // ❌ Should be 'Planting'
    }
  });
  
  // Link back
  await prisma.itemTransaction.update({
    where: { id: transaction.id },
    data: { plantingReportId: report.id }
  });
}
```

**❌ ISSUE:** Creates with 'Distributed' state instead of 'Planting'

---

# 3. CURRENT FRONTEND IMPLEMENTATION

## 3.1 PlantingReport Modal (ReportModal/index.jsx)

### Create Mode (Line ~130-165)
```javascript
const {
  id, state, isArchived, isDeleted, createdAt, updatedAt,
  user, seedVariety, croppingSeason, distributionRequest,
  dateOfPlanting, plantingMethod, riceIrrigation, dateOfExpectedHarvest,
  harvestArea, numberOfBags, weightPerBag, yieldMtPerHa,
  ...allowedFields
} = formData;

createMutation.mutate(allowedFields);
```

**✅ GOOD:** Removes planting and harvest fields for create  
**❓ QUESTION:** But what if user fills them in the form?

### Edit Mode (Line ~175-210)
```javascript
const {
  id, state, isArchived, archivedAt, archivedBy,
  createdAt, updatedAt, lastUpdatedBy,
  user, seedVariety, croppingSeason, distributionRequest,
  distributionRequestId, distributionItemId, ...
  ...dataToSend
} = formData;

// Sanitize
const sanitized = sanitizeData(dataToSend);
const cleaned = removeStateSpecificFields(sanitized, report.state);

updateMutation.mutate({ id, data: cleaned });
```

**❌ ISSUE:** `variety` not excluded (causing "variety is not allowed" error)  
**✅ GOOD:** Removes state-specific fields  
**❌ ISSUE:** removeStateSpecificFields removes planting fields for Planting state (should be optional, not removed)

---

## 3.2 Validation Schema (reportSchema.js)

### Current Implementation:
```javascript
export function validateReportData(data, state) {
  switch (state) {
    case PLANTING_STATES.DISTRIBUTED: // ❌ Shouldn't exist
    case PLANTING_STATES.PLANTING:
      return requestReportSchema.validate(data, { abortEarly: false });
    case PLANTING_STATES.PLANTED:
      return plantedReportSchema.validate(data, { abortEarly: false });
    case PLANTING_STATES.HARVESTED:
      return completedReportSchema.validate(data, { abortEarly: false });
  }
}
```

**❌ ISSUES:**
1. Has DISTRIBUTED case
2. No conditional validation (all-or-nothing approach)
3. plantedReportSchema REQUIRES planting fields (doesn't allow optional)
4. completedReportSchema REQUIRES harvest fields (doesn't allow optional)

### requestReportSchema (Planting State):
```javascript
{
  farmerName: required,
  farmLocation: required,
  // ... seed details required
  dateOfPlanting: Joi.date().optional().allow(null, ''), // ✅ Optional
  plantingMethod: Joi.string().optional().allow(null, ''), // ✅ Optional
  harvestArea: Joi.any().optional().allow(null, '') // ✅ Optional
}
```

**✅ GOOD:** Fields are optional  
**❌ MISSING:** Conditional "if one filled, all required" logic

---

## 3.3 State-Based Field Removal (index.jsx:130-145)

```javascript
const removeStateSpecificFields = (data, currentState) => {
  const cleaned = { ...data };
  
  // Remove harvest fields if not in Harvested state
  if (currentState !== 'Harvested') {
    delete cleaned.harvestArea;
    delete cleaned.numberOfBags;
    delete cleaned.weightPerBag;
    delete cleaned.yieldMtPerHa;
  }
  
  // Remove planting fields if in Distributed/Planting state
  if (currentState === 'Distributed' || currentState === 'Planting') {
    delete cleaned.dateOfPlanting;
    delete cleaned.plantingMethod;
    delete cleaned.riceIrrigation;
    delete cleaned.dateOfExpectedHarvest;
  }
  
  return cleaned;
};
```

**❌ CRITICAL ISSUE:**  
This DELETES planting fields for Planting state!  
User CANNOT add planting details to transition from Planting → Planted!

**✅ SHOULD BE:**
```javascript
// Planting state: Can have planting details (to transition), NO harvest
if (currentState === 'Planting') {
  delete cleaned.harvestArea;
  delete cleaned.numberOfBags;
  delete cleaned.weightPerBag;
  delete cleaned.yieldMtPerHa;
  // DON'T delete planting fields - they're needed to transition!
}

// Planted state: Has planting details, can add harvest (to transition)
if (currentState === 'Planted') {
  delete cleaned.harvestArea;
  delete cleaned.numberOfBags;
  delete cleaned.weightPerBag;
  delete cleaned.yieldMtPerHa;
  // DON'T delete harvest fields - they're needed to transition!
}
```

---

# 4. FILE-BY-FILE CRUD ANALYSIS

## 4.1 Backend Files

### A. Controller/PlantingReport/plantingReportController.js

**CREATE (createReport)** - Lines 30-130
- ✅ Accepts farmer info + seed details
- ❌ Sets state to 'Distributed' if from distribution (should be 'Planting')
- ✅ Sets planting/harvest fields to null
- ✅ Links to distribution if distributionRequestId provided
- **VERDICT:** Needs fix for initial state

**READ (getReports, getReportById)** - Lines 150-350
- ✅ Fetches with pagination
- ✅ Includes relations (variety, croppingSeason, distributionRequest)
- ✅ Filters by state, isArchived, isDeleted
- **VERDICT:** Working correctly

**UPDATE (updateReport)** - Lines 400-600
- ❌ No field validation per state
- ❌ Accepts all fields from request body directly
- ❌ No conditional validation
- ❌ Doesn't check if fields are allowed for current state
- **VERDICT:** Critical security/validation issue

**DELETE (softDelete, hardDelete)** - Lines 700-800
- ✅ Soft delete sets isDeleted = true
- ✅ Hard delete after 30 days
- **VERDICT:** Working correctly

**STATE TRANSITIONS** - Lines 800-1000
- ✅ transitionToPlanted validates and updates state
- ✅ transitionToHarvested validates and updates state
- ✅ Auto-updates distribution request status
- ❌ Not being used by frontend (uses regular update instead)
- **VERDICT:** Good logic but not utilized

---

### B. Controller/Distribution/request/setStatus.js

**Auto-Create Planting Report** - Lines 420-470
- ✅ Creates report when status = Picked_Up
- ❌ Sets state to 'Distributed' (should be 'Planting')
- ✅ Links bidirectionally (distributionRequestId ↔ plantingReportId)
- ✅ Copies farmer info and seed details from distribution
- **VERDICT:** Needs state fix

**Update Distribution Status** - Lines 50-100
- ✅ Validates state transitions
- ✅ Updates timestamps
- ❌ 'Harvested' not in transaction_status enum
- **VERDICT:** Enum needs update

---

## 4.2 Frontend Files

### A. components/ReportModal/index.jsx

**Form State Management** - Lines 30-100
- ✅ Uses useReportForm hook
- ✅ Initializes with report data or defaults
- ✅ Tracks touched and errors
- **VERDICT:** Good structure

**handleSave (CREATE)** - Lines 130-165
- ✅ Removes system fields
- ✅ Removes planting/harvest fields
- ❌ But what if user filled them? No validation prevents it
- **VERDICT:** Needs conditional validation

**handleSave (UPDATE)** - Lines 175-210
- ❌ Missing 'variety' in exclusion list
- ❌ removeStateSpecificFields deletes planting fields for Planting state
- ❌ This prevents users from adding planting details!
- **VERDICT:** Critical bug - can't transition states

**handleClose** - Lines 220-230
- ✅ Resets form
- ✅ Clears errors
- **VERDICT:** Working

---

### B. validation/reportSchema.js

**validateReportData** - Lines 235-260
- ❌ Has DISTRIBUTED case
- ✅ Returns proper error structure
- ❌ No conditional validation
- **VERDICT:** Needs enhancement

**requestReportSchema (Planting)** - Lines 147-165
- ✅ Farmer/seed fields required
- ✅ Planting/harvest fields optional
- ❌ No conditional "if one filled, all required"
- **VERDICT:** Missing validation logic

**plantedReportSchema (Planted)** - Lines 170-195
- ✅ Requires planting fields
- ✅ Allows optional harvest fields
- ❌ No conditional harvest validation
- **VERDICT:** Missing validation logic

**completedReportSchema (Harvested)** - Lines 200-225
- ✅ Requires all fields
- **VERDICT:** Correct for harvested state

---

### C. hooks/useReportForm.js

**validateForm** - Lines 45-65
- ✅ Calls validateReportData
- ✅ Sets errors from Joi validation
- ❌ No additional conditional checks
- **VERDICT:** Relies on schema (which is incomplete)

**setFields** - Lines 70-80
- ✅ Updates multiple fields at once
- ✅ Triggers auto-calculations
- **VERDICT:** Working

---

### D. constants/plantingReportConstants.js

**PLANTING_STATES** - Lines 10-15
```javascript
{
  DISTRIBUTED: 'Distributed', // ❌ Should not exist
  PLANTING: 'Planting',
  PLANTED: 'Planted',
  HARVESTED: 'Harvested'
}
```
**VERDICT:** Remove DISTRIBUTED

**HIDDEN_FIELDS** - Lines 135-160
```javascript
{
  'Planting': [/* hide harvest */], // ❌ Also hides planting
  'Planted': [/* hide harvest */],
  'Harvested': []
}
```
**VERDICT:** Wrong - shouldn't hide fields needed for transition

---

# 5. CRITICAL GAPS & ISSUES

## 5.1 State System Issues

| Issue | Impact | Files Affected |
|-------|--------|----------------|
| "Distributed" state exists | Reports from distribution start in wrong state | Backend: plantingReportController.js, setStatus.js<br>Frontend: constants, all components |
| State transitions not used | Frontend uses generic update instead of state-specific transitions | Frontend: ReportModal/index.jsx |
| removeStateSpecificFields deletes transition fields | Users cannot add planting details to Planting reports! | Frontend: ReportModal/index.jsx |

---

## 5.2 Validation Issues

| Issue | Impact | Files Affected |
|-------|--------|----------------|
| No conditional validation | Users can partially fill sections without completing them | Frontend: reportSchema.js, useReportForm.js |
| Backend accepts all fields | Security/data integrity risk - can send invalid fields | Backend: plantingReportController.js update function |
| Relation objects in update payload | "variety is not allowed" errors | Frontend: ReportModal/index.jsx exclusion list |

---

## 5.3 Distribution Integration Issues

| Issue | Impact | Files Affected |
|-------|--------|----------------|
| 'Harvested' not in enum | Cannot sync harvest status to distribution | Backend: item.prisma enum |
| Auto-create uses 'Distributed' | Distribution reports start in wrong state | Backend: setStatus.js |
| No bidirectional links in UI | Users can't navigate between linked reports | Frontend: Distribution.jsx, ReportModal components |

---

# 6. IMMEDIATE FIXES REQUIRED

## Fix 1: Remove "Distributed" State Everywhere

### Backend:
```javascript
// plantingReportController.js Line 102
state: 'Planting', // Always Planting, regardless of source

// setStatus.js Line 444
state: 'Planting', // Not 'Distributed'
```

### Frontend:
```javascript
// constants/plantingReportConstants.js
export const PLANTING_STATES = {
  // Remove: DISTRIBUTED: 'Distributed',
  PLANTING: 'Planting',
  PLANTED: 'Planted',
  HARVESTED: 'Harvested'
};

// reportSchema.js - Remove DISTRIBUTED case
// All components - Remove DISTRIBUTED references
```

---

## Fix 2: Fix removeStateSpecificFields Logic

### Current (WRONG):
```javascript
if (currentState === 'Planting') {
  delete cleaned.dateOfPlanting; // ❌ WRONG! Need these to transition!
  delete cleaned.plantingMethod;
  delete cleaned.riceIrrigation;
}
```

### Fixed (CORRECT):
```javascript
if (currentState === 'Planting') {
  // Can have planting details (to transition), NO harvest
  delete cleaned.harvestArea;
  delete cleaned.numberOfBags;
  delete cleaned.weightPerBag;
  delete cleaned.yieldMtPerHa;
  // DON'T delete planting fields!
}

if (currentState === 'Planted') {
  // Has planting details, can add harvest (to transition)
  // Only remove harvest fields if they're empty
  if (!cleaned.harvestArea && !cleaned.numberOfBags && !cleaned.weightPerBag) {
    delete cleaned.harvestArea;
    delete cleaned.numberOfBags;
    delete cleaned.weightPerBag;
    delete cleaned.yieldMtPerHa;
  }
}
```

---

## Fix 3: Add 'variety' to Exclusion List

```javascript
const {
  id, state, isArchived, archivedAt, archivedBy,
  createdAt, updatedAt, lastUpdatedBy,
  user, seedVariety, variety, croppingSeason, distributionRequest, // Add 'variety'
  distributionRequestId, distributionItemId, distributionQuantity,
  distributionUnit, distributedQuantity, distributionPickupDate,
  requestNote, plantingReportDeadline, // Add these too
  ...dataToSend
} = formData;
```

---

## Fix 4: Implement Conditional Validation

### In reportSchema.js:
```javascript
// Add conditional validation helper
function conditionalPlantingValidation(data) {
  const hasAnyPlanting = data.dateOfPlanting || data.plantingMethod || data.riceIrrigation;
  
  if (hasAnyPlanting) {
    return Joi.object({
      dateOfPlanting: Joi.date().required(),
      plantingMethod: Joi.string().required(),
      riceIrrigation: data.typeOfCrop === 'Rice' 
        ? Joi.string().required() 
        : Joi.optional().allow(null)
    });
  }
  return Joi.object({
    dateOfPlanting: Joi.date().optional().allow(null),
    plantingMethod: Joi.string().optional().allow(null),
    riceIrrigation: Joi.string().optional().allow(null)
  });
}
```

---

## Fix 5: Add 'Harvested' to Distribution Enum

### In server/prisma/schema/item.prisma:
```prisma
enum transaction_status {
  Pending
  Approved
  Picked_Up
  Planted
  Harvested      // ✅ ADD THIS
  Archived
  // ... other statuses
}
```

Then run migration:
```bash
npx prisma migrate dev --name add_harvested_to_distribution_status
```

---

## Fix 6: Use State Transition Functions

### Frontend should call:
```javascript
// Instead of generic updateReport
PUT /api/planting-reports/reports/:id

// Use specific transitions:
POST /api/planting-reports/reports/:id/transition-to-planted
POST /api/planting-reports/reports/:id/transition-to-harvested
```

OR keep generic update but add backend validation:
```javascript
// In plantingReportController.js updateReport
export const updateReport = async (req, res) => {
  const currentReport = await prisma.plantingReport.findUnique({ where: { id } });
  const updateData = req.body;
  
  // Validate fields allowed for current state
  if (currentReport.state === 'Planting') {
    // Can update farmer/seed info + optionally add planting details
    // Cannot have harvest fields
    if (updateData.harvestArea || updateData.numberOfBags || updateData.weightPerBag) {
      return res.status(400).json({ error: 'Harvest fields not allowed in Planting state' });
    }
  }
  
  // Check if should auto-transition
  if (currentReport.state === 'Planting' && hasCompletePlantingDetails(updateData)) {
    updateData.state = 'Planted';
  }
  
  if (currentReport.state === 'Planted' && hasCompleteHarvestDetails(updateData)) {
    updateData.state = 'Harvested';
  }
  
  // ... proceed with update
};
```

---

## Fix 7: Add Bidirectional Links in UI

### In PlantingReport Modal:
```jsx
{report.distributionRequestId && (
  <Button
    variant="outlined"
    onClick={() => navigate(`/distribution?requestId=${report.distributionRequestId}`)}
  >
    View Distribution Request
  </Button>
)}
```

### In Distribution Request Card:
```jsx
{request.plantingReportId && (
  <Button
    variant="outlined"
    onClick={() => navigate(`/planting-reports?reportId=${request.plantingReportId}`)}
  >
    View Planting Report
  </Button>
)}
```

---

# SUMMARY OF REQUIRED CHANGES

## Priority 1 (Critical - Blocking Users):
1. ✅ Add 'variety' to exclusion list → Fixes "variety is not allowed"
2. ✅ Fix removeStateSpecificFields → Allows state transitions
3. ✅ Add distribution linkage fields to exclusions

## Priority 2 (Important - Workflow Broken):
4. Remove "Distributed" state system-wide
5. Implement conditional validation
6. Add 'Harvested' to distribution enum
7. Fix backend update validation

## Priority 3 (Enhancement):
8. Use state transition endpoints
9. Add bidirectional UI links
10. Update seed data
11. Improve error messages

---

**END OF ANALYSIS**
