import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSurveyResponses = async (req, res) => {
    try {
        const { surveyFormId } = req.params;
        const {
            page = 1,
            limit = 10,
            sortBy = 'submittedAt',
            sortOrder = 'desc'
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);



        if (!surveyForm) {
            return res.status(404).json({
                success: false,
                message: 'Survey form not found'
            });
        }

        // Order by clause
        const orderBy = {};
        orderBy[sortBy] = sortOrder.toLowerCase();

        // Execute queries in parallel for better performance
        const [surveyForm, total, responsesRaw] = await Promise.all([
            // Check if survey form exists
            prisma.surveyForm.findUnique({
                where: { id: surveyFormId },
                select: { id: true, title: true }
            }),
            
            // Get total count
            prisma.surveyResponse.count({
                where: { surveyFormId }
            }),
            
            // Get survey responses with selective fields
            prisma.surveyResponse.findMany({
                where: { surveyFormId },
                skip,
                take,
                orderBy,
                select: {
                    id: true,
                    surveyFormId: true,
                    userId: true,
                    submittedAt: true,
                    user: {
                        select: { 
                            id: true, 
                            firstName: true, 
                            surname: true, 
                            email: true 
                        }
                    },
                    answers: {
                        select: {
                            id: true,
                            fieldId: true,
                            answer: true,
                            field: {
                                select: { 
                                    id: true, 
                                    label: true, 
                                    type: true, 
                                    options: true 
                                }
                            }
                        }
                    }
                }
            })
        ]);

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

        const responses = responsesRaw.map(r => ({
            ...r,
            answers: (r.answers || []).map(a => ({
                ...a,
                answer: parseAnswer(a.answer),
                field: a.field ? { ...a.field, options: parseOptions(a.field.options) } : a.field
            }))
        }));

        // Calculate pagination info
        const totalPages = Math.ceil(total / take);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        res.status(200).json({
            success: true,
            data: {
                surveyForm,
                responses
            },
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: take,
                hasNext,
                hasPrev
            }
        });

    } catch (error) {
        console.error('Error fetching survey responses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch survey responses'
        });
    }
};
