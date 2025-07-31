import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '../../Components/Navbar';

// LOADING-ERROR UI/UX
import User_Profile_Loading from './Loading/User_Profile_Details';
import User_Profile_Error from './Error/User_Profile_Details';
import UserProfile_UpdateLoading from './Loading/User_Profile_Update';

export default function Account() {
    const [refreshNav, setRefreshNav] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [photo, setPhoto] = useState(
        '/api/account/picture/me?refresh=' + new Date().getTime()
    );
    const [imageFile, setImageFile] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const queryClient = useQueryClient();

    const {
        data: profile,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await fetch(`/api/account/details/me`);
            if (!response.ok) {
                const error = new Error('Fetch Error');
                error.status = response.status;
                throw error;
            }
            return await response.json();
        },
        retry: false,
    });

    const [tempProfile, setTempProfile] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setPhoto(URL.createObjectURL(e.target.files[0]));
        }
    };

    const profileMutation = useMutation({
        mutationFn: async (updates) => {
            const response = await fetch('/api/account/details/me', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to Update: ${errorData.message}`);
            }
            return response.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['profile']);
            setEditMode(false);
        },
        onError: (error) => {
            alert(error.message);
        },
    });

    const pictureMutation = useMutation({
        mutationFn: async (formData) => {
            const changePicture = await fetch('/api/account/picture/me', {
                method: 'POST',
                body: formData,
            });

            if (!changePicture.ok) {
                throw new Error('Failed to update profile picture.');
            }
            return changePicture;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['profile']);
        },
        onError: (error) => {
            alert(error.message);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (imageFile && imageFile.size > 0 && confirm('Are You Sure?')) {
                const formData = new FormData();
                formData.append('photo', imageFile);
                await pictureMutation.mutateAsync(formData);
                setRefreshNav(!refreshNav);
                setPhoto(URL.createObjectURL(imageFile));
            }

            await profileMutation.mutateAsync({ ...profile, ...tempProfile });
        } catch (error) {
            console.error('Profile update error:', error);
        }
    };

    // Profile Details
    if (isLoading) return <User_Profile_Loading />;
    if (isError) return <User_Profile_Error statusCode={error.status} />;

    // Profile Updates
    if (profileMutation.isPending || pictureMutation.isPending)
        return <UserProfile_UpdateLoading />;

    return (
        <>
            <Navbar refresh={refreshNav} />

            <div className="w-full flex flex-col items-center mt-10 py-10 px-2 sm:px-0 pt-32 bg-white min-h-screen">
                <h1 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-2">
                    <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    Account Profile
                </h1>
                <div className="w-full max-w-3xl mx-auto rounded-xl border border-blue-100 bg-white flex flex-col md:flex-row">
                    <div className="flex flex-col items-center justify-center p-8 md:w-1/3 gap-4 border-b md:border-b-0 md:border-r border-blue-100">
                        <div className="relative rounded-full border-2 border-blue-400 p-1 mb-2 bg-white">
                            <img
                                src={photo}
                                alt="Profile"
                                className="w-24 h-24 object-cover rounded-full border-2 border-blue-300"
                            />
                            {editMode && (
                                <label className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700 transition">
                                    <i className="fa-solid fa-camera"></i>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                        {editMode ? (
                            <div className="flex flex-col gap-1 w-full items-center">
                                <input
                                    type="text"
                                    name="firstName"
                                    defaultValue={profile.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    className="bg-white border border-blue-200 rounded px-2 py-1 text-blue-900 font-semibold text-center text-sm w-full max-w-[140px]"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    defaultValue={profile.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className="bg-white border border-blue-200 rounded px-2 py-1 text-blue-900 font-semibold text-center text-sm w-full max-w-[140px]"
                                />
                            </div>
                        ) : (
                            <span className="text-blue-900 font-bold text-lg text-center">
                                {profile.firstName} {profile.lastName}
                            </span>
                        )}
                        {editMode ? (
                            <select
                                name="gender"
                                defaultValue={profile.gender || 'Male'}
                                onChange={handleChange}
                                className="text-blue-900 font-semibold rounded px-2 py-1 bg-white border border-blue-200 text-sm"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <span className="text-blue-500 text-xs flex items-center gap-1">
                                <i className="fa-solid fa-mars"></i> {profile.gender || 'Male'}
                            </span>
                        )}
                        {editMode ? (
                            <input
                                type="text"
                                name="position"
                                defaultValue={profile.position || ''}
                                onChange={handleChange}
                                className="text-blue-900 font-semibold rounded px-2 py-1 bg-white border border-blue-200 text-center text-sm"
                            />
                        ) : (
                            <span className="text-blue-500 text-xs flex items-center gap-1">
                                <i className="fa-solid fa-user-tie"></i> {profile.position || 'Field Supervisor'}
                            </span>
                        )}
                        {!editMode ? (
                            <button
                                onClick={() => {
                                    setTempProfile(profile.user);
                                    setEditMode(true);
                                }}
                                className="mt-2 px-4 py-1 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition text-xs"
                            >
                                <i className="fa-solid fa-pen-to-square"></i> Edit
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setPhoto('/api/account/picture/me');
                                    setEditMode(false);
                                    setImageFile(null);
                                }}
                                className="mt-2 px-4 py-1 bg-gray-200 text-blue-700 font-semibold rounded hover:bg-gray-300 transition text-xs"
                            >
                                <i className="fa-solid fa-xmark"></i> Cancel
                            </button>
                        )}
                    </div>
                    <form className="flex-1 p-8" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 text-blue-900 text-base font-bold tracking-wide">Occupation</label>
                                <input
                                    type="text"
                                    name="occupation"
                                    className="block w-full border-2 border-blue-400 rounded-lg px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-700 text-blue-900 text-base font-semibold transition placeholder:text-blue-300"
                                    defaultValue={profile.occupation || ''}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-blue-900 text-base font-bold tracking-wide">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="block w-full border-2 border-blue-400 rounded-lg px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-700 text-blue-900 text-base font-semibold transition placeholder:text-blue-300"
                                    defaultValue={profile.address || ''}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-blue-900 text-base font-bold tracking-wide">Cellphone</label>
                                <input
                                    type="text"
                                    name="cellphone_no"
                                    className="block w-full border-2 border-blue-400 rounded-lg px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-700 text-blue-900 text-base font-semibold transition placeholder:text-blue-300"
                                    defaultValue={profile.cellphone_no || ''}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-blue-700 text-xs font-medium">Institution</label>
                                <input
                                    type="text"
                                    name="institution"
                                    className="block w-full border border-blue-100 rounded px-2 py-1 bg-white text-blue-900 text-sm"
                                    defaultValue={profile.institution || ''}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="mb-2 text-blue-700 text-xs font-medium">Contact Information</div>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                                    <span className="text-blue-700 text-xs font-medium">Email</span>
                                    {editMode ? (
                                        <input
                                            type="email"
                                            name="email"
                                            className="text-blue-900 border border-blue-100 rounded px-2 py-1 bg-white text-sm"
                                            defaultValue={profile.email || ''}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <span className="text-blue-900 text-sm">{profile.email}</span>
                                    )}
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                                    <span className="text-blue-700 text-xs font-medium">Alternate Phone</span>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="telephone_no"
                                            className="text-blue-900 border border-blue-100 rounded px-2 py-1 bg-white text-sm"
                                            defaultValue={profile.telephone_no || ''}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <span className="text-blue-900 text-sm">{profile.telephone_no}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {editMode && (
                            <div className="flex justify-end pt-6">
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded font-semibold text-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 max-w-xs w-full border border-blue-100">
                            <div className="font-bold text-lg mb-3 text-red-600">Delete Account</div>
                            <div className="mb-5 text-blue-900 text-sm">Are you sure you want to delete your account? This action cannot be undone.</div>
                            <div className="flex gap-2">
                                <button
                                    className="flex-1 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-blue-700 text-sm"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="flex-1 px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                html, body, #root {
                    background: #fff;
                }
                html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>
    );
}
