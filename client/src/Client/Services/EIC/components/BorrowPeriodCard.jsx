import React from 'react';
import { calculateDaysBetween, formatDate } from '../utils/dateHelpers';

/**
 * BorrowPeriodCard Component
 * Displays borrowing period summary
 */
const BorrowPeriodCard = ({ pickupDate, returnDate, dateLimit }) => {
  if (!pickupDate || !returnDate) {
    return null;
  }

  const borrowDays = calculateDaysBetween(pickupDate, returnDate);
  const exceedsLimit = dateLimit && borrowDays > dateLimit;

  return (
    <div className={`border rounded-lg p-4 ${exceedsLimit ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <i className={`fa-solid fa-calendar-days ${exceedsLimit ? 'text-red-600' : 'text-blue-600'}`}></i>
            <h4 className={`font-semibold text-sm ${exceedsLimit ? 'text-red-800' : 'text-blue-800'}`}>
              Borrowing Period
            </h4>
          </div>
          
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <i className="fa-solid fa-arrow-up text-xs text-gray-400 w-4"></i>
              <span className="font-medium">Pickup:</span>
              <span>{formatDate(pickupDate, 'MMM dd, yyyy')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-700">
              <i className="fa-solid fa-arrow-down text-xs text-gray-400 w-4"></i>
              <span className="font-medium">Return:</span>
              <span>{formatDate(returnDate, 'MMM dd, yyyy')}</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className={`text-2xl font-bold ${exceedsLimit ? 'text-red-700' : 'text-blue-700'}`}>
            {borrowDays}
          </div>
          <div className="text-xs text-gray-600">
            day{borrowDays !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {dateLimit && (
        <div className={`mt-3 pt-3 border-t ${exceedsLimit ? 'border-red-200' : 'border-blue-200'}`}>
          {exceedsLimit ? (
            <div className="flex items-start gap-2 text-xs text-red-700">
              <i className="fa-solid fa-triangle-exclamation mt-0.5"></i>
              <span>
                <strong>Exceeds limit!</strong> Maximum borrowing period is {dateLimit} day{dateLimit !== 1 ? 's' : ''}.
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Maximum: {dateLimit} day{dateLimit !== 1 ? 's' : ''}</span>
              <span className="text-green-600 font-medium">
                <i className="fa-solid fa-check mr-1"></i>
                Within limit
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BorrowPeriodCard;
