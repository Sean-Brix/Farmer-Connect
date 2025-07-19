import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function deleteItem(req, res) {
    try {
        const id = req.params.id;

        // First, check if the item exists
        const item = await prisma.inventoryItem.findUnique({
            where: { id: id },
            include: {
                item_stacks: {
                    include: {
                        itemTransactions: true,
                    },
                },
            },
        });

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Delete all item transactions for all stacks of this item
        const stackIds = item.item_stacks.map((stack) => stack.id);

        if (stackIds.length > 0) {
            await prisma.itemTransaction.deleteMany({
                where: {
                    itemStackId: {
                        in: stackIds,
                    },
                },
            });

            // Delete all item stacks for this item
            await prisma.itemStack.deleteMany({
                where: {
                    itemId: id,
                },
            });
        }

        // Finally, delete the inventory item
        await prisma.inventoryItem.delete({
            where: {
                id: id,
            },
        });

        res.status(200).json({
            message: 'Item and all associated stacks deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
}

export default deleteItem;
