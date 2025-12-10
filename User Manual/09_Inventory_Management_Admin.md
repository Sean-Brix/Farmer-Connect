# INVENTORY MANAGEMENT (ADMIN)

## Inventory Items List Page

[IMAGE PLACEHOLDER: screenshot of inventory management page]

- Administrators can view and manage the complete inventory of items in the system.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Log in as an Administrator
2. Navigate to "Inventory" from the admin sidebar menu
3. View all inventory items displayed in a table or grid format showing:
   - Item name
   - Item image
   - Category
   - Current quantity/stock level
   - Unit of measurement
   - Status (In Stock, Low Stock, Out of Stock)
4. Use search bar to find specific items
5. Filter by category or stock status
6. Sort by name, quantity, or date added

**Notes**
- Low stock items are highlighted with warning indicators
- Out-of-stock items appear with distinct visual markers
- Inventory includes items for both Distribution and EIC (Equipment/Item Catalog)

---

## Add Inventory Item

[IMAGE PLACEHOLDER: screenshot of add inventory item modal]

- Create new items in the inventory system.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Inventory page, click "Add New Item" button
2. Fill in the item creation form:
   - **Item Name** (required): Name of the inventory item
   - **Category** (required): Type (Seeds, Fertilizer, Equipment, Tools, etc.)
   - **Description** (optional): Detailed information about the item
   - **Quantity** (required): Initial stock level
   - **Unit** (required): Measurement unit (kg, pieces, bags, liters, etc.)
   - **Image**: Upload a photo of the item (optional)
3. Review all information for accuracy
4. Click "Add Item" or "Create" button
5. The new item appears in the inventory list

**Notes**
- All required fields must be filled before submission
- Image uploads support JPG, PNG formats
- Default placeholder image is used if no photo is uploaded
- Item becomes available immediately after creation

---

## Edit Inventory Item

[IMAGE PLACEHOLDER: screenshot of edit inventory item modal]

- Update details or adjust stock levels for existing inventory items.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Inventory list, locate the item you want to edit
2. Click the "Edit" button (pencil icon) next to the item
3. The edit form will open, pre-filled with current information
4. Modify any of the following fields:
   - Item name
   - Category
   - Description
   - Quantity (adjust stock levels up or down)
   - Unit
   - Image (upload new image to replace current one)
5. Click "Save Changes" or "Update" button
6. Confirmation message appears upon successful update

**Notes**
- Quantity changes reflect immediately across all related modules
- Reducing quantity may affect pending requests or reservations
- Stock adjustments should match physical inventory counts
- Edit history may be logged for audit purposes

---

## Delete Inventory Item

[IMAGE PLACEHOLDER: screenshot of delete item confirmation]

- Permanently remove an item from the inventory system.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Locate the item you want to delete from the inventory list
2. Click the "Delete" button (trash icon) next to the item
3. A confirmation modal will appear with:
   - Item name
   - Warning about permanent deletion
   - Information about associated requests or usage
4. Review the warning carefully
5. Click "Delete Item" to confirm, or "Cancel" to abort
6. Upon confirmation, the item is permanently removed

**Notes**
- This action cannot be undone
- Cannot delete items with active pending requests (reject or complete them first)
- Historical data referencing this item may be affected
- Consider marking as inactive instead of deleting for data integrity

---

## Inventory Stack Management

[IMAGE PLACEHOLDER: screenshot of inventory stacks view]

- View and manage inventory "stacks" (grouped item batches or locations).
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Inventory page, click on an item to view its stack details
2. View multiple stacks if the item is stored in different locations or batches
3. Each stack shows:
   - Stack location or identifier
   - Quantity in this stack
   - Creation or last updated date
4. Edit individual stack quantities as needed
5. Combine or split stacks if functionality is available

**Notes**
- Stack management helps track items across multiple storage locations
- Total quantity is the sum of all stacks for an item
- Adjusting stack quantities updates the main inventory count
- Stack history aids in inventory auditing and reconciliation
