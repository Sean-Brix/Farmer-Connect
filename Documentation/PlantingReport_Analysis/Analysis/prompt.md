# PlantingReport Feature - Requirements & Design Decisions

**Date:** December 24, 2025  
**Status:** Requirements Gathering Phase  
**Purpose:** Comprehensive documentation of all requirements, notes, and design decisions for PlantingReport feature redesign

---

## Critical Business Rules

### 1. Report Status System (THREE STATES)

The PlantingReport feature has **THREE distinct states**, NOT a Draft/Submitted/Archived flow:

#### **State 1: Request Report** 
- **Definition:** Report exists but crop has NOT been planted yet
- **Data Present:** 
  - Farmer information (name, location, RSBSA)
  - Seed details (variety, classification, type of crop)
  - Area to be planted
  - Possibly linked to distribution request
- **Data Missing:** 
  - Date of planting (null)
  - Planting method details
  - Rice irrigation type
  - All harvest information
- **Use Case:** Created when distribution request is approved/picked up, or admin creates placeholder for future planting

#### **State 2: Planted Report**
- **Definition:** Crop has been planted, but NOT harvested yet
- **Data Present:**
  - All from State 1
  - Date of planting (required)
  - Planting method (Direct_Seeded / Transplanting)
  - Rice irrigation (if applicable)
  - Area planted (confirmed)
  - Expected harvest date (auto-calculated)
- **Data Missing:**
  - Harvest area
  - Number of bags
  - Weight per bag
  - Yield (auto-calculated field)
- **Use Case:** Admin updates report when farmer confirms planting has occurred

#### **State 3: Completed Report**
- **Definition:** Crop has been harvested, all data is complete
- **Data Present:**
  - All from State 1 and State 2
  - Harvest area
  - Number of bags
  - Weight per bag
  - Yield (auto-calculated: `(harvestArea × numberOfBags × weightPerBag) / 1000`)
- **Ready for Archive:** YES, but admin must manually archive
- **Use Case:** Admin enters harvest data after farmer completes harvest

### 2. Archive Functionality

**Archive is NOT a status** - it's a separate boolean flag (`isArchived`).

- **Purpose:** Store completed/harvested reports that are "done"
- **Admin Control:** Only admin can archive reports
- **When to Archive:** When State 3 (Completed) reports are finalized and ready for long-term storage
- **Visibility:** Archived reports excluded from default views (performance optimization)
- **Separate Tab:** Similar to how Distribution has Pending/Approved/Archived tabs

### 3. Delete Functionality (NEW REQUIREMENT)

**Delete is NOT permanent** - it's a soft delete with recovery period.

- **Soft Delete:** Reports marked as deleted but NOT removed from database
- **Recovery Period:** 30 days
- **After 30 Days:** Permanently deleted (requires scheduled job/cron)
- **Access:** Admin can view and restore deleted reports
- **Difference from Archive:** 
  - Archive = Finished, successful reports
  - Delete = Incorrect, duplicate, or cancelled reports

**Implementation Notes:**
- Add `isDeleted` boolean field
- Add `deletedAt` timestamp field
- Exclude deleted reports from all views except "Deleted Reports" tab
- Add "Restore" button in deleted reports view
- Scheduled job to permanently delete records where `deletedAt` < 30 days ago

---

## Table Organization

### Distribution Reports vs Regular Reports

**CRITICAL:** Separate tables/tabs for distribution-linked reports vs manually created reports.

#### **Distribution Planting Reports Tab**
- **Criteria:** Reports where `distributionRequestId` is NOT null
- **Display:** Similar to how active/archived are separated
- **Purpose:** Track planting outcomes from distribution requests
- **Special Features:**
  - "View Distribution Request" button/link in each row
  - Distribution metadata visible (pickup date, quantity, unit)
  - Link back to original distribution request

#### **Regular Planting Reports Tab**
- **Criteria:** Reports where `distributionRequestId` IS null
- **Display:** Manually created reports by admin
- **Purpose:** Track planting activities not tied to distributions

**Reasoning:** Easier to manage separately, different workflows, different data visibility needs.

