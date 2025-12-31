# Planting Reports CRUD Testing Checklist

**Date:** December 29, 2025  
**Test Environment:** Development/Staging  
**Tester Name:** _______________

---

## PLANTING REPORTS - CREATE

### [ ] Test 1: Create New Report (Request State)
- Click the green "+" button in bottom-right corner
- Click "Select Farmer" box
- Type farmer name in search box
- Click on a farmer from dropdown list
- Farmer name, contact number, and RSBSA auto-fill
- Click "Type of Crop" dropdown
- Select "Rice" or "Corn" or "High-Value"
- Click "Variety" dropdown
- Select a variety from list
- Click "Cropping Season" dropdown (optional)
- Select a season from list
- Click in "Area Planted" box
- Type a number (example: 2.5)
- Click "Seed Classification" dropdown
- Select classification (example: "Certified")
- Click "Save" button at bottom
- **Expected:** Green success message appears "Report created successfully"
- **Expected:** Modal closes automatically
- **Expected:** New report appears in table
- **Expected:** Report shows in "Request" tab
- **Expected:** Statistics cards update (+1 to Total and Request count)

### [ ] Test 2: Create Report - Required Fields Validation
- Click the green "+" button
- Leave all fields empty
- Click "Save" button
- **Expected:** Red error messages appear under empty required fields
- **Expected:** Error text shows "This field is required"
- **Expected:** Save button does nothing until fields filled
- Fill only "Farmer Name"
- Click "Save" button
- **Expected:** Other required fields still show errors
- **Expected:** Cannot save until all required fields filled

### [ ] Test 3: Create Report - Cancel Creation
- Click the green "+" button
- Fill some fields
- Click "X" button at top-right of modal
- **Expected:** Modal closes immediately
- **Expected:** No data saved
- **Expected:** Table unchanged
- Click "+" button again
- **Expected:** All fields are empty (not showing previous data)

---

## PLANTING REPORTS - READ/VIEW

### [ ] Test 4: View Report Details (View Mode)
- Find any report in table
- Click the eye icon (👁️) in Actions column
- **Expected:** Modal opens showing report details
- **Expected:** All fields are read-only (gray background)
- **Expected:** State workflow stepper shows current state
- **Expected:** No "Save" button visible (only "Close")
- Scroll down to see all sections
- **Expected:** All entered data displays correctly
- Click "Close" button
- **Expected:** Modal closes, returns to table

### [ ] Test 5: View Report from Mobile
- Resize browser to 400px width (press F12, toggle device toolbar)
- **Expected:** Table changes to card layout
- Find any card
- Click anywhere on card
- **Expected:** Full-screen modal opens
- **Expected:** All sections visible in vertical layout
- Swipe/scroll up and down
- **Expected:** Smooth scrolling works
- Click "X" at top
- **Expected:** Returns to card list

### [ ] Test 6: View Report Statistics
- Look at top of page for statistics cards
- **Expected:** See "Total Reports" card
- **Expected:** See "Request Report" card  
- **Expected:** See "Planted" card
- **Expected:** See "Completed" card
- **Expected:** See "Archived" card
- **Expected:** See "Deleted" card
- **Expected:** All numbers are correct and match table counts
- Create a new report
- **Expected:** Statistics update immediately without page refresh

---

## PLANTING REPORTS - UPDATE/EDIT

### [ ] Test 7: Edit Report in Request State
- Find a report with "Request" state badge
- Click the pencil icon (✏️) in Actions column
- **Expected:** Modal opens in edit mode
- **Expected:** Title shows "Edit Report - Request"
- **Expected:** Farmer name, contact, RSBSA are gray (read-only)
- **Expected:** Other fields are editable (white background)
- Change "Area Planted" to different number
- Click "Save" button
- **Expected:** Green success message "Report updated successfully"
- **Expected:** Modal closes
- **Expected:** Table refreshes showing new area value
- Click eye icon to view
- **Expected:** New area value is saved

### [ ] Test 8: Edit Report - Field Validation
- Open any report for editing
- Clear "Area Planted" field (delete all numbers)
- Click "Save" button
- **Expected:** Red error "Area Planted is required"
- **Expected:** Cannot save
- Type "-5" in Area Planted
- **Expected:** Error shows "Must be positive number"
- Type "999999" 
- Click "Save"
- **Expected:** May show error if exceeds maximum
- Type valid number like "3"
- Click "Save"
- **Expected:** Saves successfully

