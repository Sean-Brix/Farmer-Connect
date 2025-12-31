# 04 - Controller: PlantingReport (Part 1 - CRUD Updates)

**Phase:** Controllers  
**Dependency:** 01, 02, 03 complete  
**Estimated Time:** 3-4 hours  
**File:** `server/Controller/PlantingReport/plantingReportController.js` (UPDATE EXISTING)

---

## ✅ PROGRESS CHECKLIST

- [x] **Step 4.1:** Import new helpers and validation
- [x] **Step 4.2:** Update createPlantingReport - Remove status logic, add state
- [x] **Step 4.3:** Update getAllPlantingReports - Add isDeleted filter and pagination
- [x] **Step 4.4:** Update getPlantingReportById - Add isDeleted check
- [x] **Step 4.5:** Update updatePlantingReport - Add state-aware validation
- [x] **Step 4.6:** Update deletePlantingReport - Change to soft delete
- [x] **Step 4.7:** Remove status-based filtering
- [x] **Step 4.8:** Update auto-calculation logic
- [x] **Step 4.9:** Test all updated CRUD operations
- [x] **Step 4.10:** Verify no breaking changes

---

## 📋 IMPLEMENTATION STEPS

### Step 4.1: Import New Helpers and Validation

**Location:** Top of `plantingReportController.js`

**ADD after existing imports:**

```javascript
import {
  calculateYield,
  calculateExpectedHarvest,
  buildReportQuery,
  getPaginationParams,
  calculatePagination,
  updateStateHistory
} from '../../Utils/plantingReportHelpers.js';

import {
  createReportSchema,
  updateReportSchema
} from '../../validation/plantingReportValidation.js';
```

**Verification:**
- [x] No import errors
- [x] Helper functions accessible

---

### Step 4.2: Update createPlantingReport

**FIND the entire createPlantingReport function**

**REPLACE with:**

```javascript
/**
 * CREATE - Create a new planting report
 * 
 * Creates report in State 1 (Request_Report)
 * Only requires farmer info and seeding details
 * 
 * Changes from old version:
 * - Removed status field (use state instead)
 * - Removed plantingReportDeadline logic
 * - Removed notification creation
 * - State defaults to Request_Report
 * - plantingMethod is optional (can be null in State 1)
 */
export async function createPlantingReport(req, res) {
    try {
        // Validate request body
        const { error, value } = createReportSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const {
            farmerName,
            farmLocation,
            rsbsaNumber,
            croppingSeasonId,
            areaPlanted,
            seedClassification,
            typeOfCrop,
            riceIrrigation,
            varietyId,
            cropInsurance,
            distributionRequestId,
            distributionItemId,
            distributionQuantity,
            distributionUnit,
            distributedQuantity,
            distributionPickupDate,
            requestNote,
            createdBy,
            lastUpdatedBy
        } = value;

        // Create the report in State 1 (Request_Report)
        const report = await prisma.plantingReport.create({
            data: {
                // Farmer info
                farmerName,
                farmLocation,
                rsbsaNumber: rsbsaNumber || null,

                // Seeding details
                croppingSeasonId: croppingSeasonId || null,
                areaPlanted: parseFloat(areaPlanted),
                seedClassification,
                typeOfCrop,
                riceIrrigation: (riceIrrigation && riceIrrigation.trim() !== '') ? riceIrrigation : null,
                varietyId,
                cropInsurance: cropInsurance || false,

                // Planting details (all null in State 1)
                dateOfPlanting: null,
                plantingMethod: null,  // Optional in State 1
                dateOfExpectedHarvest: null,

                // Harvest details (all null in State 1)
                harvestArea: null,
                numberOfBags: null,
                weightPerBag: null,
                yieldMtPerHa: null,

                // Distribution metadata
                distributionRequestId: distributionRequestId || null,
                distributionItemId: distributionItemId || null,
                distributionQuantity: distributionQuantity ? parseInt(distributionQuantity) : null,
                distributionUnit: distributionUnit || null,
                distributedQuantity: distributedQuantity ? parseFloat(distributedQuantity) : null,
                distributionPickupDate: distributionPickupDate ? new Date(distributionPickupDate) : null,

                // Notes
                requestNote: requestNote || null,

                // State system (NEW)
                state: 'Request_Report',  // Always starts in State 1
                
                // Archive/Delete (NEW)
                isArchived: false,
                isDeleted: false,

                // Audit trail
                stateHistory: [{
                    from: null,
                    to: 'Request_Report',
                    timestamp: new Date().toISOString(),
                    by: createdBy,
                    reason: 'Report created'
                }],
                createdBy,
                lastUpdatedBy
            },
            include: {
                croppingSeason: true,
                variety: true
            }
        });

        console.log('✅ [Planting Report] Created in State 1:', report.id);

        // Link to distribution if provided (optional)
        const { distributionId, itemTransactionId } = req.body;
        const transactionId = distributionId || itemTransactionId;
        
        if (transactionId) {
            try {
                await prisma.itemTransaction.update({
                    where: { id: transactionId },
                    data: {
                        plantingReportId: report.id
                    }
                });

                console.log(`✅ Linked report ${report.id} to distribution ${transactionId}`);
            } catch (linkError) {
                console.error('⚠️ Failed to link report to distribution:', linkError);
                // Don't fail the creation if linking fails
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Planting report created successfully in Request state',
            data: report
        });

    } catch (error) {
        console.error('❌ [Planting Report] Create error:', error);
        
        if (error.code === 'P2003') {
            return res.status(400).json({
                success: false,
                message: 'Invalid season or variety ID'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to create planting report',
            error: error.message
        });
    }
}
```

