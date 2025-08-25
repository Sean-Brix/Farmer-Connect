import React, { useState } from 'react';

const MessageInput = ({ onSendMessage, selectedChat }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;
    
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type your reply..."
            className="w-full rounded-2xl px-5 py-3 pr-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 bg-gray-50 focus:bg-white text-sm transition-all duration-200 placeholder-gray-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            disabled={!selectedChat}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
            {(message || '').length}/500
          </div>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl px-6 py-3 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
          disabled={!message?.trim() || !selectedChat}
        >
          <span>Send</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
