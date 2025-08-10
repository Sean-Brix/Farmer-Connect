import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../Client/Components/Navbar.jsx'
import botAvatar from '../../Assets/default_picture.png';
import userAvatar from '../../Assets/eic_default.png';

export default function Chat() {
    const [open, setOpen] = useState(false);
    // State for chat input and messages
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Welcome to FITS-Tanza Support! 🌟 I\'m here to assist you with seminars, account management, and general inquiries. How may I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Handle sending a message

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        const userMsg = { from: 'user', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        setMessage('');
        setIsBotTyping(true);
        setTimeout(() => {
            const botReply = getBotReply(message);
            setMessages(prev => [...prev, { from: 'bot', text: botReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            setIsBotTyping(false);
        }, 1200);
    };

    // Simple bot reply logic (expand as needed)
    function getBotReply(userMsg) {
        const lower = userMsg.toLowerCase();
        if (lower.includes('hello') || lower.includes('hi')) return 'Hi there! 😊 How can I assist you today?';
        if (lower.includes('help')) return 'Of course! Please tell me more about what you need help with.';
        if (lower.includes('seminar')) return 'You can view upcoming seminars in the Seminar section. Would you like a direct link?';
        if (lower.includes('contact')) return 'You can contact us at <b>fits-tanza@email.com</b> or call <b>123-456-7890</b>.';
        if (lower.includes('thank')) return 'You’re welcome! If you have more questions, just ask anytime.';
        if (lower.includes('account')) return 'For account concerns, please visit your profile or contact our support.';
        return 'I’m here to help! Could you please provide more details or specify your concern?';
    }

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isBotTyping]);

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
                        {/* Simple Green Header */}
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
                        </div>
                        
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 custom-scrollbar">
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
                            className="flex items-center gap-2 px-4 py-4 border-t border-gray-200 bg-white rounded-b-2xl"
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
                        {/* Footer */}
                        <div className="flex items-center justify-center px-4 py-2 text-xs text-gray-400 bg-white rounded-b-2xl">
                            <span>Powered by FITS-Tanza</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}