import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function editStack(req, res) {
    try {
        const { stackId, itemId, status, quantity } = req.body;

        // Validate required fields
        if (!stackId && (!itemId || !status)) {
            return res.status(400).json({
                error: 'Either stackId or both itemId and status are required',
            });
        }

        if (quantity === undefined || quantity < 0) {
            return res.status(400).json({
                error: 'Quantity must be a non-negative number',
            });
        }

        let targetStack;

        if (stackId) {
            // If stackId is provided, find the existing stack
            targetStack = await prisma.itemStack.findUnique({
                where: { id: stackId },
                include: { item: true },
            });

            if (!targetStack) {
                return res.status(404).json({
                    error: 'Stack not found',
                });
            }
        } else {
            // If itemId and status are provided, find existing stack
            const item = await prisma.inventoryItem.findUnique({
                where: { id: itemId },
            });

            if (!item) {
                return res.status(404).json({
                    error: 'Item not found',
                });
            }

            // Check if a stack with this status already exists
            targetStack = await prisma.itemStack.findFirst({
                where: {
                    itemId: itemId,
                    status: status,
                },
                include: { item: true },

            });
        }

        // Handle quantity update
        if (quantity === 0) {
            // If quantity is 0, delete the stack if it exists
            if (targetStack) {
                await prisma.itemStack.delete({
                    where: { id: targetStack.id },
                });

                return res.status(200).json({
                    message: 'Stack deleted successfully',
                    deleted: true,
                    stackId: targetStack.id,
                });
            } else {
                return res.status(200).json({
                    message: 'No stack to delete',
                    deleted: false,
                });
            }
        } else {
            // If quantity > 0, update existing stack or create new one
            if (targetStack) {
                // Update existing stack
                targetStack = await prisma.itemStack.update({
                    where: { id: targetStack.id },
                    data: { quantity: quantity },
                    include: { item: true },
                });
            } else {
                // Create new stack
                if (!itemId || !status) {
                    return res.status(400).json({
                        error: 'itemId and status are required to create new stack',
                    });
                }

                targetStack = await prisma.itemStack.create({
                    data: {
                        itemId: itemId,
                        status: status,
                        quantity: quantity,
                    },
                    include: { item: true },
                });
            }

            return res.status(200).json({
                message: 'Stack updated successfully',
                stack: targetStack,
            });
        }
    } catch (error) {
        console.error('Error in editStack:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message,
        });
    }
}

export default editStack;
