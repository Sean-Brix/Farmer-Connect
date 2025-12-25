# PlantingReport Backend Implementation - MASTER GUIDE

**Version:** 1.0  
**Last Updated:** December 24, 2025  
**Status:** Ready for Implementation

---

## 🎯 PURPOSE OF THIS DOCUMENT

This is the **MASTER GUIDE** for implementing all backend changes for the PlantingReport feature. This file will be included in **EVERY PROMPT** during the implementation phase.

**AI Agent: READ THIS CAREFULLY BEFORE EVERY TASK**

---

## 📋 GROUND RULES FOR AI AGENT

### Rule #1: SEQUENTIAL EXECUTION ONLY
- **NEVER** skip ahead to future steps
- **ALWAYS** complete the current file's checklist 100% before moving to the next
- Mark each checkbox `[x]` as you complete it
- If a step fails, STOP and report the issue

### Rule #2: VERIFICATION AFTER EVERY STEP
After completing each checklist item:
1. ✅ Verify the code compiles (no syntax errors)
2. ✅ Check Prisma generates successfully (if schema changed)
3. ✅ Verify imports are correct
4. ✅ Test the specific endpoint/function if possible
5. ✅ Update the checkbox in the .md file

### Rule #3: NO ASSUMPTIONS
- If a requirement is unclear, ASK before implementing
- If you need information from another file, READ it first
- If a dependency is missing, STOP and request clarification
- Do NOT make up placeholder values

### Rule #4: PRESERVE EXISTING FUNCTIONALITY
- **DO NOT** break existing features
- **DO NOT** remove code unless explicitly instructed
- **DO NOT** change function signatures without checking all usages
- When in doubt, ADD new code alongside old code with TODO comments

### Rule #5: FOLLOW PROJECT PATTERNS
Before implementing, check existing codebase for:
- ✅ Error handling patterns (see Distribution controllers)
- ✅ Validation patterns (check other Joi schemas)
- ✅ Response format (success/error structure)
- ✅ Logging patterns
- ✅ Prisma query patterns

### Rule #6: COMPLETE DOCUMENTATION
For every change:
- Add inline comments explaining WHY (not just WHAT)
- Update JSDoc if function signatures change
- Add TODO comments for known limitations
- Document any breaking changes

### Rule #7: ATOMIC COMMITS
After completing each major section:
- Group related changes
- Write clear commit message
- Reference the implementation file (e.g., "Implement Step 1.3 from 01_Database_Migration.md")

---

## 📂 IMPLEMENTATION FILE STRUCTURE

All implementation files are in `Backend/` directory:

```
Backend/
├── overview.md                          ⬅️ YOU ARE HERE (Master Guide)
├── 01_Database_Migration.md             ⬅️ START HERE
├── 02_Validation_Schemas.md
├── 03_Utils_and_Helpers.md
├── 04_Controller_PlantingReport_Part1.md
├── 05_Controller_PlantingReport_Part2.md
├── 06_Controller_Seasons.md
├── 07_Controller_Varieties.md
├── 08_Routes_and_Endpoints.md
├── 09_Cleanup_Job.md
└── 10_Testing_and_Verification.md
```

### File Organization Logic

Files are split based on:
- **Complexity**: Large controllers split into Part1/Part2
- **Dependencies**: Earlier files must complete before later ones
- **Context Length**: Each file < 800 lines to fit in AI context window
- **Logical Grouping**: Related changes together

---

## 🔄 IMPLEMENTATION WORKFLOW

### Phase 1: Foundation (Files 01-03)
**Duration:** ~2-3 days  
**Dependency:** None (start here)

1. **01_Database_Migration.md** - Prisma schema changes
   - Add new enums (PlantingReportState)
   - Add new fields (state, isDeleted, archivedBy, etc.)
   - Remove old fields (status enum)
   - Create migration
   - Data migration script
   - Verify migration

2. **02_Validation_Schemas.md** - Joi validation rules
   - State transition schemas
   - Field-level validation
   - Cross-field validation
   - Error messages

3. **03_Utils_and_Helpers.md** - Utility functions
   - State transition validators
   - Auto-calculation functions
   - Date helpers
   - Audit trail helpers

**Exit Criteria:**
- ✅ Prisma migrate runs successfully
- ✅ Validation schemas export correctly
- ✅ All helper functions tested with sample data

