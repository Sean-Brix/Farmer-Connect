import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { exportElementAsPDF } from '../exportPDF';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, DoughnutController, ArcElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, DoughnutController, ArcElement);

export default function UsersAnalytics({ data, onExport }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const barRef = useRef(null);
	const donutRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		if (!data) return;
		const ctx = barRef.current?.getContext('2d');
		if (!ctx) return;
		if (barRef.current.chart) barRef.current.chart.destroy();
		barRef.current.chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
				datasets: [{ 
					label: 'Registrations', 
					data: data.monthlyRegistrations || [], 
					backgroundColor: 'rgba(16, 185, 129, 0.8)',
					borderColor: '#10b981',
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

	useEffect(() => {
		const ctx = donutRef.current?.getContext('2d');
		if (!ctx) return;
		if (donutRef.current.chart) donutRef.current.chart.destroy();
		const sex = data?.demographics?.sex || {};
		donutRef.current.chart = new Chart(ctx, {
			type: 'doughnut',
			data: { 
				labels: Object.keys(sex), 
				datasets: [{ 
					data: Object.values(sex), 
					backgroundColor: ['#3b82f6','#ef4444','#10b981','#8b5cf6'],
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

	return (
		<div className="space-y-6" ref={containerRef}>
			<div className="flex items-center justify-between">
				<div>
					<h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>User Analytics</h2>
					<p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Registrations, activity, and demographics</p>
				</div>
				<div className="flex gap-2">
					<button onClick={onExport} className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors">Export CSV</button>
					<button onClick={() => exportElementAsPDF(containerRef.current, 'users_analytics.pdf')} className={`px-4 py-2 rounded-md shadow transition-colors ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-800 text-white hover:bg-gray-900'}`}>Export PDF</button>
				</div>
			</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className={`rounded-xl shadow-lg border p-6 transition-all duration-300 hover:shadow-xl ${
						isDark ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
					}`}>
						<div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Users</div>
						<div className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{data?.total ?? 0}</div>
					</div>
					<div className={`rounded-xl shadow-lg border p-6 transition-all duration-300 hover:shadow-xl ${
						isDark ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
					}`}>
						<div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>New (30d)</div>
						<div className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{data?.createdLast30 ?? 0}</div>
					</div>
					<div className={`rounded-xl shadow-lg border p-6 transition-all duration-300 hover:shadow-xl ${
						isDark ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
					}`}>
						<div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Active (30d)</div>
						<div className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{data?.activeUsers ?? 0}</div>
					</div>
					<div className={`rounded-xl shadow-lg border p-6 transition-all duration-300 hover:shadow-xl ${
						isDark ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
					}`}>
						<div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Period Created</div>
						<div className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{data?.period?.created ?? 0}</div>
					</div>
				</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className={`rounded-2xl shadow-lg border md:col-span-2 h-[500px] transition-all duration-300 hover:shadow-xl ${
					isDark 
						? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
						: 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
				}`}>
					<div className="p-6 border-b border-opacity-20 border-gray-300">
						<h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Monthly Registrations</h3>
						<p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>User registration trends over time</p>
					</div>
					<div className="p-6">
						<div className="h-96 p-4 rounded-xl bg-opacity-50 backdrop-blur-sm">
							<canvas ref={barRef} style={{ width: '100%', height: '100%' }} />
						</div>
					</div>
				</div>
				<div className={`rounded-2xl shadow-lg border h-[500px] transition-all duration-300 hover:shadow-xl ${
					isDark 
						? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
						: 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
				}`}>
					<div className="p-6 border-b border-opacity-20 border-gray-300">
						<h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Demographics</h3>
						<p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>User gender distribution</p>
					</div>
					<div className="p-6">
						<div className="h-96 p-4 rounded-xl bg-opacity-50 backdrop-blur-sm">
							<canvas ref={donutRef} style={{ width: '100%', height: '100%' }} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
