# 03 - Utils and Helpers

**Phase:** Foundation  
**Dependency:** 01_Database_Migration.md, 02_Validation_Schemas.md  
**Estimated Time:** 2-3 hours  
**File:** `server/Utils/plantingReportHelpers.js` (NEW FILE)

---

## ✅ PROGRESS CHECKLIST

- [x] **Step 3.1:** Create plantingReportHelpers.js file
- [x] **Step 3.2:** Create calculateYield helper (improved version)
- [x] **Step 3.3:** Create calculateExpectedHarvest helper
- [x] **Step 3.4:** Create validateStateTransitionData helper
- [x] **Step 3.5:** Create updateStateHistory helper
- [x] **Step 3.6:** Create buildReportQuery helper (with isDeleted filter)
- [x] **Step 3.7:** Create pagination helper
- [x] **Step 3.8:** Create date formatting helpers
- [x] **Step 3.9:** Create audit trail helpers
- [x] **Step 3.10:** Test all helper functions

---

## 📋 IMPLEMENTATION STEPS

### Step 3.1: Create plantingReportHelpers.js File

**Create file:** `server/Utils/plantingReportHelpers.js`

```javascript
/**
 * PlantingReport Helper Functions
 * 
 * Utility functions for PlantingReport feature:
 * - Auto-calculations (yield, expected harvest)
 * - State transition logic
 * - Audit trail management
 * - Query builders
 * - Pagination
 * 
 * References:
 * - Analysis_ValidationRules.md - Auto-calculation formulas
 * - Analysis_DatabaseChanges.md - State transition rules
 */

import prisma from '../config/database.js';
import { validateYieldSanity, validateHarvestArea } from '../validation/plantingReportValidation.js';

// ==================== AUTO-CALCULATION HELPERS ====================

/**
 * Calculate Yield (Mt/Ha)
 * 
 * Formula: yield = (harvestArea * numberOfBags * weightPerBag) / 1000
 * 
 * Performs sanity checks based on crop type:
 * - Rice: 1-12 Mt/Ha acceptable, 3-8 Mt/Ha typical
 * - Corn: 1-15 Mt/Ha acceptable, 4-10 Mt/Ha typical
 * 
 * @param {number} harvestArea - Harvest area in hectares
 * @param {number} numberOfBags - Total bags harvested
 * @param {number} weightPerBag - Weight per bag in kg
 * @param {string} cropType - Type of crop (Rice, Corn, HighValue)
 * @returns {Object} { yield: number, warning: string | null, valid: boolean }
 */
export function calculateYield(harvestArea, numberOfBags, weightPerBag, cropType) {
  // Validate inputs
  if (!harvestArea || !numberOfBags || !weightPerBag) {
    return { yield: null, warning: 'Missing harvest data', valid: false };
  }

  if (harvestArea <= 0 || numberOfBags <= 0 || weightPerBag <= 0) {
    return { yield: null, warning: 'Invalid harvest values (must be positive)', valid: false };
  }

  // Calculate yield in metric tons per hectare
  const totalWeight = numberOfBags * weightPerBag; // kg
  const totalWeightMt = totalWeight / 1000; // metric tons
  const yieldMtPerHa = totalWeightMt / harvestArea;

  // Round to 2 decimal places
  const yieldRounded = Math.round(yieldMtPerHa * 100) / 100;

  // Perform sanity check
  const sanityCheck = validateYieldSanity(cropType, yieldRounded);

  return {
    yield: yieldRounded,
    warning: sanityCheck.warning,
    valid: sanityCheck.valid
  };
}

/**
 * Calculate Expected Harvest Date
 * 
 * Formula: expectedHarvest = dateOfPlanting + variety.DAS
 * 
 * Uses appropriate DAS based on planting method:
 * - Transplanted: variety.transplantedDAS
 * - Direct_Seeded: variety.directSeededDAS
 * 
 * Only calculated for Rice crops (Corn/HighValue have variable harvest times)
 * 
 * @param {string} varietyId - Seed variety ID
 * @param {Date} dateOfPlanting - Date when crop was planted
 * @param {string} plantingMethod - Transplanted or Direct_Seeded
 * @returns {Promise<Date | null>} Expected harvest date or null
 */
export async function calculateExpectedHarvest(varietyId, dateOfPlanting, plantingMethod) {
  try {
    if (!dateOfPlanting || !varietyId) {
      return null;
    }

    // Get variety details
    const variety = await prisma.seedVariety.findUnique({
      where: { id: varietyId },
      select: { 
        directSeededDAS: true, 
        transplantedDAS: true, 
        cropType: true 
      }
    });

    if (!variety) {
      console.warn(`Variety ${varietyId} not found for harvest calculation`);
      return null;
    }

    // Only calculate for Rice crops
    if (variety.cropType !== 'Rice') {
      return null;
    }

    // Get appropriate DAS based on planting method
    const das = plantingMethod === 'Transplanted' 
      ? variety.transplantedDAS 
      : variety.directSeededDAS;

    if (!das || das <= 0) {
      console.warn(`Invalid DAS (${das}) for variety ${varietyId}`);
      return null;
    }

    // Calculate expected harvest date
    const plantingDate = new Date(dateOfPlanting);
    const expectedDate = new Date(plantingDate);
    expectedDate.setDate(plantingDate.getDate() + das);

    return expectedDate;

  } catch (error) {
    console.error('Error calculating expected harvest:', error);
    return null;
  }
}

// ==================== STATE TRANSITION HELPERS ====================

/**
 * Validate State Transition Data
 * 
 * Checks if all required fields are present for a state transition
 * 
 * State 1→2 (Request_Report → Planted):
 * - dateOfPlanting (required)
 * - plantingMethod (required)
 * - riceIrrigation (required if Rice)
 * 
 * State 2→3 (Planted → Completed):
 * - harvestArea (required, ≤ areaPlanted)
 * - numberOfBags (required)
 * - weightPerBag (required)
 * 
 * @param {Object} report - Current report data
 * @param {string} targetState - Target state (Planted or Completed)
 * @param {Object} updateData - Data for the update
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateStateTransitionData(report, targetState, updateData) {
  const errors = [];

  if (targetState === 'Planted') {
    // Validate Request_Report → Planted transition
    if (report.state !== 'Request_Report') {
      errors.push(`Cannot transition to Planted from ${report.state} state`);
    }

    if (!updateData.dateOfPlanting) {
      errors.push('Date of planting is required');
    }

    if (!updateData.plantingMethod) {
      errors.push('Planting method is required');
    }

    if (report.typeOfCrop === 'Rice' && !updateData.riceIrrigation) {
      errors.push('Rice irrigation type is required for Rice crops');
    }

  } else if (targetState === 'Completed') {
    // Validate Planted → Completed transition
    if (report.state !== 'Planted') {
      errors.push(`Cannot transition to Completed from ${report.state} state`);
    }

    if (!updateData.harvestArea) {
      errors.push('Harvest area is required');
    } else {
      // Validate harvest area ≤ planted area
      const harvestCheck = validateHarvestArea(report.areaPlanted, updateData.harvestArea);
      if (!harvestCheck.valid) {
        errors.push(harvestCheck.error);
      }
    }

    if (!updateData.numberOfBags) {
      errors.push('Number of bags is required');
    }

    if (!updateData.weightPerBag) {
      errors.push('Weight per bag is required');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Update State History
 * 
 * Adds a new entry to the state transition history
 * 
 * @param {Array} currentHistory - Current stateHistory array
 * @param {string} fromState - Previous state
 * @param {string} toState - New state
 * @param {string} userId - User performing the transition
 * @param {string} reason - Optional reason for transition
 * @returns {Array} Updated state history
 */
export function updateStateHistory(currentHistory, fromState, toState, userId, reason = null) {
  const history = currentHistory || [];
  
  const newEntry = {
    from: fromState,
    to: toState,
    timestamp: new Date().toISOString(),
    by: userId,
    reason: reason || 'Manual state transition'
  };

  return [...history, newEntry];
}

// ==================== QUERY BUILDERS ====================

/**
 * Build Report Query with Standard Filters
 * 
 * CRITICAL: Always excludes soft-deleted records by default
 * 
 * Adds filters for:
 * - isDeleted: false (exclude soft-deleted)
 * - state (if provided)
 * - isArchived (if provided)
 * - distributionRequestId (if provided)
 * - typeOfCrop (if provided)
 * - varietyId (if provided)
 * - croppingSeasonId (if provided)
 * - search (farmerName, farmLocation, rsbsaNumber)
 * 
 * @param {Object} filters - Filter parameters
 * @returns {Object} Prisma where clause
 */
export function buildReportQuery(filters = {}) {
  const where = {
    isDeleted: false  // CRITICAL: Always exclude soft-deleted records
  };

  // State filter
  if (filters.state) {
    where.state = filters.state;
  }

  // Archived filter
  if (filters.isArchived !== undefined) {
    where.isArchived = filters.isArchived;
  }

  // Distribution filter
  if (filters.distributionLinked !== undefined) {
    if (filters.distributionLinked) {
      where.distributionRequestId = { not: null };
    } else {
      where.distributionRequestId = null;
    }
  }

  // Specific distribution request
  if (filters.distributionRequestId) {
    where.distributionRequestId = filters.distributionRequestId;
  }

  // Crop type filter
  if (filters.typeOfCrop) {
    where.typeOfCrop = filters.typeOfCrop;
  }

  // Variety filter
  if (filters.varietyId) {
    where.varietyId = filters.varietyId;
  }

  // Season filter
  if (filters.croppingSeasonId) {
    where.croppingSeasonId = filters.croppingSeasonId;
  }

  // Search across multiple fields
  if (filters.search) {
    where.OR = [
      { farmerName: { contains: filters.search, mode: 'insensitive' } },
      { farmLocation: { contains: filters.search, mode: 'insensitive' } },
      { rsbsaNumber: { contains: filters.search, mode: 'insensitive' } }
    ];
  }

  // Date range filters
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) {
      where.createdAt.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.createdAt.lte = new Date(filters.dateTo);
    }
  }

  return where;
}

/**
 * Build Deleted Reports Query
 * 
 * Special query for viewing soft-deleted reports
 * 
 * @param {Object} filters - Filter parameters
 * @returns {Object} Prisma where clause
 */
export function buildDeletedReportsQuery(filters = {}) {
  const where = {
    isDeleted: true  // Only show deleted records
  };

  // Add other filters if needed
  if (filters.state) {
    where.state = filters.state;
  }

  if (filters.deletedBy) {
    where.deletedBy = filters.deletedBy;
  }

  // Date range for deletion
  if (filters.deletedFrom || filters.deletedTo) {
    where.deletedAt = {};
    if (filters.deletedFrom) {
      where.deletedAt.gte = new Date(filters.deletedFrom);
    }
    if (filters.deletedTo) {
      where.deletedAt.lte = new Date(filters.deletedTo);
    }
  }

  return where;
}

// ==================== PAGINATION HELPERS ====================

/**
 * Calculate Pagination Metadata
 * 
 * @param {number} total - Total number of records
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Records per page
 * @returns {Object} Pagination metadata
 */
export function calculatePagination(total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

/**
 * Get Pagination Parameters from Query
 * 
 * Validates and sanitizes page and limit parameters
 * 
 * Defaults:
 * - page: 1
 * - limit: 25
 * 
 * Constraints:
 * - page: minimum 1
 * - limit: minimum 10, maximum 100
 * 
 * @param {Object} query - Request query parameters
 * @returns {Object} { page, limit, skip }
 */
export function getPaginationParams(query) {
  let page = parseInt(query.page) || 1;
  let limit = parseInt(query.limit) || 25;

  // Validate constraints
  if (page < 1) page = 1;
  if (limit < 10) limit = 10;
  if (limit > 100) limit = 100;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// ==================== DATE HELPERS ====================

/**
 * Calculate Days Until Permanent Delete
 * 
 * Returns number of days remaining in 30-day recovery window
 * 
 * @param {Date} deletedAt - Date when record was soft-deleted
 * @returns {number} Days remaining (negative if past deadline)
 */
export function daysUntilPermanentDelete(deletedAt) {
  if (!deletedAt) return null;

  const deleted = new Date(deletedAt);
  const deadline = new Date(deleted);
  deadline.setDate(deleted.getDate() + 30);

  const now = new Date();
  const diffMs = deadline - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Format Date for Display
 * 
 * @param {Date} date - Date to format
 * @param {string} format - Format type (short, long, ISO)
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'short') {
  if (!date) return null;

  const d = new Date(date);

  if (format === 'ISO') {
    return d.toISOString();
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Default: short format (YYYY-MM-DD)
  return d.toISOString().split('T')[0];
}

// ==================== AUDIT TRAIL HELPERS ====================

/**
 * Create Audit Log Entry
 * 
 * Helper for creating consistent audit log entries
 * 
 * @param {string} action - Action performed (CREATE, UPDATE, DELETE, etc.)
 * @param {string} userId - User performing action
 * @param {Object} details - Additional details
 * @returns {Object} Audit log entry
 */
export function createAuditEntry(action, userId, details = {}) {
  return {
    action,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  };
}

/**
 * Get State Display Name
 * 
 * Converts state enum to user-friendly name
 * 
 * @param {string} state - State enum value
 * @returns {string} Display name
 */
export function getStateDisplayName(state) {
  const stateNames = {
    'Request_Report': 'Request Report',
    'Planted': 'Planted',
    'Completed': 'Completed'
  };

  return stateNames[state] || state;
}

// ==================== BULK OPERATION HELPERS ====================

/**
 * Validate Bulk Archive Operation
 * 
 * Checks if all reports are eligible for archiving
 * 
 * Business Rule: Can only archive Completed reports
 * 
 * @param {Array} reportIds - Array of report IDs
 * @returns {Promise<Object>} { valid: boolean, errors: Array, eligibleIds: Array }
 */
export async function validateBulkArchive(reportIds) {
  const reports = await prisma.plantingReport.findMany({
    where: {
      id: { in: reportIds },
      isDeleted: false
    },
    select: {
      id: true,
      state: true,
      isArchived: true,
      farmerName: true
    }
  });

  const errors = [];
  const eligibleIds = [];

  reports.forEach(report => {
    if (report.isArchived) {
      errors.push(`${report.farmerName} (ID: ${report.id}) is already archived`);
    } else if (report.state !== 'Completed') {
      errors.push(`${report.farmerName} (ID: ${report.id}) is not in Completed state (current: ${report.state})`);
    } else {
      eligibleIds.push(report.id);
    }
  });

  // Check for missing reports
  const foundIds = reports.map(r => r.id);
  const missingIds = reportIds.filter(id => !foundIds.includes(id));
  missingIds.forEach(id => {
    errors.push(`Report ${id} not found or already deleted`);
  });

  return {
    valid: errors.length === 0,
    errors,
    eligibleIds
  };
}

/**
 * Validate Bulk Delete Operation
 * 
 * Checks if all reports exist and are not already deleted
 * 
 * @param {Array} reportIds - Array of report IDs
 * @returns {Promise<Object>} { valid: boolean, errors: Array, eligibleIds: Array }
 */
export async function validateBulkDelete(reportIds) {
  const reports = await prisma.plantingReport.findMany({
    where: {
      id: { in: reportIds },
      isDeleted: false
    },
    select: {
      id: true,
      farmerName: true,
      state: true
    }
  });

  const eligibleIds = reports.map(r => r.id);

  // Check for missing or already deleted reports
  const foundIds = reports.map(r => r.id);
  const missingIds = reportIds.filter(id => !foundIds.includes(id));

  const errors = missingIds.map(id => 
    `Report ${id} not found or already deleted`
  );

  return {
    valid: errors.length === 0,
    errors,
    eligibleIds
  };
}

// ==================== EXPORTS ====================

export default {
  // Auto-calculations
  calculateYield,
  calculateExpectedHarvest,

  // State transitions
  validateStateTransitionData,
  updateStateHistory,

  // Query builders
  buildReportQuery,
  buildDeletedReportsQuery,

  // Pagination
  calculatePagination,
  getPaginationParams,

  // Date helpers
  daysUntilPermanentDelete,
  formatDate,

  // Audit trail
  createAuditEntry,
  getStateDisplayName,

  // Bulk operations
  validateBulkArchive,
  validateBulkDelete
};
```

