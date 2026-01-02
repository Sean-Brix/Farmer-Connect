/**
 * Chat Component - User Chat Interface (Modular Rebuild)
 * Pure HTTP Polling Implementation - No Socket.io
 * 
 * Features:
 * - FAQ Bot with categories and questions  
 * - Escalation to live agent (creates inquiry)
 * - Real-time messaging via HTTP polling (only when modal is open)
 * - Attachment support
 * - Inquiry history sidebar
 * - Mark inquiry as resolved
 */

import React, { useState, useRef, useEffect } from 'react';
import botAvatar from '../../Assets/default_picture.png';
import userAvatar from '../../Assets/eic_default.png';
import appLogo from '../../Assets/Logo.png';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import ImageViewer from '../Common/ImageViewer.jsx';
import botAPI from '../../Services/botAPI.js';
import {
    useActiveInquiry,
    useInquiryMessages,
    useUserInquiries,
    useCreateInquiry,
    useResolveInquiry
} from '../../hooks/useInquiryPolling.js';
import { createInquiryTutorial } from './inquiryTutorial.js';
import './inquiryTutorial.css';

// Modular Components
import ChatModal from './ChatModal.jsx';
import ChatHeader from './ChatHeader.jsx';
import MessageList from './MessageList.jsx';
import ChatInput from './ChatInput.jsx';
import InquirySidebar from './InquirySidebar.jsx';
import Toast from './Toast.jsx';

