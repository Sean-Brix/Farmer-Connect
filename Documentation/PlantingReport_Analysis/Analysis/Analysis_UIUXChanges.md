# PlantingReport Feature - UI/UX Changes

**Part of:** [Analysis_Overview.md](./Analysis_Overview.md)  
**Last Updated:** December 24, 2025

---

## Component Architecture Redesign

### Current Structure (Problematic)
```
PlantingReport/
├── PlantingReports.jsx (589 lines) - Monolithic orchestrator
├── ReportModal.jsx (812 lines) - ⚠️ CRITICAL ISSUE
├── ManageReferences.jsx (706 lines) - Separate page
├── VarietyModal.jsx
└── SeasonModal.jsx
```

### New Modular Structure

```
PlantingReport/
├── PlantingReports.jsx (300 lines) - Main orchestrator
├── components/
│   ├── Tables/
│   │   ├── RegularReportsTable.jsx (200 lines)
│   │   ├── DistributionReportsTable.jsx (220 lines)
│   │   └── DeletedReportsTable.jsx (180 lines)
│   ├── ReportModal/
│   │   ├── index.jsx (150 lines) - Modal orchestrator
│   │   ├── StateWorkflowIndicator.jsx (80 lines)
│   │   ├── FarmerInfoSection.jsx (100 lines)
│   │   ├── SeedingDetailsSection.jsx (120 lines)
│   │   ├── PlantingDetailsSection.jsx (100 lines)
│   │   ├── HarvestingSection.jsx (120 lines)
│   │   └── DistributionMetadata.jsx (60 lines)
│   ├── ReferenceManagementPanel/
│   │   ├── index.jsx (150 lines) - Inline collapsible panel
│   │   ├── VarietiesTab.jsx (180 lines)
│   │   ├── SeasonsTab.jsx (180 lines)
│   │   ├── VarietyModal.jsx (100 lines)
│   │   ├── SeasonModal.jsx (100 lines)
│   │   └── ViewReportsModal.jsx (150 lines)
│   ├── Filters/
│   │   ├── FilterPanel.jsx (120 lines)
│   │   └── GlobalSearch.jsx (80 lines)
│   └── Statistics/
│       └── StatisticsCards.jsx (100 lines)
├── hooks/
│   ├── usePlantingReportQueries.js (200 lines) - Tanstack Query
│   ├── useReportForm.js (180 lines) - Form state management
│   ├── useStateTransitions.js (100 lines) - State logic
│   ├── useAutoCalculations.js (80 lines) - Yield calculations
│   └── usePagination.js (60 lines)
└── validation/
    ├── reportSchema.js (150 lines) - Joi/Zod schemas
    └── stateTransitionRules.js (120 lines)
```

---

## Main Dashboard: PlantingReports.jsx

### Tab Structure

```javascript
const [mainTab, setMainTab] = useState('regular');
const [stateFilter, setStateFilter] = useState('all');

// Main Level Tabs
<Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}>
  <Tab 
    label={`All Reports (${regularCount})`} 
    value="regular" 
  />
  <Tab 
    label={`Distribution Reports (${distributionCount})`} 
    value="distribution" 
  />
  <Tab 
    label={`Deleted (${deletedCount})`} 
    value="deleted" 
  />
</Tabs>

// State Sub-tabs (for Regular and Distribution tabs only)
{mainTab !== 'deleted' && (
  <Tabs value={stateFilter} onChange={(e, v) => setStateFilter(v)}>
    <Tab label={`All (${allCount})`} value="all" />
    <Tab label={`Request (${requestCount})`} value="Request_Report" />
    <Tab label={`Planted (${plantedCount})`} value="Planted" />
    <Tab label={`Completed (${completedCount})`} value="Completed" />
    <Tab label={`Archived (${archivedCount})`} value="archived" />
  </Tabs>
)}
```

### Layout Structure

