/**
 * useStateTransitions Hook
 * Handle state transitions (Request → Planted → Completed)
 */

import { useCallback } from 'react';
import { PLANTING_STATES, STATE_TRANSITIONS } from '../constants/plantingReportConstants';
import { useTransitionToCompleted, useTransitionToPlanted } from './usePlantingReportQueries';
import { validateStateTransition } from '../validation/stateTransitionRules';

export function useStateTransitions() {
	const transitionToPlantedMutation = useTransitionToPlanted();
	const transitionToCompletedMutation = useTransitionToCompleted();

	const canTransition = useCallback((currentState, targetState) => {
		const allowedTransitions = STATE_TRANSITIONS[currentState] || [];
		return allowedTransitions.includes(targetState);
	}, []);

	const getNextState = useCallback((currentState) => {
		const allowedTransitions = STATE_TRANSITIONS[currentState] || [];
		return allowedTransitions[0] || null;
	}, []);

	const transitionToPlanted = useCallback(
		async (reportId, data) => {
			const validation = validateStateTransition(PLANTING_STATES.PLANTED, data);

			if (validation.error) {
				throw new Error(validation.error.details[0].message);
			}

			return transitionToPlantedMutation.mutateAsync({ id: reportId, data });
		},
		[transitionToPlantedMutation]
	);

	const transitionToCompleted = useCallback(
		async (reportId, data) => {
			const validation = validateStateTransition(PLANTING_STATES.HARVESTED, data);

			if (validation.error) {
				throw new Error(validation.error.details[0].message);
			}

			return transitionToCompletedMutation.mutateAsync({ id: reportId, data });
		},
		[transitionToCompletedMutation]
	);

	const getTransitionLabel = useCallback(
		(currentState) => {
			const nextState = getNextState(currentState);
			if (!nextState) return null;

			switch (nextState) {
				case PLANTING_STATES.PLANTED:
					return 'Mark as Planted';
				case PLANTING_STATES.HARVESTED:
					return 'Mark as Completed';
				default:
					return null;
			}
		},
		[getNextState]
	);

	return {
		canTransition,
		getNextState,
		transitionToPlanted,
		transitionToCompleted,
		getTransitionLabel,
		isTransitioning: transitionToPlantedMutation.isPending || transitionToCompletedMutation.isPending
	};
}

export default useStateTransitions;
