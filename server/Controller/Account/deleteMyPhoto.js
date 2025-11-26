// PrismaClient import removed - using centralized db
import prisma from '../../config/database.js';
import { deleteFile } from '../../config/firebase.js';
import { clearFileCache } from '../../config/firebaseCache.js';

// Using centralized prisma instance

// Function to delete a user's profile photo from Firebase Storage
async function deleteMyPhoto(req, res) {
    try {
        const userId = req.user.id;

        // Validate user ID
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Get user's current photo path
        const user = await prisma.account.findUnique({
            where: { id: userId },
            select: { picturePath: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete from Firebase if exists
        if (user.picturePath) {
            await deleteFile(user.picturePath).catch(err => 
                console.warn('Failed to delete photo from Firebase:', err)
            );
            clearFileCache(user.picturePath);
        }

        // Update database to remove path
        await prisma.account.update({
            where: { id: userId },
            data: { picturePath: null },
        });

        return res.status(200).json({ message: 'Photo deleted successfully' });
    } 
    catch (error) {
        console.error('Error deleting photo:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default deleteMyPhoto;