```jsx
<Box sx={{ p: 3 }}>
  {/* Header */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
    <Typography variant="h4">Planting Reports</Typography>
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button 
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={handleRefresh}
      >
        Refresh
      </Button>
      <Button 
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setModalOpen(true)}
      >
        Create Report
      </Button>
    </Box>
  </Box>

  {/* Statistics Cards */}
  <StatisticsCards 
    reports={filteredReports}
    mainTab={mainTab}
    stateFilter={stateFilter}
  />

  {/* Main Tabs */}
  <Paper sx={{ mt: 3 }}>
    <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}>
      <Tab label="All Reports" value="regular" />
      <Tab label="Distribution Reports" value="distribution" />
      <Tab label="Deleted" value="deleted" />
    </Tabs>

    {/* State Sub-Tabs */}
    {mainTab !== 'deleted' && (
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
        <Tabs value={stateFilter} onChange={(e, v) => setStateFilter(v)} variant="scrollable">
          <Tab label="All" value="all" />
          <Tab label="Request" value="Request_Report" />
          <Tab label="Planted" value="Planted" />
          <Tab label="Completed" value="Completed" />
          <Tab label="Archived" value="archived" />
        </Tabs>
      </Box>
    )}

    {/* Filter Panel */}
    <FilterPanel
      filters={filters}
      onFilterChange={setFilters}
      onClear={handleClearFilters}
    />

    {/* Global Search */}
    <Box sx={{ p: 2 }}>
      <GlobalSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by farmer, location, RSBSA..."
        excludeArchived={stateFilter !== 'archived'}
      />
    </Box>

    {/* Table Content */}
    {mainTab === 'regular' && (
      <RegularReportsTable
        reports={filteredReports}
        stateFilter={stateFilter}
        onView={handleViewReport}
        onEdit={handleEditReport}
        onDelete={handleDeleteReport}
        onArchive={handleArchiveReport}
      />
    )}

    {mainTab === 'distribution' && (
      <DistributionReportsTable
        reports={filteredReports}
        stateFilter={stateFilter}
        onView={handleViewReport}
        onEdit={handleEditReport}
        onDelete={handleDeleteReport}
        onArchive={handleArchiveReport}
        onViewDistribution={handleViewDistribution}
      />
    )}

    {mainTab === 'deleted' && (
      <DeletedReportsTable
        reports={deletedReports}
        onRestore={handleRestoreReport}
        onPermanentDelete={handlePermanentDelete}
      />
    )}

    {/* Pagination */}
    <TablePagination
      component="div"
      count={pagination.total}
      page={pagination.page - 1}
      onPageChange={(e, newPage) => handlePageChange(newPage + 1)}
      rowsPerPage={pagination.limit}
      onRowsPerPageChange={(e) => handleLimitChange(parseInt(e.target.value))}
      rowsPerPageOptions={[10, 25, 50, 100]}
    />
  </Paper>

  {/* Reference Management Panel (Inline Collapsible) */}
  <ReferenceManagementPanel />

  {/* Modals */}
  <ReportModal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    report={selectedReport}
    mode={modalMode}
  />
</Box>
```

---

## Table Components

### RegularReportsTable.jsx

**Purpose:** Display manually created planting reports

**Columns:**
- Farmer Name
- Location
- RSBSA
- Crop Type
- Variety
- Season
- Planted Area (ha)
- Planting Date
- State (Badge with color)
- Actions

**State-Based Row Styling:**
```javascript
const getRowStyle = (report) => {
  if (report.isArchived) return { bgcolor: 'grey.100' };
  
  switch (report.state) {
    case 'Request_Report':
      return { bgcolor: 'warning.lighter' }; // Yellow tint
    case 'Planted':
      return { bgcolor: 'info.lighter' }; // Blue tint
    case 'Completed':
      return { bgcolor: 'success.lighter' }; // Green tint
    default:
      return {};
  }
};
```

**Actions:**
```jsx
<TableCell>
  <IconButton onClick={() => onView(report)} size="small">
    <VisibilityIcon />
  </IconButton>
  <IconButton onClick={() => onEdit(report)} size="small" disabled={report.isArchived}>
    <EditIcon />
  </IconButton>
  <IconButton onClick={() => onDelete(report)} size="small" disabled={report.isArchived}>
    <DeleteIcon />
  </IconButton>
  {report.state === 'Completed' && !report.isArchived && (
    <IconButton onClick={() => onArchive(report)} size="small">
      <ArchiveIcon />
    </IconButton>
  )}
  {report.isArchived && (
    <IconButton onClick={() => onUnarchive(report)} size="small">
      <UnarchiveIcon />
    </IconButton>
  )}
</TableCell>
```

### DistributionReportsTable.jsx

**Purpose:** Display reports created from distribution requests

**Additional Columns:**
- Distribution ID (with link)
- Distributed Quantity
- "View Request" button

**Enhanced Actions:**
```jsx
<TableCell>
  <Button
    size="small"
    variant="outlined"
    onClick={() => onViewDistribution(report.distributionRequestId)}
    startIcon={<LinkIcon />}
  >
    View Distribution
  </Button>
</TableCell>
```

