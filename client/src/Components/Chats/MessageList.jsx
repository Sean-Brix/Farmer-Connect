/**
 * MessageList - Displays chat messages
 */
import React, { useState } from 'react';
import BotCategoryButtons from './BotCategoryButtons.jsx';
import BotFAQList from './BotFAQList.jsx';
import ImagePreview from './ImagePreview.jsx';
import FillSurveyModal from '../Survey/FillSurveyModal.jsx';

export default function MessageList({ 
    messages, 
    theme,
    userAvatar,
    botAvatar,
    showingCategories,
    showingFAQs,
    onCategorySelect,
    onFAQView,
    onFAQHelpful,
    onFAQNotHelpful,
    onBackToCategories,
    onEscalate,
    messagesEndRef
}) {
    const [imagePreview, setImagePreview] = useState({ open: false, src: '', filename: '' });
    const [surveyModal, setSurveyModal] = useState({ open: false, surveyId: null, title: '' });
    
    const isImageFile = (mimetype, filename) => {
        if (mimetype) {
            return mimetype.startsWith('image/');
        }
        const ext = filename?.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
    };
    
    return (
        <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            {messages.map((msg, idx) => {
                // Check if this is a survey form message
                const isSurveyForm = typeof msg.text === 'string' && msg.text.startsWith('__FC_FORM__');
                let surveyData = null;
                if (isSurveyForm) {
                    try {
                        surveyData = JSON.parse(msg.text.replace('__FC_FORM__', ''));
                    } catch (e) {
                        console.error('Failed to parse survey data:', e);
                    }
                }
                
                return (
                <div key={msg.id || idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[70%] ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                        <img
                            src={msg.from === 'user' ? userAvatar : botAvatar}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div>
                            <div className={`px-4 py-2 rounded-lg ${
                                msg.from === 'user' 
                                    ? 'bg-green-600 text-white' 
                                    : msg.from === 'system'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-gray-200'
                            }`}>
                                {/* Survey Form Button */}
                                {isSurveyForm && surveyData ? (
                                    <button
                                        onClick={() => setSurveyModal({ open: true, surveyId: surveyData.id, title: surveyData.title })}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-green-600 text-green-800 bg-green-50 hover:bg-green-100 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                        {surveyData.title || 'Open Survey Form'}
                                    </button>
                                ) : (
                                    <>
                                        {msg.text && msg.text.trim() && (
                                            <>
                                                {msg.text}
                                                {msg.pending && <span className="ml-2 text-xs opacity-70">Sending...</span>}
                                            </>
                                        )}
                                    </>
                                )}
                                
                                {/* Display attachments */}
                                {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {msg.attachments.map((att, attIdx) => {
                                            // Skip attachments without streamUrl (expired blob URLs or missing data)
                                            if (!att.streamUrl) return null;
                                            
                                            const isImage = isImageFile(att.mimetype, att.filename);
                                            return isImage ? (
                                                <button
                                                    key={attIdx}
                                                    onClick={() => setImagePreview({ open: true, src: att.streamUrl, filename: att.filename })}
                                                    className={`flex items-center gap-2 px-3 py-1 rounded text-xs cursor-pointer ${
                                                        msg.from === 'user' 
                                                            ? 'bg-green-700 hover:bg-green-800' 
                                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                    } ${att.pending ? 'opacity-50' : ''}`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{att.filename}</span>
                                                    {!att.pending && att.filesize && (
                                                        <span className="opacity-70">({(att.filesize / 1024).toFixed(1)} KB)</span>
                                                    )}
                                                </button>
                                            ) : (
                                                <a
                                                    key={attIdx}
                                                    href={att.streamUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download={att.filename}
                                                    className={`flex items-center gap-2 px-3 py-1 rounded text-xs ${
                                                        msg.from === 'user' 
                                                            ? 'bg-green-700 hover:bg-green-800' 
                                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                    } ${att.pending ? 'opacity-50' : ''}`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                    </svg>
                                                    <span>{att.filename}</span>
                                                    {!att.pending && att.filesize && (
                                                        <span className="opacity-70">({(att.filesize / 1024).toFixed(1)} KB)</span>
                                                    )}
                                                </a>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            {msg.time && (
                                <p className={`text-xs mt-1 ${
                                    msg.from === 'user' ? 'text-right' : 'text-left'
                                } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {msg.time}
                                </p>
                            )}
                            {msg.botData && showingCategories && msg.botData.categories && msg.botData.categories.length > 0 && (
                                <div className="mt-3">
                                    <BotCategoryButtons
                                        categories={msg.botData.categories}
                                        onCategorySelect={onCategorySelect}
                                        onEscalate={onEscalate}
                                    />
                                </div>
                            )}
                            {msg.botData && showingFAQs && msg.botData.faqs && msg.botData.faqs.length > 0 && (
                                <div className="mt-3">
                                    <BotFAQList
                                        faqs={msg.botData.faqs}
                                        onFAQView={onFAQView}
                                        onFAQHelpful={onFAQHelpful}
                                        onNotHelpful={onFAQNotHelpful}
                                        onBackToCategories={onBackToCategories}
                                        onEscalate={onEscalate}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );})}
            <div ref={messagesEndRef} />
            
            {/* Image Preview Modal */}
            {imagePreview.open && (
                <ImagePreview
                    src={imagePreview.src}
                    filename={imagePreview.filename}
                    onClose={() => setImagePreview({ open: false, src: '', filename: '' })}
                />
            )}
            
            {/* Survey Form Modal */}
            {surveyModal.open && (
                <FillSurveyModal
                    isOpen={surveyModal.open}
                    onClose={() => setSurveyModal({ open: false, surveyId: null, title: '' })}
                    surveyId={surveyModal.surveyId}
                    title={surveyModal.title}
                />
            )}
        </div>
    );
}
