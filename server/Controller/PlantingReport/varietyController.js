import prisma from '../../config/database.js';
import { calculatePagination, getPaginationParams } from '../../Utils/plantingReportHelpers.js';

// HELPER - Usage statistics for a variety
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
        prisma.plantingReport.count({
            where: {
                varietyId,
                isDeleted: false
            }
        }),
        prisma.plantingReport.count({
            where: {
                varietyId,
                isDeleted: true
            }
        }),
        prisma.plantingReport.count({
            where: {
                varietyId,
                isDeleted: false,
                isArchived: true
            }
        }),
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
            averageYield: yieldStats._avg?.yieldMtPerHa ?? null,
            minYield: yieldStats._min?.yieldMtPerHa ?? null,
            maxYield: yieldStats._max?.yieldMtPerHa ?? null,
            sampleSize: yieldStats._count?.yieldMtPerHa ?? 0
        }
    };
}

// CREATE - Create a new seed variety
export async function createSeedVariety(req, res) {
    try {
        const { name, cropType, directSeededDAS, transplantedDAS, description, isActive } = req.body;

        if (!name || !cropType || !directSeededDAS || !transplantedDAS) {
            return res.status(400).json({
                success: false,
                message: 'Name, crop type, directSeededDAS, and transplantedDAS are required'
            });
        }

        // Validate crop type
        const validCropTypes = ['Rice', 'Corn', 'High_Value_Crops'];
        if (!validCropTypes.includes(cropType)) {
            return res.status(400).json({
                success: false,
                message: `Invalid crop type. Must be one of: ${validCropTypes.join(', ')}`
            });
        }

        const variety = await prisma.seedVariety.create({
            data: {
                name,
                cropType,
                directSeededDAS: parseInt(directSeededDAS),
                transplantedDAS: parseInt(transplantedDAS),
                description: description || null,
                isActive: isActive !== undefined ? isActive : true
            }
        });

        console.log('✅ [Seed Variety] Created:', variety.name);

        return res.status(201).json({
            success: true,
            message: 'Seed variety created successfully',
            variety
        });
    } catch (error) {
        console.error('❌ [Seed Variety] Create error:', error);

        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'A variety with this name and crop type already exists'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to create seed variety',
            error: error.message
        });
    }
}

// READ - Get all seed varieties with filters
export async function getAllSeedVarieties(req, res) {
    try {
        const { 
            cropType, 
            isActive, 
            search,
            sortBy = 'name',
            sortOrder = 'asc',
            includeReports 
        } = req.query;

        const where = {};
        
        // Filter by crop type
        if (cropType) where.cropType = cropType;
        
        // Filter by active status
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }

        // Search by name or description
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Include planting reports if requested
        const include = includeReports === 'true' 
            ? { plantingReports: { select: { id: true } } }
            : undefined;

        // Dynamic sorting
        const validSortFields = ['name', 'cropType', 'directSeededDAS', 'transplantedDAS', 'createdAt'];
        const orderByField = validSortFields.includes(sortBy) ? sortBy : 'name';
        const orderByDirection = sortOrder === 'desc' ? 'desc' : 'asc';

        const varieties = await prisma.seedVariety.findMany({
            where,
            include,
            orderBy: { [orderByField]: orderByDirection }
        });

        return res.status(200).json({
            success: true,
            message: 'Seed varieties retrieved successfully',
            varieties,
            filters: { cropType, isActive, search }
        });
    } catch (error) {
        console.error('❌ [Seed Variety] Get all error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve seed varieties',
            error: error.message
        });
    }
}

// READ - Get active varieties only
export async function getActiveVarieties(req, res) {
    try {
        const varieties = await prisma.seedVariety.findMany({
            where: {
                isActive: true
            },
            orderBy: [
                { cropType: 'asc' },
                { name: 'asc' }
            ]
        });

        return res.status(200).json({
            success: true,
            message: 'Active seed varieties retrieved successfully',
            varieties
        });
    } catch (error) {
        console.error('❌ [Seed Variety] Get active varieties error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve active varieties',
            error: error.message
        });
    }
}

