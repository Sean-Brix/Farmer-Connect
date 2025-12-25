# 05 - Controller: PlantingReport (Part 2 - State Transitions & Bulk Operations)

**Phase:** Controllers  
**Dependency:** 04 complete  
**Estimated Time:** 4-5 hours  
**File:** `server/Controller/PlantingReport/plantingReportController.js` (ADD NEW FUNCTIONS)

---

## ✅ PROGRESS CHECKLIST

- [ ] **Step 5.1:** Add transitionToPlanted function
- [ ] **Step 5.2:** Add transitionToCompleted function
- [ ] **Step 5.3:** Add archiveReport function
- [ ] **Step 5.4:** Add unarchiveReport function
- [ ] **Step 5.5:** Add restoreReport function (un-delete)
- [ ] **Step 5.6:** Add bulkArchiveReports function
- [ ] **Step 5.7:** Add bulkDeleteReports function
- [ ] **Step 5.8:** Add getDeletedReports function
- [ ] **Step 5.9:** Test all state transitions
- [ ] **Step 5.10:** Test bulk operations
- [ ] **Step 5.11:** Verify state history tracking

---

## 📋 IMPLEMENTATION STEPS

### Step 5.1: Add transitionToPlanted Function

**Location:** End of `plantingReportController.js`

**ADD this new function:**

```javascript
/**
 * TRANSITION - State 1 (Request_Report) → State 2 (Planted)
 * 
 * Required fields:
 * - dateOfPlanting (must be ≤ today)
 * - plantingMethod (Direct Seeding, Transplanting, etc.)
 * - riceIrrigation (required if typeOfCrop = Rice)
 * 
 * Auto-calculates:
 * - dateOfExpectedHarvest (using variety DAS and planting method)
 */
export async function transitionToPlanted(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id || req.body.lastUpdatedBy;

        // Get existing report
        const report = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: false
            },
            include: {
                variety: true
            }
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found or has been deleted'
            });
        }

        // Validate current state
        if (report.state !== 'Request_Report') {
            return res.status(400).json({
                success: false,
                message: `Cannot transition to Planted from ${report.state} state. Report must be in Request_Report state.`
            });
        }

        // Validate required fields
        const { error, value } = toPlantedSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { dateOfPlanting, plantingMethod, riceIrrigation, reason } = value;

        // Additional validation: Rice crops need irrigation
        if (report.typeOfCrop === 'Rice' && !riceIrrigation) {
            return res.status(400).json({
                success: false,
                message: 'Rice crops require riceIrrigation field'
            });
        }

        // Calculate expected harvest date
        const dateOfExpectedHarvest = await calculateExpectedHarvest(
            report.varietyId,
            dateOfPlanting,
            plantingMethod
        );

        // Update report to State 2
        const updatedReport = await prisma.plantingReport.update({
            where: { id },
            data: {
                // Update planting fields
                dateOfPlanting: new Date(dateOfPlanting),
                plantingMethod,
                riceIrrigation: riceIrrigation || report.riceIrrigation,
                dateOfExpectedHarvest,

                // Update state
                state: 'Planted',

                // Update state history
                stateHistory: updateStateHistory(
                    report.stateHistory,
                    'Request_Report',
                    'Planted',
                    userId,
                    reason || 'Planting completed'
                ),

                // Update metadata
                lastUpdatedBy: userId,
                updatedAt: new Date()
            },
            include: {
                croppingSeason: true,
                variety: true
            }
        });

        console.log(`✅ [Planting Report] ${id} transitioned: Request_Report → Planted`);

        return res.status(200).json({
            success: true,
            message: 'Report successfully transitioned to Planted state',
            data: updatedReport
        });

    } catch (error) {
        console.error('❌ [Planting Report] Transition to Planted error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to transition report to Planted state',
            error: error.message
        });
    }
}
```

**Key Points:**
- Only allows transition from State 1
- Validates required fields (dateOfPlanting, plantingMethod)
- Auto-calculates expected harvest
- Updates state history
- Rice crops need riceIrrigation

**Verification:**
- [ ] Only transitions from Request_Report
- [ ] Validates all required fields
- [ ] Calculates expected harvest
- [ ] Updates state history

---

