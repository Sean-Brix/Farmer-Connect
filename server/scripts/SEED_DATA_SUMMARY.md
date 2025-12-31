# Planting Reports Seed Data Summary

**Last Seeded:** December 26, 2025  
**Script:** `server/scripts/seedPlantingReports.js`  
**Command:** `npm run seed:planting`

---

## � Distribution Request Integration

**NEW:** This seed now links planting reports to distribution requests!

- The first **8 Request_Report entries** are automatically linked to distribution requests
- Fetches up to 10 distribution requests with status: `Picked_Up`, `Planted`, or `late_pickup`
- Linked reports include: `distributionRequestId`, `distributionItemId`, `distributionQuantity`, `distributionPickupDate`
- **Recommended workflow:** 
  1. Run `npm run seed:requests` first (creates distribution requests)
  2. Run `npm run seed:planting` second (links to those requests)

---

## �📊 Data Overview

### Total Records: 40 Planting Reports

| State | Count | Archived | Deleted | Visible in "All" Tab |
|-------|-------|----------|---------|----------------------|
| **Request** | 8 | 0 | 0 | ✅ 8 |
| **Planted** | 10 | 0 | 0 | ✅ 10 |
| **Completed** | 12 | 12 | 0 | ❌ 0 (all archived) |
| **Archived** | 5 | 5 | 0 | ❌ 0 (archived tab) |
| **Deleted** | 5 | 0 | 5 | ❌ 0 (deleted tab) |

### Tab Expected Counts

- **All Reports Tab:** 18 (8 Request + 10 Planted)
- **Distribution Tab:** TBD (reports with `distributionRequestId`)
- **Deleted Tab:** 5

---

## 🌱 Planting Seasons (3 Total)

1. **Wet Season 2024** (June-November 2024) - Inactive
2. **Dry Season 2025** (December 2024-May 2025) - **Active**
3. **Wet Season 2025** (June-November 2025) - Active

---

## 🌾 Seed Varieties (10 Total)

### Rice (4 varieties)
- NSIC Rc222 (110-115 DAS)
- PSB Rc18 (112-117 DAS)
- NSIC Rc160 (108-113 DAS)
- PSB Rc10 (115-120 DAS)

### Corn (3 varieties)
- Pioneer 30G87 (105 DAS)
- Dekalb 6142 (110 DAS)
- NK 6410 (108 DAS)

### High Value Crops (3 varieties)
- Sweet Potato - VSP (100-120 DAS)
- Tomato - Diamante Max (75-85 DAS)
- Eggplant - Mara (80-90 DAS)

---

## 📋 Detailed Report Breakdown

### REQUEST REPORTS (State 1) - 8 Reports

Seeds distributed, not yet planted. Should appear with BLUE badges.

| # | Farmer | Crop | Variety | Area (ha) | Season | Notes |
|---|--------|------|---------|-----------|--------|-------|
| 1 | Juan Dela Cruz | Rice | NSIC Rc222 | 2.5 | Dry 2025 | 50kg distributed, deadline Jan 20 |
| 2 | Maria Santos | Rice | PSB Rc18 | 1.8 | Dry 2025 | 35kg distributed, deadline Jan 25 |
| 3 | Pedro Garcia | Corn | Pioneer 30G87 | 3.0 | Dry 2025 | 25kg, commercial production |
| 4 | Ana Reyes | Corn | Dekalb 6142 | 2.2 | Dry 2025 | 18kg distributed |
| 5 | Roberto Mendoza | HVC | Sweet Potato | 0.5 | Dry 2025 | 500 seedlings |
| 6 | Carmen Torres | HVC | Tomato | 0.8 | Dry 2025 | 300 seedlings |
| 7 | Teresa Gonzales | Rice | NSIC Rc160 | 1.5 | Dry 2025 | Good seeds |
| 8 | Antonio Lopez | Corn | NK 6410 | 2.0 | Dry 2025 | Farmer's seeds |

**Testing Tips:**
- Filter by "Request" state - should show 8 reports
- All should have future `plantingReportDeadline`
- No `dateOfPlanting` or harvest data
- Search "Juan" should find Juan Dela Cruz

