import React from 'react';
import { SLOT_THRESHOLDS } from '../utils/constants';
import { formatDate } from '../utils/dateHelpers';

/**
 * PickupSlotsIndicator Component
 * Displays available pickup slots for a selected date
 */
const PickupSlotsIndicator = ({ available, total, date, loading }) => {
  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  if (available === null || available === undefined) {
    return null;
  }

  const percentage = total > 0 ? (available / total) * 100 : 0;
  const isFull = available === SLOT_THRESHOLDS.FULL;
  const isLow = available > 0 && available <= SLOT_THRESHOLDS.LOW;

  const getStatusColor = () => {
    if (isFull) return {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      progress: 'bg-red-500'
    };
    if (isLow) return {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600',
      progress: 'bg-yellow-500'
    };
    return {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
      progress: 'bg-green-500'
    };
  };

  const colors = getStatusColor();

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 transition-all duration-200`}>
      <div className="flex items-start gap-3">
        <div className={`${colors.icon} mt-0.5`}>
          <i className={`fa-solid ${isFull ? 'fa-calendar-xmark' : 'fa-calendar-check'} text-xl`}></i>
        </div>
        
        <div className="flex-1">
          <p className={`font-semibold ${colors.text} text-sm mb-1`}>
            {isFull ? (
              'No slots available'
            ) : (
              <>
                {available} of {total} pickup slot{available !== 1 ? 's' : ''} available
              </>
            )}
          </p>
          
          {date && (
            <p className="text-xs text-gray-600">
              for {formatDate(date, 'EEEE, MMMM dd, yyyy')}
            </p>
          )}

          {/* Progress bar */}
          <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`${colors.progress} h-full transition-all duration-300 ease-in-out`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          {/* Warning messages */}
          {isFull && (
            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
              <i className="fa-solid fa-circle-exclamation"></i>
              Please select a different date
            </p>
          )}
          {isLow && (
            <p className="text-xs text-yellow-700 mt-2 flex items-center gap-1">
              <i className="fa-solid fa-triangle-exclamation"></i>
              Limited slots remaining - book soon!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickupSlotsIndicator;
