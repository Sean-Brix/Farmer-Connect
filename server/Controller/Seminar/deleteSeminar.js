import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function deleteSeminar(req, res) {
    try {
        const id = req.params.id;

        await prisma.seminarParticipant.deleteMany({
            where: {
                seminar_id: id,
            },
        });

        await prisma.seminar.delete({
            where: {
                id: id,
            },
        });

        res.status(200).json({ message: 'Seminar deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete seminar' });
    }
}

export default deleteSeminar;
