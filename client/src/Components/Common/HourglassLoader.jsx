import React from 'react';
import './HourglassLoader.css';

const HourglassLoader = ({ size = 'medium', text = 'Loading...' }) => {
  // Size variants
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-20 h-20', 
    large: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <svg className="loader" viewBox="0 0 52 52" fill="none">
          <g className="loader__model">
            {/* Hourglass Frame */}
            <path d="M3.25 4C3.25 3.31 3.81 2.75 4.5 2.75H20.5C21.19 2.75 21.75 3.31 21.75 4V8.5L15.375 15.375C14.75 16 14.75 17 15.375 17.625L21.75 24V28.5C21.75 29.19 21.19 29.75 20.5 29.75H4.5C3.81 29.75 3.25 29.19 3.25 28.5V24L9.625 17.625C10.25 17 10.25 16 9.625 15.375L3.25 8.5V4Z" stroke="#E5E7EB" strokeWidth="2" fill="none"/>
            
            {/* Glass effects */}
            <path className="loader__glare-top" d="M5 5L8 8" stroke="white" strokeWidth="1" strokeLinecap="round"/>
            <path className="loader__glare-bottom" d="M5 27L8 24" stroke="rgba(255,255,255,0)" strokeWidth="1" strokeLinecap="round"/>
            
            {/* Motion lines */}
            <circle className="loader__motion-thick" cx="26" cy="26" r="12" fill="none" stroke="rgba(255,255,255,0)" strokeWidth="2" strokeDasharray="12 6"/>
            <circle className="loader__motion-medium" cx="26" cy="26" r="16" fill="none" stroke="rgba(255,255,255,0)" strokeWidth="1.5" strokeDasharray="8 4"/>
            <circle className="loader__motion-thin" cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0)" strokeWidth="1" strokeDasharray="6 3"/>
            
            {/* Sand elements */}
            <path className="loader__sand-drop" d="M12.5 7L12.5 16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 1"/>
            <path className="loader__sand-fill" d="M5 25L20 25" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 1"/>
            
            {/* Sand grains */}
            <circle className="loader__sand-grain-left" cx="8" cy="23" r="1" fill="#F59E0B" strokeDasharray="1 1"/>
            <circle className="loader__sand-grain-right" cx="17" cy="23" r="1" fill="#F59E0B" strokeDasharray="1 1"/>
            
            {/* Sand lines */}
            <path className="loader__sand-line-left" d="M6 21L10 21" stroke="#F59E0B" strokeWidth="1" strokeDasharray="1 1"/>
            <path className="loader__sand-line-right" d="M15 21L19 21" stroke="#F59E0B" strokeWidth="1" strokeDasharray="1 1"/>
            
            {/* Sand mounds */}
            <ellipse className="loader__sand-mound-top" cx="12.5" cy="16" rx="3" ry="1" fill="#F59E0B"/>
            <ellipse className="loader__sand-mound-bottom" cx="12.5" cy="25" rx="6" ry="2" fill="#F59E0B"/>
          </g>
        </svg>
      </div>
      {text && (
        <span className="text-sm font-medium text-white">
          {text}
        </span>
      )}
    </div>
  );
};

export default HourglassLoader;
