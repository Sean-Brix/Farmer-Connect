import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

const AccountSettings = () => {
  const { isDark } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('An error occurred while changing password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 pb-8">
      {/* Header */}
      <div>
        <h2 
          className={`text-2xl sm:text-3xl font-bold mb-3 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Admin Account Settings
        </h2>
        <p 
          className={`text-base ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Manage your admin account security and login preferences
        </p>
      </div>

      {/* Password Change Section */}
      <div 
        className={`rounded-2xl p-6 sm:p-8 border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-shrink-0">
              <div 
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-blue-900' : 'bg-blue-100'
                }`}
              >
                <i 
                  className={`fas fa-lock text-xl ${
                    isDark ? 'text-blue-300' : 'text-blue-600'
                  }`}
                ></i>
              </div>
            </div>
            <div>
              <h3 
                className={`text-xl font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Change Password
              </h3>
              <p 
                className={`text-base ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Update your password to keep your admin account secure
              </p>
            </div>
          </div>

          {error && (
            <div 
              className={`mb-6 p-4 rounded-lg border ${
                isDark 
                  ? 'bg-red-900/20 border-red-700 text-red-300' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            </div>
          )}

          {showSuccess && (
            <div 
              className={`mb-6 p-4 rounded-lg border ${
                isDark 
                  ? 'bg-green-900/20 border-green-700 text-green-300' 
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <i className="fas fa-check-circle"></i>
                <span>Password changed successfully!</span>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label 
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your current password"
                />
              </div>

              <div>
                <label 
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your new password (min. 8 characters)"
                />
              </div>

              <div>
                <label 
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Confirm your new password"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  {isChangingPassword ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Changing...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-key"></i>
                      <span>Change Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      {/* Security Information */}
      <div 
        className={`rounded-2xl p-6 sm:p-8 border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div 
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-green-900' : 'bg-green-100'
              }`}
            >
              <i 
                className={`fas fa-shield-alt text-xl ${
                  isDark ? 'text-green-300' : 'text-green-600'
                }`}
              ></i>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 
              className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Security Tips
            </h3>
            <div 
              className={`text-base space-y-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <p>• Use a strong, unique password for your admin account</p>
              <p>• Consider enabling two-factor authentication if available</p>
              <p>• Regularly review your account activity and login sessions</p>
              <p>• Never share your admin credentials with anyone</p>
              <p>• Log out from shared or public computers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div 
        className={`rounded-2xl p-6 sm:p-8 border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div 
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-purple-900' : 'bg-purple-100'
              }`}
            >
              <i 
                className={`fas fa-user-shield text-xl ${
                  isDark ? 'text-purple-300' : 'text-purple-600'
                }`}
              ></i>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 
              className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Admin Account Information
            </h3>
            <div 
              className={`text-base ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <p className="mb-4">
                Your admin account has elevated privileges to manage the Farmer Connect platform. 
                Please ensure you maintain the highest security standards.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="fas fa-crown text-yellow-500"></i>
                    <span 
                      className={`font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Account Type
                    </span>
                  </div>
                  <p 
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Administrator
                  </p>
                </div>
                <div 
                  className={`p-4 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span 
                      className={`font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Account Status
                    </span>
                  </div>
                  <p 
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