### DeletedReportsTable.jsx

**Purpose:** Display soft-deleted reports with recovery options

**Columns:**
- Farmer Name
- Variety
- Deleted Date
- Deleted By
- Days Until Permanent Delete
- Actions (Restore | Permanent Delete)

**Recovery Warning:**
```jsx
<TableCell>
  {daysLeft < 7 ? (
    <Chip 
      label={`${daysLeft} days left`} 
      color="error"
      icon={<WarningIcon />}
    />
  ) : (
    <Chip label={`${daysLeft} days`} color="warning" />
  )}
</TableCell>
```

---

## Report Modal Redesign

### State-Based Workflow Indicator

```jsx
// StateWorkflowIndicator.jsx
const StateWorkflowIndicator = ({ currentState, onStateClick }) => {
  const steps = [
    { state: 'Request_Report', label: 'Request', icon: <RequestIcon /> },
    { state: 'Planted', label: 'Planted', icon: <PlantedIcon /> },
    { state: 'Completed', label: 'Completed', icon: <CompletedIcon /> },
    { state: 'Archived', label: 'Archived', icon: <ArchiveIcon /> }
  ];

  return (
    <Stepper activeStep={getStepIndex(currentState)} alternativeLabel>
      {steps.map((step, index) => (
        <Step key={step.state} completed={index < getStepIndex(currentState)}>
          <StepLabel 
            icon={step.icon}
            onClick={() => onStateClick?.(step.state)}
          >
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};
```

### Modal Structure with State-Based Rendering

```jsx
// ReportModal/index.jsx
const ReportModal = ({ open, onClose, report, mode }) => {
  const { formData, updateField, validate, errors } = useReportForm(report);
  const { canTransition, transitionTo } = useStateTransitions(formData);
  const { yieldMtPerHa, expectedHarvest } = useAutoCalculations(formData);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {mode === 'create' ? 'Create' : mode === 'edit' ? 'Edit' : 'View'} Planting Report
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Workflow Indicator */}
        <StateWorkflowIndicator 
          currentState={formData.state}
          onStateClick={handleStateInfoClick}
        />

        <Divider sx={{ my: 3 }} />

        {/* Distribution Metadata (if linked) */}
        {formData.distributionRequestId && (
          <>
            <DistributionMetadata report={formData} />
            <Divider sx={{ my: 3 }} />
          </>
        )}

        {/* Section 1: Farmer Information (Always Visible) */}
        <FarmerInfoSection
          data={formData}
          onChange={updateField}
          errors={errors}
          editable={mode !== 'view' && !formData.isArchived}
        />

        <Divider sx={{ my: 3 }} />

        {/* Section 2: Seeding Details (Always Visible) */}
        <SeedingDetailsSection
          data={formData}
          onChange={updateField}
          errors={errors}
          editable={mode !== 'view' && !formData.isArchived}
        />

        {/* Section 3: Planting Details (State 2+ only) */}
        {formData.state !== 'Request_Report' && (
          <>
            <Divider sx={{ my: 3 }} />
            <PlantingDetailsSection
              data={formData}
              onChange={updateField}
              errors={errors}
              editable={
                mode !== 'view' && 
                !formData.isArchived &&
                formData.state === 'Request_Report' // Can edit in Request state
              }
              autoCalculatedHarvest={expectedHarvest}
            />
          </>
        )}

        {/* Section 4: Harvesting Information (State 3 only) */}
        {formData.state === 'Completed' && (
          <>
            <Divider sx={{ my: 3 }} />
            <HarvestingSection
              data={formData}
              onChange={updateField}
              errors={errors}
              editable={mode !== 'view' && !formData.isArchived}
              autoCalculatedYield={yieldMtPerHa}
            />
          </>
        )}

        {/* Helper Text for State Transitions */}
        {formData.state === 'Request_Report' && mode === 'edit' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            To mark as <strong>Planted</strong>, fill in: Planting Date, Planting Method
            {formData.typeOfCrop === 'Rice' && ', Rice Irrigation'}
          </Alert>
        )}

        {formData.state === 'Planted' && mode === 'edit' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            To mark as <strong>Completed</strong>, fill in: Harvest Area, Number of Bags, Weight Per Bag
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Box>
          {/* State Transition Buttons (Left Side) */}
          {mode === 'edit' && !formData.isArchived && (
            <>
              {canTransition('Planted') && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => transitionTo('Planted')}
                >
                  Mark as Planted
                </Button>
              )}
              {canTransition('Completed') && (
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => transitionTo('Completed')}
                  sx={{ ml: 1 }}
                >
                  Mark as Completed
                </Button>
              )}
              {formData.state === 'Completed' && !formData.isArchived && (
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleArchive}
                  sx={{ ml: 1 }}
                >
                  Archive Report
                </Button>
              )}
            </>
          )}
        </Box>

        <Box>
          {/* Save/Cancel Buttons (Right Side) */}
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          {mode !== 'view' && (
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={Object.keys(errors).length > 0}
            >
              Save
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};
```

