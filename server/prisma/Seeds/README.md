# Farmer Connect - Seed Data Documentation

## Overview

This seed script populates the database with comprehensive sample data for testing and development purposes. **Optimized for Aiven free tier with batch operations** to minimize query pooling limits.

## How to Run

```bash
# From server directory
npm run fill

# Or use the full setup (generates Prisma client, runs migrations, and seeds)
npm run setup
```

## Performance Optimizations

### Batch Operations (Aiven Free Tier Compatible)

All seed operations use batch techniques to minimize database connections:

- **Cleanup**: Single `$transaction` with all delete operations (28 tables)
- **FAQ**: `createMany()` for categories and FAQs
- **Surveys**: `$transaction` with nested `createMany()` for fields
- **Inventory**: `createMany()` for items and stacks
- **Seminars**: `createMany()` for all seminars
- **Final Summary**: Single `$transaction` for all count queries

### Query Reduction

- **Before**: ~150+ individual queries
- **After**: ~15 batch operations
- **Improvement**: ~90% fewer database connections

## Seeded Data Summary

### 1. **Accounts** (1 account)
- **System Administrator**
  - Username: `admin`
  - Password: `123456`
  - Email: `admin@farmerconnect.com`
  - Access Level: `Super_Admin`
  - Profile: Government Employee

**Login Credentials:**
```
username: admin
password: 123456
```

---

### 2. **FAQ Categories** (5 categories)

Each category contains 3-4 detailed questions and answers:

1. **Seed Distribution**
   - Questions about seed distribution programs and requirements
   - 4 FAQs covering application, varieties, allocation, and claiming procedures

2. **Farming Equipment**
   - Information about farming equipment and machinery rental
   - 4 FAQs covering availability, requests, fees, and damage policies

3. **Seminars and Training**
   - Details about available seminars, workshops, and training programs
   - 3 FAQs covering registration, costs, and certificates

4. **Financial Assistance**
   - Information about loans, subsidies, and financial support programs
   - 4 FAQs covering assistance types, collateral, insurance, and calamity support

5. **Account and Registration**
   - Account management, registration, and profile-related questions
   - 3 FAQs covering account creation, password reset, and profile updates

**Total FAQs:** 18 questions across 5 categories

---

### 3. **Survey Forms** (5 comprehensive surveys)

Each survey includes 7-9 detailed fields with proper field types:

1. **Farmer Satisfaction Survey 2025**
   - Category: `feedback`
   - Status: `ACTIVE`
   - Fields: Name, Email, Program selection, Satisfaction ratings, Recommendations
   - **8 fields** (TEXT, EMAIL, SELECT, RADIO, CHECKBOX, TEXTAREA)

2. **Equipment Needs Assessment**
   - Category: `equipment`
   - Status: `ACTIVE`
   - Fields: Farm location, Area, Crop type, Current/Needed equipment, Purchase preferences
   - **7 fields** (TEXT, NUMBER, SELECT, CHECKBOX, RADIO, TEXTAREA)

3. **Seminar Topic Preferences**
   - Category: `seminar`
   - Status: `ACTIVE`
   - Fields: Name, Experience, Topic interests, Format preferences, Schedule preferences
   - **7 fields** (TEXT, NUMBER, CHECKBOX, RADIO, SELECT, TEXTAREA)

4. **Crop Damage and Climate Impact Survey**
   - Category: `agriculture`
   - Status: `ACTIVE`
   - Fields: Farmer details, Incident date, Crop type, Damage assessment, Insurance status
   - **9 fields** (TEXT, DATE, SELECT, NUMBER, CHECKBOX, RADIO, TEXTAREA)

5. **Market Access and Sales Channels Survey**
   - Category: `general`
   - Status: `ACTIVE`
   - Fields: Farm name, Products, Current markets, Satisfaction, Challenges, Cooperative interest
   - **7 fields** (TEXT, SELECT, CHECKBOX, RADIO, TEXTAREA)

**Note:** Survey responses and statistics are not seeded initially (can be added later if needed).

---

### 4. **Inventory Items** (6 items with 1-5 stacks each)

Each item represents realistic farming equipment:

1. **Hand Tractor - Kubota KJ15**
   - Category: `Farming_Equipment`
   - Description: 15HP diesel-powered hand tractor with rotavator
   - **3 stacks** (different statuses)

2. **Knapsack Sprayer - 16L Capacity**
   - Category: `Pest_Control`
   - Description: Manual backpack sprayer with adjustable nozzle
   - **5 stacks** (different statuses)

