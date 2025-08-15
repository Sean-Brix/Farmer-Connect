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
    const [activeTab, setActiveTab] = useState('personal');
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
                surname: profile.surname || '',
                middleName: profile.middleName || '',
                extensionName: profile.extensionName || '',
                sex: profile.sex || 'Male',
                client_profile: profile.client_profile || 'Student',
                
                // Contact Information
                mobileNumber: profile.mobileNumber || '',
                landlineNumber: profile.landlineNumber || '',
                
                // Address Information
                street: profile.street || '',
                barangay: profile.barangay || '',
                municipality: profile.municipality || '',
                province: profile.province || '',
                region: profile.region || '',
                houseNumber: profile.houseNumber || '',
                address: profile.address || '',
                
                // Birth Information
                birthMunicipality: profile.birthMunicipality || '',
                birthProvince: profile.birthProvince || '',
                birthCountry: profile.birthCountry || '',
                dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
                
                // Personal Details
                religion: profile.religion || '',
                otherReligionSpecify: profile.otherReligionSpecify || '',
                civilStatus: profile.civilStatus || '',
                spouseName: profile.spouseName || '',
                
                // Household Information
                femaleHouseholdMembers: profile.femaleHouseholdMembers || '',
                maleHouseholdMembers: profile.maleHouseholdMembers || '',
                isHouseholdHead: profile.isHouseholdHead || false,
                householdHeadName: profile.householdHeadName || '',
                relationshipToHead: profile.relationshipToHead || '',
                
                // Government ID Information
                hasGovId: profile.hasGovId || false,
                govIdType: profile.govIdType || '',
                govIdNumber: profile.govIdNumber || '',
                
                // Education
                education: profile.education || '',
                
                // PWD Information
                isPWD: profile.isPWD || false,
                disabilityType: profile.disabilityType || '',
                
                // Livelihood Information
                livelihoodProfile: profile.livelihoodProfile || [],
                farmingActivities: profile.farmingActivities || [],
                fishingActivities: profile.fishingActivities || [],
                farmworkActivities: profile.farmworkActivities || [],
                youthActivities: profile.youthActivities || [],
                otherCropsSpecify: profile.otherCropsSpecify || '',
                livestockSpecify: profile.livestockSpecify || '',
                fishingOthersSpecify: profile.fishingOthersSpecify || '',
                farmworkOthersSpecify: profile.farmworkOthersSpecify || '',
                youthOthersSpecify: profile.youthOthersSpecify || '',
                
                // Income Information
                grossAnnualIncome: profile.grossAnnualIncome || '',
                incomeSource: profile.incomeSource || '',
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
        if (!tempProfile.surname?.trim()) errors.surname = 'Surname is required';
        if (!tempProfile.mobileNumber?.trim()) errors.mobileNumber = 'Mobile number is required';
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (tempProfile.email && !emailRegex.test(tempProfile.email)) {
            errors.email = 'Invalid email format';
        }
        
        // Mobile phone validation (Philippine format)
        const mobileRegex = /^09\d{9}$/;
        if (tempProfile.mobileNumber && !mobileRegex.test(tempProfile.mobileNumber)) {
            errors.mobileNumber = 'Invalid mobile format. Must start with 09 and be 11 digits';
        }
        
        // Landline validation (if provided)
        if (tempProfile.landlineNumber && tempProfile.landlineNumber.trim()) {
            const landlineRegex = /^\d{3}-\d{3}-\d{4}$/;
            if (!landlineRegex.test(tempProfile.landlineNumber)) {
                errors.landlineNumber = 'Invalid landline format. Use XXX-XXX-XXXX';
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
            if (error.message.includes('Required fields')) {
                setFormErrors({ general: 'Please fill in all required fields' });
            } else if (error.message.includes('Invalid email')) {
                setFormErrors({ email: 'Invalid email format' });
            } else if (error.message.includes('Invalid mobile')) {
                setFormErrors({ mobileNumber: 'Invalid mobile number format' });
            } else if (error.message.includes('Invalid landline')) {
                setFormErrors({ landlineNumber: 'Invalid landline format' });
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
            surname: profile.surname || '',
            middleName: profile.middleName || '',
            extensionName: profile.extensionName || '',
            sex: profile.sex || 'Male',
            client_profile: profile.client_profile || 'Student',
            
            // Contact Information
            mobileNumber: profile.mobileNumber || '',
            landlineNumber: profile.landlineNumber || '',
            
            // Address Information
            street: profile.street || '',
            barangay: profile.barangay || '',
            municipality: profile.municipality || '',
            province: profile.province || '',
            region: profile.region || '',
            houseNumber: profile.houseNumber || '',
            address: profile.address || '',
            
            // Birth Information
            birthMunicipality: profile.birthMunicipality || '',
            birthProvince: profile.birthProvince || '',
            birthCountry: profile.birthCountry || '',
            dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
            
            // Personal Details
            religion: profile.religion || '',
            otherReligionSpecify: profile.otherReligionSpecify || '',
            civilStatus: profile.civilStatus || '',
            spouseName: profile.spouseName || '',
            
            // Household Information
            femaleHouseholdMembers: profile.femaleHouseholdMembers || '',
            maleHouseholdMembers: profile.maleHouseholdMembers || '',
            isHouseholdHead: profile.isHouseholdHead || false,
            householdHeadName: profile.householdHeadName || '',
            relationshipToHead: profile.relationshipToHead || '',
            
            // Government ID Information
            hasGovId: profile.hasGovId || false,
            govIdType: profile.govIdType || '',
            govIdNumber: profile.govIdNumber || '',
            
            // Education
            education: profile.education || '',
            
            // PWD Information
            isPWD: profile.isPWD || false,
            disabilityType: profile.disabilityType || '',
            
            // Livelihood Information
            livelihoodProfile: profile.livelihoodProfile || [],
            farmingActivities: profile.farmingActivities || [],
            fishingActivities: profile.fishingActivities || [],
            farmworkActivities: profile.farmworkActivities || [],
            youthActivities: profile.youthActivities || [],
            otherCropsSpecify: profile.otherCropsSpecify || '',
            livestockSpecify: profile.livestockSpecify || '',
            fishingOthersSpecify: profile.fishingOthersSpecify || '',
            farmworkOthersSpecify: profile.farmworkOthersSpecify || '',
            youthOthersSpecify: profile.youthOthersSpecify || '',
            
            // Income Information
            grossAnnualIncome: profile.grossAnnualIncome || '',
            incomeSource: profile.incomeSource || '',
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
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-20">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white py-12 shadow-lg">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Profile Picture Section */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
                                    <img 
                                        src={photo} 
                                        alt="Profile" 
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                {editMode && (
                                    <label className="absolute bottom-2 right-2 bg-white text-green-600 rounded-full p-3 cursor-pointer hover:bg-green-50 transition shadow-lg border-2 border-green-200">
                                        <i className="fa-solid fa-camera text-lg"></i>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl font-bold mb-2">
                                    {editMode 
                                        ? `${tempProfile.firstName || ''} ${tempProfile.middleName ? tempProfile.middleName + ' ' : ''}${tempProfile.surname || ''}${tempProfile.extensionName ? ' ' + tempProfile.extensionName : ''}` 
                                        : `${profile.firstName} ${profile.middleName ? profile.middleName + ' ' : ''}${profile.surname}${profile.extensionName ? ' ' + profile.extensionName : ''}`
                                    }
                                </h1>
                                <div className="flex flex-col md:flex-row gap-2 mb-4">
                                    <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                                        <i className="fa-solid fa-user"></i>
                                        {editMode ? (tempProfile.client_profile || 'Profile Type') : (profile.client_profile || 'Profile Type')}
                                    </span>
                                    <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                                        <i className="fa-solid fa-envelope"></i>
                                        {editMode ? (tempProfile.email || 'Email') : profile.email}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <i className="fa-solid fa-flag text-green-200"></i>
                                    <span className="text-green-100">Philippines</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="ml-auto">
                                {editMode ? (
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 transition text-white rounded-lg font-semibold shadow-lg flex items-center gap-2"
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className="px-8 py-3 bg-white text-green-700 hover:bg-green-50 transition rounded-lg font-semibold shadow-lg flex items-center gap-2"
                                        onClick={handleEditMode}
                                    >
                                        <i className="fa-solid fa-edit"></i>
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-6 py-8">
                    {/* Success Message */}
                    {showSuccessMessage && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl flex items-center gap-3 shadow-sm">
                            <i className="fa-solid fa-check-circle text-xl"></i>
                            <span className="font-semibold">Profile updated successfully!</span>
                        </div>
                    )}

                    {/* General Error Message */}
                    {formErrors.general && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl flex items-center gap-3 shadow-sm">
                            <i className="fa-solid fa-exclamation-triangle text-xl"></i>
                            <span className="font-semibold">{formErrors.general}</span>
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                {[
                                    { id: 'personal', name: 'Personal Info', icon: 'fa-user' },
                                    { id: 'contact', name: 'Contact & Address', icon: 'fa-map-marker-alt' },
                                    { id: 'family', name: 'Family & Background', icon: 'fa-users' },
                                    { id: 'professional', name: 'Professional Info', icon: 'fa-briefcase' },
                                    { id: 'government', name: 'Government & IDs', icon: 'fa-id-card' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`${
                                            activeTab === tab.id
                                                ? 'border-green-500 text-green-600 bg-green-50'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 rounded-t-lg`}
                                    >
                                        <i className={`fa-solid ${tab.icon}`}></i>
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            {/* Personal Information Tab */}
                            {activeTab === 'personal' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <i className="fa-solid fa-user text-green-600 text-xl"></i>
                                        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Username */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <i className="fa-solid fa-at text-green-500"></i>
                                                Username *
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={tempProfile.username || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                                } ${formErrors.username ? 'border-red-500' : ''}`}
                                                placeholder="Enter username"
                                            />
                                            {formErrors.username && (
                                                <p className="text-red-500 text-sm flex items-center gap-1">
                                                    <i className="fa-solid fa-exclamation-circle"></i>
                                                    {formErrors.username}
                                                </p>
                                            )}
                                        </div>

                                        {/* First Name */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <i className="fa-solid fa-signature text-green-500"></i>
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={tempProfile.firstName || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                                } ${formErrors.firstName ? 'border-red-500' : ''}`}
                                                placeholder="Enter first name"
                                            />
                                            {formErrors.firstName && (
                                                <p className="text-red-500 text-sm flex items-center gap-1">
                                                    <i className="fa-solid fa-exclamation-circle"></i>
                                                    {formErrors.firstName}
                                                </p>
                                            )}
                                        </div>

                                        {/* Middle Name */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <i className="fa-solid fa-signature text-green-500"></i>
                                                Middle Name
                                            </label>
                                            <input
                                                type="text"
                                                name="middleName"
                                                value={tempProfile.middleName || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                                }`}
                                                placeholder="Enter middle name (optional)"
                                            />
                                        </div>

                                        {/* Surname */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <i className="fa-solid fa-signature text-green-500"></i>
                                                Surname *
                                            </label>
                                            <input
                                                type="text"
                                                name="surname"
                                                value={tempProfile.surname || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                                } ${formErrors.surname ? 'border-red-500' : ''}`}
                                                placeholder="Enter surname"
                                            />
                                            {formErrors.surname && (
                                                <p className="text-red-500 text-sm flex items-center gap-1">
                                                    <i className="fa-solid fa-exclamation-circle"></i>
                                                    {formErrors.surname}
                                                </p>
                                            )}
                                        </div>

                                        {/* Extension Name */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <i className="fa-solid fa-plus text-green-500"></i>
                                                Extension Name
                                            </label>
                                            <select
                                                name="extensionName"
                                                value={tempProfile.extensionName || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                                }`}
                                            >
                                                <option value="">None</option>
                                                <option value="Jr.">Jr.</option>
                                                <option value="Sr.">Sr.</option>
                                                <option value="II">II</option>
                                                <option value="III">III</option>
                                                <option value="IV">IV</option>
                                                <option value="V">V</option>
                                            </select>
                                        </div>

                                        {/* Sex */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <i className="fa-solid fa-venus-mars text-green-500"></i>
                                                Sex *
                                            </label>
                                            <select
                                                name="sex"
                                                value={tempProfile.sex || 'Male'}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                                }`}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        {/* Date of Birth */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <i className="fa-solid fa-calendar text-green-500"></i>
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={tempProfile.dateOfBirth || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                                }`}
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <i className="fa-solid fa-envelope text-green-500"></i>
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={tempProfile.email || ''}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                    editMode 
                                                        ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                                } ${formErrors.email ? 'border-red-500' : ''}`}
                                                placeholder="Enter email address"
                                            />
                                            {formErrors.email && (
                                                <p className="text-red-500 text-sm flex items-center gap-1">
                                                    <i className="fa-solid fa-exclamation-circle"></i>
                                                    {formErrors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Contact & Address Tab */}
                            {activeTab === 'contact' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <i className="fa-solid fa-map-marker-alt text-green-600 text-xl"></i>
                                        <h2 className="text-2xl font-bold text-gray-900">Contact & Address Information</h2>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Contact Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <i className="fa-solid fa-phone text-green-500"></i>
                                                Contact Details
                                            </h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Mobile Number */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-mobile-alt text-green-500"></i>
                                                        Mobile Number *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="mobileNumber"
                                                        value={tempProfile.mobileNumber || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        } ${formErrors.mobileNumber ? 'border-red-500' : ''}`}
                                                        placeholder="09xxxxxxxxx"
                                                    />
                                                    {formErrors.mobileNumber && (
                                                        <p className="text-red-500 text-sm flex items-center gap-1">
                                                            <i className="fa-solid fa-exclamation-circle"></i>
                                                            {formErrors.mobileNumber}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Landline Number */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-phone text-green-500"></i>
                                                        Landline Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="landlineNumber"
                                                        value={tempProfile.landlineNumber || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        } ${formErrors.landlineNumber ? 'border-red-500' : ''}`}
                                                        placeholder="XXX-XXX-XXXX (optional)"
                                                    />
                                                    {formErrors.landlineNumber && (
                                                        <p className="text-red-500 text-sm flex items-center gap-1">
                                                            <i className="fa-solid fa-exclamation-circle"></i>
                                                            {formErrors.landlineNumber}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <i className="fa-solid fa-map-pin text-green-500"></i>
                                                Address Details
                                            </h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* House Number */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-home text-green-500"></i>
                                                        House Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="houseNumber"
                                                        value={tempProfile.houseNumber || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                        placeholder="House number"
                                                    />
                                                </div>

                                                {/* Street */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-road text-green-500"></i>
                                                        Street
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="street"
                                                        value={tempProfile.street || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                        placeholder="Street name"
                                                    />
                                                </div>

                                                {/* Barangay */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-map-pin text-green-500"></i>
                                                        Barangay
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="barangay"
                                                        value={tempProfile.barangay || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                        placeholder="Barangay"
                                                    />
                                                </div>

                                                {/* Municipality */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-city text-green-500"></i>
                                                        Municipality
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="municipality"
                                                        value={tempProfile.municipality || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                        placeholder="Municipality"
                                                    />
                                                </div>

                                                {/* Province */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-globe text-green-500"></i>
                                                        Province
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="province"
                                                        value={tempProfile.province || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                        placeholder="Province"
                                                    />
                                                </div>

                                                {/* Region */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-map text-green-500"></i>
                                                        Region
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="region"
                                                        value={tempProfile.region || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                        placeholder="Region"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Family & Background Tab */}
                            {activeTab === 'family' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <i className="fa-solid fa-users text-green-600 text-xl"></i>
                                        <h2 className="text-2xl font-bold text-gray-900">Family & Background Information</h2>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Birth Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <i className="fa-solid fa-baby text-green-500"></i>
                                                Birth Details
                                            </h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Birth Municipality */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-map-marker-alt text-green-500"></i>
                                                        Birth Municipality
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="birthMunicipality"
                                                        value={tempProfile.birthMunicipality || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                        placeholder="Municipality of birth"
                                                    />
                                                </div>

                                                {/* Birth Province */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-map-marker-alt text-green-500"></i>
                                                        Birth Province
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="birthProvince"
                                                        value={tempProfile.birthProvince || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                        placeholder="Province of birth"
                                                    />
                                                </div>

                                                {/* Birth Country */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-flag text-green-500"></i>
                                                        Birth Country
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="birthCountry"
                                                        value={tempProfile.birthCountry || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                        placeholder="Country of birth"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Personal & Family Details */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <i className="fa-solid fa-heart text-green-500"></i>
                                                Personal & Family
                                            </h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Religion */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-praying-hands text-green-500"></i>
                                                        Religion
                                                    </label>
                                                    <select
                                                        name="religion"
                                                        value={tempProfile.religion || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                    >
                                                        <option value="">Select Religion</option>
                                                        <option value="Roman Catholic">Roman Catholic</option>
                                                        <option value="Protestant">Protestant</option>
                                                        <option value="Islam">Islam</option>
                                                        <option value="Buddhism">Buddhism</option>
                                                        <option value="Judaism">Judaism</option>
                                                        <option value="Hinduism">Hinduism</option>
                                                        <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                                                        <option value="Born Again">Born Again</option>
                                                        <option value="Jehovah's Witness">Jehovah's Witness</option>
                                                        <option value="Others">Others</option>
                                                        <option value="No Religion">No Religion</option>
                                                    </select>
                                                </div>

                                                {/* Other Religion Specify */}
                                                {tempProfile.religion === 'Others' && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                            <i className="fa-solid fa-edit text-green-500"></i>
                                                            Specify Religion
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="otherReligionSpecify"
                                                            value={tempProfile.otherReligionSpecify || ''}
                                                            onChange={handleChange}
                                                            disabled={!editMode}
                                                            className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                                editMode 
                                                                    ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                    : 'bg-gray-50 border-gray-200 text-gray-600'
                                                            }`}
                                                            placeholder="Please specify"
                                                        />
                                                    </div>
                                                )}

                                                {/* Civil Status */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-ring text-green-500"></i>
                                                        Civil Status
                                                    </label>
                                                    <select
                                                        name="civilStatus"
                                                        value={tempProfile.civilStatus || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                    >
                                                        <option value="">Select Civil Status</option>
                                                        <option value="Single">Single</option>
                                                        <option value="Married">Married</option>
                                                        <option value="Separated">Separated</option>
                                                        <option value="Divorced">Divorced</option>
                                                        <option value="Widowed">Widowed</option>
                                                        <option value="Live-in">Live-in</option>
                                                    </select>
                                                </div>

                                                {/* Spouse Name */}
                                                {(tempProfile.civilStatus === 'Married' || tempProfile.civilStatus === 'Live-in') && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                            <i className="fa-solid fa-heart text-green-500"></i>
                                                            Spouse Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="spouseName"
                                                            value={tempProfile.spouseName || ''}
                                                            onChange={handleChange}
                                                            disabled={!editMode}
                                                            className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                                editMode 
                                                                    ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                    : 'bg-gray-50 border-gray-200 text-gray-600'
                                                            }`}
                                                            placeholder="Enter spouse name"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Household Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <i className="fa-solid fa-home-user text-green-500"></i>
                                                Household Information
                                            </h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Female Household Members */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-female text-green-500"></i>
                                                        Female Household Members
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="femaleHouseholdMembers"
                                                        value={tempProfile.femaleHouseholdMembers || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                        placeholder="Number of female members"
                                                        min="0"
                                                    />
                                                </div>

                                                {/* Male Household Members */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-male text-green-500"></i>
                                                        Male Household Members
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="maleHouseholdMembers"
                                                        value={tempProfile.maleHouseholdMembers || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                        placeholder="Number of male members"
                                                        min="0"
                                                    />
                                                </div>

                                                {/* Household Head Status */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-crown text-green-500"></i>
                                                        Are you the Household Head?
                                                    </label>
                                                    <select
                                                        name="isHouseholdHead"
                                                        value={tempProfile.isHouseholdHead ? 'true' : 'false'}
                                                        onChange={(e) => handleChange({...e, target: {...e.target, name: 'isHouseholdHead', value: e.target.value === 'true'}})}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                    >
                                                        <option value="false">No</option>
                                                        <option value="true">Yes</option>
                                                    </select>
                                                </div>

                                                {/* Household Head Name */}
                                                {!tempProfile.isHouseholdHead && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                            <i className="fa-solid fa-user-crown text-green-500"></i>
                                                            Household Head Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="householdHeadName"
                                                            value={tempProfile.householdHeadName || ''}
                                                            onChange={handleChange}
                                                            disabled={!editMode}
                                                            className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                                editMode 
                                                                    ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                    : 'bg-gray-50 border-gray-200 text-gray-600'
                                                            }`}
                                                            placeholder="Name of household head"
                                                        />
                                                    </div>
                                                )}

                                                {/* Relationship to Head */}
                                                {!tempProfile.isHouseholdHead && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                            <i className="fa-solid fa-sitemap text-green-500"></i>
                                                            Relationship to Head
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="relationshipToHead"
                                                            value={tempProfile.relationshipToHead || ''}
                                                            onChange={handleChange}
                                                            disabled={!editMode}
                                                            className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                                editMode 
                                                                    ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                    : 'bg-gray-50 border-gray-200 text-gray-600'
                                                            }`}
                                                            placeholder="e.g., spouse, child, parent"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Professional Information Tab */}
                            {activeTab === 'professional' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <i className="fa-solid fa-briefcase text-green-600 text-xl"></i>
                                        <h2 className="text-2xl font-bold text-gray-900">Professional Information</h2>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Education & Profile */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <i className="fa-solid fa-graduation-cap text-green-500"></i>
                                                Education & Profile
                                            </h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Education */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-book text-green-500"></i>
                                                        Education Level
                                                    </label>
                                                    <select
                                                        name="education"
                                                        value={tempProfile.education || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                    >
                                                        <option value="">Select Education Level</option>
                                                        <option value="No_formal_education">No formal education</option>
                                                        <option value="Kinder">Kinder</option>
                                                        <option value="Elementary_level">Elementary level</option>
                                                        <option value="Elementary_graduate">Elementary graduate</option>
                                                        <option value="High_school_level">High school level</option>
                                                        <option value="High_school_graduate">High school graduate</option>
                                                        <option value="Senior_high_school_level">Senior high school level</option>
                                                        <option value="Senior_high_school_graduate">Senior high school graduate</option>
                                                        <option value="College_level">College level</option>
                                                        <option value="College_graduate">College graduate</option>
                                                        <option value="Post_graduate_studies">Post-graduate studies</option>
                                                        <option value="Vocational_Technical">Vocational/Technical</option>
                                                    </select>
                                                </div>

                                                {/* Client Profile Type */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-user-tag text-green-500"></i>
                                                        Profile Type *
                                                    </label>
                                                    <select
                                                        name="client_profile"
                                                        value={tempProfile.client_profile || 'Student'}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                    >
                                                        <option value="Fishfolk">Fishfolk</option>
                                                        <option value="Rural_Based_Org">Rural Based Org</option>
                                                        <option value="Student">Student</option>
                                                        <option value="Agricultural_Fisheries_Technician">Agricultural/Fisheries Technician</option>
                                                        <option value="Youth">Youth</option>
                                                        <option value="Women">Women</option>
                                                        <option value="Govt_Employee">Govt Employee</option>
                                                        <option value="PWD">PWD</option>
                                                        <option value="Indigenous_People">Indigenous People</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Disability Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <i className="fa-solid fa-wheelchair text-green-500"></i>
                                                Disability Information
                                            </h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* PWD Status */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-universal-access text-green-500"></i>
                                                        Person with Disability (PWD)
                                                    </label>
                                                    <select
                                                        name="isPWD"
                                                        value={tempProfile.isPWD ? 'true' : 'false'}
                                                        onChange={(e) => handleChange({...e, target: {...e.target, name: 'isPWD', value: e.target.value === 'true'}})}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                    >
                                                        <option value="false">No</option>
                                                        <option value="true">Yes</option>
                                                    </select>
                                                </div>

                                                {/* Disability Type */}
                                                {tempProfile.isPWD && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                            <i className="fa-solid fa-notes-medical text-green-500"></i>
                                                            Disability Type
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="disabilityType"
                                                            value={tempProfile.disabilityType || ''}
                                                            onChange={handleChange}
                                                            disabled={!editMode}
                                                            className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                                editMode 
                                                                    ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                    : 'bg-gray-50 border-gray-200 text-gray-600'
                                                            }`}
                                                            placeholder="Specify disability type"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Income Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <i className="fa-solid fa-money-bill text-green-500"></i>
                                                Income Information
                                            </h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Gross Annual Income */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-peso-sign text-green-500"></i>
                                                        Gross Annual Income
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="grossAnnualIncome"
                                                        value={tempProfile.grossAnnualIncome || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                        placeholder="Annual income amount"
                                                    />
                                                </div>

                                                {/* Income Source */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-chart-line text-green-500"></i>
                                                        Income Source
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="incomeSource"
                                                        value={tempProfile.incomeSource || ''}
                                                        onChange={handleChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                        placeholder="Primary source of income"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Government & IDs Tab */}
                            {activeTab === 'government' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <i className="fa-solid fa-id-card text-green-600 text-xl"></i>
                                        <h2 className="text-2xl font-bold text-gray-900">Government & ID Information</h2>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Government ID Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <i className="fa-solid fa-id-badge text-green-500"></i>
                                                Government Identification
                                            </h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Has Government ID */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <i className="fa-solid fa-check-circle text-green-500"></i>
                                                        Has Government ID
                                                    </label>
                                                    <select
                                                        name="hasGovId"
                                                        value={tempProfile.hasGovId ? 'true' : 'false'}
                                                        onChange={(e) => handleChange({...e, target: {...e.target, name: 'hasGovId', value: e.target.value === 'true'}})}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                            editMode 
                                                                ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}
                                                    >
                                                        <option value="false">No</option>
                                                        <option value="true">Yes</option>
                                                    </select>
                                                </div>

                                                {/* Government ID Type */}
                                                {tempProfile.hasGovId && (
                                                    <>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                                <i className="fa-solid fa-id-card-alt text-green-500"></i>
                                                                Government ID Type
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="govIdType"
                                                                value={tempProfile.govIdType || ''}
                                                                onChange={handleChange}
                                                                disabled={!editMode}
                                                                className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                                    editMode 
                                                                        ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                                                }`}
                                                                placeholder="e.g., National ID, Driver's License"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                                <i className="fa-solid fa-hashtag text-green-500"></i>
                                                                Government ID Number
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="govIdNumber"
                                                                value={tempProfile.govIdNumber || ''}
                                                                onChange={handleChange}
                                                                disabled={!editMode}
                                                                className={`w-full border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                                                                    editMode 
                                                                        ? 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm' 
                                                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                                                }`}
                                                                placeholder="ID number"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Save Button - Show only in edit mode */}
                            {editMode && (
                                <div className="flex justify-end pt-8 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={profileMutation.isPending || pictureMutation.isPending}
                                        className="px-12 py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 flex items-center gap-3 disabled:cursor-not-allowed"
                                    >
                                        {profileMutation.isPending || pictureMutation.isPending ? (
                                            <>
                                                <i className="fa-solid fa-spinner fa-spin"></i>
                                                Saving Changes...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-save"></i>
                                                Save Profile
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Delete Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                            <div className="text-center">
                                <i className="fa-solid fa-triangle-exclamation text-red-500 text-4xl mb-4"></i>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account</h3>
                                <p className="text-gray-600 mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
                                <div className="flex gap-3">
                                    <button
                                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                html, body, #root {
                    background: linear-gradient(135deg, #f0fdf4, #ecfdf5, #f0fdfa);
                }
                html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>
    );
}
