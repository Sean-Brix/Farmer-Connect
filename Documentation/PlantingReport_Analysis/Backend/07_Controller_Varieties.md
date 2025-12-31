# 07 - Controller: Varieties

**Phase:** Controllers  
**Dependency:** 04, 05, 06 complete  
**Estimated Time:** 1-2 hours  
**File:** `server/Controller/Variety/varietyController.js` (UPDATE EXISTING)

---

## ✅ PROGRESS CHECKLIST

- [x] **Step 7.1:** Review current varietyController implementation
- [x] **Step 7.2:** Update variety deletion warnings for new state system
- [x] **Step 7.3:** Add method to get variety usage statistics
- [x] **Step 7.4:** Add "View Reports Using This" endpoint
- [x] **Step 7.5:** Test variety deletion with state checks
- [x] **Step 7.6:** Verify DAS field usage in expectedHarvest calculation

---

## 📋 IMPLEMENTATION STEPS

### Step 7.1: Review Current varietyController Implementation

**EXAMINE:** `server/Controller/Variety/varietyController.js`

**What to look for:**
- How varieties are created (especially DAS field)
- How varieties are deleted
- Current cascade delete warnings
- References to planting reports
- DAS (Days After Seeding) usage

**Expected findings:**
- Variety deletion checks for linked planting reports
- DAS field for harvest date calculation
- Variety filtering by crop type

**Current code example (for reference):**
```javascript
// Likely has something like:
async function deleteVariety(req, res) {
    // Check for linked reports
    const reportCount = await prisma.plantingReport.count({
        where: { varietyId: varietyId }
    });
    
    if (reportCount > 0) {
        return res.status(400).json({
            message: `Cannot delete: ${reportCount} reports using this variety`
        });
    }
    
    // ... delete logic
}
```

**Verification:**
- [x] Current implementation understood
- [x] DAS field identified
- [x] Deletion logic identified
- [x] Report linking mechanism clear

---

### Step 7.2: Update Variety Deletion Warnings

**FIND:** The `deleteVariety` or similar function

**UPDATE to include state-aware checks:**

```javascript
/**
 * DELETE - Delete a variety
 * 
 * Updated to check NEW state system:
 * - Counts reports by state (Request_Report, Planted, Completed)
 * - Excludes soft-deleted reports (isDeleted: false)
 * - Special warning for Planted reports (harvest in progress)
 * - Provides detailed breakdown before deletion
 */
export async function deleteVariety(req, res) {
    try {
        const { id } = req.params;

        // Check if variety exists
        const variety = await prisma.variety.findUnique({
            where: { id }
        });

        if (!variety) {
            return res.status(404).json({
                success: false,
                message: 'Variety not found'
            });
        }

        // Count linked planting reports by state (exclude deleted)
        const [totalCount, requestCount, plantedCount, completedCount, archivedCount] = await Promise.all([
            prisma.plantingReport.count({
                where: {
                    varietyId: id,
                    isDeleted: false
                }
            }),
            prisma.plantingReport.count({
                where: {
                    varietyId: id,
                    isDeleted: false,
                    state: 'Request_Report'
                }
            }),
            prisma.plantingReport.count({
                where: {
                    varietyId: id,
                    isDeleted: false,
                    state: 'Planted'
                }
            }),
            prisma.plantingReport.count({
                where: {
                    varietyId: id,
                    isDeleted: false,
                    state: 'Completed'
                }
            }),
            prisma.plantingReport.count({
                where: {
                    varietyId: id,
                    isDeleted: false,
                    isArchived: true
                }
            })
        ]);

        // Prevent deletion if reports exist
        if (totalCount > 0) {
            // Special warning for Planted reports (harvest in progress)
            let warning = null;
            if (plantedCount > 0) {
                warning = `⚠️ WARNING: ${plantedCount} reports are currently in Planted state (harvest in progress). Deleting this variety may affect harvest date predictions.`;
            }

            return res.status(400).json({
                success: false,
                message: `Cannot delete variety "${variety.name}": ${totalCount} planting reports are using this variety`,
                details: {
                    total: totalCount,
                    byState: {
                        Request_Report: requestCount,
                        Planted: plantedCount,
                        Completed: completedCount
                    },
                    archived: archivedCount,
                    warning,
                    recommendation: completedCount > 0 
                        ? 'Archive completed reports first, then reassign the rest to a different variety'
                        : 'Reassign all linked reports to a different variety first'
                }
            });
        }

        // Safe to delete - no reports linked
        await prisma.variety.delete({
            where: { id }
        });

        console.log(`🗑️ [Variety] Deleted variety ${id} (${variety.name})`);

        return res.status(200).json({
            success: true,
            message: `Variety "${variety.name}" deleted successfully`
        });

    } catch (error) {
        console.error('❌ [Variety] Delete error:', error);
        
        if (error.code === 'P2003') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete variety: foreign key constraint violation'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to delete variety',
            error: error.message
        });
    }
}
```

