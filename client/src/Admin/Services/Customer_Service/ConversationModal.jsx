import React from 'react';
import ChatWindow from './components/ChatWindow.jsx';

const ConversationModal = ({ open, onClose, selectedChat, ...chatWindowProps }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-2xl mx-auto relative">
        <button
          className="absolute -top-3 -right-3 bg-white rounded-full shadow p-2 hover:bg-gray-100 focus:outline-none z-20"
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <ChatWindow selectedChat={selectedChat} {...chatWindowProps} />
      </div>
    </div>
  );
};

export default ConversationModal;