---

## Configuration Section

### Current Name: "Configuration"
**User Concern:** "I'm not sure if configuration is really the right term for that."

**What it is:**
- Manages **Varieties** (seed types with DAS values)
- Manages **Seasons** (planting seasons with date ranges)
- Used as reference data for ALL planting reports

**Alternatives to Consider:**
- "Reference Data"
- "Seed & Season Management"
- "Planting References"
- "Master Data"
- "System References"

**Recommended:** "Reference Management" or "Planting References"

### Variety & Season Features

#### Current Issues:
1. **Limited CRUD:** Just create, edit, delete, activate/deactivate
2. **No visibility:** Can't see which reports use a specific variety/season
3. **Unclear activation button:** Doesn't look clickable

#### Required Features:

**1. "View Reports Using This Variety/Season"**
- Click on variety/season → Opens modal
- Modal shows table of all reports using that variety/season
- Table columns: Farmer, Crop Type, Planting Date, Status, Archived
- Sortable by: Active → Archived, Date (newest first)
- Filters: Crop Type, Status, Date Range
- **Use Case:** Before deleting/deactivating, see impact

**2. Improved Activation Toggle**
- **Current:** Just text or unclear button
- **Required:** Clear visual indicator (toggle switch, button style)
- **States:** 
  - Active (green, enabled)
  - Inactive (gray, disabled)
- **Tooltip:** "Click to activate/deactivate"

**3. Cascade Delete Confirmation Enhancement**
- Show count of affected reports
- Group by status (X active, Y archived)
- Warning if any are in State 1 or State 2 (not completed)

---

## User Roles

Include in analysis and access control planning:

1. **Superadmin** - Full access to everything
2. **Admin** - Full CRUD on planting reports, varieties, seasons
3. **Users/Farmers** - No direct access (reports created on their behalf)

**Note:** Ensure role-based access control (RBAC) in backend controllers.

---

## Approved Recommendations by Category

### ✅ Issue 1: Monolithic ReportModal.jsx (812 lines)

**Decision:** APPROVED - Proceed with ALL recommendations

**Action Required:**
- Split modal into smaller components:
  - `FarmerInfoSection.jsx`
  - `SeedingDetailsSection.jsx`
  - `HarvestingSection.jsx`
  - `DistributionMetadata.jsx` (readonly)
  - `ArchiveConfirmation.jsx` (if keeping archive modal)
- Create `hooks/useReportForm.js` for shared form logic
- **RECHECK/REDO THE PLAN** - Ensure alignment with 3-state system

**New Requirement:** Modal sections should adapt to report state:
- State 1: Show only farmer + seed details
- State 2: Enable planting details section
- State 3: Enable harvesting section

### ✅ Issue 2: No Functional Pagination

**Decision:** APPROVED

**Action Required:**
- Implement **server-side pagination** on backend
- Implement **frontend pagination controls**
- Default page size: TBD (suggest 25 or 50)
- Page size options: 10, 25, 50, 100
- Match Distribution feature pagination pattern

### ✅ Issue 3: Cache Staleness (10-minute TTL)

**Decision:** PARTIALLY APPROVED

**Approved:**
- ✅ Manual refresh button
- ✅ Invalidate cache on mutations (already implemented, ensure consistency)
- ✅ Reduce TTL to 2-3 minutes

**Rejected:**
- ❌ WebSocket implementation

**Alternative Required:**
Find another way for real-time updates without WebSocket:
- **Option 1:** State/Context for immediate updates (optimistic updates)
- **Option 2:** Short polling (every 30 seconds when page is active)
- **Option 3:** Invalidate cache on tab focus (refresh when admin switches back to tab)
- **Option 4:** Tanstack Query's refetchOnWindowFocus + staleTime configuration

**User's Note:** "If there are better ways to implement without auto refresh or state/context, then feel free to suggest"

### ✅ Issue 4: Scattered UI Organization

**Decision:** FULLY APPROVED

