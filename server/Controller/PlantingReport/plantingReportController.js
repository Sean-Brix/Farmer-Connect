import prisma from '../../config/database.js';
import {
    calculateYield,
    calculateExpectedHarvest,
    buildReportQuery,
    getPaginationParams,
    calculatePagination,
    updateStateHistory,
    buildDeletedReportsQuery,
    daysUntilPermanentDelete,
    validateBulkArchive,
    validateBulkDelete
} from '../../Utils/plantingReportHelpers.js';
import {
    createReportSchema,
    updateReportSchema,
    toPlantedSchema,
    toCompletedSchema,
    archiveReportSchema,
    unarchiveReportSchema,
    bulkArchiveSchema,
    bulkDeleteSchema
} from '../../validation/plantingReportValidation.js';

// Note: Ensure these indexes exist in your Prisma schema for optimal performance:
// @@index([dateOfPlanting])
// @@index([typeOfCrop])
// @@index([croppingSeasonId])
// @@index([varietyId])
// @@index([isArchived])
// @@index([rsbsaNumber])

// CREATE - Create a new planting report (State 1)
export async function createPlantingReport(req, res) {
    try {
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
            requestNote
        } = value;

        const actorId = req.user?.id || null;

        const report = await prisma.plantingReport.create({
            data: {
                farmerName,
                farmLocation,
                rsbsaNumber: rsbsaNumber || null,
                croppingSeasonId: croppingSeasonId || null,
                areaPlanted: parseFloat(areaPlanted),
                seedClassification,
                typeOfCrop,
                riceIrrigation: (riceIrrigation && riceIrrigation.trim() !== '') ? riceIrrigation : null,
                varietyId,
                cropInsurance: cropInsurance || false,

                // State 1 planting details
                dateOfPlanting: null,
                plantingMethod: null,
                dateOfExpectedHarvest: null,

                // Harvest details
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

                // State system - ALL reports start in 'Planting' state
                state: 'Planting',
                isArchived: false,
                isDeleted: false,

                // Audit trail
                stateHistory: JSON.stringify(updateStateHistory(
                    [], 
                    null, 
                    'Planting', 
                    actorId, 
                    distributionRequestId ? 'Report created from distribution' : 'Report created manually'
                )),
                lastUpdatedBy: actorId
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

// READ - Get all planting reports with filters and pagination
export async function getAllPlantingReports(req, res) {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);

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

        const [total, reportsRaw] = await Promise.all([
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
                    state: true,
                    isArchived: true,
                    archivedAt: true,
                    archivedBy: true,
                    createdAt: true,
                    updatedAt: true,
                    lastUpdatedBy: true,
                    croppingSeason: {
                        select: {
                            id: true,
                            name: true,
                            startDate: true,
                            endDate: true,
                            isActive: true
                        }
                    },
                    variety: {
                        select: {
                            id: true,
                            name: true,
                            cropType: true,
                            directSeededDAS: true,
                            transplantedDAS: true,
                            plantingWindow: true,
                            isActive: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        ]);

        // Sort by state order: Distributed/Planting → Planted → Harvested, then by createdAt desc
        const stateOrder = { 'Distributed': 1, 'Planting': 2, 'Planted': 3, 'Harvested': 4 };
        const reports = reportsRaw.sort((a, b) => {
            const stateCompare = (stateOrder[a.state] || 999) - (stateOrder[b.state] || 999);
            if (stateCompare !== 0) return stateCompare;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

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

// SUMMARY - Aggregated counts for dashboard cards
export async function getPlantingReportSummary(req, res) {
    try {
        const [
            total,
            plantingCount,
            plantedCount,
            harvestedCount,
            archivedCount,
            deletedCount,
            distributionCount,
            areaAgg
        ] = await Promise.all([
            prisma.plantingReport.count({ where: { isDeleted: false } }),
            prisma.plantingReport.count({ where: { isDeleted: false, isArchived: false, state: 'Planting' } }),
            prisma.plantingReport.count({ where: { isDeleted: false, isArchived: false, state: 'Planted' } }),
            prisma.plantingReport.count({ where: { isDeleted: false, isArchived: false, state: 'Harvested' } }),
            prisma.plantingReport.count({ where: { isDeleted: false, isArchived: true } }),
            prisma.plantingReport.count({ where: { isDeleted: true } }),
            prisma.plantingReport.count({ where: { isDeleted: false, distributionRequestId: { not: null } } }),
            prisma.plantingReport.aggregate({
                where: { isDeleted: false },
                _sum: { areaPlanted: true }
            })
        ]);

        const summary = {
            total,
            byState: {
                planting: plantingCount,
                planted: plantedCount,
                harvested: harvestedCount
            },
            archived: archivedCount,
            deleted: deletedCount,
            distribution: distributionCount,
            harvested: harvestedCount,
            totalArea: areaAgg?._sum?.areaPlanted || 0
        };

        return res.status(200).json({ success: true, ...summary });
    } catch (error) {
        console.error('❌ [Planting Report] Summary error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve planting report summary',
            error: error.message
        });
    }
}

// STATISTICS - Alias to summary for backward compatibility
export async function getPlantingReportStatistics(req, res) {
    return getPlantingReportSummary(req, res);
}

// READ - Get single planting report by ID
export async function getPlantingReportById(req, res) {
    try {
        const { id } = req.params;

        const report = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: false
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

        console.log('📄 [Planting Report] Retrieved:', report.id);

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

// UPDATE - Update a planting report (state-aware)
export async function updatePlantingReport(req, res) {
    try {
        const { id } = req.params;

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

        const { error, value } = updateReportSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const updateData = {
            ...value,
            updatedAt: new Date(),
            lastUpdatedBy: req.user?.id || existingReport.lastUpdatedBy || null
        };

        // Do not allow direct state updates via this endpoint
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

        // Normalize rice irrigation
        if (updateData.riceIrrigation !== undefined) {
            updateData.riceIrrigation = (updateData.riceIrrigation && updateData.riceIrrigation.trim() !== '')
                ? updateData.riceIrrigation
                : null;
        }

        // Recalculate expected harvest if planting info changed
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

// DELETE - Soft delete a planting report
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

// SPECIAL - Get reports by RSBSA Number (Farmer tracking)
export async function getReportsByRSBSA(req, res) {
    try {
        const { rsbsaNumber } = req.params;
        const {
            page = 1,
            limit = 10,
            startDate,
            endDate,
            typeOfCrop
        } = req.query;

        if (!rsbsaNumber) {
            return res.status(400).json({
                success: false,
                message: 'RSBSA number is required'
            });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build where clause
        const where = {
            rsbsaNumber: {
                equals: rsbsaNumber
            },
            isDeleted: false
        };

        // Date range filter
        if (startDate || endDate) {
            where.dateOfPlanting = {};
            if (startDate) where.dateOfPlanting.gte = new Date(startDate);
            if (endDate) where.dateOfPlanting.lte = new Date(endDate);
        }

        // Crop type filter
        if (typeOfCrop) {
            where.typeOfCrop = typeOfCrop;
        }

        // Get total count
        const total = await prisma.plantingReport.count({ where });

        // Get paginated reports
        const reports = await prisma.plantingReport.findMany({
            where,
            skip,
            take: parseInt(limit),
            include: {
                croppingSeason: true,
                variety: true
            },
            orderBy: {
                dateOfPlanting: 'desc'
            }
        });

        // Calculate summary statistics
        const statistics = {
            totalReports: total,
            totalAreaPlanted: reports.reduce((sum, r) => sum + (r.areaPlanted || 0), 0),
            totalHarvestArea: reports.reduce((sum, r) => sum + (r.harvestArea || 0), 0),
            averageYield: reports.length > 0 
                ? reports.reduce((sum, r) => sum + (r.yieldMtPerHa || 0), 0) / reports.filter(r => r.yieldMtPerHa).length
                : 0,
            cropTypes: [...new Set(reports.map(r => r.typeOfCrop))]
        };

        console.log(`🌾 [Planting Report] Retrieved ${reports.length} reports for RSBSA: ${rsbsaNumber}`);

        return res.status(200).json({
            success: true,
            message: 'Farmer reports retrieved successfully',
            rsbsaNumber,
            reports,
            statistics,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('❌ [Planting Report] Get by RSBSA error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve farmer reports',
            error: error.message
        });
    }
}

// ARCHIVE - Toggle archive status of a planting report
export async function archivePlantingReport(req, res) {
    try {
        const { id } = req.params;

        // Check if report exists
        const existingReport = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: false
            }
        });

        if (!existingReport) {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found'
            });
        }

        // Toggle archive status
        const report = await prisma.plantingReport.update({
            where: { id },
            data: { isArchived: !existingReport.isArchived },
            include: {
                croppingSeason: true,
                variety: true
            }
        });

        console.log(`📦 [Planting Report] ${report.isArchived ? 'Archived' : 'Unarchived'}:`, report.id);

        return res.status(200).json({
            success: true,
            message: `Planting report ${report.isArchived ? 'archived' : 'unarchived'} successfully`,
            report
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

// UTILITY - Calculate yield for existing report
export async function recalculateYield(req, res) {
    try {
        const { id } = req.params;

        const report = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: false
            }
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found'
            });
        }

        const yieldMtPerHa = calculateYield(
            report.harvestArea,
            report.numberOfBags,
            report.weightPerBag
        );

        if (yieldMtPerHa === null) {
            return res.status(400).json({
                success: false,
                message: 'Cannot calculate yield - missing harvest data'
            });
        }

        const updatedReport = await prisma.plantingReport.update({
            where: { id },
            data: { yieldMtPerHa },
            include: {
                croppingSeason: true,
                variety: true
            }
        });

        console.log(`📊 [Planting Report] Recalculated yield for ${id}: ${yieldMtPerHa} mt/ha`);

        return res.status(200).json({
            success: true,
            message: 'Yield calculated successfully',
            report: updatedReport,
            yieldMtPerHa
        });
    } catch (error) {
        console.error('❌ [Planting Report] Recalculate yield error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to calculate yield',
            error: error.message
        });
    }
}

// STATE TRANSITION - Request_Report -> Planted
export async function transitionToPlanted(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id || null;

        const report = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: false
            },
            include: {
                variety: true,
                croppingSeason: true
            }
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found or has been deleted'
            });
        }

        if (!['Distributed', 'Planting'].includes(report.state)) {
            return res.status(400).json({
                success: false,
                message: `Cannot transition to Planted from ${report.state} state. Report must be in Distributed or Planting state.`
            });
        }

        console.log('🔍 [Transition Debug] Request body:', req.body);
        console.log('🔍 [Transition Debug] Report typeOfCrop:', report.typeOfCrop);
        console.log('🔍 [Transition Debug] Report areaPlanted:', report.areaPlanted);

        // Validate with context from the existing report
        const { error, value } = toPlantedSchema.validate(req.body, {
            context: {
                typeOfCrop: report.typeOfCrop,
                areaPlanted: report.areaPlanted
            },
            stripUnknown: true,  // Remove unknown fields instead of erroring
            abortEarly: false     // Show all errors
        });
        
        if (error) {
            console.error('❌ [Transition Debug] Validation error:', error.details);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                errors: error.details.map(e => e.message)
            });
        }

        console.log('✅ [Transition Debug] Validated value:', value);

        const { dateOfPlanting, plantingMethod, riceIrrigation, transitionNote } = value;

        if (report.typeOfCrop === 'Rice' && !riceIrrigation) {
            return res.status(400).json({
                success: false,
                message: 'Rice crops require riceIrrigation field'
            });
        }

        const dateOfExpectedHarvest = await calculateExpectedHarvest(
            report.varietyId,
            dateOfPlanting,
            plantingMethod
        );

        console.log('🔄 [Transition] Updating report:', {
            id,
            currentState: report.state,
            newState: 'Planted',
            dateOfPlanting,
            plantingMethod,
            riceIrrigation: riceIrrigation || report.riceIrrigation || null
        });

        const updatedReport = await prisma.plantingReport.update({
            where: { id },
            data: {
                dateOfPlanting: new Date(dateOfPlanting),
                plantingMethod,
                riceIrrigation: riceIrrigation || report.riceIrrigation || null,
                dateOfExpectedHarvest,
                state: 'Planted',
                stateHistory: JSON.stringify(updateStateHistory(
                    typeof report.stateHistory === 'string' ? JSON.parse(report.stateHistory) : report.stateHistory,
                    report.state, // From Distributed or Planting
                    'Planted',
                    userId,
                    transitionNote || 'Planting completed'
                )),
                lastUpdatedBy: userId,
                updatedAt: new Date()
            },
            include: {
                croppingSeason: true,
                variety: true
            }
        });

        console.log(`✅ [Planting Report] ${id} transitioned: ${report.state} → Planted`);
        console.log('📊 [Transition] Updated report state:', updatedReport.state);

        // Auto-update distribution request status if linked
        if (updatedReport.distributionRequestId) {
            try {
                await prisma.itemTransaction.update({
                    where: { id: updatedReport.distributionRequestId },
                    data: { 
                        status: 'Planted',
                        updatedAt: new Date()
                    }
                });
                console.log(`✅ [Distribution] Auto-updated request ${updatedReport.distributionRequestId} status to Planted`);
            } catch (distError) {
                console.error('⚠️ Failed to auto-update distribution request status:', distError);
                // Don't fail the whole operation if distribution update fails
            }
        }

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

// STATE TRANSITION - Planted -> Harvested
export async function transitionToHarvested(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id || null;

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

        if (report.state !== 'Planted') {
            return res.status(400).json({
                success: false,
                message: `Cannot transition to Harvested from ${report.state} state. Report must be in Planted state.`
            });
        }

        const { error, value } = toCompletedSchema.validate(req.body, {
            context: { areaPlanted: report.areaPlanted }
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { harvestArea, numberOfBags, weightPerBag, transitionNote } = value;

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

        const updatedReport = await prisma.plantingReport.update({
            where: { id },
            data: {
                harvestArea: parseFloat(harvestArea),
                numberOfBags: parseInt(numberOfBags, 10),
                weightPerBag: parseFloat(weightPerBag),
                yieldMtPerHa: yieldResult.yield,
                state: 'Harvested',
                stateHistory: JSON.stringify(updateStateHistory(
                    typeof report.stateHistory === 'string' ? JSON.parse(report.stateHistory) : report.stateHistory,
                    'Planted',
                    'Harvested',
                    userId,
                    transitionNote || 'Harvest completed'
                )),
                lastUpdatedBy: userId,
                updatedAt: new Date()
            },
            include: {
                croppingSeason: true,
                variety: true
            }
        });

        console.log(`✅ [Planting Report] ${id} transitioned: Planted → Harvested (yield: ${yieldResult.yield} Mt/Ha)`);

        // Note: Distribution request status remains 'Planted' (transaction_status enum doesn't include 'Harvested')
        // The planting report state tracks the full lifecycle: Distributed → Planted → Harvested
        if (updatedReport.distributionRequestId) {
            console.log(`ℹ️ [Distribution] Request ${updatedReport.distributionRequestId} status remains 'Planted' (report is now Harvested)`);
        }

        return res.status(200).json({
            success: true,
            message: 'Report successfully transitioned to Harvested state',
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

// ARCHIVE - Archive a completed report
export async function archiveReport(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id || req.body.archivedBy;

        const { error } = archiveReportSchema.validate(req.body || {});
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

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

        if (report.isArchived) {
            return res.status(400).json({
                success: false,
                message: 'Report is already archived'
            });
        }

        if (report.state !== 'Completed') {
            return res.status(400).json({
                success: false,
                message: 'Only completed reports can be archived'
            });
        }

        const archivedReport = await prisma.plantingReport.update({
            where: { id },
            data: {
                isArchived: true,
                archivedAt: new Date(),
                archivedBy: userId,
                updatedAt: new Date()
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

// UNARCHIVE - Remove archive status
export async function unarchiveReport(req, res) {
    try {
        const { id } = req.params;

        const { error } = unarchiveReportSchema.validate(req.body || {});
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

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

        if (!report.isArchived) {
            return res.status(400).json({
                success: false,
                message: 'Report is not archived'
            });
        }

        const unarchivedReport = await prisma.plantingReport.update({
            where: { id },
            data: {
                isArchived: false,
                archivedAt: null,
                archivedBy: null,
                updatedAt: new Date()
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

// RESTORE - Undo soft delete within 30 days
export async function restoreReport(req, res) {
    try {
        const { id } = req.params;

        const report = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: true
            }
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Deleted report not found. It may have been permanently deleted after 30 days.'
            });
        }

        const daysRemaining = daysUntilPermanentDelete(report.deletedAt);
        if (daysRemaining <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Report was deleted more than 30 days ago and cannot be restored'
            });
        }

        const restoredReport = await prisma.plantingReport.update({
            where: { id },
            data: {
                isDeleted: false,
                deletedAt: null,
                deletedBy: null,
                updatedAt: new Date(),
                lastUpdatedBy: req.user?.id || report.lastUpdatedBy || null
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

// PERMANENT DELETE - Hard delete a soft-deleted report
export async function permanentDeleteReport(req, res) {
    try {
        const { id } = req.params;

        // Find the deleted report
        const report = await prisma.plantingReport.findFirst({
            where: {
                id,
                isDeleted: true
            }
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Deleted report not found. It may have already been permanently deleted.'
            });
        }

        // Permanently delete the report from database
        await prisma.plantingReport.delete({
            where: { id }
        });

        console.log(`🗑️ [Planting Report] Permanently deleted: ${id}`);

        return res.status(200).json({
            success: true,
            message: 'Planting report permanently deleted'
        });
    } catch (error) {
        console.error('❌ [Planting Report] Permanent delete error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to permanently delete planting report',
            error: error.message
        });
    }
}

// BULK ARCHIVE - Completed reports only
export async function bulkArchiveReports(req, res) {
    try {
        const userId = req.user?.id || req.body.archivedBy;
        const { reportIds } = req.body;

        const { error } = bulkArchiveSchema.validate(req.body || {});
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const validation = await validateBulkArchive(reportIds);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: 'Bulk archive validation failed',
                errors: validation.errors
            });
        }

        const result = await prisma.plantingReport.updateMany({
            where: {
                id: { in: validation.eligibleIds }
            },
            data: {
                isArchived: true,
                archivedAt: new Date(),
                archivedBy: userId,
                updatedAt: new Date()
            }
        });

        console.log(`📦 [Planting Report] Bulk archived ${result.count} reports by user ${userId}`);

        return res.status(200).json({
            success: true,
            message: `Successfully archived ${result.count} reports`,
            data: {
                archived: result.count,
                reportIds: validation.eligibleIds
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

// BULK DELETE - Soft delete multiple reports
export async function bulkDeleteReports(req, res) {
    try {
        const userId = req.user?.id || req.body.deletedBy;
        const { reportIds } = req.body;

        const { error } = bulkDeleteSchema.validate(req.body || {});
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const validation = await validateBulkDelete(reportIds);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: 'Bulk delete validation failed',
                errors: validation.errors
            });
        }

        const result = await prisma.plantingReport.updateMany({
            where: {
                id: { in: validation.eligibleIds }
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId,
                updatedAt: new Date()
            }
        });

        console.log(`🗑️ [Planting Report] Bulk deleted ${result.count} reports by user ${userId}`);

        return res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.count} reports. Can be restored within 30 days.`,
            data: {
                deleted: result.count,
                reportIds: validation.eligibleIds,
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

// GET deleted reports (within recovery window)
export async function getDeletedReports(req, res) {
    try {
        // Auto-cleanup: Delete expired reports before querying
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days retention
        
        const expiredCount = await prisma.plantingReport.deleteMany({
            where: {
                isDeleted: true,
                deletedAt: { lte: cutoffDate }
            }
        });

        if (expiredCount.count > 0) {
            console.log(`🗑️ [Planting Report] Auto-cleanup: Permanently deleted ${expiredCount.count} expired reports`);
        }

        const { page, limit, skip } = getPaginationParams(req.query);

        const where = buildDeletedReportsQuery({
            typeOfCrop: req.query.typeOfCrop,
            varietyId: req.query.varietyId,
            search: req.query.search
        });

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
                            id: true,
                            name: true,
                            isActive: true
                        }
                    },
                    variety: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    deletedAt: 'desc'
                }
            })
        ]);

        const reportsWithMetadata = reports.map((report) => {
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
