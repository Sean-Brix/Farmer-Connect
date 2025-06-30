import { PrismaClient } from '../../prisma/generated/client.js';

const prisma = new PrismaClient();

// Function to set a user's profile blob photo 
async function setPhoto(req, res) {
    const { userId } = req.params;
    const { photo } = req.body;
    
    try {
        // Update the user's photo in the database
        const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { photo },
        });
    
        // Respond with the updated user data
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user photo:', error);
        res.status(500).json({ error: 'Failed to update user photo' });
    }
}

export default setPhoto;