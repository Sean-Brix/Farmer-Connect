import React from 'react';

const DashboardStats = ({ activeChats }) => {
  const pendingCount = activeChats.filter(chat => chat.status === 'PENDING').length;
  const inProgressCount = activeChats.filter(chat => chat.status === 'IN_PROGRESS').length;
  const totalMessages = activeChats.reduce((total, chat) => total + (chat.replies ? chat.replies.length : 0) + 1, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Active Chats</p>
            <p className="text-3xl font-bold text-gray-900">{activeChats.length}</p>
          </div>
          <div className="bg-green-100 rounded-full p-3 shadow-md">
            <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Pending</p>
            <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
          </div>
          <div className="bg-red-100 rounded-full p-3 shadow-md">
            <svg className="w-6 h-6 text-red-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Total Messages</p>
            <p className="text-3xl font-bold text-gray-900">{totalMessages}</p>
          </div>
          <div className="bg-gray-800 rounded-full p-3 shadow-md">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
