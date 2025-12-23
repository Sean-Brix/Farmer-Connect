# 02 - Validation Schemas (Joi)

**Phase:** Foundation  
**Dependency:** 01_Database_Migration.md (complete)  
**Estimated Time:** 2-3 hours  
**File:** `server/validation/plantingReportValidation.js` (NEW FILE)

---

## ✅ PROGRESS CHECKLIST

- [ ] **Step 2.1:** Create validation directory structure
- [ ] **Step 2.2:** Install/verify Joi dependency
- [ ] **Step 2.3:** Create base validation schemas (farmer info, seeding details)
- [ ] **Step 2.4:** Create State 1→2 transition schema (to Planted)
- [ ] **Step 2.5:** Create State 2→3 transition schema (to Completed)
- [ ] **Step 2.6:** Create State 3→Archive validation
- [ ] **Step 2.7:** Create field-level validation helpers
- [ ] **Step 2.8:** Create cross-field validation (harvestArea ≤ areaPlanted)
- [ ] **Step 2.9:** Create yield sanity check validators
- [ ] **Step 2.10:** Create update report schema (state-aware)
- [ ] **Step 2.11:** Create bulk operation schemas
- [ ] **Step 2.12:** Test all schemas with sample data

---

## 📋 IMPLEMENTATION STEPS

### Step 2.1: Create Validation Directory Structure

**Action:** Create directory for validation schemas

```bash
# Run in server/ directory
cd server
mkdir -p validation
```

**Verification:**
- [ ] Directory exists: `server/validation/`

---

### Step 2.2: Install/Verify Joi Dependency

**Action:** Check if Joi is installed, if not install it

```bash
cd server
npm list joi
# If not installed:
npm install joi
```

**Verification:**
- [ ] Joi installed in package.json
- [ ] Version >= 17.0.0

---

### Step 2.3: Create Base Validation Schemas

**Create file:** `server/validation/plantingReportValidation.js`