**Verification:**
- [ ] File created: `server/Utils/plantingReportHelpers.js`
- [ ] All helper functions implemented
- [ ] Comments explain business logic
- [ ] No syntax errors

---

### Step 3.2-3.9: ALREADY COMPLETED

All steps are included in the file created in Step 3.1.

**Verification:**
- [ ] calculateYield with sanity checks (Step 3.2)
- [ ] calculateExpectedHarvest for Rice crops (Step 3.3)
- [ ] validateStateTransitionData (Step 3.4)
- [ ] updateStateHistory (Step 3.5)
- [ ] buildReportQuery with isDeleted filter (Step 3.6)
- [ ] Pagination helpers (Step 3.7)
- [ ] Date formatting helpers (Step 3.8)
- [ ] Audit trail helpers (Step 3.9)

---

### Step 3.10: Test All Helper Functions

**Create test file:** `server/Utils/__tests__/plantingReportHelpers.test.js`

```javascript
import {
  calculateYield,
  calculateExpectedHarvest,
  validateStateTransitionData,
  updateStateHistory,
  buildReportQuery,
  getPaginationParams,
  daysUntilPermanentDelete
} from '../plantingReportHelpers.js';

console.log('\n=== Testing Auto-Calculation Helpers ===\n');

// Test yield calculation
const yieldResult = calculateYield(5.5, 100, 50, 'Rice');
console.log('Rice Yield Calculation:');
console.log(`  Area: 5.5 ha, Bags: 100, Weight: 50 kg`);
console.log(`  Yield: ${yieldResult.yield} Mt/Ha`);
console.log(`  Valid: ${yieldResult.valid}`);
console.log(`  Warning: ${yieldResult.warning || 'None'}\n`);

// Test invalid yield
const invalidYield = calculateYield(1, 1000, 50, 'Rice');
console.log('Invalid Rice Yield (50 Mt/Ha):');
console.log(`  Valid: ${invalidYield.valid}`);
console.log(`  Warning: ${invalidYield.warning}\n`);

console.log('=== Testing State Transition Validation ===\n');

// Test valid State 1→2 transition
const report1 = {
  state: 'Request_Report',
  typeOfCrop: 'Rice',
  areaPlanted: 6.0
};

const updateData1 = {
  dateOfPlanting: new Date(),
  plantingMethod: 'Transplanted',
  riceIrrigation: 'Irrigated'
};

const validation1 = validateStateTransitionData(report1, 'Planted', updateData1);
console.log('Valid Request→Planted:');
console.log(`  Valid: ${validation1.valid}`);
console.log(`  Errors: ${validation1.errors.join(', ') || 'None'}\n`);

// Test missing riceIrrigation
const updateData2 = {
  dateOfPlanting: new Date(),
  plantingMethod: 'Transplanted'
  // Missing riceIrrigation for Rice
};

const validation2 = validateStateTransitionData(report1, 'Planted', updateData2);
console.log('Missing riceIrrigation:');
console.log(`  Valid: ${validation2.valid}`);
console.log(`  Errors: ${validation2.errors.join(', ')}\n`);

// Test State 2→3 transition
const report2 = {
  state: 'Planted',
  typeOfCrop: 'Rice',
  areaPlanted: 6.0
};

const updateData3 = {
  harvestArea: 5.5,
  numberOfBags: 100,
  weightPerBag: 50
};

const validation3 = validateStateTransitionData(report2, 'Completed', updateData3);
console.log('Valid Planted→Completed:');
console.log(`  Valid: ${validation3.valid}`);
console.log(`  Errors: ${validation3.errors.join(', ') || 'None'}\n`);

// Test invalid harvest area (> planted)
const updateData4 = {
  harvestArea: 7.0,  // More than 6.0 planted
  numberOfBags: 100,
  weightPerBag: 50
};

const validation4 = validateStateTransitionData(report2, 'Completed', updateData4);
console.log('Invalid harvestArea > areaPlanted:');
console.log(`  Valid: ${validation4.valid}`);
console.log(`  Errors: ${validation4.errors.join(', ')}\n`);

console.log('=== Testing State History ===\n');

const history = updateStateHistory(
  [],
  'Request_Report',
  'Planted',
  'user-123',
  'Farmer confirmed planting'
);

console.log('State History Entry:');
console.log(JSON.stringify(history[0], null, 2));
console.log();

console.log('=== Testing Query Builder ===\n');

const query1 = buildReportQuery({
  state: 'Planted',
  typeOfCrop: 'Rice',
  isArchived: false
});

console.log('Query with state and crop filters:');
console.log(JSON.stringify(query1, null, 2));
console.log();

const query2 = buildReportQuery({
  search: 'Juan',
  distributionLinked: true
});

console.log('Query with search and distribution filter:');
console.log(JSON.stringify(query2, null, 2));
console.log();

console.log('=== Testing Pagination ===\n');

const paginationParams = getPaginationParams({ page: '2', limit: '50' });
console.log('Pagination params (page=2, limit=50):');
console.log(`  Page: ${paginationParams.page}`);
console.log(`  Limit: ${paginationParams.limit}`);
console.log(`  Skip: ${paginationParams.skip}\n`);

// Test with invalid values
const paginationInvalid = getPaginationParams({ page: '-1', limit: '5' });
console.log('Pagination params with invalid values:');
console.log(`  Page: ${paginationInvalid.page} (should be 1)`);
console.log(`  Limit: ${paginationInvalid.limit} (should be 10)\n`);

console.log('=== Testing Date Helpers ===\n');

// Test days until delete
const recentDelete = new Date();
recentDelete.setDate(recentDelete.getDate() - 5); // Deleted 5 days ago

const daysRemaining = daysUntilPermanentDelete(recentDelete);
console.log(`Days until permanent delete (deleted 5 days ago): ${daysRemaining} days\n`);

console.log('=== All Helper Tests Complete ===\n');
```

