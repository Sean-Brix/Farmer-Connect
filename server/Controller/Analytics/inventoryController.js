import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getInventoryAnalytics = async (req, res) => {
	try {
	const { from, to } = req.query;
	const toDate = to ? new Date(to) : new Date();
	const fromDate = from ? new Date(from) : null;
	const dateWhere = fromDate ? { createdAt: { gte: fromDate, lte: toDate } } : {};
			const [itemsCount, stacksCount, stacksByStatus, itemsByCategory] = await Promise.all([
			prisma.inventoryItem.count(),
			prisma.itemStack.count(),
				prisma.itemStack.groupBy({ by: ['status'], _count: { status: true } }),
			prisma.inventoryItem.groupBy({ by: ['category'], _count: { category: true } }),
		]);

		const payload = {
			itemsCount,
			stacksCount,
			stacksByStatus: stacksByStatus.reduce((acc, r) => ({ ...acc, [r.status]: r._count.status }), {}),
			itemsByCategory: itemsByCategory.reduce((acc, r) => ({ ...acc, [r.category]: r._count.category }), {}),
		};

		return res.json({ success: true, payload });
	} catch (error) {
		console.error('getInventoryAnalytics error:', error);
		return res.status(500).json({ success: false, message: 'Failed to get inventory analytics' });
	}
};

export const exportInventoryCSV = async (req, res) => {
	try {
		const resp = await new Promise((resolve) => {
			getInventoryAnalytics(req, { json: (obj) => resolve(obj), status: () => ({ json: (obj) => resolve(obj) }) });
		});
		const d = resp.payload || {};
		const rows = [['Metric', 'Value']];
		rows.push(['Items Count', d.itemsCount ?? 0]);
		rows.push(['Stacks Count', d.stacksCount ?? 0]);
		rows.push(['Stacks By Status', '']);
		for (const [k, v] of Object.entries(d.stacksByStatus || {})) rows.push([k, v]);
		rows.push(['Items By Category', '']);
		for (const [k, v] of Object.entries(d.itemsByCategory || {})) rows.push([k, v]);

		const csv = rows.map(r => r.join(',')).join('\n');
		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', 'attachment; filename="inventory_analytics.csv"');
		return res.send(csv);
	} catch (error) {
		console.error('exportInventoryCSV error:', error);
		return res.status(500).json({ success: false, message: 'Failed to export inventory analytics' });
	}
};

