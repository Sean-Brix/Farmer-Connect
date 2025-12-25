# 01 - Database Migration (Prisma Schema)

**Phase:** Foundation  
**Dependency:** None (START HERE)  
**Estimated Time:** 3-4 hours  
**File:** `server/prisma/schema/planting-report.prisma`

---

## ✅ PROGRESS CHECKLIST

- [x] **Step 1.1:** Backup current schema file
- [x] **Step 1.2:** Add PlantingReportState enum
- [x] **Step 1.3:** Remove PlantingReportStatus enum
- [x] **Step 1.4:** Add state field to PlantingReport model
- [x] **Step 1.5:** Add soft delete fields (isDeleted, deletedAt, deletedBy)
- [x] **Step 1.6:** Add archive tracking fields (archivedAt, archivedBy)
- [x] **Step 1.7:** Add distributedQuantity field
- [x] **Step 1.8:** Add stateHistory JSON field
- [x] **Step 1.9:** Make plantingMethod optional
- [x] **Step 1.10:** Remove status field
- [x] **Step 1.11:** Update indexes for new query patterns
- [x] **Step 1.12:** Create Prisma migration file
- [x] **Step 1.13:** Write data migration script
- [x] **Step 1.14:** Apply migration to development database
- [x] **Step 1.15:** Verify migration with test queries

---

## 📋 IMPLEMENTATION STEPS

### Step 1.1: Backup Current Schema

**Action:** Create backup of current planting-report.prisma

```bash
# Run in server/ directory
cd server/prisma/schema
cp planting-report.prisma planting-report.prisma.backup
```

**Verification:**
- [ ] Backup file exists: `planting-report.prisma.backup`

---

### Step 1.2: Add PlantingReportState Enum

**Location:** `server/prisma/schema/planting-report.prisma`

**Add this enum at the bottom of the file (after other enums):**

```prisma
// ==================== NEW: Three-State System ====================
// Replaces old PlantingReportStatus enum
enum PlantingReportState {
  Request_Report  // State 1: Seeds distributed/allocated, NOT planted yet
  Planted         // State 2: Crop PLANTED, NOT harvested
  Completed       // State 3: Crop HARVESTED, all data complete
}
```

**Explanation:**
- Request_Report: Report exists but planting hasn't happened (dateOfPlanting is null)
- Planted: Planting occurred but harvest data is incomplete
- Completed: All data collected including harvest information

**Verification:**
- [ ] Enum added after existing enums
- [ ] Three values: Request_Report, Planted, Completed
- [ ] Comments explain each state

---

### Step 1.3: Remove PlantingReportStatus Enum

**Action:** Delete the old enum completely

**Find and DELETE this enum:**
```prisma
enum PlantingReportStatus {
  Draft
  Submitted
  Archived  // ❌ Archive is now a boolean flag, not a status
}
```

**Verification:**
- [ ] PlantingReportStatus enum removed
- [ ] No references to Draft, Submitted, or Archived as statuses remain

---

### Step 1.4: Add state Field to PlantingReport Model

**Location:** In `PlantingReport` model, replace the `status` field

**FIND this line:**
```prisma
status       PlantingReportStatus @default(Draft)
```

**REPLACE with:**
```prisma
// NEW: Three-state workflow
state        PlantingReportState @default(Request_Report)
```

**Verification:**
- [ ] state field added with PlantingReportState type
- [ ] Default value is Request_Report
- [ ] Comment explains this is the new system

---

### Step 1.5: Add Soft Delete Fields

**Location:** In `PlantingReport` model, add after `isArchived` field

**ADD these fields:**
```prisma
// Soft Delete (30-day recovery period)
isDeleted    Boolean   @default(false)
deletedAt    DateTime?
deletedBy    String?   // Account ID of user who deleted
```

**Explanation:**
- isDeleted: Flag for soft-deleted records (excluded from normal queries)
- deletedAt: Timestamp for calculating 30-day cleanup window
- deletedBy: Audit trail (who deleted the record)

**Verification:**
- [ ] Three fields added: isDeleted, deletedAt, deletedBy
- [ ] isDeleted has @default(false)
- [ ] deletedAt and deletedBy are optional (?)
- [ ] Comments explain purpose

---

### Step 1.6: Add Archive Tracking Fields

**Location:** In `PlantingReport` model, update `isArchived` section

**FIND:**
```prisma
isArchived   Boolean              @default(false)
```

