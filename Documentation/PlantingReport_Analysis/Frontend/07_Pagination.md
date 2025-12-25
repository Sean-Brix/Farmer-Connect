# File 07: Pagination

**Purpose:** Create pagination controls component with responsive design  
**Prerequisites:** Files 01-06 completed  
**Estimated Time:** 2-3 hours  
**Target Directory:** `/client/src/Admin/PlantingReports/components/Pagination/`

---

## 📋 STEPS OVERVIEW

Total Steps: **8**

1. [Create PaginationControls Component](#step-1-create-paginationcontrols-component)
2. [Implement Page Size Selector](#step-2-implement-page-size-selector)
3. [Implement Page Navigation](#step-3-implement-page-navigation)
4. [Add Jump to Page Input](#step-4-add-jump-to-page-input)
5. [Add Total Count Display](#step-5-add-total-count-display)
6. [Implement Responsive Layout](#step-6-implement-responsive-layout)
7. [Add Accessibility Features](#step-7-add-accessibility-features)
8. [Verification](#step-8-verification)

---

## STEP 1: Create PaginationControls Component

**File:** `/client/src/Admin/PlantingReports/components/Pagination/PaginationControls.jsx`

```javascript
/**
 * PaginationControls Component
 * Pagination controls for table data
 */

import React, { useState } from 'react';
import {
  Box,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  TextField,
  IconButton,
  useTheme
} from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon
} from '@mui/icons-material';
import { useResponsive } from '../../hooks/useResponsive';
import { PAGINATION_CONFIG } from '../../constants/plantingReportConstants';

export function PaginationControls({ pagination, onPageChange, onLimitChange }) {
  const { isMobile, isTablet } = useResponsive();
  const theme = useTheme();
  
  const [jumpToPage, setJumpToPage] = useState('');
  
  // Destructure pagination info
  const {
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    startItem,
    endItem,
    hasNextPage,
    hasPreviousPage
  } = pagination;
  
  // Handle page size change
  const handlePageSizeChange = (event) => {
    onLimitChange(event.target.value);
  };
  
  // Handle page change
  const handlePageChange = (event, page) => {
    onPageChange(page);
  };
  
  // Handle jump to page
  const handleJumpToPage = (event) => {
    if (event.key === 'Enter') {
      const page = parseInt(jumpToPage, 10);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
        setJumpToPage('');
      }
    }
  };
  
  // Handle first/last page
  const handleFirstPage = () => onPageChange(1);
  const handleLastPage = () => onPageChange(totalPages);
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: 2,
        p: 2,
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      {/* Left Side: Page Size Selector */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto'
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="page-size-label">Rows per page</InputLabel>
          <Select
            labelId="page-size-label"
            value={pageSize}
            label="Rows per page"
            onChange={handlePageSizeChange}
          >
            {PAGINATION_CONFIG.pageSizeOptions.map(size => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Total Count */}
        <Typography variant="body2" color="text.secondary">
          Showing {startItem}-{endItem} of {totalItems.toLocaleString()}
        </Typography>
      </Box>
      
      {/* Center: Pagination */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}
      >
        {/* First Page Button (Desktop Only) */}
        {!isMobile && (
          <IconButton
            size="small"
            onClick={handleFirstPage}
            disabled={!hasPreviousPage}
            aria-label="First page"
          >
            <FirstPageIcon />
          </IconButton>
        )}
        
        {/* Material-UI Pagination */}
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size={isMobile ? 'small' : 'medium'}
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={1}
          showFirstButton={!isMobile}
          showLastButton={!isMobile}
        />
        
        {/* Last Page Button (Desktop Only) */}
        {!isMobile && (
          <IconButton
            size="small"
            onClick={handleLastPage}
            disabled={!hasNextPage}
            aria-label="Last page"
          >
            <LastPageIcon />
          </IconButton>
        )}
      </Box>
      
      {/* Right Side: Jump to Page (Desktop Only) */}
      {!isMobile && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Go to:
          </Typography>
          <TextField
            size="small"
            type="number"
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            onKeyPress={handleJumpToPage}
            placeholder="Page"
            inputProps={{
              min: 1,
              max: totalPages,
              'aria-label': 'Jump to page'
            }}
            sx={{ width: 80 }}
          />
        </Box>
      )}
    </Box>
  );
}

export default PaginationControls;
```

### Progress

- [ ] Component file created
- [ ] Pagination props destructured
- [ ] Page size selector implemented
- [ ] Page navigation implemented
- [ ] Jump to page input implemented
- [ ] Total count display implemented
- [ ] Responsive layout implemented
- [ ] No syntax errors

---

## STEP 2: Implement Page Size Selector

Page size selector already implemented in Step 1.

**Features:**
- Dropdown select with Material-UI
- Options from `PAGINATION_CONFIG.pageSizeOptions` (10, 25, 50, 100)
- Label "Rows per page"
- Small size for compact layout
- onChange triggers `onLimitChange` callback

**Add to constants:**

**File:** `/client/src/Admin/PlantingReports/constants/plantingReportConstants.js`

```javascript
export const PAGINATION_CONFIG = {
  defaultPageSize: 25,
  pageSizeOptions: [10, 25, 50, 100],
  maxPageSize: 100
};
```

### Progress

- [ ] Page size selector renders
- [ ] Options from config
- [ ] onChange callback works
- [ ] Label displayed
- [ ] Responsive sizing

---

## STEP 3: Implement Page Navigation

Page navigation already implemented in Step 1 using Material-UI Pagination component.

**Features:**
- Material-UI `<Pagination>` component
- First/Previous/Next/Last buttons
- Page number buttons
- Disabled states (first/last page)
- `siblingCount` responsive (0 on mobile, 1 on desktop)
- Primary color
- ARIA labels

### Test Page Navigation

```javascript
// In browser:
// 1. Verify first page buttons disabled on page 1
// 2. Click next page
// 3. Verify first page buttons enabled
// 4. Click last page
// 5. Verify last page buttons disabled
// 6. Click previous page
// 7. Verify navigation working
```

### Progress

- [ ] Pagination component renders
- [ ] Page buttons clickable
- [ ] First/Last buttons working
- [ ] Previous/Next buttons working
- [ ] Disabled states correct
- [ ] Responsive sizing (small on mobile)

---

## STEP 4: Add Jump to Page Input

Jump to page input already implemented in Step 1.

**Features:**
- Text input (number type)
- "Go to:" label
- Enter key to jump
- Validation (1 to totalPages)
- Desktop only (hidden on mobile)
- 80px width
- ARIA label

### Test Jump to Page

```javascript
// In browser (desktop only):
// 1. Type page number in input
// 2. Press Enter
// 3. Verify page changes
// 4. Type invalid number (0, -1, > totalPages)
// 5. Press Enter
// 6. Verify no change
// 7. Verify input clears after successful jump
```

### Progress

- [ ] Jump input renders (desktop only)
- [ ] Number type input
- [ ] Enter key triggers jump
- [ ] Validation working
- [ ] Input clears after jump
- [ ] ARIA label set

---

## STEP 5: Add Total Count Display

Total count display already implemented in Step 1.

**Format:**
```
Showing 1-25 of 150
Showing 26-50 of 150
Showing 51-75 of 150
```

**Features:**
- Shows current range (startItem-endItem)
- Shows total count (totalItems)
- Number formatting with `toLocaleString()` (e.g., 1,500)
- Typography body2
- Text secondary color

### Progress

- [ ] Total count displays
- [ ] Range accurate
- [ ] Number formatting working
- [ ] Color/size appropriate

---

## STEP 6: Implement Responsive Layout

Responsive layout already implemented in Step 1.

**Mobile (< 768px):**
- Vertical stack (column direction)
- Page size selector full width
- Total count below selector
- Pagination centered
- Jump to page hidden

**Tablet/Desktop (≥ 768px):**
- Horizontal layout (row direction)
- Page size selector left
- Pagination center
- Jump to page right
- All elements on same line

### Test Responsive

```powershell
# Open browser DevTools (F12)
# Device Toolbar (Ctrl+Shift+M)
# Test breakpoints:
# - 320px: Vertical stack, small pagination
# - 768px: Horizontal layout, medium pagination
# - 1024px: Horizontal layout, jump input visible
```

### Progress

- [ ] Mobile layout (column, centered)
- [ ] Desktop layout (row, space-between)
- [ ] Page size selector responsive
- [ ] Pagination size responsive
- [ ] Jump input hidden on mobile

---

## STEP 7: Add Accessibility Features

Accessibility features already implemented in Step 1.

**ARIA Labels:**
- First page button: `aria-label="First page"`
- Last page button: `aria-label="Last page"`
- Jump input: `aria-label="Jump to page"`
- Page size select: `labelId="page-size-label"`

**Keyboard Navigation:**
- Tab through all interactive elements
- Enter key on jump input
- Space/Enter on buttons
- Arrow keys on select

**Disabled States:**
- First/Previous buttons disabled on first page
- Last/Next buttons disabled on last page
- Jump input validation

### Test Accessibility

```javascript
// Keyboard test:
// 1. Tab to page size selector
// 2. Arrow keys to change size
// 3. Tab to first page button
// 4. Enter to go to first page
// 5. Tab to pagination buttons
// 6. Space/Enter to change page
// 7. Tab to jump input
// 8. Type number, Enter to jump

// Screen reader test (optional):
// - Use NVDA/JAWS
// - Verify labels announced
// - Verify disabled states announced
```

### Progress

- [ ] All buttons have ARIA labels
- [ ] Jump input has ARIA label
- [ ] Select has label association
- [ ] Keyboard navigation working
- [ ] Disabled states accessible
- [ ] Focus indicators visible

---

## STEP 8: Verification

### Checklist

```powershell
# 1. Start dev server
cd client
npm run dev

# 2. Navigate to PlantingReports

# 3. Test Page Size Selector
# - Change page size to 10
# - Verify table shows 10 rows
# - Change to 50
# - Verify table shows 50 rows

# 4. Test Page Navigation
# - Click next page
# - Verify table updates
# - Click previous page
# - Verify table updates
# - Click page number
# - Verify table updates

# 5. Test First/Last Buttons
# - Click first page button
# - Verify goes to page 1
# - Click last page button
# - Verify goes to last page

# 6. Test Jump to Page (Desktop)
# - Type page number
# - Press Enter
# - Verify page changes
# - Type invalid number
# - Press Enter
# - Verify no change

# 7. Test Total Count
# - Verify range displays correctly
# - Verify total count accurate
# - Change page size
# - Verify range updates

# 8. Test Responsive
# - Resize to 320px
# - Verify vertical stack
# - Verify pagination small
# - Verify jump input hidden
# - Resize to 1024px
# - Verify horizontal layout
# - Verify jump input visible

# 9. Test Accessibility
# - Tab through controls
# - Verify focus indicators
# - Verify keyboard navigation
# - Verify ARIA labels (inspect DevTools)

# 10. Check console
# No errors
```

### Expected Results

✅ Page size selector working  
✅ Page navigation working  
✅ First/Last buttons working  
✅ Jump to page working (desktop)  
✅ Total count display accurate  
✅ Responsive layout (mobile/desktop)  
✅ ARIA labels present  
✅ Keyboard navigation working  
✅ Disabled states correct  
✅ No console errors  

### Exit Criteria

Before moving to File 08:

- [x] All 8 steps completed
- [x] All checkboxes marked
- [x] Pagination controls functional
- [x] Responsive on mobile/desktop
- [x] Accessible
- [x] No console errors

---

## 🎯 COMPLETION

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

**Completion Date:** _______________

**Notes:**
- 
- 

**Next File:** [08_Modal_Architecture.md](./08_Modal_Architecture.md)

---

**Estimated Time:** 2-3 hours  
**Actual Time:** _______________