---

### PLANTED REPORTS (State 2) - 10 Reports

Crops planted but not harvested. Should appear with ORANGE badges.

| # | Farmer | Crop | Variety | Area (ha) | Planted | Expected Harvest | Method |
|---|--------|------|---------|-----------|---------|------------------|--------|
| 1 | Jose Bautista | Rice | NSIC Rc222 | 3.5 | Dec 10, 2024 | Apr 5, 2025 | Transplanting |
| 2 | Rosita Flores | Rice | PSB Rc18 | 2.8 | Dec 5, 2024 | Mar 28, 2025 | Direct Seeded |
| 3 | Carlos Villanueva | Rice | NSIC Rc160 | 4.0 | Dec 1, 2024 | Mar 25, 2025 | Transplanting |
| 4 | Luisa Ramos | Corn | Pioneer 30G87 | 2.5 | Dec 8, 2024 | Mar 23, 2025 | Direct Seeded |
| 5 | Francisco Santiago | Corn | Dekalb 6142 | 3.2 | Dec 12, 2024 | Apr 1, 2025 | Direct Seeded |
| 6 | Elena Cruz | HVC | Sweet Potato | 0.6 | Dec 3, 2024 | Apr 2, 2025 | Transplanting |
| 7 | Miguel Santos | HVC | Tomato | 0.4 | Dec 15, 2024 | Mar 10, 2025 | Transplanting |
| 8 | Ricardo Hernandez | Rice | PSB Rc10 | 1.9 | Nov 28, 2024 | Mar 22, 2025 | Direct Seeded |
| 9 | Gloria Martinez | Corn | NK 6410 | 2.1 | Dec 6, 2024 | Mar 20, 2025 | Direct Seeded |
| 10 | Benjamin Aquino | HVC | Eggplant | 0.7 | Dec 18, 2024 | Mar 18, 2025 | Transplanting |

**Testing Tips:**
- Filter by "Planted" state - should show 10 reports
- All have `dateOfPlanting` and `plantingMethod`
- No harvest data yet (`harvestArea`, `numberOfBags`, etc. are null)
- Search "Transplanting" in planting method

---

### COMPLETED REPORTS (State 3) - 12 Reports

All completed reports are ARCHIVED. Should appear with GREEN badges in Archived view.

| # | Farmer | Crop | Variety | Area | Harvest | Bags | Yield (mt/ha) | Season |
|---|--------|------|---------|------|---------|------|---------------|--------|
| 1 | Alfredo Valencia | Rice | NSIC Rc222 | 3.0 | Oct 12, 2024 | 120 @ 50kg | 2.0 | Wet 2024 |
| 2 | Diana Pascual | Rice | PSB Rc18 | 2.5 | Oct 15, 2024 | 95 @ 50kg | 1.9 | Wet 2024 |
| 3 | Eduardo Diaz | Rice | NSIC Rc160 | 4.2 | Oct 5, 2024 | 155 @ 50kg | 1.85 | Wet 2024 |
| 4 | Felicidad Navarro | Rice | PSB Rc10 | 1.8 | Oct 25, 2024 | 68 @ 50kg | 1.89 | Wet 2024 |
| 5 | Gregorio Salazar | Corn | Pioneer 30G87 | 2.8 | Oct 8, 2024 | 168 @ 25kg | 1.5 | Wet 2024 |
| 6 | Helena Ocampo | Corn | Dekalb 6142 | 3.5 | Oct 23, 2024 | 196 @ 25kg | 1.4 | Wet 2024 |
| 7 | Ignacio Gutierrez | Corn | NK 6410 | 2.3 | Oct 2, 2024 | 115 @ 25kg | 1.25 | Wet 2024 |
| 8 | Julia Cortez | HVC | Sweet Potato | 0.5 | Oct 26, 2024 | 50 @ 10kg | 1.0 | Wet 2024 |
| 9 | Leonardo Aguilar | HVC | Tomato | 0.7 | Oct 3, 2024 | 280 @ 5kg | 2.0 | Wet 2024 |
| 10 | Monica Estrada | HVC | Eggplant | 0.9 | Sep 15, 2024 | 450 @ 3kg | 1.5 | Wet 2024 |
| 11 | Nestor Chavez | Rice | NSIC Rc222 | 3.3 | Oct 7, 2024 | 132 @ 50kg | 2.0 | Wet 2024 |
| 12 | Olivia Ferrer | Corn | Pioneer 30G87 | 2.6 | Oct 21, 2024 | 130 @ 25kg | 1.25 | Wet 2024 |

