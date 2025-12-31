/**
 * StateWorkflowIndicator Component
 * Visual stepper showing report state progression
 */

import React from 'react';
import { Box, Stepper, Step, StepLabel, Chip, useTheme, useMediaQuery } from '@mui/material';
import { PLANTING_STATES, STATE_LABELS } from '../../constants/plantingReportConstants';
import { getStateStepIndex } from '../../utils/stateHelpers';

const steps = [
	{ label: STATE_LABELS[PLANTING_STATES.PLANTING], value: PLANTING_STATES.PLANTING },
	{ label: STATE_LABELS[PLANTING_STATES.PLANTED], value: PLANTING_STATES.PLANTED },
	{ label: STATE_LABELS[PLANTING_STATES.HARVESTED], value: PLANTING_STATES.HARVESTED }
];

export function StateWorkflowIndicator({ currentState, isArchived = false }) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const activeStep = getStateStepIndex(currentState);

	return (
		<Box sx={{ width: '100%', mb: 3 }}>
			<Stepper
				activeStep={activeStep}
				alternativeLabel={!isMobile}
				orientation={isMobile ? 'vertical' : 'horizontal'}
				sx={{
					'& .MuiStepLabel-root .Mui-completed': {
						color: 'success.main'
					},
					'& .MuiStepLabel-root .Mui-active': {
						color: 'primary.main'
					}
				}}
			>
				{steps.map((step, index) => (
					<Step key={step.value} completed={index < activeStep}>
						<StepLabel>
							<Box
								sx={{
									display: 'flex',
									flexDirection: isMobile ? 'row' : 'column',
									alignItems: isMobile ? 'center' : 'flex-start',
									gap: 1
								}}
							>
								{step.label}
								{index === activeStep && (
									<Chip
										label="Current"
										size="small"
										color="primary"
										sx={{ ml: isMobile ? 1 : 0, mt: isMobile ? 0 : 0.5 }}
									/>
								)}
							</Box>
						</StepLabel>
					</Step>
				))}
			</Stepper>

			{isArchived && (
				<Box sx={{ mt: 2, textAlign: 'center' }}>
					<Chip label="Archived" color="default" size="small" sx={{ fontWeight: 600 }} />
				</Box>
			)}
		</Box>
	);
}

export default StateWorkflowIndicator;
