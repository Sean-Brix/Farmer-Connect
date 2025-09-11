import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { exportElementAsPDF } from '../exportPDF';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, PieController, ArcElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, PieController, ArcElement);

export default function DistributionAnalytics({ data, onExport }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const statusRef = useRef(null);
	const monthlyRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		const ctx = statusRef.current?.getContext('2d');
		if (!ctx) return;
		if (statusRef.current.chart) statusRef.current.chart.destroy();
		const status = data?.status || {};
		statusRef.current.chart = new Chart(ctx, {
			type: 'pie',
			data: { labels: Object.keys(status), datasets: [{ data: Object.values(status), backgroundColor: ['#ef4444','#f59e0b','#10b981','#6b7280','#8b5cf6'] }] },
			options: { 
				responsive: true, 
				maintainAspectRatio: false,
				plugins: {
					legend: {
						labels: {
							color: isDark ? '#e5e7eb' : '#374151',
						},
					},
				},
			}
		});
	}, [data, isDark]);

	useEffect(() => {
		const ctx = monthlyRef.current?.getContext('2d');
		if (!ctx) return;
		if (monthlyRef.current.chart) monthlyRef.current.chart.destroy();
		monthlyRef.current.chart = new Chart(ctx, {
			type: 'bar',
			data: { labels: ['-6m','-5m','-4m','-3m','-2m','-1m','Now'], datasets: [{ label: 'Requests', data: data?.monthly || [], backgroundColor: '#8b5cf6' }] },
			options: { 
				responsive: true, 
				maintainAspectRatio: false,
				plugins: {
					legend: {
						labels: {
							color: isDark ? '#e5e7eb' : '#374151',
						},
					},
				},
				scales: {
					x: {
						grid: {
							color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
						},
						ticks: {
							color: isDark ? '#d1d5db' : '#6b7280',
						},
					},
					y: {
						grid: {
							color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
						},
						ticks: {
							color: isDark ? '#d1d5db' : '#6b7280',
						},
					},
				},
			}
		});
	}, [data, isDark]);

	return (
		<div className="space-y-6" ref={containerRef}>
			<div className="flex items-center justify-between">
				<div>
					<h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Distribution Analytics</h2>
					<p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Requests and fulfillment</p>
				</div>
				<div className="flex gap-2">
					<button onClick={onExport} className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors">Export CSV</button>
					<button onClick={() => exportElementAsPDF(containerRef.current, 'distribution_analytics.pdf')} className={`px-4 py-2 rounded-md shadow transition-colors ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-800 text-white hover:bg-gray-900'}`}>Export PDF</button>
				</div>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className={`rounded-lg shadow p-4 ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
					<div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Requests</div>
					<div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{data?.total ?? 0}</div>
				</div>
				<div className={`rounded-lg shadow p-4 ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
					<div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Completed</div>
					<div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{data?.status?.Completed ?? 0}</div>
				</div>
				<div className={`rounded-lg shadow p-4 ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
					<div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pending</div>
					<div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{data?.status?.Pending ?? 0}</div>
				</div>
				<div className={`rounded-lg shadow p-4 ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
					<div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Avg Fulfillment (days)</div>
					<div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{
						Number.isFinite(data?.avgFulfillmentDays)
							? data.avgFulfillmentDays.toFixed(1)
							: '0.0'
					}</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className={`rounded-xl shadow p-6 h-[500px] ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
					<h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Status Breakdown</h3>
					<div className="h-96">
						<canvas ref={statusRef} style={{ width: '100%', height: '100%' }} />
					</div>
				</div>
				<div className={`rounded-xl shadow p-6 h-[500px] ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
					<h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Monthly Requests (last 6 months)</h3>
					<div className="h-96">
						<canvas ref={monthlyRef} style={{ width: '100%', height: '100%' }} />
					</div>
				</div>
			</div>
		</div>
	);
}
