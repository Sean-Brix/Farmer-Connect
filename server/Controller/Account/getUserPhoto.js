import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { getFileUrlCached } from '../../config/firebaseCache.js';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get a user's profile photo URL from Firebase Storage
async function getUserPhoto(req, res) {
    try {
        const defaultImagePath = path.join(
            __dirname,
            '../../public/default_picture.png'
        );

        const userId = req.params.id;

        // Get the user's photo path from database
        const user = await prisma.account.findUnique({
            where: { id: userId },
            select: { picturePath: true },
        });

        if (!user || !user.picturePath) {
            res.set('Content-Type', 'image/png');
            return res.sendFile(defaultImagePath);
        }

        // Get Firebase download URL with caching
        const photoUrl = await getFileUrlCached(user.picturePath);
        
        if (!photoUrl) {
            // If requesting JSON format, return error
            if (req.query.format === 'json') {
                return res.status(404).json({ error: 'Photo not found' });
            }
            res.set('Content-Type', 'image/png');
            return res.sendFile(defaultImagePath);
        }
        
        // If format=json is specified, return URL as JSON
        if (req.query.format === 'json') {
            return res.json({ url: photoUrl });
        }
        
        // Otherwise, redirect to Firebase CDN URL
        return res.redirect(photoUrl);
    } catch (error) {
        console.error('Error getting photo:', error);
        const defaultImagePath = path.join(__dirname, '../../public/default_picture.png');
        res.set('Content-Type', 'image/png');
        return res.sendFile(defaultImagePath);
    }
}

export default getUserPhoto;
