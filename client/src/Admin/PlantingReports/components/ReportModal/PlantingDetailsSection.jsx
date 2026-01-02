import React from 'react';
import { Grid, TextField, Typography, MenuItem, Paper } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PLANTING_METHODS, PLANTING_METHOD_LABELS, RICE_IRRIGATION_TYPES, RICE_IRRIGATION_LABELS } from '../../constants/plantingReportConstants';

const toDate = (value) => {
	if (!value) return null;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
};

export default function PlantingDetailsSection({ data, errors, onChange, onBlur, readOnly }) {
	const showIrrigation = data.typeOfCrop === 'Rice';

	return (
		<Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper', borderColor: 'divider' }}>
			<Typography variant="subtitle1" fontWeight={700} gutterBottom color="text.primary">
				Planting Details
			</Typography>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label="Date of Planting"
							value={toDate(data.dateOfPlanting)}
							onChange={(newDate) => onChange('dateOfPlanting', newDate ? newDate.toISOString() : null)}
							readOnly={readOnly}
							slotProps={{
								textField: {
									fullWidth: true,
									required: true,
									error: Boolean(errors.dateOfPlanting),
									helperText: errors.dateOfPlanting || 'Select actual planting date',
									onBlur: () => onBlur('dateOfPlanting')
								}
							}}
						/>
					</LocalizationProvider>
				</Grid>

				<Grid item xs={12} sm={6}>
					<TextField
						select
						label="Planting Method"
						value={data.plantingMethod || ''}
						onChange={(e) => onChange('plantingMethod', e.target.value)}
						onBlur={() => onBlur('plantingMethod')}
						error={Boolean(errors.plantingMethod)}
						helperText={errors.plantingMethod || ''}
						fullWidth
						required
						disabled={readOnly}
					>
						{PLANTING_METHODS.map((method) => (
							<MenuItem key={method} value={method}>
								{PLANTING_METHOD_LABELS[method]}
							</MenuItem>
						))}
					</TextField>
				</Grid>

				{showIrrigation && (
					<Grid item xs={12} sm={6}>
						<TextField
							select
							label="Rice Irrigation"
							value={data.riceIrrigation || ''}
							onChange={(e) => onChange('riceIrrigation', e.target.value)}
							onBlur={() => onBlur('riceIrrigation')}
							error={Boolean(errors.riceIrrigation)}
							helperText={errors.riceIrrigation || 'Required for rice crops'}
							fullWidth
							required
							disabled={readOnly}
						>
							{RICE_IRRIGATION_TYPES.map((option) => (
								<MenuItem key={option} value={option}>
									{RICE_IRRIGATION_LABELS[option]}
								</MenuItem>
							))}
						</TextField>
					</Grid>
				)}

				<Grid item xs={12} sm={6}>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label="Expected Harvest Date"
							value={toDate(data.dateOfExpectedHarvest)}
							onChange={(newDate) => onChange('dateOfExpectedHarvest', newDate ? newDate.toISOString() : null)}
							readOnly={readOnly}
							slotProps={{
								textField: {
									fullWidth: true,
									error: Boolean(errors.dateOfExpectedHarvest),
									helperText: errors.dateOfExpectedHarvest || 'Auto-calculated; editable if needed',
									onBlur: () => onBlur('dateOfExpectedHarvest')
								}
							}}
						/>
					</LocalizationProvider>
				</Grid>
			</Grid>
		</Paper>
	);
}
