import { PrismaClient } from '@prisma/client';
import auditLogger from '../../Services/auditLogger.js';

const prisma = new PrismaClient();

export const submitSurveyResponse = async (req, res) => {
    try {
        const { surveyFormId } = req.params;
        const { answers, metadata } = req.body;
        const userId = req.user?.id; // Optional for anonymous responses

        // Check if survey form exists and is active
        const surveyForm = await prisma.surveyForm.findUnique({
            where: { id: surveyFormId },
            include: {
                fields: true
            }
        });

        if (!surveyForm) {
            return res.status(404).json({
                success: false,
                message: 'Survey form not found'
            });
        }

        if (surveyForm.status !== 'ACTIVE') {
            return res.status(400).json({
                success: false,
                message: 'Survey form is not active'
            });
        }

        // Validate answers
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: 'Answers must be provided as an array'
            });
        }

        // Check required fields
        const requiredFields = surveyForm.fields.filter(field => field.required);
        const answeredFieldIds = answers.map(answer => answer.fieldId);
        
        for (const requiredField of requiredFields) {
            if (!answeredFieldIds.includes(requiredField.id)) {
                return res.status(400).json({
                    success: false,
                    message: `Required field "${requiredField.label}" is missing`
                });
            }
        }

        // Validate field existence and answer format
        for (const answer of answers) {
            const field = surveyForm.fields.find(f => f.id === answer.fieldId);
            if (!field) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid field ID: ${answer.fieldId}`
                });
            }
        }

        // Create survey response with answers
        const surveyResponse = await prisma.surveyResponse.create({
            data: {
                surveyFormId,
                userId,
                metadata: metadata || null,
                answers: {
                    create: answers.map(answer => ({
                        fieldId: answer.fieldId,
                        answer: answer.answer
                    }))
                }
            },
            include: {
                answers: {
                    include: {
                        field: {
                            select: { label: true, type: true }
                        }
                    }
                },
                user: userId ? {
                    select: { id: true, firstName: true, surname: true }
                } : undefined
            }
        });

        // If an admin is submitting on behalf (unlikely), log with adminId; otherwise, fallback to user if available
        const adminId = req.user?.access === 'Admin' || req.user?.access === 'Super_Admin' ? req.user.id : null;
        if (adminId) {
            await auditLogger.log({
                adminId,
                action: 'SURVEY_RESPONSE_SUBMIT',
                targetType: 'SurveyForm',
                targetId: surveyForm.id,
                targetName: surveyForm.title,
                details: `Survey response submitted for form: ${surveyForm.title}`,
                metadata: {
                    responseId: surveyResponse.id,
                    respondentId: userId || null,
                    answersCount: surveyResponse.answers?.length || 0
                },
                req
            });
        }

        res.status(201).json({
            success: true,
            message: 'Survey response submitted successfully',
            data: surveyResponse
        });

    } catch (error) {
        console.error('Error submitting survey response:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit survey response'
        });
    }
};
