import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useImageCache, { clearImageCache } from '../../../hooks/useImageCache';

function Edit_Profile({ admin_navigate, details, user: initialUser }) {
    const [user, setUser] = useState(initialUser || {});

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Use image cache for profile picture
    const { imageUrl, refresh: refreshImage } = useImageCache(user.id, true);

    useEffect(() => {
        if (initialUser) {
            setUser(initialUser);
        }
    }, [initialUser]);

    const handlePictureChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setUploadError(null);

        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setUploadError('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
                setSelectedFile(null);
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('File too large. Maximum size is 5MB.');
                setSelectedFile(null);
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const uploadProfile = async () => {
        if (!selectedFile) {
            setUploadError('Please select a file first');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('photo', selectedFile);

            const response = await axios.post('/api/account/picture/me', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                // Clear cache and refresh image
                clearImageCache(user.id);
                await refreshImage();
                setPreviewUrl(null);
                setSelectedFile(null);
                
                if (details?.setProfile) {
                    details.setProfile(prev => ({ ...prev, picturePath: response.data.picturePath }));
                }
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            setUploadError(error.response?.data?.error || 'Failed to upload picture');
        } finally {
            setIsUploading(false);
        }
    };

    // Full name display
    const fullName = [
        user.firstName,
        user.middleName,
        user.surname,
        user.extensionName
    ].filter(Boolean).join(' ');

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <>
            {/* HEADER */}
            <div className="relative mt-30">
                <hr className="border-black-300" />
                <span className="absolute left-1/8 -translate-x-1/4 -top-5 bg-white rounded-lg px-4 text-2xl font-semibold text-black-700">
                    Edit Account
                </span>
            </div>

            {/* MAIN */}
            <div className="flex flex-col items-center min-h-screen bg-white px-2 sm:px-0 mt-20 gap-10">
                <div className="border-2 border-blue-900 rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-5xl bg-white">
                    <div className="flex items-center mb-2 mt-10">
                        <span className="bg-white rounded-lg px-4 text-2xl sm:text-2xl font-semibold text-black-700 whitespace-nowrap z-10">
                            Profile Information
                        </span>
                        <hr className="flex-1 border-black-300 ml-4" />
                    </div>

                    <div className="bg-white flex flex-col-reverse md:flex-row border-b-none justify-center shadow-lg rounded-lg overflow-hidden p-4 sm:p-8 md:p-12 w-full max-w-5xl min-h-[400px] md:min-h-[600px]">
                        <form className="mt-4 md:mt-0 space-y-6 text-black-700 p-4 sm:p-4 w-full md:w-1/2">
                            <div className="block">
                                <span className="text-black-700 font-bold">
                                    🔑 Access Level
                                </span>
                                <div className="mt-1 block w-full border rounded-lg p-2 pl-5 bg-white">
                                    {user.access || 'N/A'}
                                </div>
                            </div>

                            <div className="block">
                                <span className="text-black-700 font-bold">
                                    👤 Username
                                </span>
                                <div className="mt-1 block w-full border rounded-lg p-2 pl-5 bg-white">
                                    {user.username || 'N/A'}
                                </div>
                            </div>

                            <div className="block">
                                <span className="text-black-700 font-bold">
                                    📞 Contact Number
                                </span>
                                <div className="mt-1 block w-full border rounded-lg p-2 pl-5 bg-white">
                                    {user.contactNumber || 'N/A'}
                                </div>
                            </div>

                            <div className="block">
                                <span className="text-black-700 font-bold">
                                    🎂 Date of Birth
                                </span>
                                <div className="mt-1 block w-full border rounded-lg p-2 pl-5 bg-white">
                                    {formatDate(user.dateOfBirth)}
                                </div>
                            </div>

                            <div className="block">
                                <span className="text-black-700 font-bold">
                                    👥 Client Profile
                                </span>
                                <div className="mt-1 block w-full border rounded-lg p-2 pl-5 bg-white">
                                    {user.client_profile || 'N/A'}
                                </div>
                            </div>

                            <div className="block">
                                <span className="text-black-700 font-bold">
                                    📧 Email
                                </span>
                                <div className="mt-1 block w-full border rounded-lg p-2 pl-5 bg-white">
                                    {user.email || 'N/A'}
                                </div>
                            </div>
                        </form>

                        <div className="flex flex-col items-center space-y-4 mb-6 md:mb-0 p-2 sm:p-4 w-full md:w-1/2">
                            {/* Profile Picture */}
                            <div className="flex items-center justify-center mb-4">
                                <div className="rounded-full border-4 border-blue-800 p-1 flex items-center justify-center">
                                    <img
                                        src={previewUrl || imageUrl}
                                        alt="Profile"
                                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full shadow-lg"
                                        onError={(e) => {
                                            e.target.src = '/default_picture.png';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Upload Error */}
                            {uploadError && (
                                <div className="text-red-600 text-sm text-center">
                                    {uploadError}
                                </div>
                            )}

                            {/* User Info */}
                            <div className="flex flex-col items-center space-y-2 w-full">
                                <span className="border-2 border-blue-800 rounded-lg px-4 py-1 text-lg font-semibold text-black-700 w-fit">
                                    {fullName}
                                </span>
                                <span className="text-black-600 text-base flex items-center gap-2">
                                    <i className={user.sex === 'Female' ? 'fa-solid fa-venus' : 'fa-solid fa-mars'}></i>
                                    {user.sex || 'N/A'}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 items-center">
                                {admin_navigate && (
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-500 transition text-base border-2 border-blue-800"
                                        onClick={() => admin_navigate('edit_profile')}
                                        type="button"
                                    >
                                        <i className="fa-solid fa-pen-to-square"></i>
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* PICTURE UPLOAD SECTION */}
                <div className="border-2 border-blue-900 rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-5xl bg-white">
                    <div className="flex items-center mb-4">
                        <span className="bg-white rounded-lg px-4 text-2xl sm:text-2xl font-semibold text-black-700 whitespace-nowrap z-10">
                            Upload Profile Picture
                        </span>
                        <hr className="flex-1 border-black-300 ml-4" />
                    </div>
                    
                    <div className="flex flex-col items-center gap-4 p-6">
                        <img
                            src={previewUrl || imageUrl}
                            alt="Profile Preview"
                            className="w-32 h-32 sm:w-40 sm:h-40 object-cover border-4 rounded-full shadow-lg"
                            onError={(e) => {
                                e.target.src = '/default_picture.png';
                            }}
                        />

                        {/* File Input */}
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handlePictureChange}
                            disabled={isUploading}
                            className="block w-full max-w-md text-sm text-gray-900
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                cursor-pointer border-2 p-3 rounded-lg"
                        />

                        {/* Upload Button */}
                        <div className="flex gap-4">
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600 transition text-base border-2 border-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={uploadProfile}
                                disabled={!selectedFile || isUploading}
                                type="button"
                            >
                                {isUploading ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-upload"></i>
                                        Upload Picture
                                    </>
                                )}
                            </button>

                            {admin_navigate && (
                                <button
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition text-base border-2 border-gray-600"
                                    onClick={() => admin_navigate('account')}
                                    type="button"
                                >
                                    <i className="fa-solid fa-arrow-left"></i>
                                    Back
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Edit_Profile;