---

## Modal Sections

### FarmerInfoSection.jsx

```jsx
const FarmerInfoSection = ({ data, onChange, errors, editable }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Farmer Information
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          label="Farmer Name"
          value={data.farmerName}
          onChange={(e) => onChange('farmerName', e.target.value)}
          error={!!errors.farmerName}
          helperText={errors.farmerName}
          required
          fullWidth
          disabled={!editable}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Location"
          value={data.location}
          onChange={(e) => onChange('location', e.target.value)}
          error={!!errors.location}
          helperText={errors.location}
          required
          fullWidth
          disabled={!editable}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="RSBSA Number"
          value={data.rsbsa}
          onChange={(e) => onChange('rsbsa', e.target.value)}
          error={!!errors.rsbsa}
          helperText={errors.rsbsa}
          fullWidth
          disabled={!editable}
        />
      </Grid>
    </Grid>
  </Box>
);
```

### SeedingDetailsSection.jsx

```jsx
const SeedingDetailsSection = ({ data, onChange, errors, editable }) => {
  const { varieties } = usePlantingReportQueries();
  const { seasons } = usePlantingReportQueries();

  const filteredVarieties = varieties?.filter(v => 
    v.cropType === data.typeOfCrop && v.isActive
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Seeding Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth required error={!!errors.typeOfCrop}>
            <InputLabel>Crop Type</InputLabel>
            <Select
              value={data.typeOfCrop}
              onChange={(e) => onChange('typeOfCrop', e.target.value)}
              disabled={!editable}
            >
              <MenuItem value="Rice">Rice</MenuItem>
              <MenuItem value="Corn">Corn</MenuItem>
              <MenuItem value="HighValue">High Value</MenuItem>
            </Select>
            {errors.typeOfCrop && <FormHelperText>{errors.typeOfCrop}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth required error={!!errors.varietyId}>
            <InputLabel>Variety</InputLabel>
            <Select
              value={data.varietyId}
              onChange={(e) => onChange('varietyId', e.target.value)}
              disabled={!editable || !data.typeOfCrop}
            >
              {filteredVarieties?.map(v => (
                <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
              ))}
            </Select>
            {errors.varietyId && <FormHelperText>{errors.varietyId}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth required error={!!errors.seasonId}>
            <InputLabel>Season</InputLabel>
            <Select
              value={data.seasonId}
              onChange={(e) => onChange('seasonId', e.target.value)}
              disabled={!editable}
            >
              {seasons?.filter(s => s.isActive).map(s => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </Select>
            {errors.seasonId && <FormHelperText>{errors.seasonId}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Area to Plant (hectares)"
            type="number"
            value={data.areaPlanted}
            onChange={(e) => onChange('areaPlanted', parseFloat(e.target.value))}
            error={!!errors.areaPlanted}
            helperText={errors.areaPlanted}
            required
            fullWidth
            disabled={!editable}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
```

### PlantingDetailsSection.jsx (State 2+)

