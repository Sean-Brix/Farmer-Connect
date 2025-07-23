import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '../../prisma/generated/client.js';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getPhoto(req, res) {
    const { id } = req.params;

    try {
        const defaultImagePath = path.join(
            __dirname,
            '../../public/eic_default.jpg'
        );

        // Fetch the item by ID
        const item = await prisma.inventoryItem.findUnique({
            where: {
                id: id,
            },
            select: {
                picture: true,
            },
        });

        if (!item || !item.picture) {
            res.set('Content-Type', 'image/png');
            return res.sendFile(defaultImagePath);
        }

        // Send the image binary data as response
        res.set('Content-Type', 'image/jpeg');
        res.send(item.picture);

    } catch (error) {
        console.error('Error retrieving item photo:', error);
        const defaultImagePath = path.join(
            __dirname,
            '../../public/default_picture.png'
        );
        res.set('Content-Type', 'image/png');
        return res.sendFile(defaultImagePath);
    }
}

export default getPhoto;
