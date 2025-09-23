import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all FAQs
export const getFAQs = async (req, res) => {
    try {
        const { search, categoryId } = req.query;
        
        const whereClause = {
            isActive: true,
            ...(categoryId && { categoryId }),
            ...(search && {
                OR: [
                    { question: { contains: search } },
                    { answer: { contains: search } }
                ]
            })
        };

        const faqs = await prisma.fAQ.findMany({
            where: whereClause,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdBy: {
                    select: {
                        firstName: true,
                        surname: true
                    }
                }
            },
            orderBy: [
                { orderIndex: 'asc' },
                { viewCount: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        res.json({
            success: true,
            faqs: faqs,
            data: faqs,
            count: faqs.length,
            total: faqs.length
        });

    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch FAQs',
            error: error.message
        });
    }
};

// Get FAQ categories with FAQ counts (public endpoint - uses real database data)
export const getFAQCategories = async (req, res) => {
    try {
        const categories = await prisma.fAQCategory.findMany({
            where: { isActive: true },
            include: {
                faqs: {
                    where: { isActive: true },
                    select: { id: true }
                }
            },
            orderBy: [
                { orderIndex: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        const categoriesWithCount = categories.map(category => ({
            id: category.id,
            name: category.name,
            description: category.description,
            faqCount: category.faqs.length,
            orderIndex: category.orderIndex
        }));

        res.json({
            success: true,
            data: categoriesWithCount,
            categories: categoriesWithCount
        });

    } catch (error) {
        console.error('Error fetching FAQ categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch FAQ categories',
            error: error.message
        });
    }
};

// Increment FAQ view count
export const incrementFAQView = async (req, res) => {
    try {
        const { id } = req.params;

        const faq = await prisma.fAQ.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1
                }
            },
            select: {
                id: true,
                viewCount: true
            }
        });

        res.json({
            success: true,
            data: faq
        });

    } catch (error) {
        console.error('Error incrementing FAQ view:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update FAQ view count',
            error: error.message
        });
    }
};

// Mark FAQ as helpful
export const markFAQHelpful = async (req, res) => {
    try {
        const { id } = req.params;

        const faq = await prisma.fAQ.update({
            where: { id },
            data: {
                helpfulCount: {
                    increment: 1
                }
            },
            select: {
                id: true,
                helpfulCount: true
            }
        });

        res.json({
            success: true,
            data: faq
        });

    } catch (error) {
        console.error('Error marking FAQ helpful:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark FAQ as helpful',
            error: error.message
        });
    }
};

// Admin: Create FAQ
export const createFAQ = async (req, res) => {
    try {
        const { question, answer, categoryId, isActive, orderIndex } = req.body;
        
        if (!question || !answer) {
            return res.status(400).json({
                success: false,
                message: 'Question and answer are required'
            });
        }

        // Validate category if provided
        if (categoryId) {
            const categoryExists = await prisma.fAQCategory.findUnique({
                where: { id: categoryId }
            });
            
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category ID'
                });
            }
        }

        const faq = await prisma.fAQ.create({
            data: {
                question,
                answer,
                categoryId: categoryId || null,
                isActive: isActive !== undefined ? isActive : true,
                orderIndex: orderIndex || 0,
                createdById: req.user.id
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdBy: {
                    select: {
                        firstName: true,
                        surname: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            data: faq,
            message: 'FAQ created successfully'
        });

    } catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create FAQ',
            error: error.message
        });
    }
};

// Admin: Update FAQ
export const updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, categoryId, isActive, orderIndex } = req.body;

        // Validate category if provided
        if (categoryId) {
            const categoryExists = await prisma.fAQCategory.findUnique({
                where: { id: categoryId }
            });
            
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category ID'
                });
            }
        }

        const updateData = {};
        if (question !== undefined) updateData.question = question;
        if (answer !== undefined) updateData.answer = answer;
        if (categoryId !== undefined) updateData.categoryId = categoryId;
        if (typeof isActive === 'boolean') updateData.isActive = isActive;
        if (typeof orderIndex === 'number') updateData.orderIndex = orderIndex;

        const faq = await prisma.fAQ.update({
            where: { id },
            data: updateData,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdBy: {
                    select: {
                        firstName: true,
                        surname: true
                    }
                }
            }
        });

        res.json({
            success: true,
            data: faq,
            message: 'FAQ updated successfully'
        });

    } catch (error) {
        console.error('Error updating FAQ:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update FAQ',
            error: error.message
        });
    }
};

// Admin: Delete FAQ
export const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.fAQ.delete({
            where: { id }
        });

        res.json({
            success: true,
            message: 'FAQ deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting FAQ:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete FAQ',
            error: error.message
        });
    }
};

// Admin: Get all FAQs (including inactive)
export const getAllFAQsAdmin = async (req, res) => {
    try {
        const { search, isActive } = req.query;
        
        const whereClause = {
            ...(typeof isActive === 'string' && { isActive: isActive === 'true' }),
            ...(search && {
                OR: [
                    { question: { contains: search } },
                    { answer: { contains: search } }
                ]
            })
        };

        const faqs = await prisma.fAQ.findMany({
            where: whereClause,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdBy: {
                    select: {
                        firstName: true,
                        surname: true
                    }
                }
            },
            orderBy: [
                { isActive: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        res.json({
            success: true,
            faqs: faqs,
            data: faqs,
            count: faqs.length,
            total: faqs.length
        });

    } catch (error) {
        console.error('Error fetching all FAQs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch FAQs',
            error: error.message
        });
    }
};
