# SYSTEM SETTINGS (ADMIN)

## System Settings Overview Page

[IMAGE PLACEHOLDER: screenshot of system settings page]

- Administrators can configure global system settings that affect all users and modules.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Log in as an Administrator
2. Navigate to "Settings" from the admin sidebar menu
3. View various settings organized by category:
   - **General Settings**: System name, description, contact information
   - **EIC Settings**: Equipment borrowing system configurations
   - **Distribution Settings**: Distribution request system parameters
   - **Seminar Settings**: Enrollment and capacity configurations
   - **Notification Settings**: Email, SMS, and push notification preferences
   - **Security Settings**: Password policies, session timeouts
4. Click on any category to expand and view/edit settings
5. Make changes to settings as needed
6. Click "Save Changes" to apply new configurations

**Notes**
- Only administrators with appropriate permissions can modify settings
- Changes take effect immediately unless otherwise noted
- Some settings may require system restart or cache clear
- Default values can be restored if needed

---

## EIC System Settings

[IMAGE PLACEHOLDER: screenshot of EIC settings section]

- Configure settings specific to the Equipment & Item Catalog borrowing system.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Navigate to Settings → EIC Settings
2. Configure the following parameters:
   - **Max Simultaneous Borrows per User**: Maximum number of active borrow requests a single user can have (default: 3-5)
   - **Daily Pickup Limit**: Maximum number of pickups allowed per day (capacity management)
   - **Default Borrow Period (Days)**: Standard borrowing duration if not specified per item
   - **Enable Auto-Reminders**: Toggle automatic return reminders before due dates
   - **Reminder Days Before Due**: How many days before due date to send reminder (e.g., 3 days)
   - **Enable Late Fees/Penalties**: Toggle penalty system for overdue returns (if applicable)
3. Adjust values according to your organization's policies
4. Click "Save EIC Settings" button
5. Confirmation message appears

**Notes**
- Max simultaneous borrows prevents equipment hoarding
- Daily pickup limit helps manage administrative workload
- Changes don't affect existing active requests
- Auto-reminders reduce overdue returns

---

## Distribution System Settings

[IMAGE PLACEHOLDER: screenshot of distribution settings]

- Configure settings for the distribution request system.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Navigate to Settings → Distribution Settings
2. Configure the following parameters:
   - **Max Simultaneous Requests per User**: Limit on active distribution requests
   - **Daily Request Limit**: Maximum new requests allowed per day
   - **Auto-Approval Threshold**: Quantity below which requests are auto-approved (optional)
   - **Require Pickup Confirmation**: Whether pickup must be confirmed by admin
   - **Enable Request Expiry**: Toggle automatic expiration of old pending requests
   - **Request Expiry Days**: Days after which pending requests expire
3. Adjust values as needed
4. Click "Save Distribution Settings"

**Notes**
- Auto-approval can speed up processing for small quantity requests
- Request expiry helps clean up abandoned requests
- Settings balance user convenience with administrative control

---

## Notification Settings

[IMAGE PLACEHOLDER: screenshot of notification settings]

- Configure system notification delivery preferences.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Navigate to Settings → Notification Settings
2. Configure notification channels:
   - **Email Notifications**:
     - Enable/disable email notifications
     - Configure SMTP server settings (if self-hosted)
     - Set sender email address
   - **SMS Notifications** (if available):
     - Enable/disable SMS
     - Configure SMS gateway credentials
   - **Push Notifications**:
     - Enable/disable browser push notifications
3. Configure notification types (what events trigger notifications):
   - User registration confirmations
   - Seminar enrollment confirmations
   - Distribution request status updates
   - EIC borrow request approvals/rejections
   - Return due date reminders
   - Inquiry responses
4. Click "Save Notification Settings"

**Notes**
- Email is the primary notification channel
- Users can opt-out of non-critical notifications in their preferences
- Test notifications should be sent after changing settings
- Ensure SMTP or gateway credentials are valid

---

## Security Settings

[IMAGE PLACEHOLDER: screenshot of security settings]

- Configure system security policies and authentication requirements.
- Accessible by: Super Admin only

**Steps / How to Use**
1. Navigate to Settings → Security Settings
2. Configure security parameters:
   - **Password Policy**:
     - Minimum password length (e.g., 8 characters)
     - Require uppercase letters
     - Require numbers
     - Require special characters
   - **Session Management**:
     - Session timeout duration (minutes of inactivity)
     - Remember me duration (days)
     - Maximum concurrent sessions per user
   - **Account Lockout**:
     - Enable account lockout after failed login attempts
     - Number of failed attempts before lockout
     - Lockout duration (minutes)
   - **Two-Factor Authentication**:
     - Enable/disable 2FA requirement for admins
3. Click "Save Security Settings"
4. Warning appears if changes affect current sessions

**Notes**
- Stricter security policies improve system protection
- Balance security with user convenience
- Changes to session timeout affect all users immediately
- Password policy applies to new passwords only (existing passwords remain valid until changed)

---

## General System Settings

[IMAGE PLACEHOLDER: screenshot of general settings]

- Configure basic system information and display preferences.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Navigate to Settings → General Settings
2. Configure:
   - **System Name**: Display name for the application
   - **Organization Name**: Name of your organization
   - **Contact Email**: Primary contact email displayed to users
   - **Contact Phone**: Support phone number
   - **Address**: Physical address of the organization
   - **Logo**: Upload organization logo (appears in header)
   - **Theme Settings**: Default system theme (Light, Dark, Auto)
   - **Language**: Default system language
   - **Timezone**: System timezone for date/time displays
3. Upload logo if needed (JPG, PNG, recommended size displayed)
4. Click "Save General Settings"

**Notes**
- System name appears in browser tabs and headers
- Contact information is shown on the Contact page
- Logo should be high quality for best display
- Timezone affects how dates/times are displayed to users

---

## View/Edit User Preferences Defaults

[IMAGE PLACEHOLDER: screenshot of default preferences]

- Set default preference values applied to new user accounts.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Navigate to Settings → User Defaults
2. Configure default preferences for new users:
   - Default language (English, Tagalog, etc.)
   - Default notification preferences (Email, SMS, Push)
   - Default theme preference (Light, Dark, Auto)
3. Existing users are not affected; only new registrations
4. Click "Save Defaults"

**Notes**
- Users can change their own preferences after account creation
- Defaults simplify the onboarding experience
- Organization-specific defaults can improve consistency
