# PlantingReport Feature - Implementation Plan

**Part of:** [Analysis_Overview.md](./Analysis_Overview.md)  
**Last Updated:** December 24, 2025

---

## Overview

**Total Estimated Effort:** 6-8 weeks (1 developer)  
**Team Size:** 1-2 developers  
**Phases:** 4 major phases + 1 testing phase

---

## Phase 1: Foundation & Core Restructuring (Week 1-2)

**Goal:** Align database and backend with 3-state business process

### Tasks

#### 1.1 Database Migration (3-4 days)

**Priority:** 🔴 CRITICAL - BLOCKING

- [ ] Create Prisma migration file
  ```bash
  cd server
  npx prisma migrate dev --name add_state_and_soft_delete --create-only
  ```
- [ ] Write migration SQL:
  - Add `state` enum (PlantingReportState)
  - Add `isDeleted`, `deletedAt`, `deletedBy` fields
  - Add `archivedAt`, `archivedBy` fields
  - Add `distributedQuantity` field
  - Add `stateHistory` JSON field
  - Make `plantingMethod` optional
  - Remove `status` field and enum
  - Create new indexes
- [ ] Write data migration logic:
  ```sql
  UPDATE "PlantingReport"
  SET "state" = CASE
    WHEN "dateOfPlanting" IS NULL THEN 'Request_Report'
    WHEN "harvestArea" IS NULL THEN 'Planted'
    ELSE 'Completed'
  END;
  ```
- [ ] Add database constraints:
  - Check harvest area ≤ planted area
  - Check positive values
  - Check deleted/archived timestamps
  - Check state field requirements
- [ ] Write rollback plan
- [ ] Test migration on dev database
- [ ] Apply migration:
  ```bash
  npx prisma migrate dev
  npx prisma generate
  ```
- [ ] Verify migration with script:
  ```bash
  node scripts/verify-migration.js
  ```

**Dependencies:** None  
**Blockers:** All other tasks depend on this

---

#### 1.2 Backend State Transition Logic (4-5 days)

**Priority:** 🔴 CRITICAL

- [ ] Create validation schemas (`server/validation/stateTransitionRules.js`):
  - `toPlantedSchema` (Joi)
  - `toCompletedSchema` (Joi)
  - `farmerInfoSchema`
  - `seedingDetailsSchema`
- [ ] Update `plantingReportController.js`:
  - [ ] Replace status-based logic with state-based
  - [ ] Add `transitionToPlanted(req, res)` endpoint
  - [ ] Add `transitionToCompleted(req, res)` endpoint
  - [ ] Update `archiveReport()` to validate state
  - [ ] Add `unarchiveReport(req, res)` endpoint
  - [ ] Add `softDeleteReport(req, res)` endpoint
  - [ ] Add `restoreReport(req, res)` endpoint
  - [ ] Update `getAllPlantingReports()` with new filters:
    - `state` filter
    - `isDeleted` filter
    - `distributionLinked` filter
- [ ] Update routes (`server/Router/API/PlantingReport/index.js`):
  ```javascript
  router.patch('/reports/:id/transition/planted', transitionToPlanted);
  router.patch('/reports/:id/transition/completed', transitionToCompleted);
  router.patch('/reports/:id/archive', archiveReport);
  router.patch('/reports/:id/unarchive', unarchiveReport);
  router.delete('/reports/:id/soft', softDeleteReport);
  router.patch('/reports/:id/restore', restoreReport);
  ```
- [ ] Add stateHistory tracking in all transitions
- [ ] Update distribution integration to create reports in State 1
- [ ] Update auto-calculations (yield, expected harvest)

**Dependencies:** 1.1 (Database Migration)  
**Testing:** Postman collection for all state transitions

---

#### 1.3 Pagination Implementation (2-3 days)

**Priority:** 🟡 HIGH

**Backend:**
- [ ] Update `getAllPlantingReports()`:
  - Default `limit` to 25 (not 1000)
  - Add `page` validation (min 1)
  - Add `limit` validation (min 10, max 100)
  - Return pagination metadata:
    ```javascript
    {
      data: reports[],
      pagination: {
        page: 1,
        limit: 25,
        total: 150,
        totalPages: 6,
        hasNext: true,
        hasPrev: false
      }
    }
    ```
- [ ] Optimize queries with field selection:
  ```javascript
  // Table view - minimal fields
  select: {
    id: true,
    farmerName: true,
    location: true,
    state: true,
    isArchived: true,
    variety: { select: { name: true } },
    // ...
  }
  ```