**Action Required:**
- Add "Manage Varieties/Seasons" collapsible panel in main view
- Group all filters in a single "Filter Panel" with clear/apply buttons
- Add status dropdown filter (State 1 / State 2 / State 3)
- Make statistics cards toggleable or move to separate analytics view

### ⚠️ Issue 5: No Distribution Linking in UI (MODIFIED)

**Decision:** PARTIALLY APPROVED with modifications

**Approved:**
- ✅ Add "View Distribution Request" button in modal
- ✅ Show distribution metadata prominently in modal (currently buried)
- ✅ Add link in Distribution request section for redirect ("View Request")

**Rejected:**
- ❌ Add "Distribution Request" column in table (user prefers separate tables)
- ❌ Badge indicator for auto-created reports

**Modified Requirement:**
- **SEPARATE all distribution reports** into their own tab/table
- Similar to how archived reports are separated
- Easier to manage this way
- No need for column or badge when they're already separated

### ✅ Validation Gaps

**Decision:** APPROVED

**Action Required:**
- Implement joi or zod schema validation on backend
- Add comprehensive frontend validation with clear error messages
- Validate business rules:
  - Harvest area ≤ planted area
  - Positive numbers only (area, bags, weight)
  - Logical date ranges
- **Status Transition Validation:**
  - State 1 → State 2: Requires dateOfPlanting, plantingMethod, areaPlanted
  - State 2 → State 3: Requires harvestArea, numberOfBags, weightPerBag
  - State 3 → Archive: Admin only

**Note:** NO DRAFT STATUS - Only three states as defined above.

### ✅ Performance Issues

**Decision:** FULLY APPROVED

**Action Required:**
1. **Stop fresh data fetch on modal open** - Use cache with manual refresh option
2. **Query optimization** - Field selection (table view needs fewer fields than modal)
3. **Statistics calculation** - Move to backend or cache more aggressively

### ✅ Missing Features & Improvements

#### **Bulk Operations**
- **Approved:**
  - Bulk archive
  - Bulk delete (soft delete)
- **Modified:** Excel export instead of CSV
  - Different sheets per variety
  - First sheet: Summary listing all reports
  - Subsequent sheets: One per variety with filtered reports

#### **Advanced Filtering**
- **Approved:**
  - Date range filter in UI
  - "Created from Distribution" filter (now obsolete with separate tables)
- **Rejected:**
  - ❌ "Overdue Deadline" filter (plantingReportDeadline feature removed)

#### **Audit Trail**
- **Approved:**
  - Display `lastUpdatedBy` field
  - Show created by / updated by timestamps in UI
  - Track edit history

#### **Notifications**
- **Rejected:** ❌ Remove all notification features including creation notification
- **Action:** Remove or disable notification creation in backend

### ⚠️ Quality of Life Improvements (MODIFIED)

#### **1. Distribution Integration Enhancements**
**Approved:**
- Show "Planting Report" link in Distribution Request view
- Show "Distribution Request" link in Planting Report view
- Auto-populate farmer info from distribution request
- Show seedling quantity distributed vs. area planted (conversion check)