### [ ] Test 9: Edit Report - Locked Fields in Planted State
- Find report with "Planted" state badge
- Click pencil icon to edit
- **Expected:** Title shows "Edit Report - Planted"
- **Expected:** Farmer name is locked (gray)
- **Expected:** Crop type is locked (gray)
- **Expected:** Variety is locked (gray)
- **Expected:** Area planted is locked (gray)
- **Expected:** Cannot change these locked fields
- **Expected:** Date of Planting is editable
- **Expected:** Planting Method is editable
- Change editable fields only
- Click "Save"
- **Expected:** Saves successfully with locked fields unchanged

---

## PLANTING REPORTS - DELETE (SOFT DELETE)

### [ ] Test 10: Delete Report (Soft Delete)
- Find any report in "All Reports" tab
- Click the trash icon (🗑️) in Actions column
- **Expected:** Confirmation dialog appears
- **Expected:** Dialog says "Delete Report?"
- **Expected:** Message mentions "moved to deleted reports" and "restore within 30 days"
- Click "Cancel" button
- **Expected:** Dialog closes, nothing deleted
- Click trash icon again
- Click "Confirm" button in dialog
- **Expected:** Green message "Report deleted successfully"
- **Expected:** Report disappears from "All Reports" tab
- **Expected:** Statistics "Deleted" count increases by 1
- Click "Deleted Reports" tab at top
- **Expected:** Deleted report appears in this tab
- **Expected:** Shows "Deleted Date" column
- **Expected:** Shows "Days Remaining" column

### [ ] Test 11: Restore Deleted Report
- Go to "Deleted Reports" tab
- Find recently deleted report
- Click the restore icon (↩️) in Actions column
- **Expected:** Confirmation dialog "Restore this report?"
- Click "Confirm"
- **Expected:** Green message "Report restored successfully"
- **Expected:** Report disappears from Deleted tab
- Click "All Reports" tab
- **Expected:** Report is back in main table
- **Expected:** Statistics "Deleted" count decreases by 1
- **Expected:** Report shows original state (Request/Planted/Completed)

### [ ] Test 12: Bulk Delete Multiple Reports
- Go to "All Reports" tab
- Click checkbox in first column for 3 different reports
- **Expected:** Checkboxes turn blue/checked
- **Expected:** Toolbar appears at top showing "3 selected"
- Click "Delete Selected" button
- **Expected:** Confirmation "Delete 3 reports?"
- Click "Confirm"
- **Expected:** Green message "3 reports deleted"
- **Expected:** All 3 reports disappear from table
- Go to "Deleted Reports" tab
- **Expected:** All 3 reports appear here

---

## PLANTING REPORTS - ARCHIVE

### [ ] Test 13: Archive Completed Report
- Find report with "Completed" state badge
- **Expected:** Archive button (box icon 📦) is visible
- Click archive button
- **Expected:** Dialog "Archive this report?"
- **Expected:** Message says "moved to archived tab"
- Click "Confirm"
- **Expected:** Green message "Report archived successfully"
- **Expected:** Report disappears from main view
- Click "Archived" sub-tab (under state tabs)
- **Expected:** Report appears here with "Archived" badge
- **Expected:** Statistics "Archived" count increases by 1

### [ ] Test 14: Cannot Archive Non-Completed Report
- Find report with "Request" state badge
- **Expected:** NO archive button visible (only View, Edit, Delete)
- Find report with "Planted" state badge
- **Expected:** NO archive button visible
- **Expected:** Only "Completed" reports can be archived

### [ ] Test 15: Unarchive Report
- Click "Archived" sub-tab
- Find archived report
- Click unarchive icon (📤)
- **Expected:** Report immediately unarchives (no confirmation)
- **Expected:** Green message "Report unarchived successfully"
- **Expected:** Report disappears from Archived tab
- Click "All" sub-tab
- **Expected:** Report appears in normal list
- **Expected:** Still shows "Completed" state
- **Expected:** Statistics "Archived" count decreases by 1

### [ ] Test 16: Bulk Archive Multiple Completed Reports
- Go to "Completed" sub-tab
- Select 5 completed reports using checkboxes
- Click "Archive Selected" button at top
- **Expected:** Confirmation "Archive 5 reports?"
- Click "Confirm"
- **Expected:** Green message "5 reports archived"
- Click "Archived" sub-tab
- **Expected:** All 5 reports now in archived list

