# EIC - EQUIPMENT & ITEM CATALOG (ADMIN)

## EIC Items Management Page

[IMAGE PLACEHOLDER: screenshot of EIC items management page]

- Administrators can manage equipment and items available for borrowing through the Equipment & Item Catalog (EIC) system.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Log in as an Administrator
2. Navigate to "EIC - Item Panel" from the admin sidebar menu
3. The page has two main sections accessible via tabs:
   - **Items**: Manage equipment/item catalog
   - **Requests**: View and process borrowing requests
4. In the Items section, view all equipment displayed as cards showing:
   - Item photo
   - Item name
   - Category
   - Available quantity
   - Total borrowed
   - Status (Available, Low Stock, Out of Stock)
5. Use search and filters to find specific items
6. Sort by quantity, name, category, or date added

**Notes**
- Low stock items (≤10 units) are automatically highlighted
- Items remain visible even when out of stock
- Click the "Requests" tab to switch to borrowing request management

---

## Add EIC Item

[IMAGE PLACEHOLDER: screenshot of add EIC item modal]

- Create new equipment or items available for borrowing.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the EIC Items page, click "Add New Item" button
2. Fill in the item creation form:
   - **Item Name** (required): Name of the equipment/item
   - **Category** (required): Type (Tools, Equipment, Educational Materials, etc.)
   - **Description** (required): Details about the item, usage, specifications
   - **Quantity** (required): Total available units
   - **Max Quantity per Request**: Maximum units a user can borrow at once (optional)
   - **Max Borrow Period (Days)**: Maximum borrowing duration (optional)
   - **Image**: Upload a photo of the item (optional)
3. Review all information for accuracy
4. Click "Add Item" button
5. The new item appears in the catalog and is available for user requests

**Notes**
- Max quantity and borrow period settings enforce borrowing limits
- Image uploads support JPG, PNG formats
- Default image is used if no photo is uploaded
- Items are immediately visible to users after creation

---

## Edit EIC Item

[IMAGE PLACEHOLDER: screenshot of edit EIC item modal]

- Update details or stock levels for existing EIC items.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the EIC Items list, locate the item you want to edit
2. Click the "Edit" button (pencil icon) on the item card or in the details modal
3. The edit form will open, pre-filled with current information
4. Modify any of the following fields:
   - Item name
   - Category
   - Description
   - Quantity (update available stock)
   - Max quantity per request
   - Max borrow period
   - Image (upload new image to replace current one)
5. Click "Update" or "Save Changes" button
6. Confirmation message appears upon successful update

**Notes**
- Quantity changes affect available borrowing capacity
- Reducing max quantity per request doesn't affect existing active requests
- Image replacement is immediate
- Changes reflect instantly for all users

---

## View EIC Borrowing Requests

[IMAGE PLACEHOLDER: screenshot of EIC requests list]

- View and manage all user requests to borrow equipment and items.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the EIC page, click the "Requests" tab
2. View all borrowing requests in a table format showing:
   - Requester name
   - Item requested
   - Quantity
   - Pickup date
   - Return date
   - Status (Pending, Approved, Ready, Borrowed, Returned, Rejected)
   - Request date
