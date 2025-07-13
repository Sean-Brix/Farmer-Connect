import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function deleteItem(req, res) {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id) {
            return res.status(400).json({ error: 'Item ID is required' });
        }

        // Find the item to delete
        const item = await prisma.inventoryItem.findUnique({
            where: { id: id },
            include: {
                item_stacks: true, // Include related stacks to check if any exist
            },
        });

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Use a transaction to delete related records first, then the item
        await prisma.$transaction(async (prisma) => {
            // First, delete all related item_stacks
            await prisma.itemStack.deleteMany({
                where: { itemId: id },
            });

            // Then delete the inventory item
            await prisma.inventoryItem.delete({
                where: { id: id },
            });
        });

        res.status(200).json({
            message: 'Item and all related records deleted successfully',
            deletedItem: {
                id: item.id,
                name: item.name,
                stacksDeleted: item.item_stacks.length,
            },
        });
    } catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({
            error: 'Failed to delete item',
            details: error.message,
        });
    }
}

export default deleteItem;
