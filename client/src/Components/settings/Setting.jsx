import React from 'react'

export default function Settings() {
    return (
        <div className="min-h-screen p-6 md:p-15 md:mt-10 flex items-center justify-center bg-gradient-to-br from-[#f0f4ff] to-[#e3e9f7]">
            <div className="w-full max-w-xl  p-10 rounded-3xl bg-white/95 shadow-xl flex flex-col gap-9 font-inter backdrop-blur border border-indigo-100">
                <div className="flex items-center gap-4 mb-[-1.2rem]">
                    <img
                        src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&rounded=true"
                        alt="avatar"
                        className="w-14 h-14 rounded-full border-2 border-indigo-500"
                    />
                    <div>
                        <div className="font-bold text-xl text-indigo-900">John Doe</div>
                        <div className="text-indigo-500 font-medium text-base">Premium Member</div>
                    </div>
                </div>

                <h2 className="font-extrabold text-3xl m-0 text-indigo-900 tracking-tight text-center">
                    Settings
                </h2>

                {/* Language */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="language-select" className="text-base text-gray-700 font-semibold">
                        Language
                    </label>
                    <select
                        id="language-select"
                        defaultValue="en"
                        className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 text-base outline-none font-medium text-indigo-900 transition-colors"
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
                    <label htmlFor="theme-select" className="text-base text-gray-700 font-semibold">
                        Theme
                    </label>
                    <select
                        id="theme-select"
                        defaultValue="light"
                        className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 text-base outline-none font-medium text-indigo-900 transition-colors"
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
                        <span className="text-base text-gray-700 font-semibold">
                            Enable Notifications
                        </span>
                    </label>
                </div>

                {/* Account Info */}
                <div className="flex flex-col gap-2">
                    <label className="text-base text-gray-700 font-semibold">Account Email</label>
                    <input
                        type="email"
                        value="user@email.com"
                        readOnly
                        className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 text-base text-gray-500 font-medium outline-none"
                    />
                </div>

                {/* Password Change */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-base text-gray-700 font-semibold">
                        Change Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="New password"
                        className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 text-base text-indigo-900 font-medium outline-none"
                    />
                    <button
                        className="mt-2 p-3 rounded-xl border-none bg-indigo-500 text-white font-bold text-base cursor-pointer transition-colors hover:bg-indigo-600"
                    >
                        Update Password
                    </button>
                </div>

                {/* Privacy */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="privacy-toggle" className="text-base text-gray-700 font-semibold">
                        Profile Privacy
                    </label>
                    <select
                        id="privacy-toggle"
                        defaultValue="public"
                        className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 text-base outline-none font-medium text-indigo-900 transition-colors"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                    </select>
                </div>

                {/* Security */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="2fa-toggle" className="text-base text-gray-700 font-semibold">
                        Two-Factor Authentication
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            id="2fa-toggle"
                            className="accent-indigo-500 w-5 h-5 m-0"
                        />
                        <span className="text-base text-gray-700 font-medium">
                            Enable 2FA for extra security
                        </span>
                    </label>
                </div>

                {/* Support */}
                <div className="flex flex-col gap-2">
                    <label className="text-base text-gray-700 font-semibold">Support</label>
                    <button
                        className="p-2.5 rounded-xl border border-indigo-500 bg-white text-indigo-500 font-bold text-base cursor-pointer transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                    >
                        Contact Support
                    </button>
                </div>

                {/* Logout */}
                <button
                    className="mt-4 p-3 rounded-xl border-none bg-red-500 text-white font-bold text-base cursor-pointer transition-colors shadow-sm hover:bg-red-600"
                >
                    Log Out
                </button>
            </div>
        </div>
    )
}
