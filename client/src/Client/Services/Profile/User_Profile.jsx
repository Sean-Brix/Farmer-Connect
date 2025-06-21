import { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import default_picture from '../../../Assets/default_picture.png';

export default function Account() {
    // --- Combined logic from both components ---
    const [profile, setProfile] = useState({
        occupation: '',
        address: '',
        cellphone_no: '',
        institution: '',
        email_address: '',
        telephone_no: '',
        gender: 'Male',
        position: '',
        firstname: '',
        lastname: '',
        password: '',
        confirmPassword: '',
    });

    const [editMode, setEditMode] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/accounts/myAccount`);
                if (response.ok) {
                    const data = await response.json();
                    setProfile((prev) => ({
                        ...prev,
                        ...data.payload.details,
                        password: '',
                        confirmPassword: '',
                    }));

                    const getImage = await fetch(
                        `/api/accounts/getProfile?user_id=${data.payload.details.id}`
                    );
                    if (getImage.status !== 204) {
                        const imageBlob = await getImage.blob();
                        const imageObjectURL = URL.createObjectURL(imageBlob);
                        setPhoto(imageObjectURL);
                    }
                }
            } catch (error) {
                // handle error
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        if (profile.password && profile.password !== profile.confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }
        setEditMode(false);

        try {
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                await fetch('/api/accounts/uploadProfile', {
                    method: 'POST',
                    body: formData,
                });
            }

            await fetch('/api/accounts/updateAccount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: profile.id,
                    occupation: profile.occupation,
                    address: profile.address,
                    cellphone_no: profile.cellphone_no,
                    institution: profile.institution,
                    email_address: profile.email_address,
                    gender: profile.gender,
                    position: profile.position,
                    telephone_no: profile.telephone_no,
                    password: profile.password,
                }),
            });
            // Optionally show success message
        } catch (error) {
            // handle error
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(false);
        // Add delete logic here
        alert('Account deleted!');
    };

    return (
        <>
            <Navbar />
            <div className="w-full flex flex-col items-center mt-10 py-10 px-2 sm:px-0 pt-40 bg-gradient-to-br from-blue-100 via-white to-blue-200 min-h-screen">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-blue-700 mb-8 tracking-tight drop-shadow-lg flex items-center gap-3">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    Account Profile
                </h1>
                <div className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl overflow-hidden border border-blue-200 bg-white/90 backdrop-blur-lg flex flex-col lg:flex-row">
                    <div className="bg-gradient-to-b from-blue-300 via-blue-200 to-blue-900 flex flex-col items-center justify-center p-12 lg:w-1/3 gap-5">
                        <div className="relative rounded-full border-4 border-blue-700 shadow-2xl p-1 mb-2 bg-gradient-to-tr from-blue-700 to-blue-900">
                            <img
                                src={photo || profile.profile_pic || default_picture}
                                alt="Profile"
                                className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-full border-4 border-blue-800"
                            />
                            {editMode && (
                                <label className="absolute bottom-2 right-2 bg-blue-800 text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-blue-700 transition">
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
                                    name="firstname"
                                    value={profile.firstname}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    className="bg-blue-800 border-2 border-blue-700 rounded-2xl px-3 py-1 text-white font-bold mb-1 shadow-lg tracking-wide text-center text-sm w-full max-w-[160px]"
                                    style={{
                                        fontSize:
                                            `${(profile.firstname + ' ' + profile.lastname).length > 20
                                                ? '1rem'
                                                : '1.2rem'}`
                                    }}
                                />
                                <input
                                    type="text"
                                    name="lastname"
                                    value={profile.lastname}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className="bg-blue-800 border-2 border-blue-700 rounded-2xl px-3 py-1 text-white font-bold mb-1 shadow-lg tracking-wide text-center text-sm w-full max-w-[160px]"
                                    style={{
                                        fontSize:
                                            `${(profile.firstname + ' ' + profile.lastname).length > 20
                                                ? '1rem'
                                                : '1.2rem'}`
                                    }}
                                />
                            </div>
                        ) : (
                            <span
                                className="bg-blue-800 border-2 border-blue-700 rounded-2xl px-6 py-1 text-xl font-bold text-white mb-1 shadow-lg tracking-wide whitespace-nowrap overflow-hidden"
                                style={{
                                    fontSize:
                                        `${(profile.firstname + ' ' + profile.lastname).length > 20
                                            ? '1rem'
                                            : '1.5rem'}`
                                }}
                            >
                                {profile.firstname} {profile.lastname}
                            </span>
                        )}
                        {editMode ? (
                            <select
                                name="gender"
                                value={profile.gender || 'Male'}
                                onChange={handleChange}
                                className="text-white font-semibold rounded-xl px-3 py-1 bg-blue-800 border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <span className="text-blue-100 text-sm flex items-center gap-2">
                                <i className="fa-solid fa-mars "></i>{' '}
                                {profile.gender || 'Male'}
                            </span>
                        )}
                        {editMode ? (
                            <input
                                type="text"
                                name="position"
                                value={profile.position || ''}
                                onChange={handleChange}
                                className="text-white font-semibold rounded-xl px-3 py-1 bg-blue-800 text-center border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
                            />
                        ) : (
                            <span className="text-blue-100 text-sm flex items-center gap-2">
                                <i className="fa-solid fa-user-tie"></i>{' '}
                                {profile.position || 'Field Supervisor'}
                            </span>
                        )}
                        {!editMode ? (
                            <button
                                onClick={() => setEditMode(true)}
                                className="flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition border-2 border-blue-700 shadow-lg text-sm"
                            >
                                <i className="fa-solid fa-pen-to-square"></i>
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setEditMode(false);
                                    setImageFile(null);
                                    setPasswordError('');
                                    setProfile((prev) => ({ ...prev, password: '', confirmPassword: '' }));
                                }}
                                className="flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition border-2 border-blue-700 shadow-lg text-sm"
                            >
                                <i className="fa-solid fa-xmark"></i>
                                Cancel
                            </button>
                        )}
                    </div>
                    <form className="flex-1 p-8 bg-white" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 text-blue-900 font-semibold tracking-wide text-sm">
                                    💼 Occupation
                                </label>
                                <input
                                    type="text"
                                    name="occupation"
                                    className="block w-full border border-blue-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 transition text-sm"
                                    value={profile.occupation || ''}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-blue-900 font-semibold tracking-wide text-sm">
                                    📍 Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    className="block w-full border border-blue-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 transition text-sm"
                                    value={profile.address || ''}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-blue-900 font-semibold tracking-wide text-sm">
                                    📞 Cellphone
                                </label>
                                <input
                                    type="text"
                                    name="cellphone_no"
                                    className="block w-full border border-blue-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 transition text-sm"
                                    value={profile.cellphone_no || ''}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-blue-900 font-semibold tracking-wide text-sm">
                                    🏢 Institution
                                </label>
                                <input
                                    type="text"
                                    name="institution"
                                    className="block w-full border border-blue-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 transition text-sm"
                                    value={profile.institution || ''}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                        </div>
                        <div className="bg-white border border-blue-200 rounded-3xl shadow-2xl p-6 mt-8">
                            <div className="flex flex-col sm:flex-row items-center mb-6 gap-3">
                                <span className="bg-blue-800 px-6 py-2 rounded-2xl text-xl font-bold text-white border border-blue-700 shadow-lg flex items-center gap-2">
                                    <i className="fa-solid fa-address-book text-blue-300"></i>
                                    Contacts Information
                                </span>
                                <hr className="flex-1 border-blue-700 w-full sm:w-auto" />
                            </div>
                            <div className="divide-y divide-blue-100">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 gap-2">
                                    <span className="font-semibold text-blue-900 flex items-center gap-2 text-sm">
                                        <i className="fa-solid fa-envelope text-blue-300"></i>{' '}
                                        Email
                                    </span>
                                    {editMode ? (
                                        <input
                                            type="email"
                                            name="email_address"
                                            className="text-blue-900 break-all border border-blue-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition text-sm"
                                            value={profile.email_address || ''}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <span className="text-blue-900 break-all text-sm">
                                            {profile.email_address}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 gap-2">
                                    <span className="font-semibold text-blue-900 flex items-center gap-2 text-sm">
                                        <i className="fa-solid fa-phone text-blue-300"></i>{' '}
                                        Alternate Phone
                                    </span>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="telephone_no"
                                            className="text-blue-900 border border-blue-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 transition text-sm"
                                            value={profile.telephone_no || ''}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <span className="text-blue-900 text-sm">
                                            {profile.telephone_no}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    
                        <div className="flex gap-4 pt-6">
                            {editMode && (
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 transition text-white rounded-lg font-semibold shadow text-sm"
                                >
                                    Save Changes
                                </button>
                            )}
                          
                        </div>
                    </form>
                </div>
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-gray-100">
                            <div className="font-bold text-xl mb-4 flex items-center gap-2 text-red-600">
                                Delete Account
                            </div>
                            <div className="mb-6 text-gray-700">
                                Are you sure you want to delete your account? This action cannot be undone.
                            </div>
                            <div className="flex gap-4">
                                <button
                                    className="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-white"
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
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    background: #f1f5f9;
                }
                html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
                    display: none;
                }
                .letter-spacing-wide {
                    letter-spacing: 0.15em;
                }
            `}</style>
        </>
    );
}
