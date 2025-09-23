import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSurveyForms = async (req, res) => {
    try {
        const {
            search = '',
            searchField = 'title',
            status = 'all',
            category = 'all',
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Build where clause
        const where = {};

        // Status filter
        if (status !== 'all') {
            const statuses = status.split(',').map(s => s.toUpperCase());
            where.status = { in: statuses };
        }

        // Category filter
        if (category !== 'all') {
            where.category = category;
        }

        // Search filter
        if (search) {
            where.OR = [];
            
            if (searchField === 'title' || searchField === 'all') {
                where.OR.push({
                    title: { contains: search }
                });
            }
            
            if (searchField === 'description' || searchField === 'all') {
                where.OR.push({
                    description: { contains: search }
                });
            }
            
            if (searchField === 'category' || searchField === 'all') {
                where.OR.push({
                    category: { contains: search }
                });
            }

            if (where.OR.length === 0) {
                delete where.OR;
            }
        }

        // Order by clause
        const orderBy = {};
        orderBy[sortBy] = sortOrder.toLowerCase();

        // Get total count for pagination
        const total = await prisma.surveyForm.count({ where });

        // Get survey forms
        const surveyForms = await prisma.surveyForm.findMany({
            where,
            skip,
            take,
            orderBy,
            include: {
                fields: {
                    orderBy: { order: 'asc' }
                },
                responses: {
                    select: { id: true }
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

        // Helper to safely parse options JSON strings
        const parseOptions = (opts) => {
            if (opts == null) return null;
            if (Array.isArray(opts)) return opts;
            try {
                const parsed = JSON.parse(opts);
                return Array.isArray(parsed) ? parsed : null;
            } catch {
                return null;
            }
        };

        // Format response with parsed field options to arrays
        const formattedSurveyForms = surveyForms.map(form => ({
            id: form.id,
            title: form.title,
            description: form.description,
            status: form.status,
            category: form.category,
            createdAt: form.createdAt,
            updatedAt: form.updatedAt,
            creator: form.creator,
            fieldsCount: form._count.fields,
            responsesCount: form._count.responses,
            fields: (form.fields || []).map(f => ({
                ...f,
                options: parseOptions(f.options)
            }))
        }));

        // Calculate pagination info
        const totalPages = Math.ceil(total / take);
        const currentPageNum = parseInt(page);
        const hasNext = currentPageNum < totalPages;
        const hasPrev = currentPageNum > 1;

        res.status(200).json({
            success: true,
            data: formattedSurveyForms,
            pagination: {
                currentPage: currentPageNum,
                totalPages,
                totalItems: total,
                itemsPerPage: take,
                hasNext,
                hasPrev
            }
        });

    } catch (error) {
        console.error('Error fetching survey forms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch survey forms'
        });
    }
};
