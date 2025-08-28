import { PrismaClient } from '../../prisma/generated/index.js';
import auditLogger from '../../Services/auditLogger.js';

const prisma = new PrismaClient();

export const createSurveyStatistic = async (req, res) => {
    try {
        const { surveyFormId } = req.params;
        const adminId = req.user.id;
        const { chartType, title, description, config } = req.body;

        // Validation
        if (!chartType || !title || !config) {
            return res.status(400).json({
                success: false,
                message: 'Chart type, title, and config are required'
            });
        }

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

        // Create survey statistic
        const statistic = await prisma.surveyStatistic.create({
            data: {
                surveyFormId,
                chartType: chartType.toUpperCase(),
                title,
                description,
                config,
                createdById: adminId
            },
            include: {
                creator: {
                    select: { id: true, firstName: true, surname: true }
                }
            }
        });

        // Log the action
        await auditLogger.log({
            adminId: adminId,
            action: 'SURVEY_STATISTIC_CREATE',
            targetType: 'SurveyStatistic',
            targetId: statistic.id,
            targetName: statistic.title,
            details: `Created new survey statistic: ${statistic.title} for survey: ${surveyForm.title}`,
            metadata: {
                action: 'survey_statistic_created',
                statisticTitle: statistic.title,
                chartType: statistic.chartType,
                surveyFormId: surveyFormId,
                surveyFormTitle: surveyForm.title
            },
            req: req
        });

        res.status(201).json({
            success: true,
            message: 'Survey statistic created successfully',
            data: statistic
        });

    } catch (error) {
        console.error('Error creating survey statistic:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create survey statistic'
        });
    }
};
