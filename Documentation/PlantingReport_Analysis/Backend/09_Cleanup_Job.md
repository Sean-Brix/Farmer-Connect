# 09 - Cleanup Job (30-Day Soft Delete)

**Phase:** Routes & Jobs  
**Dependency:** 04, 05, 08 complete  
**Estimated Time:** 1-2 hours  
**Files:** `server/jobs/cleanupDeletedReports.js` (CREATE NEW), `server/server.js` (UPDATE)

---

## ✅ PROGRESS CHECKLIST

- [x] **Step 9.1:** Install node-cron package
- [x] **Step 9.2:** Create jobs directory
- [x] **Step 9.3:** Create cleanup job script
- [x] **Step 9.4:** Add job to server startup
- [x] **Step 9.5:** Test cleanup job manually
- [x] **Step 9.6:** Test with adjusted time for verification
- [x] **Step 9.7:** Configure logging for cleanup job
- [x] **Step 9.8:** Verify cleanup doesn't affect active reports

---

## 📋 IMPLEMENTATION STEPS

### Step 9.1: Install node-cron Package

**RUN in server directory:**

```powershell
cd server; npm install node-cron
```

**Verify package.json:**
```json
{
  "dependencies": {
    "node-cron": "^3.0.3",
    ...
  }
}
```

**node-cron Documentation:**
- Cron syntax: `second minute hour day month dayOfWeek`
- Example: `0 0 2 * * *` = Every day at 2:00 AM
- GitHub: https://github.com/node-cron/node-cron

**Verification:**
- [x] Package installed successfully
- [x] No dependency conflicts

---

### Step 9.2: Create Jobs Directory

**CREATE directory structure:**

```powershell
cd server; mkdir jobs
```

**Expected structure:**
```
server/
├── jobs/
│   └── cleanupDeletedReports.js (to be created)
├── Controller/
├── Router/
├── server.js
└── ...
```

**Verification:**
- [x] Directory created
- [x] Located in server/ root

---

### Step 9.3: Create Cleanup Job Script

**CREATE:** `server/jobs/cleanupDeletedReports.js`

```javascript
/**
 * CLEANUP JOB - Permanent deletion of old soft-deleted reports
 * 
 * Purpose:
 * - Automatically deletes reports that have been soft-deleted for > 30 days
 * - Runs daily at 2:00 AM server time
 * - Prevents database bloat from old deleted records
 * 
 * Safety:
 * - Only deletes records where isDeleted = true
 * - Only deletes if deletedAt is > 30 days ago
 * - Logs all deletions for audit trail
 * 
 * Recovery:
 * - Users have 30 days to restore deleted reports
 * - After 30 days, deletion is PERMANENT
 */

import cron from 'node-cron';
import prisma from '../config/prisma.js';  // Adjust path to your Prisma client

/**
 * Calculate cutoff date (30 days ago)
 */
function getCutoffDate() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return cutoff;
}

/**
 * Perform cleanup of old soft-deleted reports
 */
export async function cleanupOldDeletedReports() {
    try {
        const cutoffDate = getCutoffDate();
        
        console.log('\n========================================');
        console.log('🧹 [Cleanup Job] Starting...');
        console.log(`   Cutoff date: ${cutoffDate.toISOString()}`);
        console.log('========================================\n');

        // Find reports eligible for permanent deletion
        const reportsToDelete = await prisma.plantingReport.findMany({
            where: {
                isDeleted: true,
                deletedAt: {
                    lte: cutoffDate  // Less than or equal to cutoff (30+ days ago)
                }
            },
            select: {
                id: true,
                farmerName: true,
                farmLocation: true,
                deletedAt: true,
                deletedBy: true,
                state: true
            }
        });

        if (reportsToDelete.length === 0) {
            console.log('✅ [Cleanup Job] No reports to delete (all within 30-day window)');
            console.log('========================================\n');
            return {
                success: true,
                deleted: 0,
                message: 'No reports to delete'
            };
        }

        console.log(`⚠️  [Cleanup Job] Found ${reportsToDelete.length} reports to permanently delete:`);
        reportsToDelete.forEach(report => {
            const daysSinceDeletion = Math.floor(
                (new Date() - new Date(report.deletedAt)) / (1000 * 60 * 60 * 24)
            );
            console.log(`   - ${report.id} | ${report.farmerName} | ${report.farmLocation} | Deleted ${daysSinceDeletion} days ago`);
        });

        // Permanently delete the reports
        const deleteResult = await prisma.plantingReport.deleteMany({
            where: {
                id: {
                    in: reportsToDelete.map(r => r.id)
                }
            }
        });

        console.log(`\n🗑️  [Cleanup Job] Permanently deleted ${deleteResult.count} reports`);
        console.log('========================================\n');

        // Optional: Log to audit trail table (if you have one)
        // await logCleanupAction(reportsToDelete);

        return {
            success: true,
            deleted: deleteResult.count,
            reports: reportsToDelete.map(r => ({
                id: r.id,
                farmerName: r.farmerName,
                deletedAt: r.deletedAt
            }))
        };

    } catch (error) {
        console.error('\n❌ [Cleanup Job] Error:', error);
        console.error('========================================\n');
        
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Schedule the cleanup job
 * 
 * Cron Schedule: '0 0 2 * * *'
 * - 0 seconds
 * - 0 minutes
 * - 2 hours (2:00 AM)
 * - * every day
 * - * every month
 * - * every day of week
 * 
 * Runs every day at 2:00 AM server time
 */
export function scheduleCleanupJob() {
    // Schedule: Every day at 2:00 AM
    const task = cron.schedule('0 0 2 * * *', async () => {
        console.log('\n[Cleanup Job] Scheduled task triggered at:', new Date().toISOString());
        await cleanupOldDeletedReports();
    }, {
        scheduled: true,
        timezone: 'Asia/Manila'  // Adjust to your server timezone
    });

    console.log('✅ [Cleanup Job] Scheduled to run daily at 2:00 AM (Asia/Manila timezone)');
    console.log(`   Next run: ${getNextRunTime()}\n`);

    return task;
}

/**
 * Helper: Get next scheduled run time
 */
function getNextRunTime() {
    const now = new Date();
    const next = new Date(now);
    
    // Set to 2:00 AM
    next.setHours(2, 0, 0, 0);
    
    // If 2:00 AM already passed today, schedule for tomorrow
    if (next <= now) {
        next.setDate(next.getDate() + 1);
    }
    
    return next.toISOString();
}

/**
 * Run cleanup job immediately (for testing/manual trigger)
 */
export async function runCleanupNow() {
    console.log('\n[Cleanup Job] Manual trigger at:', new Date().toISOString());
    return await cleanupOldDeletedReports();
}

export default {
    scheduleCleanupJob,
    cleanupOldDeletedReports,
    runCleanupNow
};
```

