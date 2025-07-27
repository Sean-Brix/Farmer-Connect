import { PrismaClient } from '../../prisma/generated/client.js';
import auditLogger from '../../Services/auditLogger.js';
const prisma = new PrismaClient();

async function editItem(req, res) {
    try {
        const stackId = req.params.id;
        const { name, description, category, quantity, date_limit } = req.body;
        const file = req.file; // Get uploaded image file

        // Validate required fields
        if (!stackId) {
            return res.status(400).json({
                success: false,
                error: 'Stack ID is required',
            });
        }

        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Item name is required',
            });
        }

        if (quantity === undefined || quantity < 0) {
            return res.status(400).json({
                success: false,
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
                success: false,
                error: 'Date limit must be between 1 and 365 days, or null for no limit',
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
                    success: false,
                    error: 'Invalid file type. Only JPEG, PNG, and GIF images are allowed.',
                });
            }

            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                return res.status(400).json({
                    success: false,
                    error: 'File size too large. Maximum size is 5MB.',
                });
            }
        }

        // Validate category enum
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

        // Convert frontend category format to database enum format
        const categoryEnum = category ? category.replace(/\s+/g, '_') : 'Other';

        if (!validCategories.includes(categoryEnum)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid category',
            });
        }

        // Check if stack exists and get the associated item
        const existingStack = await prisma.itemStack.findUnique({
            where: { id: stackId },
            include: {
                item: true,
            },
        });

        if (!existingStack) {
            return res.status(404).json({
                success: false,
                error: 'EIC stack not found',
            });
        }

        // Check if name is already taken by another item (excluding current item)
        const nameExists = await prisma.inventoryItem.findFirst({
            where: {
                name: name.trim(),
                id: { not: existingStack.item.id },
            },
        });

        if (nameExists) {
            return res.status(400).json({
                success: false,
                error: 'Item name already exists',
            });
        }

        // Start a transaction to update both item and stack
        const result = await prisma.$transaction(async (tx) => {
            // Prepare the update data for the inventory item
            const itemUpdateData = {
                name: name.trim(),
                description: description ? description.trim() : null,
                category: categoryEnum,
                updatedAt: new Date(),
            };

            // Add image to update data if provided
            if (file) {
                itemUpdateData.picture = file.buffer;
            }

            // Update the inventory item
            const updatedItem = await tx.inventoryItem.update({
                where: { id: existingStack.item.id },
                data: itemUpdateData,
            });

            // Update the stack quantity and date_limit
            const updatedStack = await tx.itemStack.update({
                where: { id: stackId },
                data: {
                    quantity: parseInt(quantity),
                    date_limit:
                        date_limit !== undefined
                            ? date_limit === null
                                ? null
                                : parseInt(date_limit)
                            : undefined,
                    updatedAt: new Date(),
                },
                include: {
                    item: true,
                },
            });

            return updatedStack;
        });

        // Log the EIC item update
        await auditLogger.log({
            adminId: req.user?.id,
            action: 'EIC_UPDATE',
            targetType: 'EIC',
            targetId: result.id,
            targetName: result.item.name,
            details: `Updated EIC item ${result.item.name} (Quantity: ${result.quantity})`,
            metadata: {
                action: 'eic_item_updated',
                itemName: result.item.name,
                quantity: result.quantity,
                category: result.item.category,
                stackId: result.id,
                inventoryItemId: result.item.id,
                hasImage: !!file,
                dateLimit: result.date_limit,
            },
            req: req,
        });

        return res.status(200).json({
            success: true,
            message: 'EIC item updated successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error updating EIC item:', error);

        // Handle Prisma-specific errors
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                error: 'Item name already exists',
            });
        }

        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: 'EIC item or stack not found',
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}

export default editItem;
