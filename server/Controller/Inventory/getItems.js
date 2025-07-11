import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getItems(req, res) {
    try {
        const items = await prisma.inventoryItem.findMany({
            include: {
                item_stacks: true,
                category: true
            },
        });

        const updated = items.map((item) => ({
            ...item,
            total: item.item_stacks.reduce(
                (sum, stack) => sum + stack.quantity,
                0
            ),
        }));

        console.log(updated);

        res.status(200).json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve items' });
    }
}

export default getItems;
