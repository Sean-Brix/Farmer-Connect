import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function addItem(req, res) {
    try {
        const { name, quantity, description, category, status } = req.body;

        // Validate required fields
        if (!name || !quantity || !status) {
            return res.status(400).json({
                error: 'Missing required fields: name, quantity, and status are required',
            });
        }

        // Validate quantity
        const quantityNum = parseInt(quantity);
        if (isNaN(quantityNum) || quantityNum < 1) {
            return res.status(400).json({
                error: 'Quantity must be a positive number',
            });
        }

        // Valid enum values for validation
        const validCategories = [
            'Farming_Equipment',
            'Harvesting_Tools',
            'Irrigation_Systems',
            'Storage_Equipment',
            'Processing_Equipment',
            'Safety_Gear',
            'Pest_Control',
            'Livestock_Equipment',
            'Measuring_Tools',
            'Fisheries',
            'Machinery',
            'Other',
        ];

        const validStatuses = [
            'Available',
            'Unavailable',
            'Lost',
            'Damaged',
            'EIC',
            'Distributed',
        ];

        // Validate category enum
        if (category && !validCategories.includes(category)) {
            return res.status(400).json({
                error: `Invalid category. Must be one of: ${validCategories.join(
                    ', '
                )}`,
            });
        }

        // Validate status enum
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: `Invalid status. Must be one of: ${validStatuses.join(
                    ', '
                )}`,
            });
        }

        // Find or create the inventory item
        let inventoryItem = await prisma.inventoryItem.findUnique({
            where: { name: name },
        });

        if (!inventoryItem) {
            // Create new inventory item
            inventoryItem = await prisma.inventoryItem.create({
                data: {
                    name: name,
                    description: description || "No description provided",
                    category: category || 'Other',
                },
            });
        }

        // Create the item stack
        const itemStack = await prisma.itemStack.create({
            data: {
                itemId: inventoryItem.id,
                quantity: quantityNum,
                status: status,
            },
        });

        // Update the inventory item with the new stack
        await prisma.inventoryItem.update({
            where: { id: inventoryItem.id },
            data: {
                item_stacks: {
                    connect: { id: itemStack.id },
                },
            },
        });

        // Return the created item with its stacks
        const createdItem = await prisma.inventoryItem.findUnique({
            where: { id: inventoryItem.id },
            include: {
                item_stacks: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        // Add total quantity
        const itemWithTotal = {
            ...createdItem,
            total: createdItem.item_stacks.reduce(
                (sum, stack) => sum + stack.quantity,
                0
            ),
        };

        res.status(201).json({
            message: 'Item added successfully',
            item: itemWithTotal,
        });
    } catch (error) {
        console.error('Error adding item:', error);

        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'An item with this name already exists',
            });
        }

        res.status(500).json({
            error: 'Failed to add item to inventory',
        });
    }
}

export default addItem;
