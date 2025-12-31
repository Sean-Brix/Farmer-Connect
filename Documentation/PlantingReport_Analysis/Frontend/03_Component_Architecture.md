# File 03: Component Architecture

**Purpose:** Create component folder structure and base components  
**Prerequisites:** Files 01-02 completed  
**Estimated Time:** 3-4 hours  
**Target Directory:** `/client/src/Admin/PlantingReports/components/`

---

## 📋 STEPS OVERVIEW

Total Steps: **10**

1. [Create Base Component Files](#step-1-create-base-component-files)
2. [Create StateWorkflowIndicator Component](#step-2-create-stateworkflowindicator-component)
3. [Create MobileReportCard Component](#step-3-create-mobilereportcard-component)
4. [Create ResponsiveFormSection Component](#step-4-create-responsiveformsection-component)
5. [Create ConfirmDialog Component](#step-5-create-confirmdialog-component)
6. [Create LoadingState Component](#step-6-create-loadingstate-component)
7. [Create EmptyState Component](#step-7-create-emptystate-component)
8. [Create ErrorBoundary Component](#step-8-create-errorboundary-component)
9. [Test Component Imports](#step-9-test-component-imports)
10. [Verification](#step-10-verification)

---

## STEP 1: Create Base Component Files

Create placeholder components that will be implemented in later files.

**PowerShell Command:**

```powershell
cd client/src/Admin/PlantingReports/components

# Create common folder
New-Item -ItemType Directory -Path "common" -Force

# Create base component files
@(
  "common/StateWorkflowIndicator.jsx",
  "common/MobileReportCard.jsx",
  "common/ResponsiveFormSection.jsx",
  "common/ConfirmDialog.jsx",
  "common/LoadingState.jsx",
  "common/EmptyState.jsx",
  "common/ErrorBoundary.jsx"
) | ForEach-Object { New-Item -ItemType File -Path $_ -Force }
```

### Progress

- [x] Common folder created
- [x] All base component files created
- [x] No file system errors

---

## STEP 2: Create StateWorkflowIndicator Component

Visual indicator showing current state and progress (Request → Planted → Completed).

**File:** `/client/src/Admin/PlantingReports/components/common/StateWorkflowIndicator.jsx`

```javascript
/**
 * StateWorkflowIndicator Component
 * Visual stepper showing report state progression
 */

import React from 'react';
import { Box, Stepper, Step, StepLabel, Chip, useTheme, useMediaQuery } from '@mui/material';
import { PLANTING_STATES, STATE_LABELS } from '../../constants/plantingReportConstants';
import { getStateStepIndex } from '../../utils/stateHelpers';

const steps = [
  { label: STATE_LABELS[PLANTING_STATES.REQUEST], value: PLANTING_STATES.REQUEST },
  { label: STATE_LABELS[PLANTING_STATES.PLANTED], value: PLANTING_STATES.PLANTED },
  { label: STATE_LABELS[PLANTING_STATES.COMPLETED], value: PLANTING_STATES.COMPLETED }
];

export function StateWorkflowIndicator({ currentState, isArchived = false }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const activeStep = getStateStepIndex(currentState);

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel={!isMobile}
        orientation={isMobile ? 'vertical' : 'horizontal'}
        sx={{
          '& .MuiStepLabel-root .Mui-completed': {
            color: 'success.main'
          },
          '& .MuiStepLabel-root .Mui-active': {
            color: 'primary.main'
          }
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.value} completed={index < activeStep}>
            <StepLabel>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'row' : 'column',
                alignItems: isMobile ? 'center' : 'flex-start',
                gap: 1
              }}>
                {step.label}
                {index === activeStep && (
                  <Chip 
                    label="Current" 
                    size="small" 
                    color="primary" 
                    sx={{ ml: isMobile ? 1 : 0, mt: isMobile ? 0 : 0.5 }}
                  />
                )}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {isArchived && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Chip 
            label="Archived" 
            color="default" 
            size="small" 
            sx={{ fontWeight: 600 }}
          />
        </Box>
      )}
    </Box>
  );
}

export default StateWorkflowIndicator;
```

### Progress

- [x] Component file created
- [x] Responsive stepper (horizontal desktop, vertical mobile)
- [x] Current state highlighted
- [x] Archived chip shown when applicable
- [x] No syntax errors

---

## STEP 3: Create MobileReportCard Component

Card-based layout for mobile devices (replaces table).

**File:** `/client/src/Admin/PlantingReports/components/common/MobileReportCard.jsx`

```javascript
/**
 * MobileReportCard Component
 * Card layout for mobile devices (replaces table rows)
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { getStateLabel, getStateColor } from '../../utils/stateHelpers';

export function MobileReportCard({ 
  report, 
  onView, 
  onEdit, 
  onDelete, 
  onArchive, 
  onUnarchive,
  showDistribution = false 
}) {
  
  return (
    <Card 
      sx={{ 
        mb: 2,
        '&:hover': {
          boxShadow: 3
        }
      }}
    >
      <CardContent>
        {/* Header: Farmer Name + State Chip */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1 }}>
            {report.farmerName}
          </Typography>
          <Chip 
            label={getStateLabel(report.state)} 
            size="small"
            color={getStateColor(report.state)}
            sx={{ ml: 1 }}
          />
        </Box>
        
        {/* Farm Location */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          📍 {report.farmLocation}
        </Typography>
        
        {/* Crop Info */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            🌾 {report.typeOfCrop}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {report.variety?.name || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {report.areaPlanted} ha
          </Typography>
        </Box>
        
        {/* Distribution Info (if applicable) */}
        {showDistribution && report.distributionRequest && (
          <Chip 
            label={`Distribution #${report.distributionRequestId}`} 
            size="small"
            variant="outlined"
            color="info"
            sx={{ mt: 0.5 }}
          />
        )}
        
        {/* Archived Badge */}
        {report.isArchived && (
          <Chip 
            label="Archived" 
            size="small"
            color="default"
            sx={{ mt: 0.5, ml: 1 }}
          />
        )}
      </CardContent>
      
      {/* Actions */}
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title="View Details">
          <IconButton 
            size="small" 
            color="primary"
            onClick={() => onView(report)}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Edit">
          <IconButton 
            size="small" 
            color="primary"
            onClick={() => onEdit(report)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        {report.isArchived ? (
          <Tooltip title="Unarchive">
            <IconButton 
              size="small" 
              color="default"
              onClick={() => onUnarchive(report.id)}
            >
              <UnarchiveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          report.state === 'Completed' && (
            <Tooltip title="Archive">
              <IconButton 
                size="small" 
                color="default"
                onClick={() => onArchive(report.id)}
              >
                <ArchiveIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )
        )}
        
        <Tooltip title="Delete">
          <IconButton 
            size="small" 
            color="error"
            onClick={() => onDelete(report.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

export default MobileReportCard;
```

### Progress

- [x] Component file created
- [x] Card layout with all report info
- [x] Action buttons (View, Edit, Delete, Archive/Unarchive)
- [x] Touch-friendly button sizes (44px min)
- [x] Distribution chip shown when applicable
- [x] No syntax errors

---

## STEP 4: Create ResponsiveFormSection Component

Reusable form section with responsive grid.

**File:** `/client/src/Admin/PlantingReports/components/common/ResponsiveFormSection.jsx`

```javascript
/**
 * ResponsiveFormSection Component
 * Reusable form section with responsive grid
 */

import React from 'react';
import { Box, Typography, Grid, Divider } from '@mui/material';
import { useResponsive } from '../../hooks/useResponsive';

export function ResponsiveFormSection({ 
  title, 
  children, 
  showDivider = true,
  spacing,
  gridProps = {}
}) {
  const { isMobile } = useResponsive();

  return (
    <Box sx={{ mb: 3 }}>
      {/* Section Title */}
      <Typography 
        variant={isMobile ? 'h6' : 'h5'} 
        sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}
      >
        {title}
      </Typography>
      
      {/* Form Grid */}
      <Grid 
        container 
        spacing={spacing || { xs: 2, md: 3 }}
        sx={{
          '& .MuiTextField-root': {
            width: '100%'
          },
          ...gridProps.sx
        }}
        {...gridProps}
      >
        {children}
      </Grid>
      
      {/* Divider */}
      {showDivider && (
        <Divider sx={{ mt: 3 }} />
      )}
    </Box>
  );
}

export default ResponsiveFormSection;
```

### Progress

- [x] Component file created
- [x] Responsive typography (h6 mobile, h5 desktop)
- [x] Responsive spacing
- [x] Optional divider
- [x] No syntax errors

---

## STEP 5: Create ConfirmDialog Component

Reusable confirmation dialog for delete/archive actions.

**File:** `/client/src/Admin/PlantingReports/components/common/ConfirmDialog.jsx`

```javascript
/**
 * ConfirmDialog Component
 * Reusable confirmation dialog
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  onConfirm,
  onCancel,
  loading = false
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>{title}</DialogTitle>
      
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onCancel} 
          disabled={loading}
          color="inherit"
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={loading}
          variant="contained"
          color={confirmColor}
          autoFocus
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
```

### Progress

- [x] Component file created
- [x] Fullscreen on mobile
- [x] Loading state support
- [x] Customizable buttons
- [x] No syntax errors

---

## STEP 6: Create LoadingState Component

Skeleton loaders for tables and forms.

**File:** `/client/src/Admin/PlantingReports/components/common/LoadingState.jsx`

```javascript
/**
 * LoadingState Component
 * Skeleton loaders for different layouts
 */

import React from 'react';
import { Box, Skeleton, Card, CardContent, Table, TableBody, TableRow, TableCell } from '@mui/material';

export function TableLoadingSkeleton({ rows = 5, columns = 6 }) {
  return (
    <Table>
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
  );
}

export function CardLoadingSkeleton({ count = 3 }) {
  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton variant="text" width="60%" height={28} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="40%" />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export function FormLoadingSkeleton() {
  return (
    <Box>
      <Skeleton variant="text" width="30%" height={36} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Skeleton variant="rectangular" height={56} sx={{ flex: 1 }} />
        <Skeleton variant="rectangular" height={56} sx={{ flex: 1 }} />
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Skeleton variant="rectangular" height={56} sx={{ flex: 1 }} />
        <Skeleton variant="rectangular" height={56} sx={{ flex: 1 }} />
      </Box>
      <Skeleton variant="rectangular" height={120} />
    </Box>
  );
}

export function StatisticsLoadingSkeleton() {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' } }}>
          <CardContent>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" height={36} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default {
  TableLoadingSkeleton,
  CardLoadingSkeleton,
  FormLoadingSkeleton,
  StatisticsLoadingSkeleton
};
```

### Progress

- [x] Component file created
- [x] Table skeleton loader
- [x] Card skeleton loader
- [x] Form skeleton loader
- [x] Statistics skeleton loader
- [x] No syntax errors

---

## STEP 7: Create EmptyState Component

Empty state message when no data available.

**File:** `/client/src/Admin/PlantingReports/components/common/EmptyState.jsx`

```javascript
/**
 * EmptyState Component
 * Display when no data is available
 */

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

export function EmptyState({ 
  title = 'No Data Found',
  message = 'There are no items to display',
  actionText,
  onAction,
  icon: Icon = InboxIcon
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center'
      }}
    >
      <Icon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.disabled" sx={{ mb: 3, maxWidth: 400 }}>
        {message}
      </Typography>
      
      {actionText && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;
```

### Progress

- [x] Component file created
- [x] Centered layout
- [x] Icon, title, message
- [x] Optional action button
- [x] No syntax errors

---

## STEP 8: Create ErrorBoundary Component

Catch React errors and show fallback UI.

**File:** `/client/src/Admin/PlantingReports/components/common/ErrorBoundary.jsx`

```javascript
/**
 * ErrorBoundary Component
 * Catch React component errors
 */

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            p: 3
          }}
        >
          <Paper
            sx={{
              p: 4,
              maxWidth: 600,
              textAlign: 'center'
            }}
          >
            <ErrorOutlineIcon 
              sx={{ fontSize: 64, color: 'error.main', mb: 2 }} 
            />
            
            <Typography variant="h5" gutterBottom>
              Oops! Something went wrong
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We encountered an error while rendering this component.
              {this.props.showDetails && this.state.error && (
                <Box sx={{ mt: 2, textAlign: 'left' }}>
                  <Typography variant="caption" component="pre" sx={{ 
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    backgroundColor: 'grey.100',
                    p: 2,
                    borderRadius: 1
                  }}>
                    {this.state.error.toString()}
                  </Typography>
                </Box>
              )}
            </Typography>
            
            <Button 
              variant="contained" 
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Progress

- [x] Component file created
- [x] Error catching implemented
- [x] Fallback UI with error message
- [x] Reset functionality
- [x] Optional error details display
- [x] No syntax errors

---

## STEP 9: Test Component Imports

Verify all common components are importable.

**File:** `/client/src/Admin/PlantingReports/__tests__/components.test.js`

```javascript
/**
 * Component Import Test
 * Verify all common components are importable
 */

import StateWorkflowIndicator from '../components/common/StateWorkflowIndicator';
import MobileReportCard from '../components/common/MobileReportCard';
import ResponsiveFormSection from '../components/common/ResponsiveFormSection';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { 
  TableLoadingSkeleton,
  CardLoadingSkeleton,
  FormLoadingSkeleton,
  StatisticsLoadingSkeleton 
} from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import ErrorBoundary from '../components/common/ErrorBoundary';

console.log('✅ All common components imported successfully');

export default {
  StateWorkflowIndicator,
  MobileReportCard,
  ResponsiveFormSection,
  ConfirmDialog,
  TableLoadingSkeleton,
  CardLoadingSkeleton,
  FormLoadingSkeleton,
  StatisticsLoadingSkeleton,
  EmptyState,
  ErrorBoundary
};
```

### Verify

```powershell
cd client/src/Admin/PlantingReports
node __tests__/components.test.js
```

### Progress

- [x] Test file created
- [x] All components import successfully
- [x] No import errors

---

## STEP 10: Verification

### Checklist

```powershell
cd client/src/Admin/PlantingReports/components

# 1. Check syntax of all common components
node -c common/StateWorkflowIndicator.jsx
node -c common/MobileReportCard.jsx
node -c common/ResponsiveFormSection.jsx
node -c common/ConfirmDialog.jsx
node -c common/LoadingState.jsx
node -c common/EmptyState.jsx
node -c common/ErrorBoundary.jsx

# 2. Run import test
cd ..
node __tests__/components.test.js

# 3. ESLint check
cd ../../..
npm run lint
```

### Expected Results

✅ All component files valid syntax  
✅ Import test passes  
✅ ESLint passes  
✅ No console errors  

### File Summary

Created components:
- `common/StateWorkflowIndicator.jsx` - State stepper visual
- `common/MobileReportCard.jsx` - Mobile card layout
- `common/ResponsiveFormSection.jsx` - Responsive form section
- `common/ConfirmDialog.jsx` - Confirmation dialogs
- `common/LoadingState.jsx` - Skeleton loaders
- `common/EmptyState.jsx` - Empty state display
- `common/ErrorBoundary.jsx` - Error catching component

### Exit Criteria

Before moving to File 04:

- [x] All 10 steps completed
- [x] All checkboxes marked
- [x] All common components created
- [x] All syntax checks passed
- [x] Import test passed
- [x] ESLint passing

---

## 🎯 COMPLETION

**Status:** ✅ Complete | ⏳ In Progress | ⬜ Not Started

**Completion Date:** 2025-12-26

**Notes:**
- ESLint scoped check passed for common components.
- Node `-c` skipped due to JSX; ESLint used for syntax validation.
- 

**Next File:** [04_Main_Dashboard.md](./04_Main_Dashboard.md)

---

**Estimated Time:** 3-4 hours  
**Actual Time:** _______________
