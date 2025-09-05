import React, { useState, useEffect } from 'react';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';
import { useTheme } from '../../contexts/ThemeContext';

const AccountSettings = () => {
  const { t } = useCustomTranslation();
  const { theme, isDark } = useTheme();
  
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    position: '',
    phone: '',
  });
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch('/api/account/details/me');
        const data = await response.json();
        
        if (response.ok) {
          setUserInfo({
            username: data.username || '',
            email: data.email || '',
            position: data.position || '',
            phone: data.phone || '',
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const resp = await fetch('/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Failed to change password');
      setPasswords({ current: '', new: '', confirm: '' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.message || 'Error changing password');
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    {
      id: 'profile',
      title: t('account.profile_information'),
      icon: 'fas fa-user',
    },
    {
      id: 'password',
      title: t('account.change_password'),
      icon: 'fas fa-lock',
    },
    {
      id: 'privacy',
      title: t('account.privacy_settings'),
      icon: 'fas fa-shield-alt',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Success Message - Centered Popup */}
      {showSuccess && (
        <div className="fixed inset-0 h-full z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div 
            className="border border-emerald-200 dark:border-emerald-700 rounded-xl p-6 flex items-center space-x-4 shadow-2xl max-w-md mx-4"
            style={{ backgroundColor: isDark ? '#065f46' : '#ecfdf5' }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: isDark ? '#047857' : '#d1fae5' }}
            >
              <i 
                className="fas fa-check text-xl"
                style={{ color: isDark ? '#a7f3d0' : '#047857' }}
              ></i>
            </div>
            <div>
              <span 
                className="font-medium text-lg block"
                style={{ color: isDark ? '#a7f3d0' : '#047857' }}
              >
                {t('settings.settings_saved')}
              </span>
              <p 
                className="text-sm mt-1 opacity-80"
                style={{ color: isDark ? '#a7f3d0' : '#047857' }}
              >
                Your account settings have been updated
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 
          className="text-2xl font-bold mb-2"
          style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
          {t('settings.account_settings')}
        </h2>
        <p 
          style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
        >
          Manage your account information and security settings
        </p>
      </div>

      {/* Section Navigation */}
      <div 
        className="flex space-x-1 p-1 rounded-xl"
        style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
      >
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeSection === section.id
                ? 'shadow-sm'
                : ''
            }`}
            style={{
              backgroundColor: activeSection === section.id
                ? (isDark ? '#4b5563' : '#ffffff')
                : 'transparent',
              color: activeSection === section.id
                ? (isDark ? '#a7f3d0' : '#047857')
                : (isDark ? '#9ca3af' : '#6b7280')
            }}
          >
            <i className={`${section.icon} text-sm`}></i>
            <span className="hidden sm:inline">{section.title}</span>
          </button>
        ))}
      </div>

      {/* Profile Information Section */}
      {activeSection === 'profile' && (
        <div 
          className="border border-gray-200 dark:border-gray-600 rounded-xl p-6"
          style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }}
        >
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDark ? '#d1d5db' : '#374151' }}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={userInfo.username}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your username"
                />
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDark ? '#d1d5db' : '#374151' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  value={userInfo.position}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your position"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700 hover:shadow-lg'
                }`}
              >
                {isLoading ? t('common.loading') : t('common.save')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Password Change Section */}
      {activeSection === 'password' && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter current password"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter new password"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700 hover:shadow-lg'
                }`}
              >
                {isLoading ? t('common.loading') : t('account.change_password')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Privacy Settings Section */}
      {activeSection === 'privacy' && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Profile Visibility</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Control who can see your profile information</p>
              </div>
              <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Public</option>
                <option>Private</option>
                <option>Friends Only</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Data Collection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Allow collection of usage data for improvement</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all duration-200">
                {t('account.delete_account')}
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
