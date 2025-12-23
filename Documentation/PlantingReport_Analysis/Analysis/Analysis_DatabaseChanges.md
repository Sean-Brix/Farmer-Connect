# PlantingReport Feature - Database Schema Changes

**Part of:** [Analysis_Overview.md](./Analysis_Overview.md)  
**Last Updated:** December 24, 2025

---

## Current Schema (TO BE MODIFIED)

```prisma
model PlantingReport {
  id                      String              @id @default(uuid())
  
  // Farmer Information
  farmerName              String
  location                String
  rsbsa                   String?
  
  // Seed Details
  typeOfCrop              CropType
  varietyId               String
  variety                 SeedVariety         @relation(fields: [varietyId], references: [id])
  seasonId                String
  season                  PlantingSeason      @relation(fields: [seasonId], references: [id])
  areaPlanted             Float
  
  // Planting Details
  dateOfPlanting          DateTime?
  plantingMethod          PlantingMethod      // ❌ Currently required
  riceIrrigation          RiceIrrigation?
  dateOfExpectedHarvest   DateTime?
  
  // Harvest Details
  harvestArea             Float?
  numberOfBags            Int?
  weightPerBag            Float?
  yieldMtPerHa            Float?
  
  // Status (WRONG SYSTEM)
  status                  PlantingReportStatus @default(Draft)  // ❌ DELETE
  isArchived              Boolean             @default(false)
  
  // Distribution Integration
  distributionRequestId   String?
  
  // Metadata
  createdAt               DateTime            @default(now())
  updatedAt               DateTime            @updatedAt
  createdBy               String
  lastUpdatedBy           String
  
  // Unused
  plantingReportDeadline  DateTime?  // ❌ Remove from UI
  
  @@index([status, isArchived])  // ❌ Update to use state
  @@index([distributionRequestId])
}

enum PlantingReportStatus {  // ❌ DELETE ENTIRE ENUM
  Draft
  Submitted
  Archived
}
```

---

## New Schema (REQUIRED)

```prisma
model PlantingReport {
  id                      String              @id @default(uuid())
  
  // Farmer Information
  farmerName              String
  location                String
  rsbsa                   String?
  
  // Seed Details
  typeOfCrop              CropType
  varietyId               String
  variety                 SeedVariety         @relation(fields: [varietyId], references: [id])
  seasonId                String
  season                  PlantingSeason      @relation(fields: [seasonId], references: [id])
  areaPlanted             Float
  
  // Planting Details (State 2+)
  dateOfPlanting          DateTime?
  plantingMethod          PlantingMethod?     // ✅ NOW OPTIONAL (null in State 1)
  riceIrrigation          RiceIrrigation?
  dateOfExpectedHarvest   DateTime?
  
  // Harvest Details (State 3+)
  harvestArea             Float?
  numberOfBags            Int?
  weightPerBag            Float?
  yieldMtPerHa            Float?
  
  // ✅ NEW: Three-State System
  state                   PlantingReportState @default(Request_Report)
  
  // Archive (separate from state)
  isArchived              Boolean             @default(false)
  archivedAt              DateTime?           // ✅ NEW
  archivedBy              String?             // ✅ NEW
  
  // ✅ NEW: Soft Delete
  isDeleted               Boolean             @default(false)
  deletedAt               DateTime?
  deletedBy               String?
  
  // Distribution Integration
  distributionRequestId   String?
  distributedQuantity     Float?              // ✅ NEW: Track original distributed amount
  
  // Metadata
  createdAt               DateTime            @default(now())
  updatedAt               DateTime            @updatedAt
  createdBy               String
  lastUpdatedBy           String
  
  // Audit Trail
  stateHistory            Json?               // ✅ NEW: Track state transitions
  
  // ✅ UPDATED INDEXES
  @@index([state, isArchived, isDeleted])
  @@index([distributionRequestId])
  @@index([isDeleted, deletedAt])     // For cleanup job
  @@index([state, typeOfCrop])        // For filtered queries
  @@index([createdAt])                // For sorting
}

// ✅ NEW: Three-State Enum
enum PlantingReportState {
  Request_Report    // Seeds distributed/allocated, NOT planted yet
  Planted          // Crop PLANTED, NOT harvested
  Completed        // Crop HARVESTED, all data complete
}

// Existing enums (KEEP)
enum CropType {
  Rice
  Corn
  HighValue
}

enum PlantingMethod {
  Transplanted
  Direct_Seeded
}

enum RiceIrrigation {
  Irrigated
  Rainfed
}
```

