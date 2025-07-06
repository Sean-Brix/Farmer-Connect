import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getAllSeminar(req, res) {
    try {
        const filters = {
            status: req.query.status,
            order: req.query.order,
            search: req.query.search,
        };

        const where = {};
        const orderBy = {};

        if (filters.status) {
            const statuses = filters.status.split(',');
            where.status = { in: statuses };
        }

        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search } },
                { description: { contains: filters.search } },
                { location: { contains: filters.search } },
                { speaker: { contains: filters.search } },
            ];
        }

        if (filters.order) {
            if (filters.order === 'Title') {
                orderBy.title = 'asc';
            } else if (filters.order === 'Location') {
                orderBy.location = 'asc';
            } else if (filters.order === 'Speaker') {
                orderBy.speaker = 'asc';
            } else if (filters.order === 'Start Date') {
                orderBy.start_date = 'asc';
            } else if (filters.order === 'End Date') {
                orderBy.end_date = 'asc';
            } else if (filters.order === 'Date Created') {
            orderBy.createdAt = 'asc';
            } else if (filters.order === 'Recently Updated') {
                orderBy.updatedAt = 'desc';
        }
        } 
        else {
            orderBy.createdAt = 'asc';
        }

        const seminars = await prisma.seminar.findMany({
            where: where,
            orderBy: orderBy,
            include: {
                _count: {
                    select: { participants: true },
                },
            },
        });

        const seminarList = seminars.map((seminar) => ({
            id: seminar.id,
            title: seminar.title,
            description: seminar.description,
            location: seminar.location,
            speaker: seminar.speaker,
            start_date: seminar.start_date,
            end_date: seminar.end_date,
            start_time: seminar.start_time,
            end_time: seminar.end_time,
            capacity: seminar.capacity,
            registration_deadline: seminar.registration_deadline,
            status: seminar.status,
            photo: seminar.photo,
            createdAt: seminar.createdAt,
            updatedAt: seminar.updatedAt,
            participantCount: seminar._count.participants,
        }));

        return res.status(200).json({ list: seminarList });
    } 
    catch (error) {
        console.error('Error fetching seminars:', error);
        return res.status(500).json({
            message: 'An error occurred while fetching seminars',
            payload: [],
        });
    }
}

export default getAllSeminar;
