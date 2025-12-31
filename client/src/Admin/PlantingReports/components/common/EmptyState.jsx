/**
 * EmptyState Component
 * Display when no data is available
 */

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

export function EmptyState({
	title = 'No Data Found',
	message = 'There are no items to display',
	actionText,
	onAction,
	icon
}) {
	const IconComponent = icon || InboxIcon;

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				py: 8,
				px: 2,
				textAlign: 'center'
			}}
		>
			<IconComponent sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />

			<Typography variant="h6" color="text.secondary" gutterBottom>
				{title}
			</Typography>

			<Typography variant="body2" color="text.disabled" sx={{ mb: 3, maxWidth: 400 }}>
				{message}
			</Typography>

			{actionText && onAction && (
				<Button variant="contained" onClick={onAction}>
					{actionText}
				</Button>
			)}
		</Box>
	);
}

export default EmptyState;
