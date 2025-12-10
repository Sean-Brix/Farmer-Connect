# SURVEY FORM MANAGEMENT (ADMIN)

## Survey Forms List Page

[IMAGE PLACEHOLDER: screenshot of survey forms management page]

- Administrators can create, manage, and analyze survey forms distributed to users.
- Accessible by: Super Admin only

**Steps / How to Use**
1. Log in as a Super Administrator
2. Navigate to "Survey Forms" from the admin sidebar menu
3. View all survey forms displayed in a list or card format showing:
   - Survey title
   - Description
   - Status (Draft, Active, Closed)
   - Number of responses received
   - Creation date
   - Last modified date
4. Use search bar to find specific surveys
5. Filter by status (Active, Closed, Draft)
6. Click on any survey to view details, responses, or analytics

**Notes**
- Only Super Admins have access to create and manage surveys
- Active surveys are visible to users for participation
- Draft surveys are not visible to users until published
- Response counts update in real-time as users submit surveys

---

## Create New Survey Form

[IMAGE PLACEHOLDER: screenshot of create survey form builder]

- Design and create new survey forms with custom questions.
- Accessible by: Super Admin only

**Steps / How to Use**
1. From the Survey Forms page, click "Create New Survey" button
2. Fill in the survey basic information:
   - **Title** (required): Name of the survey
   - **Description**: Purpose and instructions for participants
   - **Status**: Select Draft or Active
3. Add survey questions by clicking "Add Question" button
4. For each question, configure:
   - **Question Text** (required): The question to ask
   - **Question Type**: Multiple Choice, Text, Rating Scale, Yes/No, etc.
   - **Required**: Whether the question must be answered
   - **Options**: For multiple choice questions, add answer choices
5. Reorder questions by dragging if needed
6. Preview the survey to see how users will experience it
7. Click "Create Survey" or "Save as Draft" button

**Notes**
- Surveys saved as Draft are not visible to users
- Active surveys become immediately available for users to fill out
- Questions can be edited later if the survey is still in draft
- Cannot modify questions once responses have been collected (data integrity)

---

## Edit Survey Form

[IMAGE PLACEHOLDER: screenshot of edit survey form]

- Modify existing survey forms that have not received responses.
- Accessible by: Super Admin only

**Steps / How to Use**
1. From the Survey Forms list, locate the survey you want to edit
2. Click "Edit" button (pencil icon)
3. The survey builder will open with existing questions
4. Modify:
   - Survey title and description
   - Question text and options
   - Question order (drag and drop)
   - Required/optional settings
5. Add new questions or remove existing ones
6. Click "Save Changes" button
7. Confirm changes in the confirmation dialog

**Notes**
- Surveys with existing responses cannot have questions modified (to preserve data integrity)
- You can change the survey status (Draft ↔ Active ↔ Closed)
- Closing a survey prevents new responses while preserving existing data
- Always preview after editing to ensure proper display

---

## View Survey Responses

[IMAGE PLACEHOLDER: screenshot of survey responses page]

- View all submitted responses for a specific survey form.
- Accessible by: Super Admin only

**Steps / How to Use**
1. From the Survey Forms list, click on a survey with responses
2. Click "View Responses" or navigate to the Responses tab
3. View responses in table format showing:
   - Respondent name (if logged in) or Anonymous
   - Submission date and time
   - Each question and corresponding answer
   - Completion status (Completed/Partial)
4. Use pagination to browse through multiple responses
5. Filter responses by date range or completion status
6. Click on individual responses to view detailed answers

**Notes**
- Responses are collected in real-time as users submit surveys
- Anonymous surveys don't track user identity for privacy
- Export functionality available to download all responses
- Responses cannot be modified after submission (read-only)

---

## Survey Analytics & Statistics

[IMAGE PLACEHOLDER: screenshot of survey analytics dashboard]

- View aggregated statistics and visualizations of survey results.
- Accessible by: Super Admin only

**Steps / How to Use**
1. Open a survey form
2. Navigate to "Analytics" or "Statistics" tab
3. View comprehensive analytics including:
   - **Total Responses**: Number of submitted surveys
   - **Response Rate**: Percentage of users who participated
   - **Question Statistics**: For each question, see:
     - Multiple choice: Distribution charts, most popular answers
     - Text responses: Word clouds, common themes
     - Rating scales: Average ratings, distribution graphs
   - **Time Analysis**: Response trends over time
4. Filter analytics by date range if needed
5. Click on charts for interactive details

**Notes**
- Analytics update automatically as new responses come in
- Visual charts help identify trends and patterns quickly
- Use statistics to inform decision-making and reporting
- Text responses may require manual review for detailed insights

---

## Export Survey Results

[IMAGE PLACEHOLDER: screenshot of export survey dialog]

- Download survey responses and analytics for external analysis or reporting.
- Accessible by: Super Admin only

**Steps / How to Use**
1. Open the survey you want to export
2. Click "Export" or "Download Results" button
3. Select export options:
   - **Format**: CSV, Excel (XLSX), PDF
   - **Content**: Responses only, Analytics only, or Both
   - **Date Range**: All time or specific range
4. Click "Generate Export"
5. The file downloads automatically to your device
6. Open with appropriate software (Excel, Google Sheets, etc.)

**Notes**
- CSV format is best for data analysis in spreadsheet software
- PDF format is suitable for printed reports and presentations
- Excel format preserves formatting and supports charts
- Large surveys may take a moment to generate
- Exported data includes timestamps and respondent information (if not anonymous)

---

## Close/Archive Survey

[IMAGE PLACEHOLDER: screenshot of close survey confirmation]

- Close a survey to prevent new submissions while retaining existing data.
- Accessible by: Super Admin only

**Steps / How to Use**
1. Locate the active survey you want to close
2. Click "Close Survey" or change status to "Closed"
3. A confirmation dialog will appear
4. Optionally add a closure note or reason
5. Click "Confirm" to close the survey
6. Survey status changes to "Closed" and is no longer accessible for new submissions

**Notes**
- Closed surveys remain visible in the survey list
- All existing responses are preserved
- Users can no longer submit new responses to closed surveys
- Survey can potentially be reopened if needed (status back to Active)
- Closing is preferable to deleting for data retention

---

## Delete Survey Form

[IMAGE PLACEHOLDER: screenshot of delete survey confirmation]

- Permanently remove a survey form from the system.
- Accessible by: Super Admin only

**Steps / How to Use**
1. Locate the survey you want to delete
2. Click "Delete" button (trash icon)
3. A warning modal will appear showing:
   - Survey title
   - Number of responses that will be deleted
   - Warning about permanent deletion
4. Review the warning carefully
5. Type confirmation text if required (e.g., survey name)
6. Click "Delete Survey" to confirm
7. Survey and all associated responses are permanently removed

**Notes**
- This action cannot be undone
- All responses are permanently deleted
- Export data before deleting if you need to retain information
- Consider closing instead of deleting for record-keeping purposes
- Deleted surveys cannot be recovered
