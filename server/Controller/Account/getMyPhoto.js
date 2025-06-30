import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

// Function to get the user's profile blob photo using multer
async function getMyPhoto(req, res) {
    try {
        const userId = req.user.id;

        // Get the user's photo in the database
        const user = await prisma.account.findUnique({
            where: { id: userId },
            select: {
                picture: true,
                mimeType: true,
            },
        });

        if (!user || !user.picture) {
            return res.status(301).redirect('/images/default_picture.png');
        }
        
        res.set('Content-Type', user.mimeType || 'image/jpeg');
        res.send(user.picture);
    } 
    catch (error) {
        console.error('Error updating photo:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default getMyPhoto;