/**
 * PlantingReports Dashboard (Refactored)
 * Main orchestrator with 3-tab structure
 */

import React, { useCallback, useState } from 'react';
import { Box, Container, Paper, Typography, Tabs, Tab, Fab, Tooltip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';

import FilterPanel from './components/Filters/FilterPanel';
import RegularReportsTable from './components/Tables/RegularReportsTable';
import DistributionReportsTable from './components/Tables/DistributionReportsTable';
import HarvestedReportsTable from './components/Tables/HarvestedReportsTable';
import DeletedReportsTable from './components/Tables/DeletedReportsTable';
import ReportModal from './components/ReportModal';
import ReferenceManagementPanel from './components/ReferenceManagementPanel';
import ErrorBoundary from './components/common/ErrorBoundary';

import { usePagination } from './hooks/usePagination';
import { useResponsive } from './hooks/useResponsive';
import { useReportSummary } from './hooks/usePlantingReportQueries';

import { MAIN_TABS, STATE_SUB_TABS } from './constants/plantingReportConstants';

function PlantingReports() {
	const { t } = useTranslation('plantingReports');
	const { isMobile } = useResponsive();

	const [mainTab, setMainTab] = useState(MAIN_TABS.ALL);
	const [search, setSearch] = useState('');
	const [filters, setFilters] = useState({
		state: '',
		typeOfCrop: '',
		varietyId: '',
		croppingSeasonId: '',
		dateRange: { start: null, end: null }
	});

	const { data: summaryData } = useReportSummary();

	const pagination = usePagination();

	const [modalOpen, setModalOpen] = useState(false);
	const [selectedReport, setSelectedReport] = useState(null);
	const [modalMode, setModalMode] = useState('create');

	const [referencePanelOpen, setReferencePanelOpen] = useState(false);

	const handleMainTabChange = useCallback(
		(event, newValue) => {
			setMainTab(newValue);
			setFilters(prev => ({ ...prev, state: '' }));
			pagination.reset();
		},
		[pagination]
	);

	const handleCreateReport = useCallback(() => {
		setSelectedReport(null);
		setModalMode('create');
		setModalOpen(true);
	}, []);

	const handleViewReport = useCallback((report) => {
		setSelectedReport(report);
		setModalMode('view');
		setModalOpen(true);
	}, []);

	const handleEditReport = useCallback((report) => {
		setSelectedReport(report);
		setModalMode('edit');
		setModalOpen(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setModalOpen(false);
		setSelectedReport(null);
	}, []);

	const handleSearchChange = useCallback(
		(value) => {
			setSearch(value);
			// Don't reset pagination - let user stay on current page
		},
		[]
	);

	const handleFiltersChange = useCallback(
		(newFilters) => {
			setFilters(newFilters);
			pagination.reset();
		},
		[pagination]
	);

	const allCount = summaryData?.total || 0;
	const distributionCount = summaryData?.distribution || 0;
	const harvestedCount = summaryData?.harvested || 0;
	const deletedCount = summaryData?.deleted || 0;

	return (
		<ErrorBoundary>
			<Box sx={{ pt: '80px', px: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
					<Typography variant="h4" fontWeight={700} color="success.main">
						{t('title') || 'Planting Reports'}
					</Typography>
					<Tooltip title="Manage Varieties & Seasons">
						<IconButton
							onClick={() => setReferencePanelOpen(true)}
							color="success"
							sx={{ 
								bgcolor: 'success.lighter',
								'&:hover': { bgcolor: 'success.light' }
							}}
						>
							<SettingsIcon />
						</IconButton>
					</Tooltip>
				</Box>

				<Paper 
					elevation={2}
					sx={{ 
						mb: 2,
						borderRadius: 2,
						boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
					}}
				>
					<Tabs
						value={mainTab}
						onChange={handleMainTabChange}
						variant={isMobile ? 'fullWidth' : 'standard'}
						sx={{ 
							'& .MuiTabs-indicator': {
								backgroundColor: 'success.main',
								height: 3
							},
							'& .MuiTab-root': {
								fontWeight: 600,
								textTransform: 'none',
								fontSize: '1rem',
								color: 'success.main'
							},
							'& .Mui-selected': {
								color: 'success.main'
							}
						}}
					>
						<Tab label={`${t('tabs.all')} (${allCount})`} value={MAIN_TABS.ALL} />
						<Tab label={`${t('tabs.distribution')} (${distributionCount})`} value={MAIN_TABS.DISTRIBUTION} />
						<Tab label={`${t('tabs.harvested')} (${harvestedCount})`} value={MAIN_TABS.HARVESTED} />
						<Tab label={`${t('tabs.deleted')} (${deletedCount})`} value={MAIN_TABS.DELETED} />
					</Tabs>
				</Paper>

				<FilterPanel
					search={search}
					filters={filters}
					onSearchChange={handleSearchChange}
					onFiltersChange={handleFiltersChange}
					mainTab={mainTab}
			/>

			<Paper
					elevation={2}
					sx={{ 
						mt: 2,
						borderRadius: 2,
						boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
					}}
				>
					{mainTab === MAIN_TABS.ALL && (
						<RegularReportsTable
							stateSubTab={filters.state || STATE_SUB_TABS.ALL}
							search={search}
							filters={filters}
							pagination={pagination}
							onView={handleViewReport}
							onEdit={handleEditReport}
						/>
					)}

					{mainTab === MAIN_TABS.DISTRIBUTION && (
						<DistributionReportsTable
							stateSubTab={filters.state || STATE_SUB_TABS.ALL}
							search={search}
							filters={filters}
							pagination={pagination}
							onView={handleViewReport}
							onEdit={handleEditReport}
						/>
					)}
				{mainTab === MAIN_TABS.HARVESTED && (
					<HarvestedReportsTable
						search={search}
						filters={filters}
						pagination={pagination}
						onView={handleViewReport}
						onEdit={handleEditReport}
					/>
				)}
					{mainTab === MAIN_TABS.DELETED && (
						<DeletedReportsTable search={search} filters={filters} pagination={pagination} onView={handleViewReport} />
					)}
					</Paper>

				{mainTab !== MAIN_TABS.DELETED && (
					<Fab
						color="success"
						aria-label="create report"
						onClick={handleCreateReport}
						sx={{ position: 'fixed', bottom: isMobile ? 16 : 24, right: isMobile ? 16 : 24 }}
					>
						<AddIcon />
					</Fab>
				)}

				<ReportModal open={modalOpen} mode={modalMode} report={selectedReport} onClose={handleCloseModal} />

				<ReferenceManagementPanel open={referencePanelOpen} onClose={() => setReferencePanelOpen(false)} />
			</Box>
	</ErrorBoundary>
	);
}
export default PlantingReports;