---

## Migration Plan

### Step 1: Create Migration File

```bash
cd server
npx prisma migrate dev --name add_state_and_soft_delete --create-only
```

### Step 2: Write Migration SQL

```sql
-- migration.sql

-- 1. Add new fields (nullable first)
ALTER TABLE "PlantingReport" 
  ADD COLUMN "state" TEXT,
  ADD COLUMN "isDeleted" BOOLEAN DEFAULT false,
  ADD COLUMN "deletedAt" TIMESTAMP,
  ADD COLUMN "deletedBy" TEXT,
  ADD COLUMN "archivedAt" TIMESTAMP,
  ADD COLUMN "archivedBy" TEXT,
  ADD COLUMN "distributedQuantity" DOUBLE PRECISION,
  ADD COLUMN "stateHistory" JSONB;

-- 2. Create new enum
CREATE TYPE "PlantingReportState" AS ENUM ('Request_Report', 'Planted', 'Completed');

-- 3. Migrate existing data to new state system
-- Logic: 
--   - No dateOfPlanting → Request_Report
--   - Has dateOfPlanting, no harvestArea → Planted
--   - Has harvestArea → Completed

UPDATE "PlantingReport"
SET "state" = CASE
  WHEN "dateOfPlanting" IS NULL THEN 'Request_Report'
  WHEN "harvestArea" IS NULL THEN 'Planted'
  ELSE 'Completed'
END;

-- 4. Set archivedAt for already archived reports
UPDATE "PlantingReport"
SET "archivedAt" = "updatedAt"
WHERE "isArchived" = true;

-- 5. Make plantingMethod optional
ALTER TABLE "PlantingReport" 
  ALTER COLUMN "plantingMethod" DROP NOT NULL;

-- 6. Drop old status enum and column
ALTER TABLE "PlantingReport" DROP COLUMN "status";
DROP TYPE "PlantingReportStatus";

-- 7. Drop old index, create new indexes
DROP INDEX IF EXISTS "PlantingReport_status_isArchived_idx";

CREATE INDEX "PlantingReport_state_isArchived_isDeleted_idx" 
  ON "PlantingReport"("state", "isArchived", "isDeleted");

CREATE INDEX "PlantingReport_isDeleted_deletedAt_idx" 
  ON "PlantingReport"("isDeleted", "deletedAt");

CREATE INDEX "PlantingReport_state_typeOfCrop_idx" 
  ON "PlantingReport"("state", "typeOfCrop");

CREATE INDEX "PlantingReport_createdAt_idx" 
  ON "PlantingReport"("createdAt");

-- 8. Make state NOT NULL (after data migration)
ALTER TABLE "PlantingReport" 
  ALTER COLUMN "state" SET NOT NULL,
  ALTER COLUMN "state" SET DEFAULT 'Request_Report';
```

### Step 3: Apply Migration

```bash
npx prisma migrate dev
npx prisma generate
```

### Step 4: Verify Migration

```javascript
// server/scripts/verify-migration.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  // Check state distribution
  const stateCounts = await prisma.plantingReport.groupBy({
    by: ['state'],
    _count: true
  });
  
  console.log('State Distribution:', stateCounts);
  
  // Check for null plantingMethod in State 1
  const requestReports = await prisma.plantingReport.findMany({
    where: { state: 'Request_Report' },
    select: { id: true, plantingMethod: true, dateOfPlanting: true }
  });
  
  console.log('Request Reports:', requestReports.length);
  console.log('With null plantingMethod:', requestReports.filter(r => !r.plantingMethod).length);
  
  // Check archived reports have archivedAt
  const archivedWithoutDate = await prisma.plantingReport.count({
    where: {
      isArchived: true,
      archivedAt: null
    }
  });
  
  console.log('Archived without archivedAt:', archivedWithoutDate);
  
  await prisma.$disconnect();
}

verify();
```

---

## State Transition Rules

### State 1: Request_Report → State 2: Planted

**Required Fields:**
- `dateOfPlanting` (Date, ≤ today)
- `plantingMethod` (enum: Transplanted | Direct_Seeded)
- `areaPlanted` (Float, > 0)
- `riceIrrigation` (if typeOfCrop === 'Rice')

