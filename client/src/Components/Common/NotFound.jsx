import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';

export default function NotFound() {
    const { theme, isDark } = useTheme();
    const navigate = useNavigate();
    const { t } = useCustomTranslation();

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 ${
            isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-white to-green-50'
        }`}>
            <div className="max-w-2xl w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 ${
                        isDark ? 'bg-gray-800' : 'bg-green-100'
                    }`}>
                        <svg 
                            className={`w-20 h-20 ${isDark ? 'text-green-400' : 'text-green-600'}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                        </svg>
                    </div>
                    
                    {/* 404 Text */}
                    <h1 className={`text-9xl font-bold mb-4 ${
                        isDark 
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500' 
                            : 'text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600'
                    }`}>
                        {t('errors.404')}
                    </h1>
                </div>

                {/* Message */}
                <div className="mb-8">
                    <h2 className={`text-3xl font-bold mb-3 ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                        {t('errors.not_found')}
                    </h2>
                    <p className={`text-lg mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        {t('errors.page_not_exist')}
                    </p>
                    <p className={`text-base ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        It might have been moved or deleted, or the URL might be incorrect.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                            isDark
                                ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {t('errors.go_back')}
                    </button>

                    <Link
                        to="/"
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {t('errors.go_to_homepage')}
                    </Link>
                </div>

                {/* Additional Help */}
                <div className={`mt-12 pt-8 border-t ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    <p className={`text-sm mb-4 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        Need help? Visit our support page or contact us
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/chat-support"
                            className={`text-sm font-medium transition-colors ${
                                isDark
                                    ? 'text-green-400 hover:text-green-300'
                                    : 'text-green-600 hover:text-green-700'
                            }`}
                        >
                            {t('navigation.chat_support')}
                        </Link>
                        <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
                        <Link
                            to="/contact"
                            className={`text-sm font-medium transition-colors ${
                                isDark
                                    ? 'text-green-400 hover:text-green-300'
                                    : 'text-green-600 hover:text-green-700'
                            }`}
                        >
                            {t('info.contact_us')}
                        </Link>
                        <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
                        <Link
                            to="/about"
                            className={`text-sm font-medium transition-colors ${
                                isDark
                                    ? 'text-green-400 hover:text-green-300'
                                    : 'text-green-600 hover:text-green-700'
                            }`}
                        >
                            {t('info.about_us')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
