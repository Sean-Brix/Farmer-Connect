import React, { useState, useEffect } from 'react';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';
import useImageCache, { clearImageCache } from '../../hooks/useImageCache';

const ProfileSettings = () => {
  const { t } = useCustomTranslation();
  const { isDark } = useTheme();
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    extensionName: '',
    username: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    client_profile: ''
  });
  const [tempUserInfo, setTempUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Use image cache for profile picture
  const { imageUrl, refresh: refreshImage } = useImageCache(userId, true);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        console.log('📋 [ProfileSettings] Loading user data...');
        const response = await fetch('/api/account/details/me');
        const data = await response.json();
        
        if (response.ok) {
          console.log('📋 [ProfileSettings] User data loaded:', data);
          setUserId(data.id);
          const profileData = {
            firstName: data.firstName || '',
            lastName: data.surname || '',
            middleName: data.middleName || '',
            extensionName: data.extensionName || '',
            username: data.username || '',
            email: data.email || '',
            phone: data.contactNumber || '',
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
            gender: data.sex || 'Male',
            client_profile: data.client_profile || 'Other'
          };
          setUserInfo(profileData);
          setTempUserInfo(profileData);
        }
      } catch (error) {
        console.error('📋 [ProfileSettings] ✗ Error loading user data:', error);
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
    if (!file) return;

    console.log('🖼️ [ProfileSettings] File selected:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      const error = t('errors.invalid_file_type');
      console.error('🖼️ [ProfileSettings] ✗', error);
      setUploadError(error);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const error = t('errors.file_too_large');
      console.error('🖼️ [ProfileSettings] ✗', error);
      setUploadError(error);
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result);
      console.log('🖼️ [ProfileSettings] Preview created');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPicture = async () => {
    if (!selectedFile) {
      console.warn('🖼️ [ProfileSettings] No file selected for upload');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      console.log('🖼️ [ProfileSettings] Starting upload...');
      console.log('🖼️ [ProfileSettings] File:', selectedFile.name);
      console.log('🖼️ [ProfileSettings] User ID:', userId);
      
      const formData = new FormData();
      formData.append('photo', selectedFile);

      console.log('🖼️ [ProfileSettings] Uploading to /api/account/picture/me');
      const response = await axios.post('/api/account/picture/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      console.log('🖼️ [ProfileSettings] ✓ Upload successful!');
      console.log('🖼️ [ProfileSettings] Response:', response.data);
      if (response.data.picturePath) {
        console.log('🖼️ [ProfileSettings] Firebase path:', response.data.picturePath);
      }

      // Clear cache and refresh image
      console.log('🖼️ [ProfileSettings] Clearing cache for user:', userId);
      clearImageCache(userId);
      
      console.log('🖼️ [ProfileSettings] Refreshing image in 100ms...');
      setTimeout(async () => {
        console.log('🖼️ [ProfileSettings] Calling refreshImage()...');
        await refreshImage();
        console.log('🖼️ [ProfileSettings] Image refresh complete');
      }, 100);

      // Clear selection
      setSelectedFile(null);
      setPreviewUrl(null);
      
      alert(t('profile.picture_updated'));
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      console.error('🖼️ [ProfileSettings] ✗ Upload failed:', errorMsg);
      setUploadError(errorMsg);
      alert(t('errors.upload_failed') + ': ' + errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    console.log('💾 [ProfileSettings] handleSave called');
    console.log('💾 [ProfileSettings] isEditing:', isEditing);
    console.log('💾 [ProfileSettings] selectedFile:', selectedFile);
    console.log('💾 [ProfileSettings] userId:', userId);
    
    setIsSaving(true);
    try {
      // Upload picture first if selected
      if (selectedFile) {
        console.log('🖼️ [ProfileSettings] ==================== STARTING IMAGE UPLOAD ====================');
        console.log('🖼️ [ProfileSettings] File name:', selectedFile.name);
        console.log('🖼️ [ProfileSettings] File size:', (selectedFile.size / 1024).toFixed(2), 'KB');
        console.log('🖼️ [ProfileSettings] File type:', selectedFile.type);
        console.log('🖼️ [ProfileSettings] User ID:', userId);
        
        const formData = new FormData();
        formData.append('photo', selectedFile);
        console.log('🖼️ [ProfileSettings] FormData created with photo field');

        console.log('🖼️ [ProfileSettings] Sending POST to /api/account/picture/me');
        const uploadResponse = await axios.post('/api/account/picture/me', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });

        console.log('🖼️ [ProfileSettings] ==================== UPLOAD RESPONSE ====================');
        console.log('🖼️ [ProfileSettings] Status:', uploadResponse.status);
        console.log('🖼️ [ProfileSettings] Response data:', uploadResponse.data);
        if (uploadResponse.data.picturePath) {
          console.log('🖼️ [ProfileSettings] Firebase path:', uploadResponse.data.picturePath);
        }

        // Clear cache and refresh image
        console.log('🖼️ [ProfileSettings] ==================== CLEARING CACHE ====================');
        console.log('🖼️ [ProfileSettings] Clearing cache for user:', userId);
        clearImageCache(userId);
        console.log('🖼️ [ProfileSettings] Cache cleared');
        
        console.log('🖼️ [ProfileSettings] Scheduling image refresh in 100ms...');
        setTimeout(async () => {
          console.log('🖼️ [ProfileSettings] Now calling refreshImage()...');
          await refreshImage();
          console.log('🖼️ [ProfileSettings] ✓ Image refresh complete');
        }, 100);

        // Clear selection
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadError(null);
        console.log('🖼️ [ProfileSettings] ==================== IMAGE UPLOAD COMPLETE ====================');
      } else {
        console.log('💾 [ProfileSettings] No image selected, skipping upload');
      }

      const updateData = {
        firstName: tempUserInfo.firstName,
        middleName: tempUserInfo.middleName || null,
        surname: tempUserInfo.lastName,
        extensionName: tempUserInfo.extensionName || null,
        username: tempUserInfo.username,
        email: tempUserInfo.email || null,
        contactNumber: tempUserInfo.phone || null,
        sex: tempUserInfo.gender || 'Male',
        dateOfBirth: tempUserInfo.dateOfBirth || null,
        client_profile: tempUserInfo.client_profile || 'Other'
      };

      console.log('💾 [ProfileSettings] Saving profile data...');
      console.log('💾 [ProfileSettings] Data:', updateData);

      const response = await fetch('/api/account/details/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('💾 [ProfileSettings] ✓ Profile saved successfully:', result);
        setUserInfo({ ...tempUserInfo });
        setIsEditing(false);
        alert(t('profile.updated_successfully'));
      } else {
        const errorData = await response.json();
        console.error('💾 [ProfileSettings] ✗ Failed to save profile:', errorData);
        alert(`${t('errors.save_failed')}: ${errorData.message || t('errors.unknown')}`);
      }
    } catch (error) {
      console.error('💾 [ProfileSettings] ==================== ERROR ====================');
      console.error('💾 [ProfileSettings] Error type:', error.name);
      console.error('💾 [ProfileSettings] Error message:', error.message);
      console.error('💾 [ProfileSettings] Error response:', error.response?.data);
      console.error('💾 [ProfileSettings] Full error:', error);
      
      if (error.response?.data?.error) {
        setUploadError(error.response.data.error);
        alert(`${t('errors.error')}: ${error.response.data.error}`);

      } else {
        setUploadError(error.message);
        alert(t('errors.save_profile_failed'));
      }
    } finally {
      setIsSaving(false);
      console.log('💾 [ProfileSettings] handleSave completed, isSaving set to false');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">{t('common.loading_profile')}</p>
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
            {t('profile.profile_information')}
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
          >
            {isEditing ? t('profile.update_information') : t('profile.view_details')}
          </p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
          >
            <i className="fas fa-edit"></i>
            <span>{t('common.edit_profile')}</span>
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
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t('common.saving')}</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>{t('common.save_changes')}</span>
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
          {t('profile.profile_picture')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={previewUrl || imageUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-emerald-200"
                onError={(e) => {
                  e.target.src = '/src/Assets/default_picture.png';
                }}
              />
              {isEditing && (
                <>
                  <button
                    onClick={() => document.getElementById('profile-image-input').click()}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                  >
                    <i className="fas fa-camera text-sm"></i>
                  </button>
                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </>
              )}
            </div>
            <div className="flex-1">
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
                {userInfo.client_profile || 'Member'}
              </p>
            </div>
          </div>
          
          {isEditing && selectedFile && (
            <div className="flex items-center space-x-3">
              <div className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                <i className="fas fa-info-circle mr-1"></i>
                {t('profile.selected_file')}: {selectedFile.name} - {t('profile.click_save_upload')}
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setUploadError(null);
                  console.log('🖼️ [ProfileSettings] File selection cancelled');
                }}
                className="px-3 py-1 rounded-lg font-medium border transition-colors text-sm"
                style={{
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  color: isDark ? '#d1d5db' : '#374151',
                }}
              >
                <i className="fas fa-times mr-1"></i>
                {t('common.clear')}
              </button>
            </div>
          )}
          
          {uploadError && (
            <p className="text-sm text-red-500">
              <i className="fas fa-exclamation-circle mr-1"></i>
              {uploadError}
            </p>
          )}
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
          {t('profile.personal_information')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {t('profile.first_name')}
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
                {userInfo.firstName || t('common.not_specified')}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {t('profile.last_name')}
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
                {userInfo.lastName || t('common.not_specified')}
              </div>
            )}
          </div>

          {/* Middle Name */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {t('profile.middle_name')}
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
                {userInfo.middleName || t('common.not_specified')}
              </div>
            )}
          </div>

          {/* Username */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {t('account.username')}
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
                {userInfo.username || t('common.not_specified')}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {t('account.email')}
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
                {userInfo.email || t('common.not_specified')}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {t('account.phone')}
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
                {userInfo.phone || t('common.not_specified')}
              </div>
            )}
          </div>

          {/* Gender */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {t('profile.gender')}
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
                <option value="">{t('profile.select_gender')}</option>
                <option value="Male">{t('profile.male')}</option>
                <option value="Female">{t('profile.female')}</option>
                <option value="Other">{t('common.other')}</option>
                <option value="Prefer not to say">{t('profile.prefer_not_say')}</option>
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
                {userInfo.gender || t('common.not_specified')}
              </div>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {t('profile.date_of_birth')}
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
                {userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toLocaleDateString() : t('common.not_specified')}
              </div>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {t('profile.address')}
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
                placeholder={t('profile.enter_address')}
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
                {userInfo.address || t('common.not_specified')}
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {t('profile.bio')}
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
                placeholder={t('profile.bio_placeholder')}
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
                {userInfo.bio || t('profile.no_bio')}
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
          {t('profile.professional_information')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Position */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {t('profile.position')}
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
                placeholder={t('profile.position_placeholder')}
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
                {userInfo.position || t('common.not_specified')}
              </div>
            )}
          </div>

          {/* Occupation */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {t('profile.occupation')}
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
                placeholder={t('profile.occupation_placeholder')}
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
                {userInfo.occupation || t('common.not_specified')}
              </div>
            )}
          </div>

          {/* Civil Status */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#d1d5db' : '#374151' }}
            >
              {t('profile.civil_status')}
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
                <option value="">{t('profile.select_status')}</option>
                <option value="Single">{t('profile.single')}</option>
                <option value="Married">{t('profile.married')}</option>
                <option value="Widowed">{t('profile.widowed')}</option>
                <option value="Divorced">{t('profile.divorced')}</option>
                <option value="Separated">{t('profile.separated')}</option>
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
                {userInfo.civilStatus || t('common.not_specified')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