---

### Phase 2: Controller Updates (Files 04-07)
**Duration:** ~3-4 days  
**Dependency:** Phase 1 complete

4. **04_Controller_PlantingReport_Part1.md**
   - Update existing CRUD functions
   - Remove status-based logic
   - Add state-based logic
   - Soft delete implementation

5. **05_Controller_PlantingReport_Part2.md**
   - New state transition endpoints
   - Bulk operations
   - Restore functionality
   - Archive/unarchive

6. **06_Controller_Seasons.md**
   - Review and update season controller
   - Ensure compatibility with new state system

7. **07_Controller_Varieties.md**
   - Review and update variety controller
   - Add "View Reports Using This" logic

**Exit Criteria:**
- ✅ All controllers export without errors
- ✅ Each function tested with Postman
- ✅ No breaking changes to existing endpoints

---

### Phase 3: Routes & Jobs (Files 08-09)
**Duration:** ~1-2 days  
**Dependency:** Phase 2 complete

8. **08_Routes_and_Endpoints.md**
   - Add new routes for state transitions
   - Add soft delete routes
   - Add bulk operation routes
   - Update route comments/docs

9. **09_Cleanup_Job.md**
   - Create 30-day cleanup job
   - Schedule with cron
   - Add to server startup
   - Test cleanup logic

**Exit Criteria:**
- ✅ All routes registered and tested
- ✅ Cleanup job runs on schedule
- ✅ Postman collection updated

---

### Phase 4: Verification (File 10)
**Duration:** ~1 day  
**Dependency:** Phase 3 complete

10. **10_Testing_and_Verification.md**
    - End-to-end workflow tests
    - State transition tests
    - Soft delete recovery tests
    - Performance tests
    - Edge case tests

**Exit Criteria:**
- ✅ All critical paths tested
- ✅ No regressions in existing features
- ✅ Performance metrics met

---

## 📊 PROGRESS TRACKING

### Current Status
```
[x] Phase 1: Foundation (Files 01-03)
  [x] 01_Database_Migration.md (15/15 steps)
  [x] 02_Validation_Schemas.md (12/12 steps)
  [x] 03_Utils_and_Helpers.md (10/10 steps)

[ ] Phase 2: Controllers (Files 04-07)
  [ ] 04_Controller_PlantingReport_Part1.md (10/18 steps)
    [ ] 05_Controller_PlantingReport_Part2.md (0/14 steps)
    [ ] 06_Controller_Seasons.md (0/6 steps)
    [ ] 07_Controller_Varieties.md (0/8 steps)

[ ] Phase 3: Routes & Jobs (Files 08-09)
    [ ] 08_Routes_and_Endpoints.md (0/10 steps)
    [ ] 09_Cleanup_Job.md (0/7 steps)

[ ] Phase 4: Verification (File 10)
    [ ] 10_Testing_and_Verification.md (0/12 steps)
```

**Total Steps:** ~112 implementation steps  
**Estimated Time:** 7-8 days (1 developer)

---

## 🔍 REFERENCE DOCUMENTS

All implementation tasks are based on these analysis documents:

- **[Analysis_Overview.md](../Analysis/Analysis_Overview.md)** - Executive summary
- **[Analysis_DatabaseChanges.md](../Analysis/Analysis_DatabaseChanges.md)** - Schema details
- **[Analysis_ValidationRules.md](../Analysis/Analysis_ValidationRules.md)** - Validation specs
- **[prompt.md](../Analysis/prompt.md)** - Requirements from user
- **[UserFeedback_Updates.md](../Analysis/UserFeedback_Updates.md)** - Key changes

**Before implementing any step, cross-reference with these documents!**

---

## ⚠️ CRITICAL REQUIREMENTS (DO NOT FORGET)

### 1. Three-State System
```javascript
// OLD (DELETE THIS)
enum PlantingReportStatus {
  Draft, Submitted, Archived
}

// NEW (USE THIS)
enum PlantingReportState {
  Request_Report,  // State 1: Not planted yet
  Planted,         // State 2: Planted, not harvested
  Completed        // State 3: Harvested
}

// Archive is now a BOOLEAN FLAG, not a state
isArchived: Boolean @default(false)
```

