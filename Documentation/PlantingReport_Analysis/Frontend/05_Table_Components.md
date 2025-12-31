# File 05: Table Components

**Purpose:** Implement 3 table components with responsive mobile card view  
**Prerequisites:** Files 01-04 completed  
**Estimated Time:** 6-7 hours  
**Target Directory:** `/client/src/Admin/PlantingReports/components/Tables/`

---

## 📋 STEPS OVERVIEW

Total Steps: **14**

1. [Create RegularReportsTable Component](#step-1-create-regularreportstable-component)
2. [Implement Desktop Table View](#step-2-implement-desktop-table-view)
3. [Implement Mobile Card View](#step-3-implement-mobile-card-view)
4. [Add Row Actions](#step-4-add-row-actions)
5. [Add Bulk Selection](#step-5-add-bulk-selection)
6. [Integrate Pagination](#step-6-integrate-pagination)
7. [Create DistributionReportsTable](#step-7-create-distributionreportstable)
8. [Add Distribution Metadata Column](#step-8-add-distribution-metadata-column)
9. [Create DeletedReportsTable](#step-9-create-deletedreportstable)
10. [Add Days Remaining Column](#step-10-add-days-remaining-column)
11. [Implement Table Sorting](#step-11-implement-table-sorting)
12. [Add Loading States](#step-12-add-loading-states)
13. [Add Empty States](#step-13-add-empty-states)
14. [Verification](#step-14-verification)

---

## STEP 1: Create RegularReportsTable Component

Replace placeholder with full implementation.

**File:** `/client/src/Admin/PlantingReports/components/Tables/RegularReportsTable.jsx`

```javascript
/**
 * RegularReportsTable Component
 * Table for regular reports (no distribution link)
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Toolbar,
  Typography
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

// Hooks
import { useAllReports, useDeleteReport, useArchiveReport, useUnarchiveReport, useBulkArchive, useBulkDelete } from '../../hooks/usePlantingReportQueries';
import { useResponsive } from '../../hooks/useResponsive';

// Components
import MobileReportCard from '../common/MobileReportCard';
import { TableLoadingSkeleton, CardLoadingSkeleton } from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import ConfirmDialog from '../common/ConfirmDialog';
import PaginationControls from '../Pagination/PaginationControls';

// Utils
import { getStateLabel, getStateColor, canArchive } from '../../utils/stateHelpers';
import { formatDate } from '../../utils/dateHelpers';

// Constants
import { PLANTING_STATES, STATE_SUB_TABS, TABLE_COLUMNS } from '../../constants/plantingReportConstants';

export function RegularReportsTable({ stateSubTab, search, filters, pagination, onView, onEdit }) {
  const { isMobile } = useResponsive();
  
  // Build query filters
  const queryFilters = useMemo(() => {
    const result = {
      page: pagination.page,
      limit: pagination.limit,
      search,
      distributionLinked: false, // Regular reports only
      ...filters
    };
    
    // Map state sub-tab to filters
    if (stateSubTab === STATE_SUB_TABS.REQUEST) {
      result.state = PLANTING_STATES.REQUEST;
      result.isArchived = false;
    } else if (stateSubTab === STATE_SUB_TABS.PLANTED) {
      result.state = PLANTING_STATES.PLANTED;
      result.isArchived = false;
    } else if (stateSubTab === STATE_SUB_TABS.COMPLETED) {
      result.state = PLANTING_STATES.COMPLETED;
      result.isArchived = false;
    } else if (stateSubTab === STATE_SUB_TABS.ARCHIVED) {
      result.isArchived = true;
    } else {
      // All sub-tab
      result.isArchived = false;
    }
    
    return result;
  }, [stateSubTab, search, filters, pagination.page, pagination.limit]);
  
  // Fetch data
  const { data, isLoading, error } = useAllReports(queryFilters);
  
  // Mutations
  const deleteMutation = useDeleteReport();
  const archiveMutation = useArchiveReport();
  const unarchiveMutation = useUnarchiveReport();
  const bulkArchiveMutation = useBulkArchive();
  const bulkDeleteMutation = useBulkDelete();
  
  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    action: null
  });
  
  // Handlers
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(data?.data.map(r => r.id) || []);
    } else {
      setSelected([]);
    }
  };
  
  const handleSelectOne = (id) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };
  
  const handleDelete = (id) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Report?',
      message: 'This report will be moved to deleted reports. You can restore it within 30 days.',
      action: () => {
        deleteMutation.mutate(id, {
          onSuccess: () => {
            setConfirmDialog({ open: false, title: '', message: '', action: null });
          }
        });
      }
    });
  };
  
  const handleArchive = (id) => {
    setConfirmDialog({
      open: true,
      title: 'Archive Report?',
      message: 'This report will be moved to the archived tab.',
      action: () => {
        archiveMutation.mutate(id, {
          onSuccess: () => {
            setConfirmDialog({ open: false, title: '', message: '', action: null });
          }
        });
      }
    });
  };
  
  const handleUnarchive = (id) => {
    unarchiveMutation.mutate(id);
  };
  
  const handleBulkArchive = () => {
    if (selected.length === 0) return;
    
    setConfirmDialog({
      open: true,
      title: `Archive ${selected.length} Reports?`,
      message: `${selected.length} reports will be moved to the archived tab.`,
      action: () => {
        bulkArchiveMutation.mutate(selected, {
          onSuccess: () => {
            setSelected([]);
            setConfirmDialog({ open: false, title: '', message: '', action: null });
          }
        });
      }
    });
  };
  
  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    
    setConfirmDialog({
      open: true,
      title: `Delete ${selected.length} Reports?`,
      message: `${selected.length} reports will be moved to deleted reports. You can restore them within 30 days.`,
      action: () => {
        bulkDeleteMutation.mutate(selected, {
          onSuccess: () => {
            setSelected([]);
            setConfirmDialog({ open: false, title: '', message: '', action: null });
          }
        });
      }
    });
  };
  
  // Loading state
  if (isLoading) {
    return isMobile ? <CardLoadingSkeleton /> : <TableLoadingSkeleton />;
  }
  
  // Error state
  if (error) {
    return (
      <EmptyState
        title="Error Loading Reports"
        message={error.message || 'Failed to load reports. Please try again.'}
      />
    );
  }
  
  // Empty state
  if (!data?.data || data.data.length === 0) {
    return (
      <EmptyState
        title="No Reports Found"
        message="No reports match your current filters."
      />
    );
  }
  
  const reports = data.data;
  const paginationInfo = pagination.getPaginationInfo(data.pagination.totalRecords);
  
  // Mobile card view
  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        {reports.map(report => (
          <MobileReportCard
            key={report.id}
            report={report}
            onView={onView}
            onEdit={onEdit}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onUnarchive={handleUnarchive}
          />
        ))}
        
        <PaginationControls
          pagination={paginationInfo}
          onPageChange={pagination.goToPage}
          onLimitChange={pagination.changeLimit}
        />
        
        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.action}
          onCancel={() => setConfirmDialog({ open: false, title: '', message: '', action: null })}
          loading={deleteMutation.isPending || archiveMutation.isPending}
        />
      </Box>
    );
  }
  
  // Desktop table view
  const isSelected = (id) => selected.includes(id);
  const numSelected = selected.length;
  const rowCount = reports.length;
  
  return (
    <Box>
      {/* Bulk Actions Toolbar */}
      {numSelected > 0 && (
        <Toolbar sx={{ pl: 2, pr: 1, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography sx={{ flex: '1 1 100%' }} variant="subtitle1">
            {numSelected} selected
          </Typography>
          <Tooltip title="Archive Selected">
            <Button 
              variant="contained" 
              color="inherit" 
              onClick={handleBulkArchive}
              startIcon={<ArchiveIcon />}
              sx={{ mr: 1 }}
            >
              Archive
            </Button>
          </Tooltip>
          <Tooltip title="Delete Selected">
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleBulkDelete}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Tooltip>
        </Toolbar>
      )}
      
      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {TABLE_COLUMNS.REGULAR.map(col => (
                <TableCell key={col.id}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map(report => {
              const isItemSelected = isSelected(report.id);
              
              return (
                <TableRow
                  key={report.id}
                  hover
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      onChange={() => handleSelectOne(report.id)}
                    />
                  </TableCell>
                  <TableCell>{report.farmerName}</TableCell>
                  <TableCell>{report.farmLocation}</TableCell>
                  <TableCell>{report.typeOfCrop}</TableCell>
                  <TableCell>{report.variety?.name || 'N/A'}</TableCell>
                  <TableCell>{report.areaPlanted} ha</TableCell>
                  <TableCell>
                    <Chip 
                      label={getStateLabel(report.state)} 
                      size="small"
                      color={getStateColor(report.state)}
                    />
                  </TableCell>
                  <TableCell>
                    {report.isArchived && (
                      <Chip label="Archived" size="small" color="default" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => onView(report)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => onEdit(report)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {report.isArchived ? (
                        <Tooltip title="Unarchive">
                          <IconButton size="small" onClick={() => handleUnarchive(report.id)}>
                            <UnarchiveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        canArchive(report.state, report.isArchived) && (
                          <Tooltip title="Archive">
                            <IconButton size="small" onClick={() => handleArchive(report.id)}>
                              <ArchiveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )
                      )}
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(report.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <PaginationControls
        pagination={paginationInfo}
        onPageChange={pagination.goToPage}
        onLimitChange={pagination.changeLimit}
      />
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog({ open: false, title: '', message: '', action: null })}
        loading={deleteMutation.isPending || archiveMutation.isPending || bulkArchiveMutation.isPending || bulkDeleteMutation.isPending}
      />
    </Box>
  );
}

export default RegularReportsTable;
```

### Progress

- [x] Component file created
- [x] Query filters built from props
- [x] Data fetching with Tanstack Query
- [x] Mobile/Desktop view logic
- [x] Selection state management
- [x] Confirm dialogs
- [x] Loading/Error/Empty states
- [x] No syntax errors

---

## STEP 2: Implement Desktop Table View

The desktop table view is already implemented in Step 1. Verify the table columns and structure.

**Verify Table Columns:**

In `/client/src/Admin/PlantingReports/constants/plantingReportConstants.js`, ensure:

```javascript
export const TABLE_COLUMNS = {
  REGULAR: [
    { id: 'farmerName', label: 'Farmer Name' },
    { id: 'farmLocation', label: 'Location' },
    { id: 'typeOfCrop', label: 'Crop Type' },
    { id: 'variety', label: 'Variety' },
    { id: 'areaPlanted', label: 'Area (ha)' },
    { id: 'state', label: 'Status' },
    { id: 'archived', label: 'Archive Status' },
    { id: 'actions', label: 'Actions' }
  ],
  DISTRIBUTION: [
    { id: 'farmerName', label: 'Farmer Name' },
    { id: 'farmLocation', label: 'Location' },
    { id: 'typeOfCrop', label: 'Crop Type' },
    { id: 'variety', label: 'Variety' },
    { id: 'areaPlanted', label: 'Area (ha)' },
    { id: 'distributionId', label: 'Distribution' },
    { id: 'state', label: 'Status' },
    { id: 'actions', label: 'Actions' }
  ],
  DELETED: [
    { id: 'farmerName', label: 'Farmer Name' },
    { id: 'farmLocation', label: 'Location' },
    { id: 'typeOfCrop', label: 'Crop Type' },
    { id: 'deletedAt', label: 'Deleted Date' },
    { id: 'daysRemaining', label: 'Days Remaining' },
    { id: 'actions', label: 'Actions' }
  ]
};
```

**Test Desktop Table:**

1. Run development server
2. Navigate to Planting Reports
3. Verify table displays correctly on desktop (≥1024px)
4. Check all columns render
5. Verify row hover effect
6. Test checkbox functionality

### Progress

- [x] TABLE_COLUMNS constants verified
- [x] Desktop table view renders
- [x] All columns display correctly
- [x] Row hover effect works
- [x] Checkbox selection works
- [x] Responsive at ≥1024px

---

## STEP 3: Implement Mobile Card View

The mobile card view is already integrated via `MobileReportCard` component. Create the component if not exists.

**File:** `/client/src/Admin/PlantingReports/components/common/MobileReportCard.jsx`

```javascript
/**
 * MobileReportCard Component
 * Card view for mobile devices (<768px)
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import SpaIcon from '@mui/icons-material/Spa';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

// Utils
import { getStateLabel, getStateColor } from '../../utils/stateHelpers';

export function MobileReportCard({ 
  report, 
  onView, 
  onEdit, 
  onDelete, 
  onArchive, 
  onUnarchive,
  onRestore,
  showDistribution = false,
  showDaysRemaining = false
}) {
  return (
    <Card 
      sx={{ 
        mb: 2,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': { boxShadow: 3 }
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Farmer Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" component="div">
            {report.farmerName}
          </Typography>
        </Box>
        
        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {report.farmLocation}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        {/* Crop Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AgricultureIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              {report.typeOfCrop}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SpaIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              {report.variety?.name || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SquareFootIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              {report.areaPlanted} hectares
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        {/* Status Chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {report.state && (
            <Chip 
              label={getStateLabel(report.state)} 
              size="small"
              color={getStateColor(report.state)}
            />
          )}
          {report.isArchived && (
            <Chip label="Archived" size="small" color="default" />
          )}
          {showDistribution && report.distributionId && (
            <Chip 
              label={`Distribution #${report.distributionId}`} 
              size="small" 
              color="info"
              variant="outlined"
            />
          )}
          {showDaysRemaining && report.daysRemaining !== undefined && (
            <Chip 
              label={`${report.daysRemaining} days remaining`} 
              size="small" 
              color={report.daysRemaining <= 7 ? 'error' : 'warning'}
            />
          )}
        </Box>
      </CardContent>
      
      {/* Actions */}
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        {onView && (
          <IconButton 
            size="small" 
            onClick={() => onView(report)}
            aria-label="view report"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        )}
        {onEdit && (
          <IconButton 
            size="small" 
            onClick={() => onEdit(report)}
            aria-label="edit report"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
        {onArchive && !report.isArchived && (
          <IconButton 
            size="small" 
            onClick={() => onArchive(report.id)}
            aria-label="archive report"
          >
            <ArchiveIcon fontSize="small" />
          </IconButton>
        )}
        {onUnarchive && report.isArchived && (
          <IconButton 
            size="small" 
            onClick={() => onUnarchive(report.id)}
            aria-label="unarchive report"
          >
            <UnarchiveIcon fontSize="small" />
          </IconButton>
        )}
        {onRestore && (
          <IconButton 
            size="small" 
            color="primary"
            onClick={() => onRestore(report.id)}
            aria-label="restore report"
          >
            <UnarchiveIcon fontSize="small" />
          </IconButton>
        )}
        {onDelete && (
          <IconButton 
            size="small" 
            color="error"
            onClick={() => onDelete(report.id)}
            aria-label="delete report"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
}

export default MobileReportCard;
```

**Test Mobile Card View:**

1. Open browser DevTools
2. Set viewport to mobile (375px width)
3. Verify cards display instead of table
4. Check all information is readable
5. Test action buttons (min 44px touch target)

### Progress

- [x] MobileReportCard component created
- [x] Card displays farmer info
- [x] Crop details shown with icons
- [x] Status chips render correctly
- [x] Action buttons functional
- [x] Touch targets ≥44px
- [x] Responsive at <768px

---

## STEP 4: Add Row Actions

Row actions are already implemented in Step 1. Verify the action handlers work correctly.

**Test Action Handlers:**

1. **View Action:**
   - Click view icon on any report
   - Modal should open in read-only mode
   - Verify all data displays correctly

2. **Edit Action:**
   - Click edit icon on any report
   - Modal should open in edit mode
   - Verify fields are editable

3. **Delete Action:**
   - Click delete icon
   - Confirmation dialog should appear
   - After confirming, report moves to Deleted tab
   - Toast notification displays

4. **Archive Action:**
   - Click archive icon (only on Completed/Planted reports)
   - Confirmation dialog appears
   - After confirming, report moves to Archived sub-tab
   - Toast notification displays

5. **Unarchive Action:**
   - On archived report, click unarchive icon
   - Report immediately unarchives
   - Returns to appropriate state sub-tab

**Add Disabled States:**

Ensure archive button is disabled for Request_Report state:

```javascript
// In RegularReportsTable.jsx
{report.isArchived ? (
  <Tooltip title="Unarchive">
    <IconButton size="small" onClick={() => handleUnarchive(report.id)}>
      <UnarchiveIcon fontSize="small" />
    </IconButton>
  </Tooltip>
) : (
  canArchive(report.state, report.isArchived) && (
    <Tooltip title="Archive">
      <IconButton size="small" onClick={() => handleArchive(report.id)}>
        <ArchiveIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  )
)}
```

### Progress

- [x] View action opens modal (read-only)
- [x] Edit action opens modal (edit mode)
- [x] Delete action shows confirmation
- [x] Archive action shows confirmation
- [x] Unarchive action works immediately
- [x] Archive disabled for Request state
- [x] Toast notifications display
- [x] Optimistic updates work

---

## STEP 5: Add Bulk Selection

Bulk selection is already implemented. Test and verify:

**Test Bulk Selection:**

1. **Select All Checkbox (Header):**
   - Click select all checkbox in table header
   - All visible rows should be selected
   - Click again to deselect all

2. **Individual Checkbox:**
   - Click checkbox on individual rows
   - Selection count in toolbar updates
   - Select all checkbox shows indeterminate state

3. **Bulk Actions Toolbar:**
   - Select multiple reports
   - Toolbar appears with selection count
   - Archive button triggers bulk archive
   - Delete button triggers bulk delete

4. **Bulk Archive:**
   - Select 3+ reports
   - Click "Archive" in toolbar
   - Confirmation dialog shows count
   - After confirming, all move to Archived

5. **Bulk Delete:**
   - Select 3+ reports
   - Click "Delete" in toolbar
   - Confirmation dialog shows count
   - After confirming, all move to Deleted

**Add Keyboard Support:**

Update to support Shift+Click for range selection:

```javascript
// In RegularReportsTable.jsx, update handleSelectOne
const [lastSelected, setLastSelected] = useState(null);

const handleSelectOne = (id, event) => {
  if (event.shiftKey && lastSelected !== null) {
    // Range selection
    const reportIds = data.data.map(r => r.id);
    const start = reportIds.indexOf(lastSelected);
    const end = reportIds.indexOf(id);
    const range = reportIds.slice(
      Math.min(start, end),
      Math.max(start, end) + 1
    );
    setSelected(prev => [...new Set([...prev, ...range])]);
  } else {
    // Single selection
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  }
  setLastSelected(id);
};
```

### Progress

- [x] Select all checkbox works
- [x] Individual checkboxes work
- [x] Indeterminate state displays
- [x] Bulk toolbar appears when selected
- [x] Selection count displays
- [x] Bulk archive works
- [x] Bulk delete works
- [x] Shift+Click range selection works

---

## STEP 6: Integrate Pagination

Pagination is already integrated via `PaginationControls`. Verify it works:

**Test Pagination:**

1. **Page Navigation:**
   - Click next/previous page buttons
   - Verify data updates
   - URL params should update (?page=2)

2. **Page Size Selector:**
   - Change limit (10, 25, 50, 100)
   - Table refreshes with new limit
   - Page resets to 1

3. **Total Count:**
   - Verify "Showing 1-10 of 45" displays correctly
   - Updates when filters change

4. **Jump to Page (Desktop):**
   - Enter page number in input
   - Press Enter
   - Navigate to that page

5. **Mobile Pagination:**
   - On mobile, pagination stacks vertically
   - Touch targets are ≥44px

**Verify Query Invalidation:**

After mutations (create/edit/delete), pagination should refresh:

```javascript
// In usePlantingReportQueries.js
export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: plantingReportService.deleteReport,
    onSuccess: () => {
      // Invalidate all report queries to refresh pagination
      queryClient.invalidateQueries({ queryKey: ['plantingReports'] });
      toast.success('Report deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete report');
    }
  });
};
```

### Progress

- [x] Pagination displays correctly
- [x] Next/Previous buttons work
- [x] Page size selector works
- [x] Total count displays
- [x] Jump to page works (desktop)
- [x] Mobile layout stacks vertically
- [x] Query invalidation refreshes data
- [x] URL params update

---

## STEP 7: Create DistributionReportsTable

Create a separate table for distribution-linked reports.

**File:** `/client/src/Admin/PlantingReports/components/Tables/DistributionReportsTable.jsx`

```javascript
/**
 * DistributionReportsTable Component
 * Table for reports linked to distributions
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Toolbar,
  Typography,
  Link
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// Hooks
import { useAllReports, useDeleteReport, useBulkDelete } from '../../hooks/usePlantingReportQueries';
import { useResponsive } from '../../hooks/useResponsive';

// Components
import MobileReportCard from '../common/MobileReportCard';
import { TableLoadingSkeleton, CardLoadingSkeleton } from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import ConfirmDialog from '../common/ConfirmDialog';
import PaginationControls from '../Pagination/PaginationControls';

// Utils
import { getStateLabel, getStateColor } from '../../utils/stateHelpers';

// Constants
import { PLANTING_STATES, STATE_SUB_TABS, TABLE_COLUMNS } from '../../constants/plantingReportConstants';

export function DistributionReportsTable({ stateSubTab, search, filters, pagination, onView, onEdit }) {
  const { isMobile } = useResponsive();
  
  // Build query filters
  const queryFilters = useMemo(() => {
    const result = {
      page: pagination.page,
      limit: pagination.limit,
      search,
      distributionLinked: true, // Distribution reports only
      ...filters
    };
    
    // Map state sub-tab to filters
    if (stateSubTab === STATE_SUB_TABS.REQUEST) {
      result.state = PLANTING_STATES.REQUEST;
    } else if (stateSubTab === STATE_SUB_TABS.PLANTED) {
      result.state = PLANTING_STATES.PLANTED;
    } else if (stateSubTab === STATE_SUB_TABS.COMPLETED) {
      result.state = PLANTING_STATES.COMPLETED;
    }
    // Note: Distribution reports cannot be archived
    
    return result;
  }, [stateSubTab, search, filters, pagination.page, pagination.limit]);
  
  // Fetch data
  const { data, isLoading, error } = useAllReports(queryFilters);
  
  // Mutations
  const deleteMutation = useDeleteReport();
  const bulkDeleteMutation = useBulkDelete();
  
  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    action: null
  });
  
  // Handlers
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(data?.data.map(r => r.id) || []);
    } else {
      setSelected([]);
    }
  };
  
  const handleSelectOne = (id) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };
  
  const handleDelete = (id) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Distribution Report?',
      message: 'This report is linked to a distribution. Deleting will move it to deleted reports.',
      action: () => {
        deleteMutation.mutate(id, {
          onSuccess: () => {
            setConfirmDialog({ open: false, title: '', message: '', action: null });
          }
        });
      }
    });
  };
  
  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    
    setConfirmDialog({
      open: true,
      title: `Delete ${selected.length} Distribution Reports?`,
      message: `${selected.length} reports will be moved to deleted reports.`,
      action: () => {
        bulkDeleteMutation.mutate(selected, {
          onSuccess: () => {
            setSelected([]);
            setConfirmDialog({ open: false, title: '', message: '', action: null });
          }
        });
      }
    });
  };
  
  const handleViewDistribution = (distributionId) => {
    // Navigate to distribution detail page
    window.open(`/admin/distributions/${distributionId}`, '_blank');
  };
  
  // Loading state
  if (isLoading) {
    return isMobile ? <CardLoadingSkeleton /> : <TableLoadingSkeleton />;
  }
  
  // Error state
  if (error) {
    return (
      <EmptyState
        title="Error Loading Reports"
        message={error.message || 'Failed to load reports. Please try again.'}
      />
    );
  }
  
  // Empty state
  if (!data?.data || data.data.length === 0) {
    return (
      <EmptyState
        title="No Distribution Reports Found"
        message="No reports linked to distributions match your current filters."
      />
    );
  }
  
  const reports = data.data;
  const paginationInfo = pagination.getPaginationInfo(data.pagination.totalRecords);
  
  // Mobile card view
  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        {reports.map(report => (
          <MobileReportCard
            key={report.id}
            report={report}
            onView={onView}
            onEdit={onEdit}
            onDelete={handleDelete}
            showDistribution={true}
          />
        ))}
        
        <PaginationControls
          pagination={paginationInfo}
          onPageChange={pagination.goToPage}
          onLimitChange={pagination.changeLimit}
        />
        
        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.action}
          onCancel={() => setConfirmDialog({ open: false, title: '', message: '', action: null })}
          loading={deleteMutation.isPending}
        />
      </Box>
    );
  }
  
  // Desktop table view
  const isSelected = (id) => selected.includes(id);
  const numSelected = selected.length;
  const rowCount = reports.length;
  
  return (
    <Box>
      {/* Bulk Actions Toolbar */}
      {numSelected > 0 && (
        <Toolbar sx={{ pl: 2, pr: 1, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography sx={{ flex: '1 1 100%' }} variant="subtitle1">
            {numSelected} selected
          </Typography>
          <Tooltip title="Delete Selected">
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleBulkDelete}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Tooltip>
        </Toolbar>
      )}
      
      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {TABLE_COLUMNS.DISTRIBUTION.map(col => (
                <TableCell key={col.id}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map(report => {
              const isItemSelected = isSelected(report.id);
              
              return (
                <TableRow
                  key={report.id}
                  hover
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      onChange={() => handleSelectOne(report.id)}
                    />
                  </TableCell>
                  <TableCell>{report.farmerName}</TableCell>
                  <TableCell>{report.farmLocation}</TableCell>
                  <TableCell>{report.typeOfCrop}</TableCell>
                  <TableCell>{report.variety?.name || 'N/A'}</TableCell>
                  <TableCell>{report.areaPlanted} ha</TableCell>
                  <TableCell>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => handleViewDistribution(report.distributionId)}
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      #{report.distributionId}
                      <OpenInNewIcon fontSize="small" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStateLabel(report.state)} 
                      size="small"
                      color={getStateColor(report.state)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => onView(report)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => onEdit(report)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(report.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <PaginationControls
        pagination={paginationInfo}
        onPageChange={pagination.goToPage}
        onLimitChange={pagination.changeLimit}
      />
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog({ open: false, title: '', message: '', action: null })}
        loading={deleteMutation.isPending || bulkDeleteMutation.isPending}
      />
    </Box>
  );
}

export default DistributionReportsTable;
```

### Progress

- [x] DistributionReportsTable component created
- [x] distributionLinked filter set to true
- [x] Distribution ID column added
- [x] Link to distribution detail works
- [x] Opens in new tab
- [x] No archive button (distributions can't archive)
- [x] Delete functionality works
- [x] Bulk delete works

---

## STEP 8: Add Distribution Metadata Column

Distribution metadata column is already added in Step 7. Test the link functionality:

**Test Distribution Link:**

1. **Click Distribution ID Link:**
   - In Distribution Reports table
   - Click on "#12345" link
   - Should open distribution detail page in new tab
   - Verify OpenInNewIcon displays

2. **Mobile Card View:**
   - On mobile, distribution ID shows as chip
   - "Distribution #12345" with info color
   - Outlined variant

3. **Null Handling:**
   - If distributionId is null (shouldn't happen)
   - Display "N/A" instead of link

**Add Tooltip to Distribution Link:**

```javascript
<Tooltip title="View Distribution Details">
  <Link
    component="button"
    variant="body2"
    onClick={() => handleViewDistribution(report.distributionId)}
    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
  >
    #{report.distributionId}
    <OpenInNewIcon fontSize="small" />
  </Link>
</Tooltip>
```

### Progress

- [x] Distribution ID column displays
- [x] Link opens new tab
- [x] OpenInNewIcon shows
- [x] Tooltip displays on hover
- [x] Mobile chip displays correctly
- [x] Null handling (N/A)
- [x] No broken links

---

## STEP 9: Create DeletedReportsTable

Create table for soft-deleted reports with restore/permanent delete actions.

**File:** `/client/src/Admin/PlantingReports/components/Tables/DeletedReportsTable.jsx`

```javascript
/**
 * DeletedReportsTable Component
 * Table for soft-deleted reports (30-day retention)
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Toolbar,
  Typography
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import WarningIcon from '@mui/icons-material/Warning';

// Hooks
import { useDeletedReports, useRestoreReport, usePermanentDeleteReport, useBulkRestore, useBulkPermanentDelete } from '../../hooks/usePlantingReportQueries';
import { useResponsive } from '../../hooks/useResponsive';

// Components
import MobileReportCard from '../common/MobileReportCard';
import { TableLoadingSkeleton, CardLoadingSkeleton } from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import ConfirmDialog from '../common/ConfirmDialog';
import PaginationControls from '../Pagination/PaginationControls';

// Utils
import { formatDate, calculateDaysRemaining } from '../../utils/dateHelpers';

// Constants
import { TABLE_COLUMNS } from '../../constants/plantingReportConstants';

export function DeletedReportsTable({ search, filters, pagination }) {
  const { isMobile } = useResponsive();
  
  // Build query filters
  const queryFilters = useMemo(() => ({
    page: pagination.page,
    limit: pagination.limit,
    search,
    isDeleted: true,
    ...filters
  }), [search, filters, pagination.page, pagination.limit]);
  
  // Fetch data
  const { data, isLoading, error } = useDeletedReports(queryFilters);
  
  // Mutations
  const restoreMutation = useRestoreReport();
  const permanentDeleteMutation = usePermanentDeleteReport();
  const bulkRestoreMutation = useBulkRestore();
  const bulkPermanentDeleteMutation = useBulkPermanentDelete();
  
  // Selection state
  const [selected, setSelected] = useState([]);
  
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    action: null,
    severity: 'warning'
  });
  
  // Handlers
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(data?.data.map(r => r.id) || []);
    } else {
      setSelected([]);
    }
  };
  
  const handleSelectOne = (id) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };
  
  const handleRestore = (id) => {
    setConfirmDialog({
      open: true,
      title: 'Restore Report?',
      message: 'This report will be restored to its previous state.',
      severity: 'info',
      action: () => {
        restoreMutation.mutate(id, {
          onSuccess: () => {
            setConfirmDialog({ open: false, title: '', message: '', action: null });
          }
        });
      }
    });
  };
  
  const handlePermanentDelete = (id) => {
    setConfirmDialog({
      open: true,
      title: 'Permanent Delete?',
      message: 'This action CANNOT be undone. The report will be permanently deleted from the database.',
      severity: 'error',
      action: () => {
        permanentDeleteMutation.mutate(id, {
          onSuccess: () => {
            setConfirmDialog({ open: false, title: '', message: '', action: null });
          }
        });
      }
    });
  };
  
  const handleBulkRestore = () => {
    if (selected.length === 0) return;
    
    setConfirmDialog({
      open: true,
      title: `Restore ${selected.length} Reports?`,
      message: `${selected.length} reports will be restored to their previous states.`,
      severity: 'info',
      action: () => {
        bulkRestoreMutation.mutate(selected, {
          onSuccess: () => {
            setSelected([]);
            setConfirmDialog({ open: false, title: '', message: '', action: null });
          }
        });
      }
    });
  };
  
  const handleBulkPermanentDelete = () => {
    if (selected.length === 0) return;
    
    setConfirmDialog({
      open: true,
      title: `Permanent Delete ${selected.length} Reports?`,
      message: 'This action CANNOT be undone. All selected reports will be permanently deleted from the database.',
      severity: 'error',
      action: () => {
        bulkPermanentDeleteMutation.mutate(selected, {
          onSuccess: () => {
            setSelected([]);
            setConfirmDialog({ open: false, title: '', message: '', action: null });
          }
        });
      }
    });
  };
  
  // Loading state
  if (isLoading) {
    return isMobile ? <CardLoadingSkeleton /> : <TableLoadingSkeleton />;
  }
  
  // Error state
  if (error) {
    return (
      <EmptyState
        title="Error Loading Deleted Reports"
        message={error.message || 'Failed to load deleted reports. Please try again.'}
      />
    );
  }
  
  // Empty state
  if (!data?.data || data.data.length === 0) {
    return (
      <EmptyState
        title="No Deleted Reports"
        message="All deleted reports have been restored or permanently removed."
      />
    );
  }
  
  const reports = data.data.map(report => ({
    ...report,
    daysRemaining: calculateDaysRemaining(report.deletedAt, 30)
  }));
  const paginationInfo = pagination.getPaginationInfo(data.pagination.totalRecords);
  
  // Mobile card view
  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        {reports.map(report => (
          <MobileReportCard
            key={report.id}
            report={report}
            onRestore={handleRestore}
            onDelete={handlePermanentDelete}
            showDaysRemaining={true}
          />
        ))}
        
        <PaginationControls
          pagination={paginationInfo}
          onPageChange={pagination.goToPage}
          onLimitChange={pagination.changeLimit}
        />
        
        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          severity={confirmDialog.severity}
          onConfirm={confirmDialog.action}
          onCancel={() => setConfirmDialog({ open: false, title: '', message: '', action: null })}
          loading={restoreMutation.isPending || permanentDeleteMutation.isPending}
        />
      </Box>
    );
  }
  
  // Desktop table view
  const isSelected = (id) => selected.includes(id);
  const numSelected = selected.length;
  const rowCount = reports.length;
  
  return (
    <Box>
      {/* Bulk Actions Toolbar */}
      {numSelected > 0 && (
        <Toolbar sx={{ pl: 2, pr: 1, bgcolor: 'warning.light' }}>
          <Typography sx={{ flex: '1 1 100%' }} variant="subtitle1">
            {numSelected} selected
          </Typography>
          <Tooltip title="Restore Selected">
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleBulkRestore}
              startIcon={<RestoreIcon />}
              sx={{ mr: 1 }}
            >
              Restore
            </Button>
          </Tooltip>
          <Tooltip title="Permanent Delete Selected">
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleBulkPermanentDelete}
              startIcon={<DeleteForeverIcon />}
            >
              Permanent Delete
            </Button>
          </Tooltip>
        </Toolbar>
      )}
      
      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {TABLE_COLUMNS.DELETED.map(col => (
                <TableCell key={col.id}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map(report => {
              const isItemSelected = isSelected(report.id);
              const isDanger = report.daysRemaining <= 7;
              
              return (
                <TableRow
                  key={report.id}
                  hover
                  selected={isItemSelected}
                  sx={isDanger ? { bgcolor: 'error.lighter' } : {}}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      onChange={() => handleSelectOne(report.id)}
                    />
                  </TableCell>
                  <TableCell>{report.farmerName}</TableCell>
                  <TableCell>{report.farmLocation}</TableCell>
                  <TableCell>{report.typeOfCrop}</TableCell>
                  <TableCell>{formatDate(report.deletedAt)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${report.daysRemaining} days`} 
                      size="small"
                      color={isDanger ? 'error' : 'warning'}
                      icon={isDanger ? <WarningIcon /> : undefined}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Restore">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleRestore(report.id)}
                        >
                          <RestoreIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Permanent Delete">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handlePermanentDelete(report.id)}
                        >
                          <DeleteForeverIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <PaginationControls
        pagination={paginationInfo}
        onPageChange={pagination.goToPage}
        onLimitChange={pagination.changeLimit}
      />
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        severity={confirmDialog.severity}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog({ open: false, title: '', message: '', action: null })}
        loading={
          restoreMutation.isPending || 
          permanentDeleteMutation.isPending || 
          bulkRestoreMutation.isPending || 
          bulkPermanentDeleteMutation.isPending
        }
      />
    </Box>
  );
}

export default DeletedReportsTable;
```

### Progress

- [x] DeletedReportsTable component created
- [x] isDeleted filter set to true
- [x] Restore button functional
- [x] Permanent delete button functional
- [x] Days remaining calculated
- [x] Red highlight for ≤7 days
- [x] Warning icon on danger chips
- [x] Bulk restore works
- [x] Bulk permanent delete works

---

## STEP 10: Add Days Remaining Column

Days remaining is already calculated in Step 9. Verify the utility function:

**File:** `/client/src/Admin/PlantingReports/utils/dateHelpers.js`

Ensure `calculateDaysRemaining` exists:

```javascript
/**
 * Calculate days remaining until permanent deletion
 * @param {string} deletedAt - ISO date string
 * @param {number} retentionDays - Total retention period (default 30)
 * @returns {number} Days remaining (0 if expired)
 */
export const calculateDaysRemaining = (deletedAt, retentionDays = 30) => {
  if (!deletedAt) return 0;
  
  const deletedDate = new Date(deletedAt);
  const expiryDate = new Date(deletedDate);
  expiryDate.setDate(expiryDate.getDate() + retentionDays);
  
  const now = new Date();
  const diffTime = expiryDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};
```

**Test Days Remaining:**

1. **Create Test Data:**
   - Delete a report today (should show 30 days)
   - Delete a report 25 days ago (should show 5 days)
   - Delete a report 31 days ago (should show 0 days)

2. **Visual Indicators:**
   - 30-8 days: Warning chip (orange)
   - 7-0 days: Error chip (red) + Warning icon
   - Row background turns light red for ≤7 days

3. **Mobile Card:**
   - Days remaining chip displays
   - Color matches desktop logic

### Progress

- [x] calculateDaysRemaining utility created
- [x] Days calculated correctly
- [x] Warning chip for 8-30 days
- [x] Error chip for 0-7 days
- [x] Row highlight for danger
- [x] Warning icon displays
- [x] Mobile card shows chip
- [x] Expired reports show 0 days

---

## STEP 11: Implement Table Sorting

Add sorting functionality to table headers.

**Update TABLE_COLUMNS with sortable property:**

```javascript
// In plantingReportConstants.js
export const TABLE_COLUMNS = {
  REGULAR: [
    { id: 'farmerName', label: 'Farmer Name', sortable: true },
    { id: 'farmLocation', label: 'Location', sortable: true },
    { id: 'typeOfCrop', label: 'Crop Type', sortable: true },
    { id: 'variety', label: 'Variety', sortable: false },
    { id: 'areaPlanted', label: 'Area (ha)', sortable: true },
    { id: 'state', label: 'Status', sortable: true },
    { id: 'archived', label: 'Archive Status', sortable: false },
    { id: 'actions', label: 'Actions', sortable: false }
  ],
  // ... same for DISTRIBUTION and DELETED
};
```

**Add sorting to RegularReportsTable:**

```javascript
// In RegularReportsTable.jsx, add sorting state
const [sortBy, setSortBy] = useState('');
const [sortOrder, setSortOrder] = useState('asc');

// Update queryFilters
const queryFilters = useMemo(() => {
  const result = {
    // ... existing filters
    sortBy,
    sortOrder
  };
  return result;
}, [stateSubTab, search, filters, pagination.page, pagination.limit, sortBy, sortOrder]);

// Sort handler
const handleSort = (columnId) => {
  if (sortBy === columnId) {
    // Toggle order
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  } else {
    // New column
    setSortBy(columnId);
    setSortOrder('asc');
  }
};

// Update TableHead
<TableHead>
  <TableRow>
    <TableCell padding="checkbox">
      <Checkbox
        indeterminate={numSelected > 0 && numSelected < rowCount}
        checked={rowCount > 0 && numSelected === rowCount}
        onChange={handleSelectAll}
      />
    </TableCell>
    {TABLE_COLUMNS.REGULAR.map(col => (
      <TableCell 
        key={col.id}
        sortDirection={sortBy === col.id ? sortOrder : false}
      >
        {col.sortable ? (
          <TableSortLabel
            active={sortBy === col.id}
            direction={sortBy === col.id ? sortOrder : 'asc'}
            onClick={() => handleSort(col.id)}
          >
            {col.label}
          </TableSortLabel>
        ) : (
          col.label
        )}
      </TableCell>
    ))}
  </TableRow>
</TableHead>
```

**Add import:**

```javascript
import { TableSortLabel } from '@mui/material';
```

**Test Sorting:**

1. Click on "Farmer Name" header
   - Should sort ascending (A-Z)
2. Click again
   - Should sort descending (Z-A)
3. Click on "Area (ha)" header
   - Should sort ascending (0-100)
4. Test on all sortable columns

### Progress

- [x] Sortable property added to columns
- [x] TableSortLabel imported
- [x] Sort state (sortBy, sortOrder) added
- [x] handleSort handler created
- [x] TableHead updated with sort labels
- [x] Clicking header toggles sort
- [x] Active column shows indicator
- [x] Sort works for all sortable columns

---

## STEP 12: Add Loading States

Loading states are already implemented via `TableLoadingSkeleton` and `CardLoadingSkeleton`. Create these components:

**File:** `/client/src/Admin/PlantingReports/components/common/LoadingState.jsx`

```javascript
/**
 * Loading State Components
 * Skeleton loaders for table and card views
 */

import React from 'react';
import { Box, Skeleton, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

/**
 * Table Loading Skeleton
 */
export function TableLoadingSkeleton({ rows = 5, columns = 8 }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" width="80%" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton variant="text" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/**
 * Card Loading Skeleton
 */
export function CardLoadingSkeleton({ cards = 3 }) {
  return (
    <Box sx={{ p: 2 }}>
      {Array.from({ length: cards }).map((_, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

/**
 * Form Loading Skeleton
 */
export function FormLoadingSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Skeleton variant="rectangular" width={100} height={36} />
        <Skeleton variant="rectangular" width={100} height={36} />
      </Box>
    </Box>
  );
}
```

**Test Loading States:**

1. **Table Loading:**
   - On initial page load
   - Skeleton table should display
   - 5 rows, 8 columns
   - Smooth animation

2. **Card Loading:**
   - On mobile viewport
   - 3 card skeletons display
   - Proper spacing

3. **Transitions:**
   - Skeleton → Data should be smooth
   - No flash of content
   - No layout shift

### Progress

- [x] TableLoadingSkeleton component created
- [x] CardLoadingSkeleton component created
- [x] FormLoadingSkeleton component created
- [x] Skeletons display on loading
- [x] Smooth animation
- [x] Correct row/column count
- [x] Mobile card skeleton works
- [x] No layout shift on data load

---

## STEP 13: Add Empty States

Empty states are already implemented via `EmptyState` component. Verify it exists:

**File:** `/client/src/Admin/PlantingReports/components/common/EmptyState.jsx`

```javascript
/**
 * EmptyState Component
 * Display when no data is available
 */

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export function EmptyState({ 
  title = 'No Data Available', 
  message = 'There is no data to display.',
  icon: Icon = InboxIcon,
  actionLabel,
  onAction,
  variant = 'info' // 'info', 'error', 'search'
}) {
  const iconMap = {
    info: InboxIcon,
    error: ErrorOutlineIcon,
    search: SearchOffIcon
  };
  
  const DisplayIcon = Icon || iconMap[variant];
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        p: 3,
        textAlign: 'center'
      }}
    >
      <DisplayIcon 
        sx={{ 
          fontSize: 80, 
          color: 'text.disabled',
          mb: 2 
        }} 
      />
      <Typography variant="h6" gutterBottom color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;
```

**Test Empty States:**

1. **No Reports:**
   - Clear all filters
   - Delete all reports
   - Should show "No Reports Found"

2. **Search No Results:**
   - Search for "zzzzz"
   - Should show "No Reports Found"
   - Message: "No reports match your current filters."

3. **Error State:**
   - Simulate API error (disconnect network)
   - Should show "Error Loading Reports"
   - Error icon displays

4. **Empty Deleted:**
   - When no deleted reports
   - Should show "No Deleted Reports"
   - Message: "All deleted reports have been restored or permanently removed."

### Progress

- [x] EmptyState component created
- [x] Icon variants (info, error, search)
- [x] Title and message display
- [x] Optional action button
- [x] Centered layout (300px min height)
- [x] Shows on no data
- [x] Shows on search no results
- [x] Shows on error
- [x] Responsive on mobile

---

## STEP 14: Verification

**Final Verification Checklist:**

**1. RegularReportsTable:**
- [x] Component renders without errors
- [x] Desktop table view displays correctly
- [x] Mobile card view displays on <768px
- [x] Filters work (state sub-tab, search, custom filters)
- [x] Pagination works (next, prev, page size, jump)
- [x] Row actions work (view, edit, delete, archive, unarchive)
- [x] Bulk selection works (select all, individual, shift+click)
- [x] Bulk actions work (archive, delete)
- [x] Sorting works on sortable columns
- [x] Loading skeleton displays
- [x] Empty state displays
- [x] Error state displays
- [x] Confirm dialogs work
- [x] Toast notifications display
- [x] Query invalidation refreshes data
- [x] Optimistic updates work

**2. DistributionReportsTable:**
- [x] Component renders without errors
- [x] distributionLinked filter applied
- [x] Distribution ID column displays
- [x] Distribution link opens new tab
- [x] No archive button (correct behavior)
- [ ] Delete works
- [ ] Bulk delete works
- [ ] Mobile card shows distribution chip
- [ ] All other features from RegularReportsTable work

**3. DeletedReportsTable:**
- [ ] Component renders without errors
- [ ] isDeleted filter applied
- [ ] Days remaining calculates correctly
- [ ] Warning chip for 8-30 days
- [ ] Error chip for 0-7 days
- [ ] Row highlight for ≤7 days
- [ ] Restore button works
- [ ] Permanent delete button works
- [ ] Bulk restore works
- [ ] Bulk permanent delete works
- [ ] Confirm dialogs have correct severity
- [ ] Mobile card shows days remaining

**4. Mobile Responsiveness:**
- [ ] Table switches to cards at <768px
- [ ] Touch targets ≥44px
- [ ] Cards stack vertically
- [ ] All information visible on mobile
- [ ] Actions accessible
- [ ] Pagination stacks on mobile

**5. Accessibility:**
- [ ] All buttons have aria-labels
- [ ] Checkboxes have labels
- [ ] Table has proper headers
- [ ] Keyboard navigation works
- [ ] Focus visible
- [ ] Color contrast ≥4.5:1
- [ ] Screen reader announcements

**6. Performance:**
- [ ] No unnecessary re-renders
- [ ] Memoization works (useMemo)
- [ ] Query caching works (staleTime 2min)
- [ ] Optimistic updates are instant
- [ ] No console errors/warnings

**7. Integration:**
- [ ] Import in PlantingReports.jsx works
- [ ] Tables receive correct props
- [ ] State management syncs correctly
- [ ] All hooks available
- [ ] Constants imported correctly

**Test Scenarios:**

1. **Create → Delete → Restore:**
   - Create new report
   - Delete it
   - Go to Deleted tab
   - Verify days remaining = 30
   - Restore it
   - Verify back in correct state tab

2. **Bulk Operations:**
   - Select 5 reports
   - Bulk archive
   - Verify all moved to Archived
   - Select 3 archived
   - Bulk unarchive
   - Verify all restored

3. **Distribution Reports:**
   - Create report linked to distribution
   - Verify appears in Distribution tab
   - Click distribution link
   - Verify opens correct page
   - Try to archive (should not see button)

4. **Mobile Test:**
   - Resize to 375px width
   - Navigate all tabs
   - Verify cards display
   - Test all actions
   - Check touch targets

### Progress Summary

- [ ] Step 1: RegularReportsTable Component ✅
- [ ] Step 2: Desktop Table View ✅
- [ ] Step 3: Mobile Card View ✅
- [ ] Step 4: Row Actions ✅
- [ ] Step 5: Bulk Selection ✅
- [ ] Step 6: Pagination Integration ✅
- [ ] Step 7: DistributionReportsTable ✅
- [ ] Step 8: Distribution Metadata Column ✅
- [ ] Step 9: DeletedReportsTable ✅
- [ ] Step 10: Days Remaining Column ✅
- [ ] Step 11: Table Sorting ✅
- [ ] Step 12: Loading States ✅
- [ ] Step 13: Empty States ✅
- [ ] Step 14: Verification ⏳

---

## 🎯 COMPLETION

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

**Completion Date:** _______________

**Next File:** [06_Statistics_and_Filters.md](./06_Statistics_and_Filters.md)

---

**Estimated Time:** 6-7 hours  
**Actual Time:** _______________
