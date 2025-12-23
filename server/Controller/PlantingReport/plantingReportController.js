import prisma from '../../config/database.js';

// Note: Ensure these indexes exist in your Prisma schema for optimal performance:
// @@index([dateOfPlanting])
// @@index([typeOfCrop])
// @@index([croppingSeasonId])
// @@index([varietyId])
// @@index([isArchived])
// @@index([rsbsaNumber])

// Helper function to calculate yield (mt/ha) 
function calculateYield(harvestArea, numberOfBags, weightPerBag) {
    if (!harvestArea || !numberOfBags || !weightPerBag) return null;
    return (harvestArea * numberOfBags * weightPerBag) / 1000;
}

// Helper function to calculate expected harvest date
async function calculateExpectedHarvest(varietyId, dateOfPlanting, plantingMethod) {
    try {
        if (!dateOfPlanting) return null;

        const variety = await prisma.seedVariety.findUnique({
            where: { id: varietyId },
            select: { directSeededDAS: true, transplantedDAS: true, cropType: true }
        });

        // Only calculate for Rice crops
        if (!variety || variety.cropType !== 'Rice') return null;

        // Use appropriate DAS based on planting method
        const das = plantingMethod === 'Transplanted' 
            ? variety.transplantedDAS 
            : variety.directSeededDAS;

        const plantingDate = new Date(dateOfPlanting);
        const expectedDate = new Date(plantingDate);
        expectedDate.setDate(plantingDate.getDate() + das);
        
        return expectedDate;
    } catch (error) {
        console.error('Error calculating expected harvest:', error);
        return null;
    }
}

