import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getAll(req, res) {
    try {
        // Get all item stacks with EIC status including their related item information
        const eicStacks = await prisma.itemStack.findMany({
            where: {
                status: 'EIC',
            },
            include: {
                item: true,
            },
            orderBy: {
                quantity: 'desc',
            },
        });

        const list = eicStacks.map((stack) => ({
            ...stack,
            item: {
                ...stack.item,
                picture: `/api/eic/photo/${stack.itemId}`
            },
            count: stack.count,
        }));

        // Return success response with the EIC stacks data
        return res.status(200).json(list);
    } 
    catch (error) {
        console.error('Error retrieving EIC stacks:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while retrieving EIC stacks',
            error: error.message,
        });
    }
}

export default getAll;
