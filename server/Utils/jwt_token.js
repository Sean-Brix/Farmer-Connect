
// Parse the jwt token and return the payload
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function isAuthenticated(req) {
    const token = req.cookies.token;

    // Return id if token exists and false otherwise
    if (!token) {
        return false;
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;

    } 

    catch (err) {

        return false;

    }
}