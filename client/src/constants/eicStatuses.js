/**
 * EIC Status Constants
 * Single source of truth for all status-related arrays
 * Prevents duplication and inconsistencies across the codebase
 */

// Statuses that represent active/ongoing requests
export const ACTIVE_STATUSES = [
  'Pending',
  'Approved',
  'Borrowed',
  'late_pickup'
];

// Statuses that represent archived/completed transactions
export const ARCHIVED_STATUSES = [
  'Returned',
  'late_return',
  'Rejected',
  'No_Return',
  'No_Pickup',
  'Cancelled'
];

// Statuses that can be cancelled by user
export const CANCELLABLE_STATUSES = [
  'Pending',
  'Approved',
  'Borrowed',
  'late_pickup'
];

// Statuses where item is physically with the user
export const ITEM_WITH_USER_STATUSES = [
  'Borrowed',
  'late_pickup',
  'late_return'
];

// Statuses where item is in office
export const ITEM_IN_OFFICE_STATUSES = [
  'Pending',
  'Approved',
  'Returned',
  'Rejected',
  'No_Pickup',
  'Cancelled'
];

export default {
  ACTIVE_STATUSES,
  ARCHIVED_STATUSES,
  CANCELLABLE_STATUSES,
  ITEM_WITH_USER_STATUSES,
  ITEM_IN_OFFICE_STATUSES
};