3. Use filters to view requests by status:
   - All
   - Pending (awaiting approval)
   - Approved (ready for pickup)
   - Borrowed (currently in user's possession)
   - Returned (completed)
   - Rejected/Cancelled
4. Search for requests by user name or item name
5. Sort by status, date, or item name
6. Click on any request row to view full details

**Notes**
- Status badge colors help quickly identify request stages
- Pending requests require immediate administrator attention
- Overdue returns are highlighted with warning indicators
- Due tracking helps monitor return deadlines

---

## Approve/Reject Borrow Request

[IMAGE PLACEHOLDER: screenshot of request approval modal]

- Process user requests to borrow equipment by approving or rejecting them.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Requests list, locate a pending request
2. Click "Approve" or "Reject" button next to the request
3. For **Approval**:
   - Verify the requested quantity is available
   - Confirm pickup and return dates
   - Optionally add notes or instructions
   - Click "Confirm Approval"
   - Status changes to "Approved" or "Ready for Pickup"
4. For **Rejection**:
   - Select or enter a reason for rejection
   - Add additional notes if needed
   - Click "Confirm Rejection"
5. User receives notification of the decision (if notifications enabled)

**Notes**
- Approved requests reserve the item quantity (reduces available stock)
- Rejection reason helps users understand the decision
- Stock availability is checked before approval
- Cannot approve if requested quantity exceeds available stock

---

## Mark Item as Picked Up (Borrowed)

[IMAGE PLACEHOLDER: screenshot of pickup confirmation]

- Update request status when user picks up the approved equipment.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Requests list, filter to show "Approved" or "Ready for Pickup" requests
2. Locate the request where the user is picking up the item
3. Verify the user's identity and the item being picked up
4. Click "Mark as Picked Up" or "Confirm Pickup" button
5. Optionally add pickup notes (condition of item, accessories included, etc.)
6. Click "Confirm"
7. Request status changes to "Borrowed"
8. Return date tracking begins automatically

**Notes**
- Pickup confirmation officially starts the borrowing period
- Item quantity remains reserved until returned
- Return reminders may be sent automatically as due date approaches
- Late returns can be flagged for follow-up

---

## Mark Item as Returned

[IMAGE PLACEHOLDER: screenshot of return confirmation]

- Process the return of borrowed equipment and update request status.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Requests list, filter to show "Borrowed" requests
2. Locate the request where the user is returning the item
3. Inspect the returned item for damage or missing parts
4. Click "Mark as Returned" button
5. Fill in return details:
   - Return date (auto-filled with current date)
   - Item condition (Good, Damaged, Needs Repair)
   - Notes about any issues or damages
6. Click "Confirm Return"
7. Request status changes to "Returned/Completed"
8. Item quantity is restored to available stock

**Notes**
- Returned quantity is added back to available inventory automatically
- Document any damage for accountability and repair tracking
- Late returns should be noted in the system
- Completed requests are archived for historical records
- Users can request the same item again immediately after returning (no cooldown period)

---

## EIC System Settings

[IMAGE PLACEHOLDER: screenshot of EIC settings page]

- Configure global settings for the EIC borrowing system.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the EIC page, click "Settings" or navigate to the settings tab
2. Configure the following system-wide settings:
   - **Max Simultaneous Borrows per User**: Maximum number of active borrow requests a user can have at once
   - **Daily Pickup Limit**: Maximum number of pickups allowed per day (capacity management)
   - **Default Borrow Period**: Default borrowing duration in days
   - **Enable Notifications**: Toggle email/SMS notifications for users
   - **Auto-Status Updates**: Configure automatic status transitions
3. Adjust values as needed for your organization's policies
4. Click "Save Settings" button
5. Changes apply immediately to all future requests

**Notes**
- Max simultaneous borrows prevents users from hoarding equipment
- Daily pickup limit helps manage administrative workload
- Settings can be overridden on a per-item basis if needed
- Changes don't affect existing active requests

---

## Export EIC Reports

[IMAGE PLACEHOLDER: screenshot of export options]

- Generate and download reports of EIC borrowing activities.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Navigate to the EIC Requests page
2. Click "Export" or "Download Report" button
3. Select report parameters:
   - Date range (from/to dates)
   - Status filter (All, Borrowed, Returned, etc.)
   - Item filter (specific item or all items)
   - Format (CSV, Excel)
4. Click "Generate Report"
5. The file downloads automatically to your device

**Notes**
- Reports include user details, item information, dates, and statuses
- Use for inventory tracking, usage analytics, and audit purposes
- Archive reports can show historical borrowing trends
- Excel format allows for further data analysis

---

## Due Tracking & Overdue Items

[IMAGE PLACEHOLDER: screenshot of due tracking dashboard]

- Monitor items approaching return dates or currently overdue.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the EIC Requests page, click "Due Tracking" button or tab
2. View items organized by urgency:
   - **Due Today**: Items that should be returned today
   - **Due Soon**: Items due within next 3 days
   - **Overdue**: Items past their return date
3. Each entry shows:
   - Borrower name
   - Item name
   - Original return date
   - Days overdue (if applicable)
4. Click "Send Reminder" to notify user about upcoming or overdue return
5. Contact users directly if needed using displayed contact information

**Notes**
- Automated reminders may be sent before due dates (if configured)
- Overdue items are flagged prominently for follow-up
- Track repeat late returners for accountability
- Consider implementing penalties or restrictions for chronic late returns
