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

  console.log('🔵 [StateTransitionButtons] Rendering', { 
    hasReport: !!report, 
    reportId: report?.id,
    reportState: report?.state, 
    nextState, 
    label,
    willRenderButton: !!(nextState && label)
  });

  const handleTransition = useCallback(async () => {
    console.log('🔵 [Transition] Button clicked', { reportId: report?.id, nextState });
    
    if (!report?.id || !nextState) return;

    try {
      if (nextState === PLANTING_STATES.PLANTED) {
        console.log('🔵 [Transition] Validating for PLANTED state');
        
        // Validate only the fields needed for transition
        if (!formData.dateOfPlanting) {
          console.log('❌ [Transition] Missing dateOfPlanting');
          toast.error('Date of planting is required');
          return;
        }
        if (!formData.plantingMethod) {
          console.log('❌ [Transition] Missing plantingMethod');
          toast.error('Planting method is required');
          return;
        }
        if (report.typeOfCrop === 'Rice' && !formData.riceIrrigation) {
          console.log('❌ [Transition] Missing riceIrrigation for Rice crop');
          toast.error('Rice irrigation type is required for Rice crops');
          return;
        }

        console.log('✅ [Transition] Validation passed, sending data:', {
          dateOfPlanting: formData.dateOfPlanting,
          plantingMethod: formData.plantingMethod,
          riceIrrigation: formData.riceIrrigation,
          typeOfCrop: report.typeOfCrop
        });

        // Only send fields required for transition to Planted
        // Include typeOfCrop from report (needed for validation)
        const plantedData = {
          dateOfPlanting: formData.dateOfPlanting,
          plantingMethod: formData.plantingMethod,
          riceIrrigation: formData.riceIrrigation || null,
          typeOfCrop: report.typeOfCrop,
          transitionNote: formData.transitionNote || ''
        };
        console.log('🚀 [Transition] Calling transitionToPlanted with:', plantedData);
        await transitionToPlanted(report.id, plantedData);
        console.log('✅ [Transition] API call completed successfully');
      } else if (nextState === PLANTING_STATES.HARVESTED) {
        console.log('🔵 [Transition] Validating for HARVESTED state');
        
        // Validate only the fields needed for transition
        if (!formData.harvestArea) {
          console.log('❌ [Transition] Missing harvestArea');
          toast.error('Harvest area is required');
          return;
        }
        if (!formData.numberOfBags) {
          console.log('❌ [Transition] Missing numberOfBags');
          toast.error('Number of bags is required');
          return;
        }
        if (!formData.weightPerBag) {
          console.log('❌ [Transition] Missing weightPerBag');
          toast.error('Weight per bag is required');
          return;
        }

        console.log('✅ [Transition] Validation passed, sending data:', {
          harvestArea: formData.harvestArea,
          numberOfBags: formData.numberOfBags,
          weightPerBag: formData.weightPerBag,
          areaPlanted: report.areaPlanted
        });

        // Only send fields required for transition to Harvested
        // Include areaPlanted from report (needed for validation)
        const harvestedData = {
          harvestArea: formData.harvestArea,
          numberOfBags: formData.numberOfBags,
          weightPerBag: formData.weightPerBag,
          areaPlanted: report.areaPlanted,
          transitionNote: formData.transitionNote || ''
        };
        console.log('🚀 [Transition] Calling transitionToCompleted with:', harvestedData);
        await transitionToCompleted(report.id, harvestedData);
        console.log('✅ [Transition] API call completed successfully');
      }

      toast.success(`Report moved to ${nextState}`);
      onTransition?.();
    } catch (error) {
      console.error('❌ [Transition] Error:', error);
      // Extract user-friendly error message from API response
      const errorMessage = error.response?.data?.message || error.message || 'Unable to transition report';
      toast.error(errorMessage);
    }
  }, [formData, nextState, onTransition, report?.id, report?.typeOfCrop, transitionToCompleted, transitionToPlanted]);

  if (!nextState || !label) return null;

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: '100%' }}>
      <Button
        type="button"
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
