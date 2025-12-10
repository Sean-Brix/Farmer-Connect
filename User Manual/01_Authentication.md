# AUTHENTICATION & ACCOUNT MANAGEMENT

## Login Page

[IMAGE PLACEHOLDER: screenshot of login page]

- The login page allows users to access the Farmer Connect system using their credentials.
- Accessible by: All Users (Public)

**Steps / How to Use**
1. Navigate to the login page at `/login`
2. Enter your registered username in the "Username" field
3. Enter your password in the "Password" field
4. (Optional) Check the "Remember Me" checkbox to save your credentials for future logins
5. Click the "Login" button to access the system
6. Upon successful authentication, you will be redirected to your appropriate dashboard based on your role (Admin or User)

**Notes**
- If you forget your password, click the "Forgot Password?" link below the login form
- The system will automatically redirect authenticated users away from the login page
- Remember Me feature stores credentials in browser local storage for convenience
- Invalid credentials will display an error message
- The login button is disabled while authentication is in progress

---

## Forgot Password Page

[IMAGE PLACEHOLDER: screenshot of forgot password page]

- This page allows users to request a password reset link via email.
- Accessible by: All Users (Public)

**Steps / How to Use**
1. Navigate to `/forgot-password` or click "Forgot Password?" on the login page
2. Enter your registered email address
3. Click "Send Reset Link" button
4. Check your email inbox for the password reset link
5. Click the link in the email to proceed to the password reset page

**Notes**
- The reset link is valid for a limited time only
- If you don't receive the email, check your spam/junk folder
- You must use the email address associated with your account

---

## Reset Password Page

[IMAGE PLACEHOLDER: screenshot of reset password page]

- This page allows users to create a new password using the reset token received via email.
- Accessible by: Users with valid reset token

**Steps / How to Use**
1. Click the reset link from your email (automatically navigates to `/reset-password`)
2. Enter your new password in the "New Password" field
3. Re-enter the same password in the "Confirm Password" field to verify
4. Click "Reset Password" button
5. Upon success, you will be redirected to the login page to sign in with your new password

**Notes**
- Both password fields must match exactly
- Passwords should meet minimum security requirements (length, complexity)
- The reset token expires after a certain period for security reasons
- After successful reset, the old password is no longer valid

---

## Change Password (User Settings)

[IMAGE PLACEHOLDER: screenshot of change password section in settings]

- Authenticated users can change their password from within their account settings.
- Accessible by: All Authenticated Users

**Steps / How to Use**
1. Log in to your account
2. Navigate to Settings or Profile page
3. Locate the "Change Password" section
4. Enter your current password in the "Current Password" field
5. Enter your new password in the "New Password" field
6. Confirm your new password in the "Confirm New Password" field
7. Click "Update Password" or "Save Changes" button

**Notes**
- You must provide your current password for verification
- New password must be different from the current password
- Both new password fields must match
- The change takes effect immediately after confirmation

---

## User Registration (Admin Only)

[IMAGE PLACEHOLDER: screenshot of register user modal]

- Administrators can create new user accounts through the User Profiles management page.
- Accessible by: Admin, Super Admin only

**Steps / How to Use**
1. Log in as an Administrator
2. Navigate to the "User Profiles" section from the admin dashboard
3. Click the "Register New User" button
4. Fill in the registration form with the following details:
   - Username (required, unique)
   - Email address (required, unique)
   - Password (required, will be provided to the user)
   - First Name
   - Last Name
   - Contact Number
   - Address
   - Role (Admin or User)
5. Review the information for accuracy
6. Click "Register" or "Create Account" button
7. The new user account will be created and can be used immediately

**Notes**
- Username and email must be unique across the system
- Ensure the password is communicated securely to the new user
- Newly created accounts are active by default
- Admin can assign appropriate roles during registration

---

## Logout

[IMAGE PLACEHOLDER: screenshot of profile dropdown with logout option]

- Users can safely log out of their session from any page.
- Accessible by: All Authenticated Users

**Steps / How to Use**
1. Click on your profile picture or username in the top-right corner of the page
2. A dropdown menu will appear
3. Click "Logout" from the dropdown menu
4. Your session will be terminated and you will be redirected to the login page

**Notes**
- Logging out clears your active session on the server
- You will need to log in again to access protected pages
- Any unsaved changes in forms may be lost upon logout
- Closing the browser does not automatically log you out unless you use "Remember Me"
