# Account Schema Simplification - Migration Guide

## Overview
This document outlines the major simplification of the Account model, reducing from 50+ fields to 13 essential fields. This change significantly reduces data collection complexity while maintaining core functionality.

## Migration Details
- **Migration Name**: `20251123082949_simplify_account_schema`
- **Date Applied**: November 23, 2024
- **Database**: MySQL (Aiven Cloud)
- **Prisma Version**: 6.15.0

## Removed Fields

### Address Information (8 fields)
- `street` - Street address
- `barangay` - Barangay/district
- `municipality` - Municipality
- `province` - Province
- `region` - Region
- `houseNumber` - House number
- `address` - Legacy combined address field

### Contact Information (1 field)
- `landlineNumber` - Landline telephone number
- **Kept**: `mobileNumber` renamed to `contactNumber`

### Birth Information (3 fields)
- `birthMunicipality` - Birth municipality
- `birthProvince` - Birth province
- `birthCountry` - Birth country
- **Kept**: `dateOfBirth` - Date of birth

### Personal Details (5 fields)
- `religion` - Religion
- `otherReligionSpecify` - Other religion specification
- `civilStatus` - Civil status (Single/Married/Widow/etc)
- `spouseName` - Spouse name

### Household Information (6 fields)
- `femaleHouseholdMembers` - Count of female household members
- `maleHouseholdMembers` - Count of male household members
- `isHouseholdHead` - Boolean indicating household head
- `householdHeadName` - Name of household head
- `relationshipToHead` - Relationship to household head (enum)