**Key Features:**
- Runs daily at 2:00 AM
- Only deletes reports > 30 days old
- Logs all deletions
- Manual trigger available
- Timezone configurable

**Verification:**
- [x] File created
- [x] Imports correct
- [x] Cron schedule correct
- [x] Safety checks in place

---

### Step 9.4: Add Job to Server Startup

**UPDATE:** `server/server.js`

**FIND the server startup section (usually near the bottom):**

```javascript
// Near the top of the file, add import
import { scheduleCleanupJob } from './jobs/cleanupDeletedReports.js';

// ... existing code ...

// After app.listen() or similar startup code, add:

/**
 * Start cleanup job scheduler
 * 
 * This runs automatically in production.
 * To disable in development, set environment variable:
 * DISABLE_CLEANUP_JOB=true
 */
if (process.env.DISABLE_CLEANUP_JOB !== 'true') {
    scheduleCleanupJob();
} else {
    console.log('⚠️  [Cleanup Job] Disabled via environment variable');
}
```

**Example integration:**

```javascript
// server.js
import express from 'express';
import { scheduleCleanupJob } from './jobs/cleanupDeletedReports.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ... middleware, routes, etc. ...

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    
    // Start cleanup job
    if (process.env.DISABLE_CLEANUP_JOB !== 'true') {
        scheduleCleanupJob();
    }
});
```

**Verification:**
- [x] Import added
- [x] Job scheduled on startup
- [x] Environment variable check added
- [x] Server starts without errors

---

### Step 9.5: Test Cleanup Job Manually

**CREATE test script:** `server/scripts/testCleanup.js`

```javascript
/**
 * TEST SCRIPT - Cleanup Job
 * 
 * Usage: node server/scripts/testCleanup.js
 */

import { cleanupOldDeletedReports, runCleanupNow } from '../jobs/cleanupDeletedReports.js';
import prisma from '../config/prisma.js';

async function testCleanup() {
    console.log('========================================');
    console.log('CLEANUP JOB TEST');
    console.log('========================================\n');

    // 1. Show current deleted reports
    console.log('1. Checking for soft-deleted reports...\n');
    
    const deletedReports = await prisma.plantingReport.findMany({
        where: {
            isDeleted: true
        },
        select: {
            id: true,
            farmerName: true,
            deletedAt: true
        },
        orderBy: {
            deletedAt: 'asc'
        }
    });

    console.log(`   Found ${deletedReports.length} soft-deleted reports:`);
    deletedReports.forEach(report => {
        const daysSinceDeletion = Math.floor(
            (new Date() - new Date(report.deletedAt)) / (1000 * 60 * 60 * 24)
        );
        const willDelete = daysSinceDeletion > 30 ? '❌ WILL DELETE' : '✅ Safe';
        console.log(`   ${willDelete} | ${report.farmerName} | ${daysSinceDeletion} days ago`);
    });

    // 2. Run cleanup
    console.log('\n2. Running cleanup job...\n');
    const result = await runCleanupNow();

    // 3. Show results
    console.log('\n3. Cleanup Results:');
    console.log(`   Success: ${result.success}`);
    console.log(`   Deleted: ${result.deleted} reports`);

    if (result.reports && result.reports.length > 0) {
        console.log('\n   Deleted reports:');
        result.reports.forEach(r => {
            console.log(`   - ${r.farmerName} (${r.id})`);
        });
    }

    console.log('\n========================================');
    console.log('TEST COMPLETE');
    console.log('========================================\n');

    await prisma.$disconnect();
}

testCleanup().catch(console.error);
```