// CREATE - Create a new planting report
export async function createPlantingReport(req, res) {
    try {
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
            dateOfPlanting,
            plantingMethod,
            cropInsurance,
            harvestArea,
            numberOfBags,
            weightPerBag,
            distributionRequestId,
            distributionItemId,
            distributionQuantity,
            distributionUnit,
            distributionPickupDate,
            requestNote,
            plantingReportDeadline,
            status,
            lastUpdatedBy
        } = req.body;

        // Validate required fields (draft-friendly: allow planting/harvest fields to be empty)
        if (!farmerName || !farmLocation || !areaPlanted || !seedClassification || !typeOfCrop || !varietyId || !plantingMethod) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Calculate yield if harvest data is provided
        const yieldMtPerHa = calculateYield(harvestArea, numberOfBags, weightPerBag);

        // Calculate expected harvest date for Rice crops
        const dateOfExpectedHarvest = dateOfPlanting
            ? await calculateExpectedHarvest(varietyId, dateOfPlanting, plantingMethod)
            : null;

        // Create the planting report
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
                dateOfPlanting: dateOfPlanting ? new Date(dateOfPlanting) : null,
                plantingMethod,
                cropInsurance: cropInsurance || false,
                harvestArea: harvestArea ? parseFloat(harvestArea) : null,
                numberOfBags: numberOfBags ? parseInt(numberOfBags) : null,
                weightPerBag: weightPerBag ? parseFloat(weightPerBag) : null,
                yieldMtPerHa,
                dateOfExpectedHarvest,
                distributionRequestId: distributionRequestId || null,
                distributionItemId: distributionItemId || null,
                distributionQuantity: distributionQuantity ? parseInt(distributionQuantity) : null,
                distributionUnit: distributionUnit || null,
                distributionPickupDate: distributionPickupDate ? new Date(distributionPickupDate) : null,
                requestNote: requestNote || null,
                plantingReportDeadline: plantingReportDeadline ? new Date(plantingReportDeadline) : null,
                status: status || 'Draft',
                lastUpdatedBy: lastUpdatedBy || null
            },
            include: {
                croppingSeason: true,
                variety: true
            }
        });

        console.log('✅ [Planting Report] Created:', report.id);

        // Phase 4: Auto-transition linked distribution to Planted
        // Accept both distributionId and itemTransactionId for backward compatibility
        const { distributionId, itemTransactionId } = req.body;
        const transactionId = distributionId || itemTransactionId;
        
        if (transactionId) {
            try {
                const transaction = await prisma.itemTransaction.update({
                    where: { id: transactionId },
                    data: {
                        status: 'Planted',
                        plantingReportId: report.id,
                        plantingReportSubmittedAt: new Date()
                    },
                    include: { 
                        itemStack: { include: { item: true } }, 
                        account: true 
                    }
                });

                // Create notification for user
                const notificationModule = await import('../../Services/notificationService.mjs');
                await notificationModule.createNotification({
                    accountId: transaction.accountId,
                    type: 'planting_report_submitted',
                    title: '✅ Planting Report Submitted',
                    message: `Your planting report for ${transaction.itemStack.item.name} has been recorded. Distribution status updated to "Planted".`,
                    relatedId: report.id
                }).catch(err => console.error('Failed to send notification:', err));

                console.log(`✅ Distribution ${transactionId} → Planted (report ${report.id})`);
            } catch (linkError) {
                console.error('⚠️ Failed to link report to distribution:', linkError);
                // Don't fail the report creation if linking fails
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Planting report created successfully',
            report
        });
    } catch (error) {
        console.error('❌ [Planting Report] Create error:', error);
        
        if (error.code === 'P2003') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user, season, or variety ID'
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
        const {
            page = 1,
            limit = 1000, // Increased default for analytics
            userId,
            typeOfCrop,
            croppingSeasonId,
            startDate,
            endDate,
            search,
            includeArchived = 'false' // Don't include archived by default
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build where clause
        const where = {};

        // Exclude archived by default for performance
        if (includeArchived === 'false') {
            where.isArchived = false;
        }

        if (userId) where.userId = userId;
        if (typeOfCrop) where.typeOfCrop = typeOfCrop;
        if (croppingSeasonId) where.croppingSeasonId = croppingSeasonId;

        // Date range filter
        if (startDate || endDate) {
            where.dateOfPlanting = {};
            if (startDate) where.dateOfPlanting.gte = new Date(startDate);
            if (endDate) where.dateOfPlanting.lte = new Date(endDate);
        }

        // Search by farmer name or location
        if (search) {
            where.OR = [
                { farmerName: { contains: search, mode: 'insensitive' } },
                { farmLocation: { contains: search, mode: 'insensitive' } },
                { rsbsaNumber: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Parallel execution for better performance
        const [total, reports] = await Promise.all([
            prisma.plantingReport.count({ where }),
            prisma.plantingReport.findMany({
                where,
                skip,
                take: parseInt(limit),
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
                    dateOfExpectedHarvest: true,
                    plantingMethod: true,
                    cropInsurance: true,
                    harvestArea: true,
                    numberOfBags: true,
                    weightPerBag: true,
                    yieldMtPerHa: true,
                    distributionRequestId: true,
                    distributionItemId: true,
                    distributionQuantity: true,
                    distributionUnit: true,
                    distributionPickupDate: true,
                    requestNote: true,
                    plantingReportDeadline: true,
                    status: true,
                    lastUpdatedBy: true,
                    isArchived: true,
                    createdAt: true,
                    updatedAt: true,
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
                            transplantedDAS: true
                        }
                    }
                },
                orderBy: {
                    dateOfPlanting: 'desc' // Changed from createdAt for better analytics sorting
                }
            })
        ]);

        return res.status(200).json({
            success: true,
            message: 'Planting reports retrieved successfully',
            reports,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
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

// READ - Get single planting report by ID
export async function getPlantingReportById(req, res) {
    try {
        const { id } = req.params;

        const report = await prisma.plantingReport.findUnique({
            where: { id },
            include: {
                croppingSeason: true,
                variety: true
            }
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found'
            });
        }

        console.log('📄 [Planting Report] Retrieved:', report.id);

        return res.status(200).json({
            success: true,
            message: 'Planting report retrieved successfully',
            report
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

// UPDATE - Update a planting report
export async function updatePlantingReport(req, res) {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Check if report exists
        const existingReport = await prisma.plantingReport.findUnique({
            where: { id }
        });

        if (!existingReport) {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found'
            });
        }

        // Parse numeric fields
        if (updateData.areaPlanted) updateData.areaPlanted = parseFloat(updateData.areaPlanted);
        if (updateData.harvestArea) updateData.harvestArea = parseFloat(updateData.harvestArea);
        if (updateData.numberOfBags) updateData.numberOfBags = parseInt(updateData.numberOfBags);
        if (updateData.weightPerBag) updateData.weightPerBag = parseFloat(updateData.weightPerBag);
        if (updateData.distributionQuantity) updateData.distributionQuantity = parseInt(updateData.distributionQuantity);

        // Parse dates
        if (updateData.dateOfPlanting) updateData.dateOfPlanting = new Date(updateData.dateOfPlanting);
        if (updateData.hasOwnProperty('dateOfPlanting') && !updateData.dateOfPlanting) {
            updateData.dateOfPlanting = null;
            updateData.dateOfExpectedHarvest = null;
        }
        if (updateData.distributionPickupDate) updateData.distributionPickupDate = new Date(updateData.distributionPickupDate);
        if (updateData.plantingReportDeadline) updateData.plantingReportDeadline = new Date(updateData.plantingReportDeadline);

        // Recalculate yield if harvest data is updated
        const harvestArea = updateData.harvestArea || existingReport.harvestArea;
        const numberOfBags = updateData.numberOfBags || existingReport.numberOfBags;
        const weightPerBag = updateData.weightPerBag || existingReport.weightPerBag;
        
        if (harvestArea || numberOfBags || weightPerBag) {
            updateData.yieldMtPerHa = calculateYield(harvestArea, numberOfBags, weightPerBag);
        }

        // Handle empty riceIrrigation string
        if (updateData.riceIrrigation !== undefined) {
            updateData.riceIrrigation = (updateData.riceIrrigation && updateData.riceIrrigation.trim() !== '') 
                ? updateData.riceIrrigation 
                : null;
        }

        // Recalculate expected harvest if variety or planting date changed
        const varietyId = updateData.varietyId || existingReport.varietyId;
        const dateOfPlanting = updateData.dateOfPlanting || existingReport.dateOfPlanting;
        const plantingMethod = updateData.plantingMethod || existingReport.plantingMethod;
        
        if ((updateData.varietyId || updateData.dateOfPlanting || updateData.plantingMethod) && dateOfPlanting) {
            const expectedHarvest = await calculateExpectedHarvest(varietyId, dateOfPlanting, plantingMethod);
            updateData.dateOfExpectedHarvest = expectedHarvest || null;
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
            report
        });
    } catch (error) {
        console.error('❌ [Planting Report] Update error:', error);
        
        if (error.code === 'P2003') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user, season, or variety ID'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to update planting report',
            error: error.message
        });
    }
}

// DELETE - Delete a planting report
export async function deletePlantingReport(req, res) {
    try {
        const { id } = req.params;

        // Check if report exists
        const existingReport = await prisma.plantingReport.findUnique({
            where: { id }
        });

        if (!existingReport) {
            return res.status(404).json({
                success: false,
                message: 'Planting report not found'
            });
        }

        // Delete the report
        await prisma.plantingReport.delete({
            where: { id }
        });

        console.log('🗑️ [Planting Report] Deleted:', id);

        return res.status(200).json({
            success: true,
            message: 'Planting report deleted successfully'
        });
    } catch (error) {
        console.error('❌ [Planting Report] Delete error:', error);
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
                equals: rsbsaNumber,
                mode: 'insensitive'
            }
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
        const existingReport = await prisma.plantingReport.findUnique({
            where: { id }
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

        const report = await prisma.plantingReport.findUnique({
            where: { id }
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
