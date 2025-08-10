import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../Client/Components/Navbar.jsx'
import botAvatar from '../../Assets/default_picture.png';
import userAvatar from '../../Assets/eic_default.png';

export default function Chat() {
    const [open, setOpen] = useState(false);
    const [currentView, setCurrentView] = useState('chat'); // 'chat', 'faq', 'inquiries'
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [currentInquiry, setCurrentInquiry] = useState(null); // Currently active inquiry being discussed
    
    // State for chat input and messages
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Welcome to FITS-Tanza Support! 🌟 I\'m here to assist you with seminars, account management, and general inquiries. How may I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // New inquiry state
    const [newInquiry, setNewInquiry] = useState({
        subject: '',
        category: 'general',
        priority: 'medium',
        message: ''
    });

    // Sample FAQ data
    const [faqs] = useState([
        {
            id: 1,
            question: "How do I register for a seminar?",
            answer: "You can register for seminars by visiting the Seminar section in your dashboard and clicking on the 'Register' button for your desired seminar.",
            category: "Seminar"
        },
        {
            id: 2,
            question: "How do I reset my password?",
            answer: "To reset your password, click on 'Forgot Password' on the login page and follow the instructions sent to your email.",
            category: "Account"
        },
        {
            id: 3,
            question: "What equipment is available for farmers?",
            answer: "We offer various farming equipment including tractors, irrigation systems, and harvesting tools. Check the Equipment section for availability.",
            category: "Equipment"
        },
        {
            id: 4,
            question: "How can I contact technical support?",
            answer: "You can contact technical support through this chat system, email us at support@fits-tanza.com, or call our helpline.",
            category: "General"
        }
    ]);

    // Sample user inquiries data
    const [userInquiries, setUserInquiries] = useState([
        {
            id: 1,
            subject: "Equipment Request",
            category: "Equipment",
            priority: "high",
            status: "in-progress",
            message: "I need to request a tractor for the upcoming planting season.",
            date: "2024-01-15",
            lastUpdate: "2024-01-16",
            replies: [
                { from: "user", message: "I need to request a tractor for the upcoming planting season.", time: "2024-01-15 10:30 AM" },
                { from: "admin", message: "Thank you for your request. We have tractors available. Please provide your farm location and preferred dates.", time: "2024-01-15 2:15 PM", responder: "Admin Sarah" },
                { from: "user", message: "My farm is located in Barangay San Jose. I need it from January 20-25.", time: "2024-01-16 8:45 AM" }
            ]
        },
        {
            id: 2,
            subject: "Seminar Registration Issue",
            category: "Seminar", 
            priority: "medium",
            status: "resolved",
            message: "I'm having trouble registering for the organic farming seminar.",
            date: "2024-01-10",
            resolvedDate: "2024-01-12",
            lastUpdate: "2024-01-12",
            replies: [
                { from: "user", message: "I'm having trouble registering for the organic farming seminar.", time: "2024-01-10 3:20 PM" },
                { from: "admin", message: "I can help you with that. What specific error are you encountering?", time: "2024-01-10 4:00 PM", responder: "Admin John" },
                { from: "user", message: "The registration button is not working when I click it.", time: "2024-01-11 9:15 AM" },
                { from: "admin", message: "The issue has been fixed. Please try again. You should now be able to register successfully.", time: "2024-01-12 10:30 AM", responder: "Admin John" },
                { from: "user", message: "It works now! Thank you so much for the help.", time: "2024-01-12 11:00 AM" }
            ]
        }
    ]);

    // Chat action functions to be accessed from bot reply buttons
    useEffect(() => {
        window.chatActions = {
            showFAQ: () => setCurrentView('faq'),
            showInquiries: () => setCurrentView('inquiries')
        };
        
        return () => {
            delete window.chatActions;
        };
    }, []);

    // Handle sending a message
    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        const userMsg = { from: 'user', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        
        // If there's a current inquiry, add message to it
        if (currentInquiry) {
            const newReply = {
                from: "user",
                message: message,
                time: new Date().toLocaleString()
            };
            
            setUserInquiries(prev => 
                prev.map(inquiry => 
                    inquiry.id === currentInquiry.id
                        ? { 
                            ...inquiry, 
                            lastUpdate: new Date().toLocaleDateString(),
                            replies: [...inquiry.replies, newReply]
                        }
                        : inquiry
                )
            );
            
            // Update current inquiry
            setCurrentInquiry(prev => ({
                ...prev,
                lastUpdate: new Date().toLocaleDateString(),
                replies: [...prev.replies, newReply]
            }));
        } else {
            // Create new inquiry automatically for first message
            const newInquiry = {
                id: Date.now(),
                subject: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                category: 'general',
                priority: 'medium',
                status: 'pending',
                message: message,
                date: new Date().toLocaleDateString(),
                lastUpdate: new Date().toLocaleDateString(),
                replies: [
                    { 
                        from: "user", 
                        message: message, 
                        time: new Date().toLocaleString() 
                    }
                ]
            };
            
            setUserInquiries(prev => [newInquiry, ...prev]);
            setCurrentInquiry(newInquiry);
        }
        
        setMessages(prev => [...prev, userMsg]);
        setMessage('');
        setIsBotTyping(true);
        
        setTimeout(() => {
            const botReply = getBotReply(message);
            const botMsg = { from: 'bot', text: botReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            setMessages(prev => [...prev, botMsg]);
            
            // Add bot reply to inquiry if there's a current inquiry
            if (currentInquiry) {
                const botReplyObj = {
                    from: "admin",
                    message: botReply.replace(/<[^>]*>/g, ''), // Remove HTML tags for storage
                    time: new Date().toLocaleString(),
                    responder: "FITS-Tanza Bot"
                };
                
                setUserInquiries(prev => 
                    prev.map(inquiry => 
                        inquiry.id === currentInquiry.id
                            ? { 
                                ...inquiry, 
                                lastUpdate: new Date().toLocaleDateString(),
                                replies: [...inquiry.replies, botReplyObj]
                            }
                            : inquiry
                    )
                );
                
                setCurrentInquiry(prev => ({
                    ...prev,
                    lastUpdate: new Date().toLocaleDateString(),
                    replies: [...prev.replies, botReplyObj]
                }));
            }
            
            setIsBotTyping(false);
        }, 1200);
    };

    // Handle new inquiry submission
    const handleInquirySubmit = (e) => {
        e.preventDefault();
        if (!newInquiry.subject.trim() || !newInquiry.message.trim()) return;
        
        const inquiry = {
            id: Date.now(),
            ...newInquiry,
            status: 'pending',
            date: new Date().toLocaleDateString(),
            lastUpdate: new Date().toLocaleDateString(),
            replies: [
                { 
                    from: "user", 
                    message: newInquiry.message, 
                    time: new Date().toLocaleString() 
                }
            ]
        };
        
        setUserInquiries(prev => [inquiry, ...prev]);
        setNewInquiry({ subject: '', category: 'general', priority: 'medium', message: '' });
        setCurrentView('inquiries');
        
        // Show success message
        alert('Inquiry submitted successfully! You can track its progress in your inquiries.');
    };

    // Handle continuing an inquiry (load into chat)
    const handleContinueInquiry = (inquiry) => {
        setCurrentInquiry(inquiry);
        
        // Load inquiry messages into chat
        const inquiryMessages = [
            { from: 'bot', text: 'Welcome to FITS-Tanza Support! 🌟 I\'m here to assist you with seminars, account management, and general inquiries. How may I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ];
        
        // Add all replies as chat messages
        inquiry.replies.forEach(reply => {
            inquiryMessages.push({
                from: reply.from === 'user' ? 'user' : 'bot',
                text: reply.message,
                time: reply.time
            });
        });
        
        setMessages(inquiryMessages);
        setCurrentView('chat');
    };

    // Start new conversation
    const startNewConversation = () => {
        setCurrentInquiry(null);
        setMessages([
            { from: 'bot', text: 'Welcome to FITS-Tanza Support! 🌟 I\'m here to assist you with seminars, account management, and general inquiries. How may I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
        setCurrentView('chat');
    };

    // Handle marking inquiry as resolved
    const handleResolveInquiry = (inquiryId) => {
        setUserInquiries(prev => 
            prev.map(inquiry => 
                inquiry.id === inquiryId 
                    ? { 
                        ...inquiry, 
                        status: 'resolved',
                        resolvedDate: new Date().toLocaleDateString(),
                        lastUpdate: new Date().toLocaleDateString()
                    }
                    : inquiry
            )
        );
    };

    // Simple bot reply logic (expand as needed)
    function getBotReply(userMsg) {
        const lower = userMsg.toLowerCase();
        if (lower.includes('hello') || lower.includes('hi')) {
            return `Hi there! 😊 How can I assist you today?<br><br>
                    <button onclick="window.chatActions.showFAQ()" style="background: #16a34a; color: white; padding: 8px 16px; margin: 4px; border: none; border-radius: 6px; cursor: pointer;">📋 View FAQ</button>
                    <button onclick="window.chatActions.showInquiries()" style="background: #2563eb; color: white; padding: 8px 16px; margin: 4px; border: none; border-radius: 6px; cursor: pointer;">📝 My Inquiries</button>`;
        }
        if (lower.includes('help')) {
            return `Of course! I can help you with:<br><br>
                    • Check our FAQ for common questions<br>
                    • View your existing inquiries<br>
                    • Continue your conversations<br><br>
                    <button onclick="window.chatActions.showFAQ()" style="background: #16a34a; color: white; padding: 8px 16px; margin: 4px; border: none; border-radius: 6px; cursor: pointer;">📋 View FAQ</button>`;
        }
        if (lower.includes('seminar')) return 'You can view upcoming seminars in the Seminar section. Would you like a direct link?';
        if (lower.includes('contact')) return 'You can contact us at <b>fits-tanza@email.com</b> or call <b>123-456-7890</b>.';
        if (lower.includes('thank')) return 'You\'re welcome! If you have more questions, just ask anytime.';
        if (lower.includes('account')) return 'For account concerns, please visit your profile or contact our support.';
        if (lower.includes('faq') || lower.includes('frequently')) {
            return `Here are our frequently asked questions:<br><br>
                    <button onclick="window.chatActions.showFAQ()" style="background: #16a34a; color: white; padding: 8px 16px; margin: 4px; border: none; border-radius: 6px; cursor: pointer;">📋 View All FAQ</button>`;
        }
        if (lower.includes('inquiry') || lower.includes('inquiries')) {
            return `You can manage your inquiries here:<br><br>
                    <button onclick="window.chatActions.showInquiries()" style="background: #2563eb; color: white; padding: 8px 16px; margin: 4px; border: none; border-radius: 6px; cursor: pointer;">📝 View My Inquiries</button>`;
        }
        return `I'm here to help! Could you please provide more details or specify your concern?<br><br>
                <button onclick="window.chatActions.showFAQ()" style="background: #16a34a; color: white; padding: 8px 16px; margin: 4px; border: none; border-radius: 6px; cursor: pointer;">📋 FAQ</button>`;
    }

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isBotTyping]);

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-[999999] group">
                <button
                    onClick={() => setOpen(true)}
                    className="w-16 h-16 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
                    aria-label="Open Support Chat"
                >
                    {/* Chat icon */}
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    
                    {/* Simple tooltip */}
                    <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        Chat with us!
                    </div>
                </button>
            </div>
            {/* Chat Modal */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999999] transition-all"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="relative w-full h-full max-w-none max-h-none bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-none shadow-none flex flex-col
                        sm:rounded-2xl sm:shadow-2xl sm:w-[98vw] sm:h-[96vh] md:w-[600px] md:h-[800px] md:max-w-[98vw] md:max-h-[98vh] transition-all border border-blue-200"
                        onClick={e => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label="FITS-tanza Chatbot"
                    >
                        {/* Header with Navigation */}
                        <div className="bg-green-600 text-white px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={botAvatar} alt="Support Assistant" className="w-12 h-12 rounded-full border-2 border-white/30" />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">FITS-Tanza Support</h3>
                                        <div className="flex items-center gap-2 text-green-100">
                                            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                                            <span className="text-sm">Online</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-2 hover:bg-green-700 rounded-full transition-colors duration-200"
                                    aria-label="Close chat"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Navigation Tabs */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setCurrentView('chat')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'chat' ? 'bg-white text-green-600' : 'bg-green-700 text-white hover:bg-green-800'}`}
                                >
                                    💬 Chat
                                </button>
                                <button
                                    onClick={() => setCurrentView('faq')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'faq' ? 'bg-white text-green-600' : 'bg-green-700 text-white hover:bg-green-800'}`}
                                >
                                    📋 FAQ
                                </button>
                                <button
                                    onClick={() => setCurrentView('inquiries')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'inquiries' ? 'bg-white text-green-600' : 'bg-green-700 text-white hover:bg-green-800'}`}
                                >
                                    📝 My Inquiries
                                </button>
                                {currentInquiry && (
                                    <button
                                        onClick={startNewConversation}
                                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-yellow-600 text-white hover:bg-yellow-700"
                                    >
                                        🆕 New Chat
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Content Area */}
                        <div className="flex-1 overflow-hidden bg-gray-50">
                            {/* Chat View */}
                            {currentView === 'chat' && (
                                <>
                                    {/* Chat Messages */}
                                    <div className="h-full flex flex-col">
                                        {/* Current Inquiry Header */}
                                        {currentInquiry && (
                                            <div className="bg-blue-50 border-b border-blue-200 p-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-blue-800">
                                                            Continuing: {currentInquiry.subject}
                                                        </p>
                                                        <div className="flex gap-2 mt-1">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentInquiry.status)}`}>
                                                                {currentInquiry.status}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(currentInquiry.priority)}`}>
                                                                {currentInquiry.priority} priority
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={startNewConversation}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        Start New Chat
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
                                            <style jsx>{`
                                                .custom-scrollbar::-webkit-scrollbar {
                                                    width: 8px;
                                                }
                                                .custom-scrollbar::-webkit-scrollbar-track {
                                                    background: #f1f5f9;
                                                    border-radius: 4px;
                                                }
                                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                                    background: #16a34a;
                                                    border-radius: 4px;
                                                }
                                                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                                    background: #15803d;
                                                }
                                                /* Firefox */
                                                .custom-scrollbar {
                                                    scrollbar-width: thin;
                                                    scrollbar-color: #16a34a #f1f5f9;
                                                }
                                            `}</style>
                                            <div className="flex flex-col gap-3">
                                                {messages.map((msg, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} items-end`}
                                                    >
                                                        {msg.from === 'bot' && (
                                                            <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full mr-2" />
                                                        )}
                                                        <div className="flex flex-col items-end max-w-[75%]">
                                                            <div
                                                                className={`px-4 py-2 rounded-lg text-sm
                                                                    ${msg.from === 'user'
                                                                        ? 'bg-green-600 text-white rounded-br-none'
                                                                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                                                                    }`}
                                                                style={{ wordBreak: 'break-word' }}
                                                                dangerouslySetInnerHTML={msg.from === 'bot' ? { __html: msg.text } : undefined}
                                                            >
                                                                {msg.from === 'user' ? msg.text : null}
                                                            </div>
                                                            <span className={`text-xs mt-1 ${msg.from === 'user' ? 'text-gray-500' : 'text-gray-400'}`}>{msg.time}</span>
                                                        </div>
                                                        {msg.from === 'user' && (
                                                            <img src={userAvatar} alt="You" className="w-8 h-8 rounded-full ml-2" />
                                                        )}
                                                    </div>
                                                ))}
                                                {isBotTyping && (
                                                    <div className="flex justify-start items-end">
                                                        <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full mr-2" />
                                                        <div className="px-4 py-2 rounded-lg text-sm bg-white text-gray-800 rounded-bl-none border border-gray-200 flex items-center gap-2">
                                                            <div className="flex gap-1">
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                            </div>
                                                            <span>Typing...</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        </div>
                                        
                                        {/* Input Area */}
                                        <form
                                            className="flex items-center gap-2 px-4 py-4 border-t border-gray-200 bg-white"
                                            onSubmit={handleSend}
                                            autoComplete="off"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Type your message..."
                                                className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                                                value={message}
                                                onChange={e => setMessage(e.target.value)}
                                                autoFocus
                                                maxLength={300}
                                                aria-label="Type your message"
                                                disabled={isBotTyping}
                                            />
                                            <button
                                                type="submit"
                                                className="bg-green-600 text-white rounded-full px-5 py-2 hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isBotTyping || !message.trim()}
                                                aria-label="Send message"
                                            >
                                                {isBotTyping ? '...' : 'Send'}
                                            </button>
                                        </form>
                                    </div>
                                </>
                            )}

                            {/* FAQ View */}
                            {currentView === 'faq' && (
                                <div className="h-full overflow-y-auto p-6">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
                                    <div className="space-y-4">
                                        {faqs.map((faq) => (
                                            <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{faq.category}</span>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* My Inquiries View */}
                            {currentView === 'inquiries' && (
                                <div className="h-full overflow-y-auto p-6">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-800">My Inquiries</h2>
                                    {userInquiries.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500 mb-4">No inquiries found</p>
                                            <button
                                                onClick={() => setCurrentView('chat')}
                                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Start Your First Conversation
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {userInquiries.map((inquiry) => (
                                                <div key={inquiry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{inquiry.subject}</h3>
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                                                    {inquiry.status}
                                                                </span>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                                                                    {inquiry.priority} priority
                                                                </span>
                                                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                                                    {inquiry.category}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-600 text-sm mb-3">{inquiry.message}</p>
                                                            <div className="text-xs text-gray-500">
                                                                <p>Created: {inquiry.date}</p>
                                                                <p>Last Update: {inquiry.lastUpdate}</p>
                                                                {inquiry.resolvedDate && <p>Resolved: {inquiry.resolvedDate}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex gap-2">
                                                        {inquiry.status !== 'resolved' ? (
                                                            <button
                                                                onClick={() => handleContinueInquiry(inquiry)}
                                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                                            >
                                                                Continue Conversation
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => setSelectedInquiry(inquiry)}
                                                                className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                                                            >
                                                                View Conversation
                                                            </button>
                                                        )}
                                                        {inquiry.status !== 'resolved' && (
                                                            <button
                                                                onClick={() => handleResolveInquiry(inquiry.id)}
                                                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                                                            >
                                                                Mark as Resolved
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-center px-4 py-2 text-xs text-gray-400 bg-white rounded-b-2xl border-t border-gray-200">
                            <span>Powered by FITS-Tanza</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Inquiry Conversation Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999999]" onClick={() => setSelectedInquiry(null)}>
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden m-4" onClick={e => e.stopPropagation()}>
                        <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{selectedInquiry.subject}</h3>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="p-1 hover:bg-green-700 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-4 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-4">
                                {selectedInquiry.replies.map((reply, index) => (
                                    <div key={index} className={`flex ${reply.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-lg ${
                                            reply.from === 'user'
                                                ? 'bg-green-600 text-white rounded-br-none'
                                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}>
                                            <p>{reply.message}</p>
                                            <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                                                <span>{reply.time}</span>
                                                {reply.responder && <span>- {reply.responder}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}