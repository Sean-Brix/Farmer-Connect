import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function setMyDetails(req, res) {
    const userId = req.user.id;

    const {
        username,
        email,
        firstName,
        lastName,
        middleName,
        gender,
        client_profile,
        cellphone_no,
        telephone_no,
        occupation,
        position,
        institution,
        address,
    } = req.body;

    const validationResult = filterUpdateData(req.body);

    if (validationResult !== true) {
        return res.status(400).json({ message: validationResult });
    }

    const updatedUser = await prisma.account.update({
        where: {
            id: userId,
        },
        data: {
            username,
            email,
            firstName,
            lastName,
            middleName,
            gender,
            client_profile,
            cellphone_no,
            telephone_no,
            occupation,
            position,
            institution,
            address,
        },
    });

    // Exclude sensitive fields from the response
    updatedUser.password = undefined;
    updatedUser.picture = undefined;
    updatedUser.mimeType = undefined;

    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
        message: 'Details updated successfully.',
        user: updatedUser,
    });
}

function filterUpdateData(data) {
    const ClientProfiles_option = [
        'Fishfolk',
        'Rural Based Org',
        'Student',
        'Agricultural/Fisheries Technician',
        'Youth',
        'Women',
        'Govt Employee',
        'PWD',
        'Indigenous People',
        'Other',
    ];

    const gender_option = ['Male', 'Female', 'Other'];

    const {
        username,
        email,
        firstName,
        lastName,
        middleName,
        gender,
        client_profile,
        cellphone_no,
        telephone_no,
        occupation,
        position,
        institution,
        address,
    } = data;

    try {
        if (
            !username ||
            !email ||
            !firstName ||
            !lastName ||
            !gender ||
            !client_profile ||
            !cellphone_no ||
            !address
        ) {
            return 'All fields are required.';
        }

        if (!gender_option.includes(gender)) {
            return 'Invalid gender.';
        }
        if (!ClientProfiles_option.includes(client_profile)) {
            return 'Invalid client profile.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Invalid email format.';
        }

        const cellphoneRegex = /^09\d{9}$/;
        if (!cellphoneRegex.test(cellphone_no)) {
            return 'Invalid cellphone number format. Must start with 09 and be 11 digits long.';
        }

        const telephoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!telephoneRegex.test(telephone_no)) {
            return 'Invalid telephone number format. Must be in XXX-XXX-XXXX format.';
        }

        return true;
    } 
    catch (error) {
        console.error('Server Error: filtering update details:', error);
        return 'Server error during validation.';
    }
}

export default setMyDetails;
