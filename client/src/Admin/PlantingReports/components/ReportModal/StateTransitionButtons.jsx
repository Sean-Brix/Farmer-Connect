import React, { useCallback } from 'react';
import { Button, Stack } from '@mui/material';
import { toast } from 'react-toastify';

import { PLANTING_STATES } from '../../constants/plantingReportConstants';
import useStateTransitions from '../../hooks/useStateTransitions';

/**
 * StateTransitionButtons
 * Basic transition controls for Request -> Planted -> Completed.
 */
export default function StateTransitionButtons({ report, formData, onTransition, disabled }) {
  const {
    getNextState,
    getTransitionLabel,
    transitionToPlanted,
    transitionToCompleted,
    isTransitioning
  } = useStateTransitions();

  const nextState = report?.state ? getNextState(report.state) : null;
  const label = report?.state ? getTransitionLabel(report.state) : null;

  const handleTransition = useCallback(async () => {
    if (!report?.id || !nextState) return;

    try {
      if (nextState === PLANTING_STATES.PLANTED) {
        await transitionToPlanted(report.id, formData);
      } else if (nextState === PLANTING_STATES.HARVESTED) {
        await transitionToCompleted(report.id, formData);
      }

      toast.success(`Report moved to ${nextState}`);
      onTransition?.();
    } catch (error) {
      toast.error(error.message || 'Unable to transition report');
    }
  }, [formData, nextState, onTransition, report?.id, transitionToCompleted, transitionToPlanted]);

  if (!nextState || !label) return null;

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: '100%' }}>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleTransition}
        disabled={disabled || isTransitioning}
        fullWidth
      >
        {isTransitioning ? 'Processing...' : label}
      </Button>
    </Stack>
  );
}