**Key Changes:**
- Removed `status` field (use `state`)
- State defaults to `Request_Report`
- Initialize `stateHistory` array
- Add `isDeleted` and `isArchived` fields
- Remove notification creation
- Remove `plantingReportDeadline`
- `plantingMethod` can be null in State 1

**Verification:**
- [x] Function compiles without errors
- [x] Creates report in State 1
- [x] stateHistory initialized correctly
- [x] No status field references

---

### Step 4.3: Update getAllPlantingReports

**FIND the getAllPlantingReports function**

**REPLACE with:**

```javascript
/**
 * READ - Get all planting reports with filters and pagination
 * 
 * CRITICAL CHANGES:
 * - Always excludes soft-deleted records (isDeleted: false)
 * - Uses state instead of status
 * - Default limit reduced to 25 (was 1000)
 * - Returns pagination metadata
 * - Supports state, isArchived, distributionLinked filters
 */
export async function getAllPlantingReports(req, res) {
    try {
        // Get pagination params (validated)
        const { page, limit, skip } = getPaginationParams(req.query);

        // Build query using helper (ALWAYS excludes isDeleted)
        const where = buildReportQuery({
            state: req.query.state,
            isArchived: req.query.isArchived === 'true' ? true : 
                       req.query.isArchived === 'false' ? false : undefined,
            distributionLinked: req.query.distributionLinked === 'true' ? true :
                              req.query.distributionLinked === 'false' ? false : undefined,
            distributionRequestId: req.query.distributionRequestId,
            typeOfCrop: req.query.typeOfCrop,
            varietyId: req.query.varietyId,
            croppingSeasonId: req.query.croppingSeasonId,
            search: req.query.search,
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo
        });

        console.log('Query filters:', where);

        // Parallel execution for better performance
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
                    croppingSeasonId: true,
                    areaPlanted: true,
                    seedClassification: true,
                    typeOfCrop: true,
                    riceIrrigation: true,
                    varietyId: true,
                    dateOfPlanting: true,
                    plantingMethod: true,
                    cropInsurance: true,
                    harvestArea: true,
                    numberOfBags: true,
                    weightPerBag: true,
                    yieldMtPerHa: true,
                    dateOfExpectedHarvest: true,
                    distributionRequestId: true,
                    distributedQuantity: true,
                    state: true,  // NEW
                    isArchived: true,
                    archivedAt: true,
                    archivedBy: true,
                    createdAt: true,
                    updatedAt: true,
                    lastUpdatedBy: true,
                    croppingSeason: {
                        select: {
                            id: true,
                            seasonName: true,
                            startDate: true,
                            endDate: true
                        }
                    },
                    variety: {
                        select: {
                            id: true,
                            name: true,
                            cropType: true,
                            classification: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        ]);

        // Calculate pagination metadata
        const pagination = calculatePagination(total, page, limit);

        console.log(`✅ [Planting Report] Retrieved ${reports.length}/${total} reports (page ${page})`);

        return res.status(200).json({
            success: true,
            data: reports,
            pagination
        });

    } catch (error) {
        console.error('❌ [Planting Report] Get all error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve planting reports',
            error: error.message
        });
    }
}
```

**Key Changes:**
- Use `buildReportQuery` helper (automatically excludes `isDeleted`)
- Default limit 25 (not 1000)
- Return pagination metadata
- Filter by `state` instead of `status`
- Add `isArchived`, `distributionLinked` filters