```jsx
const PlantingDetailsSection = ({ 
  data, 
  onChange, 
  errors, 
  editable, 
  autoCalculatedHarvest 
}) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Planting Details
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          label="Date of Planting"
          type="date"
          value={data.dateOfPlanting?.split('T')[0] || ''}
          onChange={(e) => onChange('dateOfPlanting', e.target.value)}
          error={!!errors.dateOfPlanting}
          helperText={errors.dateOfPlanting}
          required
          fullWidth
          disabled={!editable}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: new Date().toISOString().split('T')[0] }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth required error={!!errors.plantingMethod}>
          <InputLabel>Planting Method</InputLabel>
          <Select
            value={data.plantingMethod || ''}
            onChange={(e) => onChange('plantingMethod', e.target.value)}
            disabled={!editable}
          >
            <MenuItem value="Transplanted">Transplanted</MenuItem>
            <MenuItem value="Direct_Seeded">Direct Seeded</MenuItem>
          </Select>
          {errors.plantingMethod && <FormHelperText>{errors.plantingMethod}</FormHelperText>}
        </FormControl>
      </Grid>

      {data.typeOfCrop === 'Rice' && (
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required error={!!errors.riceIrrigation}>
            <InputLabel>Rice Irrigation</InputLabel>
            <Select
              value={data.riceIrrigation || ''}
              onChange={(e) => onChange('riceIrrigation', e.target.value)}
              disabled={!editable}
            >
              <MenuItem value="Irrigated">Irrigated</MenuItem>
              <MenuItem value="Rainfed">Rainfed</MenuItem>
            </Select>
            {errors.riceIrrigation && <FormHelperText>{errors.riceIrrigation}</FormHelperText>}
          </FormControl>
        </Grid>
      )}

      {autoCalculatedHarvest && (
        <Grid item xs={12} md={6}>
          <TextField
            label="Expected Harvest Date"
            type="date"
            value={autoCalculatedHarvest}
            fullWidth
            disabled
            InputLabelProps={{ shrink: true }}
            helperText="Auto-calculated based on variety maturity days"
          />
        </Grid>
      )}
    </Grid>
  </Box>
);
```

### HarvestingSection.jsx (State 3 only)

```jsx
const HarvestingSection = ({ 
  data, 
  onChange, 
  errors, 
  editable, 
  autoCalculatedYield 
}) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Harvesting Information
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <TextField
          label="Harvest Area (hectares)"
          type="number"
          value={data.harvestArea || ''}
          onChange={(e) => onChange('harvestArea', parseFloat(e.target.value))}
          error={!!errors.harvestArea}
          helperText={errors.harvestArea || `Max: ${data.areaPlanted} ha`}
          required
          fullWidth
          disabled={!editable}
          inputProps={{ min: 0, max: data.areaPlanted, step: 0.01 }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          label="Number of Bags"
          type="number"
          value={data.numberOfBags || ''}
          onChange={(e) => onChange('numberOfBags', parseInt(e.target.value))}
          error={!!errors.numberOfBags}
          helperText={errors.numberOfBags}
          required
          fullWidth
          disabled={!editable}
          inputProps={{ min: 0, step: 1 }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          label="Weight Per Bag (kg)"
          type="number"
          value={data.weightPerBag || ''}
          onChange={(e) => onChange('weightPerBag', parseFloat(e.target.value))}
          error={!!errors.weightPerBag}
          helperText={errors.weightPerBag}
          required
          fullWidth
          disabled={!editable}
          inputProps={{ min: 0, step: 0.1 }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Yield (Mt/Ha)"
          type="number"
          value={autoCalculatedYield?.toFixed(2) || ''}
          fullWidth
          disabled
          helperText="Auto-calculated: (Harvest Area × Number of Bags × Weight Per Bag) / 1000"
          InputProps={{
            startAdornment: <InputAdornment position="start">📊</InputAdornment>,
          }}
        />
      </Grid>
    </Grid>
  </Box>
);
```

### DistributionMetadata.jsx

```jsx
const DistributionMetadata = ({ report }) => {
  const navigate = useNavigate();

  return (
    <Alert severity="info" sx={{ mb: 2 }}>
      <AlertTitle>Distribution Report</AlertTitle>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2">
            <strong>Distribution ID:</strong> {report.distributionRequestId}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body2">
            <strong>Distributed Quantity:</strong> {report.distributedQuantity} kg
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate(`/admin/distribution/${report.distributionRequestId}`)}
            startIcon={<LinkIcon />}
          >
            View Distribution Request
          </Button>
        </Grid>
      </Grid>
    </Alert>
  );
};
```

---

## Reference Management Panel

### Inline Collapsible Panel

```jsx
// ReferenceManagementPanel/index.jsx
const ReferenceManagementPanel = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Paper sx={{ mt: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          cursor: 'pointer',
          bgcolor: 'primary.light',
          color: 'primary.contrastText'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon />
          <Typography variant="h6">Reference Management</Typography>
        </Box>
        <IconButton size="small" sx={{ color: 'inherit' }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
            <Tab label="Varieties" />
            <Tab label="Seasons" />
          </Tabs>

          {activeTab === 0 && <VarietiesTab />}
          {activeTab === 1 && <SeasonsTab />}
        </Box>
      </Collapse>
    </Paper>
  );
};
```

### VarietiesTab with "View Reports" Feature

