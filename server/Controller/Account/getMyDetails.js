import { PrismaClient } from '../../prisma/generated/client.js';

const prisma = new PrismaClient();

async function getMyDetails(req, res) {
    const userId = req.user.id;

    // Validate user ID
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch user details from the database
    try {
        const user = await prisma.account.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = undefined; 

        return res.status(200).json(user);

    } 
    
    catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default getMyDetails;