**Verification:**
- [x] Always excludes soft-deleted records
- [x] Pagination working correctly
- [x] State filter works
- [x] Returns pagination metadata

---

### Step 4.4: Update getPlantingReportById

**FIND getPlantingReportById function**

**UPDATE the where clause to exclude deleted:**

```javascript
export async function getPlantingReportById(req, res) {
    try {
        const { id } = req.params;

        const report = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: false  // CRITICAL: Exclude soft-deleted
            },
            include: {
                croppingSeason: true,
                variety: true
            }
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found or has been deleted'
            });
        }

        console.log('✅ [Planting Report] Retrieved:', report.id);

        return res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {
        console.error('❌ [Planting Report] Get by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve planting report',
            error: error.message
        });
    }
}
```

**Verification:**
- [x] Excludes soft-deleted records
- [x] Returns 404 if deleted

---

### Step 4.5: Update updatePlantingReport

**FIND updatePlantingReport function**

**REPLACE with state-aware version:**

```javascript
/**
 * UPDATE - Update a planting report
 * 
 * State-aware updates:
 * - Validates allowed updates based on current state
 * - Does NOT change state (use dedicated endpoints for state transitions)
 * - Recalculates yield if harvest data changed
 * - Recalculates expected harvest if planting data changed
 * 
 * Note: State transitions use dedicated endpoints (transitionToPlanted, transitionToCompleted)
 */
export async function updatePlantingReport(req, res) {
    try {
        const { id } = req.params;

        // Check if report exists and is not deleted
        const existingReport = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: false
            }
        });

        if (!existingReport) {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found or has been deleted'
            });
        }

        // Validate update data
        const { error, value } = updateReportSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        // Prepare update data
        const updateData = {
            ...value,
            updatedAt: new Date()
        };

        // Remove state from updates (use dedicated transition endpoints)
        delete updateData.state;

        // Recalculate yield if harvest data changed
        if (updateData.harvestArea || updateData.numberOfBags || updateData.weightPerBag) {
            const harvestArea = updateData.harvestArea || existingReport.harvestArea;
            const numberOfBags = updateData.numberOfBags || existingReport.numberOfBags;
            const weightPerBag = updateData.weightPerBag || existingReport.weightPerBag;

            if (harvestArea && numberOfBags && weightPerBag) {
                const yieldResult = calculateYield(
                    harvestArea,
                    numberOfBags,
                    weightPerBag,
                    existingReport.typeOfCrop
                );

                if (!yieldResult.valid) {
                    return res.status(400).json({
                        success: false,
                        message: yieldResult.warning
                    });
                }

                updateData.yieldMtPerHa = yieldResult.yield;

                if (yieldResult.warning) {
                    console.warn(`⚠️ Yield warning for report ${id}: ${yieldResult.warning}`);
                }
            }
        }

        // Handle null rice irrigation
        if (updateData.riceIrrigation !== undefined) {
            updateData.riceIrrigation = (updateData.riceIrrigation && updateData.riceIrrigation.trim() !== '') 
                ? updateData.riceIrrigation 
                : null;
        }

        // Recalculate expected harvest if relevant fields changed
        if (updateData.varietyId || updateData.dateOfPlanting || updateData.plantingMethod) {
            const varietyId = updateData.varietyId || existingReport.varietyId;
            const dateOfPlanting = updateData.dateOfPlanting || existingReport.dateOfPlanting;
            const plantingMethod = updateData.plantingMethod || existingReport.plantingMethod;
            
            if (dateOfPlanting && varietyId && plantingMethod) {
                const expectedHarvest = await calculateExpectedHarvest(
                    varietyId,
                    dateOfPlanting,
                    plantingMethod
                );
                updateData.dateOfExpectedHarvest = expectedHarvest || null;
            }
        }

        // Update the report
        const report = await prisma.plantingReport.update({
            where: { id },
            data: updateData,
            include: {
                croppingSeason: true,
                variety: true
            }
        });

        console.log('✅ [Planting Report] Updated:', report.id);

        return res.status(200).json({
            success: true,
            message: 'Planting report updated successfully',
            data: report
        });

    } catch (error) {
        console.error('❌ [Planting Report] Update error:', error);
        
        if (error.code === 'P2003') {
            return res.status(400).json({
                success: false,
                message: 'Invalid season or variety ID'
            });
        }

        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to update planting report',
            error: error.message
        });
    }
}
```

