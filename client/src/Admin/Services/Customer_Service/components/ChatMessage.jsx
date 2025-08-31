import React from 'react';

const ChatMessage = ({ message, getUserName, chat, userName, isInitialMessage = false }) => {
  const isAdmin = message.senderType === 'ADMIN';
  const isUser = message.senderType === 'USER' || isInitialMessage;
  
  // Get the user name from either userName prop or getUserName function
  const displayName = userName || (getUserName && chat ? getUserName(chat) : 'Unknown User');

  return (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} items-end gap-2`}>
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
            {displayName && displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
      
      <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
          isAdmin
            ? 'bg-green-600 text-white rounded-br-md'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
        }`}>
          <p>{message.message}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-2">
          {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      {isAdmin && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm">
            A
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
