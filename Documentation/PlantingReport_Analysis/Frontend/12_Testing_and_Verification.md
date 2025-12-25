# File 12: Testing and Verification

**Purpose:** End-to-end testing, responsive testing, and accessibility verification  
**Prerequisites:** Files 01-11 completed  
**Estimated Time:** 4-5 hours  
**Target Directory:** `/client/tests/` (if applicable)

---

## 📋 STEPS OVERVIEW

Total Steps: **12**

1. [Setup Testing Environment](#step-1-setup-testing-environment)
2. [Component Unit Tests](#step-2-component-unit-tests)
3. [Custom Hooks Tests](#step-3-custom-hooks-tests)
4. [Integration Test: Create Report Workflow](#step-4-integration-test-create-report-workflow)
5. [Integration Test: State Transition Workflow](#step-5-integration-test-state-transition-workflow)
6. [Integration Test: Filter and Search](#step-6-integration-test-filter-and-search)
7. [Responsive Design Testing](#step-7-responsive-design-testing)
8. [Cross-Browser Testing](#step-8-cross-browser-testing)
9. [Accessibility Testing](#step-9-accessibility-testing)
10. [Performance Testing](#step-10-performance-testing)
11. [E2E Testing (Optional)](#step-11-e2e-testing-optional)
12. [Final Verification](#step-12-final-verification)

---

## STEP 1: Setup Testing Environment

Install testing dependencies if not already installed.

```powershell
cd client

# React Testing Library
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# MSW for API mocking
npm install --save-dev msw

# Vitest (if not using Jest)
npm install --save-dev vitest @vitest/ui
```

**Create test config:**

**File:** `/client/vitest.config.js` (or jest.config.js)

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    globals: true
  }
});
```

**File:** `/client/tests/setup.js`

```javascript
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during tests
afterEach(() => server.resetHandlers());

// Clean up after tests are finished
afterAll(() => server.close());
```

### Progress

- [ ] Testing libraries installed
- [ ] Vitest/Jest configured
- [ ] Setup file created
- [ ] MSW server configured
- [ ] No installation errors

---

## STEP 2: Component Unit Tests

Create unit tests for common components.

**File:** `/client/tests/components/StatisticsCards.test.jsx`

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StatisticsCards from '../../src/Admin/PlantingReports/components/Statistics/StatisticsCards';

// Mock data
const mockStats = {
  total: 150,
  byState: {
    request: 45,
    planted: 60,
    completed: 45
  },
  archived: 10,
  deleted: 5,
  totalArea: 1250
};

// Mock query hook
vi.mock('../../src/Admin/PlantingReports/hooks/usePlantingReportQueries', () => ({
  useReportSummary: () => ({
    data: mockStats,
    isLoading: false,
    error: null
  })
}));

describe('StatisticsCards', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <StatisticsCards />
      </QueryClientProvider>
    );
  
  it('renders all statistic cards', () => {
    renderComponent();
    
    expect(screen.getByText('Total Reports')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Request Report')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Planted')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });
  
  it('displays total area with unit', () => {
    renderComponent();
    
    expect(screen.getByText('Total Area Planted')).toBeInTheDocument();
    expect(screen.getByText('1,250')).toBeInTheDocument();
    expect(screen.getByText('ha')).toBeInTheDocument();
  });
});
```

**File:** `/client/tests/components/FilterPanel.test.jsx`

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from '../../src/Admin/PlantingReports/components/Filters/FilterPanel';

describe('FilterPanel', () => {
  const mockFilters = {
    typeOfCrop: '',
    varietyId: '',
    croppingSeasonId: '',
    dateRange: { start: null, end: null }
  };
  
  const mockOnSearchChange = vi.fn();
  const mockOnFiltersChange = vi.fn();
  
  it('renders search input', () => {
    render(
      <FilterPanel
        search=""
        filters={mockFilters}
        onSearchChange={mockOnSearchChange}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/search by farmer name/i);
    expect(searchInput).toBeInTheDocument();
  });
  
  it('calls onSearchChange when typing in search', () => {
    render(
      <FilterPanel
        search=""
        filters={mockFilters}
        onSearchChange={mockOnSearchChange}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/search by farmer name/i);
    fireEvent.change(searchInput, { target: { value: 'John Doe' } });
    
    expect(mockOnSearchChange).toHaveBeenCalledWith('John Doe');
  });
  
  it('resets all filters when reset button clicked', () => {
    render(
      <FilterPanel
        search="test"
        filters={{ ...mockFilters, typeOfCrop: 'Rice' }}
        onSearchChange={mockOnSearchChange}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(mockOnSearchChange).toHaveBeenCalledWith('');
    expect(mockOnFiltersChange).toHaveBeenCalledWith(mockFilters);
  });
});
```

### Progress

- [ ] StatisticsCards test created
- [ ] FilterPanel test created
- [ ] PaginationControls test created
- [ ] All tests passing
- [ ] Coverage > 80%

---

## STEP 3: Custom Hooks Tests

Test custom hooks using React Testing Library's renderHook.

**File:** `/client/tests/hooks/usePagination.test.js`

```javascript
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../../src/Admin/PlantingReports/hooks/usePagination';

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => usePagination());
    
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(25);
  });
  
  it('calculates pagination info correctly', () => {
    const { result } = renderHook(() => usePagination());
    
    const info = result.current.getPaginationInfo(100);
    
    expect(info.totalPages).toBe(4);
    expect(info.startItem).toBe(1);
    expect(info.endItem).toBe(25);
    expect(info.hasNextPage).toBe(true);
    expect(info.hasPreviousPage).toBe(false);
  });
  
  it('changes page correctly', () => {
    const { result } = renderHook(() => usePagination());
    
    act(() => {
      result.current.goToPage(2);
    });
    
    expect(result.current.page).toBe(2);
    
    const info = result.current.getPaginationInfo(100);
    expect(info.startItem).toBe(26);
    expect(info.endItem).toBe(50);
  });
  
  it('changes limit correctly', () => {
    const { result } = renderHook(() => usePagination());
    
    act(() => {
      result.current.changeLimit(50);
    });
    
    expect(result.current.limit).toBe(50);
    expect(result.current.page).toBe(1); // Should reset to page 1
  });
});
```

### Progress

- [ ] usePagination test created
- [ ] useReportForm test created
- [ ] useStateTransitions test created
- [ ] useDebounce test created
- [ ] All hook tests passing

---

## STEP 4: Integration Test: Create Report Workflow

Test full workflow from create button to saved report.

**File:** `/client/tests/integration/createReport.test.jsx`

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PlantingReports from '../../src/Admin/PlantingReports/PlantingReports';

describe('Create Report Workflow', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  const renderApp = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <PlantingReports />
      </QueryClientProvider>
    );
  
  it('opens modal when FAB clicked', async () => {
    renderApp();
    
    const fab = screen.getByLabelText('create report');
    fireEvent.click(fab);
    
    await waitFor(() => {
      expect(screen.getByText(/create report/i)).toBeInTheDocument();
    });
  });
  
  it('completes full create workflow', async () => {
    const user = userEvent.setup();
    renderApp();
    
    // 1. Click FAB
    const fab = screen.getByLabelText('create report');
    await user.click(fab);
    
    // 2. Fill farmer info
    const farmerInput = screen.getByLabelText(/select farmer/i);
    await user.type(farmerInput, 'John Doe');
    await user.click(screen.getByText('John Doe - 123456')); // Assuming autocomplete option
    
    // 3. Fill seeding details
    const varietySelect = screen.getByLabelText(/variety/i);
    await user.click(varietySelect);
    await user.click(screen.getByText('NSIC Rc222'));
    
    const areaInput = screen.getByLabelText(/area planted/i);
    await user.type(areaInput, '5.5');
    
    // 4. Submit
    const createButton = screen.getByText(/create/i);
    await user.click(createButton);
    
    // 5. Verify success
    await waitFor(() => {
      expect(screen.getByText(/successfully created/i)).toBeInTheDocument();
    });
  });
});
```

### Progress

- [ ] Create report workflow test created
- [ ] Test covers full user flow
- [ ] Mocks API responses
- [ ] Verifies success feedback
- [ ] Test passing

---

## STEP 5: Integration Test: State Transition Workflow

**File:** `/client/tests/integration/stateTransition.test.jsx`

```javascript
describe('State Transition Workflow', () => {
  it('transitions from Request to Planted to Completed', async () => {
    const user = userEvent.setup();
    renderApp();
    
    // 1. Open report in Request state
    const viewButton = screen.getAllByLabelText('View')[0];
    await user.click(viewButton);
    
    // 2. Click "Advance to Planted" button
    const advanceButton = screen.getByText(/advance to planted/i);
    await user.click(advanceButton);
    
    // 3. Confirm transition
    const confirmButton = screen.getByText(/confirm transition/i);
    await user.click(confirmButton);
    
    // 4. Verify state changed
    await waitFor(() => {
      expect(screen.getByText('Planted')).toBeInTheDocument();
    });
    
    // 5. Repeat for Planted → Completed
    const advanceButton2 = screen.getByText(/advance to completed/i);
    await user.click(advanceButton2);
    
    const confirmButton2 = screen.getByText(/confirm transition/i);
    await user.click(confirmButton2);
    
    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });
});
```

### Progress

- [ ] State transition test created
- [ ] Tests all transitions (Request → Planted → Completed)
- [ ] Tests validation (required fields)
- [ ] Tests error handling
- [ ] Test passing

---

## STEP 6: Integration Test: Filter and Search

**File:** `/client/tests/integration/filterAndSearch.test.jsx`

```javascript
describe('Filter and Search', () => {
  it('filters reports by crop type', async () => {
    const user = userEvent.setup();
    renderApp();
    
    // 1. Select crop type filter
    const cropTypeSelect = screen.getByLabelText(/crop type/i);
    await user.click(cropTypeSelect);
    await user.click(screen.getByText('Rice'));
    
    // 2. Verify table updates
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1); // Header + data rows
      // Verify all rows show Rice
    });
  });
  
  it('searches reports by farmer name', async () => {
    const user = userEvent.setup();
    renderApp();
    
    // 1. Type in search box
    const searchInput = screen.getByPlaceholderText(/search by farmer name/i);
    await user.type(searchInput, 'John Doe');
    
    // 2. Wait for debounce (500ms)
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    }, { timeout: 1000 });
  });
});
```

### Progress

- [ ] Filter test created
- [ ] Search test created
- [ ] Tests debounce
- [ ] Tests filter combinations
- [ ] Tests passing

---

## STEP 7: Responsive Design Testing

Manual testing checklist for responsive design.

### Mobile (320px - 767px)

```powershell
# Open browser DevTools (F12)
# Device Toolbar (Ctrl+Shift+M)
# Select "iPhone SE" (375x667)

# Test Dashboard:
# - [ ] Statistics cards stack vertically (1 column)
# - [ ] Main tabs full width
# - [ ] State sub-tabs scrollable
# - [ ] Filter panel collapsible
# - [ ] Table shows card view
# - [ ] FAB positioned correctly (16px from edge)

# Test Modal:
# - [ ] Modal fullscreen
# - [ ] Form fields stack vertically
# - [ ] Touch targets >= 44px
# - [ ] Buttons full width

# Test Reference Panel:
# - [ ] Opens as bottom drawer
# - [ ] Tabs full width
# - [ ] Table shows card view
```

### Tablet (768px - 1023px)

```powershell
# Select "iPad Mini" (768x1024)

# Test Dashboard:
# - [ ] Statistics cards 2 columns
# - [ ] Main tabs standard width
# - [ ] State sub-tabs scrollable
# - [ ] Filter panel expanded
# - [ ] Table shows full table
# - [ ] FAB positioned correctly (24px from edge)

# Test Modal:
# - [ ] Modal 600px width, centered
# - [ ] Form fields 2-column grid
# - [ ] State workflow indicator visible

# Test Reference Panel:
# - [ ] Shows as inline accordion
# - [ ] Tabs standard width
# - [ ] Table shows full table
```

### Desktop (1024px+)

```powershell
# Select "Desktop 1920x1080"

# Test Dashboard:
# - [ ] Statistics cards 4 columns
# - [ ] All tabs visible
# - [ ] Filter panel expanded
# - [ ] Table shows all columns
# - [ ] Jump to page visible

# Test Modal:
# - [ ] Modal max-width 960px
# - [ ] Form fields 2-column grid
# - [ ] State workflow indicator full width

# Test Reference Panel:
# - [ ] Shows as inline accordion
# - [ ] All columns visible
# - [ ] Switch toggles visible
```

### Progress

- [ ] Mobile layout tested (320px, 375px, 414px)
- [ ] Tablet layout tested (768px, 834px)
- [ ] Desktop layout tested (1024px, 1440px, 1920px)
- [ ] No horizontal scroll on any breakpoint
- [ ] All interactive elements accessible
- [ ] Text readable on all devices

---

## STEP 8: Cross-Browser Testing

### Browsers to Test

**Chrome (Latest)**
- [ ] All features working
- [ ] No console errors
- [ ] Responsive design correct

**Firefox (Latest)**
- [ ] All features working
- [ ] No console errors
- [ ] Responsive design correct

**Safari (Latest - macOS/iOS)**
- [ ] All features working
- [ ] Date picker working
- [ ] Touch interactions working (iOS)

**Edge (Latest)**
- [ ] All features working
- [ ] No console errors
- [ ] Responsive design correct

### Progress

- [ ] Chrome tested
- [ ] Firefox tested
- [ ] Safari tested (if available)
- [ ] Edge tested
- [ ] All browsers pass

---

## STEP 9: Accessibility Testing

### WAVE Tool Scan

```powershell
# 1. Install WAVE extension
# Chrome: https://chrome.google.com/webstore/detail/wave-evaluation-tool/

# 2. Navigate to PlantingReports page
# 3. Click WAVE icon
# 4. Review results:
# - [ ] 0 Errors
# - [ ] 0 Contrast errors
# - [ ] All images have alt text
# - [ ] All form inputs have labels
```

### Keyboard Navigation

```powershell
# Test keyboard-only navigation:
# 1. Tab through all interactive elements
# - [ ] Focus indicators visible
# - [ ] Tab order logical
# - [ ] All buttons reachable

# 2. Test specific interactions:
# - [ ] Enter opens modals
# - [ ] Escape closes modals
# - [ ] Arrow keys navigate dropdowns
# - [ ] Space toggles checkboxes/switches

# 3. Test table navigation:
# - [ ] Tab reaches all action buttons
# - [ ] Enter activates buttons
```

### Screen Reader Test (Optional)

```powershell
# Windows: NVDA (free)
# macOS: VoiceOver (built-in)

# Test:
# - [ ] Page title announced
# - [ ] Headings announced
# - [ ] Form labels announced
# - [ ] Button labels announced
# - [ ] Table headers announced
# - [ ] Error messages announced
```

### Accessibility Checklist

- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] All buttons have accessible names
- [ ] Focus indicators visible
- [ ] Color contrast >= 4.5:1
- [ ] Keyboard navigation works
- [ ] ARIA labels where needed
- [ ] No duplicate IDs
- [ ] Semantic HTML used

### Progress

- [ ] WAVE scan passed
- [ ] Keyboard navigation tested
- [ ] Screen reader test (optional)
- [ ] All WCAG 2.1 AA criteria met

---

## STEP 10: Performance Testing

### Lighthouse Audit

```powershell
# 1. Open Chrome DevTools
# 2. Go to Lighthouse tab
# 3. Select "Desktop"
# 4. Click "Generate report"

# Target Scores:
# - [ ] Performance >= 90
# - [ ] Accessibility >= 90
# - [ ] Best Practices >= 90
# - [ ] SEO >= 100

# 5. Repeat for "Mobile"
```

### Bundle Size Analysis

```powershell
cd client

# Install analyzer
npm install --save-dev rollup-plugin-visualizer

# Build with analyzer
npm run build

# Check bundle size:
# - [ ] Total bundle < 500KB gzipped
# - [ ] No duplicate dependencies
# - [ ] Code splitting working
```

### Performance Metrics

- [ ] Time to Interactive (TTI) < 3s
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Total Blocking Time (TBT) < 300ms

### Progress

- [ ] Lighthouse Desktop score >= 90
- [ ] Lighthouse Mobile score >= 90
- [ ] Bundle size < 500KB
- [ ] All metrics within targets

---

## STEP 11: E2E Testing (Optional)

Optional E2E tests with Cypress or Playwright.

**File:** `/e2e/plantingReports.spec.js` (Cypress example)

```javascript
describe('Planting Reports E2E', () => {
  beforeEach(() => {
    cy.visit('/admin/planting-reports');
  });
  
  it('creates a new report', () => {
    // Click FAB
    cy.get('[aria-label="create report"]').click();
    
    // Fill form
    cy.get('[aria-label="Select Farmer"]').type('John Doe');
    cy.contains('John Doe - 123456').click();
    
    cy.get('[aria-label="Variety"]').click();
    cy.contains('NSIC Rc222').click();
    
    cy.get('[aria-label="Area Planted"]').type('5.5');
    
    // Submit
    cy.contains('Create').click();
    
    // Verify success
    cy.contains('successfully created').should('be.visible');
  });
  
  it('transitions report through states', () => {
    // ... E2E test for state transitions
  });
});
```

### Progress

- [ ] E2E framework setup (optional)
- [ ] Create report test
- [ ] State transition test
- [ ] Filter/Search test
- [ ] All E2E tests passing

---

## STEP 12: Final Verification

### Complete Feature Checklist

**Dashboard:**
- [ ] Statistics cards display correctly
- [ ] Main tabs working (All/Distribution/Deleted)
- [ ] State sub-tabs working
- [ ] Filter panel functional
- [ ] Global search working
- [ ] Tables displaying data
- [ ] Pagination working
- [ ] FAB opens create modal

**Create Report:**
- [ ] Modal opens
- [ ] Farmer selector works
- [ ] All fields editable
- [ ] Validation working
- [ ] Save creates report
- [ ] Success notification shown

**Edit Report:**
- [ ] Modal opens with data
- [ ] Farmer info read-only
- [ ] All other fields editable
- [ ] Validation working
- [ ] Save updates report

**View Report:**
- [ ] Modal opens with data
- [ ] All fields read-only
- [ ] State workflow visible
- [ ] Close button works

**State Transitions:**
- [ ] Request → Planted working
- [ ] Planted → Completed working
- [ ] Validation enforced
- [ ] Confirmation dialog shown
- [ ] Success notification shown

**Bulk Actions:**
- [ ] Select all working
- [ ] Select individual rows
- [ ] Bulk archive working
- [ ] Bulk delete working
- [ ] Confirmation shown

**Delete & Restore:**
- [ ] Soft delete working
- [ ] Shows in Deleted tab
- [ ] Restore button works
- [ ] Permanent delete after 30 days

**Reference Management:**
- [ ] Panel opens
- [ ] Varieties CRUD working
- [ ] Seasons CRUD working
- [ ] Activation toggle working
- [ ] View reports working

**Responsive Design:**
- [ ] Mobile layout correct
- [ ] Tablet layout correct
- [ ] Desktop layout correct
- [ ] No horizontal scroll

**Accessibility:**
- [ ] Keyboard navigation working
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader compatible

**Performance:**
- [ ] Lighthouse score >= 90
- [ ] Bundle size < 500KB
- [ ] Fast load times

### Exit Criteria

Before considering complete:

- [x] All 12 steps completed
- [x] All checkboxes marked
- [x] All unit tests passing
- [x] All integration tests passing
- [x] Responsive design verified
- [x] Cross-browser tested
- [x] Accessibility verified
- [x] Performance targets met
- [x] No console errors
- [x] No console warnings

---

## 🎯 COMPLETION

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

**Completion Date:** _______________

**Notes:**
- 
- 

**Next Steps:** Deploy to production!

---

**Estimated Time:** 4-5 hours  
**Actual Time:** _______________