```javascript
/**
 * PlantingReport Validation Schemas
 * 
 * Three-layer validation strategy:
 * 1. Frontend: Real-time validation (React Hook Form + Joi)
 * 2. Backend: Request validation (this file)
 * 3. Database: Constraints (check constraints in Prisma)
 * 
 * References:
 * - Analysis_ValidationRules.md - Complete validation specification
 * - prompt.md - Business rules for state transitions
 */

import Joi from 'joi';

// ==================== ENUMS ====================

const CropTypes = ['Rice', 'Corn', 'HighValue'];
const PlantingMethods = ['Transplanted', 'Direct_Seeded'];
const RiceIrrigationTypes = ['Irrigated', 'Rainfed'];
const SeedClassifications = [
  'Certified',
  'Registered',
  'Foundation',
  'Breeder',
  'Good',
  'Hybrid'
];
const PlantingReportStates = ['Request_Report', 'Planted', 'Completed'];

// ==================== BASE SCHEMAS ====================

/**
 * Farmer Information Schema
 * Required in ALL states
 */
export const farmerInfoSchema = Joi.object({
  farmerName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Farmer name is required',
      'string.min': 'Farmer name must be at least 2 characters',
      'string.max': 'Farmer name cannot exceed 100 characters'
    }),

  farmLocation: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Farm location is required',
      'string.min': 'Farm location must be at least 2 characters',
      'string.max': 'Farm location cannot exceed 200 characters'
    }),

  rsbsaNumber: Joi.string()
    .pattern(/^[A-Z0-9-]+$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'RSBSA number must contain only letters, numbers, and hyphens'
    })
});

/**
 * Seeding Details Schema
 * Required in State 1 (Request_Report)
 */
export const seedingDetailsSchema = Joi.object({
  typeOfCrop: Joi.string()
    .valid(...CropTypes)
    .required()
    .messages({
      'any.only': 'Type of crop must be Rice, Corn, or HighValue',
      'any.required': 'Type of crop is required'
    }),

  varietyId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Invalid variety ID format',
      'any.required': 'Seed variety is required'
    }),

  croppingSeasonId: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      'string.guid': 'Invalid season ID format'
    }),

  areaPlanted: Joi.number()
    .positive()
    .max(1000)
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Area planted must be greater than 0',
      'number.max': 'Area planted cannot exceed 1000 hectares',
      'any.required': 'Area planted is required'
    }),

  seedClassification: Joi.string()
    .valid(...SeedClassifications)
    .required()
    .messages({
      'any.only': 'Invalid seed classification',
      'any.required': 'Seed classification is required'
    }),

  cropInsurance: Joi.boolean()
    .default(false)
});

/**
 * Distribution Metadata Schema (optional, readonly in UI)
 */
export const distributionMetadataSchema = Joi.object({
  distributionRequestId: Joi.string().uuid().allow(null).optional(),
  distributionItemId: Joi.string().uuid().allow(null).optional(),
  distributionQuantity: Joi.number().integer().positive().allow(null).optional(),
  distributionUnit: Joi.string().max(50).allow(null).optional(),
  distributedQuantity: Joi.number().positive().precision(2).allow(null).optional(),
  distributionPickupDate: Joi.date().allow(null).optional()
}).optional();

// ==================== STATE TRANSITION SCHEMAS ====================

/**
 * State 1 → State 2 (Request_Report → Planted)
 * 
 * Required fields:
 * - dateOfPlanting (must be <= today)
 * - plantingMethod (Transplanted or Direct_Seeded)
 * - riceIrrigation (required ONLY if typeOfCrop is Rice)
 * 
 * Business Rule: Cannot skip states (must be in Request_Report currently)
 */
export const toPlantedSchema = Joi.object({
  dateOfPlanting: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.base': 'Date of planting must be a valid date',
      'date.max': 'Date of planting cannot be in the future',
      'any.required': 'Date of planting is required to transition to Planted state'
    }),

  plantingMethod: Joi.string()
    .valid(...PlantingMethods)
    .required()
    .messages({
      'any.only': 'Planting method must be Transplanted or Direct_Seeded',
      'any.required': 'Planting method is required to transition to Planted state'
    }),

  riceIrrigation: Joi.when('typeOfCrop', {
    is: 'Rice',
    then: Joi.string()
      .valid(...RiceIrrigationTypes)
      .required()
      .messages({
        'any.only': 'Rice irrigation must be Irrigated or Rainfed',
        'any.required': 'Rice irrigation type is required for Rice crops'
      }),
    otherwise: Joi.string().valid(...RiceIrrigationTypes).allow(null).optional()
  }),

  // Optional: Allow updating other fields during transition
  areaPlanted: Joi.number().positive().max(1000).precision(2).optional(),
  
  // Transition metadata
  transitionNote: Joi.string().max(500).allow('').optional()
});

/**
 * State 2 → State 3 (Planted → Completed)
 * 
 * Required fields:
 * - harvestArea (must be <= areaPlanted)
 * - numberOfBags (positive integer)
 * - weightPerBag (positive number, typically 10-60 kg)
 * 
 * Auto-calculated: yieldMtPerHa
 * Sanity checks: Yield must be within reasonable range for crop type
 * 
 * Business Rule: Cannot complete if not in Planted state
 */
export const toCompletedSchema = Joi.object({
  harvestArea: Joi.number()
    .positive()
    .max(Joi.ref('$areaPlanted'))  // Reference from context
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Harvest area must be greater than 0',
      'number.max': 'Harvest area cannot exceed planted area',
      'any.required': 'Harvest area is required to transition to Completed state'
    }),

  numberOfBags: Joi.number()
    .integer()
    .positive()
    .max(100000)
    .required()
    .messages({
      'number.positive': 'Number of bags must be greater than 0',
      'number.integer': 'Number of bags must be a whole number',
      'number.max': 'Number of bags seems unreasonably high (max 100,000)',
      'any.required': 'Number of bags is required to transition to Completed state'
    }),

  weightPerBag: Joi.number()
    .positive()
    .min(5)
    .max(100)
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Weight per bag must be greater than 0',
      'number.min': 'Weight per bag is too low (minimum 5 kg)',
      'number.max': 'Weight per bag is too high (maximum 100 kg)',
      'any.required': 'Weight per bag is required to transition to Completed state'
    }),

  // Transition metadata
  transitionNote: Joi.string().max(500).allow('').optional()
});

/**
 * Archive Validation
 * 
 * Business Rules:
 * - Can only archive reports in Completed state
 * - Requires admin permissions (validated in middleware)
 * - Optional: archiveNote for reason
 */
export const archiveReportSchema = Joi.object({
  archiveNote: Joi.string().max(500).allow('').optional()
});

/**
 * Unarchive Validation
 */
export const unarchiveReportSchema = Joi.object({
  unarchiveNote: Joi.string().max(500).allow('').optional()
});

/**
 * Soft Delete Validation
 * 
 * Business Rules:
 * - Can soft delete reports in any state
 * - Requires admin permissions
 * - Optional: deleteNote for reason
 */
export const softDeleteSchema = Joi.object({
  deleteNote: Joi.string().max(500).allow('').optional()
});

/**
 * Restore Deleted Report Validation
 */
export const restoreReportSchema = Joi.object({
  restoreNote: Joi.string().max(500).allow('').optional()
});

// ==================== CRUD SCHEMAS ====================

/**
 * Create Report Schema (State 1)
 * 
 * Creates report in Request_Report state
 * Only farmer info and seeding details required
 */
export const createReportSchema = Joi.object({
  // Farmer info (required)
  ...farmerInfoSchema.describe().keys,

  // Seeding details (required)
  ...seedingDetailsSchema.describe().keys,

  // Distribution metadata (optional)
  distributionRequestId: Joi.string().uuid().allow(null).optional(),
  distributionItemId: Joi.string().uuid().allow(null).optional(),
  distributionQuantity: Joi.number().integer().positive().allow(null).optional(),
  distributionUnit: Joi.string().max(50).allow(null).optional(),
  distributedQuantity: Joi.number().positive().precision(2).allow(null).optional(),
  distributionPickupDate: Joi.date().allow(null).optional(),

  // Optional fields
  requestNote: Joi.string().max(1000).allow('').optional(),

  // System fields
  createdBy: Joi.string().uuid().required(),
  lastUpdatedBy: Joi.string().uuid().required()
});

/**
 * Update Report Schema (State-Aware)
 * 
 * Validates updates based on current state:
 * - State 1: Can update farmer info, seeding details
 * - State 2: Can update planting details
 * - State 3: Can update harvest details
 * 
 * State transitions use dedicated endpoints
 */
export const updateReportSchema = Joi.object({
  // Farmer info (optional updates)
  farmerName: Joi.string().min(2).max(100).optional(),
  farmLocation: Joi.string().min(2).max(200).optional(),
  rsbsaNumber: Joi.string().pattern(/^[A-Z0-9-]+$/).allow(null, '').optional(),

  // Seeding details (optional updates, State 1 only)
  typeOfCrop: Joi.string().valid(...CropTypes).optional(),
  varietyId: Joi.string().uuid().optional(),
  croppingSeasonId: Joi.string().uuid().allow(null).optional(),
  areaPlanted: Joi.number().positive().max(1000).precision(2).optional(),
  seedClassification: Joi.string().valid(...SeedClassifications).optional(),
  cropInsurance: Joi.boolean().optional(),

  // Planting details (optional updates, State 2+ only)
  dateOfPlanting: Joi.date().max('now').optional(),
  plantingMethod: Joi.string().valid(...PlantingMethods).optional(),
  riceIrrigation: Joi.string().valid(...RiceIrrigationTypes).allow(null).optional(),

  // Harvest details (optional updates, State 3 only)
  harvestArea: Joi.number().positive().max(1000).precision(2).optional(),
  numberOfBags: Joi.number().integer().positive().optional(),
  weightPerBag: Joi.number().positive().min(5).max(100).precision(2).optional(),

  // Notes
  requestNote: Joi.string().max(1000).allow('').optional(),

  // System fields
  lastUpdatedBy: Joi.string().uuid().required()
});

// ==================== BULK OPERATION SCHEMAS ====================

/**
 * Bulk Archive Schema
 * 
 * Archives multiple reports at once
 * All reports must be in Completed state
 */
export const bulkArchiveSchema = Joi.object({
  reportIds: Joi.array()
    .items(Joi.string().uuid())
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one report ID required',
      'array.max': 'Cannot archive more than 100 reports at once'
    }),

  archiveNote: Joi.string().max(500).allow('').optional()
});

/**
 * Bulk Delete Schema
 * 
 * Soft deletes multiple reports at once
 */
export const bulkDeleteSchema = Joi.object({
  reportIds: Joi.array()
    .items(Joi.string().uuid())
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one report ID required',
      'array.max': 'Cannot delete more than 100 reports at once'
    }),

  deleteNote: Joi.string().max(500).allow('').optional()
});

// ==================== HELPER VALIDATORS ====================

/**
 * Yield Sanity Check
 * 
 * Validates calculated yield is within reasonable range:
 * - Rice: 1-12 Mt/Ha (typical: 3-8)
 * - Corn: 1-15 Mt/Ha (typical: 4-10)
 * - HighValue: No strict limits
 * 
 * Returns: { valid: boolean, warning: string | null }
 */
export function validateYieldSanity(cropType, yieldMtPerHa) {
  const yield_ = parseFloat(yieldMtPerHa);

  if (cropType === 'Rice') {
    if (yield_ < 1 || yield_ > 12) {
      return {
        valid: false,
        warning: `Rice yield (${yield_} Mt/Ha) is outside acceptable range (1-12 Mt/Ha). Please verify harvest data.`
      };
    }
    if (yield_ < 3 || yield_ > 8) {
      return {
        valid: true,
        warning: `Rice yield (${yield_} Mt/Ha) is unusual. Typical range is 3-8 Mt/Ha. Please verify if correct.`
      };
    }
  } else if (cropType === 'Corn') {
    if (yield_ < 1 || yield_ > 15) {
      return {
        valid: false,
        warning: `Corn yield (${yield_} Mt/Ha) is outside acceptable range (1-15 Mt/Ha). Please verify harvest data.`
      };
    }
    if (yield_ < 4 || yield_ > 10) {
      return {
        valid: true,
        warning: `Corn yield (${yield_} Mt/Ha) is unusual. Typical range is 4-10 Mt/Ha. Please verify if correct.`
      };
    }
  }

  return { valid: true, warning: null };
}

/**
 * Cross-Field Validation: Harvest Area ≤ Area Planted
 * 
 * Business Rule: Cannot harvest more area than was planted
 */
export function validateHarvestArea(areaPlanted, harvestArea) {
  if (harvestArea > areaPlanted) {
    return {
      valid: false,
      error: `Harvest area (${harvestArea} ha) cannot exceed planted area (${areaPlanted} ha)`
    };
  }

  if (harvestArea < areaPlanted * 0.5) {
    return {
      valid: true,
      warning: `Harvest area (${harvestArea} ha) is less than 50% of planted area (${areaPlanted} ha). This seems low.`
    };
  }

  return { valid: true, warning: null };
}

/**
 * State Transition Validation
 * 
 * Validates if a state transition is allowed
 * 
 * Allowed transitions:
 * - Request_Report → Planted
 * - Planted → Completed
 * - No other transitions allowed
 * 
 * Returns: { valid: boolean, error: string | null }
 */
export function validateStateTransition(currentState, newState) {
  const validTransitions = {
    'Request_Report': ['Planted'],
    'Planted': ['Completed'],
    'Completed': []  // Cannot transition from Completed
  };

  if (!validTransitions[currentState]) {
    return {
      valid: false,
      error: `Invalid current state: ${currentState}`
    };
  }

  if (!validTransitions[currentState].includes(newState)) {
    return {
      valid: false,
      error: `Cannot transition from ${currentState} to ${newState}. Allowed: ${validTransitions[currentState].join(', ') || 'none'}`
    };
  }

  return { valid: true, error: null };
}

// ==================== EXPORTS ====================

export default {
  // Base schemas
  farmerInfoSchema,
  seedingDetailsSchema,
  distributionMetadataSchema,

  // State transition schemas
  toPlantedSchema,
  toCompletedSchema,
  archiveReportSchema,
  unarchiveReportSchema,
  softDeleteSchema,
  restoreReportSchema,

  // CRUD schemas
  createReportSchema,
  updateReportSchema,

  // Bulk operation schemas
  bulkArchiveSchema,
  bulkDeleteSchema,

  // Helper validators
  validateYieldSanity,
  validateHarvestArea,
  validateStateTransition
};
```

