import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getAllAccounts(req, res) {

    try {
        // Fetch all accounts except the current user
        const accounts = await prisma.account.findMany();

        console.log(accounts);

        return res.status(200).json({
            message: 'Accounts retrieved successfully',
            payload: accounts
        });

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