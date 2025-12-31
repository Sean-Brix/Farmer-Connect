/**
 * ConfirmDialog Component
 * Reusable confirmation dialog
 */

import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	useTheme,
	useMediaQuery
} from '@mui/material';

export function ConfirmDialog({
	open,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	confirmColor = 'primary',
	onConfirm,
	onCancel,
	loading = false
}) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<Dialog
			open={open}
			onClose={loading ? undefined : onCancel}
			maxWidth="xs"
			fullWidth
			fullScreen={isMobile}
		>
			<DialogTitle>{title}</DialogTitle>

			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>

			<DialogActions sx={{ p: 2 }}>
				<Button onClick={onCancel} disabled={loading} color="inherit">
					{cancelText}
				</Button>
				<Button onClick={onConfirm} disabled={loading} variant="contained" color={confirmColor} autoFocus>
					{loading ? 'Processing...' : confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmDialog;
