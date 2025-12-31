/**
 * VarietySeasonFilter Component
 * Combined variety and season filters
 */

import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useVarieties, useSeasons } from '../../hooks/useReferenceData';

export function VarietySeasonFilter({ varietyValue, seasonValue, onVarietyChange, onSeasonChange }) {
	const { data: varietiesResponse, isLoading: loadingVarieties } = useVarieties();
	const { data: seasonsResponse, isLoading: loadingSeasons } = useSeasons();

	const varieties = Array.isArray(varietiesResponse)
		? varietiesResponse
		: Array.isArray(varietiesResponse?.data)
			? varietiesResponse.data
			: [];

	const seasons = Array.isArray(seasonsResponse)
		? seasonsResponse
		: Array.isArray(seasonsResponse?.data)
			? seasonsResponse.data
			: [];

	return (
		<FormControl fullWidth size="small">
			<InputLabel id="variety-filter-label">Variety</InputLabel>
			<Select
				labelId="variety-filter-label"
				value={varietyValue}
				label="Variety"
				onChange={(event) => onVarietyChange?.(event.target.value)}
				disabled={loadingVarieties}
				sx={{ height: 56 }}
			>
					<MenuItem value="">All Varieties</MenuItem>
					{loadingVarieties && <MenuItem disabled>Loading varieties...</MenuItem>}
					{varieties?.map((variety) => (
						<MenuItem key={variety.id} value={variety.id}>
							{variety.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
	);
}

export default VarietySeasonFilter;
