# 06 - Controller: Cropping Seasons

**Phase:** Controllers  
**Dependency:** 04, 05 complete  
**Estimated Time:** 1-2 hours  
**File:** `server/Controller/CroppingSeason/seasonController.js` (UPDATE EXISTING)

---

## ✅ PROGRESS CHECKLIST

- [ ] **Step 6.1:** Review current seasonController implementation
- [ ] **Step 6.2:** Update season deletion warnings for new state system
- [ ] **Step 6.3:** Add method to get report counts by state
- [ ] **Step 6.4:** Update getSeasonById to include state statistics
- [ ] **Step 6.5:** Test season deletion with state checks
- [ ] **Step 6.6:** Verify cascade delete still works

---

## 📋 IMPLEMENTATION STEPS

### Step 6.1: Review Current seasonController Implementation

**EXAMINE:** `server/Controller/CroppingSeason/seasonController.js`

**What to look for:**
- How seasons are created
- How seasons are deleted
- Current cascade delete warnings
- References to planting reports
- Statistics calculations

**Expected findings:**
- Season deletion checks for linked planting reports
- Warning system before cascade deletes
- Report count methods

**Current code example (for reference):**
```javascript
// Likely has something like this:
async function deleteSeason(req, res) {
    // Check for linked reports
    const reportCount = await prisma.plantingReport.count({
        where: { croppingSeasonId: seasonId }
    });
    
    if (reportCount > 0) {
        return res.status(400).json({
            message: `Cannot delete: ${reportCount} reports linked`
        });
    }
    
    // ... delete logic
}
```

**Verification:**
- [ ] Current implementation understood
- [ ] Deletion logic identified
- [ ] Report linking mechanism clear

---

### Step 6.2: Update Season Deletion Warnings

**FIND:** The `deleteSeason` or similar function

**UPDATE to include state-aware checks:**

```javascript
/**
 * DELETE - Delete a cropping season
 * 
 * Updated to check NEW state system:
 * - Counts reports by state (Request_Report, Planted, Completed)
 * - Excludes soft-deleted reports (isDeleted: false)
 * - Provides detailed breakdown before deletion
 */
export async function deleteSeason(req, res) {
    try {
        const { id } = req.params;

        // Check if season exists
        const season = await prisma.croppingSeason.findUnique({
            where: { id }
        });

        if (!season) {
            return res.status(404).json({
                success: false,
                message: 'Cropping season not found'
            });
        }

        // Count linked planting reports by state (exclude deleted)
        const [totalCount, requestCount, plantedCount, completedCount] = await Promise.all([
            prisma.plantingReport.count({
                where: {
                    croppingSeasonId: id,
                    isDeleted: false
                }
            }),
            prisma.plantingReport.count({
                where: {
                    croppingSeasonId: id,
                    isDeleted: false,
                    state: 'Request_Report'
                }
            }),
            prisma.plantingReport.count({
                where: {
                    croppingSeasonId: id,
                    isDeleted: false,
                    state: 'Planted'
                }
            }),
            prisma.plantingReport.count({
                where: {
                    croppingSeasonId: id,
                    isDeleted: false,
                    state: 'Completed'
                }
            })
        ]);

        // Prevent deletion if reports exist
        if (totalCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete season: ${totalCount} planting reports are linked`,
                details: {
                    total: totalCount,
                    byState: {
                        Request_Report: requestCount,
                        Planted: plantedCount,
                        Completed: completedCount
                    },
                    recommendation: completedCount > 0 
                        ? 'Archive completed reports first, then delete the rest'
                        : 'Delete or reassign all linked reports first'
                }
            });
        }

        // Safe to delete - no reports linked
        await prisma.croppingSeason.delete({
            where: { id }
        });

        console.log(`🗑️ [Season] Deleted season ${id} (${season.seasonName})`);

        return res.status(200).json({
            success: true,
            message: `Season "${season.seasonName}" deleted successfully`
        });

    } catch (error) {
        console.error('❌ [Season] Delete error:', error);
        
        if (error.code === 'P2003') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete season: foreign key constraint violation'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to delete cropping season',
            error: error.message
        });
    }
}
```

**Key Changes:**
- Excludes `isDeleted: true` reports from counts
- Shows breakdown by state (Request/Planted/Completed)
- Provides actionable recommendations
- More detailed error messages

**Verification:**
- [ ] Excludes soft-deleted reports
- [ ] Shows state breakdown
- [ ] Provides helpful error messages

---

### Step 6.3: Add Method to Get Report Counts by State

**ADD new helper function:**

```javascript
/**
 * HELPER - Get planting report statistics for a season
 * 
 * Returns counts by state, archive status, etc.
 * Useful for season detail pages
 */
