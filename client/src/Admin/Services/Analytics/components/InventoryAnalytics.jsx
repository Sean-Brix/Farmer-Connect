import React, { useEffect, useRef } from 'react';
import { exportElementAsPDF } from '../exportPDF';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, DoughnutController, ArcElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, DoughnutController, ArcElement);

export default function InventoryAnalytics({ data, onExport }) {
	const statusRef = useRef(null);
	const catRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		const ctx = statusRef.current?.getContext('2d');
		if (!ctx) return;
		if (statusRef.current.chart) statusRef.current.chart.destroy();
		const m = data?.stacksByStatus || {};
		statusRef.current.chart = new Chart(ctx, {
			type: 'doughnut',
			data: { labels: Object.keys(m), datasets: [{ data: Object.values(m), backgroundColor: ['#10b981','#ef4444','#6b7280','#8b5cf6'] }] },
			options: { responsive: true, maintainAspectRatio: false, cutout: '60%' }
		});
	}, [data]);

	useEffect(() => {
		const ctx = catRef.current?.getContext('2d');
		if (!ctx) return;
		if (catRef.current.chart) catRef.current.chart.destroy();
		const m = data?.itemsByCategory || {};
		const labels = Object.keys(m);
		const isLong = labels.some(l => String(l).length > 12) || labels.length > 6;
		catRef.current.chart = new Chart(ctx, {
			type: 'bar',
			data: { labels, datasets: [{ label: 'Items', data: Object.values(m), backgroundColor: '#6366f1' }] },
			options: {
				indexAxis: isLong ? 'y' : 'x',
				responsive: true,
				maintainAspectRatio: false,
				scales: { x: { beginAtZero: true } }
			}
		});
	}, [data]);

	return (
		<div className="space-y-6" ref={containerRef}>
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Inventory Analytics</h2>
					<p className="text-gray-600">Stock levels and categories</p>
				</div>
				<div className="flex gap-2">
					<button onClick={onExport} className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700">Export CSV</button>
					<button onClick={() => exportElementAsPDF(containerRef.current, 'inventory_analytics.pdf')} className="px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-900">Export PDF</button>
				</div>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="rounded-lg bg-white shadow p-4">
					<div className="text-xs text-gray-500">Total Items</div>
					<div className="text-2xl font-bold">{data?.itemsCount ?? 0}</div>
				</div>
				<div className="rounded-lg bg-white shadow p-4">
					<div className="text-xs text-gray-500">Total Stacks</div>
					<div className="text-2xl font-bold">{data?.stacksCount ?? 0}</div>
				</div>
				<div className="rounded-lg bg-white shadow p-4">
					<div className="text-xs text-gray-500">Available Stacks</div>
					<div className="text-2xl font-bold">{data?.stacksByStatus?.Available ?? 0}</div>
				</div>
				<div className="rounded-lg bg-white shadow p-4">
					<div className="text-xs text-gray-500">Out of Stock</div>
					<div className="text-2xl font-bold">{data?.stacksByStatus?.OutOfStock ?? 0}</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="rounded-xl shadow p-6 bg-white h-80">
					<h3 className="font-semibold mb-2">Stacks by Status</h3>
					<canvas ref={statusRef} />
				</div>
				<div className="rounded-xl shadow p-6 bg-white h-80">
					<h3 className="font-semibold mb-2">Items by Category</h3>
					<canvas ref={catRef} />
				</div>
			</div>
		</div>
	);
}

