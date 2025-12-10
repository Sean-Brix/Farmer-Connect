# Test Logging Map - Where Each Test Logs

This document maps which file contains the console log for each test in the checklist.

## Files with Test Logs

### 1. `server/Controller/EIC/request/getDueTracking.js`
- **TEST 1.1**: Due Tracking Dashboard
  - Triggers: When admin loads Due Tracking Dashboard
  - Shows: Items with Borrowed/late_pickup/late_return statuses

### 2. `client/src/Admin/Services/EIC/components/RequestSection.jsx`
- **TEST 1.2**: Admin Dashboard Data Fetching
  - Triggers: On filter change, tab change
  - Shows: Total requests, filtered requests, active tab
  
- **TEST 2.1**: Archive Tab Display  
  - Triggers: When requests are categorized (component render)
  - Shows: Archive count, status breakdown, request/reserved/borrowed counts

- **TEST 3.1 & 3.2**: Admin Pickup Operations
  - Triggers: When admin clicks "Mark as Picked Up"
  - Shows: On-time (3.1) or late (3.2) detection with timing details

### 3. `server/Controller/EIC/request/setStatus.js`
- **TEST 3.1**: On-time Pickup Detection
  - Triggers: When pickup marked on-time
  - Shows: Status, timing, no adjusted date
  
- **TEST 3.2**: Late Pickup Detection
  - Triggers: When pickup marked late
  - Shows: Days late, adjusted return date calculation
  
- **TEST 4.1**: On-time Return Detection
  - Triggers: When return marked on-time
  - Shows: Status "Returned", timing
  
- **TEST 4.2**: Late Return Detection
  - Triggers: When return marked late
  - Shows: Status "late_return", days overdue
  
- **TEST 6.1, 6.2, 6.3**: Stock Management
  - Triggers: On status changes that affect stock
  - Shows: Stock action (PICKUP/RETURN), quantities

### 4. `client/src/Client/Services/EIC/utils/statusHelpers.js`
- **TEST 5.1**: Borrowed Status Display
  - Triggers: When client loads request with Borrowed status
  - Shows: Badge class, icon, label details
  
- **TEST 5.2**: late_pickup Status Display
  - Triggers: When client loads request with late_pickup status
  - Shows: Badge class (orange), urgent indicator

### 5. `client/src/Client/Services/EIC/EIC.jsx`
- **TEST 5.3**: Client Active Requests Filter
  - Triggers: When user requests data is loaded
  - Shows: Total requests, active count, status breakdown

### 6. `server/Controller/EIC/request/getStatistics.js`
- **TEST 2.2**: Statistics API (Archive Data)
  - Triggers: When admin loads statistics endpoint
  - Shows: Total archived, breakdown by status

### 7. `server/Controller/EIC/request/exportArchive.js`
- **TEST 2.3**: Export Archive API
  - Triggers: When export endpoint is called
  - Shows: Applied filters, where clause

### 8. `server/Services/cronJobs/checkOverdueItems.mjs`
- **TEST 7.1**: Cron Job - Mark Overdue Items
  - Triggers: Daily at 1:00 AM OR manually run `npm run test:cron`
  - Shows: Found overdue items, update details

### 9. `server/Services/notificationService.js`
- **TEST 8.1**: Notification - Borrowed
  - Triggers: When status changes to Borrowed
  
- **TEST 8.2**: Notification - late_pickup
  - Triggers: When status changes to late_pickup
  
- **TEST 8.3**: Notification - Returned
  - Triggers: When status changes to Returned
  
- **TEST 8.4**: Notification - late_return
  - Triggers: When status changes to late_return
  
- **TEST 8.5**: Notification - No_Return
  - Triggers: When status changes to No_Return
  
- **TEST 8.6**: Notification - No_Pickup
  - Triggers: When status changes to No_Pickup

---

## Tests WITHOUT Automatic Logs

These tests require manual verification in the UI:

### Client UI Tests (Section 5)
- **TEST 5.1**: Borrowed status badge (has log in statusHelpers.js)
- **TEST 5.2**: late_pickup status badge (has log in statusHelpers.js)
- **TEST 5.3**: Active requests filter (has log in EIC.jsx)
- **TEST 5.4**: Request history display - **NO LOG** (manual UI check)

### Cron Job Tests (Section 7)
- **TEST 7.2**: Auto-reject expired pending - **NO LOG** (requires cron to run)
- **TEST 7.3**: Auto-archive severe overdue - **NO LOG** (requires cron to run)
- **TEST 7.4**: Overdue notifications - **NO LOG** (covered by TEST 8.4)

---

## How to See Test Logs

### For Immediate Tests (Admin Actions)
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Perform action (e.g., Mark as Picked Up)
4. Look for bordered log with test number
5. Copy entire bordered block
6. Paste into checklist

### For Client-Side Tests
1. Login as regular user (not admin)
2. Navigate to EIC page
3. Open Developer Tools → Console
4. Logs will appear as data loads

### For Cron Job Tests
Run manually to trigger immediately:
```powershell
cd server
node -e "import('./Services/cronJobs/checkOverdueItems.mjs').then(m => m.default.now())"
```

### For API Tests
Check server console (where `npm start` is running) after performing actions.

---

## Missing Logs (To Be Added if Needed)

These tests currently have NO automated logs:

1. **TEST 5.4**: Request history display (Client)
2. **TEST 7.2**: Cron auto-reject expired pending
3. **TEST 7.3**: Cron auto-archive severe overdue

If you need logs for these, let me know!
