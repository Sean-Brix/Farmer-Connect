import React from 'react';
import { Box, Grid, TextField, Typography, Paper } from '@mui/material';
import FarmerSelector from './FarmerSelector';
import FieldTooltip from '../common/FieldTooltip';

export default function FarmerInfoSection({ data, errors, onChange, onBlur, readOnly }) {
	const showFarmerSelector = !readOnly && !data.farmerName;

	return (
		<Paper variant="outlined" sx={{ p: 2 }}>
			<Typography variant="subtitle1" fontWeight={700} gutterBottom>
				Farmer Information
			</Typography>
			<Grid container spacing={2}>
				{showFarmerSelector && (
					<Grid item xs={12}>
						<FarmerSelector
							value={data.farmerName}
							onChange={(farmer) => {
								onChange('farmerName', farmer?.name || farmer?.label || farmer?.value || '');
								if (farmer?.rsbsaNumber) {
									onChange('rsbsaNumber', farmer.rsbsaNumber);
								}
							}}
							error={errors.farmerName}
							helperText={errors.farmerName}
						/>
					</Grid>
				)}

				<Grid item xs={12} sm={6}>
					<TextField
						label="Farmer Name"
						value={data.farmerName || ''}
						onChange={(e) => onChange('farmerName', e.target.value)}
						onBlur={() => onBlur('farmerName')}
						error={Boolean(errors.farmerName)}
						helperText={errors.farmerName || ''}
						fullWidth
						required
						disabled={readOnly}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						label="Farm Location"
						value={data.farmLocation || ''}
						onChange={(e) => onChange('farmLocation', e.target.value)}
						onBlur={() => onBlur('farmLocation')}
						error={Boolean(errors.farmLocation)}
						helperText={errors.farmLocation || 'Specific barangay or sitio'}
						fullWidth
						required
						disabled={readOnly}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						label={
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								RSBSA Number
								<FieldTooltip title="Format: 00-00-00-000-000000" />
							</Box>
						}
						value={data.rsbsaNumber || ''}
						onChange={(e) => onChange('rsbsaNumber', e.target.value)}
						onBlur={() => onBlur('rsbsaNumber')}
						error={Boolean(errors.rsbsaNumber)}
						helperText={errors.rsbsaNumber || 'Optional if not available'}
						fullWidth
						disabled={readOnly}
					/>
				</Grid>
			</Grid>
		</Paper>
	);
}
