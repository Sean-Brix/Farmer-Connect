import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all FAQs
export const getFAQs = async (req, res) => {
    try {
        const { category, search } = req.query;
        
        const whereClause = {
            isActive: true,
            ...(category && { category }),
            ...(search && {
                OR: [
                    { question: { contains: search, mode: 'insensitive' } },
                    { answer: { contains: search, mode: 'insensitive' } }
                ]
            })
        };

        const faqs = await prisma.fAQ.findMany({
            where: whereClause,
            select: {
                id: true,
                question: true,
                answer: true,
                category: true,
                viewCount: true,
                helpfulCount: true,
                createdAt: true
            },
            orderBy: [
                { viewCount: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        res.json({
            success: true,
            data: faqs,
            count: faqs.length
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

// Get FAQ categories
export const getFAQCategories = async (req, res) => {
    try {
        const categories = await prisma.fAQ.findMany({
            where: { isActive: true },
            select: { category: true },
            distinct: ['category']
        });

        const categoryList = categories.map(c => c.category).filter(Boolean);

        res.json({
            success: true,
            data: categoryList
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
        const { question, answer, category } = req.body;
        
        if (!question || !answer) {
            return res.status(400).json({
                success: false,
                message: 'Question and answer are required'
            });
        }

        const faq = await prisma.fAQ.create({
            data: {
                question,
                answer,
                category: category || 'General',
                createdById: req.user.id
            },
            select: {
                id: true,
                question: true,
                answer: true,
                category: true,
                isActive: true,
                createdAt: true,
                createdBy: {
                    select: {
                        username: true,
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
        const { question, answer, category, isActive } = req.body;

        const faq = await prisma.fAQ.update({
            where: { id },
            data: {
                ...(question && { question }),
                ...(answer && { answer }),
                ...(category && { category }),
                ...(typeof isActive === 'boolean' && { isActive })
            },
            select: {
                id: true,
                question: true,
                answer: true,
                category: true,
                isActive: true,
                viewCount: true,
                helpfulCount: true,
                updatedAt: true
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
        const { category, search, isActive } = req.query;
        
        const whereClause = {
            ...(category && { category }),
            ...(typeof isActive === 'string' && { isActive: isActive === 'true' }),
            ...(search && {
                OR: [
                    { question: { contains: search, mode: 'insensitive' } },
                    { answer: { contains: search, mode: 'insensitive' } }
                ]
            })
        };

        const faqs = await prisma.fAQ.findMany({
            where: whereClause,
            include: {
                createdBy: {
                    select: {
                        username: true,
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
            data: faqs,
            count: faqs.length
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