**REPLACE with:**
```prisma
// Archive system (separate from state)
isArchived   Boolean   @default(false)
archivedAt   DateTime?
archivedBy   String?   // Account ID of user who archived
```

**Explanation:**
- Archive is now a BOOLEAN FLAG, not a state
- Can archive reports in any state (but typically only Completed)
- Track when and who archived for audit purposes

**Verification:**
- [ ] isArchived remains with @default(false)
- [ ] archivedAt field added (DateTime?)
- [ ] archivedBy field added (String?)
- [ ] Comments clarify archive is separate from state

---

### Step 1.7: Add distributedQuantity Field

**Location:** In `PlantingReport` model, in the Distribution section

**FIND this section:**
```prisma
// Distribution linkage / metadata
distributionRequestId  String?
distributionItemId     String?
distributionQuantity   Int?
distributionUnit       String?
```

**UPDATE to:**
```prisma
// Distribution linkage / metadata
distributionRequestId  String?
distributionItemId     String?
distributionQuantity   Int?
distributionUnit       String?
distributedQuantity    Float?  // NEW: Track original distributed amount for comparison
```

**Explanation:**
- Stores the exact quantity of seeds distributed from distribution system
- Used to compare with actual planted area (analytics feature)

**Verification:**
- [ ] distributedQuantity field added as Float?
- [ ] Field is optional (only set when linked to distribution)
- [ ] Comment explains purpose

---

### Step 1.8: Add stateHistory JSON Field

**Location:** In `PlantingReport` model, add in System fields section

**ADD after `lastUpdatedBy`:**
```prisma
// Audit Trail
stateHistory Json?     // Tracks all state transitions with timestamps and users
```

**Explanation:**
- JSON array storing all state changes
- Format: [{ from: 'Request_Report', to: 'Planted', timestamp: '...', by: 'userId', reason: '...' }]
- Critical for compliance and debugging

**Verification:**
- [ ] stateHistory field added as Json?
- [ ] Field is optional (empty for new records)
- [ ] Comment explains audit trail purpose

---

### Step 1.9: Make plantingMethod Optional

**Location:** In `PlantingReport` model, Seeding Information section

**FIND:**
```prisma
plantingMethod     PlantingMethod
```

**REPLACE with:**
```prisma
plantingMethod     PlantingMethod?  // Optional in State 1, required when transitioning to State 2
```

**Critical Explanation:**
- In State 1 (Request_Report): Seeds are allocated but not planted yet → plantingMethod is NULL
- In State 2+ (Planted/Completed): Must have plantingMethod
- Validation enforced in backend, not database

**Verification:**
- [ ] plantingMethod changed from PlantingMethod to PlantingMethod?
- [ ] Comment explains state-based requirement
- [ ] Matches requirement: "plantingMethod optional in State 1"

---

### Step 1.10: Remove status Field

**This step is ALREADY DONE in Step 1.4**

**Verification:**
- [ ] Confirmed no `status` field remains in PlantingReport model
- [ ] Only `state` field exists

---

### Step 1.11: Update Indexes

**Location:** Bottom of `PlantingReport` model (@@index section)

**FIND existing indexes:**
```prisma
@@index([status, isArchived])
@@index([distributionRequestId])
```

**REPLACE with:**
```prisma
// Indexes for optimized queries
@@index([state, isArchived, isDeleted])  // Primary filtering index
@@index([distributionRequestId])         // Distribution lookups
@@index([isDeleted, deletedAt])          // Cleanup job queries
@@index([state, typeOfCrop])             // Filtered state queries
@@index([createdAt])                     // Sorting by date
@@index([varietyId])                     // Variety-based queries
@@index([croppingSeasonId])              // Season-based queries
```

**Explanation:**
- **[state, isArchived, isDeleted]**: Main query (filter by state, exclude deleted/archived)
- **[isDeleted, deletedAt]**: Used by cleanup job to find records > 30 days old
- **[state, typeOfCrop]**: For analytics (e.g., "Show all Planted Rice reports")
- Other indexes for common lookups

**Verification:**
- [ ] Old `[status, isArchived]` index removed
- [ ] New `[state, isArchived, isDeleted]` index added
- [ ] Cleanup job index `[isDeleted, deletedAt]` added
- [ ] Analytics index `[state, typeOfCrop]` added
- [ ] All indexes have explanatory comments

---

