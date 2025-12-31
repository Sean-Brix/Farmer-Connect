import React, { useMemo } from 'react';
import { Paper, Typography, Stack, Chip, Box, Divider } from '@mui/material';

export default function DistributionMetadataSection({ distribution, distributionId }) {
	const hasData = Boolean(distribution || distributionId);
	const meta = useMemo(() => {
		if (!distribution && !distributionId) return null;
		const pickupDate = distribution?.pickupDate || distribution?.distributionPickupDate;
		return {
			id: distribution?.id || distribution?.requestId || distributionId,
			status: distribution?.status,
			item: distribution?.distributionItemId || distribution?.itemId,
			quantity: distribution?.distributionQuantity ?? distribution?.quantity,
			unit: distribution?.distributionUnit || distribution?.unit,
			distributedQuantity: distribution?.distributedQuantity,
			pickupDate: pickupDate ? new Date(pickupDate).toLocaleDateString() : null,
			deadline: distribution?.plantingReportDeadline,
			note: distribution?.requestNote
		};
	}, [distribution, distributionId]);

	if (!hasData) return null;

	return (
		<Paper variant="outlined" sx={{ p: 2 }}>
			<Typography variant="subtitle1" fontWeight={700} gutterBottom>
				Distribution Metadata
			</Typography>
			{!meta ? (
				<Typography variant="body2" color="text.secondary">
					This report is not linked to a distribution record.
				</Typography>
			) : (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
					<Stack direction="row" spacing={1} flexWrap="wrap">
						{meta.id && <Chip label={`Request #${meta.id}`} color="primary" />}
						{meta.status && <Chip label={`Status: ${meta.status}`} color="info" />}
						{meta.pickupDate && <Chip label={`Pickup: ${meta.pickupDate}`} />}
						{meta.deadline && (
							<Chip label={`Deadline: ${new Date(meta.deadline).toLocaleDateString()}`} color="warning" />
						)}
					</Stack>

					{(meta.item || meta.quantity || meta.distributedQuantity) && (
						<Stack direction="row" spacing={1} flexWrap="wrap">
							{meta.item && <Chip label={`Item: ${meta.item}`} />}
							{meta.quantity && (
								<Chip label={`Allocated: ${meta.quantity}${meta.unit ? ` ${meta.unit}` : ''}`} />
							)}
							{meta.distributedQuantity && <Chip label={`Distributed: ${meta.distributedQuantity}`} />}
						</Stack>
					)}

					{meta.note && (
						<>
							<Divider sx={{ my: 1 }} />
							<Typography variant="body2" color="text.secondary">
								Note: {meta.note}
							</Typography>
						</>
					)}
				</Box>
			)}
		</Paper>
	);
}