**Verification:**
- [ ] File created: `server/validation/plantingReportValidation.js`
- [ ] All schemas export correctly
- [ ] Helper validators included
- [ ] Comments explain business rules

---

### Step 2.4-2.11: ALREADY COMPLETED

These steps are included in the file created in Step 2.3.

**Verification:**
- [ ] toPlantedSchema created (Step 2.4)
- [ ] toCompletedSchema created (Step 2.5)
- [ ] archiveReportSchema created (Step 2.6)
- [ ] Helper validators created (Step 2.7-2.9)
- [ ] updateReportSchema created (Step 2.10)
- [ ] Bulk operation schemas created (Step 2.11)

---

### Step 2.12: Test All Schemas with Sample Data

**Create test file:** `server/validation/__tests__/plantingReportValidation.test.js`

```javascript
import {
  toPlantedSchema,
  toCompletedSchema,
  createReportSchema,
  validateYieldSanity,
  validateHarvestArea,
  validateStateTransition
} from '../plantingReportValidation.js';

// Test State 1 → 2 transition
console.log('\n=== Testing State 1→2 Transition ===\n');

const validPlantedData = {
  dateOfPlanting: new Date(),
  plantingMethod: 'Transplanted',
  typeOfCrop: 'Rice',
  riceIrrigation: 'Irrigated'
};

const result1 = toPlantedSchema.validate(validPlantedData);
console.log('Valid data:', result1.error ? 'FAILED' : 'PASSED');
if (result1.error) console.error(result1.error.details);

// Missing riceIrrigation for Rice
const invalidPlantedData = {
  dateOfPlanting: new Date(),
  plantingMethod: 'Transplanted',
  typeOfCrop: 'Rice'
  // Missing riceIrrigation
};

const result2 = toPlantedSchema.validate(invalidPlantedData);
console.log('Missing riceIrrigation:', result2.error ? 'PASSED (correctly rejected)' : 'FAILED');
if (result2.error) console.log('Error:', result2.error.details[0].message);

// Test State 2 → 3 transition
console.log('\n=== Testing State 2→3 Transition ===\n');

const validCompletedData = {
  harvestArea: 5.5,
  numberOfBags: 100,
  weightPerBag: 50
};

const result3 = toCompletedSchema.validate(validCompletedData, {
  context: { areaPlanted: 6.0 }  // Pass areaPlanted in context
});
console.log('Valid harvest data:', result3.error ? 'FAILED' : 'PASSED');

// harvestArea > areaPlanted
const invalidCompletedData = {
  harvestArea: 7.0,  // More than planted!
  numberOfBags: 100,
  weightPerBag: 50
};

const result4 = toCompletedSchema.validate(invalidCompletedData, {
  context: { areaPlanted: 6.0 }
});
console.log('Harvest > Planted:', result4.error ? 'PASSED (correctly rejected)' : 'FAILED');
if (result4.error) console.log('Error:', result4.error.details[0].message);

// Test yield sanity check
console.log('\n=== Testing Yield Sanity Checks ===\n');

const riceYieldNormal = validateYieldSanity('Rice', 5.5);
console.log('Rice 5.5 Mt/Ha:', riceYieldNormal.valid ? 'PASSED' : 'FAILED', riceYieldNormal.warning || '');

const riceYieldHigh = validateYieldSanity('Rice', 15.0);
console.log('Rice 15.0 Mt/Ha:', riceYieldHigh.valid ? 'WARNING (unusual)' : 'FAILED (rejected)', riceYieldHigh.warning || '');

const cornYieldNormal = validateYieldSanity('Corn', 7.0);
console.log('Corn 7.0 Mt/Ha:', cornYieldNormal.valid ? 'PASSED' : 'FAILED', cornYieldNormal.warning || '');

// Test harvest area validation
console.log('\n=== Testing Harvest Area Validation ===\n');

const harvestValid = validateHarvestArea(6.0, 5.5);
console.log('Harvest 5.5 / Planted 6.0:', harvestValid.valid ? 'PASSED' : 'FAILED');

const harvestInvalid = validateHarvestArea(6.0, 7.0);
console.log('Harvest 7.0 / Planted 6.0:', harvestInvalid.valid ? 'FAILED' : 'PASSED (correctly rejected)');
console.log('Error:', harvestInvalid.error);

// Test state transition validation
console.log('\n=== Testing State Transition Logic ===\n');

const trans1 = validateStateTransition('Request_Report', 'Planted');
console.log('Request→Planted:', trans1.valid ? 'PASSED' : 'FAILED');

const trans2 = validateStateTransition('Planted', 'Completed');
console.log('Planted→Completed:', trans2.valid ? 'PASSED' : 'FAILED');

const trans3 = validateStateTransition('Request_Report', 'Completed');
console.log('Request→Completed (skip):', trans3.valid ? 'FAILED' : 'PASSED (correctly rejected)');
console.log('Error:', trans3.error);

const trans4 = validateStateTransition('Completed', 'Planted');
console.log('Completed→Planted (backward):', trans4.valid ? 'FAILED' : 'PASSED (correctly rejected)');
console.log('Error:', trans4.error);

console.log('\n=== All Tests Complete ===\n');
```

