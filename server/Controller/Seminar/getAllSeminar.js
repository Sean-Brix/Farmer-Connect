import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getAllSeminar(req, res) {
    try {
        const search = req.query.find || '';
        const searchFilter = req.query.filter || 'Title';
        let statusFilter = req.query.status || 'all';
        const where = {};
        const orderBy = [];

        if (statusFilter !== 'all') {
            const statuses = statusFilter.split(',');
            where.status = { in: statuses };
        }

        if (search) {
            const searchTerm = search;
            where.OR = [];

            if (searchFilter === 'Title' || searchFilter === '') {
                where.OR.push({
                    title: { contains: searchTerm},
                });
            }
            if (searchFilter === 'Speaker' || searchFilter === '') {
                where.OR.push({
                    speaker: { contains: searchTerm},
                });
            }
            if (searchFilter === 'Location' || searchFilter === '') {
                where.OR.push({
                    location: { contains: searchTerm},
                });
            }

            if (where.OR.length === 0) {
                delete where.OR;
            }
        }

        if (statusFilter === 'all') {
            orderBy.push({
                status: 'asc',
            });
        }

        orderBy.push({
            createdAt: 'asc',
        });

        const seminars = await prisma.seminar.findMany({
            where: where,
            orderBy: orderBy,
            include: {
                participants: {
                    select: { status: true }
                }
            },
        });

        const statusOrder = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

        seminars.sort((a, b) => {
            const aIndex = statusOrder.indexOf(a.status);
            const bIndex = statusOrder.indexOf(b.status);

            if (aIndex !== -1 && bIndex !== -1) {
                return aIndex - bIndex;
            } else if (aIndex !== -1) {
                return -1;
            } else if (bIndex !== -1) {
                return 1;
            } else {
                return 0;
            }
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
            totalParticipants: seminar.participants.filter(p => p.status !== 'Cancelled').length,
        }));

        return res.status(200).json({ list: seminarList });
    } catch (error) {
        console.error('Error fetching seminars:', error);
        return res.status(500).json({
            message: 'An error occurred while fetching seminars',
            payload: [],
        });
    }
}

export default getAllSeminar;
