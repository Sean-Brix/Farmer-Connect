import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getUserDetails(req, res) {
    const userId = req.params.id;

    // Fetch user details from the database
    try {
        const user = await prisma.account.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = undefined; 
        user.picture = undefined;
        user.mimeType = undefined;

        if (user.access === 'Super_Admin') {
            user.access = 'Super Admin';
        }

        return res.status(200).json(user);
    } 
    
    catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default getUserDetails;
