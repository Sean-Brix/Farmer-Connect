/**
 * FilterPanel Component
 * Contains all filters for planting reports
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Collapse, Grid, IconButton, Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Clear as ClearIcon, ExpandMore as ExpandMoreIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../../hooks/useResponsive';
import { STATE_SUB_TABS } from '../../constants/plantingReportConstants';
import GlobalSearch from './GlobalSearch';
import CropTypeFilter from './CropTypeFilter';
import VarietySeasonFilter from './VarietySeasonFilter';
import DateRangeFilter from './DateRangeFilter';

export function FilterPanel({ search, filters, onSearchChange, onFiltersChange, mainTab }) {
	const { t } = useTranslation('plantingReports');
	const { isMobile } = useResponsive();
	const [expanded, setExpanded] = useState(!isMobile);

	useEffect(() => {
		setExpanded(!isMobile);
	}, [isMobile]);

	const handleFilterChange = (key, value) => {
		onFiltersChange?.({
			...filters,
			[key]: value
		});
	};

	const handleReset = () => {
		onFiltersChange?.({
			state: '',
			typeOfCrop: '',
			varietyId: '',
			croppingSeasonId: '',
			dateRange: { start: null, end: null }
		});
		onSearchChange?.('');
	};

	const hasActiveFilters = useMemo(() => countActiveFilters(search, filters) > 0, [filters, search]);

	return (
		<Paper 
			elevation={2}
			sx={{
				borderRadius: 2,
				boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
			}}
		>
			{isMobile && (
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						p: 2,
						borderBottom: expanded ? 1 : 0,
						borderColor: 'divider'
					}}
				>
					<FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />
					<Typography variant="subtitle1" sx={{ flex: 1 }}>
						Filters {hasActiveFilters && `(${countActiveFilters(search, filters)})`}
					</Typography>
					<IconButton
						size="small"
						onClick={() => setExpanded((prev) => !prev)}
						sx={{
							transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
							transition: 'transform 0.2s'
						}}
					>
						<ExpandMoreIcon />
					</IconButton>
				</Box>
			)}

			<Collapse in={expanded} timeout="auto">
				<Box sx={{ p: 2 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<GlobalSearch value={search} onChange={onSearchChange} />
						</Grid>

						{mainTab !== 'deleted' && (
						<Grid item xs={12} sm={6} md={2}>
								<FormControl fullWidth size="small">
									<InputLabel>State</InputLabel>
									<Select
										value={filters.state || ''}
										onChange={(e) => handleFilterChange('state', e.target.value)}
										label="State"
										sx={{ 
											height: 56,
											'& .MuiOutlinedInput-notchedOutline': {
												borderColor: 'divider'
											},
											'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
												borderColor: 'success.main'
											}
										}}
									>
										<MenuItem value="">
											<em>All States</em>
										</MenuItem>
										<MenuItem value={STATE_SUB_TABS.REQUEST}>{t('stateTabs.request')}</MenuItem>
										<MenuItem value={STATE_SUB_TABS.PLANTED}>{t('stateTabs.planted')}</MenuItem>
										<MenuItem value={STATE_SUB_TABS.COMPLETED}>{t('stateTabs.completed')}</MenuItem>
										<MenuItem value={STATE_SUB_TABS.ARCHIVED}>{t('stateTabs.archived')}</MenuItem>
									</Select>
								</FormControl>
							</Grid>
						)}

						<Grid item xs={12} sm={6} md={2}>
							<CropTypeFilter value={filters.typeOfCrop} onChange={(value) => handleFilterChange('typeOfCrop', value)} />
						</Grid>

						<Grid item xs={12} sm={6} md={2}>
							<VarietySeasonFilter
								varietyValue={filters.varietyId}
								seasonValue={filters.croppingSeasonId}
								onVarietyChange={(value) => handleFilterChange('varietyId', value)}
								onSeasonChange={(value) => handleFilterChange('croppingSeasonId', value)}
							/>
						</Grid>

						<Grid item xs={12} sm={6} md={2}>
							<DateRangeFilter value={filters.dateRange} onChange={(value) => handleFilterChange('dateRange', value)} />
						</Grid>

						<Grid item xs={12} sm={6} md={2}>
							<Button
								fullWidth
								variant="outlined"
								color="success"
								startIcon={<ClearIcon />}
								onClick={handleReset}
								disabled={!hasActiveFilters}
								sx={{ height: 56 }}
							>
								Reset
							</Button>
						</Grid>
					</Grid>
				</Box>
			</Collapse>
		</Paper>
	);
}

function countActiveFilters(search, filters = {}) {
	let count = 0;
	if (search) count += 1;
	if (filters.state) count += 1;
	if (filters.typeOfCrop) count += 1;
	if (filters.varietyId) count += 1;
	if (filters.croppingSeasonId) count += 1;
	if (filters.dateRange?.start || filters.dateRange?.end) count += 1;
	return count;
}

export default FilterPanel;
