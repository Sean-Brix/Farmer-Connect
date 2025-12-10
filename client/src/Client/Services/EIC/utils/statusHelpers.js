/**
 * EIC Status Configuration and Helper Functions
 * Provides status-specific colors, icons, labels, and guidance
 */

import { ARCHIVED_STATUSES } from '../../../../constants/eicStatuses';
import { differenceInDays } from 'date-fns';

/**
 * Get user-friendly status display for Client My Requests modal
 * Converts technical statuses to client-friendly labels
 */
export const getUserFriendlyStatus = (status, returnDate) => {
  // For Approved status - show "To Pickup"
  if (status === 'Approved') {
    return {
      label: 'TO PICKUP',
      color: 'green',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-700',
      borderClass: 'border-emerald-300',
      icon: 'fa-calendar-plus'
    };
  }
  
  // For Borrowed or late_pickup - show "On Hand"
  if (status === 'Borrowed' || status === 'late_pickup') {
    // Check if close to return date (within 3 days)
    if (returnDate) {
      const daysUntilReturn = differenceInDays(new Date(returnDate), new Date());
      if (daysUntilReturn >= 0 && daysUntilReturn <= 3) {
        return {
          label: 'TO RETURN',
          subLabel: `in ${daysUntilReturn} day${daysUntilReturn !== 1 ? 's' : ''}`,
          color: 'orange',
          bgClass: 'bg-orange-50',
          textClass: 'text-orange-700',
          borderClass: 'border-orange-300',
          icon: 'fa-calendar-minus'
        };
      }
    }
    
    return {
      label: 'ON HAND',
      color: 'blue',
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-700',
      borderClass: 'border-blue-300',
      icon: 'fa-hand-holding'
    };
  }
  
  // For Pending - show "Pending"
  if (status === 'Pending') {
    return {
      label: 'PENDING',
      color: 'yellow',
      bgClass: 'bg-yellow-50',
      textClass: 'text-yellow-700',
      borderClass: 'border-yellow-300',
      icon: 'fa-clock'
    };
  }
  
  // For archived statuses - use existing config
  return null; // Will fall back to getStatusConfig
};

/**
 * Get status configuration (color, icon, label)
 * Used for admin view and archived statuses
 */
export const getStatusConfig = (status) => {
  const configs = {
    Pending: {
      color: 'yellow',
      bgClass: 'bg-yellow-50',
      textClass: 'text-yellow-700',
      borderClass: 'border-yellow-300',
      icon: 'fa-clock',
      label: 'PENDING'
    },
    Approved: {
      color: 'green',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-700',
      borderClass: 'border-emerald-300',
      icon: 'fa-check-circle',
      label: 'APPROVED'
    },
    Borrowed: {
      color: 'blue',
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-700',
      borderClass: 'border-blue-300',
      icon: 'fa-hand-holding',
      label: 'BORROWED'
    },
    late_pickup: {
      color: 'orange',
      bgClass: 'bg-orange-50',
      textClass: 'text-orange-700',
      borderClass: 'border-orange-300',
      icon: 'fa-clock',
      label: 'LATE PICKUP'
    },
    Rejected: {
      color: 'red',
      bgClass: 'bg-red-50',
      textClass: 'text-red-700',
      borderClass: 'border-red-300',
      icon: 'fa-times-circle',
      label: 'REJECTED'
    },
    Returned: {
      color: 'gray',
      bgClass: 'bg-gray-50',
      textClass: 'text-gray-700',
      borderClass: 'border-gray-300',
      icon: 'fa-check-double',
      label: 'RETURNED'
    },
    late_return: {
      color: 'red',
      bgClass: 'bg-red-50',
      textClass: 'text-red-700',
      borderClass: 'border-red-300',
      icon: 'fa-exclamation-triangle',
      label: 'LATE RETURN'
    },
    No_Return: {
      color: 'red',
      bgClass: 'bg-red-50',
      textClass: 'text-red-700',
      borderClass: 'border-red-300',
      icon: 'fa-exclamation-circle',
      label: 'NOT RETURNED'
    },
    No_Pickup: {
      color: 'orange',
      bgClass: 'bg-orange-50',
      textClass: 'text-orange-700',
      borderClass: 'border-orange-300',
      icon: 'fa-calendar-times',
      label: 'NOT PICKED UP'
    },
    Cancelled: {
      color: 'gray',
      bgClass: 'bg-gray-50',
      textClass: 'text-gray-700',
      borderClass: 'border-gray-300',
      icon: 'fa-ban',
      label: 'CANCELLED'
    }
  };

  const config = configs[status] || {
    color: 'gray',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-800',
    borderClass: 'border-gray-200',
    icon: 'fa-question-circle',
    label: status || 'Unknown'
  };
  
  const testNum = status === 'Borrowed' ? '5.1' : status === 'late_pickup' ? '5.2' : '';
  if (testNum) {
    console.log(`\n${'='.repeat(60)}\n📋 TEST ${testNum}: STATUS DISPLAY - ${status.toUpperCase()}\n${'='.repeat(60)}\nStatus: ${status}\nColor: ${config.color}\nLabel: ${config.label}\nIcon: ${config.icon}\nBadge Class: ${config.bgClass} ${config.textClass}\n${'='.repeat(60)}\n✅ COPY THIS LOG TO CHECKLIST TEST ${testNum}\n${'='.repeat(60)}\n`);
  }
  return config;
};

/**
 * Get next step guidance for user based on request status
 */
