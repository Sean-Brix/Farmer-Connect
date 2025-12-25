# 08 - Routes and API Endpoints

**Phase:** Routes & Jobs  
**Dependency:** 04, 05, 06, 07 complete  
**Estimated Time:** 2-3 hours  
**File:** `server/Router/API/PlantingReport/index.js` (UPDATE EXISTING)

---

## ✅ PROGRESS CHECKLIST

- [ ] **Step 8.1:** Review current route structure
- [ ] **Step 8.2:** Update existing CRUD routes documentation
- [ ] **Step 8.3:** Add State Transition routes (Planted, Completed)
- [ ] **Step 8.4:** Add Archive/Unarchive routes
- [ ] **Step 8.5:** Add Soft Delete/Restore routes
- [ ] **Step 8.6:** Add Bulk Operation routes
- [ ] **Step 8.7:** Add Get Deleted Reports route
- [ ] **Step 8.8:** Update route authentication/authorization
- [ ] **Step 8.9:** Test all routes with Postman
- [ ] **Step 8.10:** Document all API endpoints

---

## 📋 IMPLEMENTATION STEPS

### Step 8.1: Review Current Route Structure

**EXAMINE:** `server/Router/API/PlantingReport/index.js`

**Expected current structure:**
```javascript
import express from 'express';
import {
    createPlantingReport,
    getAllPlantingReports,
    getPlantingReportById,
    updatePlantingReport,
    deletePlantingReport,
    getReportsByRSBSA
} from '../../../Controller/PlantingReport/plantingReportController.js';

const router = express.Router();

// Existing routes
router.post('/reports', createPlantingReport);
router.get('/reports', getAllPlantingReports);
router.get('/reports/:id', getPlantingReportById);
router.put('/reports/:id', updatePlantingReport);
router.delete('/reports/:id', deletePlantingReport);
router.get('/reports/rsbsa/:rsbsa', getReportsByRSBSA);

export default router;
```

**Verification:**
- [ ] Current routes documented
- [ ] Import statements identified
- [ ] Router structure understood

---

### Step 8.2: Update Existing CRUD Routes Documentation

**REPLACE the entire router file with:**

