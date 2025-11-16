# Seed Tracking & Farmer Report System Guide

## Overview

The Seed Tracking system allows the admin to create comprehensive crop growing guidelines with multiple stages, and farmers to register their crops and report progress through each stage. This creates a structured way to track farming activities from planting to harvest.

---

## System Flow

### 1. **Admin Creates Crop Guidelines** 

**Location:** Admin Dashboard → Seed Track → Guidelines Tab

**Process:**
1. Admin clicks "Create New Guideline"
2. Fills in comprehensive crop information:
   - **Basic Info:** Name, Category, Growing Period, Difficulty, Profitability
   - **Varieties:** Multiple variety names for the crop
   - **Planting Seasons:** When to plant (Wet/Dry season)
   - **Growing Conditions:** Water, Soil Type, Climate, Spacing, Fertilizer
   - **Market Info:** Expected Yield, Market Price
   - **Farming Tips:** Key tips, Common Pests & Control, Diseases & Symptoms
   - **Growth Stages:** (CRITICAL) Multiple stages with:
     - Stage Name (e.g., "Land Preparation", "Seedling", "Vegetative")
     - Duration (e.g., "21 days", "2-3 weeks")
     - Description
     - Activities (array of tasks to do in this stage)
     - Sequence Order (0-based index)

3. System validates that total stage durations match the growing period
4. Guideline is saved to database with all stages

**Example:** Rice guideline with 6 stages:
- Land Preparation (14-21 days)
- Seedling/Establishment (21 days)
- Vegetative (35-40 days)
- Reproductive (35 days)
- Maturity (15-20 days)
- Harvest (5-7 days)

**Total: 124-148 days** (matches growing period: 110-120 days with flexibility)

---

### 2. **Farmer Registers a Crop**

**Location:** Farmer Dashboard → Report → My Crops Tab

