# How to Trigger Test Logs - Step by Step Guide

This guide shows exactly how to trigger each test log so you can copy them into the checklist.

---

## IMMEDIATE SETUP

### 1. Open Developer Tools
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I`
- **Firefox**: Press `F12` or `Ctrl+Shift+K`
- Go to the **Console** tab
- Keep it open throughout testing

### 2. Clear Console Between Tests
- Click the 🚫 clear icon or press `Ctrl+L`
- This helps you see ONLY the current test's log

---

## ADMIN TESTS (Login as Admin)

### TEST 1.1: Due Tracking Dashboard
**File:** `server/Controller/EIC/request/getDueTracking.js`

**How to Trigger:**
1. Login as Admin
2. Navigate: **EIC Management** → **Due Tracking Dashboard**
3. **Check SERVER console** (where `npm start` is running)
4. Look for bordered log with "TEST 1.1: DUE TRACKING DASHBOARD"

**What to Copy:** Entire bordered block from server console

---

### TEST 1.2: Admin Dashboard Data Fetching
**File:** `client/src/Admin/Services/EIC/components/RequestSection.jsx`

**How to Trigger:**
1. Login as Admin
2. Navigate: **EIC Management** → **Request Section**
3. **Check BROWSER console** (F12)
4. Look for "TEST 1.2: ADMIN DASHBOARD DATA FETCHING"
5. Try changing tabs (Request → Reserved → Borrowed → Archive)
6. Each tab change triggers a new log

**What to Copy:** Entire bordered block from browser console

---

### TEST 2.1: Archive Tab Display
**File:** `client/src/Admin/Services/EIC/components/RequestSection.jsx`

**How to Trigger:**
1. Stay on Admin → EIC Management → Request Section
2. Click **Archive** tab
3. **Check BROWSER console**
4. Look for "TEST 2.1: ARCHIVE TAB DISPLAY"

**What to Copy:** Entire bordered block showing archive counts

---

### TEST 2.2: Statistics API
**File:** `server/Controller/EIC/request/getStatistics.js`

**How to Trigger:**
1. Navigate to page that calls `/api/eic/request/statistics`
2. OR use Postman to call: `GET http://127.0.0.1:8080/api/eic/request/statistics`
3. **Check SERVER console**
4. Look for "TEST 2.2: STATISTICS API"

**What to Copy:** Entire bordered block from server console

---

### TEST 2.3: Export Archive API
**File:** `server/Controller/EIC/request/exportArchive.js`

**How to Trigger:**
1. On Archive tab, click **Export** button (if available)
2. OR use Postman: `GET http://127.0.0.1:8080/api/eic/request/export`
3. **Check SERVER console**
4. Look for "TEST 2.3: EXPORT ARCHIVE API"

**What to Copy:** Entire bordered block from server console

---

### TEST 3.1: On-Time Pickup Detection
**Files:** 
- Client: `client/src/Admin/Services/EIC/components/RequestSection.jsx` (handlePickup)
- Server: `server/Controller/EIC/request/setStatus.js`

**How to Trigger:**
1. Find an **Approved** request with pickup date = TODAY or FUTURE
2. Click **"Mark as Picked Up"** button
3. **Check BOTH consoles:**
   - **Browser console**: Shows TEST 3.1 from handlePickup (before API call)
   - **Server console**: Shows TEST 3.1 from setStatus (during processing)
4. Look for "TEST 3.1: ON-TIME PICKUP DETECTION"

**What to Copy:** 
- Copy browser log (shows intent)
- Copy server log (shows actual processing)
- Paste BOTH into checklist

---

### TEST 3.2: Late Pickup Detection
**Files:** Same as TEST 3.1

**How to Trigger:**
1. Find an **Approved** request with pickup date = YESTERDAY or EARLIER
2. Click **"Mark as Picked Up"** button
3. **Check BOTH consoles:**
   - Browser: "TEST 3.2: ADMIN PICKUP ACTION (LATE)"
   - Server: "TEST 3.2: LATE PICKUP DETECTION"
4. Server log will show **adjustedReturnDate** calculation

**What to Copy:** Both browser and server logs

---

### TEST 4.1: On-Time Return Detection
**Files:** 
- Client: `client/src/Admin/Services/EIC/components/RequestSection.jsx` (handleReturn)
- Server: `server/Controller/EIC/request/setStatus.js`

**How to Trigger:**
1. Find a **Borrowed** or **late_pickup** item
2. Click **"Mark as Returned"** button BEFORE the return date
3. **Check BOTH consoles**
4. Look for "TEST 4.1: ON-TIME RETURN DETECTION"

**What to Copy:** Both browser and server logs

---

### TEST 4.2: Late Return Detection
**Files:** Same as TEST 4.1

**How to Trigger:**
1. Find a **Borrowed** or **late_pickup** item with PAST return date
2. Click **"Mark as Returned"** button
3. **Check BOTH consoles**
4. Look for "TEST 4.2: LATE RETURN DETECTION"
5. Server log shows **days overdue**

**What to Copy:** Both browser and server logs

---

### TEST 6.1, 6.2, 6.3: Stock Management
**File:** `server/Controller/EIC/request/setStatus.js`

**How to Trigger:**
- **TEST 6.1**: View stock (happens during any status check)
- **TEST 6.2**: Perform TEST 3.1 or 3.2 (pickup deducts stock)
- **TEST 6.3**: Perform TEST 4.1 or 4.2 (return restores stock)

**Check SERVER console** for:
- "TEST 6.1: STOCK QUERY"
- "TEST 6.2: STOCK DEDUCTION" 
- "TEST 6.3: STOCK RESTORATION"