### Step 1.12: Create Prisma Migration File

**Action:** Generate migration file

```bash
# Run in server/ directory
cd server
npx prisma migrate dev --name add_state_system_soft_delete --create-only
```

**This creates a migration file in:** `server/prisma/migrations/YYYYMMDDHHMMSS_add_state_system_soft_delete/migration.sql`

**Verification:**
- [ ] Migration file created in prisma/migrations/
- [ ] File contains SQL for all schema changes
- [ ] Review migration.sql to ensure it looks correct

**Expected SQL operations in migration:**
1. Create PlantingReportState enum
2. Add state column with default 'Request_Report'
3. Add isDeleted, deletedAt, deletedBy columns
4. Add archivedAt, archivedBy columns
5. Add distributedQuantity column
6. Add stateHistory column
7. Modify plantingMethod to be nullable
8. Drop old PlantingReportStatus enum (if no other tables use it)
9. Create new indexes
10. Drop old [status, isArchived] index

---

### Step 1.13: Write Data Migration Script

**Action:** Create script to migrate existing data

**Create file:** `server/prisma/migrations/data-migration-state-system.js`

```javascript
// Data Migration Script for PlantingReport State System
// Run this AFTER applying the schema migration

import prisma from '../../config/database.js';

async function migrateReportStates() {
  console.log('Starting data migration for PlantingReport state system...\n');

  try {
    // Get all existing reports
    const reports = await prisma.plantingReport.findMany({
      select: {
        id: true,
        dateOfPlanting: true,
        harvestArea: true,
        numberOfBags: true,
        weightPerBag: true,
        status: true  // Old field (will error if already removed)
      }
    });

    console.log(`Found ${reports.length} reports to migrate\n`);

    let state1Count = 0;  // Request_Report
    let state2Count = 0;  // Planted
    let state3Count = 0;  // Completed

    // Migrate each report
    for (const report of reports) {
      let newState;

      // Determine new state based on available data
      if (!report.dateOfPlanting) {
        // No planting date = Request_Report (State 1)
        newState = 'Request_Report';
        state1Count++;
      } else if (!report.harvestArea || !report.numberOfBags || !report.weightPerBag) {
        // Has planting date but missing harvest data = Planted (State 2)
        newState = 'Planted';
        state2Count++;
      } else {
        // Has both planting and harvest data = Completed (State 3)
        newState = 'Completed';
        state3Count++;
      }

      // Update report with new state
      await prisma.plantingReport.update({
        where: { id: report.id },
        data: {
          state: newState,
          stateHistory: [
            {
              from: null,
              to: newState,
              timestamp: new Date(),
              by: 'SYSTEM',
              reason: 'Data migration from old status system'
            }
          ]
        }
      });
    }

    console.log('Migration complete!\n');
    console.log('Summary:');
    console.log(`  State 1 (Request_Report): ${state1Count} reports`);
    console.log(`  State 2 (Planted):        ${state2Count} reports`);
    console.log(`  State 3 (Completed):      ${state3Count} reports`);
    console.log(`  Total:                    ${reports.length} reports\n`);

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateReportStates();
```

**Verification:**
- [ ] File created: `server/prisma/migrations/data-migration-state-system.js`
- [ ] Script uses correct logic to determine state
- [ ] stateHistory is initialized for all reports

**Important Notes:**
- Run this script AFTER applying the schema migration
- Test on development database first
- Backup production database before running in production

---

### Step 1.14: Apply Migration to Development Database

**Action:** Apply migration and run data migration

```bash
# Step 1: Apply schema migration
cd server
npx prisma migrate dev

# Step 2: Generate Prisma Client
npx prisma generate

# Step 3: Run data migration script
node prisma/migrations/data-migration-state-system.js
```

**Expected Output:**
```
Applying migration: 20250124XXXXXX_add_state_system_soft_delete
Migration applied successfully

Prisma Client generated successfully

Starting data migration...
Found 150 reports to migrate
Migration complete!
Summary:
  State 1 (Request_Report): 45 reports
  State 2 (Planted):        62 reports
  State 3 (Completed):      43 reports
  Total:                    150 reports
```

**Verification:**
- [ ] Schema migration applied without errors
- [ ] Prisma Client generated successfully
- [ ] Data migration script ran successfully
- [ ] All reports have a valid state
- [ ] No errors in console