---

## PLANTING REPORTS - STATE TRANSITIONS

### [ ] Test 17: Transition Report from Request to Planted
- Find report in "Request" state
- Click pencil icon to edit
- **Expected:** See workflow stepper: Request (blue) → Planted (gray) → Completed (gray)
- **Expected:** See "Advance to Planted" button at bottom
- Click "Advance to Planted" button
- **Expected:** Confirmation dialog appears
- **Expected:** Message says "transition from Request to Planted"
- Click "Confirm"
- **Expected:** Green message "Successfully transitioned to Planted"
- **Expected:** New fields appear: "Date of Planting", "Planting Method"
- **Expected:** "Rice Irrigation Type" appears if crop is Rice
- Fill new required fields:
  - Select today's date for "Date of Planting"
  - Select "Direct Seeding" or "Transplanting" for method
  - If Rice: select irrigation type
- Click "Save"
- **Expected:** Modal closes
- **Expected:** Report now shows "Planted" badge in table
- **Expected:** Statistics update (Request -1, Planted +1)

### [ ] Test 18: Transition Report from Planted to Completed
- Find report in "Planted" state
- Click pencil icon to edit
- **Expected:** Workflow stepper: Request (green ✓) → Planted (blue) → Completed (gray)
- **Expected:** See "Advance to Completed" button
- Click "Advance to Completed" button
- **Expected:** Confirmation dialog appears
- Fill new required fields:
  - Type harvest area (must be ≤ area planted)
  - Type number of bags harvested
  - Type weight per bag in kg
- **Expected:** "Yield MT/ha" auto-calculates as you type
- Click "Save"
- **Expected:** Green message "Successfully transitioned to Completed"
- **Expected:** Report now shows "Completed" badge
- **Expected:** Statistics update (Planted -1, Completed +1)
- **Expected:** Archive button now appears on this report

### [ ] Test 19: Cannot Transition with Missing Fields
- Find "Request" report
- Click edit
- Click "Advance to Planted"
- Click "Confirm"
- Leave "Date of Planting" empty
- Try to save
- **Expected:** Red error "Date of Planting is required"
- **Expected:** Cannot save until filled

### [ ] Test 20: Harvest Area Validation
- Find "Planted" report
- Click edit
- Advance to Completed
- In "Harvest Area" type number LARGER than "Area Planted"
- **Expected:** Red error "Harvest area cannot exceed planted area"
- **Expected:** Cannot save
- Type valid number ≤ Area Planted
- **Expected:** Error clears
- Can save successfully

---

## SEARCH AND FILTER

### [ ] Test 21: Global Search by Farmer Name
- Look for search box at top of table
- Click in search box
- Type partial farmer name (example: "juan")
- Wait 1 second
- **Expected:** Table automatically filters to show only matching farmers
- **Expected:** Results highlight/show farmers with "juan" in name
- Clear search box (delete text)
- **Expected:** All reports appear again

### [ ] Test 22: Global Search by Location
- Type farm location in search box (example: "barangay")
- **Expected:** Table filters to reports matching location
- Type non-existent text "xyzabc"
- **Expected:** Table shows "No reports found" message
- **Expected:** Empty state icon/image appears
- Clear search

### [ ] Test 23: Filter by State Tabs
- Click "Request" sub-tab
- **Expected:** Table shows only Request reports
- **Expected:** All rows have blue "Request" badge
- Click "Planted" sub-tab
- **Expected:** Table shows only Planted reports
- **Expected:** All rows have orange "Planted" badge
- Click "Completed" sub-tab
- **Expected:** Table shows only Completed reports
- **Expected:** All rows have green "Completed" badge
- Click "All" sub-tab
- **Expected:** Table shows all states mixed together

### [ ] Test 24: Filter by Crop Type
- Click "Filters" button (or expand filter panel)
- Find "Type of Crop" dropdown
- Click dropdown
- Select "Rice"
- **Expected:** Table instantly filters to show only Rice reports
- **Expected:** Active filter count badge shows "1"
- Select "Corn"
- **Expected:** Table switches to show only Corn reports

### [ ] Test 25: Filter by Variety
- Expand filters
- Click "Variety" dropdown
- Select specific variety (example: "NSIC Rc222")
- **Expected:** Table shows only reports using that variety
- **Expected:** Active filter count increases
- Select different variety
- **Expected:** Table updates immediately

