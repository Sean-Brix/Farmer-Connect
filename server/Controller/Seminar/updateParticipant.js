import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function updateParticipant(req, res) {
    const { new_status } = req.body;
    const participants_id = req.params.id;

    if (!participants_id || !new_status) {
        return res
            .status(400)
            .json({ message: 'Missing participants_id or new_status' });
    }

    try {
        const existingParticipant = await prisma.seminarParticipant.findUnique({
            where: {
                id: participants_id,
            },
        });

        if (!existingParticipant) {
            return res.status(404).json({ message: 'Participant not found' });
        }

        const newStatus = new_status == "Not Attended"? "Not_Attended":new_status;

        const updatedParticipant = await prisma.seminarParticipant.update({
            where: {
                id: participants_id,
            },
            data: {
                status: newStatus,
            },
        });

        return res.status(200).json(updatedParticipant);
    } 
    catch (error) {
        console.error('Error updating participant status:', error);
        return res.status(500).json({
            message: 'Failed to update participant status',
            error: error.message,
        });
    }
}

export default updateParticipant;
