# Stage-Based Reporting System

## Overview
This system enforces **1 report per stage** for each registered crop, with automatic stage progression based on duration and deadline tracking for report submissions.

## Database Schema

### StageReport Model (formerly CropMonthlyReport)
```prisma
model StageReport {
  id                String       @id @default(cuid())
  cropId            String
  stageIndex        Int          // Which stage (0-based)
  stageName         String
  status            ReportStatus @default(Pending)
  reportDueDate     DateTime     // Deadline for submission
  submittedAt       DateTime?    // When submitted
  
  // Report content fields
  plantHeight, healthStatus, notes, etc.
  
  @@unique([cropId, stageIndex]) // ✅ ONE REPORT PER STAGE
}

enum ReportStatus {
  Pending    // Not yet submitted, within deadline
  Submitted  // Successfully submitted
  Late       // Not submitted and past deadline
}
```

### RegisteredCrop Model (Cleaned Up)
**Removed fields:**
- `canSubmitReport` - derived from StageReport status
- `lastReportDate` - query from StageReport
- `completedStages` - count from StageReport
- `pendingStages` - replaced by StageReport.status

**Kept fields:**
- `currentStageIndex`, `currentStageName`, `currentStageStartDate`, `currentStageEndDate` - essential for stage tracking
- `totalStages` - total from guideline
- `plantingDate` - duration tracking start point

## System Flow

### 1. Crop Registration
```
Farmer registers crop with planting date (e.g., Nov 20)
  ↓
initializeCropStages(cropId)
  ↓
- Set stage 0 (first stage) as "in progress"
- Calculate stage end date = plantingDate + duration (e.g., Nov 20 + 14 days = Dec 4)
- NO REPORT CREATED YET - stage must complete first
```

**Important:** Reports are NOT created immediately upon registration. The stage must be "in progress" and complete its duration before a report is required.

### 2. Stage Progression (Auto-Advance)
```
Stage 0 duration ends (e.g., Dec 4)
  ↓
checkAndAutoAdvanceStage(cropId) - runs automatically
  ↓
- Create Pending report for Stage 0 (reportDueDate = Dec 4 + 5 days = Dec 9)
- Advance crop to Stage 1
- Calculate Stage 1 end date
```

**Report Creation Trigger:** Reports are created when advancing to the **next** stage, which happens after the current stage duration completes.

### 3. Report Submission
```
Farmer sees "Stage 0 Pending Report" alert (after Dec 4)
  ↓
Farmer submits report for Stage 0 (before Dec 9)
  ↓
- Find StageReport where cropId + stageIndex = 0
- Update status = Submitted
- Set submittedAt = now()
  ↓
IF submitted within deadline (before Dec 9) → Status: Submitted ✅
IF submitted after deadline (after Dec 9) → Status: Late ⚠️ (but accepted)
```

### 4. Deadline Enforcement
```
Every time getCurrentStageInfo() is called:
  ↓
checkAndAutoAdvanceStage(cropId)
  ↓
- Find all Pending reports where now > reportDueDate
- Update status = Late
```

## API Changes

### Service Functions

#### `initializeCropStages(cropId)`
- Called when crop is registered
- Sets up first stage
- **Creates initial Pending report** for planting stage

#### `checkAndAutoAdvanceStage(cropId)`
- Called automatically by `getCurrentStageInfo()`
- Marks overdue reports as Late
- Advances stage if duration expired
- **Creates Pending report for completed stage**

#### `canSubmitReportForStage(cropId, targetStageIndex?)`
- Checks if report exists for stage
- Returns submission status and deadline info
- Allows late submissions (status changes to Late but accepts)

#### `getPendingReports(cropId)`
- Returns all Pending and Late reports
- Includes deadline and overdue calculations

#### `getCurrentStageInfo(cropId)`
- **Auto-advances stages** before returning info
- Returns pending reports list
- Shows all stages with report status

## Frontend Integration Guide

### 1. Display Pending Reports
```javascript
const { data: stageInfo } = useFarmerSeedTrack.getCurrentStageInfo(cropId);

// Show pending/late reports
stageInfo.pendingReports.map(report => (
  <ReportCard
    stageName={report.stageName}
    dueDate={report.reportDueDate}
    isOverdue={report.isOverdue}
    status={report.status}
    onSubmit={() => openReportModal(report.stageIndex)}
  />
))
```

### 2. Submit Report
```javascript
const submitReport = async (reportData) => {
  await createReport({
    cropId,
    stageIndex: targetStageIndex, // ✅ Specify which stage
    ...reportData
  });
};
```

### 3. Stage Timeline View
```javascript
stageInfo.allStages.map((stage, idx) => (
  <StageCard
    name={stage.name}
    hasReport={stage.hasReport}
    reportStatus={stage.reportStatus}
    reportDueDate={stage.reportDueDate}
    isCurrent={idx === stageInfo.currentStageIndex}
  />
))
```

## Key Benefits

✅ **Database Enforced**: `@@unique([cropId, stageIndex])` prevents duplicate reports  
✅ **Automatic Deadlines**: Reports auto-created with 5-day grace period  
✅ **Late Tracking**: Overdue reports marked automatically  
✅ **Stage Independence**: Stages advance by duration, not report submission  
✅ **Flexible Submission**: Can submit late reports (marked as Late)  
✅ **Clean Schema**: Removed redundant fields from RegisteredCrop  

## Migration Notes

The schema change renames `CropMonthlyReport` → `StageReport` and adds:
- `status` field (default: Pending)
- `reportDueDate` field
- `submittedAt` field (nullable)
- Unique constraint on (cropId, stageIndex)

Existing data will need:
- Status set to 'Submitted'
- `reportDueDate` calculated retroactively
- `submittedAt` = `createdAt` for existing reports

## Configuration

**Default report deadline**: 5 days after stage ends  
**Location**: Hardcoded in `advanceToNextStage()` and `initializeCropStages()`

To make configurable:
1. Add `reportDeadlineDays Int @default(5)` to RegisteredCrop or CropGuideline
2. Use this value when calculating `reportDueDate`
