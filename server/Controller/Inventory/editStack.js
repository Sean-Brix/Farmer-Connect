import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function editStack(req, res) {
    try {
        const { stackId, itemId, status, quantity, action } = req.body;

        // Validate required fields
        if (!stackId && (!itemId || !status)) {
            return res.status(400).json({
                error: 'Either stackId or both itemId and status are required',
            });
        }

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                error: 'Quantity must be a positive number',
            });
        }

        if (!action || !['add', 'set', 'reduce'].includes(action)) {
            return res.status(400).json({
                error: 'Action must be one of: add, set, reduce',
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
            // If itemId and status are provided, find or create stack
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

        let newQuantity;

        switch (action) {
            case 'add':
                if (targetStack) {
                    // Add to existing stack
                    newQuantity = targetStack.quantity + quantity;
                    targetStack = await prisma.itemStack.update({
                        where: { id: targetStack.id },
                        data: { quantity: newQuantity },
                        include: { item: true },
                    });
                } else {
                    // Create new stack if no existing stack with this status
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
                break;

            case 'set':
                if (targetStack) {
                    // Set exact quantity
                    targetStack = await prisma.itemStack.update({
                        where: { id: targetStack.id },
                        data: { quantity: quantity },
                        include: { item: true },
                    });
                } else {
                    // Create new stack if doesn't exist
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
                break;

            case 'reduce':
                if (!targetStack) {
                    return res.status(404).json({
                        error: 'Cannot reduce quantity: stack not found',
                    });
                }

                newQuantity = targetStack.quantity - quantity;

                if (newQuantity <= 0) {
                    // Delete the stack if quantity becomes 0 or negative
                    await prisma.itemStack.delete({
                        where: { id: targetStack.id },
                    });

                    return res.status(200).json({
                        message: 'Stack deleted successfully',
                        deleted: true,
                        stackId: targetStack.id,
                    });
                } else {
                    // Update with reduced quantity
                    targetStack = await prisma.itemStack.update({
                        where: { id: targetStack.id },
                        data: { quantity: newQuantity },
                        include: { item: true },
                    });
                }
                break;
        }

        res.status(200).json({
            message: 'Stack updated successfully',
            stack: targetStack,
        });
    } catch (error) {
        console.error('Error in editStack:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message,
        });
    }
}

export default editStack;
