import React, { useState } from 'react'
import { useCustomTranslation } from '../../hooks/useCustomTranslation'
import { useTheme } from '../../contexts/ThemeContext'
import { Link } from 'react-router-dom'

export default function Settings() {
    const { t } = useCustomTranslation();
    const { theme, isDark, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('general');
    const [profileImage, setProfileImage] = useState("https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&rounded=true");
    const [selectedTheme, setSelectedTheme] = useState(theme || 'light');

    const handleThemeChange = (newTheme) => {
        setSelectedTheme(newTheme);
        // Apply theme change immediately without loader
        if (toggleTheme) {
            toggleTheme(newTheme);
        }
    };

    return (
        <div className={`min-h-screen p-6 md:p-15 md:mt-10 flex items-center justify-center ${
            isDark 
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
                : 'bg-gradient-to-br from-[#f0f4ff] to-[#e3e9f7]'
        }`}>
            <div className={`w-full max-w-2xl rounded-3xl shadow-xl flex flex-col font-inter backdrop-blur border ${
                isDark 
                    ? 'bg-gray-800/95 border-gray-700/30' 
                    : 'bg-white/95 border-indigo-100'
            }`} style={{ height: '85vh' }}>
                {/* Header - Fixed */}
                <div className="p-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className={`font-extrabold text-3xl m-0 tracking-tight text-center ${
                        isDark ? 'text-indigo-300' : 'text-indigo-900'
                    }`}>
                        {t('settings.title')}
                    </h2>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mt-6">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                                activeTab === 'general'
                                    ? (isDark 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'bg-indigo-500 text-white')
                                    : (isDark 
                                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                            }`}
                        >
                            {t('settings.general_settings')}
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                                activeTab === 'profile'
                                    ? (isDark 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'bg-indigo-500 text-white')
                                    : (isDark 
                                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                            }`}
                        >
                            {t('settings.profile_settings')}
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div 
                    className="flex-1 overflow-y-auto p-8 space-y-6"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: isDark ? '#4B5563 #1F2937' : '#CBD5E1 #F1F5F9'
                    }}
                >

                {/* General Settings Tab */}
                {activeTab === 'general' && (
                    <>
                        {/* Language */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="language-select" className={`text-base font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                {t('settings.language')}
                            </label>
                            <select
                                id="language-select"
                                defaultValue="en"
                                className={`p-3 rounded-xl border text-base outline-none font-medium transition-colors ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-indigo-400' 
                                        : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                                }`}
                            >
                                <option value="en">{t('preferences.english')}</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="tl">{t('preferences.tagalog')}</option>
                            </select>
                        </div>

                        {/* Theme */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="theme-select" className={`text-base font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                {t('settings.theme')}
                            </label>
                            <select
                                id="theme-select"
                                value={selectedTheme}
                                onChange={(e) => handleThemeChange(e.target.value)}
                                className={`p-3 rounded-xl border text-base outline-none font-medium transition-colors ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-indigo-400' 
                                        : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                                }`}
                            >
                                <option value="light">{t('preferences.light')}</option>
                                <option value="dark">{t('preferences.dark')}</option>
                                <option value="system">{t('preferences.system_default')}</option>
                            </select>
                        </div>

                        {/* Notifications */}
                        <div className="flex items-center gap-4">
                            <label htmlFor="notifications-toggle" className="flex items-center cursor-pointer gap-2">
                                <input
                                    type="checkbox"
                                    id="notifications-toggle"
                                    defaultChecked
                                    className="accent-indigo-500 w-5 h-5 shadow-sm m-0"
                                />
                                <span className={`text-base font-semibold ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    {t('settings.enable_notifications')}
                                </span>
                            </label>
                        </div>

                        {/* Privacy */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="privacy-toggle" className={`text-base font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                {t('account.profile_privacy')}
                            </label>
                            <select
                                id="privacy-toggle"
                                defaultValue="public"
                                className={`p-3 rounded-xl border text-base outline-none font-medium transition-colors ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-indigo-400' 
                                        : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                                }`}
                            >
                                <option value="public">{t('account.public')}</option>
                                <option value="private">{t('account.private')}</option>
                                <option value="friends">{t('account.friends_only')}</option>
                            </select>
                        </div>

                        {/* Security */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="2fa-toggle" className={`text-base font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                {t('account.two_factor')}
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="2fa-toggle"
                                    className="accent-indigo-500 w-5 h-5 m-0"
                                />
                                <span className={`text-base font-medium ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    {t('account.enable_2fa')}
                                </span>
                            </label>
                        </div>

                        {/* Support */}
                        <div className="flex flex-col gap-2">
                            <label className={`text-base font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>{t('settings.support')}</label>
                            <button
                                className={`p-2.5 rounded-xl border font-bold text-base cursor-pointer transition-colors ${
                                    isDark 
                                        ? 'border-indigo-400 bg-gray-800 text-indigo-400 hover:bg-gray-700 hover:text-indigo-300' 
                                        : 'border-indigo-500 bg-white text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700'
                                }`}
                            >
                                {t('settings.contact_support')}
                            </button>
                        </div>

                        {/* Logout */}
                        <button
                            className={`mt-4 p-3 rounded-xl border-none font-bold text-base cursor-pointer transition-colors shadow-sm ${
                                isDark 
                                    ? 'bg-red-600 text-white hover:bg-red-700' 
                                    : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                        >
                            {t('navigation.logout')}
                        </button>
                    </>
                )}

                {/* Profile Settings Tab */}
                {activeTab === 'profile' && (
                    <>
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className={`w-24 h-24 rounded-full border-4 object-cover ${
                                        isDark ? 'border-indigo-400' : 'border-indigo-500'
                                    }`}
                                />
                                <button
                                    className={`absolute bottom-0 right-0 p-2 rounded-full border-2 border-white transition-colors ${
                                        isDark 
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                            : 'bg-indigo-500 text-white hover:bg-indigo-600'
                                    }`}
                                    onClick={() => document.getElementById('profile-image-input').click()}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                <input
                                    id="profile-image-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                setProfileImage(event.target?.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>
                            <div className="text-center">
                                <div className={`font-bold text-xl ${
                                    isDark ? 'text-indigo-300' : 'text-indigo-900'
                                }`}>John Doe</div>
                                <div className={`font-medium text-base ${
                                    isDark ? 'text-indigo-400' : 'text-indigo-500'
                                }`}>Premium Member</div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="flex flex-col gap-4">
                            <h3 className={`text-xl font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>{t('profile.personal_information')}</h3>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* First Name */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="first-name" className={`text-base font-semibold ${
                                        isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        {t('profile.first_name')}
                                    </label>
                                    <input
                                        type="text"
                                        id="first-name"
                                        defaultValue="John"
                                        className={`p-3 rounded-xl border text-base font-medium outline-none transition-colors ${
                                            isDark 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-indigo-400' 
                                                : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                                        }`}
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="last-name" className={`text-base font-semibold ${
                                        isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        {t('profile.last_name')}
                                    </label>
                                    <input
                                        type="text"
                                        id="last-name"
                                        defaultValue="Doe"
                                        className={`p-3 rounded-xl border text-base font-medium outline-none transition-colors ${
                                            isDark 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-indigo-400' 
                                                : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="username" className={`text-base font-semibold ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    {t('account.username')}
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    defaultValue="johndoe"
                                    className={`p-3 rounded-xl border text-base font-medium outline-none transition-colors ${
                                        isDark 
                                            ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-indigo-400' 
                                            : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                                    }`}
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="profile-email" className={`text-base font-semibold ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    {t('account.email')}
                                </label>
                                <input
                                    type="email"
                                    id="profile-email"
                                    defaultValue="john.doe@email.com"
                                    className={`p-3 rounded-xl border text-base font-medium outline-none transition-colors ${
                                        isDark 
                                            ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-indigo-400' 
                                            : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                                    }`}
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="phone" className={`text-base font-semibold ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    {t('account.phone')}
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    defaultValue="+1234567890"
                                    className={`p-3 rounded-xl border text-base font-medium outline-none transition-colors ${
                                        isDark 
                                            ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-indigo-400' 
                                            : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                                    }`}
                                />
                            </div>

                            {/* Bio */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="bio" className={`text-base font-semibold ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    {t('profile.bio')}
                                </label>
                                <textarea
                                    id="bio"
                                    rows="4"
                                    defaultValue="I'm a passionate farmer focused on sustainable agriculture and community development."
                                    className={`p-3 rounded-xl border text-base font-medium outline-none transition-colors resize-none ${
                                        isDark 
                                            ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-indigo-400' 
                                            : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Password Change Section */}
                        <div className="flex flex-col gap-4">
                            <h3 className={`text-xl font-semibold ${
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>{t('account.security')}</h3>
                            
                            <div className="flex flex-col gap-2">
                                <label htmlFor="current-password" className={`text-base font-semibold ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="current-password"
                                    placeholder="Enter current password"
                                    className={`p-3 rounded-xl border text-base font-medium outline-none transition-colors ${
                                        isDark 
                                            ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-indigo-400' 
                                            : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                                    }`}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="new-password" className={`text-base font-semibold ${
                                        isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        {t('account.new_password')}
                                    </label>
                                    <input
                                        type="password"
                                        id="new-password"
                                        placeholder={t('account.enter_new_password')}rrent_password')}
                                        className={`p-3 rounded-xl border text-base font-medium outline-none transition-colors ${
                                            isDark 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-indigo-400' 
                                                : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                                        }`}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="confirm-password" className={`text-base font-semibold ${
                                        isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        {t('account.confirm_password')}
                                    </label>
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        placeholder={t('account.confirm_new_password')}
                                        className={`p-3 rounded-xl border text-base font-medium outline-none transition-colors ${
                                            isDark 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-indigo-400' 
                                                : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Profile Button */}
                        <button
                            className={`mt-4 p-3 rounded-xl border-none font-bold text-base cursor-pointer transition-colors shadow-sm ${
                                isDark 
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                            }`}
                        >
                            {t('profile.save_profile_changes')}
                        </button>

                        {/* View Full Profile Link */}
                        <Link
                            to="/settings/profile"
                            className={`text-center p-2.5 rounded-xl border font-bold text-base cursor-pointer transition-colors ${
                                isDark 
                                    ? 'border-indigo-400 bg-gray-800 text-indigo-400 hover:bg-gray-700 hover:text-indigo-300' 
                                    : 'border-indigo-500 bg-white text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700'
                            }`}
                        >
                            {t('profile.view_full_profile')}
                        </Link>
                    </>
                )}
                </div>
            </div>
        </div>
    )
}