### 2. State Transition Rules
- **Request → Planted:** Requires dateOfPlanting, plantingMethod, riceIrrigation (if Rice)
- **Planted → Completed:** Requires harvestArea, numberOfBags, weightPerBag
- **Completed → Archived:** Requires Completed state + admin permissions
- **NO SKIPPING STATES:** Request → Completed is INVALID

### 3. Soft Delete (30-Day Recovery)
```javascript
// Soft delete fields (NEW)
isDeleted: Boolean @default(false)
deletedAt: DateTime?
deletedBy: String?

// Cleanup job runs daily at 2 AM
// Permanently deletes records where deletedAt < 30 days ago
```

### 4. Field Requirements by State

| Field | State 1 | State 2 | State 3 |
|-------|---------|---------|---------|
| farmerName | Required | Required | Required |
| areaPlanted | Required | Required | Required |
| varietyId | Required | Required | Required |
| **dateOfPlanting** | NULL | **Required** | Required |
| **plantingMethod** | NULL/Optional | **Required** | Required |
| **harvestArea** | NULL | NULL | **Required** |
| **numberOfBags** | NULL | NULL | **Required** |
| **weightPerBag** | NULL | NULL | **Required** |

### 5. Auto-Calculations
```javascript
// Yield calculation (State 3 only)
yield = (harvestArea * numberOfBags * weightPerBag) / 1000

// Expected harvest (State 2+, Rice only)
expectedHarvest = dateOfPlanting + variety.DAS

// Sanity checks
Rice yield: 1-12 Mt/Ha (warn if outside 3-8)
Corn yield: 1-15 Mt/Ha (warn if outside 4-10)
```

### 6. Distribution Integration
- When distribution approved/picked up → Auto-create report in State 1
- Store `distributionRequestId`, `distributedQuantity`
- **DO NOT** display `distributionPickupDate` in UI (store only)

### 7. Features to REMOVE
- ❌ `plantingReportDeadline` (remove from UI, keep in DB for now)
- ❌ All notification logic
- ❌ Suggest variety based on crop type
- ❌ localStorage draft persistence

---

## 🛠️ TOOLS & PATTERNS

### Database Queries
```javascript
// ALWAYS exclude soft-deleted by default
const reports = await prisma.plantingReport.findMany({
  where: {
    isDeleted: false, // CRITICAL: Add this to every query
    // ... other filters
  }
});

// Soft delete (do NOT use delete)
await prisma.plantingReport.update({
  where: { id },
  data: {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: req.user.id
  }
});

// Restore
await prisma.plantingReport.update({
  where: { id },
  data: {
    isDeleted: false,
    deletedAt: null,
    deletedBy: null
  }
});
```

### Validation Pattern
```javascript
import Joi from 'joi';

// State transition validation
const toPlantedSchema = Joi.object({
  dateOfPlanting: Joi.date().max('now').required(),
  plantingMethod: Joi.string().valid('Transplanted', 'Direct_Seeded').required(),
  riceIrrigation: Joi.when('typeOfCrop', {
    is: 'Rice',
    then: Joi.string().valid('Irrigated', 'Rainfed').required(),
    otherwise: Joi.optional()
  })
});

// Usage in controller
const { error } = toPlantedSchema.validate(req.body);
if (error) {
  return res.status(400).json({
    success: false,
    message: error.details[0].message
  });
}
```

### Response Format
```javascript
// Success
return res.status(200).json({
  success: true,
  message: 'Report updated successfully',
  data: report
});

// Error
return res.status(400).json({
  success: false,
  message: 'Validation failed',
  errors: validationErrors
});

// Pagination
return res.status(200).json({
  success: true,
  data: reports,
  pagination: {
    page: 1,
    limit: 25,
    total: 150,
    totalPages: 6,
    hasNext: true,
    hasPrev: false
  }
});
```

### Audit Trail
```javascript
// Track state transitions
const stateHistory = report.stateHistory || [];
stateHistory.push({
  from: report.state,
  to: newState,
  timestamp: new Date(),
  by: req.user.id,
  reason: req.body.transitionNote || 'Manual update'
});

await prisma.plantingReport.update({
  where: { id },
  data: {
    state: newState,
    stateHistory: stateHistory,
    lastUpdatedBy: req.user.id
  }
});
```

---

## 🚨 COMMON PITFALLS (AVOID THESE)

