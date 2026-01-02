/**
 * RegularReportsTable Component
 * Table for regular reports (no distribution link)
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
import UnarchiveIcon from '@mui/icons-material/Unarchive';

import {
	useAllReports,
	useDeleteReport,
	useArchiveReport,
	useUnarchiveReport,
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

import { PLANTING_STATES, STATE_SUB_TABS, TABLE_COLUMNS } from '../../constants/plantingReportConstants';

export function RegularReportsTable({ stateSubTab, search, filters, pagination, onView, onEdit }) {
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
		// Destructure filters to remove 'state' since we handle it via stateSubTab
		const { state: _, ...restFilters } = filters || {};
		
		const result = {
			page: pagination.page,
			limit: pagination.limit,
			search,
			// Don't filter by distributionLinked - show all reports including distribution ones
			sortBy,
			sortOrder,
			...restFilters
		};

		if (stateSubTab === STATE_SUB_TABS.PLANTING) {
			result.state = PLANTING_STATES.PLANTING;
			result.isArchived = false;
		} else if (stateSubTab === STATE_SUB_TABS.PLANTED) {
			result.state = PLANTING_STATES.PLANTED;
			result.isArchived = false;
		} else if (stateSubTab === STATE_SUB_TABS.HARVESTED) {
			result.state = PLANTING_STATES.HARVESTED;
			result.isArchived = false;
		} else if (stateSubTab === STATE_SUB_TABS.ARCHIVED) {
			result.isArchived = true;
		} else {
			result.isArchived = false;
		}

		return result;
	}, [filters, pagination.limit, pagination.page, search, sortBy, sortOrder, stateSubTab]);

	const { data, isLoading, error } = useAllReports(queryFilters);

	const deleteMutation = useDeleteReport();
	const archiveMutation = useArchiveReport();
	const unarchiveMutation = useUnarchiveReport();
	const bulkArchiveMutation = useBulkArchive();
	const bulkDeleteMutation = useBulkDelete();

	const closeDialog = () => setConfirmDialog({ open: false, title: '', message: '', action: null, confirmColor: 'primary' });

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

	const handleDelete = (id) => {
		setConfirmDialog({
			open: true,
			title: 'Delete Report?',
			message: 'This report will be moved to deleted reports. You can restore it within 30 days.',
			action: () => {
				deleteMutation.mutate(id, {
					onSuccess: closeDialog
				});
			},
			confirmColor: 'error'
		});
	};

	const handleArchive = (id) => {
		setConfirmDialog({
			open: true,
			title: 'Archive Report?',
			message: 'This report will be moved to the archived tab.',
			action: () => {
				archiveMutation.mutate(id, {
					onSuccess: closeDialog
				});
			},
			confirmColor: 'warning'
		});
	};

	const handleUnarchive = (id) => {
		unarchiveMutation.mutate(id);
	};

	const handleBulkArchive = () => {
		if (selected.length === 0) return;

		setConfirmDialog({
			open: true,
			title: `Archive ${selected.length} Reports?`,
			message: `${selected.length} reports will be moved to the archived tab.`,
			action: () => {
				bulkArchiveMutation.mutate(selected, {
					onSuccess: () => {
						setSelected([]);
						closeDialog();
					}
				});
			},
			confirmColor: 'warning'
		});
	};

	const handleBulkDelete = () => {
		if (selected.length === 0) return;

		setConfirmDialog({
			open: true,
			title: `Delete ${selected.length} Reports?`,
			message: `${selected.length} reports will be moved to deleted reports. You can restore them within 30 days.`,
			action: () => {
				bulkDeleteMutation.mutate(selected, {
					onSuccess: () => {
						setSelected([]);
						closeDialog();
					}
				});
			},
			confirmColor: 'error'
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
		return <EmptyState title="Error Loading Reports" message={error.message || 'Failed to load reports. Please try again.'} />;
	}

	if (!data?.data || data.data.length === 0) {
		return <EmptyState title="No Reports Found" message="No reports match your current filters." />;
	}

	const reports = data.data;
	const paginationInfo = pagination.getPaginationInfo(data.pagination, reports.length);

	if (isMobile) {
		return (
			<Box sx={{ p: 2 }}>
				{reports.map((report) => (
					<MobileReportCard
						key={report.id}
						report={report}
						onView={onView}
						onEdit={onEdit}
						onDelete={handleDelete}
						onArchive={handleArchive}
						onUnarchive={handleUnarchive}
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
					loading={deleteMutation.isPending || archiveMutation.isPending}
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
				<Toolbar sx={{ pl: 2, pr: 1, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
					<Typography sx={{ flex: '1 1 100%' }} variant="subtitle1">
						{numSelected} selected
					</Typography>
					<Tooltip title="Archive Selected">
						<Button variant="contained" color="inherit" onClick={handleBulkArchive} startIcon={<ArchiveIcon />} sx={{ mr: 1 }}>
							Archive
						</Button>
					</Tooltip>
					<Tooltip title="Delete Selected">
						<Button variant="contained" color="error" onClick={handleBulkDelete} startIcon={<DeleteIcon />}>
							Delete
						</Button>
					</Tooltip>
				</Toolbar>
			)}

			<TableContainer sx={{ bgcolor: 'background.paper' }}>
				<Table>
					<TableHead sx={{ bgcolor: 'action.hover' }}>
						<TableRow>
							<TableCell padding="checkbox">
								<Checkbox
									indeterminate={numSelected > 0 && numSelected < rowCount}
									checked={rowCount > 0 && numSelected === rowCount}
									onChange={handleSelectAll}
								/>
							</TableCell>
							{TABLE_COLUMNS.REGULAR.map((col) => (
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

							return (
								<TableRow key={report.id} hover selected={isItemSelected}>
									<TableCell padding="checkbox">
										<Checkbox checked={isItemSelected} onChange={(event) => handleSelectOne(report.id, event)} />
									</TableCell>
									<TableCell>{report.farmerName}</TableCell>
									<TableCell>{report.farmLocation}</TableCell>
									<TableCell>{report.typeOfCrop}</TableCell>
									<TableCell>{report.variety?.name || 'N/A'}</TableCell>
								<TableCell>
									<Chip label={getStateLabel(report.state)} size="small" color={getStateColor(report.state)} />
								</TableCell>
								<TableCell align="right">
										<Box sx={{ display: 'flex', gap: 0.5 }}>
											<Tooltip title="View">
												<IconButton size="small" onClick={() => onView?.(report)}>
													<VisibilityIcon fontSize="small" />
												</IconButton>
											</Tooltip>
											<Tooltip title="Edit">
												<IconButton size="small" onClick={() => onEdit?.(report)}>
													<EditIcon fontSize="small" />
												</IconButton>
											</Tooltip>
											{report.isArchived ? (
												<Tooltip title="Unarchive">
													<IconButton size="small" onClick={() => handleUnarchive(report.id)}>
														<UnarchiveIcon fontSize="small" />
													</IconButton>
												</Tooltip>
											) : (
												canArchive(report.state, report.isArchived) && (
													<Tooltip title="Archive">
														<IconButton size="small" onClick={() => handleArchive(report.id)}>
															<ArchiveIcon fontSize="small" />
														</IconButton>
													</Tooltip>
												)
											)}
											<Tooltip title="Delete">
												<IconButton size="small" color="error" onClick={() => handleDelete(report.id)}>
													<DeleteIcon fontSize="small" />
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
					deleteMutation.isPending ||
					archiveMutation.isPending ||
					bulkArchiveMutation.isPending ||
					bulkDeleteMutation.isPending
				}
			/>
		</Box>
	);
}

export default RegularReportsTable;
