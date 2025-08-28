import { PrismaClient } from '../../prisma/generated/index.js';
import auditLogger from '../../Services/auditLogger.js';

const prisma = new PrismaClient();

export const updateSurveyStatistic = async (req, res) => {
    try {
        const { statisticId } = req.params;
        const adminId = req.user.id;
        const { chartType, title, description, config } = req.body;

        // Check if statistic exists
        const existingStatistic = await prisma.surveyStatistic.findUnique({
            where: { id: statisticId },
            include: {
                surveyForm: {
                    select: { id: true, title: true }
                }
            }
        });

        if (!existingStatistic) {
            return res.status(404).json({
                success: false,
                message: 'Survey statistic not found'
            });
        }

        // Prepare update data
        const updateData = {};
        if (chartType !== undefined) updateData.chartType = chartType.toUpperCase();
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (config !== undefined) updateData.config = config;

        // Update statistic
        const updatedStatistic = await prisma.surveyStatistic.update({
            where: { id: statisticId },
            data: updateData,
            include: {
                creator: {
                    select: { id: true, firstName: true, surname: true }
                }
            }
        });

        // Log the action
        await auditLogger.log({
            adminId: adminId,
            action: 'SURVEY_STATISTIC_UPDATE',
            targetType: 'SurveyStatistic',
            targetId: updatedStatistic.id,
            targetName: updatedStatistic.title,
            details: `Updated survey statistic: ${updatedStatistic.title} for survey: ${existingStatistic.surveyForm.title}`,
            metadata: {
                action: 'survey_statistic_updated',
                statisticTitle: updatedStatistic.title,
                chartType: updatedStatistic.chartType,
                surveyFormId: existingStatistic.surveyFormId,
                surveyFormTitle: existingStatistic.surveyForm.title
            },
            req: req
        });

        res.status(200).json({
            success: true,
            message: 'Survey statistic updated successfully',
            data: updatedStatistic
        });

    } catch (error) {
        console.error('Error updating survey statistic:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update survey statistic'
        });
    }
};
