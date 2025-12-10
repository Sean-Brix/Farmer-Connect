import React from 'react';

/**
 * ActiveRequestCounter Component
 * Displays user's active request count vs limit
 */
const ActiveRequestCounter = ({ count, limit }) => {
  if (count === undefined || limit === undefined) {
    return null;
  }

  const isNearLimit = count >= limit - 1;
  const isAtLimit = count >= limit;
  const percentage = (count / limit) * 100;

  const getColorClasses = () => {
    if (isAtLimit) return {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      progress: 'bg-red-500',
      icon: 'text-red-600'
    };
    if (isNearLimit) return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      progress: 'bg-yellow-500',
      icon: 'text-yellow-600'
    };
    return {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      progress: 'bg-green-500',
      icon: 'text-green-600'
    };
  };

  const colors = getColorClasses();

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${colors.bg} ${colors.border} ${colors.text}`}>
      <i className={`fa-solid fa-list-check ${colors.icon}`}></i>
      
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-sm">
          Active Requests: {count}/{limit}
        </span>
        
        {/* Mini progress bar */}
        <div className="w-24 bg-white/50 rounded-full h-1.5 overflow-hidden">
          <div
            className={`${colors.progress} h-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {isAtLimit && (
        <span className="text-xs font-medium ml-2 px-2 py-0.5 bg-red-200 rounded">
          Max Reached
        </span>
      )}
    </div>
  );
};

export default ActiveRequestCounter;