function Chat() {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chatMode, setChatMode] = useState('bot'); // 'bot' or 'agent'
    const [searchQuery, setSearchQuery] = useState('');
    const [localMessages, setLocalMessages] = useState([]);
    
    // Bot state
    const [botWelcomeMessage, setBotWelcomeMessage] = useState(null);
    const [showingCategories, setShowingCategories] = useState(false);
    const [showingFAQs, setShowingFAQs] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    
    // UI state
    const [toast, setToast] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [viewer, setViewer] = useState({ open: false, src: '', filename: '' });
    const messagesEndRef = useRef(null);
    const [tutorial, setTutorial] = useState(null);
    const [isTutorialActive, setIsTutorialActive] = useState(false);

    // HTTP Polling Hooks - Only enabled when modal is open
    const { activeInquiry, refetch: refetchActiveInquiry } = useActiveInquiry({ enabled: open });
    const { inquiries: pastInquiries = [] } = useUserInquiries({ enabled: open });
    const createInquiryMutation = useCreateInquiry();
    const resolveInquiryMutation = useResolveInquiry();
    
    const {
        messages: polledMessages,
        sendMessage: sendInquiryMessage,
        isSending
    } = useInquiryMessages(activeInquiry?.id, {
        enabled: open && chatMode === 'agent' && !!activeInquiry?.id && ['PENDING', 'IN_PROGRESS'].includes(activeInquiry?.status),
        pollInterval: 3000
    });

    // Body scroll control
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    // Initialize tutorial
    useEffect(() => {
        const tourInstance = createInquiryTutorial();
        setTutorial(tourInstance);

        return () => {
            if (tourInstance) {
                tourInstance.complete();
            }
        };
    }, []);

    const startTutorial = () => {
        if (tutorial) {
            setIsTutorialActive(true);
            tutorial.start();

            tutorial.on('complete', () => {
                setIsTutorialActive(false);
            });

            tutorial.on('cancel', () => {
                setIsTutorialActive(false);
            });
        }
    };

    // Initialize on open
    useEffect(() => {
        console.log('[CHAT] Modal open state changed:', open);
        console.log('[CHAT] Active inquiry:', activeInquiry);
        console.log('[CHAT] Active inquiry status:', activeInquiry?.status);
        console.log('[CHAT] Active inquiry replies:', activeInquiry?.replies?.length || 0);
        if (open) {
            // Check if there's an active inquiry with messages
            const hasActiveInquiryWithMessages = activeInquiry && 
                ['PENDING', 'IN_PROGRESS'].includes(activeInquiry?.status) && 
                activeInquiry.replies && 
                activeInquiry.replies.length > 0;
            
            if (hasActiveInquiryWithMessages) {
                // Resume existing inquiry with messages
                console.log('[CHAT] ✓ Resuming existing inquiry with messages, switching to agent mode');
                setChatMode('agent');
                loadInquiryMessages();
            } else {
                // Start with bot (no inquiry, or inquiry has no messages yet)
                console.log('[CHAT] ✓ Starting with bot mode (no active inquiry with messages)');
                setChatMode('bot');
                initializeBotChat();
            }
        } else {
            // Reset on close
            console.log('[CHAT] Resetting chat on close');
            resetChat();
        }
    }, [open, activeInquiry?.id, activeInquiry?.replies?.length]);

    // Sync polled messages to local state
    useEffect(() => {
        console.log('[MESSAGES] Chat mode:', chatMode, 'Polled messages:', polledMessages?.length || 0);
        if (chatMode === 'agent' && polledMessages && polledMessages.length > 0) {
            console.log('[MESSAGES] Formatting polled messages:', polledMessages);
            const formatted = polledMessages.map(msg => ({
                id: msg.id,
                from: msg.senderType === 'ADMIN' ? 'admin' : 'user',
                text: msg.message,
                time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: msg.createdAt,
                attachments: msg.attachments || [], // Include attachments with streamUrl from server
                senderId: msg.senderId
            }));

            // Merge with existing messages
            setLocalMessages(prev => {
                // If no previous messages, just use formatted messages (on initial load or refresh)
                if (prev.length === 0) {
                    return formatted;
                }
                
                // Get existing message IDs (excluding pending/optimistic ones)
                const existingIds = new Set(prev.filter(m => m.id).map(m => m.id));
                
                // Find new messages from polling that we don't have yet
                const newMessages = formatted.filter(msg => !existingIds.has(msg.id));
                
                if (newMessages.length > 0) {
                    // Remove pending optimistic messages that now have real IDs
                    const withoutPending = prev.filter(m => !m.pending);
                    // Append new messages
                    return [...withoutPending, ...newMessages];
                }
                
                return prev;
            });
        }
    }, [polledMessages, chatMode]);

    // Auto-scroll to bottom
    useEffect(() => {
        console.log('[MESSAGES] Local messages updated, count:', localMessages.length);
        console.log('[MESSAGES] Current messages:', localMessages);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localMessages]);

    // === BOT FUNCTIONS ===
    const initializeBotChat = async () => {
        console.log('[BOT] Initializing bot chat...');
        try {
            const welcomeData = await botAPI.getWelcomeMessage();
            console.log('[BOT] Welcome data received:', welcomeData);
            if (welcomeData) {
                setBotWelcomeMessage(welcomeData);
                const botMsg = {
                    from: 'bot',
                    text: welcomeData.message,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    botData: welcomeData
                };
                console.log('[BOT] Setting bot message:', botMsg);
                setLocalMessages([botMsg]);
                setShowingCategories(true);
            } else {
                console.warn('[BOT] No welcome data received');
            }
        } catch (error) {
            console.error('[BOT] Error initializing bot:', error);
            escalateToAgent();
        }
    };

    const handleCategorySelect = async (category) => {
        try {
            const userMsg = {
                from: 'user',
                text: `I need help with ${category.name}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setLocalMessages(prev => [...prev, userMsg]);

            const faqData = await botAPI.getCategoryFAQs(category.id);
            if (faqData) {
                const botMsg = {
                    from: 'bot',
                    text: faqData.message,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    botData: faqData
                };
                setLocalMessages(prev => [...prev, botMsg]);
                setCurrentCategory(category);
                setShowingCategories(false);
                setShowingFAQs(true);

                if (faqData.escalate) {
                    setTimeout(() => escalateToAgent(), 1000);
                }
            }
        } catch (error) {
            console.error('Error handling category:', error);
            escalateToAgent();
        }
    };

    const handleFAQView = async (faqId) => {
        await botAPI.trackFAQView(faqId);
    };

    const handleFAQHelpful = async (faqId) => {
        await botAPI.markFAQHelpful(faqId);
        showToast('info', 'Thanks!', 'Glad we could help you.');
    };

    const handleFAQNotHelpful = async () => {
        try {
            const escalationData = await botAPI.markFAQNotHelpful();
            if (escalationData) {
                const botMsg = {
                    from: 'bot',
                    text: escalationData.message,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setLocalMessages(prev => [...prev, botMsg]);
                setTimeout(() => escalateToAgent(), 1000);
            }
        } catch (error) {
            console.error('Error handling not helpful:', error);
            escalateToAgent();
        }
    };

    const handleBackToCategories = () => {
        setShowingFAQs(false);
        setShowingCategories(true);
        setCurrentCategory(null);
        
        if (botWelcomeMessage) {
            const botMsg = {
                from: 'bot',
                text: "Let me show you the categories again. Please select the topic you need help with:",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                botData: botWelcomeMessage
            };
            setLocalMessages(prev => [...prev, botMsg]);
        }
    };

    const escalateToAgent = async () => {
        try {
            const result = await createInquiryMutation.mutateAsync({
                subject: 'Live Agent Request',
                message: 'User requested live agent assistance from bot chat.'
            });

            const inquiry = result.data;
            await refetchActiveInquiry();

            setChatMode('agent');
            setShowingCategories(false);
            setShowingFAQs(false);

            const systemMsg = {
                from: 'system',
                text: `Connected to live support. Your inquiry ID is #${inquiry.id}. An agent will respond shortly.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setLocalMessages(prev => [...prev, systemMsg]);

        } catch (error) {
            console.error('Error creating inquiry:', error);
            showToast('error', 'Error', 'Failed to connect to live support. Please try again.');
        }
    };

    // === AGENT FUNCTIONS ===
    const loadInquiryMessages = () => {
        if (activeInquiry && activeInquiry.replies) {
            const formatted = activeInquiry.replies.map(msg => ({
                id: msg.id,
                from: msg.senderType === 'ADMIN' ? 'admin' : 'user',
                text: msg.message,
                time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: msg.createdAt,
                attachments: msg.attachments || [], // Include attachments
                mime: msg.mime,
                filename: msg.filename,
                senderId: msg.senderId
            }));
            setLocalMessages(formatted);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() && attachments.length === 0) return;

        const messageText = message.trim();
        const filesToSend = [...attachments];
        setMessage('');
        setAttachments([]);

        if (chatMode === 'bot') {
            // Handle bot interaction
            const userMsg = {
                from: 'user',
                text: messageText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setLocalMessages(prev => [...prev, userMsg]);

            // Bot would process this, but for now just escalate
            setTimeout(() => escalateToAgent(), 500);

        } else if (chatMode === 'agent' && activeInquiry) {
            try {
                // Create blob URLs for optimistic preview
                const attachmentPreviews = filesToSend.map(f => ({
                    filename: f.name,
                    mimetype: f.type,
                    streamUrl: URL.createObjectURL(f),
                    pending: true
                }));

                // Optimistic update
                const optimisticMsg = {
                    from: 'user',
                    text: messageText,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    pending: true,
                    attachments: attachmentPreviews
                };
                setLocalMessages(prev => [...prev, optimisticMsg]);

                // Send via API with attachments
                await sendInquiryMessage(messageText, filesToSend);

                // Clean up blob URLs
                attachmentPreviews.forEach(att => URL.revokeObjectURL(att.streamUrl));

            } catch (error) {
                console.error('Error sending message:', error);
                showToast('error', 'Error', 'Failed to send message. Please try again.');
                
                // Remove optimistic message on failure and restore attachments
                setLocalMessages(prev => prev.filter(m => !m.pending));
                setAttachments(filesToSend);
            }
        }
    };

    const handleResolve = async () => {
        if (!activeInquiry) return;

        try {
            await resolveInquiryMutation.mutateAsync(activeInquiry.id);
            
            showToast('info', 'Inquiry Resolved', 'Your inquiry has been marked as resolved.');
            
            // Return to bot mode
            setTimeout(() => {
                resetChat();
                setChatMode('bot');
                initializeBotChat();
            }, 1500);

        } catch (error) {
            console.error('Error resolving inquiry:', error);
            showToast('error', 'Error', 'Failed to resolve inquiry. Please try again.');
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(prev => [...prev, ...files]);
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSelectPastInquiry = async (inquiry) => {
        // Load past inquiry for viewing (read-only if RESOLVED)
        setSidebarOpen(false);
        
        // Switch to agent mode to display the inquiry
        setChatMode('agent');
        
        // Set the active inquiry with its status
        setActiveInquiry(inquiry);
        
        // Format inquiry messages
        if (inquiry.replies && inquiry.replies.length > 0) {
            const formatted = inquiry.replies.map(msg => ({
                id: msg.id,
                from: msg.senderType === 'ADMIN' ? 'admin' : 'user',
                text: msg.message,
                time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: msg.createdAt,
                attachments: msg.attachments || [],
                senderId: msg.senderId
            }));
            setLocalMessages(formatted);
        } else {
            // Just the initial message
            const initialMsg = {
                from: 'user',
                text: inquiry.message,
                time: new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: inquiry.createdAt
            };
            setLocalMessages([initialMsg]);
        }
        
        // Show info toast if resolved
        if (inquiry.status === 'RESOLVED') {
            showToast('info', 'Viewing Past Inquiry', 'This inquiry has been resolved. You cannot send new messages here.');
        }
    };

    // === UTILITY ===
    const resetChat = () => {
        setLocalMessages([]);
        setMessage('');
        setAttachments([]);
        setShowingCategories(false);
        setShowingFAQs(false);
        setCurrentCategory(null);
    };

    const showToast = (type, title, message) => {
        setToast({ type, title, message });
    };

    const filteredInquiries = pastInquiries.filter(inq =>
        inq.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.message?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // === RENDER ===
    console.log('[RENDER] Rendering Chat - open:', open, 'chatMode:', chatMode, 'messages:', localMessages.length);
    console.log('[RENDER] showingCategories:', showingCategories, 'showingFAQs:', showingFAQs);
    
    return (
        <>
            {/* Chat Button */}
            <button
                data-tutorial="chat-button"
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-all hover:scale-110"
                aria-label="Open Chat"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </button>

            {/* Chat Modal with Frosted Glass Backdrop */}
            <ChatModal isOpen={open} onClose={() => setOpen(false)}>
                <div className={`h-[95%] mt-10 rounded-lg shadow-2xl flex flex-col overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    
                    {/* Header */}
                    <ChatHeader
                        theme={theme}
                        chatMode={chatMode}
                        activeInquiry={activeInquiry}
                        appLogo={appLogo}
                        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                        onClose={() => setOpen(false)}
                        onStartTutorial={startTutorial}
                    />

                    {/* Main Content Area */}
                    <div className="flex flex-1 overflow-hidden">
                        
                        {/* Messages */}
                        <div className="flex-1 flex flex-col min-w-0">
                            {console.log('[RENDER MessageList] Props:', {
                                messagesCount: localMessages.length,
                                messages: localMessages,
                                theme,
                                showingCategories,
                                showingFAQs,
                                chatMode
                            })}
                            <MessageList
                                messages={localMessages}
                                theme={theme}
                                userAvatar={userAvatar}
                                botAvatar={botAvatar}
                                showingCategories={showingCategories}
                                showingFAQs={showingFAQs}
                                onCategorySelect={handleCategorySelect}
                                onFAQView={handleFAQView}
                                onFAQHelpful={handleFAQHelpful}
                                onFAQNotHelpful={handleFAQNotHelpful}
                                onBackToCategories={handleBackToCategories}
                                onEscalate={escalateToAgent}
                                messagesEndRef={messagesEndRef}
                            />

                            {/* Input Area */}
                            <ChatInput
                                theme={theme}
                                chatMode={chatMode}
                                activeInquiry={activeInquiry}
                                message={message}
                                setMessage={setMessage}
                                attachments={attachments}
                                onFileSelect={handleFileSelect}
                                onRemoveAttachment={removeAttachment}
                                onSendMessage={handleSendMessage}
                                onResolve={handleResolve}
                                isSending={isSending}
                                onResetChat={resetChat}
                                onInitializeBot={initializeBotChat}
                            />
                        </div>

                        {/* Sidebar - Inquiry History */}
                        <InquirySidebar
                            theme={theme}
                            isOpen={sidebarOpen}
                            inquiries={filteredInquiries}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onSelectInquiry={handleSelectPastInquiry}
                        />
                    </div>
                </div>
            </ChatModal>

            {/* Toast Notification */}
            <Toast toast={toast} onClose={() => setToast(null)} />

            {/* Image Viewer */}
            {viewer.open && (
                <ImageViewer
                    src={viewer.src}
                    filename={viewer.filename}
                    onClose={() => setViewer({ open: false, src: '', filename: '' })}
                />
            )}
        </>
    );
}

export default React.memo(Chat);
