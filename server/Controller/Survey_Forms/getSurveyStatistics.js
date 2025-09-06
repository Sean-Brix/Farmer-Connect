import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSurveyStatistics = async (req, res) => {
    try {
        const { surveyFormId } = req.params;

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

        // Get survey statistics
        const statistics = await prisma.surveyStatistic.findMany({
            where: { surveyFormId },
            include: {
                creator: {
                    select: { id: true, firstName: true, surname: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            data: {
                surveyForm,
                statistics
            }
        });

    } catch (error) {
        console.error('Error fetching survey statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch survey statistics'
        });
    }
};