**Process:**
1. Farmer clicks "Register New Crop"
2. Selects a guideline from dropdown (shows all available guidelines)
3. Fills in specific crop details:
   - Crop Type (auto-filled from guideline)
   - Variety (selected from guideline's varieties)
   - Planting Date (date picker)
   - Area in hectares
   - Expected Harvest Date (calculated from planting date + growing period)
   - Current Stage (default: "Seedling")
   - Notes (optional)

4. System creates RegisteredCrop record with:
   - Link to selected guideline (`guidelineId`)
   - Current stage index starts at 0
   - Status: "Active"
   - All farmer-provided details

**Database Schema:**
```prisma
model RegisteredCrop {
  id                 String
  userId             String
  guidelineId        String          // Links to CropGuideline
  cropType           String
  variety            String
  plantingDate       DateTime
  expectedHarvest    DateTime?
  area               Float?
  status             CropStatus      // Active, Completed, Archived
  currentStage       GrowthStage    
  currentStageIndex  Int?            // Tracks which guideline stage (0-based)
  notes              String?
  reports            CropMonthlyReport[]
  guideline          CropGuideline   // Relation
}
```

---

### 3. **Farmer Submits Reports Per Stage**

**Location:** Farmer Dashboard → Report → My Crops Tab → View Crop → Add Report

**Why Stage-Based Reporting Matters:**
- Each crop guideline has multiple stages with specific durations
- Farmers must report progress for EACH stage
- The `currentStageIndex` tracks which guideline stage the crop is in
- Reports help admins monitor if farmers are following best practices

**Report Fields (Simplified):**
- **Plant Height (cm)** - Required
- **Health Status** - Dropdown: Healthy, Warning, Critical
- **Weather Impact** - Text field
- **Notes** - Observations, problems, treatments
- **Pests Observed** - Text field
- **Diseases Observed** - Text field
- **Fertilizers Applied** - Text field
- **Pesticide Applications** - Text field
- **Irrigation Frequency** - Dropdown
- **Soil Condition** - Dropdown
- **Planned Actions** - What they'll do next
- **Actual Yield** - For final harvest report
- **Costs** - Object with seeds, fertilizer, pesticides, labor, irrigation, equipment, others

**Fields REMOVED (as requested):**
- ~~Major Activities This Month~~ - Too complex
- ~~Challenges Faced~~ - Covered by notes
- ~~Report Date~~ - Automatic (uses createdAt)
- ~~Estimated Yield~~ - Confusing, only actualYield at harvest
- ~~Growth Stage~~ - Tracked automatically via currentStageIndex

**Process:**
1. Farmer opens a registered crop
2. Clicks "Add Report"
3. Fills in simplified form
4. Submits report
5. System creates CropMonthlyReport with:
   - Link to crop (`cropId`)
   - All filled fields
   - `createdAt` timestamp (automatic)
   - Option for admin to add feedback

**Database Schema:**
```prisma
model CropMonthlyReport {
  id                    String
  cropId                String
  plantHeight           Float?
  healthStatus          String?         // Healthy, Warning, Critical
  weatherImpact         String?
  notes                 String?
  pestsObserved         String?
  diseasesObserved      String?
  fertilizersApplied    String?
  pesticideApplications String?
  irrigationFrequency   String?
  soilCondition         String?
  plannedActions        String?
  actualYield           Float?          // Only for final harvest report
  costs                 String?         // JSON object
  weatherSnapshot       String?         // Auto-captured weather data
  createdAt             DateTime        // Automatic timestamp
  crop                  RegisteredCrop
  feedback              ReportFeedback[]
}
```

---

### 4. **Stage Progression**

**How Stages Work:**

1. When farmer registers crop, `currentStageIndex = 0` (first stage)
2. Guideline stages are ordered by `sequenceOrder` (0, 1, 2, 3...)
3. As farmer submits reports and time passes, they move through stages
4. Each stage has a specific duration from the guideline
5. System can show:
   - Current stage name and duration
   - Expected end date for current stage
   - Activities to do in this stage (from guideline)
   - Progress through all stages

**Example Timeline:**
```
Rice Crop - Planted June 1, 2024

Stage 0: Land Preparation (14-21 days)
├─ Expected: June 1 - June 21
├─ Activities: Clear field, plow 2-3 times, harrow, level
└─ Report needed by: June 21

Stage 1: Seedling/Establishment (21 days)
├─ Expected: June 22 - July 12
├─ Activities: Transplant seedlings, maintain water depth, replace missing hills
└─ Report needed by: July 12

Stage 2: Vegetative (35-40 days)
├─ Expected: July 13 - August 22
├─ Activities: Apply fertilizer (21 DAT, 42 DAT), weed control, pest monitoring
└─ Report needed by: August 22

... and so on
```

---

### 5. **Admin Monitors Progress**

**Location:** Admin Dashboard → Seed Track → Overview & Farmer Details

**Admin Can See:**
- All registered crops by all farmers
- Current stage each crop is in
- Reports submitted per crop
- Timeline showing expected vs actual reporting
- Missing reports (red flags)
- Health status trends
- Feedback threads on reports

**Admin Actions:**
- View all reports for a crop
- Add feedback/comments to reports
- Mark crops as completed/harvested
- Archive crops (with reason)
- View analytics on farming success rates
- Identify which guidelines are most popular
- See which farmers need support

---

### 6. **Guideline Protection System**

**IMPORTANT:** Admins cannot delete or update guidelines that are actively being used by farmers!

**Backend Protection:**

```javascript
// In updateGuideline function
const existingGuideline = await prisma.cropGuideline.findUnique({
  where: { id },
  include: {
    _count: {
      select: { registeredCrops: true }
    }
  }
});

if (existingGuideline._count.registeredCrops > 0) {
  return res.status(400).json({
    success: false,
    message: `Cannot update guideline: ${existingGuideline._count.registeredCrops} farmers are currently using this guideline`,
    inUseCount: existingGuideline._count.registeredCrops
  });
}
```

**Why This Matters:**
- Farmers' crops are linked to specific guideline stages
- Changing stage durations or activities mid-season would break farmer progress tracking
- Deleting would orphan registered crops
- Ensures data integrity and farmer experience

**What Admin Can Do Instead:**
- Create a new version of the guideline
- Mark old guideline as inactive (farmers with existing crops can still use it)
- Wait until all crops using that guideline are completed/archived

---

## Data Relationships

```
CropGuideline (Created by Admin)
├─ id: "guideline123"
├─ name: "Rice (Inbred)"
├─ category: "Cereals"
├─ growingPeriod: "110-120 days"
├─ stages[] (has many)
│  ├─ CropGuidelineStage
│  │  ├─ id: "stage1"
│  │  ├─ stageName: "Land Preparation"
│  │  ├─ duration: "14-21 days"
│  │  ├─ sequenceOrder: 0
│  │  └─ activities: ["Clear field", "Plow", ...]
│  ├─ CropGuidelineStage
│  │  ├─ id: "stage2"
│  │  ├─ stageName: "Seedling"
│  │  ├─ duration: "21 days"
│  │  ├─ sequenceOrder: 1
│  │  └─ activities: ["Transplant", ...]
│  └─ ... more stages
└─ registeredCrops[] (has many)
   ├─ RegisteredCrop (Farmer 1's crop)
   │  ├─ id: "crop456"
   │  ├─ userId: "farmer1"
   │  ├─ guidelineId: "guideline123"
   │  ├─ plantingDate: "2024-06-01"
   │  ├─ currentStageIndex: 2 (at Vegetative stage)
   │  └─ reports[] (has many)
   │     ├─ CropMonthlyReport
   │     │  ├─ id: "report1"
   │     │  ├─ createdAt: "2024-06-21"
   │     │  ├─ plantHeight: 15
   │     │  └─ feedback[] (admin comments)
   │     ├─ CropMonthlyReport
   │     │  ├─ id: "report2"
   │     │  ├─ createdAt: "2024-07-12"
   │     │  └─ plantHeight: 35
   │     └─ ...
   └─ RegisteredCrop (Farmer 2's crop)
      └─ ...
```

---

## Best Practices

### For Admins:
1. Create detailed guidelines with realistic stage durations
2. Validate that stage durations sum up to the growing period
3. Include comprehensive activities for each stage
4. Never modify guidelines that are in use
5. Review farmer reports regularly and provide feedback
6. Use analytics to improve future guidelines

### For Farmers:
1. Choose the correct guideline for your crop variety
2. Input accurate planting date and area
3. Submit reports regularly (ideally at each stage transition)
4. Be detailed in notes - this helps admins assist you
5. Update health status honestly
6. Record all costs for better financial tracking
7. Read guideline activities and follow them

### For Developers:
1. Always validate guideline usage before allowing updates/deletes
2. Use `currentStageIndex` to track farmer progress
3. Calculate expected stage dates from planting date + stage durations
4. Show visual timeline to help farmers understand their progress
5. Alert farmers when reports are overdue
6. Make reporting as simple as possible (we've removed complex fields)

---

## API Endpoints

### Guidelines
- `GET /api/crop-guidelines` - List all guidelines (with usage count)
- `GET /api/crop-guidelines/:id` - Get single guideline with stages
- `POST /api/crop-guidelines` - Create new guideline (admin only)
- `PATCH /api/crop-guidelines/:id` - Update guideline (blocked if in use)
- `DELETE /api/crop-guidelines/:id` - Delete guideline (blocked if in use)

### Registered Crops
- `GET /api/seed-track/crops` - Get user's registered crops
- `POST /api/seed-track/crops` - Register a new crop
- `GET /api/seed-track/crops/:id` - Get crop with reports
- `PATCH /api/seed-track/crops/:id` - Update crop details
- `DELETE /api/seed-track/crops/:id` - Archive crop

### Reports
- `GET /api/seed-track/reports/:cropId` - Get all reports for a crop
- `POST /api/seed-track/reports` - Submit new report
- `GET /api/seed-track/reports/:id` - Get single report with feedback

### Feedback
- `POST /api/seed-track/feedback` - Admin adds feedback to report
- `GET /api/seed-track/feedback/:reportId` - Get feedback thread

---

## Simplified Report Fields (Updated)

**Kept:**
- Plant Height ✅
- Health Status ✅
- Weather Impact ✅
- Notes ✅
- Pests Observed ✅
- Diseases Observed ✅
- Fertilizers Applied ✅
- Pesticide Applications ✅
- Irrigation Frequency ✅
- Soil Condition ✅
- Planned Actions ✅
- Actual Yield ✅
- Costs ✅

**Removed:**
- ❌ Major Activities This Month (too complex for farmers)
- ❌ Challenges Faced (covered by notes field)
- ❌ Report Date (automatic via createdAt timestamp)
- ❌ Estimated Yield (confusing, actualYield is enough at harvest)
- ❌ Growth Stage (tracked automatically via currentStageIndex)

---

## Future Enhancements

1. **Automatic Stage Progression**: System auto-advances `currentStageIndex` based on date
2. **Report Reminders**: Send notifications when report is due for current stage
3. **Stage Completion Checklist**: Show activities from guideline as checkboxes
4. **Mobile App**: Easier reporting for farmers in the field
5. **Photo Uploads**: Attach crop photos to reports
6. **AI Insights**: Analyze reports to predict yields and problems
7. **Guideline Versioning**: Allow creating v2 of guidelines while v1 crops continue

---

## Troubleshooting

**Q: Farmer can't register a crop**
- Check if guideline exists and is active
- Verify farmer account is type "User"
- Check required fields are filled

**Q: Admin can't update a guideline**
- Check if any farmers have registered crops using this guideline
- If yes, must wait until all crops are completed or create new guideline

**Q: Reports not showing up**
- Verify cropId is correct
- Check if report was successfully saved (check database)
- Ensure report fetch query includes proper relations

**Q: Stage progression not working**
- Verify currentStageIndex is being updated
- Check if guideline stages have correct sequenceOrder
- Ensure stage durations are properly formatted

---

Last Updated: November 17, 2025