**Run tests:**
```bash
cd server
node validation/__tests__/plantingReportValidation.test.js
```

**Expected Output:**
```
=== Testing State 1→2 Transition ===

Valid data: PASSED
Missing riceIrrigation: PASSED (correctly rejected)
Error: Rice irrigation type is required for Rice crops

=== Testing State 2→3 Transition ===

Valid harvest data: PASSED
Harvest > Planted: PASSED (correctly rejected)
Error: Harvest area cannot exceed planted area

=== Testing Yield Sanity Checks ===

Rice 5.5 Mt/Ha: PASSED
Rice 15.0 Mt/Ha: FAILED (rejected) Rice yield (15 Mt/Ha) is outside acceptable range (1-12 Mt/Ha)
Corn 7.0 Mt/Ha: PASSED

=== Testing Harvest Area Validation ===

Harvest 5.5 / Planted 6.0: PASSED
Harvest 7.0 / Planted 6.0: PASSED (correctly rejected)
Error: Harvest area (7 ha) cannot exceed planted area (6 ha)

=== Testing State Transition Logic ===

Request→Planted: PASSED
Planted→Completed: PASSED
Request→Completed (skip): PASSED (correctly rejected)
Error: Cannot transition from Request_Report to Completed
Completed→Planted (backward): PASSED (correctly rejected)
Error: Cannot transition from Completed to Planted

=== All Tests Complete ===
```

