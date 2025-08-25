import React from 'react';
import ChatMessage from './ChatMessage.jsx';
import MessageInput from './MessageInput.jsx';

const ChatWindow = ({ selectedChat, messagesEndRef, getUserName, onSendMessage }) => {
  if (!selectedChat) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[700px] flex flex-col">
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-600 mb-1">Select a conversation</p>
            <p className="text-sm text-gray-400">Choose a chat from the list to start messaging</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[700px] flex flex-col">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                {getUserName(selectedChat).charAt(0).toUpperCase()}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                selectedChat.isOnline ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
            </div>
            <div>
              <h3 className="font-semibold">{getUserName(selectedChat)}</h3>
              <p className="text-green-100 text-sm">{selectedChat.userEmail}</p>
            </div>
          </div>
          <div className="text-green-100 text-sm">
            {selectedChat.isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="space-y-4">
          {/* Initial inquiry message */}
          <ChatMessage 
            message={{
              id: `initial-${selectedChat.id}`,
              message: selectedChat.message,
              createdAt: selectedChat.createdAt,
              senderType: 'USER'
            }}
            getUserName={getUserName}
            chat={selectedChat}
          />
          
          {/* Replies */}
          {selectedChat.replies && selectedChat.replies.map((reply) => (
            <ChatMessage 
              key={reply.id}
              message={reply}
              getUserName={getUserName}
              chat={selectedChat}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} selectedChat={selectedChat} />
    </div>
  );
};

export default ChatWindow;