3. **Rice Thresher - Portable Model**
   - Category: `Harvesting_Tools`
   - Description: Gasoline-powered, 500kg/hour capacity
   - **2 stacks** (different statuses)

4. **Water Pump - 2-inch Centrifugal**
   - Category: `Irrigation_Systems`
   - Description: Gasoline-powered, 400L/min flow rate
   - **4 stacks** (different statuses)

5. **Mechanical Rice Dryer - Batch Type**
   - Category: `Processing_Equipment`
   - Description: 2-ton capacity, reduces moisture in 6-8 hours
   - **1 stack** (limited availability)

6. **Corn Sheller - Hand Operated**
   - Category: `Harvesting_Tools`
   - Description: Manual corn sheller, 50-80kg/hour capacity
   - **3 stacks** (different statuses)

**Item Stack Statuses:**
- `Available` - Ready for distribution
- `Unavailable` - Currently not available
- `Damaged` - Needs repair
- `EIC` - Equipment for Immediate Checkout (30-day limit)
- `Distributed` - Already distributed to farmers

**Total:** 6 items, 18 stacks

**Note:** Item transactions are not seeded initially (can be added later if needed).

---

### 5. **Seminars** (6 training programs)

Realistic agricultural training seminars with proper scheduling:

1. **Climate-Smart Rice Farming Techniques**
   - Date: Next month, 15th (9:00 AM - 5:00 PM)
   - Location: Municipal Agriculture Office - Main Hall
   - Speaker: Dr. Maria Santos - Agricultural Extension Specialist
   - Capacity: 50 participants
   - Status: `Upcoming`

2. **Organic Vegetable Production and Marketing**
   - Date: Next month, 22nd-23rd (8:00 AM - 4:00 PM, 2 days)
   - Location: Barangay San Isidro Community Center
   - Speaker: Engr. Roberto Cruz - Organic Agriculture Consultant
   - Capacity: 40 participants
   - Status: `Upcoming`

3. **Modern Irrigation Systems and Water Conservation**
   - Date: Two months ahead, 5th (1:00 PM - 5:00 PM)
   - Location: Agricultural Training Center - Field Demo Area
   - Speaker: Engr. Juan Dela Cruz - Irrigation Engineer
   - Capacity: 35 participants
   - Status: `Upcoming`

4. **Financial Literacy for Farmers: Budgeting and Record Keeping**
   - Date: Two months ahead, 12th (9:00 AM - 3:00 PM)
   - Location: Rural Bank Conference Room
   - Speaker: Ms. Ana Martinez - Agricultural Loan Officer
   - Capacity: 60 participants
   - Status: `Upcoming`

5. **Post-Harvest Handling and Value Addition**
   - Date: Two months ahead, 20th (8:30 AM - 4:30 PM)
   - Location: Municipal Agriculture Office - Training Room
   - Speaker: Prof. Elena Torres - Food Technology Expert
   - Capacity: 45 participants
   - Status: `Upcoming`

6. **Integrated Pest Management for Rice and Corn**
   - Date: Last month, 20th (9:00 AM - 5:00 PM)
   - Location: Barangay Demonstration Farm
   - Speaker: Dr. Carlos Mendoza - Plant Pathologist
   - Capacity: 50 participants
   - Status: `Completed`

**Total:** 6 seminars (5 upcoming, 1 completed)

**Note:** Seminar participants are not seeded initially (can be added later when users register).

---

### 6. **Planting Data** (Original seed data)

- **Planting Seasons** - Various cropping seasons
- **Seed Varieties** - Different rice and crop varieties
- **Planting Reports** - Sample planting reports linked to seasons and varieties

---

## File Structure

```
server/prisma/Seeds/
├── index.js                    # Main seed orchestrator
├── accounts.seed.js            # System admin account only
├── faq.seed.js                 # FAQ categories and questions (NEW)
├── surveys.seed.js             # Survey forms with detailed fields (UPDATED)
├── inventory.seed.js           # Farming equipment and stacks (UPDATED)
├── seminars.seed.js            # Training seminars (UPDATED)
├── planting-reports.seed.js    # Original planting data
├── audit.seed.js               # Audit logs (not used in main seed)
├── chat.seed.js                # Chat rooms (not used in main seed)
├── crop-reports.seed.js        # Crop reports (not used in main seed)
├── inquiries.seed.js           # Inquiries (not used in main seed)
├── util.js                     # Utility functions
└── README.md                   # This file
```