**Testing Tips:**
- Filter by "Completed" in All tab - should show 0 (all archived)
- Filter by "Archived" - should show 12+ reports
- All have complete data: planting date, harvest date, bags, yield
- Search "Wet Season 2024" to find these

---

### ADDITIONAL ARCHIVED REPORTS - 5 Reports

Older completed reports that have been archived.

| # | Farmer | Crop | Area | Archived Date | Archived By |
|---|--------|------|------|---------------|-------------|
| 1 | Patricia Solis | Rice | 2.0 | Nov 15, 2024 | admin |
| 2 | Quirino Ventura | Corn | 1.5 | Nov 20, 2024 | admin |
| 3 | Remedios Tan | HVC | 0.8 | Dec 1, 2024 | admin |
| 4 | Salvador Mejia | Rice | 2.7 | Nov 25, 2024 | admin |
| 5 | Trinidad Robles | Corn | 1.2 | Dec 5, 2024 | admin |

**Testing Tips:**
- All in Archived tab
- Check `archivedAt` and `archivedBy` fields
- Test unarchive functionality if implemented

---

### DELETED REPORTS (Soft Deleted) - 5 Reports

Various states, all soft-deleted. 30-day recovery period.

| # | Farmer | State | Crop | Deleted Date | Deleted By |
|---|--------|-------|------|--------------|------------|
| 1 | Vicente Morales | Request | Rice | Dec 20, 2024 | admin |
| 2 | Wilma Padilla | Planted | Corn | Dec 22, 2024 | admin |
| 3 | Xavier Zamora | Completed | Rice | Dec 18, 2024 | user |
| 4 | Yolanda Rivera | Request | HVC | Dec 23, 2024 | admin |
| 5 | Zachary Bautista | Planted | Corn | Dec 24, 2024 | user |

**Testing Tips:**
- Switch to Deleted tab - should show 5 reports
- Each has `deletedAt` timestamp
- Test restore functionality
- After 30 days, these should be permanently deleted by cron job

---

## 🧪 Testing Scenarios

### Scenario 1: State Filtering
```
1. Go to All Reports tab (should show 18)
2. Filter State = "Request" (should show 8)
3. Filter State = "Planted" (should show 10)
4. Filter State = "Completed" (should show 0 - all archived)
5. Filter State = "Archived" (should show 17 total - 12 completed + 5 archived)
```

### Scenario 2: Crop Type Filtering
```
1. Filter Crop = "Rice" (should show multiple, varies by state)
2. Filter Crop = "Corn" (should show multiple)
3. Filter Crop = "High_Value_Crops" (should show multiple)
4. Combine with State filter for precise results
```

### Scenario 3: Search Testing
```
1. Search "Juan" → finds Juan Dela Cruz (Request)
2. Search "Angeles City" → finds multiple farmers
3. Search "Rice" → finds rice reports
4. Search "NSIC" → finds NSIC variety reports
5. Search "2024" → finds 2024 reports
```

### Scenario 4: Variety Filtering
```
1. Select Crop = "Rice"
2. Variety dropdown should show: NSIC Rc222, PSB Rc18, NSIC Rc160, PSB Rc10
3. Select variety to filter
4. Results should match seed data
```

### Scenario 5: Season Filtering
```
1. Select Season = "Dry Season 2025" (active season)
2. Should show Request + Planted reports (18 total)
3. Select Season = "Wet Season 2024"
4. Should show Completed/Archived reports
```

