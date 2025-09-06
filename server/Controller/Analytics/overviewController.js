import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getOverviewAnalytics = async (req, res) => {
	try {
	const { from, to } = req.query;
	const fromDate = from ? new Date(from) : null;
	const toDate = to ? new Date(to) : new Date();
		// Basic totals
		const [totalUsers, totalSeminars, totalInventoryItems, totalEICStacks, totalDistributions] = await Promise.all([
			prisma.account.count(),
			prisma.seminar.count(),
			prisma.inventoryItem.count(),
			prisma.itemStack.count({ where: { status: 'EIC' } }),
			prisma.itemTransaction.count(),
		]);

		// Growths (compare last 30 days vs previous 30 days)
		const now = new Date();
		const startCurrent = new Date(now);
		startCurrent.setDate(startCurrent.getDate() - 30);
		const startPrevious = new Date(now);
		startPrevious.setDate(startPrevious.getDate() - 60);

			const [usersPrev, usersCurr, seminarsPrev, seminarsCurr, distPrev, distCurr] = await Promise.all([
				prisma.account.count({ where: { createdAt: { gte: startPrevious, lt: startCurrent } } }),
				prisma.account.count({ where: { createdAt: { gte: startCurrent, lte: now } } }),
				prisma.seminar.count({ where: { createdAt: { gte: startPrevious, lt: startCurrent } } }),
				prisma.seminar.count({ where: { createdAt: { gte: startCurrent, lte: now } } }),
				prisma.itemTransaction.count({ where: { createdAt: { gte: startPrevious, lt: startCurrent } } }),
				prisma.itemTransaction.count({ where: { createdAt: { gte: startCurrent, lte: now } } }),
			]);

		const pct = (prev, curr) => (prev === 0 ? (curr > 0 ? 100 : 0) : ((curr - prev) / prev) * 100);

			// Period counts when from/to provided
			let period = undefined;
			if (fromDate) {
				const [u, s, d] = await Promise.all([
					prisma.account.count({ where: { createdAt: { gte: fromDate, lte: toDate } } }),
					prisma.seminar.count({ where: { createdAt: { gte: fromDate, lte: toDate } } }),
					prisma.itemTransaction.count({ where: { createdAt: { gte: fromDate, lte: toDate } } }),
				]);
				period = { users: u, seminars: s, distributions: d };
			}

			const payload = {
			totalUsers,
			totalSeminars,
			totalEIC: totalEICStacks,
			totalDistributions,
			totalInventoryItems,
			userGrowth: Number(pct(usersPrev, usersCurr).toFixed(2)),
			seminarGrowth: Number(pct(seminarsPrev, seminarsCurr).toFixed(2)),
			distributionGrowth: Number(pct(distPrev, distCurr).toFixed(2)),
			inventoryGrowth: 0, // Placeholder, inventory "growth" is ambiguous; can be derived later
			eicGrowth: 0,
				period,
		};

		return res.json({ success: true, payload });
	} catch (error) {
		console.error('getOverviewAnalytics error:', error);
		return res.status(500).json({ success: false, message: 'Failed to get overview analytics' });
	}
};

export const exportOverviewCSV = async (req, res) => {
	try {
		// Reuse the data above
		const resp = await new Promise((resolve) => {
			getOverviewAnalytics(
				req,
				{
					json: (obj) => resolve(obj),
					status: () => ({ json: (obj) => resolve(obj) }),
				}
			);
		});

		const data = resp.payload || {};
		const rows = [
			['Metric', 'Value'],
			['Total Users', data.totalUsers ?? 0],
			['Total Seminars', data.totalSeminars ?? 0],
			['Available EIC Stacks', data.totalEIC ?? 0],
			['Total Distributions', data.totalDistributions ?? 0],
			['Inventory Items', data.totalInventoryItems ?? 0],
			['User Growth %', data.userGrowth ?? 0],
			['Seminar Growth %', data.seminarGrowth ?? 0],
			['Distribution Growth %', data.distributionGrowth ?? 0],
		];

		const csv = rows.map((r) => r.join(',')).join('\n');
		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', 'attachment; filename="overview.csv"');
		return res.send(csv);
	} catch (error) {
		console.error('exportOverviewCSV error:', error);
		return res.status(500).json({ success: false, message: 'Failed to export overview analytics' });
	}
};
