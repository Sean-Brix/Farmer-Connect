import prisma from '../../config/database.js';

export const getSeminarsAnalytics = async (req, res) => {
	try {
	const { from, to } = req.query;
		const now = new Date();
		const start6mo = new Date(now);
		start6mo.setMonth(start6mo.getMonth() - 6);
	const fromDate = from ? new Date(from) : null;
	const toDate = to ? new Date(to) : now;

		const [total, byStatus, attendance, monthly] = await Promise.all([
			prisma.seminar.count(),
			prisma.seminar.groupBy({ by: ['status'], _count: { status: true } }),
			prisma.seminarParticipant.groupBy({ by: ['status'], _count: { status: true } }),
			prisma.$queryRaw`SELECT DATE_FORMAT(createdAt, '%b') AS m, COUNT(*) AS c FROM seminars WHERE createdAt >= ${start6mo} GROUP BY m ORDER BY MIN(createdAt)`
		]);

		// Category proxy: top keywords in title (if categories not modeled)
		const recent = await prisma.seminar.findMany({ where: { createdAt: { gte: fromDate || start6mo, lte: toDate } }, select: { title: true } });
		const cat = { farming: 0, technology: 0, business: 0, others: 0 };
		const kw = {
			farming: [/farm/i, /crop/i, /soil/i],
			technology: [/tech/i, /system/i, /digital/i],
			business: [/market/i, /finance/i, /biz/i]
		};
		for (const s of recent) {
			const t = s.title || '';
			let matched = false;
			for (const [k, arr] of Object.entries(kw)) {
				if (arr.some((re) => re.test(t))) { cat[k]++; matched = true; break; }
			}
			if (!matched) cat.others++;
		}

		const payload = {
			total,
			byStatus: byStatus.reduce((acc, r) => ({ ...acc, [r.status]: r._count.status }), {}),
			attendance: attendance.reduce((acc, r) => ({ ...acc, [r.status]: r._count.status }), {}),
			monthly: (monthly || []).map(r => Number(r.c)),
			categories: cat,
		};

		return res.json({ success: true, payload });
	} catch (error) {
		console.error('getSeminarsAnalytics error:', error);
		return res.status(500).json({ success: false, message: 'Failed to get seminars analytics' });
	}
};

export const exportSeminarsCSV = async (req, res) => {
	try {
		const resp = await new Promise((resolve) => {
			getSeminarsAnalytics(req, { json: (obj) => resolve(obj), status: () => ({ json: (obj) => resolve(obj) }) });
		});
		const d = resp.payload || {};
		const rows = [['Metric', 'Value']];
		rows.push(['Total Seminars', d.total ?? 0]);
		rows.push(['By Status', '']);
		for (const [k, v] of Object.entries(d.byStatus || {})) rows.push([k, v]);
		rows.push(['Attendance', '']);
		for (const [k, v] of Object.entries(d.attendance || {})) rows.push([k, v]);
		rows.push(['Categories', '']);
		for (const [k, v] of Object.entries(d.categories || {})) rows.push([k, v]);

		const csv = rows.map(r => r.join(',')).join('\n');
		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', 'attachment; filename="seminars_analytics.csv"');
		return res.send(csv);
	} catch (error) {
		console.error('exportSeminarsCSV error:', error);
		return res.status(500).json({ success: false, message: 'Failed to export seminars analytics' });
	}
};

