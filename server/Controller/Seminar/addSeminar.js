import { PrismaClient } from '../../prisma/generated/client.js';
import auditLogger from '../../Services/auditLogger.js';
const prisma = new PrismaClient();

async function addSeminar(req, res) {
    try {
        const adminId = req.user.id;
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
        } = req.body;

        if (
            !title ||
            !description ||
            !location ||
            !speaker ||
            !start_date ||
            !end_date ||
            !start_time ||
            !end_time ||
            !capacity ||
            !registration_deadline
        )
            return res
                .status(400)
                .json({ payload: { Error: 'All parameters are required' } });

        let picture = null;
        let mimeType = null;

        if (req.file) {
            try {
                picture = req.file.buffer;
                mimeType = req.file.mimetype;
            } catch (bufferError) {
                console.error('Error buffering file:', bufferError);
                return res
                    .status(500)
                    .json({ payload: { Error: 'Failed to process file' } });
            }
        }

        const seminar = await prisma.seminar.create({
            data: {
                title,
                description,
                location,
                speaker,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                start_time,
                end_time,
                capacity: parseInt(capacity),
                registration_deadline: new Date(registration_deadline),
                createdById: adminId,
                picture: picture,
                mimeType: mimeType,
            },
        });

        // Log the seminar creation action
        await auditLogger.log({
            adminId: adminId,
            action: 'SEMINAR_CREATE',
            targetType: 'Seminar',
            targetId: seminar.id,
            targetName: seminar.title,
            details: `Created new seminar: ${seminar.title}`,
            metadata: {
                action: 'seminar_created',
                title: seminar.title,
                speaker: seminar.speaker,
                location: seminar.location,
                capacity: seminar.capacity,
                startDate: seminar.start_date,
                endDate: seminar.end_date,
                hasImage: !!picture,
            },
            req: req,
        });

        return res.status(201).json({ payload: seminar });
    } catch (error) {
        console.error('Error creating seminar:', error);
        return res
            .status(500)
            .json({ payload: { Error: 'Failed to create seminar' } });
    }
}

export default addSeminar;
