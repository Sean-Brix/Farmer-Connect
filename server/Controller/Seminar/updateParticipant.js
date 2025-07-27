import { PrismaClient } from '../../prisma/generated/client.js';
import auditLogger from '../../Services/auditLogger.js';

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
        // Get existing participant with full details for audit logging
        const existingParticipant = await prisma.seminarParticipant.findUnique({
            where: {
                id: participants_id,
            },
            include: {
                account: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        username: true,
                        email: true,
                    },
                },
                seminar: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        if (!existingParticipant) {
            return res.status(404).json({ message: 'Participant not found' });
        }

        const newStatus =
            new_status == 'Not Attended' ? 'Not_Attended' : new_status;

        // Only update if status is actually changing
        if (existingParticipant.status === newStatus) {
            return res.status(200).json({
                message: 'Status unchanged',
                participant: existingParticipant,
            });
        }

        const updatedParticipant = await prisma.seminarParticipant.update({
            where: {
                id: participants_id,
            },
            data: {
                status: newStatus,
            },
            include: {
                account: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        username: true,
                        email: true,
                    },
                },
                seminar: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        // Log the participant status update action
        await auditLogger.log({
            adminId: req.user?.id,
            action: 'SEMINAR_PARTICIPANT_UPDATE',
            targetType: 'SeminarParticipant',
            targetId: updatedParticipant.id,
            targetName: `${updatedParticipant.account.firstName} ${updatedParticipant.account.lastName}`,
            details: `Updated participant status from "${existingParticipant.status}" to "${newStatus}" for ${updatedParticipant.account.firstName} ${updatedParticipant.account.lastName} in seminar "${updatedParticipant.seminar.title}"`,
            metadata: {
                action: 'participant_status_updated',
                participantId: updatedParticipant.id,
                participantName: `${updatedParticipant.account.firstName} ${updatedParticipant.account.lastName}`,
                participantEmail: updatedParticipant.account.email,
                participantUsername: updatedParticipant.account.username,
                seminarId: updatedParticipant.seminar.id,
                seminarTitle: updatedParticipant.seminar.title,
                previousStatus: existingParticipant.status,
                newStatus: newStatus,
                statusChange: `${existingParticipant.status} → ${newStatus}`,
            },
            req: req,
        });

        return res.status(200).json({
            success: true,
            message: 'Participant status updated successfully',
            participant: updatedParticipant,
        });
    } catch (error) {
        console.error('Error updating participant status:', error);
        return res.status(500).json({
            message: 'Failed to update participant status',
            error: error.message,
        });
    }
}

export default updateParticipant;