**Key Changes:**
- Excludes `isDeleted: true` reports from counts
- Shows breakdown by state
- Special warning for Planted reports (DAS affects harvest prediction)
- Includes archived count
- More detailed error messages

**Verification:**
- [x] Excludes soft-deleted reports
- [x] Shows state breakdown
- [x] Warns about Planted reports
- [x] Provides helpful recommendations

---

### Step 7.3: Add Method to Get Variety Usage Statistics

**ADD new helper function:**

```javascript
/**
 * HELPER - Get planting report statistics for a variety
 * 
 * Returns:
 * - Total reports using this variety
 * - Breakdown by state
 * - Breakdown by crop season
 * - Average yield (for completed reports)
 * 
 * Useful for variety performance analysis
 */
export async function getVarietyUsageStatistics(varietyId) {
    const [
        totalActive,
        totalDeleted,
        totalArchived,
        requestReports,
        plantedReports,
        completedReports,
        yieldStats
    ] = await Promise.all([
        // Active (not deleted)
        prisma.plantingReport.count({
            where: {
                varietyId,
                isDeleted: false
            }
        }),
        // Soft deleted
        prisma.plantingReport.count({
            where: {
                varietyId,
                isDeleted: true
            }
        }),
        // Archived
        prisma.plantingReport.count({
            where: {
                varietyId,
                isDeleted: false,
                isArchived: true
            }
        }),
        // By state
        prisma.plantingReport.count({
            where: {
                varietyId,
                isDeleted: false,
                state: 'Request_Report'
            }
        }),
        prisma.plantingReport.count({
            where: {
                varietyId,
                isDeleted: false,
                state: 'Planted'
            }
        }),
        prisma.plantingReport.count({
            where: {
                varietyId,
                isDeleted: false,
                state: 'Completed'
            }
        }),
        // Yield statistics (completed reports only)
        prisma.plantingReport.aggregate({
            where: {
                varietyId,
                isDeleted: false,
                state: 'Completed',
                yieldMtPerHa: { not: null }
            },
            _avg: {
                yieldMtPerHa: true
            },
            _min: {
                yieldMtPerHa: true
            },
            _max: {
                yieldMtPerHa: true
            },
            _count: {
                yieldMtPerHa: true
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
        yieldPerformance: {
            averageYield: yieldStats._avg.yieldMtPerHa || null,
            minYield: yieldStats._min.yieldMtPerHa || null,
            maxYield: yieldStats._max.yieldMtPerHa || null,
            sampleSize: yieldStats._count.yieldMtPerHa || 0
        }
    };
}
```

**Verification:**
- [x] Function compiles
- [x] Returns all required statistics
- [x] Yield calculations correct
- [x] Excludes deleted reports

---

### Step 7.4: Add "View Reports Using This" Endpoint

**ADD new endpoint function:**

