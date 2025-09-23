import React from 'react';

function LoadingSpinner({ message = 'Loading...', isDark = false }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center ${
      isDark ? 'bg-gray-800 border-gray-700' : ''
    }`}>
      <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-sm ${
        isDark ? 'bg-blue-900' : 'bg-blue-100'
      }`}>
        <div className={`w-10 h-10 border-4 border-t-4 rounded-full animate-spin ${
          isDark 
            ? 'border-blue-700 border-t-blue-400' 
            : 'border-blue-200 border-t-blue-600'
        }`}></div>
      </div>
      <p className={`text-xl font-semibold mb-2 ${
        isDark ? 'text-white' : 'text-gray-800'
      }`}>
        {message}
      </p>
      <p className={`text-sm ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}>
        Please wait while we fetch the data
      </p>
    </div>
  );
}

export default LoadingSpinner;