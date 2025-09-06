import React, { useEffect, useRef } from 'react';
import { exportElementAsPDF } from '../exportPDF';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, PieController, ArcElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, PieController, ArcElement);

export default function SeminarsAnalytics({ data, onExport }) {
	const statusRef = useRef(null);
	const monthlyRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		const ctx = statusRef.current?.getContext('2d');
		if (!ctx) return;
		if (statusRef.current.chart) statusRef.current.chart.destroy();
		const status = data?.byStatus || {};
		statusRef.current.chart = new Chart(ctx, {
			type: 'pie',
			data: { labels: Object.keys(status), datasets: [{ data: Object.values(status), backgroundColor: ['#10b981','#3b82f6','#f59e0b','#ef4444'] }] },
			options: { responsive: true, maintainAspectRatio: false }
		});
	}, [data]);

	useEffect(() => {
		const ctx = monthlyRef.current?.getContext('2d');
		if (!ctx) return;
		if (monthlyRef.current.chart) monthlyRef.current.chart.destroy();
		monthlyRef.current.chart = new Chart(ctx, {
			type: 'bar',
			data: { labels: ['-6','-5','-4','-3','-2','-1','Now'], datasets: [{ label: 'Created', data: data?.monthly || [], backgroundColor: '#3b82f6' }] },
			options: { responsive: true, maintainAspectRatio: false }
		});
	}, [data]);

	return (
		<div className="space-y-6" ref={containerRef}>
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Seminar Analytics</h2>
					<p className="text-gray-600">Status, attendance, and trends</p>
				</div>
				<div className="flex gap-2">
					<button onClick={onExport} className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700">Export CSV</button>
					<button onClick={() => exportElementAsPDF(containerRef.current, 'seminars_analytics.pdf')} className="px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-900">Export PDF</button>
				</div>
			</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="rounded-lg bg-white shadow p-4">
						<div className="text-xs text-gray-500">Total Seminars</div>
						<div className="text-2xl font-bold">{data?.total ?? 0}</div>
					</div>
					<div className="rounded-lg bg-white shadow p-4">
						<div className="text-xs text-gray-500">Completed</div>
						<div className="text-2xl font-bold">{data?.byStatus?.Completed ?? 0}</div>
					</div>
					<div className="rounded-lg bg-white shadow p-4">
						<div className="text-xs text-gray-500">Ongoing</div>
						<div className="text-2xl font-bold">{data?.byStatus?.Ongoing ?? 0}</div>
					</div>
					<div className="rounded-lg bg-white shadow p-4">
						<div className="text-xs text-gray-500">Upcoming</div>
						<div className="text-2xl font-bold">{data?.byStatus?.Upcoming ?? 0}</div>
					</div>
					<div className="rounded-lg bg-white shadow p-4 col-span-2 md:col-span-2">
						<div className="text-xs text-gray-500">Total Attendance (if available)</div>
						<div className="text-2xl font-bold">{data?.attendance?.total ?? 0}</div>
					</div>
				</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="rounded-xl shadow p-6 bg-white h-80">
					<h3 className="font-semibold mb-2">Seminars by Status</h3>
					<canvas ref={statusRef} />
				</div>
				<div className="rounded-xl shadow p-6 bg-white h-80">
					<h3 className="font-semibold mb-2">Monthly Created (last 6 months)</h3>
					<canvas ref={monthlyRef} />
				</div>
			</div>
		</div>
	);
}
