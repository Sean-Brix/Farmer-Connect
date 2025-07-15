import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getItems(req, res) {
    try {
        const items = await prisma.inventoryItem.findMany({
            include: {
                item_stacks: {
                    select: {
                        id: true,
                        quantity: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });

        // Calculate total quantity for each item
        const list = items.map((item) => {
            const totalQuantity = item.item_stacks.reduce(
                (sum, stack) => sum + stack.quantity,
                0
            );

            return {
                id: item.id,
                name: item.name,
                description: item.description,
                picture: '/api/inventory/item/' + item.id + '/picture',
                category: item.category,
                totalQuantity: totalQuantity,
                stacks: item.item_stacks,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            };
        });

        res.status(200).json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve items' });
    }
}

export default getItems;
