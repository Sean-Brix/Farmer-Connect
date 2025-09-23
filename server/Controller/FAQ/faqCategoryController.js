import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all FAQ categories
export const getFAQCategories = async (req, res) => {
    try {
        const { includeInactive } = req.query;
        
        const whereClause = includeInactive === 'true' ? {} : { isActive: true };

        const categories = await prisma.fAQCategory.findMany({
            where: whereClause,
            include: {
                faqs: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        question: true,
                        viewCount: true,
                        helpfulCount: true
                    },
                    orderBy: [
                        { orderIndex: 'asc' },
                        { viewCount: 'desc' }
                    ]
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
                { createdAt: 'desc' }
            ]
        });

        // Add FAQ count to each category
        const categoriesWithCount = categories.map(category => ({
            ...category,
            faqCount: category.faqs.length
        }));

        res.json({
            success: true,
            data: categoriesWithCount,
            categories: categoriesWithCount,
            count: categoriesWithCount.length
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

// Get single FAQ category with its FAQs
export const getFAQCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await prisma.fAQCategory.findUnique({
            where: { id },
            include: {
                faqs: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        question: true,
                        answer: true,
                        viewCount: true,
                        helpfulCount: true,
                        createdAt: true,
                        orderIndex: true
                    },
                    orderBy: [
                        { orderIndex: 'asc' },
                        { viewCount: 'desc' }
                    ]
                },
                createdBy: {
                    select: {
                        username: true,
                        firstName: true,
                        surname: true
                    }
                }
            }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'FAQ category not found'
            });
        }

        res.json({
            success: true,
            data: {
                ...category,
                faqCount: category.faqs.length
            }
        });

    } catch (error) {
        console.error('Error fetching FAQ category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch FAQ category',
            error: error.message
        });
    }
};

// Admin: Create FAQ category
export const createFAQCategory = async (req, res) => {
    try {
        const { name, description, isActive, orderIndex } = req.body;
        
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        // Check if category with same name already exists (case-insensitive for MySQL)
        const existingCategory = await prisma.fAQCategory.findFirst({
            where: { 
                name: {
                    equals: name.trim()
                }
            }
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'A category with this name already exists'
            });
        }

        const category = await prisma.fAQCategory.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                isActive: isActive !== undefined ? isActive : true,
                orderIndex: orderIndex || 0,
                createdById: req.user.id
            },
            include: {
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
            data: {
                ...category,
                faqCount: 0
            },
            message: 'FAQ category created successfully'
        });

    } catch (error) {
        console.error('Error creating FAQ category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create FAQ category',
            error: error.message
        });
    }
};

// Admin: Update FAQ category
export const updateFAQCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isActive, orderIndex } = req.body;

        // Check if category exists
        const existingCategory = await prisma.fAQCategory.findUnique({
            where: { id }
        });

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'FAQ category not found'
            });
        }

        // If name is being updated, check for duplicates
        if (name && name.trim() !== existingCategory.name) {
            const duplicateCategory = await prisma.fAQCategory.findFirst({
                where: { 
                    name: {
                        equals: name.trim()
                    },
                    NOT: { id }
                }
            });

            if (duplicateCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'A category with this name already exists'
                });
            }
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description?.trim() || null;
        if (typeof isActive === 'boolean') updateData.isActive = isActive;
        if (typeof orderIndex === 'number') updateData.orderIndex = orderIndex;

        const category = await prisma.fAQCategory.update({
            where: { id },
            data: updateData,
            include: {
                faqs: {
                    where: { isActive: true },
                    select: { id: true }
                },
                createdBy: {
                    select: {
                        username: true,
                        firstName: true,
                        surname: true
                    }
                }
            }
        });

        res.json({
            success: true,
            data: {
                ...category,
                faqCount: category.faqs.length
            },
            message: 'FAQ category updated successfully'
        });

    } catch (error) {
        console.error('Error updating FAQ category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update FAQ category',
            error: error.message
        });
    }
};

// Admin: Delete FAQ category
export const deleteFAQCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { moveToCategory } = req.body; // Optional: ID of category to move FAQs to

        // Check if category exists
        const category = await prisma.fAQCategory.findUnique({
            where: { id },
            include: {
                faqs: { select: { id: true } }
            }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'FAQ category not found'
            });
        }

        // Handle FAQs in this category
        if (category.faqs.length > 0) {
            if (moveToCategory) {
                // Move FAQs to another category
                await prisma.fAQ.updateMany({
                    where: { categoryId: id },
                    data: { categoryId: moveToCategory }
                });
            } else {
                // Set FAQs to uncategorized (null category)
                await prisma.fAQ.updateMany({
                    where: { categoryId: id },
                    data: { categoryId: null }
                });
            }
        }

        // Delete the category
        await prisma.fAQCategory.delete({
            where: { id }
        });

        res.json({
            success: true,
            message: `FAQ category deleted successfully. ${category.faqs.length} FAQs were ${moveToCategory ? 'moved to another category' : 'set to uncategorized'}.`
        });

    } catch (error) {
        console.error('Error deleting FAQ category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete FAQ category',
            error: error.message
        });
    }
};

// Admin: Reorder FAQ categories
export const reorderFAQCategories = async (req, res) => {
    try {
        const { categories } = req.body; // Array of { id, orderIndex }

        if (!Array.isArray(categories)) {
            return res.status(400).json({
                success: false,
                message: 'Categories array is required'
            });
        }

        // Update each category's order index
        const updatePromises = categories.map(({ id, orderIndex }) => 
            prisma.fAQCategory.update({
                where: { id },
                data: { orderIndex: orderIndex || 0 }
            })
        );

        await Promise.all(updatePromises);

        res.json({
            success: true,
            message: 'FAQ categories reordered successfully'
        });

    } catch (error) {
        console.error('Error reordering FAQ categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reorder FAQ categories',
            error: error.message
        });
    }
};