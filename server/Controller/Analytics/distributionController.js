import prisma from '../../config/database.js';

export const getDistributionAnalytics = async (req, res) => {
	try {
	const { from, to } = req.query;
		const now = new Date();
		const start6mo = new Date(now);
		start6mo.setMonth(start6mo.getMonth() - 6);
	const toDate = to ? new Date(to) : now;
	const fromDate = from ? new Date(from) : null;
	const dateWhere = fromDate ? { createdAt: { gte: fromDate, lte: toDate } } : {};

			const [byStatus, monthly, fulfillment, total] = await Promise.all([
				prisma.itemTransaction.groupBy({ by: ['status'], where: dateWhere, _count: { status: true } }),
				prisma.$queryRaw`SELECT DATE_FORMAT(createdAt, '%b') AS m, COUNT(*) AS c FROM item_transactions WHERE createdAt >= ${fromDate || start6mo} AND createdAt <= ${toDate} GROUP BY m ORDER BY MIN(createdAt)`,
				prisma.itemTransaction.findMany({ where: { status: 'Returned', ...(fromDate ? { createdAt: { gte: fromDate, lte: toDate } } : {}) }, select: { createdAt: true, returnDate: true } }),
				prisma.itemTransaction.count({ where: dateWhere })
			]);

		// Average time from createdAt to returnDate (days)
		let avgDays = 0;
		if (fulfillment && fulfillment.length > 0) {
			const diffs = fulfillment
				.filter(x => x.returnDate)
				.map(x => (x.returnDate - x.createdAt) / (1000 * 60 * 60 * 24));
			avgDays = diffs.length ? Number((diffs.reduce((a, b) => a + b, 0) / diffs.length).toFixed(2)) : 0;
		}

			const payload = {
				total,
			status: byStatus.reduce((acc, r) => ({ ...acc, [r.status]: r._count.status }), {}),
			monthly: (monthly || []).map(r => Number(r.c)),
			averageFulfillmentDays: avgDays,
		};

		return res.json({ success: true, payload });
	} catch (error) {
		console.error('getDistributionAnalytics error:', error);
		return res.status(500).json({ success: false, message: 'Failed to get distribution analytics' });
	}
};

export const exportDistributionCSV = async (req, res) => {
	try {
		const resp = await new Promise((resolve) => {
			getDistributionAnalytics(req, { json: (obj) => resolve(obj), status: () => ({ json: (obj) => resolve(obj) }) });
		});
		const d = resp.payload || {};
		const rows = [['Metric', 'Value']];
		rows.push(['Average Fulfillment Days', d.averageFulfillmentDays ?? 0]);
		rows.push(['Status Breakdown', '']);
		for (const [k, v] of Object.entries(d.status || {})) rows.push([k, v]);

		const csv = rows.map(r => r.join(',')).join('\n');
		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', 'attachment; filename="distribution_analytics.csv"');
		return res.send(csv);
	} catch (error) {
		console.error('exportDistributionCSV error:', error);
		return res.status(500).json({ success: false, message: 'Failed to export distribution analytics' });
	}
};