export async function getSeasonReportStatistics(seasonId) {
    const [
        totalActive,
        totalDeleted,
        totalArchived,
        requestReports,
        plantedReports,
        completedReports,
        riceReports,
        cornReports
    ] = await Promise.all([
        // Active (not deleted)
        prisma.plantingReport.count({
            where: {
                croppingSeasonId: seasonId,
                isDeleted: false
            }
        }),
        // Soft deleted
        prisma.plantingReport.count({
            where: {
                croppingSeasonId: seasonId,
                isDeleted: true
            }
        }),
        // Archived
        prisma.plantingReport.count({
            where: {
                croppingSeasonId: seasonId,
                isDeleted: false,
                isArchived: true
            }
        }),
        // By state
        prisma.plantingReport.count({
            where: {
                croppingSeasonId: seasonId,
                isDeleted: false,
                state: 'Request_Report'
            }
        }),
        prisma.plantingReport.count({
            where: {
                croppingSeasonId: seasonId,
                isDeleted: false,
                state: 'Planted'
            }
        }),
        prisma.plantingReport.count({
            where: {
                croppingSeasonId: seasonId,
                isDeleted: false,
                state: 'Completed'
            }
        }),
        // By crop type
        prisma.plantingReport.count({
            where: {
                croppingSeasonId: seasonId,
                isDeleted: false,
                typeOfCrop: 'Rice'
            }
        }),
        prisma.plantingReport.count({
            where: {
                croppingSeasonId: seasonId,
                isDeleted: false,
                typeOfCrop: 'Corn'
            }
        })
    ]);

    return {
        total: totalActive,
        deleted: totalDeleted,
        archived: totalArchived,
        byState: {
            Request_Report: requestReports,
            Planted: plantedReports,
            Completed: completedReports
        },
        byCrop: {
            Rice: riceReports,
            Corn: cornReports
        }
    };
}
```

**Verification:**
- [ ] Function compiles
- [ ] Returns all required statistics
- [ ] Excludes deleted reports

---

### Step 6.4: Update getSeasonById to Include Statistics

**FIND:** The `getSeasonById` or `getSeasonDetails` function

**UPDATE to include report statistics:**

```javascript
/**
 * READ - Get season by ID with detailed statistics
 * 
 * Updated to include:
 * - Report counts by state
 * - Archive and delete statistics
 * - Crop type breakdown
 */
