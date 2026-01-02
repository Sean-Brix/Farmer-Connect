# Comprehensive Test Data Seed Guide

## 🎯 Overview
This comprehensive seed script creates **realistic test data with ALL possible states** for every feature in the Farmer Connect system. Perfect for thorough testing before production deployment.

## 🚀 Quick Start

### Run Comprehensive Seed (Recommended for Testing)
```bash
npm run seed:all-states
```

OR

```bash
npm run seed:test
```

### Reset Database and Run Comprehensive Seed
```bash
npm run reset:test
```

### Run Standard Seed (Original)
```bash
npm run seed:modular
```

## 📊 What Gets Created

### 👥 **User Accounts** (16 total)
- **1 Super Admin** - Full system access
- **5 Regular Admins** - Administrative functions
- **10 Farmers (Users)** - End-user accounts
  - All with RSBSA numbers
  - Various regions and locations
  - Default password: `123456`

### 📚 **FAQ System**
- **5 FAQ Categories**
  - 4 Active categories
  - 1 Inactive category
  
- **20+ FAQs** covering:
  - Seed Distribution (5 active)
  - Equipment Rental (5 active)
  - Seminars & Training (5 active)
  - Financial Aid (5 inactive - for testing)

### 📋 **Survey Forms** (15 total)
States covered:
- **5 ACTIVE** surveys (currently accepting responses)
- **5 DRAFT** surveys (in preparation)
- **5 CLOSED** surveys (completed/archived)

Each survey includes 5 fields of various types (TEXT, EMAIL, SELECT, RADIO, TEXTAREA)

### 💬 **Inquiries** (25 total - 5 per status)
All statuses with realistic dates:
- **5 Open** - New inquiries (0-10 days old)
- **5 Pending** - Awaiting response (15-27 days old)
- **5 Under Review** - Being processed (25-33 days old)
- **5 Resolved** - Completed (40-52 days old)
- **5 Closed** - Archived (60-80 days old)

Categories: Technical, Billing, General, Equipment, Seeds
Priorities: Low, Medium, High, Urgent

### 🎓 **Seminars** (20 total - 5 per status)
All lifecycle states:
- **5 Scheduled** - Upcoming (10-38 days from now)
- **5 Ongoing** - Currently running (started yesterday, ends in 2 days)
- **5 Completed** - Past seminars (30-70 days ago)
- **5 Cancelled** - Cancelled events (for various reasons)

Each with:
- Realistic participant counts
- Location details
- Proper date ranges

### 📦 **Inventory Items** (25 items)
Various stock levels:
- **In Stock** - Adequate quantity
- **Low Stock** - Below minimum threshold
- **Out of Stock** - Zero quantity
- **Reserved** - Allocated but not distributed

Categories: Seeds, Fertilizer, Pesticide, Equipment

### 🚚 **Distribution Requests** (25 total - 5 per status)
All transaction states:
- **5 Pending** - Awaiting approval (0-10 days old)
- **5 Approved** - Ready for pickup (10-20 days old)
- **5 Picked Up** - Completed transactions (30-45 days old)
- **5 Rejected** - Denied requests (20-36 days old)
- **5 Cancelled** - User cancelled (25-37 days old)

### 🌾 **Planting Data**
#### Seasons (5)
- Dry Season 2024 (completed)
- Wet Season 2024 (completed)
- Dry Season 2025 (active)
- Wet Season 2025 (active)
- Dry Season 2026 (upcoming)

#### Seed Varieties (6)
- **Rice varieties**: RC 160, RC 222, NSIC Rc 216, PSB Rc 18
- **Corn varieties**: IPB Var 6, Pioneer 3021
- Active and inactive varieties

#### Planting Reports (25 total - 5 per state)
All crop lifecycle states:
- **5 Planted** - Recently seeded (10-18 days ago)
- **5 Growing** - Active growth phase (40-60 days ago)
- **5 Mature** - Ready for harvest (110-122 days ago, harvest in 5-13 days)
- **5 Harvested** - Completed (150-190 days ago, with yield data)
- **5 Failed** - Crop failure (80-120 days ago)

