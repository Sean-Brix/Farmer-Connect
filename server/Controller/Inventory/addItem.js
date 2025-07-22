import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function addItem(req, res) {
    try {
        const { name, description, category, quantity, status } = req.body;

        // Validate required fields
        if (!name || !quantity) {
            return res.status(400).json({
                error: 'Name and quantity are required fields',
            });
        }

        // Validate quantity is a positive number
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({
                error: 'Quantity must be a positive number',
            });
        }

        // Convert category format (replace spaces with underscores for enum)
        const categoryEnum = category ? category.replace(/ /g, '_') : 'Other';

        // Check if item with the same name already exists
        const existingItem = await prisma.inventoryItem.findUnique({
            where: { name: name.trim() },
        });

        if (existingItem) {
            // If item exists, find the stack with the specified status and add to it
            const targetStatus = status || 'Available';
            const existingStack = await prisma.itemStack.findFirst({
                where: {
                    itemId: existingItem.id,
                    status: targetStatus,
                },
            });

            if (existingStack) {
                // Update the existing stack by adding the quantity
                await prisma.itemStack.update({
                    where: { id: existingStack.id },
                    data: {
                        quantity: existingStack.quantity + parsedQuantity,
                    },
                });
            } else {
                // If stack with this status doesn't exist, create it
                await prisma.itemStack.create({
                    data: {
                        itemId: existingItem.id,
                        quantity: parsedQuantity,
                        status: targetStatus,
                    },
                });
            }

            // Return the updated item with all stacks
            const updatedItem = await prisma.inventoryItem.findUnique({
                where: { id: existingItem.id },
                include: {
                    item_stacks: true,
                },
            });

            return res.status(200).json({
                message: 'Quantity added to existing item stack successfully',
                item: updatedItem,
            });
        } else {
            // Create new item with stacks for all statuses
            const allStatuses = [
                'Available',
                'Unavailable',
                'Damaged',
                'EIC',
                'Distributed',
            ];
            const targetStatus = status || 'Available';

            const stacksToCreate = allStatuses.map((stackStatus) => ({
                quantity: stackStatus === targetStatus ? parsedQuantity : 0,
                status: stackStatus,
            }));

            const newItem = await prisma.inventoryItem.create({
                data: {
                    name: name.trim(),
                    description:
                        description?.trim() || 'No description provided',
                    category: categoryEnum,
                    item_stacks: {
                        create: stacksToCreate,
                    },
                },
                include: {
                    item_stacks: true,
                },
            });

            return res.status(201).json({
                message: 'Item created successfully with all status stacks',
                item: newItem,
            });
        }
    } catch (error) {
        console.error('Error in addItem:', error);

        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'An item with this name already exists',
            });
        }

        if (error.code === 'P2003') {
            return res.status(400).json({
                error: 'Invalid category or status provided',
            });
        }

        res.status(500).json({ error: 'Failed to add item' });
    }
}

export default addItem;
