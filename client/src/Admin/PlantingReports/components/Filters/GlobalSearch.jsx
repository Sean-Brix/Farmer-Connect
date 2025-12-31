/**
 * GlobalSearch Component
 */

import React, { useEffect, useRef, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const DEBOUNCE_MS = 500;

export function GlobalSearch({ value, onChange }) {
	const [inputValue, setInputValue] = useState(value || '');
	const isFirstRender = useRef(true);

	useEffect(() => {
		setInputValue(value || '');
	}, [value]);

	useEffect(() => {
		// Skip first render to prevent firing on mount
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		const timer = setTimeout(() => {
			onChange?.(inputValue);
		}, DEBOUNCE_MS);

		return () => clearTimeout(timer);
	}, [inputValue, onChange]);

	return (
		<TextField
			fullWidth
			size="small"
			placeholder="Search by farmer name, location, or RSBSA number..."
			value={inputValue}
			onChange={(event) => setInputValue(event.target.value)}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<SearchIcon />
					</InputAdornment>
				)
			}}
			sx={{ height: 56 }}
		/>
	);
}

export default GlobalSearch;
