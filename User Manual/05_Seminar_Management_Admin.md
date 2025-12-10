# SEMINAR MANAGEMENT (ADMIN)

## Seminars List Page (Admin)

[IMAGE PLACEHOLDER: screenshot of seminars management page]

- Administrators can view, create, edit, and manage all seminars and training programs.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Log in as an Administrator
2. Navigate to "Seminars" from the admin sidebar menu
3. View all seminars in card or list format with:
   - Seminar title
   - Description excerpt
   - Seminar image/photo
   - Date and time
   - Location
   - Participant count
   - Status (Upcoming, Ongoing, Completed)
4. Use search bar to find specific seminars
5. Filter seminars by status or date range
6. Click on any seminar card to view full details

**Notes**
- Seminars are sorted by date by default (upcoming first)
- Low stock or capacity warnings may appear
- Empty state message shows when no seminars exist

---

## Add New Seminar

[IMAGE PLACEHOLDER: screenshot of add seminar modal]

- Create new seminar or training program entries.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Seminars page, click "Add New Seminar" or "Create Seminar" button
2. Fill in the seminar creation form:
   - **Title** (required): Name of the seminar
   - **Description** (required): Detailed information about the seminar
   - **Date** (required): When the seminar will take place
   - **Time**: Start and end time
   - **Location/Venue** (required): Where the seminar will be held
   - **Capacity**: Maximum number of participants (optional)
   - **Photo**: Upload an image for the seminar (optional)
3. Review all information for accuracy
4. Click "Create" or "Add Seminar" button
5. The new seminar will appear in the list and be visible to users for enrollment

**Notes**
- All required fields must be filled before submission
- Date must be in the future for upcoming seminars
- Photo uploads support JPG, PNG formats
- Default placeholder image is used if no photo is uploaded
- Seminar is immediately available for user registration after creation

---

## Edit Seminar Details

[IMAGE PLACEHOLDER: screenshot of edit seminar modal]

- Modify existing seminar information.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Seminars list, locate the seminar you want to edit
2. Click the "Edit" button (pencil icon) on the seminar card
3. The edit form will open, pre-filled with current information
4. Modify any of the following fields:
   - Title
   - Description
   - Date and time
   - Location/venue
   - Capacity
   - Photo (upload new image to replace current one)
5. Click "Update" or "Save Changes" button
6. Confirmation message will appear upon successful update

**Notes**
- Changes are reflected immediately for all users
- Updating date/time will notify enrolled participants (if notification system is active)
- Existing seminar photo is replaced when a new one is uploaded
- Cannot edit seminars that have already been completed (archive only)

---

## Delete Seminar

[IMAGE PLACEHOLDER: screenshot of delete confirmation modal]

- Permanently remove a seminar from the system.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Locate the seminar you want to delete
2. Click the "Delete" button (trash icon) on the seminar card
3. A confirmation modal will appear showing:
   - Seminar title
   - Warning about permanent deletion
   - Information that participant data will also be deleted
4. Review the warning carefully
5. Click "Delete Seminar" button to confirm, or "Cancel" to abort
6. Upon confirmation, the seminar is permanently removed from the system

**Notes**
- This action cannot be undone
- All associated participant registrations are also deleted
- Consider archiving instead of deleting for record-keeping purposes
- Participants will no longer see the deleted seminar in their enrollment history

---

## View Seminar Participants

[IMAGE PLACEHOLDER: screenshot of participants list modal]

- View and manage the list of users enrolled in a specific seminar.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. From the Seminars list, click "View Participants" or the participant count badge
2. A modal or page will display showing all registered participants with:
   - Participant name
   - Email address
   - Registration date
   - Status (Registered, Attended, Cancelled)
3. Search for specific participants using the search bar
4. Update participant status if needed (e.g., mark as attended)
5. View total participant count vs. capacity

**Notes**
- Participant list updates in real-time as users register
- Export option may be available to download participant list (CSV/Excel)
- You can manually add participants if registration is done offline
- Capacity warnings appear when nearing maximum registrations

---

## Update Participant Status

[IMAGE PLACEHOLDER: screenshot of participant status update]

- Mark participants as attended or update their registration status.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Open the Participants list for a specific seminar
2. Locate the participant whose status you want to update
3. Click on the status dropdown or status badge next to their name
4. Select new status:
   - **Registered**: Default status after enrollment
   - **Attended**: Participant showed up to the seminar
   - **Cancelled**: Participant cancelled their registration
   - **No-show**: Participant registered but did not attend
5. Click "Update" or the status automatically saves
6. Status change is reflected immediately

**Notes**
- Status updates help track attendance and engagement
- Reports can be generated based on attendance status
- Users may receive notifications when status changes (if enabled)
- Attendance can only be marked on or after the seminar date
