/**
 * HarvestedReportsTable Component
 * Table for completed/harvested reports (Completed state)
 */

import React, { useMemo, useState } from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Checkbox,
	IconButton,
	Tooltip,
	Chip,
	Button,
	Toolbar,
	Typography,
	TableSortLabel
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';

import {
	useAllReports,
	useDeleteReport,
	useArchiveReport,
	useBulkArchive,
	useBulkDelete
} from '../../hooks/usePlantingReportQueries';
import { useResponsive } from '../../hooks/useResponsive';

import MobileReportCard from '../common/MobileReportCard';
import { TableLoadingSkeleton, CardLoadingSkeleton } from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import ConfirmDialog from '../common/ConfirmDialog';
import PaginationControls from '../Pagination/PaginationControls';

import { getStateLabel, getStateColor, canArchive } from '../../utils/stateHelpers';

import { PLANTING_STATES, TABLE_COLUMNS } from '../../constants/plantingReportConstants';

export function HarvestedReportsTable({ search, filters, pagination, onView, onEdit }) {
	const { isMobile } = useResponsive();

	const [selected, setSelected] = useState([]);
	const [lastSelected, setLastSelected] = useState(null);
	const [sortBy, setSortBy] = useState('');
	const [sortOrder, setSortOrder] = useState('asc');
	const [confirmDialog, setConfirmDialog] = useState({
		open: false,
		title: '',
		message: '',
		action: null,
		confirmColor: 'primary'
	});

	const queryFilters = useMemo(() => {
		const { state: _, ...restFilters } = filters || {};
		
		return {
			page: pagination.page,
			limit: pagination.limit,
			search,
			state: PLANTING_STATES.HARVESTED,
			isArchived: false,
			sortBy,
			sortOrder,
			...restFilters
		};
	}, [filters, pagination.limit, pagination.page, search, sortBy, sortOrder]);

	const { data, isLoading, error } = useAllReports(queryFilters);

	const deleteMutation = useDeleteReport();
	const archiveMutation = useArchiveReport();
	const bulkArchiveMutation = useBulkArchive();
	const bulkDeleteMutation = useBulkDelete();

	const reports = data?.data || [];
	const totalRecords = data?.pagination?.total || 0;

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = reports.map((r) => r.id);
			setSelected(newSelected);
		} else {
			setSelected([]);
		}
	};

	const handleRowClick = (event, reportId, index) => {
		if (event.shiftKey && lastSelected !== null) {
			const start = Math.min(lastSelected, index);
			const end = Math.max(lastSelected, index);
			const range = reports.slice(start, end + 1).map((r) => r.id);
			setSelected((prev) => Array.from(new Set([...prev, ...range])));
		} else if (event.ctrlKey || event.metaKey) {
			setSelected((prev) => (prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]));
		} else {
			setSelected((prev) => (prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]));
		}
		setLastSelected(index);
	};

	const isSelected = (id) => selected.includes(id);

	const handleSort = (column) => {
		const isAsc = sortBy === column && sortOrder === 'asc';
		setSortOrder(isAsc ? 'desc' : 'asc');
		setSortBy(column);
	};

	const handleArchiveSelected = () => {
		setConfirmDialog({
			open: true,
			title: 'Archive Selected Reports',
			message: `Are you sure you want to archive ${selected.length} selected report(s)?`,
			action: () => bulkArchiveMutation.mutate({ reportIds: selected }, { onSuccess: () => setSelected([]) }),
			confirmColor: 'warning'
		});
	};

	const handleDeleteSelected = () => {
		setConfirmDialog({
			open: true,
			title: 'Delete Selected Reports',
			message: `Are you sure you want to delete ${selected.length} selected report(s)? This cannot be undone.`,
			action: () => bulkDeleteMutation.mutate({ reportIds: selected }, { onSuccess: () => setSelected([]) }),
			confirmColor: 'error'
		});
	};

	const handleArchive = (report) => {
		setConfirmDialog({
			open: true,
			title: 'Archive Report',
			message: `Archive planting report for ${report.farmerName}?`,
			action: () => archiveMutation.mutate({ id: report.id }),
			confirmColor: 'warning'
		});
	};

	const handleDelete = (report) => {
		setConfirmDialog({
			open: true,
			title: 'Delete Report',
			message: `Delete planting report for ${report.farmerName}? This cannot be undone.`,
			action: () => deleteMutation.mutate(report.id),
			confirmColor: 'error'
		});
	};

	const handleConfirm = () => {
		if (confirmDialog.action) {
			confirmDialog.action();
		}
		setConfirmDialog({ open: false, title: '', message: '', action: null, confirmColor: 'primary' });
	};

	const handleCancel = () => {
		setConfirmDialog({ open: false, title: '', message: '', action: null, confirmColor: 'primary' });
	};

	if (isLoading) return isMobile ? <CardLoadingSkeleton count={5} /> : <TableLoadingSkeleton />;
	if (error) return <EmptyState message={`Error: ${error.message}`} />;
	if (!reports || reports.length === 0) return <EmptyState message="No harvested reports found" />;

	const numSelected = selected.length;
	const rowCount = reports.length;

	if (isMobile) {
		return (
			<Box>
				{reports.map((report) => (
					<MobileReportCard key={report.id} report={report} onView={onView} onEdit={onEdit} />
				))}
				<PaginationControls pagination={pagination} totalRecords={totalRecords} />
			</Box>
		);
	}

	return (
		<Box>
			{numSelected > 0 && (
				<Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, bgcolor: 'success.lighter' }}>
					<Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">
						{numSelected} selected
					</Typography>
					<Tooltip title="Archive Selected">
						<IconButton onClick={handleArchiveSelected}>
							<ArchiveIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Delete Selected">
						<IconButton onClick={handleDeleteSelected} color="error">
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</Toolbar>
			)}

			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell padding="checkbox">
								<Checkbox
									indeterminate={numSelected > 0 && numSelected < rowCount}
									checked={rowCount > 0 && numSelected === rowCount}
									onChange={handleSelectAllClick}
								/>
							</TableCell>
							{TABLE_COLUMNS.HARVESTED.map((col) => (
								<TableCell key={col.id} align={col.align || 'left'} sx={{ fontWeight: 'bold' }}>
									{col.sortable ? (
										<TableSortLabel
											active={sortBy === col.id}
											direction={sortBy === col.id ? sortOrder : 'asc'}
											onClick={() => handleSort(col.id)}
										>
											{col.label}
										</TableSortLabel>
									) : (
										col.label
									)}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{reports.map((report, index) => {
							const isItemSelected = isSelected(report.id);
							return (
								<TableRow
									hover
									key={report.id}
									selected={isItemSelected}
									onClick={(e) => handleRowClick(e, report.id, index)}
									sx={{ cursor: 'pointer' }}
								>
									<TableCell padding="checkbox">
										<Checkbox checked={isItemSelected} />
									</TableCell>
									<TableCell>{report.farmerName}</TableCell>
									<TableCell>{report.farmLocation}</TableCell>
									<TableCell>{report.typeOfCrop}</TableCell>
								<TableCell>{report.variety?.name || 'N/A'}</TableCell>


									<TableCell align="right">
										<Tooltip title="View">
											<IconButton size="small" onClick={() => onView(report)}>
												<VisibilityIcon fontSize="small" />
											</IconButton>
										</Tooltip>
										<Tooltip title="Edit">
											<IconButton size="small" onClick={() => onEdit(report)}>
												<EditIcon fontSize="small" />
											</IconButton>
										</Tooltip>
										{canArchive(report) && (
											<Tooltip title="Archive">
												<IconButton size="small" onClick={() => handleArchive(report)}>
													<ArchiveIcon fontSize="small" />
												</IconButton>
											</Tooltip>
										)}
										<Tooltip title="Delete">
											<IconButton size="small" onClick={() => handleDelete(report)} color="error">
												<DeleteIcon fontSize="small" />
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>

			<PaginationControls pagination={pagination} totalRecords={totalRecords} />

			<ConfirmDialog
				open={confirmDialog.open}
				title={confirmDialog.title}
				message={confirmDialog.message}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
				confirmColor={confirmDialog.confirmColor}
			/>
		</Box>
	);
}

export default HarvestedReportsTable;
