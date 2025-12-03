# Localization Plan - Farmer Connect (CLIENT-SIDE ONLY)
**Created:** December 3, 2025  
**Updated:** December 3, 2025  
**Scope:** ONLY client-facing files in `client/src/Client/`, `client/src/Components/`, `client/src/Components/settings/`

---

## 🎯 What to Extract vs What to Skip

### ✅ EXTRACT (Static UI Text):
- Page titles, headings, descriptions: "Help & Support Center", "Equipment, Inputs & Commodities"
- Form labels: "Pickup Date", "Return Date", "Quantity", "First Name", "Email"
- Button text: "Submit Request", "Cancel", "Save Changes", "Go Back", "Send"
- Navigation items: "Home", "Services", "Information", "About", "Contact", "FAQ"
- Status labels: "Pending", "Approved", "Available", "Loading"
- Error/success messages: "Request submitted successfully!", "Failed to fetch"
- Help text: "Maximum borrowing period is X days"
- Modal titles: "Request Equipment", "My Requests"
- Empty states: "No equipment found", "No FAQs Available", "Page Not Found"
- Placeholder text: "Search equipment...", "Type your message...", "Describe the purpose..."
- Table headers: "Item Details", "Quantity", "Status", "Actions"

### ❌ SKIP (Dynamic Database Content):
- Equipment names from database (e.g., "Tractor XL-2000")
- Seminar titles from database
- Distribution item names from database
- User names, farmer names from database
- Chat messages, inquiry content
- User-generated notes or comments
- **NO ADMIN CONTENT** (Admin pages are out of scope)

---

## 📋 Strategy Overview

### Phase 1: Text Extraction & Categorization
1. Scan all client-side components systematically
2. Extract ONLY static hardcoded UI text
3. Organize by module/feature
4. Create comprehensive `en/common.json` structure

### Phase 2: Implementation
1. Add translation keys to `en/common.json`
2. Replace hardcoded text with `t()` function calls
3. Test each module after changes

### Phase 3: Translation
1. Copy complete `en/common.json` to `tl/common.json`
2. Translate all English values to Tagalog
3. Verify translations in UI

---

## 🗂️ Module Categorization (CLIENT-SIDE ONLY)

### **1. AUTHENTICATION MODULE**
**Location:** `client/src/Authentication/Components/`

**Files:**
- `Login.jsx`
- `Register.jsx`
- `ForgotPassword.jsx`
- `ResetPassword.jsx`

**Static UI Text to Extract:**
- "Login", "Sign In", "Username", "Password", "Email"
- "Remember Me", "Forgot Password?", "Don't have an account?"
- "Register", "Sign Up", "Create Account"
- "First Name", "Last Name", "Confirm Password"
- "Reset Password", "Send Reset Link", "Back to Login"
- "Enter your email address", "We'll send you a reset link"
- Validation: "Password must be at least 8 characters"
- Success: "Login successful", "Account created successfully"
- Error: "Invalid credentials", "Email already exists"
- Buttons: "Submit", "Cancel", "Go Back"

**Skip:** User data from database

---

### **2. CLIENT LANDING & NAVIGATION**
**Location:** `client/src/Client/`

**Files:**
- `Services/Landing/Landing.jsx`
- `Components/Navbar.jsx`

**Static UI Text to Extract:**
- Navigation: "Home", "About", "Contact", "FAQ", "Services", "Information"
- Navigation: "Seminar", "EIC", "Distribution", "Chat Support"
- Navigation: "Profile Settings", "Settings", "Logout", "Login"
- Hero: "Welcome to Farmer Connect", "Empowering Agriculture Enriching Lives"
- Hero: "Empowering Filipino Farmers", "Building Sustainable Communities"
- CTA Buttons: "Get Started", "Learn More", "Contact Us", "Explore Programs"
- Features: "Equipment Rental", "Seminar Registration", "Distribution Requests"
- Footer: "© 2025 Farmer Connect. All rights reserved."
- Footer: "Privacy Policy", "Terms of Service", "Help Center"

**Skip:** User's name in navbar, dynamic announcements

---

### **3. CLIENT INFORMATION PAGES**
**Location:** `client/src/Client/Services/Info/`