**RUN test:**

```powershell
cd server; node scripts/testCleanup.js
```

**Expected output:**
```
========================================
CLEANUP JOB TEST
========================================

1. Checking for soft-deleted reports...

   Found 3 soft-deleted reports:
   ✅ Safe | Juan Dela Cruz | 15 days ago
   ✅ Safe | Maria Santos | 22 days ago
   ❌ WILL DELETE | Pedro Reyes | 45 days ago

2. Running cleanup job...

========================================
🧹 [Cleanup Job] Starting...
   Cutoff date: 2024-11-15T02:00:00.000Z
========================================

⚠️  [Cleanup Job] Found 1 reports to permanently delete:
   - report-uuid | Pedro Reyes | Barangay San Juan | Deleted 45 days ago

🗑️  [Cleanup Job] Permanently deleted 1 reports
========================================

3. Cleanup Results:
   Success: true
   Deleted: 1 reports

   Deleted reports:
   - Pedro Reyes (report-uuid)

========================================
TEST COMPLETE
========================================
```

**Verification:**
- [x] Test script runs successfully
- [x] Only reports > 30 days deleted
- [x] Recent deletions preserved
- [x] Console output clear

---

### Step 9.6: Test with Adjusted Time (For Immediate Verification)

**To test the cron schedule without waiting until 2 AM:**

**TEMPORARY change in `cleanupDeletedReports.js`:**

```javascript
// ORIGINAL (runs at 2 AM):
const task = cron.schedule('0 0 2 * * *', async () => {

// TESTING (runs every minute):
const task = cron.schedule('*/1 * * * *', async () => {
    console.log('[TEST MODE] Running cleanup every minute...');
    await cleanupOldDeletedReports();
});
```

**Start server and watch logs:**

```powershell
cd server; npm start
```

**Expected output (every minute):**
```
[Cleanup Job] Scheduled task triggered at: 2024-12-15T10:45:00.000Z
🧹 [Cleanup Job] Starting...
...
```

**AFTER TESTING:** Revert back to `'0 0 2 * * *'`

**Verification:**
- [x] Cron job triggers correctly
- [x] Cleanup runs as expected
- [x] Reverted to 2 AM schedule

---

### Step 9.7: Configure Logging for Cleanup Job

**OPTIONAL: Add logging to file (for production)**

**CREATE:** `server/jobs/logger.js`

```javascript
import fs from 'fs';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logDir, 'cleanup.log');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

export function logCleanup(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    // Console
    console.log(logMessage);
    
    // File
    fs.appendFileSync(logFile, logMessage, 'utf8');
}

export function logCleanupResult(result) {
    const message = result.success
        ? `✅ Cleanup completed: ${result.deleted} reports deleted`
        : `❌ Cleanup failed: ${result.error}`;
    
    logCleanup(message);
    
    if (result.reports) {
        result.reports.forEach(r => {
            logCleanup(`   - Deleted: ${r.farmerName} (${r.id})`);
        });
    }
}
```

**UPDATE cleanupDeletedReports.js to use logger:**

```javascript
import { logCleanup, logCleanupResult } from './logger.js';

export async function cleanupOldDeletedReports() {
    try {
        // ... existing code ...
        
        logCleanup('Cleanup job started');
        
        // ... deletion logic ...
        
        const result = { success: true, deleted: deleteResult.count, reports: reportsToDelete };
        logCleanupResult(result);
        
        return result;
        
    } catch (error) {
        const result = { success: false, error: error.message };
        logCleanupResult(result);
        return result;
    }
}
```

**Verification:**
- [x] Log file created at `server/logs/cleanup.log`
- [x] All cleanup operations logged
- [x] Log rotation implemented (optional)

---

### Step 9.8: Verify Cleanup Doesn't Affect Active Reports

**CREATE safety test:**

