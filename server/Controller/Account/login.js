import { PrismaClient } from '../../prisma/generated/client.js';

const prisma = new PrismaClient();

async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await prisma.accounts.findUnique({
            where: {
                username: username,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Here you would typically create a session or token
        return res.status(200).json({ message: 'Login successful', user });
    } 
    
    catch (error) {

        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });

    }
}

export default login;
