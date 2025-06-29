import { PrismaClient } from '../../prisma/generated/client.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function login(req, res) {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Find user by username
        const user = await prisma.account.findUnique({
            where: {
                username: username,
            },
        });


        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password from bcrypt
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id },        // PAYLOAD
            process.env.JWT_SECRET,     // SECRET KEY
            {expiresIn: '1h', }         // HEADER
            
        );

        // Send token as a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        // Remove password from user object before sending response
        user.password = undefined;

        // Send response
        return res.status(200).json({
            message: 'Login successful',
            user: user
        });
    }
    catch (error) {

        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });

    }
}

export default login;