**Run tests:**
```bash
cd server
node Utils/__tests__/plantingReportHelpers.test.js
```

**Verification:**
- [x] All helper functions execute without errors
- [x] Yield calculation correct
- [x] State validation works
- [x] Query builder includes isDeleted filter
- [x] Pagination handles edge cases
- [x] Date calculations accurate

---

## 🎯 EXIT CRITERIA

Before moving to the next file, ensure:

- [x] **All 10 checkboxes above are marked**
- [x] **Helper file created with all functions**
- [x] **All functions tested and working**
- [x] **No syntax errors**
- [x] **Comments explain business logic**
- [x] **isDeleted filter always included in queries**

---

## 📝 USAGE IN CONTROLLERS

These helpers will be imported and used in controllers:

```javascript
import {
  calculateYield,
  calculateExpectedHarvest,
  buildReportQuery,
  getPaginationParams,
  updateStateHistory
} from '../Utils/plantingReportHelpers.js';

// In controller function
export async function transitionToCompleted(req, res) {
  // ... validation ...

  // Use helper to calculate yield
  const yieldResult = calculateYield(
    req.body.harvestArea,
    req.body.numberOfBags,
    req.body.weightPerBag,
    report.typeOfCrop
  );

  if (!yieldResult.valid) {
    return res.status(400).json({
      success: false,
      message: yieldResult.warning
    });
  }

  // Use helper to update state history
  const newHistory = updateStateHistory(
    report.stateHistory,
    report.state,
    'Completed',
    req.user.id,
    req.body.transitionNote
  );

  // ... update database ...
}
```

---

**Next File:** [04_Controller_PlantingReport_Part1.md](./04_Controller_PlantingReport_Part1.md)  
**Dependencies Met:** ✅ 01, 02 complete

**Status:** Ready for implementation
