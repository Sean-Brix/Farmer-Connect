import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { exportElementAsPDF } from '../exportPDF';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, PieController, ArcElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, PieController, ArcElement);

export default function SeminarsAnalytics({ data, onExport }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const statusRef = useRef(null);
	const monthlyRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		const ctx = statusRef.current?.getContext('2d');
		if (!ctx) return;
		if (statusRef.current.chart) statusRef.current.chart.destroy();
		const status = data?.byStatus || {};
		statusRef.current.chart = new Chart(ctx, {
			type: 'doughnut',
			data: { 
				labels: Object.keys(status), 
				datasets: [{ 
					data: Object.values(status), 
					backgroundColor: ['#10b981','#3b82f6','#f59e0b','#ef4444'],
					borderWidth: 3,
					borderColor: isDark ? '#1f2937' : '#ffffff',
				}] 
			},
			options: { 
				responsive: true, 
				maintainAspectRatio: false,
				cutout: '65%',
				plugins: {
					legend: {
						position: 'bottom',
						labels: {
							color: isDark ? '#e5e7eb' : '#374151',
							font: {
								size: 13,
								weight: '600',
							},
							padding: 20,
							usePointStyle: true,
							pointStyle: 'circle',
						},
					},
					tooltip: {
						backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
						titleColor: isDark ? '#ffffff' : '#000000',
						bodyColor: isDark ? '#e5e7eb' : '#374151',
						borderColor: isDark ? '#374151' : '#e5e7eb',
						borderWidth: 1,
						cornerRadius: 12,
						padding: 12,
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
			data: { 
				labels: ['-6','-5','-4','-3','-2','-1','Now'], 
				datasets: [{ 
					label: 'Created', 
					data: data?.monthly || [], 
					backgroundColor: 'rgba(59, 130, 246, 0.8)',
					borderColor: '#3b82f6',
					borderWidth: 2,
					borderRadius: 8,
					borderSkipped: false,
				}] 
			},
			options: { 
				responsive: true, 
				maintainAspectRatio: false,
				interaction: {
					intersect: false,
					mode: 'index',
				},
				plugins: {
					legend: {
						labels: {
							color: isDark ? '#e5e7eb' : '#374151',
							font: {
								size: 13,
								weight: '600',
							},
							padding: 20,
							usePointStyle: true,
						},
					},
					tooltip: {
						backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
						titleColor: isDark ? '#ffffff' : '#000000',
						bodyColor: isDark ? '#e5e7eb' : '#374151',
						borderColor: isDark ? '#374151' : '#e5e7eb',
						borderWidth: 1,
						cornerRadius: 12,
						padding: 12,
					},
				},
				scales: {
					x: {
						grid: {
							color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
							drawBorder: false,
						},
						ticks: {
							color: isDark ? '#9ca3af' : '#6b7280',
							font: {
								size: 12,
								weight: '500',
							},
							padding: 10,
						},
						border: {
							display: false,
						},
					},
					y: {
						grid: {
							color: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
							drawBorder: false,
						},
						ticks: {
							color: isDark ? '#9ca3af' : '#6b7280',
							font: {
								size: 12,
								weight: '500',
							},
							padding: 10,
						},
						border: {
							display: false,
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
					<h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Seminar Analytics</h2>
					<p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Status, attendance, and trends</p>
				</div>
				<div className="flex gap-2">
					<button onClick={onExport} className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors">Export CSV</button>
					<button onClick={() => exportElementAsPDF(containerRef.current, 'seminars_analytics.pdf')} className={`px-4 py-2 rounded-md shadow transition-colors ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-800 text-white hover:bg-gray-900'}`}>Export PDF</button>
				</div>
			</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className={`rounded-lg shadow p-4 ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
						<div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Seminars</div>
						<div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{data?.total ?? 0}</div>
					</div>
					<div className={`rounded-lg shadow p-4 ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
						<div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Completed</div>
						<div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{data?.byStatus?.Completed ?? 0}</div>
					</div>
					<div className={`rounded-lg shadow p-4 ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
						<div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ongoing</div>
						<div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{data?.byStatus?.Ongoing ?? 0}</div>
					</div>
					<div className={`rounded-lg shadow p-4 ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
						<div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Upcoming</div>
						<div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{data?.byStatus?.Upcoming ?? 0}</div>
					</div>
					<div className={`rounded-lg shadow p-4 col-span-2 md:col-span-2 ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
						<div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Attendance (if available)</div>
						<div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{data?.attendance?.total ?? 0}</div>
					</div>
				</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className={`rounded-2xl shadow-lg border h-[500px] transition-all duration-300 hover:shadow-xl ${
					isDark 
						? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
						: 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
				}`}>
					<div className="p-6 border-b border-opacity-20 border-gray-300">
						<h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Seminars by Status</h3>
						<p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current seminar distribution</p>
					</div>
					<div className="p-6">
						<div className="h-96 p-4 rounded-xl bg-opacity-50 backdrop-blur-sm">
							<canvas ref={statusRef} style={{ width: '100%', height: '100%' }} />
						</div>
					</div>
				</div>
				<div className={`rounded-2xl shadow-lg border h-[500px] transition-all duration-300 hover:shadow-xl ${
					isDark 
						? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
						: 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
				}`}>
					<div className="p-6 border-b border-opacity-20 border-gray-300">
						<h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Monthly Trends</h3>
						<p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Seminar creation over time</p>
					</div>
					<div className="p-6">
						<div className="h-96 p-4 rounded-xl bg-opacity-50 backdrop-blur-sm">
							<canvas ref={monthlyRef} style={{ width: '100%', height: '100%' }} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
