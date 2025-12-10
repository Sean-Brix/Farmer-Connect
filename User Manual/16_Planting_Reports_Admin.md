# PLANTING REPORT MANAGEMENT (ADMIN)

## Planting Reports List Page

[IMAGE PLACEHOLDER: screenshot of planting reports management page]

- Administrators can view, create, and manage farmer planting reports for tracking crop production.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Log in as an Administrator
2. Navigate to "Planting Reports" from the admin sidebar menu
3. View all planting reports displayed in a table or card format showing:
   - Farmer name
   - RSBSA number
   - Farm location
   - Crop type (Rice, Corn, Vegetables, etc.)
   - Cropping season
   - Area planted (hectares)
   - Planting date
   - Harvest date (if completed)
   - Yield (MT/ha if harvested)
   - Status (Active, Archived)
4. Use search bar to find reports by farmer name, RSBSA number, or location
5. Apply filters:
   - Crop type filter
   - Cropping season filter
   - View mode (Active reports or Archived reports)
6. Sort reports by various criteria
7. Click on any report to view full details or edit

**Notes**
- Active reports show current season crop tracking
- Archived reports are historical records for reference
- Statistics dashboard shows key metrics at a glance
- Reports help track agricultural production and support planning

---

## Create Planting Report

[IMAGE PLACEHOLDER: screenshot of create planting report modal]

- Record new planting reports submitted by farmers or agricultural staff.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Planting Reports page, click "Create Report" or "Add New Report" button
2. Fill in the report form with required information:
   - **Farmer Name** (required): Name of the farmer
   - **RSBSA Number**: Farmer's registry number
   - **Farm Location** (required): Address or area where crops are planted
   - **Type of Crop** (required): Select Rice, Corn, Vegetables, etc.
   - **Seed Variety**: Specific variety planted (linked to seed varieties database)
   - **Cropping Season** (required): Select from active seasons
   - **Area Planted** (required): Size of planted area in hectares
   - **Date of Planting** (required): When crops were planted
   - **Expected Harvest Date**: Estimated harvest timeline
3. Optionally add:
   - Number of bags of seeds used
   - Farming techniques or notes
   - Support received (seeds, fertilizers, training, etc.)
4. Review all information for accuracy
5. Click "Create Report" button
6. The new report appears in the active reports list

**Notes**
- RSBSA numbers help link reports to registered farmers
- Seed variety selection helps track which seeds are most successful
- Area planted data is used for production forecasting
- Reports can be edited later as crops progress through stages

---

## Edit Planting Report

[IMAGE PLACEHOLDER: screenshot of edit planting report modal]

- Update existing planting reports with new information as crops progress.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Planting Reports list, locate the report you want to update
2. Click "Edit" button (pencil icon) or click on the report row
3. The edit modal will open with current data pre-filled
4. Update any fields as needed:
   - Growth stage progression
   - Date of harvest (when crops are harvested)
   - Production volume (bags or kilograms harvested)
   - Yield calculation (MT per hectare)
   - Issues or problems encountered
   - Additional notes
5. System may automatically calculate yield based on area and production
6. Click "Save Changes" or "Update Report" button
7. Confirmation message appears upon successful update

**Notes**
- Harvest date and production should be updated after harvest completion
- Yield (MT/ha) is often auto-calculated from area and production volume
- Regular updates help track crop development through seasons
- Historical edits may be logged for audit purposes

---

## View Report Details

[IMAGE PLACEHOLDER: screenshot of detailed report view]

- View comprehensive information about a specific planting report.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Click on any planting report from the list
2. A detailed view displays showing:
   - All farmer and farm information
   - Complete crop details and dates
   - Seed variety information
   - Area planted and expected/actual yields
   - Harvest status and results
   - Any notes or issues recorded
   - Creation and last update timestamps
3. From this view, you can:
   - Edit the report
   - Archive the report
   - Recalculate yield if data changed
   - Print or export report details

**Notes**
- Detailed view provides full audit trail of report history
- Use this view for verification before archiving or reporting
- Export individual reports for farmer records or certification

---

## Archive Planting Report

[IMAGE PLACEHOLDER: screenshot of archive confirmation]

- Move completed planting reports to archived status for historical record-keeping.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Locate a completed planting report (harvest finished, all data recorded)
2. Click "Archive" button next to the report
3. A confirmation dialog will appear
4. Optionally add archive notes or reason
5. Click "Confirm Archive" button
6. Report status changes to "Archived" and moves to archived reports section

**Notes**
- Archiving is recommended for completed past-season reports
- Archived reports are read-only but remain accessible for reference
- Archiving helps keep the active reports list focused on current season
- Archived reports are included in historical analytics and reporting
- Reports can potentially be unarchived if needed

---

## Manage Seasons & Seed Varieties

[IMAGE PLACEHOLDER: screenshot of manage references page]

- Configure cropping seasons and maintain seed variety database for planting reports.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Planting Reports page, click "Manage References" or "Settings" button
2. The management page has two sections:

**Cropping Seasons:**
3. View all defined cropping seasons (Wet Season, Dry Season, etc.)
4. Add new season:
   - Season name (e.g., "Wet Season 2025")
   - Start date and end date
   - Description
   - Active status
5. Edit or deactivate existing seasons

**Seed Varieties:**
6. View all registered seed varieties by crop type
7. Add new seed variety:
   - Variety name
   - Crop type (Rice, Corn, etc.)
   - Description or characteristics
   - Recommended planting practices
8. Edit or remove existing varieties

9. Click "Save" to apply changes

**Notes**
- Active seasons appear in dropdown menus when creating reports
- Seed variety database helps standardize reporting and track performance
- Deactivated seasons/varieties are hidden from new reports but preserved in historical data
- This reference data ensures consistency across all planting reports

---

## Planting Reports Statistics

[IMAGE PLACEHOLDER: screenshot of statistics dashboard]

- View aggregated statistics and analytics from all planting reports.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Statistics are displayed at the top of the Planting Reports page
2. View key metrics including:
   - **Total Active Reports**: Number of current season reports
   - **Total Area Planted**: Sum of all planted hectares
   - **Harvested Reports**: Number of completed harvests
   - **Average Yield**: Mean yield (MT/ha) across all harvested reports
3. Statistics update automatically as reports are added or modified
4. Filter statistics by date range or crop type if available

**Notes**
- Statistics help administrators understand overall agricultural production
- Use metrics for planning distribution programs and support allocation
- Average yield data helps identify high-performing seed varieties
- Data excludes archived reports to focus on current season

---

## Export Planting Reports

[IMAGE PLACEHOLDER: screenshot of export dialog]

- Download planting reports data for external analysis or official reporting.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Planting Reports page, click "Export" or "Download Reports" button
2. Select export parameters:
   - Date range (specific season or custom dates)
   - Crop type filter (all crops or specific type)
   - Include archived reports (yes/no)
   - Format (CSV, Excel, PDF)
3. Click "Generate Export"
4. The file downloads automatically to your device
5. Open with appropriate software for analysis or reporting

**Notes**
- Excel format preserves formatting and allows advanced analysis
- CSV format is ideal for importing into other systems or databases
- PDF format is suitable for printed official reports
- Exported data includes all report fields and calculated metrics
- Use exports for government reporting, agricultural planning, and farmer support programs