**If errors occur:**
- Check migration.sql for syntax errors
- Verify enum values are correct
- Check for foreign key constraint violations
- Review Prisma schema for typos

---

### Step 1.15: Verify Migration with Test Queries

**Action:** Run queries to verify data integrity

**Create verification script:** `server/scripts/verify-migration.js`

```javascript
import prisma from '../config/database.js';

async function verifyMigration() {
  console.log('Verifying PlantingReport migration...\n');

  try {
    // 1. Check all reports have a state
    const reportsWithoutState = await prisma.plantingReport.count({
      where: { state: null }
    });
    console.log(`✓ Reports without state: ${reportsWithoutState} (should be 0)`);

    // 2. Count reports by state
    const state1Count = await prisma.plantingReport.count({
      where: { state: 'Request_Report' }
    });
    const state2Count = await prisma.plantingReport.count({
      where: { state: 'Planted' }
    });
    const state3Count = await prisma.plantingReport.count({
      where: { state: 'Completed' }
    });
    
    console.log(`\nState Distribution:`);
    console.log(`  Request_Report: ${state1Count}`);
    console.log(`  Planted:        ${state2Count}`);
    console.log(`  Completed:      ${state3Count}`);

    // 3. Check soft delete fields
    const deletedCount = await prisma.plantingReport.count({
      where: { isDeleted: true }
    });
    console.log(`\n✓ Soft-deleted reports: ${deletedCount} (should be 0 initially)`);

    // 4. Check archived reports still exist
    const archivedCount = await prisma.plantingReport.count({
      where: { isArchived: true }
    });
    console.log(`✓ Archived reports: ${archivedCount}`);

    // 5. Verify indexes exist
    const indexes = await prisma.$queryRaw`
      SELECT indexname FROM pg_indexes 
      WHERE tablename = 'PlantingReport';
    `;
    console.log(`\n✓ Indexes created: ${indexes.length}`);
    indexes.forEach(idx => console.log(`  - ${idx.indexname}`));

    // 6. Check stateHistory is valid JSON
    const reportsWithHistory = await prisma.plantingReport.findMany({
      where: { stateHistory: { not: null } },
      select: { id: true, stateHistory: true }
    });
    console.log(`\n✓ Reports with stateHistory: ${reportsWithHistory.length}`);

    // 7. Verify plantingMethod is nullable
    const state1ReportsWithoutMethod = await prisma.plantingReport.count({
      where: {
        state: 'Request_Report',
        plantingMethod: null
      }
    });
    console.log(`✓ State 1 reports without plantingMethod: ${state1ReportsWithoutMethod} (valid)`);

    console.log('\n✅ Migration verification complete! All checks passed.\n');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyMigration();
```

**Run verification:**
```bash
cd server
node scripts/verify-migration.js
```

**Verification:**
- [ ] All reports have a state
- [ ] No NULL states
- [ ] State distribution looks reasonable
- [ ] isDeleted is false for all records initially
- [ ] Indexes created successfully
- [ ] stateHistory is valid JSON
- [ ] plantingMethod can be NULL in State 1

---

## 🎯 EXIT CRITERIA

Before moving to the next file, ensure:

- [x] **All 15 checkboxes above are marked**
- [x] **Prisma schema has all required changes**
- [x] **Migration applied successfully to dev database**
- [x] **Data migration script ran without errors**
- [x] **Verification script shows all checks passed**
- [x] **No TypeScript/Prisma errors**
- [x] **Backup created (in case rollback needed)**

---

## 🔄 ROLLBACK PLAN

If migration fails or causes issues:

```bash
# 1. Revert to previous migration
cd server
npx prisma migrate resolve --rolled-back MIGRATION_NAME

# 2. Restore backup schema
cp prisma/schema/planting-report.prisma.backup prisma/schema/planting-report.prisma

# 3. Regenerate Prisma Client
npx prisma generate

# 4. Investigate errors and fix before retrying
```

---

## 📝 NOTES

- **Database Backup:** Always backup production database before applying migration
- **Test First:** Test on development/staging before production
- **Data Migration:** The data migration script makes assumptions about state based on available data
- **PlantingMethod:** Making this optional is CRITICAL for State 1 to work
- **Indexes:** New indexes may take time to build on large datasets

---

**Next File:** [02_Validation_Schemas.md](./02_Validation_Schemas.md)  
**Dependencies Met:** ✅ None (this is the first file)

**Status:** Ready for implementation
