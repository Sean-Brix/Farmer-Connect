## **Inventory System - Missing Features & Validations**

### **Inventory (General)**
1. Bulk import/export functionality for items (CSV/Excel)
2. Item archiving/soft delete instead of permanent deletion
3. Image upload size validation and compression
4. Search functionality across all stacks by item name
5. Filter items by category across all stack types
6. Audit trail for inventory changes (who added/modified items)
7. Low stock alerts/notifications system
9. Item usage analytics and reporting
10. Batch operations (delete multiple, update multiple stacks)

### **EIC (Equipment in Circulation)**
1. Admin cannot set maximum borrowing days limit per item (uses `date_limit` field but no UI to set it)
2. No dashboard view for overdue/due items - admin must check requests one by one
3. No automatic calculation of expected return date based on `date_limit`
4. No restriction when user tries to borrow beyond the `date_limit` (validation exists in backend but may not enforce properly)
5. No notification system for upcoming due dates
6. No notification system for overdue items
7. No automatic status change to `late_return` when item is overdue
9. No user borrowing history view for admins
10. No restriction on how many items a user can borrow simultaneously
11. No equipment condition tracking (before/after borrowing)
12. No reminder system to users before return date
13. Cannot extend borrowing period once approved
14. No blacklist system for users with frequent late returns
15. No report generation for borrowing statistics
16. Missing calendar view for equipment availability
17. No reservation system for future dates
20. No pickup confirmation (to track if user actually picked up approved items)

### **Distribution (Free Items)**
1. No maximum quantity limit per user per item
2. No time-based restrictions (e.g., can only request once per month)
8. No distribution history per user
9. No restriction on total items a user can request
11. No waitlist system when items are out of stock
13. Missing pickup deadline enforcement (No_Pickup status exists but no auto-trigger)
14. No notification when distribution items become available
15. No distribution statistics/reporting
16. Cannot track which admin distributed to which user

---

## **Summary**

**Inventory (General)** - Missing 10 core features focused on bulk operations, analytics, and system-wide management. Priority: **Data management** and **reporting capabilities**.

**EIC (Equipment in Circulation)** - Missing 20 critical features, primarily around **time-based tracking**, **due date management**, **automated notifications**, and **user behavior monitoring**. The `date_limit` field exists in the database but lacks proper admin UI controls and automated enforcement. Priority: **Due date dashboard**, **automatic notifications**, and **late return automation**.

**Distribution (Free Items)** - Missing 20 features mainly around **access control**, **quota management**, **eligibility verification**, and **distribution workflow**. System is too open with no restrictions on who can request what and how much. Priority: **User limits**, **eligibility criteria**, **pickup tracking**, and **beneficiary management**.

**Overall System Gap**: Lack of **automated notifications**, **reporting dashboards**, **time-based automation**, and **admin control over policies**. The backend has some validation but frontend admin interfaces are missing configuration options.