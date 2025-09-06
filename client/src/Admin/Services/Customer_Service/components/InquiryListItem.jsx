import React, { useMemo, useState } from 'react';

const InquiryListItem = ({ chat, isSelected, onClick, getUserName, getLastMessage }) => {
  const [imgError, setImgError] = useState(false);
  const userName = getUserName(chat);
  const avatarUrl = useMemo(() => (
    chat?.userId ? `/api/account/picture/${chat.userId}?t=${chat.updatedAt ? new Date(chat.updatedAt).getTime() : ''}` : ''
  ), [chat?.userId, chat?.updatedAt]);

  return (
    <div
      className={`p-5 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
        isSelected ? 'bg-green-50 border-r-4 border-r-green-600 shadow-sm' : ''
      }`}
      onClick={() => onClick(chat)}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 relative">
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              alt={userName}
              onError={() => setImgError(true)}
              className="w-14 h-14 rounded-full object-cover border shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {userName?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
            chat.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-semibold text-gray-900 truncate text-lg">{userName}</h4>
            <div className="flex flex-col items-end gap-1 ml-2">
              <span className="text-xs text-gray-500 font-medium">
                {chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                chat.status === 'RESOLVED' ? 'bg-gray-900 text-white' :
                chat.status === 'IN_PROGRESS' ? 'bg-green-600 text-white' :
                chat.status === 'WAITING_USER' ? 'bg-yellow-500 text-white' :
                'bg-red-600 text-white'
              }`}>
                {chat.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-800 mt-1 truncate font-medium">{chat.subject}</p>
          <p className="text-sm text-gray-600 mt-1 truncate">{getLastMessage(chat)}</p>
        </div>
      </div>
    </div>
  );
};

export default InquiryListItem;
