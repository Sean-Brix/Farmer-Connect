import { PrismaClient } from '../../prisma/generated/client.js';

const prisma = new PrismaClient();

async function setPhoto(req, res) {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided',
            });
        }

        // Validate file type
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

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            return res.status(400).json({
                success: false,
                error: 'File size too large. Maximum size is 5MB.',
            });
        }

        // Check if item exists
        const item = await prisma.inventoryItem.findUnique({
            where: { id: id },
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found',
            });
        }

        // Update the item with the new photo
        await prisma.inventoryItem.update({
            where: { id: id },
            data: {
                picture: file.buffer,
                updatedAt: new Date(),
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Item photo updated successfully',
        });
    } catch (error) {
        console.error('Error setting item photo:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}

export default setPhoto;