**Rejected:**
- ❌ Display pickup date prominently in report (admin doesn't need to see it)

#### **2. Report Status Workflow Enhancement**
**REDO REQUIRED** - Original recommendation assumed Draft status

**New Workflow:**
```
State 1: Request Report (no planting data)
  ↓ (Admin adds planting date + method)
State 2: Planted (planting confirmed, no harvest)
  ↓ (Admin adds harvest data)
State 3: Completed (all data present, ready for archive)
  ↓ (Admin manually archives)
Archive (finished reports, excluded from default view)
```

**UI Features:**
- Visual workflow indicator (stepper or progress bar)
- Status-based field enablement:
  - State 1: Only farmer + seed details editable
  - State 2: Planting details unlocked, harvest grayed out
  - State 3: All fields editable, "Archive" button appears
- Auto-transition: When harvest data is added, transition State 2 → State 3

#### **3. Smart Defaults & Auto-fill**
**Approved:**
- Auto-populate season based on dateOfPlanting (if falls within season range)
- Pre-fill RSBSA if farmer previously reported

**Rejected:**
- ❌ Suggest variety based on typeOfCrop (admin knows what they want)
- ❌ Auto-calculate plantingReportDeadline (no deadline feature)

#### **4. Enhanced Table View**
**Approved:**
- Sorting on all columns (currently only backend default sort)
- Column visibility toggles (hide/show columns)

**Rejected/Not Mentioned:**
- Saved filter presets (not discussed, assume not priority)
- Inline quick edit (not discussed, assume not priority)
- Row color coding (not discussed, could suggest if valuable)

#### **5. Analytics Dashboard**
**Approved:**
- Total area planted by crop type (pie chart)
- Planting timeline (Gantt chart showing planting dates)
- Yield comparison by variety/season

**Rejected:**
- ❌ Distribution → Planting conversion rate
- ❌ Top farmers by area planted

### ✅ Comparison with Company Standards

**Decision:** APPROVED with caveat

**Requirement:** "Follow company standards as long as it doesn't overwrite the process"

**Action:** 
- Use Distribution feature as reference for:
  - Tab-based separation (Pending/Approved/Picked Up/Planted/Archive)
  - Table layout and pagination
  - Filter panel organization
  - Modal design patterns
- Adapt patterns to PlantingReport's 3-state workflow

---

## Critical Implementation Notes

### 1. Three States Are the Foundation

**Everything revolves around these three states:**
- UI conditional rendering
- Validation rules
- Field enablement
- Status transitions
- Workflow indicators

**Database Representation Options:**

**Option A: Inferred from data presence (Current approach)**
```javascript
function getReportState(report) {
  if (!report.dateOfPlanting) return 'REQUEST';
  if (!report.harvestArea) return 'PLANTED';
  return 'COMPLETED';
}
```

**Option B: Explicit status field (Recommended)**
```prisma
enum PlantingReportState {
  Request_Report
  Planted
  Completed
}

model PlantingReport {
  // ...
  state PlantingReportState @default(Request_Report)
}
```

**Recommendation:** Use explicit state field for clarity and easier querying.

### 2. Global Search Across States

**Requirement:** "Even if there are three states, I still want admin to be able to just search and then find what they're looking for regardless of state, archived report excluded of course"

**Implementation:**
- Single search bar at top
- Searches across ALL tabs (Distribution Reports, Regular Reports, all states)
- Highlights which tab contains the match
- Excludes archived unless "Show Archived" is toggled
- Excludes deleted (separate "Deleted Reports" view)

**Search Fields:**
- Farmer name
- Farm location
- RSBSA number
- Crop type
- Variety name
- Season name

### 3. Table Tabs Organization

**Proposed Structure:**

```
┌─────────────────────────────────────────────────────────┐
│  Planting Reports                                       │
├─────────────────────────────────────────────────────────┤
│  [ Distribution Reports ] [ Regular Reports ] [ Deleted ]│ ← Main Tabs
├─────────────────────────────────────────────────────────┤
│  INSIDE Distribution/Regular Reports:                   │
│  [ Request ] [ Planted ] [ Completed ] [ Archived ]     │ ← Sub-tabs
├─────────────────────────────────────────────────────────┤
│  [Search globally...] [Filters ▼] [+ Add] [Manage Ref] │
├─────────────────────────────────────────────────────────┤
│  📊 Statistics (collapsible)                            │
├─────────────────────────────────────────────────────────┤
│  Table of reports...                                    │
└─────────────────────────────────────────────────────────┘
```

**Alternative (Simpler):**
```
┌─────────────────────────────────────────────────────────┐
│  [ All Reports ] [ Distribution Reports ] [ Deleted ]   │
├─────────────────────────────────────────────────────────┤
│  INSIDE All/Distribution:                               │
│  [ Request ] [ Planted ] [ Completed ] [ Archived ]     │
└─────────────────────────────────────────────────────────┘
```

### 4. Validation Rules by State

#### State 1 → State 2 Transition
**Required Fields:**
- `dateOfPlanting` (must be valid date, not future)
- `plantingMethod` (Direct_Seeded or Transplanting)
- `areaPlanted` (must be positive number)
- `riceIrrigation` (if `typeOfCrop` is Rice)

**Validations:**
- Date of planting ≤ today
- Area planted > 0

#### State 2 → State 3 Transition
**Required Fields:**
- `harvestArea` (must be positive number)
- `numberOfBags` (must be positive integer)
- `weightPerBag` (must be positive number)

**Validations:**
- Harvest area ≤ area planted
- All values > 0
- Auto-calculate `yieldMtPerHa`

#### State 3 → Archive
**Requirements:**
- Admin permission only
- Confirmation modal
- If linked to distribution: Update distribution status to "Archived"

---

## Removed Features

### 1. Draft Status
- **Removed:** No longer using Draft status
- **Reason:** Replaced by 3-state system (Request/Planted/Completed)

### 2. Planting Report Deadline
- **Removed:** `plantingReportDeadline` field no longer used
- **Reason:** Admin manages everything, no automated deadlines needed
- **Database:** Keep field for backward compatibility, but don't display in UI

### 3. Notifications
- **Removed:** All notification features
- **Reason:** Admin doesn't need notifications
- **Action:** Remove or disable in backend (creation notification, status change notification, deadline notification)

### 4. Pickup Date Display in Report View
- **Removed:** Don't show pickup date prominently in planting report
- **Reason:** Admin doesn't need to see it
- **Note:** Still store `distributionPickupDate` for data integrity, just don't display

### 5. Suggest Variety Feature
- **Removed:** No auto-suggestion of variety based on crop type
- **Reason:** Admin knows what variety they want

---

## Implementation Priority

Based on user feedback, prioritize:

### 🔴 **Phase 1: Core Restructuring (Highest Priority)**
1. Update database schema for 3-state system
2. Add soft delete fields (`isDeleted`, `deletedAt`)
3. Separate Distribution Reports vs Regular Reports tables/tabs
4. Split monolithic modal into components
5. Implement pagination (frontend + backend)

### 🟡 **Phase 2: Validation & UX (High Priority)**
6. Backend validation (joi/zod schemas)
7. Frontend validation with clear errors
8. Status-based field enablement in modal
9. Improve variety/season activation buttons
10. Add "View Reports" modal for varieties/seasons

### 🟢 **Phase 3: Advanced Features (Medium Priority)**
11. Bulk operations (archive, delete, Excel export)
12. Enhanced filtering (date range, status, crop type)
13. Global search across all tabs
14. Analytics dashboard
15. Audit trail display

### 🔵 **Phase 4: Polish & Optimization (Lower Priority)**
16. Cache optimization (2-3 min TTL, manual refresh, optimistic updates)
17. Column visibility toggles
18. Collapsible statistics panel
19. Mobile responsiveness improvements
20. Performance optimization (query field selection)

---

## Open Questions for User

1. **State Field Implementation:** Should we add an explicit `state` enum field to the database, or infer state from data presence?

2. **Table Organization:** Prefer nested tabs (Distribution/Regular → State sub-tabs) or flat structure (All Reports with filters)?

3. **Configuration Section Rename:** What should we call "Configuration"? Options: "Reference Management", "Planting References", "Master Data"

4. **Soft Delete UI:** Should deleted reports have their own dedicated page/tab, or a toggle in main view?

5. **Permanent Delete Automation:** Should the 30-day permanent delete be automated (cron job) or manual admin action?

6. **Global Search Behavior:** When search matches report in different tab, should it:
   - Auto-switch to that tab?
   - Show results from all tabs in dropdown?
   - Highlight tab with badge showing match count?

7. **Excel Export Structure:** For the multi-sheet export:
   - Sheet 1: All reports summary - which columns?
   - Sheets 2+: One per variety - same columns or different?
   - Include archived reports or active only?

8. **Real-time Updates:** Preferred solution for cache freshness:
   - Optimistic updates (update UI immediately, sync in background)?
   - Short polling (every 30 seconds)?
   - Refetch on window focus?
   - Combination?

9. **Status-based Color Coding:** Should table rows have color coding?
   - State 1 (Request) = Yellow/Orange
   - State 2 (Planted) = Blue
   - State 3 (Completed) = Green

10. **Archive Confirmation:** When archiving, should we require confirmation modal or direct action?

---

## Reference Patterns from Distribution Feature

Based on attached Distribution folder, observed patterns:

### Component Structure
```
Distribution/
├── Distribution.jsx (main orchestrator)
├── components/
│   ├── DistributionLoadingState.jsx
│   ├── DistributionErrorState.jsx
│   ├── DistributionItemCard.jsx
│   ├── RequestSection.jsx
│   └── RequestsTable.jsx (separate table component)
└── hooks/
    └── useDistributionQueries.js (Tanstack Query)
```

**Pattern to Replicate:**
```
PlantingReport/
├── PlantingReports.jsx (main orchestrator)
├── components/
│   ├── PlantingReportLoadingState.jsx
│   ├── PlantingReportErrorState.jsx
│   ├── ReportTable.jsx (separate from main file)
│   ├── ReportModal/ (modular modal)
│   │   ├── index.jsx
│   │   ├── FarmerInfoSection.jsx
│   │   ├── SeedingDetailsSection.jsx
│   │   ├── HarvestingSection.jsx
│   │   └── DistributionMetadata.jsx
│   ├── ReferenceManagement.jsx (varieties/seasons)
│   └── StatisticsPanel.jsx
└── hooks/
    ├── usePlantingReportQueries.js (Tanstack Query)
    └── useReportForm.js
```

### Tab-based Separation (RequestsTable.jsx pattern)
```javascript
const [activeTab, setActiveTab] = React.useState('pending');

const categorizedRequests = React.useMemo(() => {
    return {
        pending: requests.filter(req => req.status === 'Pending'),
        approved: requests.filter(req => req.status === 'Approved'),
        pickedUp: plantingInProgress,
        planted,
        archive: requests.filter(req => ['Rejected', 'No_Pickup', 'Cancelled', 'Archived'].includes(req.status))
    };
}, [requests]);

const tabRequests = categorizedRequests[activeTab] || [];
```

**Adapt for PlantingReport:**
```javascript
const [activeMainTab, setActiveMainTab] = useState('regular'); // regular, distribution, deleted
const [activeStateTab, setActiveStateTab] = useState('all'); // all, request, planted, completed, archived

const categorizedReports = useMemo(() => {
    const base = activeMainTab === 'regular' 
        ? reports.filter(r => !r.distributionRequestId && !r.isDeleted)
        : activeMainTab === 'distribution'
        ? reports.filter(r => r.distributionRequestId && !r.isDeleted)
        : reports.filter(r => r.isDeleted);
    
    return {
        all: base.filter(r => !r.isArchived),
        request: base.filter(r => !r.dateOfPlanting && !r.isArchived),
        planted: base.filter(r => r.dateOfPlanting && !r.harvestArea && !r.isArchived),
        completed: base.filter(r => r.harvestArea && !r.isArchived),
        archived: base.filter(r => r.isArchived)
    };
}, [reports, activeMainTab]);
```

### Pagination Pattern (RequestsTable.jsx)
```javascript
const [currentPage, setCurrentPage] = React.useState(1);
const [itemsPerPage, setItemsPerPage] = React.useState(10);

const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const paginatedRequests = filteredRequests.slice(startIndex, endIndex);
```

**Use same pattern for PlantingReport tables.**

---

## Summary

This document captures all requirements, notes, and design decisions for the PlantingReport feature redesign. Key takeaways:

1. **Three states, not draft/submitted** - Request → Planted → Completed → Archive
2. **Soft delete with 30-day recovery**
3. **Separate tables for distribution vs regular reports**
4. **Remove notification features**
5. **Improve configuration/reference management**
6. **Follow Distribution patterns for component structure**
7. **Extensive validation and state-based UI**

All recommendations have been reviewed and approved/rejected/modified. Proceed with Analysis.md update and subsequent documentation creation based on this prompt.

---

**Document Status:** Final Requirements  
**Next Steps:** Update Analysis.md, create remaining documentation files  
**Review Required:** User confirmation before implementation begins
