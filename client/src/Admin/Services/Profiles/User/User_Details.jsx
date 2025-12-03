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
            // Clean up data before sending - only include valid Account fields
            const cleanedUser = {
                firstName: updatedUser.firstName || null,
                middleName: updatedUser.middleName || null,
                surname: updatedUser.surname || null,
                extensionName: updatedUser.extensionName || null,
                sex: updatedUser.sex || null,
                dateOfBirth: updatedUser.dateOfBirth || null,
                contactNumber: updatedUser.contactNumber || null,
                email: updatedUser.email || null,
                username: updatedUser.username || null,
                client_profile: updatedUser.client_profile || null,
                access: updatedUser.access || 'User',
            };

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

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return null;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleChange = (key, value) => {
        // Input filtering for name fields
        if (['firstName', 'middleName', 'surname', 'extensionName'].includes(key)) {
            // Only allow letters, spaces, periods, and hyphens
            if (value && !/^[a-zA-Z\s.-]*$/.test(value)) {
                return; // Don't update if invalid characters
            }
        }

        // Input filtering for contact number
        if (key === 'contactNumber') {
            // Only allow digits
            if (value && !/^\d*$/.test(value)) {
                return; // Don't update if non-numeric
            }
            // Limit to 11 digits
            if (value && value.length > 11) {
                return;
            }
        }

        setEditedUser(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        // Validate contact number if provided
        if (editedUser.contactNumber) {
            if (editedUser.contactNumber.length !== 11) {
                setErrorModal({ open: true, message: 'Contact number must be exactly 11 digits' });
                return;
            }
            if (!/^\d{11}$/.test(editedUser.contactNumber)) {
                setErrorModal({ open: true, message: 'Contact number must contain only numbers' });
                return;
            }
            if (!editedUser.contactNumber.startsWith('09')) {
                setErrorModal({ open: true, message: 'Contact number must start with 09' });
                return;
            }
        }

        // Validate date of birth (must be at least 15 years old)
        if (editedUser.dateOfBirth) {
            const age = calculateAge(editedUser.dateOfBirth);
            if (age !== null && age < 15) {
                setErrorModal({ open: true, message: 'User must be at least 15 years old' });
                return;
            }
        }

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
                    <div className="space-y-2 relative">
                        <label className={`block text-xs font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>{label}</label>
                        <div className="relative">
                            <select
                                value={editValue || ''}
                                onChange={(e) => handleChange(fieldName, e.target.value)}
                                className={`appearance-none w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition pr-10 ${
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
                            <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </div>
                    </div>
                );
            } else {
                // Get validation attributes based on field
                let pattern, title, maxLength, inputMode, max;
                
                if (['firstName', 'middleName', 'surname', 'extensionName'].includes(fieldName)) {
                    pattern = '[a-zA-Z\\s.-]+';
                    title = `${label} can only contain letters, spaces, periods, and hyphens`;
                }
                
                if (fieldName === 'contactNumber') {
                    pattern = '09[0-9]{9}';
                    maxLength = '11';
                    inputMode = 'numeric';
                    title = 'Contact number must be exactly 11 digits starting with 09';
                }
                
                if (fieldName === 'dateOfBirth') {
                    const today = new Date();
                    const maxDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
                    max = maxDate.toISOString().split('T')[0];
                }
                
                return (
                    <div className="space-y-2">
                        <label className={`block text-xs font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>{label}</label>
                        <input
                            type={type}
                            value={editValue || ''}
                            onChange={(e) => handleChange(fieldName, e.target.value)}
                            pattern={pattern}
                            title={title}
                            maxLength={maxLength}
                            inputMode={inputMode}
                            max={max}
                            className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            autoComplete="off"
                        />
                        {fieldName === 'dateOfBirth' && editValue && (
                            <p className={`text-xs mt-1 ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                                Age: {calculateAge(editValue)} years old
                            </p>
                        )}
                    </div>
                );
            }
        } else {
            // Display mode
            let displayValue = value;
            
            if (type === 'date' && value) {
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
            {/* User Profile Header */}
            <div className={`text-white py-3 rounded-lg shadow-md mb-3 ${
                isDark 
                    ? 'bg-gradient-to-r from-green-700 via-green-800 to-green-900' 
                    : 'bg-gradient-to-r from-green-600 via-green-700 to-green-800'
            }`}>
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full p-0.5 shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                            <img
                                src={userDetail?.picture || `/api/account/all/picture/${userDetail?.id}?refresh=${new Date().getTime()}`}
                                alt={`${userDetail?.username}'s profile`}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold mb-0.5 text-white">
                                {userDetail?.firstName} {userDetail?.middleName ? userDetail.middleName + ' ' : ''}{userDetail?.surname}
                                {userDetail?.extensionName ? ' ' + userDetail.extensionName : ''}
                            </h1>
                            <div className="flex flex-col">
                                <span className="text-xs text-white">@{userDetail?.username}</span>
                                <span className="text-xs text-white">{userDetail?.email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold shadow-md border ${
                            userDetail?.access === 'Super Admin'
                                ? 'bg-red-600 text-white border-red-500'
                                : userDetail?.access === 'Admin'
                                ? 'bg-blue-600 text-white border-blue-500'
                                : 'bg-green-600 text-white border-green-500'
                        }`}>
                            {userDetail?.access || 'User'}
                        </span>
                        <p className="text-xs text-white mt-0.5 font-medium">ID: {userDetail?.id}</p>
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
                            { id: 'personal', name: 'Personal Information', icon: 'fa-user' },
                            { id: 'system', name: 'System Information', icon: 'fa-cog' }
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
                            <div className="grid grid-cols-1 gap-8">
                                <div className="grid grid-cols-4 gap-4">
                                    {renderField('First Name', userDetail?.firstName, 'firstName')}
                                    {renderField('Middle Name', userDetail?.middleName, 'middleName')}
                                    {renderField('Surname', userDetail?.surname, 'surname')}
                                    {renderField('Extension Name', userDetail?.extensionName, 'extensionName')}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {renderField('Username', userDetail?.username, 'username')}
                                    {renderField('Email Address', userDetail?.email, 'email', 'email')}
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {renderField('Sex', userDetail?.sex, 'sex')}
                                    {renderField('Date of Birth', userDetail?.dateOfBirth, 'dateOfBirth', 'date')}
                                    {renderField('Contact Number', userDetail?.contactNumber, 'contactNumber', 'tel')}
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {renderField('Client Profile', userDetail?.client_profile, 'client_profile')}
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
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {renderField('Access Level', userDetail?.access, 'access')}
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
            {/* Form Content */}
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
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
                                { id: 'personal', name: 'Personal Information', icon: 'fa-user' },
                                { id: 'system', name: 'System Information', icon: 'fa-cog' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
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
                                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Personal Information</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-8">
                                    <div className="grid grid-cols-4 gap-4">
                                        {renderField('First Name', editedUser?.firstName, 'firstName')}
                                        {renderField('Middle Name', editedUser?.middleName, 'middleName')}
                                        {renderField('Surname', editedUser?.surname, 'surname')}
                                        {renderField('Extension Name', editedUser?.extensionName, 'extensionName', 'select', [
                                            { value: '', label: 'None' },
                                            { value: 'Jr.', label: 'Jr.' },
                                            { value: 'Sr.', label: 'Sr.' },
                                            { value: 'II', label: 'II' },
                                            { value: 'III', label: 'III' },
                                            { value: 'IV', label: 'IV' },
                                            { value: 'V', label: 'V' }
                                        ])}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField('Username', editedUser?.username, 'username')}
                                        {renderField('Email Address', editedUser?.email, 'email', 'email')}
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {renderField('Sex', editedUser?.sex, 'sex', 'select', [
                                            { value: '', label: 'Select Sex' },
                                            { value: 'Male', label: 'Male' },
                                            { value: 'Female', label: 'Female' }
                                        ])}
                                        {renderField('Date of Birth', editedUser?.dateOfBirth, 'dateOfBirth', 'date')}
                                        {renderField('Contact Number', editedUser?.contactNumber, 'contactNumber', 'tel')}
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {renderField('Client Profile', editedUser?.client_profile, 'client_profile', 'select', [
                                            { value: '', label: 'Select Profile' },
                                            { value: 'Fishfolk', label: 'Fishfolk' },
                                            { value: 'Rural Based Org', label: 'Rural Based Organization' },
                                            { value: 'Student', label: 'Student' },
                                            { value: 'Agricultural/Fisheries Technician', label: 'Agricultural/Fisheries Technician' },
                                            { value: 'Youth', label: 'Youth' },
                                            { value: 'Women', label: 'Women' },
                                            { value: "Gov't Employee", label: 'Government Employee' },
                                            { value: 'PWD', label: 'Person with Disability' },
                                            { value: 'Indigenous People', label: 'Indigenous People' },
                                            { value: 'Other', label: 'Other' }
                                        ])}
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
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {renderField('Access Level', editedUser?.access, 'access', 'select', [
                                            { value: 'User', label: 'User' },
                                            { value: 'Admin', label: 'Admin' },
                                        ])}
                                        <div className="space-y-2">
                                            <label className={`block text-xs font-medium ${
                                                isDark ? 'text-gray-300' : 'text-gray-600'
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
                                        <div className="space-y-2">
                                            <label className={`block text-xs font-medium ${
                                                isDark ? 'text-gray-300' : 'text-gray-600'
                                            }`}>Last Updated</label>
                                            <div className={`border rounded-lg px-3 py-2 text-sm ${
                                                isDark 
                                                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                                    : 'bg-gray-100 border-gray-300 text-gray-600'
                                            }`}>
                                                {editedUser?.updatedAt ? new Date(editedUser?.updatedAt).toLocaleDateString('en-US', { 
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
                {/* Action Buttons at the bottom */}
                <div className="flex justify-end gap-3 mt-8">
                    <button
                        type="submit"
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
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
                    >
                        <i className="fa-solid fa-times mr-2"></i>
                        Cancel
                    </button>
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
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
