import { PrismaClient } from '../../prisma/generated/client.js';
import auditLogger from '../../Services/auditLogger.js';
const prisma = new PrismaClient();

async function setUserDetails(req, res) {
    const userId = req.params.id;

    let {
        username,
        email,
        firstName,
        lastName,
        middleName,
        access,
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
            email,
            firstName,
            lastName,
            middleName,
            gender,
            access,
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

    // Track what fields were updated for audit log
    const updatedFields = [];
    if (currentUser.username !== username) updatedFields.push('username');
    if (currentUser.email !== email) updatedFields.push('email');
    if (currentUser.firstName !== firstName) updatedFields.push('firstName');
    if (currentUser.lastName !== lastName) updatedFields.push('lastName');
    if (currentUser.middleName !== middleName) updatedFields.push('middleName');
    if (currentUser.access !== access) updatedFields.push('access');
    if (currentUser.gender !== gender) updatedFields.push('gender');
    if (currentUser.client_profile !== client_profile)
        updatedFields.push('client_profile');
    if (currentUser.cellphone_no !== cellphone_no)
        updatedFields.push('cellphone_no');
    if (currentUser.telephone_no !== telephone_no)
        updatedFields.push('telephone_no');
    if (currentUser.occupation !== occupation) updatedFields.push('occupation');
    if (currentUser.position !== position) updatedFields.push('position');
    if (currentUser.institution !== institution)
        updatedFields.push('institution');
    if (currentUser.address !== address) updatedFields.push('address');

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
        targetName: `${updatedUser.firstName} ${updatedUser.lastName}`,
        details:
            auditAction === 'ACCOUNT_ROLE_CHANGE'
                ? `Changed role for ${updatedUser.firstName} ${updatedUser.lastName} from ${currentUser.access} to ${access}`
                : `Updated account information for ${updatedUser.firstName} ${updatedUser.lastName}`,
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
        gender,
        client_profile,
        cellphone_no,
        telephone_no,
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
    } catch (error) {
        console.error('Server Error: filtering update details:', error);
        return 'Server error during validation.';
    }
}

export default setUserDetails;
