/**
 * Date Helper Utilities
 * Date formatting and manipulation
 */

import { addDays, addMonths, differenceInDays, format, parseISO } from 'date-fns';

export function formatDate(date, formatString = 'MMM dd, yyyy') {
	if (!date) return '';

	try {
		const dateObj = typeof date === 'string' ? parseISO(date) : date;
		return format(dateObj, formatString);
	} catch (error) {
		console.error('Date formatting error:', error);
		return '';
	}
}

export function toISOString(date) {
	if (!date) return null;

	try {
		const dateObj = typeof date === 'string' ? parseISO(date) : date;
		return dateObj.toISOString();
	} catch (error) {
		console.error('Date conversion error:', error);
		return null;
	}
}

export function getDaysRemaining(deletedAt, retentionDays = 30) {
	if (!deletedAt) return 0;

	try {
		const deletedDate = typeof deletedAt === 'string' ? parseISO(deletedAt) : deletedAt;
		const expiryDate = addDays(deletedDate, retentionDays);
		const today = new Date();
		const daysLeft = differenceInDays(expiryDate, today);

		return Math.max(0, daysLeft);
	} catch (error) {
		console.error('Days remaining calculation error:', error);
		return 0;
	}
}

export function calculateDaysRemaining(deletedAt, retentionDays = 30) {
	return getDaysRemaining(deletedAt, retentionDays);
}

export function calculateHarvestDate(plantingDate, cropType) {
	if (!plantingDate) return null;

	try {
		const planting = typeof plantingDate === 'string' ? parseISO(plantingDate) : plantingDate;
		const growthPeriods = {
			Rice: 4,
			Corn: 3,
			High_Value_Crops: 2
		};

		const months = growthPeriods[cropType] || 3;
		return addMonths(planting, months);
	} catch (error) {
		console.error('Harvest date calculation error:', error);
		return null;
	}
}

export function isFutureDate(date) {
	if (!date) return false;

	try {
		const checkDate = typeof date === 'string' ? parseISO(date) : date;
		return checkDate > new Date();
	} catch (error) {
		return false;
	}
}

export function formatRelativeTime(date) {
	if (!date) return '';

	try {
		const dateObj = typeof date === 'string' ? parseISO(date) : date;
		const days = differenceInDays(new Date(), dateObj);

		if (days === 0) return 'Today';
		if (days === 1) return 'Yesterday';
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
		if (days < 365) return `${Math.floor(days / 30)} months ago`;
		return `${Math.floor(days / 365)} years ago`;
	} catch (error) {
		console.error('Relative time formatting error:', error);
		return '';
	}
}

export default {
	formatDate,
	toISOString,
	getDaysRemaining,
	calculateDaysRemaining,
	calculateHarvestDate,
	isFutureDate,
	formatRelativeTime
};
