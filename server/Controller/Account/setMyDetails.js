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
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                
                // Personal Details
                religion,
                otherReligionSpecify,
                civilStatus,
                spouseName,
                
                // Household Information
                femaleHouseholdMembers,
                maleHouseholdMembers,
                isHouseholdHead: isHouseholdHead === 'true' || isHouseholdHead === true,
                householdHeadName,
                relationshipToHead,
                
                // Government ID Information
                hasGovId: hasGovId === 'true' || hasGovId === true,
                govIdType,
                govIdNumber,
                
                // Education
                education,
                
                // PWD Information
                isPWD: isPWD === 'true' || isPWD === true,
                disabilityType,
                
                // Livelihood Information
                livelihoodProfile: Array.isArray(livelihoodProfile) ? livelihoodProfile : (livelihoodProfile ? [livelihoodProfile] : []),
                farmingActivities: Array.isArray(farmingActivities) ? farmingActivities : (farmingActivities ? [farmingActivities] : []),
                fishingActivities: Array.isArray(fishingActivities) ? fishingActivities : (fishingActivities ? [fishingActivities] : []),
                farmworkActivities: Array.isArray(farmworkActivities) ? farmworkActivities : (farmworkActivities ? [farmworkActivities] : []),
                youthActivities: Array.isArray(youthActivities) ? youthActivities : (youthActivities ? [youthActivities] : []),
                otherCropsSpecify,
                livestockSpecify,
                fishingOthersSpecify,
                farmworkOthersSpecify,
                youthOthersSpecify,
                
                // Income Information
                grossAnnualIncome,
                incomeSource,
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
        res.status(500).json({ message: 'Internal server error while updating profile.' });
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

        return true;
    } 
    catch (error) {
        console.error('Server Error: filtering update details:', error);
        return 'Server error during validation.';
    }
}

export default setMyDetails;