**What to Copy:** Server log showing before/after stock quantities

---

## CLIENT TESTS (Login as Regular User)

### TEST 5.1: Borrowed Status Display
**File:** `client/src/Client/Services/EIC/utils/statusHelpers.js`

**How to Trigger:**
1. **Logout** and login as a **regular user** (NOT admin)
2. Navigate to **EIC** page
3. Click **"My Requests"** button
4. Find a request with status **Borrowed**
5. Click on it to view details
6. **Check BROWSER console**
7. Look for "TEST 5.1: STATUS DISPLAY - BORROWED"

**What to Copy:** Browser log showing badge class (should be BLUE)

---

### TEST 5.2: late_pickup Status Display
**File:** Same as TEST 5.1

**How to Trigger:**
1. Stay logged in as user
2. Find a request with status **late_pickup**
3. Click on it
4. **Check BROWSER console**
5. Look for "TEST 5.2: STATUS DISPLAY - LATE_PICKUP"

**What to Copy:** Browser log showing badge class (should be ORANGE with urgent indicator)

---

### TEST 5.3: Client Active Requests Filter
**File:** `client/src/Client/Services/EIC/EIC.jsx`

**How to Trigger:**
1. Stay on EIC page as user
2. Click **"My Requests"** button
3. **Check BROWSER console** immediately
4. Look for "TEST 5.3: CLIENT ACTIVE REQUESTS FILTER"

**What to Copy:** Browser log showing active vs archived counts

---

## CRON JOB TESTS (Manual Trigger)

### TEST 7.1: Cron Job - Mark Overdue Items
**File:** `server/Services/cronJobs/checkOverdueItems.mjs`

**How to Trigger:**
```powershell
# In a NEW terminal (keep servers running)
cd server
node -e "import('./Services/cronJobs/checkOverdueItems.mjs').then(m => m.default.now())"
```

**Check SERVER console** (main `npm start` terminal)
- Look for "TEST 7.1: CRON JOB - MARK OVERDUE ITEMS"

**What to Copy:** Server log showing found overdue items or "No overdue items"

---

## NOTIFICATION TESTS (Automatic)

### TEST 8.1-8.6: Notifications
**File:** `server/Services/notificationService.js`

**How to Trigger:** These trigger automatically when you perform other tests:

- **TEST 8.1 (Borrowed)**: Triggered by TEST 3.1 (on-time pickup)
- **TEST 8.2 (late_pickup)**: Triggered by TEST 3.2 (late pickup)
- **TEST 8.3 (Returned)**: Triggered by TEST 4.1 (on-time return)
- **TEST 8.4 (late_return)**: Triggered by TEST 4.2 (late return)
- **TEST 8.5 (No_Return)**: Click "Mark as No Return" button
- **TEST 8.6 (No_Pickup)**: Click "Mark as No Pickup" button

**Check SERVER console** for:
- "TEST 8.1: NOTIFICATION - BORROWED"
- "TEST 8.2: NOTIFICATION - LATE_PICKUP"
- etc.

**What to Copy:** Server log showing notification details

---

## TROUBLESHOOTING

### "I don't see any logs!"

1. **Check the RIGHT console:**
   - Admin actions: Check BOTH browser AND server
   - Client UI: Check browser console only
   - API calls: Check server console only

2. **Clear console before testing:**
   - Press `Ctrl+L` in console
   - Or click clear icon

3. **Reload the page:**
   - Some logs trigger on component mount
   - Press `Ctrl+R` to reload

4. **Check log level:**
   - Make sure "Verbose" or "All levels" is selected in console filter

5. **Server console is BACKEND terminal:**
   - The PowerShell window where you ran `cd server; npm start`
   - NOT the browser console

### "Logs are too fast!"

1. Right-click in console → **Preserve log**
2. Or copy immediately after action
3. Or increase console buffer size in DevTools settings

### "Can't find specific request?"

Use seed data from test summary:
```
Pending: 14       → For TEST 3.1/3.2 (Mark as Picked Up)
Approved: 11      → For TEST 3.1/3.2 (Mark as Picked Up)
Borrowed: 4       → For TEST 4.1/4.2 (Mark as Returned)
late_pickup: 3    → For TEST 4.2 (Mark as Returned Late)
```

---

## QUICK REFERENCE

| Test | Where | Action | Console |
|------|-------|--------|---------|
| 1.1 | Admin Dashboard | Load Due Tracking | Server |
| 1.2 | Admin Requests | Change tabs | Browser |
| 2.1 | Admin Archive | Click Archive tab | Browser |
| 2.2 | API call | GET /statistics | Server |
| 2.3 | Export | Click Export | Server |
| 3.1 | Mark Picked Up (on-time) | Click button | BOTH |
| 3.2 | Mark Picked Up (late) | Click button | BOTH |
| 4.1 | Mark Returned (on-time) | Click button | BOTH |
| 4.2 | Mark Returned (late) | Click button | BOTH |
| 5.1 | Client view Borrowed | Click request | Browser |
| 5.2 | Client view late_pickup | Click request | Browser |
| 5.3 | Client My Requests | Click button | Browser |
| 6.1-6.3 | Any pickup/return | Automatic | Server |
| 7.1 | Run cron manually | Node command | Server |
| 8.1-8.6 | Status changes | Automatic | Server |

---

## FINAL NOTE

**Always copy the ENTIRE bordered block including:**
- Top border: `============...`
- Test number: `📋 TEST X.X: ...`
- All data
- Bottom border with instruction: `✅ COPY THIS LOG...`

This ensures complete information for verification!
