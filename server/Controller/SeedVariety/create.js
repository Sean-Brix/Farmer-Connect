import prisma from '../../config/database.js';

async function createSeedVariety(req, res) {
    try {
        const {
            name,
            cropType,
            directSeededDAS,
            transplantedDAS,
            description,
            plantingWindow
        } = req.body;

        // Validation
        if (!name || !cropType) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Name and crop type are required'
            });
        }

        if (!directSeededDAS || !transplantedDAS) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Days After Sowing (DAS) values are required for both direct seeded and transplanted methods'
            });
        }

        // Validate crop type
        const validCropTypes = ['Rice', 'Corn', 'High_Value_Crops'];
        if (!validCropTypes.includes(cropType)) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Invalid crop type. Must be Rice, Corn, or High_Value_Crops'
            });
        }

        // Check for duplicate
        const existing = await prisma.seedVariety.findFirst({
            where: {
                name,
                cropType
            }
        });

        if (existing) {
            return res.status(409).json({
                error: 'Conflict',
                message: 'A seed variety with this name and crop type already exists'
            });
        }

        // Create seed variety
        const variety = await prisma.seedVariety.create({
            data: {
                name,
                cropType,
                directSeededDAS: parseInt(directSeededDAS),
                transplantedDAS: parseInt(transplantedDAS),
                description: description || null,
                plantingWindow: plantingWindow ? parseInt(plantingWindow) : 30,
                isActive: true
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Seed variety created successfully',
            variety
        });
    } catch (error) {
        console.error('Error creating seed variety:', error);

        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'Conflict',
                message: 'A seed variety with this name and crop type already exists'
            });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to create seed variety. Please try again later.'
        });
    }
}

export default createSeedVariety;
