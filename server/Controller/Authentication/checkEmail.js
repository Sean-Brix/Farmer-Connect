import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function checkEmail(req, res) {
    const { email } = req.body;

    const validationResult = validateEmailFormat(email);

    if (!validationResult.valid) {
        return res.status(400).json({
            message: validationResult.message,
            result: false,
        });
    }

    try {
        const existingEmail = await prisma.account.findUnique({
            where: {
                email: email,
            },
        });

        if (existingEmail) {
            return res
                .status(409)
                .json({ message: 'Email already exists', result: false });
        }

        return res
            .status(200)
            .json({ message: 'Email is available', result: true });
    } catch (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// FILTER
function validateEmailFormat(email) {
    if (!email) {
        return { valid: false, message: 'Email is required.' };
    }

    if (email.length > 255) {
        return {
            valid: false,
            message: 'Email is too long (maximum 255 characters).',
        };
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Invalid email address format.' };
    }

    if (email.includes('..')) {
        return {
            valid: false,
            message: 'Invalid email: Consecutive dots are not allowed.',
        };
    }

    const atIndex = email.indexOf('@');
    if (atIndex > 0) {
        if (
            email.substring(0, atIndex).startsWith('.') ||
            email.substring(0, atIndex).endsWith('.')
        ) {
            return {
                valid: false,
                message:
                    'Invalid email: Dots are not allowed at the beginning or end of the local part.',
            };
        }
    }

    if (email.includes(' ')) {
        return {
            valid: false,
            message: 'Invalid email: Spaces are not allowed.',
        };
    }

    return { valid: true, message: 'Email format is valid.' };
}


export default checkEmail;