**Validation:**
```javascript
const canTransitionToPlanted = (report) => {
  if (report.state !== 'Request_Report') return false;
  if (!report.dateOfPlanting) return false;
  if (new Date(report.dateOfPlanting) > new Date()) return false;
  if (!report.plantingMethod) return false;
  if (!report.areaPlanted || report.areaPlanted <= 0) return false;
  if (report.typeOfCrop === 'Rice' && !report.riceIrrigation) return false;
  
  return true;
};
```

**Backend Update:**
```javascript
if (updateData.dateOfPlanting && updateData.plantingMethod) {
  // Auto-transition to Planted
  updateData.state = 'Planted';
  
  // Calculate expected harvest if Rice
  if (report.typeOfCrop === 'Rice' && report.variety) {
    const plantDate = new Date(updateData.dateOfPlanting);
    updateData.dateOfExpectedHarvest = new Date(
      plantDate.setDate(plantDate.getDate() + report.variety.daysToMaturityDry)
    );
  }
  
  // Track state change
  updateData.stateHistory = [
    ...(report.stateHistory || []),
    {
      from: 'Request_Report',
      to: 'Planted',
      timestamp: new Date(),
      userId: req.user.userId
    }
  ];
}
```

### State 2: Planted → State 3: Completed

**Required Fields:**
- `harvestArea` (Float, > 0, ≤ areaPlanted)
- `numberOfBags` (Int, > 0)
- `weightPerBag` (Float, > 0)

**Auto-Calculated:**
- `yieldMtPerHa` = (harvestArea × numberOfBags × weightPerBag) / 1000

**Validation:**
```javascript
const canTransitionToCompleted = (report) => {
  if (report.state !== 'Planted') return false;
  if (!report.harvestArea || report.harvestArea <= 0) return false;
  if (report.harvestArea > report.areaPlanted) return false;
  if (!report.numberOfBags || report.numberOfBags <= 0) return false;
  if (!report.weightPerBag || report.weightPerBag <= 0) return false;
  
  return true;
};
```

**Backend Update:**
```javascript
if (updateData.harvestArea && updateData.numberOfBags && updateData.weightPerBag) {
  // Validate harvest area
  if (updateData.harvestArea > report.areaPlanted) {
    throw new Error('Harvest area cannot exceed planted area');
  }
  
  // Auto-calculate yield
  updateData.yieldMtPerHa = 
    (updateData.harvestArea * updateData.numberOfBags * updateData.weightPerBag) / 1000;
  
  // Auto-transition to Completed
  updateData.state = 'Completed';
  
  // Track state change
  updateData.stateHistory = [
    ...(report.stateHistory || []),
    {
      from: 'Planted',
      to: 'Completed',
      timestamp: new Date(),
      userId: req.user.userId
    }
  ];
}
```

### State 3: Completed → Archive

**Requirements:**
- Admin permission only
- Confirmation required
- If linked to distribution: Update distribution to "Archived"

**Backend Update:**
```javascript
export async function archiveReport(req, res) {
  const { id } = req.params;
  
  const report = await prisma.plantingReport.findUnique({
    where: { id },
    include: { variety: true, season: true }
  });
  
  if (report.state !== 'Completed') {
    return res.status(400).json({ 
      error: 'Can only archive Completed reports' 
    });
  }
  
  // Update report
  const updated = await prisma.plantingReport.update({
    where: { id },
    data: {
      isArchived: true,
      archivedAt: new Date(),
      archivedBy: req.user.userId
    }
  });
  
  // Update linked distribution if exists
  if (report.distributionRequestId) {
    await prisma.distributionRequest.update({
      where: { id: report.distributionRequestId },
      data: {
        plantingReportStatus: 'Archived'
      }
    });
  }
  
  return res.json(updated);
}
```

---

## Query Optimization

### Index Strategy

**Primary Indexes:**
```prisma
@@index([state, isArchived, isDeleted])  // Main filtering
@@index([distributionRequestId])         // Distribution lookup
@@index([isDeleted, deletedAt])         // Cleanup job
@@index([state, typeOfCrop])            // Crop-specific queries
@@index([createdAt])                    // Date sorting
```

**Query Patterns:**

```javascript
// 1. Active reports (default view)
const activeReports = await prisma.plantingReport.findMany({
  where: {
    isArchived: false,
    isDeleted: false
  },
  orderBy: { createdAt: 'desc' }
});
// ✅ Uses: [state, isArchived, isDeleted] index

// 2. State-specific filter
const plantedReports = await prisma.plantingReport.findMany({
  where: {
    state: 'Planted',
    isArchived: false,
    isDeleted: false
  }
});
// ✅ Uses: [state, isArchived, isDeleted] index

// 3. Distribution reports
const distributionReports = await prisma.plantingReport.findMany({
  where: {
    distributionRequestId: { not: null },
    isDeleted: false
  }
});
// ✅ Uses: [distributionRequestId] index

// 4. Cleanup job
const expiredReports = await prisma.plantingReport.findMany({
  where: {
    isDeleted: true,
    deletedAt: {
      lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  }
});
// ✅ Uses: [isDeleted, deletedAt] index
```

