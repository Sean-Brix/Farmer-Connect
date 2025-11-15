import React from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';

const DashboardStats = ({ pending = [], inProgress = [], resolved = [] }) => {
  const { isDark } = useTheme();
  const pendingCount = pending.length;
  const inProgressCount = inProgress.length;
  const resolvedCount = resolved.length;
  const totalChats = pendingCount + inProgressCount + resolvedCount;
  const totalMessages = [...pending, ...inProgress, ...resolved].reduce((total, chat) => 
    total + (chat.messages ? chat.messages.length : 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 mt-8">
      <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg shadow-sm ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div>
          <p className={`text-xs font-semibold mb-0.5 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Total Chats</p>
          <p className={`text-lg font-bold ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>{totalChats}</p>
        </div>
        <div className={`rounded-full p-1 ${
          isDark ? 'bg-green-900' : 'bg-green-100'
        }`}>
          <svg className={`w-4 h-4 ${
            isDark ? 'text-green-400' : 'text-green-700'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg shadow-sm ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div>
          <p className={`text-xs font-semibold mb-0.5 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Pending</p>
          <p className={`text-lg font-bold ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>{pendingCount}</p>
        </div>
        <div className={`rounded-full p-1 ${
          isDark ? 'bg-red-900' : 'bg-red-100'
        }`}>
          <svg className={`w-4 h-4 ${
            isDark ? 'text-red-400' : 'text-red-700'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg shadow-sm ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div>
          <p className={`text-xs font-semibold mb-0.5 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>In Progress</p>
          <p className={`text-lg font-bold ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>{inProgressCount}</p>
        </div>
        <div className={`rounded-full p-1 ${
          isDark ? 'bg-blue-900' : 'bg-blue-100'
        }`}>
          <svg className={`w-4 h-4 ${
            isDark ? 'text-blue-400' : 'text-blue-700'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg shadow-sm ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div>
          <p className={`text-xs font-semibold mb-0.5 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Resolved</p>
          <p className={`text-lg font-bold ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>{resolvedCount}</p>
        </div>
        <div className={`rounded-full p-1 ${
          isDark ? 'bg-green-900' : 'bg-green-100'
        }`}>
          <svg className={`w-4 h-4 ${
            isDark ? 'text-green-400' : 'text-green-700'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
