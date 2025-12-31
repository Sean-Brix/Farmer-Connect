import React, { useState } from 'react';
import {
	Box,
	Pagination,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Typography,
	TextField,
	IconButton
} from '@mui/material';
import { FirstPage as FirstPageIcon, LastPage as LastPageIcon } from '@mui/icons-material';
import { useResponsive } from '../../hooks/useResponsive';
import { PAGINATION_CONFIG } from '../../constants/plantingReportConstants';

export function PaginationControls({ pagination, onPageChange, onLimitChange }) {
	const { isMobile } = useResponsive();

	const [jumpToPage, setJumpToPage] = useState('');

	const {
		currentPage = 1,
		totalPages = 1,
		pageSize = PAGINATION_CONFIG.defaultPageSize,
		totalItems = 0,
		startItem = 0,
		endItem = 0,
		hasNextPage = false,
		hasPreviousPage = false
	} = pagination || {};

	const handlePageSizeChange = (event) => {
		const nextValue = Number(event.target.value);
		onLimitChange?.(nextValue);
	};

	const handlePageChange = (event, page) => {
		onPageChange?.(page);
	};

	const handleJumpToPage = (event) => {
		if (event.key === 'Enter') {
			const page = parseInt(jumpToPage, 10);
			if (page >= 1 && page <= totalPages) {
				onPageChange?.(page);
				setJumpToPage('');
			}
		}
	};

	const handleFirstPage = () => onPageChange?.(1);
	const handleLastPage = () => onPageChange?.(totalPages);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: isMobile ? 'column' : 'row',
				alignItems: isMobile ? 'stretch' : 'center',
				justifyContent: 'space-between',
				gap: 2,
				p: 2,
				borderTop: 1,
				borderColor: 'divider'
			}}
		>
			{/* Left Side: Page Size Selector */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 2,
					flexDirection: isMobile ? 'column' : 'row',
					width: isMobile ? '100%' : 'auto'
				}}
			>
				<FormControl size="small" sx={{ minWidth: 120 }}>
					<InputLabel id="page-size-label">Rows per page</InputLabel>
					<Select labelId="page-size-label" value={pageSize} label="Rows per page" onChange={handlePageSizeChange}>
						{PAGINATION_CONFIG.pageSizeOptions.map((size) => (
							<MenuItem key={size} value={size}>
								{size}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Total Count */}
				<Typography variant="body2" color="text.secondary">
					Showing {startItem}-{endItem} of {totalItems.toLocaleString()}
				</Typography>
			</Box>

			{/* Center: Pagination */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					justifyContent: isMobile ? 'center' : 'flex-start'
				}}
			>
				{/* First Page Button (Desktop Only) */}
				{!isMobile && (
					<IconButton size="small" onClick={handleFirstPage} disabled={!hasPreviousPage} aria-label="First page">
						<FirstPageIcon />
					</IconButton>
				)}

				{/* Material-UI Pagination */}
				<Pagination
					count={totalPages}
					page={currentPage}
					onChange={handlePageChange}
					color="success"
					size={isMobile ? 'small' : 'medium'}
					siblingCount={isMobile ? 0 : 1}
					boundaryCount={1}
					showFirstButton={!isMobile}
					showLastButton={!isMobile}
					sx={{
						'& .MuiPaginationItem-root': {
							'&.Mui-selected': {
								backgroundColor: 'success.main',
								color: 'white',
								'&:hover': {
									backgroundColor: 'success.dark'
								}
							}
						}
					}}
				/>

				{/* Last Page Button (Desktop Only) */}
				{!isMobile && (
					<IconButton size="small" onClick={handleLastPage} disabled={!hasNextPage} aria-label="Last page">
						<LastPageIcon />
					</IconButton>
				)}
			</Box>

			{/* Right Side: Jump to Page (Desktop Only) */}
			{!isMobile && (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Typography variant="body2" color="text.secondary">
						Go to:
					</Typography>
					<TextField
						size="small"
						type="number"
						value={jumpToPage}
						onChange={(e) => setJumpToPage(e.target.value)}
						onKeyPress={handleJumpToPage}
						placeholder="Page"
						inputProps={{
							min: 1,
							max: totalPages,
							'aria-label': 'Jump to page'
						}}
						sx={{ width: 80 }}
					/>
				</Box>
			)}
		</Box>
	);
}

export default PaginationControls;