// READ - Get varieties by crop type
export async function getVarietiesByCropType(req, res) {
    try {
        const { cropType } = req.params;

        const varieties = await prisma.seedVariety.findMany({
            where: {
                cropType,
                isActive: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        res.status(200).json({
            success: true,
            message: `${cropType} varieties retrieved successfully`,
            varieties
        });
    } catch (error) {
        console.error('❌ [Seed Variety] Get by crop type error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve seed varieties',
            error: error.message
        });
    }
}

// READ - Get single seed variety by ID
export async function getSeedVarietyById(req, res) {
    try {
        const { id } = req.params;

        const variety = await prisma.seedVariety.findUnique({
            where: { id },
            include: {
                plantingReports: {
                    select: {
                        id: true,
                        farmerName: true,
                        dateOfPlanting: true,
                        areaPlanted: true
                    },
                    where: {
                        isDeleted: false
                    }
                }
            }
        });

        if (!variety) {
            return res.status(404).json({
                success: false,
                message: 'Seed variety not found'
            });
        }

        const usageStatistics = await getVarietyUsageStatistics(id);

        console.log('📄 [Seed Variety] Retrieved:', variety.name);

        return res.status(200).json({
            success: true,
            message: 'Seed variety retrieved successfully',
            variety: {
                ...variety,
                usageStatistics
            }
        });
    } catch (error) {
        console.error('❌ [Seed Variety] Get by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve seed variety',
            error: error.message
        });
    }
}

// READ - Get planting reports using a specific variety
export async function getReportsByVariety(req, res) {
    try {
        const { id } = req.params;

        const variety = await prisma.seedVariety.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                cropType: true,
                directSeededDAS: true,
                transplantedDAS: true,
                plantingWindow: true
            }
        });

        if (!variety) {
            return res.status(404).json({
                success: false,
                message: 'Seed variety not found'
            });
        }

        const { page, limit, skip } = getPaginationParams(req.query);

        const where = {
            varietyId: id,
            isDeleted: false,
            ...(req.query.state && { state: req.query.state }),
            ...(req.query.croppingSeasonId && { croppingSeasonId: req.query.croppingSeasonId })
        };

        if (req.query.isArchived !== undefined) {
            where.isArchived = req.query.isArchived === 'true';
        }

        const [total, reports] = await Promise.all([
            prisma.plantingReport.count({ where }),
            prisma.plantingReport.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                },
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
                            id: true,
                            name: true,
                            startDate: true,
                            endDate: true
                        }
                    }
                }
            })
        ]);

        const pagination = calculatePagination(total, page, limit);

        console.log(`✅ [Seed Variety] Retrieved ${reports.length}/${total} reports for variety ${id}`);

        return res.status(200).json({
            success: true,
            data: {
                variety,
                reports
            },
            pagination
        });
    } catch (error) {
        console.error('❌ [Seed Variety] Get reports by variety error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve reports for variety',
            error: error.message
        });
    }
}

// UPDATE - Update a seed variety
export async function updateSeedVariety(req, res) {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Check if variety exists
        const existingVariety = await prisma.seedVariety.findUnique({
            where: { id }
        });

        if (!existingVariety) {
            return res.status(404).json({
                success: false,
                message: 'Seed variety not found'
            });
        }

        // Parse DAS fields if provided
        if (updateData.directSeededDAS) updateData.directSeededDAS = parseInt(updateData.directSeededDAS);
        if (updateData.transplantedDAS) updateData.transplantedDAS = parseInt(updateData.transplantedDAS);

        // Validate crop type if provided
        if (updateData.cropType) {
            const validCropTypes = ['Rice', 'Corn', 'High_Value_Crops'];
            if (!validCropTypes.includes(updateData.cropType)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid crop type. Must be one of: ${validCropTypes.join(', ')}`
                });
            }
        }

        const variety = await prisma.seedVariety.update({
            where: { id },
            data: updateData
        });

        console.log('✏️ [Seed Variety] Updated:', variety.name);

        return res.status(200).json({
            success: true,
            message: 'Seed variety updated successfully',
            variety
        });
    } catch (error) {
        console.error('❌ [Seed Variety] Update error:', error);

        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'A variety with this name and crop type already exists'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to update seed variety',
            error: error.message
        });
    }
}

// DELETE - Delete a seed variety
export async function deleteSeedVariety(req, res) {
    try {
        const { id } = req.params;

        // Check if variety exists
        const existingVariety = await prisma.seedVariety.findUnique({
            where: { id }
        });

        if (!existingVariety) {
            return res.status(404).json({
                success: false,
                message: 'Seed variety not found'
            });
        }

        const [
            totalCount,
            requestCount,
            plantedCount,
            completedCount,
            archivedCount
        ] = await Promise.all([
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

        if (totalCount > 0) {
            const warning = plantedCount > 0
                ? `WARNING: ${plantedCount} reports are currently in Planted state (harvest in progress). Deleting this variety may affect harvest date predictions.`
                : null;

            return res.status(400).json({
                success: false,
                message: `Cannot delete variety "${existingVariety.name}": ${totalCount} planting reports are using this variety`,
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

        await prisma.seedVariety.delete({
            where: { id }
        });

        console.log('🗑️ [Seed Variety] Deleted:', id);

        return res.status(200).json({
            success: true,
            message: `Seed variety "${existingVariety.name}" deleted successfully`
        });
    } catch (error) {
        console.error('❌ [Seed Variety] Delete error:', error);

        if (error.code === 'P2003') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete variety - it has associated reports'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to delete seed variety',
            error: error.message
        });
    }
}

// UTILITY - Deactivate a variety
export async function deactivateVariety(req, res) {
    try {
        const { id } = req.params;

        const variety = await prisma.seedVariety.update({
            where: { id },
            data: { isActive: false }
        });

        console.log('🔒 [Seed Variety] Deactivated:', variety.name);

        return res.status(200).json({
            success: true,
            message: 'Seed variety deactivated successfully',
            variety
        });
    } catch (error) {
        console.error('❌ [Seed Variety] Deactivate error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to deactivate seed variety',
            error: error.message
        });
    }
}

// UTILITY - Get crop type statistics
export async function getCropTypeStats(req, res) {
    try {
        const stats = await prisma.seedVariety.groupBy({
            by: ['cropType'],
            _count: {
                id: true
            },
            where: {
                isActive: true
            }
        });

        console.log('📊 [Seed Variety] Retrieved crop type statistics');

        return res.status(200).json({
            success: true,
            message: 'Crop type statistics retrieved successfully',
            stats: stats.map(s => ({
                cropType: s.cropType,
                count: s._count.id
            }))
        });
    } catch (error) {
        console.error('❌ [Seed Variety] Get stats error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve crop type statistics',
            error: error.message
        });
    }
}
