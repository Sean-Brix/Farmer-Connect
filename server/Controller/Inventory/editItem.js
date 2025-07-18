import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function editItem(req, res) {
    try {
        const { id, name, description, category } = req.body;

        // Validate required fields
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Item ID is required',
            });
        }

        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Item name is required',
            });
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

        // Check if item exists
        const existingItem = await prisma.inventoryItem.findUnique({
            where: { id: id },
        });

        if (!existingItem) {
            return res.status(404).json({
                success: false,
                error: 'Item not found',
            });
        }

        // Check if name is already taken by another item
        const nameExists = await prisma.inventoryItem.findFirst({
            where: {
                name: name.trim(),
                id: { not: id }, // Exclude current item
            },
        });

        if (nameExists) {
            return res.status(400).json({
                success: false,
                error: 'Item name already exists',
            });
        }

        // Update the item
        const updatedItem = await prisma.inventoryItem.update({
            where: { id: id },
            data: {
                name: name.trim(),
                description: description ? description.trim() : null,
                category: categoryEnum,
                updatedAt: new Date(),
            },
            include: {
                item_stacks: true, // Include stacks in response
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: updatedItem,
        });
    } catch (error) {
        console.error('Error updating item:', error);

        // Handle Prisma-specific errors
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                error: 'Item name already exists',
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}

export default editItem;
