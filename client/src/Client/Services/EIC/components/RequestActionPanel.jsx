import React from 'react';
import { getNextStepGuidance, getAvailableActions } from '../utils/statusHelpers';
import { getDaysRemaining, isOverdue } from '../utils/dateHelpers';

/**
 * RequestActionPanel Component
 * Shows status-specific guidance and action buttons
 */
const RequestActionPanel = ({ 
  request, 
  onCancel, 
  onConfirmPickup = null, 
  onConfirmReturn = null, 
  onRequestExtension = null,
  isDark = false 
}) => {
  const guidance = getNextStepGuidance(request);
  const availableActions = getAvailableActions(
    request.status, 
    request.actual_pickup, 
    request.actual_return
  );

  // Calculate days remaining for deadlines (uses guidance.deadline which could be pickup or return date)
  const daysRemaining = guidance.deadline ? getDaysRemaining(guidance.deadline) : null;
  const isDeadlineOverdue = guidance.deadline ? isOverdue(guidance.deadline) : false;

  if (!guidance) return null;

  // Determine panel color based on urgency
  const getPanelStyle = () => {
    if (guidance.isUrgent || isDeadlineOverdue) {
      return isDark 
        ? 'bg-red-900/20 border-red-500/50' 
        : 'bg-red-50 border-red-300';
    }
    if (request.status === 'Approved') {
      return isDark 
        ? 'bg-green-900/20 border-green-500/50' 
        : 'bg-green-50 border-green-300';
    }
    if (request.status === 'Pending') {
      return isDark 
        ? 'bg-yellow-900/20 border-yellow-500/50' 
        : 'bg-yellow-50 border-yellow-300';
    }
    return isDark 
      ? 'bg-gray-800 border-gray-600' 
      : 'bg-gray-50 border-gray-300';
  };

  const getTextColor = () => {
    return isDark ? 'text-gray-200' : 'text-gray-800';
  };

  const getSubtextColor = () => {
    return isDark ? 'text-gray-400' : 'text-gray-600';
  };

  return (
    <div className={`${getPanelStyle()} border-2 rounded-xl p-4 space-y-3`}>
      {/* Title with Icon */}
      <div className="flex items-start gap-3">
        <div className={`${guidance.isUrgent ? 'text-red-600' : 'text-green-600'} text-2xl mt-0.5`}>
          <i className="fa-solid fa-info-circle"></i>
        </div>
        <div className="flex-1">
          <h4 className={`font-bold text-base ${getTextColor()}`}>
            {guidance.title}
          </h4>
          <p className={`text-sm mt-1 ${getSubtextColor()}`}>
            {guidance.instructions}
          </p>
        </div>
      </div>

      {/* Deadline Display */}
      {guidance.deadline && (
        <div className={`text-sm ${getSubtextColor()} flex items-center gap-2`}>
          <i className="fa-solid fa-calendar-clock"></i>
          <span>
            <strong>Deadline:</strong> {new Date(guidance.deadline).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
            {daysRemaining !== null && daysRemaining >= 0 && (
              <span className={`ml-2 ${daysRemaining <= 3 ? 'text-red-600 font-bold' : ''}`}>
                ({daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining)
              </span>
            )}
            {isDeadlineOverdue && (
              <span className="ml-2 text-red-600 font-bold">
                (OVERDUE by {Math.abs(daysRemaining)} day{Math.abs(daysRemaining) !== 1 ? 's' : ''})
              </span>
            )}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      {availableActions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {availableActions.map((action) => {
            let buttonClass = 'px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200';
            let onClick = null;

            switch (action) {
              case 'cancel':
                if (!onCancel) return null;
                buttonClass += isDark
                  ? ' bg-red-600 hover:bg-red-700 text-white'
                  : ' bg-red-500 hover:bg-red-600 text-white';
                onClick = onCancel;
                break;
              case 'confirm_pickup':
                if (!onConfirmPickup) return null;
                buttonClass += isDark
                  ? ' bg-green-600 hover:bg-green-700 text-white'
                  : ' bg-green-500 hover:bg-green-600 text-white';
                onClick = onConfirmPickup;
                break;
              case 'confirm_return':
                if (!onConfirmReturn) return null;
                buttonClass += isDark
                  ? ' bg-blue-600 hover:bg-blue-700 text-white'
                  : ' bg-blue-500 hover:bg-blue-600 text-white';
                onClick = onConfirmReturn;
                break;
              case 'request_extension':
                if (!onRequestExtension) return null;
                buttonClass += isDark
                  ? ' bg-yellow-600 hover:bg-yellow-700 text-white'
                  : ' bg-yellow-500 hover:bg-yellow-600 text-white';
                onClick = onRequestExtension;
                break;
              default:
                return null;
            }

            return (
              <button
                key={action}
                onClick={onClick}
                className={buttonClass}
              >
                <i className={`fa-solid ${
                  action === 'cancel' ? 'fa-ban' :
                  action === 'confirm_pickup' ? 'fa-box' :
                  action === 'confirm_return' ? 'fa-check-circle' :
                  'fa-clock'
                } mr-2`}></i>
                {action === 'cancel' ? 'Cancel Request' :
                 action === 'confirm_pickup' ? 'Confirm Pickup' :
                 action === 'confirm_return' ? 'Mark as Returned' :
                 'Request Extension'}
              </button>
            );
          })}
        </div>
      )}

      {/* Contact Info for Approved Status */}
      {request.status === 'Approved' && (
        <div className={`text-xs ${getSubtextColor()} pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <i className="fa-solid fa-phone mr-1"></i>
          Need help? Contact the admin for pickup arrangements.
        </div>
      )}
    </div>
  );
};

export default RequestActionPanel;