**Frontend:**
- [ ] Create `usePagination` hook
- [ ] Update `PlantingReports.jsx`:
  - Add pagination state
  - Add `TablePagination` component
  - Handle page change
  - Handle rows per page change
- [ ] Persist pagination in URL params (optional)

**Dependencies:** 1.2 (Backend updates)  
**Testing:** Load 1000+ test reports, verify performance

---

#### 1.4 Soft Delete Implementation (2 days)

**Priority:** 🟡 HIGH

**Backend:**
- [ ] Implement soft delete endpoint (from 1.2)
- [ ] Implement restore endpoint (from 1.2)
- [ ] Create cleanup job:
  ```javascript
  // server/scripts/cleanup-deleted-reports.js
  import cron from 'node-cron';
  
  cron.schedule('0 2 * * *', async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const result = await prisma.plantingReport.deleteMany({
      where: {
        isDeleted: true,
        deletedAt: { lt: thirtyDaysAgo }
      }
    });
    
    console.log(`Cleaned up ${result.count} expired reports`);
  });
  ```
- [ ] Add cleanup job to server startup
- [ ] Update all queries to exclude deleted by default:
  ```javascript
  where: { isDeleted: false, ... }
  ```

**Frontend:**
- [ ] Create `DeletedReportsTable.jsx` component
- [ ] Add "Deleted" tab to main view
- [ ] Implement restore confirmation modal
- [ ] Implement permanent delete confirmation (admin only)
- [ ] Show countdown: "X days until permanent delete"

**Dependencies:** 1.2 (Backend endpoints)  
**Testing:** Delete report, wait 30 days (or adjust time for testing), verify auto-cleanup

---

### Phase 1 Deliverables

✅ **Database:**
- New schema with `state` enum
- Soft delete fields
- All constraints and indexes

✅ **Backend:**
- State transition endpoints
- Validation schemas
- Pagination support
- Soft delete logic
- Cleanup job

✅ **Frontend:**
- Deleted reports tab
- Pagination controls
- Restore functionality

**Exit Criteria:**
- All migrations applied successfully
- State transitions working via API
- Pagination reduces load time to < 2 seconds
- Soft delete + restore working
- Cleanup job tested

---

## Phase 2: Component Refactoring & UI (Week 3-4)

**Goal:** Modular, maintainable components with state-based rendering

### Tasks

#### 2.1 Split ReportModal (5-6 days)

**Priority:** 🔴 CRITICAL

- [ ] Create modal structure:
  ```
  ReportModal/
  ├── index.jsx (orchestrator)
  ├── StateWorkflowIndicator.jsx
  ├── FarmerInfoSection.jsx
  ├── SeedingDetailsSection.jsx
  ├── PlantingDetailsSection.jsx
  ├── HarvestingSection.jsx
  └── DistributionMetadata.jsx
  ```
- [ ] Create hooks:
  - [ ] `useReportForm.js` - Form state with React Hook Form
  - [ ] `useStateTransitions.js` - State transition logic
  - [ ] `useAutoCalculations.js` - Yield and harvest calculations
- [ ] Implement state-based rendering:
  - State 1: Show Farmer + Seeding only
  - State 2: Enable Planting section
  - State 3: Enable Harvesting section
- [ ] Add StateWorkflowIndicator (stepper UI)
- [ ] Integrate validation (Joi + React Hook Form)
- [ ] Add helper alerts for state transitions
- [ ] Test all states thoroughly

**Dependencies:** 1.1, 1.2 (Backend ready)  
**Testing:** Create/edit reports in all states, verify field visibility

---

#### 2.2 Separate Table Components (3-4 days)

**Priority:** 🟡 HIGH

- [ ] Create `RegularReportsTable.jsx`:
  - Columns: Farmer, Location, RSBSA, Crop, Variety, Season, Area, Planting Date, State, Actions
  - State-based row styling
  - Sort by all columns
- [ ] Create `DistributionReportsTable.jsx`:
  - Additional columns: Distribution ID, Distributed Quantity
  - "View Distribution" button
  - Link to distribution request
- [ ] Update `DeletedReportsTable.jsx` (from Phase 1):
  - Add "Days until permanent delete" chip
  - Color-code urgency (< 7 days = red)
