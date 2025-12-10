# DISTRIBUTION MANAGEMENT (ADMIN)

## Distributions List Page (Admin)

[IMAGE PLACEHOLDER: screenshot of distributions management page]

- Administrators can view, create, and manage all distribution programs (e.g., seeds, fertilizers, equipment).
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Log in as an Administrator
2. Navigate to "Distributions" from the admin sidebar menu
3. View all distribution items in a grid or list format showing:
   - Item name
   - Item photo
   - Description
   - Available quantity
   - Category
   - Status (Active, Out of Stock)
4. Use search bar to find specific distribution items
5. Filter by category or availability status
6. Click on any item to view details or manage requests

**Notes**
- Items with low stock are highlighted or flagged
- Out-of-stock items are clearly indicated
- Distribution items remain visible even when out of stock for record purposes

---

## Add Distribution Item

[IMAGE PLACEHOLDER: screenshot of add distribution item modal]

- Create new items available for distribution to users.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Distributions page, click "Add New Item" button
2. Fill in the item creation form:
   - **Item Name** (required): Name of the distribution item
   - **Description** (required): Details about the item
   - **Category** (optional): Type of item (e.g., Seeds, Fertilizer, Equipment)
   - **Quantity** (required): Available stock for distribution
   - **Unit** (optional): Measurement unit (kg, bags, pieces, etc.)
   - **Photo**: Upload an image of the item (optional)
3. Review all information for accuracy
4. Click "Add Item" or "Create" button
5. The new distribution item will appear in the list and be available for user requests

**Notes**
- Quantity can be adjusted later as stock changes
- Photo uploads support JPG, PNG formats
- Default image is used if no photo is uploaded
- Item is immediately visible to users after creation

---

## Edit Distribution Item

[IMAGE PLACEHOLDER: screenshot of edit distribution item modal]

- Update information or stock levels for existing distribution items.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Distributions list, locate the item you want to edit
2. Click the "Edit" button (pencil icon) on the item card
3. The edit form will open, pre-filled with current information
4. Modify any of the following fields:
   - Item name
   - Description
   - Category
   - Quantity (update stock levels)
   - Unit
   - Photo (upload new image to replace current one)
5. Click "Update" or "Save Changes" button
6. Confirmation message will appear upon successful update

**Notes**
- Quantity updates reflect immediately for user requests
- Reducing quantity below pending requests may require administrator review
- Existing item photo is replaced when a new one is uploaded
- Changes are visible to all users instantly

---

## View Distribution Requests

[IMAGE PLACEHOLDER: screenshot of distribution requests list]

- View and manage all user requests for distribution items.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Distributions page, click "View Requests" or navigate to the "Requests" tab
2. View all distribution requests in a table showing:
   - Requester name
   - Item requested
   - Quantity requested
   - Request date
   - Status (Pending, Approved, Rejected, Completed)
   - Pickup date (if applicable)
3. Use filters to view requests by status:
   - All requests
   - Pending (awaiting admin action)
   - Approved
   - Rejected
   - Completed
4. Search for specific requests by user name or item name
5. Click on any request row to view full details

**Notes**
- Pending requests require administrator action
- Requests are sorted by date (newest first) by default
- Status badges are color-coded for quick identification

---

## Approve/Reject Distribution Request

[IMAGE PLACEHOLDER: screenshot of request approval modal]

- Process user requests by approving or rejecting them.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Requests list, locate the pending request you want to process
2. Click "Approve" or "Reject" button next to the request
3. For **Approval**:
   - Confirm the quantity being approved
   - Optionally add a note or instructions for the requester
   - Set or confirm pickup date/time (if applicable)
   - Click "Confirm Approval"
4. For **Rejection**:
   - Select or enter a reason for rejection
   - Optionally add additional notes
   - Click "Confirm Rejection"
5. The request status updates immediately
6. User receives notification of the decision (if notifications enabled)

**Notes**
- Approved requests reduce available stock automatically
- Rejection reason helps users understand why their request was denied
- You can bulk approve/reject multiple requests if the feature is available
- Stock is only deducted upon approval, not at request time

---

## Mark Request as Completed

[IMAGE PLACEHOLDER: screenshot of complete request action]

- Mark approved distribution requests as completed after item pickup.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Requests list, filter to show "Approved" requests
2. Locate the request where the user has picked up the item
3. Click "Mark as Completed" button next to the request
4. Optionally add notes about the completion (e.g., pickup confirmation)
5. Click "Confirm" to finalize
6. Request status changes to "Completed"

**Notes**
- Completed requests are archived for record-keeping
- Completed requests cannot be modified or reopened
- Stock is not returned if a completed request is archived
- Completion tracking helps maintain accurate distribution records

---

## Export Distribution Reports

[IMAGE PLACEHOLDER: screenshot of export options]

- Generate and download reports of distribution activities.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Navigate to the Distributions or Requests page
2. Click "Export" or "Download Report" button
3. Select report parameters:
   - Date range (from/to dates)
   - Status filter (All, Approved, Completed, etc.)
   - Format (CSV, Excel, PDF)
4. Click "Generate Report"
5. The file will download automatically to your device

**Notes**
- Reports include request details, user information, and item quantities
- Use reports for inventory tracking and audit purposes
- Large date ranges may take longer to generate
- Reports can be opened in Excel or other spreadsheet software