export async function getSeasonById(req, res) {
    try {
        const { id } = req.params;

        // Get season details
        const season = await prisma.croppingSeason.findUnique({
            where: { id },
            include: {
                createdByUser: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        if (!season) {
            return res.status(404).json({
                success: false,
                message: 'Cropping season not found'
            });
        }

        // Get report statistics
        const reportStats = await getSeasonReportStatistics(id);

        console.log(`✅ [Season] Retrieved season ${id} (${season.seasonName})`);

        return res.status(200).json({
            success: true,
            data: {
                ...season,
                reportStatistics: reportStats
            }
        });

    } catch (error) {
        console.error('❌ [Season] Get by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve cropping season',
            error: error.message
        });
    }
}
```

**Expected response format:**
```json
{
    "success": true,
    "data": {
        "id": "season-uuid",
        "seasonName": "Wet Season 2024",
        "startDate": "2024-05-01",
        "endDate": "2024-10-31",
        "reportStatistics": {
            "total": 156,
            "deleted": 3,
            "archived": 89,
            "byState": {
                "Request_Report": 12,
                "Planted": 34,
                "Completed": 110
            },
            "byCrop": {
                "Rice": 120,
                "Corn": 36
            }
        }
    }
}
```

**Verification:**
- [ ] Statistics included in response
- [ ] No performance issues
- [ ] Correct counts returned

---

### Step 6.5: Test Season Deletion with State Checks

**Create test cases:**

```javascript
// Test 1: Try to delete season with active reports
const deleteWithReports = await fetch(`/api/seasons/${seasonId}`, {
    method: 'DELETE'
});
// Expected: 400 error with state breakdown

// Test 2: Delete season with only soft-deleted reports
// First soft-delete all reports in season
const reportsToDelete = await fetch(`/api/planting-reports/reports?croppingSeasonId=${seasonId}`);
const reportIds = reportsToDelete.data.map(r => r.id);

await fetch('/api/planting-reports/reports/bulk/delete', {
    method: 'POST',
    body: JSON.stringify({ reportIds, deletedBy: 'user-uuid' })
});

// Now try delete season
const deleteAfterSoftDelete = await fetch(`/api/seasons/${seasonId}`, {
    method: 'DELETE'
});
// Expected: 200 success (soft-deleted reports don't count)

// Test 3: Delete empty season
const deleteEmpty = await fetch(`/api/seasons/${emptySeasonId}`, {
    method: 'DELETE'
});
// Expected: 200 success
```

**Verification:**
- [ ] Cannot delete with active reports
- [ ] Can delete with only soft-deleted reports
- [ ] Error shows state breakdown
- [ ] Provides helpful recommendations

---

### Step 6.6: Verify Cascade Delete Still Works

**Test cascade behavior:**

```javascript
// SCENARIO: Manually confirm what happens when season is deleted

// 1. Create test season
const season = await prisma.croppingSeason.create({
    data: {
        seasonName: 'Test Season Cascade',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        createdBy: 'user-uuid'
    }
});

// 2. Create test report linked to season
const report = await prisma.plantingReport.create({
    data: {
        farmerName: 'Test Farmer',
        areaPlanted: 1.0,
        typeOfCrop: 'Rice',
        varietyId: 'variety-uuid',
        croppingSeasonId: season.id,  // LINKED
        state: 'Request_Report',
        seedClassification: 'Certified',
        isDeleted: false,
        createdBy: 'user-uuid'
    }
});

// 3. Try to delete season (should fail)
try {
    await prisma.croppingSeason.delete({
        where: { id: season.id }
    });
    console.error('❌ Should have failed!');
} catch (error) {
    console.log('✅ Correctly prevented deletion');
}

// 4. Soft delete the report
await prisma.plantingReport.update({
    where: { id: report.id },
    data: { isDeleted: true, deletedAt: new Date() }
});

// 5. Try delete season again (should succeed now)
await prisma.croppingSeason.delete({
    where: { id: season.id }
});
console.log('✅ Season deleted after reports soft-deleted');
```

**Verification:**
- [ ] Cascade delete prevention works
- [ ] Soft-deleted reports don't block deletion
- [ ] Orphaned reports are handled correctly

---

## 🎯 EXIT CRITERIA

- [x] **All 6 checkboxes marked**
- [x] **Season controller updated for state system**
- [x] **Deletion warnings include state breakdown**
- [x] **Statistics helper added**
- [x] **Tests pass**
- [x] **No breaking changes**

---

## 📝 ADDITIONAL NOTES

### Optional Enhancement: Season Report Export

If you want to add a CSV export feature for season reports:

```javascript
export async function exportSeasonReports(req, res) {
    const { id } = req.params;
    
    const reports = await prisma.plantingReport.findMany({
        where: {
            croppingSeasonId: id,
            isDeleted: false
        },
        include: {
            variety: true,
            croppingSeason: true
        }
    });
    
    // Generate CSV
    const csv = generateCSV(reports);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="season-${id}-reports.csv"`);
    res.send(csv);
}
```

This is NOT required for the implementation but might be useful.

---

**Next File:** [07_Controller_Varieties.md](./07_Controller_Varieties.md)  
**Status:** Ready for implementation
