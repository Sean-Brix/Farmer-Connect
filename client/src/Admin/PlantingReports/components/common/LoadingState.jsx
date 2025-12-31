/**
 * LoadingState Component
 * Skeleton loaders for different layouts
 */

import React from 'react';
import { Box, Skeleton, Card, CardContent, Table, TableBody, TableRow, TableCell } from '@mui/material';

export function TableLoadingSkeleton({ rows = 5, columns = 6 }) {
	return (
		<Table>
			<TableBody>
				{Array.from({ length: rows }).map((_, rowIndex) => (
					<TableRow key={rowIndex}>
						{Array.from({ length: columns }).map((_, colIndex) => (
							<TableCell key={colIndex}>
								<Skeleton variant="text" />
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export function CardLoadingSkeleton({ count = 3 }) {
	return (
		<Box>
			{Array.from({ length: count }).map((_, index) => (
				<Card key={index} sx={{ mb: 2 }}>
					<CardContent>
						<Skeleton variant="text" width="60%" height={28} />
						<Skeleton variant="text" width="80%" />
						<Skeleton variant="text" width="40%" />
					</CardContent>
				</Card>
			))}
		</Box>
	);
}

export function FormLoadingSkeleton() {
	return (
		<Box>
			<Skeleton variant="text" width="30%" height={36} sx={{ mb: 2 }} />
			<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
				<Skeleton variant="rectangular" height={56} sx={{ flex: 1 }} />
				<Skeleton variant="rectangular" height={56} sx={{ flex: 1 }} />
			</Box>
			<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
				<Skeleton variant="rectangular" height={56} sx={{ flex: 1 }} />
				<Skeleton variant="rectangular" height={56} sx={{ flex: 1 }} />
			</Box>
			<Skeleton variant="rectangular" height={120} />
		</Box>
	);
}

export function StatisticsLoadingSkeleton() {
	return (
		<Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
			{Array.from({ length: 4 }).map((_, index) => (
				<Card key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' } }}>
					<CardContent>
						<Skeleton variant="text" width="60%" />
						<Skeleton variant="text" width="40%" height={36} />
					</CardContent>
				</Card>
			))}
		</Box>
	);
}

export default {
	TableLoadingSkeleton,
	CardLoadingSkeleton,
	FormLoadingSkeleton,
	StatisticsLoadingSkeleton
};
