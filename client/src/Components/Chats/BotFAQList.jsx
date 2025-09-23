import React, { useState } from 'react';

const BotFAQList = ({ categoryName, faqs, onFAQView, onFAQHelpful, onNotHelpful, onEscalate, onBackToCategories }) => {
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [helpfulClicked, setHelpfulClicked] = useState(new Set());

    const handleFAQClick = (faq) => {
        if (expandedFAQ?.id === faq.id) {
            setExpandedFAQ(null);
        } else {
            setExpandedFAQ(faq);
            onFAQView(faq.id);
        }
    };

    const handleHelpfulClick = (faqId) => {
        onFAQHelpful(faqId);
        setHelpfulClicked(prev => new Set([...prev, faqId]));
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 max-w-[85%]">
            <div className="text-xs text-blue-600 font-semibold mb-2">🤖 Support Bot</div>
            <div className="space-y-3">
                <div className="text-sm text-gray-700 mb-3">
                    Here are some helpful answers for <strong>{categoryName}</strong>:
                </div>
                
                <div className="space-y-2">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <button
                                onClick={() => handleFAQClick(faq)}
                                className="w-full text-left p-3 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                            >
                                <div className="font-medium text-gray-900 text-sm pr-2">
                                    {faq.question}
                                </div>
                                <svg 
                                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                                        expandedFAQ?.id === faq.id ? 'rotate-180' : ''
                                    }`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {expandedFAQ?.id === faq.id && (
                                <div className="px-3 pb-3 border-t border-gray-100">
                                    <div className="text-sm text-gray-700 leading-relaxed mt-2 mb-3">
                                        {faq.answer}
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <span className="text-xs text-gray-500">Was this helpful?</span>
                                        <button
                                            onClick={() => handleHelpfulClick(faq.id)}
                                            disabled={helpfulClicked.has(faq.id)}
                                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                                                helpfulClicked.has(faq.id)
                                                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                                    : 'bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700'
                                            }`}
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                            </svg>
                                            {helpfulClicked.has(faq.id) ? 'Thanks!' : 'Yes'}
                                        </button>
                                        <button
                                            onClick={onNotHelpful}
                                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-700 rounded-full transition-colors duration-200"
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                                            </svg>
                                            No
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="pt-3 border-t border-gray-200 space-y-2">
                    <button
                        onClick={onBackToCategories}
                        className="w-full text-center p-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                    >
                        ← Back to Categories
                    </button>
                    <button
                        onClick={onEscalate}
                        className="w-full text-center p-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                        💬 Still need help? Chat with live agent
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BotFAQList;