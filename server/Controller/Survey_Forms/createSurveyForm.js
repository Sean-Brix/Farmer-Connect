import { PrismaClient } from '../../prisma/generated/index.js';
import auditLogger from '../../Services/auditLogger.js';

const prisma = new PrismaClient();

export const createSurveyForm = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { title, description, status, category, fields } = req.body;

        // Validation
        if (!title || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title and category are required'
            });
        }

        // Validate fields if provided
        if (fields && Array.isArray(fields)) {
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                if (!field.type || !field.label) {
                    return res.status(400).json({
                        success: false,
                        message: `Field ${i + 1} must have type and label`
                    });
                }
            }
        }

        // Create survey form
        const surveyForm = await prisma.surveyForm.create({
            data: {
                title,
                description,
                status: status || 'DRAFT',
                category,
                createdById: adminId,
                fields: {
                    create: fields?.map((field, index) => ({
                        type: field.type.toUpperCase(),
                        label: field.label,
                        placeholder: field.placeholder,
                        required: field.required || false,
                        options: field.options || null,
                        order: index + 1
                    })) || []
                }
            },
            include: {
                fields: {
                    orderBy: { order: 'asc' }
                },
                creator: {
                    select: { id: true, firstName: true, surname: true }
                }
            }
        });

        // Log the action
        await auditLogger.log({
            adminId: adminId,
            action: 'SURVEY_FORM_CREATE',
            targetType: 'SurveyForm',
            targetId: surveyForm.id,
            targetName: surveyForm.title,
            details: `Created new survey form: ${surveyForm.title}`,
            metadata: {
                action: 'survey_form_created',
                title: surveyForm.title,
                category: surveyForm.category,
                status: surveyForm.status,
                fieldsCount: fields?.length || 0
            },
            req: req
        });

        res.status(201).json({
            success: true,
            message: 'Survey form created successfully',
            data: surveyForm
        });

    } catch (error) {
        console.error('Error creating survey form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create survey form'
        });
    }
};