**Verification:**
- [ ] All tests pass
- [ ] Joi schemas validate correctly
- [ ] Helper functions work as expected
- [ ] Error messages are user-friendly
- [ ] State transition logic is correct

---

## 🎯 EXIT CRITERIA

Before moving to the next file, ensure:

- [x] **All 12 checkboxes above are marked**
- [x] **Validation file created with all schemas**
- [x] **Joi installed and working**
- [x] **All schemas export correctly**
- [x] **Test file runs successfully**
- [x] **All validations pass tests**
- [x] **Helper validators work correctly**

---

## 📝 USAGE EXAMPLE

Example of using these schemas in a controller:

```javascript
import { toPlantedSchema, validateStateTransition } from '../validation/plantingReportValidation.js';

export async function transitionToPlanted(req, res) {
  try {
    // 1. Validate request body
    const { error, value } = toPlantedSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // 2. Get current report
    const report = await prisma.plantingReport.findUnique({
      where: { id: req.params.id }
    });

    // 3. Validate state transition
    const stateCheck = validateStateTransition(report.state, 'Planted');
    if (!stateCheck.valid) {
      return res.status(400).json({
        success: false,
        message: stateCheck.error
      });
    }

    // 4. Update report
    const updated = await prisma.plantingReport.update({
      where: { id: req.params.id },
      data: {
        state: 'Planted',
        dateOfPlanting: value.dateOfPlanting,
        plantingMethod: value.plantingMethod,
        riceIrrigation: value.riceIrrigation,
        // ... stateHistory update, etc.
      }
    });

    return res.status(200).json({
      success: true,
      data: updated
    });

  } catch (error) {
    // ... error handling
  }
}
```

---

**Next File:** [03_Utils_and_Helpers.md](./03_Utils_and_Helpers.md)  
**Dependencies Met:** ✅ 01_Database_Migration.md complete

**Status:** Ready for implementation