### [ ] Test 26: Filter by Season
- Expand filters
- Click "Cropping Season" dropdown
- Select a season (example: "Dry Season 2024")
- **Expected:** Table filters to that season only
- Combine with variety filter
- **Expected:** Shows reports matching BOTH variety AND season

### [ ] Test 27: Filter by Date Range
- Expand filters
- Click "Start Date" calendar icon
- Select a start date from calendar
- Click "End Date" calendar icon
- Select end date (must be after start date)
- **Expected:** Table shows reports within date range
- Try selecting end date BEFORE start date
- **Expected:** Error message or end date auto-adjusts

### [ ] Test 28: Combine Multiple Filters
- Select Crop Type: "Rice"
- Select Variety: any variety
- Select Season: any season
- Select Date Range: last 30 days
- Type in search: partial farmer name
- **Expected:** Table shows reports matching ALL filters
- **Expected:** Active filter count shows "5" (or total filter count)
- Click "Reset Filters" button
- **Expected:** All filters clear at once
- **Expected:** Active filter count shows "0"
- **Expected:** Full table appears

### [ ] Test 29: Filter Persistence on Tab Change
- Apply filter: Crop Type = "Rice"
- Click "Planted" state tab
- **Expected:** Filter remains active (only Rice + Planted)
- Click "Completed" state tab
- **Expected:** Filter still active (only Rice + Completed)
- Click "Reset Filters"
- **Expected:** Shows all completed reports

---

## PAGINATION

### [ ] Test 30: Navigate Through Pages
- Look at bottom of table for pagination controls
- **Expected:** See "Showing 1-25 of XXX" text
- Click "Next" button (or page 2)
- **Expected:** Table loads next 25 reports
- **Expected:** Shows "Showing 26-50 of XXX"
- Click "Previous" button
- **Expected:** Returns to page 1
- **Expected:** Shows "Showing 1-25 of XXX"

### [ ] Test 31: Change Page Size
- Find "Rows per page" dropdown at bottom
- Click dropdown
- Select "10"
- **Expected:** Table shows only 10 rows
- **Expected:** Pagination updates to show more pages
- **Expected:** Shows "Showing 1-10 of XXX"
- Select "50" from dropdown
- **Expected:** Table shows up to 50 rows
- **Expected:** Fewer total pages

### [ ] Test 32: Jump to Specific Page
- Look for "Go to:" input box (desktop only)
- Type page number "5"
- Press Enter key
- **Expected:** Jumps to page 5 immediately
- **Expected:** Shows "Showing 101-125 of XXX" (if 25 per page)
- Type invalid page "999"
- Press Enter
- **Expected:** Nothing happens OR shows error

### [ ] Test 33: First and Last Page Buttons
- Click "Last Page" button (⏭️ icon)
- **Expected:** Jumps to final page
- **Expected:** May show fewer than full page of results
- Click "First Page" button (⏮️ icon)
- **Expected:** Returns to page 1

### [ ] Test 34: Pagination with Filters
- Apply filter: Crop Type = "Rice"
- **Expected:** Pagination shows "Showing 1-25 of XX Rice reports"
- Go to page 3
- Clear filters
- **Expected:** Pagination resets to page 1 of all reports

---

## VARIETIES CRUD (REFERENCE MANAGEMENT)

### [ ] Test 35: Open Reference Management Panel
- Look for "Manage Varieties & Seasons" button
- Click button
- **Expected:** Panel/accordion expands below
- **Expected:** See 2 tabs: "Varieties" and "Seasons"
- **Expected:** Varieties tab is active (highlighted)
- **Expected:** Table shows list of existing varieties

### [ ] Test 36: Create New Variety
- In Reference Management panel, Varieties tab
- Click "Add Variety" button
- **Expected:** Modal opens with title "Create Variety"
- Fill fields:
  - Variety Name: "Test Variety 123"
  - Crop Type: Select "Rice"
  - Description: "Test variety for testing"
  - Status: Toggle ON (active)
- Click "Save"
- **Expected:** Green message "Variety created successfully"
- **Expected:** Modal closes
- **Expected:** New variety appears in varieties table
- **Expected:** Shows green "Active" badge

### [ ] Test 37: Edit Existing Variety
- In varieties table, find any variety
- Click pencil icon (edit)
- **Expected:** Modal opens with title "Edit Variety"
- **Expected:** All fields pre-filled with current data
- Change name to "Updated Variety Name"
- Click "Save"
- **Expected:** Green message "Variety updated successfully"
- **Expected:** Table refreshes showing new name

