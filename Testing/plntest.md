Test Scenario 1: Pre-Request Validation ✅
What to test:

Navigate to EIC page while logged in

Look at equipment cards - you should see:

✅ Restriction badges showing:
Green/Yellow/Red badge with stock count (e.g., "5 available")
Blue badge with max quantity (e.g., "Max 2 per request")
Green badge with date limit (e.g., "Max 7 days")
Check Active Request Counter above the grid:

Should show "0/3" (or your configured limit)
Green if under limit, yellow if near limit, red if at limit
Expected Results:

✅ All badges display correctly
✅ Counter shows current active requests
Test Scenario 2: Request Submission with Validation ✅
What to test:

Click "Request Equipment" on any item

In the modal, you should see:

✅ Pickup date input
✅ Pickup Slots Indicator (after selecting date) showing available/total slots
✅ Return date input
✅ Borrow Period Card (after selecting both dates) showing day count and validation
✅ Quantity input
✅ Request note textarea with character counter (0/500)
Test validations:

Try past pickup date → Should show error
Try return date before pickup → Should show error
Try exceeding date limit → Should show error
Try quantity > available → Should show error
Try quantity > max per request → Should show error
Submit a valid request

Expected Results:

✅ Validation errors appear in real-time
✅ Slots indicator updates when date changes
✅ Borrow period card shows warnings if exceeding limits
✅ Success alert appears after submission
✅ Modal closes and equipment grid refreshes
Test Scenario 3: Duplicate Request Prevention ✅
What to test:

After submitting a request, look at that same equipment card:

✅ Yellow "Active Request" badge should appear on the image
✅ Request button should be disabled with gray styling
✅ Button text should say "Already Requested"
✅ Hover over the button → tooltip should explain why it's disabled
Try clicking the disabled button:

✅ Nothing should happen (button is disabled)
Check Active Request Counter:

✅ Should increment (e.g., "1/3")
Expected Results:

✅ Cannot request same item twice
✅ Visual indicators clearly show item already requested
✅ Counter accurately reflects active requests
Test Scenario 4: My Requests Modal - Tabs ✅
What to test:

Click "My Requests" button in navbar or page

Modal should open with 3 tabs at the top:

Active (with count badge, e.g., "Active 1")
History (with count badge, e.g., "History 0")
Cancelled (with count badge, e.g., "Cancelled 0")
Click each tab:

✅ Active: Shows Pending and Approved requests
✅ History: Shows Returned, Rejected, No_Pickup, late_return requests
✅ Cancelled: Shows cancelled requests
✅ Empty tabs show appropriate message
Expected Results:

✅ Tabs switch smoothly
✅ Counts are accurate
✅ Only relevant requests show in each tab
Test Scenario 5: Request Status Display ✅
What to test:

In Active tab, look at your pending request:

✅ Status badge (yellow with clock icon saying "Pending Approval")
✅ All dates formatted nicely
✅ Request note displayed if you added one
✅ Cancel button visible in Actions column
Scroll down below the table:

✅ "Request Progress" section should appear
✅ Shows Timeline with steps (Requested → Approved → Pickup → Return)
✅ Current step (Requested) should be highlighted in blue
✅ Action Panel shows "Awaiting Admin Approval" with instructions
Expected Results:

✅ Status badge is color-coded and has icon
✅ Timeline visually shows progress
✅ Action panel gives clear guidance
Test Scenario 6: Request Actions ✅
What to test:

A. Cancel Request (Pending status):

Click Cancel button in table
Confirmation dialog should appear
Click confirm
✅ Success alert appears
✅ Request moves to "Cancelled" tab
✅ Equipment card's "Active Request" badge disappears
✅ Request button becomes enabled again
✅ Active counter decrements
B. Approve Request (Admin side - then test user side):

