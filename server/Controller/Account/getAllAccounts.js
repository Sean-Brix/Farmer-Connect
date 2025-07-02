import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getAllAccounts(req, res) {

    try {
        // Fetch all accounts except the current user
        const accounts = await prisma.account.findMany({
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
                access: true
            },
            orderBy: {
                createdAt: 'asc',
            },

        });

        // If access == "Super_Admin" it would convert it to "Super Admin"
        accounts.forEach(account => {
            if (account.access === 'Super_Admin') {
                account.access = 'Super Admin';
            }
        });

        return res.status(200).json({list: accounts});
    } 
    catch (error) {
        console.error('Error fetching accounts:', error);
        return res.status(500).json({
            message: 'An error occurred while fetching accounts',
            payload: []
        });
    }

}

export default getAllAccounts;