---

## Data Integrity Constraints

### Database-Level Constraints

```sql
-- 1. Harvest area cannot exceed planted area (check constraint)
ALTER TABLE "PlantingReport"
  ADD CONSTRAINT "check_harvest_area"
  CHECK ("harvestArea" IS NULL OR "harvestArea" <= "areaPlanted");

-- 2. Yield must be positive
ALTER TABLE "PlantingReport"
  ADD CONSTRAINT "check_yield_positive"
  CHECK ("yieldMtPerHa" IS NULL OR "yieldMtPerHa" > 0);

-- 3. Deleted reports must have deletedAt
ALTER TABLE "PlantingReport"
  ADD CONSTRAINT "check_deleted_has_timestamp"
  CHECK (
    ("isDeleted" = false AND "deletedAt" IS NULL) OR
    ("isDeleted" = true AND "deletedAt" IS NOT NULL)
  );

-- 4. Archived reports must have archivedAt
ALTER TABLE "PlantingReport"
  ADD CONSTRAINT "check_archived_has_timestamp"
  CHECK (
    ("isArchived" = false AND "archivedAt" IS NULL) OR
    ("isArchived" = true AND "archivedAt" IS NOT NULL)
  );
```

### Application-Level Validation

```javascript
// Joi schema for state transitions
import Joi from 'joi';

const stateTransitionSchema = Joi.object({
  // State 1 → State 2
  dateOfPlanting: Joi.when('state', {
    is: 'Planted',
    then: Joi.date().max('now').required(),
    otherwise: Joi.date().optional()
  }),
  
  plantingMethod: Joi.when('state', {
    is: Joi.valid('Planted', 'Completed'),
    then: Joi.string().valid('Transplanted', 'Direct_Seeded').required(),
    otherwise: Joi.optional()
  }),
  
  riceIrrigation: Joi.when('typeOfCrop', {
    is: 'Rice',
    then: Joi.when('state', {
      is: Joi.valid('Planted', 'Completed'),
      then: Joi.string().valid('Irrigated', 'Rainfed').required()
    })
  }),
  
  // State 2 → State 3
  harvestArea: Joi.when('state', {
    is: 'Completed',
    then: Joi.number().positive().max(Joi.ref('areaPlanted')).required(),
    otherwise: Joi.number().optional()
  }),
  
  numberOfBags: Joi.when('state', {
    is: 'Completed',
    then: Joi.number().integer().positive().required(),
    otherwise: Joi.number().optional()
  }),
  
  weightPerBag: Joi.when('state', {
    is: 'Completed',
    then: Joi.number().positive().required(),
    otherwise: Joi.number().optional()
  })
});
```

---

## Rollback Plan

If migration fails:

```sql
-- Rollback migration
-- 1. Restore status column
ALTER TABLE "PlantingReport" ADD COLUMN "status" TEXT DEFAULT 'Draft';

-- 2. Recreate old enum
CREATE TYPE "PlantingReportStatus" AS ENUM ('Draft', 'Submitted', 'Archived');

-- 3. Migrate state back to status
UPDATE "PlantingReport"
SET "status" = CASE
  WHEN "isArchived" = true THEN 'Archived'
  WHEN "state" = 'Completed' THEN 'Submitted'
  ELSE 'Draft'
END;

-- 4. Drop new columns
ALTER TABLE "PlantingReport"
  DROP COLUMN "state",
  DROP COLUMN "isDeleted",
  DROP COLUMN "deletedAt",
  DROP COLUMN "deletedBy",
  DROP COLUMN "archivedAt",
  DROP COLUMN "archivedBy",
  DROP COLUMN "stateHistory";

-- 5. Drop new enum
DROP TYPE "PlantingReportState";

-- 6. Restore old indexes
CREATE INDEX "PlantingReport_status_isArchived_idx" 
  ON "PlantingReport"("status", "isArchived");
```

---

**Next:** [Analysis_UIUXChanges.md](./Analysis_UIUXChanges.md) - Frontend redesign specification