### Step 5.2: Add transitionToCompleted Function

**ADD after transitionToPlanted:**

```javascript
/**
 * TRANSITION - State 2 (Planted) → State 3 (Completed)
 * 
 * Required fields:
 * - harvestArea (must be ≤ areaPlanted)
 * - numberOfBags
 * - weightPerBag
 * 
 * Auto-calculates:
 * - yieldMtPerHa (with sanity checks)
 */
export async function transitionToCompleted(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id || req.body.lastUpdatedBy;

        // Get existing report
        const report = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: false
            }
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found or has been deleted'
            });
        }

        // Validate current state
        if (report.state !== 'Planted') {
            return res.status(400).json({
                success: false,
                message: `Cannot transition to Completed from ${report.state} state. Report must be in Planted state.`
            });
        }

        // Validate required fields
        const { error, value } = toCompletedSchema.validate(req.body, {
            context: { areaPlanted: report.areaPlanted }
        });
        
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { harvestArea, numberOfBags, weightPerBag, reason } = value;

        // Calculate yield with sanity checks
        const yieldResult = calculateYield(
            harvestArea,
            numberOfBags,
            weightPerBag,
            report.typeOfCrop
        );

        if (!yieldResult.valid) {
            return res.status(400).json({
                success: false,
                message: yieldResult.warning
            });
        }

        // Log warning if yield is outside normal range
        if (yieldResult.warning) {
            console.warn(`⚠️ Yield warning for report ${id}: ${yieldResult.warning}`);
        }

        // Update report to State 3
        const updatedReport = await prisma.plantingReport.update({
            where: { id },
            data: {
                // Update harvest fields
                harvestArea: parseFloat(harvestArea),
                numberOfBags: parseInt(numberOfBags),
                weightPerBag: parseFloat(weightPerBag),
                yieldMtPerHa: yieldResult.yield,

                // Update state
                state: 'Completed',

                // Update state history
                stateHistory: updateStateHistory(
                    report.stateHistory,
                    'Planted',
                    'Completed',
                    userId,
                    reason || 'Harvest completed'
                ),

                // Update metadata
                lastUpdatedBy: userId,
                updatedAt: new Date()
            },
            include: {
                croppingSeason: true,
                variety: true
            }
        });

        console.log(`✅ [Planting Report] ${id} transitioned: Planted → Completed (yield: ${yieldResult.yield} Mt/Ha)`);

        return res.status(200).json({
            success: true,
            message: 'Report successfully transitioned to Completed state',
            data: updatedReport,
            yieldInfo: {
                yield: yieldResult.yield,
                warning: yieldResult.warning || null
            }
        });

    } catch (error) {
        console.error('❌ [Planting Report] Transition to Completed error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to transition report to Completed state',
            error: error.message
        });
    }
}
```

**Key Points:**
- Only allows transition from State 2
- Validates harvestArea ≤ areaPlanted
- Auto-calculates yield
- Sanity checks yield against crop type
- Logs warnings for unusual yields

**Verification:**
- [ ] Only transitions from Planted
- [ ] Validates harvestArea ≤ areaPlanted
- [ ] Calculates yield correctly
- [ ] Logs yield warnings

---

### Step 5.3: Add archiveReport Function

**ADD after transitionToCompleted:**

```javascript
/**
 * ARCHIVE - Archive a completed planting report
 * 
 * Requirements:
 * - Report must be in Completed state
 * - Cannot archive if already archived
 * - Can be un-archived later
 */
export async function archiveReport(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id || req.body.archivedBy;
        const { reason } = req.body;

        // Get existing report
        const report = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: false
            }
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found or has been deleted'
            });
        }

        // Validate can archive
        const { error } = archiveReportSchema.validate({ state: report.state, isArchived: report.isArchived });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        // Archive the report
        const archivedReport = await prisma.plantingReport.update({
            where: { id },
            data: {
                isArchived: true,
                archivedAt: new Date(),
                archivedBy: userId,
                archiveReason: reason || 'Archived by user'
            }
        });

        console.log(`📦 [Planting Report] Archived: ${id} by user ${userId}`);

        return res.status(200).json({
            success: true,
            message: 'Planting report archived successfully',
            data: archivedReport
        });

    } catch (error) {
        console.error('❌ [Planting Report] Archive error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to archive planting report',
            error: error.message
        });
    }
}
```

