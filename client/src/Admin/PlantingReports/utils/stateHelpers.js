/**
 * State Helper Utilities
 * Helper functions for state management
 */

import { PLANTING_STATES, STATE_COLORS, STATE_LABELS, STATE_TRANSITIONS } from '../constants/plantingReportConstants';

export function getStateLabel(state) {
	return STATE_LABELS[state] || state;
}

export function getStateColor(state) {
	return STATE_COLORS[state] || 'default';
}

export function canTransitionTo(currentState, targetState) {
	const allowedTransitions = STATE_TRANSITIONS[currentState] || [];
	return allowedTransitions.includes(targetState);
}

export function getNextState(currentState) {
	const allowedTransitions = STATE_TRANSITIONS[currentState] || [];
	return allowedTransitions[0] || null;
}

export function canArchive(state, isArchived) {
	return state === PLANTING_STATES.HARVESTED && !isArchived;
}

export function canUnarchive(isArchived) {
	return isArchived;
}

export function getStateProgress(state) {
	switch (state) {
		case PLANTING_STATES.PLANTING:
			return 33;
		case PLANTING_STATES.PLANTED:
			return 66;
		case PLANTING_STATES.HARVESTED:
			return 100;
		default:
			return 0;
	}
}

export function getStateStepIndex(state) {
	switch (state) {
		case PLANTING_STATES.PLANTING:
			return 0;
		case PLANTING_STATES.PLANTED:
			return 1;
		case PLANTING_STATES.HARVESTED:
			return 2;
		default:
			return 0;
	}
}

export function isFieldVisible(fieldName, state, hiddenFields) {
	return !(hiddenFields[state] || []).includes(fieldName);
}

export function isFieldLocked(fieldName, state, lockedFields) {
	return (lockedFields[state] || []).includes(fieldName);
}

export function isFieldRequired(fieldName, state, requiredFields) {
	return (requiredFields[state] || []).includes(fieldName);
}

export default {
	getStateLabel,
	getStateColor,
	canTransitionTo,
	getNextState,
	canArchive,
	canUnarchive,
	getStateProgress,
	getStateStepIndex,
	isFieldVisible,
	isFieldLocked,
	isFieldRequired
};
