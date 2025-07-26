
import auditLogger from '../../Services/auditLogger.js';

async function logout(req, res) {
    try {
        // Log the logout action only for admin/super admin users
        if (req.user && (req.user.access === 'Admin' || req.user.access === 'Super_Admin')) {
            await auditLogger.log(
                req.user.id,
                'LOGOUT',
                null,
                null,
                null,
                `Admin ${req.user.username} logged out`,
                {
                    logoutMethod: 'manual',
                    sessionDuration: null // Could calculate this if you track login time
                },
                req.ip,
                req.get('User-Agent')
            );
        }

        // Clear the cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        // Send response
        return res.status(200).json({
            message: 'Logout successful'
        });
    } 
    catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default logout;