```javascript
/**
 * PLANTING REPORT API ROUTES
 * 
 * Updated for 3-State System:
 * - State 1 (Request_Report): Created via POST /reports
 * - State 2 (Planted): Transition via PATCH /reports/:id/transition/planted
 * - State 3 (Completed): Transition via PATCH /reports/:id/transition/completed
 * 
 * Changes from old version:
 * - DELETE now performs SOFT DELETE (can be restored)
 * - Added state transition endpoints
 * - Added archive/unarchive endpoints
 * - Added restore endpoint for soft-deleted records
 * - Added bulk operation endpoints
 * - Added deleted reports endpoint
 */

import express from 'express';
import {
    // CRUD operations (updated for state system)
    createPlantingReport,
    getAllPlantingReports,
    getPlantingReportById,
    updatePlantingReport,
    deletePlantingReport,  // Now SOFT DELETE
    getReportsByRSBSA,

    // State Transitions (NEW)
    transitionToPlanted,
    transitionToCompleted,

    // Archive Management (NEW)
    archiveReport,
    unarchiveReport,

    // Soft Delete Management (NEW)
    restoreReport,
    getDeletedReports,

    // Bulk Operations (NEW)
    bulkArchiveReports,
    bulkDeleteReports
} from '../../../Controller/PlantingReport/plantingReportController.js';

const router = express.Router();

// ============================================================================
// CRUD OPERATIONS (Updated for State System)
// ============================================================================

/**
 * POST /api/planting-reports/reports
 * Create new planting report in State 1 (Request_Report)
 * 
 * Required fields:
 * - farmerName, farmLocation, areaPlanted, typeOfCrop, varietyId, seedClassification
 * 
 * Optional fields:
 * - rsbsaNumber, croppingSeasonId, riceIrrigation, cropInsurance, requestNote
 */
router.post('/reports', createPlantingReport);

/**
 * GET /api/planting-reports/reports
 * Get all planting reports (excludes soft-deleted)
 * 
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Records per page (default: 25, max: 100)
 * - state: Filter by state (Request_Report | Planted | Completed)
 * - isArchived: Filter archived (true | false)
 * - distributionLinked: Filter by distribution link (true | false)
 * - typeOfCrop: Filter by crop type (Rice | Corn)
 * - varietyId: Filter by variety ID
 * - croppingSeasonId: Filter by season ID
 * - search: Search farmer name or location
 * - dateFrom: Filter created from date
 * - dateTo: Filter created to date
 */
router.get('/reports', getAllPlantingReports);

/**
 * GET /api/planting-reports/reports/:id
 * Get single planting report by ID (excludes soft-deleted)
 */
router.get('/reports/:id', getPlantingReportById);

/**
 * PUT /api/planting-reports/reports/:id
 * Update planting report fields (cannot change state directly)
 * 
 * Note: Use dedicated transition endpoints to change state
 */
router.put('/reports/:id', updatePlantingReport);

/**
 * DELETE /api/planting-reports/reports/:id
 * SOFT DELETE planting report
 * 
 * Changes:
 * - Sets isDeleted = true
 * - Can be restored within 30 days
 * - Automatically cleaned up after 30 days
 */
router.delete('/reports/:id', deletePlantingReport);

/**
 * GET /api/planting-reports/reports/rsbsa/:rsbsa
 * Get reports by farmer RSBSA number
 */
router.get('/reports/rsbsa/:rsbsa', getReportsByRSBSA);

// ============================================================================
// STATE TRANSITIONS (NEW)
// ============================================================================

/**
 * PATCH /api/planting-reports/reports/:id/transition/planted
 * Transition report from State 1 (Request_Report) → State 2 (Planted)
 * 
 * Required fields:
 * - dateOfPlanting: Date when planting occurred (≤ today)
 * - plantingMethod: Direct Seeding | Transplanting
 * - riceIrrigation: Required if typeOfCrop = Rice (Irrigated | Rainfed | Upland)
 * 
 * Optional fields:
 * - reason: Reason for state change (for audit trail)
 * 
 * Auto-calculates:
 * - dateOfExpectedHarvest (using variety DAS + planting method)
 */
router.patch('/reports/:id/transition/planted', transitionToPlanted);

/**
 * PATCH /api/planting-reports/reports/:id/transition/completed
 * Transition report from State 2 (Planted) → State 3 (Completed)
 * 
 * Required fields:
 * - harvestArea: Area harvested (must be ≤ areaPlanted)
 * - numberOfBags: Number of bags harvested
 * - weightPerBag: Weight per bag in kg
 * 
 * Optional fields:
 * - reason: Reason for state change (for audit trail)
 * 
 * Auto-calculates:
 * - yieldMtPerHa (with sanity checks)
 */
router.patch('/reports/:id/transition/completed', transitionToCompleted);

// ============================================================================
// ARCHIVE MANAGEMENT (NEW)
// ============================================================================

/**
 * PATCH /api/planting-reports/reports/:id/archive
 * Archive a completed report
 * 
 * Requirements:
 * - Report must be in Completed state
 * - Report must not be already archived
 * 
 * Body:
 * - archivedBy: User ID
 * - reason: Optional reason for archiving
 */
router.patch('/reports/:id/archive', archiveReport);

/**
 * PATCH /api/planting-reports/reports/:id/unarchive
 * Restore an archived report
 * 
 * Requirements:
 * - Report must be currently archived
 */
router.patch('/reports/:id/unarchive', unarchiveReport);

// ============================================================================
// SOFT DELETE MANAGEMENT (NEW)
// ============================================================================

/**
 * GET /api/planting-reports/reports/deleted
 * Get all soft-deleted reports (for admin "Deleted" tab)
 * 
 * Query params:
 * - page: Page number
 * - limit: Records per page
 * - typeOfCrop: Filter by crop type
 * - varietyId: Filter by variety
 * - search: Search farmer name or location
 * 
 * Returns:
 * - daysUntilPermanentDelete: Days remaining in 30-day window
 * - canRestore: Boolean if restore is still possible
 */
router.get('/reports/deleted', getDeletedReports);

/**
 * PATCH /api/planting-reports/reports/:id/restore
 * Restore a soft-deleted report
 * 
 * Requirements:
 * - Report must be soft-deleted (isDeleted = true)
 * - Must be within 30-day recovery window
 */
router.patch('/reports/:id/restore', restoreReport);

// ============================================================================
// BULK OPERATIONS (NEW)
// ============================================================================

/**
 * POST /api/planting-reports/reports/bulk/archive
 * Archive multiple completed reports at once
 * 
 * Body:
 * - reportIds: Array of report IDs (max 100)
 * - archivedBy: User ID
 * - reason: Optional reason
 * 
 * Requirements:
 * - All reports must be in Completed state
 * - All reports must not be already archived
 */
router.post('/reports/bulk/archive', bulkArchiveReports);

/**
 * POST /api/planting-reports/reports/bulk/delete
 * Soft delete multiple reports at once
 * 
 * Body:
 * - reportIds: Array of report IDs (max 100)
 * - deletedBy: User ID
 * 
 * All reports can be restored within 30 days
 */
router.post('/reports/bulk/delete', bulkDeleteReports);

export default router;
```

