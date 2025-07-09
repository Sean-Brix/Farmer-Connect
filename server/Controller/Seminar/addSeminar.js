import { PrismaClient } from '../../prisma/generated/client.js';
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
            picture,
            mimeType,
        } = req.body;

        const seminar = await prisma.seminar.create({
            data: {
                title,
                description,
                location,
                speaker,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                start_time: new Date(start_time),
                end_time: new Date(end_time),
                capacity: parseInt(capacity),
                registration_deadline: new Date(registration_deadline),
                picture: picture ? Buffer.from(picture, 'base64') : null,
                mimeType: mimeType || null,
                createdById: adminId,
            },
        });

        return res.status(201).json({ seminar });

    } 
    catch (error) {
        console.error('Error creating seminar:', error);
        return res.status(500).json({ error: 'Failed to create seminar' });
    }
}

export default addSeminar;
