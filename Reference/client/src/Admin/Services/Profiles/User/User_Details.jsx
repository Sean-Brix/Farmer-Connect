import React, { useState, useEffect } from 'react';

export default function User_Details({ user, isEdit, setRowUpdate }) {
    const [userDetail, setuserDetails] = useState({ ...user });
    const [editedUser, setEditedUser] = useState({ ...user });
    const [isEditing, setIsEditing] = useState(isEdit);

    // Initial Render
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `/api/accounts/getAccount?id=${userDetail.id}`
                );
                const data = await response.json();

                if (!response.ok) {
                    console.log(data.payload?.error || "Unknown error");
                    alert('Something went wrong');
                    return;
                }

                setuserDetails(data.payload.details);
            } catch (err) {
                console.error(err);
                alert('Failed to fetch user details');
            }
        })();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setEditedUser({ ...userDetail });
    }, [userDetail]);

    const handleChange = (key, value) => {
        setEditedUser((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!window.confirm('Are you sure?')) return;

        try {
            const response = await fetch(`/api/Accounts/updateAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedUser),
            });

            if (!response.ok) {
                let data;
                try {
                    data = await response.json();
                } catch {
                    data = {};
                }
                alert(data.payload?.error || 'Something Went Wrong');
                return;
            }

            const data = await response.json();

            setEditedUser((prev) => ({ ...prev, ...data.payload.updated }));
            setuserDetails((prev) => ({ ...prev, ...data.payload.updated }));

            // Rerender user Row
            setRowUpdate((prev) => ({ ...prev, ...editedUser }));
            setIsEditing(false);
        } catch (e) {
            alert(e.message || e);
            console.log(e);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditedUser({ ...userDetail });
        setIsEditing(false);
    };

    // DETAILS MODE
    const renderDisplayMode = () => (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-300 relative">
            {/* Title with cut-through line */}
            <div className="flex items-center mb-8">
                <div className="flex-1 border-t-2 border-blue-500"></div>
                <span className="px-4 text-xl font-bold text-blue-700 bg-white z-10">User Details</span>
                <div className="flex-1 border-t-2 border-blue-500"></div>
            </div>
            {/* Details in a modern textbox */}
            <div className="bg-gradient-to-tr from-blue-50 via-white to-blue-100 rounded-lg border border-blue-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">ID</label>
                        <input
                            type="text"
                            value={userDetail.id || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 font-bold py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Username</label>
                        <input
                            type="text"
                            value={userDetail.username || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 font-bold py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Access</label>
                        <input
                            type="text"
                            value={userDetail.access || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Full Name</label>
                        <input
                            type="text"
                            value={`${userDetail.firstname || ''} ${userDetail.lastname || ''}`}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Gender</label>
                        <input
                            type="text"
                            value={userDetail.gender || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Client Profile</label>
                        <input
                            type="text"
                            value={userDetail.client_profile || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Address</label>
                        <input
                            type="text"
                            value={userDetail.address || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Telephone No</label>
                        <input
                            type="text"
                            value={userDetail.telephone_no || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Cellphone No</label>
                        <input
                            type="text"
                            value={userDetail.cellphone_no || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Occupation</label>
                        <input
                            type="text"
                            value={userDetail.occupation || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Position</label>
                        <input
                            type="text"
                            value={userDetail.position || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Institution</label>
                        <input
                            type="text"
                            value={userDetail.institution || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Email Address</label>
                        <input
                            type="text"
                            value={userDetail.email_address || ''}
                            readOnly
                            className="w-full bg-white border border-blue-300 text-blue-900 py-1 px-2 mb-2 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Created At</label>
                        <input
                            type="text"
                            value={
                                userDetail.created_at
                                    ? new Date(userDetail.created_at).toLocaleDateString('en-US', {
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
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Updated At</label>
                        <input
                            type="text"
                            value={
                                userDetail.updated_at
                                    ? new Date(userDetail.updated_at).toLocaleDateString('en-US', {
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

    // EDIT MODE
    const renderEditMode = () => (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-300 relative">
            {/* Title with cut-through line */}
            <div className="flex items-center mb-8">
                <div className="flex-1 border-t-2 border-blue-500"></div>
                <span className="px-4 text-xl font-bold text-blue-700 bg-white z-10">Edit User Details</span>
                <div className="flex-1 border-t-2 border-blue-500"></div>
            </div>
            <div className="bg-gradient-to-tr from-blue-50 via-white to-blue-100 rounded-lg border border-blue-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ID */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">ID</label>
                        <input
                            type="text"
                            value={editedUser.id || ''}
                            readOnly
                            className="w-full bg-white border border-blue-400 text-blue-900 font-bold py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    {/* Username */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Username</label>
                        <input
                            type="text"
                            value={editedUser.username || ''}
                            onChange={(e) => handleChange('username', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    {/* Access */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Access</label>
                        <select
                            value={editedUser.access || ''}
                            onChange={(e) => handleChange('access', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Super Admin">Super Admin</option>
                        </select>
                    </div>
                    {/* First Name */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">First Name</label>
                        <input
                            type="text"
                            value={editedUser.firstname || ''}
                            onChange={(e) => handleChange('firstname', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    {/* Last Name */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Last Name</label>
                        <input
                            type="text"
                            value={editedUser.lastname || ''}
                            onChange={(e) => handleChange('lastname', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    {/* Gender */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Gender</label>
                        <select
                            value={editedUser.gender || ''}
                            onChange={(e) => handleChange('gender', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {/* Client Profile */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Client Profile</label>
                        <select
                            value={editedUser.client_profile || ''}
                            onChange={(e) => handleChange('client_profile', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
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
                    {/* Address */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Address</label>
                        <input
                            type="text"
                            value={editedUser.address || ''}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    {/* Telephone No */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Telephone No</label>
                        <input
                            type="text"
                            value={editedUser.telephone_no || ''}
                            onChange={(e) => handleChange('telephone_no', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    {/* Cellphone No */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Cellphone No</label>
                        <input
                            type="text"
                            value={editedUser.cellphone_no || ''}
                            onChange={(e) => handleChange('cellphone_no', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    {/* Occupation */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Occupation</label>
                        <input
                            type="text"
                            value={editedUser.occupation || ''}
                            onChange={(e) => handleChange('occupation', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    {/* Position */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Position</label>
                        <input
                            type="text"
                            value={editedUser.position || ''}
                            onChange={(e) => handleChange('position', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    {/* Institution */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Institution</label>
                        <input
                            type="text"
                            value={editedUser.institution || ''}
                            onChange={(e) => handleChange('institution', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    {/* Email Address */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Email Address</label>
                        <input
                            type="text"
                            value={editedUser.email_address || ''}
                            onChange={(e) => handleChange('email_address', e.target.value)}
                            className="w-full bg-white border-2 border-blue-400 text-blue-900 py-1 px-2 mb-2 focus:outline-none focus:border-blue-600 rounded-lg"
                        />
                    </div>
                    {/* Created At */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Created At</label>
                        <input
                            type="text"
                            value={
                                editedUser.created_at
                                    ? new Date(editedUser.created_at).toLocaleDateString('en-US', {
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
                    {/* Updated At */}
                    <div>
                        <label className="block text-xs text-blue-700 font-semibold mb-1">Updated At</label>
                        <input
                            type="text"
                            value={
                                editedUser.updated_at
                                    ? new Date(editedUser.updated_at).toLocaleDateString('en-US', {
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
                <div className="flex justify-end gap-2 mt-8">
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-green-600 transition"
                    >
                        Save
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
