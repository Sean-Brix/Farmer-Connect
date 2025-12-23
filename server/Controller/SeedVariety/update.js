import prisma from '../../config/database.js';

async function updateSeedVariety(req, res) {
    try {
        const { id } = req.params;
        const {
            name,
            cropType,
            directSeededDAS,
            transplantedDAS,
            description,
            plantingWindow,
            isActive
        } = req.body;

        // Check if variety exists
        const existing = await prisma.seedVariety.findUnique({
            where: { id }
        });

        if (!existing) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Seed variety not found'
            });
        }

        // Validate crop type if provided
        if (cropType) {
            const validCropTypes = ['Rice', 'Corn', 'High_Value_Crops'];
            if (!validCropTypes.includes(cropType)) {
                return res.status(400).json({
                    error: 'Validation error',
                    message: 'Invalid crop type. Must be Rice, Corn, or High_Value_Crops'
                });
            }
        }

        // Check for duplicate name+cropType if changing either
        if (name || cropType) {
            const checkName = name || existing.name;
            const checkCropType = cropType || existing.cropType;

            const duplicate = await prisma.seedVariety.findFirst({
                where: {
                    name: checkName,
                    cropType: checkCropType,
                    id: { not: id }
                }
            });

            if (duplicate) {
                return res.status(409).json({
                    error: 'Conflict',
                    message: 'A seed variety with this name and crop type already exists'
                });
            }
        }

        // Build update data
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (cropType !== undefined) updateData.cropType = cropType;
        if (directSeededDAS !== undefined) updateData.directSeededDAS = parseInt(directSeededDAS);
        if (transplantedDAS !== undefined) updateData.transplantedDAS = parseInt(transplantedDAS);
        if (description !== undefined) updateData.description = description;
        if (plantingWindow !== undefined) updateData.plantingWindow = parseInt(plantingWindow);
        if (isActive !== undefined) updateData.isActive = isActive;

        // Update seed variety
        const variety = await prisma.seedVariety.update({
            where: { id },
            data: updateData
        });

        return res.status(200).json({
            success: true,
            message: 'Seed variety updated successfully',
            variety
        });
    } catch (error) {
        console.error('Error updating seed variety:', error);

        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'Conflict',
                message: 'A seed variety with this name and crop type already exists'
            });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to update seed variety. Please try again later.'
        });
    }
}

export default updateSeedVariety;