**Verification:**
- [ ] Only archives Completed reports
- [ ] Tracks who archived and when
- [ ] Prevents double-archiving

---

### Step 5.4: Add unarchiveReport Function

**ADD after archiveReport:**

```javascript
/**
 * UNARCHIVE - Restore an archived report
 * 
 * Removes archive status, clears archive metadata
 */
export async function unarchiveReport(req, res) {
    try {
        const { id } = req.params;

        // Get existing report
        const report = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: false
            }
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found or has been deleted'
            });
        }

        // Check if archived
        if (!report.isArchived) {
            return res.status(400).json({
                success: false,
                message: 'Report is not archived'
            });
        }

        // Unarchive the report
        const unarchivedReport = await prisma.plantingReport.update({
            where: { id },
            data: {
                isArchived: false,
                archivedAt: null,
                archivedBy: null,
                archiveReason: null
            }
        });

        console.log(`📤 [Planting Report] Unarchived: ${id}`);

        return res.status(200).json({
            success: true,
            message: 'Planting report restored from archive',
            data: unarchivedReport
        });

    } catch (error) {
        console.error('❌ [Planting Report] Unarchive error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to unarchive planting report',
            error: error.message
        });
    }
}
```

**Verification:**
- [ ] Only unarchives if currently archived
- [ ] Clears all archive metadata

---

### Step 5.5: Add restoreReport Function (Un-delete)

**ADD after unarchiveReport:**

```javascript
/**
 * RESTORE - Restore a soft-deleted report
 * 
 * Requirements:
 * - Report must be soft-deleted (isDeleted = true)
 * - Must be within 30-day recovery window
 * - Clears deletion metadata
 */
export async function restoreReport(req, res) {
    try {
        const { id } = req.params;

        // Get deleted report (include deleted ones)
        const report = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: true  // Only find deleted reports
            }
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Deleted report not found. It may have been permanently deleted after 30 days.'
            });
        }

        // Check 30-day window
        const deletedDate = new Date(report.deletedAt);
        const now = new Date();
        const daysSinceDeletion = (now - deletedDate) / (1000 * 60 * 60 * 24);

        if (daysSinceDeletion > 30) {
            return res.status(400).json({
                success: false,
                message: 'Report was deleted more than 30 days ago and cannot be restored'
            });
        }

        // Restore the report
        const restoredReport = await prisma.plantingReport.update({
            where: { id },
            data: {
                isDeleted: false,
                deletedAt: null,
                deletedBy: null
            }
        });

        console.log(`♻️ [Planting Report] Restored: ${id}`);

        return res.status(200).json({
            success: true,
            message: 'Planting report restored successfully',
            data: restoredReport
        });

    } catch (error) {
        console.error('❌ [Planting Report] Restore error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to restore planting report',
            error: error.message
        });
    }
}
```

**Verification:**
- [ ] Only restores soft-deleted reports
- [ ] Checks 30-day window
- [ ] Clears deletion metadata

---

### Step 5.6: Add bulkArchiveReports Function

**ADD after restoreReport:**

```javascript
/**
 * BULK ARCHIVE - Archive multiple completed reports at once
 * 
 * Requirements:
 * - All reports must be in Completed state
 * - All reports must not be archived already
 * - Maximum 100 reports per batch
 */
export async function bulkArchiveReports(req, res) {
    try {
        const userId = req.user?.id || req.body.archivedBy;
        const { reportIds, reason } = req.body;

        // Validate bulk request
        const { error } = bulkArchiveSchema.validate({ reportIds });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        // Get all reports
        const reports = await prisma.plantingReport.findMany({
            where: {
                id: { in: reportIds },
                isDeleted: false
            }
        });

        if (reports.length !== reportIds.length) {
            return res.status(404).json({
                success: false,
                message: `Some reports not found. Expected ${reportIds.length}, found ${reports.length}`
            });
        }

        // Validate all can be archived
        const validationResult = validateBulkArchive(reports);
        if (!validationResult.valid) {
            return res.status(400).json({
                success: false,
                message: 'Bulk archive validation failed',
                errors: validationResult.errors
            });
        }

        // Perform bulk archive
        const result = await prisma.plantingReport.updateMany({
            where: {
                id: { in: reportIds }
            },
            data: {
                isArchived: true,
                archivedAt: new Date(),
                archivedBy: userId,
                archiveReason: reason || 'Bulk archived'
            }
        });

        console.log(`📦 [Planting Report] Bulk archived ${result.count} reports by user ${userId}`);

        return res.status(200).json({
            success: true,
            message: `Successfully archived ${result.count} reports`,
            data: {
                archived: result.count,
                reportIds
            }
        });

    } catch (error) {
        console.error('❌ [Planting Report] Bulk archive error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to bulk archive reports',
            error: error.message
        });
    }
}
```

