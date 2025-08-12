import { useState, useEffect } from 'react';
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
    const [formErrors, setFormErrors] = useState({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

    // Initialize tempProfile when profile data is loaded
    useEffect(() => {
        if (profile && !editMode) {
            setTempProfile({
                username: profile.username || '',
                email: profile.email || '',
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                middleName: profile.middleName || '',
                gender: profile.gender || 'Male',
                client_profile: profile.client_profile || 'Fishfolk',
                cellphone_no: profile.cellphone_no || '',
                telephone_no: profile.telephone_no || '',
                occupation: profile.occupation || '',
                position: profile.position || '',
                institution: profile.institution || '',
                address: profile.address || '',
            });
        }
    }, [profile, editMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        // Clear specific field error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!tempProfile.username?.trim()) errors.username = 'Username is required';
        if (!tempProfile.email?.trim()) errors.email = 'Email is required';
        if (!tempProfile.firstName?.trim()) errors.firstName = 'First name is required';
        if (!tempProfile.lastName?.trim()) errors.lastName = 'Last name is required';
        if (!tempProfile.cellphone_no?.trim()) errors.cellphone_no = 'Phone number is required';
        if (!tempProfile.address?.trim()) errors.address = 'Address is required';
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (tempProfile.email && !emailRegex.test(tempProfile.email)) {
            errors.email = 'Invalid email format';
        }
        
        // Phone validation (Philippine format)
        const cellphoneRegex = /^09\d{9}$/;
        if (tempProfile.cellphone_no && !cellphoneRegex.test(tempProfile.cellphone_no)) {
            errors.cellphone_no = 'Invalid phone format. Must start with 09 and be 11 digits';
        }
        
        // Telephone validation (if provided)
        if (tempProfile.telephone_no) {
            const telephoneRegex = /^\d{3}-\d{3}-\d{4}$/;
            if (!telephoneRegex.test(tempProfile.telephone_no)) {
                errors.telephone_no = 'Invalid telephone format. Use XXX-XXX-XXXX';
            }
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
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
            setFormErrors({});
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        },
        onError: (error) => {
            console.error('Profile update error:', error);
            // Handle validation errors from backend
            if (error.message.includes('All fields are required')) {
                setFormErrors({ general: 'Please fill in all required fields' });
            } else if (error.message.includes('Invalid email')) {
                setFormErrors({ email: 'Invalid email format' });
            } else if (error.message.includes('Invalid cellphone')) {
                setFormErrors({ cellphone_no: 'Invalid phone number format' });
            } else if (error.message.includes('Invalid telephone')) {
                setFormErrors({ telephone_no: 'Invalid telephone format' });
            } else {
                setFormErrors({ general: error.message });
            }
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
        
        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        try {
            // Handle image upload first if there's a new image
            if (imageFile && imageFile.size > 0) {
                if (confirm('Update profile picture?')) {
                    const formData = new FormData();
                    formData.append('photo', imageFile);
                    await pictureMutation.mutateAsync(formData);
                    setRefreshNav(!refreshNav);
                    setPhoto(`/api/account/picture/me?refresh=${new Date().getTime()}`);
                    setImageFile(null);
                }
            }

            // Update profile details
            await profileMutation.mutateAsync(tempProfile);
        } catch (error) {
            console.error('Profile update error:', error);
        }
    };

    const handleEditMode = () => {
        setTempProfile({
            username: profile.username || '',
            email: profile.email || '',
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            middleName: profile.middleName || '',
            gender: profile.gender || 'Male',
            client_profile: profile.client_profile || 'Fishfolk',
            cellphone_no: profile.cellphone_no || '',
            telephone_no: profile.telephone_no || '',
            occupation: profile.occupation || '',
            position: profile.position || '',
            institution: profile.institution || '',
            address: profile.address || '',
        });
        setFormErrors({});
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setFormErrors({});
        setImageFile(null);
        setPhoto(`/api/account/picture/me?refresh=${new Date().getTime()}`);
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
                                <div className="font-extrabold text-2xl text-gray-900">
                                    {editMode ? `${tempProfile.firstName || ''} ${tempProfile.lastName || ''}` : `${profile.firstName} ${profile.lastName}`}
                                </div>
                                <div className="text-gray-500 text-sm font-medium">
                                    {editMode ? (tempProfile.position || 'Position') : (profile.position || 'Software Engineering')} 
                                    <span className="mx-1">|</span> 
                                    {editMode ? (tempProfile.email || 'Email') : profile.email}
                                </div>
                            </div>

                            {/* Success Message */}
                            {showSuccessMessage && (
                                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                                    <i className="fa-solid fa-check-circle"></i>
                                    <span className="font-semibold">Profile updated successfully!</span>
                                </div>
                            )}

                            {/* General Error Message */}
                            {formErrors.general && (
                                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                                    <i className="fa-solid fa-exclamation-triangle"></i>
                                    <span className="font-semibold">{formErrors.general}</span>
                                </div>
                            )}

                            <form className="w-full mt-2" onSubmit={handleSubmit}>
                                <div className="font-bold text-lg text-gray-900 mb-4">Contact Information</div>
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Username Field */}
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-600 font-semibold mb-1 md:mb-0">Username *</label>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                name="username"
                                                value={tempProfile.username || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none text-base font-semibold transition-colors ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                                        : 'bg-gray-50 border-gray-200'
                                                } ${formErrors.username ? 'border-red-500' : ''}`}
                                                placeholder="Enter username"
                                            />
                                            {formErrors.username && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <i className="fa-solid fa-exclamation-circle"></i>
                                                    {formErrors.username}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* First Name Field */}
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-600 font-semibold mb-1 md:mb-0">First Name *</label>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={tempProfile.firstName || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none text-base font-semibold transition-colors ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                                        : 'bg-gray-50 border-gray-200'
                                                } ${formErrors.firstName ? 'border-red-500' : ''}`}
                                                placeholder="Enter first name"
                                            />
                                            {formErrors.firstName && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <i className="fa-solid fa-exclamation-circle"></i>
                                                    {formErrors.firstName}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Last Name Field */}
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-600 font-semibold mb-1 md:mb-0">Last Name *</label>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={tempProfile.lastName || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none text-base font-semibold transition-colors ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                                        : 'bg-gray-50 border-gray-200'
                                                } ${formErrors.lastName ? 'border-red-500' : ''}`}
                                                placeholder="Enter last name"
                                            />
                                            {formErrors.lastName && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <i className="fa-solid fa-exclamation-circle"></i>
                                                    {formErrors.lastName}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Middle Name Field */}
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-600 font-semibold mb-1 md:mb-0">Middle Name</label>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                name="middleName"
                                                value={tempProfile.middleName || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none text-base font-semibold transition-colors ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                                        : 'bg-gray-50 border-gray-200'
                                                }`}
                                                placeholder="Enter middle name (optional)"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-600 font-semibold mb-1 md:mb-0">Email *</label>
                                        <div className="flex-1">
                                            <input
                                                type="email"
                                                name="email"
                                                value={tempProfile.email || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none text-base font-semibold transition-colors ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                                        : 'bg-gray-50 border-gray-200'
                                                } ${formErrors.email ? 'border-red-500' : ''}`}
                                                placeholder="Enter email address"
                                            />
                                            {formErrors.email && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <i className="fa-solid fa-exclamation-circle"></i>
                                                    {formErrors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {/* Phone Number Field */}
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-600 font-semibold mb-1 md:mb-0">Phone Number *</label>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                name="cellphone_no"
                                                value={tempProfile.cellphone_no || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none text-base font-semibold transition-colors ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                                        : 'bg-gray-50 border-gray-200'
                                                } ${formErrors.cellphone_no ? 'border-red-500' : ''}`}
                                                placeholder="09xxxxxxxxx"
                                            />
                                            {formErrors.cellphone_no && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <i className="fa-solid fa-exclamation-circle"></i>
                                                    {formErrors.cellphone_no}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Telephone Number Field */}
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-600 font-semibold mb-1 md:mb-0">Telephone</label>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                name="telephone_no"
                                                value={tempProfile.telephone_no || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none text-base font-semibold transition-colors ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                                        : 'bg-gray-50 border-gray-200'
                                                } ${formErrors.telephone_no ? 'border-red-500' : ''}`}
                                                placeholder="XXX-XXX-XXXX (optional)"
                                            />
                                            {formErrors.telephone_no && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <i className="fa-solid fa-exclamation-circle"></i>
                                                    {formErrors.telephone_no}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Address Field */}
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-600 font-semibold mb-1 md:mb-0">Address *</label>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                name="address"
                                                value={tempProfile.address || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none text-base font-semibold transition-colors ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                                        : 'bg-gray-50 border-gray-200'
                                                } ${formErrors.address ? 'border-red-500' : ''}`}
                                                placeholder="City, Province, Country"
                                            />
                                            {formErrors.address && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <i className="fa-solid fa-exclamation-circle"></i>
                                                    {formErrors.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Gender Field */}
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-600 font-semibold mb-1 md:mb-0">Gender *</label>
                                        <div className="flex-1">
                                            <select
                                                name="gender"
                                                value={tempProfile.gender || 'Male'}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none text-base font-semibold transition-colors ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                                        : 'bg-gray-50 border-gray-200'
                                                }`}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Client Profile Field */}
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                        <label className="w-32 text-gray-600 font-semibold mb-1 md:mb-0">Profile Type *</label>
                                        <div className="flex-1">
                                            <select
                                                name="client_profile"
                                                value={tempProfile.client_profile || 'Fishfolk'}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none text-base font-semibold transition-colors ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                                        : 'bg-gray-50 border-gray-200'
                                                }`}
                                            >
                                                <option value="Fishfolk">Fishfolk</option>
                                                <option value="Rural Based Org">Rural Based Org</option>
                                                <option value="Student">Student</option>
                                                <option value="Agricultural/Fisheries Technician">Agricultural/Fisheries Technician</option>
                                                <option value="Youth">Youth</option>
                                                <option value="Women">Women</option>
                                                <option value="Govt Employee">Govt Employee</option>
                                                <option value="PWD">PWD</option>
                                                <option value="Indigenous People">Indigenous People</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Professional Information Section */}
                                    <div className="border-t border-gray-200 pt-6 mt-6">
                                        <div className="font-bold text-lg text-gray-900 mb-4">Professional Information</div>
                                        
                                        {/* Occupation Field */}
                                        <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
                                            <label className="w-32 text-gray-600 font-semibold mb-1 md:mb-0">Occupation</label>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    name="occupation"
                                                    value={tempProfile.occupation || ''}
                                                    onChange={handleChange}
                                                    disabled={!editMode}
                                                    className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none text-base font-semibold transition-colors ${
                                                        editMode 
                                                            ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                                            : 'bg-gray-50 border-gray-200'
                                                    }`}
                                                    placeholder="Your occupation"
                                                />
                                            </div>
                                        </div>

                                        {/* Position Field */}
                                        <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
                                            <label className="w-32 text-gray-600 font-semibold mb-1 md:mb-0">Position</label>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    name="position"
                                                    value={tempProfile.position || ''}
                                                    onChange={handleChange}
                                                    disabled={!editMode}
                                                    className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none text-base font-semibold transition-colors ${
                                                        editMode 
                                                            ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                                            : 'bg-gray-50 border-gray-200'
                                                    }`}
                                                    placeholder="Your position/title"
                                                />
                                            </div>
                                        </div>

                                        {/* Institution Field */}
                                        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                            <label className="w-32 text-gray-600 font-semibold mb-1 md:mb-0">Institution</label>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    name="institution"
                                                    value={tempProfile.institution || ''}
                                                    onChange={handleChange}
                                                    disabled={!editMode}
                                                    className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none text-base font-semibold transition-colors ${
                                                        editMode 
                                                            ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                                            : 'bg-gray-50 border-gray-200'
                                                    }`}
                                                    placeholder="Company/Organization"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                                    {editMode ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 transition text-white rounded-lg font-bold text-base shadow focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center gap-2"
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={profileMutation.isPending || pictureMutation.isPending}
                                                className="px-8 py-3 bg-green-600 hover:bg-green-700 transition text-white rounded-lg font-bold text-base shadow focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {profileMutation.isPending || pictureMutation.isPending ? (
                                                    <>
                                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-save"></i>
                                                        Save Profile
                                                    </>
                                                )}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg font-bold text-base shadow focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
                                            onClick={handleEditMode}
                                        >
                                            <i className="fa-solid fa-edit"></i>
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