**Verification:**
- [ ] All existing routes preserved
- [ ] New routes added
- [ ] Documentation complete
- [ ] Imports correct

---

### Step 8.3-9.6: Already Completed

Routes added in Step 8.2 above.

**Verification:**
- [ ] State transition routes added
- [ ] Archive routes added
- [ ] Soft delete routes added
- [ ] Bulk operation routes added

---

### Step 8.7: Add Route for Variety Reports (Optional)

**IF you implemented `getReportsByVariety` in Step 7.4, add this route:**

```javascript
// In the Variety router file: server/Router/API/Variety/index.js

import {
    // ... existing imports
    getReportsByVariety  // NEW
} from '../../../Controller/Variety/varietyController.js';

/**
 * GET /api/varieties/:id/reports
 * Get all planting reports using this variety
 * 
 * Query params:
 * - page, limit: Pagination
 * - state: Filter by state
 * - croppingSeasonId: Filter by season
 * - isArchived: Include/exclude archived
 */
router.get('/:id/reports', getReportsByVariety);
```

**Verification:**
- [ ] Route added to variety router
- [ ] Documentation added

---

### Step 8.8: Update Route Authentication/Authorization

**IF your app uses authentication middleware, apply it:**

```javascript
import { authenticate, authorize } from '../../../Middlewares/auth.js';

// Example: Protect all routes
router.use(authenticate);

// Example: Only admins can bulk delete
router.post('/reports/bulk/delete', 
    authorize(['Admin', 'SuperAdmin']), 
    bulkDeleteReports
);

// Example: Only admins can restore deleted reports
router.patch('/reports/:id/restore', 
    authorize(['Admin', 'SuperAdmin']), 
    restoreReport
);

// Example: Anyone authenticated can create reports
router.post('/reports', createPlantingReport);
```

**Adjust based on your app's permission system.**

**Verification:**
- [ ] Authentication middleware applied
- [ ] Authorization rules set
- [ ] Sensitive routes protected

---

### Step 8.9: Test All Routes with Postman

**Create Postman collection with these tests:**

