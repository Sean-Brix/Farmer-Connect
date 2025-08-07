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
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-green-200 p-8 relative animate-fade-in">
            <div className="flex flex-col items-center justify-center mb-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-green-800 tracking-tight mb-2 text-center uppercase">View User Details</h2>
                <span className="text-xs text-green-400 font-semibold bg-green-50 px-3 py-1 mb-4 rounded-full border border-green-200">ID: {userDetail?.id || ''}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Username</label>
                        <div className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900 font-medium">{userDetail?.username || ''}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Access</label>
                        <div className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900">{userDetail?.access || ''}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Gender</label>
                        <div className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900">{userDetail?.gender || ''}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Client Profile</label>
                        <div className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900">{userDetail?.client_profile || ''}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Occupation</label>
                        <div className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900">{userDetail?.occupation || ''}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Position</label>
                        <div className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900">{userDetail?.position || ''}</div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Full Name</label>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900" title="First Name">{userDetail?.firstName || ''}</div>
                            <div className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900" title="Middle Name">{userDetail?.middleName || ''}</div>
                            <div className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900" title="Last Name">{userDetail?.lastName || ''}</div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Address</label>
                        <div className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900">{userDetail?.address || ''}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Telephone No</label>
                        <div className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900">{userDetail?.telephone_no || ''}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Cellphone No</label>
                        <div className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900">{userDetail?.cellphone_no || ''}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Institution</label>
                        <div className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900">{userDetail?.institution || ''}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Email Address</label>
                        <div className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-green-900">{userDetail?.email || ''}</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                    <label className="block text-xs text-green-700 font-semibold mb-1">Created At</label>
                    <div className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700">
                        {userDetail?.createdAt ? new Date(userDetail?.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-green-700 font-semibold mb-1">Updated At</label>
                    <div className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700">
                        {userDetail?.updatedAt ? new Date(userDetail?.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEditMode = () => (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-green-200 p-4 sm:p-6 md:p-8 relative animate-fade-in">
            <div className="flex flex-col items-center justify-center mb-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-green-800 tracking-tight mb-2 text-center uppercase">Edit User Details</h2>
                <span className="text-xs text-green-400 font-semibold bg-green-50 px-3 py-1 rounded-full border mb-4 border-green-200">ID: {(userDetail?.id || '').toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Username</label>
                        <input
                            type="text"
                            value={userDetail?.username || ''}
                            onChange={(e) => handleChange('username', e.target.value)}
                            className="w-full bg-white border border-green-300 text-green-900 font-medium px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Access</label>
                        <select
                            value={userDetail?.access || ''}
                            onChange={(e) => handleChange('access', e.target.value)}
                            className="w-full bg-white border border-green-300 text-green-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            autoComplete="off"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Super Admin">Super Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Gender</label>
                        <select
                            value={userDetail?.gender || ''}
                            onChange={(e) => handleChange('gender', e.target.value)}
                            className="w-full bg-white border border-green-300 text-green-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            autoComplete="off"
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Client Profile</label>
                        <select
                            value={userDetail?.client_profile || ''}
                            onChange={(e) => handleChange('client_profile', e.target.value)}
                            className="w-full bg-white border border-green-300 text-green-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            autoComplete="off"
                        >
                            <option value="">Select</option>
                            <option value="Fishfolk">Fishfolk</option>
                            <option value="Rural Based Org">Rural Based Org</option>
                            <option value="Student">Student</option>
                            <option value="Agricultural/Fisheries Technician">Agricultural/Fisheries Technician</option>
                            <option value="Youth">Youth</option>
                            <option value="Women">Women</option>
                            <option value="Gov't Employee">Gov't Employee</option>
                            <option value="PWD">PWD</option>
                            <option value="Indigenous People">Indigenous People</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Occupation</label>
                        <input
                            type="text"
                            value={userDetail?.occupation || ''}
                            onChange={(e) => handleChange('occupation', e.target.value)}
                            className="w-full bg-white border border-green-300 text-green-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Position</label>
                        <input
                            type="text"
                            value={userDetail?.position || ''}
                            onChange={(e) => handleChange('position', e.target.value)}
                            className="w-full bg-white border border-green-300 text-green-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            autoComplete="off"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Full Name</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={userDetail?.firstName || ''}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                                placeholder="First Name"
                                className="flex-1 bg-white border border-green-300 text-green-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition min-w-0"
                                autoComplete="off"
                            />
                            <input
                                type="text"
                                value={userDetail?.middleName || ''}
                                onChange={(e) => handleChange('middleName', e.target.value)}
                                placeholder="Middle Name"
                                className="flex-1 bg-white border border-green-300 text-green-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition min-w-0"
                                autoComplete="off"
                            />
                            <input
                                type="text"
                                value={userDetail?.lastName || ''}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                placeholder="Last Name"
                                className="flex-1 bg-white border border-green-300 text-green-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition min-w-0"
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Address</label>
                        <input
                            type="text"
                            value={userDetail?.address || ''}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="w-full bg-white border border-green-300 text-green-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Telephone No</label>
                        <input
                            type="text"
                            value={userDetail?.telephone_no || ''}
                            onChange={(e) => handleChange('telephone_no', e.target.value)}
                            className="w-full bg-white border border-green-300 text-green-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Cellphone No</label>
                        <input
                            type="text"
                            value={userDetail?.cellphone_no || ''}
                            onChange={(e) => handleChange('cellphone_no', e.target.value)}
                            className="w-full bg-white border border-green-300 text-green-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Institution</label>
                        <input
                            type="text"
                            value={userDetail?.institution || ''}
                            onChange={(e) => handleChange('institution', e.target.value)}
                            className="w-full bg-white border border-green-300 text-green-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-green-700 font-semibold mb-1">Email Address</label>
                        <input
                            type="text"
                            value={userDetail?.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full bg-white border border-green-300 text-green-900 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8">
                <div>
                    <label className="block text-xs text-green-700 font-semibold mb-1">Created At</label>
                    <input
                        type="text"
                        value={userDetail?.createdAt ? new Date(userDetail?.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                        readOnly
                        className="w-full bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg"
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label className="block text-xs text-green-700 font-semibold mb-1">Updated At</label>
                    <input
                        type="text"
                        value={userDetail?.updatedAt ? new Date(userDetail?.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                        readOnly
                        className="w-full bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg"
                        autoComplete="off"
                    />
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-8">
                <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-400 to-green-600 text-white px-7 py-2.5 rounded-lg font-semibold shadow hover:from-green-500 hover:to-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-60"
                    disabled={updateUserDetails.isLoading}
                >
                    {updateUserDetails.isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                    onClick={handleCancel}
                    className="bg-gradient-to-r from-red-400 to-red-600 text-white px-7 py-2.5 rounded-lg font-semibold shadow hover:from-red-500 hover:to-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                    Cancel
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
