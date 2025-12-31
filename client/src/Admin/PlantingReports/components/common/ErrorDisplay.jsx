import React from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * ErrorDisplay Component
 * Shows error messages with optional retry control.
 */
export default function ErrorDisplay({ message, onRetry }) {
  return (
    <Alert
      severity="error"
      icon={<ErrorOutlineIcon />}
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        )
      }
      sx={{ mb: 2 }}
    >
      <AlertTitle>Error</AlertTitle>
      {message || 'An unexpected error occurred. Please try again.'}
    </Alert>
  );
}