**Files:**
- `About.jsx`
- `Contact.jsx`
- `FAQ.jsx`

**Files (Components):**
- `client/src/Client/Components/CitizensCharter.jsx`

**Static UI Text to Extract:**
- Page Titles: "About Us", "Contact Us", "Frequently Asked Questions", "Citizen's Charter"
- Contact Labels: "Name", "Email", "Phone Number", "Message", "Subject"
- Contact: "Send Message", "Get in Touch", "Our Location", "Office Hours"
- FAQ: "Search FAQ", "Popular Questions", "Still have questions?"
- Citizens Charter: "Our Vision", "Our Mission", "Our Services", "Service Standards"
- Buttons: "Submit", "Clear Form", "Back to Home"

**Skip:** Actual About Us content (database), FAQ answers (database), office address (config)

---

### **4. CLIENT SERVICES - EIC (Equipment & Infrastructure)**
**Location:** `client/src/Client/Services/EIC/`

**Files:**
- `EIC.jsx`
- `components/EICEquipmentCard.jsx`
- `components/EICSearchAndFilters.jsx`
- `components/EICPagination.jsx`
- `components/EICLoadingState.jsx`
- `components/EICErrorState.jsx`

**Static UI Text to Extract:**
- Page Title: "Equipment & Infrastructure Center", "Equipment, Inputs & Commodities"
- Search: "Search equipment...", "Filter by category", "Sort by"
- Filters: "All Categories", "Available Only", "Show All"
- Sort: "Name (A-Z)", "Name (Z-A)", "Newest First", "Oldest First"
- Card Labels: "Available", "Not Available", "Quantity", "Request Equipment"
- Buttons: "Request", "View Details", "Cancel Request"
- Pagination: "Previous", "Next", "Page", "of", "Showing", "to", "results"
- Loading: "Loading equipment...", "Please wait..."
- Error: "Failed to load equipment", "No equipment found", "Try again"

**Skip:** Equipment names (database), quantities (dynamic)

---

### **5. CLIENT SERVICES - SEMINAR ENROLLMENT**
**Location:** `client/src/Client/Services/Enrollment/`

**Files:**
- `Seminar.jsx`

**Static UI Text to Extract:**
- Page Title: "Seminar Registration", "Training Programs"
- Labels: "Upcoming Seminars", "Available Seminars", "My Enrollments"
- Card: "Date", "Time", "Venue", "Capacity", "Speaker", "Register"
- Status: "Open for Registration", "Closed", "Full", "Enrolled", "Attended"
- Filters: "All Seminars", "This Month", "Next Month", "Upcoming"
- Search: "Search seminars..."
- Buttons: "Enroll Now", "View Details", "Cancel Enrollment"
- Modal: "Enrollment Form", "Confirm Enrollment", "Are you sure?"
- Success: "Successfully enrolled!", "Enrollment cancelled"
- Error: "Enrollment failed", "Seminar is full", "Already enrolled"
- Empty: "No upcoming seminars", "You haven't enrolled in any seminars"

**Skip:** Seminar titles (database), speaker names (database), venue details (database)

---

### **6. CLIENT SERVICES - DISTRIBUTION**
**Location:** `client/src/Client/Services/Distributions/`

**Files:**
- `Distribution.jsx`

**Static UI Text to Extract:**
- Page Title: "Distribution Center", "Distribution Programs"
- Labels: "Available Items", "My Requests", "Request History"
- Card: "Quantity Available", "Request Item", "Item Details"
- Form: "Quantity Requested", "Purpose", "Notes", "Describe the purpose..."
- Status: "Pending", "Approved", "For Pickup", "Released", "Rejected"
- Buttons: "Submit Request", "View Request", "Cancel Request"
- Filters: "All Items", "Available Only", "My Requests"
- Success: "Request submitted successfully!", "Request cancelled"
- Error: "Request failed", "Insufficient quantity available"
- Empty: "No items available", "No requests yet"

**Skip:** Item names (database), quantities (dynamic), user names (database)

---

### **7. CLIENT PROFILE & SETTINGS**
**Location:** `client/src/Client/Services/Profile/` and `client/src/Components/settings/`

