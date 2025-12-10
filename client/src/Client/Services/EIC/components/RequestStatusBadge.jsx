import React from 'react';
import { getStatusConfig } from '../utils/statusHelpers';

/**
 * RequestStatusBadge Component
 * Enhanced status badge with icons, colors, tooltips, and animations
 */
const RequestStatusBadge = ({ status, showIcon = true, showLabel = true, size = 'md', pulse = false }) => {
  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base'
  };

  const iconSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full font-bold border ${config.bgClass} ${config.textClass} ${config.borderClass} ${sizeClasses[size]} ${pulse ? 'animate-pulse' : ''}`}
      title={config.label}
    >
      {showIcon && <i className={`fa-solid ${config.icon} ${iconSizeClasses[size]}`}></i>}
      {showLabel && config.label}
    </span>
  );
};

export default RequestStatusBadge;
