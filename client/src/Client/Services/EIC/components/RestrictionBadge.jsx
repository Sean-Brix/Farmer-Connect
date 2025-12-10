import React from 'react';

/**
 * RestrictionBadge Component
 * Displays item restrictions (max quantity, date limit)
 */
const RestrictionBadge = ({ type, value, icon, color = 'blue' }) => {
  if (!value && value !== 0) {
    return null;
  }

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
    red: 'bg-red-100 text-red-800 border-red-200'
  };

  const getLabel = () => {
    switch (type) {
      case 'max_quantity':
        return `Max ${value} per request`;
      case 'date_limit':
        return `Max ${value} day${value !== 1 ? 's' : ''}`;
      case 'available':
        return `${value} available`;
      case 'cooldown':
        return `${value} day cooldown`;
      default:
        return value;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${colorClasses[color]}`}>
      {icon && <i className={`fa-solid ${icon}`}></i>}
      {getLabel()}
    </span>
  );
};

export default RestrictionBadge;