**Files:**
- `Client/Services/Profile/User_Profile.jsx`
- `Components/settings/Settings.jsx`
- `Components/settings/Preferences.jsx`
- `Components/settings/Notifications.jsx`
- `Components/settings/AccountSettings.jsx`
- `Components/settings/ProfileSettings.jsx`
- `Components/settings/AccountProfile/AccountProfile.jsx`
- `Components/settings/AccountProfile/Info_Block.jsx`
- `Components/settings/AccountProfile/Edit_Profile.jsx`

**Static UI Text to Extract:**
- Page: "Profile", "My Profile", "Account Settings"
- Tabs: "Profile Information", "Settings", "Notifications", "Privacy"
- Labels: "First Name", "Last Name", "Email", "Phone Number", "Address"
- Labels: "RSBSA Number", "Farm Location", "Farm Size"
- Buttons: "Edit Profile", "Save Changes", "Cancel", "Update"
- Settings: "Preferences", "Language", "Theme", "Notifications"
- Theme: "Light", "Dark", "Auto", "System Default"
- Language: "English", "Tagalog", "Select Language", "Language Preference"
- Notifications: "Email Notifications", "Push Notifications", "SMS Notifications"
- Notification Types: "Seminar Updates", "Distribution Alerts", "System Notifications"
- Privacy: "Change Password", "Delete Account", "Privacy Settings"
- Password: "Current Password", "New Password", "Confirm Password"
- Success: "Profile updated successfully", "Password changed successfully"
- Error: "Update failed", "Invalid password", "Passwords don't match"
- Confirm: "Are you sure you want to delete your account?"
- Loading: "Loading profile...", "Updating...", "Saving changes..."

**Skip:** User's actual name, email, phone (dynamic data from DB)

---

### **8. CHAT & SUPPORT SYSTEM**
**Location:** `client/src/Components/Chats/`

**Files:**
- `Chat.jsx`
- `ChatSupport.jsx`
- `ChatModal.jsx`
- `ChatHeader.jsx`
- `ChatInput.jsx`
- `MessageList.jsx`
- `InquirySidebar.jsx`
- `BotCategoryButtons.jsx`
- `BotFAQList.jsx`

**Static UI Text to Extract:**
- Title: "Chat Support", "Help Center", "Help & Support Center", "Customer Support"
- Greeting: "Hello! How can we help you today?", "Welcome to support chat"
- Categories: "General Inquiry", "Equipment Request", "Seminar", "Distribution", "Technical Support"
- Tabs: "Chat Support", "FAQ", "My Tickets"
- Input: "Type your message...", "Type a message...", "Send", "Attach File"
- Status: "Online", "Offline", "Typing...", "Connecting..."
- Actions: "Start Conversation", "Close Chat", "New Chat", "View History"
- Bot: "I'm here to help", "Please select a category", "Is this helpful?"
- File: "Upload Image", "File attached", "Remove file", "Max file size: 5MB"
- Error: "Failed to send message", "Connection lost", "Reconnecting..."
- Empty: "No messages yet", "Start a conversation"
- Time: "Today", "Yesterday", "Just now", "minutes ago", "hours ago"
- Toast: "Message sent", "File uploaded", "Error occurred"

**Skip:** Actual chat messages (user-generated), FAQ content (database)

---

### **9. SURVEY SYSTEM**
**Location:** `client/src/Components/Survey/`

**Files:**
- `Survey.jsx`
- `FillSurvey.jsx`
- `FillSurveyModal.jsx`

**Static UI Text to Extract:**
- Title: "Survey", "Feedback Form", "Take Survey"
- Progress: "Question", "of", "Step", "Progress"
- Buttons: "Next", "Previous", "Submit", "Skip", "Finish"
- Instructions: "Please answer all questions", "Select one or more options"
- Validation: "This field is required", "Please select an option"
- Success: "Thank you for your feedback!", "Survey submitted successfully"
- Error: "Submission failed", "Please complete all required fields"
- Status: "Not Started", "In Progress", "Completed"
- Empty: "No surveys available", "You've completed all surveys"

**Skip:** Survey questions (database), response data (user-generated)

---

### **10. COMMON COMPONENTS**
**Location:** `client/src/Components/Common/`, `client/src/Components/`

