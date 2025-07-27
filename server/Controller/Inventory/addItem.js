import { PrismaClient } from '../../prisma/generated/client.js';
import auditLogger from '../../Services/auditLogger.js';
const prisma = new PrismaClient();

async function addItem(req, res) {
    try {
        const { name, description, category, quantity, status } = req.body;
        const file = req.file; // Get uploaded image file

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

        // Validate image file if provided
        if (file) {
            const allowedTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
            ];
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    error: 'Invalid file type. Only JPEG, PNG, and GIF images are allowed.',
                });
            }

            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                return res.status(400).json({
                    error: 'File size too large. Maximum size is 5MB.',
                });
            }
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

            // If a new image is provided, update the existing item's image
            if (file) {
                await prisma.inventoryItem.update({
                    where: { id: existingItem.id },
                    data: {
                        picture: file.buffer,
                        updatedAt: new Date(),
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

            // Log the inventory update action
            await auditLogger.log({
                adminId: req.user?.id, // Admin ID from auth middleware
                action: 'INVENTORY_UPDATE',
                targetType: 'InventoryItem',
                targetId: existingItem.id,
                targetName: existingItem.name,
                details: `Added ${parsedQuantity} units to existing inventory item: ${existingItem.name} (${targetStatus})`,
                metadata: {
                    action: 'quantity_added',
                    itemName: existingItem.name,
                    quantityAdded: parsedQuantity,
                    status: targetStatus,
                    previousQuantity: existingStack?.quantity || 0,
                    newQuantity:
                        (existingStack?.quantity || 0) + parsedQuantity,
                    imageUpdated: !!file,
                },
                req: req,
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
                    picture: file ? file.buffer : null, // Add image if provided
                    item_stacks: {
                        create: stacksToCreate,
                    },
                },
                include: {
                    item_stacks: true,
                },
            });

            // Log the inventory creation action (context-aware based on target status)
            const auditAction =
                targetStatus === 'EIC'
                    ? 'EIC_CREATE'
                    : targetStatus === 'Distributed'
                    ? 'DISTRIBUTION_CREATE'
                    : 'INVENTORY_CREATE';

            const auditTargetType =
                targetStatus === 'EIC'
                    ? 'EIC'
                    : targetStatus === 'Distributed'
                    ? 'Distribution'
                    : 'InventoryItem';

            await auditLogger.log({
                adminId: req.user?.id, // Admin ID from auth middleware
                action: auditAction,
                targetType: auditTargetType,
                targetId: newItem.id,
                targetName: newItem.name,
                details: `Created new ${targetStatus.toLowerCase()} item: ${
                    newItem.name
                } with ${parsedQuantity} units`,
                metadata: {
                    action:
                        targetStatus === 'EIC'
                            ? 'eic_item_created'
                            : targetStatus === 'Distributed'
                            ? 'distribution_item_created'
                            : 'inventory_item_created',
                    itemName: newItem.name,
                    description: newItem.description,
                    category: newItem.category,
                    initialQuantity: parsedQuantity,
                    initialStatus: targetStatus,
                    hasImage: !!file,
                },
                req: req,
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