### [ ] Test 38: Toggle Variety Active/Inactive
- Find active variety (green "Active" badge)
- Click toggle switch in "Status" column
- **Expected:** Switch slides to OFF
- **Expected:** Badge changes to gray "Inactive"
- **Expected:** Message "Variety status updated"
- Click toggle again
- **Expected:** Switch slides to ON
- **Expected:** Badge back to green "Active"

### [ ] Test 39: Delete Variety (if unused)
- Find variety NOT used in any reports
- Click trash icon
- **Expected:** Confirmation "Delete this variety?"
- Click "Confirm"
- **Expected:** Green message "Variety deleted successfully"
- **Expected:** Variety removed from table

### [ ] Test 40: Cannot Delete Variety In Use
- Find variety used in reports
- Click trash icon
- **Expected:** Error message "Cannot delete - variety is used in X reports"
- OR **Expected:** Confirmation warns about usage
- **Expected:** Delete blocked if variety in use

### [ ] Test 41: View Reports Using Variety
- Find any variety
- Click "View Reports" button/icon
- **Expected:** Modal opens showing "Reports using [Variety Name]"
- **Expected:** Table lists all reports using this variety
- **Expected:** Shows farmer name, location, area, state
- Click report row
- **Expected:** Opens that report for viewing
- Close modal
- **Expected:** Returns to varieties table

---

## SEASONS CRUD (REFERENCE MANAGEMENT)

### [ ] Test 42: Switch to Seasons Tab
- In Reference Management panel
- Click "Seasons" tab
- **Expected:** Tab highlights
- **Expected:** Table shows list of seasons
- **Expected:** Each season shows name, year, date range, status

### [ ] Test 43: Create New Season
- Click "Add Season" button
- **Expected:** Modal "Create Season" opens
- Fill fields:
  - Season Name: "Wet Season"
  - Year: Select "2025"
  - Start Date: Select date from calendar
  - End Date: Select later date from calendar
  - Status: Toggle ON (active)
- Click "Save"
- **Expected:** Green message "Season created successfully"
- **Expected:** New season in table
- **Expected:** Shows green "Active" badge

### [ ] Test 44: Edit Existing Season
- Find any season
- Click edit icon
- **Expected:** Modal opens with current season data
- Change year to different year
- Update dates
- Click "Save"
- **Expected:** Green message "Season updated successfully"
- **Expected:** Table shows updated information

### [ ] Test 45: Toggle Season Active/Inactive
- Find active season (green badge)
- Click toggle switch
- **Expected:** Status changes to "Inactive"
- **Expected:** Gray badge appears
- Toggle back
- **Expected:** Returns to "Active"

### [ ] Test 46: Delete Season (if unused)
- Find season NOT used in reports
- Click trash icon
- **Expected:** Confirmation dialog
- Click "Confirm"
- **Expected:** Green message "Season deleted successfully"
- **Expected:** Season removed from table

### [ ] Test 47: View Reports Using Season
- Find any season
- Click "View Reports" button
- **Expected:** Modal shows reports using this season
- **Expected:** List displays all matching reports
- Scroll through list
- Click to view individual report
- **Expected:** Report opens in view mode

---

## BULK OPERATIONS

### [ ] Test 48: Select All Reports
- Go to "All Reports" tab
- Click checkbox in table header (top-left corner)
- **Expected:** ALL reports on current page get selected
- **Expected:** Checkboxes for all visible rows turn blue
- **Expected:** Toolbar appears showing "X selected" count
- Click header checkbox again
- **Expected:** All selections clear
- **Expected:** Toolbar disappears

### [ ] Test 49: Select Individual Reports
- Click checkbox on row 1
- **Expected:** Row 1 checkbox turns blue
- **Expected:** Toolbar shows "1 selected"
- Click checkbox on row 3
- **Expected:** Row 3 checkbox also blue
- **Expected:** Toolbar shows "2 selected"
- Click row 1 checkbox again
- **Expected:** Row 1 deselects
- **Expected:** Toolbar shows "1 selected"

### [ ] Test 50: Bulk Operations Toolbar Buttons
- Select 3 reports
- Look at toolbar that appears
- **Expected:** See "Archive Selected" button (if reports are completed)
- **Expected:** See "Delete Selected" button
- **Expected:** See "X" or "Clear" button to deselect all
- Click "X" button
- **Expected:** All selections clear
- **Expected:** Toolbar disappears

