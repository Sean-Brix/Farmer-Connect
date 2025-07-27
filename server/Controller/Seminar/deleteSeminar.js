import { PrismaClient } from '../../prisma/generated/client.js';
import auditLogger from '../../Services/auditLogger.js';

const prisma = new PrismaClient();

async function deleteSeminar(req, res) {
    try {
        const id = req.params.id;

        // Get seminar details before deletion for audit log
        const seminar = await prisma.seminar.findUnique({
            where: { id: id },
            select: {
                id: true,
                title: true,
                description: true,
                speaker: true,
                status: true,
                start_date: true,
                end_date: true,
                _count: {
                    select: {
                        participants: true,
                    },
                },
            },
        });

        if (!seminar) {
            return res.status(404).json({
                success: false,
                error: 'Seminar not found',
            });
        }

        // Delete seminar participants first (cascade delete)
        await prisma.seminarParticipant.deleteMany({
            where: {
                seminar_id: id,
            },
        });

        // Delete the seminar
        await prisma.seminar.delete({
            where: {
                id: id,
            },
        });

        // Log the seminar deletion action
        await auditLogger.log({
            adminId: req.user?.id,
            action: 'SEMINAR_DELETE',
            targetType: 'Seminar',
            targetId: seminar.id,
            targetName: seminar.title,
            details: `Deleted seminar "${seminar.title}" by ${seminar.speaker}`,
            metadata: {
                action: 'seminar_deleted',
                deletedSeminar: {
                    id: seminar.id,
                    title: seminar.title,
                    speaker: seminar.speaker,
                    status: seminar.status,
                    start_date: seminar.start_date,
                    end_date: seminar.end_date,
                    participantCount: seminar._count.participants,
                },
            },
            req: req,
        });

        res.status(200).json({
            success: true,
            message: 'Seminar deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting seminar:', error);

        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: 'Seminar not found',
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to delete seminar',
        });
    }
}

export default deleteSeminar;
