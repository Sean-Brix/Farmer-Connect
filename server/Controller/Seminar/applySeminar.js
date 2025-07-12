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

        // Check if the user has already applied
        const existingApplication = await prisma.seminarParticipant.findFirst({
            where: {
                seminar_id: seminarId,
                account_id: userId,
            },
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this seminar' });
        }

        // Create a new participant record
        const participant = await prisma.seminarParticipant.create({
            data: {
                seminar_id: seminarId,
                account_id: userId,
                status: 'Registered', // Default status
            },
        });

        return res.status(201).json(participant);
    } catch (error) {
        console.error('Error applying for seminar:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default applySeminar;