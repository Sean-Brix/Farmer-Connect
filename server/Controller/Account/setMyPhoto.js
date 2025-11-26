// PrismaClient import removed - using centralized db
import prisma from '../../config/database.js';
import { uploadFile, deleteFile } from '../../config/firebase.js';
import { clearFileCache } from '../../config/firebaseCache.js';
import sharp from 'sharp';

// Using centralized prisma instance

// Function to set a user's profile photo using Firebase Storage
async function setMyPhoto(req, res) {
    try {
        const { file } = req;
        const userId = req.user.id;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' });
        }

        // Get user to check for existing photo
        const user = await prisma.account.findUnique({
            where: { id: userId },
            select: { picturePath: true, username: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete old photo from Firebase if exists
        if (user.picturePath) {
            await deleteFile(user.picturePath).catch(err => 
                console.warn('Failed to delete old photo:', err)
            );
            clearFileCache(user.picturePath);
        }

        // Process and optimize image
        const optimizedBuffer = await sharp(file.buffer)
            .resize(400, 400, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 85 })
            .toBuffer();

        // Upload to Firebase Storage - using user ID as filename (new format)
        const storagePath = `accounts/${userId}.jpg`;
        await uploadFile(storagePath, optimizedBuffer, 'image/jpeg');

        // Update database with new path
        await prisma.account.update({
            where: { id: userId },
            data: { picturePath: storagePath },
        });

        // Clear the cache for this user's old path to force refresh
        clearFileCache(storagePath);

        return res.status(200).json({ 
            message: 'Photo updated successfully',
            picturePath: storagePath
        });
    } 
    catch (error) {
        console.error('Error updating photo:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default setMyPhoto;
