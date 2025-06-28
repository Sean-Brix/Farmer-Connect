import { PrismaClient } from '../../prisma/generated/client.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();



async function register(req, res) {

    // Validate input
    if (!firstName || !lastName || !username || !password || !confirmPass) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== confirmPass) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!username || username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return res.status(400).json({ message: 'Username can only contain letters and numbers' });
    }
    
    try {
        // Check if user already exists
        const existingUser = await prisma.account.findUnique({
            where: {
                username: username,
            },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await prisma.account.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                gender: req.body.gender,
                client_profile: req.body.clientProfile,
                address: req.body.address,
                telephone_no: req.body.telephoneNumber,
                cellphone_no: req.body.cellphoneNumber,
                occupation: req.body.occupation,
                position: req.body.position,
                institution: req.body.institution,
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword,
                middleName: req.body.middleName, 
                access: 'User'
            },
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id },        // PAYLOAD
            process.env.JWT_SECRET,        // SECRET KEY
            { expiresIn: '1h' }            // HEADER
        );

        // Send token as a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        // Remove password from user object before sending response
        newUser.password = undefined;

        // Send response
        return res.status(201).json({
            message: 'Registration successful',
            user: newUser
        });
    }

    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

