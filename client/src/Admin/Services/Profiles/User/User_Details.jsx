import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function User_Details({ user, isEdit, refetchRow}) {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(isEdit);
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

            if (!data.middleName) {
                data.middleName = 'none';
                data.initial = '';
            } else {
                data.initial = ' ' + data.middleName[0] + '.';
            }

            return data;
        },
        initialData: { ...user },
        enabled: !!user?.id,
    });
    useEffect(() => {
        refetchDetails();
    }, [user.id, refetchDetails]);

    const updateUserDetails = useMutation({
        mutationFn: async (updatedUser) => {
            if (updatedUser.middleName === 'none') {
                updatedUser.middleName = null;
                updatedUser.initial = '';
            }
            const response = await fetch(
                `/api/account/all/details/${user.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUser),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 403) {
                    throw new Error('Unauthorize: Super Admin only');
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
        queryClient.setQueryData(['userDetails', user.id], (oldData) => ({
            ...oldData,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        setConfirmModal({
            open: true,
            onConfirm: async () => {
                setConfirmModal({ open: false, onConfirm: null });
                await updateUserDetails.mutateAsync(
                    queryClient.getQueryData(['userDetails', user.id])
                );
            }
        });
    };
    const handleCancel = () => {
        queryClient.setQueryData(['userDetails', user.id], { ...userDetail });
        setIsEditing(false);
    };

    const renderDisplayMode = () => (
        <div className="max-w-5xl mx-auto">
            {/* User Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={userDetail?.picture || `/api/account/all/picture/${userDetail?.id}?refresh=${new Date().getTime()}`}
                            alt={`${userDetail?.username}'s profile`}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                        />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{userDetail?.firstName} {userDetail?.lastName}</h3>
                            <p className="text-gray-600">@{userDetail?.username}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            userDetail?.access === 'Super Admin'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : userDetail?.access === 'Admin'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                            {userDetail?.access || 'User'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">ID: {userDetail?.id}</p>
                    </div>
                </div>
            </div>

            {/* User Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-gray-600 rounded-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">{userDetail?.firstName || '-'}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Middle Name</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">{userDetail?.middleName || '-'}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">{userDetail?.lastName || '-'}</div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">{userDetail?.gender || '-'}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">{userDetail?.address || '-'}</div>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-gray-600 rounded-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">{userDetail?.email || '-'}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Telephone No</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">{userDetail?.telephone_no || '-'}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Cellphone No</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">{userDetail?.cellphone_no || '-'}</div>
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-gray-600 rounded-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Professional Information</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Client Profile</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">{userDetail?.client_profile || '-'}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Occupation</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">{userDetail?.occupation || '-'}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Position</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">{userDetail?.position || '-'}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Institution</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">{userDetail?.institution || '-'}</div>
                        </div>
                    </div>
                </div>

                {/* System Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-gray-600 rounded-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">System Information</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Created At</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">
                                {userDetail?.createdAt ? new Date(userDetail?.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Updated At</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">
                                {userDetail?.updatedAt ? new Date(userDetail?.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEditMode = () => (
        <div className="max-w-5xl mx-auto">
            {/* User Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={userDetail?.picture || `/api/account/all/picture/${userDetail?.id}?refresh=${new Date().getTime()}`}
                            alt={`${userDetail?.username}'s profile`}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                        />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{userDetail?.firstName} {userDetail?.lastName}</h3>
                            <p className="text-gray-600">@{userDetail?.username}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            userDetail?.access === 'Super Admin'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : userDetail?.access === 'Admin'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                            {userDetail?.access || 'User'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">ID: {userDetail?.id}</p>
                    </div>
                </div>
            </div>

            {/* Edit Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-gray-600 rounded-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Username</label>
                            <input
                                type="text"
                                value={userDetail?.username || ''}
                                onChange={(e) => handleChange('username', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                autoComplete="off"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                                <input
                                    type="text"
                                    value={userDetail?.firstName || ''}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                    className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Middle Name</label>
                                <input
                                    type="text"
                                    value={userDetail?.middleName || ''}
                                    onChange={(e) => handleChange('middleName', e.target.value)}
                                    className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    value={userDetail?.lastName || ''}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                    className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                            <select
                                value={userDetail?.gender || ''}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                            <input
                                type="text"
                                value={userDetail?.address || ''}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Access Level</label>
                            <select
                                value={userDetail?.access || ''}
                                onChange={(e) => handleChange('access', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                            >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                                <option value="Super Admin">Super Admin</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-gray-600 rounded-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={userDetail?.email || ''}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Telephone No</label>
                            <input
                                type="text"
                                value={userDetail?.telephone_no || ''}
                                onChange={(e) => handleChange('telephone_no', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Cellphone No</label>
                            <input
                                type="text"
                                value={userDetail?.cellphone_no || ''}
                                onChange={(e) => handleChange('cellphone_no', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                autoComplete="off"
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-gray-600 rounded-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Professional Information</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Client Profile</label>
                            <select
                                value={userDetail?.client_profile || ''}
                                onChange={(e) => handleChange('client_profile', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                            >
                                <option value="">Select</option>
                                <option value="Fishfolk">Fishfolk</option>
                                <option value="Rural Based Org">Rural Based Org</option>
                                <option value="Farmer">Farmer</option>
                                <option value="Government Employee">Government Employee</option>
                                <option value="Private Sector">Private Sector</option>
                                <option value="Student">Student</option>
                                <option value="Agricultural/Fisheries Technician">Agricultural/Fisheries Technician</option>
                                <option value="Youth">Youth</option>
                                <option value="Women">Women</option>
                                <option value="Gov't Employee">Gov't Employee</option>
                                <option value="PWD">PWD</option>
                                <option value="Indigenous People">Indigenous People</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Occupation</label>
                            <input
                                type="text"
                                value={userDetail?.occupation || ''}
                                onChange={(e) => handleChange('occupation', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Position</label>
                            <input
                                type="text"
                                value={userDetail?.position || ''}
                                onChange={(e) => handleChange('position', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Institution</label>
                            <input
                                type="text"
                                value={userDetail?.institution || ''}
                                onChange={(e) => handleChange('institution', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                                autoComplete="off"
                            />
                        </div>
                    </div>
                </div>

                {/* System Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-gray-600 rounded-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">System Information</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Created At</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">
                                {userDetail?.createdAt ? new Date(userDetail?.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Updated At</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">
                                {userDetail?.updatedAt ? new Date(userDetail?.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
                <button
                    onClick={handleCancel}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-60"
                    disabled={updateUserDetails.isLoading}
                >
                    {updateUserDetails.isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {isEditing ? renderEditMode() : renderDisplayMode()}
            {errorModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center animate-fade-in">
                        <div className="text-red-600 text-2xl mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Error</h3>
                        <p className="text-gray-600 mb-4">{errorModal.message}</p>
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
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center animate-fade-in">
                        <div className="text-green-600 text-2xl mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 6h.01M6.938 20h10.124c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Save</h3>
                        <p className="text-gray-600 mb-4">Are you sure you want to save these changes?</p>
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
                                className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold shadow hover:from-gray-400 hover:to-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
