import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function cancelUserRegistration(req, res) {
    try {
        const userId = req.user.id;
        const seminarId = req.params.id;

        // Check if the seminar exists and the user is registered
        const seminar = await prisma.seminar.findUnique({
            where: { id: seminarId },
            select: {
                participants: {
                    where: { account_id: userId },
                },
            },
        });

        if (!seminar || seminar.participants.length === 0) {
            return res.status(404).json({ error: 'Seminar not found or user not registered' });
        }

        // Set participant's registration status to 'cancelled'
        await prisma.seminarParticipant.updateMany({
            where: {
                seminar_id: seminarId,
                account_id: userId,
            },
            data: {
                status: 'Cancelled',
            },
        });
        
        return res.status(200).json({ message: 'Registration cancelled successfully' });
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default cancelUserRegistration;