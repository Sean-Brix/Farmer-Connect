import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function User_Details({ user, isEdit, refetchRow}) {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(isEdit);

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
            alert(error.message);
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
        if (!window.confirm('Are you sure?')) return;
        await updateUserDetails.mutateAsync(
            queryClient.getQueryData(['userDetails', user.id])
        );
    };
    const handleCancel = () => {
        queryClient.setQueryData(['userDetails', user.id], { ...userDetail });
        setIsEditing(false);
    };

    const renderDisplayMode = () => (
        <div className="bg-white rounded-xl shadow p-4 border border-blue-300 relative">
            <div className="flex items-center mb-4">
                <div className="flex-1 border-t-2 border-blue-500"></div>
                <span className="px-2 text-lg font-bold text-blue-700 bg-white z-10">
                    User Details
                </span>
                <div className="flex-1 border-t-2 border-blue-500"></div>
            </div>
            <div className="bg-gradient-to-tr from-blue-50 via-white to-blue-100 rounded-lg border border-blue-200 p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-0.5">ID</label>
                        <input
                            type="text"
                            value={userDetail?.id || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 font-bold py-1 px-2 mb-1 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-0.5">Username</label>
                        <input
                            type="text"
                            value={userDetail?.username || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 font-bold py-1 px-2 mb-1 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-0.5">Access</label>
                        <input
                            type="text"
                            value={userDetail?.access || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-1 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs text-blue-700 font-semibold mb-0.5">Full Name</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userDetail?.firstName || ''}
                                readOnly
                                placeholder="First Name"
                                className="w-32 bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-1 focus:outline-none rounded-lg"
                            />
                            <input
                                type="text"
                                value={userDetail?.middleName || ''}
                                readOnly
                                placeholder="Middle Name"
                                className="w-24 bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-1 focus:outline-none rounded-lg"
                            />
                            <input
                                type="text"
                                value={userDetail?.lastName || ''}
                                readOnly
                                placeholder="Last Name"
                                className="w-32 bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-1 focus:outline-none rounded-lg"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Gender</label>
                        <input
                            type="text"
                            value={userDetail?.gender || ''}
                            readOnly
                            className="w-24 bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Client Profile
                        </label>
                        <input
                            type="text"
                            value={userDetail?.client_profile || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            value={userDetail?.address || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Telephone No
                        </label>
                        <input
                            type="text"
                            value={userDetail?.telephone_no || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Cellphone No
                        </label>
                        <input
                            type="text"
                            value={userDetail?.cellphone_no || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Occupation
                        </label>
                        <input
                            type="text"
                            value={userDetail?.occupation || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Position</label>
                        <input
                            type="text"
                            value={userDetail?.position || ''}
                            readOnly
                            className="w-32 bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Institution
                        </label>
                        <input
                            type="text"
                            value={userDetail?.institution || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Email Address
                        </label>
                        <input
                            type="text"
                            value={userDetail?.email || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Created At
                        </label>
                        <input
                            type="text"
                            value={
                                userDetail?.createdAt
                                    ? new Date(
                                          userDetail?.createdAt
                                      ).toLocaleDateString('en-US', {
                                          month: 'long',
                                          day: 'numeric',
                                          year: 'numeric',
                                      })
                                    : ''
                            }
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Updated At
                        </label>
                        <input
                            type="text"
                            value={
                                userDetail?.updatedAt
                                    ? new Date(
                                          userDetail?.updatedAt
                                      ).toLocaleDateString('en-US', {
                                          month: 'long',
                                          day: 'numeric',
                                          year: 'numeric',
                                      })
                                    : ''
                            }
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEditMode = () => (
        <div className="bg-white rounded-xl shadow p-4 border border-blue-300 relative">
            <div className="flex items-center mb-4">
                <div className="flex-1 border-t-2 border-blue-500"></div>
                <span className="px-2 text-lg font-bold text-blue-700 bg-white z-10">
                    Edit User Details
                </span>
                <div className="flex-1 border-t-2 border-blue-500"></div>
            </div>
            <div className="bg-gradient-to-tr from-blue-50 via-white to-blue-100 rounded-lg border border-blue-200 p-3">
                <div>
                    <label className="block text-xs text-blue-700 font-semibold mb-0.5">Account ID</label>
                    <input
                        type="text"
                        value={(userDetail?.id || '').toUpperCase()}
                        readOnly
                        className="w-full bg-white border border-blue-300 text-blue-900 font-bold py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-0.5">Username</label>
                        <input
                            type="text"
                            value={userDetail?.username || ''}
                            onChange={(e) => handleChange('username', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-1 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-0.5">Access</label>
                        <select
                            value={userDetail?.access || ''}
                            onChange={(e) => handleChange('access', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-1 focus:outline-none focus:border-blue-600 rounded-lg"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Super Admin">Super Admin</option>
                        </select>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs text-blue-700 font-semibold mb-0.5">Full Name</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userDetail?.firstName || ''}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                                placeholder="First Name"
                                className="w-32 bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-1 focus:outline-none focus:border-blue-600 rounded-lg"
                            />
                            <input
                                type="text"
                                value={userDetail?.middleName || ''}
                                onChange={(e) => handleChange('middleName', e.target.value)}
                                placeholder="Middle Name"
                                className="w-24 bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-1 focus:outline-none focus:border-blue-600 rounded-lg"
                            />
                            <input
                                type="text"
                                value={userDetail?.lastName || ''}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                placeholder="Last Name"
                                className="w-32 bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-1 focus:outline-none focus:border-blue-600 rounded-lg"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Gender
                        </label>
                        <select
                            value={userDetail?.gender || ''}
                            onChange={(e) =>
                                handleChange('gender', e.target.value)
                            }
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Client Profile
                        </label>
                        <select
                            value={userDetail?.client_profile || ''}
                            onChange={(e) =>
                                handleChange('client_profile', e.target.value)
                            }
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        >
                            <option value="">Select</option>
                            <option value="Fishfolk">Fishfolk</option>
                            <option value="Rural Based Org">
                                Rural Based Org
                            </option>
                            <option value="Student">Student</option>
                            <option value="Agricultural/Fisheries Technician">
                                Agricultural/Fisheries Technician
                            </option>
                            <option value="Youth">Youth</option>
                            <option value="Women">Women</option>
                            <option value="Gov't Employee">
                                Gov't Employee
                            </option>
                            <option value="PWD">PWD</option>
                            <option value="Indigenous People">
                                Indigenous People
                            </option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            value={userDetail?.address || ''}
                            onChange={(e) =>
                                handleChange('address', e.target.value)
                            }
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Telephone No
                        </label>
                        <input
                            type="text"
                            value={userDetail?.telephone_no || ''}
                            onChange={(e) =>
                                handleChange('telephone_no', e.target.value)
                            }
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Cellphone No
                        </label>
                        <input
                            type="text"
                            value={userDetail?.cellphone_no || ''}
                            onChange={(e) =>
                                handleChange('cellphone_no', e.target.value)
                            }
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Occupation
                        </label>
                        <input
                            type="text"
                            value={userDetail?.occupation || ''}
                            onChange={(e) =>
                                handleChange('occupation', e.target.value)
                            }
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Position
                        </label>
                        <input
                            type="text"
                            value={userDetail?.position || ''}
                            onChange={(e) =>
                                handleChange('position', e.target.value)
                            }
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Institution
                        </label>
                        <input
                            type="text"
                            value={userDetail?.institution || ''}
                            onChange={(e) =>
                                handleChange('institution', e.target.value)
                            }
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Email Address
                        </label>
                        <input
                            type="text"
                            value={userDetail?.email || ''}
                            onChange={(e) =>
                                handleChange('email', e.target.value)
                            }
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Created At
                        </label>
                        <input
                            type="text"
                            value={
                                userDetail?.createdAt
                                    ? new Date(
                                          userDetail?.createdAt
                                      ).toLocaleDateString('en-US', {
                                          month: 'long',
                                          day: 'numeric',
                                          year: 'numeric',
                                      })
                                    : ''
                            }
                            readOnly
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">
                            Updated At
                        </label>
                        <input
                            type="text"
                            value={
                                userDetail?.updatedAt
                                    ? new Date(
                                          userDetail?.updatedAt
                                      ).toLocaleDateString('en-US', {
                                          month: 'long',
                                          day: 'numeric',
                                          year: 'numeric',
                                      })
                                    : ''
                            }
                            readOnly
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-green-600 transition"
                        disabled={updateUserDetails.isLoading}
                    >
                        {updateUserDetails.isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    return <div>{isEditing ? renderEditMode() : renderDisplayMode()}</div>;
}
