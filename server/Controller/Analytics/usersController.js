import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsersAnalytics = async (req, res) => {
	try {
	const { from, to } = req.query;
		const now = new Date();
		const start30 = new Date(now);
		start30.setDate(start30.getDate() - 30);
	const fromDate = from ? new Date(from) : null;
	const toDate = to ? new Date(to) : now;

			const [total, createdLast30, bySex, byRegion, byClientProfile, byEducation, activeByTx, activeBySem] = await Promise.all([
			prisma.account.count(),
			prisma.account.count({ where: { createdAt: { gte: start30 } } }),
			prisma.account.groupBy({ by: ['sex'], _count: { sex: true } }),
			prisma.account.groupBy({ by: ['region'], _count: { region: true } }),
				prisma.account.groupBy({ by: ['client_profile'], _count: { client_profile: true } }),
				prisma.account.groupBy({ by: ['education'], _count: { education: true } }),
			prisma.itemTransaction.groupBy({ by: ['accountId'], where: { createdAt: { gte: start30 } }, _count: { accountId: true } }),
			prisma.seminarParticipant.groupBy({ by: ['account_id'], where: { createdAt: { gte: start30 } }, _count: { account_id: true } }),
		]);

		const activeUsers = new Set([...(activeByTx?.map(x => x.accountId) || []), ...(activeBySem?.map(x => x.account_id) || [])]).size;

			const monthlyRegistrations = await prisma.$queryRaw`SELECT DATE_FORMAT(createdAt, '%b') AS m, COUNT(*) AS c FROM accounts GROUP BY m ORDER BY MIN(createdAt)`;

			let period = undefined;
			if (fromDate) {
				const [createdPeriod, activeTxPeriod, activeSemPeriod] = await Promise.all([
					prisma.account.count({ where: { createdAt: { gte: fromDate, lte: toDate } } }),
					prisma.itemTransaction.groupBy({ by: ['accountId'], where: { createdAt: { gte: fromDate, lte: toDate } }, _count: { accountId: true } }),
					prisma.seminarParticipant.groupBy({ by: ['account_id'], where: { createdAt: { gte: fromDate, lte: toDate } }, _count: { account_id: true } }),
				]);
				period = { created: createdPeriod, activeUsers: new Set([...(activeTxPeriod?.map(x => x.accountId) || []), ...(activeSemPeriod?.map(x => x.account_id) || [])]).size };
			}

		const payload = {
			total,
			createdLast30,
			activeUsers,
			demographics: {
				sex: bySex.reduce((acc, r) => ({ ...acc, [r.sex || 'Unknown']: r._count.sex }), {}),
				region: byRegion.reduce((acc, r) => ({ ...acc, [r.region || 'Unknown']: r._count.region }), {}),
			client_profile: byClientProfile.reduce((acc, r) => ({ ...acc, [r.client_profile || 'Unknown']: r._count.client_profile }), {}),
			education: byEducation.reduce((acc, r) => ({ ...acc, [r.education || 'Unknown']: r._count.education }), {}),
			},
			monthlyRegistrations: (monthlyRegistrations || []).map(r => Number(r.c)),
			period,
		};

		return res.json({ success: true, payload });
	} catch (error) {
		console.error('getUsersAnalytics error:', error);
		return res.status(500).json({ success: false, message: 'Failed to get users analytics' });
	}
};

export const exportUsersCSV = async (req, res) => {
	try {
		const resp = await new Promise((resolve) => {
			getUsersAnalytics(req, { json: (obj) => resolve(obj), status: () => ({ json: (obj) => resolve(obj) }) });
		});

		const d = resp.payload || {};
		const rows = [
			['Metric', 'Value'],
			['Total Users', d.total ?? 0],
			['New Last 30d', d.createdLast30 ?? 0],
			['Active Users (30d)', d.activeUsers ?? 0],
		];

		// Demographics by sex
		if (d.demographics?.sex) {
			rows.push(['Sex Breakdown', '']);
			for (const [k, v] of Object.entries(d.demographics.sex)) rows.push([k, v]);
		}
		// Demographics by region
		if (d.demographics?.region) {
			rows.push(['Region Breakdown', '']);
			for (const [k, v] of Object.entries(d.demographics.region)) rows.push([k, v]);
		}

		const csv = rows.map(r => r.join(',')).join('\n');
		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', 'attachment; filename="users_analytics.csv"');
		return res.send(csv);
	} catch (error) {
		console.error('exportUsersCSV error:', error);
		return res.status(500).json({ success: false, message: 'Failed to export users analytics' });
	}
};

