import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getAll(req, res) {
    try {
        // Get all item stacks with Distributed status including their related item information
        const distributedStacks = await prisma.itemStack.findMany({
            where: {
                status: 'Distributed',
            },
            include: {
                item: true,
            },
            orderBy: {
                quantity: 'desc',
            },
        });

        const list = distributedStacks.map((stack) => ({
            ...stack,
            item: {
                ...stack.item,
                picture: `/api/distribution/photo/${stack.itemId}`,
            },
            count: stack.count,
        }));

        // Return success response with the distributed stacks data
        return res.status(200).json(list);
    } 
    catch (error) {
        console.error('Error retrieving distributed stacks:', error);
        return res.status(500).json({
            success: false,
            message:
                'Internal server error while retrieving distributed stacks',
            error: error.message,
        });
    }
}

export default getAll;
