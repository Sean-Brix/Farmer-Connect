import { PrismaClient } from '@prisma/client';
import auditLogger from '../../Services/auditLogger.js';

const prisma = new PrismaClient();

export const deleteSurveyForm = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        // Check if survey form exists
        const surveyForm = await prisma.surveyForm.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        responses: true
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

        // Check if survey form has responses
        if (surveyForm._count.responses > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete survey form with existing responses. Consider archiving instead.'
            });
        }

        // Delete survey form (cascade delete will handle fields, statistics)
        await prisma.surveyForm.delete({
            where: { id }
        });

        // Log the action
        await auditLogger.log({
            adminId: adminId,
            action: 'SURVEY_FORM_DELETE',
            targetType: 'SurveyForm',
            targetId: surveyForm.id,
            targetName: surveyForm.title,
            details: `Deleted survey form: ${surveyForm.title}`,
            metadata: {
                action: 'survey_form_deleted',
                title: surveyForm.title,
                category: surveyForm.category,
                status: surveyForm.status
            },
            req: req
        });

        res.status(200).json({
            success: true,
            message: 'Survey form deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting survey form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete survey form'
        });
    }
};