```javascript
/**
 * READ - Get all planting reports using a specific variety
 * 
 * Useful for:
 * - Seeing which farmers are using this variety
 * - Analyzing variety performance across different farms
 * - Understanding variety adoption
 * 
 * Filters:
 * - state: filter by report state
 * - croppingSeasonId: filter by season
 * - isArchived: include/exclude archived
 */
export async function getReportsByVariety(req, res) {
    try {
        const { id } = req.params;

        // Check if variety exists
        const variety = await prisma.variety.findUnique({
            where: { id }
        });

        if (!variety) {
            return res.status(404).json({
                success: false,
                message: 'Variety not found'
            });
        }

        // Get pagination
        const { page, limit, skip } = getPaginationParams(req.query);

        // Build where clause
        const where = {
            varietyId: id,
            isDeleted: false,
            ...(req.query.state && { state: req.query.state }),
            ...(req.query.croppingSeasonId && { croppingSeasonId: req.query.croppingSeasonId }),
            ...(req.query.isArchived !== undefined && { 
                isArchived: req.query.isArchived === 'true' 
            })
        };

        // Get reports
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
                    rsbsaNumber: true,
                    areaPlanted: true,
                    dateOfPlanting: true,
                    yieldMtPerHa: true,
                    state: true,
                    isArchived: true,
                    createdAt: true,
                    croppingSeason: {
                        select: {
                            seasonName: true,
                            startDate: true,
                            endDate: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        ]);

        const pagination = calculatePagination(total, page, limit);

        console.log(`✅ [Variety] Retrieved ${reports.length}/${total} reports using variety ${id}`);

        return res.status(200).json({
            success: true,
            data: {
                variety: {
                    id: variety.id,
                    name: variety.name,
                    cropType: variety.cropType,
                    classification: variety.classification,
                    DAS: variety.DAS
                },
                reports
            },
            pagination
        });

    } catch (error) {
        console.error('❌ [Variety] Get reports by variety error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve reports for variety',
            error: error.message
        });
    }
}
```

**Note:** This function needs the `getPaginationParams` and `calculatePagination` helpers from `03_Utils_and_Helpers.md`.

**Import at top of file:**
```javascript
import { getPaginationParams, calculatePagination } from '../../Utils/plantingReportHelpers.js';
```

**Verification:**
- [x] Endpoint created
- [x] Filters work correctly
- [x] Pagination applied
- [x] Returns variety info

---

### Step 7.5: Update getVarietyById to Include Statistics

**FIND:** The `getVarietyById` or `getVarietyDetails` function

**UPDATE to include usage statistics:**

```javascript
/**
 * READ - Get variety by ID with usage statistics
 * 
 * Updated to include:
 * - Report counts by state
 * - Yield performance metrics
 * - Archive and delete statistics
 */
export async function getVarietyById(req, res) {
    try {
        const { id } = req.params;

        // Get variety details
        const variety = await prisma.variety.findUnique({
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

        if (!variety) {
            return res.status(404).json({
                success: false,
                message: 'Variety not found'
            });
        }

        // Get usage statistics
        const usageStats = await getVarietyUsageStatistics(id);

        console.log(`✅ [Variety] Retrieved variety ${id} (${variety.name})`);

        return res.status(200).json({
            success: true,
            data: {
                ...variety,
                usageStatistics: usageStats
            }
        });

    } catch (error) {
        console.error('❌ [Variety] Get by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve variety',
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
        "id": "variety-uuid",
        "name": "RC 222",
        "cropType": "Rice",
        "classification": "Hybrid",
        "DAS": 115,
        "usageStatistics": {
            "total": 87,
            "deleted": 2,
            "archived": 45,
            "byState": {
                "Request_Report": 8,
                "Planted": 21,
                "Completed": 58
            },
            "yieldPerformance": {
                "averageYield": 5.8,
                "minYield": 3.2,
                "maxYield": 8.1,
                "sampleSize": 58
            }
        }
    }
}
```