Each report includes:
- Planting dates
- Expected/actual harvest dates
- Field locations
- Area planted (1.5-4.0 hectares)
- Yield amounts (for harvested crops)

## 🔑 Login Credentials

### Admin Access
```
Username: admin
Password: 123456
```

### Farmer Accounts
```
Username: farmer01 through farmer10
Password: 123456
(All have unique RSBSA numbers and locations)
```

## 📅 Date Distribution
Data is distributed across realistic time ranges:
- **Past data**: Up to 190 days ago
- **Current data**: Today
- **Future data**: Up to 38 days from now

This allows testing of:
- Date filters
- Historical data views
- Upcoming events
- Overdue items
- Timeline visualizations

## 🎯 Testing Scenarios Covered

### ✅ Status Transitions
- Open → Pending → Under Review → Resolved → Closed (Inquiries)
- Pending → Approved → Picked Up (Distribution)
- Scheduled → Ongoing → Completed (Seminars)
- Draft → Active → Closed (Surveys)
- Planted → Growing → Mature → Harvested (Planting Reports)

### ✅ Edge Cases
- Empty/zero stock items
- Cancelled/rejected requests
- Failed crop reports
- Inactive categories and FAQs
- Overdue items
- Maxed out seminar participants

### ✅ Date-based Features
- Filtering by date ranges
- Sorting by creation/update dates
- Overdue/upcoming indicators
- Timeline views
- Historical analysis

### ✅ Pagination & Filtering
- Multiple pages of data for each feature
- Various filter combinations
- Search functionality
- Status-based filtering

## 📝 Usage Tips

1. **Initial Setup**
   ```bash
   npm run reset:test
   ```
   This cleans the database and creates all test data.

2. **Re-seed Without Migration**
   ```bash
   npm run seed:all-states
   ```
   Use when you just need to refresh data without changing schema.

3. **Standard Seed (Minimal Data)**
   ```bash
   npm run seed:modular
   ```
   Use for quick basic setup (less comprehensive).

## 🔍 Data Verification

After seeding, verify with:
```sql
-- Check counts per status
SELECT status, COUNT(*) FROM "Inquiry" GROUP BY status;
SELECT status, COUNT(*) FROM "Seminar" GROUP BY status;
SELECT status, COUNT(*) FROM "ItemTransaction" GROUP BY status;
SELECT currentState, COUNT(*) FROM "PlantingReport" GROUP BY currentState;
SELECT status, COUNT(*) FROM "SurveyForm" GROUP BY status;
```

## 🎨 Visual Testing Checklist

After seeding, test these UI scenarios:

- [ ] View all inquiry statuses in different tabs
- [ ] Filter seminars by status (Scheduled, Ongoing, Completed, Cancelled)
- [ ] Check inventory items with different stock levels
- [ ] View distribution request history with all statuses
- [ ] Verify planting reports in different crop states
- [ ] Test survey filtering (Active, Draft, Closed)
- [ ] Check date-based sorting and filtering
- [ ] Verify pagination with multiple pages
- [ ] Test search functionality across all modules

## 🚨 Important Notes

- All passwords are set to `123456` for testing
- Data includes realistic dates spanning 190 days (past to future)
- RSBSA numbers follow format: `RSBSA-XXX-2024`
- All farmers are assigned to different regions/municipalities
- Stock levels are intentionally varied (including out of stock)
- Some items are intentionally inactive/cancelled for testing

## 🛠️ Troubleshooting

**"Foreign key constraint failed"**
- Run `npm run reset:test` to clean and reseed

**"Unique constraint failed"**
- Database wasn't cleaned properly. Use reset command

**"Timeout exceeded"**
- Free tier limitation. Script already optimized for Aiven free tier

## 📞 Support

For issues or questions about the seed data:
1. Check the console output for detailed seeding logs
2. Review the seed summary at the end
3. Verify database schema is up to date (`npx prisma generate`)

---

**Happy Testing! 🎉**

All states, all statuses, all scenarios - ready to test!