**Files:**
- `Common/NotFound.jsx`
- `Common/ImageViewer.jsx`
- `Common/HourglassLoader.jsx`
- `Modal/ConfirmationModal.jsx`
- `NotificationBell.jsx`
- `Calendar/RequestCalendar.jsx`
- `Client/Components/CropCard.jsx`
- `Client/Components/ReportFeedback.jsx`
- `Client/Components/StageProgressionUI.jsx`

**Static UI Text to Extract:**
- **404 Page:**
  - "Page Not Found", "404", "The page you're looking for doesn't exist"
  - "Go Back Home", "Go Back", "Return to Dashboard", "Back", "Go to Homepage"
  
- **Image Viewer:**
  - "Close", "Previous", "Next", "Download", "Zoom In", "Zoom Out"
  
- **Loader:**
  - "Loading...", "Please wait...", "Processing...", "Just a moment..."
  
- **Confirmation Modal:**
  - "Confirm Action", "Are you sure?", "Yes", "No", "Cancel", "Continue"
  - "This action cannot be undone", "Proceed with caution"
  
- **Notifications:**
  - "Notifications", "Mark all as read", "Clear all", "No new notifications"
  - "New", "Read", "Unread", "Today", "Earlier", "This Week"
  
- **Calendar:**
  - "Select Date", "Today", "Clear", "Month", "Year", "Day"
  - "Previous Month", "Next Month", "Select", "Cancel"
  
- **Crop Card:**
  - "Crop Type", "Variety", "Planting Date", "Status", "View Details"
  
- **Feedback:**
  - "Feedback", "How was your experience?", "Comments", "Submit Feedback"
  - "Rate your experience", "Thank you for your feedback!"
  
- **Stage Progression:**
  - "Current Stage", "Next Stage", "Completed", "In Progress", "Pending"
  - "Stage", "of", "Progress", "Days Remaining", "Overdue"
  
- **Common Buttons:**
  - "Save", "Cancel", "Edit", "Delete", "Submit", "Close", "Back"
  - "Confirm", "Approve", "Reject", "View", "Download", "Print"
  
- **Common Actions:**
  - "Show More", "Show Less", "Expand", "Collapse", "Refresh"
  
- **Common Status:**
  - "Active", "Inactive", "Pending", "Completed", "Cancelled", "Failed"
  
- **Time/Date:**
  - "Just now", "minute ago", "minutes ago", "hour ago", "hours ago"
  - "Today", "Yesterday", "Last week", "Last month"
  - "Select date", "Start date", "End date", "Date range"

**Skip:** None (all are static UI elements)

---

## 📝 JSON Structure Template

```json
{
  "navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact",
    "services": "Services",
    "information": "Information",
    "faq": "FAQ",
    "settings": "Settings",
    "logout": "Logout",
    "login": "Login"
  },
  "settings": {
    "preferences": "Preferences",
    "language": "Language",
    "language_preference": "Language Preference",
    "theme": "Theme",
    "notifications": "Notifications",
    "light": "Light",
    "dark": "Dark",
    "auto": "Auto",
    "english": "English",
    "tagalog": "Tagalog"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "submit": "Submit",
    "edit": "Edit",
    "delete": "Delete",
    "close": "Close",
    "back": "Back",
    "view": "View",
    "loading": "Loading...",
    "please_wait": "Please wait...",
    "yes": "Yes",
    "no": "No",
    "confirm": "Confirm",
    "are_you_sure": "Are you sure?"
  },
  "messages": {
    "success": "Success!",
    "error": "Error occurred",
    "failed": "Failed",
    "saved": "Saved successfully"
  },
  "auth": {
    "login": "Login",
    "sign_in": "Sign In",
    "register": "Register",
    "sign_up": "Sign Up",
    "username": "Username",
    "password": "Password",
    "email": "Email",
    "first_name": "First Name",
    "last_name": "Last Name",
    "forgot_password": "Forgot Password?",
    "reset_password": "Reset Password"
  },
  "landing": {
    "welcome": "Welcome to Farmer Connect",
    "hero_title": "Empowering Agriculture Enriching Lives",
    "explore_programs": "Explore Programs",
    "learn_more": "Learn More"
  },
  "info": {
    "about_us": "About Us",
    "contact_us": "Contact Us",
    "faq": "Frequently Asked Questions"
  },
  "eic": {
    "title": "Equipment, Inputs & Commodities",
    "search_placeholder": "Search equipment...",
    "available": "Available",
    "request": "Request",
    "quantity": "Quantity"
  },
  "seminar": {
    "title": "Seminar Registration",
    "upcoming": "Upcoming Seminars",
    "enroll_now": "Enroll Now"
  },
  "distribution": {
    "title": "Distribution Center",
    "available_items": "Available Items",
    "submit_request": "Submit Request"
  },
  "profile": {
    "my_profile": "My Profile",
    "edit_profile": "Edit Profile",
    "account_settings": "Account Settings"
  },
  "chat": {
    "title": "Chat Support",
    "help_center": "Help & Support Center",
    "type_message": "Type your message...",
    "send": "Send"
  },
  "survey": {
    "title": "Survey",
    "take_survey": "Take Survey",
    "submit": "Submit",
    "thank_you": "Thank you for your feedback!"
  },
  "status": {
    "pending": "Pending",
    "approved": "Approved",
    "rejected": "Rejected",
    "completed": "Completed",
    "cancelled": "Cancelled"
  },
  "errors": {
    "not_found": "Page Not Found",
    "go_back": "Go Back",
    "failed_to_load": "Failed to load"
  }
}
```