```javascript
// Test Suite: Planting Report API (3-State System)

// 1. CREATE Report (State 1)
POST http://localhost:5000/api/planting-reports/reports
{
    "farmerName": "Juan Dela Cruz",
    "farmLocation": "Barangay San Jose",
    "areaPlanted": 2.5,
    "typeOfCrop": "Rice",
    "varietyId": "{{varietyId}}",
    "seedClassification": "Certified",
    "createdBy": "{{userId}}",
    "lastUpdatedBy": "{{userId}}"
}
// Expected: 201 Created, state = "Request_Report"

// 2. GET ALL Reports
GET http://localhost:5000/api/planting-reports/reports?page=1&limit=25&state=Request_Report
// Expected: 200 OK, pagination metadata

// 3. GET BY ID
GET http://localhost:5000/api/planting-reports/reports/{{reportId}}
// Expected: 200 OK, full report details

// 4. TRANSITION to Planted (State 2)
PATCH http://localhost:5000/api/planting-reports/reports/{{reportId}}/transition/planted
{
    "dateOfPlanting": "2024-01-15",
    "plantingMethod": "Transplanting",
    "riceIrrigation": "Irrigated",
    "lastUpdatedBy": "{{userId}}"
}
// Expected: 200 OK, state = "Planted", dateOfExpectedHarvest calculated

// 5. TRANSITION to Completed (State 3)
PATCH http://localhost:5000/api/planting-reports/reports/{{reportId}}/transition/completed
{
    "harvestArea": 2.3,
    "numberOfBags": 46,
    "weightPerBag": 50,
    "lastUpdatedBy": "{{userId}}"
}
// Expected: 200 OK, state = "Completed", yieldMtPerHa calculated

// 6. ARCHIVE Report
PATCH http://localhost:5000/api/planting-reports/reports/{{reportId}}/archive
{
    "archivedBy": "{{userId}}",
    "reason": "Season ended"
}
// Expected: 200 OK, isArchived = true

// 7. UNARCHIVE Report
PATCH http://localhost:5000/api/planting-reports/reports/{{reportId}}/unarchive
// Expected: 200 OK, isArchived = false

// 8. SOFT DELETE Report
DELETE http://localhost:5000/api/planting-reports/reports/{{reportId}}
// Expected: 200 OK, isDeleted = true, recovery deadline returned

// 9. GET DELETED Reports
GET http://localhost:5000/api/planting-reports/reports/deleted
// Expected: 200 OK, shows soft-deleted records with daysUntilPermanentDelete

// 10. RESTORE Report
PATCH http://localhost:5000/api/planting-reports/reports/{{reportId}}/restore
// Expected: 200 OK, isDeleted = false

// 11. BULK ARCHIVE (create 3 completed reports first)
POST http://localhost:5000/api/planting-reports/reports/bulk/archive
{
    "reportIds": ["{{id1}}", "{{id2}}", "{{id3}}"],
    "archivedBy": "{{userId}}",
    "reason": "End of season"
}
// Expected: 200 OK, count = 3

// 12. BULK DELETE
POST http://localhost:5000/api/planting-reports/reports/bulk/delete
{
    "reportIds": ["{{id4}}", "{{id5}}"],
    "deletedBy": "{{userId}}"
}
// Expected: 200 OK, count = 2, recovery deadline

// 13. UPDATE Report (should NOT change state)
PUT http://localhost:5000/api/planting-reports/reports/{{reportId}}
{
    "areaPlanted": 3.0,
    "lastUpdatedBy": "{{userId}}"
}
// Expected: 200 OK, areaPlanted updated, state unchanged

// 14. Test Invalid Transition (skip state)
PATCH http://localhost:5000/api/planting-reports/reports/{{reportId}}/transition/completed
// When report is in Request_Report state
// Expected: 400 Bad Request, "Cannot transition from Request_Report to Completed"

// 15. Test Archive Before Completion
PATCH http://localhost:5000/api/planting-reports/reports/{{reportId}}/archive
// When report is in Planted state
// Expected: 400 Bad Request, "Only Completed reports can be archived"
```

**Verification:**
- [ ] All endpoints accessible
- [ ] State transitions work correctly
- [ ] Validation errors handled
- [ ] Soft delete works
- [ ] Restore works
- [ ] Bulk operations work

---

### Step 8.10: Document All API Endpoints

**CREATE:** `Documentation/PlantingReport_Analysis/Backend/API_Endpoints.md`

```markdown
# Planting Report API Endpoints

**Base URL:** `/api/planting-reports`

## CRUD Operations

### Create Report
- **Endpoint:** `POST /reports`
- **Auth:** Required
- **State:** Creates in State 1 (Request_Report)
- **Body:**
  ```json
  {
    "farmerName": "string (required)",
    "farmLocation": "string (required)",
    "areaPlanted": "number (required)",
    "typeOfCrop": "Rice | Corn (required)",
    "varietyId": "uuid (required)",
    "seedClassification": "Certified | Good | Registered (required)",
    "rsbsaNumber": "string (optional)",
    "croppingSeasonId": "uuid (optional)",
    "riceIrrigation": "Irrigated | Rainfed | Upland (optional)",
    "cropInsurance": "boolean (optional)",
    "requestNote": "string (optional)",
    "createdBy": "uuid (required)",
    "lastUpdatedBy": "uuid (required)"
  }
  ```
- **Response:** `201 Created`

### Get All Reports
- **Endpoint:** `GET /reports`
- **Auth:** Required
- **Query Params:**
  - `page`: integer (default: 1)
  - `limit`: integer (default: 25, max: 100)
  - `state`: Request_Report | Planted | Completed
  - `isArchived`: true | false
  - `distributionLinked`: true | false
  - `typeOfCrop`: Rice | Corn
  - `varietyId`: uuid
  - `croppingSeasonId`: uuid
  - `search`: string (searches farmerName, farmLocation)
  - `dateFrom`: ISO date
  - `dateTo`: ISO date
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 25,
      "totalPages": 4,
      "hasNext": true,
      "hasPrev": false
    }
  }
  ```

### Get Report by ID
- **Endpoint:** `GET /reports/:id`
- **Auth:** Required
- **Response:** `200 OK` or `404 Not Found`

