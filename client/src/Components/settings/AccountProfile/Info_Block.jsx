import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useImageCache, { clearImageCache } from '../../../hooks/useImageCache';

export default function Info_Block({ user, admin_navigate, theme }) {
    const [edit, setEdit] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Use image cache for profile picture
    const { imageUrl, refresh: refreshImage } = useImageCache(user.id, true);

    useEffect(() => {
        setEditedUser({ ...user });
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadError(null);
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
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

    const handleSaveClick = async () => {
        setIsUploading(true);
        setUploadError(null);

        try {
            // Upload new picture if selected (using same method as DevPage)
            if (selectedFile) {
                console.log('🖼️ [Profile Settings] Starting upload...');
                console.log('🖼️ [Profile Settings] File:', selectedFile.name, `(${(selectedFile.size / 1024).toFixed(2)} KB)`);
                console.log('🖼️ [Profile Settings] User ID:', user.id);
                
                const formData = new FormData();
                formData.append('photo', selectedFile);

                console.log('🖼️ [Profile Settings] Uploading to /api/account/picture/me');
                const response = await axios.post('/api/account/picture/me', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });

                console.log('🖼️ [Profile Settings] ✓ Upload successful!');
                console.log('🖼️ [Profile Settings] Response:', response.data);
                if (response.data.picturePath) {
                    console.log('🖼️ [Profile Settings] Firebase path:', response.data.picturePath);
                }

                if (response.status === 200) {
                    console.log('🖼️ [Profile Settings] Clearing cache for user:', user.id);
                    // Clear cache and refresh image immediately
                    clearImageCache(user.id);
                    console.log('🖼️ [Profile Settings] Refreshing image in 100ms...');
                    // Force a complete refresh after a short delay
                    setTimeout(async () => {
                        console.log('🖼️ [Profile Settings] Calling refreshImage()...');
                        await refreshImage();
                        console.log('🖼️ [Profile Settings] Image refresh complete');
                    }, 100);
                    setPreviewUrl(null);
                    setSelectedFile(null);
                }
            }

            // Update other user details - ensure all required fields are present
            const updateData = {
                username: editedUser.username,
                firstName: editedUser.firstName,
                middleName: editedUser.middleName,
                surname: editedUser.surname,
                extensionName: editedUser.extensionName,
                sex: editedUser.sex,
                contactNumber: editedUser.contactNumber,
                dateOfBirth: editedUser.dateOfBirth,
                client_profile: editedUser.client_profile || user.client_profile,
                email: editedUser.email,
            };

            const updateResponse = await axios.post('/api/account/details/me', updateData, {
                withCredentials: true,
            });

            if (updateResponse.status === 200) {
                setEdit(false);
                // Refresh the page to show updated data
                window.location.reload();
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setUploadError(error.response?.data?.message || error.response?.data?.error || 'Failed to save profile');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeletePicture = async () => {
        if (!confirm('Are you sure you want to delete your profile picture?')) {
            return;
        }

        setIsUploading(true);
        try {
            await axios.delete('/api/account/picture/me', {
                withCredentials: true,
            });

            // Clear cache and refresh to show default image
            clearImageCache(user.id);
            await refreshImage();
        } catch (error) {
            console.error('Error deleting picture:', error);
            setUploadError(error.response?.data?.error || 'Failed to delete picture');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancelClick = () => {
        setEditedUser({ ...user });
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadError(null);
        setEdit(false);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Full name display
    const fullName = [
        editedUser.firstName,
        editedUser.middleName,
        editedUser.surname,
        editedUser.extensionName
    ].filter(Boolean).join(' ');

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-2 sm:px-6 md:px-12 py-12 gap-12">
            {/* HEADER */}
            <div className="border border-blue-200 dark:border-gray-600 rounded-3xl shadow-2xl p-6 sm:p-12 w-full max-w-5xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg">
                <div className="flex items-center mb-8 mt-2">
                    <span className="bg-white dark:bg-gray-700 rounded-xl px-6 py-2 text-3xl font-extrabold text-blue-900 dark:text-blue-300 tracking-tight shadow-lg">
                        Profile Information
                    </span>
                    <hr className="flex-1 border-blue-200 dark:border-gray-600 ml-6" />
                </div>

                {/* USER DETAILS & CONTACTS */}
                <div className="flex flex-col-reverse md:flex-row justify-center rounded-3xl overflow-hidden p-4 sm:p-8 md:p-14 w-full max-w-5xl min-h-[420px] md:min-h-[540px] bg-gradient-to-tr from-white via-blue-50 to-blue-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 shadow-inner gap-12">
                    <form className="mt-4 md:mt-0 space-y-6 text-blue-900 dark:text-blue-300 p-2 sm:p-4 w-full md:w-1/2">
                        <div className="grid grid-cols-1 gap-5">
                            {/* Access Level */}
                            <div>
                                <label className="text-blue-900 dark:text-blue-300 font-semibold text-sm mb-1 block">
                                    🔑 Access Level
                                </label>
                                <div className="mt-1 block w-full border border-blue-100 dark:border-gray-600 rounded-lg p-2 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                                    {editedUser.access}
                                </div>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="text-blue-900 dark:text-blue-300 font-semibold text-sm mb-1 block">
                                    👤 Username
                                </label>
                                <div className="mt-1 block w-full border border-blue-100 dark:border-gray-600 rounded-lg p-2 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                                    {editedUser.username}
                                </div>
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="text-blue-900 dark:text-blue-300 font-semibold text-sm mb-1 block">
                                    📞 Contact Number
                                </label>
                                {edit ? (
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={editedUser.contactNumber || ''}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-blue-200 dark:border-gray-500 rounded-lg p-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
                                    />
                                ) : (
                                    <div className="mt-1 block w-full border border-blue-100 dark:border-gray-600 rounded-lg p-2 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                                        {editedUser.contactNumber || 'N/A'}
                                    </div>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="text-blue-900 dark:text-blue-300 font-semibold text-sm mb-1 block">
                                    🎂 Date of Birth
                                </label>
                                {edit ? (
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={editedUser.dateOfBirth || ''}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-blue-200 dark:border-gray-500 rounded-lg p-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
                                    />
                                ) : (
                                    <div className="mt-1 block w-full border border-blue-100 dark:border-gray-600 rounded-lg p-2 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                                        {formatDate(editedUser.dateOfBirth)}
                                    </div>
                                )}
                            </div>

                            {/* Client Profile */}
                            <div>
                                <label className="text-blue-900 dark:text-blue-300 font-semibold text-sm mb-1 block">
                                    👥 Client Profile
                                </label>
                                {edit ? (
                                    <select
                                        name="client_profile"
                                        value={editedUser.client_profile || ''}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-blue-200 dark:border-gray-500 rounded-lg p-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
                                    >
                                        <option value="">Select Profile Type</option>
                                        <option value="Fishfolk">Fishfolk</option>
                                        <option value="Rural_Based_Org">Rural Based Organization</option>
                                        <option value="Student">Student</option>
                                        <option value="Agricultural_Fisheries_Technician">Agricultural/Fisheries Technician</option>
                                        <option value="Youth">Youth</option>
                                        <option value="Women">Women</option>
                                        <option value="Govt_Employee">Government Employee</option>
                                        <option value="PWD">Person with Disability (PWD)</option>
                                        <option value="Indigenous_People">Indigenous People</option>
                                        <option value="Other">Other</option>
                                    </select>
                                ) : (
                                    <div className="mt-1 block w-full border border-blue-100 dark:border-gray-600 rounded-lg p-2 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                                        {editedUser.client_profile?.replace(/_/g, ' ') || 'N/A'}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* CONTACT INFORMATION */}
                        <div className="mt-10">
                            <div className="flex items-center mb-3">
                                <span className="bg-white dark:bg-gray-700 rounded-lg px-4 py-1 text-lg font-bold text-blue-900 dark:text-blue-300 shadow">
                                    Contact Information
                                </span>
                                <hr className="flex-1 border-blue-200 dark:border-gray-600 ml-4" />
                            </div>
                            <div className="flex flex-col w-full gap-3">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-blue-100 dark:border-gray-600 gap-1">
                                    <span className="font-semibold text-blue-900 dark:text-blue-300">
                                        Email
                                    </span>
                                    {edit ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editedUser.email || ''}
                                            onChange={handleChange}
                                            className="border border-blue-200 dark:border-gray-500 rounded-lg p-1 px-2 ml-0 sm:ml-2 w-full sm:w-auto bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
                                            style={{ minWidth: 120 }}
                                        />
                                    ) : (
                                        <span className="text-blue-700 dark:text-blue-400 break-all">
                                            {editedUser.email || 'N/A'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* PROFILE PICTURE SECTION */}
                    <div className="flex flex-col items-center space-y-6 mb-6 md:mb-0 p-2 sm:p-4 w-full md:w-1/2">
                        <div className="relative flex items-center justify-center mb-4">
                            <div className="rounded-full border-4 border-blue-400 dark:border-blue-500 p-1 flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-white dark:bg-gray-700 shadow-xl relative transition-all duration-300">
                                <img
                                    src={previewUrl || imageUrl}
                                    alt="Profile"
                                    className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-cover rounded-full shadow-lg transition-all duration-300"
                                    onError={(e) => {
                                        e.target.src = '/default_picture.png';
                                    }}
                                />
                                {edit && (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handlePictureChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            disabled={isUploading}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-blue-700 dark:bg-blue-600 text-white rounded-full p-3 border-2 border-white dark:border-gray-600 shadow-lg focus:outline-none hover:bg-blue-800 dark:hover:bg-blue-700 transition disabled:opacity-50"
                                            onClick={() => {
                                                const parent = document.activeElement?.parentElement;
                                                const fileInput = parent?.querySelector('input[type="file"]');
                                                if (fileInput) fileInput.click();
                                            }}
                                            disabled={isUploading}
                                            tabIndex={0}
                                            aria-label="Change profile picture"
                                        >
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Upload Error */}
                        {uploadError && (
                            <div className="text-red-600 dark:text-red-400 text-sm text-center">
                                {uploadError}
                            </div>
                        )}

                        {/* User Info */}
                        <div className="flex flex-col items-center space-y-2 w-full">
                            <span className="border border-blue-300 dark:border-blue-500 rounded-xl px-6 py-2 text-xl font-semibold text-blue-900 dark:text-blue-300 bg-white/90 dark:bg-gray-700/90 shadow w-fit">
                                {fullName}
                            </span>
                            <span className="text-blue-700 dark:text-blue-400 text-base text-center w-full flex items-center justify-center gap-2">
                                <i className={editedUser.sex === 'Female' ? 'fa-solid fa-venus' : 'fa-solid fa-mars'}></i>
                                <span className="block w-full text-center">
                                    {editedUser.sex}
                                </span>
                            </span>
                        </div>

                        {/* Action Buttons */}
                        {!edit && (
                            <div className="flex flex-col gap-3">
                                <button
                                    className="mt-6 px-6 py-2 bg-blue-700 dark:bg-blue-600 text-white rounded-xl hover:bg-blue-800 dark:hover:bg-blue-700 transition text-base border-2 border-blue-700 dark:border-blue-600 flex items-center gap-2 shadow-lg font-semibold"
                                    onClick={() => setEdit(true)}
                                >
                                    <i className="fa-solid fa-pen"></i>
                                    Edit Profile
                                </button>
                                {user.picturePath && (
                                    <button
                                        className="px-6 py-2 bg-red-600 dark:bg-red-700 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-800 transition text-base border-2 border-red-600 dark:border-red-700 flex items-center gap-2 shadow-lg font-semibold"
                                        onClick={handleDeletePicture}
                                        disabled={isUploading}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                        Delete Picture
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="text-center">
                            {edit && (
                                <div className="flex gap-4 mt-4">
                                    <button
                                        className="flex items-center gap-2 px-6 py-2 cursor-pointer bg-green-600 dark:bg-green-700 text-white rounded-xl hover:bg-green-700 dark:hover:bg-green-800 transition text-base border-2 border-green-700 dark:border-green-700 shadow-lg font-semibold disabled:opacity-50"
                                        onClick={handleSaveClick}
                                        type="button"
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <>
                                                <i className="fa-solid fa-spinner fa-spin"></i>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-check"></i>
                                                Save
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-6 py-2 cursor-pointer bg-red-600 dark:bg-red-700 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-800 transition text-base border-2 border-red-700 dark:border-red-700 shadow-lg font-semibold disabled:opacity-50"
                                        onClick={handleCancelClick}
                                        type="button"
                                        disabled={isUploading}
                                    >
                                        <i className="fa-solid fa-times"></i>
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
