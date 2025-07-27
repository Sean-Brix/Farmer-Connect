import auditLogger from '../../Services/auditLogger.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '../../prisma/generated/client.js';

dotenv.config();
const prisma = new PrismaClient();

async function logout(req, res) {
    try {
        let userInfo = null;
        console.log('[DEBUG] Logout request received');
        console.log('[DEBUG] Cookies:', req.cookies);
        console.log('[DEBUG] Authorization header:', req.headers.authorization);

        // Try to extract user info from token before clearing it
        try {
            // Get token from cookie or Authorization header
            const token =
                req.cookies?.token ||
                req.headers.authorization?.replace('Bearer ', '');
            console.log('[DEBUG] Token found:', !!token);

            if (token) {
                // Verify and decode the token to get user ID
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log('[DEBUG] Decoded token payload:', decoded);

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
                        console.log(
                            '[DEBUG] Fetched user info from database:',
                            {
                                id: userInfo.id,
                                username: userInfo.username,
                                access: userInfo.access,
                            }
                        );
                    } else {
                        console.log(
                            '[DEBUG] User not found in database with ID:',
                            decoded.userId
                        );
                    }
                } else {
                    console.log('[DEBUG] No userId found in token payload');
                }
            } else {
                console.log('[DEBUG] No token found for logout audit');
            }
        } catch (tokenError) {
            console.log(
                '[DEBUG] Could not decode token or fetch user for logout audit:',
                tokenError.message
            );
            // Continue with logout even if token is invalid
        }

        // Log the logout action only for admin/super admin users
        if (
            userInfo &&
            (userInfo.access === 'Admin' || userInfo.access === 'Super_Admin')
        ) {
            console.log(
                '[DEBUG] Attempting to log logout for admin user:',
                userInfo.username
            );
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
                console.log(
                    `[AUDIT] Logout logged successfully for user: ${userInfo.username}`
                );
            } catch (auditError) {
                console.error(
                    '[ERROR] Failed to log logout audit:',
                    auditError
                );
                // Continue with logout even if audit fails
            }
        } else {
            console.log(
                '[DEBUG] Not logging logout - user is not admin or no user info available'
            );
            if (userInfo) {
                console.log('[DEBUG] User access level:', userInfo.access);
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
