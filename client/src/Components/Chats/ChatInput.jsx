/**
 * ChatInput - Input area for sending messages
 */
import React from 'react';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';

export default function ChatInput({ 
    theme,
    chatMode,
    activeInquiry,
    message,
    setMessage,
    attachments,
    onFileSelect,
    onRemoveAttachment,
    onSendMessage,
    onResolve,
    isSending,
    onResetChat,
    onInitializeBot
}) {
    const { t } = useCustomTranslation();
    
    // Resolved state
    if (chatMode === 'agent' && activeInquiry?.status === 'RESOLVED') {
        return (
            <div className={`p-4 border-t ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            } text-center`}>
                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('chat.inquiry_resolved')}
                </p>
                <button
                    onClick={() => {
                        onResetChat();
                        onInitializeBot();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    {t('chat.start_new_inquiry')}
                </button>
            </div>
        );
    }

    return (
        <div data-tutorial="chat-input" className={`p-4 border-t ${
            theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
            {/* Attachments */}
            {attachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {attachments.map((file, idx) => (
                        <div 
                            key={idx} 
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                            }`}
                        >
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                {file.name}
                            </span>
                            <button 
                                onClick={() => onRemoveAttachment(idx)} 
                                className="text-red-600 hover:text-red-800 font-bold"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Row */}
            <div className="flex gap-2">
                {/* File Upload */}
                <input
                    type="file"
                    id="chat-file-input"
                    className="hidden"
                    onChange={onFileSelect}
                    multiple
                />
                <button
                    onClick={() => document.getElementById('chat-file-input').click()}
                    className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' 
                            ? 'hover:bg-gray-700 text-gray-300' 
                            : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    title={t('chat.attach_file')}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>

                {/* Text Input */}
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isSending && onSendMessage()}
                    placeholder={t('chat.type_message')}
                    className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        theme === 'dark' 
                            ? 'border-gray-700 bg-gray-700 text-white placeholder-gray-400' 
                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    disabled={isSending}
                />

                {/* Send Button */}
                <button
                    onClick={onSendMessage}
                    disabled={isSending || (!message.trim() && attachments.length === 0)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSending ? t('chat.sending') : t('chat.send')}
                </button>

                {/* Resolve Button */}
                {chatMode === 'agent' && activeInquiry && activeInquiry.status !== 'RESOLVED' && (
                    <button
                        data-tutorial="escalate-button"
                        onClick={onResolve}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title={t('chat.mark_resolved')}
                    >
                        {t('chat.resolve')}
                    </button>
                )}
            </div>
        </div>
    );
}
