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
            <div className="relative min-h-screen bg-gray-50 mt-20">
                {/* Blue background banner */}
                <div className="w-full h-56 bg-gradient-to-t from-gray-200 to-gray-100"></div>
                {/* Floating profile card */}
                <div className="w-full flex justify-center">
                    <div className="-mt-24 w-full max-w-2xl">
                        <div className="bg-white rounded-2xl shadow-xl px-8 pt-8 pb-10 flex flex-col items-center border border-gray-200">
                            <div className="relative -mt-20 mb-2">
                                <div className="w-32 h-32 rounded-xl bg-gray-200 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                                    <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                {editMode && (
                                    <label className="absolute bottom-2 right-2 bg-green-600 text-white rounded-full p-2 cursor-pointer hover:bg-green-800 transition shadow text-lg border-2 border-white">
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
                            <div className="flex flex-col items-center mb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded-full border border-green-100">🇵🇭 Philippines</span>
                                </div>
                                <div className="font-extrabold text-2xl text-gray-900">{profile.firstName} {profile.lastName}</div>
                                <div className="text-gray-500 text-sm font-medium">{profile.position || 'Software Engineering'} <span className="mx-1">|</span> {profile.email}</div>
                            </div>
                            <form className="w-full mt-2" onSubmit={handleSubmit}>
                                <div className="font-bold text-lg text-gray-900 mb-4">Contact information</div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-500 font-medium mb-1 md:mb-0">Name</label>
                                        <span className="font-semibold text-gray-900">{profile.firstName} {profile.lastName}</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-500 font-medium mb-1 md:mb-0">Your email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            defaultValue={profile.email || ''}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none text-base font-semibold"
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-500 font-medium mb-1 md:mb-0">Phone number</label>
                                        <input
                                            type="text"
                                            name="cellphone_no"
                                            defaultValue={profile.cellphone_no || ''}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none text-base font-semibold"
                                            placeholder="Enter number"
                                        />
                                    </div>
                                    {/* Removed 'Your website' input field */}
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-500 font-medium mb-1 md:mb-0">Your address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            defaultValue={profile.address || ''}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none text-base font-semibold"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-500 font-medium mb-1 md:mb-0">Gender</label>
                                        <select
                                            name="gender"
                                            defaultValue={profile.gender || 'Male'}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none text-base font-semibold"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-8">
                                    {editMode ? (
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 transition text-white rounded-lg font-bold text-base shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        >
                                            Save Profile
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="px-8 py-3 bg-green-700 hover:bg-green-800 transition text-white rounded-lg font-bold text-base shadow focus:outline-none focus:ring-2 focus:ring-green-400"
                                            onClick={() => {
                                                setTempProfile(profile.user);
                                                setEditMode(true);
                                            }}
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* Delete Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-blue-200 shadow-2xl">
                            <div className="font-extrabold text-2xl mb-4 text-red-600 flex items-center gap-2"><i className="fa-solid fa-triangle-exclamation"></i> Delete Account</div>
                            <div className="mb-8 text-blue-900 text-lg">Are you sure you want to delete your account? This action cannot be undone.</div>
                            <div className="flex gap-4">
                                <button
                                    className="flex-1 px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-blue-700 text-lg font-bold shadow"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="flex-1 px-5 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-lg font-bold shadow"
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
                    background: #f8fafc;
                }
                html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>
    );
}
