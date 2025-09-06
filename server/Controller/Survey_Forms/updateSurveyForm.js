import { PrismaClient } from '../../prisma/generated/index.js';
import auditLogger from '../../Services/auditLogger.js';

const prisma = new PrismaClient();

export const updateSurveyForm = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        const { title, description, status, category, fields } = req.body;

        // Check if survey form exists
        const existingSurveyForm = await prisma.surveyForm.findUnique({
            where: { id },
            include: { fields: true }
        });

        if (!existingSurveyForm) {
            return res.status(404).json({
                success: false,
                message: 'Survey form not found'
            });
        }

        // Validation
        if (title && title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Title cannot be empty'
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

        // Prepare update data
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status.toUpperCase();
        if (category !== undefined) updateData.category = category;

        // Update survey form
        const updatedSurveyForm = await prisma.$transaction(async (tx) => {
            // Update main survey form
            const updated = await tx.surveyForm.update({
                where: { id },
                data: updateData
            });

            // Update fields if provided
            if (fields && Array.isArray(fields)) {
                // Delete existing fields
                await tx.surveyField.deleteMany({
                    where: { surveyFormId: id }
                });

                // Create new fields
                if (fields.length > 0) {
                    await tx.surveyField.createMany({
                        data: fields.map((field, index) => ({
                            surveyFormId: id,
                            type: field.type.toUpperCase(),
                            label: field.label,
                            placeholder: field.placeholder,
                            required: field.required || false,
                            options: field.options || null,
                            order: index + 1
                        }))
                    });
                }
            }

            return updated;
        });

        // Fetch the updated survey form with relations
        const surveyForm = await prisma.surveyForm.findUnique({
            where: { id },
            include: {
                fields: {
                    orderBy: { order: 'asc' }
                },
                creator: {
                    select: { id: true, firstName: true, surname: true }
                },
                _count: {
                    select: {
                        responses: true,
                        fields: true
                    }
                }
            }
        });

        // Log the action
        await auditLogger.logSurveyFormAction(
            adminId,
            'SURVEY_FORM_UPDATE',
            surveyForm,
            `Updated survey form: ${surveyForm.title}`,
            {
                action: 'survey_form_updated',
                fieldsCount: surveyForm._count.fields
            },
            req
        );

        res.status(200).json({
            success: true,
            message: 'Survey form updated successfully',
            data: surveyForm
        });

    } catch (error) {
        console.error('Error updating survey form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update survey form'
        });
    }
};
