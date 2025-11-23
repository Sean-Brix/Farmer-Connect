import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// CREATE - Create a new planting season
export async function createPlantingSeason(req, res) {
    try {
        const { name, description, startDate, endDate, isActive } = req.body;

        if (!name || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Name, start date, and end date are required'
            });
        }

        const season = await prisma.plantingSeason.create({
            data: {
                name,
                description: description || null,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isActive: isActive !== undefined ? isActive : true
            }
        });

        console.log('✅ [Planting Season] Created:', season.name);

        return res.status(201).json({
            success: true,
            message: 'Planting season created successfully',
            season
        });
    } catch (error) {
        console.error('❌ [Planting Season] Create error:', error);

        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'A season with this name already exists'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to create planting season',
            error: error.message
        });
    }
}

// READ - Get all planting seasons
export async function getAllPlantingSeasons(req, res) {
    try {
        const { isActive, includeReports } = req.query;

        const where = {};
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }

        const include = includeReports === 'true' 
            ? { plantingReports: { select: { id: true } } }
            : undefined;

        const seasons = await prisma.plantingSeason.findMany({
            where,
            include,
            orderBy: {
                startDate: 'desc'
            }
        });

        console.log(`📅 [Planting Season] Retrieved ${seasons.length} seasons`);

        return res.status(200).json({
            success: true,
            message: 'Planting seasons retrieved successfully',
            seasons
        });
    } catch (error) {
        console.error('❌ [Planting Season] Get all error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve planting seasons',
            error: error.message
        });
    }
}

// READ - Get active planting seasons only
export async function getActiveSeasons(req, res) {
    try {
        const seasons = await prisma.plantingSeason.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                startDate: 'desc'
            }
        });

        console.log(`📅 [Planting Season] Retrieved ${seasons.length} active seasons`);

        return res.status(200).json({
            success: true,
            message: 'Active planting seasons retrieved successfully',
            seasons
        });
    } catch (error) {
        console.error('❌ [Planting Season] Get active error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve active planting seasons',
            error: error.message
        });
    }
}

// READ - Get single planting season by ID
export async function getPlantingSeasonById(req, res) {
    try {
        const { id } = req.params;

        const season = await prisma.plantingSeason.findUnique({
            where: { id },
            include: {
                plantingReports: {
                    select: {
                        id: true,
                        farmerName: true,
                        typeOfCrop: true,
                        dateOfPlanting: true
                    }
                }
            }
        });

        if (!season) {
            return res.status(404).json({
                success: false,
                message: 'Planting season not found'
            });
        }

        console.log('📄 [Planting Season] Retrieved:', season.name);

        return res.status(200).json({
            success: true,
            message: 'Planting season retrieved successfully',
            season
        });
    } catch (error) {
        console.error('❌ [Planting Season] Get by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve planting season',
            error: error.message
        });
    }
}

// UPDATE - Update a planting season
export async function updatePlantingSeason(req, res) {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Check if season exists
        const existingSeason = await prisma.plantingSeason.findUnique({
            where: { id }
        });

        if (!existingSeason) {
            return res.status(404).json({
                success: false,
                message: 'Planting season not found'
            });
        }

        // Parse dates if provided
        if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
        if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

        const season = await prisma.plantingSeason.update({
            where: { id },
            data: updateData
        });

        console.log('✏️ [Planting Season] Updated:', season.name);

        return res.status(200).json({
            success: true,
            message: 'Planting season updated successfully',
            season
        });
    } catch (error) {
        console.error('❌ [Planting Season] Update error:', error);

        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'A season with this name already exists'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to update planting season',
            error: error.message
        });
    }
}

// DELETE - Delete a planting season
export async function deletePlantingSeason(req, res) {
    try {
        const { id } = req.params;
        const { cascade } = req.query; // Check if cascade delete is requested

        // Check if season exists
        const existingSeason = await prisma.plantingSeason.findUnique({
            where: { id },
            include: {
                plantingReports: { 
                    select: { id: true, isArchived: true }
                }
            }
        });

        if (!existingSeason) {
            return res.status(404).json({
                success: false,
                message: 'Planting season not found'
            });
        }

        const reportCount = existingSeason.plantingReports.length;

        // If cascade is requested or no reports exist, proceed with deletion
        if (cascade === 'true' && reportCount > 0) {
            // Delete all associated reports first
            await prisma.plantingReport.deleteMany({
                where: { croppingSeasonId: id }
            });
            console.log(`🗑️ [Planting Season] Cascade deleted ${reportCount} associated reports`);
        } else if (reportCount > 0) {
            // Cascade not requested but reports exist
            return res.status(400).json({
                success: false,
                message: `Cannot delete season with ${reportCount} associated reports. Enable cascade delete or set season to inactive.`
            });
        }

        await prisma.plantingSeason.delete({
            where: { id }
        });

        console.log('🗑️ [Planting Season] Deleted:', id);

        return res.status(200).json({
            success: true,
            message: reportCount > 0 
                ? `Planting season and ${reportCount} associated report(s) deleted successfully`
                : 'Planting season deleted successfully',
            deletedReports: reportCount
        });
    } catch (error) {
        console.error('❌ [Planting Season] Delete error:', error);

        if (error.code === 'P2003') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete season - it has associated reports'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to delete planting season',
            error: error.message
        });
    }
}

// UTILITY - Deactivate a season
export async function deactivateSeason(req, res) {
    try {
        const { id } = req.params;

        const season = await prisma.plantingSeason.update({
            where: { id },
            data: { isActive: false }
        });

        console.log('🔒 [Planting Season] Deactivated:', season.name);

        return res.status(200).json({
            success: true,
            message: 'Planting season deactivated successfully',
            season
        });
    } catch (error) {
        console.error('❌ [Planting Season] Deactivate error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to deactivate planting season',
            error: error.message
        });
    }
}