**Verification:**
- [ ] Validates all reports exist
- [ ] Checks all are Completed
- [ ] Enforces 100-report limit
- [ ] Returns count of archived

---

### Step 5.7: Add bulkDeleteReports Function

**ADD after bulkArchiveReports:**

```javascript
/**
 * BULK DELETE - Soft delete multiple reports at once
 * 
 * Requirements:
 * - Reports must not be already deleted
 * - Maximum 100 reports per batch
 * - All reports can be restored within 30 days
 */
export async function bulkDeleteReports(req, res) {
    try {
        const userId = req.user?.id || req.body.deletedBy;
        const { reportIds } = req.body;

        // Validate bulk request
        const { error } = bulkDeleteSchema.validate({ reportIds });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        // Get all reports
        const reports = await prisma.plantingReport.findMany({
            where: {
                id: { in: reportIds },
                isDeleted: false
            }
        });

        if (reports.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No valid reports found for deletion'
            });
        }

        // Perform bulk soft delete
        const result = await prisma.plantingReport.updateMany({
            where: {
                id: { in: reports.map(r => r.id) }
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId
            }
        });

        console.log(`🗑️ [Planting Report] Bulk deleted ${result.count} reports by user ${userId}`);

        return res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.count} reports. Can be restored within 30 days.`,
            data: {
                deleted: result.count,
                reportIds: reports.map(r => r.id),
                recoveryDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        });

    } catch (error) {
        console.error('❌ [Planting Report] Bulk delete error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to bulk delete reports',
            error: error.message
        });
    }
}
```

**Verification:**
- [ ] Validates report IDs
- [ ] Performs soft delete
- [ ] Returns recovery deadline
- [ ] Handles partial failures

---

### Step 5.8: Add getDeletedReports Function

**ADD after bulkDeleteReports:**

```javascript
/**
 * GET DELETED - Retrieve soft-deleted reports (for admin "Deleted" tab)
 * 
 * Shows reports that can be restored (within 30-day window)
 * Includes days remaining until permanent deletion
 */
export async function getDeletedReports(req, res) {
    try {
        // Get pagination
        const { page, limit, skip } = getPaginationParams(req.query);

        // Build query for deleted reports
        const where = buildDeletedReportsQuery({
            typeOfCrop: req.query.typeOfCrop,
            varietyId: req.query.varietyId,
            search: req.query.search
        });

        // Get deleted reports
        const [total, reports] = await Promise.all([
            prisma.plantingReport.count({ where }),
            prisma.plantingReport.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    farmerName: true,
                    farmLocation: true,
                    typeOfCrop: true,
                    areaPlanted: true,
                    state: true,
                    deletedAt: true,
                    deletedBy: true,
                    croppingSeason: {
                        select: {
                            seasonName: true
                        }
                    },
                    variety: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    deletedAt: 'desc'
                }
            })
        ]);

        // Add days until permanent delete
        const reportsWithMetadata = reports.map(report => {
            const daysRemaining = daysUntilPermanentDelete(report.deletedAt);
            return {
                ...report,
                daysUntilPermanentDelete: daysRemaining,
                canRestore: daysRemaining > 0
            };
        });

        const pagination = calculatePagination(total, page, limit);

        console.log(`🗑️ [Planting Report] Retrieved ${reports.length}/${total} deleted reports`);

        return res.status(200).json({
            success: true,
            data: reportsWithMetadata,
            pagination
        });

    } catch (error) {
        console.error('❌ [Planting Report] Get deleted error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve deleted reports',
            error: error.message
        });
    }
}
```

**Verification:**
- [ ] Only returns isDeleted:true
- [ ] Shows days remaining
- [ ] Filters work correctly
- [ ] Pagination applied

---

### Step 5.9: Test State Transitions

**Create test script:**

```javascript
// Test State 1 → 2 → 3 workflow
const reportId = 'test-report-uuid';

