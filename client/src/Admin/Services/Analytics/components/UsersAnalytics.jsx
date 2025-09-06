import React, { useEffect, useRef } from 'react';
import { exportElementAsPDF } from '../exportPDF';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, DoughnutController, ArcElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, DoughnutController, ArcElement);

export default function UsersAnalytics({ data, onExport }) {
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
				datasets: [{ label: 'Registrations', data: data.monthlyRegistrations || [], backgroundColor: '#10b981' }]
			},
			options: { responsive: true, maintainAspectRatio: false }
		});
	}, [data]);

	useEffect(() => {
		const ctx = donutRef.current?.getContext('2d');
		if (!ctx) return;
		if (donutRef.current.chart) donutRef.current.chart.destroy();
		const sex = data?.demographics?.sex || {};
		donutRef.current.chart = new Chart(ctx, {
			type: 'doughnut',
			data: { labels: Object.keys(sex), datasets: [{ data: Object.values(sex), backgroundColor: ['#3b82f6','#ef4444','#10b981','#8b5cf6'] }] },
			options: { responsive: true, maintainAspectRatio: false, cutout: '60%' }
		});
	}, [data]);

	return (
		<div className="space-y-6" ref={containerRef}>
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">User Analytics</h2>
					<p className="text-gray-600">Registrations, activity, and demographics</p>
				</div>
				<div className="flex gap-2">
					<button onClick={onExport} className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700">Export CSV</button>
					<button onClick={() => exportElementAsPDF(containerRef.current, 'users_analytics.pdf')} className="px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-900">Export PDF</button>
				</div>
			</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="rounded-lg bg-white shadow p-4">
						<div className="text-xs text-gray-500">Total Users</div>
						<div className="text-2xl font-bold">{data?.total ?? 0}</div>
					</div>
					<div className="rounded-lg bg-white shadow p-4">
						<div className="text-xs text-gray-500">New (30d)</div>
						<div className="text-2xl font-bold">{data?.createdLast30 ?? 0}</div>
					</div>
					<div className="rounded-lg bg-white shadow p-4">
						<div className="text-xs text-gray-500">Active (30d)</div>
						<div className="text-2xl font-bold">{data?.activeUsers ?? 0}</div>
					</div>
					<div className="rounded-lg bg-white shadow p-4">
						<div className="text-xs text-gray-500">Period Created</div>
						<div className="text-2xl font-bold">{data?.period?.created ?? 0}</div>
					</div>
				</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="rounded-xl shadow p-6 bg-white md:col-span-2 h-80">
					<h3 className="font-semibold mb-2">Monthly Registrations</h3>
					<canvas ref={barRef} />
				</div>
				<div className="rounded-xl shadow p-6 bg-white h-80">
					<h3 className="font-semibold mb-2">Sex Breakdown</h3>
					<canvas ref={donutRef} />
				</div>
			</div>
		</div>
	);
}
