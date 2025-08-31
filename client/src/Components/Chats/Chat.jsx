import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../../Client/Components/Navbar.jsx'
import botAvatar from '../../Assets/default_picture.png';
import userAvatar from '../../Assets/eic_default.png';
import { useSocket } from '../../contexts/SocketContext.jsx';

export default function Chat() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
    const [chatMode, setChatMode] = useState('admin'); // Direct to live agent
    const [adminRequested, setAdminRequested] = useState(true);
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
    const messagesEndRef = useRef(null);
    const { socket, isConnected, connectSocket } = useSocket();

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
            // Immediately request admin support
            if (socket) {
                console.debug('[chat] emit request_admin_support');
                socket.emit('request_admin_support', {
                    message: 'User opened chat and requested live support',
                    timestamp: new Date()
                });
            }

            // Fetch past inquiries immediately when chat opens
            fetchPastInquiries();
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

    // Handle switching to admin mode
    const requestAdmin = () => {
        setChatMode('admin');
        setAdminRequested(true);
        const adminRequestMsg = { 
            from: 'system', 
            text: '🔵 Live support engaged. An agent will assist you shortly.', 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        setMessages(prev => [...prev, adminRequestMsg]);
        if (socket && isConnected) {
            socket.emit('request_admin_support', {
                message: 'User requested live support',
                timestamp: new Date()
            });
        }
    };

    // Bot mode is removed

    // Handle sending a message
    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        const userMsg = { 
            from: 'user', 
            text: message, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        
        setMessages(prev => [...prev, userMsg]);
        
        // Emit message to server if connected
        if (isConnected && socket) {
            console.debug('[chat] emit chat_message', { len: message.length });
            socket.emit('chat_message', {
                message: message,
                timestamp: new Date(),
                mode: 'user'  // Always 'user' since this is a user sending a message
            });

            // Refresh conversation history after sending message
            setTimeout(() => {
                fetchPastInquiries();
            }, 1000); // Small delay to ensure message is processed
        }
        
        setMessage('');
    };
    // Bot reply logic removed

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

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
        
        // Set messages to show the inquiry conversation
        const inquiryMessages = [
            {
                from: 'user',
                text: inquiry.message,
                time: new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ];

        // Add all replies
        if (inquiry.replies) {
            inquiry.replies.forEach(reply => {
                inquiryMessages.push({
                    from: reply.senderType === 'ADMIN' ? 'admin' : 'user',
                    text: reply.message,
                    time: new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            });
        }

    setMessages(inquiryMessages);
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
                // If current conversation was resolved, go to new conversation
                if (activeInquiry?.id === inquiryId) {
                    startNewConversation();
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
                text: 'New conversation started. You\'re connected to a live support agent.', 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }
        ]);
        setChatMode('admin');
    setActiveTab('active');
    requestAdmin();
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
            <div className="fixed bottom-8 right-8 z-[999999] group">
                <button
                    onClick={() => setOpen(true)}
                    className="relative w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl flex items-center justify-center cursor-pointer hover:from-green-700 hover:to-green-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300/50 transform hover:scale-105"
                    aria-label="Open Support Chat"
                >
                    <svg className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    
                    {/* Connection indicator */}
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                </button>
            </div>

            {/* Simple Facebook Messenger-style Chat Modal */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999999] transition-all p-4"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className={`relative bg-white rounded-none shadow-none flex w-full h-full max-w-none max-h-none sm:rounded-3xl sm:shadow-2xl sm:w-[98vw] sm:h-[96vh] md:w-[80vw] md:h-[85vh] lg:w-[1200px] lg:h-[800px] xl:w-[1400px] xl:h-[900px] md:max-w-[98vw] md:max-h-[98vh] transition-all duration-300`}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Left Panel: Tabs with Inquiry History */}
                        <div className="w-96 bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 rounded-l-3xl flex flex-col">
                                {/* Sidebar Header */}
                                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-6 py-5 rounded-tl-3xl">
                                    <div className="flex items-center">
                                        <div>
                                            <h3 className="text-lg font-bold">Inquiries</h3>
                                            <p className="text-indigo-100 text-sm mt-1">
                                                {activeTab === 'history' ?
                                                    (searchQuery.trim() 
                                                        ? `${filteredInquiries.length} of ${pastInquiries.length} past`
                                                        : `${pastInquiries.length} ${pastInquiries.length === 1 ? 'past inquiry' : 'past inquiries'}`
                                                    )
                                                    : (activeInquiry ? 'Active inquiry' : 'No active inquiry')
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setActiveTab('active')}
                                            className={`w-full ${activeTab==='active' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'} hover:bg-white hover:text-indigo-600 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border border-white/30 shadow-sm`}
                                        >
                                            Active
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('history')}
                                            className={`w-full ${activeTab==='history' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'} hover:bg-white hover:text-indigo-600 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border border-white/30 shadow-sm`}
                                        >
                                            History
                                        </button>
                                    </div>
                                </div>

                                {/* Search Bar for Inquiries */}
                                <div className="p-4 border-b border-slate-200 bg-white">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search conversations..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-slate-50 focus:bg-white transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Active or History List */}
                                <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white to-slate-50">
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
                                    <div className="relative group">
                                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                                                A
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-3 border-white rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight">Live Support</h3>
                                        <div className="flex items-center gap-2 text-indigo-100 mt-1">
                                            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-300 animate-pulse' : 'bg-gray-300'}`}></div>
                                            <span className="text-sm font-medium">Connected to live agent</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-1">
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
                                    key={idx}
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
                                            {msg.text}
                                        </div>
                                        <span className={`text-xs mt-1.5 px-2 ${msg.from === 'user' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                    {msg.from === 'user' && (
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-0.5">
                                                <img src={userAvatar} alt="You" className="w-full h-full rounded-full object-cover" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {/* Bot typing and quick questions removed */}
                            
                            {/* Live agent indicator */}
                            <div className="flex justify-center">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-center max-w-xs">
                                    <div className="text-blue-600 text-sm font-medium mb-1">🔵 Live Support</div>
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
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder={'Message live agent...'}
                                        className="w-full rounded-2xl px-5 py-3 pr-12 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 focus:bg-white text-sm transition-all duration-200 placeholder-slate-500"
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        autoFocus
                                        maxLength={500}
                                        disabled={false}
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
                                        {message.length}/500
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className={`text-white rounded-2xl px-6 py-3 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                                        'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                                    }`}
                                    disabled={!message.trim()}
                                >
                                    <>
                                        <span>Send</span>
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
        </>
    );
}