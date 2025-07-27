import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getUserRegistration(req, res) {
    try {
        const userId = req.user.id;

        // Fetch all seminars where the user is a participant and status is not 'Cancelled'
        const userRegistrations = await prisma.seminarParticipant.findMany({
            where: {
                account_id: userId,
                status: {
                    not: 'Cancelled',
                },
            },
            select: {
                status: true,
                seminar: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        location: true,
                        speaker: true,
                        start_date: true,
                        end_date: true,
                        start_time: true,
                        end_time: true,
                        capacity: true,
                        registration_deadline: true,
                        status: true,
                    },
                },
            },
        });

        // Custom sort by seminar status: 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'
        const statusOrder = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];
        userRegistrations.sort((a, b) => {
            const aStatus = a.seminar.status;
            const bStatus = b.seminar.status;
            return statusOrder.indexOf(aStatus) - statusOrder.indexOf(bStatus);
        });

        return res.status(200).json(userRegistrations);
    } catch (error) {
        console.error('Get user registration error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default getUserRegistration;