export const getNextStepGuidance = (request) => {
  const { status, pickupDate, returnDate, actual_pickup, actual_return } = request;

  const guidance = {
    Pending: {
      title: 'Awaiting Admin Approval',
      instructions: 'Your request is being reviewed by the admin. You will be notified once it is approved or rejected.',
      action: null,
      deadline: null,
      isUrgent: false
    },
    Approved: {
      title: 'Ready for Pickup',
      instructions: `Please pick up your item on ${formatDate(pickupDate)} at the designated location. Contact the admin for specific pickup instructions.`,
      action: 'Confirm Pickup',
      deadline: pickupDate,
      isUrgent: isDateNear(pickupDate, 2)
    },
    Borrowed: {
      title: 'Item Borrowed',
      instructions: `Please return the item by ${formatDate(returnDate)}. Late returns may affect future borrowing privileges.`,
      action: 'Confirm Return',
      deadline: returnDate,
      isUrgent: isDateNear(returnDate, 1) || isOverdue(returnDate)
    },
    late_pickup: {
      title: 'Item Borrowed (Late Pickup)',
      instructions: `You picked up the item late. Your adjusted return date is ${formatDate(returnDate)}. Please return on time to avoid further penalties.`,
      action: 'Confirm Return',
      deadline: returnDate,
      isUrgent: isDateNear(returnDate, 1) || isOverdue(returnDate)
    },
    Rejected: {
      title: 'Request Rejected',
      instructions: 'Your request was not approved. Please contact the admin for more information or submit a new request.',
      action: null,
      deadline: null,
      isUrgent: false
    },
    Returned: {
      title: 'Item Returned',
      instructions: 'Thank you for returning the item on time. Your borrowing history has been recorded.',
      action: null,
      deadline: null,
      isUrgent: false
    },
    late_return: {
      title: 'Late Return',
      instructions: 'The item was returned past the due date. Please be mindful of return dates in future requests.',
      action: null,
      deadline: null,
      isUrgent: false
    },
    No_Return: {
      title: 'Item Not Returned',
      instructions: 'The item has not been returned. Please contact the admin immediately to resolve this issue.',
      action: 'Contact Admin',
      deadline: null,
      isUrgent: true
    },
    No_Pickup: {
      title: 'Pickup Missed',
      instructions: 'You did not pick up the item on the scheduled date. Please submit a new request if you still need the item.',
      action: null,
      deadline: null,
      isUrgent: false
    },
    Cancelled: {
      title: 'Request Cancelled',
      instructions: 'This request has been cancelled. You can submit a new request if needed.',
      action: null,
      deadline: null,
      isUrgent: false
    }
  };

  return guidance[status] || {
    title: 'Request Status',
    instructions: 'Contact admin for more information about your request.',
    action: null,
    deadline: null,
    isUrgent: false
  };
};

/**
 * Get available actions for request based on status
 */
export const getAvailableActions = (status, actual_pickup, actual_return) => {
  const actions = {
    Pending: [
      { type: 'cancel', label: 'Cancel Request', variant: 'outline-secondary' }
    ],
    Approved: [
      { type: 'cancel', label: 'Cancel Request', variant: 'outline-secondary' }
    ],
    Borrowed: [],
    late_pickup: [],
    Rejected: [],
    Returned: [],
    late_return: [],
    No_Return: [],
    No_Pickup: [],
    Cancelled: []
  };

  return actions[status] || [];
};

/**
 * Check if user can request a specific item
 */
export const canRequestItem = (userRequests, itemId, systemSettings) => {
  if (!userRequests || !systemSettings) {
    return { can: true, reason: '' };
  }

  // Check for active requests for this specific item
  const hasActiveForItem = userRequests.some(
    r => r.itemId === itemId && !ARCHIVED_STATUSES.includes(r.status)
  );

  if (hasActiveForItem) {
    return {
      can: false,
      reason: 'You already have an active request for this item'
    };
  }

  // Check maximum simultaneous borrows
  const activeCount = userRequests.filter(
    r => !ARCHIVED_STATUSES.includes(r.status)
  ).length;

  if (activeCount >= systemSettings.eic_max_simultaneous_borrows) {
    return {
      can: false,
      reason: `Maximum ${systemSettings.eic_max_simultaneous_borrows} active requests allowed`
    };
  }

  // Cooldown period check removed - users can request anytime even after returning items

  return { can: true, reason: '' };
};

/**
 * Get timeline steps for request
 */
export const getTimelineSteps = (status, pickupDate, returnDate, actual_pickup, actual_return) => {
  const steps = [
    {
      label: 'Request Submitted',
      icon: 'fa-paper-plane',
      completed: true,
      active: status === 'Pending'
    },
    {
      label: status === 'Rejected' ? 'Request Rejected' : 'Request Approved',
      icon: status === 'Rejected' ? 'fa-times-circle' : 'fa-check-circle',
      completed: ['Approved', 'Returned', 'late_return', 'No_Return'].includes(status),
      active: status === 'Approved' && !actual_pickup
    },
    {
      label: 'Item Picked Up',
      icon: 'fa-hand-holding',
      completed: actual_pickup !== null,
      active: status === 'Approved' && actual_pickup && !actual_return,
      date: actual_pickup ? formatDate(actual_pickup) : formatDate(pickupDate)
    },
    {
      label: 'Item Returned',
      icon: 'fa-check-double',
      completed: actual_return !== null || ['Returned', 'late_return'].includes(status),
      active: false,
      date: actual_return ? formatDate(actual_return) : formatDate(returnDate)
    }
  ];

  // Filter out steps for rejected/cancelled requests
  if (['Rejected', 'Cancelled', 'No_Pickup'].includes(status)) {
    return steps.slice(0, 2);
  }

  return steps;
};

// Helper functions
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const isDateNear = (date, days) => {
  if (!date) return false;
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays >= 0;
};

const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

const calculateDaysSince = (date) => {
  if (!date) return 0;
  const pastDate = new Date(date);
  const today = new Date();
  const diffTime = today - pastDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};
