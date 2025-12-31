/**
 * DeletedReportsTable Component
 * Table for soft-deleted reports (30-day retention)
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
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import WarningIcon from '@mui/icons-material/Warning';
import VisibilityIcon from '@mui/icons-material/Visibility';

import {
	useDeletedReports,
	useRestoreReport,
	usePermanentDeleteReport,
	useBulkRestore,
	useBulkPermanentDelete
} from '../../hooks/usePlantingReportQueries';
import { useResponsive } from '../../hooks/useResponsive';

import MobileReportCard from '../common/MobileReportCard';
import { TableLoadingSkeleton, CardLoadingSkeleton } from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import ConfirmDialog from '../common/ConfirmDialog';
import PaginationControls from '../Pagination/PaginationControls';

import { formatDate, calculateDaysRemaining } from '../../utils/dateHelpers';
import { getStateLabel, getStateColor } from '../../utils/stateHelpers';
import { TABLE_COLUMNS } from '../../constants/plantingReportConstants';

export function DeletedReportsTable({ search, filters, pagination, onView }) {
	const { isMobile } = useResponsive();

	const [selected, setSelected] = useState([]);
	const [lastSelected, setLastSelected] = useState(null);
	const [sortBy, setSortBy] = useState('');
	const [sortOrder, setSortOrder] = useState('asc');
	const [confirmDialog, setConfirmDialog] = useState({
		open: false,
		title: '',
		message: '',
		confirmColor: 'warning',
		action: null
	});

	const queryFilters = useMemo(
		() => ({
			page: pagination.page,
			limit: pagination.limit,
			search,
			sortBy,
			sortOrder,
			...(filters || {})
		}),
		[filters, pagination.limit, pagination.page, search, sortBy, sortOrder]
	);

	const { data, isLoading, error } = useDeletedReports(queryFilters);
	const restoreMutation = useRestoreReport();
	const permanentDeleteMutation = usePermanentDeleteReport();
	const bulkRestoreMutation = useBulkRestore();
	const bulkPermanentDeleteMutation = useBulkPermanentDelete();

	const closeDialog = () =>
		setConfirmDialog({ open: false, title: '', message: '', confirmColor: 'warning', action: null });

	const handleSelectAll = (event) => {
		if (event.target.checked) {
			setSelected(data?.data.map((r) => r.id) || []);
		} else {
			setSelected([]);
		}
	};

	const handleSelectOne = (id, event) => {
		if (event?.shiftKey && lastSelected !== null && Array.isArray(data?.data)) {
			const ids = data.data.map((r) => r.id);
			const start = ids.indexOf(lastSelected);
			const end = ids.indexOf(id);
			if (start !== -1 && end !== -1) {
				const range = ids.slice(Math.min(start, end), Math.max(start, end) + 1);
				setSelected((prev) => Array.from(new Set([...prev, ...range])));
			}
		} else {
			setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
		}
		setLastSelected(id);
	};

	const handleRestore = (id) => {
		setConfirmDialog({
			open: true,
			title: 'Restore Report?',
			message: 'This report will be restored to its previous state.',
			confirmColor: 'primary',
			action: () => {
				restoreMutation.mutate(id, { onSuccess: closeDialog });
			}
		});
	};

	const handlePermanentDelete = (id) => {
		setConfirmDialog({
			open: true,
			title: 'Permanent Delete?',
			message: 'This action cannot be undone. The report will be permanently deleted.',
			confirmColor: 'error',
			action: () => {
				permanentDeleteMutation.mutate(id, { onSuccess: closeDialog });
			}
		});
	};

	const handleBulkRestore = () => {
		if (selected.length === 0) return;
		setConfirmDialog({
			open: true,
			title: `Restore ${selected.length} Reports?`,
			message: `${selected.length} reports will be restored to their previous states.`,
			confirmColor: 'primary',
			action: () => {
				bulkRestoreMutation.mutate(selected, {
					onSuccess: () => {
						setSelected([]);
						closeDialog();
					}
				});
			}
		});
	};

	const handleBulkPermanentDelete = () => {
		if (selected.length === 0) return;
		setConfirmDialog({
			open: true,
			title: `Permanent Delete ${selected.length} Reports?`,
			message: 'This action cannot be undone. All selected reports will be permanently deleted.',
			confirmColor: 'error',
			action: () => {
				bulkPermanentDeleteMutation.mutate(selected, {
					onSuccess: () => {
						setSelected([]);
						closeDialog();
					}
				});
			}
		});
	};

	const handleSort = (columnId) => {
		if (!columnId) return;
		if (sortBy === columnId) {
			setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortBy(columnId);
			setSortOrder('asc');
		}
	};

	if (isLoading) {
		return isMobile ? <CardLoadingSkeleton /> : <TableLoadingSkeleton />;
	}

	if (error) {
		return <EmptyState title="Error Loading Deleted Reports" message={error.message || 'Failed to load deleted reports. Please try again.'} />;
	}

	if (!data?.data || data.data.length === 0) {
		return <EmptyState title="No Deleted Reports" message="All deleted reports have been restored or permanently removed." />;
	}

	const reports = data.data.map((report) => ({
		...report,
		daysRemaining: report.daysUntilPermanentDelete ?? 0
	}));
	const paginationInfo = pagination.getPaginationInfo(data.pagination, reports.length);

	if (isMobile) {
		return (
			<Box sx={{ p: 2 }}>
				{reports.map((report) => (
					<MobileReportCard
						key={report.id}
						report={report}
						onView={onView}
						onRestore={handleRestore}
						onDelete={handlePermanentDelete}
						showDaysRemaining
					/>
				))}

				<PaginationControls
					pagination={paginationInfo}
					onPageChange={pagination.goToPage}
					onLimitChange={pagination.changeLimit}
				/>

				<ConfirmDialog
					open={confirmDialog.open}
					title={confirmDialog.title}
					message={confirmDialog.message}
					onConfirm={confirmDialog.action || closeDialog}
					onCancel={closeDialog}
					confirmColor={confirmDialog.confirmColor}
					loading={restoreMutation.isPending || permanentDeleteMutation.isPending}
				/>
			</Box>
		);
	}

	const isSelected = (id) => selected.includes(id);
	const numSelected = selected.length;
	const rowCount = reports.length;

	return (
		<Box>
			{numSelected > 0 && (
				<Toolbar sx={{ pl: 2, pr: 1, bgcolor: 'warning.light' }}>
					<Typography sx={{ flex: '1 1 100%' }} variant="subtitle1">
						{numSelected} selected
					</Typography>
					<Tooltip title="Restore Selected">
						<Button variant="contained" color="primary" onClick={handleBulkRestore} startIcon={<RestoreIcon />} sx={{ mr: 1 }}>
							Restore
						</Button>
					</Tooltip>
					<Tooltip title="Permanent Delete Selected">
						<Button variant="contained" color="error" onClick={handleBulkPermanentDelete} startIcon={<DeleteForeverIcon />}>
							Permanent Delete
						</Button>
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
									onChange={handleSelectAll}
								/>
							</TableCell>
							{TABLE_COLUMNS.DELETED.map((col) => (
								<TableCell key={col.id} sortDirection={sortBy === col.id ? sortOrder : false}>
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
						{reports.map((report) => {
							const isItemSelected = isSelected(report.id);
							const isDanger = report.daysRemaining <= 7;

							return (
								<TableRow key={report.id} hover selected={isItemSelected} sx={isDanger ? { bgcolor: 'error.lighter' } : {}}>
									<TableCell padding="checkbox">
										<Checkbox checked={isItemSelected} onChange={(event) => handleSelectOne(report.id, event)} />
									</TableCell>
									<TableCell>{report.farmerName}</TableCell>
									<TableCell>{report.farmLocation}</TableCell>
									<TableCell>{report.typeOfCrop}</TableCell>
									<TableCell>
										<Chip label={getStateLabel(report.state)} size="small" color={getStateColor(report.state)} />
									</TableCell>
									<TableCell>{formatDate(report.deletedAt)}</TableCell>
									<TableCell>
										<Chip
											label={`${report.daysRemaining} days`}
											size="small"
											color={isDanger ? 'error' : 'warning'}
											icon={isDanger ? <WarningIcon /> : undefined}
										/>
									</TableCell>
									<TableCell>
										<Box sx={{ display: 'flex', gap: 0.5 }}>
											<Tooltip title="View">
												<IconButton size="small" color="info" onClick={() => onView?.(report)}>
													<VisibilityIcon fontSize="small" />
												</IconButton>
											</Tooltip>
											<Tooltip title="Restore">
												<IconButton size="small" color="primary" onClick={() => handleRestore(report.id)}>
													<RestoreIcon fontSize="small" />
												</IconButton>
											</Tooltip>
											<Tooltip title="Permanent Delete">
												<IconButton size="small" color="error" onClick={() => handlePermanentDelete(report.id)}>
													<DeleteForeverIcon fontSize="small" />
												</IconButton>
											</Tooltip>
										</Box>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>

			<PaginationControls
				pagination={paginationInfo}
				onPageChange={pagination.goToPage}
				onLimitChange={pagination.changeLimit}
			/>

			<ConfirmDialog
				open={confirmDialog.open}
				title={confirmDialog.title}
				message={confirmDialog.message}
				onConfirm={confirmDialog.action || closeDialog}
				onCancel={closeDialog}
				confirmColor={confirmDialog.confirmColor}
				loading={
					restoreMutation.isPending ||
					permanentDeleteMutation.isPending ||
					bulkRestoreMutation.isPending ||
					bulkPermanentDeleteMutation.isPending
				}
			/>
		</Box>
	);
}

export default DeletedReportsTable;
