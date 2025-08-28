import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function adminRegister(req, res) {
    // Validate input
    if (!req.body.firstName || !req.body.surname || !req.body.username || !req.body.password || !req.body.confirmPass) {
        return res.status(400).json({ message: 'All fields are required', error: 'required' });
    }
    if (req.body.password !== req.body.confirmPass) {
        return res.status(400).json({ message: 'Passwords do not match', error: 'password' });
    }
    if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long', error: 'password-long' });
    }
    if (!req.body.username || req.body.username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long', error: 'username-short'  });
    }
    if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
        return res.status(400).json({ message: 'Username can only contain letters and numbers', error: 'username-letters'  });
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.account.findUnique({
            where: {
                username: req.body.username,
            },
        });

        // If user exists, return error
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists', error: 'username' });
        }

        // check if email already exists
        const existingEmail = await prisma.account.findUnique({
            where: {
                email: req.body.email,
            },
        });

        // If email exists, return error
        if (existingEmail) {
            return res.status(409).json({ message: 'Email already exists', error: 'email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create new user
        const newUser = await prisma.account.create({
            data: {
                firstName: req.body.firstName,
                surname: req.body.surname,
                gender: req.body.gender,
                client_profile: req.body.clientProfile,
                address: req.body.address,
                telephone_no: req.body.telephoneNum,
                cellphone_no: req.body.cellphoneNum,
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

        // Remove password from user object before sending response
        newUser.password = undefined;

        // Send response without auto-login (no JWT token cookie)
        return res.status(201).json({
            message: 'User account created successfully',
            user: newUser
        });
    }

    catch (error) {
        console.error('Admin registration error:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

export default adminRegister;