### [ ] Test 51: Bulk Delete with Confirmation
- Select 4 reports using checkboxes
- Click "Delete Selected" button
- **Expected:** Confirmation dialog "Delete 4 reports?"
- **Expected:** Warning about 30-day restore period
- Click "Cancel"
- **Expected:** Dialog closes, nothing deleted
- **Expected:** 4 reports still selected
- Click "Delete Selected" again
- Click "Confirm"
- **Expected:** Green message "4 reports deleted successfully"
- **Expected:** All 4 reports disappear from table
- **Expected:** Selection toolbar disappears
- Go to "Deleted Reports" tab
- **Expected:** All 4 reports appear there

### [ ] Test 52: Bulk Archive with Confirmation
- Go to "Completed" sub-tab
- Select 3 completed reports
- Click "Archive Selected" button
- **Expected:** Confirmation "Archive 3 reports?"
- Click "Confirm"
- **Expected:** Green message "3 reports archived successfully"
- **Expected:** All 3 disappear from view
- Go to "Archived" sub-tab
- **Expected:** All 3 reports appear here

### [ ] Test 53: Cannot Bulk Archive Non-Completed Reports
- Go to "Request" sub-tab
- Select 2 request reports
- **Expected:** NO "Archive Selected" button visible
- **Expected:** Only "Delete Selected" button available
- Go to "Planted" sub-tab
- Select 2 planted reports
- **Expected:** NO "Archive Selected" button visible
- **Expected:** Only completed reports can be bulk archived

### [ ] Test 54: Bulk Selection Persists Across Page Changes
- Select 3 reports on page 1
- Navigate to page 2
- **Expected:** Selection clears (new page loaded)
- OR **Expected:** Toolbar shows selections from page 1 still counted
- Return to page 1
- **Expected:** Previous selections may or may not persist (depends on implementation)

### [ ] Test 55: Bulk Restore Deleted Reports
- Go to "Deleted Reports" tab
- Select 5 deleted reports using checkboxes
- Click "Restore Selected" button (if available)
- **Expected:** Confirmation "Restore 5 reports?"
- Click "Confirm"
- **Expected:** Green message "5 reports restored successfully"
- **Expected:** All 5 disappear from Deleted tab
- Go to "All Reports" tab
- **Expected:** All 5 restored reports appear

---

## DISTRIBUTION REPORTS TAB

### [ ] Test 56: View Distribution-Linked Reports
- Click "Distribution Reports" main tab at top
- **Expected:** Table shows ONLY reports linked to distribution requests
- **Expected:** Extra column "Distribution ID" appears
- **Expected:** Each row shows distribution request number
- **Expected:** Statistics remain visible at top

### [ ] Test 57: Distribution Link Click
- Find report with Distribution ID
- Click on the distribution ID number/link
- **Expected:** Opens distribution request details in new tab
- OR **Expected:** Shows distribution information
- Return to planting reports tab
- **Expected:** Still on Distribution Reports view

### [ ] Test 58: Cannot Archive Distribution Reports
- Find report in Distribution Reports tab
- Check actions column
- **Expected:** NO archive button visible
- **Expected:** Only View, Edit, Delete buttons
- **Expected:** Distribution-linked reports cannot be archived

### [ ] Test 59: Link Report to Distribution (Create Mode)
- Click "+" to create new report
- Fill all required fields
- Look for "Link to Distribution" checkbox
- Check the checkbox
- **Expected:** Distribution selector dropdown appears
- Select a distribution request from dropdown
- Click "Save"
- **Expected:** Report created successfully
- Go to "Distribution Reports" tab
- **Expected:** New report appears with distribution ID

### [ ] Test 60: Cannot Link Existing Report to Distribution
- Edit existing report (not linked to distribution)
- Look for "Link to Distribution" option
- **Expected:** Option is disabled or grayed out
- **Expected:** Can only link during creation
- OR **Expected:** Option not visible in edit mode

---

## MOBILE RESPONSIVE TESTING

### [ ] Test 61: Mobile View - Card Layout
- Resize browser to 375px width (phone size)
- **Expected:** Table changes to card stack layout
- **Expected:** Each report is a card showing:
  - Farmer name (large)
  - Location with 📍 icon
  - Crop and variety
  - Area planted
  - State badge
  - Action buttons at bottom