```jsx
const VarietiesTab = () => {
  const { varieties, deleteVariety, toggleActive } = usePlantingReportQueries();
  const [viewReportsModal, setViewReportsModal] = useState({ open: false, variety: null });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1">Seed Varieties</Typography>
        <Button variant="contained" onClick={() => setVarietyModalOpen(true)}>
          + Add Variety
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Crop Type</TableCell>
            <TableCell>DAS (Dry)</TableCell>
            <TableCell>DAS (Wet)</TableCell>
            <TableCell>Reports Using</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {varieties?.map(variety => (
            <TableRow key={variety.id}>
              <TableCell>{variety.name}</TableCell>
              <TableCell>{variety.cropType}</TableCell>
              <TableCell>{variety.daysToMaturityDry}</TableCell>
              <TableCell>{variety.daysToMaturityWet || '-'}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => setViewReportsModal({ open: true, variety })}
                >
                  {variety._count?.plantingReports || 0} reports
                </Button>
              </TableCell>
              <TableCell>
                <Switch
                  checked={variety.isActive}
                  onChange={() => toggleActive('variety', variety.id)}
                  color="primary"
                />
                <Chip 
                  label={variety.isActive ? 'Active' : 'Inactive'}
                  color={variety.isActive ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(variety)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(variety)} size="small">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ViewReportsModal
        open={viewReportsModal.open}
        onClose={() => setViewReportsModal({ open: false, variety: null })}
        variety={viewReportsModal.variety}
      />
    </Box>
  );
};
```

---

## Filter & Search Components

### FilterPanel.jsx

```jsx
const FilterPanel = ({ filters, onFilterChange, onClear }) => {
  const { varieties, seasons } = usePlantingReportQueries();

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Crop Type</InputLabel>
            <Select
              value={filters.cropType || ''}
              onChange={(e) => onFilterChange('cropType', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Rice">Rice</MenuItem>
              <MenuItem value="Corn">Corn</MenuItem>
              <MenuItem value="HighValue">High Value</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Variety</InputLabel>
            <Select
              value={filters.varietyId || ''}
              onChange={(e) => onFilterChange('varietyId', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {varieties?.filter(v => 
                !filters.cropType || v.cropType === filters.cropType
              ).map(v => (
                <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Season</InputLabel>
            <Select
              value={filters.seasonId || ''}
              onChange={(e) => onFilterChange('seasonId', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {seasons?.map(s => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <Button variant="outlined" onClick={onClear} fullWidth>
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
```

### GlobalSearch.jsx

```jsx
const GlobalSearch = ({ value, onChange, placeholder, excludeArchived }) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => onChange('')}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
      helperText={
        excludeArchived 
          ? "Search across all tabs (archived excluded)" 
          : "Search all reports including archived"
      }
    />
  );
};
```

---

## Statistics Cards

```jsx
const StatisticsCards = ({ reports, mainTab, stateFilter }) => {
  const stats = useMemo(() => {
    const filtered = reports.filter(r => {
      if (mainTab === 'deleted') return r.isDeleted;
      if (stateFilter === 'archived') return r.isArchived;
      if (stateFilter !== 'all') return r.state === stateFilter;
      return !r.isArchived && !r.isDeleted;
    });

    return {
      total: filtered.length,
      totalArea: filtered.reduce((sum, r) => sum + (r.areaPlanted || 0), 0),
      totalHarvestArea: filtered.reduce((sum, r) => sum + (r.harvestArea || 0), 0),
      avgYield: calculateAvgYield(filtered.filter(r => r.typeOfCrop === 'Rice'))
    };
  }, [reports, mainTab, stateFilter]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Reports"
          value={stats.total}
          icon={<AssignmentIcon />}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Area (ha)"
          value={stats.totalArea.toFixed(2)}
          icon={<LandscapeIcon />}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Harvest (ha)"
          value={stats.totalHarvestArea.toFixed(2)}
          icon={<AgricultureIcon />}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Avg Yield (Rice)"
          value={stats.avgYield?.toFixed(2) || '-'}
          icon={<TrendingUpIcon />}
          color="info"
        />
      </Grid>
    </Grid>
  );
};
```

---

## Summary

**Component Count Reduction:**
- Before: 3 large files (589 + 812 + 706 = 2,107 lines)
- After: 20+ focused components (~100-200 lines each)

**Benefits:**
- ✅ Maintainable codebase (all components < 250 lines)
- ✅ Testable in isolation
- ✅ State-based UI rendering
- ✅ Clear separation of concerns
- ✅ Reusable hooks and components

**Next:** [Analysis_ValidationRules.md](./Analysis_ValidationRules.md)