---

## ✅ Implementation Checklist

### Step 1: Prepare Base Structure
- [ ] Create/expand `client/src/locales/en/common.json` with all categories
- [ ] Add all placeholder keys based on modules above
- [ ] Organize by feature/module

### Step 2: Extract Text by Module (in order)
- [ ] 1. Authentication (4 files)
- [ ] 2. Client Landing & Navigation (2 files)
- [ ] 3. Client Information Pages (4 files)
- [ ] 4. Client EIC (6 files)
- [ ] 5. Client Seminar (1 file)
- [ ] 6. Client Distribution (1 file)
- [ ] 7. Client Profile & Settings (9 files)
- [ ] 8. Chat & Support (9 files)
- [ ] 9. Survey System (3 files)
- [ ] 10. Common Components (9 files)

### Step 3: Implementation
- [ ] Replace hardcoded text with `t()` calls per module
- [ ] Test each module after changes
- [ ] Verify no broken UI
- [ ] Ensure language switching works

### Step 4: Translation
- [ ] Copy complete `client/src/locales/en/common.json` to `client/src/locales/tl/common.json`
- [ ] Translate all English values to Tagalog
- [ ] Test Tagalog language in UI
- [ ] Get native speaker to review translations

---

## 📊 Progress Tracking

**Total Files to Process:** ~48 JSX files (CLIENT-SIDE ONLY)
**Estimated Translation Keys:** 400-600 keys
**Current Status:** Planning Phase
**NO ADMIN FILES INCLUDED**

---

## 🔧 Implementation Pattern

### Before:
```jsx
<h1>Welcome to Farmer Connect</h1>
<button>Submit</button>
```

### After:
```jsx
import { useCustomTranslation } from '@/hooks/useCustomTranslation';

const { t } = useCustomTranslation();

<h1>{t('landing.welcome')}</h1>
<button>{t('common.submit')}</button>
```

---

## 📌 Notes

- ✅ Use dot notation for nested keys: `t('auth.login.title')`
- ✅ Keep keys descriptive: `t('seminar.enrollment.success_message')`
- ✅ Group related translations together
- ✅ Use common keys for repeated text (Save, Cancel, Edit, Delete, etc.)
- ✅ Handle plurals properly: `t('items', { count: 5 })`
- ✅ Include context in key names when needed
- ❌ NO ADMIN CONTENT - Client-side only
- ❌ NO DATABASE CONTENT - Static UI text only

---

## 🎯 Next Actions

1. ✅ Start with Common components (widely used across all modules)
2. ✅ Move to Authentication module (critical, frequently used)
3. Progress through Client-facing features (Landing → Info → Services)
4. Complete with Settings and Profile
5. Final pass for any missed client-side text
6. **SKIP ALL ADMIN MODULES**