### Scenario 6: Pagination Testing
```
If pagination set to 10 per page:
- All Reports: Page 1 (10 items), Page 2 (8 items)
- Archived: Page 1 (10 items), Page 2 (7 items)
- Deleted: Page 1 (5 items)
```

---

## 🔄 Reseeding Instructions

### Full Reseed
```bash
cd server
npm run seed:planting
```

This will:
1. Create 3 planting seasons (upsert)
2. Create 10 seed varieties (upsert)
3. Create 40 planting reports (will fail if duplicates exist)

### Clean Reseed (Remove Old Data First)
```bash
cd server
# Method 1: Through Prisma Studio
npm run prisma:studio
# Delete all PlantingReport records manually

# Method 2: Database reset (WARNING: Deletes ALL data)
npx prisma migrate reset --force
npm run seed:planting
```

---

## 📝 Seed Data Features

### ✅ Implemented
- [x] Multiple states (Request, Planted, Completed)
- [x] Archive functionality
- [x] Soft delete functionality
- [x] Various crop types (Rice, Corn, HVC)
- [x] Multiple varieties per crop
- [x] Different planting methods
- [x] Different seed classifications
- [x] Rice irrigation types
- [x] Distribution metadata (some reports)
- [x] State history (some reports)
- [x] Realistic farmer names and locations
- [x] RSBSA numbers
- [x] Realistic areas, yields, bag counts
- [x] Date ranges (past and future)

### 🔜 Not Implemented (Add if Needed)
- [ ] Distribution linkage (all reports have null `distributionRequestId`)
- [ ] Photos/attachments
- [ ] Comments
- [ ] Weather data
- [ ] Pest/disease records
- [ ] Cost tracking

---

## 🐛 Known Issues / Notes

1. **Distribution Tab Count:** Currently all reports have `distributionRequestId = null`. To test Distribution tab:
   - Manually update some reports to link to distributions
   - Or modify seed script to create distribution links

2. **Completed Reports in All Tab:** All completed reports are archived, so they don't appear in "All" tab. This is by design.

3. **Date Ranges:**
   - Request Reports: Current (Dec 2024), future deadlines
   - Planted Reports: Nov-Dec 2024 planting, Mar-Apr 2025 expected harvest
   - Completed Reports: Jun-Oct 2024 (Wet Season 2024)
   - Deleted Reports: Deleted Dec 18-24, 2024

4. **Variety IDs:** Seed script uses `?` optional chaining. If varieties don't exist, some reports may fail to create.

---

## 📊 Expected UI Behavior

### All Reports Tab (State Filter)
- **All States:** 18 reports
- **Request:** 8 reports (BLUE badges)
- **Planted:** 10 reports (ORANGE badges)
- **Completed:** 0 reports (all archived)
- **Archived:** 17 reports (GREEN badges for completed ones)

### Deleted Tab
- **Total:** 5 reports (various states)
- Shows deleted date and deleted by user

### Distribution Tab
- **Expected:** 0 or low count (most reports not linked to distributions)
- To populate: Update `distributionRequestId` in some reports

---

## 🎯 Quick Test Checklist

- [ ] All Reports tab shows 18 reports
- [ ] Distribution tab shows appropriate count
- [ ] Deleted tab shows 5 reports
- [ ] State filter "Request" shows 8 reports
- [ ] State filter "Planted" shows 10 reports
- [ ] State filter "Completed" shows 0 reports
- [ ] State filter "Archived" shows 17 reports
- [ ] Search "Juan" finds Juan Dela Cruz
- [ ] Search "Angeles City" finds multiple farmers
- [ ] Crop filter "Rice" shows rice reports
- [ ] Variety filter works (Rice → NSIC Rc222, etc.)
- [ ] Season filter "Dry Season 2025" shows Request+Planted
- [ ] Season filter "Wet Season 2024" shows Completed/Archived
- [ ] Pagination works if > 25 reports total
- [ ] State badges show correct colors (Request=BLUE, Planted=ORANGE, Completed=GREEN)

---

**End of Seed Data Summary**
