/**
 * CropTypeFilter Component
 * Filter by crop type (Rice, Corn, High-Value)
 */

import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { CROP_TYPES } from '../../constants/plantingReportConstants';

export function CropTypeFilter({ value, onChange }) {
	return (
		<FormControl fullWidth size="small">
			<InputLabel id="crop-type-filter-label">Crop Type</InputLabel>
			<Select
				labelId="crop-type-filter-label"
				value={value}
				label="Crop Type"
				onChange={(event) => onChange?.(event.target.value)}
				sx={{ height: 56 }}
			>
				<MenuItem value="">All Crops</MenuItem>
				{CROP_TYPES.map((type) => (
					<MenuItem key={type.value} value={type.value}>
						{type.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

export default CropTypeFilter;
