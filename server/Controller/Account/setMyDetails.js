import prisma from '../../config/database.js';

async function setMyDetails(req, res) {
    const userId = req.user.id;

    const {
        username,
        email,
        firstName,
        middleName,
        surname,
        extensionName,
        sex,
        contactNumber,
        dateOfBirth,
        client_profile,
    } = req.body;

    const validationResult = filterUpdateData(req.body);

    if (validationResult !== true) {
        return res.status(400).json({ message: validationResult });
    }

    try {
        const updatedUser = await prisma.account.update({
            where: {
                id: userId,
            },
            data: {
                username,
                email: email || null,
                firstName,
                middleName: middleName || null,
                surname,
                extensionName: extensionName || null,
                sex,
                contactNumber: contactNumber || null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                client_profile,
            },
        });

        // Exclude sensitive fields from the response
        updatedUser.password = undefined;

        res.status(200).json({
            message: 'Details updated successfully.',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user details:', error);
        
        // Provide more specific error messages based on the error type
        if (error.code === 'P2002') {
            // Unique constraint violation
            const field = error.meta?.target?.[0] || 'field';
            return res.status(400).json({ 
                message: `This ${field} is already taken. Please choose a different ${field}.` 
            });
        } else if (error.code === 'P2025') {
            // Record not found
            return res.status(404).json({ 
                message: 'User profile not found. Please try logging in again.' 
            });
        } else if (error.code === 'P2003') {
            // Foreign key constraint violation
            return res.status(400).json({ 
                message: 'Invalid data reference. Please check your input and try again.' 
            });
        } else if (error.message.includes('Invalid') || error.message.includes('validation')) {
            // Validation errors from Prisma
            return res.status(400).json({ 
                message: `Data validation error: ${error.message}` 
            });
        } else if (error.message.includes('String') && error.message.includes('too long')) {
            // String length validation
            return res.status(400).json({ 
                message: 'One of the text fields is too long. Please shorten your input and try again.' 
            });
        } else {
            // Generic server error with more detail in development
            const isDevelopment = process.env.NODE_ENV === 'development';
            return res.status(500).json({ 
                message: isDevelopment 
                    ? `Database error: ${error.message}` 
                    : 'Internal server error while updating profile. Please try again later.' 
            });
        }
    }
}

function filterUpdateData(data) {
    const ClientProfiles_option = [
        'Fishfolk',
        'Rural_Based_Org',
        'Student',
        'Agricultural_Fisheries_Technician',
        'Youth',
        'Women',
        'Govt_Employee',
        'PWD',
        'Indigenous_People',
        'Other',
    ];

    const sex_option = ['Male', 'Female'];

    const {
        username,
        firstName,
        surname,
        sex,
        client_profile,
        email,
        contactNumber,
    } = data;

    try {
        // Required fields validation
        if (!username || !firstName || !surname || !sex || !client_profile) {
            return 'Required fields: username, firstName, surname, sex, and client_profile.';
        }

        // Validate enum values
        if (!sex_option.includes(sex)) {
            return 'Invalid sex value. Must be Male or Female.';
        }
        if (!ClientProfiles_option.includes(client_profile)) {
            return 'Invalid client profile.';
        }

        // Email validation (if provided)
        if (email && email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return 'Invalid email format.';
            }
        }

        // Contact number validation (if provided - Philippine format)
        if (contactNumber && contactNumber.trim()) {
            const mobileRegex = /^09\d{9}$/;
            if (!mobileRegex.test(contactNumber)) {
                return 'Invalid contact number format. Must start with 09 and be 11 digits long.';
            }
        }

        return true;
    } 
    catch (error) {
        console.error('Server Error: filtering update details:', error);
        return 'Server error during validation.';
    }
}

export default setMyDetails;
