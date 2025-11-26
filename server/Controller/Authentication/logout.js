import prisma from '../../config/database.js';
import auditLogger from '../../Services/auditLogger.js';
import socketLogoutService from '../../Services/socketLogoutService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// PrismaClient import removed - using centralized db

dotenv.config();
// Using centralized prisma instance

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
                    // Fetch only essential user data from database
                    const user = await prisma.account.findUnique({
                        where: { id: decoded.userId },
                        select: {
                            id: true,
                            username: true,
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

        // Log the logout action asynchronously (don't block response)
        if (
            userInfo &&
            (userInfo.access === 'Admin' || userInfo.access === 'Super_Admin')
        ) {
            // Fire and forget - don't await
            auditLogger.log({
                adminId: userInfo.id,
                action: 'LOGOUT',
                details: `Admin ${userInfo.username} logged out`,
                metadata: {
                    logoutMethod: 'manual',
                    sessionDuration: null,
                },
                req: req,
            }).catch(auditError => {
                console.error('[ERROR] Failed to log logout audit:', auditError);
            });
        }

        // Clear the cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        // Disconnect user's socket connections asynchronously if user info available
        if (userInfo) {
            // Fire and forget - don't await
            Promise.resolve().then(() => {
                socketLogoutService.disconnectUserOnLogout(
                    userInfo.id,
                    'manual_logout'
                );
            }).catch(socketError => {
                console.error('[ERROR] Failed to disconnect user sockets on logout:', socketError);
            });
        }

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
