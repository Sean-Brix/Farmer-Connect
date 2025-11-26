import prisma from '../../config/database.js';

export const getSurveyFormById = async (req, res) => {
    try {
        const { id } = req.params;

        const surveyFormRaw = await prisma.surveyForm.findUnique({
            where: { id },
            include: {
                fields: {
                    orderBy: { order: 'asc' }
                },
                responses: {
                    include: {
                        user: {
                            select: { id: true, firstName: true, surname: true }
                        },
                        answers: {
                            include: {
                                field: {
                                    select: { label: true, type: true }
                                }
                            }
                        }
                    },
                    orderBy: { submittedAt: 'desc' }
                },
                creator: {
                    select: { id: true, firstName: true, surname: true }
                },
                statistics: {
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: {
                        responses: true,
                        fields: true,
                        statistics: true
                    }
                }
            }
        });

        if (!surveyFormRaw) {
            return res.status(404).json({
                success: false,
                message: 'Survey form not found'
            });
        }

        // Normalize options and answers
        const parseOptions = (opts) => {
            if (opts == null) return null;
            if (Array.isArray(opts)) return opts;
            try { const p = JSON.parse(opts); return Array.isArray(p) ? p : null; } catch { return null; }
        };
        const parseAnswer = (ans) => {
            if (ans == null) return null;
            if (typeof ans !== 'string') return ans;
            try { return JSON.parse(ans); } catch { return ans; }
        };

        const surveyForm = {
            ...surveyFormRaw,
            fields: (surveyFormRaw.fields || []).map(f => ({ ...f, options: parseOptions(f.options) })),
            responses: (surveyFormRaw.responses || []).map(r => ({
                ...r,
                answers: (r.answers || []).map(a => ({ ...a, answer: parseAnswer(a.answer) }))
            }))
        };

        res.status(200).json({
            success: true,
            data: surveyForm
        });

    } catch (error) {
        console.error('Error fetching survey form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch survey form'
        });
    }
};
