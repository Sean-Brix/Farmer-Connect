import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../../Client/Components/Navbar.jsx'
import botAvatar from '../../Assets/default_picture.png';
import userAvatar from '../../Assets/eic_default.png';
import appLogo from '../../Assets/Logo.png';
import { useSocket } from '../../contexts/SocketContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import ImageViewer from '../Common/ImageViewer.jsx';
import FillSurveyModal from '../Survey/FillSurveyModal.jsx';

export default function Chat() {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
    const [chatMode, setChatMode] = useState('admin'); // Direct to live agent
    const [adminRequested, setAdminRequested] = useState(false);
    const [pastInquiries, setPastInquiries] = useState([]);
    const [activeInquiry, setActiveInquiry] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState([
        {
            from: 'system',
            text: 'You\'re connected to a live support agent. We\'ll respond shortly. Please describe your concern.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
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

    // Connect socket and notify admins when chat opens
    useEffect(() => {
        if (open) {
            if (!isConnected) {
                connectSocket('User'); // Connect as User role
            }
            // Fetch past inquiries and active inquiry on open
            fetchPastInquiries();
            refreshActiveInquiry();
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
                        setActiveTab('active');
                        loadInquiryConversation(data);
                    } else {
                        setActiveInquiry(null);
                        setActiveTab('active');
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

        return () => {
            socket.off('admin_reply_received');
        };
    }, [socket]);

    // Quick questions and bot answers removed

    // Removed automatic admin support request; new inquiry will be created on first user message

    // Bot mode is removed

    // Handle sending a message
    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() && attachments.length === 0) return;

        setSending(true);

        // 1) If there's text, optimistically append and emit it (creates inquiry if needed)
        if (message.trim()) {
            const userMsg = {
                from: 'user',
                text: message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, userMsg]);

            if (isConnected && socket) {
                console.debug('[chat] emit chat_message', { len: message.length });
                socket.emit('chat_message', {
                    message: message,
                    timestamp: new Date(),
                    mode: 'user'
                });
            }
        }

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

        // 4) Cleanup and refresh
        setMessage('');
        setAttachments([]);
    fetchPastInquiries();
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
            // Notify admins via socket before resolving
            if (socket && isConnected && inquiryId) {
                try {
                    socket.emit('user_inquiry:resolve_request', { inquiryId });
                } catch {}
            }
            const response = await fetch(`/api/inquiries/${inquiryId}/resolve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            
            if (response.ok) {
                // Refresh the inquiries list
                await fetchPastInquiries();
                // If current conversation was resolved, clear active state (do not auto-start a new inquiry)
                if (activeInquiry?.id === inquiryId) {
                    setActiveInquiry(null);
                    setMessages([
                        { 
                            from: 'system', 
                            text: 'Conversation resolved. Send a message to start a new inquiry.', 
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        }
                    ]);
                }
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
        setActiveTab('active');
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
            {/* Modern Professional Chat Trigger Button */}
            <div className="fixed bottom-6 right-6 z-[999999] group">
                {/* Pulse animation rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-green-700 opacity-30 animate-ping"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-green-700 opacity-20 animate-pulse"></div>
                
                <button
                    onClick={() => setOpen(true)}
                    className={`relative w-14 h-14 rounded-full text-white shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 transform hover:scale-110 active:scale-95 ${
                        theme === 'dark' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-400/50' 
                            : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-green-300/50'
                    }`}
                    aria-label="Open Support Chat"
                >
                    <svg className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    
                    {/* Enhanced connection indicator with pulse */}
                    <div className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                        theme === 'dark' ? 'border-gray-800' : 'border-white'
                    } ${
                        isConnected 
                            ? 'bg-green-400 animate-pulse' 
                            : 'bg-red-400'
                    }`}></div>
                </button>
                
                {/* Tooltip */}
                <div className={`absolute bottom-full right-0 mb-3 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none ${
                    theme === 'dark' 
                        ? 'bg-gray-800 text-gray-100 border border-gray-700' 
                        : 'bg-gray-900 text-white'
                }`}>
                    Need help? Chat with us
                    <div className={`absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                        theme === 'dark' ? 'border-t-gray-800' : 'border-t-gray-900'
                    }`}></div>
                </div>
            </div>

            {/* Modern Chat Modal with Enhanced Design */}
            {open && (
                <div
                    className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-[9999999] transition-all p-2 sm:p-4 ${
                        theme === 'dark' 
                            ? 'bg-black/80' 
                            : 'bg-black/60'
                    }`}
                    onClick={() => setOpen(false)}
                >
                    {/* Enhanced Toast Notifications */}
                    {toast && (
                        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[10000000] shadow-2xl rounded-2xl border backdrop-blur-md px-6 py-4 min-w-[300px] max-w-[90vw] transition-all duration-300 ${
                            toast.type === 'error' 
                                ? theme === 'dark'
                                    ? 'bg-red-900/90 border-red-700 text-red-100' 
                                    : 'bg-red-50/95 border-red-200 text-red-800'
                                : theme === 'dark'
                                    ? 'bg-blue-900/90 border-blue-700 text-blue-100'
                                    : 'bg-blue-50/95 border-blue-200 text-blue-800'
                        }`}>
                            <div className="font-semibold text-sm flex items-center gap-2">
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
                            {toast.message && <div className="text-xs mt-2 opacity-90">{toast.message}</div>}
                        </div>
                    )}
                    
                    <div
                        className={`relative rounded-none shadow-none flex w-full h-full max-w-none max-h-none sm:rounded-3xl sm:shadow-2xl sm:w-[98vw] sm:h-[96vh] md:w-[85vw] md:h-[90vh] lg:w-[1200px] lg:h-[800px] xl:w-[1400px] xl:h-[900px] md:max-w-[95vw] md:max-h-[95vh] transition-all duration-500 transform hover:shadow-3xl ${
                            theme === 'dark' 
                                ? 'bg-gray-900 border border-gray-700' 
                                : 'bg-white border border-gray-200'
                        }`}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Enhanced Left Panel: Tabs with Inquiry History */}
                        <div className={`w-80 lg:w-96 flex flex-col transition-all duration-300 ${
                            theme === 'dark' 
                                ? 'bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700' 
                                : 'bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200'
                        } rounded-l-3xl overflow-hidden`}>
                                {/* Enhanced Modern Sidebar Header */}
                                <div className={`p-6 border-b ${
                                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                    <div className={`px-6 py-5 rounded-2xl shadow-lg ${
                                        theme === 'dark' 
                                            ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white' 
                                            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white'
                                    }`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                    theme === 'dark' ? 'bg-white/20' : 'bg-white/20'
                                                }`}>
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold">Support Hub</h3>
                                                    <p className={`text-sm mt-0.5 ${
                                                        theme === 'dark' ? 'text-emerald-100' : 'text-indigo-100'
                                                    }`}>
                                                        {activeTab === 'history' ?
                                                            (searchQuery.trim() 
                                                                ? `${filteredInquiries.length} of ${pastInquiries.length} found`
                                                                : `${pastInquiries.length} ${pastInquiries.length === 1 ? 'conversation' : 'conversations'}`
                                                            )
                                                            : (activeInquiry ? 'Active inquiry' : 'Ready to help')
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                isConnected 
                                                    ? 'bg-green-400/20 text-green-100' 
                                                    : 'bg-red-400/20 text-red-100'
                                            }`}>
                                                {isConnected ? 'Online' : 'Offline'}
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setActiveTab('active')}
                                                className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border shadow-sm ${
                                                    activeTab === 'active' 
                                                        ? 'bg-white text-gray-800 border-white/30 shadow-md' 
                                                        : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                                                }`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    Active
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('history')}
                                                className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border shadow-sm ${
                                                    activeTab === 'history' 
                                                        ? 'bg-white text-gray-800 border-white/30 shadow-md' 
                                                        : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                                                }`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    History
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Search Bar */}
                                <div className={`p-4 border-b ${
                                    theme === 'dark' 
                                        ? 'border-gray-700 bg-gray-800' 
                                        : 'border-gray-200 bg-white'
                                }`}>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className={`w-4 h-4 ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search conversations..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:outline-none text-sm transition-all duration-200 ${
                                                theme === 'dark'
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-green-500/50 focus:border-green-500'
                                                    : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white'
                                            }`}
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                                                    theme === 'dark' 
                                                        ? 'text-gray-400 hover:text-gray-200' 
                                                        : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Enhanced Active or History List */}
                                <div className={`flex-1 overflow-y-auto p-4 ${
                                    theme === 'dark' 
                                        ? 'bg-gradient-to-b from-gray-800 to-gray-900' 
                                        : 'bg-gradient-to-b from-white to-gray-50'
                                }`}>
                                    {activeTab === 'active' ? (
                                        <div className="space-y-3">
                                            {activeInquiry ? (
                                                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="text-sm text-slate-500">Active Inquiry</div>
                                                            <div className="font-semibold text-slate-900">{activeInquiry.subject || 'General Inquiry'}</div>
                                                        </div>
                                                        <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">{activeInquiry.status}</span>
                                                    </div>
                                                    <div className="mt-2 text-sm text-slate-600 line-clamp-3">{activeInquiry.message}</div>
                                                    <div className="mt-3 flex gap-2">
                                                        <button
                                                            onClick={() => loadInquiryConversation(activeInquiry)}
                                                            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm"
                                                        >
                                                            Open
                                                        </button>
                                                        {activeInquiry.status !== 'RESOLVED' && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); markAsResolved(activeInquiry.id); }}
                                                                className="px-3 py-1.5 border border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-medium transition-colors duration-200"
                                                            >
                                                                Mark Resolved
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                                                    <div className="text-slate-700 font-medium">No active inquiry</div>
                                                    <div className="text-slate-500 text-sm mt-1">Start a new message to create one</div>
                                                    <button onClick={startNewConversation} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">Start New Message</button>
                                                </div>
                                            )}
                                        </div>
                                    ) : isLoadingHistory ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                                            <span className="text-gray-600 text-sm">Loading conversations...</span>
                                        </div>
                                    ) : filteredInquiries.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            {searchQuery.trim() ? (
                                                <>
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                    </div>
                                                    <h4 className="text-gray-700 font-medium mb-2">No matches found</h4>
                                                    <p className="text-gray-500 text-sm mb-4">Try searching with different keywords</p>
                                                    <button
                                                        onClick={() => setSearchQuery('')}
                                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                    >
                                                        Clear search
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                    </div>
                                                    <h4 className="text-gray-700 font-medium mb-2">No past inquiries</h4>
                                                    <p className="text-gray-500 text-sm mb-4">Your previous inquiries will appear here</p>
                                                    <button
                                                        onClick={startNewConversation}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
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
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${
                                                        activeInquiry?.id === inquiry.id
                                                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300 shadow-md'
                                                            : 'bg-white border-slate-200 hover:border-indigo-200'
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
                                                                inquiry.status === 'IN_PROGRESS' ? 'bg-indigo-400' :
                                                                inquiry.status === 'RESOLVED' ? 'bg-emerald-400' :
                                                                'bg-slate-400'
                                                            }`}></div>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                    inquiry.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' :
                                                                    inquiry.status === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-700' :
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
                                                            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm"
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
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-lg transition-all duration-200"
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
                        <div className="flex-1 flex flex-col bg-white">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-6 py-5 rounded-tr-3xl relative overflow-hidden">
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                                            <img src={appLogo} alt="FITS - Tanza" className="w-10 h-10 rounded-full object-contain bg-white" />
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-3 border-white rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight">FITS - Tanza</h3>
                                        <div className="flex items-center gap-2 text-indigo-100 mt-1">
                                            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-300 animate-pulse' : 'bg-gray-300'}`}></div>
                                            <span className="text-sm font-medium">Connected to live agent</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {activeInquiry?.id && activeInquiry?.status !== 'RESOLVED' && (
                                        <button
                                            type="button"
                                            onClick={() => markAsResolved(activeInquiry.id)}
                                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                            Mark as Resolved
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="p-2.5 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90 group"
                                        aria-label="Close chat"
                                    >
                                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                {messages.map((msg, idx) => (
                                <div
                    key={msg.key || idx}
                                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                                >
                                    {(msg.from === 'admin' || msg.from === 'system') && (
                                        <div className="flex-shrink-0">
                                            <div className={`w-8 h-8 rounded-full p-0.5 ${
                                                msg.from === 'admin' 
                                                    ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
                                                    : 'bg-gradient-to-br from-gray-400 to-gray-600'
                                            }`}>
                                                {msg.from === 'admin' ? (
                                                    <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                                                        A
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white text-xs">
                                                        ⚙️
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                                        <div
                                            className={`px-4 py-3 rounded-2xl text-sm shadow-sm transition-all duration-200 hover:shadow-md
                                                ${msg.from === 'user'
                                                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white rounded-br-md'
                                                    : msg.from === 'admin'
                                                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 border border-blue-200 rounded-bl-md'
                                                    : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200 rounded-bl-md'
                                                }`}
                                            style={{ wordBreak: 'break-word' }}
                                        >
                                            {msg.from === 'admin' && (
                                                <div className="text-xs text-blue-600 font-semibold mb-1">Live Agent</div>
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
                                                if (isMedia && isImg) return <img src={text} alt="attachment" className="max-w-xs rounded-lg border cursor-zoom-in" onClick={() => setViewer({ open: true, src: text, filename: name || 'image' })} />;
                                                if (isMedia && isVid) return (
                                                    <video className="max-w-xs rounded-lg border" controls>
                                                        <source src={text} />
                                                    </video>
                                                );
                                                if (isMedia) {
                                                    const n = (name || '').toLowerCase();
                                                    const bg =
                                                        mime === 'application/pdf' || n.endsWith('.pdf') ? 'bg-red-50 text-red-600' :
                                                        (n.endsWith('.doc') || n.endsWith('.docx') || (mime || '').includes('word')) ? 'bg-blue-50 text-blue-700' :
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
                                                        <a href={text} target="_blank" rel="noreferrer" className={`group w-64 border rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition ${msg.from==='user' ? 'bg-white border-gray-200' : 'bg-green-50 border-green-200'}`}>
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${bg}`}>{label}</div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium truncate" title={name || 'Attachment'}>{name || 'Attachment'}</div>
                                                                <div className="text-xs opacity-70">{mime}</div>
                                                            </div>
                                                            <svg className="w-4 h-4 opacity-60 group-hover:opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"/></svg>
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
                                        <span className={`text-xs mt-1.5 px-2 ${msg.from === 'user' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                    {msg.from === 'user' && (
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-0.5">
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
                                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-center max-w-xs">
                                    <div className="text-blue-600 text-sm font-medium mb-1">🔵 FITS - Tanza</div>
                                    <div className="text-blue-700 text-xs">Your messages are sent directly to our support team</div>
                                </div>
                            </div>
                            <div ref={messagesEndRef} />
                        </div>
                        
                        {/* Input Area */}
                        <div className="bg-white border-t border-slate-200 px-6 py-4">
                            <form
                                className="flex items-center gap-3"
                                onSubmit={handleSend}
                                autoComplete="off"
                            >
                                <div className="flex-1">
                                    {/* Attachment previews inside the input area */}
                                    {attachments.length > 0 && (
                                        <div className="mb-2 flex flex-wrap gap-2">
                                            {attachments.map((f, idx) => {
                                                const isImg = f.type.startsWith('image/');
                                                const url = isImg ? URL.createObjectURL(f) : null;
                                                return (
                                                    <div key={idx} className="relative group border border-slate-200 rounded-xl p-1 bg-slate-50">
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                                                            {isImg ? (
                                                                <img src={url} alt={f.name} className="object-cover w-full h-full" onLoad={() => url && URL.revokeObjectURL(url)} />
                                                            ) : (
                                                                <div className="text-xs text-slate-600 p-2 text-center">
                                                                    <div className="font-medium truncate w-14" title={f.name}>{f.name}</div>
                                                                    <div className="text-[10px] mt-1">{Math.ceil(f.size/1024)} KB</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button type="button" onClick={() => removeAttachment(idx)} className="absolute -top-2 -right-2 bg-white border border-red-300 text-red-600 rounded-full w-6 h-6 shadow-sm hidden group-hover:flex items-center justify-center">
                                                            ×
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder={'Message live agent...'}
                                            className="w-full rounded-2xl px-5 py-3 pr-12 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 focus:bg-white text-sm transition-all duration-200 placeholder-slate-500"
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            autoFocus
                                            maxLength={500}
                                            disabled={sending}
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
                                            {message.length}/500
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <input id="chat_file" type="file" className="hidden" onChange={onPickFile} multiple accept="image/*,application/pdf" />
                                    <label htmlFor="chat_file" className="cursor-pointer p-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-600 text-sm flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9"/></svg>
                                        {attachments.length > 0 ? `${attachments.length} file${attachments.length>1?'s':''}` : 'Attach'}
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className={`text-white rounded-2xl px-6 py-3 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                                        'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                                    }`}
                                    disabled={sending || (!message.trim() && attachments.length === 0)}
                                >
                                    <>
                                        <span>{sending ? 'Sending…' : 'Send'}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </>
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