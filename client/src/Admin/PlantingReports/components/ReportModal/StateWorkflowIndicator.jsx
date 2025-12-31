import React from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { PLANTING_STATES } from '../../constants/plantingReportConstants';

const steps = [
	{ label: 'Planting', value: PLANTING_STATES.PLANTING },
	{ label: 'Planted', value: PLANTING_STATES.PLANTED },
	{ label: 'Harvested', value: PLANTING_STATES.HARVESTED }
];

export default function StateWorkflowIndicator({ currentState }) {
	const activeStep = Math.max(
		steps.findIndex((step) => step.value === currentState), 
		0
	);

	return (
		<Box sx={{ mt: 2 }}>
			<Stepper activeStep={activeStep} alternativeLabel>
				{steps.map((step, index) => (
					<Step key={step.value || `step-${index}`}>
						<StepLabel>{step.label}</StepLabel>
					</Step>
				))}
			</Stepper>
		</Box>
	);
}