### ❌ Pitfall #1: Forgetting isDeleted Filter
```javascript
// WRONG - Will return deleted records
const reports = await prisma.plantingReport.findMany();

// CORRECT
const reports = await prisma.plantingReport.findMany({
  where: { isDeleted: false }
});
```

### ❌ Pitfall #2: Hard Delete Instead of Soft Delete
```javascript
// WRONG - Permanent delete, no recovery
await prisma.plantingReport.delete({ where: { id } });

// CORRECT - Soft delete
await prisma.plantingReport.update({
  where: { id },
  data: { isDeleted: true, deletedAt: new Date() }
});
```

### ❌ Pitfall #3: Skipping State Validation
```javascript
// WRONG - Allows invalid transitions
await prisma.plantingReport.update({
  where: { id },
  data: { state: 'Completed' } // Could be jumping from Request_Report
});

// CORRECT - Validate current state first
const report = await prisma.plantingReport.findUnique({ where: { id } });
if (report.state !== 'Planted') {
  return res.status(400).json({
    success: false,
    message: 'Can only complete reports in Planted state'
  });
}
```

### ❌ Pitfall #4: Not Updating stateHistory
```javascript
// WRONG - No audit trail
await prisma.plantingReport.update({
  where: { id },
  data: { state: 'Planted' }
});

// CORRECT - Track the change
const stateHistory = [...(report.stateHistory || []), {
  from: report.state,
  to: 'Planted',
  timestamp: new Date(),
  by: req.user.id
}];
```

### ❌ Pitfall #5: Making plantingMethod Required in Schema
```prisma
// WRONG - Breaks State 1 (Request_Report)
plantingMethod PlantingMethod

// CORRECT - Optional in State 1, validated in transition
plantingMethod PlantingMethod?
```

---

## 📞 WHEN TO ASK FOR HELP

STOP and ask the user if:

1. **Unclear Requirement:** "The analysis says X, but the code shows Y. Which should I follow?"
2. **Breaking Change:** "This change will break existing endpoint. Should I create a new endpoint or modify the old one?"
3. **Missing Dependency:** "Step 4.2 requires function X, but I can't find it. Should I create it?"
4. **Test Failure:** "Migration applied but tests are failing with error Z. Should I rollback?"
5. **Performance Concern:** "This query could be slow with 10k+ records. Should I add pagination?"

**DO NOT guess or make assumptions on critical decisions!**

---

## ✅ HOW TO USE THIS GUIDE

### For Each Implementation Session:

1. **READ this overview.md FIRST** (you are here)
2. **IDENTIFY the current file** (check Progress Tracking section)
3. **OPEN the implementation file** (e.g., 01_Database_Migration.md)
4. **READ the entire file** before starting
5. **EXECUTE each step sequentially**
6. **MARK checkboxes** as you complete
7. **VERIFY** after each step
8. **UPDATE** this overview.md progress section
9. **COMMIT** changes with clear message
10. **MOVE to next file** only when current is 100% complete

### For the User:

When starting a new session, send this prompt:

```
Continue implementing PlantingReport backend changes.

Reference: #file:overview.md
Current File: [filename from Progress Tracking]

Continue from the next unchecked item in the current file.
Follow all ground rules in overview.md.
```

---

## 🎓 SUCCESS CRITERIA

Implementation is complete when:

- ✅ All 10 implementation files have 100% checkboxes marked
- ✅ Prisma migrate runs without errors
- ✅ All endpoints return expected responses (tested with Postman)
- ✅ State transitions work correctly
- ✅ Soft delete and restore work
- ✅ Cleanup job runs on schedule
- ✅ No regressions in existing features
- ✅ Code follows project patterns
- ✅ All TODOs addressed or documented

---

## 📝 NOTES FOR AI AGENT

- **Be Methodical:** One step at a time, verify before moving forward
- **Be Thorough:** Read all related code before making changes
- **Be Careful:** Preserve existing functionality, add new features alongside
- **Be Clear:** Document your changes, explain your reasoning
- **Be Honest:** If stuck, ask for help. Don't guess on critical decisions.

**Remember: Slow and correct beats fast and broken.**

---

**Last Updated:** December 24, 2025  
**Next File:** [01_Database_Migration.md](./01_Database_Migration.md)  
**Status:** Ready for implementation

---

**AI Agent: Before you start, acknowledge you have read and understood these ground rules.**