// 1. Create report (State 1: Request_Report)
const createResponse = await fetch('/api/planting-reports/reports', {
    method: 'POST',
    body: JSON.stringify({
        farmerName: 'Test Farmer',
        areaPlanted: 2.0,
        typeOfCrop: 'Rice',
        varietyId: 'variety-uuid',
        seedClassification: 'Certified',
        createdBy: 'user-uuid'
    })
});

// 2. Transition to Planted (State 2)
const plantedResponse = await fetch(`/api/planting-reports/reports/${reportId}/transition/planted`, {
    method: 'PATCH',
    body: JSON.stringify({
        dateOfPlanting: '2024-01-15',
        plantingMethod: 'Transplanting',
        riceIrrigation: 'Irrigated',
        lastUpdatedBy: 'user-uuid'
    })
});

// 3. Transition to Completed (State 3)
const completedResponse = await fetch(`/api/planting-reports/reports/${reportId}/transition/completed`, {
    method: 'PATCH',
    body: JSON.stringify({
        harvestArea: 1.8,
        numberOfBags: 36,
        weightPerBag: 50,
        lastUpdatedBy: 'user-uuid'
    })
});

// 4. Archive
const archiveResponse = await fetch(`/api/planting-reports/reports/${reportId}/archive`, {
    method: 'PATCH',
    body: JSON.stringify({
        archivedBy: 'user-uuid',
        reason: 'Season ended'
    })
});
```

**Verification:**
- [ ] State 1→2 transition works
- [ ] State 2→3 transition works
- [ ] Cannot skip states
- [ ] Cannot go backward
- [ ] State history tracked

---

### Step 5.10: Test Bulk Operations

```javascript
// Test bulk archive
const bulkArchiveResponse = await fetch('/api/planting-reports/reports/bulk/archive', {
    method: 'POST',
    body: JSON.stringify({
        reportIds: ['id1', 'id2', 'id3'],
        archivedBy: 'user-uuid',
        reason: 'End of season'
    })
});

// Test bulk delete
const bulkDeleteResponse = await fetch('/api/planting-reports/reports/bulk/delete', {
    method: 'POST',
    body: JSON.stringify({
        reportIds: ['id4', 'id5'],
        deletedBy: 'user-uuid'
    })
});
```

**Verification:**
- [ ] Bulk archive validates all reports
- [ ] Bulk delete returns recovery deadline
- [ ] Max 100 reports enforced
- [ ] Errors handled gracefully

---

### Step 5.11: Verify State History Tracking

**Check database after transitions:**

```sql
SELECT id, state, "stateHistory" 
FROM "PlantingReport" 
WHERE id = 'test-report-uuid';
```

**Expected stateHistory:**
```json
[
  {
    "from": null,
    "to": "Request_Report",
    "timestamp": "2024-01-10T10:00:00Z",
    "by": "user-uuid",
    "reason": "Report created"
  },
  {
    "from": "Request_Report",
    "to": "Planted",
    "timestamp": "2024-01-15T14:30:00Z",
    "by": "user-uuid",
    "reason": "Planting completed"
  },
  {
    "from": "Planted",
    "to": "Completed",
    "timestamp": "2024-04-20T09:15:00Z",
    "by": "user-uuid",
    "reason": "Harvest completed"
  }
]
```

**Verification:**
- [ ] Each transition logged
- [ ] Timestamps accurate
- [ ] User IDs tracked
- [ ] Reasons captured

---

## 🎯 EXIT CRITERIA

- [x] **All 11 checkboxes marked**
- [x] **All state transition functions added**
- [x] **All bulk operation functions added**
- [x] **State validation enforced**
- [x] **State history tracked correctly**
- [x] **Tests pass**

---

**Next File:** [06_Controller_Seasons.md](./06_Controller_Seasons.md)  
**Status:** Ready for implementation
