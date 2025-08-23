import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { PrismaClient } from '../../prisma/generated/client.js';

const prisma = new PrismaClient();

export function socketAuth(socket, next) {
    try {

        const role = socket.handshake.auth.role;
        const rawCookie = socket.handshake.headers.cookie;

        if (!rawCookie) {
            const err = new Error('Authentication required');
            err.data = { message: 'No authentication cookie found' };
            return next(err);
        }

        const parsed = cookie.parse(rawCookie);
        const token = parsed['token'];

        if (!token) {
            const err = new Error('Authentication required');
            err.data = { message: 'No authentication token found' };
            return next(err);
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user data to socket
        socket.user = { ...decoded, role };
        next();
        
    } catch (error) {
        console.error('Socket authentication error:', error.message);
        const err = new Error('Invalid authentication token');
        err.data = { message: 'Authentication failed' };
        next(err);
    }
}

/**
 * Validate user has required role
 */
export function requireRole(allowedRoles) {
    return (socket, next) => {
        if (!socket.user) {
            const err = new Error('Authentication required');
            err.data = { message: 'User not authenticated' };
            return next(err);
        }

        if (!allowedRoles.includes(socket.user.role)) {
            const err = new Error('Insufficient permissions');
            err.data = { message: 'Access denied' };
            return next(err);
        }

        next();
    };
}

/**
 * Validate user exists in database
 */
export async function validateUser(socket, next) {
    try {
        if (!socket.user || !socket.user.userId) {
            const err = new Error('Invalid user data');
            err.data = { message: 'User ID not found' };
            return next(err);
        }

        const user = await prisma.account.findUnique({
            where: { id: socket.user.userId },
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
            const err = new Error('User not found');
            err.data = { message: 'User account does not exist' };
            return next(err);
        }

        // Update socket user data with fresh database info
        socket.user = { ...socket.user, ...user };
        next();
        
    } catch (error) {
        console.error('User validation error:', error);
        const err = new Error('User validation failed');
        err.data = { message: 'Database error during validation' };
        next(err);
    }
}