- Scroll up/down
- **Expected:** Smooth scrolling through cards

### [ ] Test 62: Mobile View - Filters
- In mobile view (375px)
- Click "Filters" button
- **Expected:** Filter panel slides up from bottom as drawer
- **Expected:** All filter options visible
- **Expected:** "Close" or "X" button at top
- Apply filters
- Close drawer
- **Expected:** Filters remain active
- **Expected:** Card list updates

### [ ] Test 63: Mobile View - Statistics
- In mobile view
- Scroll to top
- **Expected:** Statistics cards stack vertically
- **Expected:** 1 card per row
- **Expected:** Cards remain readable
- **Expected:** Numbers clearly visible

### [ ] Test 64: Mobile View - Modal Fullscreen
- In mobile view
- Click any card to view report
- **Expected:** Modal fills entire screen
- **Expected:** "X" close button at top-right
- **Expected:** Title at top
- Scroll through content
- **Expected:** All sections accessible
- **Expected:** Smooth scrolling

### [ ] Test 65: Mobile View - Create/Edit
- In mobile view
- Click "+" floating button
- **Expected:** Fullscreen modal opens
- **Expected:** Form fields stack vertically
- **Expected:** All fields accessible
- **Expected:** Keyboard doesn't cover input fields
- Fill and save
- **Expected:** Works same as desktop

### [ ] Test 66: Tablet View - Hybrid Layout
- Resize browser to 768px width (tablet)
- **Expected:** Table remains but condensed
- **Expected:** Some columns may hide
- **Expected:** Still shows key info
- **Expected:** Action buttons visible
- **Expected:** Filters may move to drawer

---

## ERROR HANDLING