### Government ID Information (3 fields)
- `hasGovId` - Boolean for government ID possession
- `govIdType` - Type of government ID (enum: National ID, Driver's License, etc.)
- `govIdNumber` - Government ID number

### Education (1 field)
- `education` - Education level (enum: Elementary, High School, College, etc.)

### PWD Information (2 fields)
- `isPWD` - Boolean for Person with Disability
- `disabilityType` - Type of disability

### Livelihood Profile (14 fields)
- `livelihoodProfile` - JSON array of livelihood types
- `farmingActivities` - JSON array of farming activities
- `fishingActivities` - JSON array of fishing activities
- `farmworkActivities` - JSON array of farmwork activities
- `youthActivities` - JSON array of youth activities
- `otherCropsSpecify` - Other crops specification
- `livestockSpecify` - Livestock specification
- `fishingOthersSpecify` - Other fishing activities
- `farmworkOthersSpecify` - Other farmwork activities
- `youthOthersSpecify` - Other youth activities

### Income Information (2 fields)
- `grossAnnualIncome` - Gross annual income range
- `incomeSource` - Income source (enum: farming, non-farming)

### Image Storage (2 fields)
- `picture` - Bytes blob for profile picture
- `mimeType` - MIME type of stored picture
- **Replaced with**: `picturePath` - String path to Firebase Cloud Storage

## Retained Fields (13 total)

### Identity (5 fields)
- `firstName` - First name (required)
- `middleName` - Middle name (optional)
- `surname` - Surname (required)
- `extensionName` - Name extension like Jr., Sr., III (optional)

### Personal Information (3 fields)
- `sex` - Sex (enum: Male, Female) - **renamed from `gender`, removed "Other" option**
- `contactNumber` - Contact/mobile number (optional) - **renamed from `mobileNumber`**
- `dateOfBirth` - Date of birth (optional)

### Credentials (3 fields)
- `username` - Username (required, unique)
- `password` - Hashed password (required)
- `email` - Email address (optional, unique when provided)

### Authorization & Profile (2 fields)
- `access` - Access level (enum: Admin, User, Super_Admin)
- `client_profile` - Client profile type (enum: 10 options including Fishfolk, Student, Youth, Women, etc.)

### Image Reference (1 field)
- `picturePath` - Firebase Cloud Storage path (optional)

### System Fields (3 fields - auto-managed)
- `id` - Unique identifier (CUID)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Password Reset (2 fields)
- `resetTokenHash` - Password reset token hash
- `resetTokenExpiry` - Password reset token expiration

## Enum Changes

### Removed Enums
- `RelationshipToHead` - (12 values: Son, Daughter, Spouse, etc.)
- `GovIdType` - (11 values: National ID, Driver's License, etc.)
- `EducationLevel` - (12 values: Elementary, High School, College, etc.)
- `IncomeSource` - (2 values: farming, non-farming)
- `gender` - (3 values: Male, Female, Other)

### Modified Enums
- **`gender` → `sexOption`** - Renamed enum, removed "Other" option
  - Values: `Male`, `Female`

### Retained Enums
- `client_profile` - 10 profile types (unchanged)
- `access` - 3 access levels (unchanged)

## Breaking Changes

### API Contract Changes

#### Registration Endpoint (`/api/auth/register` or `/api/account/register`)
**Before:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "firstName": "string",
  "surname": "string",
  "gender": "Male|Female|Other",
  "address": "string",
  "telephone_no": "string",
  "cellphone_no": "string",
  "occupation": "string",
  "position": "string",
  "institution": "string",
  "clientProfile": "string"
}
```

**After:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string (optional)",
  "firstName": "string",
  "middleName": "string (optional)",
  "surname": "string",
  "extensionName": "string (optional)",
  "sex": "Male|Female",
  "contactNumber": "string (optional)",
  "dateOfBirth": "ISO date string (optional)",
  "clientProfile": "client_profile enum"
}
```

#### Update Profile Endpoints
- `POST /api/account/setMyDetails` - Simplified to 13 fields
- `POST /api/account/setUserDetails/:id` - Simplified to 13 fields

**Removed Fields from Request Body:**
All address, household, government ID, education, livelihood, and income fields have been removed from the API contract.

### Database Changes

#### Data Loss
⚠️ **WARNING**: The migration resulted in permanent data loss for the following:
- 2 accounts with full demographic information
- All address information (street, barangay, municipality, province, region, house number)
- All household composition data
- All government ID information
- All education records
- All livelihood profile data
- All income information

#### Foreign Key Impacts
**No Breaking Changes** - All foreign key relationships remain intact:
- `auditLogs` - AdminAuditLogs relation
- `inquiries` - User inquiries, assigned inquiries, resolved inquiries
- `chatMessages`, `chatParticipants`, `chatReadReceipts`, `chatAttachments`
- `registeredCrops`, `reportFeedback`, `cropStageMessages`
- `seminars`, `seminarsCreated`
- `surveyFormsCreated`, `surveyResponses`, `surveyStatisticsCreated`
- `itemTransactions`, `adminTransactions`
- `createdFAQs`, `createdFAQCategories`
- `preferences`

All relations use the `id` field which was not modified.

## Migration Steps

### Backend Changes

#### 1. Schema Update ✅
- Updated `server/prisma/schema/account.prisma`
- Removed 43 obsolete fields
- Renamed `gender` enum to `sexOption`
- Changed `picture` (Bytes) to `picturePath` (String)
- Changed `mobileNumber` to `contactNumber`

#### 2. Migration Execution ✅
```powershell
cd server
npx prisma migrate dev --name simplify_account_schema
```
- Warnings acknowledged for data loss (33 columns with non-null values)
- Migration applied successfully

#### 3. Seed Scripts ✅
- **`seed-accounts-only.js`**: Updated to use only simplified fields, removed sharp image processing, replaced with picturePath
- **`Seeds/accounts.seed.js`**: Updated 11 test accounts to use simplified schema
- **`Data/account.json`**: Reduced from 60+ fields to 13 fields for Admin and User accounts

#### 4. Controllers ✅
- **`adminRegister.js`**: Updated to accept only simplified fields
- **`getMyDetails.js`**: Removed picture/mimeType exclusion
- **`setMyDetails.js`**: Completely refactored validation and update logic
- **`setUserDetails.js`**: Updated for admin user management with simplified fields
- **`getAllAccounts.js`**: No changes required (uses select on existing fields)

#### 5. Photo Controllers (⚠️ Needs Review)
- **`getMyPhoto.js`**: May need updates for Firebase Cloud Storage
- **`getUserPhoto.js`**: May need updates for Firebase Cloud Storage
- **`setMyPhoto.js`**: Needs complete rewrite for Firebase upload
- **`deleteMyPhoto.js`**: Needs update for Firebase deletion

### Frontend Changes (🔄 In Progress)

#### Components to Update
1. **Registration/Signup Forms**
   - Remove all demographic collection forms
   - Simplify to basic identity + contact info
   - Update validation rules

2. **Profile Edit Forms**
   - `client/src/Admin/Account/Edit_Profile.jsx`
   - `client/src/Components/Common/Info_Block.jsx`
   - Remove tabs/sections for:
     - Address Information
     - Household Composition
     - Government ID
     - Education
     - Livelihood Profile
     - Income Information

3. **Profile Display Components**
   - Simplify profile card/views to show only available fields
   - Update any reports/dashboards that display user demographics

4. **Form Validation**
   - Update client-side validation to match new schema
   - Remove validation for deleted fields
   - Add validation for new optional fields

#### API Integration Updates
- Update all API calls to use new field names (`sex` instead of `gender`, `contactNumber` instead of `cellphone_no`)
- Remove request body fields that no longer exist
- Update response handling to expect simplified user objects

## Firebase Integration Plan

### Cloud Storage Structure
```
firebase-storage/
└── accounts/
    ├── admin.jpg
    ├── user.jpg
    ├── {username1}.jpg
    ├── {username2}.png
    └── ...
```

### Implementation Steps
1. **Setup Firebase Project**
   - Create Firebase project
   - Enable Cloud Storage
   - Configure security rules for account profile pictures

2. **Install Firebase SDK**
   ```bash
   cd server
   npm install firebase-admin
   ```

3. **Configure Firebase Admin**
   - Add service account JSON to server (not in git)
   - Initialize Firebase Admin SDK in server startup

4. **Update Photo Controllers**
   - `setMyPhoto.js`: Upload to Firebase, store URL in `picturePath`
   - `getMyPhoto.js`: Fetch from Firebase using `picturePath`
   - `deleteMyPhoto.js`: Delete from Firebase, set `picturePath` to null

5. **Migration Script for Existing Images**
   - Extract existing `picture` Bytes from database
   - Upload to Firebase Cloud Storage
   - Update `picturePath` with Firebase URL
   - Run migration script before removing `picture` field

### Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /accounts/{filename} {
      // Allow read for authenticated users
      allow read: if request.auth != null;
      
      // Allow write only for the account owner or admins
      allow write: if request.auth != null && 
        (request.auth.uid == getAccountIdFromFilename(filename) || 
         hasAdminRole(request.auth.token));
    }
  }
}
```

## Potential Complications

### 1. Data Loss Recovery
**Issue**: 33 columns with non-null values were dropped
**Impact**: Cannot revert migration without losing all data entered after migration
**Mitigation**: 
- Create database backup before migration
- Document that this is a one-way migration
- Provide clear communication to users about data loss

### 2. Legacy Code Dependencies
**Issue**: Old code may reference removed fields
**Impact**: Runtime errors when accessing undefined properties
**Mitigation**:
- Search codebase for references to removed field names
- Use TypeScript/JSDoc for compile-time checking
- Add defensive coding for property access

### 3. Report Generation
**Issue**: Existing reports may depend on demographic data
**Impact**: Reports will show incomplete or missing data
**Mitigation**:
- Audit all report generation code
- Update report queries to use only available fields
- Add "Data not available" placeholders for removed fields

### 4. Frontend Form Handling
**Issue**: Forms may submit removed fields
**Impact**: Extra data in requests (ignored by backend), potential validation errors
**Mitigation**:
- Clean up form state management
- Remove all input components for deleted fields
- Update form submission handlers

### 5. Third-party Integrations
**Issue**: External systems may expect full demographic data
**Impact**: API contract violations, integration failures
**Mitigation**:
- Audit all API consumers
- Provide migration notice to API users
- Version the API if backward compatibility is required

### 6. Firebase Migration
**Issue**: Migrating existing Bytes blobs to Firebase
**Impact**: Temporary unavailability of profile pictures during migration
**Mitigation**:
- Write and test migration script thoroughly
- Schedule migration during low-traffic period
- Keep fallback logic for missing pictures

### 7. Image File Size & Format
**Issue**: Firebase has different size limits than database
**Impact**: Large images may fail to upload
**Mitigation**:
- Implement client-side image compression
- Validate file size before upload (recommend max 2MB)
- Support common formats (JPEG, PNG, WebP)

### 8. Connection Pool Exhaustion
**Issue**: Multiple simultaneous Firebase uploads
**Impact**: Aiven connection pool exhaustion (20 connection limit)
**Mitigation**:
- Use existing `requestQueue` middleware
- Implement upload queue for batch operations
- Consider Firebase client SDK for direct uploads (bypassing server)

## Testing Checklist

### Backend Testing
- [ ] Run seed scripts successfully
- [ ] Create new account via API
- [ ] Update existing account via API
- [ ] Verify all controllers return correct data structure
- [ ] Test validation for required fields
- [ ] Test validation for enum values
- [ ] Confirm foreign key relationships intact

### Frontend Testing
- [ ] Registration form works with simplified fields
- [ ] Profile edit form displays only available fields
- [ ] Profile view displays correctly
- [ ] Photo upload/display works (after Firebase integration)
- [ ] Form validation works correctly
- [ ] No console errors for undefined properties

### Integration Testing
- [ ] End-to-end user registration flow
- [ ] End-to-end profile update flow
- [ ] Admin account management
- [ ] Inquiry system (user relations)
- [ ] Chat system (user relations)
- [ ] Seminar system (user relations)

## Rollback Plan

### If Issues Arise
1. **Stop the Server**: Prevent further data operations
2. **Restore Database Backup**: Revert to pre-migration state
3. **Revert Code Changes**: 
   - Checkout previous commit before schema changes
   - Run `npx prisma generate` to regenerate old client
4. **Communicate Downtime**: Notify users of temporary rollback

### Rollback Limitations
⚠️ **Cannot rollback if**:
- New data has been created with simplified schema
- Database backup was not created before migration
- More than 24 hours have passed (backup retention policy)

## Future Considerations

### Optional Fields to Consider Adding Back
If user feedback indicates need for specific data:
- Basic address (city/province only)
- Emergency contact information
- Language preference

### Extensibility
- Consider using JSON fields for optional "extended profile" data
- Implement profile completion percentage
- Allow users to opt-in to providing additional information

## Conclusion

This simplification reduces the Account model from 50+ fields to 13 essential fields, making the system:
- **Easier to maintain**: Less code to update and test
- **More privacy-friendly**: Collecting only necessary information
- **Faster to load**: Smaller data payloads
- **Simpler for users**: Less form fatigue during registration

The migration is **irreversible** due to data loss. Ensure all stakeholders are aware of the implications before proceeding with deployment.

---

**Document Version**: 1.0  
**Last Updated**: November 23, 2024  
**Author**: System Administrator  
**Status**: Migration Applied ✅
