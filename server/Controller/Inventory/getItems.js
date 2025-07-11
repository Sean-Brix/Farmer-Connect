import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getItems(req, res) {
    try {
        const items = await prisma.inventoryItem.findMany({
            include: {
                item_stacks: true,
            },
        });

        console.log(items);

        res.status(200).json(items);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve items' });
    }
}

export default getItems;
