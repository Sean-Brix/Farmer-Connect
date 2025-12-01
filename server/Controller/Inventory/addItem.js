// PrismaClient import removed - using centralized db
import prisma from '../../config/database.js';
import auditLogger from '../../Services/auditLogger.js';
// Using centralized prisma instance

async function addItem(req, res) {
    try {
        const { name, description, category, quantity, status, date_limit, max_quantity_per_request } = req.body;
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

        // Validate date_limit if provided
        if (
            date_limit !== undefined &&
            date_limit !== null &&
            date_limit !== '' &&
            (parseInt(date_limit) < 1 || parseInt(date_limit) > 365)
        ) {
            return res.status(400).json({
                error: 'Date limit must be between 1 and 365 days, or empty for no limit',
            });
        }

        // Validate max_quantity_per_request if provided
        if (
            max_quantity_per_request !== undefined &&
            max_quantity_per_request !== null &&
            max_quantity_per_request !== '' &&
            parseInt(max_quantity_per_request) < 1
        ) {
            return res.status(400).json({
                error: 'Maximum quantity per request must be at least 1, or empty for no limit',
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
                const updateData = {
                    quantity: existingStack.quantity + parsedQuantity,
                };
                
                // Update date_limit if provided
                if (date_limit !== undefined && date_limit !== null && date_limit !== '') {
                    updateData.date_limit = parseInt(date_limit);
                }
                
                // Update max_quantity_per_request if provided
                if (max_quantity_per_request !== undefined && max_quantity_per_request !== null && max_quantity_per_request !== '') {
                    updateData.max_quantity_per_request = parseInt(max_quantity_per_request);
                }
                
                await prisma.itemStack.update({
                    where: { id: existingStack.id },
                    data: updateData,
                });
            } else {
                // If stack with this status doesn't exist, create it
                const newStackData = {
                    itemId: existingItem.id,
                    quantity: parsedQuantity,
                    status: targetStatus,
                };
                
                // Add date_limit if provided
                if (date_limit !== undefined && date_limit !== null && date_limit !== '') {
                    newStackData.date_limit = parseInt(date_limit);
                }
                
                // Add max_quantity_per_request if provided
                if (max_quantity_per_request !== undefined && max_quantity_per_request !== null && max_quantity_per_request !== '') {
                    newStackData.max_quantity_per_request = parseInt(max_quantity_per_request);
                }
                
                await prisma.itemStack.create({
                    data: newStackData,
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

            // Convert category to display format for frontend
            const displayCategory = updatedItem.category ? updatedItem.category.replace(/_/g, ' ') : 'Other';

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
                item: {
                    ...updatedItem,
                    category: displayCategory, // Return display format to frontend
                },
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

            const stacksToCreate = allStatuses.map((stackStatus) => {
                const stackData = {
                    quantity: stackStatus === targetStatus ? parsedQuantity : 0,
                    status: stackStatus,
                };
                
                // Only apply date_limit and max_quantity_per_request to the target status stack
                if (stackStatus === targetStatus) {
                    if (date_limit !== undefined && date_limit !== null && date_limit !== '') {
                        stackData.date_limit = parseInt(date_limit);
                    }
                    if (max_quantity_per_request !== undefined && max_quantity_per_request !== null && max_quantity_per_request !== '') {
                        stackData.max_quantity_per_request = parseInt(max_quantity_per_request);
                    }
                }
                
                return stackData;
            });

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

            // Convert category to display format for frontend
            const displayCategory = newItem.category ? newItem.category.replace(/_/g, ' ') : 'Other';

            return res.status(201).json({
                message: 'Item created successfully with all status stacks',
                item: {
                    ...newItem,
                    category: displayCategory, // Return display format to frontend
                },
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
