import React, { useState } from 'react';
import Navbar from '../../Client/Components/Navbar.jsx'

export default function Chat() {
    const [open, setOpen] = useState(false);
    // State for chat input and messages
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hello! How can I help you today?' },
        { from: 'user', text: 'This is your chat modal. Add your chat module here.' }
    ]);

    // Handle sending a message
    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        setMessages([...messages, { from: 'user', text: message }]);
        setMessage('');
        // Optionally, add bot response logic here
    };

    return (
        <>
            
            /* Floating Chat Icon with Modern Tooltip */
            <div className="fixed bottom-8 right-8 z-50 group">
                <button
                    onClick={() => setOpen(true)}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-2xl flex items-center justify-center text-xl cursor-pointer hover:scale-105 transition-transform relative"
                    aria-label="Open Chat"
                >
                   
                    {/* Modern Tooltip - now floats to the left of the icon */}
                    <div className="absolute left-[-220px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200">
                        <div className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-xl shadow-lg border border-blue-100 flex items-center gap-2 animate-fade-in-down">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 10c0-3.314-2.686-6-6-6S6 6.686 6 10c0 2.386 1.676 4.434 4 4.899V18h4v-3.101c2.324-.465 4-2.513 4-4.899z" />
                            </svg> {/* Waving Hand on Hover */}
                    <span
                        className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                        style={{ zIndex: 2 }}
                    >
                        <span
                            className="inline-block text-3xl"
                            role="img"
                            aria-label="Waving Hand"
                            style={{
                                display: 'inline-block',
                                transformOrigin: '70% 70%',
                                animation: 'wave-hand 1.2s infinite'
                            }}
                        >
                            👋
                        </span>
                        {/* Keyframes for waving hand */}
                        <style>
                            {`
                            @keyframes wave-hand {
                                0% { transform: rotate(0deg); }
                                10% { transform: rotate(14deg); }
                                20% { transform: rotate(-8deg); }
                                30% { transform: rotate(14deg); }
                                40% { transform: rotate(-4deg); }
                                50% { transform: rotate(10deg); }
                                60% { transform: rotate(0deg); }
                                100% { transform: rotate(0deg); }
                            }
                            `}
                        </style>
                    </span>
                            Customer Service
                        </div>
                        <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-t border-r border-blue-100 rotate-45"></div>
                    </div>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.2"/>
                        <path d="M12 3C7.03 3 3 6.58 3 11c0 2.09 1.02 3.97 2.7 5.36L5 21l4.09-2.18c.62.13 1.27.18 1.91.18 4.97 0 9-3.58 9-8s-4.03-8-9-8zm-1 10h-2v-2h2v2zm4 0h-2v-2h2v2z" fill="#fff"/>
                    </svg>
                </button>
            </div>
            {/* Chat Modal */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-all"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="relative w-full h-full max-w-none max-h-none bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-none shadow-none flex flex-col
                        sm:rounded-2xl sm:shadow-2xl sm:w-[98vw] sm:h-[92vh] md:w-[700px] md:h-[700px] md:max-w-[98vw] md:max-h-[95vh] transition-all"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close Button (X icon) */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-white/80 hover:bg-white text-gray-700 hover:text-blue-600 rounded-full p-2 text-2xl cursor-pointer shadow transition flex items-center justify-center z-10"
                            aria-label="Close Chat"
                            style={{ lineHeight: 0 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {/* Header */}
                        <div className="flex items-center gap-3 px-6 pt-8 pb-4 border-b border-gray-200 bg-white/80 backdrop-blur-md rounded-t-2xl">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-300 flex items-center justify-center text-white text-2xl font-bold shadow">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.2"/>
                                    <path d="M12 3C7.03 3 3 6.58 3 11c0 2.09 1.02 3.97 2.7 5.36L5 21l4.09-2.18c.62.13 1.27.18 1.91.18 4.97 0 9-3.58 9-8s-4.03-8-9-8zm-1 10h-2v-2h2v2zm4 0h-2v-2h2v2z" fill="#2563eb"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">FITS-tanza Chatbot</h3>
                                <div className="text-xs text-blue-500 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Online
                                </div>
                            </div>
                        </div>
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 bg-gradient-to-br from-white via-blue-50 to-indigo-100">
                            <div className="flex flex-col gap-4">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.from === 'bot' && (
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-300 flex items-center justify-center text-white text-lg font-bold shadow mr-2">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.2"/>
                                                    <path d="M12 3C7.03 3 3 6.58 3 11c0 2.09 1.02 3.97 2.7 5.36L5 21l4.09-2.18c.62.13 1.27.18 1.91.18 4.97 0 9-3.58 9-8s-4.03-8-9-8zm-1 10h-2v-2h2v2zm4 0h-2v-2h2v2z" fill="#2563eb"/>
                                                </svg>
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[75%] px-4 py-2 rounded-2xl shadow text-sm
                                                ${msg.from === 'user'
                                                    ? 'bg-gradient-to-tr from-blue-700 to-blue-900 text-white rounded-br-none'
                                                    : 'bg-blue-100 text-blue-900 rounded-bl-none border border-blue-100'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                        {msg.from === 'user' && (
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold shadow ml-2">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="12" fill="#2563eb" opacity="0.1"/>
                                                    <path d="M12 3C7.03 3 3 6.58 3 11c0 2.09 1.02 3.97 2.7 5.36L5 21l4.09-2.18c.62.13 1.27.18 1.91.18 4.97 0 9-3.58 9-8s-4.03-8-9-8zm-1 10h-2v-2h2v2zm4 0h-2v-2h2v2z" fill="#2563eb"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Input Area */}
                        <form
                            className="flex items-center gap-2 px-4 py-4 sm:px-6 sm:py-4 border-t border-gray-200 bg-white/80 backdrop-blur-md rounded-b-2xl"
                            onSubmit={handleSend}
                        >
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow text-sm"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-full px-5 py-2 font-semibold shadow hover:scale-105 transition-transform text-sm"
                            >
                                Send
                            </button>
                        </form>
                        {/* Bot Details Footer */}
                        <div className="hidden sm:flex items-center justify-between px-6 py-2 text-xs text-gray-400 bg-transparent">
                            <span>Powered by FITS-tanza AI</span>
                            <span>v1.0</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}