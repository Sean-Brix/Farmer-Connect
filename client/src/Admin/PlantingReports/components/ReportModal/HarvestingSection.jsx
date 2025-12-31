import React, { useEffect, useMemo } from 'react';
import { Grid, TextField, Typography, Paper } from '@mui/material';
import FieldTooltip from '../common/FieldTooltip';
import { calculateYield } from '../../utils/calculationHelpers';

export default function HarvestingSection({ data, errors, onChange, onBlur, readOnly }) {
	const computedYield = useMemo(() => {
		const harvestArea = Number(data.harvestArea) || 0;
		const numberOfBags = Number(data.numberOfBags) || 0;
		const weightPerBag = Number(data.weightPerBag) || 0;
		return calculateYield(harvestArea, numberOfBags, weightPerBag);
	}, [data.harvestArea, data.numberOfBags, data.weightPerBag]);

	useEffect(() => {
		if (computedYield !== data.yieldMtPerHa) {
			onChange('yieldMtPerHa', computedYield ?? '');
		}
	}, [computedYield, data.yieldMtPerHa, onChange]);

	return (
		<Paper variant="outlined" sx={{ p: 2 }}>
			<Typography variant="subtitle1" fontWeight={700} gutterBottom>
				Harvest Details
			</Typography>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<TextField
						label="Harvest Area (ha)"
						type="number"
						value={data.harvestArea || ''}
						onChange={(e) => onChange('harvestArea', e.target.value)}
						onBlur={() => onBlur('harvestArea')}
						error={Boolean(errors.harvestArea)}
						helperText={errors.harvestArea || ''}
						fullWidth
						required
						disabled={readOnly}
						inputProps={{ min: 0, step: 0.01 }}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						label="Number of Bags"
						type="number"
						value={data.numberOfBags || ''}
						onChange={(e) => onChange('numberOfBags', e.target.value)}
						onBlur={() => onBlur('numberOfBags')}
						error={Boolean(errors.numberOfBags)}
						helperText={errors.numberOfBags || ''}
						fullWidth
						required
						disabled={readOnly}
						inputProps={{ min: 0, step: 1 }}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						label="Weight per Bag (kg)"
						type="number"
						value={data.weightPerBag || ''}
						onChange={(e) => onChange('weightPerBag', e.target.value)}
						onBlur={() => onBlur('weightPerBag')}
						error={Boolean(errors.weightPerBag)}
						helperText={errors.weightPerBag || ''}
						fullWidth
						required
						disabled={readOnly}
						inputProps={{ min: 0, step: 0.1 }}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						label={
							<>
								Yield (Mt/Ha)
								<FieldTooltip title="Auto-calculated from bags and weight. Stored with 2-decimal precision." />
							</>
						}
						type="number"
						value={computedYield ?? data.yieldMtPerHa ?? ''}
						onChange={(e) => onChange('yieldMtPerHa', e.target.value)}
						onBlur={() => onBlur('yieldMtPerHa')}
						error={Boolean(errors.yieldMtPerHa)}
						helperText={errors.yieldMtPerHa || 'Auto-calculated'}
						fullWidth
						disabled
					/>
				</Grid>
			</Grid>
		</Paper>
	);
}
