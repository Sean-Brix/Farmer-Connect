/**
 * Chat_Module - Admin Chat Interface (Complete Rebuild)
 * Pure HTTP Polling Implementation - No Socket.io
 * 
 * Features:
 * - Three-tab system (PENDING, IN_PROGRESS, RESOLVED)
 * - Real-time inquiry list updates via HTTP polling
 * - Real-time message updates via HTTP polling
 * - Admin reply functionality
 * - Attachment support
 * - Search/filter inquiries
 * - Unread badges
 * - Pagination
 */

import React, { useEffect, useRef, useState } from 'react';
import { useAdminInquiries, useInquiryMessages } from '../../../hooks/useInquiryPolling.js';
import ImagePreview from '../../../Components/Chats/ImagePreview.jsx';
import FillSurveyModal from '../../../Components/Survey/FillSurveyModal.jsx';
import { surveyFormsAPI } from '../Survey/surveyFormsAPI.js';

export default function Chat_Module() {
    // Admin is always in light mode - no theme needed
    
    // State
    const [activeTab, setActiveTab] = useState('PENDING');
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [messageText, setMessageText] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [toast, setToast] = useState(null);
    const [imagePreview, setImagePreview] = useState({ open: false, src: '', filename: '' });
    const [surveyModal, setSurveyModal] = useState({ open: false, surveyId: null, title: '' });
    const [showSurveyPicker, setShowSurveyPicker] = useState(false);
    const [surveys, setSurveys] = useState([]);
    const [loadingSurveys, setLoadingSurveys] = useState(false);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    // Refs
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // HTTP Polling Hooks
    const { inquiries: allInquiries, isLoading, refetch: refetchInquiries } = useAdminInquiries(activeTab);
    
    // Get ALL inquiries for tab counts (without status filter)
    const { inquiries: allInquiriesForCounts = [] } = useAdminInquiries(null);
    
    const {
        messages: polledMessages,
        sendMessage: sendInquiryMessage,
        isSending
    } = useInquiryMessages(selectedChat?.id, {
        // Show messages for all inquiries, but only poll for active ones
        enabled: !!selectedChat?.id,
        pollInterval: ['PENDING', 'IN_PROGRESS'].includes(selectedChat?.status) ? 3000 : false,
        onNewMessage: (msg) => {
            // Refresh inquiry list when new message arrives
            refetchInquiries();
        }
    });

    // Auto-hide toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Sync polled messages with selected chat
    useEffect(() => {
        if (!selectedChat || !polledMessages || polledMessages.length === 0) return;

        const formattedReplies = polledMessages.map(msg => ({
            id: msg.id,
            message: msg.message,
            createdAt: msg.createdAt,
            senderType: msg.senderType,
            senderId: msg.senderId,
            senderName: msg.senderName,
            attachments: msg.attachments || [] // Include attachments
        }));

        // Merge with existing replies - append new ones
        setSelectedChat(prev => {
            if (!prev) return prev;
            
            const existingIds = new Set((prev.replies || []).map(r => r.id));
            const newReplies = formattedReplies.filter(msg => !existingIds.has(msg.id));
            
            if (newReplies.length > 0) {
                return {
                    ...prev,
                    replies: [...(prev.replies || []), ...newReplies]
                };
            }
            
            return prev;
        });
    }, [polledMessages, selectedChat?.id]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (selectedChat && messagesContainerRef.current) {
            setTimeout(() => {
                if (messagesContainerRef.current) {
                    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                }
            }, 100);
        }
    }, [selectedChat?.id, selectedChat?.replies?.length]);

    // Reset page when tab changes
    useEffect(() => {
        setCurrentPage(1);
        setSelectedChat(null);
    }, [activeTab]);

    // Handle sending message
    const handleSendMessage = async () => {
        if ((!messageText.trim() && attachments.length === 0) || !selectedChat) return;

        const text = messageText.trim() || '(Attachment)';
        const filesToSend = [...attachments];
        setMessageText('');
        setAttachments([]);

        try {
            await sendInquiryMessage(text, filesToSend);
            refetchInquiries(); // Update inquiry list
        } catch (error) {
            console.error('Error sending message:', error);
            showToast('error', 'Error', 'Failed to send message. Please try again.');
            // Restore attachments on error
            setAttachments(filesToSend);
        }
    };

    const handleSelectInquiry = (inquiry) => {
        setSelectedChat(inquiry);
    };

    const showToast = (type, title, message) => {
        setToast({ type, title, message });
    };
    
    const isImageFile = (mimetype, filename) => {
        if (mimetype) {
            return mimetype.startsWith('image/');
        }
        const ext = filename?.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
    };
    
    const loadSurveys = async () => {
        setLoadingSurveys(true);
        try {
            const result = await surveyFormsAPI.getAll({ status: 'ACTIVE', limit: 100 });
            setSurveys(result.data || []);
        } catch (error) {
            console.error('Error loading surveys:', error);
            showToast('error', 'Error', 'Failed to load survey forms');
        } finally {
            setLoadingSurveys(false);
        }
    };
    
    const handleSendSurvey = async (survey) => {
        if (!selectedChat) return;
        
        // Send special formatted message that will render as button on client side
        const message = `__FC_FORM__${JSON.stringify({ id: survey.id, title: survey.title })}`;
        
        try {
            await sendInquiryMessage(message, []);
            setShowSurveyPicker(false);
            showToast('info', 'Survey Sent', `Survey "${survey.title}" has been sent to the user`);
            refetchInquiries();
        } catch (error) {
            console.error('Error sending survey:', error);
            showToast('error', 'Error', 'Failed to send survey');
        }
    };

    // Filter and paginate inquiries
    const filteredInquiries = allInquiries.filter(inq => {
        const userName = inq.user ? `${inq.user.firstName} ${inq.user.surname}` : `User #${inq.userId}`;
        return inq.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInquiries = filteredInquiries.slice(startIndex, startIndex + itemsPerPage);

    // Stats for dashboard - use allInquiriesForCounts to get accurate counts
    const pendingCount = allInquiriesForCounts.filter(i => i.status === 'PENDING').length;
    const inProgressCount = allInquiriesForCounts.filter(i => i.status === 'IN_PROGRESS').length;
    const resolvedCount = allInquiriesForCounts.filter(i => i.status === 'RESOLVED').length;

    // Render functions
    const renderInquiryList = () => (
        <div className="flex flex-col h-full">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
                <input
                    type="text"
                    placeholder="Search inquiries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
            </div>

            {/* Inquiry List */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : paginatedInquiries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No inquiries found</div>
                ) : (
                    <div className="space-y-2 p-4">
                        {paginatedInquiries.map(inquiry => {
                            const userName = inquiry.user ? `${inquiry.user.firstName} ${inquiry.user.surname}` : `User #${inquiry.userId}`;
                            const hasUnread = inquiry.unreadCount > 0;
                            
                            return (
                                <div
                                    key={inquiry.id}
                                    onClick={() => handleSelectInquiry(inquiry)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-colors relative ${
                                        selectedChat?.id === inquiry.id
                                            ? 'bg-green-50 border-green-500 shadow-sm'
                                            : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className={`font-semibold text-sm text-gray-900 ${
                                                    hasUnread ? 'font-bold' : ''
                                                }`}>
                                                    {userName}
                                                </p>
                                                {hasUnread && (
                                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(inquiry.createdAt).toLocaleDateString()} • #{inquiry.id}
                                            </p>
                                            {inquiry.lastMessage && (
                                                <p className={`text-xs mt-1 line-clamp-1 ${
                                                    hasUnread ? 'text-gray-900 font-medium' : 'text-gray-600'
                                                }`}>
                                                    {inquiry.lastMessage.startsWith('__FC_FORM__') 
                                                        ? (() => {
                                                            try {
                                                                const data = JSON.parse(inquiry.lastMessage.replace('__FC_FORM__', ''));
                                                                return `📋 Survey: ${data.title}`;
                                                            } catch {
                                                                return '📋 Survey Form';
                                                            }
                                                        })()
                                                        : inquiry.lastMessage
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        {hasUnread && (
                                            <span className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full font-semibold shadow-sm">
                                                {inquiry.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-white">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-medium"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-medium"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );

    const renderChatWindow = () => {
        if (!selectedChat) {
            return (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <p>Select an inquiry to start chatting</p>
                    </div>
                </div>
            );
        }

        const replies = selectedChat.replies || polledMessages || [];

        return (
            <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {selectedChat.user ? `${selectedChat.user.firstName} ${selectedChat.user.surname}` : `User #${selectedChat.userId}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Inquiry #{selectedChat.id} • {new Date(selectedChat.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            selectedChat.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            selectedChat.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                            {selectedChat.status}
                        </span>
                    </div>
                </div>

                {/* Messages */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {/* Initial Inquiry Message */}
                    <div className="flex justify-start">
                        <div className="max-w-[70%]">
                            <div className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 shadow-sm">
                                {selectedChat.message}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {selectedChat.user ? `${selectedChat.user.firstName} ${selectedChat.user.surname}` : 'User'} • {new Date(selectedChat.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Reply Messages */}
                    {replies.map((reply, idx) => {
                        const isAdmin = reply.senderType === 'ADMIN';
                        // Check if this is a survey form message
                        const isSurveyForm = typeof reply.message === 'string' && reply.message.startsWith('__FC_FORM__');
                        let surveyData = null;
                        if (isSurveyForm) {
                            try {
                                surveyData = JSON.parse(reply.message.replace('__FC_FORM__', ''));
                            } catch (e) {
                                console.error('Failed to parse survey data:', e);
                            }
                        }
                        
                        return (
                            <div key={reply.id || idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                <div className="max-w-[70%]">
                                    <div className={`px-4 py-2 rounded-lg shadow-sm ${
                                        isAdmin 
                                            ? 'bg-green-600 text-white' 
                                            : 'bg-white border border-gray-200 text-gray-900'
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
                                            reply.message
                                        )}
                                        
                                        {/* Display attachments */}
                                        {reply.attachments && reply.attachments.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {reply.attachments.map((att, attIdx) => {
                                                    const isImage = isImageFile(att.mimetype, att.filename);
                                                    return isImage ? (
                                                        <button
                                                            key={attIdx}
                                                            onClick={() => setImagePreview({ open: true, src: att.streamUrl, filename: att.filename })}
                                                            className={`flex items-center gap-2 px-3 py-1 rounded text-xs cursor-pointer ${
                                                                isAdmin 
                                                                    ? 'bg-green-700 hover:bg-green-800' 
                                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                            }`}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span>{att.filename}</span>
                                                            {att.filesize && (
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
                                                                isAdmin 
                                                                    ? 'bg-green-700 hover:bg-green-800' 
                                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                            }`}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                            </svg>
                                                            <span>{att.filename}</span>
                                                            {att.filesize && (
                                                                <span className="opacity-70">({(att.filesize / 1024).toFixed(1)} KB)</span>
                                                            )}
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {reply.senderName || (isAdmin ? 'Admin' : (selectedChat.user ? `${selectedChat.user.firstName} ${selectedChat.user.surname}` : 'User'))} • {new Date(reply.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                {selectedChat.status === 'RESOLVED' ? (
                    <div className="p-4 border-t border-gray-200 text-center text-gray-500 bg-gray-50">
                        This inquiry has been resolved. No further replies allowed.
                    </div>
                ) : (
                    <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
                        {/* Attachments Preview */}
                        {attachments.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-xs sm:text-sm">
                                        <span className="text-gray-700 truncate max-w-[150px]">{file.name}</span>
                                        <button
                                            onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                                            className="text-red-600 hover:text-red-800 flex-shrink-0"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="file"
                                id="admin-attachment"
                                multiple
                                onChange={(e) => setAttachments(prev => [...prev, ...Array.from(e.target.files)])}
                                className="hidden"
                            />
                            <div className="flex gap-2">
                                <label
                                    htmlFor="admin-attachment"
                                    className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer flex items-center gap-2 text-gray-700 font-medium text-sm sm:text-base flex-shrink-0"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    <span className="hidden sm:inline">Attach</span>
                                </label>
                                <button
                                    onClick={() => {
                                        setShowSurveyPicker(!showSurveyPicker);
                                        if (!showSurveyPicker && surveys.length === 0) {
                                            loadSurveys();
                                        }
                                    }}
                                    className="px-3 sm:px-4 py-2 bg-blue-200 hover:bg-blue-300 rounded-lg cursor-pointer flex items-center gap-2 text-blue-700 font-medium text-sm sm:text-base flex-shrink-0"
                                    title="Send Survey Form"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    <span className="hidden sm:inline">Survey</span>
                                </button>
                            </div>
                            <input
                                type="text"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your reply..."
                                className="flex-1 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isSending || (!messageText.trim() && attachments.length === 0)}
                                className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base flex-shrink-0"
                            >
                                {isSending ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-screen bg-gray-50 mt-15 overflow-hidden">
            <div className="container mx-auto p-4 sm:p-6 h-full flex flex-col">

                {/* Main Chat Area */}
                <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col min-h-0">
                    {/* Tabs with Counts */}
                    <div className="border-b border-gray-200 flex bg-white overflow-x-auto">
                        {['PENDING', 'IN_PROGRESS', 'RESOLVED'].map(tab => {
                            const count = tab === 'PENDING' ? pendingCount : tab === 'IN_PROGRESS' ? inProgressCount : resolvedCount;
                            return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 min-w-[120px] px-4 sm:px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
                                    activeTab === tab
                                        ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span className="truncate">{tab.replace('_', ' ')}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                    activeTab === tab 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-200 text-gray-700'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );})}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex overflow-hidden flex-col sm:flex-row min-h-0">
                        {/* Left: Inquiry List */}
                        <div className="w-full sm:w-96 border-b sm:border-b-0 sm:border-r border-gray-200 bg-white flex-shrink-0 overflow-hidden">
                            {renderInquiryList()}
                        </div>

                        {/* Right: Chat Window */}
                        <div className="flex-1 min-h-0 overflow-hidden">
                            {renderChatWindow()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-lg ${
                    toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                } text-white max-w-sm`}>
                    <p className="font-semibold">{toast.title}</p>
                    <p className="text-sm">{toast.message}</p>
                </div>
            )}
            
            {/* Image Preview */}
            {imagePreview.open && (
                <ImagePreview
                    src={imagePreview.src}
                    filename={imagePreview.filename}
                    onClose={() => setImagePreview({ open: false, src: '', filename: '' })}
                />
            )}
            
            {/* Survey Picker Modal */}
            {showSurveyPicker && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
                    style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                    onClick={() => setShowSurveyPicker(false)}
                >
                    <div 
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Send Survey Form</h2>
                            <p className="text-gray-600 mt-1">Select a survey to send to the user</p>
                        </div>
                        
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {loadingSurveys ? (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    <p className="mt-2 text-gray-600">Loading surveys...</p>
                                </div>
                            ) : surveys.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="mt-4">No active surveys available</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {surveys.map(survey => (
                                        <button
                                            key={survey.id}
                                            onClick={() => handleSendSurvey(survey)}
                                            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                                        >
                                            <h3 className="font-semibold text-gray-900">{survey.title}</h3>
                                            {survey.description && (
                                                <p className="text-sm text-gray-600 mt-1">{survey.description}</p>
                                            )}
                                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                                <span>📋 {survey.fields?.length || 0} questions</span>
                                                {survey.category && <span>🏷️ {survey.category}</span>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-6 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setShowSurveyPicker(false)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
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
