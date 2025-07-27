import { PrismaClient } from '../../prisma/generated/client.js';
import auditLogger from '../../Services/auditLogger.js';

const prisma = new PrismaClient();

async function editSeminar(req, res) {
    try {
        const seminarId = req.params.id;
        const {
            title,
            description,
            location,
            speaker,
            start_date,
            end_date,
            start_time,
            end_time,
            capacity,
            registration_deadline,
            status,
        } = req.body;

        const photo = req.file; // Multer file

        // Validate required fields
        if (!seminarId) {
            return res.status(400).json({
                success: false,
                error: 'Seminar ID is required',
            });
        }

        // Get the current seminar for comparison and audit trail
        const currentSeminar = await prisma.seminar.findUnique({
            where: { id: seminarId },
        });

        if (!currentSeminar) {
            return res.status(404).json({
                success: false,
                error: 'Seminar not found',
            });
        }

        // Prepare update data
        const updateData = {
            title: title?.trim(),
            description: description?.trim(),
            location: location?.trim(),
            speaker: speaker?.trim(),
            start_date: start_date ? new Date(start_date) : undefined,
            end_date: end_date ? new Date(end_date) : undefined,
            start_time,
            end_time,
            capacity: capacity ? parseInt(capacity) : undefined,
            registration_deadline: registration_deadline
                ? new Date(registration_deadline)
                : undefined,
            status,
            updatedAt: new Date(),
        };

        // Add photo if provided
        if (photo) {
            updateData.picture = photo.buffer;
            updateData.mimeType = photo.mimetype;
        }

        // Remove undefined values
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        // Update the seminar
        const updatedSeminar = await prisma.seminar.update({
            where: { id: seminarId },
            data: updateData,
            include: {
                creator: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
            },
        });

        // Track what fields were updated for audit log
        const updatedFields = [];
        if (currentSeminar.title !== updatedSeminar.title)
            updatedFields.push('title');
        if (currentSeminar.description !== updatedSeminar.description)
            updatedFields.push('description');
        if (currentSeminar.location !== updatedSeminar.location)
            updatedFields.push('location');
        if (currentSeminar.speaker !== updatedSeminar.speaker)
            updatedFields.push('speaker');
        if (currentSeminar.capacity !== updatedSeminar.capacity)
            updatedFields.push('capacity');
        if (currentSeminar.status !== updatedSeminar.status)
            updatedFields.push('status');
        if (photo) updatedFields.push('picture');

        // Log the seminar update action
        const auditAction =
            currentSeminar.status !== updatedSeminar.status
                ? 'SEMINAR_STATUS_CHANGE'
                : 'SEMINAR_UPDATE';
        await auditLogger.log({
            adminId: req.user?.id,
            action: auditAction,
            targetType: 'Seminar',
            targetId: updatedSeminar.id,
            targetName: updatedSeminar.title,
            details:
                auditAction === 'SEMINAR_STATUS_CHANGE'
                    ? `Changed seminar status from ${currentSeminar.status} to ${updatedSeminar.status} for "${updatedSeminar.title}"`
                    : `Updated seminar "${updatedSeminar.title}"`,
            metadata: {
                action:
                    auditAction === 'SEMINAR_STATUS_CHANGE'
                        ? 'status_changed'
                        : 'seminar_updated',
                seminarId: updatedSeminar.id,
                updatedFields: updatedFields,
                previousStatus: currentSeminar.status,
                newStatus: updatedSeminar.status,
                hasPhotoUpdate: !!photo,
            },
            req: req,
        });

        return res.status(200).json({
            success: true,
            message: 'Seminar updated successfully',
            data: {
                id: updatedSeminar.id,
                title: updatedSeminar.title,
                description: updatedSeminar.description,
                location: updatedSeminar.location,
                speaker: updatedSeminar.speaker,
                start_date: updatedSeminar.start_date,
                end_date: updatedSeminar.end_date,
                start_time: updatedSeminar.start_time,
                end_time: updatedSeminar.end_time,
                capacity: updatedSeminar.capacity,
                registration_deadline: updatedSeminar.registration_deadline,
                status: updatedSeminar.status,
                creator: updatedSeminar.creator,
                createdAt: updatedSeminar.createdAt,
                updatedAt: updatedSeminar.updatedAt,
            },
        });
    } catch (error) {
        console.error('Error updating seminar:', error);

        // Handle Prisma-specific errors
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                error: 'A seminar with this title already exists',
            });
        }

        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: 'Seminar not found',
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Internal server error while updating seminar',
        });
    }
}

export default editSeminar;
