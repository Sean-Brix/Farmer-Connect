import React, { useEffect, useState } from 'react';

export default function Info_Block({ user, admin_navigate }) {
    const [edit, setEdit] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    const [newPicture, setNewPicture] = useState(null);
    const [file_pic, setFile_Pic] = useState(null);

    useEffect(() => {
        setEditedUser({ ...user });
        setNewPicture(null);
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
        setFile_Pic(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveClick = async () => {
        // Here you would typically make an API call to save the updated user data
        // For now, we'll just update the user state in the parent component (if needed)

        if (newPicture) {
            // Update the picture in the editedUser state if a new picture was selected
            setEditedUser((prevUser) => ({
                ...prevUser,
                picture: newPicture,
            }));

            const formData = new FormData();
            formData.append('image', file_pic); // Append the data URL as a file

            try {
                const response = await fetch('/api/Accounts/uploadProfile', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const data = await response.json();
                    console.error(
                        'Upload failed:',
                        data?.payload?.error || response.statusText
                    );
                    // Optionally, display an error message to the user.
                    return;
                }

                setEditedUser((prev) => ({ ...prev, picture: newPicture }));

            } 
            catch (error) {
                console.error('Error uploading image:', error);
                // Handle the error appropriately (e.g., show an error message)
            }
        }
        setEdit(false);
    };

    const handleCancelClick = () => {
        setEditedUser({ ...user }); // Revert to original user data
        setNewPicture(null);
        setEdit(false);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-50 px-2 sm:px-6 md:px-12 py-12 gap-12">
            {/* HEADER */}
            <div className="border border-blue-200 rounded-3xl shadow-2xl p-6 sm:p-12 w-full max-w-5xl bg-white/95 backdrop-blur-lg">
                <div className="flex items-center mb-8 mt-2">
                    <span className="bg-white rounded-xl px-6 py-2 text-3xl font-extrabold text-blue-900 tracking-tight shadow-lg">
                        Profile Information
                    </span>
                    <hr className="flex-1 border-blue-200 ml-6" />
                </div>

                {/* USER DETAILS & CONTACTS */}
                <div className="flex flex-col-reverse md:flex-row justify-center rounded-3xl overflow-hidden p-4 sm:p-8 md:p-14 w-full max-w-5xl min-h-[420px] md:min-h-[540px] bg-gradient-to-tr from-white via-blue-50 to-blue-100 shadow-inner gap-12">
                    <form className="mt-4 md:mt-0 space-y-8 text-blue-900 p-2 sm:p-4 w-full md:w-1/2">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="text-blue-900 font-semibold text-sm mb-1 block">
                                    🔑 User Access
                                </label>
                                {edit ? (
                                    <input
                                        type="text"
                                        name="access"
                                        value={editedUser.access}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-blue-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-400 transition"
                                    />
                                ) : (
                                    <div className="mt-1 block w-full border border-blue-100 rounded-lg p-2 bg-blue-50">
                                        {editedUser.access}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="text-blue-900 font-semibold text-sm mb-1 block">
                                    💼 Occupation
                                </label>
                                {edit ? (
                                    <input
                                        type="text"
                                        name="occupation"
                                        value={editedUser.occupation}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-blue-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-400 transition"
                                    />
                                ) : (
                                    <div className="mt-1 block w-full border border-blue-100 rounded-lg p-2 bg-blue-50">
                                        {editedUser.occupation}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="text-blue-900 font-semibold text-sm mb-1 block">
                                    📍 Address
                                </label>
                                {edit ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={editedUser.address}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-blue-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-400 transition"
                                    />
                                ) : (
                                    <div className="mt-1 block w-full border border-blue-100 rounded-lg p-2 bg-blue-50">
                                        {editedUser.address}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="text-blue-900 font-semibold text-sm mb-1 block">
                                    📞 Cellphone
                                </label>
                                {edit ? (
                                    <input
                                        type="text"
                                        name="cellphone_no"
                                        value={editedUser.cellphone_no}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-blue-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-400 transition"
                                    />
                                ) : (
                                    <div className="mt-1 block w-full border border-blue-100 rounded-lg p-2 bg-blue-50">
                                        {editedUser.cellphone_no}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="text-blue-900 font-semibold text-sm mb-1 block">
                                    🏢 Institution
                                </label>
                                {edit ? (
                                    <input
                                        type="text"
                                        name="institution"
                                        value={editedUser.institution}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-blue-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-400 transition"
                                    />
                                ) : (
                                    <div className="mt-1 block w-full border border-blue-100 rounded-lg p-2 bg-blue-50">
                                        {editedUser.institution}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="text-blue-900 font-semibold text-sm mb-1 block">
                                    🌾 Commodities
                                </label>
                                <div className="mt-1 block w-full border border-blue-100 rounded-lg p-2 bg-blue-50 text-gray-500 italic">
                                    None
                                </div>
                            </div>
                            <div>
                                <label className="text-blue-900 font-semibold text-sm mb-1 block">
                                    👥 Client Profile
                                </label>
                                {edit ? (
                                    <input
                                        type="text"
                                        name="client_profile"
                                        value={editedUser.client_profile}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-blue-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-400 transition"
                                    />
                                ) : (
                                    <div className="mt-1 block w-full border border-blue-100 rounded-lg p-2 bg-blue-50">
                                        {editedUser.client_profile}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* CONTACT INFORMATION */}
                        <div className="mt-10">
                            <div className="flex items-center mb-3">
                                <span className="bg-white rounded-lg px-4 py-1 text-lg font-bold text-blue-900 shadow">
                                    Contacts Information
                                </span>
                                <hr className="flex-1 border-blue-200 ml-4" />
                            </div>
                            <div className="flex flex-col w-full gap-3">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-blue-100 gap-1">
                                    <span className="font-semibold text-blue-900">
                                        Email
                                    </span>
                                    {edit ? (
                                        <input
                                            type="email"
                                            name="email_address"
                                            value={editedUser.email_address}
                                            onChange={handleChange}
                                            className="border border-blue-200 rounded-lg p-1 px-2 ml-0 sm:ml-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-400 transition"
                                            style={{ minWidth: 120 }}
                                        />
                                    ) : (
                                        <span className="text-blue-700 break-all">
                                            {editedUser.email_address}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-blue-100 gap-1">
                                    <span className="font-semibold text-blue-900">
                                        Telephone Number
                                    </span>
                                    {edit ? (
                                        <input
                                            type="text"
                                            name="telephone_no"
                                            value={editedUser.telephone_no}
                                            onChange={handleChange}
                                            className="border border-blue-200 rounded-lg p-1 px-2 ml-0 sm:ml-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-400 transition"
                                            style={{ minWidth: 100 }}
                                        />
                                    ) : (
                                        <span className="text-blue-700 break-all">
                                            {editedUser.telephone_no}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 gap-1">
                                    <span className="font-semibold text-blue-900">
                                        Facebook
                                    </span>
                                    {edit ? (
                                        <input
                                            type="text"
                                            name="facebook"
                                            value={editedUser.facebook || ''}
                                            onChange={handleChange}
                                            className="border border-blue-200 rounded-lg p-1 px-2 ml-0 sm:ml-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-400 transition"
                                            style={{ minWidth: 100 }}
                                        />
                                    ) : (
                                        <span className="text-blue-700 break-all">
                                            {editedUser.facebook || 'None'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* IMAGE */}
                    <div className="flex flex-col items-center space-y-6 mb-6 md:mb-0 p-2 sm:p-4 w-full md:w-1/2">
                        <div className="relative flex items-center justify-center mb-4">
                            <div className="rounded-full border-4 border-blue-400 p-1 flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-white shadow-xl relative transition-all duration-300">
                                <img
                                    src={newPicture || editedUser.picture}
                                    alt="Profile"
                                    className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-cover rounded-full shadow-lg transition-all duration-300"
                                />
                                {edit && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePictureChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    />
                                )}
                                {edit && (
                                    <button
                                        type="button"
                                        className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-blue-700 text-white rounded-full p-3 border-2 border-white shadow-lg focus:outline-none hover:bg-blue-800 transition"
                                        onClick={() => {
                                            const parent =
                                                document.activeElement
                                                    ?.parentElement;
                                            const fileInput =
                                                parent?.querySelector(
                                                    'input[type="file"]'
                                                );
                                            if (fileInput) fileInput.click();
                                        }}
                                        tabIndex={0}
                                        aria-label="Change profile picture"
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-center space-y-2 w-full">
                            <span className="border border-blue-300 rounded-xl px-6 py-2 text-xl font-semibold text-blue-900 bg-white/90 shadow w-fit">
                                {editedUser.firstname + ' ' + editedUser.lastname}
                            </span>
                            <span className="text-blue-700 text-base text-center w-full flex items-center justify-center gap-2">
                                <i className="fa-solid fa-mars"></i>
                                {edit ? (
                                    <input
                                        type="text"
                                        name="gender"
                                        value={editedUser.gender}
                                        onChange={handleChange}
                                        className="border border-blue-200 rounded-lg p-1 px-2 ml-2 text-center focus:ring-2 focus:ring-blue-400 transition"
                                        style={{ minWidth: 80 }}
                                    />
                                ) : (
                                    <span className="block w-full text-center">
                                        {editedUser.gender}
                                    </span>
                                )}
                            </span>
                            <span className="text-blue-700 text-base text-center w-full flex items-center justify-center gap-2">
                                <i className="fa-solid fa-user-tie"></i>
                                {edit ? (
                                    <input
                                        type="text"
                                        name="position"
                                        value={editedUser.position}
                                        onChange={handleChange}
                                        className="border border-blue-200 rounded-lg p-1 px-2 ml-2 text-center focus:ring-2 focus:ring-blue-400 transition"
                                        style={{ minWidth: 80 }}
                                    />
                                ) : (
                                    <span className="block w-full text-center">
                                        {editedUser.position}
                                    </span>
                                )}
                            </span>
                        </div>
                         {!edit && (
                            <button
                                className="mt-6 px-6 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition text-base border-2 border-blue-700 flex items-center gap-2 shadow-lg font-semibold"
                                onClick={() => setEdit(true)}
                            >
                                <i className="fa-solid fa-pen"></i>
                                Edit Profile
                            </button>
                        )}
                        <div className="text-center">
                            {edit && (
                                <div className="flex gap-4 mt-4">
                                    <button
                                        className="flex items-center gap-2 px-6 py-2 cursor-pointer bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-base border-2 border-green-700 shadow-lg font-semibold"
                                        onClick={handleSaveClick}
                                        type="button"
                                    >
                                        <i className="fa-solid fa-check"></i>
                                        Save
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-6 py-2 cursor-pointer bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-base border-2 border-red-700 shadow-lg font-semibold"
                                        onClick={handleCancelClick}
                                        type="button"
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
