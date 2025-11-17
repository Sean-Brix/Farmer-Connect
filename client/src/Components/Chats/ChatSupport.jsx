import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../Client/Components/Navbar.jsx'
import botAvatar from '../../Assets/default_picture.png';
import userAvatar from '../../Assets/eic_default.png';
import { useTheme } from '../../contexts/ThemeContext';
import botAPI from '../../Services/botAPI.js';

export default function ChatSupport() {
    const { theme, isDark } = useTheme();
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

    // FAQ and Categories state
    const [categories, setCategories] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [faqsLoading, setFaqsLoading] = useState(false);
    const [faqsError, setFaqsError] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [expandedFAQs, setExpandedFAQs] = useState(new Set());

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

    // FAQ Loading Functions using Bot API
    const loadFAQCategories = async () => {
        try {
            setFaqsLoading(true);
            setFaqsError(null);
            
            // Get welcome message with categories
            const welcomeData = await botAPI.getWelcomeMessage();
            if (welcomeData && welcomeData.categories) {
                setCategories(welcomeData.categories);
                
                // Load FAQs for all categories
                const allFAQs = [];
                for (const category of welcomeData.categories) {
                    try {
                        const categoryFAQs = await botAPI.getCategoryFAQs(category.id);
                        if (categoryFAQs && categoryFAQs.faqs) {
                            // Add category info to each FAQ
                            const faqsWithCategory = categoryFAQs.faqs.map(faq => ({
                                ...faq,
                                categoryId: category.id,
                                categoryName: category.name
                            }));
                            allFAQs.push(...faqsWithCategory);
                        }
                    } catch (error) {
                        console.error(`Error loading FAQs for category ${category.name}:`, error);
                    }
                }
                setFaqs(allFAQs);
            } else {
                setFaqsError('Failed to load FAQ categories from bot API');
            }
        } catch (error) {
            console.error('Error loading FAQ data:', error);
            setFaqsError('Failed to load FAQ data');
        } finally {
            setFaqsLoading(false);
        }
    };

    const toggleFAQExpansion = (faqId) => {
        setExpandedFAQs(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(faqId)) {
                newExpanded.delete(faqId);
            } else {
                newExpanded.add(faqId);
            }
            return newExpanded;
        });
    };

    const getFilteredFAQs = () => {
        if (!selectedCategoryId) return faqs;
        return faqs.filter(faq => faq.categoryId === selectedCategoryId);
    };

    // Load FAQ data when FAQ view is opened
    useEffect(() => {
        if (currentView === 'faq' && categories.length === 0) {
            loadFAQCategories();
        }
    }, [currentView]);

    // Helper functions for styling
    const getCategoryColor = (category) => {
        switch (category) {
            case 'seminar': return isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800';
            case 'eic': return isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
            case 'distribution': return isDark ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800';
            case 'account': return isDark ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800';
            default: return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
            case 'medium': return isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
            case 'low': return isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
            default: return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800';
            case 'in-progress': return isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
            case 'resolved': return isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
            case 'closed': return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
            default: return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            {/* Navigation */}
            <Navbar />
            
            {/* Main Chat Support Page - Minimal Professional Layout */}
            <div className={`min-h-screen pt-[14vh] pb-8 px-4 ${
                isDark 
                    ? 'bg-gray-900' 
                    : 'bg-gray-50'
            }`}>
                <div className="container mx-auto max-w-6xl">
                    {/* Enhanced Appealing Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center gap-2 mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                isDark ? 'bg-green-600' : 'bg-green-500'
                            }`}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h1 className={`text-3xl font-bold ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                                Help & Support Center
                            </h1>
                        </div>
                        <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            We're here to help you 24/7 • Get instant answers to your questions
                        </p>
                    </div>

                    {/* Minimal Chat Interface */}
                    <div className={`rounded-xl border overflow-hidden ${
                        isDark 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
                    }`} style={{ height: '75vh', maxHeight: '700px' }}>
                        {/* Minimal Header */}
                        <div className={`px-6 py-4 border-b flex items-center justify-between ${
                            isDark 
                                ? 'bg-gray-800 border-gray-700' 
                                : 'bg-white border-gray-200'
                        }`}>
                            <div className="flex items-center gap-3 pt-4">
                                <div className="relative">
                                    <img src={botAvatar} alt="Support" className="w-10 h-10 rounded-full" />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <h2 className={`text-base font-semibold  ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        FITS-Tanza Assistant
                                    </h2>
                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Online • Ready to help
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Visible Navigation Tabs */}
                        <div className={`px-6 py-4 border-b ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setCurrentView('chat')}
                                    className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                                        currentView === 'chat' 
                                            ? 'bg-green-600 text-white shadow-lg scale-105' 
                                            : isDark
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300 hover:border-green-400'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Chat Support
                                </button>
                                <button
                                    onClick={() => setCurrentView('faq')}
                                    className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                                        currentView === 'faq' 
                                            ? 'bg-green-600 text-white shadow-lg scale-105' 
                                            : isDark
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300 hover:border-green-400'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    FAQ
                                </button>
                                <button
                                    onClick={() => setCurrentView('inquiries')}
                                    className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                                        currentView === 'inquiries' 
                                            ? 'bg-green-600 text-white shadow-lg scale-105' 
                                            : isDark
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300 hover:border-green-400'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    My Tickets
                                </button>
                            </div>
                        </div>
                        
                        {/* Minimal Content Area */}
                        <div className={`flex-1 h-full ${isDark ? 'bg-gray-800' : 'bg-white'}`} style={{ height: 'calc(75vh - 140px)', maxHeight: 'calc(700px - 140px)' }}>
                            {/* Chat View */}
                            {currentView === 'chat' && (
                                <div className="h-full flex flex-col">
                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100% - 80px)' }}>
                                        {messages.map((msg, index) => (
                                            <div key={index} className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className="flex-shrink-0">
                                                    <img 
                                                        src={msg.from === 'user' ? userAvatar : botAvatar} 
                                                        alt={msg.from} 
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                </div>
                                                <div className={`max-w-[75%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                                                    <div className={`rounded-2xl px-4 py-2.5 ${
                                                        msg.from === 'user'
                                                            ? isDark
                                                                ? 'bg-green-600 text-white'
                                                                : 'bg-green-600 text-white'
                                                            : isDark
                                                                ? 'bg-gray-700 text-gray-100'
                                                                : 'bg-gray-100 text-gray-900'
                                                    }`}>
                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                    </div>
                                                    <span className={`text-xs mt-1 px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        {msg.time}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* Minimal Bot Typing Indicator */}
                                        {isBotTyping && (
                                            <div className="flex gap-2">
                                                <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full flex-shrink-0" />
                                                <div className={`rounded-2xl px-4 py-3 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                    <div className="flex space-x-1">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    
                                    {/* Minimal Message Input */}
                                    <div className={`border-t px-4 py-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                        <form
                                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                            className="flex items-center gap-2"
                                            autoComplete="off"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Type your message..."
                                                className={`flex-1 rounded-lg px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-green-500/50 ${
                                                    isDark
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                                                }`}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                autoFocus
                                                maxLength={500}
                                                disabled={isBotTyping}
                                            />
                                            <button
                                                type="submit"
                                                className="bg-green-600 text-white rounded-lg px-5 py-2.5 hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                disabled={isBotTyping || !message.trim()}
                                            >
                                                <span>Send</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced FAQ View with Categories */}
                            {currentView === 'faq' && (
                                <div className="h-full overflow-y-auto p-6">
                                    <div className="max-w-4xl mx-auto">
                                        
                                        {faqsLoading ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                                                <span className={`ml-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading FAQs...</span>
                                            </div>
                                        ) : faqsError ? (
                                            <div className="text-center py-12">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-red-900/20' : 'bg-red-100'}`}>
                                                    <svg className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                </div>
                                                <h3 className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Error Loading FAQs</h3>
                                                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{faqsError}</p>
                                                <button
                                                    onClick={loadFAQCategories}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                >
                                                    Try Again
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Category Filter Buttons */}
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    <button
                                                        onClick={() => setSelectedCategoryId(null)}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                            selectedCategoryId === null
                                                                ? 'bg-green-600 text-white'
                                                                : isDark
                                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        All ({faqs.length})
                                                    </button>
                                                    {categories.map((category) => {
                                                        const categoryFAQCount = faqs.filter(faq => faq.categoryId === category.id).length;
                                                        return (
                                                            <button
                                                                key={category.id}
                                                                onClick={() => setSelectedCategoryId(category.id)}
                                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                                    selectedCategoryId === category.id
                                                                        ? 'bg-green-600 text-white'
                                                                        : isDark
                                                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                            >
                                                                {category.name} ({categoryFAQCount})
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* FAQ List */}
                                                {getFilteredFAQs().length === 0 ? (
                                                    <div className="text-center py-12">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                            <svg className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <h3 className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No FAQs Available</h3>
                                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {selectedCategoryId
                                                                ? `No FAQs found in ${categories.find(c => c.id === selectedCategoryId)?.name || 'this category'}.`
                                                                : 'No FAQs have been added yet.'
                                                            }
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {getFilteredFAQs().map((faq) => {
                                                            const isExpanded = expandedFAQs.has(faq.id);
                                                            
                                                            return (
                                                                <div key={faq.id} className={`border rounded-lg overflow-hidden ${
                                                                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                                                                }`}>
                                                                    <button
                                                                        onClick={() => toggleFAQExpansion(faq.id)}
                                                                        className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-opacity-80 transition-colors ${
                                                                            isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
                                                                        }`}
                                                                    >
                                                                        <div className="flex-1 pr-4">
                                                                            <h3 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                                                {faq.question}
                                                                            </h3>
                                                                        </div>
                                                                        <svg 
                                                                            className={`w-5 h-5 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''} ${
                                                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                                                            }`} 
                                                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                                        >
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                        </svg>
                                                                    </button>
                                                                    
                                                                    {isExpanded && (
                                                                        <div className={`px-4 py-3 border-t ${
                                                                            isDark ? 'border-gray-600 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                                                                        }`}>
                                                                            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                                {faq.answer}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Enhanced My Inquiries View */}
                            {currentView === 'inquiries' && (
                                <div className="h-full overflow-y-auto p-6">
                                    <div className="max-w-4xl mx-auto">
                                        {userInquiries.length === 0 ? (
                                            <div className="text-center py-16">
                                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                                                }`}>
                                                    <svg className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No support tickets yet</h3>
                                                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>You haven't submitted any support tickets</p>
                                                <button
                                                    onClick={() => setCurrentView('chat')}
                                                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                >
                                                    Start a Conversation
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {userInquiries.map((inquiry) => (
                                                    <div key={inquiry.id} className={`border rounded-lg p-4 ${
                                                        isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                                                    }`}>
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex-1">
                                                                <h3 className={`font-semibold text-base mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                                    {inquiry.subject}
                                                                </h3>
                                                                <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                    {inquiry.message}
                                                                </p>
                                                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(inquiry.category)}`}>
                                                                        {inquiry.category}
                                                                    </span>
                                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                                                                        {inquiry.priority}
                                                                    </span>
                                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                                                        {inquiry.status}
                                                                    </span>
                                                                </div>
                                                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                                    Created: {inquiry.createdAt}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setSelectedInquiry(inquiry)}
                                                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                                            >
                                                                View Details
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setCurrentInquiry(inquiry);
                                                                    setCurrentView('chat');
                                                                }}
                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                                    isDark 
                                                                        ? 'bg-gray-600 text-white hover:bg-gray-500'
                                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                            >
                                                                Continue
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
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999999] p-4" onClick={() => setSelectedInquiry(null)}>
                    <div className={`rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`} onClick={e => e.stopPropagation()}>
                        <div className={`px-6 py-4 flex items-center justify-between border-b ${
                            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    isDark ? 'bg-green-900/30' : 'bg-green-100'
                                }`}>
                                    <svg className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedInquiry.subject}
                                    </h3>
                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ticket Conversation</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className={`p-2 rounded-lg transition-colors ${
                                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                }`}
                            >
                                <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-4">
                                {selectedInquiry.replies.map((reply, index) => (
                                    <div key={index} className={`flex gap-2 ${reply.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-lg ${
                                            reply.from === 'user'
                                                ? 'bg-green-600 text-white'
                                                : isDark
                                                    ? 'bg-gray-700 text-gray-100'
                                                    : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            <p className="text-sm leading-relaxed">{reply.message}</p>
                                            <div className={`flex items-center justify-between mt-2 text-xs ${
                                                reply.from === 'user' ? 'text-green-100' : isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                <span>{reply.time}</span>
                                                {reply.responder && <span>- {reply.responder}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className={`border-t px-6 py-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
