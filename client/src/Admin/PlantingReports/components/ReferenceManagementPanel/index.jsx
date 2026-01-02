/**
 * ReferenceManagementPanel Component
 * Inline collapsible panel for managing varieties and seasons
 */

import React, { useState } from 'react';
import {
	Typography,
	Box,
	Tabs,
	Tab,
	Drawer,
	IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useResponsive } from '../../hooks/useResponsive';

import { VarietiesTab } from './VarietiesTab';
import { SeasonsTab } from './SeasonsTab';

export function ReferenceManagementPanel({ open, onClose }) {
	const { isMobile } = useResponsive();
	const [activeTab, setActiveTab] = useState(0);

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	return (
		<Drawer
			anchor={isMobile ? "bottom" : "right"}
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: isMobile ? {
					height: '80vh',
					borderTopLeftRadius: 16,
					borderTopRightRadius: 16
				} : {
					width: '80vw',
					maxWidth: 1200,
					minWidth: 800
				}
			}}
		>
			<Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
					<Typography variant="h5" fontWeight={600} color="text.primary">Reference Management</Typography>
					<IconButton onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</Box>

				<Tabs 
					value={activeTab} 
					onChange={handleTabChange} 
					variant={isMobile ? "fullWidth" : "standard"}
					sx={{ 
						borderBottom: 1, 
						borderColor: 'divider',
						mb: 2
					}}
				>
					<Tab label="Varieties" />
					<Tab label="Seasons" />
				</Tabs>

				<Box sx={{ flex: 1, overflow: 'auto' }}>
					{activeTab === 0 && <VarietiesTab />}
					{activeTab === 1 && <SeasonsTab />}
				</Box>
			</Box>
		</Drawer>
	);
}

export default ReferenceManagementPanel;
