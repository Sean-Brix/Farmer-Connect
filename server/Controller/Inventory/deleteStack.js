import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function deleteStack(req, res) {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id) {
            return res.status(400).json({ error: 'Stack ID is required' });
        }

        // Find the stack to delete
        const stack = await prisma.itemStack.findUnique({
            where: { id: id },
            include: {
                item: true, // Use the correct relation field name from your Prisma schema
            },
        });

        if (!stack) {
            return res.status(404).json({ error: 'Stack not found' });
        }

        // Use a transaction to delete the stack
        await prisma.$transaction(async (prisma) => {
            // Delete the item stack
            await prisma.itemStack.delete({
                where: { id: id },
            });
        });

        res.status(200).json({
            message: 'Stack deleted successfully',
            deletedStack: {
                id: stack.id,
                itemId: stack.itemId,
                quantity: stack.quantity,
                itemName: stack.item.name,
            },
        });
    } catch (error) {
        console.error('Delete stack error:', error);
        res.status(500).json({
            error: 'Failed to delete stack',
            details: error.message,
        });
    }
}
export default deleteStack;