Login as admin
Approve the user's request
Logout and login back as user
Open My Requests modal:
✅ Request status shows green "Approved" badge with pulse animation
✅ In Actions column: "Pickup" button and "Cancel" button
✅ Action panel shows "Pick up your item by [date]" with instructions
✅ Timeline shows "Approved" step highlighted
C. Confirm Pickup (Approved status):

Click "Pickup" button in Actions column
Confirmation should happen (or success alert)
✅ Request updates to borrowed/picked up status
✅ Timeline advances to next step
Expected Results:

✅ All action buttons work
✅ Confirmations appear
✅ Status updates in real-time
✅ Data refreshes after actions
Test Scenario 7: Click to View Details ✅
What to test:

In My Requests modal, click anywhere on a request row (except action buttons)

Request Detail Modal should open showing:

✅ Full item information with image
✅ Request details (quantity, dates, requested time)
✅ Request note (if any)
✅ Status badge
✅ Timeline
✅ Action panel (if active request)
✅ Close button
Click action buttons in detail modal:

✅ Should work same as table buttons
✅ Modal closes after action
✅ Data refreshes
Expected Results:

✅ Detail modal shows comprehensive information
✅ Actions can be performed from detail view
✅ Smooth open/close animations
Test Scenario 8: Dark Mode Compatibility ✅
What to test:

Toggle dark mode (if available in your app)
Check all new components:
✅ Request Status Badges
✅ Request Timeline
✅ Action Panel
✅ My Requests Modal tabs
✅ Request Detail Modal
✅ All text readable
✅ All borders visible
✅ All colors appropriate for dark theme
Expected Results:

✅ All components look good in both light and dark mode
✅ No white boxes or illegible text
Test Scenario 9: Validation Edge Cases ✅
What to test:

Try requesting when already at max active requests (e.g., 3/3):

✅ All request buttons should be disabled
✅ Tooltip should explain "Maximum 3 simultaneous requests"
Try requesting on a weekend (if weekend pickups disabled):

✅ Validation error should appear
Try requesting too far in advance:

✅ Should prevent if beyond max_advance_booking_days
Try requesting when pickup slots are full:

✅ Pickup Slots Indicator shows red/full
✅ Validation error on submit
Expected Results:

✅ All edge cases properly validated
✅ Clear error messages
✅ Cannot bypass restrictions
Test Scenario 10: Responsive Design ✅
What to test:

Resize browser window or use mobile device
Check:
✅ Equipment cards stack properly
✅ My Requests table scrolls horizontally if needed
✅ Tabs are usable on mobile
✅ Modals fit on small screens
✅ Action buttons accessible on mobile
Expected Results:

✅ Everything works on mobile/tablet/desktop
✅ No overlapping content
✅ All buttons clickable
🐛 Common Issues to Check
"Cannot read property" errors → Check browser console (F12)
Slots not loading → Check /api/eic/pickup-slots/:date endpoint
Settings not loading → Check /api/eic/settings endpoint
Actions not working → Check network tab for API calls
Validation not working → Check if systemSettings is loaded
✅ Quick Test Checklist
 Server and client both running
 Can view equipment with restriction badges
 Active request counter displays
 Can submit request with all new UI components visible
 Validation prevents invalid submissions
 Duplicate request prevention works (disabled button + badge)
 My Requests modal opens with 3 tabs
 Can switch between tabs
 Request shows status badge and timeline
 Can cancel pending request
 After admin approval, can see "Pickup" button
 Can click request row to view details
 Detail modal shows all information
 Dark mode works (if applicable)
 Works on mobile/small screens
🎯 Quick Start Testing
Fastest way to verify everything works:

Start servers
Login as user
Go to EIC page → Look for restriction badges on cards
Click "Request Equipment" → Check if new UI components show (slots, period card, note field)
Submit request → Watch for success alert
Check equipment card → Should show "Active Request" badge and disabled button
Click "My Requests" → Should see tabs and timeline
Click Cancel → Should work and remove badges
If all of the above works, the implementation is successful! 🎉