---

## Seed Execution Order

The seed script runs in this specific order to maintain referential integrity:

1. **Clean existing data** (in reverse dependency order)
2. **Accounts** - Creates system admin
3. **FAQ Categories** - Creates 5 categories
4. **FAQs** - Creates 18 questions
5. **Survey Forms** - Creates 5 surveys with fields
6. **Inventory Items** - Creates 6 equipment types
7. **Item Stacks** - Creates 18 stacks (1-5 per item)
8. **Seminars** - Creates 6 training programs
9. **Planting Seasons** - Creates cropping seasons
10. **Seed Varieties** - Creates seed varieties
11. **Planting Reports** - Creates sample reports

---

## Sample Output

When you run `npm run fill`, you'll see:

```
🌱 Starting comprehensive seed process...

🧹 Cleaning existing data...
✅ Cleanup complete

[Accounts] DONE in 0.5s
✅ Created 1 account (System Administrator)
📝 Login: username = admin | password = 123456

[FAQ Categories] DONE in 0.3s
✅ Created 5 FAQ categories

[FAQs] DONE in 0.6s
✅ Created 18 FAQs across 5 categories

[Survey Forms] DONE in 1.2s
✅ Created 5 survey forms with detailed fields

[Inventory Items] DONE in 0.4s
✅ Created 6 inventory items

[Item Stacks] DONE in 0.5s
✅ Created 18 item stacks (1-5 stacks per item)

[Seminars] DONE in 0.6s
✅ Created 6 seminars (5 upcoming, 1 completed)

[Planting Seasons] DONE in 0.3s
[Seed Varieties] DONE in 0.4s
[Planting Reports] DONE in 2.1s

📊 Seeding Summary:
  Accounts:         1 (System Admin)
  FAQ Categories:   5
  FAQs:             18
  Survey Forms:     5
  Inventory Items:  6
  Item Stacks:      18
  Seminars:         6
  Planting Seasons: X
  Seed Varieties:   X
  Planting Reports: X

✨ All done! Database seeded successfully.

📝 Login Credentials:
   username: admin
   password: 123456
```

---

## Notes

- **Password:** All accounts use the default password `123456` (hashed with bcrypt)
- **Minimal Data:** This seed focuses on essential data with only 1 admin account
- **Production Ready:** All seeded data uses realistic, professional content
- **Extensible:** Additional data (responses, transactions, participants) can be added later as needed
- **Clean Database:** The seed script cleans all existing data before seeding to ensure a fresh start

---

## Testing the Data

After seeding, you can test the following features:

### FAQ Section
- Browse 5 categories
- Read 18 detailed FAQ entries
- Test search and filtering

### Surveys
- View 5 active survey forms
- See different field types (TEXT, NUMBER, RADIO, CHECKBOX, SELECT, DATE, TEXTAREA)
- Test form submission (once users exist)

### Inventory
- Browse 6 types of farming equipment
- Check stock availability (18 stacks across different statuses)
- Test equipment request workflow

### Seminars
- View 5 upcoming seminars
- See 1 completed seminar
- Test seminar registration
- Check capacity limits

---

## Customization

To customize the seed data, edit the respective seed files:

- **accounts.seed.js** - Modify admin account details
- **faq.seed.js** - Add/edit FAQ categories and questions
- **surveys.seed.js** - Modify survey forms and fields
- **inventory.seed.js** - Add/edit equipment items and stacks
- **seminars.seed.js** - Modify seminar details and schedules

After making changes, run `npm run fill` to re-seed the database.

---

## Troubleshooting

**Issue:** Seed fails with foreign key constraint error
- **Solution:** The seed script now properly cleans data in reverse dependency order

**Issue:** Duplicate key error
- **Solution:** The seed script deletes all data first, preventing duplicates

**Issue:** Some data is missing
- **Solution:** Check console output for any error messages during seeding

**Issue:** Want to add more sample data
- **Solution:** Edit the respective seed file and increase counts or add more items

---

## Future Enhancements

Optional seeds that can be added later:

- **Survey Responses** - Sample user responses to surveys
- **Item Transactions** - Equipment borrowing/return records
- **Seminar Participants** - User registrations for seminars
- **User Accounts** - Additional farmer accounts for testing
- **Inquiries** - Sample customer support inquiries
- **Chat Messages** - Sample chat conversations
- **Crop Reports** - Monthly crop monitoring reports

These are deliberately excluded from the initial seed to keep the database clean and focused.
