/**
 * ErrorBoundary Component
 * Catch React component errors
 */

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null
		};
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		// Log to console for visibility during development.
		console.error('ErrorBoundary caught an error:', error, errorInfo);
		this.setState({
			error,
			errorInfo
		});
	}

	handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null
		});

		if (this.props.onReset) {
			this.props.onReset();
		}
	};

	render() {
		if (this.state.hasError) {
			return (
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: '400px',
						p: 3
					}}
				>
					<Paper
						sx={{
							p: 4,
							maxWidth: 600,
							textAlign: 'center'
						}}
					>
						<ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />

						<Typography variant="h5" gutterBottom>
							Oops! Something went wrong
						</Typography>

						<Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
							We encountered an error while rendering this component.
							{this.props.showDetails && this.state.error && (
								<Box sx={{ mt: 2, textAlign: 'left' }}>
									<Typography
										variant="caption"
										component="pre"
										sx={{
											whiteSpace: 'pre-wrap',
											wordBreak: 'break-word',
											backgroundColor: 'grey.100',
											p: 2,
											borderRadius: 1
										}}
									>
										{this.state.error.toString()}
									</Typography>
								</Box>
							)}
						</Typography>

						<Button variant="contained" onClick={this.handleReset}>
							Try Again
						</Button>
					</Paper>
				</Box>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
