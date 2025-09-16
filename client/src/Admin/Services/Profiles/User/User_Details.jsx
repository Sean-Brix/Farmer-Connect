import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useTheme } from '../../../../contexts/ThemeContext';

export default function User_Details({ user, isEdit, refetchRow}) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(isEdit);
    const [activeTab, setActiveTab] = useState('personal');
    const [editedUser, setEditedUser] = useState({});
    const [errorModal, setErrorModal] = useState({ open: false, message: '' });
    const [confirmModal, setConfirmModal] = useState({ open: false, onConfirm: null });

    const { data: userDetail, refetch: refetchDetails } = useQuery({
        queryKey: ['userDetails', user.id],
        queryFn: async () => {
            const response = await fetch(`/api/account/all/details/${user.id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }

            // Format date fields
            if (data.dateOfBirth) {
                data.dateOfBirth = new Date(data.dateOfBirth).toISOString().split('T')[0];
            }

            return data;
        },
        initialData: { ...user },
        enabled: !!user?.id,
    });
    
    useEffect(() => {
        refetchDetails();
    }, [user.id, refetchDetails]);

    useEffect(() => {
        if (userDetail) {
            setEditedUser(userDetail);
        }
    }, [userDetail]);

    const updateUserDetails = useMutation({
        mutationFn: async (updatedUser) => {
            // Clean up data before sending
            const cleanedUser = { ...updatedUser };
            
            // Convert empty strings to null for optional fields
            Object.keys(cleanedUser).forEach(key => {
                if (cleanedUser[key] === '') {
                    cleanedUser[key] = null;
                }
            });

            // Handle boolean fields
            if (typeof cleanedUser.isHouseholdHead === 'string') {
                cleanedUser.isHouseholdHead = cleanedUser.isHouseholdHead === 'true';
            }
            if (typeof cleanedUser.hasGovId === 'string') {
                cleanedUser.hasGovId = cleanedUser.hasGovId === 'true';
            }
            if (typeof cleanedUser.isPWD === 'string') {
                cleanedUser.isPWD = cleanedUser.isPWD === 'true';
            }

            const response = await fetch(
                `/api/account/all/details/${user.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cleanedUser),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 403) {
                    throw new Error('Unauthorized: Super Admin only');
                }
                throw new Error(data.message || 'Something Went Wrong');
            }

            setIsEditing(false);
            queryClient.invalidateQueries(['userDetails', user.id]);
            queryClient.invalidateQueries({ queryKey: ['accounts'], exact: false });

            return response.json();
        },

        onSuccess: (_, __, ___) => {
            queryClient.invalidateQueries(['userDetails', user.id]);
            queryClient.invalidateQueries({
                queryKey: ['accounts'],
                refetchType: 'active', 
            });

            if (typeof refetchRow === 'function') {
                refetchRow();
            }

            setIsEditing(false);
        },
        
        onError: (error) => {
            setErrorModal({ open: true, message: error.message });
            setIsEditing(false);
        },
    });

    const handleChange = (key, value) => {
        setEditedUser(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        setConfirmModal({
            open: true,
            onConfirm: async () => {
                setConfirmModal({ open: false, onConfirm: null });
                await updateUserDetails.mutateAsync(editedUser);
            }
        });
    };

    const handleCancel = () => {
        setEditedUser(userDetail);
        setIsEditing(false);
    };

    const renderField = (label, value, fieldName, type = 'text', options = null) => {
        if (isEditing) {
            const editValue = editedUser?.[fieldName];
            
            if (type === 'select' && options) {
                return (
                    <div className="space-y-2">
                        <label className={`block text-xs font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>{label}</label>
                        <select
                            value={editValue || ''}
                            onChange={(e) => handleChange(fieldName, e.target.value)}
                            className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            {options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            } else if (type === 'boolean') {
                return (
                    <div className="space-y-2">
                        <label className={`block text-xs font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>{label}</label>
                        <select
                            value={editValue === true ? 'true' : editValue === false ? 'false' : ''}
                            onChange={(e) => handleChange(fieldName, e.target.value === 'true')}
                            className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value="">Select</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                );
            } else {
                return (
                    <div className="space-y-2">
                        <label className={`block text-xs font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>{label}</label>
                        <input
                            type={type}
                            value={editValue || ''}
                            onChange={(e) => handleChange(fieldName, e.target.value)}
                            className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            autoComplete="off"
                        />
                    </div>
                );
            }
        } else {
            // Display mode
            let displayValue = value;
            
            if (type === 'boolean') {
                displayValue = value === true ? 'Yes' : value === false ? 'No' : '-';
            } else if (type === 'date' && value) {
                displayValue = new Date(value).toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                });
            } else if (!value) {
                displayValue = '-';
            }

            return (
                <div className="space-y-2">
                    <label className={`block text-xs font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>{label}</label>
                    <div className={`border rounded-lg px-3 py-2 text-sm ${
                        isDark 
                            ? 'bg-gray-700 border-gray-600 text-gray-200' 
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}>
                        {displayValue}
                    </div>
                </div>
            );
        }
    };

    const renderDisplayMode = () => (
        <div className="max-w-6xl mx-auto">
            {/* User Profile Header - Updated with green theme */}
            <div className={`text-white py-8 rounded-2xl shadow-lg mb-6 ${
                isDark 
                    ? 'bg-gradient-to-r from-green-700 via-green-800 to-green-900' 
                    : 'bg-gradient-to-r from-green-600 via-green-700 to-green-800'
            }`}>
                <div className="flex items-center justify-between px-8">
                    <div className="flex items-center gap-6">
                        <div className={`w-24 h-24 rounded-full p-1 shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                            <img
                                src={userDetail?.picture || `/api/account/all/picture/${userDetail?.id}?refresh=${new Date().getTime()}`}
                                alt={`${userDetail?.username}'s profile`}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2 text-white">
                                {userDetail?.firstName} {userDetail?.middleName ? userDetail.middleName + ' ' : ''}{userDetail?.surname}
                                {userDetail?.extensionName ? ' ' + userDetail.extensionName : ''}
                            </h1>
                            <div className="flex flex-col gap-1">
                                <span className="text-white">@{userDetail?.username}</span>
                                <span className="text-white">{userDetail?.email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`inline-flex px-6 py-3 rounded-full text-lg font-bold shadow-lg border-2 ${
                            userDetail?.access === 'Super_Admin'
                                ? 'bg-red-600 text-white border-red-500'
                                : userDetail?.access === 'Admin'
                                ? 'bg-blue-600 text-white border-blue-500'
                                : 'bg-green-600 text-white border-green-500'
                        }`}>
                            {userDetail?.access?.replace('_', ' ') || 'User'}
                        </span>
                        <p className="text-sm text-white mt-2 font-semibold">ID: {userDetail?.id}</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className={`rounded-2xl shadow-lg border overflow-hidden mb-6 ${
                isDark 
                    ? 'bg-gray-800 border-gray-600' 
                    : 'bg-white border-gray-200'
            }`}>
                <div className={`border-b ${
                    isDark ? 'border-gray-600' : 'border-gray-200'
                }`}>
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {[
                            { id: 'personal', name: 'Personal Info', icon: 'fa-user' },
                            { id: 'contact', name: 'Contact & Address', icon: 'fa-map-marker-alt' },
                            { id: 'family', name: 'Family & Background', icon: 'fa-users' },
                            { id: 'professional', name: 'Professional Info', icon: 'fa-briefcase' },
                            { id: 'government', name: 'Government & IDs', icon: 'fa-id-card' },
                            { id: 'system', name: 'System Info', icon: 'fa-cog' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? isDark 
                                            ? 'border-green-400 text-green-400 bg-green-900 bg-opacity-30' 
                                            : 'border-green-500 text-green-600 bg-green-50'
                                        : isDark 
                                            ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 rounded-t-lg`}
                            >
                                <i className={`fa-solid ${tab.icon}`}></i>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-8">
                    {/* Personal Information Tab */}
                    {activeTab === 'personal' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <i className="fa-solid fa-user text-green-600 text-xl"></i>
                                <h2 className={`text-2xl font-bold ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>Personal Information</h2>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {renderField('Username', userDetail?.username, 'username')}
                                {renderField('First Name', userDetail?.firstName, 'firstName')}
                                {renderField('Middle Name', userDetail?.middleName, 'middleName')}
                                {renderField('Surname', userDetail?.surname, 'surname')}
                                {renderField('Extension Name', userDetail?.extensionName, 'extensionName', 'select', [
                                    { value: 'Jr.', label: 'Jr.' },
                                    { value: 'Sr.', label: 'Sr.' },
                                    { value: 'II', label: 'II' },
                                    { value: 'III', label: 'III' },
                                    { value: 'IV', label: 'IV' },
                                    { value: 'V', label: 'V' }
                                ])}
                                {renderField('Sex', userDetail?.sex, 'sex', 'select', [
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' }
                                ])}
                                {renderField('Date of Birth', userDetail?.dateOfBirth, 'dateOfBirth', 'date')}
                                {renderField('Email Address', userDetail?.email, 'email', 'email')}
                            </div>
                        </div>
                    )}

                    {/* Contact & Address Tab */}
                    {activeTab === 'contact' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <i className="fa-solid fa-map-marker-alt text-green-600 text-xl"></i>
                                <h2 className={`text-2xl font-bold ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>Contact & Address Information</h2>
                            </div>
                            
                            <div>
                                <h3 className={`text-lg font-semibold mb-4 ${
                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                }`}>Contact Details</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {renderField('Mobile Number', userDetail?.mobileNumber, 'mobileNumber')}
                                    {renderField('Landline Number', userDetail?.landlineNumber, 'landlineNumber')}
                                </div>
                            </div>

                            <div>
                                <h3 className={`text-lg font-semibold mb-4 ${
                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                }`}>Address Details</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {renderField('House Number', userDetail?.houseNumber, 'houseNumber')}
                                    {renderField('Street', userDetail?.street, 'street')}
                                    {renderField('Barangay', userDetail?.barangay, 'barangay')}
                                    {renderField('Municipality', userDetail?.municipality, 'municipality')}
                                    {renderField('Province', userDetail?.province, 'province')}
                                    {renderField('Region', userDetail?.region, 'region')}
                                    {renderField('Complete Address', userDetail?.address, 'address')}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Family & Background Tab */}
                    {activeTab === 'family' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <i className="fa-solid fa-users text-green-600 text-xl"></i>
                                <h2 className={`text-2xl font-bold ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>Family & Background Information</h2>
                            </div>

                            <div>
                                <h3 className={`text-lg font-semibold mb-4 ${
                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                }`}>Birth Information</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {renderField('Birth Municipality', userDetail?.birthMunicipality, 'birthMunicipality')}
                                    {renderField('Birth Province', userDetail?.birthProvince, 'birthProvince')}
                                    {renderField('Birth Country', userDetail?.birthCountry, 'birthCountry')}
                                </div>
                            </div>

                            <div>
                                <h3 className={`text-lg font-semibold mb-4 ${
                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                }`}>Personal & Family Details</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {renderField('Religion', userDetail?.religion, 'religion')}
                                    {renderField('Other Religion (Specify)', userDetail?.otherReligionSpecify, 'otherReligionSpecify')}
                                    {renderField('Civil Status', userDetail?.civilStatus, 'civilStatus', 'select', [
                                        { value: 'Single', label: 'Single' },
                                        { value: 'Married', label: 'Married' },
                                        { value: 'Separated', label: 'Separated' },
                                        { value: 'Divorced', label: 'Divorced' },
                                        { value: 'Widowed', label: 'Widowed' },
                                        { value: 'Live-in', label: 'Live-in' }
                                    ])}
                                    {renderField('Spouse Name', userDetail?.spouseName, 'spouseName')}
                                </div>
                            </div>

                            <div>
                                <h3 className={`text-lg font-semibold mb-4 ${
                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                }`}>Household Information</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {renderField('Female Household Members', userDetail?.femaleHouseholdMembers, 'femaleHouseholdMembers', 'number')}
                                    {renderField('Male Household Members', userDetail?.maleHouseholdMembers, 'maleHouseholdMembers', 'number')}
                                    {renderField('Is Household Head', userDetail?.isHouseholdHead, 'isHouseholdHead', 'boolean')}
                                    {renderField('Household Head Name', userDetail?.householdHeadName, 'householdHeadName')}
                                    {renderField('Relationship to Head', userDetail?.relationshipToHead, 'relationshipToHead', 'select', [
                                        { value: 'Son', label: 'Son' },
                                        { value: 'Daughter', label: 'Daughter' },
                                        { value: 'Spouse', label: 'Spouse' },
                                        { value: 'Father', label: 'Father' },
                                        { value: 'Mother', label: 'Mother' },
                                        { value: 'Brother', label: 'Brother' },
                                        { value: 'Sister', label: 'Sister' },
                                        { value: 'Grandchild', label: 'Grandchild' },
                                        { value: 'Son-in-law', label: 'Son-in-law' },
                                        { value: 'Daughter-in-law', label: 'Daughter-in-law' },
                                        { value: 'Other relative', label: 'Other relative' }
                                    ])}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Professional Information Tab */}
                    {activeTab === 'professional' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <i className="fa-solid fa-briefcase text-green-600 text-xl"></i>
                                <h2 className={`text-2xl font-bold ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>Professional Information</h2>
                            </div>

                            <div>
                                <h3 className={`text-lg font-semibold mb-4 ${
                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                }`}>Education & Profile</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {renderField('Education Level', userDetail?.education, 'education', 'select', [
                                        { value: 'No_formal_education', label: 'No formal education' },
                                        { value: 'Kinder', label: 'Kinder' },
                                        { value: 'Elementary_level', label: 'Elementary level' },
                                        { value: 'Elementary_graduate', label: 'Elementary graduate' },
                                        { value: 'High_school_level', label: 'High school level' },
                                        { value: 'High_school_graduate', label: 'High school graduate' },
                                        { value: 'Senior_high_school_level', label: 'Senior high school level' },
                                        { value: 'Senior_high_school_graduate', label: 'Senior high school graduate' },
                                        { value: 'College_level', label: 'College level' },
                                        { value: 'College_graduate', label: 'College graduate' },
                                        { value: 'Post_graduate_studies', label: 'Post-graduate studies' },
                                        { value: 'Vocational_Technical', label: 'Vocational/Technical' }
                                    ])}
                                    {renderField('Client Profile', userDetail?.client_profile, 'client_profile', 'select', [
                                        { value: 'Fishfolk', label: 'Fishfolk' },
                                        { value: 'Rural_Based_Org', label: 'Rural Based Org' },
                                        { value: 'Student', label: 'Student' },
                                        { value: 'Agricultural_Fisheries_Technician', label: 'Agricultural/Fisheries Technician' },
                                        { value: 'Youth', label: 'Youth' },
                                        { value: 'Women', label: 'Women' },
                                        { value: 'Govt_Employee', label: 'Govt Employee' },
                                        { value: 'PWD', label: 'PWD' },
                                        { value: 'Indigenous_People', label: 'Indigenous People' },
                                        { value: 'Other', label: 'Other' }
                                    ])}
                                </div>
                            </div>

                            <div>
                                <h3 className={`text-lg font-semibold mb-4 ${
                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                }`}>Disability Information</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {renderField('Person with Disability (PWD)', userDetail?.isPWD, 'isPWD', 'boolean')}
                                    {renderField('Disability Type', userDetail?.disabilityType, 'disabilityType')}
                                </div>
                            </div>

                            <div>
                                <h3 className={`text-lg font-semibold mb-4 ${
                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                }`}>Income Information</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {renderField('Gross Annual Income', userDetail?.grossAnnualIncome, 'grossAnnualIncome')}
                                    {renderField('Income Source', userDetail?.incomeSource, 'incomeSource', 'select', [
                                        { value: 'farming', label: 'Farming' },
                                        { value: 'non_farming', label: 'Non-farming' }
                                    ])}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Government & IDs Tab */}
                    {activeTab === 'government' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <i className="fa-solid fa-id-card text-green-600 text-xl"></i>
                                <h2 className={`text-2xl font-bold ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>Government & ID Information</h2>
                            </div>

                            <div>
                                <h3 className={`text-lg font-semibold mb-4 ${
                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                }`}>Government Identification</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {renderField('Has Government ID', userDetail?.hasGovId, 'hasGovId', 'boolean')}
                                    {renderField('Government ID Type', userDetail?.govIdType, 'govIdType', 'select', [
                                        { value: 'National_ID', label: 'National ID' },
                                        { value: 'Drivers_License', label: 'Drivers License' },
                                        { value: 'Passport', label: 'Passport' },
                                        { value: 'Voters_ID', label: 'Voters ID' },
                                        { value: 'School_ID', label: 'School ID' },
                                        { value: 'SSS_ID', label: 'SSS ID' },
                                        { value: 'PhilHealth_ID', label: 'PhilHealth ID' },
                                        { value: 'TIN_ID', label: 'TIN ID' },
                                        { value: 'PRC_ID', label: 'PRC ID' },
                                        { value: 'Senior_Citizen_ID', label: 'Senior Citizen ID' },
                                        { value: 'PWD_ID', label: 'PWD ID' },
                                        { value: 'Other', label: 'Other' }
                                    ])}
                                    {renderField('Government ID Number', userDetail?.govIdNumber, 'govIdNumber')}
                                </div>
                            </div>
                        </div>
                    )}

                        {/* System Information Tab */}
                        {activeTab === 'system' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <i className="fa-solid fa-cog text-green-600 text-xl"></i>
                                    <h2 className={`text-2xl font-bold ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                    }`}>System Information</h2>
                                </div>                            <div>
                                <h3 className={`text-lg font-semibold mb-4 ${
                                    isDark ? 'text-gray-200' : 'text-gray-800'
                                }`}>Account Details</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {renderField('Access Level', userDetail?.access, 'access', 'select', [
                                        { value: 'User', label: 'User' },
                                        { value: 'Admin', label: 'Admin' },
                                        { value: 'Super_Admin', label: 'Super Admin' }
                                    ])}
                                    <div className="space-y-2">
                                        <label className={`block text-xs font-medium ${
                                            isDark ? 'text-gray-300' : 'text-gray-600'
                                        }`}>Created At</label>
                                        <div className={`border rounded-lg px-3 py-2 text-sm ${
                                            isDark 
                                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                                : 'bg-gray-50 border-gray-200 text-gray-900'
                                        }`}>
                                            {userDetail?.createdAt ? new Date(userDetail?.createdAt).toLocaleDateString('en-US', { 
                                                year: 'numeric', month: 'long', day: 'numeric', 
                                                hour: '2-digit', minute: '2-digit' 
                                            }) : '-'}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`block text-xs font-medium ${
                                            isDark ? 'text-gray-300' : 'text-gray-600'
                                        }`}>Last Updated</label>
                                        <div className={`border rounded-lg px-3 py-2 text-sm ${
                                            isDark 
                                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                                : 'bg-gray-50 border-gray-200 text-gray-900'
                                        }`}>
                                            {userDetail?.updatedAt ? new Date(userDetail?.updatedAt).toLocaleDateString('en-US', { 
                                                year: 'numeric', month: 'long', day: 'numeric', 
                                                hour: '2-digit', minute: '2-digit' 
                                            }) : '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            {!isEditing && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
                    >
                        <i className="fa-solid fa-edit mr-2"></i>
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    );

    const renderEditMode = () => (
        <div className="max-w-6xl mx-auto">
            {/* Buttons only in upper right */}
            <div className="flex justify-end gap-3 mb-6">
                <button
                    onClick={handleSave}
                    disabled={updateUserDetails.isLoading}
                    className={`px-6 py-2 font-semibold text-base rounded-lg transition-colors duration-200 disabled:opacity-50 shadow-md border ${isDark ? 'bg-green-600 text-white hover:bg-green-700 border-green-500' : 'bg-green-600 text-white hover:bg-green-700 border-green-500'}`}
                >
                    {updateUserDetails.isLoading ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                            Saving...
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-save mr-2"></i>
                            Save Changes
                        </>
                    )}
                </button>
                <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
                >
                    <i className="fa-solid fa-times mr-2"></i>
                    Cancel
                </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSave} className="space-y-6">
                {/* Tab Navigation */}
                <div className={`rounded-2xl shadow-lg border overflow-hidden ${
                    isDark 
                        ? 'bg-gray-800 border-gray-600' 
                        : 'bg-white border-gray-200'
                }`}>
                    <div className={`border-b ${
                        isDark ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {[
                                { id: 'personal', name: 'Personal Info', icon: 'fa-user' },
                                { id: 'contact', name: 'Contact & Address', icon: 'fa-map-marker-alt' },
                                { id: 'family', name: 'Family & Background', icon: 'fa-users' },
                                { id: 'professional', name: 'Professional Info', icon: 'fa-briefcase' },
                                { id: 'government', name: 'Government & IDs', icon: 'fa-id-card' },
                                { id: 'system', name: 'System Info', icon: 'fa-cog' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${
                                        activeTab === tab.id
                                            ? 'border-green-500 text-green-600 bg-green-50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 rounded-t-lg`}
                                >
                                    <i className={`fa-solid ${tab.icon}`}></i>
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-8">
                        {/* Personal Information Tab */}
                        {activeTab === 'personal' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <i className="fa-solid fa-user text-green-600 text-xl"></i>
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Personal Information</h2>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {renderField('Username', editedUser?.username, 'username')}
                                    {renderField('First Name', editedUser?.firstName, 'firstName')}
                                    {renderField('Middle Name', editedUser?.middleName, 'middleName')}
                                    {renderField('Surname', editedUser?.surname, 'surname')}
                                    {renderField('Extension Name', editedUser?.extensionName, 'extensionName', 'select', [
                                        { value: '', label: 'Select Extension' },
                                        { value: 'Jr.', label: 'Jr.' },
                                        { value: 'Sr.', label: 'Sr.' },
                                        { value: 'II', label: 'II' },
                                        { value: 'III', label: 'III' },
                                        { value: 'IV', label: 'IV' },
                                        { value: 'V', label: 'V' }
                                    ])}
                                    {renderField('Sex', editedUser?.sex, 'sex', 'select', [
                                        { value: '', label: 'Select Sex' },
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' },
                                        { value: 'Other', label: 'Other' }
                                    ])}
                                    {renderField('Date of Birth', editedUser?.dateOfBirth, 'dateOfBirth', 'date')}
                                    {renderField('Email Address', editedUser?.email, 'email', 'email')}
                                </div>
                            </div>
                        )}

                        {/* Contact & Address Tab */}
                        {activeTab === 'contact' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <i className="fa-solid fa-map-marker-alt text-green-600 text-xl"></i>
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact & Address Information</h2>
                                </div>
                                
                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${
                                        isDark ? 'text-gray-200' : 'text-gray-800'
                                    }`}>Contact Details</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {renderField('Mobile Number', editedUser?.mobileNumber, 'mobileNumber')}
                                        {renderField('Landline Number', editedUser?.landlineNumber, 'landlineNumber')}
                                    </div>
                                </div>

                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${
                                        isDark ? 'text-gray-200' : 'text-gray-800'
                                    }`}>Address Details</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {renderField('House Number', editedUser?.houseNumber, 'houseNumber')}
                                        {renderField('Street', editedUser?.street, 'street')}
                                        {renderField('Barangay', editedUser?.barangay, 'barangay')}
                                        {renderField('Municipality', editedUser?.municipality, 'municipality')}
                                        {renderField('Province', editedUser?.province, 'province')}
                                        {renderField('Region', editedUser?.region, 'region')}
                                        {renderField('Complete Address', editedUser?.address, 'address')}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Family & Background Tab */}
                        {activeTab === 'family' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <i className="fa-solid fa-users text-green-600 text-xl"></i>
                                    <h2 className={`text-2xl font-bold ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                    }`}>Family & Background Information</h2>
                                </div>

                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${
                                        isDark ? 'text-gray-200' : 'text-gray-800'
                                    }`}>Birth Information</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {renderField('Birth Municipality', editedUser?.birthMunicipality, 'birthMunicipality')}
                                        {renderField('Birth Province', editedUser?.birthProvince, 'birthProvince')}
                                        {renderField('Birth Country', editedUser?.birthCountry, 'birthCountry')}
                                    </div>
                                </div>

                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${
                                        isDark ? 'text-gray-200' : 'text-gray-800'
                                    }`}>Personal & Family Details</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {renderField('Religion', editedUser?.religion, 'religion')}
                                        {renderField('Other Religion (Specify)', editedUser?.otherReligionSpecify, 'otherReligionSpecify')}
                                        {renderField('Civil Status', editedUser?.civilStatus, 'civilStatus', 'select', [
                                            { value: '', label: 'Select Civil Status' },
                                            { value: 'Single', label: 'Single' },
                                            { value: 'Married', label: 'Married' },
                                            { value: 'Separated', label: 'Separated' },
                                            { value: 'Divorced', label: 'Divorced' },
                                            { value: 'Widowed', label: 'Widowed' },
                                            { value: 'Live-in', label: 'Live-in' }
                                        ])}
                                        {renderField('Spouse Name', editedUser?.spouseName, 'spouseName')}
                                    </div>
                                </div>

                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${
                                        isDark ? 'text-gray-200' : 'text-gray-800'
                                    }`}>Household Information</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {renderField('Female Household Members', editedUser?.femaleHouseholdMembers, 'femaleHouseholdMembers', 'number')}
                                        {renderField('Male Household Members', editedUser?.maleHouseholdMembers, 'maleHouseholdMembers', 'number')}
                                        {renderField('Is Household Head', editedUser?.isHouseholdHead, 'isHouseholdHead', 'boolean')}
                                        {renderField('Household Head Name', editedUser?.householdHeadName, 'householdHeadName')}
                                        {renderField('Relationship to Head', editedUser?.relationshipToHead, 'relationshipToHead', 'select', [
                                            { value: '', label: 'Select Relationship' },
                                            { value: 'Son', label: 'Son' },
                                            { value: 'Daughter', label: 'Daughter' },
                                            { value: 'Spouse', label: 'Spouse' },
                                            { value: 'Father', label: 'Father' },
                                            { value: 'Mother', label: 'Mother' },
                                            { value: 'Brother', label: 'Brother' },
                                            { value: 'Sister', label: 'Sister' },
                                            { value: 'Grandchild', label: 'Grandchild' },
                                            { value: 'Son-in-law', label: 'Son-in-law' },
                                            { value: 'Daughter-in-law', label: 'Daughter-in-law' },
                                            { value: 'Other relative', label: 'Other relative' }
                                        ])}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Professional Information Tab */}
                        {activeTab === 'professional' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <i className="fa-solid fa-briefcase text-green-600 text-xl"></i>
                                    <h2 className={`text-2xl font-bold ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                    }`}>Professional Information</h2>
                                </div>

                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${
                                        isDark ? 'text-gray-200' : 'text-gray-800'
                                    }`}>Education & Profile</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {renderField('Education Level', editedUser?.education, 'education', 'select', [
                                            { value: '', label: 'Select Education Level' },
                                            { value: 'No_formal_education', label: 'No formal education' },
                                            { value: 'Kinder', label: 'Kinder' },
                                            { value: 'Elementary_level', label: 'Elementary level' },
                                            { value: 'Elementary_graduate', label: 'Elementary graduate' },
                                            { value: 'High_school_level', label: 'High school level' },
                                            { value: 'High_school_graduate', label: 'High school graduate' },
                                            { value: 'Senior_high_school_level', label: 'Senior high school level' },
                                            { value: 'Senior_high_school_graduate', label: 'Senior high school graduate' },
                                            { value: 'College_level', label: 'College level' },
                                            { value: 'College_graduate', label: 'College graduate' },
                                            { value: 'Post_graduate_studies', label: 'Post-graduate studies' },
                                            { value: 'Vocational_Technical', label: 'Vocational/Technical' }
                                        ])}
                                        {renderField('Client Profile', editedUser?.client_profile, 'client_profile', 'select', [
                                            { value: '', label: 'Select Client Profile' },
                                            { value: 'Fishfolk', label: 'Fishfolk' },
                                            { value: 'Rural_Based_Org', label: 'Rural Based Org' },
                                            { value: 'Student', label: 'Student' },
                                            { value: 'Agricultural_Fisheries_Technician', label: 'Agricultural/Fisheries Technician' },
                                            { value: 'Youth', label: 'Youth' },
                                            { value: 'Women', label: 'Women' },
                                            { value: 'Govt_Employee', label: 'Govt Employee' },
                                            { value: 'PWD', label: 'PWD' },
                                            { value: 'Indigenous_People', label: 'Indigenous People' },
                                            { value: 'Other', label: 'Other' }
                                        ])}
                                    </div>
                                </div>

                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${
                                        isDark ? 'text-gray-200' : 'text-gray-800'
                                    }`}>Disability Information</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {renderField('Person with Disability (PWD)', editedUser?.isPWD, 'isPWD', 'boolean')}
                                        {renderField('Disability Type', editedUser?.disabilityType, 'disabilityType')}
                                    </div>
                                </div>

                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${
                                        isDark ? 'text-gray-200' : 'text-gray-800'
                                    }`}>Income Information</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {renderField('Gross Annual Income', editedUser?.grossAnnualIncome, 'grossAnnualIncome')}
                                        {renderField('Income Source', editedUser?.incomeSource, 'incomeSource', 'select', [
                                            { value: '', label: 'Select Income Source' },
                                            { value: 'farming', label: 'Farming' },
                                            { value: 'non_farming', label: 'Non-farming' }
                                        ])}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Government & IDs Tab */}
                        {activeTab === 'government' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <i className="fa-solid fa-id-card text-green-600 text-xl"></i>
                                    <h2 className={`text-2xl font-bold ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                    }`}>Government & ID Information</h2>
                                </div>

                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${
                                        isDark ? 'text-gray-200' : 'text-gray-800'
                                    }`}>Government Identification</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {renderField('Has Government ID', editedUser?.hasGovId, 'hasGovId', 'boolean')}
                                        {renderField('Government ID Type', editedUser?.govIdType, 'govIdType', 'select', [
                                            { value: '', label: 'Select ID Type' },
                                            { value: 'National_ID', label: 'National ID' },
                                            { value: 'Drivers_License', label: 'Drivers License' },
                                            { value: 'Passport', label: 'Passport' },
                                            { value: 'Voters_ID', label: 'Voters ID' },
                                            { value: 'School_ID', label: 'School ID' },
                                            { value: 'SSS_ID', label: 'SSS ID' },
                                            { value: 'PhilHealth_ID', label: 'PhilHealth ID' },
                                            { value: 'TIN_ID', label: 'TIN ID' },
                                            { value: 'PRC_ID', label: 'PRC ID' },
                                            { value: 'Senior_Citizen_ID', label: 'Senior Citizen ID' },
                                            { value: 'PWD_ID', label: 'PWD ID' },
                                            { value: 'Other', label: 'Other' }
                                        ])}
                                        {renderField('Government ID Number', editedUser?.govIdNumber, 'govIdNumber')}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* System Information Tab */}
                        {activeTab === 'system' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <i className="fa-solid fa-cog text-green-600 text-xl"></i>
                                    <h2 className={`text-2xl font-bold ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                    }`}>System Information</h2>
                                </div>

                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${
                                        isDark ? 'text-gray-200' : 'text-gray-800'
                                    }`}>Account Details</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {renderField('Access Level', editedUser?.access, 'access', 'select', [
                                            { value: 'User', label: 'User' },
                                            { value: 'Admin', label: 'Admin' },
                                            { value: 'Super_Admin', label: 'Super Admin' }
                                        ])}
                                        <div className="space-y-2">
                                            <label className={`block text-sm font-medium ${
                                                isDark ? 'text-gray-300' : 'text-gray-700'
                                            }`}>Created At</label>
                                            <div className={`border rounded-lg px-3 py-2 text-sm ${
                                                isDark 
                                                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                                    : 'bg-gray-100 border-gray-300 text-gray-600'
                                            }`}>
                                                {editedUser?.createdAt ? new Date(editedUser?.createdAt).toLocaleDateString('en-US', { 
                                                    year: 'numeric', month: 'long', day: 'numeric', 
                                                    hour: '2-digit', minute: '2-digit' 
                                                }) : '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );

    return (
        <>
            {isEditing ? renderEditMode() : renderDisplayMode()}
            {errorModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ">
                    <div className={`rounded-xl shadow-xl p-8 max-w-sm w-full text-center animate-fade-in ${
                        isDark 
                            ? 'bg-gray-800 border border-gray-700' 
                            : 'bg-white'
                    }`}>
                        <div className="text-red-600 text-2xl mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Error</h3>
                        <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{errorModal.message}</p>
                        <button
                            onClick={() => setErrorModal({ open: false, message: '' })}
                            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-green-500 hover:to-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {confirmModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ">
                    <div className={`rounded-xl shadow-xl p-8 max-w-sm w-full text-center animate-fade-in ${
                        isDark 
                            ? 'bg-gray-800 border border-gray-700' 
                            : 'bg-white'
                    }`}>
                        <div className="text-green-600 text-2xl mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 6h.01M6.938 20h10.124c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Confirm Save</h3>
                        <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Are you sure you want to save these changes?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    if (confirmModal.onConfirm) confirmModal.onConfirm();
                                }}
                                className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-green-500 hover:to-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                            >
                                Yes, Save
                            </button>
                            <button
                                onClick={() => setConfirmModal({ open: false, onConfirm: null })}
                                className={`px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                                    isDark 
                                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800' 
                                        : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 hover:from-gray-400 hover:to-gray-500'
                                }`}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
