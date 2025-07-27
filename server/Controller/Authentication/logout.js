import auditLogger from '../../Services/auditLogger.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '../../prisma/generated/client.js';

dotenv.config();
const prisma = new PrismaClient();

async function logout(req, res) {
    try {
        let userInfo = null;

        // Try to extract user info from token before clearing it
        try {
            // Get token from cookie or Authorization header
            const token =
                req.cookies?.token ||
                req.headers.authorization?.replace('Bearer ', '');

            if (token) {
                // Verify and decode the token to get user ID
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                if (decoded.userId) {
                    // Fetch user data from database using the userId from token
                    const user = await prisma.account.findUnique({
                        where: { id: decoded.userId },
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            access: true,
                        },
                    });

                    if (user) {
                        userInfo = user;
                    }
                }
            }
        } catch (tokenError) {
            // Continue with logout even if token is invalid
        }

        // Log the logout action only for admin/super admin users
        if (
            userInfo &&
            (userInfo.access === 'Admin' || userInfo.access === 'Super_Admin')
        ) {
            try {
                await auditLogger.log({
                    adminId: userInfo.id,
                    action: 'LOGOUT',
                    details: `Admin ${userInfo.username} logged out`,
                    metadata: {
                        logoutMethod: 'manual',
                        sessionDuration: null, // Could calculate this if you track login time
                    },
                    req: req,
                });
            } catch (auditError) {
                console.error(
                    '[ERROR] Failed to log logout audit:',
                    auditError
                );
                // Continue with logout even if audit fails
            }
        }

        // Clear the cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        // Send response
        return res.status(200).json({
            message: 'Logout successful',
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default logout;
