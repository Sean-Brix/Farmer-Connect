/**
 * Date Helper Functions for EIC
 * Utilities for date manipulation and formatting
 */

import { format, addDays, differenceInDays, isWeekend, startOfDay, endOfDay, parseISO } from 'date-fns';

/**
 * Calculate days between two dates
 */
export const calculateDaysBetween = (date1, date2) => {
  if (!date1 || !date2) return 0;
  
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  
  return differenceInDays(d2, d1);
};

/**
 * Check if date is a weekend
 */
export const isWeekendDay = (date) => {
  if (!date) return false;
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isWeekend(d);
};

/**
 * Add business days (excluding weekends)
 */
export const addBusinessDays = (date, days) => {
  if (!date) return null;
  
  let currentDate = typeof date === 'string' ? parseISO(date) : date;
  let remainingDays = days;
  
  while (remainingDays > 0) {
    currentDate = addDays(currentDate, 1);
    if (!isWeekend(currentDate)) {
      remainingDays--;
    }
  }
  
  return currentDate;
};

/**
 * Format date for display
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatString);
};

/**
 * Format deadline with urgency
 */
export const formatDeadline = (date) => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  const daysUntil = differenceInDays(d, today);
  
  if (daysUntil < 0) {
    return `Overdue by ${Math.abs(daysUntil)} day(s)`;
  } else if (daysUntil === 0) {
    return 'Due today';
  } else if (daysUntil === 1) {
    return 'Due tomorrow';
  } else if (daysUntil <= 7) {
    return `Due in ${daysUntil} days`;
  }
  
  return formatDate(d);
};

/**
 * Get days remaining until date
 */
export const getDaysRemaining = (date) => {
  if (!date) return 0;
  const d = startOfDay(typeof date === 'string' ? parseISO(date) : date);
  const today = startOfDay(new Date());
  return differenceInDays(d, today);
};

/**
 * Check if date is overdue
 */
export const isOverdue = (date) => {
  if (!date) return false;
  const d = startOfDay(typeof date === 'string' ? parseISO(date) : date);
  const today = startOfDay(new Date());
  return d < today;
};

/**
 * Check if date is near (within specified days)
 */
export const isDateNear = (date, days) => {
  if (!date) return false;
  const remaining = getDaysRemaining(date);
  return remaining <= days && remaining >= 0;
};

/**
 * Format date for input field (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
};

/**
 * Get today's date at start of day
 */
export const getToday = () => {
  return startOfDay(new Date());
};

/**
 * Get tomorrow's date
 */
export const getTomorrow = () => {
  return addDays(getToday(), 1);
};

/**
 * Calculate days since a past date
 */
export const calculateDaysSince = (date) => {
  if (!date) return 0;
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  const diffTime = today - d;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get date range label
 */
export const getDateRangeLabel = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  const days = calculateDaysBetween(startDate, endDate);
  return `${formatDate(startDate)} - ${formatDate(endDate)} (${days} day${days !== 1 ? 's' : ''})`;
};

/**
 * Check if date is valid
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const d = typeof date === 'string' ? parseISO(date) : date;
  return d instanceof Date && !isNaN(d);
};

/**
 * Get relative time label (e.g., "2 days ago", "in 3 days")
 */
export const getRelativeTimeLabel = (date) => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  const diffDays = differenceInDays(d, today);
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `In ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago`;
};

/**
 * Add days to date
 */
export const addDaysToDate = (date, days) => {
  if (!date) return null;
  const d = typeof date === 'string' ? parseISO(date) : date;
  return addDays(d, days);
};
