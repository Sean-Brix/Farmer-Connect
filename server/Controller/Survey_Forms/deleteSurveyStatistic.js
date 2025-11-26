// PrismaClient import removed - using centralized db
import prisma from '../../config/database.js';
import auditLogger from '../../Services/auditLogger.js';

// Using centralized prisma instance

export const deleteSurveyStatistic = async (req, res) => {
    try {
        const { statisticId } = req.params;
        const adminId = req.user.id;

        // Check if statistic exists
        const statistic = await prisma.surveyStatistic.findUnique({
            where: { id: statisticId },
            include: {
                surveyForm: {
                    select: { id: true, title: true }
                }
            }
        });

        if (!statistic) {
            return res.status(404).json({
                success: false,
                message: 'Survey statistic not found'
            });
        }

        // Delete statistic
        await prisma.surveyStatistic.delete({
            where: { id: statisticId }
        });

        // Log the action
        await auditLogger.log({
            adminId: adminId,
            action: 'SURVEY_STATISTIC_DELETE',
            targetType: 'SurveyStatistic',
            targetId: statistic.id,
            targetName: statistic.title,
            details: `Deleted survey statistic: ${statistic.title} from survey: ${statistic.surveyForm.title}`,
            metadata: {
                action: 'survey_statistic_deleted',
                statisticTitle: statistic.title,
                chartType: statistic.chartType,
                surveyFormId: statistic.surveyFormId,
                surveyFormTitle: statistic.surveyForm.title
            },
            req: req
        });

        res.status(200).json({
            success: true,
            message: 'Survey statistic deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting survey statistic:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete survey statistic'
        });
    }
};