### [ ] Test 67: Network Error During Save
- Open create/edit modal
- Fill form
- Disconnect internet OR stop server
- Click "Save"
- **Expected:** Red error message appears
- **Expected:** Shows network error or timeout message
- **Expected:** Modal stays open (doesn't close)
- **Expected:** Data not lost
- Reconnect internet
- Click "Save" again
- **Expected:** Now saves successfully

### [ ] Test 68: Validation Error Display
- Create new report
- Fill required fields with invalid data:
  - Area Planted: "-10"
  - Harvest Area: "abc" (letters)
- Click "Save"
- **Expected:** Red error under Area Planted "Must be positive"
- **Expected:** Red error under Harvest Area "Must be a number"
- **Expected:** Cannot save until fixed
- Fix errors
- **Expected:** Red messages disappear
- Can save successfully

### [ ] Test 69: Session Timeout
- Leave browser idle for extended time
- Try to perform action (edit report)
- **Expected:** May show "Session expired" error
- **Expected:** Redirect to login OR refresh prompt
- Re-login
- **Expected:** Return to planting reports page
- **Expected:** Can continue working

### [ ] Test 70: Duplicate Data Handling
- Create variety with name "Test Variety"
- Try to create another variety with exact same name
- **Expected:** Error "Variety name already exists"
- **Expected:** Cannot save duplicate

---

## PERFORMANCE & LOADING

### [ ] Test 71: Loading States
- Refresh page
- **Expected:** Table shows loading skeleton (gray boxes)
- **Expected:** Statistics show loading animation
- Wait for data load
- **Expected:** Skeletons replaced with actual data
- **Expected:** No blank/broken areas

### [ ] Test 72: Empty States
- Apply filters that match zero reports
- **Expected:** Shows "No reports found" message
- **Expected:** Friendly icon/illustration
- **Expected:** Suggestion to clear filters
- Click "Reset Filters"
- **Expected:** Reports appear again

### [ ] Test 73: Large Data Set Pagination
- If database has 1000+ reports:
- Load first page
- **Expected:** Loads quickly (< 2 seconds)
- Navigate to page 10
- **Expected:** Loads quickly
- Jump to last page
- **Expected:** Loads quickly
- **Expected:** No browser freezing

---

## DATA INTEGRITY

### [ ] Test 74: Auto-Save Prevents Data Loss
- Start creating report
- Fill half the fields
- Accidentally close browser tab
- Reopen browser
- Click "+" to create new report
- **Expected:** Fields are empty (no auto-restore)
- OR **Expected:** Draft saved and can be recovered

### [ ] Test 75: Optimistic Updates
- Edit report and save
- **Expected:** Table updates IMMEDIATELY
- **Expected:** Loading spinner brief or none
- **Expected:** Changes visible before API confirms
- If save fails
- **Expected:** Changes revert to original
- **Expected:** Error message shown

### [ ] Test 76: Statistics Accuracy
- Count reports in "Request" tab manually
- Compare to "Request Report" statistics card
- **Expected:** Numbers match exactly
- Create new Request report
- **Expected:** Statistics increment immediately
- Delete report
- **Expected:** Statistics decrement immediately
- Transition report state
- **Expected:** Both old and new state statistics update

### [ ] Test 77: Date Calculations
- Create report with planting date = today
- **Expected:** Expected harvest date auto-calculates
- **Expected:** Shows date ~120 days in future (typical rice)
- Edit planting date to past date
- **Expected:** Expected harvest recalculates
- Transition to completed
- **Expected:** Harvest date preserved

### [ ] Test 78: Yield Auto-Calculation
- Transition report to Completed
- Enter:
  - Number of Bags: 100
  - Weight per Bag: 50 kg
  - Harvest Area: 2 hectares
- **Expected:** Yield MT/ha auto-calculates
- **Expected:** Formula: (100 × 50 ÷ 1000) ÷ 2 = 2.5 MT/ha
- **Expected:** Updates as you type each field
- Change any value
- **Expected:** Yield recalculates immediately

---

## ACCESSIBILITY

### [ ] Test 79: Keyboard Navigation
- Close mouse/trackpad (don't use)
- Press Tab key repeatedly
- **Expected:** Focus moves through buttons in order
- **Expected:** Blue outline shows current focus
- **Expected:** Can reach all interactive elements
- Press Enter on focused button
- **Expected:** Button activates
- Press Escape in modal
- **Expected:** Modal closes

### [ ] Test 80: Screen Reader Testing
- Enable screen reader (Windows: Narrator, Mac: VoiceOver)
- Navigate to Planting Reports page
- **Expected:** Page title announced
- Tab through statistics
- **Expected:** Each stat value and label read aloud
- Tab through table
- **Expected:** Column headers announced
- **Expected:** Row data read in logical order
- Open modal
- **Expected:** Modal title announced
- **Expected:** Field labels read before inputs

---

## CONCURRENT USER TESTING

### [ ] Test 81: Multiple Users Editing Same Report
- User A: Open Report #1 for editing
- User B: Open same Report #1 for editing
- User A: Change area to "5" and save
- User B: Change area to "10" and save
- **Expected:** Last save wins (User B's "10" saved)
- OR **Expected:** Conflict warning shown
- **Expected:** Data doesn't get corrupted

### [ ] Test 82: Real-Time Updates
- User A: Views table on page 1
- User B: Creates new report
- User A: Wait 5 seconds
- **Expected:** New report appears in User A's table
- OR **Expected:** "New data available" notification
- User A: Refresh page
- **Expected:** New report visible

---

## EDGE CASES

### [ ] Test 83: Maximum Field Lengths
- Create report
- In "Farm Location" field, paste 500 characters
- Try to save
- **Expected:** Either saves full text OR shows max length warning
- Try pasting 10,000 characters
- **Expected:** Field limits input OR warning shows

### [ ] Test 84: Special Characters in Input
- Create report
- Type special characters in fields: @#$%^&*()
- **Expected:** Accepts or shows validation error
- Try SQL injection: ' OR 1=1 --
- **Expected:** Input sanitized, no security breach

### [ ] Test 85: Decimal Precision
- Enter area: 2.55555555 hectares
- Save
- View report
- **Expected:** Shows 2.56 (rounded to 2 decimals)
- OR **Expected:** Preserves precision

### [ ] Test 86: Future Dates
- Set planting date to 1 year in future
- Try to save
- **Expected:** Warning "Date cannot be in future"
- OR **Expected:** Accepts with warning

### [ ] Test 87: Past Deleted Reports (30+ Days)
- Create test report
- Delete report
- Manually change deleted date to 35 days ago (via database)
- Refresh page
- Go to Deleted Reports tab
- **Expected:** Report NOT in list (auto-deleted)
- OR **Expected:** Shows "Permanent deletion in X days"

---

## SUMMARY CHECKLIST

**TOTAL TESTS:** 87

**PASSED:** _____ / 87  
**FAILED:** _____ / 87  
**SKIPPED:** _____ / 87  

**Critical Issues Found:**
1. 
2. 
3. 

**Notes:**


---

**Tester Signature:** _______________  
**Date Completed:** _______________