- [ ] Implement tab structure:
  ```javascript
  Main Tabs: [Regular | Distribution | Deleted]
  State Sub-tabs (if not Deleted): [All | Request | Planted | Completed | Archived]
  ```
- [ ] Add state badge with colors:
  - Request_Report: Yellow
  - Planted: Blue
  - Completed: Green
  - Archived: Gray

**Dependencies:** 2.1 (Modal ready for view/edit)  
**Testing:** Navigate all tabs, verify counts, check filters

---

#### 2.3 Reference Management Panel (2-3 days)

**Priority:** 🟠 MEDIUM

- [ ] Create `ReferenceManagementPanel/` components:
  - `index.jsx` - Collapsible panel
  - `VarietiesTab.jsx`
  - `SeasonsTab.jsx`
  - `ViewReportsModal.jsx` - NEW feature
- [ ] Integrate into main page (bottom of PlantingReports.jsx)
- [ ] Make collapsible with expand/collapse animation
- [ ] Add "View Reports Using This" button:
  - Click variety → Show modal with all reports using it
  - Filter by state, archived
  - Sort by date
  - Show counts: X active, Y archived
- [ ] Improve activation toggle:
  - Replace unclear button with `<Switch>` component
  - Show active/inactive chip
  - Tooltip: "Toggle activation status"
- [ ] Enhance cascade delete:
  - Show affected reports count
  - Group by state
  - Warning if any State 1 or 2 reports

**Dependencies:** 2.2 (Tables ready)  
**Testing:** Toggle variety, check reports, delete variety with warnings

---

#### 2.4 Filter & Search Components (2 days)

**Priority:** 🟠 MEDIUM

- [ ] Create `FilterPanel.jsx`:
  - Crop Type dropdown
  - Variety dropdown (filtered by crop type)
  - Season dropdown
  - Date range picker
  - "Clear All" button
  - Apply filters on change (debounced)
- [ ] Create `GlobalSearch.jsx`:
  - Search input with icon
  - Debounced search (300ms)
  - Search fields: farmerName, location, rsbsa
  - Exclude archived toggle
  - Search across all tabs
- [ ] Implement search highlighting in table rows
- [ ] Add "X results found" message

**Dependencies:** 2.2 (Tables)  
**Testing:** Search across states, apply filters, verify counts

---

### Phase 2 Deliverables

✅ **Components:**
- Modular ReportModal (< 200 lines per file)
- 3 separate table components
- Reference Management inline panel
- Filter and search components

✅ **UX:**
- State-based UI rendering
- Visual workflow indicator
- Improved activation toggles
- "View Reports Using This" feature

**Exit Criteria:**
- All components < 250 lines
- State transitions work in modal
- Tables show correct data per tab
- Reference panel fully functional
- Search and filters work correctly

---

## Phase 3: Advanced Features & Polish (Week 5-6)

**Goal:** Complete feature set with all quality-of-life improvements

### Tasks

#### 3.1 Bulk Operations (3-4 days)

**Priority:** 🟠 MEDIUM

- [ ] Backend endpoints:
  ```javascript
  POST /api/planting-reports/bulk/archive
  POST /api/planting-reports/bulk/delete
  POST /api/planting-reports/bulk/export
  ```
- [ ] Frontend multi-select:
  - Checkbox in table header (select all)
  - Checkbox per row
  - Selected count badge
  - Bulk action buttons
- [ ] Bulk archive:
  - Only Completed reports
  - Confirmation modal with list
  - Progress indicator
- [ ] Bulk delete:
  - Soft delete selected
  - Confirmation with count
  - Success toast
- [ ] Excel export:
  - Sheet 1: Summary (all selected)
  - Sheet 2+: Per-variety sheets
  - Auto-calculations included
  - Download as .xlsx
  - Use `exceljs` library

**Dependencies:** Phase 2 complete  
**Testing:** Select 50+ reports, bulk archive, export to Excel

---

#### 3.2 Real-Time Updates (Tanstack Query) (2-3 days)

**Priority:** 🟠 MEDIUM

- [ ] Install Tanstack Query:
  ```bash
  npm install @tanstack/react-query
  ```
- [ ] Create query hooks:
  - `usePlantingReportQueries.js`:
    ```javascript
    export const usePlantingReports = (filters) => {
      return useQuery({
        queryKey: ['reports', filters],
        queryFn: () => fetchReports(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchOnWindowFocus: true
      });
    };
    ```