**Verification:**
- [x] Statistics included in response
- [x] Yield performance calculated
- [x] No performance issues
- [x] Correct counts returned

---

### Step 7.6: Verify DAS Field Usage in expectedHarvest Calculation

**IMPORTANT:** The `calculateExpectedHarvest` function in `03_Utils_and_Helpers.md` uses the variety's DAS field.

**Review the logic:**

```javascript
// From 03_Utils_and_Helpers.md
export async function calculateExpectedHarvest(varietyId, dateOfPlanting, plantingMethod) {
    const variety = await prisma.variety.findUnique({
        where: { id: varietyId }
    });
    
    if (!variety || !variety.DAS) {
        return null;  // Cannot calculate without DAS
    }
    
    // Adjust DAS based on planting method
    let adjustedDAS = variety.DAS;
    if (plantingMethod === 'Transplanting') {
        adjustedDAS += 21;  // Add 21 days for nursery period
    }
    
    // Calculate expected harvest date
    const plantDate = new Date(dateOfPlanting);
    const expectedDate = new Date(plantDate);
    expectedDate.setDate(expectedDate.getDate() + adjustedDAS);
    
    return expectedDate;
}
```

**Verification checklist:**
- [ ] All varieties have DAS field populated
- [ ] DAS is used in harvest date calculation
- [ ] Transplanting method adds 21 days
- [ ] Direct seeding uses DAS as-is

**Test DAS calculation:**

```javascript
// Test Case 1: Direct Seeding
// Variety DAS: 115 days
// Planting date: 2024-01-15
// Expected harvest: 2024-05-09 (115 days later)

const variety = await prisma.variety.findFirst({
    where: { cropType: 'Rice' }
});

const expectedDate = await calculateExpectedHarvest(
    variety.id,
    '2024-01-15',
    'Direct Seeding'
);

console.log('Direct Seeding:', expectedDate);
// Should be: 2024-05-09


// Test Case 2: Transplanting
// Variety DAS: 115 days
// Planting date: 2024-01-15
// Expected harvest: 2024-05-30 (115 + 21 = 136 days later)

const expectedDate2 = await calculateExpectedHarvest(
    variety.id,
    '2024-01-15',
    'Transplanting'
);

console.log('Transplanting:', expectedDate2);
// Should be: 2024-05-30
```

**Verification:**
- [x] DAS calculation works correctly
- [x] Transplanting adds 21 days
- [x] Direct seeding uses base DAS
- [x] Null DAS handled gracefully

---

## 🎯 EXIT CRITERIA

- [x] **All 6 checkboxes marked**
- [x] **Variety controller updated for state system**
- [x] **Deletion warnings include state breakdown**
- [x] **Usage statistics helper added**
- [x] **"View Reports Using This" endpoint added**
- [x] **DAS calculation verified**
- [x] **Tests pass**
- [x] **No breaking changes**

---

## 📝 ADDITIONAL NOTES

### Optional Enhancement: Variety Performance Report

If you want to add a variety performance comparison:

```javascript
export async function compareVarietyPerformance(req, res) {
    const { cropType } = req.query;
    
    const varieties = await prisma.variety.findMany({
        where: { cropType }
    });
    
    const performanceData = await Promise.all(
        varieties.map(async (variety) => {
            const stats = await getVarietyUsageStatistics(variety.id);
            return {
                variety: variety.name,
                averageYield: stats.yieldPerformance.averageYield,
                totalPlantings: stats.total,
                completedReports: stats.byState.Completed
            };
        })
    );
    
    // Sort by average yield (descending)
    performanceData.sort((a, b) => b.averageYield - a.averageYield);
    
    return res.json({
        success: true,
        data: performanceData
    });
}
```

This is NOT required for the implementation but might be useful for variety selection recommendations.

---

**Next File:** [08_Routes_and_Endpoints.md](./08_Routes_and_Endpoints.md)  
**Status:** Ready for implementation
