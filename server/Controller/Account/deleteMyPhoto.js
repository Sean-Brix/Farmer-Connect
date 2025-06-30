import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient()


// Function to delete a user's profile photo
async function deleteMyPhoto(req, res) {
    try {
        const userId = req.user.id;

        // Validate user ID
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Update the user's photo in the database
        const updatedUser = await prisma.account.update({
            where: { id: userId },
            data: { 
                picture: null,
                mimeType: null,
            },
        });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'Photo deleted successfully' });
    } 
    catch (error) {
        console.error('Error deleting photo:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default deleteMyPhoto;