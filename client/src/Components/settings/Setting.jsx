import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

export default function Settings() {
    const { theme, isDark } = useTheme();

    return (
        <div className={`min-h-screen p-6 md:p-15 md:mt-10 flex items-center justify-center ${
            isDark 
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
                : 'bg-gradient-to-br from-[#f0f4ff] to-[#e3e9f7]'
        }`}>
            <div className={`w-full max-w-xl p-10 rounded-3xl shadow-xl flex flex-col gap-9 font-inter backdrop-blur border ${
                isDark 
                    ? 'bg-gray-800/95 border-gray-700/30' 
                    : 'bg-white/95 border-indigo-100'
            }`}>
                <div className="flex items-center gap-4 mb-[-1.2rem]">
                    <img
                        src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&rounded=true"
                        alt="avatar"
                        className={`w-14 h-14 rounded-full border-2 ${
                            isDark ? 'border-indigo-400' : 'border-indigo-500'
                        }`}
                    />
                    <div>
                        <div className={`font-bold text-xl ${
                            isDark ? 'text-indigo-300' : 'text-indigo-900'
                        }`}>John Doe</div>
                        <div className={`font-medium text-base ${
                            isDark ? 'text-indigo-400' : 'text-indigo-500'
                        }`}>Premium Member</div>
                    </div>
                </div>

                <h2 className={`font-extrabold text-3xl m-0 tracking-tight text-center ${
                    isDark ? 'text-indigo-300' : 'text-indigo-900'
                }`}>
                    Settings
                </h2>

                {/* Language */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="language-select" className={`text-base font-semibold ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                        Language
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
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="tl">Tagalog</option>
                    </select>
                </div>

                {/* Theme */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="theme-select" className={`text-base font-semibold ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                        Theme
                    </label>
                    <select
                        id="theme-select"
                        defaultValue="light"
                        className={`p-3 rounded-xl border text-base outline-none font-medium transition-colors ${
                            isDark 
                                ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-indigo-400' 
                                : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                        }`}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
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
                            Enable Notifications
                        </span>
                    </label>
                </div>

                {/* Account Info */}
                <div className="flex flex-col gap-2">
                    <label className={`text-base font-semibold ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>Account Email</label>
                    <input
                        type="email"
                        value="user@email.com"
                        readOnly
                        className={`p-3 rounded-xl border text-base font-medium outline-none ${
                            isDark 
                                ? 'border-gray-600 bg-gray-700 text-gray-400' 
                                : 'border-indigo-200 bg-indigo-50 text-gray-500'
                        }`}
                    />
                </div>

                {/* Password Change */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className={`text-base font-semibold ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                        Change Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="New password"
                        className={`p-3 rounded-xl border text-base font-medium outline-none transition-colors ${
                            isDark 
                                ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-indigo-400' 
                                : 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-400'
                        }`}
                    />
                    <button
                        className={`mt-2 p-3 rounded-xl border-none font-bold text-base cursor-pointer transition-colors ${
                            isDark 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                : 'bg-indigo-500 text-white hover:bg-indigo-600'
                        }`}
                    >
                        Update Password
                    </button>
                </div>

                {/* Privacy */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="privacy-toggle" className={`text-base font-semibold ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                        Profile Privacy
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
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                    </select>
                </div>

                {/* Security */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="2fa-toggle" className={`text-base font-semibold ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                        Two-Factor Authentication
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
                            Enable 2FA for extra security
                        </span>
                    </label>
                </div>

                {/* Support */}
                <div className="flex flex-col gap-2">
                    <label className={`text-base font-semibold ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>Support</label>
                    <button
                        className={`p-2.5 rounded-xl border font-bold text-base cursor-pointer transition-colors ${
                            isDark 
                                ? 'border-indigo-400 bg-gray-800 text-indigo-400 hover:bg-gray-700 hover:text-indigo-300' 
                                : 'border-indigo-500 bg-white text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700'
                        }`}
                    >
                        Contact Support
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
                    Log Out
                </button>
            </div>
        </div>
    )
}
