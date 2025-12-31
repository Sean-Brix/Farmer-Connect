/**
 * Export Helper Utilities
 * CSV/Excel export functionality
 */

import { formatDate } from './dateHelpers';
import { getStateLabel } from './stateHelpers';

export function convertToCSV(reports) {
	if (!reports || reports.length === 0) {
		return '';
	}

	const headers = [
		'Farmer Name',
		'Farm Location',
		'RSBSA Number',
		'Crop Type',
		'Variety',
		'Season',
		'Area Planted (ha)',
		'Seed Classification',
		'State',
		'Date of Planting',
		'Planting Method',
		'Rice Irrigation',
		'Harvest Area (ha)',
		'Number of Bags',
		'Weight per Bag (kg)',
		'Yield (MT/ha)',
		'Is Archived',
		'Created Date'
	];

	const rows = reports.map((report) => [
		escapeCSV(report.farmerName),
		escapeCSV(report.farmLocation),
		escapeCSV(report.rsbsaNumber || ''),
		escapeCSV(report.typeOfCrop),
		escapeCSV(report.variety?.name || ''),
		escapeCSV(report.croppingSeason ? `${report.croppingSeason.season} ${report.croppingSeason.year}` : ''),
		report.areaPlanted,
		escapeCSV(report.seedClassification),
		escapeCSV(getStateLabel(report.state)),
		formatDate(report.dateOfPlanting) || '',
		escapeCSV(report.plantingMethod || ''),
		escapeCSV(report.riceIrrigation || ''),
		report.harvestArea || '',
		report.numberOfBags || '',
		report.weightPerBag || '',
		report.yieldMtPerHa || '',
		report.isArchived ? 'Yes' : 'No',
		formatDate(report.createdAt)
	]);

	const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

	return csv;
}

function escapeCSV(field) {
	if (field === null || field === undefined) {
		return '';
	}

	const stringField = String(field);

	if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
		return `"${stringField.replace(/"/g, '""')}"`;
	}

	return stringField;
}

export function downloadCSV(csv, filename = 'planting-reports.csv') {
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');

	if (link.download !== undefined) {
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', filename);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}

export function exportReports(reports, filename) {
	const csv = convertToCSV(reports);

	if (!csv) {
		throw new Error('No data to export');
	}

	const defaultFilename = `planting-reports-${formatDate(new Date(), 'yyyy-MM-dd')}.csv`;
	downloadCSV(csv, filename || defaultFilename);
}

export default {
	convertToCSV,
	downloadCSV,
	exportReports
};
