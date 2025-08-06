import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../Client/Components/Navbar.jsx'
import botAvatar from '../../Assets/default_picture.png';
import userAvatar from '../../Assets/eic_default.png';

export default function Chat() {
    const [open, setOpen] = useState(false);
    // State for chat input and messages
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hello! 👋 How can I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { from: 'user', text: 'This is your chat modal. Add your chat module here.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
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
            <div className="fixed bottom-10 right-10 z-50 group">
                <button
                    onClick={() => setOpen(true)}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-2xl flex items-center justify-center text-3xl cursor-pointer hover:scale-105 transition-transform relative border-4 border-white/80 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    aria-label="Open Chat"
                >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.2"/>
                        <path d="M12 3C7.03 3 3 6.58 3 11c0 2.09 1.02 3.97 2.7 5.36L5 21l4.09-2.18c.62.13 1.27.18 1.91.18 4.97 0 9-3.58 9-8s-4.03-8-9-8zm-1 10h-2v-2h2v2zm4 0h-2v-2h2v2z" fill="#fff"/>
                    </svg>
                    <span className="absolute left-1/2 -translate-x-1/2 -top-14 bg-white text-blue-700 font-bold px-6 py-2 rounded-xl shadow-lg border border-blue-100 opacity-0 group-hover:opacity-100 transition-all duration-200 text-base pointer-events-none whitespace-nowrap">Chat with us!</span>
                </button>
            </div>
            {/* Chat Modal */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-all"
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
                        {/* Close Button (X icon) */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-white/90 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-full p-2 text-xl cursor-pointer shadow transition flex items-center justify-center z-10 border border-blue-200"
                            aria-label="Close Chat"
                            style={{ lineHeight: 0 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {/* Header */}
                        <div className="flex items-center gap-3 px-6 pt-7 pb-3 border-b border-blue-200 bg-white/90 backdrop-blur-md rounded-t-2xl">
                            <img src={botAvatar} alt="Bot Avatar" className="w-12 h-12 rounded-full border-2 border-blue-200 shadow" />
                            <div>
                                <h3 className="text-lg font-bold text-blue-800 tracking-tight">FITS-tanza Chatbot</h3>
                                <div className="text-xs text-blue-500 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span>Online</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Ask me anything about seminars, accounts, or FITS-tanza services!</div>
                            </div>
                        </div>
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 bg-gradient-to-br from-white via-blue-50 to-indigo-100">
                            <div className="flex flex-col gap-3">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} items-end`}
                                    >
                                        {msg.from === 'bot' && (
                                            <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full border border-blue-200 shadow mr-2" />
                                        )}
                                        <div className="flex flex-col items-end max-w-[75%]">
                                            <div
                                                className={`px-4 py-2 rounded-2xl shadow text-sm font-medium
                                                    ${msg.from === 'user'
                                                        ? 'bg-gradient-to-tr from-blue-700 to-blue-900 text-white rounded-br-none border border-blue-700'
                                                        : 'bg-white text-blue-900 rounded-bl-none border border-blue-200'
                                                    }`}
                                                style={{ wordBreak: 'break-word', boxShadow: msg.from === 'user' ? '0 2px 8px #2563eb22' : '0 2px 8px #2563eb11' }}
                                                dangerouslySetInnerHTML={msg.from === 'bot' ? { __html: msg.text } : undefined}
                                            >
                                                {msg.from === 'user' ? msg.text : null}
                                            </div>
                                            <span className={`text-[10px] mt-1 ${msg.from === 'user' ? 'text-blue-200' : 'text-blue-500'}`}>{msg.time}</span>
                                        </div>
                                        {msg.from === 'user' && (
                                            <img src={userAvatar} alt="You" className="w-8 h-8 rounded-full border border-blue-200 shadow ml-2" />
                                        )}
                                    </div>
                                ))}
                                {isBotTyping && (
                                    <div className="flex justify-start items-end">
                                        <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full border border-blue-200 shadow mr-2" />
                                        <div className="px-4 py-2 rounded-2xl shadow text-sm bg-white text-blue-900 rounded-bl-none border border-blue-200 flex items-center gap-2">
                                            <span className="dot-flashing"></span>
                                            <span>Typing...</span>
                                        </div>
                                        <style>{`
                                            .dot-flashing {
                                                position: relative;
                                                width: 8px;
                                                height: 8px;
                                                border-radius: 5px;
                                                background-color: #2563eb;
                                                color: #2563eb;
                                                animation: dotFlashing 1s infinite linear alternate;
                                                margin-right: 6px;
                                            }
                                            @keyframes dotFlashing {
                                                0% { opacity: 1; }
                                                50%, 100% { opacity: 0.3; }
                                            }
                                        `}</style>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        {/* Input Area */}
                        <form
                            className="flex items-center gap-2 px-4 py-4 sm:px-5 sm:py-4 border-t border-blue-200 bg-white/90 backdrop-blur-md rounded-b-2xl"
                            onSubmit={handleSend}
                            autoComplete="off"
                        >
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 rounded-full px-4 py-2 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow text-sm"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                autoFocus
                                maxLength={300}
                                aria-label="Type your message"
                                disabled={isBotTyping}
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-full px-5 py-2 font-semibold shadow hover:scale-105 transition-transform text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={isBotTyping || !message.trim()}
                                aria-label="Send message"
                            >
                                {isBotTyping ? '...' : 'Send'}
                            </button>
                        </form>
                        {/* Bot Details Footer */}
                        <div className="hidden sm:flex items-center justify-between px-6 py-2 text-xs text-blue-400 bg-transparent border-t border-blue-100 mt-auto">
                            <span className="flex items-center gap-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#2563eb" opacity="0.1"/><path d="M12 3C7.03 3 3 6.58 3 11c0 2.09 1.02 3.97 2.7 5.36L5 21l4.09-2.18c.62.13 1.27.18 1.91.18 4.97 0 9-3.58 9-8s-4.03-8-9-8zm-1 10h-2v-2h2v2zm4 0h-2v-2h2v2z" fill="#2563eb"/></svg> Powered by FITS-tanza AI</span>
                            <span>v1.0</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}