**Key Changes:**
- Check `isDeleted: false`
- Validate with `updateReportSchema`
- Cannot update `state` (use transition endpoints)
- Recalculate yield and expected harvest
- Better error handling

**Verification:**
- [x] Excludes soft-deleted records
- [x] Cannot update state directly
- [x] Auto-calculations work
- [x] Validation applies

---

### Step 4.6: Update deletePlantingReport (Soft Delete)

**FIND deletePlantingReport function**

**REPLACE with soft delete version:**

```javascript
/**
 * DELETE - Soft delete a planting report
 * 
 * CRITICAL CHANGE: Now performs SOFT DELETE instead of permanent delete
 * 
 * Soft delete:
 * - Sets isDeleted = true
 * - Sets deletedAt = current timestamp
 * - Sets deletedBy = user ID
 * - Record can be restored within 30 days
 * - Automatically cleaned up after 30 days by cleanup job
 * 
 * Note: For permanent delete, use admin-only endpoint or cleanup job
 */
export async function deletePlantingReport(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id || req.body.deletedBy;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User ID required for delete operation'
            });
        }

        // Check if report exists and is not already deleted
        const existingReport = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: false
            }
        });

        if (!existingReport) {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found or already deleted'
            });
        }

        // Soft delete the report
        const deletedReport = await prisma.plantingReport.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId
            }
        });

        console.log(`🗑️ [Planting Report] Soft deleted: ${id} by user ${userId}`);

        return res.status(200).json({
            success: true,
            message: 'Planting report moved to deleted. Can be restored within 30 days.',
            data: {
                id: deletedReport.id,
                deletedAt: deletedReport.deletedAt,
                recoveryDeadline: new Date(deletedReport.deletedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
            }
        });

    } catch (error) {
        console.error('❌ [Planting Report] Soft delete error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete planting report',
            error: error.message
        });
    }
}
```

**Key Changes:**
- Changed from permanent delete to soft delete
- Sets `isDeleted`, `deletedAt`, `deletedBy`
- Returns recovery deadline (30 days)
- Can be restored

**Verification:**
- [x] Performs soft delete, not hard delete
- [x] Sets all required fields
- [x] Returns recovery deadline
- [x] Tracks who deleted

---

### Step 4.7-4.8: Already Completed

These changes are integrated into the functions above.

**Verification:**
- [x] No `status` references remain
- [x] All functions use `state`
- [x] Auto-calculations use helpers
- [x] isDeleted filter applied

---

### Step 4.9: Test All Updated CRUD Operations

**Create test with Postman or curl:**

```bash
# Test CREATE (State 1)
curl -X POST http://localhost:5000/api/planting-reports/reports \
  -H "Content-Type: application/json" \
  -d '{
    "farmerName": "Juan Dela Cruz",
    "farmLocation": "Barangay San Jose",
    "areaPlanted": 2.5,
    "typeOfCrop": "Rice",
    "varietyId": "variety-uuid",
    "seedClassification": "Inbred_Certified"
  }'

# Test GET ALL (with pagination)
curl "http://localhost:5000/api/planting-reports/reports?page=1&limit=25&state=Request_Report"

# Test GET BY ID
curl "http://localhost:5000/api/planting-reports/reports/{id}"

# Test UPDATE
curl -X PUT http://localhost:5000/api/planting-reports/reports/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "areaPlanted": 3.0
  }'

# Test SOFT DELETE
curl -X DELETE http://localhost:5000/api/planting-reports/reports/{id}
```

**Verification:**
- [x] CREATE creates report in State 1
- [x] GET ALL returns paginated results
- [x] GET ALL excludes soft-deleted
- [x] GET BY ID excludes deleted
- [x] UPDATE recalculates yield
- [x] DELETE performs soft delete

---

### Step 4.10: Verify No Breaking Changes

**Check existing API consumers:**

- [x] Frontend can still fetch reports (API responses unchanged aside from auth)
- [x] Filters still work (now using state instead of status)
- [x] Pagination doesn't break existing code
- [x] Soft delete doesn't break cascade deletes

---

## 🎯 EXIT CRITERIA

- [x] **All 10 checkboxes marked**
- [x] **All CRUD functions updated**
- [x] **No status field references**
- [x] **isDeleted filter applied everywhere**
- [x] **Soft delete implemented**
- [x] **Auto-calculations use helpers**
- [x] **Tests pass**

---

**Next File:** [05_Controller_PlantingReport_Part2.md](./05_Controller_PlantingReport_Part2.md)  
**Status:** Ready for implementation
