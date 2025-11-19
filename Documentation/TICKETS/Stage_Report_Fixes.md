# Stage Report System - Recent Fixes

## Date: November 20, 2024

## Issues Fixed

### 1. Admin Skip-Stage Creates Pending Reports ✅

**Problem**: When admin skipped a stage, it only updated the crop's current stage index but didn't create a pending report for the previous stage.

**Solution**: Updated the skip-stage endpoint to call `advanceToNextStage()` service function which properly:
- Creates a pending report for the current stage before advancing
- Sets the report due date (5 days after stage completes)
- Updates the crop to the next stage
- Returns complete stage information

**Files Modified**:
- `server/Router/API/SeedTrack/registeredCrops.js` (lines 302-350)

**Code Changes**:
```javascript
// OLD - Manual update (WRONG)
const updated = await prisma.registeredCrop.update({
  where: { id: req.params.id },
  data: {
    currentStageIndex: nextIndex,
    currentStageName: nextStage.stageName,
  },
});

// NEW - Use service function (CORRECT)
const { advanceToNextStage } = await import('../../../Services/stageProgressionService.js');
const result = await advanceToNextStage(req.params.id, true);
```

**Testing**:
1. Login as admin
2. Navigate to a registered crop
3. Click "Skip Stage" button
4. Verify that:
   - Crop advances to next stage
   - Pending report appears for previous stage
   - Report has correct due date (5 days from stage end)

---

### 2. Farmers Can See Previous Submitted Reports ✅

**Problem**: Farmers could only see pending reports. They couldn't view their previously submitted reports.

**Solution**: Added a "Previous Reports" section to the StageProgressionUI component that displays all submitted reports with:
- Report status badge (Submitted/Late)
- Submission date
- Due date
- Visual indicator (✅ for on-time, ⚠️ for late)

**Files Modified**:
- `client/src/Client/Components/StageProgressionUI.jsx`

**UI Features**:
- Filters `allStages` array for reports with status !== 'Pending'
- Shows submitted and late reports
- Color-coded cards:
  - Green for on-time submissions
  - Orange for late submissions
- Displays key information:
  - Stage name
  - Status badge
  - Submission date
  - Due date

**Data Source**:
The backend already provides all necessary data through `getCurrentStageInfo()`:
```javascript
allStages: [
  {
    index: 0,
    name: "Land Preparation",
    hasReport: true,
    reportStatus: "Submitted",  // or "Late" or "Pending"
    reportDueDate: "2024-12-09T00:00:00.000Z",
    reportSubmittedAt: "2024-12-08T10:30:00.000Z"
  },
  // ... more stages
]
```

**Testing**:
1. Login as farmer with submitted reports
2. Navigate to crop details with stage progression
3. Verify "Previous Reports" section appears
4. Check that all submitted reports are visible
5. Verify status badges and dates are correct

---

## System Flow After Fixes

```
1. Crop Registration
   └─> Stage 0 starts (NO report created) ✅

2. Stage 0 Duration Completes
   └─> Auto-advance OR Admin skip-stage
       └─> advanceToNextStage() called
           ├─> Creates pending report for Stage 0
           ├─> Sets due date (5 days after stage end)
           └─> Advances to Stage 1

3. Farmer Views Crop
   ├─> Sees "Pending Reports" section with Stage 0 report ✅
   └─> Sees "Current Stage" as Stage 1 ✅

4. Farmer Submits Report
   └─> Report status: Pending → Submitted ✅

5. Farmer Views Crop Again
   ├─> "Pending Reports" section is empty
   └─> "Previous Reports" section shows Stage 0 report ✅
       ├─> Status badge: "Submitted" (green)
       ├─> Submission date displayed
       └─> Visual indicator: ✅
```

---

## Technical Details

### Backend Service Function
**File**: `server/Services/stageProgressionService.js`

**Function**: `advanceToNextStage(cropId, forceAdvance = false)`

**Purpose**: Advances crop to next stage and creates pending report for current stage

**Key Logic**:
1. Validates crop exists and has guideline
2. Checks if stage duration is complete (or `forceAdvance` is true)
3. Creates pending report for **current stage** before advancing:
   ```javascript
   await prisma.stageReport.create({
     data: {
       cropId: crop.id,
       stageIndex: currentStage.sequenceOrder,
       stageName: currentStage.stageName,
       status: 'Pending',
       reportDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
     },
   });
   ```
4. Updates crop to next stage
5. Returns updated crop with stage info

### Frontend Data Structure
**File**: `client/src/Client/Components/StageProgressionUI.jsx`

**State**: `stageInfo` object from `/api/seed-track/crops/:id/stage-info`

**Key Properties**:
```javascript
{
  currentStageName: "Transplanting",
  currentStageIndex: 1,
  totalStages: 6,
  daysRemaining: 10,
  pendingReports: [
    {
      id: "report-123",
      stageName: "Land Preparation",
      stageIndex: 0,
      reportDueDate: "2024-12-09T00:00:00.000Z",
      isOverdue: false
    }
  ],
  allStages: [
    {
      index: 0,
      name: "Land Preparation",
      hasReport: true,
      reportStatus: "Submitted",
      reportDueDate: "2024-12-09T00:00:00.000Z",
      reportSubmittedAt: "2024-12-08T10:30:00.000Z"
    },
    // ... more stages
  ]
}
```

---

## Verification Checklist

### Admin Skip-Stage
- [ ] Admin can skip stage using UI button
- [ ] Skip-stage creates pending report for current stage
- [ ] Skip-stage advances crop to next stage
- [ ] Pending report has correct due date (5 days)
- [ ] Farmer sees new pending report after skip

### Previous Reports Display
- [ ] "Previous Reports" section appears when reports exist
- [ ] Submitted reports show green status badge
- [ ] Late reports show orange status badge
- [ ] Submission dates are displayed correctly
- [ ] Due dates are displayed correctly
- [ ] Visual indicators (✅/⚠️) are correct

### Report Timing
- [ ] Reports NOT created at crop registration ✅
- [ ] Reports created only after stage duration completes ✅
- [ ] Auto-advance creates pending reports ✅
- [ ] Manual skip-stage creates pending reports ✅

---

## Related Documentation
- [Inquiry System Schema](./Inquiry_System_Schema.md)
- [Stage Progression UI Guide](./Stage_Progression_UI_Guide.md)
- [Socket Integration Guide](./Socket_Integration_Guide.md)

---

## Notes
- Test user credentials: username=`user`, password=`123456`
- Server running on port 8080
- Client running on Vite dev server
- Database synced via `npx prisma db push`
