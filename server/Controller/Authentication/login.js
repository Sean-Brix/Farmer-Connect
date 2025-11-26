// PrismaClient import removed - using centralized db
import prisma from '../../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import auditLogger from '../../Services/auditLogger.js';

dotenv.config();
// Using centralized prisma instance

async function login(req, res) {
    const { username, password, rememberMe } = req.body;

    // Validate input
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: 'Username and password are required' });
    }

    try {
        // Find user by username - select only needed fields for faster query
        const user = await prisma.account.findUnique({
            where: {
                username: username,
            },
            select: {
                id: true,
                username: true,
                password: true,
                access: true,
                firstName: true,
                surname: true,
                email: true
            }
        });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password from bcrypt
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token with different expiration based on rememberMe
        const tokenExpiration = rememberMe ? '30d' : '1d';
        const token = jwt.sign(
            { userId: user.id }, // PAYLOAD
            process.env.JWT_SECRET, // SECRET KEY
            { expiresIn: tokenExpiration } // HEADER
        );

        // Set cookie with different maxAge based on rememberMe
        const cookieMaxAge = rememberMe
            ? 30 * 24 * 60 * 60 * 1000
            : 60 * 60 * 1000; // 30 days or 1 hour in milliseconds

        // Send token as a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: cookieMaxAge,
        });

        // Remove sensitive fields from user object before sending response
        const { password: _, ...userWithoutPassword } = user;

        // Log the login action asynchronously (don't block response)
        if (user.access === 'Admin' || user.access === 'Super_Admin') {
            // Fire and forget - don't await
            auditLogger.log({
                adminId: user.id,
                action: 'LOGIN',
                details: `Admin ${user.username} logged in successfully`,
                metadata: {
                    loginMethod: 'password',
                    rememberMe: rememberMe,
                    tokenExpiration: tokenExpiration,
                    userRole: user.access,
                },
                req: req,
            }).catch(err => console.error('Audit log error:', err));
        }

        // Send response immediately
        return res.status(200).json({
            message: 'Login successful',
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default login;
