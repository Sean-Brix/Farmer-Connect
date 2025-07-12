import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function applySeminar(req, res) {
    const seminarId = req.params.id;
    const userId = req.user.id;

    try {
        // Check if the seminar exists
        const seminar = await prisma.seminar.findUnique({
            where: { id: seminarId },
        });

        if (!seminar) {
            return res.status(404).json({ message: 'Seminar not found' });
        }

        // Check if seminar has available capacity
        const participantCount = await prisma.seminarParticipant.count({
            where: {
                seminar_id: seminarId,
                status: {
                    not: 'Cancelled',
                },
            },
        });

        if (participantCount >= seminar.capacity) {
            return res.status(400).json({ message: 'Seminar is full' });
        }

        // Check if the user has already applied
        const existingApplication = await prisma.seminarParticipant.findFirst({
            where: {
                seminar_id: seminarId,
                account_id: userId,
            },
        });

        if (existingApplication) {
            if (existingApplication.status !== 'Cancelled') {
                return res
                    .status(400)
                    .json({
                        message: 'You have already registered for this seminar',
                    });
            }

            // If status is 'Cancelled', allow re-application by updating the status to 'Registered'
            const updatedParticipant = await prisma.seminarParticipant.update({
                where: { id: existingApplication.id },
                data: { status: 'Registered' },
            });
            return res.status(201).json(updatedParticipant);
        }

        // Create a new participant record with status 'Registered'
        const participant = await prisma.seminarParticipant.create({
            data: {
                seminar_id: seminarId,
                account_id: userId,
                status: 'Registered',
            },
        });

        return res.status(201).json(participant);
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default applySeminar;