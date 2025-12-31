/**
 * StatisticsCards Component
 * Displays summary statistics of planting reports
 */

import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton, Typography, useTheme } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SpaIcon from '@mui/icons-material/Spa';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import { useReportSummary } from '../../hooks/usePlantingReportQueries';
import { useResponsive } from '../../hooks/useResponsive';

function StatCard({ title, value, icon: Icon, color, loading }) {
	const theme = useTheme();

	if (loading) {
		return (
			<Card elevation={1} sx={{ height: '100%' }}>
				<CardContent sx={{ py: 1.5 }}>
					<Skeleton variant="text" width="60%" />
					<Skeleton variant="text" width="40%" height={36} />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card
			elevation={1}
			sx={{
				height: '100%',
				transition: 'transform 0.2s, box-shadow 0.2s',
				'&:hover': {
					transform: 'translateY(-2px)',
					boxShadow: 2
				}
			}}
		>
			<CardContent sx={{ py: 0.75, px: 1.25 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 24,
							height: 24,
							borderRadius: 1,
							bgcolor: `${color}.light`,
							color: `${color}.main`,
							'& .MuiSvgIcon-root': { fontSize: '0.95rem' }
						}}
					>
						<Icon />
					</Box>
					<Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.65rem' }}>
						{title}
					</Typography>
				</Box>
				<Typography variant="h6" fontWeight={600} fontSize="1.1rem" color={color === 'default' ? theme.palette.text.primary : `${color}.main`}>
					{value.toLocaleString()}
				</Typography>
			</CardContent>
		</Card>
	);
}

export function StatisticsCards() {
	const { data, isLoading } = useReportSummary();
	const { isMobile } = useResponsive();

	const stats = {
		total: data?.total || 0,
		request: data?.byState?.request || 0,
		planted: data?.byState?.planted || 0,
		completed: data?.byState?.completed || 0,
		archived: data?.archived || 0,
		deleted: data?.deleted || 0,
		totalArea: data?.totalArea || 0
	};

	return (
		<Grid container spacing={1} sx={{ mb: 2 }}>
			<Grid item xs={6} sm={4} md={2}>
				<StatCard title="Total Reports" value={stats.total} icon={DescriptionIcon} color="primary" loading={isLoading} />
			</Grid>

			<Grid item xs={6} sm={4} md={2}>
				<StatCard title="Request Report" value={stats.request} icon={HourglassEmptyIcon} color="info" loading={isLoading} />
			</Grid>

			<Grid item xs={6} sm={4} md={2}>
				<StatCard title="Planted" value={stats.planted} icon={SpaIcon} color="warning" loading={isLoading} />
			</Grid>

			<Grid item xs={6} sm={4} md={2}>
				<StatCard title="Completed" value={stats.completed} icon={CheckCircleIcon} color="success" loading={isLoading} />
			</Grid>

			<Grid item xs={6} sm={4} md={2}>
				<StatCard title="Archived" value={stats.archived} icon={ArchiveIcon} color="default" loading={isLoading} />
			</Grid>

			<Grid item xs={6} sm={4} md={2}>
				<StatCard title="Deleted" value={stats.deleted} icon={DeleteIcon} color="error" loading={isLoading} />
			</Grid>

			<Grid item xs={12} md={12}>
				<Card elevation={1} sx={{ height: '100%' }}>
					<CardContent sx={{ py: 0.75, px: 1.25 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
							<Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.65rem' }}>
								Total Area Planted
							</Typography>
						</Box>
						{isLoading ? (
							<Skeleton variant="text" width="60%" height={28} />
						) : (
							<Typography variant="h6" fontWeight={600} fontSize="1.1rem" color="primary.main">
								{stats.totalArea.toLocaleString()} <Typography component="span" variant="caption">ha</Typography>
							</Typography>
						)}
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}

export default StatisticsCards;
