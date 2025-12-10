# USER PROFILE MANAGEMENT (ADMIN)

## User Profiles List Page

[IMAGE PLACEHOLDER: screenshot of user profiles list]

- Administrators can view and manage all registered user accounts in the system.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Log in as an Administrator
2. Navigate to "User Profiles" from the admin sidebar menu
3. View the table of all registered users with columns:
   - Profile picture
   - Username
   - Full name (First + Last)
   - Email address
   - Role (Admin/User)
   - Client profile status
   - Account creation date
4. Use search bar to find specific users by name, username, or email
5. Apply filters to narrow down results:
   - Filter by Role (All Roles, Admin, User)
   - Sort by Username, First name, Last name, Date Created, Recently Updated
6. Click on a user row to view/edit their full profile details

**Notes**
- Super Admin accounts are hidden from this list for security
- Pagination controls appear at the bottom if there are many users
- Default view shows 10 users per page (adjustable)
- Results update automatically as you type in the search bar

---

## Register New User (Admin Function)

[IMAGE PLACEHOLDER: screenshot of register new user modal]

- Create new user accounts with full administrative control.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the User Profiles page, click "Register New User" button
2. A registration form modal will appear
3. Fill in the required and optional fields:
   - **Username** (required, unique)
   - **Email** (required, unique)
   - **Password** (required)
   - **First Name** (required)
   - **Last Name** (required)
   - **Contact Number**
   - **Address**
   - **Role**: Select "Admin" or "User"
   - **RSBSA Number** (for farmer users)
4. Review all information for accuracy
5. Click "Register" or "Create Account" button
6. Success message will appear and the new user will be added to the list

**Notes**
- Username must be unique across the entire system
- Email must be unique and valid
- Password should be communicated securely to the new user
- Newly created accounts are immediately active
- You cannot create additional Super Admin accounts from this interface

---

## View/Edit User Details

[IMAGE PLACEHOLDER: screenshot of user details modal]

- View comprehensive information about any user and edit their profile.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the User Profiles list, click on any user row
2. A detailed modal or page will display showing:
   - All profile information
   - Account statistics
   - Recent activity
   - Role and permissions
3. To edit, click "Edit" or "Manage User" button
4. Modify the fields you need to change:
   - Personal information (name, contact, address)
   - Role (promote to Admin or demote to User)
   - Account status (activate/deactivate)
5. Click "Save Changes" to apply updates
6. A confirmation message will appear

**Notes**
- Changes to user roles take effect immediately
- You cannot edit Super Admin accounts
- Username and email changes may be restricted for data integrity
- Deactivating an account prevents that user from logging in

---

## Search and Filter Users

[IMAGE PLACEHOLDER: screenshot of search and filter controls]

- Quickly find specific users or groups of users using search and filters.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Locate the search bar at the top of the User Profiles page
2. Type in the search box to find users by:
   - Username
   - First name
   - Last name
   - Email address
3. Results filter automatically as you type (debounced for performance)
4. Use the dropdown filters to refine results:
   - **Role Filter**: Show All Roles, Admin only, or User only
   - **Sort By**: Username, Firstname, Lastname, Date Created, Recently Updated
5. Combined search and filters work together for precise results
6. Clear search or reset filters to view all users again

**Notes**
- Search is case-insensitive for user convenience
- Filters persist while navigating between pages of results
- Search performance is optimized with debouncing (300ms delay)
- Total result count is displayed

---

## User Pagination

[IMAGE PLACEHOLDER: screenshot of pagination controls]

- Navigate through large lists of users efficiently.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. At the bottom of the User Profiles table, locate the pagination controls
2. View the current page number and total pages
3. Use navigation buttons:
   - "Previous" button to go back one page
   - "Next" button to advance one page
   - Page number buttons to jump directly to a specific page
4. Change items per page using the dropdown (10, 25, 50, 100 items)
5. The page automatically adjusts when filters change

**Notes**
- Previous button is disabled on the first page
- Next button is disabled on the last page
- Changing items per page resets to page 1
- Current page is highlighted for easy identification
