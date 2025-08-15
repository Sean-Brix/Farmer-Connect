import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function setMyDetails(req, res) {
    const userId = req.user.id;

    const {
        username,
        email,
        firstName,
        surname,
        middleName,
        extensionName,
        sex,
        client_profile,
        
        // Contact Information
        mobileNumber,
        landlineNumber,
        
        // Address Information
        street,
        barangay,
        municipality,
        province,
        region,
        houseNumber,
        address,
        
        // Birth Information
        birthMunicipality,
        birthProvince,
        birthCountry,
        dateOfBirth,
        
        // Personal Details
        religion,
        otherReligionSpecify,
        civilStatus,
        spouseName,
        
        // Household Information
        femaleHouseholdMembers,
        maleHouseholdMembers,
        isHouseholdHead,
        householdHeadName,
        relationshipToHead,
        
        // Government ID Information
        hasGovId,
        govIdType,
        govIdNumber,
        
        // Education
        education,
        
        // PWD Information
        isPWD,
        disabilityType,
        
        // Livelihood Information
        livelihoodProfile,
        farmingActivities,
        fishingActivities,
        farmworkActivities,
        youthActivities,
        otherCropsSpecify,
        livestockSpecify,
        fishingOthersSpecify,
        farmworkOthersSpecify,
        youthOthersSpecify,
        
        // Income Information
        grossAnnualIncome,
        incomeSource,
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
                email,
                firstName,
                surname,
                middleName: middleName || null,
                extensionName: extensionName || null,
                sex,
                client_profile,
                
                // Contact Information
                mobileNumber,
                landlineNumber: landlineNumber || null,
                
                // Address Information
                street: street || null,
                barangay: barangay || null,
                municipality: municipality || null,
                province: province || null,
                region: region || null,
                houseNumber: houseNumber || null,
                address: address || null,
                
                // Birth Information
                birthMunicipality: birthMunicipality || null,
                birthProvince: birthProvince || null,
                birthCountry: birthCountry || null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                
                // Personal Details
                religion: religion || null,
                otherReligionSpecify: otherReligionSpecify || null,
                civilStatus: civilStatus || null,
                spouseName: spouseName || null,
                
                // Household Information
                femaleHouseholdMembers: femaleHouseholdMembers || null,
                maleHouseholdMembers: maleHouseholdMembers || null,
                isHouseholdHead: isHouseholdHead === 'true' || isHouseholdHead === true,
                householdHeadName: householdHeadName || null,
                relationshipToHead: relationshipToHead || null,
                
                // Government ID Information
                hasGovId: hasGovId === 'true' || hasGovId === true,
                govIdType: govIdType || null,
                govIdNumber: govIdNumber || null,
                
                // Education
                education: education || null,
                
                // PWD Information
                isPWD: isPWD === 'true' || isPWD === true,
                disabilityType: disabilityType || null,
                
                // Livelihood Information
                livelihoodProfile: Array.isArray(livelihoodProfile) ? livelihoodProfile : (livelihoodProfile ? [livelihoodProfile] : []),
                farmingActivities: Array.isArray(farmingActivities) ? farmingActivities : (farmingActivities ? [farmingActivities] : []),
                fishingActivities: Array.isArray(fishingActivities) ? fishingActivities : (fishingActivities ? [fishingActivities] : []),
                farmworkActivities: Array.isArray(farmworkActivities) ? farmworkActivities : (farmworkActivities ? [farmworkActivities] : []),
                youthActivities: Array.isArray(youthActivities) ? youthActivities : (youthActivities ? [youthActivities] : []),
                otherCropsSpecify: otherCropsSpecify || null,
                livestockSpecify: livestockSpecify || null,
                fishingOthersSpecify: fishingOthersSpecify || null,
                farmworkOthersSpecify: farmworkOthersSpecify || null,
                youthOthersSpecify: youthOthersSpecify || null,
                
                // Income Information
                grossAnnualIncome: grossAnnualIncome || null,
                incomeSource: incomeSource || null,
            },
        });

        // Exclude sensitive fields from the response
        updatedUser.password = undefined;
        updatedUser.picture = undefined;
        updatedUser.mimeType = undefined;

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

    const sex_option = ['Male', 'Female', 'Other'];
    const education_option = [
        'No_formal_education',
        'Kinder',
        'Elementary_level',
        'Elementary_graduate',
        'High_school_level',
        'High_school_graduate',
        'Senior_high_school_level',
        'Senior_high_school_graduate',
        'College_level',
        'College_graduate',
        'Post_graduate_studies',
        'Vocational_Technical'
    ];

    const {
        username,
        email,
        firstName,
        surname,
        sex,
        client_profile,
        mobileNumber,
        landlineNumber,
        isHouseholdHead,
        householdHeadName,
        relationshipToHead,
    } = data;

    try {
        // Required fields validation
        if (!username || !email || !firstName || !surname || !sex || !client_profile || !mobileNumber) {
            return 'Required fields: username, email, firstName, surname, sex, client_profile, and mobileNumber.';
        }

        // Validate enum values
        if (!sex_option.includes(sex)) {
            return 'Invalid sex value.';
        }
        if (!ClientProfiles_option.includes(client_profile)) {
            return 'Invalid client profile.';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Invalid email format.';
        }

        // Mobile number validation (Philippine format)
        const mobileRegex = /^09\d{9}$/;
        if (!mobileRegex.test(mobileNumber)) {
            return 'Invalid mobile number format. Must start with 09 and be 11 digits long.';
        }

        // Landline validation (if provided)
        if (landlineNumber && landlineNumber.trim()) {
            const landlineRegex = /^\d{3}-\d{3}-\d{4}$/;
            if (!landlineRegex.test(landlineNumber)) {
                return 'Invalid landline number format. Must be in XXX-XXX-XXXX format.';
            }
        }

        // Household validation logic
        const isHead = isHouseholdHead === 'true' || isHouseholdHead === true;
        
        if (!isHead) {
            // If not household head, check if required fields are provided when they should be
            if (householdHeadName && householdHeadName.trim() && (!relationshipToHead || !relationshipToHead.trim())) {
                return 'Relationship to household head is required when household head name is provided.';
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
