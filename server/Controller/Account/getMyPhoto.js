import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '../../prisma/generated/client.js'
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
            if (!user || !user.picture) {
                const defaultImagePath = path.join(__dirname, "../../public/default_picture.png");
                res.set("Content-Type", "image/png");
                return res.sendFile(defaultImagePath);
            }

        }
        
        res.set('Content-Type', user.mimeType || 'image/jpeg');
        res.send(user.picture);
    } 
    catch (error) {
        console.error('Error getting photo:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default getMyPhoto;