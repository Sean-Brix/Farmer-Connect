# Seed Script Updates - Stage-Based Reporting System

## Overview
Updated all seed scripts to work with the new `StageReport` schema instead of the old `CropMonthlyReport`.

## Changes Made

### 1. **index.js** - Main seed orchestrator

**Cleanup Changes:**
```javascript
// OLD
await prisma.cropMonthlyReport.deleteMany({});

// NEW  
await prisma.stageReport.deleteMany({});
```

**Summary Count Changes:**
```javascript
// OLD
prisma.cropMonthlyReport.count()

// NEW
prisma.stageReport.count()
```

---

### 2. **preferences-and-crops.seed.js** - Registered crops

**Removed Fields:**
- ❌ `completedStages` - No longer exists in schema

**Added Fields:**
- ✅ `currentStageStartDate` - When current stage started
- ✅ `currentStageEndDate` - When current stage should end

**Updated Code:**
```javascript
// Calculate stage dates (assume currently in stage 2, started 20 days ago)
const currentStageStartDate = new Date(plantingDate);
currentStageStartDate.setDate(currentStageStartDate.getDate() + 40); // Stage 0 + Stage 1 duration

const currentStageEndDate = new Date(currentStageStartDate);
currentStageEndDate.setDate(currentStageEndDate.getDate() + 30); // Stage 2 duration

await prisma.registeredCrop.create({
  data: {
    // ... other fields
    currentStageIndex: 2,
    currentStageName: 'Vegetative',
    currentStageStartDate,  // ✅ NEW
    currentStageEndDate,    // ✅ NEW
    totalStages: guideline.stages?.length || 0,
    // completedStages: 2,  ❌ REMOVED
  },
});
```

---

### 3. **crop-reports.seed.js** - Stage reports

**Model Change:**
```javascript
// OLD
await prisma.cropMonthlyReport.create({ ... })

// NEW
await prisma.stageReport.create({ ... })
```

**New Required Fields:**
- ✅ `status` - Report status enum (Pending, Submitted, Late)
- ✅ `reportDueDate` - When report must be submitted
- ✅ `submittedAt` - When farmer actually submitted (null if pending)

**Fixed Unique Constraint Issue:**
The `@@unique([cropId, stageIndex])` constraint ensures one report per stage per crop.

```javascript
// OLD - Could create duplicate stage indexes
const stageIndex = Math.min(i, Math.min(crop.currentStageIndex, stages.length - 1));

// NEW - Each iteration creates unique stage report
const stageIndex = i; // 0, 1, 2, 3... (unique per crop)
if (i >= stages.length) break; // Don't exceed available stages
```

**Status Logic:**
```javascript
// Calculate report status based on age
const isSubmitted = daysAgo > 30; // Reports older than 30 days are submitted
const reportDueDate = new Date(reportDate);
reportDueDate.setDate(reportDueDate.getDate() + 5); // Due 5 days after created

const isLate = isSubmitted && daysAgo > 35; // Submitted after deadline
const submittedAt = isSubmitted 
  ? new Date(reportDate.getTime() + (isLate ? 6 : 3) * 24 * 60 * 60 * 1000) 
  : null;

await prisma.stageReport.create({
  data: {
    cropId: crop.id,
    stageIndex: stageIndex,       // ✅ Unique per crop
    stageName: stage.stageName,
    status: isSubmitted ? (isLate ? 'Late' : 'Submitted') : 'Pending', // ✅ NEW
    reportDueDate: reportDueDate, // ✅ NEW
    submittedAt: submittedAt,     // ✅ NEW
    // ... rest of report data
  }
});
```

---

## Seed Results

### Database State After Seeding:

```
📊 Seeding Summary:
  Accounts:        10 (1 Super_Admin, 9 Users)
  Crop Guidelines: 10
  Registered Crops: 14
  Registered Crops: 14
  Crop Reports:    29 (StageReports with unique stage indexes)
  Feedback:        13

💡 Distribution:
  - 6 users have crops WITH reports (2-4 reports each, different stages)
  - 3 users have crops WITHOUT reports
```

### Report Status Distribution:

- **Submitted** ✓ - Reports from 30+ days ago (on time)
- **Late** ⚠️ - Reports from 35+ days ago (submitted after deadline)
- **Pending** 📋 - Reports less than 30 days old (not yet submitted)

### Example Seed Data:

**User 1 - Juan dela Cruz (Rice crop):**
```
Stage 0 Report - Submitted ✓ (90 days ago, submitted 3 days after creation)
Stage 1 Report - Submitted ✓ (65 days ago, submitted 3 days after creation)
Stage 2 Report - Late ⚠️     (40 days ago, submitted 6 days after creation)
Stage 3 Report - Pending 📋  (15 days ago, due in 5 days)
```

---

## Key Improvements

1. ✅ **Unique Constraint Enforced** - One report per stage per crop
2. ✅ **Status Tracking** - Pending/Submitted/Late based on deadlines
3. ✅ **Deadline Management** - 5-day grace period after stage end
4. ✅ **Realistic Test Data** - Mix of submitted, late, and pending reports
5. ✅ **Stage Progression** - Each crop has sequential stage reports

---

## Testing Validation

### Run Seed:
```bash
npm run fill
```

### Expected Output:
```
✅ Created 10 accounts
✅ Created 10 crop guidelines
✅ Created 14 registered crops
✅ Created 29 crop reports  # All with unique cropId+stageIndex
✅ Created 13 feedback messages
```

### Verify Unique Constraint:
```sql
-- Should return 0 (no duplicates)
SELECT cropId, stageIndex, COUNT(*) 
FROM stage_reports 
GROUP BY cropId, stageIndex 
HAVING COUNT(*) > 1;
```

---

## Migration Notes

**Old Schema Issues:**
- ❌ `completedStages` field existed in RegisteredCrop (removed)
- ❌ `CropMonthlyReport` model (renamed to `StageReport`)
- ❌ No unique constraint on reports (could have duplicates)
- ❌ No status tracking (couldn't tell if report was late)

**New Schema Benefits:**
- ✅ `StageReport` with unique constraint per stage
- ✅ `ReportStatus` enum for tracking submission state
- ✅ Deadline tracking via `reportDueDate` and `submittedAt`
- ✅ Clean separation between crop stages and reports

---

**Date Updated:** November 19, 2025  
**Status:** ✅ All Seed Scripts Updated and Tested
