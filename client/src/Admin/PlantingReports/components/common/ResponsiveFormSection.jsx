/**
 * ResponsiveFormSection Component
 * Reusable form section with responsive grid
 */

import React from 'react';
import { Box, Typography, Grid, Divider } from '@mui/material';
import { useResponsive } from '../../hooks/useResponsive';

export function ResponsiveFormSection({
	title,
	children,
	showDivider = true,
	spacing,
	gridProps = {}
}) {
	const { isMobile } = useResponsive();
	const { sx: gridSx = {}, ...restGridProps } = gridProps;

	return (
		<Box sx={{ mb: 3 }}>
			{/* Section Title */}
			<Typography variant={isMobile ? 'h6' : 'h5'} sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
				{title}
			</Typography>

			{/* Form Grid */}
			<Grid
				container
				spacing={spacing || { xs: 2, md: 3 }}
				sx={{
					'& .MuiTextField-root': {
						width: '100%'
					},
					...gridSx
				}}
				{...restGridProps}
			>
				{children}
			</Grid>

			{/* Divider */}
			{showDivider && <Divider sx={{ mt: 3 }} />}
		</Box>
	);
}

export default ResponsiveFormSection;
