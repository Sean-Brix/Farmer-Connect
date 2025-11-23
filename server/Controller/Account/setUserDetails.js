import { PrismaClient } from '@prisma/client';
import auditLogger from '../../Services/auditLogger.js';
const prisma = new PrismaClient();

async function setUserDetails(req, res) {
    const userId = req.params.id;

    let {
        username,
        email,
        firstName,
        surname,
        middleName,
        extensionName,
        sex,
        contactNumber,
        dateOfBirth,
        access,
        client_profile,
    } = req.body;

    const validationResult = filterUpdateData(req.body);

    if (access === 'Super Admin') {
        access = 'Super_Admin';
    }

    if (validationResult !== true) {
        return res.status(400).json({ message: validationResult });
    }

    // Get the current user details before updating for audit log
    const currentUser = await prisma.account.findUnique({
        where: { id: userId },
    });

    if (!currentUser) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const updatedUser = await prisma.account.update({
        where: {
            id: userId,
        },
        data: {
            username,
            email: email || null,
            firstName,
            surname,
            middleName: middleName || null,
            extensionName: extensionName || null,
            sex,
            contactNumber: contactNumber || null,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            access,
            client_profile,
        },
    });

    // Exclude sensitive fields from the response
    updatedUser.password = undefined;

    // Track what fields were updated for audit log
    const updatedFields = [];
    if (currentUser.username !== username) updatedFields.push('username');
    if (currentUser.email !== email) updatedFields.push('email');
    if (currentUser.firstName !== firstName) updatedFields.push('firstName');
    if (currentUser.surname !== surname) updatedFields.push('surname');
    if (currentUser.middleName !== middleName) updatedFields.push('middleName');
    if (currentUser.extensionName !== extensionName) updatedFields.push('extensionName');
    if (currentUser.sex !== sex) updatedFields.push('sex');
    if (currentUser.contactNumber !== contactNumber) updatedFields.push('contactNumber');
    if (currentUser.dateOfBirth !== dateOfBirth) updatedFields.push('dateOfBirth');
    if (currentUser.access !== access) updatedFields.push('access');
    if (currentUser.client_profile !== client_profile)
        updatedFields.push('client_profile');

    // Log the account update action
    const auditAction =
        currentUser.access !== access
            ? 'ACCOUNT_ROLE_CHANGE'
            : 'ACCOUNT_UPDATE';
    await auditLogger.log({
        adminId: req.user?.id, // Admin ID from auth middleware
        action: auditAction,
        targetType: 'Account',
        targetId: updatedUser.id,
        targetName: `${updatedUser.firstName} ${updatedUser.surname}`,
        details:
            auditAction === 'ACCOUNT_ROLE_CHANGE'
                ? `Changed role for ${updatedUser.firstName} ${updatedUser.surname} from ${currentUser.access} to ${access}`
                : `Updated account information for ${updatedUser.firstName} ${updatedUser.surname}`,
        metadata: {
            action:
                auditAction === 'ACCOUNT_ROLE_CHANGE'
                    ? 'role_changed'
                    : 'account_updated',
            targetUserId: updatedUser.id,
            updatedFields: updatedFields,
            previousRole: currentUser.access,
            newRole: access,
            isOwnProfile: req.user?.id === userId,
        },
        req: req,
    });

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
        if (
            !username ||
            !firstName ||
            !surname ||
            !sex ||
            !client_profile
        ) {
            return 'Required fields: username, firstName, surname, sex, and client_profile.';
        }

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

        // Contact number validation (if provided)
        if (contactNumber && contactNumber.trim()) {
            const contactRegex = /^09\d{9}$/;
            if (!contactRegex.test(contactNumber)) {
                return 'Invalid contact number format. Must start with 09 and be 11 digits long.';
            }
        }

        return true;
    } catch (error) {
        console.error('Server Error: filtering update details:', error);
        return 'Server error during validation.';
    }
}

export default setUserDetails;
