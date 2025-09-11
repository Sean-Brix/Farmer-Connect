import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

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
  const [showSuccess, setShowSuccess] = useState(false);

  // Load user data - same function as before
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/account/details/me');
        const data = await response.json();
        
        if (response.ok) {
          const profileData = {
            firstName: data.firstName || '',
            lastName: data.surname || '',
            middleName: data.middleName || '',
            username: data.username || '',
            email: data.email || '',
            phone: data.mobileNumber || '',
            bio: data.bio || '',
            position: data.client_profile || 'Administrator',
            address: data.address || '',
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
            gender: data.sex || '',
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

  // Handle edit mode - same function as before
  const handleEdit = () => {
    setIsEditing(true);
    setTempUserInfo({ ...userInfo });
  };

  // Handle cancel - same function as before
  const handleCancel = () => {
    setIsEditing(false);
    setTempUserInfo({ ...userInfo });
  };

  // Handle input changes - same function as before
  const handleInputChange = (field, value) => {
    setTempUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image change - same function as before
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result);
        // You can also update tempUserInfo to include the image file
        setTempUserInfo(prev => ({ ...prev, profileImage: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save - enhanced function with admin-specific API calls
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/account/details/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: tempUserInfo.firstName,
          surname: tempUserInfo.lastName,
          middleName: tempUserInfo.middleName,
          email: tempUserInfo.email,
          mobileNumber: tempUserInfo.phone,
          username: tempUserInfo.username,
          sex: tempUserInfo.gender,
          address: tempUserInfo.address,
          dateOfBirth: tempUserInfo.dateOfBirth,
          civilStatus: tempUserInfo.civilStatus,
          // Required fields for admin
          client_profile: 'Administrator'
        }),
      });

      if (response.ok) {
        setUserInfo({ ...tempUserInfo });
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const errorText = await response.text();
        console.error('Failed to save profile:', errorText);
        alert('Failed to save profile. Please check the console for details.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please check the console for details.');
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
    <div className="space-y-8 pb-8 mt-6">
      {/* Success notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div 
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 ${
              isDark ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
            }`}
          >
            <i className="fas fa-check-circle text-lg"></i>
            <span className="font-medium">Profile updated successfully!</span>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 
            className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Profile Information
          </h2>
          <p 
            className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
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
              className={`px-4 py-2 rounded-xl font-medium border transition-colors ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
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
        className={`p-6 rounded-2xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <h3 
          className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
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
              className={`text-sm font-medium mb-1 ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              {userInfo.firstName} {userInfo.lastName}
            </p>
            <p 
              className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {userInfo.position || 'Administrator'}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div 
        className={`p-6 rounded-2xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <h3 
          className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label 
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempUserInfo.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            ) : (
              <div 
                className={`px-3 py-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                }`}
              >
                {userInfo.firstName || 'Not specified'}
              </div>
            )}
          </div>

          <div>
            <label 
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempUserInfo.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            ) : (
              <div 
                className={`px-3 py-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                }`}
              >
                {userInfo.lastName || 'Not specified'}
              </div>
            )}
          </div>

          <div>
            <label 
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={tempUserInfo.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            ) : (
              <div 
                className={`px-3 py-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                }`}
              >
                {userInfo.email || 'Not specified'}
              </div>
            )}
          </div>

          <div>
            <label 
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={tempUserInfo.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            ) : (
              <div 
                className={`px-3 py-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                }`}
              >
                {userInfo.phone || 'Not specified'}
              </div>
            )}
          </div>

          <div>
            <label 
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Position
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempUserInfo.position || ''}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            ) : (
              <div 
                className={`px-3 py-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                }`}
              >
                {userInfo.position || 'Administrator'}
              </div>
            )}
          </div>

          <div>
            <label 
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Username
            </label>
            <div 
              className={`px-3 py-2 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600 text-gray-500' : 'bg-gray-100 border-gray-200 text-gray-500'
              }`}
            >
              {userInfo.username || 'Not specified'}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label 
            className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={tempUserInfo.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <div 
              className={`px-3 py-2 min-h-[80px] rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}
            >
              {userInfo.bio || 'No bio available'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
