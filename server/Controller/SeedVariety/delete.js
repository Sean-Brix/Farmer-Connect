import prisma from '../../config/database.js';

async function deleteSeedVariety(req, res) {
    try {
        const { id } = req.params;

        // Check if variety exists
        const existing = await prisma.seedVariety.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        inventoryItems: true,
                        plantingReports: true
                    }
                }
            }
        });

        if (!existing) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Seed variety not found'
            });
        }

        // Check if variety is in use
        if (existing._count.inventoryItems > 0) {
            // Soft delete - just mark as inactive
            const variety = await prisma.seedVariety.update({
                where: { id },
                data: { isActive: false }
            });

            return res.status(200).json({
                success: true,
                message: 'Seed variety deactivated successfully (cannot delete as it is in use)',
                variety
            });
        }

        // No items using it - can hard delete
        await prisma.seedVariety.delete({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: 'Seed variety deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting seed variety:', error);

        if (error.code === 'P2003') {
            return res.status(409).json({
                error: 'Conflict',
                message: 'Cannot delete seed variety as it is being used by distribution items or planting reports'
            });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to delete seed variety. Please try again later.'
        });
    }
}

export default deleteSeedVariety;
