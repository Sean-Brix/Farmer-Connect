# AUDIT LOGS & ACTIVITY TRAIL (ADMIN)

## Audit Logs Overview Page

[IMAGE PLACEHOLDER: screenshot of audit logs page]

- Administrators can view detailed system activity logs for security, compliance, and troubleshooting purposes.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Log in as an Administrator
2. Navigate to "Logs / Audit Trail" from the admin sidebar menu
3. The page has two main views accessible via tabs:
   - **Activity Logs**: Detailed record of all system actions
   - **Analytics**: Aggregated statistics and visualizations
4. View all logged activities in a table format showing:
   - Admin/user who performed the action
   - Action type (Create, Update, Delete, Login, Logout, etc.)
   - Target entity type (User, Seminar, Distribution, EIC Item, etc.)
   - Target entity name/identifier
   - Timestamp
   - IP address
   - Additional details
5. Logs are sorted by most recent first by default

**Notes**
- All administrative actions are automatically logged for accountability
- System tracks user logins, logouts, and critical operations
- Audit trail cannot be modified or deleted (read-only for integrity)
- Logs are essential for security audits and compliance requirements

---

## Search and Filter Audit Logs

[IMAGE PLACEHOLDER: screenshot of filter controls]

- Find specific activities using powerful search and filtering options.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Audit Logs page, locate the search and filter controls
2. **Basic Search**:
   - Type in the search bar to find logs containing specific keywords
   - Search works across admin names, actions, target entities
   - Results update automatically as you type (debounced for performance)
3. **Advanced Filters** (click "Show Advanced Filters"):
   - **Admin ID**: Filter by specific administrator
   - **Action Type**: Select specific actions (Create, Update, Delete, Login, etc.)
   - **Target Type**: Filter by entity type (User, Seminar, Distribution, etc.)
   - **Date Range**: Set start date (From) and end date (To)
4. Apply multiple filters simultaneously for precise results
5. Click "Clear Filters" to reset all filter criteria

**Notes**
- Search is debounced (500ms delay) to reduce server load
- Filters combine with AND logic (all conditions must match)
- Date filters help investigate incidents during specific time periods
- Admin ID filter is useful for reviewing individual administrator activity

---

## View Detailed Log Entry

[IMAGE PLACEHOLDER: screenshot of expanded log details]

- Expand log entries to view comprehensive details about specific actions.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Audit Logs table, locate the log entry you want to inspect
2. Click on the row or the "Expand" icon to view details
3. The expanded view displays additional information:
   - Complete metadata (full timestamp, session ID, device info)
   - Before/after values for update actions
   - Full request parameters or payload
   - Response status and error details (if any)
   - Related log entries or transaction trail
4. Click again to collapse the details

**Notes**
- Expanded details are useful for troubleshooting issues
- Update actions show what changed from old value to new value
- Error logs include stack traces or error messages for debugging
- IP address and device info help identify potential security threats

---

## Sort Audit Logs

[IMAGE PLACEHOLDER: screenshot of sort options]

- Organize logs by different criteria for easier analysis.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Locate the column headers in the audit logs table
2. Click on any column header to sort by that field:
   - **Timestamp**: Chronological order (newest or oldest first)
   - **Admin**: Alphabetical by administrator name
   - **Action**: Grouped by action type
   - **Target Type**: Grouped by entity type
3. Click the same column header again to toggle between ascending and descending order
4. Sort indicator (arrow icon) shows current sort direction

**Notes**
- Default sort is by timestamp (newest first)
- Sorting works with applied filters
- Sorting helps identify patterns (e.g., all delete actions, all activities by a specific admin)

---

## Pagination Controls

[IMAGE PLACEHOLDER: screenshot of pagination]

- Navigate through large volumes of audit logs efficiently.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. At the bottom of the audit logs table, locate pagination controls
2. View current page number and total number of pages
3. Use navigation buttons:
   - "Previous" button to go back one page
   - "Next" button to advance one page
   - Page number buttons to jump directly to a specific page
4. Change items per page using the dropdown (10, 25, 50, 100 logs per page)
5. Total log count is displayed for reference

**Notes**
- Default view shows 10 logs per page
- Changing page size resets to page 1
- Navigation buttons are disabled at first/last page appropriately
- Pagination works with search and filter criteria

---

## Audit Analytics Dashboard

[IMAGE PLACEHOLDER: screenshot of analytics dashboard]

- View aggregated statistics and visualizations of system activity patterns.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Audit Logs page, click the "Analytics" tab
2. View comprehensive analytics including:
   - **Activity Overview**: Total actions by type (Create, Update, Delete, etc.)
   - **Action Distribution**: Pie chart or bar graph showing action type breakdown
   - **Admin Activity**: Top administrators by action count
   - **Entity Changes**: Most frequently modified entity types
   - **Time-based Trends**: Activity volume over time (hourly, daily, weekly)
   - **Login Analytics**: Login frequency, success rate, failed attempts
3. Select time range for analytics:
   - Last 7 days
   - Last 30 days
   - Last 90 days
   - Custom date range
4. Click on charts for interactive details and drill-down views

**Notes**
- Analytics help identify usage patterns and peak activity times
- Sudden spikes in delete actions may indicate issues requiring investigation
- Failed login attempts may indicate security threats
- Top admin activity helps understand system usage and training needs

---

## Export Audit Logs

[IMAGE PLACEHOLDER: screenshot of export options]

- Download audit logs for external analysis, archiving, or compliance reporting.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Audit Logs page, click "Export" or "Download Logs" button
2. Select export parameters:
   - **Date Range**: All time or specific date range
   - **Action Filter**: All actions or specific action types
   - **Admin Filter**: All admins or specific administrator
   - **Format**: CSV or Excel (XLSX)
3. Click "Generate Export"
4. The file downloads automatically to your device
5. Open with spreadsheet software for analysis

**Notes**
- CSV format is ideal for importing into log analysis tools
- Excel format preserves formatting and supports further analysis
- Large date ranges may take longer to generate
- Exported logs include all available fields and details
- Use exports for compliance audits, security reviews, or long-term archiving

---

## Refresh Audit Logs

[IMAGE PLACEHOLDER: screenshot of refresh button]

- Manually refresh the logs to see the most recent activities.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Locate the "Refresh" button (circular arrow icon) near the top of the page
2. Click the button to reload logs from the server
3. The table updates with the latest log entries
4. Loading indicator shows while refreshing

**Notes**
- Logs auto-refresh periodically via polling
- Manual refresh is useful when you want immediate updates
- Refresh preserves your current filters and search criteria
- Useful when monitoring real-time activity or troubleshooting issues
