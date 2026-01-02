/**
 * MobileReportCard Component
 * Card layout for mobile devices (replaces table rows)
 */

import React from 'react';
import {
	Card,
	CardContent,
	CardActions,
	Typography,
	Chip,
	Box,
	IconButton,
	Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import WarningIcon from '@mui/icons-material/Warning';
import { getStateLabel, getStateColor } from '../../utils/stateHelpers';

export function MobileReportCard({
	report,
	onView,
	onEdit,
	onDelete,
	onArchive,
	onUnarchive,
	onRestore,
	showDistribution = false,
	showDaysRemaining = false
}) {
	return (
		<Card
			sx={{
				mb: 2,
				bgcolor: 'background.paper',
				borderColor: 'divider',
				'&:hover': {
					boxShadow: 3
				}
			}}
		>
			<CardContent>
				{/* Header: Farmer Name + State Chip */}
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
					<Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1 }} color="text.primary">
						{report.farmerName}
					</Typography>
					<Chip label={getStateLabel(report.state)} size="small" color={getStateColor(report.state)} sx={{ ml: 1 }} />
				</Box>

				{/* Farm Location */}
				<Typography variant="body2" color="text.secondary" gutterBottom>
					Location: {report.farmLocation}
				</Typography>

				{/* Crop Info */}
				<Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
					<Typography variant="body2" color="text.secondary">
						Crop: {report.typeOfCrop}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						• {report.variety?.name || 'N/A'}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						• {report.areaPlanted} ha
					</Typography>
				</Box>

				{/* Distribution Info (if applicable) */}
				{showDistribution && report.distributionRequest && (
					<Chip
						label={`Distribution #${report.distributionRequestId}`}
						size="small"
						variant="outlined"
						color="info"
						sx={{ mt: 0.5 }}
					/>
				)}

				{/* Archived Badge */}
				{report.isArchived && <Chip label="Archived" size="small" color="default" sx={{ mt: 0.5, ml: 1 }} />}
				
				{/* Days Remaining (for deleted reports) */}
				{showDaysRemaining && report.daysRemaining !== undefined && (
					<Chip
						label={`${report.daysRemaining} days remaining`}
						size="small"
						color={report.daysRemaining <= 7 ? 'error' : 'warning'}
						icon={report.daysRemaining <= 7 ? <WarningIcon /> : undefined}
						sx={{ mt: 0.5 }}
					/>
				)}
			</CardContent>

			{/* Actions */}
			<CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
				{onView && (
					<Tooltip title="View Details">
						<IconButton size="small" color="primary" onClick={() => onView(report)}>
							<VisibilityIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				)}

				{onEdit && (
					<Tooltip title="Edit">
						<IconButton size="small" color="primary" onClick={() => onEdit(report)}>
							<EditIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				)}

				{onRestore && (
					<Tooltip title="Restore">
						<IconButton size="small" color="primary" onClick={() => onRestore(report.id)}>
							<RestoreIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				)}

				{onArchive && !report.isArchived && report.state === 'Completed' && (
					<Tooltip title="Archive">
						<IconButton size="small" color="default" onClick={() => onArchive(report.id)}>
							<ArchiveIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				)}

				{onUnarchive && report.isArchived && (
					<Tooltip title="Unarchive">
						<IconButton size="small" color="default" onClick={() => onUnarchive(report.id)}>
							<UnarchiveIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				)}

				{onDelete && !onRestore && (
					<Tooltip title="Delete">
						<IconButton size="small" color="error" onClick={() => onDelete(report.id)}>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				)}

				{onDelete && onRestore && (
					<Tooltip title="Permanent Delete">
						<IconButton size="small" color="error" onClick={() => onDelete(report.id)}>
							<DeleteForeverIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				)}
			</CardActions>
		</Card>
	);
}

export default MobileReportCard;
