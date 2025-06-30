import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

// Function to set a user's profile blob photo using multer
async function setMyPhoto(req, res) {
    try {
        const { file } = req;
        const userId = req.user.id;

        

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Update the user's photo in the database
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId, 10) },
            data: { photo: file.buffer },
        });

        return res.status(200).json({ message: 'Photo updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating photo:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default setMyPhoto;