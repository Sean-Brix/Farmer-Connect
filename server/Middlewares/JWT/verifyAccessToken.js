import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '../../prisma/generated/client.js';

dotenv.config();
const prisma = new PrismaClient();

export const verifyAccessToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

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
                role: true,
                access: true,
                isActive: true
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is inactive'
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
        
        console.error('Token verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Token verification failed'
        });
    }
};
