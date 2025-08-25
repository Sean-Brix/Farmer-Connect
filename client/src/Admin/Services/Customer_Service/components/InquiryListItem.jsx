import React from 'react';

const InquiryListItem = ({ chat, isSelected, onClick, getUserName, getLastMessage }) => {
  return (
    <div
      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
        isSelected ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
      }`}
      onClick={() => onClick(chat)}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            {getUserName(chat).charAt(0).toUpperCase()}
          </div>
          <div className={`w-3 h-3 rounded-full -mt-2 ml-9 border-2 border-white ${
            chat.isOnline ? 'bg-green-400' : 'bg-gray-400'
          }`}></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-gray-900 truncate">{getUserName(chat)}</h4>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-500">
                {chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                chat.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                chat.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                chat.status === 'WAITING_USER' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {chat.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-1 truncate">{chat.subject}</p>
          <p className="text-sm text-gray-500 mt-1 truncate">{getLastMessage(chat)}</p>
        </div>
      </div>
    </div>
  );
};

export default InquiryListItem;
