import React from 'react';
import { Box, Grid, TextField, Typography, MenuItem, Paper, FormControlLabel, Checkbox } from '@mui/material';
import { CROP_TYPES, SEED_CLASSIFICATIONS } from '../../constants/plantingReportConstants';
import VarietySelector from './VarietySelector';
import SeasonSelector from './SeasonSelector';
import FieldTooltip from '../common/FieldTooltip';

export default function SeedingDetailsSection({ data, errors, onChange, onBlur, readOnly }) {
	return (
		<Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper', borderColor: 'divider' }}>
			<Typography variant="subtitle1" fontWeight={700} gutterBottom color="text.primary">
				Seeding Details
			</Typography>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<TextField
						select
						label="Crop Type"
						value={data.typeOfCrop || ''}
						onChange={(e) => onChange('typeOfCrop', e.target.value)}
						onBlur={() => onBlur('typeOfCrop')}
						error={Boolean(errors.typeOfCrop)}
						helperText={errors.typeOfCrop || ''}
						fullWidth
						required
						disabled={readOnly}
					>
						{CROP_TYPES.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>
				</Grid>

				<Grid item xs={12} sm={6}>
					<VarietySelector
						cropType={data.typeOfCrop}
						value={data.varietyId}
						onChange={(varietyId) => onChange('varietyId', varietyId)}
						error={errors.varietyId}
						helperText={errors.varietyId}
						readOnly={readOnly}
					/>
				</Grid>

				<Grid item xs={12} sm={6}>
					<SeasonSelector
						value={data.croppingSeasonId}
						onChange={(seasonId) => onChange('croppingSeasonId', seasonId)}
						error={errors.croppingSeasonId}
						helperText={errors.croppingSeasonId}
						readOnly={readOnly}
					/>
				</Grid>

				<Grid item xs={12} sm={6}>
					<TextField
						label={
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								Area Planted (ha)
								<FieldTooltip title="Measure the planted area in hectares. 1 hectare = 10,000 sqm." />
							</Box>
						}
						type="number"
						value={data.areaPlanted || ''}
						onChange={(e) => onChange('areaPlanted', e.target.value)}
						onBlur={() => onBlur('areaPlanted')}
						error={Boolean(errors.areaPlanted)}
						helperText={errors.areaPlanted || 'Enter numeric value, e.g., 2.5'}
						fullWidth
						required
						disabled={readOnly}
						inputProps={{ min: 0, step: 0.01 }}
					/>
				</Grid>

				<Grid item xs={12} sm={6}>
					<TextField
						select
						label="Seed Classification"
						value={data.seedClassification || ''}
						onChange={(e) => onChange('seedClassification', e.target.value)}
						onBlur={() => onBlur('seedClassification')}
						error={Boolean(errors.seedClassification)}
						helperText={errors.seedClassification || ''}
						fullWidth
						required
						disabled={readOnly}
					>
						{SEED_CLASSIFICATIONS.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>
				</Grid>

				<Grid item xs={12} sm={6}>
					<FormControlLabel
						control={
							<Checkbox
								checked={Boolean(data.cropInsurance)}
								onChange={(e) => onChange('cropInsurance', e.target.checked)}
								disabled={readOnly}
							/>
						}
						label="Crop Insurance (Optional)"
					/>
				</Grid>
			</Grid>
		</Paper>
	);
}
