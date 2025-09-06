import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEICAnalytics = async (req, res) => {
	try {
		const { from, to } = req.query;
		const toDate = to ? new Date(to) : new Date();
		const fromDate = from ? new Date(from) : null;
		const dateWhere = fromDate ? { createdAt: { gte: fromDate, lte: toDate } } : {};

		const [stacksByStatus, stacksByCategory, txByStatus, stacksCount, itemsCount] = await Promise.all([
			prisma.itemStack.groupBy({ by: ['status'], _count: { status: true } }),
			prisma.inventoryItem.groupBy({ by: ['category'], _count: { category: true } }),
			prisma.itemTransaction.groupBy({ by: ['status'], where: dateWhere, _count: { status: true } }),
			prisma.itemStack.count(),
			prisma.inventoryItem.count(),
		]);

			const payload = {
				totals: { stacks: stacksCount, items: itemsCount },
			stacksByStatus: stacksByStatus.reduce((acc, r) => ({ ...acc, [r.status]: r._count.status }), {}),
			stacksByCategory: stacksByCategory.reduce((acc, r) => ({ ...acc, [r.category]: r._count.category }), {}),
			transactionsByStatus: txByStatus.reduce((acc, r) => ({ ...acc, [r.status]: r._count.status }), {}),
		};

		return res.json({ success: true, payload });
	} catch (error) {
		console.error('getEICAnalytics error:', error);
		return res.status(500).json({ success: false, message: 'Failed to get EIC analytics' });
	}
};

export const exportEICCSV = async (req, res) => {
	try {
		const resp = await new Promise((resolve) => {
			getEICAnalytics(req, { json: (obj) => resolve(obj), status: () => ({ json: (obj) => resolve(obj) }) });
		});
		const d = resp.payload || {};
		const rows = [['Metric', 'Value']];
		rows.push(['Stacks By Status', '']);
		for (const [k, v] of Object.entries(d.stacksByStatus || {})) rows.push([k, v]);
		rows.push(['Stacks By Category', '']);
		for (const [k, v] of Object.entries(d.stacksByCategory || {})) rows.push([k, v]);
		rows.push(['Transactions By Status', '']);
		for (const [k, v] of Object.entries(d.transactionsByStatus || {})) rows.push([k, v]);

		const csv = rows.map(r => r.join(',')).join('\n');
		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', 'attachment; filename="eic_analytics.csv"');
		return res.send(csv);
	} catch (error) {
		console.error('exportEICCSV error:', error);
		return res.status(500).json({ success: false, message: 'Failed to export EIC analytics' });
	}
};

