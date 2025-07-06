import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '../../prisma/generated/client.js'

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getPhoto(req, res) {
    try {
        const defaultImagePath = path.join(__dirname, "../../public/default_seminar_pic.jpg");

        const seminarId = req.params.id;

        const seminar = await prisma.seminar.findUnique({
            where: { id: seminarId },
            select: {
                picture: true,
                mimeType: true,
            },
        });

        if (!seminar || !seminar.picture) {

            res.set("Content-Type", "image/png");
            return res.sendFile(defaultImagePath);
        
        }
        
        res.set('Content-Type', seminar.mimeType || 'image/jpeg');
        res.send(seminar.picture);
    } 
    catch (error) {
        console.error('Error getting photo:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default getPhoto;