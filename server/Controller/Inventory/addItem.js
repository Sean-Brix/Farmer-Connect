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
            // If item exists, create a new stack for it
            const newStack = await prisma.itemStack.create({
                data: {
                    itemId: existingItem.id,
                    quantity: parsedQuantity,
                    status: status || 'Available',
                },
            });

            // Return the updated item with all stacks
            const updatedItem = await prisma.inventoryItem.findUnique({
                where: { id: existingItem.id },
                include: {
                    item_stacks: true,
                },
            });

            return res.status(200).json({
                message: 'Stack added to existing item successfully',
                item: updatedItem,
            });
        } else {
            // Create new item with initial stack
            const newItem = await prisma.inventoryItem.create({
                data: {
                    name: name.trim(),
                    description: description?.trim() || "No description provided",
                    category: categoryEnum,
                    item_stacks: {
                        create: {
                            quantity: parsedQuantity,
                            status: status || 'Available',
                        },
                    },
                },
                include: {
                    item_stacks: true,
                },
            });

            return res.status(201).json({
                message: 'Item created successfully',
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
