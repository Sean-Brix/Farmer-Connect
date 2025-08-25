export const adminAuth = (req, res, next) => {
    // Check if user has admin access
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'User not authenticated'
        });
    }

    const adminRoles = ['Admin', 'Super_Admin'];
    if (!adminRoles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }

    next();
};
