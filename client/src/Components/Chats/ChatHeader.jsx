/**
 * ChatHeader - Header section of chat modal
 */
import React from 'react';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';

export default function ChatHeader({ 
    theme, 
    chatMode, 
    activeInquiry, 
    appLogo, 
    onToggleSidebar, 
    onClose 
}) {
    const { t } = useCustomTranslation();
    
    return (
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
            theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
            <div className="flex items-center gap-3">
                <img src={appLogo} alt="Logo" className="w-10 h-10 rounded-full" />
                <div>
                    <h2 className={`text-lg font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        {chatMode === 'bot' ? t('chat.faq_assistant') : t('chat.live_support')}
                    </h2>
                    {chatMode === 'agent' && activeInquiry && (
                        <p className="text-sm text-gray-500">
                            {t('chat.inquiry')} #{activeInquiry.id} • {activeInquiry.status}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {chatMode === 'agent' && (
                    <button
                        onClick={onToggleSidebar}
                        className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark' 
                                ? 'hover:bg-gray-700 text-gray-300' 
                                : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        title={t('chat.inquiry_history')}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                )}
                <button
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' 
                            ? 'hover:bg-gray-700 text-gray-300' 
                            : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
