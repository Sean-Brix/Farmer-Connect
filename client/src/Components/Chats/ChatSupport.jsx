import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../Client/Components/Navbar.jsx'
import botAvatar from '../../Assets/default_picture.png';
import userAvatar from '../../Assets/eic_default.png';

export default function ChatSupport() {
    const [currentView, setCurrentView] = useState('chat'); // 'chat', 'faq', 'inquiries'
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [currentInquiry, setCurrentInquiry] = useState(null);
    
    // State for chat input and messages
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Welcome to FITS-Tanza Chat Support! 🌟 I\'m here to assist you with seminars, account management, and general inquiries. How may I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messagesEndRef = useRef(null);

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
            question: "How can I reset my password?",
            answer: "To reset your password, click on 'Forgot Password' on the login page and follow the instructions sent to your email.",
            category: "Account"
        },
        {
            id: 3,
            question: "What documents do I need for EIC registration?",
            answer: "For EIC registration, you'll need: Valid ID, proof of address, and completed application form.",
            category: "EIC"
        },
        {
            id: 4,
            question: "How do I track my distribution requests?",
            answer: "You can track your distribution requests in the Distribution section of your dashboard under 'My Requests'.",
            category: "Distribution"
        },
        {
            id: 5,
            question: "What are the seminar requirements?",
            answer: "Seminar requirements vary by program. Check the specific seminar details for prerequisites and materials needed.",
            category: "Seminar"
        }
    ]);

    // Sample user inquiries data
    const [userInquiries] = useState([
        {
            id: 1,
            subject: "Seminar Registration Issue",
            category: "seminar",
            priority: "high",
            status: "open",
            message: "I'm unable to register for the upcoming agricultural seminar. The system shows an error message.",
            createdAt: "2024-01-15 10:30 AM",
            replies: [
                { from: 'user', message: "I'm unable to register for the upcoming agricultural seminar. The system shows an error message.", time: "10:30 AM" },
                { from: 'support', message: "Thank you for reaching out. Can you please provide the exact error message you're seeing?", time: "10:45 AM", responder: "Support Team" },
                { from: 'user', message: "It says 'Registration failed - Please contact administrator'", time: "10:50 AM" },
                { from: 'support', message: "I see the issue. There was a temporary system glitch. Please try registering again now.", time: "11:00 AM", responder: "Tech Support" }
            ]
        },
        {
            id: 2,
            subject: "EIC Application Status",
            category: "eic",
            priority: "medium",
            status: "in-progress",
            message: "I submitted my EIC application last week but haven't received any updates.",
            createdAt: "2024-01-12 2:15 PM",
            replies: [
                { from: 'user', message: "I submitted my EIC application last week but haven't received any updates.", time: "2:15 PM" },
                { from: 'support', message: "Your application is currently under review. You should receive an update within 3-5 business days.", time: "2:30 PM", responder: "EIC Team" }
            ]
        }
    ]);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const userMsg = { from: 'user', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            setMessages(prev => [...prev, userMsg]);
            setMessage('');
            
            // Simulate bot typing
            setIsBotTyping(true);
            
            setTimeout(() => {
                const responses = [
                    "Thank you for your message! I'm here to help you with any questions about FITS-Tanza services.",
                    "I understand your concern. Let me provide you with the information you need.",
                    "That's a great question! Here's what I can tell you about that topic.",
                    "I'm glad you reached out! Let me assist you with that inquiry."
                ];
                
                let botReply = responses[Math.floor(Math.random() * responses.length)];
                
                // Check if user is asking about specific topics
                const lowerMessage = message.toLowerCase();
                if (lowerMessage.includes('seminar') || lowerMessage.includes('training')) {
                    botReply = "I'd be happy to help you with seminar-related questions! You can view available seminars, register for programs, and track your progress in the Seminar section. Would you like me to show you some frequently asked questions about seminars?";
                } else if (lowerMessage.includes('eic') || lowerMessage.includes('equipment')) {
                    botReply = "For EIC (Equipment and Infrastructure Component) inquiries, I can help you understand the application process, requirements, and status updates. Would you like to see some common EIC questions?";
                } else if (lowerMessage.includes('distribution') || lowerMessage.includes('supply')) {
                    botReply = "I can assist you with distribution-related matters including requests, tracking, and guidelines. Would you like to see distribution FAQs?";
                } else if (lowerMessage.includes('password') || lowerMessage.includes('login') || lowerMessage.includes('account')) {
                    botReply = "For account-related issues like password resets, login problems, or profile updates, I can guide you through the process. Would you like to see account management FAQs?";
                }
                
                const botMsg = { from: 'bot', text: botReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
                setMessages(prev => [...prev, botMsg]);
                setIsBotTyping(false);
            }, 1500);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Helper functions for styling
    const getCategoryColor = (category) => {
        switch (category) {
            case 'seminar': return 'bg-blue-100 text-blue-800';
            case 'eic': return 'bg-green-100 text-green-800';
            case 'distribution': return 'bg-purple-100 text-purple-800';
            case 'account': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-800';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            {/* Navigation */}
            <Navbar />
            
            {/* Main Chat Support Page - Professional Modal-like Layout */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-gray-100 p-4 pt-[16vh]">
                <div className="container mx-auto max-w-5xl">
                    {/* Professional Page Header - EIC Style */}
                    <div className="text-center mb-12">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Welcome to
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
                            Professional Support Center
                        </h1>
                        <div className="w-24 h-1 bg-green-500 mx-auto rounded-full mb-6"></div>
                      
                      
                    </div>

                    {/* Professional Chat Interface */}
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-5xl mx-auto" style={{ height: '700px' }}>
                        {/* Enhanced Professional Header */}
                        <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white px-8 py-6 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-white/5">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
                                    backgroundSize: '24px 24px'
                                }}></div>
                            </div>
                            
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                            <img src={botAvatar} alt="Support Assistant" className="w-12 h-12 rounded-xl" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight">FITS-Tanza Assistant</h2>
                                        <div className="flex items-center gap-2 text-blue-100 mt-1">
                                            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                            <span className="font-medium">Ready to assist you</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center gap-4 text-white/80 text-sm">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>24/7 Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span>Instant Response</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Navigation Tabs */}
                        <div className="bg-gray-50 border-b border-gray-200 px-8 py-4">
                            <div className="flex gap-1 bg-white rounded-xl p-1 shadow-inner max-w-md mx-auto">
                                <button
                                    onClick={() => setCurrentView('chat')}
                                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                                        currentView === 'chat' 
                                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span>Chat</span>
                                </button>
                                <button
                                    onClick={() => setCurrentView('faq')}
                                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                                        currentView === 'faq' 
                                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>FAQ</span>
                                </button>
                                <button
                                    onClick={() => setCurrentView('inquiries')}
                                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                                        currentView === 'inquiries' 
                                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>My Tickets</span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Professional Content Area */}
                        <div className="flex-1 h-full bg-gradient-to-br from-gray-50 via-white to-gray-50" style={{ height: 'calc(700px - 200px)' }}>
                            {/* Chat View */}
                            {currentView === 'chat' && (
                                <div className="h-full flex flex-col">
                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ maxHeight: 'calc(100% - 100px)' }}>
                                        {messages.map((msg, index) => (
                                            <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[75%] ${msg.from === 'user' ? 'order-2' : 'order-1'}`}>
                                                    <div className={`rounded-2xl px-6 py-4 shadow-lg ${
                                                        msg.from === 'user'
                                                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white rounded-br-sm'
                                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                                                    }`}>
                                                        <div className="flex items-start gap-3">
                                                            {msg.from === 'bot' && (
                                                                <img src={botAvatar} alt="Bot" className="w-9 h-9 rounded-full flex-shrink-0 mt-1 ring-2 ring-gray-100" />
                                                            )}
                                                            <div className="flex-1">
                                                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                                <p className={`text-xs mt-3 ${msg.from === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                                                                    {msg.time}
                                                                </p>
                                                            </div>
                                                            {msg.from === 'user' && (
                                                                <img src={userAvatar} alt="User" className="w-9 h-9 rounded-full flex-shrink-0 mt-1 ring-2 ring-green-100" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* Enhanced Bot Typing Indicator */}
                                        {isBotTyping && (
                                            <div className="flex justify-start">
                                                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-6 py-4 shadow-lg">
                                                    <div className="flex items-center gap-3">
                                                        <img src={botAvatar} alt="Bot" className="w-9 h-9 rounded-full ring-2 ring-gray-100" />
                                                        <div className="flex space-x-1">
                                                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                        </div>
                                                        <span className="text-sm text-gray-500">Typing...</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    
                                    {/* Professional Message Input */}
                                    <div className="bg-white border-t border-gray-200 px-6 py-4">
                                        <form
                                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                            className="flex items-center gap-3"
                                            autoComplete="off"
                                        >
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    placeholder="Type your message here..."
                                                    className="w-full rounded-2xl px-5 py-3 pr-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 bg-gray-50 focus:bg-white text-sm transition-all duration-200 placeholder-gray-500"
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    autoFocus
                                                    maxLength={500}
                                                    aria-label="Type your message"
                                                    disabled={isBotTyping}
                                                />
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                                    {message.length}/500
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl px-6 py-3 hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
                                                disabled={isBotTyping || !message.trim()}
                                                aria-label="Send message"
                                            >
                                                {isBotTyping ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        <span>Sending...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Send</span>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                        </svg>
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                        
                                        {/* Quick Actions */}
                                        <div className="flex gap-2 mt-3 flex-wrap">
                                            <button
                                                onClick={() => setCurrentView('faq')}
                                                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 flex items-center gap-1"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                FAQ
                                            </button>
                                            <button
                                                onClick={() => setCurrentView('inquiries')}
                                                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 flex items-center gap-1"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                My Tickets
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced FAQ View */}
                            {currentView === 'faq' && (
                                <div className="h-full overflow-y-auto p-8">
                                    <div className="max-w-4xl mx-auto">
                                        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">Frequently Asked Questions</h2>
                                        <div className="grid gap-6">
                                            {faqs.map((faq) => (
                                                <div key={faq.id} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-gray-900 mb-4 text-lg">{faq.question}</h3>
                                                            <p className="text-gray-700 mb-4 leading-relaxed">{faq.answer}</p>
                                                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(faq.category.toLowerCase())}`}>
                                                                {faq.category}
                                                            </span>
                                                        </div>
                                                        <div className="ml-6">
                                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced My Inquiries View */}
                            {currentView === 'inquiries' && (
                                <div className="h-full overflow-y-auto p-8">
                                    <div className="max-w-4xl mx-auto">
                                        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">My Support Tickets</h2>
                                        {userInquiries.length === 0 ? (
                                            <div className="text-center py-16">
                                                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-3">No support tickets yet</h3>
                                                <p className="text-gray-600 mb-8 max-w-md mx-auto">You haven't submitted any support tickets. Start a conversation to create your first ticket!</p>
                                                <button
                                                    onClick={() => setCurrentView('chat')}
                                                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                                                >
                                                    Start a Conversation
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid gap-6">
                                                {userInquiries.map((inquiry) => (
                                                    <div key={inquiry.id} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                                                        <div className="flex items-start justify-between mb-6">
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-gray-900 mb-3 text-lg">{inquiry.subject}</h3>
                                                                <p className="text-gray-700 mb-4 leading-relaxed">{inquiry.message}</p>
                                                                <div className="flex items-center gap-3 mb-4">
                                                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(inquiry.category)}`}>
                                                                        {inquiry.category}
                                                                    </span>
                                                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getPriorityColor(inquiry.priority)}`}>
                                                                        {inquiry.priority}
                                                                    </span>
                                                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(inquiry.status)}`}>
                                                                        {inquiry.status}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-500">Created: {inquiry.createdAt}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-4">
                                                            <button
                                                                onClick={() => setSelectedInquiry(inquiry)}
                                                                className="bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                                                            >
                                                                View Details
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setCurrentInquiry(inquiry);
                                                                    setCurrentView('chat');
                                                                }}
                                                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-colors shadow-md hover:shadow-lg"
                                                            >
                                                                Continue Discussion
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Professional Inquiry Details Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999999] p-4" onClick={() => setSelectedInquiry(null)}>
                    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-200" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedInquiry.subject}</h3>
                                    <p className="text-blue-100">Ticket Conversation</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-6">
                                {selectedInquiry.replies.map((reply, index) => (
                                    <div key={index} className={`flex ${reply.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-6 rounded-2xl shadow-lg ${
                                            reply.from === 'user'
                                                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white rounded-br-sm'
                                                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                                        }`}>
                                            <p className="leading-relaxed">{reply.message}</p>
                                            <div className="flex items-center justify-between mt-4 text-sm opacity-80">
                                                <span>{reply.time}</span>
                                                {reply.responder && <span>- {reply.responder}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-2xl hover:from-green-700 hover:to-green-800 transition-colors font-semibold shadow-lg"
                            >
                                Close Conversation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