- [ ] Implement optimistic updates:
  - Create: Immediately add to list
  - Update: Immediately update in list
  - Delete: Immediately remove from list
  - Rollback on error
- [ ] Add mutation hooks:
  ```javascript
  const updateMutation = useMutation({
    mutationFn: updateReport,
    onMutate: async (newData) => {
      await queryClient.cancelQueries(['reports']);
      const previous = queryClient.getQueryData(['reports']);
      queryClient.setQueryData(['reports'], old => 
        old.map(r => r.id === newData.id ? { ...r, ...newData } : r)
      );
      return { previous };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['reports'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['reports']);
    }
  });
  ```
- [ ] Add manual refresh button
- [ ] Show loading/refetching states

**Dependencies:** Phase 2 complete  
**Testing:** Open 2 browsers, edit in one, verify update in other

---

#### 3.3 Distribution Bidirectional Linking (2 days)

**Priority:** 🟡 HIGH

**In Distribution View:**
- [ ] Add "Planting Report" column to distribution table
- [ ] Show report state badge (Request/Planted/Completed)
- [ ] Add "View Planting Report" link (if exists)
- [ ] Show "Create Planting Report" button (if not exists)

**In PlantingReport View:**
- [ ] Already done in Phase 2.1 (DistributionMetadata component)

