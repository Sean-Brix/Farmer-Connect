import { PrismaClient } from '../../prisma/generated/index.js';

const prisma = new PrismaClient();

export const getSurveyFormById = async (req, res) => {
    try {
        const { id } = req.params;

        const surveyForm = await prisma.surveyForm.findUnique({
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

        if (!surveyForm) {
            return res.status(404).json({
                success: false,
                message: 'Survey form not found'
            });
        }

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
