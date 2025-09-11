import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ProfileSettings = () => {
  const { isDark } = useTheme();
  const [profileImage, setProfileImage] = useState('/api/account/picture/me');
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    position: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    civilStatus: '',
    occupation: ''
  });
  const [tempUserInfo, setTempUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/account/details/me');
        const data = await response.json();
        
        if (response.ok) {
          const profileData = {
            firstName: data.firstname || data.firstName || '',
            lastName: data.lastname || data.surname || '',
            middleName: data.middlename || data.middleName || '',
            username: data.username || '',
            email: data.email_address || data.email || '',
            phone: data.cellphone_no || data.mobileNumber || '',
            bio: data.bio || '',
            position: data.position || '',
            address: data.address || '',
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
            gender: data.sex || data.gender || '',
            civilStatus: data.civilStatus || '',
            occupation: data.occupation || ''
          };
          setUserInfo(profileData);
          setTempUserInfo(profileData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempUserInfo({ ...userInfo });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempUserInfo({ ...userInfo });
  };

  const handleInputChange = (field, value) => {
    setTempUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would typically make an API call to save the data
      // const response = await fetch('/api/account/update', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(tempUserInfo)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserInfo({ ...tempUserInfo });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: isDark ? '#ffffff' : '#111827' }}
          >
            Profile Information
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
          >
            {isEditing ? 'Update your profile information' : 'View and manage your profile details'}
          </p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
          >
            <i className="fas fa-edit"></i>
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl font-medium border transition-colors"
              style={{
                borderColor: isDark ? '#4b5563' : '#d1d5db',
                color: isDark ? '#d1d5db' : '#374151',
                backgroundColor: 'transparent'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Profile Picture */}
      <div 
        className="p-6 rounded-2xl border"
        style={{ 
          backgroundColor: isDark ? '#374151' : '#f9fafb',
          borderColor: isDark ? '#4b5563' : '#e5e7eb'
        }}
      >
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
          Profile Picture
        </h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-emerald-200"
              onError={(e) => {
                e.target.src = '/src/Assets/default_picture.png';
              }}
            />
            {isEditing && (
              <button
                onClick={() => document.getElementById('profile-image-input').click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                <i className="fas fa-camera text-sm"></i>
              </button>
            )}
            {isEditing && (
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            )}
          </div>
          <div>
            <p 
              className="text-sm font-medium mb-1"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {userInfo.firstName} {userInfo.lastName}
            </p>
            <p 
              className="text-sm"
              style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
            >
              {userInfo.position || 'Member'}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div 
        className="p-6 rounded-2xl border"
        style={{ 
          backgroundColor: isDark ? '#374151' : '#f9fafb',
          borderColor: isDark ? '#4b5563' : '#e5e7eb'
        }}
      >
        <h3 
          className="text-lg font-semibold mb-6"
          style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempUserInfo.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full p-3 rounded-xl border transition-colors"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              />
            ) : (
              <div 
                className="w-full p-3 rounded-xl border bg-gray-50"
                style={{
                  backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {userInfo.firstName || 'Not specified'}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempUserInfo.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full p-3 rounded-xl border transition-colors"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              />
            ) : (
              <div 
                className="w-full p-3 rounded-xl border bg-gray-50"
                style={{
                  backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {userInfo.lastName || 'Not specified'}
              </div>
            )}
          </div>

          {/* Middle Name */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              Middle Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempUserInfo.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                className="w-full p-3 rounded-xl border transition-colors"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              />
            ) : (
              <div 
                className="w-full p-3 rounded-xl border bg-gray-50"
                style={{
                  backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {userInfo.middleName || 'Not specified'}
              </div>
            )}
          </div>

          {/* Username */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempUserInfo.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full p-3 rounded-xl border transition-colors"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              />
            ) : (
              <div 
                className="w-full p-3 rounded-xl border bg-gray-50"
                style={{
                  backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {userInfo.username || 'Not specified'}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={tempUserInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 rounded-xl border transition-colors"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              />
            ) : (
              <div 
                className="w-full p-3 rounded-xl border bg-gray-50"
                style={{
                  backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {userInfo.email || 'Not specified'}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={tempUserInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-3 rounded-xl border transition-colors"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              />
            ) : (
              <div 
                className="w-full p-3 rounded-xl border bg-gray-50"
                style={{
                  backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {userInfo.phone || 'Not specified'}
              </div>
            )}
          </div>

          {/* Gender */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              Gender
            </label>
            {isEditing ? (
              <select
                value={tempUserInfo.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full p-3 rounded-xl border transition-colors"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            ) : (
              <div 
                className="w-full p-3 rounded-xl border bg-gray-50"
                style={{
                  backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {userInfo.gender || 'Not specified'}
              </div>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              Date of Birth
            </label>
            {isEditing ? (
              <input
                type="date"
                value={tempUserInfo.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full p-3 rounded-xl border transition-colors"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              />
            ) : (
              <div 
                className="w-full p-3 rounded-xl border bg-gray-50"
                style={{
                  backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toLocaleDateString() : 'Not specified'}
              </div>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempUserInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full p-3 rounded-xl border transition-colors"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#111827'
                }}
                placeholder="Enter your full address"
              />
            ) : (
              <div 
                className="w-full p-3 rounded-xl border bg-gray-50"
                style={{
                  backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {userInfo.address || 'Not specified'}
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              Bio
            </label>
            {isEditing ? (
              <textarea
                rows="4"
                value={tempUserInfo.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full p-3 rounded-xl border transition-colors resize-none"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#111827'
                }}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <div 
                className="w-full p-3 rounded-xl border bg-gray-50 min-h-[100px]"
                style={{
                  backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {userInfo.bio || 'No bio available'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div 
        className="p-6 rounded-2xl border"
        style={{ 
          backgroundColor: isDark ? '#374151' : '#f9fafb',
          borderColor: isDark ? '#4b5563' : '#e5e7eb'
        }}
      >
        <h3 
          className="text-lg font-semibold mb-6"
          style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
          Professional Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Position */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              Position/Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempUserInfo.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full p-3 rounded-xl border transition-colors"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#111827'
                }}
                placeholder="e.g., Farmer, Agricultural Officer"
              />
            ) : (
              <div 
                className="w-full p-3 rounded-xl border bg-gray-50"
                style={{
                  backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {userInfo.position || 'Not specified'}
              </div>
            )}
          </div>

          {/* Occupation */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              Occupation
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempUserInfo.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                className="w-full p-3 rounded-xl border transition-colors"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#111827'
                }}
                placeholder="e.g., Rice Farmer, Vegetable Grower"
              />
            ) : (
              <div 
                className="w-full p-3 rounded-xl border bg-gray-50"
                style={{
                  backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {userInfo.occupation || 'Not specified'}
              </div>
            )}
          </div>

          {/* Civil Status */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              Civil Status
            </label>
            {isEditing ? (
              <select
                value={tempUserInfo.civilStatus}
                onChange={(e) => handleInputChange('civilStatus', e.target.value)}
                className="w-full p-3 rounded-xl border transition-colors"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
                <option value="Separated">Separated</option>
              </select>
            ) : (
              <div 
                className="w-full p-3 rounded-xl border bg-gray-50"
                style={{
                  backgroundColor: isDark ? '#2d3748' : '#f8f9fa',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {userInfo.civilStatus || 'Not specified'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
