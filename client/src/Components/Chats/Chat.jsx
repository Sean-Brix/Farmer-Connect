import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../../Client/Components/Navbar.jsx'
import botAvatar from '../../Assets/default_picture.png';
import userAvatar from '../../Assets/eic_default.png';
import appLogo from '../../Assets/Logo.png';
import { useSocket } from '../../contexts/SocketContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import ImageViewer from '../Common/ImageViewer.jsx';
import FillSurveyModal from '../Survey/FillSurveyModal.jsx';
import BotCategoryButtons from './BotCategoryButtons.jsx';
import BotFAQList from './BotFAQList.jsx';
import botAPI from '../../Services/botAPI.js';

export default function Chat() {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false); // Controls sidebar visibility
    const [chatMode, setChatMode] = useState('bot'); // Start with bot assistance
    const [adminRequested, setAdminRequested] = useState(false);
    const [pastInquiries, setPastInquiries] = useState([]);
    const [activeInquiry, setActiveInquiry] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState([]);
    
    // Bot-specific state
    const [botWelcomeMessage, setBotWelcomeMessage] = useState(null);
    const [showingCategories, setShowingCategories] = useState(false);
    const [showingFAQs, setShowingFAQs] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [toast, setToast] = useState(null); // { type: 'error'|'info' , title, message }
    const [sending, setSending] = useState(false);
    const [attachments, setAttachments] = useState([]); // File[] queued like Messenger
    const messagesEndRef = useRef(null);
    const { socket, isConnected, connectSocket } = useSocket();
    const [viewer, setViewer] = useState({ open: false, src: '', filename: '' });
    const [myImgErr, setMyImgErr] = useState(false);

    // Bot and quick questions removed: direct-to-agent experience

    // Handle body scroll when modal opens/closes
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    // Connect socket and initialize chat when opens
    useEffect(() => {
        if (open) {
            if (!isConnected) {
                connectSocket('User'); // Connect as User role
            }
            // Initialize based on chat mode
            if (chatMode === 'bot') {
                initializeBotChat();
            } else {
                // Fetch past inquiries and active inquiry for admin mode
                fetchPastInquiries();
                refreshActiveInquiry();
            }
        }
    }, [open, isConnected, socket]);

    // On open: auto-load active inquiry if one exists; otherwise start blank
    useEffect(() => {
        if (!open) return;
        // fetch active inquiry (if any)
    (async () => {
            try {
        const res = await fetch('/api/inquiries/active/me', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    // expecting either null or an inquiry object
                    if (data && data.id) {
                        setActiveInquiry(data);
                        loadInquiryConversation(data);
                    } else {
                        setActiveInquiry(null);
                        // keep default system message and wait for user input
                    }
                }
            } catch (e) {
                console.error('Failed to load active inquiry', e);
            }
        })();
    }, [open]);

    // Listen for admin replies
    useEffect(() => {
    if (!socket) return;

        socket.on('admin_reply_received', (data) => {
            console.debug('[chat] on admin_reply_received', { message: data?.message, ts: data?.timestamp });
            const adminMsg = { 
                from: 'admin', 
                text: data.message, 
                time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            };
            setMessages(prev => [...prev, adminMsg]);
            
            // Refresh conversation history when receiving admin reply
            fetchPastInquiries();
        });

        socket.on('admin_attachment_received', (data) => {
            console.debug('[chat] on admin_attachment_received', { filename: data?.filename, streamUrl: data?.streamUrl });
            const attachmentMsg = {
                from: 'admin',
                text: data.streamUrl || data.filepath,
                mime: data.mimetype,
                filename: data.filename,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, attachmentMsg]);
            
            // Refresh conversation history when receiving admin attachment
            fetchPastInquiries();
        });

        return () => {
            socket.off('admin_reply_received');
            socket.off('admin_attachment_received');
        };
    }, [socket]);

    // Bot Functions
    const initializeBotChat = async () => {
        try {
            const welcomeData = await botAPI.getWelcomeMessage();
            if (welcomeData) {
                setBotWelcomeMessage(welcomeData);
                const botMsg = {
                    from: 'bot',
                    text: welcomeData.message,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    botData: welcomeData
                };
                setMessages([botMsg]);
                setShowingCategories(true);
            }
        } catch (error) {
            console.error('Error initializing bot:', error);
            // Fallback to admin mode
            escalateToAgent();
        }
    };

    const handleCategorySelect = async (category) => {
        try {
            // Add user message showing category selection
            const userMsg = {
                from: 'user',
                text: `I need help with ${category.name}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, userMsg]);

            // Get FAQs for this category
            const faqData = await botAPI.getCategoryFAQs(category.id);
            if (faqData) {
                const botMsg = {
                    from: 'bot',
                    text: faqData.message,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    botData: faqData
                };
                setMessages(prev => [...prev, botMsg]);
                setCurrentCategory(category);
                setShowingCategories(false);
                setShowingFAQs(true);

                // If it should escalate immediately, do so
                if (faqData.escalate) {
                    setTimeout(() => escalateToAgent(), 1000);
                }
            }
        } catch (error) {
            console.error('Error handling category selection:', error);
            escalateToAgent();
        }
    };

    const handleFAQView = async (faqId) => {
        await botAPI.trackFAQView(faqId);
    };

    const handleFAQHelpful = async (faqId) => {
        await botAPI.markFAQHelpful(faqId);
        setToast({
            type: 'info',
            title: 'Thanks for your feedback!',
            message: 'Glad we could help you.'
        });
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
                setMessages(prev => [...prev, botMsg]);
                setTimeout(() => escalateToAgent(), 1000);
            }
        } catch (error) {
            console.error('Error handling not helpful:', error);
            escalateToAgent();
        }
    };

    const handleBackToCategories = () => {
        // Reset to category selection state
        setShowingFAQs(false);
        setShowingCategories(true);
        setCurrentCategory(null);
        
        // Add a bot message showing categories again
        if (botWelcomeMessage) {
            const botMsg = {
                from: 'bot',
                text: "Let me show you the categories again. Please select the topic you need help with:",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                botData: botWelcomeMessage
            };
            setMessages(prev => [...prev, botMsg]);
        }
    };

    const escalateToAgent = async () => {
        try {
            // First create the inquiry before switching modes
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    subject: 'Bot Escalation - Live Agent Request',
                    message: 'User requested live agent assistance from bot chat.',
                    priority: 'MEDIUM'
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                const inquiry = data.data;
                setActiveInquiry(inquiry);
                console.debug('[chat] Inquiry created for escalation:', inquiry.id);
                
                // Switch to admin mode
                setChatMode('admin');
                setShowingCategories(false);
                setShowingFAQs(false);
                
                const systemMsg = {
                    from: 'system',
                    text: `Connected to live support agent. Your inquiry ID is #${inquiry.id}. Please describe your concern and an agent will respond shortly.`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, systemMsg]);
                
                // Join the inquiry room for real-time updates
                if (socket && isConnected) {
                    socket.emit('join_inquiry', { inquiryId: inquiry.id });
                }
                
                // Initialize admin mode data
                fetchPastInquiries();
                
            } else {
                throw new Error('Failed to create inquiry');
            }
        } catch (error) {
            console.error('Error creating escalation inquiry:', error);
            
            // Fallback: still switch to admin mode but without active inquiry
            setChatMode('admin');
            setShowingCategories(false);
            setShowingFAQs(false);
            
            const errorMsg = {
                from: 'system',
                text: 'Connected to live support. There was an issue creating your inquiry, but you can still send messages to our agents.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
            
            fetchPastInquiries();
            refreshActiveInquiry(); // Try to get any existing active inquiry
        }
    };

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Handle sending a message
    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() && attachments.length === 0) return;

        setSending(true);

        // Handle bot mode - enforce proper flow
        if (chatMode === 'bot' && message.trim()) {
            // Add user message first
            const userMsg = {
                from: 'user',
                text: message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, userMsg]);
            setMessage(''); // Clear message
            setSending(false);

            try {
                // Check if user wants to escalate directly to agent
                const escalationCheck = await botAPI.shouldEscalate(message.trim());
                if (escalationCheck && escalationCheck.escalate) {
                    const botMsg = {
                        from: 'bot',
                        text: escalationCheck.data.message,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    setMessages(prev => [...prev, botMsg]);
                    setTimeout(() => escalateToAgent(), 1000);
                    return;
                }

                // If user is not showing categories or FAQs, always show categories
                if (!showingCategories && !showingFAQs) {
                    const welcomeData = await botAPI.getWelcomeMessage();
                    if (welcomeData) {
                        setBotWelcomeMessage(welcomeData);
                        const botMsg = {
                            from: 'bot',
                            text: "I can help you with these topics. Please select a category:",
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            botData: welcomeData
                        };
                        setMessages(prev => [...prev, botMsg]);
                        setShowingCategories(true);
                    }
                    return;
                }

                // If categories are showing, remind user to select
                if (showingCategories) {
                    const botMsg = {
                        from: 'bot',
                        text: "Please select one of the categories above to get help with that topic, or click 'Chat with live agent' if you need direct assistance.",
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    setMessages(prev => [...prev, botMsg]);
                    return;
                }

                // If FAQs are showing, guide user to use the interface
                if (showingFAQs) {
                    const botMsg = {
                        from: 'bot',
                        text: "Please click on the questions above to see the answers, or use the buttons to go back to categories or chat with a live agent.",
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    setMessages(prev => [...prev, botMsg]);
                    return;
                }

            } catch (error) {
                console.error('Error in bot flow:', error);
                escalateToAgent();
            }
            return;
        }

        // Admin mode message handling
        if (chatMode === 'admin') {
            // 1) If there's text, optimistically append and emit it
            if (message.trim()) {
                const userMsg = {
                    from: 'user',
                    text: message,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, userMsg]);

                // If no active inquiry, create one first
                if (!activeInquiry) {
                    try {
                        const response = await fetch('/api/inquiries', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                subject: 'Live Chat Support',
                                message: message,
                                priority: 'MEDIUM'
                            })
                        });
                        
                        if (response.ok) {
                            const data = await response.json();
                            const inquiry = data.data;
                            setActiveInquiry(inquiry);
                            console.debug('[chat] New inquiry created:', inquiry.id);
                            
                            if (socket && isConnected) {
                                socket.emit('join_inquiry', { inquiryId: inquiry.id });
                            }
                        }
                    } catch (error) {
                        console.error('Error creating inquiry:', error);
                    }
                } else {
                    // Emit message for existing inquiry
                    if (isConnected && socket) {
                        console.debug('[chat] emit chat_message', { inquiryId: activeInquiry.id, len: message.length });
                        socket.emit('chat_message', {
                            message: message,
                            timestamp: new Date(),
                            mode: 'user'
                        });
                    }
                }
            }
            // Continue with admin mode attachment and inquiry handling
            
            // 2) Ensure we have an active inquiry id (poll briefly if it was just created by message)
            const wait = (ms) => new Promise(res => setTimeout(res, ms));
            let inquiry = activeInquiry;
            if (!inquiry?.id) {
                // try a few times to wait for server to create the inquiry after first message
                for (let i = 0; i < 5 && !inquiry?.id; i++) {
                    // eslint-disable-next-line no-await-in-loop
                    inquiry = await refreshActiveInquiry();
                    if (inquiry?.id) break;
                    // eslint-disable-next-line no-await-in-loop
                    await wait(300);
                }
            }

            // 3) Upload queued attachments sequentially once we have an inquiry
            if (attachments.length > 0) {
                if (!inquiry?.id) {
                    // If still no inquiry and no message was sent, ask user to type a message
                    if (!message.trim()) {
                        alert('Please enter a message before sending attachments.');
                        setSending(false);
                        return;
                    }
                } else {
                    for (let i = 0; i < attachments.length; i++) {
                        const file = attachments[i];
                        try {
                            const form = new FormData();
                            form.append('file', file);
                            // eslint-disable-next-line no-await-in-loop
                            const res = await fetch(`/api/inquiries/${inquiry.id}/attachments`, {
                                method: 'POST',
                                body: form,
                                credentials: 'include',
                            });
                            if (!res.ok) {
                                // eslint-disable-next-line no-await-in-loop
                                const text = await res.text();
                                throw new Error(text || 'Upload failed');
                            }
                            // eslint-disable-next-line no-await-in-loop
                            const { data } = await res.json();
                            const bubbleUrl = data.streamUrl || data.filepath;
                            setMessages(prev => [
                                ...prev,
                                { from: 'user', text: bubbleUrl, mime: data.mimetype, filename: data.filename, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                            ]);

                            if (socket && isConnected) {
                                socket.emit('inquiry_attachment_uploaded', {
                                    inquiryId: inquiry.id,
                                    filename: data.filename,
                                    streamUrl: bubbleUrl,
                                    filesize: data.filesize,
                                    mimetype: data.mimetype,
                                });
                            }
                        } catch (err) {
                            console.error('Attachment upload failed:', err);
                            setToast({ type: 'error', title: 'Upload failed', message: err?.message || 'Attachment upload failed' });
                            // continue with next file
                        }
                    }
                }
            }

            // 4) Cleanup and refresh for admin mode
            fetchPastInquiries();
        }

        // Common cleanup
        setMessage('');
        setAttachments([]);
        setSending(false);
    };
    // Helper: refresh active inquiry
    const refreshActiveInquiry = async () => {
        try {
            const res = await fetch('/api/inquiries/active/me', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                if (data && data.id) {
                    setActiveInquiry(data);
                    return data;
                }
            }
        } catch (e) {
            console.error('refreshActiveInquiry failed', e);
        }
        setActiveInquiry(null);
        return null;
    };


    const onPickFile = (e) => {
        const list = Array.from(e.target.files || []);
        if (list.length === 0) return;
        const allowed = ['image/jpeg','image/png','image/webp','image/gif','application/pdf'];
        const maxBytes = 3 * 1024 * 1024; // align with server limit
        const next = [];
        for (const f of list) {
            if (!allowed.includes(f.type)) {
                setToast({ type: 'error', title: 'Unsupported file type', message: `${f.name}: Please upload JPG, PNG, WEBP, GIF, or PDF.` });
                continue;
            }
            if (f.size > maxBytes) {
                const mb = (f.size / (1024*1024)).toFixed(2);
                setToast({ type: 'error', title: 'Attachment too large', message: `${f.name} is ${mb} MB. Maximum allowed is 3 MB.` });
                continue;
            }
            next.push(f);
        }
        // Merge with existing; optional cap of 10 files
        setAttachments(prev => {
            const merged = [...prev, ...next];
            return merged.slice(0, 10);
        });
        // reset input so same files can be picked again if removed
        e.target.value = '';
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };
    // Bot reply logic removed

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Auto-hide toast
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    // (Removed) legacy sidebar toggling effect; tabs handle visibility now

    // Fetch past inquiries when chat opens
    const fetchPastInquiries = async () => {
        setIsLoadingHistory(true);
        try {
            const response = await fetch('/api/inquiries/my-inquiries', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setPastInquiries(data.data || []);
            } else {
                console.error('Failed to fetch past inquiries');
            }
        } catch (error) {
            console.error('Error fetching past inquiries:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // Load inquiry conversation
    const loadInquiryConversation = (inquiry) => {
        setActiveInquiry(inquiry);
        setSearchQuery(''); // Clear search when loading a conversation
        setSidebarOpen(false); // Close sidebar when loading a conversation
        // Build a single timeline from initial message, replies, and attachments
        const timeline = [];
        timeline.push({
            id: `inquiry:${inquiry.id}`,
            from: 'user',
            text: inquiry.message,
            time: new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            at: new Date(inquiry.createdAt).getTime(),
        });
        (inquiry.replies || []).forEach(r => {
            timeline.push({
                id: `reply:${r.id}`,
                from: r.senderType === 'ADMIN' ? 'admin' : 'user',
                text: r.message,
                time: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                at: new Date(r.createdAt).getTime(),
            });
        });
        (inquiry.attachments || []).forEach(a => {
            timeline.push({
                id: `att:${a.id}`,
                from: a.uploadedById && a.uploadedById === inquiry.userId ? 'user' : 'admin',
                text: a.streamUrl || `/api/inquiries/attachments/${a.id}`,
                mime: a.mimetype,
                time: new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                at: new Date(a.createdAt).getTime(),
            });
        });
        timeline.sort((a,b) => a.at - b.at);
        setMessages(timeline.map(({id, ...rest}) => ({ key: id, ...rest })));
    setChatMode('admin'); // Switch to admin mode for historical inquiries

    // If the inquiry is still in progress, reconnect to that specific conversation
    if (inquiry.status === 'IN_PROGRESS' || inquiry.status === 'PENDING') {
            if (socket && isConnected) {
                console.debug('[chat] joining inquiry room', { inquiryId: inquiry.id });
                socket.emit('join_inquiry', { inquiryId: inquiry.id });
            }
        }
    };

    // Mark conversation as resolved
    const markAsResolved = async (inquiryId) => {
        try {
            console.log('Client: Marking inquiry as resolved:', inquiryId);
            // Notify admins via socket before resolving
            if (socket && isConnected && inquiryId) {
                try {
                    console.log('Client: Emitting resolve request to server');
                    socket.emit('user_inquiry:resolve_request', { inquiryId });
                } catch {}
            }
            console.log('Client: Making API call to resolve inquiry');
            const response = await fetch(`/api/inquiries/${inquiryId}/resolve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            
            if (response.ok) {
                console.log('Client: API call successful, inquiry resolved');
                // Refresh the inquiries list
                await fetchPastInquiries();

                // Immediately reset to bot start state and show welcome/categories
                setActiveInquiry(null);
                setChatMode('bot');
                setShowingCategories(false);
                setShowingFAQs(false);
                setCurrentCategory(null);
                setAttachments([]);
                setMessage('');
                setSidebarOpen(false);
                await initializeBotChat();
            }
        } catch (error) {
            console.error('Failed to mark as resolved:', error);
        }
    };

    // Reset to new conversation
    const startNewConversation = () => {
        setActiveInquiry(null);
        setSearchQuery('');
        setMessages([
            { 
                from: 'system', 
                text: 'New message draft started. Send your message to open a new inquiry.', 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }
        ]);
        setChatMode('admin');
        setSidebarOpen(false); // Close sidebar when starting new conversation
    };

    // Filter inquiries based on search query
    const filteredInquiries = pastInquiries.filter(inquiry => {
        if (!searchQuery.trim()) return true;
        
        const query = searchQuery.toLowerCase();
        return (
            inquiry.subject?.toLowerCase().includes(query) ||
            inquiry.message?.toLowerCase().includes(query) ||
            inquiry.lastMessage?.toLowerCase().includes(query) ||
            inquiry.status?.toLowerCase().includes(query)
        );
    });

    return (
    <>
            {/* Professional Chat Trigger Button */}
            <div className="fixed bottom-6 right-6 z-[999999] group">
                <button
                    onClick={() => setOpen(true)}
                    className="relative w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 transform hover:scale-105 active:scale-95"
                    style={{ 
                        backgroundColor: '#16a34a', 
                        borderColor: '#15803d',
                        border: '1px solid #15803d'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}
                    aria-label="Open Support Chat"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {/* Online indicator */}
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border border-white bg-green-400"></div>
                </button>
                
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-3 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none bg-gray-900 text-white">
                    Need help? Chat with us
                    <div className="absolute top-full right-4 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-gray-900"></div>
                </div>
            </div>

            {/* Modern Chat Modal */}
            {open && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-[9999999] transition-all p-4 bg-black/70"
                    onClick={() => setOpen(false)}
                >
                    {/* Toast Notifications */}
                    {toast && (
                        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[10000000] shadow-lg rounded-xl border backdrop-blur-sm px-5 py-3 min-w-[280px] max-w-[90vw] transition-all duration-300 ${
                            toast.type === 'error' 
                                ? theme === 'dark'
                                    ? 'bg-red-900/95 border-red-700/50 text-red-100' 
                                    : 'bg-red-50/95 border-red-200 text-red-800'
                                : theme === 'dark'
                                    ? 'bg-green-900/95 border-green-700/50 text-green-100'
                                    : 'bg-green-50/95 border-green-200 text-green-800'
                        }`}>
                            <div className="font-medium text-sm flex items-center gap-2">
                                {toast.type === 'error' ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {toast.title}
                            </div>
                            {toast.message && <div className="text-xs mt-1 opacity-90">{toast.message}</div>}
                        </div>
                    )}
                    
                    <div
                        className="relative rounded-3xl shadow-2xl flex w-full h-full max-w-6xl max-h-[90vh] bg-white border border-gray-100 overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Sidebar: Chat History */}
                        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} flex flex-col transition-all duration-300 overflow-hidden border-r border-gray-100 bg-gradient-to-b from-green-50 to-green-100 rounded-l-3xl`}>
                            {/* Sidebar Header */}
                            <div className="p-4 border-b border-green-100 bg-white rounded-tl-3xl">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-green-800">Chat History</h3>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        isConnected 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {isConnected ? 'Online' : 'Offline'}
                                    </div>
                                </div>
                                <p className="text-sm text-green-600">
                                    {searchQuery.trim() 
                                        ? `${filteredInquiries.length} of ${pastInquiries.length} found`
                                        : `${pastInquiries.length} ${pastInquiries.length === 1 ? 'conversation' : 'conversations'}`
                                    }
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="p-4 border-b border-green-100 bg-white">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search conversations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors bg-green-50 placeholder-green-500"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-400 hover:text-green-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* History List */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {isLoadingHistory ? (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <div className="w-6 h-6 border border-green-200 border-t-green-600 rounded-full animate-spin mb-2"></div>
                                        <span className="text-green-600 text-sm">Loading...</span>
                                    </div>
                                ) : filteredInquiries.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        {searchQuery.trim() ? (
                                            <>
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-green-700 font-medium mb-1">No matches found</p>
                                                <p className="text-green-600 text-sm mb-3">Try different keywords</p>
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                                                >
                                                    Clear search
                                                </button>
                                            </>
                                        ) : (
                                                <>
                                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                    </div>
                                                    <h4 className="text-green-700 font-medium mb-2">No past inquiries</h4>
                                                    <p className="text-green-600 text-sm mb-4">Your previous inquiries will appear here</p>
                                                    <button
                                                        onClick={startNewConversation}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                                    >
                                                        Start New Message
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {filteredInquiries.map((inquiry) => (
                                                <div
                                                    key={inquiry.id}
                                                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-lg ${
                                                        activeInquiry?.id === inquiry.id
                                                            ? 'bg-green-50 border-green-300 shadow-md'
                                                            : 'bg-white border-slate-200 hover:border-green-200'
                                                    }`}
                                                >
                                                    {/* Main conversation area - clickable */}
                                                    <div
                                                        onClick={() => loadInquiryConversation(inquiry)}
                                                        className="cursor-pointer"
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-semibold text-slate-900 truncate text-sm">
                                                                    {inquiry.subject || 'General Inquiry'}
                                                                </h4>
                                                                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                                                                    {inquiry.lastMessage}
                                                                </p>
                                                            </div>
                                                            <div className={`w-2 h-2 rounded-full mt-2 ${
                                                                inquiry.status === 'PENDING' ? 'bg-amber-400' :
                                                                inquiry.status === 'IN_PROGRESS' ? 'bg-green-400' :
                                                                inquiry.status === 'RESOLVED' ? 'bg-emerald-400' :
                                                                'bg-slate-400'
                                                            }`}></div>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                    inquiry.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' :
                                                                    inquiry.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-700' :
                                                                    inquiry.status === 'WAITING_USER' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-orange-100 text-orange-700'
                                                                }`}>
                                                                    {inquiry.status === 'WAITING_USER' ? 'Waiting for you' : 
                                                                     inquiry.status === 'IN_PROGRESS' ? 'In Progress' :
                                                                     inquiry.status === 'RESOLVED' ? 'Resolved' : 'Pending'}
                                                                </span>
                                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                                    </svg>
                                                                    {inquiry.messageCount}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(inquiry.lastMessageTime).toLocaleDateString('en-US', { 
                                                                    month: 'short', 
                                                                    day: 'numeric',
                                                                    year: new Date(inquiry.lastMessageTime).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Action buttons */}
                                                    <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                                                        <button
                                                            onClick={() => loadInquiryConversation(inquiry)}
                                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm"
                                                        >
                                                            Continue Chat
                                                        </button>
                                                        {inquiry.status !== 'RESOLVED' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    markAsResolved(inquiry.id);
                                                                }}
                                                                className="px-3 py-1.5 border border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-medium transition-colors duration-200"
                                                            >
                                                                Mark Resolved
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                {/* Refresh Button */}
                                <div className="p-4 border-t border-slate-200 bg-white">
                                    <button
                                        onClick={fetchPastInquiries}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                                        disabled={isLoadingHistory}
                                    >
                                        <svg className={`w-4 h-4 ${isLoadingHistory ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                    {isLoadingHistory ? 'Refreshing...' : 'Refresh History'}
                                    </button>
                                </div>
                            </div>

                        {/* Main Chat Area */}
                        <div className="flex-1 flex flex-col bg-white rounded-r-3xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                                            <img src={appLogo} alt="FITS - Tanza" className="w-8 h-8 rounded-full object-contain bg-white" />
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 border border-white rounded-full ${
                                            isConnected ? 'bg-green-400' : 'bg-gray-400'
                                        }`}></div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">FITS - Tanza</h3>
                                        <div className="flex items-center gap-2 text-green-100">
                                            <div className={`w-2 h-2 rounded-full ${
                                                isConnected ? 'bg-green-300' : 'bg-gray-300'
                                            }`}></div>
                                            <span className="text-sm">
                                                {chatMode === 'bot' ? 'Support Bot' : 'Live Agent'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {/* History Toggle */}
                                    <button
                                        onClick={toggleSidebar}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                                        aria-label="Toggle history"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                    
                                    {/* New Message */}
                                    <button
                                        onClick={startNewConversation}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                                        aria-label="New message"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                    
                                    {/* Mark as Resolved */}
                                    {activeInquiry?.id && activeInquiry?.status !== 'RESOLVED' && (
                                        <button
                                            type="button"
                                            onClick={() => markAsResolved(activeInquiry.id)}
                                            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                            </svg>
                                            Resolve
                                        </button>
                                    )}
                                    
                                    {/* Close */}
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                                        aria-label="Close chat"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
                            {messages.map((msg, idx) => (
                                <div
                                    key={msg.key || idx}
                                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}
                                >
                                    {(msg.from === 'admin' || msg.from === 'system' || msg.from === 'bot') && (
                                        <div className="flex-shrink-0">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                msg.from === 'admin' 
                                                    ? 'bg-green-500' 
                                                    : msg.from === 'bot'
                                                    ? 'bg-green-600'
                                                    : 'bg-gray-500'
                                            }`}>
                                                <img 
                                                    src={msg.from === 'admin' || msg.from === 'system' ? userAvatar : botAvatar} 
                                                    alt="Avatar" 
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                                        {/* Handle bot-specific messages */}
                                        {msg.from === 'bot' && msg.botData ? (
                                            <div className="max-w-none">
                                                {msg.botData.type === 'bot_welcome' && showingCategories && (
                                                    <BotCategoryButtons
                                                        categories={msg.botData.categories}
                                                        onCategorySelect={handleCategorySelect}
                                                        onEscalate={escalateToAgent}
                                                    />
                                                )}
                                                {msg.botData.type === 'bot_faq_list' && showingFAQs && (
                                                    <BotFAQList
                                                        categoryName={msg.botData.categoryName}
                                                        faqs={msg.botData.faqs}
                                                        onFAQView={handleFAQView}
                                                        onFAQHelpful={handleFAQHelpful}
                                                        onNotHelpful={handleFAQNotHelpful}
                                                        onEscalate={escalateToAgent}
                                                        onBackToCategories={handleBackToCategories}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                className={`px-4 py-3 rounded-3xl text-sm shadow-sm transition-all duration-200 hover:shadow-md
                                                    ${msg.from === 'user'
                                                        ? 'bg-green-600 text-white rounded-br-md'
                                                        : msg.from === 'admin'
                                                        ? 'bg-green-50 text-green-900 border border-green-200 rounded-bl-md'
                                                        : msg.from === 'bot'
                                                        ? 'bg-green-100 text-green-900 border border-green-300 rounded-bl-md'
                                                        : 'bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-md'
                                                    }`}
                                                style={{ wordBreak: 'break-word' }}
                                            >
                                                {msg.from === 'admin' && (
                                                    <div className="text-xs text-green-600 font-semibold mb-1">Live Agent</div>
                                                )}
                                                {msg.from === 'bot' && (
                                                    <div className="text-xs text-green-600 font-semibold mb-1">Support Bot</div>
                                                )}
                                                {msg.from === 'system' && (
                                                    <div className="text-xs text-gray-600 font-semibold mb-1">System</div>
                                                )}
                                            {(() => {
                                                const text = msg.text;
                                                const mime = msg.mime;
                                                const name = msg.filename;
                                                // Handle structured form message
                                                if (typeof text === 'string' && text.startsWith('__FC_FORM__')) {
                                                    try {
                                                        const payload = JSON.parse(text.replace('__FC_FORM__',''));
                                                        return (
                                                            <FormOpenButton title={payload.title} surveyId={payload.id} />
                                                        );
                                                    } catch {}
                                                }
                                                const isPublic = typeof text === 'string' && text.startsWith('/public/');
                                                const isStream = typeof text === 'string' && text.startsWith('/api/inquiries/attachments/');
                                                const isMedia = isPublic || isStream;
                                                const isImg = (mime?.startsWith?.('image/')) || (isPublic && /\.(png|jpe?g|webp|gif)$/i.test(text));
                                                const isVid = (mime?.startsWith?.('video/')) || (isPublic && /\.(mp4|webm)$/i.test(text));
                                                if (isMedia && isImg) return <img src={text} alt="attachment" className="max-w-xs rounded-lg cursor-zoom-in" onClick={() => setViewer({ open: true, src: text, filename: name || 'image' })} />;
                                                if (isMedia && isVid) return (
                                                    <video className="max-w-xs rounded-lg" controls>
                                                        <source src={text} />
                                                    </video>
                                                );
                                                if (isMedia) {
                                                    const n = (name || '').toLowerCase();
                                                    const bg =
                                                        mime === 'application/pdf' || n.endsWith('.pdf') ? 'bg-red-50 text-red-600' :
                                                        (n.endsWith('.doc') || n.endsWith('.docx') || (mime || '').includes('word')) ? 'bg-green-50 text-green-700' :
                                                        (n.endsWith('.xls') || n.endsWith('.xlsx') || (mime || '').includes('sheet')) ? 'bg-green-50 text-green-700' :
                                                        (n.endsWith('.ppt') || n.endsWith('.pptx') || (mime || '').includes('presentation')) ? 'bg-orange-50 text-orange-700' :
                                                        (n.endsWith('.txt')) ? 'bg-gray-50 text-gray-700' : 'bg-slate-50 text-slate-700';
                                                    const label =
                                                        mime === 'application/pdf' || n.endsWith('.pdf') ? 'PDF' :
                                                        (n.endsWith('.doc') || n.endsWith('.docx') || (mime || '').includes('word')) ? 'DOC' :
                                                        (n.endsWith('.xls') || n.endsWith('.xlsx') || (mime || '').includes('sheet')) ? 'XLS' :
                                                        (n.endsWith('.ppt') || n.endsWith('.pptx') || (mime || '').includes('presentation')) ? 'PPT' :
                                                        (n.endsWith('.txt')) ? 'TXT' : 'FILE';
                                                    return (
                                                        <a href={text} target="_blank" rel="noreferrer" className={`group w-64 border border-gray-50 rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition ${msg.from==='user' ? 'bg-white' : 'bg-green-50'}`}>
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${bg}`}>{label}</div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-gray-900 truncate" title={name || 'Attachment'}>{name || 'Attachment'}</div>
                                                                <div className="text-xs text-gray-600">{mime}</div>
                                                            </div>
                                                            <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"/></svg>
                                                        </a>
                                                    );
                                                }
                                                // Linkify plain URLs
                                                const splitRegex = /(https?:\/\/[^\s]+)/g;
                                                const isUrl = (s) => /^https?:\/\/[^\s]+$/i.test(s);
                                                if (typeof text === 'string' && splitRegex.test(text)) {
                                                    const parts = text.split(splitRegex);
                                                    return (
                                                        <span>
                                                            {parts.map((part, i) => (
                                                                isUrl(part) ? (
                                                                    <a key={i} href={part} target="_blank" rel="noreferrer" className="underline">{part}</a>
                                                                ) : (
                                                                    <span key={i}>{part}</span>
                                                                )
                                                            ))}
                                                        </span>
                                                    );
                                                }
                                                return text;
                                            })()}
                                            </div>
                                        )}
                                        <span className={`text-xs mt-1.5 px-2 ${msg.from === 'user' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                    {msg.from === 'user' && (
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-green-600 p-0.5">
                                                {activeInquiry?.userId && !myImgErr ? (
                                                    <img
                                                        src={`/api/account/picture/${activeInquiry.userId}?t=${activeInquiry?.updatedAt ? new Date(activeInquiry.updatedAt).getTime() : ''}`}
                                                        alt="You"
                                                        onError={() => setMyImgErr(true)}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <img src={userAvatar} alt="You" className="w-full h-full rounded-full object-cover" />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {/* Bot typing and quick questions removed */}
                            
                            {/* Live agent indicator */}
                            <div className="flex justify-center">
                                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center max-w-xs">
                                    <div className="text-green-600 text-sm font-medium mb-1">� FITS - Tanza</div>
                                    <div className="text-green-700 text-xs">Your messages are sent directly to our support team</div>
                                </div>
                            </div>
                            <div ref={messagesEndRef} />
                        </div>
                        
                        {/* Input Area */}
                        <div className="bg-white border-t border-gray-100 px-6 py-4 rounded-br-3xl">
                            <form
                                className="flex items-center gap-3"
                                onSubmit={handleSend}
                                autoComplete="off"
                            >
                                <div className="flex-1">
                                    {/* Attachment previews */}
                                    {attachments.length > 0 && (
                                        <div className="mb-3 flex flex-wrap gap-2">
                                            {attachments.map((f, idx) => {
                                                const isImg = f.type.startsWith('image/');
                                                const url = isImg ? URL.createObjectURL(f) : null;
                                                return (
                                                    <div key={idx} className="relative group border border-green-100 rounded-2xl p-2 bg-green-50">
                                                        <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center bg-white border border-gray-100">
                                                            {isImg ? (
                                                                <img src={url} alt={f.name} className="object-cover w-full h-full" onLoad={() => url && URL.revokeObjectURL(url)} />
                                                            ) : (
                                                                <div className="text-xs text-gray-700 p-1 text-center w-full">
                                                                    <div className="font-medium truncate mb-1" title={f.name}>
                                                                        {f.name.length > 8 ? f.name.substring(0, 8) + '...' : f.name}
                                                                    </div>
                                                                    <div className="text-[10px] text-gray-500">{Math.ceil(f.size/1024)} KB</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button type="button" onClick={() => removeAttachment(idx)} className="absolute -top-1 -right-1 bg-green-500 hover:bg-green-600 text-white rounded-full w-5 h-5 shadow-sm hidden group-hover:flex items-center justify-center text-xs transition-colors">
                                                            ×
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            placeholder="Message live agent..."
                                            className="w-full rounded-2xl px-4 py-3 pr-12 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50 text-sm transition-all duration-200 placeholder-green-500"
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            autoFocus
                                            maxLength={500}
                                            disabled={sending}
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                            {message.length}/500
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <input id="chat_file" type="file" className="hidden" onChange={onPickFile} multiple accept="image/*,application/pdf" />
                                    <label htmlFor="chat_file" className="cursor-pointer p-3 rounded-2xl border border-green-200 hover:bg-green-50 text-green-700 text-sm flex items-center gap-2 transition-colors bg-green-50">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9"/>
                                        </svg>
                                        {attachments.length > 0 ? `${attachments.length} file${attachments.length>1?'s':''}` : 'Attach'}
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="text-white rounded-2xl px-6 py-3 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                    disabled={sending || (!message.trim() && attachments.length === 0)}
                                >
                                    <span>{sending ? 'Sending…' : 'Send'}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            )}
            {viewer.open && (
                <ImageViewer open={viewer.open} src={viewer.src} filename={viewer.filename} onClose={() => setViewer({ open: false, src: '', filename: '' })} />
            )}
        </>
    );
}

// Inline helper component to open the survey modal
const FormOpenButton = ({ title, surveyId }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-green-300 text-green-800 bg-green-50 hover:bg-green-100"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                {title || 'Open Form'}
            </button>
            <FillSurveyModal isOpen={open} onClose={() => setOpen(false)} surveyId={surveyId} title={title} />
        </>
    );
};