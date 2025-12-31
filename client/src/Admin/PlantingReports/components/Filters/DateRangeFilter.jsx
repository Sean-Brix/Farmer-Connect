/**
 * DateRangeFilter Component
 * Filter by date range (start/end)
 */

import React from 'react';
import { Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export function DateRangeFilter({ value, onChange }) {
	const handleStartChange = (date) => {
		onChange?.({ ...value, start: date });
	};

	const handleEndChange = (date) => {
		onChange?.({ ...value, end: date });
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DatePicker
				label="Date Created"
				value={value.start}
				onChange={handleStartChange}
				slotProps={{
					textField: {
						fullWidth: true,
						size: 'small',
						sx: { height: 56 }
					}
				}}
			/>
		</LocalizationProvider>
	);
}

export default DateRangeFilter;
