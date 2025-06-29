
// Parse the jwt token and return the payload
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

function parseToken(req, res, next) {
    const token = req.cookies.token;

    // If no token, return error
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify token and get payload
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        // Attach user ID to request object
        req.user = { id: decoded.userId };
        next();
    });
}
 
export default parseToken;