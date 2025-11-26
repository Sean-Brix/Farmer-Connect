import prisma from '../../config/database.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// PrismaClient import removed - using centralized db

dotenv.config();
// Using centralized prisma instance

/**
 * Cookie-based authentication middleware
 * Checks for JWT token in cookies and attaches user to req.user
 */
export const cookieAuth = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await prisma.account.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                username: true,
                firstName: true,
                surname: true,
                email: true,
                access: true
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Attach user to request
        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        
        console.error('Cookie authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};