### Update Report
- **Endpoint:** `PUT /reports/:id`
- **Auth:** Required
- **Body:** Partial update (cannot change `state` directly)
- **Response:** `200 OK`

### Delete Report (Soft)
- **Endpoint:** `DELETE /reports/:id`
- **Auth:** Required
- **Response:** `200 OK` with recovery deadline

## State Transitions

### Transition to Planted (State 1 → 2)
- **Endpoint:** `PATCH /reports/:id/transition/planted`
- **Auth:** Required
- **Requirements:**
  - Report must be in Request_Report state
- **Body:**
  ```json
  {
    "dateOfPlanting": "ISO date (≤ today, required)",
    "plantingMethod": "Direct Seeding | Transplanting (required)",
    "riceIrrigation": "Irrigated | Rainfed | Upland (required if Rice)",
    "reason": "string (optional)",
    "lastUpdatedBy": "uuid (required)"
  }
  ```
- **Auto-calculates:** `dateOfExpectedHarvest`
- **Response:** `200 OK`

### Transition to Completed (State 2 → 3)
- **Endpoint:** `PATCH /reports/:id/transition/completed`
- **Auth:** Required
- **Requirements:**
  - Report must be in Planted state
- **Body:**
  ```json
  {
    "harvestArea": "number (≤ areaPlanted, required)",
    "numberOfBags": "integer (required)",
    "weightPerBag": "number (required)",
    "reason": "string (optional)",
    "lastUpdatedBy": "uuid (required)"
  }
  ```
- **Auto-calculates:** `yieldMtPerHa`
- **Response:** `200 OK` with yield warning if applicable

## Archive Management

### Archive Report
- **Endpoint:** `PATCH /reports/:id/archive`
- **Auth:** Required
- **Requirements:**
  - Report must be in Completed state
  - Report must not be already archived
- **Body:**
  ```json
  {
    "archivedBy": "uuid (required)",
    "reason": "string (optional)"
  }
  ```
- **Response:** `200 OK`

### Unarchive Report
- **Endpoint:** `PATCH /reports/:id/unarchive`
- **Auth:** Required
- **Requirements:**
  - Report must be archived
- **Response:** `200 OK`

## Soft Delete Management

### Get Deleted Reports
- **Endpoint:** `GET /reports/deleted`
- **Auth:** Admin only
- **Query Params:** Same as Get All Reports
- **Response:** `200 OK` with `daysUntilPermanentDelete` and `canRestore` fields

### Restore Report
- **Endpoint:** `PATCH /reports/:id/restore`
- **Auth:** Admin only
- **Requirements:**
  - Report must be soft-deleted
  - Must be within 30-day window
- **Response:** `200 OK` or `400 Bad Request` if expired

## Bulk Operations

### Bulk Archive
- **Endpoint:** `POST /reports/bulk/archive`
- **Auth:** Admin only
- **Body:**
  ```json
  {
    "reportIds": ["uuid", "uuid", ...],  // max 100
    "archivedBy": "uuid (required)",
    "reason": "string (optional)"
  }
  ```
- **Requirements:**
  - All reports must be in Completed state
  - All reports must not be archived
- **Response:** `200 OK` with count

### Bulk Delete
- **Endpoint:** `POST /reports/bulk/delete`
- **Auth:** Admin only
- **Body:**
  ```json
  {
    "reportIds": ["uuid", "uuid", ...],  // max 100
    "deletedBy": "uuid (required)"
  }
  ```
- **Response:** `200 OK` with count and recovery deadline

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Technical error message (dev mode only)",
  "details": { ... }  // Optional additional context
}
```

**Status Codes:**
- `400 Bad Request`: Validation error, invalid state transition
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized for this action
- `404 Not Found`: Resource not found or soft-deleted
- `500 Internal Server Error`: Server error
```

**Verification:**
- [ ] All endpoints documented
- [ ] Request/response examples provided
- [ ] Requirements listed
- [ ] Error codes documented

---

## 🎯 EXIT CRITERIA

- [x] **All 10 checkboxes marked**
- [x] **All routes added and documented**
- [x] **Postman tests created**
- [x] **API documentation written**
- [x] **Authentication/authorization applied**
- [x] **All endpoints tested**

---

**Next File:** [10_Cleanup_Job.md](./10_Cleanup_Job.md)  
**Status:** Ready for implementation
