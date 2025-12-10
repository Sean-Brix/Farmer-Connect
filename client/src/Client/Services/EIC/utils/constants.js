/**
 * Constants for EIC System
 * Status configurations, colors, and other constants
 */

export const TRANSACTION_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  RETURNED: 'Returned',
  LATE_RETURN: 'late_return',
  NO_RETURN: 'No_Return',
  NO_PICKUP: 'No_Pickup',
  CANCELLED: 'Cancelled'
};

export const ACTIVE_STATUSES = ['Pending', 'Approved'];
export const COMPLETED_STATUSES = ['Returned', 'late_return'];
export const CANCELLED_STATUSES = ['Cancelled', 'Rejected', 'No_Pickup', 'No_Return'];

export const STATUS_COLORS = {
  Pending: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800'
  },
  Approved: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-800'
  },
  Rejected: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800'
  },
  Returned: {
    bg: 'bg-gray-50',
    text: 'text-gray-800',
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-800'
  },
  late_return: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800'
  },
  No_Return: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800'
  },
  No_Pickup: {
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-800'
  },
  Cancelled: {
    bg: 'bg-gray-50',
    text: 'text-gray-800',
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-800'
  }
};

export const STATUS_ICONS = {
  Pending: 'fa-clock',
  Approved: 'fa-check-circle',
  Rejected: 'fa-times-circle',
  Returned: 'fa-check-double',
  late_return: 'fa-exclamation-triangle',
  No_Return: 'fa-exclamation-circle',
  No_Pickup: 'fa-calendar-times',
  Cancelled: 'fa-ban'
};

export const DEFAULT_SYSTEM_SETTINGS = {
  eic_max_simultaneous_borrows: 3,
  eic_max_quantity_per_request: 5,
  eic_cooldown_days: 7,
  allow_weekend_pickups: false,
  max_advance_booking_days: 30,
  eic_max_pickups_per_day: 10
};

export const VALIDATION_MESSAGES = {
  QUANTITY_REQUIRED: 'Quantity is required',
  QUANTITY_MIN: 'Quantity must be at least 1',
  QUANTITY_EXCEEDS_STOCK: 'Exceeds available stock',
  QUANTITY_EXCEEDS_ITEM_LIMIT: 'Exceeds item quantity limit',
  QUANTITY_EXCEEDS_SYSTEM_LIMIT: 'Exceeds system quantity limit',
  PICKUP_REQUIRED: 'Pickup date is required',
  PICKUP_PAST: 'Pickup date cannot be in the past',
  PICKUP_WEEKEND: 'Weekend pickups are not allowed',
  PICKUP_TOO_FAR: 'Exceeds maximum advance booking days',
  RETURN_REQUIRED: 'Return date is required',
  RETURN_BEFORE_PICKUP: 'Return date must be after pickup date',
  RETURN_EXCEEDS_LIMIT: 'Exceeds maximum borrowing period',
  NOTE_TOO_LONG: 'Request note must be 500 characters or less',
  DUPLICATE_REQUEST: 'You already have an active request for this item',
  MAX_ACTIVE_REACHED: 'You have reached the maximum active requests',
  IN_COOLDOWN: 'You are in cooldown period'
};

export const REQUEST_NOTE_MAX_LENGTH = 500;

export const SLOT_THRESHOLDS = {
  FULL: 0,
  LOW: 2,
  MEDIUM: 5
};

export const URGENCY_DAYS = {
  URGENT: 1,
  NEAR: 3,
  UPCOMING: 7
};
