import prisma from '../../config/database.js';

async function getAllSeedVarieties(req, res) {
    try {
        const { cropType, isActive } = req.query;

        // Build where clause
        const where = {};
        
        if (cropType) {
            where.cropType = cropType;
        }
        
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }

        const varieties = await prisma.seedVariety.findMany({
            where,
            orderBy: [
                { cropType: 'asc' },
                { name: 'asc' }
            ],
            include: {
                _count: {
                    select: {
                        inventoryItems: true,
                        plantingReports: true
                    }
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Seed varieties retrieved successfully',
            count: varieties.length,
            varieties
        });
    } catch (error) {
        console.error('Error fetching seed varieties:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch seed varieties. Please try again later.'
        });
    }
}

export default getAllSeedVarieties;