**Synchronization:**
- [ ] When report archived → Update distribution status
- [ ] When distribution deleted → Unlink from report (don't delete report)
- [ ] When report restored → Update distribution status

**Dependencies:** Distribution feature access  
**Testing:** Navigate both directions, verify sync

---

#### 3.4 Analytics Dashboard (3 days)

**Priority:** 🟢 NICE TO HAVE

- [ ] Create `AnalyticsDashboard.jsx` component
- [ ] Charts:
  - [ ] Total area planted by crop type (Pie chart)
  - [ ] Planting timeline (Gantt chart)
  - [ ] Yield comparison by variety (Bar chart)
  - [ ] Average yield by season (Line chart)
- [ ] Use Chart.js or Recharts
- [ ] Add date range filter for analytics
- [ ] Add export analytics as PNG
- [ ] Add to main page as collapsible section

**Dependencies:** Phase 2 complete  
**Testing:** Generate with real data, verify calculations

---

### Phase 3 Deliverables

✅ **Features:**
- Bulk operations (archive, delete, export)
- Real-time updates (Tanstack Query)
- Distribution bidirectional linking
- Analytics dashboard (optional)

✅ **Performance:**
- Optimistic updates working
- Excel export with multi-sheets
- Refetch on window focus

**Exit Criteria:**
- Bulk operations handle 100+ reports
- Excel export works correctly
- Real-time updates no lag
- Analytics charts accurate

---

## Phase 4: Testing & Optimization (Week 7-8)

**Goal:** Production-ready, tested, optimized

### Tasks

#### 4.1 Unit Testing (3-4 days)

- [ ] Backend tests (Jest):
  - [ ] State transition validation
  - [ ] Auto-calculations
  - [ ] Soft delete logic
  - [ ] Cleanup job
  - [ ] Pagination
  - Target: 80% coverage
- [ ] Frontend tests (Vitest + React Testing Library):
  - [ ] Component rendering
  - [ ] Form validation
  - [ ] State transitions
  - [ ] Bulk operations
  - Target: 70% coverage
- [ ] Integration tests:
  - [ ] Full workflow: Create → Plant → Harvest → Archive
  - [ ] Distribution integration
  - [ ] Soft delete + restore

**Dependencies:** All features complete  
**Tools:** Jest, Vitest, React Testing Library, Supertest

---

#### 4.2 E2E Testing (2-3 days)

- [ ] Playwright tests:
  - [ ] User flow: Login → Create Report → Edit → Archive
  - [ ] Admin flow: Manage varieties → Create report with new variety
  - [ ] Search and filter scenarios
  - [ ] Bulk operations
  - [ ] Error handling (network errors, validation)
- [ ] Test data setup script
- [ ] Test database seeding

**Dependencies:** 4.1 complete  
**Tools:** Playwright

---

#### 4.3 Performance Optimization (2 days)

- [ ] Backend:
  - [ ] Query optimization (explain analyze)
  - [ ] Add missing indexes
  - [ ] Field selection optimization
  - [ ] Caching strategy for varieties/seasons
- [ ] Frontend:
  - [ ] Code splitting (lazy load modals)
  - [ ] Memoization (useMemo, React.memo)
  - [ ] Debounce expensive operations
  - [ ] Virtual scrolling (if needed)
- [ ] Load testing:
  - [ ] 1000 reports load time < 2s
  - [ ] State transition < 500ms
  - [ ] Search response < 300ms

**Dependencies:** 4.2 complete  
**Tools:** Lighthouse, React DevTools Profiler, k6 (load testing)

---

#### 4.4 Documentation (2 days)

- [ ] User manual updates:
  - [ ] 3-state system explanation
  - [ ] How to transition states
  - [ ] Soft delete and restore
  - [ ] Bulk operations
  - [ ] Analytics dashboard
- [ ] Developer documentation:
  - [ ] API endpoints
  - [ ] State transition flow
  - [ ] Validation rules
  - [ ] Database schema
- [ ] README updates
- [ ] Changelog

**Dependencies:** All features complete

---

### Phase 4 Deliverables

✅ **Testing:**
- Unit tests (80% backend, 70% frontend)
- E2E tests (critical paths)
- Load tests passing

✅ **Performance:**
- All metrics met
- Optimized queries
- Code splitting

✅ **Documentation:**
- User manual
- Developer docs
- API documentation

**Exit Criteria:**
- All tests passing
- No critical bugs
- Performance metrics met
- Documentation complete

---

## Deployment Plan

### Pre-Deployment Checklist

- [ ] All tests passing (unit, integration, e2e)
- [ ] Performance benchmarks met
- [ ] Database migration tested on staging
- [ ] Rollback plan ready
- [ ] Stakeholder approval
- [ ] User documentation ready

### Deployment Steps

1. **Database Migration:**
   ```bash
   # Backup production DB
   pg_dump farmersconnect > backup_$(date +%Y%m%d).sql
   
   # Apply migration
   cd server
   npx prisma migrate deploy
   npx prisma generate
   ```

2. **Backend Deployment:**
   ```bash
   # Build
   npm run build
   
   # Deploy
   pm2 restart server
   pm2 save
   ```

3. **Frontend Deployment:**
   ```bash
   cd client
   npm run build
   # Upload to CDN/server
   ```

4. **Verification:**
   - [ ] Check migration status
   - [ ] Test critical paths
   - [ ] Monitor error logs
   - [ ] Verify real-time updates

### Post-Deployment

- [ ] Monitor performance (first 24 hours)
- [ ] Check error rates
- [ ] User feedback collection
- [ ] Address urgent issues

---

## Risk Management

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Migration fails | Low | Critical | Test thoroughly on staging, have rollback ready |
| Performance degradation | Medium | High | Load test before deployment, optimize queries |
| User resistance to new workflow | Medium | Medium | User training, clear documentation, gradual rollout |
| Bugs in state transitions | Medium | High | Comprehensive testing, staged rollout |
| Data loss from cleanup job | Low | Critical | Test with adjusted timings, monitor logs |

---

## Success Metrics

### Performance
- ✅ Initial load < 2 seconds
- ✅ State transition < 500ms
- ✅ Search response < 300ms
- ✅ Bulk operation (100 reports) < 5 seconds

### Code Quality
- ✅ All components < 250 lines
- ✅ Test coverage > 75%
- ✅ No ESLint errors
- ✅ All TypeScript types defined

### User Experience
- ✅ Admin can find any report in < 3 clicks
- ✅ State transitions visually clear
- ✅ No data loss (soft delete recovery)
- ✅ Real-time updates working

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1** | 2 weeks | Database migration, state transitions, pagination, soft delete |
| **Phase 2** | 2 weeks | Modular components, tables, reference panel, filters |
| **Phase 3** | 2 weeks | Bulk operations, real-time updates, analytics |
| **Phase 4** | 2 weeks | Testing, optimization, documentation |
| **Total** | **8 weeks** | Production-ready feature |

---

## Resource Requirements

### Team
- 1-2 Full-stack developers
- 1 QA engineer (part-time in Phase 4)
- 1 Technical writer (part-time in Phase 4)

### Tools & Services
- Tanstack Query
- Joi (validation)
- exceljs (Excel export)
- Chart.js/Recharts (analytics)
- Playwright (E2E testing)
- Jest/Vitest (unit testing)

### Infrastructure
- Staging database
- Load testing environment
- Monitoring (New Relic, Sentry)

---

**Status:** Ready for Implementation  
**Next Step:** Get stakeholder approval and begin Phase 1
