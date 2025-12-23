import prisma from '../../config/database.js';

async function getSeedVariety(req, res) {
    try {
        const { id } = req.params;

        const variety = await prisma.seedVariety.findUnique({
            where: { id },
            include: {
                inventoryItems: {
                    select: {
                        id: true,
                        name: true,
                        item_stacks: {
                            select: {
                                id: true,
                                quantity: true,
                                status: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        plantingReports: true
                    }
                }
            }
        });

        if (!variety) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Seed variety not found'
            });
        }

        return res.status(200).json({
            success: true,
            variety
        });
    } catch (error) {
        console.error('Error fetching seed variety:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch seed variety. Please try again later.'
        });
    }
}

export default getSeedVariety;