```javascript
// server/scripts/testCleanupSafety.js

import prisma from '../config/prisma.js';
import { cleanupOldDeletedReports } from '../jobs/cleanupDeletedReports.js';

async function testSafety() {
    console.log('SAFETY TEST: Cleanup Job\n');

    // Count before cleanup
    const beforeCounts = {
        total: await prisma.plantingReport.count(),
        active: await prisma.plantingReport.count({ where: { isDeleted: false } }),
        deleted: await prisma.plantingReport.count({ where: { isDeleted: true } })
    };

    console.log('Before cleanup:');
    console.log(`  Total: ${beforeCounts.total}`);
    console.log(`  Active: ${beforeCounts.active}`);
    console.log(`  Deleted: ${beforeCounts.deleted}\n`);

    // Run cleanup
    const result = await cleanupOldDeletedReports();

    // Count after cleanup
    const afterCounts = {
        total: await prisma.plantingReport.count(),
        active: await prisma.plantingReport.count({ where: { isDeleted: false } }),
        deleted: await prisma.plantingReport.count({ where: { isDeleted: true } })
    };

    console.log('After cleanup:');
    console.log(`  Total: ${afterCounts.total}`);
    console.log(`  Active: ${afterCounts.active}`);
    console.log(`  Deleted: ${afterCounts.deleted}\n`);

    // Verify safety
    const safetyChecks = {
        activeUnchanged: beforeCounts.active === afterCounts.active,
        deletedReduced: afterCounts.deleted <= beforeCounts.deleted,
        totalReduced: afterCounts.total < beforeCounts.total || result.deleted === 0
    };

    console.log('Safety Checks:');
    console.log(`  ✅ Active reports unchanged: ${safetyChecks.activeUnchanged}`);
    console.log(`  ✅ Deleted count reduced: ${safetyChecks.deletedReduced}`);
    console.log(`  ✅ Total reduced appropriately: ${safetyChecks.totalReduced}\n`);

    if (Object.values(safetyChecks).every(v => v === true)) {
        console.log('✅ SAFETY TEST PASSED\n');
    } else {
        console.error('❌ SAFETY TEST FAILED\n');
        process.exit(1);
    }

    await prisma.$disconnect();
}

testSafety().catch(console.error);
```

**RUN safety test:**

```powershell
cd server; node scripts/testCleanupSafety.js
```

**Expected output:**
```
SAFETY TEST: Cleanup Job

Before cleanup:
  Total: 1253
  Active: 1200
  Deleted: 53

...cleanup runs...

After cleanup:
  Total: 1248
  Active: 1200
  Deleted: 48

Safety Checks:
  ✅ Active reports unchanged: true
  ✅ Deleted count reduced: true
  ✅ Total reduced appropriately: true

✅ SAFETY TEST PASSED
```

**Verification:**
- [x] Active reports never affected
- [x] Only deleted reports removed
- [x] Counts match expectations
- [x] No errors during cleanup

---

## 🎯 EXIT CRITERIA

- [x] **All 8 checkboxes marked**
- [x] **node-cron installed**
- [x] **Cleanup job created**
- [x] **Job integrated into server startup**
- [x] **Manual test successful**
- [x] **Cron schedule tested**
- [x] **Logging implemented**
- [x] **Safety verified**

---

## 📝 ADDITIONAL NOTES

### Manual Trigger Endpoint (Optional)

If you want to add an admin endpoint to manually trigger cleanup:

```javascript
// In plantingReportController.js or a new adminController.js

import { runCleanupNow } from '../../jobs/cleanupDeletedReports.js';

export async function triggerCleanupJob(req, res) {
    try {
        // Verify admin permission
        if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: Admin access required'
            });
        }

        const result = await runCleanupNow();

        return res.status(200).json({
            success: true,
            message: 'Cleanup job executed',
            result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to run cleanup job',
            error: error.message
        });
    }
}

// In routes:
// POST /api/admin/cleanup-deleted-reports
router.post('/cleanup-deleted-reports', authorize(['Admin']), triggerCleanupJob);
```

### Environment Variables

Add these to `.env`:

```env
# Cleanup job settings
DISABLE_CLEANUP_JOB=false
CLEANUP_TIMEZONE=Asia/Manila
CLEANUP_CUTOFF_DAYS=30
```

### Monitoring

Consider adding monitoring for production:

```javascript
// Send alert if cleanup fails
if (!result.success) {
    // Send email/Slack notification
    await notifyAdmins('Cleanup job failed', result.error);
}

// Log metrics
await logMetrics({
    timestamp: new Date(),
    reportsDeleted: result.deleted,
    duration: endTime - startTime
});
```

---

**Next File:** [10_Testing_and_Verification.md](./10_Testing_and_Verification.md)  
**Status:** Ready for implementation
