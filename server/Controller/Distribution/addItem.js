import { PrismaClient } from '../../prisma/generated/client.js';
import auditLogger from '../../Services/auditLogger.js';

const prisma = new PrismaClient();

const addDistributionItem = async (req, res) => {
    try {
        const { name, quantity, description, category, status } = req.body;
        const image = req.file;

        // Validate required fields
        if (!name || !quantity) {
            return res.status(400).json({
                success: false,
                error: 'Name and quantity are required',
            });
        }

        // Convert quantity to number
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity < 0) {
            return res.status(400).json({
                success: false,
                error: 'Quantity must be a valid positive number',
            });
        }

        // Check if item already exists in inventory
        let inventoryItem = await prisma.inventoryItem.findFirst({
            where: {
                name: name.trim(),
            },
        });

        // If item doesn't exist, create it in inventory
        if (!inventoryItem) {
            inventoryItem = await prisma.inventoryItem.create({
                data: {
                    name: name.trim(),
                    description: description?.trim() || '',
                    category: category || 'Other',
                    picture: image ? image.buffer : null,
                },
            });
        } else {
            // If item exists but doesn't have an image and we're providing one, update it
            if (!inventoryItem.picture && image) {
                inventoryItem = await prisma.inventoryItem.update({
                    where: { id: inventoryItem.id },
                    data: {
                        picture: image.buffer,
                        updatedAt: new Date(),
                    },
                });
            }
        }

        // Check if distribution stack already exists for this item (with Distributed status)
        let itemStack = await prisma.itemStack.findFirst({
            where: {
                itemId: inventoryItem.id,
                status: 'Distributed',
            },
        });

        if (itemStack) {
            // Update existing stack quantity
            itemStack = await prisma.itemStack.update({
                where: { id: itemStack.id },
                data: {
                    quantity: itemStack.quantity + parsedQuantity,
                    updatedAt: new Date(),
                },
                include: {
                    item: true,
                },
            });
        } else {
            // Create new distribution stack
            itemStack = await prisma.itemStack.create({
                data: {
                    itemId: inventoryItem.id,
                    quantity: parsedQuantity,
                    status: 'Distributed',
                },
                include: {
                    item: true,
                },
            });
        }

        // Log the distribution item creation
        await auditLogger.log({
            adminId: req.user?.id,
            action: 'DISTRIBUTION_CREATE',
            targetType: 'Distribution',
            targetId: itemStack.id,
            targetName: inventoryItem.name,
            details: `Added ${parsedQuantity} units of ${inventoryItem.name} to distribution`,
            metadata: {
                action: 'distribution_item_added',
                itemName: inventoryItem.name,
                quantity: parsedQuantity,
                category: inventoryItem.category,
                isNewInventoryItem: !itemStack ? false : true,
                stackId: itemStack.id,
                inventoryItemId: inventoryItem.id,
            },
            req: req,
        });

        res.status(201).json({
            success: true,
            message: 'Distribution item added successfully',
            data: itemStack,
        });
    } catch (error) {
        console.error('Error adding distribution item:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Internal server error while adding distribution item',
            details: error.message,
        });
    }
};

export default addDistributionItem;
