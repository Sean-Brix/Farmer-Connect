import { PrismaClient } from '../../prisma/generated/client.js';
import auditLogger from '../../Services/auditLogger.js';
const prisma = new PrismaClient();

async function editStack(req, res) {
    try {
        const { stackId, itemId, status, quantity, date_limit } = req.body;

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

        // Validate date_limit if provided
        if (
            date_limit !== undefined &&
            date_limit !== null &&
            (date_limit < 1 || date_limit > 365)
        ) {
            return res.status(400).json({
                error: 'Date limit must be between 1 and 365 days, or null for no limit',
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
            // If quantity is 0, set stack quantity to 0 but don't delete (maintain all status stacks)
            if (targetStack) {
                targetStack = await prisma.itemStack.update({
                    where: { id: targetStack.id },
                    data: {
                        quantity: 0,
                        date_limit:
                            date_limit !== undefined
                                ? date_limit === null
                                    ? null
                                    : parseInt(date_limit)
                                : undefined,
                    },
                    include: { item: true },
                });

                // Log the inventory status change action
                await auditLogger.log({
                    adminId: req.user?.id,
                    action: 'INVENTORY_STATUS_CHANGE',
                    targetType: 'InventoryItem',
                    targetId: targetStack.item.id,
                    targetName: targetStack.item.name,
                    details: `Set quantity to 0 for ${targetStack.item.name} (${targetStack.status})`,
                    metadata: {
                        action: 'quantity_zeroed',
                        itemName: targetStack.item.name,
                        status: targetStack.status,
                        previousQuantity: quantity,
                        newQuantity: 0,
                        dateLimit: targetStack.date_limit,
                    },
                    req: req,
                });

                return res.status(200).json({
                    message: 'Stack quantity set to 0 successfully',
                    stack: targetStack,
                });
            } else {
                // If stack doesn't exist and quantity is 0, create it with 0 quantity
                if (!itemId || !status) {
                    return res.status(400).json({
                        error: 'itemId and status are required to create new stack',
                    });
                }

                targetStack = await prisma.itemStack.create({
                    data: {
                        itemId: itemId,
                        status: status,
                        quantity: 0,
                        date_limit:
                            date_limit !== undefined
                                ? date_limit === null
                                    ? null
                                    : parseInt(date_limit)
                                : null,
                    },
                    include: { item: true },
                });

                // Log the inventory creation action
                await auditLogger.log({
                    adminId: req.user?.id,
                    action: 'INVENTORY_CREATE',
                    targetType: 'InventoryItem',
                    targetId: targetStack.item.id,
                    targetName: targetStack.item.name,
                    details: `Created new stack for ${targetStack.item.name} (${targetStack.status}) with 0 quantity`,
                    metadata: {
                        action: 'stack_created',
                        itemName: targetStack.item.name,
                        status: targetStack.status,
                        quantity: 0,
                        dateLimit: targetStack.date_limit,
                    },
                    req: req,
                });

                return res.status(200).json({
                    message: 'New stack created with 0 quantity',
                    stack: targetStack,
                });
            }
        } else {
            // If quantity > 0, update existing stack or create new one
            if (targetStack) {
                // Store previous values for audit log
                const previousQuantity = targetStack.quantity;
                const previousDateLimit = targetStack.date_limit;

                // Update existing stack
                targetStack = await prisma.itemStack.update({
                    where: { id: targetStack.id },
                    data: {
                        quantity: quantity,
                        date_limit:
                            date_limit !== undefined
                                ? date_limit === null
                                    ? null
                                    : parseInt(date_limit)
                                : undefined,
                    },
                    include: { item: true },
                });

                // Log the inventory update action
                await auditLogger.log({
                    adminId: req.user?.id,
                    action: 'INVENTORY_UPDATE',
                    targetType: 'InventoryItem',
                    targetId: targetStack.item.id,
                    targetName: targetStack.item.name,
                    details: `Updated stack for ${targetStack.item.name} (${targetStack.status})`,
                    metadata: {
                        action: 'stack_updated',
                        itemName: targetStack.item.name,
                        status: targetStack.status,
                        previousQuantity: previousQuantity,
                        newQuantity: quantity,
                        previousDateLimit: previousDateLimit,
                        newDateLimit: targetStack.date_limit,
                    },
                    req: req,
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
                        date_limit:
                            date_limit !== undefined
                                ? date_limit === null
                                    ? null
                                    : parseInt(date_limit)
                                : null,
                    },
                    include: { item: true },
                });

                // Log the inventory creation action
                await auditLogger.log({
                    adminId: req.user?.id,
                    action: 'INVENTORY_CREATE',
                    targetType: 'InventoryItem',
                    targetId: targetStack.item.id,
                    targetName: targetStack.item.name,
                    details: `Created new stack for ${targetStack.item.name} (${targetStack.status}) with ${quantity} units`,
                    metadata: {
                        action: 'stack_created',
                        itemName: targetStack.item.name,
                        status: targetStack.status,
                        quantity: quantity,
                        dateLimit: targetStack.date_limit,
                    },
                    req: req,
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
