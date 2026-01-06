import React, { useEffect, useMemo } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	IconButton,
	Typography,
	Divider,
	CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { PLANTING_STATES } from '../../constants/plantingReportConstants';
import { useResponsive } from '../../hooks/useResponsive';
import { useReportForm } from '../../hooks/useReportForm';
import { useCreateReport, useUpdateReport } from '../../hooks/usePlantingReportQueries';
import { getModalTitle, getReadOnlySections, getVisibleSections } from '../../utils/modalHelpers';
import { useActiveVarieties, useActiveSeasons } from '../../hooks/useReferenceData';

import StateWorkflowIndicator from './StateWorkflowIndicator';
import FarmerInfoSection from './FarmerInfoSection';
import SeedingDetailsSection from './SeedingDetailsSection';
import PlantingDetailsSection from './PlantingDetailsSection';
import HarvestingSection from './HarvestingSection';
import DistributionMetadataSection from './DistributionMetadataSection';
import StateTransitionButtons from './StateTransitionButtons';
import ErrorDisplay from '../common/ErrorDisplay';

export default function ReportModal({ open, mode = 'create', report = null, onClose }) {
	const { isMobile } = useResponsive();
	const currentState = report?.state || PLANTING_STATES.PLANTING;
	
	// Debug logging
	useEffect(() => {
		if (open) {
			console.log('🔵 [ReportModal] Opened', { 
				mode, 
				reportId: report?.id,
				reportState: report?.state, 
				currentState,
				hasReport: !!report 
			});
		}
	}, [open, mode, report, currentState]);

	const {
		formData,
		errors,
		handleChange,
		handleBlur,
		validateForm,
		resetForm,
		setFields,
		isValid
	} = useReportForm(report, currentState);

	const createMutation = useCreateReport();
	const updateMutation = useUpdateReport();
	const { data: varietiesData } = useActiveVarieties();
	const { data: seasonsData } = useActiveSeasons();

	useEffect(() => {
		if (!open) return;

		if (report) {
			// Validate variety and season IDs before setting fields
			const varieties = Array.isArray(varietiesData?.data) ? varietiesData.data : Array.isArray(varietiesData) ? varietiesData : [];
			const seasons = Array.isArray(seasonsData?.data) ? seasonsData.data : Array.isArray(seasonsData) ? seasonsData : [];
			
			const sanitizedReport = { ...report };
			
			// Check if varietyId still exists in database
			if (report.varietyId) {
				const varietyExists = varieties.some(v => String(v.id) === String(report.varietyId));
				if (!varietyExists) {
					console.warn(`⚠️ Variety ID ${report.varietyId} no longer exists, resetting to empty`);
					sanitizedReport.varietyId = '';
				}
			}
			
			// Check if croppingSeasonId still exists in database
			if (report.croppingSeasonId) {
				const seasonExists = seasons.some(s => String(s.id) === String(report.croppingSeasonId));
				if (!seasonExists) {
					console.warn(`⚠️ Season ID ${report.croppingSeasonId} no longer exists, resetting to empty`);
					sanitizedReport.croppingSeasonId = '';
				} else {
					console.log(`✓ Cropping season ${report.croppingSeasonId} exists, will be set`);
				}
			} else {
				console.log(`⚠️ Report has no croppingSeasonId:`, report);
			}
			
			console.log('Setting fields with sanitized report:', sanitizedReport);
			setFields(sanitizedReport);
		} else {
			resetForm();
		}
	}, [open, report, setFields, resetForm, varietiesData, seasonsData]);

	// Auto-calculate expected harvest date based on variety DAS and planting date
	useEffect(() => {
		if (!formData.varietyId || !formData.dateOfPlanting || !formData.plantingMethod) {
			return;
		}

		const varieties = Array.isArray(varietiesData?.data) ? varietiesData.data : Array.isArray(varietiesData) ? varietiesData : [];
		// Handle both string and number IDs
		const variety = varieties.find(v => String(v.id) === String(formData.varietyId));

		if (!variety || variety.cropType !== 'Rice') {
			return;
		}

		const isTransplanting = formData.plantingMethod === 'Transplanting';
		const das = isTransplanting ? variety.transplantedDAS : variety.directSeededDAS;

		if (!das || das <= 0) {
			return;
		}

		const plantingDate = new Date(formData.dateOfPlanting);
		const expectedDate = new Date(plantingDate);
		expectedDate.setDate(plantingDate.getDate() + das);

		// Only update if it's different from current value
		const currentExpected = formData.dateOfExpectedHarvest ? new Date(formData.dateOfExpectedHarvest).toDateString() : null;
		const newExpected = expectedDate.toDateString();

		if (currentExpected !== newExpected) {
			setFields({ dateOfExpectedHarvest: expectedDate.toISOString() });
		}
	}, [formData.varietyId, formData.dateOfPlanting, formData.plantingMethod, formData.typeOfCrop, formData.dateOfExpectedHarvest, varietiesData, setFields]);

	const loading = createMutation.isPending || updateMutation.isPending;
	const readOnly = mode === 'view' || report?.isArchived || report?.isDeleted;

	const visibility = useMemo(() => getVisibleSections(currentState, mode), [currentState, mode]);
	// Admin has full control - no readonly sections
	const readOnlySections = useMemo(
		() => ({}),
		[]
	);

	const handleClose = () => {
		if (loading) return;
		resetForm();
		onClose?.();
	};

	const handleSave = () => {
		// No validation for Save button - only validate on state transitions
		// Admin can save partial data at any time
		console.log('💾 [Save] Saving without validation', { mode, reportState: report?.state });

		// Helper to clean up form data - convert empty strings to null for numeric fields
		const sanitizeData = (data) => {
			const sanitized = { ...data };
			const numericFields = ['harvestArea', 'numberOfBags', 'weightPerBag', 'yieldMtPerHa', 'areaPlanted'];
			numericFields.forEach(field => {
				if (sanitized[field] === '' || sanitized[field] === undefined) {
					sanitized[field] = null;
				}
			});
			return sanitized;
		};

		// Helper to remove fields based on current state
		const removeStateSpecificFields = (data, currentState) => {
			const cleaned = { ...data };
			
			// Planting state: Can have planting details (needed to transition), NO harvest
			if (currentState === 'Planting') {
				delete cleaned.harvestArea;
				delete cleaned.numberOfBags;
				delete cleaned.weightPerBag;
				delete cleaned.yieldMtPerHa;
				// DON'T delete planting fields - they're needed to transition to Planted!
			}
			
			// Planted state: Has planting details, can add harvest (needed to transition)
			else if (currentState === 'Planted') {
				// Don't delete harvest fields - they're needed to transition to Harvested!
				// Only delete if explicitly null/empty
			}
			
			// Harvested state: Keep all fields
			else if (currentState === 'Harvested') {
				// Keep everything
			}
			
			return cleaned;
		};

		if (mode === 'create') {
			// Remove fields that shouldn't be in create payload for Request_Report state
			const {
				id,
				state,
				isArchived,
				isDeleted,
				createdAt,
				updatedAt,
				user,
				seedVariety,
				croppingSeason,
				distributionRequest,
				dateOfPlanting,
				plantingMethod,
				riceIrrigation,
				dateOfExpectedHarvest,
				harvestArea,
				numberOfBags,
				weightPerBag,
				yieldMtPerHa,
				...allowedFields
			} = formData;
			
			const sanitizedData = sanitizeData(allowedFields);
			console.log('Create payload:', sanitizedData);
			createMutation.mutate(sanitizedData, { onSuccess: handleClose });
		} else if (mode === 'edit' && report?.id) {
			// Remove fields that shouldn't be in the update payload
			const {
				id,
				state,
				isArchived,
				isDeleted,
				createdAt,
				updatedAt,
				archivedAt,
				archivedBy,
				deletedAt,
				deletedBy,
				user,
				seedVariety,
				variety,
				croppingSeason,
				distributionRequest,
				distributionRequestId,
				distributionItemId,
				distributionQuantity,
				distributionUnit,
				distributedQuantity,
				distributionPickupDate,
				requestNote,
				plantingReportDeadline,
				lastUpdatedBy,
				...dataToSend
			} = formData;
			
			// Sanitize first, then remove state-specific fields
			const sanitizedData = sanitizeData(dataToSend);
			const cleanedData = removeStateSpecificFields(sanitizedData, report.state);
			
			console.log('Edit payload for state', report.state, ':', cleanedData);
			updateMutation.mutate({ id: report.id, data: cleanedData }, { onSuccess: handleClose });
		}
	};

	const mutationError = createMutation.error || updateMutation.error;
	const resetError = createMutation.isError ? createMutation.reset : updateMutation.reset;

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="md"
			fullWidth
			fullScreen={isMobile}
			scroll="paper"
			PaperProps={{
				sx: isMobile
					? {
						paddingTop: 'env(safe-area-inset-top)',
						paddingBottom: 'env(safe-area-inset-bottom)'
					}
					: {}
			}}
		>
			<DialogTitle
				sx={{
					position: isMobile ? 'sticky' : 'static',
					top: isMobile ? 0 : 'auto',
					bgcolor: 'background.paper',
					zIndex: 1,
					borderBottom: isMobile ? '1px solid' : 'none',
					borderColor: 'divider'
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Typography variant="h6" fontWeight={700} color="text.primary">
							{getModalTitle(mode, currentState)}
						</Typography>
						{report?.distributionRequestId && (
							<Box
								sx={{
									bgcolor: 'primary.main',
									color: 'white',
									px: 1.5,
									py: 0.5,
									borderRadius: 1,
									fontSize: '0.75rem',
									fontWeight: 600
								}}
							>
								Distribution Planting Report
							</Box>
						)}
					</Box>
					<IconButton onClick={handleClose} disabled={loading} aria-label="close modal">
						<CloseIcon />
					</IconButton>
				</Box>
				{report && <StateWorkflowIndicator currentState={currentState} />}
			</DialogTitle>

			<Divider />

			<DialogContent sx={{ pt: 2 }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
					{visibility.farmerInfo && (
						<FarmerInfoSection
							data={formData}
							errors={errors}
							onChange={handleChange}
							onBlur={handleBlur}
							readOnly={readOnlySections.farmerInfo}
						/>
					)}

					{visibility.seedingDetails && (
						<SeedingDetailsSection
							data={formData}
							errors={errors}
							onChange={handleChange}
							onBlur={handleBlur}
							readOnly={readOnlySections.seedingDetails}
						/>
					)}

					{visibility.plantingDetails && (
						<PlantingDetailsSection
							data={formData}
							errors={errors}
							onChange={handleChange}
							onBlur={handleBlur}
							readOnly={readOnlySections.plantingDetails}
						/>
					)}

					{visibility.harvesting && (
						<HarvestingSection
							data={formData}
							errors={errors}
							onChange={handleChange}
							onBlur={handleBlur}
							readOnly={readOnlySections.harvesting}
						/>
					)}

					{/* Distribution Metadata - Hidden as requested */}
					{/* {visibility.distributionMetadata && (
						<DistributionMetadataSection
							distributionId={report?.distributionRequestId || report?.distributionId}
							distribution={report?.distributionRequest}
						/>
					)} */}
				</Box>
			</DialogContent>

			<Divider />

			<DialogActions
				sx={{
					p: 2,
					flexDirection: { xs: 'column', sm: 'row' },
					justifyContent: 'space-between',
					gap: 1,
					position: isMobile ? 'sticky' : 'static',
					bottom: isMobile ? 0 : 'auto',
					bgcolor: isMobile ? 'background.paper' : undefined,
					borderTop: isMobile ? '1px solid' : undefined,
					borderColor: 'divider'
				}}
			>
				{report && (
					<Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
						<StateTransitionButtons
							report={report}
							formData={formData}
							onTransition={handleClose}
							disabled={loading}
						/>
					</Box>
				)}

				<Box
					sx={{
						display: 'flex',
						gap: 1,
						width: { xs: '100%', sm: 'auto' },
						ml: { xs: 0, sm: 'auto' }
					}}
				>
					<Button type="button" onClick={handleClose} disabled={loading} fullWidth={isMobile}>
						{readOnly ? 'Close' : 'Cancel'}
					</Button>
					{!readOnly && (
						<Button
							type="button"
							variant="contained"
							onClick={handleSave}
							disabled={loading}
							fullWidth={isMobile}
						>
							{loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : mode === 'create' ? 'Create' : 'Save'}
						</Button>
					)}
				</Box>
			</DialogActions>
		</Dialog>
	);
}
