# Seed Data Update Summary

## Changes Made to seedPlantingReports.js

### Updated 3-State System
Migrated from old 4-state system to new 3-state system:
- ❌ **Old:** Request_Report / Distributed → Planted → Completed
- ✅ **New:** Planting → Planted → Harvested

### Comprehensive Seed Data

#### State 1: Planting (10 reports)
All reports include **ALL required fields** for Planting state:
- ✅ farmerName, farmLocation, rsbsaNumber
- ✅ croppingSeasonId, areaPlanted, seedClassification
- ✅ typeOfCrop, varietyId
- ✅ **dateOfPlanting** (now REQUIRED, was null before)
- ✅ **plantingMethod** (now REQUIRED, was null before)
- ✅ riceIrrigation (for Rice crops only)
- ✅ cropInsurance
- ✅ Distribution linkage fields (when applicable)

**Breakdown:**
- 4 Rice reports (various irrigation types)
- 2 Corn reports
- 2 High Value Crop reports
- 2 Additional reports (diverse scenarios)

**Sample dates:** Jan 5-16, 2025 (recent/current)

#### State 2: Planted (10 reports)
All reports include planting data + expected harvest dates:
- ✅ All Planting state fields
- ✅ dateOfExpectedHarvest (auto-calculated)
- ❌ NO harvest data yet (excluded)

**Breakdown:**
- 3 Rice reports
- 2 Corn reports  
- 2 High Value Crop reports
- 3 Additional reports (mixed crops)

**Sample dates:** Nov 28 - Dec 18, 2024 (recently planted)

#### State 3: Harvested (12 reports)
All reports include **COMPLETE** harvest data:
- ✅ All Planted state fields
- ✅ **dateOfHarvest** (newly added, was missing)
- ✅ harvestArea (≤ areaPlanted)
- ✅ numberOfBags
- ✅ weightPerBag
- ✅ yieldMtPerHa (auto-calculated)

**Breakdown:**
- 4 Rice reports (1.85-2.0 MT/ha yield)
- 3 Corn reports (1.25-1.5 MT/ha yield)
- 3 High Value Crop reports (1.0-2.0 MT/ha yield)
- 2 Additional reports (diverse yields)

**Sample dates:** Planted Jun-Jul 2024, Harvested Sep-Oct 2024

#### Archived Reports (5 reports)
Previously harvested, now archived:
- ✅ State: Harvested
- ✅ isArchived: true
- ✅ archivedAt & archivedBy populated
- ✅ Complete harvest data
- ✅ dateOfHarvest included

**Breakdown:**
- 2 Rice reports
- 2 Corn reports
- 1 High Value Crop report

**Archive dates:** Nov 15 - Dec 5, 2024

#### Deleted Reports (5 reports)
Soft-deleted for 30-day recovery:
- ✅ Various states (Planting, Planted, Harvested)
- ✅ isDeleted: true
- ✅ deletedAt & deletedBy populated
- ✅ All state-appropriate fields filled

**Breakdown:**
- 2 Planting state (early deletion)
- 1 Planted state
- 2 Harvested state

**Delete dates:** Dec 18-24, 2024

## Total Reports: 42

### Distribution:
- **Planting:** 10 reports (24%)
- **Planted:** 10 reports (24%)
- **Harvested:** 12 reports (29%)
- **Archived:** 5 reports (12%)
- **Deleted:** 5 reports (12%)

### Crop Distribution:
- **Rice:** 18 reports (43%)
  - Irrigated: 12
  - Rainfed Lowland: 4
  - Rainfed Upland: 2
- **Corn:** 14 reports (33%)
- **High Value Crops:** 10 reports (24%)

### Key Improvements:

1. ✅ **All Planting reports now have complete required data**
   - Previously: dateOfPlanting and plantingMethod were null
   - Now: All fields filled with realistic dates

2. ✅ **All Harvested reports now have dateOfHarvest**
   - Previously: Missing this critical field
   - Now: Includes harvest date slightly after expected date

3. ✅ **Proper state progression**
   - Planting → Recent dates (Jan 2025)
   - Planted → Late 2024
   - Harvested → Mid 2024
   - Archived → Early-Mid 2024

4. ✅ **Distribution-linked reports**
   - 8+ reports linked to distribution requests
   - All have proper distributionRequestId
   - All start in Planting state (not "Distributed")

5. ✅ **Realistic data scenarios**
   - Various crop types and varieties
   - Different planting methods (Direct Seeded, Transplanting)
   - Range of field sizes (0.3 - 4.2 hectares)
   - Realistic yields by crop type
   - Insurance coverage mix

6. ✅ **State history tracking**
   - Sample reports include stateHistory JSON
   - Shows progression: Planting → Planted → Harvested
   - Includes timestamps and responsible users

## Testing Coverage

This seed data enables testing of:

### ✅ Complete Workflow
- Create → Planting → Planted → Harvested → Archive

### ✅ Field Visibility
- Planting: No harvest fields
- Planted: No harvest fields  
- Harvested: All harvest fields visible

### ✅ Field Locking
- Planting: All editable
- Planted: Most locked, some editable
- Harvested: Planting fields locked, harvest editable

### ✅ Validation
- Required fields per state
- Conditional validation (Rice irrigation)
- Harvest constraints (area, dates)
- State transition rules

### ✅ Filtering & Sorting
- By state (3 states)
- By crop type (3 types)
- By archive/delete status
- By distribution linkage

### ✅ Edge Cases
- Deleted reports (recovery testing)
- Archived reports (read-only)
- Distribution-linked (auto-creation)
- Various field sizes and yields

## Migration Notes

### ⚠️ Breaking Changes from Old Seed:
- State "Request_Report" → "Planting"
- State "Completed" → "Harvested"
- Removed "Distributed" state entirely
- dateOfPlanting: Now required (was optional/null)
- plantingMethod: Now required (was optional/null)
- dateOfHarvest: Now required for Harvested (was missing)

### 🔧 Database Migration Needed:
If existing data has old state names, run migration:
```sql
UPDATE planting_reports 
SET state = 'Planting' 
WHERE state IN ('Request_Report', 'Distributed');

UPDATE planting_reports 
SET state = 'Harvested' 
WHERE state = 'Completed';
```

## Next Steps

1. ✅ Run seed script: `cd server && node scripts/seedPlantingReports.js`
2. ✅ Verify console output shows correct counts
3. ✅ Test frontend with new data
4. ✅ Verify distribution-linked reports show planting details
5. ✅ Test complete workflow progression
6. ✅ Run test checklist: [State_Migration_Test_Checklist.md](../Test/State_Migration_Test_Checklist.md)
