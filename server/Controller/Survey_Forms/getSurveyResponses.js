import { PrismaClient } from '../../prisma/generated/index.js';

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

        // Check if survey form exists
        const surveyForm = await prisma.surveyForm.findUnique({
            where: { id: surveyFormId },
            select: { id: true, title: true }
        });

        if (!surveyForm) {
            return res.status(404).json({
                success: false,
                message: 'Survey form not found'
            });
        }

        // Order by clause
        const orderBy = {};
        orderBy[sortBy] = sortOrder.toLowerCase();

        // Get total count for pagination
        const total = await prisma.surveyResponse.count({
            where: { surveyFormId }
        });

        // Get survey responses
        const responses = await prisma.surveyResponse.findMany({
            where: { surveyFormId },
            skip,
            take,
            orderBy,
            include: {
                user: {
                    select: { id: true, firstName: true, surname: true, email: true }
                },
                answers: {
                    include: {
                        field: {
                            select: { id: true, label: true, type: true, options: true }
                        }
                    }
                }
            }
        });

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
