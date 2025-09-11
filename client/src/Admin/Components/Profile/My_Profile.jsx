import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function My_Profile({ user }) {
    const { isDark } = useTheme();
    // Fallback for missing user prop
    const userDetail = user || {};

    return (
        <div className={`max-w-3xl mx-auto rounded-2xl shadow-lg border p-8 relative animate-fade-in ${
            isDark 
                ? 'bg-gray-800 border-gray-600' 
                : 'bg-white border-blue-200'
        }`}>
            <div className="flex flex-col items-center justify-center mb-4">
                <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight mb-2 text-center uppercase ${
                    isDark ? 'text-green-400' : 'text-blue-800'
                }`}>My Profile</h2>
                <span className={`text-xs font-semibold px-3 py-1 mb-4 rounded-full border ${
                    isDark 
                        ? 'text-green-300 bg-green-900/30 border-green-700' 
                        : 'text-blue-400 bg-blue-50 border-blue-200'
                }`}>ID: {userDetail?.id || ''}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <label className={`block text-sm font-semibold mb-1 ${
                            isDark ? 'text-green-300' : 'text-blue-700'
                        }`}>Username</label>
                        <div className={`w-full border rounded-lg px-3 py-2 font-medium ${
                            isDark 
                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                : 'bg-white border-blue-200 text-blue-900'
                        }`}>{userDetail?.username || ''}</div>
                    </div>
                    <div>
                        <label className={`block text-sm font-semibold mb-1 ${
                            isDark ? 'text-green-300' : 'text-blue-700'
                        }`}>Access</label>
                        <div className={`w-full border rounded-lg px-3 py-2 ${
                            isDark 
                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                : 'bg-white border-blue-200 text-blue-900'
                        }`}>{userDetail?.access || ''}</div>
                    </div>
                    <div>
                        <label className={`block text-sm font-semibold mb-1 ${
                            isDark ? 'text-green-300' : 'text-blue-700'
                        }`}>Gender</label>
                        <div className={`w-full border rounded-lg px-3 py-2 ${
                            isDark 
                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                : 'bg-white border-blue-200 text-blue-900'
                        }`}>{userDetail?.gender || ''}</div>
                    </div>
                    <div>
                        <label className={`block text-sm font-semibold mb-1 ${
                            isDark ? 'text-green-300' : 'text-blue-700'
                        }`}>Client Profile</label>
                        <div className={`w-full border rounded-lg px-3 py-2 ${
                            isDark 
                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                : 'bg-white border-blue-200 text-blue-900'
                        }`}>{userDetail?.client_profile || ''}</div>
                    </div>
                    <div>
                        <label className={`block text-sm font-semibold mb-1 ${
                            isDark ? 'text-green-300' : 'text-blue-700'
                        }`}>Occupation</label>
                        <div className={`w-full border rounded-lg px-3 py-2 ${
                            isDark 
                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                : 'bg-white border-blue-200 text-blue-900'
                        }`}>{userDetail?.occupation || ''}</div>
                    </div>
                    <div>
                        <label className={`block text-sm font-semibold mb-1 ${
                            isDark ? 'text-green-300' : 'text-blue-700'
                        }`}>Position</label>
                        <div className={`w-full border rounded-lg px-3 py-2 ${
                            isDark 
                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                : 'bg-white border-blue-200 text-blue-900'
                        }`}>{userDetail?.position || ''}</div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className={`block text-sm font-semibold mb-1 ${
                            isDark ? 'text-green-300' : 'text-blue-700'
                        }`}>Full Name</label>
                        <div className="flex gap-2">
                            <div className={`flex-1 border rounded-lg px-3 py-2 ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                    : 'bg-white border-blue-200 text-blue-900'
                            }`} title="First Name">{userDetail?.firstName || ''}</div>
                            <div className={`flex-1 border rounded-lg px-3 py-2 ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                    : 'bg-white border-blue-200 text-blue-900'
                            }`} title="Middle Name">{userDetail?.middleName || ''}</div>
                            <div className={`flex-1 border rounded-lg px-3 py-2 ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                    : 'bg-white border-blue-200 text-blue-900'
                            }`} title="Last Name">{userDetail?.lastName || ''}</div>
                        </div>
                    </div>
                    <div>
                        <label className={`block text-sm font-semibold mb-1 ${
                            isDark ? 'text-green-300' : 'text-blue-700'
                        }`}>Address</label>
                        <div className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-900">{userDetail?.address || ''}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-blue-700 font-semibold mb-1">Telephone No</label>
                        <div className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-900">{userDetail?.telephone_no || ''}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-blue-700 font-semibold mb-1">Cellphone No</label>
                        <div className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-900">{userDetail?.cellphone_no || ''}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-blue-700 font-semibold mb-1">Institution</label>
                        <div className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-900">{userDetail?.institution || ''}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-blue-700 font-semibold mb-1">Email Address</label>
                        <div className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-900">{userDetail?.email || ''}</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                    <label className="block text-xs text-blue-700 font-semibold mb-1">Created At</label>
                    <div className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700">
                        {userDetail?.createdAt ? new Date(userDetail?.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-blue-700 font-semibold mb-1">Updated At</label>
                    <div className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700">
                        {userDetail?.updatedAt ? new Date(userDetail?.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}
